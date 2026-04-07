import { defineConfig } from "@playwright/test";
import { SHARED_BASE_URL, SHARED_SLOW_MO, createLocalProjectConfig } from "./playwright.shared";

export default defineConfig({
    testDir: "./",
    testIgnore: ["**/__tests__/**", "**/node_modules/**"],
    outputDir: "test-results/videos",
    timeout: 1000 * 60 * 20,
    expect: {
        timeout: 5000,
        toHaveScreenshot: {
            maxDiffPixels: 0,
            threshold: 0,
            pathTemplate: "__screenshots__/{testFilePath}/{arg}{ext}"
        },
        toMatchAriaSnapshot: {
            pathTemplate: "__aria-snapshots__/{testFilePath}/{arg}{ext}"
        }
    },
    snapshotPathTemplate: "__snapshots__/{testFilePath}/{arg}{ext}",
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [["./libs/utils/custom-reporter.ts"], ["html", { open: "never" }]],
    use: {
        ignoreHTTPSErrors: true,
        actionTimeout: 20000,
        navigationTimeout: 20000,
        trace: "on-first-retry",
        video: {
            mode: "off",
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
                ...createLocalProjectConfig({ headless: false }),
                baseURL: SHARED_BASE_URL
            }
        }
    ]
});
