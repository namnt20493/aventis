import { defineConfig } from "@playwright/test";
import type { AzureReporterOptions } from "@alex_neo/playwright-azure-reporter/dist/playwright-azure-reporter";
import { AZURE_DEVOPS_DEFAULTS, createLocalProjectConfig, createTestPointMapper, SHARED_SLOW_MO } from "./playwright.shared";

const baseUrl = process.env.BASE_URL || "https://load.aventis.swiss/";
const perfEnvironment = baseUrl.match(/https:\/\/(\w+)\.aventis\.swiss/)?.[1]?.toUpperCase() || "LOAD";

console.log(`Playwright Performance Monitoring Config:`);
console.log(`   Base URL: ${baseUrl}`);
console.log(`   Environment: ${perfEnvironment}`);
console.log(`   CI Mode: ${process.env.CI ? "Yes" : "No"}`);

export default defineConfig({
    testDir: "./staticTestcases",
    grep: /@perfMonitoring/,
    outputDir: "test-results",
    timeout: 600000,
    expect: {
        timeout: 20000
    },
    globalTimeout: 1800000,

    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    workers: 4,

    reporter: [
        ["list"],
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
                environment: `Perf_Monitoring_${perfEnvironment}`,
                testCaseIdMatcher: /@\[(\d+)\]/,
                shouldCreateTestCase: false,
                updateAutomatedTestName: true,
                automatedTestNameFormat: "titleWithParent",
                updateAutomatedTestStorage: true,
                testCaseSuiteId: parseInt(AZURE_DEVOPS_DEFAULTS.KV_SUITE_ID),
                logging: true,
                testRunTitle: process.env.TEST_RUN_TITLE || `Perf Monitoring - ${perfEnvironment} - ${new Date().toISOString().split("T")[0]}`,
                publishTestResultsMode: "testResult",
                uploadAttachments: true,
                attachmentsType: ["screenshot"],
                isDisabled: !AZURE_DEVOPS_DEFAULTS.TOKEN,
                testPointMapper: createTestPointMapper(),
                testRunConfig: {
                    configurationIds: [parseInt(process.env.AZURE_DEVOPS_CONFIG_ID || "85")]
                },
                testCaseConfig: {
                    tags: "PerfMonitoring;Automated;Playwright",
                    priority: 1,
                    automatedTestType: "Playwright",
                    area: "Performance Monitoring",
                    iteration: "PerfMonitoring"
                }
            } as AzureReporterOptions
        ]
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
            name: "Perf-Monitoring",
            use: {
                ...createLocalProjectConfig(),
                baseURL: baseUrl
            }
        }
    ]
});
