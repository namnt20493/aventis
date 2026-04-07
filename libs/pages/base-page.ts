import { Page, Locator, expect } from "@playwright/test";
import { StabilityHelper } from "@utils/stability-helper";

/**
 * Options for click operations
 */
export interface ClickOptions {
    timeout?: number;
    retries?: number;
    waitBefore?: number;
    waitAfter?: number;
    force?: boolean;
    verifyAction?: () => Promise<void>;
}

/**
 * Options for fill operations
 */
export interface FillOptions {
    timeout?: number;
    retries?: number;
    clearFirst?: boolean;
    validate?: boolean;
    waitBefore?: number;
    waitAfter?: number;
}

/**
 * Options for select operations
 */
export interface SelectOptions {
    timeout?: number;
    waitBefore?: number;
    waitAfter?: number;
    useRole?: boolean;
}

/**
 * BasePage class provides common page interaction methods with built-in stability
 * All page classes should extend this base class to inherit stability features
 */
export class BasePage {
    protected page: Page;
    protected stability: StabilityHelper;

    constructor(page: Page) {
        this.page = page;
        this.stability = new StabilityHelper(page);
    }

    /**
     * Stable click with automatic hydration wait
     * @param locator - Element to click
     * @param options - Click options
     */
    protected async click(locator: Locator, options?: ClickOptions): Promise<void> {
        await this.stability.waitForAngularStable();
        await this.stability.stableClick(locator, options);

        if (options?.verifyAction) {
            await options.verifyAction();
        }
    }

    /**
     * Stable fill with validation
     * @param locator - Input element
     * @param value - Value to fill
     * @param options - Fill options
     */
    protected async fill(locator: Locator, value: string, options?: FillOptions): Promise<void> {
        await this.stability.waitForAngularStable();
        await this.stability.stableFill(locator, value, options);
    }

    /**
     * Stable dropdown/select option selection
     * @param dropdownLocator - Dropdown trigger element
     * @param optionName - Text of option to select
     * @param options - Select options
     */
    protected async selectOption(
        dropdownLocator: Locator,
        optionName: string,
        options?: SelectOptions
    ): Promise<void> {
        await this.stability.waitForAngularStable();
        await this.stability.stableSelectOption(dropdownLocator, optionName, options);
    }

    /**
     * Stable dialog opening
     * @param triggerLocator - Button/link that opens dialog
     * @param options - Dialog options
     */
    protected async openDialog(
        triggerLocator: Locator,
        options?: {
            dialogSelector?: string;
            timeout?: number;
            animationWait?: number;
        }
    ): Promise<void> {
        await this.stability.stableOpenDialog(triggerLocator, options);
    }

    /**
     * Stable form submission with success verification
     * @param submitButton - Submit/Save button
     * @param successIndicator - Locator or function to verify success
     * @param options - Submit options
     */
    protected async submitForm(
        submitButton: Locator,
        successIndicator: Locator | (() => Promise<void>),
        options?: {
            timeout?: number;
            waitBeforeSubmit?: number;
            ensureEnabled?: boolean;
        }
    ): Promise<void> {
        await this.stability.stableFormSubmit(submitButton, successIndicator, options);
    }

    /**
     * Stable table row click
     * @param tableLocator - Table container
     * @param rowIdentifier - String or RegExp to identify row
     * @param options - Click options
     */
    protected async clickTableRow(
        tableLocator: Locator,
        rowIdentifier: string | RegExp,
        options?: {
            timeout?: number;
            waitForData?: boolean;
            clickOptions?: { timeout?: number; force?: boolean };
        }
    ): Promise<void> {
        await this.stability.stableTableRowClick(tableLocator, rowIdentifier, options);
    }

    /**
     * Wait for page to be fully ready (including Angular hydration)
     */
    protected async waitForReady(): Promise<void> {
        await this.stability.waitForPageStability();
        await this.stability.waitForAngularStable();
    }

    /**
     * Smart wait before any interaction
     * @param locator - Element to prepare
     */
    protected async prepareForInteraction(locator: Locator): Promise<void> {
        await locator.waitFor({ state: "visible" });
        await expect(locator).toBeEnabled({ timeout: 5000 });
        await this.stability.waitForElementStability(locator);
        await this.stability.waitForAngularStable();
    }

    /**
     * Close dialog using close button
     * @param options - Close options
     */
    protected async closeDialog(options?: {
        closeButtonSelector?: string;
        dialogSelector?: string;
        timeout?: number;
        retries?: number;
        animationWait?: number;
    }): Promise<void> {
        await this.stability.closeDialog(options);
    }

    /**
     * Close dialog using Abbrechen button
     * @param options - Close options
     */
    protected async closeDialogWithCancel(options?: {
        dialogSelector?: string;
        timeout?: number;
        retries?: number;
    }): Promise<void> {
        await this.stability.closeDialogWithCancel(options);
    }

    /**
     * Retry an action with custom verification
     * @param action - Action to perform
     * @param verify - Verification function
     * @param options - Retry options
     */
    protected async retryAction(
        action: () => Promise<void>,
        verify: () => Promise<void>,
        options?: { timeout?: number; intervals?: number[] }
    ): Promise<void> {
        await this.stability.retryAction(action, verify, options);
    }

    /**
     * Stable drag and drop
     * @param source - Source element
     * @param target - Target element
     * @param options - Drag options
     */
    protected async dragAndDrop(
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
        return await this.stability.stableDragAndDrop(source, target, options);
    }

    /**
     * Wait for element to be stable (not moving)
     * @param locator - Element to watch
     * @param options - Stability options
     */
    protected async waitForElementStability(
        locator: Locator,
        options?: {
            timeout?: number;
            checkInterval?: number;
            stableTime?: number;
        }
    ): Promise<void> {
        await this.stability.waitForElementStability(locator, options);
    }
}
