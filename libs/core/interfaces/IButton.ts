import { IControl } from "./IControl";

/**
 * Click options for button interactions.
 */
export interface IButtonClickOptions {
    timeout?: number;
    retries?: number;
    waitBefore?: number;
    waitAfter?: number;
    force?: boolean;
    triggerChangeDetection?: boolean;
    waitForEnabled?: number;
}

/**
 * Interface for button controls.
 * Extends IControl with button-specific actions.
 */
export interface IButton extends IControl {
    // Click Actions (Standard Playwright)
    click(): Promise<void>;
    forceClick(): Promise<void>;
    doubleClick(): Promise<void>;
    rightClick(): Promise<void>;
    hover(): Promise<void>;

    // Click Actions with StabilityHelper (use for Angular apps)
    clickStable(options?: IButtonClickOptions): Promise<void>;
    waitAndClickStable(timeout?: number): Promise<void>;
    clickAndWaitForNavigationStable(timeout?: number): Promise<void>;
    clickAndWaitForUrlStable(urlPattern: string | RegExp, timeout?: number): Promise<void>;
    clickAndWaitForLoadStateStable(state?: "load" | "domcontentloaded" | "networkidle", timeout?: number): Promise<void>;

    // State Properties
    getText(): Promise<string>;
    isPrimary(): Promise<boolean>;
    isFocused(): Promise<boolean>;
    getType(): Promise<string | null>;
    isSubmitButton(): Promise<boolean>;
    isLoading(): Promise<boolean>;

    // Deprecated aliases (Async suffix)
    /** @deprecated Use click() instead */
    clickAsync(): Promise<void>;
    /** @deprecated Use forceClick() instead */
    forceClickAsync(): Promise<void>;
    /** @deprecated Use doubleClick() instead */
    doubleClickAsync(): Promise<void>;
    /** @deprecated Use rightClick() instead */
    rightClickAsync(): Promise<void>;
    /** @deprecated Use hover() instead */
    hoverAsync(): Promise<void>;
    /** @deprecated Use clickStable() instead */
    clickStableAsync(options?: IButtonClickOptions): Promise<void>;
    /** @deprecated Use waitAndClickStable() instead */
    waitAndClickStableAsync(timeout?: number): Promise<void>;
    /** @deprecated Use clickAndWaitForNavigationStable() instead */
    clickAndWaitForNavigationStableAsync(timeout?: number): Promise<void>;
    /** @deprecated Use clickAndWaitForUrlStable() instead */
    clickAndWaitForUrlStableAsync(urlPattern: string | RegExp, timeout?: number): Promise<void>;
    /** @deprecated Use clickAndWaitForLoadStateStable() instead */
    clickAndWaitForLoadStateStableAsync(state?: "load" | "domcontentloaded" | "networkidle", timeout?: number): Promise<void>;
    /** @deprecated Use getText() instead */
    getTextAsync(): Promise<string>;
    /** @deprecated Use isPrimary() instead */
    isPrimaryAsync(): Promise<boolean>;
    /** @deprecated Use isFocused() instead */
    isFocusedAsync(): Promise<boolean>;
    /** @deprecated Use getType() instead */
    getTypeAsync(): Promise<string | null>;
    /** @deprecated Use isSubmitButton() instead */
    isSubmitButtonAsync(): Promise<boolean>;
    /** @deprecated Use isLoading() instead */
    isLoadingAsync(): Promise<boolean>;
}
