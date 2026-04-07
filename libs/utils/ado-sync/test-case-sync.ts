import * as fs from "node:fs";
import * as path from "node:path";
import { AdoClient } from "./ado-client.js";
import { TestManifest, TestEntry, SyncResult, SyncResultEntry, AdoTestCase, TestType } from "./types.js";

function formatTestCaseTitle(testName: string, testType: TestType): string {
    switch (testType) {
        case "journey":
            return `JourneyTest: ${testName}`;
        case "acceptance":
            return `AcceptanceTest: ${testName}`;
        case "keywordvalidation":
        default:
            return `KeywordValidationTest: ${testName}`;
    }
}

function formatTestCaseTags(testType: TestType): string {
    switch (testType) {
        case "journey":
            return "Journey;Automation";
        case "acceptance":
            return "Acceptance;Automation";
        case "keywordvalidation":
        default:
            return "KeyWordValidation;Automation";
    }
}

export async function createMissingTestCases(
    manifest: TestManifest,
    client: AdoClient,
    options: { dryRun: boolean; writeBack: boolean; includeWip: boolean }
): Promise<SyncResult> {
    const result: SyncResult = { created: 0, updated: 0, skipped: 0, errors: [], entries: [] };

    const candidates = manifest.tests.filter(t => {
        if (t.adoId) return false;
        if (!options.includeWip && t.tags.includes("@wip")) return false;
        return true;
    });

    if (candidates.length === 0) {
        console.log("No tests need ADO IDs.");
        return result;
    }

    console.log(`Found ${candidates.length} tests without ADO IDs.`);

    const byType: Record<TestType, TestEntry[]> = {
        keywordvalidation: [],
        journey: [],
        acceptance: []
    };

    for (const test of candidates) {
        byType[test.testType].push(test);
    }

    for (const testType of Object.keys(byType) as TestType[]) {
        const testsOfType = byType[testType];
        if (testsOfType.length === 0) continue;

        console.log(`\nProcessing ${testsOfType.length} ${testType} tests...`);
        const typeClient = AdoClient.fromEnv(testType);

        for (const test of testsOfType) {
            try {
                if (options.dryRun) {
                    const title = formatTestCaseTitle(test.testName, test.testType);
                    console.log(`[DRY RUN] Would create: ${title}`);
                    result.entries.push({
                        testName: test.testName,
                        action: "skipped",
                        message: "Dry run"
                    });
                    result.skipped++;
                    continue;
                }

                const title = formatTestCaseTitle(test.testName, test.testType);
                const tags = formatTestCaseTags(test.testType);

                const steps = test.steps.map(s => ({
                    action: s.fullDescription,
                    expected: `${s.keyword} executed successfully`
                }));

                if (steps.length === 0) {
                    steps.push({ action: test.testName, expected: "Test completes successfully" });
                }

                const adoId = await typeClient.createTestCase(title, steps, tags);
                console.log(`Created ADO test case #${adoId}: ${title}`);

                const addResult = await typeClient.addTestCaseToSuite(adoId);
                if (addResult.added) {
                    console.log(`Added #${adoId} to suite`);
                } else {
                    console.log(`Skipped suite add for #${adoId}: ${addResult.reason}`);
                }

                if (options.writeBack) {
                    writeBackAdoId(test.specFile, adoId);
                    console.log(`Wrote @[${adoId}] back to ${test.specFile}`);
                }

                result.entries.push({ testName: test.testName, action: "created", adoId });
                result.created++;
            } catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                console.error(`Failed to create ADO case for "${test.testName}": ${message}`);
                result.entries.push({ testName: test.testName, action: "error", message });
                result.errors.push({ testName: test.testName, action: "error", message });
            }
        }
    }

    return result;
}

