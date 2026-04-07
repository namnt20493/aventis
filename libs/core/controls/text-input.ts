import { Page, Locator, expect } from "@playwright/test";
import { ControlBase } from "./control-base";
import { ITextInput, ITextInputFillOptions, IServiceContext } from "@core/interfaces";
import { step } from "@core/decorators";

/**
 * Represents a text input control on the page.
 * Implements ITextInput interface with Playwright-specific logic.
 *
 * All interaction methods use StabilityHelper internally for reliable Angular support.
 */
export class TextInput extends ControlBase implements ITextInput {
    // ============================================================
    // Constructors
    // ============================================================

    constructor(page: Page, locator: Locator, services?: IServiceContext, description?: string) {
        super(page, locator, services, description);
    }

    // ============================================================
    // Factory Methods
    // ============================================================

    static byTestId(page: Page, testId: string, services?: IServiceContext): TextInput {
        return new TextInput(page, page.getByTestId(testId), services, `TextInput[testId="${testId}"]`);
    }

    static byAngularTestId(page: Page, testId: string, services?: IServiceContext): TextInput {
        return new TextInput(page, page.getByTestId(testId).getByTestId("root-control"), services, `TextInput[angularTestId="${testId}"]`);
    }

    static byLabel(page: Page, label: string, exact: boolean = false, services?: IServiceContext): TextInput {
        return new TextInput(page, page.getByLabel(label, { exact }), services, `TextInput[label="${label}"]`);
    }

    static byPlaceholder(page: Page, placeholder: string, exact: boolean = false, services?: IServiceContext): TextInput {
        return new TextInput(page, page.getByPlaceholder(placeholder, { exact }), services, `TextInput[placeholder="${placeholder}"]`);
    }

    static byRole(page: Page, name: string, exact: boolean = false, services?: IServiceContext): TextInput {
        return new TextInput(page, page.getByRole("textbox", { name, exact }), services, `TextInput[role="${name}"]`);
    }

    static byName(page: Page, name: string, services?: IServiceContext): TextInput {
        return new TextInput(page, page.locator(`input[name="${name}"]`), services, `TextInput[name="${name}"]`);
    }

    static byId(page: Page, id: string, services?: IServiceContext): TextInput {
        return new TextInput(page, page.locator(`#${id}`), services, `TextInput[id="${id}"]`);
    }

    static bySelector(page: Page, selector: string, services?: IServiceContext): TextInput {
        return new TextInput(page, page.locator(selector), services, `TextInput[${selector}]`);
    }

    // ============================================================
    // Fill Operations - Standard Playwright (ITextInput)
    // ============================================================

    @step
    async fill(value: string): Promise<void> {
        await this.executeWithContext("fill", () => this.locator.fill(value));
    }

    @step
    async type(text: string, delay?: number): Promise<void> {
        await this.executeWithContext("type", () => this.locator.pressSequentially(text, { delay }));
    }

    @step
    async fillIfEmpty(value: string): Promise<boolean> {
        return await this.executeWithContext("fillIfEmpty", async () => {
            const currentValue = await this.getValue();
            if (!currentValue) {
                await this.fill(value);
                return true;
            }
            return false;
        });
    }

    @step
    async fillDate(date: Date, format: string = "dd.MM.yyyy"): Promise<void> {
        await this.executeWithContext("fillDate", async () => {
            const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const year = date.getFullYear().toString();

            let dateString = format;
            dateString = dateString.replace(/dd/gi, day);
            dateString = dateString.replace(/MM/g, month);
            dateString = dateString.replace(/yyyy/gi, year);

            await this.fill(dateString);
        });
    }

    @step
    async fillDecimal(value: number, decimalPlaces: number = 2): Promise<void> {
        await this.executeWithContext("fillDecimal", () => this.fill(value.toFixed(decimalPlaces)));
    }

    // ============================================================
    // Fill Operations - with StabilityHelper (ITextInput)
    // Use these for Angular apps where stability is needed
    // ============================================================

    @step
    async fillStable(value: string, options?: ITextInputFillOptions): Promise<void> {
        await this.executeWithContext("fillStable", () => this.stability.stableFill(this.locator, value, options));
    }

