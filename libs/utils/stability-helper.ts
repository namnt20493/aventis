import { Page, Locator, expect } from "@playwright/test";
import { IStabilityService } from "@core/interfaces";

/**
 * Timing multiplier for different execution speeds:
 * - SLOW_MODE=true: 2.5x all waits (for slow/overloaded environments)
 * - FAST_MODE=true or CI=true: 0.7x (faster execution)
 * - Default: 1.0x
 */
const isSlowMode = process.env.SLOW_MODE === "true";
const isFastMode = process.env.FAST_MODE === "true" || process.env.CI === "true";
const TIMING_MULTIPLIER = isSlowMode ? 2.5 : isFastMode ? 0.7 : 1.0;

/**
 * Helper to apply timing multiplier
 */
function t(ms: number): number {
    return Math.round(ms * TIMING_MULTIPLIER);
}

/**
 * Stability utilities for making tests more reliable.
 *
 * Implements IStabilityService so it can be injected via ServiceContext.
 * Old code can still use `new StabilityHelper(page)` directly.
 */
export class StabilityHelper implements IStabilityService {
    private page: Page;
    private retryCount: Map<string, number> = new Map();

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Log retry attempts for monitoring flaky interactions
     * @param action - Description of the action being retried
     * @param attempt - Current attempt number
     * @param maxRetries - Maximum number of retries
     */
    private logRetry(action: string, attempt: number, maxRetries: number): void {
        if (attempt > 1) {
            console.warn(`⚠️  STABILITY: ${action} required ${attempt}/${maxRetries} attempts`);

            // Track retry counts for this test
            const count = this.retryCount.get(action) || 0;
            this.retryCount.set(action, count + 1);
        }
    }

    /**
     * Get retry statistics for the current test
     * @returns Object with retry counts per action
     */
    getRetryStats(): Record<string, number> {
        return Object.fromEntries(this.retryCount);
    }

    /**
     * Reset retry statistics (called automatically in fixtures)
     */
    resetRetryStats(): void {
        this.retryCount.clear();
    }

    /**
     * Smart wait that combines multiple wait strategies for better stability
     * @param locator - The element to wait for
     * @param options - Wait options
     */
    async stableWaitFor(
        locator: Locator,
        options?: {
            timeout?: number;
            state?: "visible" | "hidden" | "attached" | "detached";
            waitAfter?: number; // Additional wait after element is ready
        }
    ) {
        const { timeout = 30000, state = "visible", waitAfter = t(300) } = options || {};

        // Wait for element to be in desired state
        await locator.waitFor({ state, timeout });

        // Additional stabilization wait
        if (waitAfter > 0) {
            await this.page.waitForTimeout(waitAfter);
        }
    }

    /**
     * Stable click with retries and proper waits
     * Handles Angular-specific issues:
     * - Form pristine state (triggers change detection)
     * - asyncClick directive (waits for async operations)
     * - throttledClick directive (500ms lock)
     * - Form validation (waits for button to be enabled)
     * @param locator - Element to click
     * @param options - Click options
     */
    async stableClick(
        locator: Locator,
        options?: {
            timeout?: number;
            retries?: number;
            waitBefore?: number;
            waitAfter?: number;
            force?: boolean;
            triggerChangeDetection?: boolean;
            waitForEnabled?: number;
        }
    ) {
        const { timeout = 30000, retries = 3, waitBefore = t(150), waitAfter = t(300), force = false, triggerChangeDetection = false, waitForEnabled = 10000 } = options || {};

        for (let i = 0; i < retries; i++) {
            try {
                // Log retry if not first attempt
                if (i > 0) {
                    this.logRetry("stableClick", i + 1, retries);
                }

                // Pre-click stabilization
                if (waitBefore > 0) {
                    await this.page.waitForTimeout(waitBefore);
                }

                // Ensure element is ready
                await locator.waitFor({ state: "visible", timeout });

                // Trigger Angular change detection if requested
                // This helps with forms that stay "pristine" after Playwright fills them
                if (triggerChangeDetection) {
                    await this.triggerAngularChangeDetection();
                }

                // Wait for element to be enabled (handles form validation, asyncClick, throttledClick)
                await expect(locator).toBeEnabled({ timeout: waitForEnabled });

                // Perform click
                await locator.click({ timeout, force });

                // Post-click: Wait for any asyncClick directive to complete
                // asyncClick disables the button during async operations
                await this.waitForAsyncClickCompletion(locator, timeout);

                // Post-click stabilization
                if (waitAfter > 0) {
                    await this.page.waitForTimeout(waitAfter);
                }

                // If we get here, click was successful
                return;
            } catch (error) {
                if (i === retries - 1) {
                    throw error; // Last retry failed, throw the error
                }
                // Wait before retry (exponential backoff)
                await this.page.waitForTimeout(t(500) * (i + 1));
            }
        }
    }

