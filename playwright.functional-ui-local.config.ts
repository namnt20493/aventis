/*
 * Local Agent Configuration for Functional UI Tests
 *
 * This configuration runs tests directly on a local agent without Azure Playwright Workspaces.
 * Use playwright.functional-ui.config.ts for Azure Workspace execution.
 *
 * Usage:
 *   npx playwright test --config=playwright.functional-ui-local.config.ts
 */

import { defineConfig } from "@playwright/test";
import { createLocalProjectConfig, SHARED_SLOW_MO, testFilter } from "./playwright.shared";

const baseUrl = process.env.BASE_URL || "https://dev.aventis.swiss/";

console.log(`Playwright Functional UI Config (Local):`);
console.log(`   Base URL: ${baseUrl}`);
console.log(`   Test Filter: ${testFilter || "(none)"}`);
console.log(`   CI Mode: ${process.env.CI ? "Yes" : "No"}`);

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
    retries: process.env.CI ? 1 : 0,
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
        ["html", { outputFolder: "playwright-report", open: "never" }]
    ],

    use: {
        actionTimeout: 60000,
        navigationTimeout: 60000,
        trace: "retain-on-failure",
        video: {
            mode: "retain-on-failure",
            size: { width: 1920, height: 1200 }
        },
        screenshot: "only-on-failure",
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
