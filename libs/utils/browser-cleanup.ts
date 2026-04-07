import { Page, BrowserContext } from "@playwright/test";

export async function clearCookiesOnly(context: BrowserContext) {
    console.log("🍪 Clearing cookies...");
    await context.clearCookies();
    console.log("✅ Cookies cleared");
}
