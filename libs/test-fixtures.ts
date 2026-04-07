import { test as base, Page, expect, BrowserContext, APIRequestContext, request } from "@playwright/test";
import { generateTestcaseSeed } from "@sharedTestsSteps/sharedTestLogicDossier";
import { StabilityHelper } from "@utils/stability-helper";
import { ServiceContext } from "@core/services";
import { IServiceContext } from "@core/interfaces";
import { TestDataFactory } from "@utils/TestDataFactory";
import type { TestPersonSet } from "@utils/TestDataFactory";
import { isLocalEnvironment, getBackendUrl } from "@utils/url-config";

export interface TestData {
    persons: TestPersonSet;
}

type Fixtures = {
    page: Page;
    seed: string;
    testData: TestData;
    baseURL: string;
    authenticatedRequest: APIRequestContext;
    stabilityHelper: StabilityHelper;
    services: IServiceContext;
};

export const test = base.extend<Fixtures>({
    baseURL: async ({}, use, testInfo) => {
        const url = testInfo.project.use.baseURL;
        await use(url);
    },

    seed: async ({}, use) => {
        const seed = generateTestcaseSeed();
        await use(seed);
    },

    testData: async ({ seed }, use) => {
        const testData: TestData = {
            persons: TestDataFactory.createPersons(seed)
        };
        await use(testData);
    },

    // Provides an API request context that shares cookies with the browser
    // Use this for API calls after login
    // For local development, creates a lazy wrapper that captures cookies just-in-time
    authenticatedRequest: async ({ context, baseURL }, use) => {
        if (isLocalEnvironment()) {
            const backendUrl = getBackendUrl();
            let cachedContext: APIRequestContext | null = null;

            const lazyApiContext = {
                async post(url: string, options?: any) {
                    if (!cachedContext) {
                        const storageState = await context.storageState();
                        cachedContext = await request.newContext({
                            baseURL: backendUrl,
                            ignoreHTTPSErrors: true,
                            storageState
                        });
                    }
                    return cachedContext.post(url, options);
                },
                async get(url: string, options?: any) {
                    if (!cachedContext) {
                        const storageState = await context.storageState();
                        cachedContext = await request.newContext({
                            baseURL: backendUrl,
                            ignoreHTTPSErrors: true,
                            storageState
                        });
                    }
                    return cachedContext.get(url, options);
                },
                async put(url: string, options?: any) {
                    if (!cachedContext) {
                        const storageState = await context.storageState();
                        cachedContext = await request.newContext({
                            baseURL: backendUrl,
                            ignoreHTTPSErrors: true,
                            storageState
                        });
                    }
                    return cachedContext.put(url, options);
                },
                async delete(url: string, options?: any) {
                    if (!cachedContext) {
                        const storageState = await context.storageState();
                        cachedContext = await request.newContext({
                            baseURL: backendUrl,
                            ignoreHTTPSErrors: true,
                            storageState
                        });
                    }
                    return cachedContext.delete(url, options);
                },
                async dispose() {
                    if (cachedContext) {
                        await cachedContext.dispose();
                        cachedContext = null;
                    }
                }
            } as unknown as APIRequestContext;

            await use(lazyApiContext);
            await lazyApiContext.dispose();
        } else {
            await use(context.request);
        }
    },

    // Provides a StabilityHelper instance for the test
    // Use this for stable interactions with elements
    stabilityHelper: async ({ page }, use) => {
        const helper = new StabilityHelper(page);
        await use(helper);
    },

    services: async ({ page }, use) => {
        const ctx = ServiceContext.for(page);
        await use(ctx);
    },

    page: async ({ page }, use) => {
        page.on("crash", () => {
            console.error("❌ PAGE CRASHED!");
        });

        page.on("pageerror", (error) => {
            console.error("❌ PAGE ERROR:", error.message);
            if (process.env.DEBUG_ON_ERROR === "true") {
                console.log("🔍 Pausing for debugging...");
                page.pause();
            }
        });

        await use(page);
    }
});

test.beforeEach(async ({ page, seed }, testInfo) => {
    process.env.PW_WORKER_INDEX = String(testInfo.workerIndex);
    console.log("\n🚀 Test starting...");
    console.log(`🌱 Current Test Seed: ${seed}`);

    // Set longer default timeouts for stability
    page.setDefaultTimeout(30000); // 30s for actions
    page.setDefaultNavigationTimeout(60000); // 60s for navigations

    console.log("✅ Setup complete!\n");
});

test.afterEach(async ({ page, stabilityHelper }, testInfo) => {
    console.log(`\n🏁 Test finished: ${testInfo.title}`);
    console.log(`   Status: ${testInfo.status}`);
    console.log(`   Duration: ${testInfo.duration}ms`);

    // Log retry statistics for monitoring flaky tests
    const retryStats = stabilityHelper.getRetryStats();
    const retryCount = Object.keys(retryStats).length;

    if (retryCount > 0) {
        console.log(`\n⚠️  Stability Retries Detected:`);
        for (const [action, count] of Object.entries(retryStats)) {
            console.log(`   - ${action}: ${count} retry(ies)`);
        }
        console.log(`   Total retry events: ${retryCount}`);
    }

    console.log();
});

export { expect };
