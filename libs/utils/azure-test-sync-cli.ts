import * as dotenv from "dotenv";
import { generateManifest, writeManifest, readManifest } from "./ado-sync/manifest-generator.js";
import { validateManifest, formatValidationResult, formatTestList, formatReport, formatKnownBugsReport } from "./ado-sync/report-generator.js";
import { AdoClient } from "./ado-sync/ado-client.js";
import { createMissingTestCases, updateTestCaseComments, syncWithAdo } from "./ado-sync/test-case-sync.js";
import { DomainSyncClient } from "./ado-sync/domain-sync.js";
import { groupEpicsByDomain, generateDomainMarkdown, writeDomainFiles } from "./ado-sync/domain-formatter.js";
import type { CliOptions } from "./ado-sync/types.js";
import type { DomainSyncResult } from "./ado-sync/domain-types.js";

dotenv.config();

const MANIFEST_PATH = "test-manifest.json";

const DEFAULT_SYNC_DIRS = ["staticTestcases/Keywordvalidation", "staticTestcases/Journeytest", "staticTestcases/Acceptance"];

function parseArgs(args: string[]): CliOptions {
    const command = args[0] || "help";
    const options: CliOptions = {
        command,
        dryRun: false,
        writeBack: command === "create-missing",
        includeWip: false,
        testDir: "",
        format: "table",
        filter: {},
        verbose: false
    };

    for (let i = 1; i < args.length; i++) {
        const arg = args[i];
        switch (arg) {
            case "--dry-run":
                options.dryRun = true;
                break;
            case "--write-back":
                options.writeBack = true;
                break;
            case "--no-write-back":
                options.writeBack = false;
                break;
            case "--include-wip":
                options.includeWip = true;
                break;
            case "--format":
                options.format = (args[++i] as "json" | "table") || "table";
                break;
            case "--test-dir":
                options.testDir = args[++i] || "staticTestcases";
                break;
            case "--filter": {
                const filterStr = args[++i] || "";
                const [key, value] = filterStr.split("=");
                if (key && value) options.filter[key] = value;
                break;
            }
            case "--verbose":
                options.verbose = true;
                break;
            case "--include-closed":
                options.includeWip = true;
                break;
        }
    }

    return options;
}

function showHelp() {
    console.log(`
azure-test-sync-cli - Sync Playwright tests with Azure DevOps

COMMANDS:
  sync              Generate test-manifest.json from spec files + keywords
  validate          Validate manifest (missing IDs, duplicates, coverage)
  list              List all tests with ADO ID status
  report            Generate coverage report by domain
  known-bugs        List tests blocked by known bugs (from annotations)
  create-missing    Create ADO test cases for tests without IDs (needs token)
  update-comments   Update ADO test steps from spec files (needs token)
  sync-domain       READ-ONLY: Fetch Epics + Features from ADO into knowledge base
  help              Show this help

FLAGS:
  --dry-run         Preview changes without writing
  --write-back      Write ADO IDs back to spec files (default for create-missing)
  --no-write-back   Disable write-back
  --include-wip     Include @wip tests
  --test-dir <dir>  Test directory to scan (default: staticTestcases)
  --format <fmt>    Output format: table | json (default: table)
  --filter <k=v>    Filter list (domain=X, status=X, tag=@X)
  --verbose         Detailed logging

EXAMPLES:
  npm run azure:sync                                    # Generate manifest
  npm run azure:validate                                # Check for issues
  npm run azure:list -- --filter status=missing-ado-id  # Show tests without ADO ID
  npm run azure:report -- --format json                 # JSON report
  npm run azure:known-bugs                              # Show tests with known bugs
  npm run azure:create-missing -- --dry-run             # Preview ADO creation
  npm run azure:create-missing                          # Create + write-back IDs
  npm run azure:sync-domain                             # Fetch Epics into KB (read-only)
  npm run azure:sync-domain -- --dry-run                # Preview without writing files
  npm run azure:sync-domain -- --include-closed         # Include closed Epics

ENVIRONMENT:
  AZURE_DEVOPS_TOKEN       Personal Access Token for ADO API
  AZURE_DEVOPS_ORG_URL     Organization URL (default: https://diartis.visualstudio.com)
  AZURE_DEVOPS_PROJECT     Project name (default: Aventis)
  AZURE_DEVOPS_KV_PLAN_ID  Keyword Validation Test Plan ID (default: 181204)
  AZURE_DEVOPS_KV_SUITE_ID Keyword Validation Test Suite ID (default: 181205)
  AZURE_DEVOPS_JT_PLAN_ID  Journey Test Plan ID (default: 183831)
  AZURE_DEVOPS_JT_SUITE_ID Journey Test Suite ID (default: 183879)
  AZURE_DEVOPS_AT_PLAN_ID  Acceptance Test Plan ID (default: 183595)
  AZURE_DEVOPS_AT_SUITE_ID Acceptance Test Suite ID (default: 183597)
`);
}

