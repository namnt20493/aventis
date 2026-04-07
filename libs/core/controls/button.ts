import { Page, Locator, Response } from "@playwright/test";
import { ControlBase } from "./control-base";
import { IButton, IButtonClickOptions, IServiceContext } from "@core/interfaces";
import { step } from "@core/decorators";

/**
 * Represents a button control on the page.
 * Implements IButton interface with Playwright-specific logic.
 *
 * All interaction methods use StabilityHelper internally for reliable Angular support.
 */
export class Button extends ControlBase implements IButton {
    // ============================================================
    // Constructors
    // ============================================================

    constructor(page: Page, locator: Locator, services?: IServiceContext, description?: string) {
        super(page, locator, services, description);
    }

    // ============================================================
    // Factory Methods
    // ============================================================

    static byTestId(page: Page, testId: string, services?: IServiceContext): Button {
        return new Button(page, page.getByTestId(testId), services, `Button[testId="${testId}"]`);
    }

    static byName(page: Page, name: string, exact: boolean = false, services?: IServiceContext): Button {
        return new Button(page, page.getByRole("button", { name, exact }), services, `Button[name="${name}"]`);
    }

    static byText(page: Page, text: string, exact: boolean = false, services?: IServiceContext): Button {
        const escapedText = text.replace(/"/g, '\\"');
        const selector = exact ? `button:text-is("${escapedText}")` : `button:has-text("${escapedText}")`;
        return new Button(page, page.locator(selector), services, `Button[text="${text}"]`);
    }

    static byLabel(page: Page, label: string, services?: IServiceContext): Button {
        return new Button(page, page.getByLabel(label), services, `Button[label="${label}"]`);
    }

    static bySelector(page: Page, selector: string, services?: IServiceContext): Button {
        return new Button(page, page.locator(selector), services, `Button[${selector}]`);
    }

    static nth(page: Page, selector: string, index: number, services?: IServiceContext): Button {
        return new Button(page, page.locator(selector).nth(index), services, `Button[${selector}:nth(${index})]`);
    }

    // ============================================================
    // Click Actions - Standard Playwright (IButton)
    // ============================================================

    @step
    async click(): Promise<void> {
        await this.executeWithContext("click", () => this.locator.click());
    }

    @step
    async forceClick(): Promise<void> {
        await this.executeWithContext("forceClick", () => this.locator.click({ force: true }));
    }

    @step
    async doubleClick(): Promise<void> {
        await this.executeWithContext("doubleClick", () => this.locator.dblclick());
    }

    @step
    async rightClick(): Promise<void> {
        await this.executeWithContext("rightClick", () => this.locator.click({ button: "right" }));
    }

    @step
    async hover(): Promise<void> {
        await this.executeWithContext("hover", () => this.locator.hover());
    }

    // ============================================================
    // Click Actions - with StabilityHelper (IButton)
    // Use these for Angular apps where stability is needed
    // ============================================================

    @step
    async clickStable(options?: IButtonClickOptions): Promise<void> {
        await this.executeWithContext("clickStable", () => this.stability.stableClick(this.locator, options));
    }

    @step
    async waitAndClickStable(timeout?: number): Promise<void> {
        await this.executeWithContext("waitAndClickStable", async () => {
            await this.locator.waitFor({ state: "visible", timeout });
            await this.stability.stableClick(this.locator, { timeout });
        });
    }

    @step
    async clickAndWaitForNavigationStable(timeout?: number): Promise<void> {
        await this.executeWithContext("clickAndWaitForNavigationStable", async () => {
            const currentUrl = this.page.url();
            await this.stability.stableClick(this.locator, { timeout });
            await this.page.waitForURL((url) => url.toString() !== currentUrl, { timeout });
        });
    }

    @step
    async clickAndWaitForUrlStable(urlPattern: string | RegExp, timeout?: number): Promise<void> {
        await this.executeWithContext("clickAndWaitForUrlStable", async () => {
            await this.stability.stableClick(this.locator, { timeout });
            await this.page.waitForURL(urlPattern, { timeout });
        });
    }

    @step
    async clickAndWaitForLoadStateStable(
        state: "load" | "domcontentloaded" | "networkidle" = "networkidle",
        timeout?: number
    ): Promise<void> {
        await this.executeWithContext("clickAndWaitForLoadStateStable", async () => {
            await this.stability.stableClick(this.locator, { timeout });
            await this.page.waitForLoadState(state, { timeout });
        });
    }

    @step
    async clickAndWaitForResponseStable(
        urlPattern: string | RegExp | ((url: URL) => boolean),
        timeout?: number
    ): Promise<Response> {
        return await this.executeWithContext("clickAndWaitForResponseStable", async () => {
            const responsePromise = this.page.waitForResponse(
                (response) => {
                    if (typeof urlPattern === "string") {
                        return response.url().includes(urlPattern);
                    } else if (urlPattern instanceof RegExp) {
                        return urlPattern.test(response.url());
                    } else {
                        return urlPattern(new URL(response.url()));
                    }
                },
                { timeout }
            );

            await this.stability.stableClick(this.locator, { timeout });
            return await responsePromise;
        });
    }

    @step
    async clickAndWaitForRequestStable(urlPattern: string | RegExp, timeout?: number): Promise<void> {
        await this.executeWithContext("clickAndWaitForRequestStable", async () => {
            const requestPromise = this.page.waitForRequest(urlPattern, { timeout });
            await this.stability.stableClick(this.locator, { timeout });
            await requestPromise;
        });
    }

    // ============================================================
    // State Properties (IButton)
    // ============================================================

    @step
    async getText(): Promise<string> {
        return await this.executeWithContext("getText", () => this.locator.innerText());
    }

    @step
    async isPrimary(): Promise<boolean> {
        return await this.executeWithContext("isPrimary", async () => {
            return (
                (await this.hasClass("primary")) ||
                (await this.hasClass("mat-primary")) ||
                (await this.hasClass("btn-primary")) ||
                (await this.hasClass("mdc-button--raised"))
            );
        });
    }

    @step
    async isFocused(): Promise<boolean> {
        return await this.executeWithContext("isFocused", async () =>
            this.page.evaluate((el) => document.activeElement === el, await this.locator.elementHandle())
        );
    }

    @step
    async getType(): Promise<string | null> {
        return await this.executeWithContext("getType", () => this.locator.getAttribute("type"));
    }

    @step
    async isSubmitButton(): Promise<boolean> {
        return await this.executeWithContext("isSubmitButton", async () => {
            const type = await this.getType();
            return type?.toLowerCase() === "submit";
        });
    }

    @step
    async isLoading(): Promise<boolean> {
        return await this.executeWithContext("isLoading", async () => {
            return (
                (await this.hasClass("loading")) ||
                (await this.hasClass("is-loading")) ||
                (await this.hasClass("spinner")) ||
                (await this.locator.getAttribute("aria-busy")) === "true"
            );
        });
    }

    // ============================================================
    // Deprecated Aliases (Async suffix → delegates to new names)
    // ============================================================

    /** @deprecated Use click() instead */
    async clickAsync(): Promise<void> { return this.click(); }
    /** @deprecated Use forceClick() instead */
    async forceClickAsync(): Promise<void> { return this.forceClick(); }
    /** @deprecated Use doubleClick() instead */
    async doubleClickAsync(): Promise<void> { return this.doubleClick(); }
    /** @deprecated Use rightClick() instead */
    async rightClickAsync(): Promise<void> { return this.rightClick(); }
    /** @deprecated Use hover() instead */
    async hoverAsync(): Promise<void> { return this.hover(); }
    /** @deprecated Use clickStable() instead */
    async clickStableAsync(options?: IButtonClickOptions): Promise<void> { return this.clickStable(options); }
    /** @deprecated Use waitAndClickStable() instead */
    async waitAndClickStableAsync(timeout?: number): Promise<void> { return this.waitAndClickStable(timeout); }
    /** @deprecated Use clickAndWaitForNavigationStable() instead */
    async clickAndWaitForNavigationStableAsync(timeout?: number): Promise<void> { return this.clickAndWaitForNavigationStable(timeout); }
    /** @deprecated Use clickAndWaitForUrlStable() instead */
    async clickAndWaitForUrlStableAsync(urlPattern: string | RegExp, timeout?: number): Promise<void> { return this.clickAndWaitForUrlStable(urlPattern, timeout); }
    /** @deprecated Use clickAndWaitForLoadStateStable() instead */
    async clickAndWaitForLoadStateStableAsync(state?: "load" | "domcontentloaded" | "networkidle", timeout?: number): Promise<void> { return this.clickAndWaitForLoadStateStable(state, timeout); }
    /** @deprecated Use getText() instead */
    async getTextAsync(): Promise<string> { return this.getText(); }
    /** @deprecated Use isPrimary() instead */
    async isPrimaryAsync(): Promise<boolean> { return this.isPrimary(); }
    /** @deprecated Use isFocused() instead */
    async isFocusedAsync(): Promise<boolean> { return this.isFocused(); }
    /** @deprecated Use getType() instead */
    async getTypeAsync(): Promise<string | null> { return this.getType(); }
    /** @deprecated Use isSubmitButton() instead */
    async isSubmitButtonAsync(): Promise<boolean> { return this.isSubmitButton(); }
    /** @deprecated Use isLoading() instead */
    async isLoadingAsync(): Promise<boolean> { return this.isLoading(); }
}
