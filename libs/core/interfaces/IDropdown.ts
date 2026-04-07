import { IControl } from "./IControl";

/**
 * Select options for dropdown interactions.
 */
export interface IDropdownSelectOptions {
    exact?: boolean;
    timeout?: number;
    waitBefore?: number;
    waitAfter?: number;
    useRole?: boolean;
    triggerChangeDetection?: boolean;
}

/**
 * Interface for dropdown/select controls.
 * Extends IControl with dropdown-specific actions.
 */
export interface IDropdown extends IControl {
    // Select Actions (Standard Playwright)
    select(optionText: string, exact?: boolean, timeout?: number): Promise<void>;
    selectByIndex(index: number, timeout?: number): Promise<void>;
    typeAndSelect(searchText: string, optionText?: string, exact?: boolean, timeout?: number): Promise<void>;
    clear(): Promise<void>;

    // Select Actions with StabilityHelper (use for Angular apps)
    selectStable(optionText: string, options?: IDropdownSelectOptions): Promise<void>;

    // State & Value
    getSelectedText(): Promise<string>;
    getInputValue(): Promise<string>;
    hasSelection(): Promise<boolean>;
    getOptions(timeout?: number): Promise<string[]>;
    hasOption(optionText: string, timeout?: number): Promise<boolean>;
    getOptionCount(timeout?: number): Promise<number>;

    // Native Select
    selectByValue(value: string): Promise<void>;
    selectByLabel(label: string): Promise<void>;
    selectMultiple(...values: string[]): Promise<void>;

    // Validation Methods (Should*)
    shouldHaveSelected(expectedText: string | RegExp, options?: { timeout?: number }): Promise<void>;
    shouldHaveSelectedValue(expectedValue: string | RegExp, options?: { timeout?: number }): Promise<void>;
    shouldContainOption(optionText: string, options?: { timeout?: number }): Promise<void>;
    shouldHaveNoSelection(options?: { timeout?: number }): Promise<void>;

    // Deprecated aliases (Async suffix)
    /** @deprecated Use select() instead */
    selectAsync(optionText: string, exact?: boolean, timeout?: number): Promise<void>;
    /** @deprecated Use selectByIndex() instead */
    selectByIndexAsync(index: number, timeout?: number): Promise<void>;
    /** @deprecated Use typeAndSelect() instead */
    typeAndSelectAsync(searchText: string, optionText?: string, exact?: boolean, timeout?: number): Promise<void>;
    /** @deprecated Use clear() instead */
    clearAsync(): Promise<void>;
    /** @deprecated Use selectStable() instead */
    selectStableAsync(optionText: string, options?: IDropdownSelectOptions): Promise<void>;
    /** @deprecated Use getSelectedText() instead */
    getSelectedTextAsync(): Promise<string>;
    /** @deprecated Use getInputValue() instead */
    getInputValueAsync(): Promise<string>;
    /** @deprecated Use hasSelection() instead */
    hasSelectionAsync(): Promise<boolean>;
    /** @deprecated Use getOptions() instead */
    getOptionsAsync(timeout?: number): Promise<string[]>;
    /** @deprecated Use hasOption() instead */
    hasOptionAsync(optionText: string, timeout?: number): Promise<boolean>;
    /** @deprecated Use getOptionCount() instead */
    getOptionCountAsync(timeout?: number): Promise<number>;
    /** @deprecated Use selectByValue() instead */
    selectByValueAsync(value: string): Promise<void>;
    /** @deprecated Use selectByLabel() instead */
    selectByLabelAsync(label: string): Promise<void>;
    /** @deprecated Use selectMultiple() instead */
    selectMultipleAsync(...values: string[]): Promise<void>;
}
