import { defineConfig } from "@playwright/test";
import type { AzureReporterOptions } from "@alex_neo/playwright-azure-reporter/dist/playwright-azure-reporter";
import {
    SHARED_BASE_URL,
    SHARED_SLOW_MO,
    AZURE_DEVOPS_DEFAULTS,
    createLocalProjectConfig,
    createTestPointMapper,
    isReportingRun,
    testFilter
} from "./playwright.shared";

const baseUrl = process.env.BASE_URL || "https://dev.aventis.swiss/";

console.log(`Playwright KV Config (Local):`);
console.log(`   Base URL: ${baseUrl}`);
console.log(`   Test Filter: ${testFilter || "(none)"}`);
console.log(`   CI Mode: ${process.env.CI ? "Yes" : "No"}`);
console.log(`   Reporting Run: ${isReportingRun ? "Yes (video + trace + screenshots ON, retries OFF)" : "No"}`);
console.log(`   SlowMo: ${SHARED_SLOW_MO ?? 100}ms${SHARED_SLOW_MO !== undefined ? " (from SLOWMO env)" : " (default)"}`);

export default defineConfig({
    testDir: "./staticTestcases",
    grep: testFilter ? new RegExp(testFilter) : undefined,
    outputDir: "test-results",
    timeout: process.env.DEBUG_MODE ? 180000 : 600000,
    expect: {
        timeout: process.env.DEBUG_MODE ? 10000 : 20000
    },
    globalTimeout: 2400000,

    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: isReportingRun ? 0 : (process.env.CI ? 1 : 0),
    workers: 10,

    reporter: [
        ["list"],
        ["blob"],
        [
            "junit",
            {
                outputFile: "test-results/junit-results.xml",
                includeProjectInTestName: true
            }
        ],
        ["html", { outputFolder: "playwright-report", open: "never" }],
        [
            "@alex_neo/playwright-azure-reporter",
            {
                orgUrl: AZURE_DEVOPS_DEFAULTS.ORG_URL,
                token: AZURE_DEVOPS_DEFAULTS.TOKEN,
                planId: parseInt(AZURE_DEVOPS_DEFAULTS.KV_PLAN_ID),
                projectName: AZURE_DEVOPS_DEFAULTS.PROJECT,
                environment: AZURE_DEVOPS_DEFAULTS.ENVIRONMENT || "Local_Agent",
                testCaseIdMatcher: /@\[(\d+)\]/,
                shouldCreateTestCase: true,
                updateAutomatedTestName: true,
                automatedTestNameFormat: "titleWithParent",
                updateAutomatedTestStorage: true,
                testCaseSuiteId: parseInt(AZURE_DEVOPS_DEFAULTS.KV_SUITE_ID),
                logging: true,
                testRunTitle: process.env.TEST_RUN_TITLE || `KV Tests - ${AZURE_DEVOPS_DEFAULTS.ENVIRONMENT || "Local_Agent"} - ${new Date().toISOString().split("T")[0]}`,
                publishTestResultsMode: "testResult",
                uploadAttachments: true,
                attachmentsType: ["screenshot", "video", "trace"],
                isDisabled: !AZURE_DEVOPS_DEFAULTS.TOKEN,
                testPointMapper: createTestPointMapper(),
                testRunConfig: {
                    configurationIds: [parseInt(process.env.AZURE_DEVOPS_CONFIG_ID || "77")]
                },
                testCaseConfig: {
                    tags: "KeywordValidation;Automated;Playwright;Local_Agent",
                    priority: 2,
                    automatedTestType: "Playwright",
                    area: "Keyword Validation",
                    iteration: "KeywordValidation"
                }
            } as AzureReporterOptions
        ]
    ],

    use: {
        actionTimeout: 60000,
        navigationTimeout: 60000,
        trace: isReportingRun ? "on" : "retain-on-failure",
        video: {
            mode: isReportingRun ? "on" : "retain-on-failure",
            size: { width: 1920, height: 1200 }
        },
        screenshot: isReportingRun ? "on" : "only-on-failure",
        launchOptions: {
            slowMo: SHARED_SLOW_MO ?? 100
        }
    },

    projects: [
        {
            name: "Microsoft Edge",
            use: {
                ...createLocalProjectConfig(),
                baseURL: baseUrl
            }
        }
    ]
});