    @step
    async waitAndFillStable(value: string, timeout?: number): Promise<void> {
        await this.executeWithContext("waitAndFillStable", async () => {
            await this.locator.waitFor({ state: "visible", timeout });
            await this.stability.stableFill(this.locator, value, { timeout });
        });
    }

    // ============================================================
    // Clear Operations (ITextInput)
    // ============================================================

    @step
    async clear(): Promise<void> {
        await this.executeWithContext("clear", () => this.locator.clear());
    }

    @step
    async clearWithKeyboard(): Promise<void> {
        await this.executeWithContext("clearWithKeyboard", async () => {
            await this.locator.focus();
            await this.locator.press("Control+a");
            await this.locator.press("Delete");
        });
    }

    @step
    async clearAndFill(value: string): Promise<void> {
        await this.executeWithContext("clearAndFill", async () => {
            await this.clear();
            await this.fill(value);
        });
    }

    // ============================================================
    // Get Operations (ITextInput)
    // ============================================================

    @step
    async getValue(): Promise<string> {
        return await this.executeWithContext("getValue", () => this.locator.inputValue());
    }

    @step
    async getPlaceholder(): Promise<string | null> {
        return await this.executeWithContext("getPlaceholder", () => this.locator.getAttribute("placeholder"));
    }

    @step
    async getType(): Promise<string> {
        return await this.executeWithContext("getType", async () => {
            return (await this.locator.getAttribute("type")) ?? "text";
        });
    }

    @step
    async getMaxLength(): Promise<number | null> {
        return await this.executeWithContext("getMaxLength", async () => {
            const maxLength = await this.locator.getAttribute("maxlength");
            return maxLength ? parseInt(maxLength, 10) : null;
        });
    }

    // ============================================================
    // Validation State (ITextInput)
    // ============================================================

    @step
    async hasValue(expected: string): Promise<boolean> {
        return await this.executeWithContext("hasValue", async () => {
            const actual = await this.getValue();
            return actual === expected;
        });
    }

    @step
    async isEmpty(): Promise<boolean> {
        return await this.executeWithContext("isEmpty", async () => {
            const value = await this.getValue();
            return !value || value.length === 0;
        });
    }

    @step
    async isRequired(): Promise<boolean> {
        return await this.executeWithContext("isRequired", async () => {
            const required = await this.locator.getAttribute("required");
            return required !== null;
        });
    }

    @step
    async isReadOnly(): Promise<boolean> {
        return await this.executeWithContext("isReadOnly", async () => {
            const readOnly = await this.locator.getAttribute("readonly");
            return readOnly !== null;
        });
    }

    @step
    async hasValidationError(): Promise<boolean> {
        return await this.executeWithContext("hasValidationError", async () => {
            return (
                (await this.hasClass("ng-invalid")) ||
                (await this.hasClass("invalid")) ||
                (await this.hasClass("error")) ||
                (await this.hasClass("is-invalid")) ||
                (await this.hasClass("mat-form-field-invalid"))
            );
        });
    }

    // ============================================================
    // Keyboard Operations (ITextInput)
    // ============================================================

    @step
    async pressKey(key: string): Promise<void> {
        await this.executeWithContext("pressKey", () => this.locator.press(key));
    }

    @step
    async fillAndSubmit(value: string): Promise<void> {
        await this.executeWithContext("fillAndSubmit", async () => {
            await this.fill(value);
            await this.pressKey("Enter");
        });
    }

    @step
    async fillAndTab(value: string): Promise<void> {
        await this.executeWithContext("fillAndTab", async () => {
            await this.fill(value);
            await this.pressKey("Tab");
        });
    }

    // ============================================================
    // Focus Operations (ITextInput)
    // ============================================================

    @step
    async click(): Promise<void> {
        await this.executeWithContext("click", () => this.locator.click());
    }

    @step
    async isFocused(): Promise<boolean> {
        return await this.executeWithContext("isFocused", async () =>
            this.page.evaluate((el) => document.activeElement === el, await this.locator.elementHandle())
        );
    }

    @step
    async selectAll(): Promise<void> {
        await this.executeWithContext("selectAll", async () => {
            await this.locator.focus();
            await this.locator.press("Control+a");
        });
    }

    // ============================================================
    // Validation Methods (ITextInput - Should*)
    // ============================================================

    @step
    async shouldHaveValue(expected: string | RegExp, options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldHaveValue", () => expect(this.locator).toHaveValue(expected, options));
    }

