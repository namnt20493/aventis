import { TestManifest, ValidationResult, ValidationError, KnownBugEntry } from "./types.js";

export function validateManifest(manifest: TestManifest): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    const adoIdMap = new Map<number, string[]>();
    for (const test of manifest.tests) {
        if (test.adoId) {
            const existing = adoIdMap.get(test.adoId) || [];
            existing.push(test.specFile);
            adoIdMap.set(test.adoId, existing);
        }
    }

    for (const [adoId, files] of adoIdMap) {
        if (files.length > 1) {
            errors.push({
                level: "error",
                code: "DUPLICATE_ADO_ID",
                message: `ADO ID @[${adoId}] is used in ${files.length} files`,
                details: files.join(", ")
            });
        }
    }

    for (const test of manifest.tests) {
        if (!test.adoId && test.tags.includes("@all")) {
            errors.push({
                level: "error",
                code: "MISSING_ADO_ID",
                message: `Test "${test.testName}" has @all tag but no ADO ID`,
                file: test.specFile
            });
        }

        if (!test.adoId && test.tags.includes("@wip")) {
            warnings.push({
                level: "warning",
                code: "WIP_NO_ADO_ID",
                message: `WIP test "${test.testName}" has no ADO ID`,
                file: test.specFile
            });
        }

        if (test.tags.includes("@all") && !test.tags.includes("@keywordValidation") && !test.tags.includes("@smoke")) {
            warnings.push({
                level: "warning",
                code: "MISSING_KV_TAG",
                message: `Test "${test.testName}" has @all but no @keywordValidation or @smoke tag`,
                file: test.specFile
            });
        }
    }

    const testedKeywords = new Set(manifest.tests.flatMap((t) => t.keywordsUsed));
    for (const kw of manifest.keywords) {
        for (const method of kw.methods) {
            if (!testedKeywords.has(method.name)) {
                warnings.push({
                    level: "warning",
                    code: "KEYWORD_NO_TEST",
                    message: `Keyword "${kw.className}.${method.name}" has no test coverage`,
                    file: kw.file
                });
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

export function formatValidationResult(result: ValidationResult, format: "table" | "json"): string {
    if (format === "json") {
        return JSON.stringify(result, null, 2);
    }

    const lines: string[] = [];
    lines.push("");
    lines.push("=== Validation Result ===");
    lines.push(`Status: ${result.isValid ? "VALID" : "INVALID"}`);
    lines.push(`Errors: ${result.errors.length} | Warnings: ${result.warnings.length}`);
    lines.push("");

    if (result.errors.length > 0) {
        lines.push("--- Errors ---");
        for (const err of result.errors) {
            lines.push(`  [${err.code}] ${err.message}`);
            if (err.file) lines.push(`    File: ${err.file}`);
            if (err.details) lines.push(`    Details: ${err.details}`);
        }
        lines.push("");
    }

    if (result.warnings.length > 0) {
        lines.push("--- Warnings ---");
        for (const warn of result.warnings) {
            lines.push(`  [${warn.code}] ${warn.message}`);
            if (warn.file) lines.push(`    File: ${warn.file}`);
        }
        lines.push("");
    }

    return lines.join("\n");
}

export function formatTestList(manifest: TestManifest, format: "table" | "json", filter?: Record<string, string>): string {
    let tests = manifest.tests;

    if (filter) {
        if (filter.domain) {
            tests = tests.filter((t) => t.domain.toLowerCase() === filter.domain.toLowerCase());
        }
        if (filter.status) {
            tests = tests.filter((t) => t.status === filter.status);
        }
        if (filter.tag) {
            tests = tests.filter((t) => t.tags.includes(filter.tag));
        }
    }

    if (format === "json") {
        return JSON.stringify(tests, null, 2);
    }

    const lines: string[] = [];
    const header = padRow(["Spec File", "Test Name", "ADO ID", "Tags", "Status"]);
    const separator = "-".repeat(header.length);
    lines.push("");
    lines.push(header);
    lines.push(separator);

    for (const test of tests) {
        lines.push(padRow([truncate(test.specFile, 55), truncate(test.testName, 40), test.adoId?.toString() || "-", truncate(test.tags.join(", "), 35), test.status]));
    }

    lines.push(separator);
    lines.push(`Total: ${tests.length} tests`);
    lines.push("");
    return lines.join("\n");
}

export function formatReport(manifest: TestManifest, format: "table" | "json"): string {
    if (format === "json") {
        return JSON.stringify(
            {
                summary: manifest.summary,
                domains: buildDomainReport(manifest),
                actionItems: buildActionItems(manifest)
            },
            null,
            2
        );
    }

    const lines: string[] = [];
    lines.push("");
    lines.push("╔══════════════════════════════════════════════════╗");
    lines.push("║          TEST SYNC REPORT                       ║");
    lines.push("╚══════════════════════════════════════════════════╝");
    lines.push("");

    lines.push("--- Summary ---");
    lines.push(`  Total Tests:        ${manifest.summary.totalTests}`);
    lines.push(`  With ADO ID:        ${manifest.summary.withAdoId}`);
    lines.push(`  Missing ADO ID:     ${manifest.summary.missingAdoId}`);
    lines.push(`  WIP Tests:          ${manifest.summary.wipTests}`);
    lines.push(`  Keyword Classes:    ${manifest.summary.totalKeywords}`);
    lines.push(`  Keyword Methods:    ${manifest.summary.totalKeywordMethods}`);
    const coverage = manifest.summary.totalTests > 0 ? ((manifest.summary.withAdoId / manifest.summary.totalTests) * 100).toFixed(1) : "0.0";
    lines.push(`  ADO Coverage:       ${coverage}%`);
    lines.push("");

    lines.push("--- By Domain ---");
    const domainReport = buildDomainReport(manifest);
    const domainHeader = padRow(["Domain", "Total", "ADO", "Missing", "WIP", "Coverage"], [20, 8, 8, 8, 8, 10]);
    lines.push(domainHeader);
    lines.push("-".repeat(domainHeader.length));
    for (const d of domainReport) {
        lines.push(padRow([d.domain, d.total.toString(), d.withAdoId.toString(), d.missingAdoId.toString(), d.wip.toString(), `${d.coverage}%`], [20, 8, 8, 8, 8, 10]));
    }
    lines.push("");

    const actionItems = buildActionItems(manifest);
    if (actionItems.length > 0) {
        lines.push("--- Action Items ---");
        for (const item of actionItems) {
            lines.push(`  [${item.priority}] ${item.message}`);
        }
        lines.push("");
    }

    lines.push(`Generated: ${manifest.generatedAt}`);
    lines.push("");
    return lines.join("\n");
}

interface DomainReportEntry {
    domain: string;
    total: number;
    withAdoId: number;
    missingAdoId: number;
    wip: number;
    coverage: string;
}

function buildDomainReport(manifest: TestManifest): DomainReportEntry[] {
    const domains = new Map<string, { total: number; withAdoId: number; wip: number }>();

    for (const test of manifest.tests) {
        const d = domains.get(test.domain) || { total: 0, withAdoId: 0, wip: 0 };
        d.total++;
        if (test.adoId) d.withAdoId++;
        if (test.tags.includes("@wip")) d.wip++;
        domains.set(test.domain, d);
    }

    return [...domains.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([domain, data]) => ({
            domain,
            total: data.total,
            withAdoId: data.withAdoId,
            missingAdoId: data.total - data.withAdoId,
            wip: data.wip,
            coverage: data.total > 0 ? ((data.withAdoId / data.total) * 100).toFixed(0) : "0"
        }));
}

interface ActionItem {
    priority: "HIGH" | "MEDIUM" | "LOW";
    message: string;
}

function buildActionItems(manifest: TestManifest): ActionItem[] {
    const items: ActionItem[] = [];

    const missingAllTests = manifest.tests.filter((t) => !t.adoId && t.tags.includes("@all"));
    if (missingAllTests.length > 0) {
        items.push({
            priority: "HIGH",
            message: `${missingAllTests.length} @all tests missing ADO IDs. Run: npm run azure:create-missing`
        });
    }

    const adoIdMap = new Map<number, string[]>();
    for (const test of manifest.tests) {
        if (test.adoId) {
            const existing = adoIdMap.get(test.adoId) || [];
            existing.push(test.specFile);
            adoIdMap.set(test.adoId, existing);
        }
    }
    for (const [id, files] of adoIdMap) {
        if (files.length > 1) {
            items.push({
                priority: "HIGH",
                message: `Duplicate ADO ID @[${id}] in: ${files.join(", ")}`
            });
        }
    }

    const wipTests = manifest.tests.filter((t) => t.tags.includes("@wip"));
    if (wipTests.length > 0) {
        items.push({
            priority: "MEDIUM",
            message: `${wipTests.length} WIP tests need completion: ${wipTests.map((t) => t.testName).join(", ")}`
        });
    }

    const testedKeywords = new Set(manifest.tests.flatMap((t) => t.keywordsUsed));
    let untestedCount = 0;
    for (const kw of manifest.keywords) {
        for (const method of kw.methods) {
            if (!testedKeywords.has(method.name)) untestedCount++;
        }
    }
    if (untestedCount > 0) {
        items.push({
            priority: "LOW",
            message: `${untestedCount} keyword methods without test coverage`
        });
    }

    return items;
}

function padRow(cols: string[], widths?: number[]): string {
    const defaultWidths = [57, 42, 10, 37, 16];
    const w = widths || defaultWidths;
    return cols.map((col, i) => col.padEnd(w[i] || 20)).join(" | ");
}

function truncate(str: string, maxLen: number): string {
    return str.length > maxLen ? str.slice(0, maxLen - 3) + "..." : str;
}

export function buildKnownBugsReport(manifest: TestManifest): KnownBugEntry[] {
    const bugMap = new Map<number, KnownBugEntry>();

    for (const test of manifest.tests) {
        const annotations = test.annotations || [];
        for (const annotation of annotations) {
            if (annotation.type === "known-bug" && annotation.bugId) {
                const existing = bugMap.get(annotation.bugId);
                const testInfo = {
                    testName: test.testName,
                    specFile: test.specFile,
                    adoId: test.adoId
                };

                if (existing) {
                    existing.affectedTests.push(testInfo);
                } else {
                    bugMap.set(annotation.bugId, {
                        bugId: annotation.bugId,
                        bugUrl: annotation.description,
                        affectedTests: [testInfo]
                    });
                }
            }
        }
    }

    return [...bugMap.values()].sort((a, b) => b.affectedTests.length - a.affectedTests.length);
}

export function formatKnownBugsReport(manifest: TestManifest, format: "table" | "json"): string {
    const bugs = buildKnownBugsReport(manifest);

    if (format === "json") {
        return JSON.stringify(
            {
                totalBugs: bugs.length,
                totalAffectedTests: bugs.reduce((sum, b) => sum + b.affectedTests.length, 0),
                bugs
            },
            null,
            2
        );
    }

    const lines: string[] = [];
    lines.push("");
    lines.push("╔══════════════════════════════════════════════════╗");
    lines.push("║          KNOWN BUGS REPORT                      ║");
    lines.push("╚══════════════════════════════════════════════════╝");
    lines.push("");

    if (bugs.length === 0) {
        lines.push("  No known bugs found. All tests are healthy!");
        lines.push("");
        return lines.join("\n");
    }

    const totalAffected = bugs.reduce((sum, b) => sum + b.affectedTests.length, 0);
    lines.push(`  Total bugs:          ${bugs.length}`);
    lines.push(`  Affected tests:      ${totalAffected}`);
    lines.push("");

    for (const bug of bugs) {
        lines.push(`Bug #${bug.bugId} - ${bug.affectedTests.length} test(s) affected:`);
        lines.push(`  ${bug.bugUrl}`);
        for (const test of bug.affectedTests) {
            const adoInfo = test.adoId ? `(ADO #${test.adoId})` : "(no ADO ID)";
            lines.push(`    - ${test.testName} ${adoInfo}`);
        }
        lines.push("");
    }

    lines.push("─".repeat(50));
    lines.push(`To clean up after bug fix: search for "known-bug" and bug ID in codebase`);
    lines.push("");

    return lines.join("\n");
}
