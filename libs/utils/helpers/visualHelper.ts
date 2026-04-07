import { expect, Locator } from "@playwright/test";

/**
 * Options for stable visual comparison
 */
type VisualOptions = {
    name?: string;
    mask?: Locator[];
    message?: string;
    maxDiffPixels?: number;
    threshold?: number;
};

/**
 * Options for text/content snapshot comparison
 */
type SnapshotOptions = {
    name?: string;
    message?: string;
};

/**
 * Takes a stable screenshot and performs a soft visual comparison.
 *
 * Features:
 * - Uses expect.soft so the test continues even if the visual check fails
 * - Disables CSS animations and transitions to avoid flaky results
 * - Supports masking dynamic elements (IDs, timestamps, etc.)
 * - Works reliably in headless mode and CI environments
 *
 * @param locator - The locator of the element to capture
 * @param options - Optional screenshot settings and assertion message
 */
export async function expectMatchScreenshot(locator: Locator, options?: VisualOptions): Promise<void> {
    const { name, mask, message, maxDiffPixels, threshold } = options ?? {};

    // Ensure the element is visible before taking the screenshot
    await locator.waitFor({ state: "visible" });

    // Soft visual assertion with a meaningful error message
    await expect.soft(locator, message ?? "Visual comparison failed: screenshot does not match baseline").toHaveScreenshot(name ?? [], {
        animations: "disabled",
        mask,
        maxDiffPixels,
        threshold
    });
}

/**
 * Compares text/content snapshot for non-image assertions.
 *
 * Features:
 * - Uses expect.soft so the test continues even if the comparison fails
 * - Compares actual text content against baseline snapshot
 * - Useful for verifying dynamic content, HTML output, JSON, etc.
 * - Works reliably in CI environments
 *
 * @param locator - The locator of the element to capture text from
 * @param options - Optional snapshot settings and assertion message
 */
export async function expectMatchTextSnapshot(locator: Locator, options?: SnapshotOptions): Promise<void> {
    const { name, message } = options ?? {};

    // Get text content from the element
    const textContent = await locator.textContent();

    // Soft assertion with a meaningful error message
    expect.soft(textContent, message ?? "Text snapshot comparison failed: content does not match baseline").toMatchSnapshot(name ?? "snapshot.txt");
}