async function cmdSync(options: CliOptions) {
    console.log("Generating test manifest...");
    const testDirs = options.testDir ? [options.testDir] : DEFAULT_SYNC_DIRS;
    const manifest = generateManifest({
        testDirs,
        includeWip: true
    });

    const hasToken = !!(process.env.AZURE_DEVOPS_TOKEN || process.env.AZURE_TOKEN || process.env.SYSTEM_ACCESSTOKEN);
    if (hasToken) {
        try {
            console.log("ADO token found. Syncing with Azure DevOps...");
            const client = AdoClient.fromEnv();
            const { manifest: synced, adoOnlyCount } = await syncWithAdo(manifest, client);
            writeManifest(synced, MANIFEST_PATH);
            console.log(`Manifest written to ${MANIFEST_PATH}`);
            console.log(`  Tests: ${synced.summary.totalTests} | ADO-only: ${adoOnlyCount}`);
        } catch (err) {
            console.warn(`ADO sync failed, writing local-only manifest: ${err instanceof Error ? err.message : err}`);
            writeManifest(manifest, MANIFEST_PATH);
        }
    } else {
        writeManifest(manifest, MANIFEST_PATH);
        console.log(`Manifest written to ${MANIFEST_PATH} (local-only, no ADO token)`);
    }

    console.log(`  Total tests:     ${manifest.summary.totalTests}`);
    console.log(`  With ADO ID:     ${manifest.summary.withAdoId}`);
    console.log(`  Missing ADO ID:  ${manifest.summary.missingAdoId}`);
    console.log(`  Keyword classes: ${manifest.summary.totalKeywords}`);
    console.log(`  Keyword methods: ${manifest.summary.totalKeywordMethods}`);
}

function cmdValidate(options: CliOptions) {
    const manifest = loadOrGenerate(options);
    const result = validateManifest(manifest);
    console.log(formatValidationResult(result, options.format));
    process.exit(result.isValid ? 0 : 1);
}

function cmdList(options: CliOptions) {
    const manifest = loadOrGenerate(options);
    console.log(formatTestList(manifest, options.format, options.filter));
}

function cmdReport(options: CliOptions) {
    const manifest = loadOrGenerate(options);
    console.log(formatReport(manifest, options.format));
}

async function cmdCreateMissing(options: CliOptions) {
    const manifest = loadOrGenerate(options);
    const client = AdoClient.fromEnv();
    const result = await createMissingTestCases(manifest, client, {
        dryRun: options.dryRun,
        writeBack: options.writeBack,
        includeWip: options.includeWip
    });

    console.log("\n--- Create Missing Result ---");
    console.log(`  Created: ${result.created}`);
    console.log(`  Skipped: ${result.skipped}`);
    console.log(`  Errors:  ${result.errors.length}`);

    if (result.created > 0 && !options.dryRun) {
        console.log("\nRe-generating manifest with new IDs...");
        const testDirs = options.testDir ? [options.testDir] : DEFAULT_SYNC_DIRS;
        const updated = generateManifest({ testDirs, includeWip: true });
        writeManifest(updated, MANIFEST_PATH);
    }

    if (options.format === "json") {
        console.log(JSON.stringify(result, null, 2));
    }
}

