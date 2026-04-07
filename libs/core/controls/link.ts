import { Page, Locator } from "@playwright/test";
import { ControlBase } from "./control-base";
import { ILink, ILinkClickOptions, IServiceContext } from "@core/interfaces";
import { step } from "@core/decorators";

/**
 * Represents a link (anchor) control on the page.
 * Implements ILink interface with Playwright-specific logic.
 *
 * Provides navigation and click operations for hyperlinks.
 * All interaction methods use StabilityHelper internally for reliable Angular support.
 */
export class Link extends ControlBase implements ILink {
    // ============================================================
    // Constructors
    // ============================================================

    constructor(page: Page, locator: Locator, services?: IServiceContext, description?: string) {
        super(page, locator, services, description);
    }

    // ============================================================
    // Factory Methods
    // ============================================================

    static byTestId(page: Page, testId: string, services?: IServiceContext): Link {
        return new Link(page, page.getByTestId(testId), services, `Link[testId="${testId}"]`);
    }

    static byText(page: Page, text: string, exact: boolean = false, services?: IServiceContext): Link {
        return new Link(page, page.getByRole("link", { name: text, exact }), services, `Link[text="${text}"]`);
    }

    static byPattern(page: Page, pattern: RegExp, services?: IServiceContext): Link {
        return new Link(page, page.getByRole("link", { name: pattern }), services, `Link[pattern="${pattern}"]`);
    }

    static byHref(page: Page, href: string, services?: IServiceContext): Link {
        return new Link(page, page.locator(`a[href*='${href}']`), services, `Link[href="${href}"]`);
    }

    static bySelector(page: Page, selector: string, services?: IServiceContext): Link {
        return new Link(page, page.locator(selector), services, `Link[${selector}]`);
    }

    static nth(page: Page, selector: string, index: number, services?: IServiceContext): Link {
        return new Link(page, page.locator(selector).nth(index), services, `Link[${selector}:nth(${index})]`);
    }

    // ============================================================
    // Click Actions - Standard Playwright (ILink)
    // ============================================================

    @step
    async click(): Promise<void> {
        await this.executeWithContext("click", () => this.locator.click());
    }

    @step
    async hover(): Promise<void> {
        await this.executeWithContext("hover", () => this.locator.hover());
    }

    @step
    async clickAndOpenNewTab(timeout?: number): Promise<Page> {
        return await this.executeWithContext("clickAndOpenNewTab", async () => {
            const context = this.page.context();
            const pagePromise = context.waitForEvent("page", { timeout });
            await this.locator.click({ modifiers: ["Control"] });
            return await pagePromise;
        });
    }

    // ============================================================
    // Click Actions - with StabilityHelper (ILink)
    // Use these for Angular apps where stability is needed
    // ============================================================

    @step
    async clickStable(options?: ILinkClickOptions): Promise<void> {
        await this.executeWithContext("clickStable", () => this.stability.stableClick(this.locator, options));
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

    // ============================================================
    // Properties (ILink)
    // ============================================================

    @step
    async getHref(): Promise<string | null> {
        return await this.executeWithContext("getHref", () => this.getAttribute("href"));
    }

    @step
    async getTarget(): Promise<string | null> {
        return await this.executeWithContext("getTarget", () => this.getAttribute("target"));
    }

    @step
    async getText(): Promise<string> {
        return await this.executeWithContext("getText", () => this.getInnerText());
    }

    @step
    async opensInNewTab(): Promise<boolean> {
        return await this.executeWithContext("opensInNewTab", async () => {
            const target = await this.getTarget();
            return target === "_blank";
        });
    }

    @step
    async isExternal(): Promise<boolean> {
        return await this.executeWithContext("isExternal", async () => {
            const href = await this.getHref();
            return (
                href?.toLowerCase().startsWith("http://") === true || href?.toLowerCase().startsWith("https://") === true
            );
        });
    }

    @step
    async isInternal(): Promise<boolean> {
        return await this.executeWithContext("isInternal", async () => {
            const href = await this.getHref();
            if (!href) return false;
            return !href.toLowerCase().startsWith("http://") && !href.toLowerCase().startsWith("https://");
        });
    }

    @step
    async isMailto(): Promise<boolean> {
        return await this.executeWithContext("isMailto", async () => {
            const href = await this.getHref();
            return href?.toLowerCase().startsWith("mailto:") === true;
        });
    }

    @step
    async isTel(): Promise<boolean> {
        return await this.executeWithContext("isTel", async () => {
            const href = await this.getHref();
            return href?.toLowerCase().startsWith("tel:") === true;
        });
    }

    // ============================================================
    // Validation Methods (ILink - Should*)
    // ============================================================

    @step
    async shouldHaveHref(expected: string | RegExp, options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldHaveHref", () => this.shouldHaveAttribute("href", expected, options));
    }

    @step
    async shouldHaveLinkText(expected: string | RegExp, options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldHaveLinkText", () => this.shouldHaveText(expected, options));
    }

    @step
    async shouldOpenInNewTab(options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldOpenInNewTab", () => this.shouldHaveAttribute("target", "_blank", options));
    }

    // ============================================================
    // Deprecated Aliases (Async suffix → delegates to new names)
    // ============================================================

    /** @deprecated Use click() instead */
    async clickAsync(): Promise<void> { return this.click(); }
    /** @deprecated Use hover() instead */
    async hoverAsync(): Promise<void> { return this.hover(); }
    /** @deprecated Use clickAndOpenNewTab() instead */
    async clickAndOpenNewTabAsync(timeout?: number): Promise<Page> { return this.clickAndOpenNewTab(timeout); }
    /** @deprecated Use clickStable() instead */
    async clickStableAsync(options?: ILinkClickOptions): Promise<void> { return this.clickStable(options); }
    /** @deprecated Use clickAndWaitForNavigationStable() instead */
    async clickAndWaitForNavigationStableAsync(timeout?: number): Promise<void> { return this.clickAndWaitForNavigationStable(timeout); }
    /** @deprecated Use clickAndWaitForUrlStable() instead */
    async clickAndWaitForUrlStableAsync(urlPattern: string | RegExp, timeout?: number): Promise<void> { return this.clickAndWaitForUrlStable(urlPattern, timeout); }
    /** @deprecated Use getHref() instead */
    async getHrefAsync(): Promise<string | null> { return this.getHref(); }
    /** @deprecated Use getTarget() instead */
    async getTargetAsync(): Promise<string | null> { return this.getTarget(); }
    /** @deprecated Use getText() instead */
    async getTextAsync(): Promise<string> { return this.getText(); }
    /** @deprecated Use opensInNewTab() instead */
    async opensInNewTabAsync(): Promise<boolean> { return this.opensInNewTab(); }
    /** @deprecated Use isExternal() instead */
    async isExternalAsync(): Promise<boolean> { return this.isExternal(); }
    /** @deprecated Use isInternal() instead */
    async isInternalAsync(): Promise<boolean> { return this.isInternal(); }
    /** @deprecated Use isMailto() instead */
    async isMailtoAsync(): Promise<boolean> { return this.isMailto(); }
    /** @deprecated Use isTel() instead */
    async isTelAsync(): Promise<boolean> { return this.isTel(); }
}
