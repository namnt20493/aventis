import { Page, Locator, expect } from "@playwright/test";
import { IControl, IServiceContext, IStabilityService } from "@core/interfaces";
import { ServiceContext } from "@core/services";
import { step } from "@core/decorators";

/**
 * Base class for all UI controls.
 * Implements IControl interface with Playwright-specific logic.
 *
 * Receives its dependencies (stability, etc.) via IServiceContext.
 * Falls back to ServiceContext.for(page) when no context is provided,
 * so static factory methods (Button.byTestId) continue to work.
 */
export abstract class ControlBase implements IControl {
    protected readonly page: Page;
    protected readonly locator: Locator;
    protected readonly stability: IStabilityService;
    readonly description: string;

    constructor(page: Page, locator: Locator, services?: IServiceContext, description?: string) {
        if (!page) throw new Error("Page is required");
        if (!locator) throw new Error("Locator is required");
        this.page = page;
        this.locator = locator;
        this.stability = (services ?? ServiceContext.for(page)).stability;
        this.description = description ?? `${this.constructor.name}[${locator.toString()}]`;
    }

    get element(): Locator {
        return this.locator;
    }

    // ============================================================
    // Error Context Helper
    // ============================================================

    protected async executeWithContext<T>(actionName: string, fn: () => Promise<T>): Promise<T> {
        try {
            return await fn();
        } catch (error) {
            const enrichedMessage = [
                `[${this.constructor.name}] ${actionName}() failed on "${this.description}"`,
                `  Element: ${this.locator.toString()}`,
                `  Page URL: ${this.page.url()}`,
                error instanceof Error ? `  Reason: ${error.message}` : `  Reason: ${String(error)}`,
            ].join("\n");

            const enrichedError = new Error(enrichedMessage);
            enrichedError.stack = error instanceof Error ? error.stack : undefined;
            throw enrichedError;
        }
    }

    // ============================================================
    // State Methods (IControl)
    // ============================================================

    @step
    async isVisible(): Promise<boolean> {
        return await this.executeWithContext("isVisible", () => this.locator.isVisible());
    }

    @step
    async isEnabled(): Promise<boolean> {
        return await this.executeWithContext("isEnabled", () => this.locator.isEnabled());
    }

    @step
    async isDisabled(): Promise<boolean> {
        return await this.executeWithContext("isDisabled", () => this.locator.isDisabled());
    }

    @step
    async isEditable(): Promise<boolean> {
        return await this.executeWithContext("isEditable", () => this.locator.isEditable());
    }

    @step
    async getAttribute(name: string): Promise<string | null> {
        return await this.executeWithContext("getAttribute", () => this.locator.getAttribute(name));
    }

    @step
    async getInnerText(): Promise<string> {
        return await this.executeWithContext("getInnerText", () => this.locator.innerText());
    }

    @step
    async getTextContent(): Promise<string | null> {
        return await this.executeWithContext("getTextContent", () => this.locator.textContent());
    }

    @step
    async hasClass(className: string): Promise<boolean> {
        return await this.executeWithContext("hasClass", async () => {
            const classes = (await this.locator.getAttribute("class")) || "";
            return classes.split(/\s+/).some((c) => c.toLowerCase() === className.toLowerCase());
        });
    }

    // ============================================================
    // Wait Methods (IControl)
    // ============================================================

    @step
    async waitForVisible(timeout?: number): Promise<void> {
        await this.executeWithContext("waitForVisible", () => this.locator.waitFor({ state: "visible", timeout }));
    }

    @step
    async waitForHidden(timeout?: number): Promise<void> {
        await this.executeWithContext("waitForHidden", () => this.locator.waitFor({ state: "hidden", timeout }));
    }

    @step
    async waitForAttached(timeout?: number): Promise<void> {
        await this.executeWithContext("waitForAttached", () => this.locator.waitFor({ state: "attached", timeout }));
    }

    @step
    async waitForDetached(timeout?: number): Promise<void> {
        await this.executeWithContext("waitForDetached", () => this.locator.waitFor({ state: "detached", timeout }));
    }

    @step
    async waitForAngularStable(): Promise<void> {
        await this.executeWithContext("waitForAngularStable", () => this.stability.waitForAngularStable());
    }

    // ============================================================
    // Focus & Scroll Methods (IControl)
    // ============================================================

    @step
    async focus(): Promise<void> {
        await this.executeWithContext("focus", () => this.locator.focus());
    }

    @step
    async blur(): Promise<void> {
        await this.executeWithContext("blur", () => this.locator.blur());
    }

    @step
    async scrollIntoView(): Promise<void> {
        await this.executeWithContext("scrollIntoView", () => this.locator.scrollIntoViewIfNeeded());
    }

    @step
    async highlight(): Promise<void> {
        await this.executeWithContext("highlight", () => this.locator.highlight());
    }

