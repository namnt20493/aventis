/*
 * Azure Playwright Workspace + Azure DevOps Configuration for KeywordValidation Tests
 *
 * This configuration uses createAzurePlaywrightConfig for proper Azure Playwright Workspaces integration.
 * Uses Entra ID authentication which is required for Playwright Workspaces reporting feature.
 *
 * Required Environment Variables:
 * - PLAYWRIGHT_SERVICE_URL: Azure Playwright Workspace endpoint
 * - Azure CLI login (az login) - Entra ID auth is used instead of access tokens
 *
 * Optional Environment Variables:
 * - AZURE_DEVOPS_TOKEN: Personal access token for Azure DevOps (required for test case creation)
 * - AZURE_DEVOPS_ORG_URL: Azure DevOps organization URL
 * - AZURE_DEVOPS_PROJECT: Azure DevOps project name
 * - AZURE_DEVOPS_KV_PLAN_ID: Test plan ID
 * - AZURE_DEVOPS_KV_SUITE_ID: Test suite ID
 * - TEST_FILTER: Optional test filter pattern
 *
 * Usage:
 *   npx playwright test --config=playwright.kv-azure.config.ts
 */

import { defineConfig } from "@playwright/test";
import { createAzurePlaywrightConfig, ServiceOS, ServiceAuth } from "@azure/playwright";
import { AzureCliCredential } from "@azure/identity";
import type { AzureReporterOptions } from "@alex_neo/playwright-azure-reporter/dist/playwright-azure-reporter";
import {
    AZURE_DEVOPS_DEFAULTS,
    createTestPointMapper,
    isReportingRun,
    testFilter,
    SHARED_VIEWPORT,
    SHARED_USER_AGENT,
    SHARED_HTTP_HEADERS,
    SHARED_SLOW_MO
} from "./playwright.shared";

const CONFIG = {
    TIMEOUTS: {
        TEST: 600000,
        EXPECT: 30000,
        GLOBAL: 3600000,
        ACTION: 90000,
        NAVIGATION: 90000,
        CONNECTION: 60000
    },
    EXECUTION: {
        RETRIES: 2,
        WORKERS: 5
    }
} as const;

const validateAzureConfig = () => {
    if (AZURE_DEVOPS_DEFAULTS.TOKEN) {
        const planId = parseInt(AZURE_DEVOPS_DEFAULTS.KV_PLAN_ID);
        const suiteId = parseInt(AZURE_DEVOPS_DEFAULTS.KV_SUITE_ID);

        if (isNaN(planId) || isNaN(suiteId)) {
            console.warn("⚠️  Invalid Azure DevOps Plan ID or Suite ID. Using defaults.");
        }

        console.log(`✅ Azure DevOps configuration validated - Plan: ${planId}, Suite: ${suiteId}`);
    }
};

// Generate unique run ID for Playwright Workspace
const runId = process.env.PLAYWRIGHT_SERVICE_RUN_ID || `KV-Tests-${new Date().toISOString().split("T")[0]}-${Math.random().toString(36).substring(7)}`;

if (!AZURE_DEVOPS_DEFAULTS.TOKEN) {
    console.warn("⚠️  AZURE_DEVOPS_TOKEN not set. Test case creation in Azure DevOps will be disabled.");
} else {
    validateAzureConfig();
}

const baseUrl = process.env.BASE_URL || "https://qa.aventis.swiss/";
const serviceOS = process.env.PLAYWRIGHT_SERVICE_OS === "Windows" ? ServiceOS.WINDOWS : ServiceOS.LINUX;

// Determine the actual test filter to use
const getTestFilter = () => {
    if (testFilter) {
        console.log(`Using pipeline test filter: ${testFilter}`);
        return new RegExp(testFilter);
    }
    console.log("Using default filter: @KeywordValidation");
    return /@KeywordValidation/;
};

console.log(`🚀 Starting KV Tests with configuration:`);
console.log(`   Base URL: ${baseUrl}`);
console.log(`   OS: ${serviceOS}`);
console.log(`   Workers: ${CONFIG.EXECUTION.WORKERS}`);
console.log(`   Test Filter: ${testFilter || "@KeywordValidation (default)"}`);
console.log(`   Azure DevOps: ${AZURE_DEVOPS_DEFAULTS.TOKEN ? "Enabled" : "Disabled"}`);
console.log(`   Run ID: ${runId}`);
console.log(`   Reporting Run: ${isReportingRun ? "Yes (video + trace + screenshots ON, retries OFF)" : "No"}`);
console.log(`   SlowMo: ${SHARED_SLOW_MO ?? 100}ms`);

