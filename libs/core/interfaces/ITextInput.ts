import { IControl } from "./IControl";

/**
 * Fill options for text input interactions.
 */
export interface ITextInputFillOptions {
    timeout?: number;
    retries?: number;
    clearFirst?: boolean;
    validate?: boolean;
    triggerBlur?: boolean;
}

/**
 * Interface for text input controls.
 * Extends IControl with text input-specific actions.
 */
export interface ITextInput extends IControl {
    // Fill Operations (Standard Playwright)
    fill(value: string): Promise<void>;
    type(text: string, delay?: number): Promise<void>;
    fillIfEmpty(value: string): Promise<boolean>;
    fillDate(date: Date, format?: string): Promise<void>;
    fillDecimal(value: number, decimalPlaces?: number): Promise<void>;

    // Fill Operations with StabilityHelper (use for Angular apps)
    fillStable(value: string, options?: ITextInputFillOptions): Promise<void>;
    waitAndFillStable(value: string, timeout?: number): Promise<void>;

    // Clear Operations
    clear(): Promise<void>;
    clearWithKeyboard(): Promise<void>;
    clearAndFill(value: string): Promise<void>;

    // Get Operations
    getValue(): Promise<string>;
    getPlaceholder(): Promise<string | null>;
    getType(): Promise<string>;
    getMaxLength(): Promise<number | null>;

    // Validation State
    hasValue(expected: string): Promise<boolean>;
    isEmpty(): Promise<boolean>;
    isRequired(): Promise<boolean>;
    isReadOnly(): Promise<boolean>;
    hasValidationError(): Promise<boolean>;

    // Keyboard Operations
    pressKey(key: string): Promise<void>;
    fillAndSubmit(value: string): Promise<void>;
    fillAndTab(value: string): Promise<void>;

    // Focus Operations
    click(): Promise<void>;
    isFocused(): Promise<boolean>;
    selectAll(): Promise<void>;

    // Validation Methods (Should*)
    shouldHaveValue(expected: string | RegExp, options?: { timeout?: number }): Promise<void>;
    shouldHaveValueStartingWith(prefix: string, options?: { timeout?: number }): Promise<void>;
    shouldHaveValueContaining(text: string, options?: { timeout?: number }): Promise<void>;
    shouldBeEmpty(options?: { timeout?: number }): Promise<void>;
    shouldNotBeEmpty(options?: { timeout?: number }): Promise<void>;
    shouldHaveValueMatching(pattern: RegExp, options?: { timeout?: number }): Promise<void>;

    // Deprecated aliases (Async suffix)
    /** @deprecated Use fill() instead */
    fillAsync(value: string): Promise<void>;
    /** @deprecated Use type() instead */
    typeAsync(text: string, delay?: number): Promise<void>;
    /** @deprecated Use fillIfEmpty() instead */
    fillIfEmptyAsync(value: string): Promise<boolean>;
    /** @deprecated Use fillDate() instead */
    fillDateAsync(date: Date, format?: string): Promise<void>;
    /** @deprecated Use fillDecimal() instead */
    fillDecimalAsync(value: number, decimalPlaces?: number): Promise<void>;
    /** @deprecated Use fillStable() instead */
    fillStableAsync(value: string, options?: ITextInputFillOptions): Promise<void>;
    /** @deprecated Use waitAndFillStable() instead */
    waitAndFillStableAsync(value: string, timeout?: number): Promise<void>;
    /** @deprecated Use clear() instead */
    clearAsync(): Promise<void>;
    /** @deprecated Use clearWithKeyboard() instead */
    clearWithKeyboardAsync(): Promise<void>;
    /** @deprecated Use clearAndFill() instead */
    clearAndFillAsync(value: string): Promise<void>;
    /** @deprecated Use getValue() instead */
    getValueAsync(): Promise<string>;
    /** @deprecated Use getPlaceholder() instead */
    getPlaceholderAsync(): Promise<string | null>;
    /** @deprecated Use getType() instead */
    getTypeAsync(): Promise<string>;
    /** @deprecated Use getMaxLength() instead */
    getMaxLengthAsync(): Promise<number | null>;
    /** @deprecated Use hasValue() instead */
    hasValueAsync(expected: string): Promise<boolean>;
    /** @deprecated Use isEmpty() instead */
    isEmptyAsync(): Promise<boolean>;
    /** @deprecated Use isRequired() instead */
    isRequiredAsync(): Promise<boolean>;
    /** @deprecated Use isReadOnly() instead */
    isReadOnlyAsync(): Promise<boolean>;
    /** @deprecated Use hasValidationError() instead */
    hasValidationErrorAsync(): Promise<boolean>;
    /** @deprecated Use pressKey() instead */
    pressKeyAsync(key: string): Promise<void>;
    /** @deprecated Use fillAndSubmit() instead */
    fillAndSubmitAsync(value: string): Promise<void>;
    /** @deprecated Use fillAndTab() instead */
    fillAndTabAsync(value: string): Promise<void>;
    /** @deprecated Use click() instead */
    clickAsync(): Promise<void>;
    /** @deprecated Use isFocused() instead */
    isFocusedAsync(): Promise<boolean>;
    /** @deprecated Use selectAll() instead */
    selectAllAsync(): Promise<void>;
}