    // ============================================================
    // Validation Methods (IControl - Should*)
    // ============================================================

    @step
    async shouldBeVisible(options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldBeVisible", () => expect(this.locator).toBeVisible(options));
    }

    @step
    async shouldBeHidden(options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldBeHidden", () => expect(this.locator).toBeHidden(options));
    }

    @step
    async shouldBeAttached(options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldBeAttached", () => expect(this.locator).toBeAttached(options));
    }

    @step
    async shouldBeEnabled(options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldBeEnabled", () => expect(this.locator).toBeEnabled(options));
    }

    @step
    async shouldBeDisabled(options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldBeDisabled", () => expect(this.locator).toBeDisabled(options));
    }

    @step
    async shouldBeEditable(options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldBeEditable", () => expect(this.locator).toBeEditable(options));
    }

    @step
    async shouldBeReadOnly(options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldBeReadOnly", () => expect(this.locator).not.toBeEditable(options));
    }

    @step
    async shouldBeFocused(options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldBeFocused", () => expect(this.locator).toBeFocused(options));
    }

    @step
    async shouldHaveText(expected: string | RegExp, options?: { timeout?: number; ignoreCase?: boolean }): Promise<void> {
        await this.executeWithContext("shouldHaveText", () => expect(this.locator).toHaveText(expected, options));
    }

    @step
    async shouldContainText(text: string | RegExp, options?: { timeout?: number; ignoreCase?: boolean }): Promise<void> {
        await this.executeWithContext("shouldContainText", () => expect(this.locator).toContainText(text, options));
    }

    @step
    async shouldHaveAttribute(name: string, value: string | RegExp, options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldHaveAttribute", () => expect(this.locator).toHaveAttribute(name, value, options));
    }

    @step
    async shouldHaveClass(className: string | RegExp, options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldHaveClass", async () => {
            const pattern = typeof className === "string" ? new RegExp(`\\b${className}\\b`) : className;
            await expect(this.locator).toHaveClass(pattern, options);
        });
    }

    @step
    async shouldHaveCss(name: string, value: string | RegExp, options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldHaveCss", () => expect(this.locator).toHaveCSS(name, value, options));
    }

    @step
    async shouldHaveCount(count: number, options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldHaveCount", () => expect(this.locator).toHaveCount(count, options));
    }

    // ============================================================
    // Deprecated Aliases (Async suffix → delegates to new names)
    // ============================================================

    /** @deprecated Use isVisible() instead */
    async isVisibleAsync(): Promise<boolean> { return this.isVisible(); }
    /** @deprecated Use isEnabled() instead */
    async isEnabledAsync(): Promise<boolean> { return this.isEnabled(); }
    /** @deprecated Use isDisabled() instead */
    async isDisabledAsync(): Promise<boolean> { return this.isDisabled(); }
    /** @deprecated Use isEditable() instead */
    async isEditableAsync(): Promise<boolean> { return this.isEditable(); }
    /** @deprecated Use getAttribute() instead */
    async getAttributeAsync(name: string): Promise<string | null> { return this.getAttribute(name); }
    /** @deprecated Use getInnerText() instead */
    async getInnerTextAsync(): Promise<string> { return this.getInnerText(); }
    /** @deprecated Use getTextContent() instead */
    async getTextContentAsync(): Promise<string | null> { return this.getTextContent(); }
    /** @deprecated Use hasClass() instead */
    async hasClassAsync(className: string): Promise<boolean> { return this.hasClass(className); }
    /** @deprecated Use waitForVisible() instead */
    async waitForVisibleAsync(timeout?: number): Promise<void> { return this.waitForVisible(timeout); }
    /** @deprecated Use waitForHidden() instead */
    async waitForHiddenAsync(timeout?: number): Promise<void> { return this.waitForHidden(timeout); }
    /** @deprecated Use waitForAttached() instead */
    async waitForAttachedAsync(timeout?: number): Promise<void> { return this.waitForAttached(timeout); }
    /** @deprecated Use waitForDetached() instead */
    async waitForDetachedAsync(timeout?: number): Promise<void> { return this.waitForDetached(timeout); }
    /** @deprecated Use waitForAngularStable() instead */
    async waitForAngularStableAsync(): Promise<void> { return this.waitForAngularStable(); }
    /** @deprecated Use focus() instead */
    async focusAsync(): Promise<void> { return this.focus(); }
    /** @deprecated Use blur() instead */
    async blurAsync(): Promise<void> { return this.blur(); }
    /** @deprecated Use scrollIntoView() instead */
    async scrollIntoViewAsync(): Promise<void> { return this.scrollIntoView(); }
    /** @deprecated Use highlight() instead */
    async highlightAsync(): Promise<void> { return this.highlight(); }
}
