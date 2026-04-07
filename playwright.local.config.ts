import { defineConfig } from "@playwright/test";
import { SHARED_SLOW_MO, ANTI_DETECTION_ARGS, SHARED_USER_AGENT, SHARED_HTTP_HEADERS, SHARED_VIEWPORT } from "./playwright.shared";

const baseUrl = process.env.BASE_URL || "https://localhost/";
const apiBaseUrl = process.env.API_BASE_URL || "https://localhost:44315";

console.log(`Playwright Local Development Config:`);
console.log(`   Frontend URL: ${baseUrl}`);
console.log(`   Backend URL: ${apiBaseUrl}`);
console.log(`   HTTPS Errors: Ignored (localhost mode)`);
console.log(`   SlowMo: ${SHARED_SLOW_MO ?? 0}ms`);

export default defineConfig({
    testDir: "./staticTestcases",
    outputDir: "test-results",
    timeout: process.env.DEBUG_MODE ? 180000 : 600000,
    expect: {
        timeout: process.env.DEBUG_MODE ? 10000 : 20000
    },
    globalTimeout: 2400000,

    fullyParallel: false,
    forbidOnly: false,
    retries: 0,
    workers: 1,

    reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],

    use: {
        baseURL: baseUrl,
        ignoreHTTPSErrors: true,
        actionTimeout: 20000,
        navigationTimeout: 30000,
        trace: "on-first-retry",
        video: {
            mode: "retain-on-failure",
            size: { width: 1920, height: 1080 }
        },
        screenshot: "only-on-failure",
        viewport: SHARED_VIEWPORT,
        userAgent: SHARED_USER_AGENT,
        extraHTTPHeaders: SHARED_HTTP_HEADERS,
        launchOptions: {
            slowMo: SHARED_SLOW_MO ?? 0,
            args: [...ANTI_DETECTION_ARGS, "--ignore-certificate-errors", "--ignore-ssl-errors", "--allow-insecure-localhost"]
        }
    },

    projects: [
        {
            name: "Local-Chromium",
            use: {
                channel: "chromium",
                headless: false
            }
        },
        {
            name: "Local-Edge",
            use: {
                channel: "msedge",
                headless: false
            }
        }
    ]
});
