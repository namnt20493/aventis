import { Locator } from "@playwright/test";

export interface IStableClickOptions {
    timeout?: number;
    retries?: number;
    waitBefore?: number;
    waitAfter?: number;
    force?: boolean;
    triggerChangeDetection?: boolean;
    waitForEnabled?: number;
}

export interface IStableFillOptions {
    timeout?: number;
    retries?: number;
    clearFirst?: boolean;
    validate?: boolean;
    triggerBlur?: boolean;
}

export interface IStableSelectOptions {
    timeout?: number;
    waitBefore?: number;
    waitAfter?: number;
    useRole?: boolean;
    triggerChangeDetection?: boolean;
}

export interface ICloseDialogOptions {
    closeButtonSelector?: string;
    dialogSelector?: string;
    timeout?: number;
}

export interface IStabilityService {
    waitForPageStability(options?: { timeout?: number; additionalWait?: number }): Promise<void>;
    waitForAngularStable(options?: { timeout?: number }): Promise<void>;

    stableClick(locator: Locator, options?: IStableClickOptions): Promise<void>;
    stableFill(locator: Locator, value: string, options?: IStableFillOptions): Promise<void>;
    stableSelectOption(locator: Locator, optionName: string, options?: IStableSelectOptions): Promise<void>;

    stableFormSubmit(
        submitButton: Locator,
        successIndicator: Locator | (() => Promise<void>),
        options?: { timeout?: number; waitBeforeSubmit?: number; ensureEnabled?: boolean; triggerChangeDetection?: boolean }
    ): Promise<void>;

    closeDialog(options?: ICloseDialogOptions): Promise<void>;
    closeDialogWithCancel(options?: { dialogSelector?: string; timeout?: number }): Promise<void>;

    stableTableRowClick(
        tableLocator: Locator,
        rowIdentifier: string | RegExp,
        options?: { timeout?: number; waitForData?: boolean }
    ): Promise<void>;

    stableDragAndDrop(
        source: Locator,
        target: Locator,
        options?: { timeout?: number; retries?: number; steps?: number; verifyMove?: (source: Locator, target: Locator) => Promise<boolean> }
    ): Promise<boolean>;

    retryAction(
        action: () => Promise<void>,
        verify: () => Promise<void>,
        options?: { timeout?: number; intervals?: number[] }
    ): Promise<void>;

    forceFormUpdate(): Promise<void>;
    triggerChangeDetection(): Promise<void>;
}
