import { IElementLocator } from "./ILocatorProvider";

/**
 * Options for stable click operations.
 */
export interface IStableClickOptions {
    timeout?: number;
    retries?: number;
    waitBefore?: number;
    waitAfter?: number;
    force?: boolean;
    triggerChangeDetection?: boolean;
    waitForEnabled?: number;
}

/**
 * Options for stable fill operations.
 */
export interface IStableFillOptions {
    timeout?: number;
    retries?: number;
    clearFirst?: boolean;
    validate?: boolean;
    triggerBlur?: boolean;
}

/**
 * Options for stable select operations.
 */
export interface IStableSelectOptions {
    exact?: boolean;
    timeout?: number;
    waitBefore?: number;
    waitAfter?: number;
    useRole?: boolean;
    triggerChangeDetection?: boolean;
}

/**
 * Options for stability waiting.
 */
export interface IStabilityOptions {
    timeout?: number;
    additionalWait?: number;
}

/**
 * Options for dialog operations.
 */
export interface IDialogOptions {
    closeButtonSelector?: string;
    dialogSelector?: string;
    timeout?: number;
}

/**
 * Options for table row click.
 */
export interface ITableRowClickOptions {
    timeout?: number;
    waitForData?: boolean;
}

/**
 * Options for drag and drop.
 */
export interface IDragAndDropOptions {
    timeout?: number;
    retries?: number;
    steps?: number;
    verifyMove?: (source: IElementLocator, target: IElementLocator) => Promise<boolean>;
}

/**
 * Interface for stability helper operations.
 * Abstracts Angular-specific stability handling.
 */
export interface IStabilityHelper {
    // Stability waits
    waitForPageStability(options?: IStabilityOptions): Promise<void>;
    waitForAngularStable(options?: IStabilityOptions): Promise<void>;

    // Stable interactions
    stableClick(locator: IElementLocator, options?: IStableClickOptions): Promise<void>;
    stableFill(locator: IElementLocator, value: string, options?: IStableFillOptions): Promise<void>;
    stableSelectOption(locator: IElementLocator, optionText: string, options?: IStableSelectOptions): Promise<void>;

    // Form operations
    stableFormSubmit(
        submitButton: IElementLocator,
        successIndicator: IElementLocator | (() => Promise<void>),
        options?: { timeout?: number; waitBeforeSubmit?: number; ensureEnabled?: boolean }
    ): Promise<void>;

    // Dialog operations
    closeDialog(options?: IDialogOptions): Promise<void>;
    closeDialogWithCancel(options?: { dialogSelector?: string; timeout?: number }): Promise<void>;

    // Table operations
    stableTableRowClick(
        tableLocator: IElementLocator,
        rowIdentifier: string | RegExp,
        options?: ITableRowClickOptions
    ): Promise<void>;

    // Drag and drop
    stableDragAndDrop(source: IElementLocator, target: IElementLocator, options?: IDragAndDropOptions): Promise<boolean>;
}