async function cmdUpdateComments(options: CliOptions) {
    const manifest = loadOrGenerate(options);
    const client = AdoClient.fromEnv();
    const result = await updateTestCaseComments(manifest, client, { dryRun: options.dryRun });

    console.log("\n--- Update Comments Result ---");
    console.log(`  Updated: ${result.updated}`);
    console.log(`  Skipped: ${result.skipped}`);
    console.log(`  Errors:  ${result.errors.length}`);

    if (options.format === "json") {
        console.log(JSON.stringify(result, null, 2));
    }
}

async function cmdSyncDomain(options: CliOptions) {
    const outputDir = "knowledge-base/02-Domain/epics";
    const activeOnly = !options.includeWip;

    console.log("=== ADO Domain Sync (READ-ONLY) ===");
    console.log(`  Mode: ${options.dryRun ? "DRY RUN" : "WRITE"}`);
    console.log(`  Filter: ${activeOnly ? "Active epics only" : "All epics (incl. closed)"}`);
    console.log(`  Output: ${outputDir}/`);
    console.log("");

    const client = DomainSyncClient.fromEnv();

    console.log("Fetching Epics from ADO (read-only)...");
    const epics = await client.fetchAllEpics(activeOnly, options.verbose);
    console.log(`  Found ${epics.length} epics`);

    if (epics.length === 0) {
        console.log("No epics found. Nothing to sync.");
        return;
    }

    console.log("Fetching child Features (read-only)...");
    await client.fetchFeaturesForEpics(epics, options.verbose);
    const totalFeatures = epics.reduce((sum, e) => sum + e.features.length, 0);
    console.log(`  Found ${totalFeatures} features across all epics`);

    console.log("Grouping by domain...");
    const { domains, unmapped } = groupEpicsByDomain(epics);

    const result: DomainSyncResult = {
        syncedAt: new Date().toISOString(),
        totalEpics: epics.length,
        totalFeatures: totalFeatures,
        domains,
        unmapped
    };

    console.log("");
    console.log("Domain mapping:");
    for (const domain of domains) {
        const fCount = domain.epics.reduce((s, e) => s + e.features.length, 0);
        console.log(`  ${domain.domainLabel}: ${domain.epics.length} epics, ${fCount} features`);
    }
    if (unmapped.length > 0) {
        console.log(`  Sonstige (unmapped): ${unmapped.length} epics`);
    }

    console.log("");
    const files = generateDomainMarkdown(result);
    writeDomainFiles(files, outputDir, options.dryRun);

    console.log("");
    console.log(`Done. ${files.size} files ${options.dryRun ? "would be" : ""} written to ${outputDir}/`);
}

function loadOrGenerate(options: CliOptions) {
    const existing = readManifest(MANIFEST_PATH);
    if (existing) {
        if (options.verbose) console.log(`Loaded manifest from ${MANIFEST_PATH}`);
        return existing;
    }
    if (options.verbose) console.log("No manifest found, generating...");
    const testDirs = options.testDir ? [options.testDir] : DEFAULT_SYNC_DIRS;
    return generateManifest({ testDirs, includeWip: true });
}

function cmdKnownBugs(options: CliOptions) {
    const manifest = loadOrGenerate(options);
    console.log(formatKnownBugsReport(manifest, options.format));
}

async function main() {
    const args = process.argv.slice(2);
    const options = parseArgs(args);

    switch (options.command) {
        case "sync":
            await cmdSync(options);
            break;
        case "validate":
            cmdValidate(options);
            break;
        case "list":
            cmdList(options);
            break;
        case "report":
            cmdReport(options);
            break;
        case "known-bugs":
            cmdKnownBugs(options);
            break;
        case "create-missing":
            await cmdCreateMissing(options);
            break;
        case "update-comments":
            await cmdUpdateComments(options);
            break;
        case "sync-domain":
            await cmdSyncDomain(options);
            break;
        case "help":
        default:
            showHelp();
            break;
    }
}

main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
});
