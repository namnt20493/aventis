/*
 * Azure Playwright Workspace + Azure DevOps Configuration for Functional UI Tests
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
 *   npx playwright test --config=playwright.functional-ui.config.ts
 */

import { defineConfig } from "@playwright/test";
import { createAzurePlaywrightConfig, ServiceOS, ServiceAuth } from "@azure/playwright";
import { AzureCliCredential } from "@azure/identity";
import { testFilter, SHARED_VIEWPORT, SHARED_USER_AGENT, SHARED_HTTP_HEADERS } from "./playwright.shared";

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

const runId = process.env.PLAYWRIGHT_SERVICE_RUN_ID || `FunctionalUI-${new Date().toISOString().split("T")[0]}-${Math.random().toString(36).substring(7)}`;

const baseUrl = process.env.BASE_URL || "https://dev.aventis.swiss/";
const serviceOS = process.env.PLAYWRIGHT_SERVICE_OS === "Windows" ? ServiceOS.WINDOWS : ServiceOS.LINUX;

const getTestFilter = () => {
    if (testFilter) {
        console.log(`Using pipeline test filter: ${testFilter}`);
        return new RegExp(testFilter);
    }
    console.log("Using default filter: @functionalUI");
    return /@functionalUI/;
};

console.log(`Starting Functional UI Tests with configuration:`);
console.log(`   Base URL: ${baseUrl}`);
console.log(`   OS: ${serviceOS}`);
console.log(`   Workers: ${CONFIG.EXECUTION.WORKERS}`);
console.log(`   Test Filter: ${testFilter || "@functionalUI (default)"}`);
console.log(`   Run ID: ${runId}`);

const baseConfig = defineConfig({
    testDir: "./staticTestcases",
    grep: getTestFilter(),
    outputDir: "test-results",

    timeout: CONFIG.TIMEOUTS.TEST,
    expect: { timeout: CONFIG.TIMEOUTS.EXPECT },
    globalTimeout: CONFIG.TIMEOUTS.GLOBAL,

    fullyParallel: false,
    forbidOnly: true,
    retries: CONFIG.EXECUTION.RETRIES,
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
        ]
    ],

    use: {
        actionTimeout: CONFIG.TIMEOUTS.ACTION,
        navigationTimeout: CONFIG.TIMEOUTS.NAVIGATION,

        trace: "on-first-retry",
        video: {
            mode: "retain-on-failure",
            size: SHARED_VIEWPORT
        },
        screenshot: "only-on-failure",

        baseURL: baseUrl,
        viewport: SHARED_VIEWPORT,
        locale: "de-CH",

        permissions: ["clipboard-read", "clipboard-write"],

        userAgent: SHARED_USER_AGENT,

        extraHTTPHeaders: SHARED_HTTP_HEADERS
    },

    projects: [
        // Note: StorageState setup doesn't work in Azure Playwright Workspaces
        // because each worker runs on a separate machine. Tests use Stable_Login
        // which handles login automatically.
        {
            name: "Azure-FunctionalUI",
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
