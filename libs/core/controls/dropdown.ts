import { Page, Locator, expect } from "@playwright/test";
import { ControlBase } from "./control-base";
import { IDropdown, IDropdownSelectOptions, IServiceContext } from "@core/interfaces";
import { step } from "@core/decorators";

/**
 * Represents a dropdown/select control on the page.
 * Implements IDropdown interface with Playwright-specific logic.
 *
 * Supports Angular Material mat-select, native selects, and comboboxes.
 * All interaction methods use StabilityHelper internally for reliable Angular support.
 */
export class Dropdown extends ControlBase implements IDropdown {
    // ============================================================
    // Constructors
    // ============================================================

    constructor(page: Page, locator: Locator, services?: IServiceContext, description?: string) {
        super(page, locator, services, description);
    }

    // ============================================================
    // Factory Methods
    // ============================================================

    static byTestId(page: Page, testId: string, services?: IServiceContext): Dropdown {
        return new Dropdown(page, page.getByTestId(testId), services, `Dropdown[testId="${testId}"]`);
    }

    static byAngularTestId(page: Page, testId: string, services?: IServiceContext): Dropdown {
        return new Dropdown(page, page.getByTestId(testId).getByTestId("root-control"), services, `Dropdown[angularTestId="${testId}"]`);
    }

    static byLabel(page: Page, label: string, exact: boolean = false, services?: IServiceContext): Dropdown {
        return new Dropdown(page, page.getByLabel(label, { exact }), services, `Dropdown[label="${label}"]`);
    }

    static byRole(page: Page, name: string, exact: boolean = false, services?: IServiceContext): Dropdown {
        return new Dropdown(page, page.getByRole("combobox", { name, exact }), services, `Dropdown[role="${name}"]`);
    }

    static bySelector(page: Page, selector: string, services?: IServiceContext): Dropdown {
        return new Dropdown(page, page.locator(selector), services, `Dropdown[${selector}]`);
    }

    // ============================================================
    // Select Actions - Standard Playwright (IDropdown)
    // ============================================================

    @step
    async select(optionText: string, exact: boolean = false, timeout?: number): Promise<void> {
        await this.executeWithContext("select", async () => {
            await this.locator.click({ timeout });
            const option = this.page.getByRole("option", { name: optionText, exact });
            await option.waitFor({ state: "visible", timeout });
            await option.click({ timeout });
        });
    }

    @step
    async selectByIndex(index: number, timeout?: number): Promise<void> {
        await this.executeWithContext("selectByIndex", async () => {
            await this.locator.click({ timeout });
            const options = this.page.getByRole("option");
            await options.first().waitFor({ state: "visible", timeout });
            await options.nth(index).click({ timeout });
        });
    }

    @step
    async typeAndSelect(
        searchText: string,
        optionText?: string,
        exact: boolean = false,
        timeout?: number
    ): Promise<void> {
        await this.executeWithContext("typeAndSelect", async () => {
            optionText = optionText ?? searchText;
            await this.locator.fill(searchText);
            const option = this.page.getByRole("option", { name: optionText, exact });
            await option.waitFor({ state: "visible", timeout });
            await option.click({ timeout });
        });
    }

    @step
    async clear(): Promise<void> {
        await this.executeWithContext("clear", () => this.locator.clear());
    }

    // ============================================================
    // Select Actions - with StabilityHelper (IDropdown)
    // Use these for Angular apps where stability is needed
    // ============================================================

    @step
    async selectStable(optionText: string, options?: IDropdownSelectOptions): Promise<void> {
        await this.executeWithContext("selectStable", () => this.stability.stableSelectOption(this.locator, optionText, options));
    }

    // ============================================================
    // State & Value (IDropdown)
    // ============================================================

    @step
    async getSelectedText(): Promise<string> {
        return await this.executeWithContext("getSelectedText", () => this.locator.innerText());
    }

    @step
    async getInputValue(): Promise<string> {
        return await this.executeWithContext("getInputValue", () => this.locator.inputValue());
    }

    @step
    async hasSelection(): Promise<boolean> {
        return await this.executeWithContext("hasSelection", async () => {
            const text = await this.getSelectedText();
            return text.trim().length > 0;
        });
    }

    @step
    async getOptions(timeout?: number): Promise<string[]> {
        return await this.executeWithContext("getOptions", async () => {
            await this.locator.click({ timeout });
            const options = this.page.getByRole("option");
            await options.first().waitFor({ state: "visible", timeout });
            const allOptions = await options.allInnerTexts();
            await this.page.keyboard.press("Escape");
            return allOptions;
        });
    }

