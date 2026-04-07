import { Locator, expect } from "@playwright/test";

/**
 * Fill input only if value is string || number.
 * - string | number  → fill
 * - rest           → Skip
 */
export async function fillForm(locator: Locator, value?: unknown): Promise<void> {
    if (typeof value === "number" || (typeof value === "string" && value !== "")) {
        await locator.fill(String(value));
    }
}
/**
 * Assert only if value is string || number.
 * - string | number  → expect correct value
 * - rest           → Skip
 */
export async function expectValue(locator: Locator, value?: unknown, message?: string) {
    if (typeof value === "number" || (typeof value === "string" && value !== "")) {
        await expect.soft(locator, message).toContainText(String(value));
    }
}
/**
 * Assert only if value is string || number.
 * - string | number  → expect invisible
 * - rest           → Skip
 */
export async function expectVisible(locator: Locator, value?: unknown, message?: string) {
    if (typeof value === "number" || (typeof value === "string" && value !== "")) {
        await expect.soft(locator, message).toBeHidden();
    }
}
