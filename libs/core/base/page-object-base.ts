import { Page, Locator } from "@playwright/test";
import { Button, TextInput, Dropdown, Checkbox, DatePicker, Link, Table, Tab } from "@core/controls";
import { IButton, ITextInput, IDropdown, ICheckbox, IDatePicker, ILink, ITable, ITab, IServiceContext, IStabilityService } from "@core/interfaces";
import { ServiceContext } from "@core/services";

/**
 * Base class for all Page Objects in the Aventis test framework.
 *
 * ARCHITECTURE RULES:
 * 1. Page Objects (classes extending this) should be Playwright-independent
 * 2. All public Control properties and methods use Interfaces (IButton, ITextInput, etc.)
 * 3. Playwright-specific logic is encapsulated in the Control implementations
 * 4. Page Objects should NOT use this.page directly for interactions - use Controls instead
 *
 * Factory methods return Interface types to maintain abstraction.
 * All interaction methods use StabilityHelper internally for reliable Angular support.
 */
export abstract class PageObjectBase {
    protected readonly page: Page;
    protected readonly services: IServiceContext;
    protected readonly stability: IStabilityService;

    constructor(page: Page, services?: IServiceContext) {
        this.page = page;
        this.services = services ?? ServiceContext.for(page);
        this.stability = this.services.stability;
    }

    // ============================================================
    // Control Factory Methods (return Interfaces for abstraction)
    // ============================================================

    protected button(testId: string): IButton {
        return Button.byTestId(this.page, testId, this.services);
    }

    protected buttonByName(name: string, exact: boolean = false): IButton {
        return Button.byName(this.page, name, exact, this.services);
    }

    protected buttonBySelector(selector: string): IButton {
        return Button.bySelector(this.page, selector, this.services);
    }

    protected buttonByText(text: string, exact: boolean = false): IButton {
        return Button.byText(this.page, text, exact, this.services);
    }

    protected textInput(testId: string): ITextInput {
        return TextInput.byTestId(this.page, testId, this.services);
    }

    protected angularTextInput(testId: string): ITextInput {
        return TextInput.byAngularTestId(this.page, testId, this.services);
    }

    protected textInputByLabel(label: string, exact: boolean = false): ITextInput {
        return TextInput.byLabel(this.page, label, exact, this.services);
    }

    protected textInputById(id: string): ITextInput {
        return TextInput.byId(this.page, id, this.services);
    }

    protected textInputBySelector(selector: string): ITextInput {
        return TextInput.bySelector(this.page, selector, this.services);
    }

    protected dropdown(testId: string): IDropdown {
        return Dropdown.byTestId(this.page, testId, this.services);
    }

    protected angularDropdown(testId: string): IDropdown {
        return Dropdown.byAngularTestId(this.page, testId, this.services);
    }

    protected dropdownByLabel(label: string, exact: boolean = false): IDropdown {
        return Dropdown.byLabel(this.page, label, exact, this.services);
    }

    protected checkbox(testId: string): ICheckbox {
        return Checkbox.byTestId(this.page, testId, this.services);
    }

    protected checkboxByLabel(label: string, exact: boolean = false): ICheckbox {
        return Checkbox.byLabel(this.page, label, exact, this.services);
    }

    protected datePicker(testId: string): IDatePicker {
        return DatePicker.byTestId(this.page, testId, this.services);
    }

    protected angularDatePicker(testId: string): IDatePicker {
        return DatePicker.byAngularTestId(this.page, testId, this.services);
    }

    protected datePickerByLabel(label: string, exact: boolean = false): IDatePicker {
        return DatePicker.byLabel(this.page, label, exact, this.services);
    }

    protected link(testId: string): ILink {
        return Link.byTestId(this.page, testId, this.services);
    }

    protected linkByText(text: string, exact: boolean = false): ILink {
        return Link.byText(this.page, text, exact, this.services);
    }

    protected linkBySelector(selector: string): ILink {
        return Link.bySelector(this.page, selector, this.services);
    }

    protected linkByPattern(pattern: RegExp): ILink {
        return Link.byPattern(this.page, pattern, this.services);
    }

    protected table(testId: string): ITable {
        return Table.byTestId(this.page, testId, this.services);
    }

    protected tableBySelector(selector: string): ITable {
        return Table.bySelector(this.page, selector, this.services);
    }