    /**
     * Trigger Angular change detection by dispatching events
     * Useful when Playwright's fill() doesn't mark forms as dirty
     */
    private async triggerAngularChangeDetection(): Promise<void> {
        try {
            await this.page.evaluate(() => {
                // Dispatch a custom event that Angular's zone.js will pick up
                document.body.dispatchEvent(new Event("input", { bubbles: true }));

                // Also trigger change detection via requestAnimationFrame
                return new Promise<void>((resolve) => {
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => resolve());
                    });
                });
            });
            await this.page.waitForTimeout(t(100));
        } catch {
            // Ignore errors - this is a best-effort enhancement
        }
    }

    /**
     * Wait for asyncClick directive to complete
     * The asyncClick directive disables the button during async operations
     * and re-enables it when done
     */
    private async waitForAsyncClickCompletion(locator: Locator, timeout: number): Promise<void> {
        try {
            // Short wait to let asyncClick disable the button
            await this.page.waitForTimeout(t(50));

            // Check if button became disabled (asyncClick in progress)
            const isDisabled = await locator.isDisabled().catch(() => false);

            if (isDisabled) {
                // Poll for button to be re-enabled (no expect = no debugger trigger)
                const maxWait = Math.min(timeout, 30000);
                const endTime = Date.now() + maxWait;

                while (Date.now() < endTime) {
                    const enabled = await locator.isEnabled().catch(() => false);
                    if (enabled) return;
                    await this.page.waitForTimeout(100);
                }
                // Timeout reached but don't throw - continue anyway
            }
        } catch {
            // If we can't check or wait, continue - the operation might have succeeded
        }
    }

    /**
     * Stable fill with proper validation
     * Handles Angular-specific issues:
     * - Triggers blur() to commit the value (Angular forms need this)
     * - Dispatches input/change events for Angular change detection
     * - Marks the form as "dirty" so save buttons become enabled
     * @param locator - Input element to fill
     * @param value - Value to enter
     * @param options - Fill options
     */
    async stableFill(
        locator: Locator,
        value: string,
        options?: {
            timeout?: number;
            retries?: number;
            waitBefore?: number;
            waitAfter?: number;
            clearFirst?: boolean;
            validate?: boolean;
            triggerBlur?: boolean;
        }
    ) {
        const { timeout = 30000, retries = 3, waitBefore = t(100), waitAfter = t(150), clearFirst = true, validate = true, triggerBlur = true } = options || {};

        for (let i = 0; i < retries; i++) {
            try {
                // Log retry if not first attempt
                if (i > 0) {
                    this.logRetry("stableFill", i + 1, retries);
                }

                // Pre-fill stabilization
                if (waitBefore > 0) {
                    await this.page.waitForTimeout(waitBefore);
                }

                // Ensure element is ready
                await locator.waitFor({ state: "visible", timeout });
                await expect(locator).toBeEnabled({ timeout: 5000 });

                // Clear first if requested
                if (clearFirst) {
                    await locator.clear({ timeout });
                    await this.page.waitForTimeout(t(100));
                }

                // Fill the value
                await locator.fill(value, { timeout });

                // Validate the input if requested
                if (validate) {
                    await expect(locator).toHaveValue(value, { timeout: 5000 });
                }

                // CRITICAL for Angular: Blur the element to trigger change detection
                // This marks the form as "dirty" and enables save buttons
                if (triggerBlur) {
                    await locator.blur();
                    await this.page.waitForTimeout(t(50));
                }

                // Post-fill stabilization
                if (waitAfter > 0) {
                    await this.page.waitForTimeout(waitAfter);
                }

                return; // Success
            } catch (error) {
                if (i === retries - 1) {
                    throw error;
                }
                await this.page.waitForTimeout(t(500) * (i + 1));
            }
        }
    }

    /**
     * Wait for page to be stable (no loading spinners, network idle, etc.)
     * @param options - Stability options
     */
    async waitForPageStability(options?: { timeout?: number; spinnerSelectors?: string[]; waitForNetwork?: boolean; additionalWait?: number }) {
        const { timeout = 30000, spinnerSelectors = [".loading", ".spinner", "app-progress-spinner", '[data-testid="loading"]'], waitForNetwork = true, additionalWait = t(200) } = options || {};

        try {
            if (waitForNetwork) {
                await this.page.waitForLoadState("domcontentloaded", { timeout });
            }

            // Wait for dossier to be fully loaded (not "wird vorbereitet..." or "wurde noch nicht vorbereitet")
            // This is safe on non-dossier pages - waitFor state:"hidden" returns immediately if element doesn't exist
            const preparingMessage = this.page.locator('text="Dossier wird vorbereitet...", text="Dossier wurde noch nicht vorbereitet."');

            // Check if message is visible
            const isPreparingVisible = await preparingMessage.isVisible({ timeout: 500 }).catch(() => false);

            if (isPreparingVisible) {
                const messageText = await preparingMessage.textContent().catch(() => 'preparation message');
                console.log(`⏳ ${messageText} detected, waiting for it to resolve...`);

                // Wait 2 seconds for the message to go away naturally
                const goneWithinTwoSeconds = await preparingMessage
                    .waitFor({ state: "hidden", timeout: 2000 })
                    .then(() => true)
                    .catch(() => false);

                if (!goneWithinTwoSeconds) {
                    // Message still visible after 2 seconds - reload and check again
                    console.log('⚠️ Dossier preparation message still visible after 2s, reloading page...');
                    await this.page.reload({ waitUntil: "domcontentloaded" });

                    // After reload, wait for the message to be gone (with extended timeout)
                    await preparingMessage.waitFor({ state: "hidden", timeout: 60000 }).catch(() => {
                        console.warn('⚠️ Dossier preparation message still visible after reload');
                    });
                }
            }

            // Check all spinners in parallel instead of sequentially
            await Promise.all(
                spinnerSelectors.map(async (selector) => {
                    try {
                        const spinner = this.page.locator(selector).first();
                        if ((await spinner.count()) > 0) {
                            await spinner.waitFor({ state: "detached", timeout: 10000 });
                        }
                    } catch {
                        // Ignore if spinner doesn't exist
                    }
                })
            );

            if (additionalWait > 0) {
                await this.page.waitForTimeout(additionalWait);
            }
        } catch (error) {
            console.log(`Stability wait warning: ${(error as Error).message}`);
        }
    }

    /**
     * Wait for DOM and rendering to be stable
     * Alternative strategy that doesn't rely on Angular testabilities
     * Uses a combination of:
     * 1. RequestAnimationFrame callbacks (ensures rendering is complete)
     * 2. DOM mutation stability check
     * 3. Short timeout (much faster than waiting for Angular testabilities)
     * @param options - Stability options
     */
    async waitForAngularStable(options?: { timeout?: number }): Promise<void> {
        const { timeout = 1500 } = options || {};
        const stabilityWindow = t(150);

        try {
            // Single evaluate call: 2x rAF + MutationObserver combined
            // This avoids two separate evaluate round-trips
            await Promise.race([
                this.page.evaluate(
                    ([stabilityMs, maxMut]: [number, number]) => {
                        return new Promise<boolean>((resolve) => {
                            // Phase 1: Wait for 2 render frames
                            requestAnimationFrame(() => {
                                requestAnimationFrame(() => {
                                    // Phase 2: Wait for DOM to settle
                                    let mutationTimer: ReturnType<typeof setTimeout>;
                                    let mutationCount = 0;

                                    const observer = new MutationObserver(() => {
                                        mutationCount++;
                                        clearTimeout(mutationTimer);

                                        if (mutationCount < maxMut) {
                                            mutationTimer = setTimeout(() => {
                                                observer.disconnect();
                                                resolve(true);
                                            }, stabilityMs);
                                        } else {
                                            observer.disconnect();
                                            resolve(true);
                                        }
                                    });

                                    observer.observe(document.body, {
                                        childList: true,
                                        subtree: true,
                                        attributes: false
                                    });

                                    mutationTimer = setTimeout(() => {
                                        observer.disconnect();
                                        resolve(true);
                                    }, stabilityMs);
                                });
                            });
                        });
                    },
                    [stabilityWindow, 5] as [number, number]
                ),
                new Promise<void>((resolve) => setTimeout(resolve, timeout))
            ]);
        } catch {
            // If anything fails, just continue
        }
    }

    /**
     * Navigate with stability checks
     * @param url - URL to navigate to
     * @param options - Navigation options
     */
    async stableNavigation(
        url: string,
        options?: {
            timeout?: number;
            waitUntil?: "load" | "domcontentloaded" | "networkidle";
            stabilityWait?: number;
            maxRetries?: number;
        }
    ) {
        const { timeout = 60000, waitUntil = "domcontentloaded", stabilityWait = t(500), maxRetries = 3 } = options || {};

        for (let retry = 0; retry <= maxRetries; retry++) {
            // Navigate
            if (retry === 0) {
                await this.page.goto(url, {
                    timeout,
                    waitUntil
                });
            } else {
                console.warn(`⚠️  STABILITY: Dossier preparation in progress, reloading page (attempt ${retry}/${maxRetries})`);
                await this.page.waitForTimeout(3000);
                await this.page.reload({
                    timeout,
                    waitUntil
                });
            }

            // Wait for page stability
            await this.waitForPageStability({ additionalWait: stabilityWait });

            // Check for "Dossier wird in Kürze vorbereitet" message
            const preparingMessageLocator = this.page.locator("app-traced-background-command-status-component").filter({ hasText: "wird vorbereitet" });

            const isPreparingVisible = await preparingMessageLocator.isVisible().catch(() => false);

            if (!isPreparingVisible) {
                // Navigation successful, no preparation message
                if (retry > 0) {
                    this.logRetry("stableNavigation", retry + 1, maxRetries + 1);
                }
                return;
            }

            // Message is visible - need to retry
            if (retry === maxRetries) {
                throw new Error(`Navigation failed: Dossier preparation did not complete after ${maxRetries} retries (URL: ${url})`);
            }
        }
    }

    /**
     * Smart select for dropdown elements
     * @param locator - Select element
     * @param value - Value to select
     * @param options - Select options
     */
    async stableSelect(
        locator: Locator,
        value: string,
        options?: {
            timeout?: number;
            retries?: number;
            waitBefore?: number;
            waitAfter?: number;
        }
    ) {
        const { timeout = 30000, retries = 3, waitBefore = t(150), waitAfter = t(300) } = options || {};

        for (let i = 0; i < retries; i++) {
            try {
                // Log retry if not first attempt
                if (i > 0) {
                    this.logRetry("stableSelect", i + 1, retries);
                }

                if (waitBefore > 0) {
                    await this.page.waitForTimeout(waitBefore);
                }

                await locator.waitFor({ state: "visible", timeout });
                await expect(locator).toBeEnabled({ timeout: 5000 });

                await locator.selectOption(value, { timeout });

                // Verify selection
                await expect(locator).toHaveValue(value, { timeout: 5000 });

                if (waitAfter > 0) {
                    await this.page.waitForTimeout(waitAfter);
                }

                return;
            } catch (error) {
                if (i === retries - 1) {
                    throw error;
                }
                await this.page.waitForTimeout(t(500) * (i + 1));
            }
        }
    }

    /**
     * Robustly close a dialog with retry logic and proper animation handling.
     * This method ensures the dialog is actually closed before returning.
     * @param options - Close dialog options
     */
    async closeDialog(options?: { closeButtonSelector?: string; dialogSelector?: string; timeout?: number; retries?: number; animationWait?: number }) {
        const { closeButtonSelector = '[data-testid="close-dialog"]', dialogSelector = "mat-dialog-container", timeout = 10000, retries = 3, animationWait = t(100) } = options || {};

        const dialog = this.page.locator(dialogSelector).first();
        const closeButton = this.page.locator(closeButtonSelector).first();

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                // Log retry if not first attempt
                if (attempt > 1) {
                    this.logRetry("closeDialog", attempt, retries);
                }

                const isDialogVisible = await dialog.isVisible();
                if (!isDialogVisible) {
                    return;
                }

                await closeButton.waitFor({ state: "visible", timeout: 5000 });
                await this.page.waitForTimeout(animationWait);

                await closeButton.click({ force: true, timeout: 5000 });
                await this.page.waitForTimeout(animationWait);

                try {
                    await dialog.waitFor({ state: "hidden", timeout: timeout / retries });
                    return;
                } catch {
                    const stillVisible = await dialog.isVisible();
                    if (!stillVisible) {
                        return;
                    }
                }
            } catch (error) {
                if (attempt === retries) {
                    const isStillVisible = await dialog.isVisible().catch(() => false);
                    if (!isStillVisible) {
                        return;
                    }
                    throw new Error(`Failed to close dialog after ${retries} attempts: ${(error as Error).message}`);
                }
                await this.page.waitForTimeout(t(300) * attempt);
            }
        }
    }

    /**
     * Close dialog using the "Abbrechen" (Cancel) button
     * @param options - Close dialog options
     */
    async closeDialogWithCancel(options?: { dialogSelector?: string; timeout?: number; retries?: number }) {
        const { dialogSelector = "mat-dialog-container", timeout = 10000, retries = 3 } = options || {};

        const dialog = this.page.locator(dialogSelector).first();
        const cancelButton = dialog.getByRole("button", { name: /Abbrechen|Annuler|Cancel/i });

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                // Log retry if not first attempt
                if (attempt > 1) {
                    this.logRetry("closeDialogWithCancel", attempt, retries);
                }

                const isDialogVisible = await dialog.isVisible();
                if (!isDialogVisible) {
                    return;
                }

                await cancelButton.waitFor({ state: "visible", timeout: 5000 });
                await this.page.waitForTimeout(t(100));

                await cancelButton.click({ force: true, timeout: 5000 });
                await this.page.waitForTimeout(t(100));

                try {
                    await dialog.waitFor({ state: "hidden", timeout: timeout / retries });
                    return;
                } catch {
                    const stillVisible = await dialog.isVisible();
                    if (!stillVisible) {
                        return;
                    }
                }
            } catch (error) {
                if (attempt === retries) {
                    const isStillVisible = await dialog.isVisible().catch(() => false);
                    if (!isStillVisible) {
                        return;
                    }
                    throw new Error(`Failed to close dialog with cancel after ${retries} attempts: ${(error as Error).message}`);
                }
                await this.page.waitForTimeout(t(300) * attempt);
            }
        }
    }

    /**
     * Wait for element to be stable (not moving/changing)
     * @param locator - Element to watch
     * @param options - Stability options
     */
    async waitForElementStability(
        locator: Locator,
        options?: {
            timeout?: number;
            checkInterval?: number;
            stableTime?: number;
        }
    ) {
        const { timeout = 30000, checkInterval = t(50), stableTime = t(300) } = options || {};

        await locator.waitFor({ state: "visible", timeout });

        const startTime = Date.now();
        let lastPosition: { x: number; y: number } | null = null;
        let stableStartTime: number | null = null;

        while (Date.now() - startTime < timeout) {
            try {
                const boundingBox = await locator.boundingBox();
                if (boundingBox) {
                    const currentPosition = { x: boundingBox.x, y: boundingBox.y };

                    if (lastPosition && currentPosition.x === lastPosition.x && currentPosition.y === lastPosition.y) {
                        if (!stableStartTime) {
                            stableStartTime = Date.now();
                        } else if (Date.now() - stableStartTime >= stableTime) {
                            return; // Element is stable
                        }
                    } else {
                        stableStartTime = null;
                    }

                    lastPosition = currentPosition;
                }

                await this.page.waitForTimeout(checkInterval);
            } catch {
                // Continue if we can't get bounding box
                await this.page.waitForTimeout(checkInterval);
            }
        }

        throw new Error(`Element did not stabilize within ${timeout}ms`);
    }

    /**
     * Retry an action until it succeeds or times out
     * Uses Playwright's expect().toPass() for built-in retry logic
     * @param action - The action to perform (e.g., click, fill, navigation)
     * @param verify - Verification function to check if action succeeded
     * @param options - Retry options
     */
    async retryAction(action: () => Promise<void>, verify: () => Promise<void>, options?: { timeout?: number; intervals?: number[] }): Promise<void> {
        const { timeout = 10000, intervals = [100, 250, 500, 1000] } = options || {};

        await expect(async () => {
            await action();
            await verify();
        }).toPass({ timeout, intervals });
    }

    /**
     * Stable dropdown/select option selection with retry logic
     * Works with Angular Material dropdowns and native selects
     * Handles Angular-specific issues:
     * - Triggers change detection after selection
     * - Marks form as "dirty" so save buttons become enabled
     * @param dropdownLocator - The dropdown trigger element
     * @param optionName - Text of the option to select
     * @param options - Select options
     */
    async stableSelectOption(
        dropdownLocator: Locator,
        optionName: string,
        options?: {
            timeout?: number;
            waitBefore?: number;
            waitAfter?: number;
            useRole?: boolean;
            triggerChangeDetection?: boolean;
        }
    ): Promise<void> {
        const { timeout = 10000, waitBefore = t(100), waitAfter = t(200), useRole = true, triggerChangeDetection = true } = options || {};

        if (waitBefore > 0) {
            await this.page.waitForTimeout(waitBefore);
        }

        await this.retryAction(
            async () => {
                // Click dropdown to open
                await dropdownLocator.click({ timeout: 5000 });
                await this.page.waitForTimeout(t(150));

                // Find and click the option
                const option = useRole ? this.page.getByRole("option", { name: optionName }) : this.page.getByText(optionName, { exact: true });

                await option.waitFor({ state: "visible", timeout: 3000 });
                await option.click({ timeout: 3000 });

                // Wait for dropdown to close
                await this.page.waitForTimeout(t(100));
            },
            async () => {
                // Verify: Dropdown shows selected value
                await expect(dropdownLocator).toContainText(optionName, { timeout: 1000 });
            },
            { timeout, intervals: [200, 500, 1000] }
        );

        // Trigger Angular change detection to mark form as dirty
        if (triggerChangeDetection) {
            await this.triggerAngularChangeDetection();
        }

        if (waitAfter > 0) {
            await this.page.waitForTimeout(waitAfter);
        }
    }

    /**
     * Stable dialog opening with retry and verification
     * @param triggerLocator - Button/link that opens the dialog
     * @param options - Dialog options
     */
    async stableOpenDialog(
        triggerLocator: Locator,
        options?: {
            dialogSelector?: string;
            timeout?: number;
            animationWait?: number;
        }
    ): Promise<void> {
        const { dialogSelector = "mat-dialog-container", timeout = 15000, animationWait = t(300) } = options || {};

        const dialog = this.page.locator(dialogSelector).first();

        await this.retryAction(
            async () => {
                // Ensure no dialog is open before triggering
                const isDialogOpen = await dialog.isVisible().catch(() => false);
                if (!isDialogOpen) {
                    await this.stableClick(triggerLocator, { timeout: 5000, waitAfter: 0 });
                    await this.page.waitForTimeout(t(200));
                }
            },
            async () => {
                // Verify dialog is visible
                await expect(dialog).toBeVisible({ timeout: 1000 });
            },
            { timeout, intervals: [500, 1000, 2000] }
        );

        // Wait for dialog animation to complete
        if (animationWait > 0) {
            await this.page.waitForTimeout(animationWait);
        }
    }

    /**
     * Stable form submission with success verification
     * Handles Angular-specific form issues:
     * - Form pristine state (triggers change detection before submit)
     * - asyncClick directive (waits for async save to complete)
     * - throttledClick directive (500ms debounce)
     * - Form validation (waits for button to become enabled)
     * @param submitButton - Submit/Save button locator
     * @param successIndicator - Locator or function to verify success (e.g., toast message, URL change, dialog close)
     * @param options - Submit options
     */
    async stableFormSubmit(
        submitButton: Locator,
        successIndicator: Locator | (() => Promise<void>),
        options?: {
            timeout?: number;
            waitBeforeSubmit?: number;
            ensureEnabled?: boolean;
            waitForEnabledTimeout?: number;
            triggerChangeDetection?: boolean;
            blurActiveElement?: boolean;
        }
    ): Promise<void> {
        const { timeout = 20000, waitBeforeSubmit = t(200), ensureEnabled = true, waitForEnabledTimeout = 10000, triggerChangeDetection = true, blurActiveElement = true } = options || {};

        // Step 1: Blur active element to trigger any pending input handlers
        // This is crucial for Angular forms - input values aren't committed until blur
        if (blurActiveElement) {
            await this.page.evaluate(() => {
                const active = document.activeElement as HTMLElement;
                if (active && active !== document.body) {
                    active.blur();
                }
            });
            await this.page.waitForTimeout(t(100));
        }

        // Step 2: Trigger Angular change detection to mark form as dirty
        // This solves the "pristine" problem where button stays disabled
        if (triggerChangeDetection) {
            await this.triggerAngularChangeDetection();
        }

        // Step 3: Wait for button to be enabled (form validation complete)
        if (ensureEnabled) {
            try {
                await expect(submitButton).toBeEnabled({ timeout: waitForEnabledTimeout });
            } catch (error) {
                // Button still disabled - try one more change detection cycle
                console.warn("⚠️  Submit button still disabled, triggering additional change detection");
                await this.forceAngularFormUpdate();
                await expect(submitButton).toBeEnabled({ timeout: 5000 });
            }
        }

        if (waitBeforeSubmit > 0) {
            await this.page.waitForTimeout(waitBeforeSubmit);
        }

        // Step 4: Perform the click and verify success
        await this.retryAction(
            async () => {
                await this.stableClick(submitButton, {
                    timeout: 5000,
                    waitAfter: t(500),
                    triggerChangeDetection: false, // Already done above
                    waitForEnabled: 3000
                });
            },
            async () => {
                // Verify success
                if (typeof successIndicator === "function") {
                    await successIndicator();
                } else {
                    await expect(successIndicator).toBeVisible({ timeout: 2000 });
                }
            },
            { timeout, intervals: [500, 1000, 2000, 3000] }
        );
    }

    /**
     * Force Angular form to update by dispatching events on all form inputs
     * Use this when the form is stuck in "pristine" state despite having values
     */
    async forceAngularFormUpdate(): Promise<void> {
        try {
            await this.page.evaluate(() => {
                // Find all form inputs and dispatch events
                const inputs = document.querySelectorAll('input, textarea, select, [contenteditable="true"]');
                inputs.forEach((input) => {
                    // Dispatch events that Angular listens to
                    input.dispatchEvent(new Event("input", { bubbles: true }));
                    input.dispatchEvent(new Event("change", { bubbles: true }));
                    input.dispatchEvent(new Event("blur", { bubbles: true }));
                });

                // Also dispatch on mat-select elements (Angular Material)
                const matSelects = document.querySelectorAll("mat-select");
                matSelects.forEach((select) => {
                    select.dispatchEvent(new Event("selectionChange", { bubbles: true }));
                });

                // Trigger Angular zone to run change detection
                return new Promise<void>((resolve) => {
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => resolve());
                    });
                });
            });
            await this.page.waitForTimeout(t(200));
        } catch {
            // Ignore errors
        }
    }

    async forceFormUpdate(): Promise<void> {
        await this.forceAngularFormUpdate();
    }

    async triggerChangeDetection(): Promise<void> {
        await this.triggerAngularChangeDetection();
    }

    /**
     * Stable table row click with automatic waiting for table data
     * @param tableLocator - The table container locator
     * @param rowIdentifier - String or RegExp to identify the row by its text content
     * @param options - Click options
     */
    async stableTableRowClick(
        tableLocator: Locator,
        rowIdentifier: string | RegExp,
        options?: {
            timeout?: number;
            waitForData?: boolean;
            clickOptions?: { timeout?: number; force?: boolean };
        }
    ): Promise<void> {
        const { timeout = 10000, waitForData = true, clickOptions } = options || {};

        // Wait for Angular stability
        await this.waitForAngularStable();

        // Wait for table to have data
        if (waitForData) {
            await expect(tableLocator.locator("tr")).not.toHaveCount(0, { timeout });
        }

        // Find and click the row
        const row = tableLocator.getByRole("row", { name: rowIdentifier });
        await this.stableClick(row, clickOptions);
    }

    /**
     * Perform a stable drag and drop operation with retries and verification
     * @param source - The element to drag
     * @param target - The element to drop onto
     * @param options - Drag options
     * @returns Promise<boolean> - true if drag was successful
     */
    async stableDragAndDrop(
        source: Locator,
        target: Locator,
        options?: {
            timeout?: number;
            retries?: number;
            steps?: number;
            verifyMove?: (source: Locator, target: Locator) => Promise<boolean>;
            waitBefore?: number;
            waitAfter?: number;
        }
    ): Promise<boolean> {
        const { timeout = 30000, retries = 3, steps = 10, verifyMove, waitBefore = t(300), waitAfter = t(200) } = options || {};

        // Wait for both elements to be visible
        await source.waitFor({ state: "visible", timeout });
        await target.waitFor({ state: "visible", timeout: 10000 });
        await source.scrollIntoViewIfNeeded();

        if (waitBefore > 0) {
            await this.page.waitForTimeout(waitBefore);
        }

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                // Log retry if not first attempt
                if (attempt > 1) {
                    this.logRetry("stableDragAndDrop", attempt, retries);
                }

                // Get bounding boxes to calculate center points
                const sourceBox = await source.boundingBox();
                const targetBox = await target.boundingBox();

                if (!sourceBox || !targetBox) {
                    throw new Error("Could not get bounding box for source or target element");
                }

                const sourceX = sourceBox.x + sourceBox.width / 2;
                const sourceY = sourceBox.y + sourceBox.height / 2;
                const targetX = targetBox.x + targetBox.width / 2;
                const targetY = targetBox.y + targetBox.height / 2;

                // Perform drag with explicit mouse movements
                await this.page.mouse.move(sourceX, sourceY);
                await this.page.waitForTimeout(t(100));
                await this.page.mouse.down();
                await this.page.waitForTimeout(t(150));

                // Move in steps for smoother drag
                for (let i = 1; i <= steps; i++) {
                    const x = sourceX + ((targetX - sourceX) * i) / steps;
                    const y = sourceY + ((targetY - sourceY) * i) / steps;
                    await this.page.mouse.move(x, y);
                    await this.page.waitForTimeout(t(20));
                }

                await this.page.waitForTimeout(t(150));
                await this.page.mouse.up();

                if (waitAfter > 0) {
                    await this.page.waitForTimeout(waitAfter);
                }

                // Verify the move if a verification function is provided
                if (verifyMove) {
                    const success = await verifyMove(source, target);
                    if (success) {
                        return true;
                    } else if (attempt < retries) {
                        console.log(`Drag attempt ${attempt} verification failed, retrying...`);
                        await this.page.waitForTimeout(t(500));
                        continue;
                    }
                } else {
                    // No verification, assume success
                    return true;
                }
            } catch (error) {
                if (attempt === retries) {
                    console.log(`Drag failed after ${retries} attempts: ${(error as Error).message}`);
                    return false;
                }
                await this.page.waitForTimeout(t(300) * attempt);
            }
        }

        return false;
    }
}
