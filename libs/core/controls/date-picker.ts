import { Page, Locator, expect } from "@playwright/test";
import { ControlBase } from "./control-base";
import { IDatePicker, IServiceContext } from "@core/interfaces";
import { step } from "@core/decorators";

/**
 * Represents a date picker control on the page.
 * Implements IDatePicker interface with Playwright-specific logic.
 *
 * Supports Angular Material mat-datepicker and native date inputs.
 * Based on Aventis TypeScript patterns for handling date fields.
 * Dates in Aventis follow the Swiss format: DD.MM.YYYY.
 */
export class DatePicker extends ControlBase implements IDatePicker {
    static readonly DEFAULT_DATE_FORMAT = "dd.MM.yyyy";

    // ============================================================
    // Constructors
    // ============================================================

    constructor(page: Page, locator: Locator, services?: IServiceContext, description?: string) {
        super(page, locator, services, description);
    }

    // ============================================================
    // Factory Methods
    // ============================================================

    static byTestId(page: Page, testId: string, services?: IServiceContext): DatePicker {
        return new DatePicker(page, page.getByTestId(testId), services, `DatePicker[testId="${testId}"]`);
    }

    static byAngularTestId(page: Page, testId: string, services?: IServiceContext): DatePicker {
        return new DatePicker(page, page.getByTestId(testId).getByTestId("root-control"), services, `DatePicker[angularTestId="${testId}"]`);
    }

    static byLabel(page: Page, label: string, exact: boolean = false, services?: IServiceContext): DatePicker {
        return new DatePicker(page, page.getByLabel(label, { exact }), services, `DatePicker[label="${label}"]`);
    }

    static byPlaceholder(page: Page, placeholder: string, exact: boolean = false, services?: IServiceContext): DatePicker {
        return new DatePicker(page, page.getByPlaceholder(placeholder, { exact }), services, `DatePicker[placeholder="${placeholder}"]`);
    }

    static bySelector(page: Page, selector: string, services?: IServiceContext): DatePicker {
        return new DatePicker(page, page.locator(selector), services, `DatePicker[${selector}]`);
    }

    // ============================================================
    // Date Entry (IDatePicker)
    // ============================================================

    @step
    async setDate(date: Date, format?: string): Promise<void> {
        await this.executeWithContext("setDate", async () => {
            const dateString = this.formatDate(date, format);
            await this.locator.fill(dateString);
        });
    }

    @step
    async setDateString(dateString: string): Promise<void> {
        await this.executeWithContext("setDateString", () => this.locator.fill(dateString));
    }

    @step
    async setToday(format?: string): Promise<void> {
        await this.executeWithContext("setToday", () => this.setDate(new Date(), format));
    }

    @step
    async setRelativeDate(days: number, format?: string): Promise<void> {
        await this.executeWithContext("setRelativeDate", async () => {
            const date = new Date();
            date.setDate(date.getDate() + days);
            await this.setDate(date, format);
        });
    }

    @step
    async setFirstOfMonth(format?: string): Promise<void> {
        await this.executeWithContext("setFirstOfMonth", async () => {
            const today = new Date();
            const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            await this.setDate(firstOfMonth, format);
        });
    }

    @step
    async setLastOfMonth(format?: string): Promise<void> {
        await this.executeWithContext("setLastOfMonth", async () => {
            const today = new Date();
            const lastOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            await this.setDate(lastOfMonth, format);
        });
    }

    @step
    async setFirstOfYear(format?: string): Promise<void> {
        await this.executeWithContext("setFirstOfYear", async () => {
            const today = new Date();
            const firstOfYear = new Date(today.getFullYear(), 0, 1);
            await this.setDate(firstOfYear, format);
        });
    }

    @step
    async setLastOfYear(format?: string): Promise<void> {
        await this.executeWithContext("setLastOfYear", async () => {
            const today = new Date();
            const lastOfYear = new Date(today.getFullYear(), 11, 31);
            await this.setDate(lastOfYear, format);
        });
    }

    @step
    async clear(): Promise<void> {
        await this.executeWithContext("clear", () => this.locator.clear());
    }

    // ============================================================
    // Date Picker Calendar (IDatePicker)
    // ============================================================

    @step
    async openCalendar(toggleSelector?: string): Promise<void> {
        await this.executeWithContext("openCalendar", async () => {
            if (toggleSelector) {
                await this.page.click(toggleSelector);
            } else {
                const parent = this.locator.locator("..");
                const toggle = parent.locator(
                    "button[aria-label*='calendar'], mat-datepicker-toggle button, button[matSuffix]"
                );

                if (await toggle.isVisible()) {
                    await toggle.click();
                } else {
                    await this.locator.click();
                }
            }
        });
    }

    @step
    async selectTodayFromCalendar(): Promise<void> {
        await this.executeWithContext("selectTodayFromCalendar", async () => {
            const todayButton = this.page.locator(".mat-calendar-body-today, [aria-current='date']");
            await todayButton.click();
        });
    }

    @step
    async closeCalendar(): Promise<void> {
        await this.executeWithContext("closeCalendar", () => this.page.keyboard.press("Escape"));
    }

    // ============================================================
    // Get Value (IDatePicker)
    // ============================================================

    @step
    async getValue(): Promise<string> {
        return await this.executeWithContext("getValue", () => this.locator.inputValue());
    }

