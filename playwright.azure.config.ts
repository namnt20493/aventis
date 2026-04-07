/*
 * Azure Playwright Testing Workspace Configuration
 * This file enables Playwright client to connect to Azure Playwright Testing workspace.
 * Uses Entra ID authentication which is required for Playwright Workspaces reporting feature.
 *
 * Required environment variables (set in .env or Azure Pipeline):
 *   PLAYWRIGHT_SERVICE_URL - Workspace endpoint URL
 *   Azure CLI login (az login) - Entra ID auth is used instead of access tokens
 *   PLAYWRIGHT_SERVICE_RUN_ID - Unique run identifier (auto-generated if not set)
 *
 * Usage:
 *   npx playwright test --config=playwright.azure.config.ts
 */

import { defineConfig } from "@playwright/test";
import { createAzurePlaywrightConfig, ServiceOS, ServiceAuth } from "@azure/playwright";
import { AzureCliCredential } from "@azure/identity";
import type { AzureReporterOptions } from "@alex_neo/playwright-azure-reporter/dist/playwright-azure-reporter";
import {
    AZURE_DEVOPS_DEFAULTS,
    createTestPointMapper,
    testFilter,
    SHARED_VIEWPORT,
    SHARED_USER_AGENT,
    SHARED_HTTP_HEADERS,
    SHARED_SLOW_MO
} from "./playwright.shared";

const runId = process.env.PLAYWRIGHT_SERVICE_RUN_ID || `${new Date().toISOString()}-${Math.random().toString(36).substring(7)}`;

const serviceOS = process.env.PLAYWRIGHT_SERVICE_OS === "Windows" ? ServiceOS.WINDOWS : ServiceOS.LINUX;
const osString = process.env.PLAYWRIGHT_SERVICE_OS || "Linux";

const baseURL = process.env.BASE_URL || "https://dev.aventis.swiss/";
const environment = baseURL.includes("qa.aventis.swiss") ? "qa" : "dev";

const configurationId = environment === "qa" ? 93 : 77;

const baseConfig = defineConfig({
    testDir: "./staticTestcases",

    grep: testFilter ? new RegExp(testFilter) : undefined,
    outputDir: "test-results",

    timeout: 600000,
    expect: {
        timeout: 30000
    },
    globalTimeout: 3600000,

    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 6 : 1,

    ignoreSnapshots: false,
    snapshotPathTemplate: `{testDir}/__screenshots__/{testFilePath}/${osString}/{arg}{ext}`,

    reporter: [
        ["list"],
        ["blob"],
        ["html", { outputFolder: "playwright-report", open: "never" }],
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
                environment: AZURE_DEVOPS_DEFAULTS.ENVIRONMENT || "Azure",

                testCaseIdMatcher: /@\[(\d+)\]/,
                shouldCreateTestCase: true,

                updateAutomatedTestName: true,
                automatedTestNameFormat: "titleWithParent",
                updateAutomatedTestStorage: true,
                testCaseSuiteId: parseInt(AZURE_DEVOPS_DEFAULTS.KV_SUITE_ID),
                logging: true,
                testRunTitle: "Azure Playwright Workspace Tests",
                publishTestResultsMode: "testResult",
                uploadAttachments: true,
                attachmentsType: ["screenshot", "video"],
                isDisabled: !process.env.CI,
                testRunConfig: {
                    configurationIds: [configurationId]
                },
                testPointMapper: createTestPointMapper(),
                testCaseSummary: {
                    enabled: true,
                    publishToRun: true
                }
            } as AzureReporterOptions
        ]
    ],

    use: {
        actionTimeout: 90000,
        navigationTimeout: 90000,

        trace: "retain-on-failure",
        video: {
            mode: "retain-on-failure",
            size: SHARED_VIEWPORT
        },
        screenshot: "only-on-failure",

        baseURL: baseURL,

        viewport: SHARED_VIEWPORT,

        locale: "en-US",

        permissions: ["clipboard-read", "clipboard-write"],

        userAgent: SHARED_USER_AGENT,

        extraHTTPHeaders: SHARED_HTTP_HEADERS,

        ...(SHARED_SLOW_MO !== undefined && {
            launchOptions: {
                slowMo: SHARED_SLOW_MO
            }
        })
    },

    projects: [
        // Note: StorageState setup doesn't work in Azure Playwright Workspaces
        // because each worker runs on a separate machine. Tests use Stable_Login
        // which handles login automatically.
        {
            name: "Azure Chromium",
            use: {
                channel: "chromium"
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
