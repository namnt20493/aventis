import * as dotenv from "dotenv";
dotenv.config();

export const SHARED_BASE_URL = process.env.BASE_URL || "https://qa.aventis.swiss/";

export const AZURE_DEVOPS_DEFAULTS = {
    ORG_URL: process.env.AZURE_DEVOPS_ORG_URL || "https://diartis.visualstudio.com/",
    PROJECT: process.env.AZURE_DEVOPS_PROJECT || "Aventis",
    TOKEN: process.env.AZURE_DEVOPS_TOKEN,
    KV_PLAN_ID: process.env.AZURE_DEVOPS_KV_PLAN_ID || "181204",
    KV_SUITE_ID: process.env.AZURE_DEVOPS_KV_SUITE_ID || "181205",
    JT_PLAN_ID: process.env.AZURE_DEVOPS_JT_PLAN_ID || "183831",
    JT_SUITE_ID: process.env.AZURE_DEVOPS_JT_SUITE_ID || "183879",
    AT_PLAN_ID: process.env.AZURE_DEVOPS_AT_PLAN_ID || "183595",
    AT_SUITE_ID: process.env.AZURE_DEVOPS_AT_SUITE_ID || "183597",
    CONFIG_ID: process.env.AZURE_DEVOPS_CONFIG_ID || "93",
    ENVIRONMENT: process.env.AZURE_DEVOPS_ENVIRONMENT
} as const;

export const ANTI_DETECTION_ARGS = [
    "--disable-translate",
    "--disable-features=Translate,TranslateUI,LanguageSettings",
    "--disable-popup-blocking",
    "--disable-notifications",
    "--disable-geolocation",
    "--disable-external-intent-requests",
    "--disable-blink-features=AutomationControlled",
    "--no-default-browser-check",
    "--disable-spell-checking",
    "--disable-extensions",
    "--disable-component-update",
    "--disable-autofill-keyboard-accessory-view",
    "--disable-save-password-bubble",
    "--disable-client-side-phishing-detection",
    "--disable-background-networking",
    "--disable-sync",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
    "--disable-default-apps",
    "--disable-hang-monitor",
    "--disable-prompt-on-repost",
    "--disable-infobars",
    "--disable-features=TranslateUI,BlinkGenPropertyTrees",
    "--disable-web-security",
    "--disable-features=IsolateOrigins,site-per-process",
    "--disable-site-isolation-trials"
] as const;

export const HEADLESS_EXTRA_ARGS = [
    "--window-size=1920,1200",
    "--start-maximized",
    "--force-device-scale-factor=1",
    "--disable-gpu",
    "--disable-software-rasterizer",
    "--disable-dev-shm-usage",
    "--no-sandbox",
    "--disable-setuid-sandbox"
] as const;

export const SHARED_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0";

export const SHARED_HTTP_HEADERS = {
    "Accept-Language": "en-US,en;q=0.9,de;q=0.8",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate, br"
} as const;

export const SHARED_VIEWPORT = { width: 1920, height: 1200 };

export const SHARED_SLOW_MO = process.env.SLOWMO ? parseInt(process.env.SLOWMO, 10) : undefined;

export function createLocalProjectConfig(options?: { headless?: boolean; devtools?: boolean; slowMo?: number }) {
    const headless = options?.headless ?? true;
    const devtools = options?.devtools ?? false;
    const slowMo = SHARED_SLOW_MO ?? options?.slowMo ?? 100;

    return {
        viewport: SHARED_VIEWPORT,
        channel: "chromium" as const,
        launchOptions: {
            headless,
            devtools,
            slowMo,
            ignoreDefaultArgs: ["--enable-automation"],
            args: [
                ...(headless ? [...HEADLESS_EXTRA_ARGS] : []),
                ...ANTI_DETECTION_ARGS
            ]
        },
        locale: "en-US" as const,
        permissions: ["clipboard-read", "clipboard-write"] as string[],
        storageState: undefined,
        userAgent: SHARED_USER_AGENT,
        extraHTTPHeaders: { ...SHARED_HTTP_HEADERS }
    };
}

export function createAzureProjectConfig() {
    return {
        channel: "chromium" as const
    };
}

export function createTestPointMapper() {
    return async (testCase: { title: string }, testPoints: Array<{ id: number; configuration?: { id?: string } }>) => {
        if (testPoints.length === 0) {
            console.log(`No test points found for test case "${testCase.title}" - results will create new test run only`);
            return undefined;
        }
        console.log(`Found ${testPoints.length} test point(s) for test case "${testCase.title}"`);
        testPoints.forEach((tp, i) => {
            console.log(`   Point ${i + 1}: ID=${tp.id}, ConfigId=${tp.configuration?.id || "N/A"}`);
        });
        return testPoints;
    };
}

export const isReportingRun = process.env.REPORTING_RUN?.toLowerCase() === "true";
export const testFilter = process.env.TEST_FILTER || "";