    @step
    async getDate(format?: string): Promise<Date | null> {
        return await this.executeWithContext("getDate", async () => {
            const value = await this.getValue();

            if (!value || value.trim().length === 0) {
                return null;
            }

            return this.parseDate(value, format);
        });
    }

    @step
    async hasValue(): Promise<boolean> {
        return await this.executeWithContext("hasValue", async () => {
            const value = await this.getValue();
            return value.trim().length > 0;
        });
    }

    // ============================================================
    // Validation (IDatePicker)
    // ============================================================

    @step
    async hasValidationError(): Promise<boolean> {
        return await this.executeWithContext("hasValidationError", async () => {
            const hasError = await this.getAttribute("aria-invalid");
            if (hasError === "true") {
                return true;
            }

            const parent = this.locator.locator("xpath=ancestor::mat-form-field");
            if ((await parent.count()) > 0) {
                const classes = await parent.getAttribute("class");
                return classes?.includes("mat-form-field-invalid") === true;
            }

            return false;
        });
    }

    @step
    async getValidationError(): Promise<string | null> {
        return await this.executeWithContext("getValidationError", async () => {
            const parent = this.locator.locator("xpath=ancestor::mat-form-field");
            const error = parent.locator("mat-error");

            if ((await error.count()) > 0) {
                return await error.first().textContent();
            }

            return null;
        });
    }

    // ============================================================
    // Validation Methods (IDatePicker - Should*)
    // ============================================================

    @step
    async shouldHaveValue(expected: string | RegExp, options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldHaveValue", () => expect(this.locator).toHaveValue(expected, options));
    }

    @step
    async shouldHaveDate(expected: Date, format?: string, options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldHaveDate", async () => {
            const expectedString = this.formatDate(expected, format);
            await expect(this.locator).toHaveValue(expectedString, options);
        });
    }

    @step
    async shouldBeEmpty(options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldBeEmpty", () => expect(this.locator).toBeEmpty(options));
    }

    @step
    async shouldNotBeEmpty(options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldNotBeEmpty", () => expect(this.locator).not.toBeEmpty(options));
    }

    // ============================================================
    // Private Helper Methods
    // ============================================================

    private formatDate(date: Date, format?: string): string {
        format = format ?? DatePicker.DEFAULT_DATE_FORMAT;

        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear().toString();

        let result = format;
        result = result.replace(/dd/gi, day);
        result = result.replace(/MM/g, month);
        result = result.replace(/yyyy/gi, year);

        return result;
    }

    private parseDate(value: string, format?: string): Date | null {
        format = format ?? DatePicker.DEFAULT_DATE_FORMAT;

        const parts = value.split(".");
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);

            if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                const date = new Date(year, month, day);
                if (date.getDate() === day && date.getMonth() === month && date.getFullYear() === year) {
                    return date;
                }
            }
        }

        const parsed = new Date(value);
        return isNaN(parsed.getTime()) ? null : parsed;
    }

    // ============================================================
    // Deprecated Aliases (Async suffix → delegates to new names)
    // ============================================================

    /** @deprecated Use setDate() instead */
    async setDateAsync(date: Date, format?: string): Promise<void> { return this.setDate(date, format); }
    /** @deprecated Use setDateString() instead */
    async setDateStringAsync(dateString: string): Promise<void> { return this.setDateString(dateString); }
    /** @deprecated Use setToday() instead */
    async setTodayAsync(format?: string): Promise<void> { return this.setToday(format); }
    /** @deprecated Use setRelativeDate() instead */
    async setRelativeDateAsync(days: number, format?: string): Promise<void> { return this.setRelativeDate(days, format); }
    /** @deprecated Use setFirstOfMonth() instead */
    async setFirstOfMonthAsync(format?: string): Promise<void> { return this.setFirstOfMonth(format); }
    /** @deprecated Use setLastOfMonth() instead */
    async setLastOfMonthAsync(format?: string): Promise<void> { return this.setLastOfMonth(format); }
    /** @deprecated Use setFirstOfYear() instead */
    async setFirstOfYearAsync(format?: string): Promise<void> { return this.setFirstOfYear(format); }
    /** @deprecated Use setLastOfYear() instead */
    async setLastOfYearAsync(format?: string): Promise<void> { return this.setLastOfYear(format); }
    /** @deprecated Use clear() instead */
    async clearAsync(): Promise<void> { return this.clear(); }
    /** @deprecated Use openCalendar() instead */
    async openCalendarAsync(toggleSelector?: string): Promise<void> { return this.openCalendar(toggleSelector); }
    /** @deprecated Use selectTodayFromCalendar() instead */
    async selectTodayFromCalendarAsync(): Promise<void> { return this.selectTodayFromCalendar(); }
    /** @deprecated Use closeCalendar() instead */
    async closeCalendarAsync(): Promise<void> { return this.closeCalendar(); }
    /** @deprecated Use getValue() instead */
    async getValueAsync(): Promise<string> { return this.getValue(); }
    /** @deprecated Use getDate() instead */
    async getDateAsync(format?: string): Promise<Date | null> { return this.getDate(format); }
    /** @deprecated Use hasValue() instead */
    async hasValueAsync(): Promise<boolean> { return this.hasValue(); }
    /** @deprecated Use hasValidationError() instead */
    async hasValidationErrorAsync(): Promise<boolean> { return this.hasValidationError(); }
    /** @deprecated Use getValidationError() instead */
    async getValidationErrorAsync(): Promise<string | null> { return this.getValidationError(); }
}