export async function updateTestCaseComments(
    manifest: TestManifest,
    client: AdoClient,
    options: { dryRun: boolean }
): Promise<SyncResult> {
    const result: SyncResult = { created: 0, updated: 0, skipped: 0, errors: [], entries: [] };

    const syncedTests = manifest.tests.filter(t => t.adoId);

    if (syncedTests.length === 0) {
        console.log("No synced tests to update.");
        return result;
    }

    console.log(`Checking ${syncedTests.length} synced tests for step updates...`);

    const byType: Record<TestType, TestEntry[]> = {
        keywordvalidation: [],
        journey: [],
        acceptance: []
    };

    for (const test of syncedTests) {
        byType[test.testType].push(test);
    }

    for (const testType of Object.keys(byType) as TestType[]) {
        const testsOfType = byType[testType];
        if (testsOfType.length === 0) continue;

        console.log(`\nChecking ${testsOfType.length} ${testType} tests...`);
        const typeClient = AdoClient.fromEnv(testType);

        for (const test of testsOfType) {
            try {
                const adoCase = await typeClient.getWorkItem(test.adoId!);

                const localSteps = test.steps.map(s => s.fullDescription);
                const adoSteps = adoCase.steps.map(s => s.action);

                if (arraysEqual(localSteps, adoSteps)) {
                    result.skipped++;
                    continue;
                }

                if (options.dryRun) {
                    console.log(`[DRY RUN] Would update steps for #${test.adoId}: ${test.testName}`);
                    console.log(`  Local steps:  ${localSteps.join(" -> ")}`);
                    console.log(`  ADO steps:    ${adoSteps.join(" -> ")}`);
                    result.entries.push({ testName: test.testName, action: "skipped", message: "Dry run" });
                    result.skipped++;
                    continue;
                }

                const steps = test.steps.map(s => ({
                    action: s.fullDescription,
                    expected: `${s.keyword} executed successfully`
                }));

                await typeClient.updateTestCaseSteps(test.adoId!, steps);
                console.log(`Updated steps for #${test.adoId}: ${test.testName}`);
                result.entries.push({ testName: test.testName, action: "updated", adoId: test.adoId! });
                result.updated++;
            } catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                if (message.includes("404") || message.includes("does not exist")) {
                    console.warn(`Skipped #${test.adoId} "${test.testName}": work item not found (deleted or no access)`);
                } else {
                    console.error(`Failed to update #${test.adoId} "${test.testName}": ${message}`);
                }
                result.entries.push({ testName: test.testName, action: "error", message });
                result.errors.push({ testName: test.testName, action: "error", message });
            }
        }
    }

    return result;
}

export async function syncWithAdo(
    manifest: TestManifest,
    client: AdoClient
): Promise<{ manifest: TestManifest; adoOnlyCount: number }> {
    const adoTestCases = await client.getTestCasesInSuite();
    console.log(`Fetched ${adoTestCases.length} test cases from ADO suite.`);

    const adoIdSet = new Set(adoTestCases.map(tc => tc.id));
    const localAdoIds = new Set(manifest.tests.filter(t => t.adoId).map(t => t.adoId!));

    for (const test of manifest.tests) {
        if (test.adoId && adoIdSet.has(test.adoId)) {
            test.status = "synced";
        } else if (test.adoId && !adoIdSet.has(test.adoId)) {
            test.status = "drifted";
        }
    }

    let adoOnlyCount = 0;
    for (const adoCase of adoTestCases) {
        if (!localAdoIds.has(adoCase.id)) {
            adoOnlyCount++;
        }
    }

    return { manifest, adoOnlyCount };
}

function writeBackAdoId(specFile: string, adoId: number): void {
    const absPath = path.resolve(specFile);
    let content = fs.readFileSync(absPath, "utf-8");

    const tagMatch = content.match(/tag:\s*\[([^\]]*)\]/);
    if (!tagMatch) {
        console.warn(`Could not find tag array in ${specFile}. Skipping write-back.`);
        return;
    }

    const existingTags = tagMatch[1];
    const adoTag = `"@[${adoId}]"`;

    if (existingTags.includes(`@[${adoId}]`)) return;

    const newTags = existingTags.trim()
        ? `${adoTag}, ${existingTags.trim()}`
        : adoTag;

    content = content.replace(
        /tag:\s*\[([^\]]*)\]/,
        `tag: [${newTags}]`
    );

    fs.writeFileSync(absPath, content, "utf-8");
}

function arraysEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((val, i) => val === b[i]);
}