    @step
    async hasOption(optionText: string, timeout?: number): Promise<boolean> {
        return await this.executeWithContext("hasOption", async () => {
            const options = await this.getOptions(timeout);
            return options.some((o) => o.toLowerCase().includes(optionText.toLowerCase()));
        });
    }

    @step
    async getOptionCount(timeout?: number): Promise<number> {
        return await this.executeWithContext("getOptionCount", async () => {
            await this.locator.click({ timeout });
            const options = this.page.getByRole("option");
            await options.first().waitFor({ state: "visible", timeout });
            const count = await options.count();
            await this.page.keyboard.press("Escape");
            return count;
        });
    }

    // ============================================================
    // Native Select (IDropdown)
    // ============================================================

    @step
    async selectByValue(value: string): Promise<void> {
        await this.executeWithContext("selectByValue", () => this.locator.selectOption(value));
    }

    @step
    async selectByLabel(label: string): Promise<void> {
        await this.executeWithContext("selectByLabel", () => this.locator.selectOption({ label }));
    }

    @step
    async selectMultiple(...values: string[]): Promise<void> {
        await this.executeWithContext("selectMultiple", () => this.locator.selectOption(values));
    }

    // ============================================================
    // Validation Methods (IDropdown - Should*)
    // ============================================================

    @step
    async shouldHaveSelected(expectedText: string | RegExp, options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldHaveSelected", () => expect(this.locator).toContainText(expectedText, options));
    }

    @step
    async shouldHaveSelectedValue(expectedValue: string | RegExp, options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldHaveSelectedValue", () => expect(this.locator).toHaveValue(expectedValue, options));
    }

    @step
    async shouldContainOption(optionText: string, options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldContainOption", async () => {
            await this.locator.click();
            await expect(this.page.getByRole("option", { name: optionText })).toBeVisible(options);
            await this.page.keyboard.press("Escape");
        });
    }

    @step
    async shouldHaveNoSelection(options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldHaveNoSelection", () => expect(this.locator).toBeEmpty(options));
    }

    // ============================================================
    // Deprecated Aliases (Async suffix → delegates to new names)
    // ============================================================

    /** @deprecated Use select() instead */
    async selectAsync(optionText: string, exact?: boolean, timeout?: number): Promise<void> { return this.select(optionText, exact, timeout); }
    /** @deprecated Use selectByIndex() instead */
    async selectByIndexAsync(index: number, timeout?: number): Promise<void> { return this.selectByIndex(index, timeout); }
    /** @deprecated Use typeAndSelect() instead */
    async typeAndSelectAsync(searchText: string, optionText?: string, exact?: boolean, timeout?: number): Promise<void> { return this.typeAndSelect(searchText, optionText, exact, timeout); }
    /** @deprecated Use clear() instead */
    async clearAsync(): Promise<void> { return this.clear(); }
    /** @deprecated Use selectStable() instead */
    async selectStableAsync(optionText: string, options?: IDropdownSelectOptions): Promise<void> { return this.selectStable(optionText, options); }
    /** @deprecated Use getSelectedText() instead */
    async getSelectedTextAsync(): Promise<string> { return this.getSelectedText(); }
    /** @deprecated Use getInputValue() instead */
    async getInputValueAsync(): Promise<string> { return this.getInputValue(); }
    /** @deprecated Use hasSelection() instead */
    async hasSelectionAsync(): Promise<boolean> { return this.hasSelection(); }
    /** @deprecated Use getOptions() instead */
    async getOptionsAsync(timeout?: number): Promise<string[]> { return this.getOptions(timeout); }
    /** @deprecated Use hasOption() instead */
    async hasOptionAsync(optionText: string, timeout?: number): Promise<boolean> { return this.hasOption(optionText, timeout); }
    /** @deprecated Use getOptionCount() instead */
    async getOptionCountAsync(timeout?: number): Promise<number> { return this.getOptionCount(timeout); }
    /** @deprecated Use selectByValue() instead */
    async selectByValueAsync(value: string): Promise<void> { return this.selectByValue(value); }
    /** @deprecated Use selectByLabel() instead */
    async selectByLabelAsync(label: string): Promise<void> { return this.selectByLabel(label); }
    /** @deprecated Use selectMultiple() instead */
    async selectMultipleAsync(...values: string[]): Promise<void> { return this.selectMultiple(...values); }
}
