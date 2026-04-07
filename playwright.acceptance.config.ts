/*
 * Azure Playwright Workspace + Azure DevOps Configuration for Acceptance Tests
 *
 * This configuration uses createAzurePlaywrightConfig for proper Azure Playwright Workspaces integration.
 * Uses Entra ID authentication which is required for Playwright Workspaces reporting feature.
 *
 * Usage:
 *   npx playwright test --config=playwright.acceptance.config.ts
 */

import { defineConfig } from "@playwright/test";
import { createAzurePlaywrightConfig, ServiceOS, ServiceAuth } from "@azure/playwright";
import { AzureCliCredential } from "@azure/identity";
import type { AzureReporterOptions } from "@alex_neo/playwright-azure-reporter/dist/playwright-azure-reporter";
import { AZURE_DEVOPS_DEFAULTS, createTestPointMapper, isReportingRun, testFilter, SHARED_VIEWPORT, SHARED_USER_AGENT, SHARED_HTTP_HEADERS } from "./playwright.shared";

const CONFIG = {
    TIMEOUTS: {
        TEST: 600000,
        EXPECT: 30000,
        GLOBAL: 3600000,
        ACTION: 90000,
        NAVIGATION: 90000
    },
    EXECUTION: {
        RETRIES: 2,
        WORKERS: 5
    }
} as const;

const validateAzureConfig = () => {
    if (AZURE_DEVOPS_DEFAULTS.TOKEN) {
        const planId = parseInt(AZURE_DEVOPS_DEFAULTS.AT_PLAN_ID);
        const suiteId = parseInt(AZURE_DEVOPS_DEFAULTS.AT_SUITE_ID);
        if (isNaN(planId) || isNaN(suiteId)) {
            console.warn("Invalid Azure DevOps Plan ID or Suite ID. Using defaults.");
        }
        console.log(`Azure DevOps configuration validated - Plan: ${planId}, Suite: ${suiteId}`);
    }
};

const runId = process.env.PLAYWRIGHT_SERVICE_RUN_ID || `Acceptance-${new Date().toISOString().split("T")[0]}-${Math.random().toString(36).substring(7)}`;

if (!AZURE_DEVOPS_DEFAULTS.TOKEN) {
    console.warn("AZURE_DEVOPS_TOKEN not set. Test case creation in Azure DevOps will be disabled.");
} else {
    validateAzureConfig();
}

const baseUrl = process.env.BASE_URL || "https://qa.aventis.swiss/";
const serviceOS = process.env.PLAYWRIGHT_SERVICE_OS === "Windows" ? ServiceOS.WINDOWS : ServiceOS.LINUX;

const getTestFilter = () => {
    if (testFilter) {
        console.log(`Using pipeline test filter: ${testFilter}`);
        return new RegExp(testFilter);
    }
    console.log("Using default filter: @acceptance");
    return /@acceptance/;
};

console.log(`Starting Acceptance Tests with configuration:`);
console.log(`   Base URL: ${baseUrl}`);
console.log(`   OS: ${serviceOS}`);
console.log(`   Workers: ${CONFIG.EXECUTION.WORKERS}`);
console.log(`   Test Filter: ${testFilter || "@acceptance (default)"}`);
console.log(`   Azure DevOps: ${AZURE_DEVOPS_DEFAULTS.TOKEN ? "Enabled" : "Disabled"}`);
console.log(`   Run ID: ${runId}`);
console.log(`   Reporting Run: ${isReportingRun ? "Yes (video + trace + screenshots ON, retries OFF)" : "No"}`);

const baseConfig = defineConfig({
    testDir: "./staticTestcases",
    grep: getTestFilter(),
    outputDir: "test-results",

    timeout: CONFIG.TIMEOUTS.TEST,
    expect: { timeout: CONFIG.TIMEOUTS.EXPECT },
    globalTimeout: CONFIG.TIMEOUTS.GLOBAL,

    fullyParallel: false,
    forbidOnly: true,
    retries: isReportingRun ? 0 : CONFIG.EXECUTION.RETRIES,
    workers: CONFIG.EXECUTION.WORKERS,

    reporter: [
        ["list"],
        [
            "html",
            {
                outputFolder: "playwright-report",
                open: "never"
            }
        ],
        ["@azure/playwright/reporter"],
        [
            "junit",
            {
                outputFile: "test-results/junit-results.xml",
                includeProjectInTestName: true
            }
        ],
        [
            "@alex_neo/playwright-azure-reporter",
            {
                orgUrl: AZURE_DEVOPS_DEFAULTS.ORG_URL,
                token: AZURE_DEVOPS_DEFAULTS.TOKEN,
                planId: parseInt(AZURE_DEVOPS_DEFAULTS.AT_PLAN_ID),
                projectName: AZURE_DEVOPS_DEFAULTS.PROJECT,
                environment: AZURE_DEVOPS_DEFAULTS.ENVIRONMENT || "Azure_Workspace",
                testCaseIdMatcher: /@\[(\d+)\]/,
                shouldCreateTestCase: true,
                updateAutomatedTestName: true,
                automatedTestNameFormat: "titleWithParent",
                updateAutomatedTestStorage: true,
                testCaseSuiteId: parseInt(AZURE_DEVOPS_DEFAULTS.AT_SUITE_ID),
                logging: true,
                testRunTitle: process.env.TEST_RUN_TITLE || `Acceptance Tests - ${process.env.RELEASE_VERSION ? `v${process.env.RELEASE_VERSION}` : "dev"} - ${AZURE_DEVOPS_DEFAULTS.ENVIRONMENT || "Azure_Workspace"} - ${new Date().toISOString().split("T")[0]}`,
                publishTestResultsMode: "testResult",
                uploadAttachments: true,
                attachmentsType: ["screenshot", "video", "trace"],
                isDisabled: !AZURE_DEVOPS_DEFAULTS.TOKEN,
                testPointMapper: createTestPointMapper(),
                testRunConfig: {
                    configurationIds: [parseInt(AZURE_DEVOPS_DEFAULTS.CONFIG_ID)]
                },
                testCaseConfig: {
                    tags: "Acceptance;Automated;Playwright;Azure_Workspace",
                    priority: 1,
                    automatedTestType: "Playwright",
                    area: "Acceptance Testing",
                    iteration: "Acceptance"
                }
            } as AzureReporterOptions
        ]
    ],

    use: {
        actionTimeout: CONFIG.TIMEOUTS.ACTION,
        navigationTimeout: CONFIG.TIMEOUTS.NAVIGATION,

        trace: isReportingRun ? "on" : "on-first-retry",
        video: {
            mode: isReportingRun ? "on" : "retain-on-failure",
            size: SHARED_VIEWPORT
        },
        screenshot: isReportingRun ? "on" : "only-on-failure",

        baseURL: baseUrl,
        viewport: SHARED_VIEWPORT,
        locale: "de-CH",

        permissions: ["clipboard-read", "clipboard-write"],

        userAgent: SHARED_USER_AGENT,

        extraHTTPHeaders: SHARED_HTTP_HEADERS
    },

    projects: [
        {
            name: "Azure-Acceptance",
            use: {
                channel: "chromium"
            }
        }
    ]
});

export default defineConfig(
    baseConfig,
    createAzurePlaywrightConfig(baseConfig, {
        serviceAuthType: ServiceAuth.ENTRA_ID,
        credential: new AzureCliCredential(),
        os: serviceOS,
        runName: runId,
        exposeNetwork: "<loopback>"
    })
);