    @step
    async shouldHaveValueStartingWith(prefix: string, options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldHaveValueStartingWith", () => {
            const pattern = new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
            return expect(this.locator).toHaveValue(pattern, options);
        });
    }

    @step
    async shouldHaveValueContaining(text: string, options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldHaveValueContaining", () => {
            const pattern = new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
            return expect(this.locator).toHaveValue(pattern, options);
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

    @step
    async shouldHaveValueMatching(pattern: RegExp, options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldHaveValueMatching", () => expect(this.locator).toHaveValue(pattern, options));
    }

    // ============================================================
    // Deprecated Aliases (Async suffix → delegates to new names)
    // ============================================================

    /** @deprecated Use fill() instead */
    async fillAsync(value: string): Promise<void> { return this.fill(value); }
    /** @deprecated Use type() instead */
    async typeAsync(text: string, delay?: number): Promise<void> { return this.type(text, delay); }
    /** @deprecated Use fillIfEmpty() instead */
    async fillIfEmptyAsync(value: string): Promise<boolean> { return this.fillIfEmpty(value); }
    /** @deprecated Use fillDate() instead */
    async fillDateAsync(date: Date, format?: string): Promise<void> { return this.fillDate(date, format); }
    /** @deprecated Use fillDecimal() instead */
    async fillDecimalAsync(value: number, decimalPlaces?: number): Promise<void> { return this.fillDecimal(value, decimalPlaces); }
    /** @deprecated Use fillStable() instead */
    async fillStableAsync(value: string, options?: ITextInputFillOptions): Promise<void> { return this.fillStable(value, options); }
    /** @deprecated Use waitAndFillStable() instead */
    async waitAndFillStableAsync(value: string, timeout?: number): Promise<void> { return this.waitAndFillStable(value, timeout); }
    /** @deprecated Use clear() instead */
    async clearAsync(): Promise<void> { return this.clear(); }
    /** @deprecated Use clearWithKeyboard() instead */
    async clearWithKeyboardAsync(): Promise<void> { return this.clearWithKeyboard(); }
    /** @deprecated Use clearAndFill() instead */
    async clearAndFillAsync(value: string): Promise<void> { return this.clearAndFill(value); }
    /** @deprecated Use getValue() instead */
    async getValueAsync(): Promise<string> { return this.getValue(); }
    /** @deprecated Use getPlaceholder() instead */
    async getPlaceholderAsync(): Promise<string | null> { return this.getPlaceholder(); }
    /** @deprecated Use getType() instead */
    async getTypeAsync(): Promise<string> { return this.getType(); }
    /** @deprecated Use getMaxLength() instead */
    async getMaxLengthAsync(): Promise<number | null> { return this.getMaxLength(); }
    /** @deprecated Use hasValue() instead */
    async hasValueAsync(expected: string): Promise<boolean> { return this.hasValue(expected); }
    /** @deprecated Use isEmpty() instead */
    async isEmptyAsync(): Promise<boolean> { return this.isEmpty(); }
    /** @deprecated Use isRequired() instead */
    async isRequiredAsync(): Promise<boolean> { return this.isRequired(); }
    /** @deprecated Use isReadOnly() instead */
    async isReadOnlyAsync(): Promise<boolean> { return this.isReadOnly(); }
    /** @deprecated Use hasValidationError() instead */
    async hasValidationErrorAsync(): Promise<boolean> { return this.hasValidationError(); }
    /** @deprecated Use pressKey() instead */
    async pressKeyAsync(key: string): Promise<void> { return this.pressKey(key); }
    /** @deprecated Use fillAndSubmit() instead */
    async fillAndSubmitAsync(value: string): Promise<void> { return this.fillAndSubmit(value); }
    /** @deprecated Use fillAndTab() instead */
    async fillAndTabAsync(value: string): Promise<void> { return this.fillAndTab(value); }
    /** @deprecated Use click() instead */
    async clickAsync(): Promise<void> { return this.click(); }
    /** @deprecated Use isFocused() instead */
    async isFocusedAsync(): Promise<boolean> { return this.isFocused(); }
    /** @deprecated Use selectAll() instead */
    async selectAllAsync(): Promise<void> { return this.selectAll(); }
}
