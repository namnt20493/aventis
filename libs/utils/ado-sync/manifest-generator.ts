import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";
import { extractAllKeywords } from "./keyword-extractor.js";
import { TestManifest, TestEntry, TestStepEntry, KeywordEntry, ManifestConfig, ManifestSummary, TestType, TestAnnotation } from "./types.js";

function detectTestType(specFile: string): TestType {
    const normalized = specFile.replace(/\\/g, "/");
    if (normalized.includes("staticTestcases/Keywordvalidation")) return "keywordvalidation";
    if (normalized.includes("staticTestcases/Journeytest")) return "journey";
    if (normalized.includes("staticTestcases/Acceptance")) return "acceptance";
    return "keywordvalidation";
}

interface KeywordCall {
    methodName: string;
    parameters?: string;
}

const PLAYWRIGHT_OBJECTS = new Set(["page", "context", "request", "browser", "browserContext", "frame", "locator", "authenticatedRequest"]);

function detectKeywordVariables(content: string): Set<string> {
    const vars = new Set<string>();
    const declRegex = /(?:var|let|const)\s+(\w+)\s*=\s*new\s+\w*Keyword/g;
    let match: RegExpExecArray | null;
    while ((match = declRegex.exec(content)) !== null) {
        vars.add(match[1]);
    }
    return vars;
}

