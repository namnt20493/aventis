/*
 * Local Agent Configuration for Acceptance Tests
 *
 * This configuration runs tests directly on a local agent without Azure Playwright Workspaces.
 * Use playwright.acceptance.config.ts for Azure Workspace execution.
 *
 * Usage:
 *   npx playwright test --config=playwright.acceptance-local.config.ts
 */

import { defineConfig } from "@playwright/test";
import type { AzureReporterOptions } from "@alex_neo/playwright-azure-reporter/dist/playwright-azure-reporter";
import { AZURE_DEVOPS_DEFAULTS, SHARED_SLOW_MO, createLocalProjectConfig, createTestPointMapper, isReportingRun, testFilter } from "./playwright.shared";

const baseUrl = process.env.BASE_URL || "https://qa.aventis.swiss/";

console.log(`Playwright Acceptance Config (Local):`);
console.log(`   Base URL: ${baseUrl}`);
console.log(`   Test Filter: ${testFilter || "(none)"}`);
console.log(`   CI Mode: ${process.env.CI ? "Yes" : "No"}`);
console.log(`   Reporting Run: ${isReportingRun ? "Yes (video + trace + screenshots ON, retries OFF)" : "No"}`);

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
    retries: isReportingRun ? 0 : process.env.CI ? 1 : 0,
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
                planId: parseInt(AZURE_DEVOPS_DEFAULTS.AT_PLAN_ID),
                projectName: AZURE_DEVOPS_DEFAULTS.PROJECT,
                environment: AZURE_DEVOPS_DEFAULTS.ENVIRONMENT || "Local_Agent",
                testCaseIdMatcher: /@\[(\d+)\]/,
                shouldCreateTestCase: true,
                updateAutomatedTestName: true,
                automatedTestNameFormat: "titleWithParent",
                updateAutomatedTestStorage: true,
                testCaseSuiteId: parseInt(AZURE_DEVOPS_DEFAULTS.AT_SUITE_ID),
                logging: true,
                testRunTitle: process.env.TEST_RUN_TITLE || `Acceptance Tests - ${AZURE_DEVOPS_DEFAULTS.ENVIRONMENT || "Local_Agent"} - ${new Date().toISOString().split("T")[0]}`,
                publishTestResultsMode: "testResult",
                uploadAttachments: true,
                attachmentsType: ["screenshot", "video", "trace"],
                isDisabled: !AZURE_DEVOPS_DEFAULTS.TOKEN,
                testPointMapper: createTestPointMapper(),
                testRunConfig: {
                    configurationIds: [parseInt(AZURE_DEVOPS_DEFAULTS.CONFIG_ID)]
                },
                testCaseConfig: {
                    tags: "Acceptance;Automated;Playwright;Local_Agent",
                    priority: 1,
                    automatedTestType: "Playwright",
                    area: "Acceptance Testing",
                    iteration: "Acceptance"
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