// Base Playwright configuration
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
        // HTML reporter must come BEFORE @azure/playwright/reporter
        [
            "html",
            {
                outputFolder: "playwright-report",
                open: "never"
            }
        ],
        // Azure Playwright Workspaces reporter - uploads HTML report to Azure portal
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
                planId: parseInt(AZURE_DEVOPS_DEFAULTS.KV_PLAN_ID),
                projectName: AZURE_DEVOPS_DEFAULTS.PROJECT,
                environment: AZURE_DEVOPS_DEFAULTS.ENVIRONMENT || "Azure_Workspace",
                testCaseIdMatcher: /@\[(\d+)\]/,
                shouldCreateTestCase: true,

                updateAutomatedTestName: true,
                automatedTestNameFormat: "titleWithParent",
                updateAutomatedTestStorage: true,
                testCaseSuiteId: parseInt(AZURE_DEVOPS_DEFAULTS.KV_SUITE_ID),
                logging: true,
                testRunTitle: process.env.TEST_RUN_TITLE || `KV Tests - ${process.env.RELEASE_VERSION ? `v${process.env.RELEASE_VERSION}` : "dev"} - ${AZURE_DEVOPS_DEFAULTS.ENVIRONMENT || "Azure_Workspace"} - ${new Date().toISOString().split("T")[0]}`,
                publishTestResultsMode: "testResult",
                uploadAttachments: true,
                attachmentsType: ["screenshot", "video", "trace"],
                isDisabled: !AZURE_DEVOPS_DEFAULTS.TOKEN,
                testPointMapper: createTestPointMapper(),
                testRunConfig: {
                    configurationIds: [parseInt(AZURE_DEVOPS_DEFAULTS.CONFIG_ID)]
                },
                testCaseConfig: {
                    tags: "KeywordValidation;Automated;Playwright;Azure_Workspace",
                    priority: 2,
                    automatedTestType: "Playwright",
                    area: "Test Automation",
                    iteration: "KeywordValidation"
                },
                testCaseMapper: async (testCase, playwrightTest) => {
                    try {
                        const playwrightTags = playwrightTest.tags || [];
                        const azureDevOpsTags = ["Automated", "Playwright", "Azure_Workspace"];

                        const tagMappings = [
                            { playwriteTag: "@KeywordValidation", azureTag: "KeywordValidation" },
                            { playwriteTag: "@smoke", azureTag: "Smoke" },
                            { playwriteTag: "@wip", azureTag: "WIP" }
                        ];

                        tagMappings.forEach(({ playwriteTag, azureTag }) => {
                            if (playwrightTags.some((tag) => tag === playwriteTag)) {
                                azureDevOpsTags.push(azureTag);
                            }
                        });

                        console.log(`🏷️  Creating Azure Test Case: "${testCase.title}"`);
                        console.log(`   Playwright tags: ${playwrightTags.join(", ")}`);
                        console.log(`   Azure DevOps tags: ${azureDevOpsTags.join(";")}`);

                        return {
                            ...testCase,
                            tags: azureDevOpsTags.join(";"),
                            priority: playwrightTags.some((tag) => tag === "@smoke") ? 1 : 2,
                            area: "Keyword Validation",
                            iteration: "KeywordValidation Sprint"
                        };
                    } catch (error) {
                        console.error(`❌ Error mapping test case "${testCase.title}":`, error);
                        return {
                            ...testCase,
                            tags: "KeywordValidation;Automated;Playwright",
                            priority: 2,
                            area: "Test Automation"
                        };
                    }
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
            name: "Azure-KeywordValidation",
            use: {
                channel: "chromium",
                launchOptions: {
                    slowMo: SHARED_SLOW_MO ?? 100
                }
            }
        }
    ]
});

// Export config with Azure Playwright Workspaces integration
// Note: ENTRA_ID auth is required for reporting to work (ACCESS_TOKEN doesn't support reporting)
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