function parseParameterObject(paramBlock: string): string {
    const params: string[] = [];

    const paramRegex = /(\w+):\s*([^,\n}]+)/g;
    let match: RegExpExecArray | null;

    while ((match = paramRegex.exec(paramBlock)) !== null) {
        const key = match[1];
        let value = match[2].trim();

        if (value.length > 50) {
            value = value.substring(0, 47) + "...";
        }

        value = value.replace(/^["']|["']$/g, "");

        params.push(`${key}: ${value}`);
    }

    return params.join(", ");
}

function formatPositionalParams(argsString: string): string {
    const args = splitTopLevelArgs(argsString);
    return args
        .map((a) => a.trim())
        .filter((a) => a.length > 0)
        .map((a) => {
            if (a.length > 50) return a.substring(0, 47) + "...";
            return a.replace(/^["']|["']$/g, "");
        })
        .join(", ");
}

function splitTopLevelArgs(str: string): string[] {
    const args: string[] = [];
    let depth = 0;
    let current = "";
    for (const ch of str) {
        if (ch === "(" || ch === "{" || ch === "[") depth++;
        else if (ch === ")" || ch === "}" || ch === "]") depth--;

        if (ch === "," && depth === 0) {
            args.push(current);
            current = "";
        } else {
            current += ch;
        }
    }
    if (current.trim()) args.push(current);
    return args;
}

function extractKeywordCall(stepBody: string, keywordVars: Set<string>): KeywordCall | null {
    const callRegex = /await\s+(\w+)\.([\w_]+)\s*\(/g;
    let match: RegExpExecArray | null;

    while ((match = callRegex.exec(stepBody)) !== null) {
        const varName = match[1];
        const methodName = match[2];

        if (PLAYWRIGHT_OBJECTS.has(varName) && !keywordVars.has(varName)) continue;

        const callStart = match.index + match[0].length;
        const argsString = extractBalancedContent(stepBody, callStart, "(", ")");
        if (argsString === null) continue;

        const trimmed = argsString.trim();
        if (trimmed === "") {
            return { methodName };
        }

        if (trimmed.startsWith("{")) {
            const parameters = parseParameterObject(trimmed);
            return { methodName, parameters: parameters || undefined };
        }

        const parameters = formatPositionalParams(trimmed);
        return { methodName, parameters: parameters || undefined };
    }

    return null;
}

function extractBalancedContent(str: string, startIdx: number, open: string, close: string): string | null {
    let depth = 1;
    let i = startIdx;
    while (i < str.length && depth > 0) {
        if (str[i] === open) depth++;
        else if (str[i] === close) depth--;
        if (depth > 0) i++;
    }
    if (depth !== 0) return null;
    return str.substring(startIdx, i);
}

function extractStepBody(content: string, openBraceIdx: number): string | null {
    let depth = 1;
    let i = openBraceIdx + 1;
    while (i < content.length && depth > 0) {
        if (content[i] === "{") depth++;
        else if (content[i] === "}") depth--;
        if (depth > 0) i++;
    }
    if (depth !== 0) return null;
    return content.substring(openBraceIdx + 1, i);
}

function extractTestStepsWithParameters(content: string): TestStepEntry[] {
    const steps: TestStepEntry[] = [];
    const keywordVars = detectKeywordVariables(content);

    const stepStartRegex = /test\.step\(\s*["'`]([^"'`]+)["'`]\s*,\s*async\s*\(\)\s*=>\s*\{/g;

    let match: RegExpExecArray | null;
    while ((match = stepStartRegex.exec(content)) !== null) {
        const stepName = match[1];
        const openBraceIdx = match.index + match[0].length - 1;

        const stepBody = extractStepBody(content, openBraceIdx);
        if (!stepBody) continue;

        const keywordCall = extractKeywordCall(stepBody, keywordVars);

        if (keywordCall) {
            const fullDescription = keywordCall.parameters ? `${keywordCall.methodName} | ${keywordCall.parameters}` : keywordCall.methodName;

            steps.push({
                name: stepName,
                keyword: keywordCall.methodName,
                parameters: keywordCall.parameters,
                fullDescription
            });
        } else {
            steps.push({
                name: stepName,
                keyword: stepName.replace(/\s*-\s*.*$/, "").trim(),
                fullDescription: stepName
            });
        }
    }

    return steps;
}

const DEFAULT_TEST_DIRS = ["staticTestcases/Keywordvalidation", "staticTestcases/Journeytest", "staticTestcases/Acceptance"];
const DEFAULT_KEYWORD_DIRS = ["libs/keywords"];
const ADO_PLAN_ID = 181204;
const ADO_SUITE_ID = 181205;
const MANIFEST_VERSION = "1.0.0";
const EXCLUDED_TAGS = ["@demo", "@debug"];

export function generateManifest(options?: { testDirs?: string[]; keywordDirs?: string[]; includeWip?: boolean }): TestManifest {
    const testDirs = options?.testDirs ?? DEFAULT_TEST_DIRS;
    const keywordDirs = options?.keywordDirs ?? DEFAULT_KEYWORD_DIRS;
    const includeWip = options?.includeWip ?? true;

    const config: ManifestConfig = {
        testDirs,
        keywordDirs,
        generatedBy: "azure-test-sync-cli",
        adoPlanId: parseInt(process.env.AZURE_DEVOPS_KV_PLAN_ID || "181204", 10),
        adoSuiteId: parseInt(process.env.AZURE_DEVOPS_KV_SUITE_ID || "181205", 10),
        adoKvPlanId: parseInt(process.env.AZURE_DEVOPS_KV_PLAN_ID || "181204", 10),
        adoKvSuiteId: parseInt(process.env.AZURE_DEVOPS_KV_SUITE_ID || "181205", 10),
        adoJtPlanId: parseInt(process.env.AZURE_DEVOPS_JT_PLAN_ID || "183831", 10),
        adoJtSuiteId: parseInt(process.env.AZURE_DEVOPS_JT_SUITE_ID || "183879", 10),
        adoAtPlanId: parseInt(process.env.AZURE_DEVOPS_AT_PLAN_ID || "183595", 10),
        adoAtSuiteId: parseInt(process.env.AZURE_DEVOPS_AT_SUITE_ID || "183597", 10)
    };

    const keywords = keywordDirs.flatMap((dir) => extractAllKeywords(dir));
    const allMethodNames = new Set(keywords.flatMap((k) => k.methods.map((m) => m.name)));

    const tests: TestEntry[] = [];
    for (const dir of testDirs) {
        const specFiles = findSpecFiles(dir);
        for (const specFile of specFiles) {
            const entry = parseSpecFile(specFile, allMethodNames);
            if (entry) {
                entry.testType = detectTestType(specFile);

                if (!includeWip && entry.tags.includes("@wip")) continue;
                if (entry.tags.some((t) => EXCLUDED_TAGS.includes(t))) continue;
                tests.push(entry);
            }
        }
    }

    const summary = buildSummary(tests, keywords);

    return {
        version: MANIFEST_VERSION,
        generatedAt: new Date().toISOString(),
        config,
        tests,
        keywords,
        summary
    };
}

function findSpecFiles(dir: string): string[] {
    const absDir = path.resolve(dir);
    if (!fs.existsSync(absDir)) return [];

    const results: string[] = [];
    walkDir(absDir, results);
    return results.sort();
}

function walkDir(dir: string, results: string[]) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkDir(fullPath, results);
        } else if (entry.name.endsWith(".spec.ts")) {
            results.push(path.relative(process.cwd(), fullPath).replace(/\\/g, "/"));
        }
    }
}

export function parseSpecFile(specFile: string, allMethodNames: Set<string>): TestEntry | null {
    const absPath = path.resolve(specFile);
    if (!fs.existsSync(absPath)) return null;

    const content = fs.readFileSync(absPath, "utf-8");
    const hash = crypto.createHash("sha256").update(content).digest("hex").slice(0, 16);

    const testName = extractTestName(content);
    if (!testName) return null;

    const adoId = extractAdoId(content);
    const tags = extractTags(content);
    const annotations = extractAnnotations(content);
    const domain = extractDomain(specFile);
    const steps = extractTestStepsWithParameters(content);
    const keywordsUsed = extractKeywordsUsed(content, allMethodNames);
    const status = adoId ? "synced" : "missing-ado-id";

    return {
        specFile,
        testName,
        adoId,
        tags,
        domain,
        steps,
        keywordsUsed,
        status,
        hash,
        testType: "keywordvalidation",
        annotations
    };
}

function extractTestName(content: string): string | null {
    const match = content.match(/test\(\s*["'`]([^"'`]+)["'`]/);
    return match?.[1] ?? null;
}

function extractAdoId(content: string): number | null {
    const match = content.match(/@\[(\d+)\]/);
    return match ? parseInt(match[1], 10) : null;
}

function extractTags(content: string): string[] {
    const tagBlockMatch = content.match(/tag:\s*\[([^\]]+)\]/);
    if (!tagBlockMatch) return [];

    const tagString = tagBlockMatch[1];
    const tags: string[] = [];
    const tagRegex = /["'`](@[^"'`]+)["'`]/g;
    let match: RegExpExecArray | null;
    while ((match = tagRegex.exec(tagString)) !== null) {
        tags.push(match[1]);
    }
    return tags;
}

function extractAnnotations(content: string): TestAnnotation[] {
    const annotations: TestAnnotation[] = [];
    const annotationRegex = /annotation:\s*\{\s*type:\s*["'`]([^"'`]+)["'`]\s*,\s*description:\s*["'`]([^"'`]+)["'`]\s*\}/g;
    let match: RegExpExecArray | null;

    while ((match = annotationRegex.exec(content)) !== null) {
        const type = match[1];
        const description = match[2];
        const annotation: TestAnnotation = { type, description };

        if (type === "known-bug") {
            const bugIdMatch = description.match(/workitems\/edit\/(\d+)/);
            if (bugIdMatch) {
                annotation.bugId = parseInt(bugIdMatch[1], 10);
            }
        }

        annotations.push(annotation);
    }

    return annotations;
}

function extractDomain(specFile: string): string {
    const normalized = specFile.replace(/\\/g, "/");
    const parts = normalized.split("/");

    const kvIndex = parts.indexOf("Keywordvalidation");
    if (kvIndex >= 0 && kvIndex + 1 < parts.length) {
        return parts[kvIndex + 1];
    }

    const smokeIndex = parts.indexOf("Smoke");
    if (smokeIndex >= 0) return "Smoke";

    const staticIndex = parts.indexOf("staticTestcases");
    if (staticIndex >= 0 && staticIndex + 1 < parts.length) {
        return parts[staticIndex + 1];
    }

    return "Unknown";
}

function extractKeywordsUsed(content: string, allMethodNames: Set<string>): string[] {
    const used = new Set<string>();

    for (const methodName of allMethodNames) {
        const escaped = methodName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`\\.${escaped}\\s*\\(`, "g");
        if (regex.test(content)) {
            used.add(methodName);
        }
    }

    const workflowPatterns = ["generateDossierViaApi", "createDossierViaApiOnly", "addZahlungsVerbindung", "createBedarfspruefungViaApi", "createErwerbssituationViaApi", "setBewilligungsworkflowStepViaApi", "generateDossierWithErwerbssituationAndWsh", "createDossierViaApiOnlyWithPaymentConnection", "quickCreateDossier"];

    for (const pattern of workflowPatterns) {
        if (content.includes(pattern)) {
            used.add(pattern);
        }
    }

    return [...used].sort();
}

function buildSummary(tests: TestEntry[], keywords: KeywordEntry[]): ManifestSummary {
    const domains: Record<string, number> = {};
    const byTestType: Record<TestType, number> = {
        keywordvalidation: 0,
        journey: 0,
        acceptance: 0
    };
    let withAdoId = 0;
    let missingAdoId = 0;
    let wipTests = 0;
    let knownBugsCount = 0;

    for (const test of tests) {
        if (test.adoId) withAdoId++;
        else missingAdoId++;

        if (test.tags.includes("@wip")) wipTests++;

        if (test.annotations.some((a) => a.type === "known-bug")) knownBugsCount++;

        domains[test.domain] = (domains[test.domain] || 0) + 1;
        byTestType[test.testType]++;
    }

    return {
        totalTests: tests.length,
        withAdoId,
        missingAdoId,
        wipTests,
        knownBugsCount,
        totalKeywords: keywords.length,
        totalKeywordMethods: keywords.reduce((sum, k) => sum + k.methods.length, 0),
        domains,
        byTestType
    };
}

export function writeManifest(manifest: TestManifest, outputPath: string = "test-manifest.json") {
    fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2) + "\n", "utf-8");
}

export function readManifest(inputPath: string = "test-manifest.json"): TestManifest | null {
    const absPath = path.resolve(inputPath);
    if (!fs.existsSync(absPath)) return null;
    const content = fs.readFileSync(absPath, "utf-8");
    return JSON.parse(content) as TestManifest;
}
