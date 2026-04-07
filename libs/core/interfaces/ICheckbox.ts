import { IControl } from "./IControl";

/**
 * Options for checkbox check/uncheck operations.
 */
export interface ICheckboxOptions {
    timeout?: number;
    force?: boolean;
}

/**
 * Interface for checkbox controls.
 * Extends IControl with checkbox-specific actions.
 */
export interface ICheckbox extends IControl {
    // Check Actions
    check(options?: ICheckboxOptions): Promise<void>;
    uncheck(options?: ICheckboxOptions): Promise<void>;
    toggle(): Promise<void>;
    setChecked(checked: boolean, options?: ICheckboxOptions): Promise<void>;
    checkIfNotChecked(): Promise<boolean>;
    uncheckIfChecked(): Promise<boolean>;

    // State
    isChecked(): Promise<boolean>;
    isIndeterminate(): Promise<boolean>;
    isRequired(): Promise<boolean>;

    // Wait Methods
    waitForChecked(timeout?: number): Promise<void>;
    waitForUnchecked(timeout?: number): Promise<void>;

    // Validation Methods (Should*)
    shouldBeChecked(options?: { timeout?: number }): Promise<void>;
    shouldBeUnchecked(options?: { timeout?: number }): Promise<void>;
    shouldBeIndeterminate(options?: { timeout?: number }): Promise<void>;

    // Deprecated aliases (Async suffix)
    /** @deprecated Use check() instead */
    checkAsync(options?: ICheckboxOptions): Promise<void>;
    /** @deprecated Use uncheck() instead */
    uncheckAsync(options?: ICheckboxOptions): Promise<void>;
    /** @deprecated Use toggle() instead */
    toggleAsync(): Promise<void>;
    /** @deprecated Use setChecked() instead */
    setCheckedAsync(checked: boolean, options?: ICheckboxOptions): Promise<void>;
    /** @deprecated Use checkIfNotChecked() instead */
    checkIfNotCheckedAsync(): Promise<boolean>;
    /** @deprecated Use uncheckIfChecked() instead */
    uncheckIfCheckedAsync(): Promise<boolean>;
    /** @deprecated Use isChecked() instead */
    isCheckedAsync(): Promise<boolean>;
    /** @deprecated Use isIndeterminate() instead */
    isIndeterminateAsync(): Promise<boolean>;
    /** @deprecated Use isRequired() instead */
    isRequiredAsync(): Promise<boolean>;
    /** @deprecated Use waitForChecked() instead */
    waitForCheckedAsync(timeout?: number): Promise<void>;
    /** @deprecated Use waitForUnchecked() instead */
    waitForUncheckedAsync(timeout?: number): Promise<void>;
}
