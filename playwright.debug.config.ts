import { defineConfig } from "@playwright/test";
import { SHARED_BASE_URL, SHARED_SLOW_MO, createLocalProjectConfig } from "./playwright.shared";

/**
 * DEBUG Configuration for local VSCode development
 * This config is optimized for debugging and development
 */
export default defineConfig({
    testDir: "./",
    testIgnore: ["**/__tests__/**", "**/node_modules/**"],
    outputDir: "test-results/videos",
    timeout: 1000 * 60 * 20,
    expect: {
        timeout: 10000,
        toHaveScreenshot: {
            maxDiffPixels: 100,
            threshold: 0.2,
            pathTemplate: "__screenshots__/{testFilePath}/{arg}{ext}"
        },
        toMatchAriaSnapshot: {
            pathTemplate: "__aria-snapshots__/{testFilePath}/{arg}{ext}"
        }
    },
    snapshotPathTemplate: "__snapshots__/{testFilePath}/{arg}{ext}",
    fullyParallel: false,
    forbidOnly: false,
    retries: 0,
    workers: 1,
    reporter: [
        ["list"],
        ["html", { open: "on-failure" }],
        ["./libs/utils/custom-reporter.ts"]
    ],
    use: {
        actionTimeout: 30000,
        navigationTimeout: 30000,
        trace: "on",
        video: {
            mode: "on",
            size: { width: 1920, height: 1080 }
        },
        screenshot: "on",
        launchOptions: {
            slowMo: SHARED_SLOW_MO ?? 100
        }
    },
    projects: [
        {
            name: "Chromium Debug",
            use: {
                ...createLocalProjectConfig({ headless: false, devtools: true }),
                baseURL: SHARED_BASE_URL
            }
        }
    ]
});
