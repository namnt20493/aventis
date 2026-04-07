import { IControl } from "./IControl";

/**
 * Interface for date picker controls.
 * Extends IControl with date picker-specific actions.
 */
export interface IDatePicker extends IControl {
    // Date Entry
    setDate(date: Date, format?: string): Promise<void>;
    setDateString(dateString: string): Promise<void>;
    setToday(format?: string): Promise<void>;
    setRelativeDate(days: number, format?: string): Promise<void>;
    setFirstOfMonth(format?: string): Promise<void>;
    setLastOfMonth(format?: string): Promise<void>;
    setFirstOfYear(format?: string): Promise<void>;
    setLastOfYear(format?: string): Promise<void>;
    clear(): Promise<void>;

    // Date Picker Calendar
    openCalendar(toggleSelector?: string): Promise<void>;
    selectTodayFromCalendar(): Promise<void>;
    closeCalendar(): Promise<void>;

    // Get Value
    getValue(): Promise<string>;
    getDate(format?: string): Promise<Date | null>;
    hasValue(): Promise<boolean>;

    // Validation
    hasValidationError(): Promise<boolean>;
    getValidationError(): Promise<string | null>;

    // Validation Methods (Should*)
    shouldHaveValue(expected: string | RegExp, options?: { timeout?: number }): Promise<void>;
    shouldHaveDate(expected: Date, format?: string, options?: { timeout?: number }): Promise<void>;
    shouldBeEmpty(options?: { timeout?: number }): Promise<void>;
    shouldNotBeEmpty(options?: { timeout?: number }): Promise<void>;

    // Deprecated aliases (Async suffix)
    /** @deprecated Use setDate() instead */
    setDateAsync(date: Date, format?: string): Promise<void>;
    /** @deprecated Use setDateString() instead */
    setDateStringAsync(dateString: string): Promise<void>;
    /** @deprecated Use setToday() instead */
    setTodayAsync(format?: string): Promise<void>;
    /** @deprecated Use setRelativeDate() instead */
    setRelativeDateAsync(days: number, format?: string): Promise<void>;
    /** @deprecated Use setFirstOfMonth() instead */
    setFirstOfMonthAsync(format?: string): Promise<void>;
    /** @deprecated Use setLastOfMonth() instead */
    setLastOfMonthAsync(format?: string): Promise<void>;
    /** @deprecated Use setFirstOfYear() instead */
    setFirstOfYearAsync(format?: string): Promise<void>;
    /** @deprecated Use setLastOfYear() instead */
    setLastOfYearAsync(format?: string): Promise<void>;
    /** @deprecated Use clear() instead */
    clearAsync(): Promise<void>;
    /** @deprecated Use openCalendar() instead */
    openCalendarAsync(toggleSelector?: string): Promise<void>;
    /** @deprecated Use selectTodayFromCalendar() instead */
    selectTodayFromCalendarAsync(): Promise<void>;
    /** @deprecated Use closeCalendar() instead */
    closeCalendarAsync(): Promise<void>;
    /** @deprecated Use getValue() instead */
    getValueAsync(): Promise<string>;
    /** @deprecated Use getDate() instead */
    getDateAsync(format?: string): Promise<Date | null>;
    /** @deprecated Use hasValue() instead */
    hasValueAsync(): Promise<boolean>;
    /** @deprecated Use hasValidationError() instead */
    hasValidationErrorAsync(): Promise<boolean>;
    /** @deprecated Use getValidationError() instead */
    getValidationErrorAsync(): Promise<string | null>;
}