    protected tab(testId: string): ITab {
        return Tab.byTestId(this.page, testId, this.services);
    }

    protected tabBySelector(selector: string): ITab {
        return Tab.bySelector(this.page, selector, this.services);
    }

    // ============================================================
    // Page Wait Methods (use StabilityHelper internally)
    // ============================================================

    protected async waitForPageReady(options?: { timeout?: number; additionalWait?: number }): Promise<void> {
        await Promise.all([
            this.stability.waitForPageStability(options),
            this.stability.waitForAngularStable(options)
        ]);
    }

    protected async waitForAngularStable(options?: { timeout?: number }): Promise<void> {
        await this.stability.waitForAngularStable(options);
    }

    protected async waitForUrl(urlPattern: string | RegExp, timeout?: number): Promise<void> {
        await this.page.waitForURL(urlPattern, { timeout });
    }

    protected async forceFormUpdate(): Promise<void> {
        await this.stability.forceFormUpdate();
    }

    protected async triggerChangeDetection(): Promise<void> {
        await this.stability.triggerChangeDetection();
    }

    // ============================================================
    // Dialog Methods (use StabilityHelper internally)
    // ============================================================

    protected async waitForDialog(dialogSelector: string = "mat-dialog-container", timeout?: number): Promise<void> {
        await this.page.locator(dialogSelector).waitFor({ state: "visible", timeout });
    }

    protected async closeDialog(options?: {
        closeButtonSelector?: string;
        dialogSelector?: string;
        timeout?: number;
    }): Promise<void> {
        await this.stability.closeDialog(options);
    }

    protected async closeDialogWithCancel(options?: { dialogSelector?: string; timeout?: number }): Promise<void> {
        await this.stability.closeDialogWithCancel(options);
    }

    protected async isDialogOpen(dialogSelector: string = "mat-dialog-container"): Promise<boolean> {
        return await this.page.locator(dialogSelector).isVisible();
    }

    // ============================================================
    // Deprecated Aliases (Async suffix)
    // ============================================================

    /** @deprecated Use waitForPageReady() instead */
    protected async waitForPageReadyAsync(options?: { timeout?: number; additionalWait?: number }): Promise<void> { return this.waitForPageReady(options); }
    /** @deprecated Use waitForAngularStable() instead */
    protected async waitForAngularStableAsync(options?: { timeout?: number }): Promise<void> { return this.waitForAngularStable(options); }
    /** @deprecated Use waitForUrl() instead */
    protected async waitForUrlAsync(urlPattern: string | RegExp, timeout?: number): Promise<void> { return this.waitForUrl(urlPattern, timeout); }
    /** @deprecated Use waitForDialog() instead */
    protected async waitForDialogAsync(dialogSelector?: string, timeout?: number): Promise<void> { return this.waitForDialog(dialogSelector, timeout); }
    /** @deprecated Use closeDialog() instead */
    protected async closeDialogAsync(options?: { closeButtonSelector?: string; dialogSelector?: string; timeout?: number }): Promise<void> { return this.closeDialog(options); }
    /** @deprecated Use closeDialogWithCancel() instead */
    protected async closeDialogWithCancelAsync(options?: { dialogSelector?: string; timeout?: number }): Promise<void> { return this.closeDialogWithCancel(options); }
    /** @deprecated Use isDialogOpen() instead */
    protected async isDialogOpenAsync(dialogSelector?: string): Promise<boolean> { return this.isDialogOpen(dialogSelector); }

    // ============================================================
    // Low-level Locator Methods (for advanced use cases only)
    //
    // NOTE: Prefer using Controls (button, textInput, etc.) over these methods.
    // These are provided for edge cases where no Control fits.
    // ============================================================

    protected locator(selector: string): Locator {
        return this.page.locator(selector);
    }

    protected getByTestId(testId: string): Locator {
        return this.page.getByTestId(testId);
    }

    protected getByRole(
        role: "button" | "checkbox" | "combobox" | "link" | "textbox" | "option" | "row" | "cell" | "heading",
        options?: { name?: string | RegExp; exact?: boolean }
    ): Locator {
        return this.page.getByRole(role, options);
    }

    protected getByLabel(label: string, options?: { exact?: boolean }): Locator {
        return this.page.getByLabel(label, options);
    }

    protected getByText(text: string | RegExp, options?: { exact?: boolean }): Locator {
        return this.page.getByText(text, options);
    }
}
