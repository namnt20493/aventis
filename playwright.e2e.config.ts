import { defineConfig } from "@playwright/test";
import { SHARED_BASE_URL, SHARED_SLOW_MO, createLocalProjectConfig } from "./playwright.shared";

const htmlReportPath = process.env.PLAYWRIGHT_HTML_REPORT || "playwright-report";

export default defineConfig({
    testDir: "./testcases",
    outputDir: "test-results/videos",
    timeout: 1000 * 60 * 20,
    expect: {
        timeout: 1 * 20 * 1000
    },
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 0 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [["dot"], ["html", { outputFolder: htmlReportPath, open: "never" }]],
    use: {
        trace: "retain-on-failure",
        video: {
            mode: "retain-on-failure",
            size: { width: 1920, height: 1080 }
        },
        screenshot: "only-on-failure",
        launchOptions: {
            slowMo: SHARED_SLOW_MO ?? 10
        }
    },
    projects: [
        {
            name: "Chromium",
            use: {
                ...createLocalProjectConfig(),
                baseURL: SHARED_BASE_URL
            }
        }
    ]
});
