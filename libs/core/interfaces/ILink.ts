import { Page } from "@playwright/test";
import { IControl } from "./IControl";

/**
 * Click options for link interactions.
 */
export interface ILinkClickOptions {
    timeout?: number;
    retries?: number;
    waitBefore?: number;
    waitAfter?: number;
    force?: boolean;
}

/**
 * Interface for link (anchor) controls.
 * Extends IControl with link-specific actions.
 */
export interface ILink extends IControl {
    // Click Actions (Standard Playwright)
    click(): Promise<void>;
    hover(): Promise<void>;
    clickAndOpenNewTab(timeout?: number): Promise<Page>;

    // Click Actions with StabilityHelper (use for Angular apps)
    clickStable(options?: ILinkClickOptions): Promise<void>;
    clickAndWaitForNavigationStable(timeout?: number): Promise<void>;
    clickAndWaitForUrlStable(urlPattern: string | RegExp, timeout?: number): Promise<void>;

    // Properties
    getHref(): Promise<string | null>;
    getTarget(): Promise<string | null>;
    getText(): Promise<string>;
    opensInNewTab(): Promise<boolean>;
    isExternal(): Promise<boolean>;
    isInternal(): Promise<boolean>;
    isMailto(): Promise<boolean>;
    isTel(): Promise<boolean>;

    // Validation Methods (Should*)
    shouldHaveHref(expected: string | RegExp, options?: { timeout?: number }): Promise<void>;
    shouldHaveLinkText(expected: string | RegExp, options?: { timeout?: number }): Promise<void>;
    shouldOpenInNewTab(options?: { timeout?: number }): Promise<void>;

    // Deprecated aliases (Async suffix)
    /** @deprecated Use click() instead */
    clickAsync(): Promise<void>;
    /** @deprecated Use hover() instead */
    hoverAsync(): Promise<void>;
    /** @deprecated Use clickAndOpenNewTab() instead */
    clickAndOpenNewTabAsync(timeout?: number): Promise<Page>;
    /** @deprecated Use clickStable() instead */
    clickStableAsync(options?: ILinkClickOptions): Promise<void>;
    /** @deprecated Use clickAndWaitForNavigationStable() instead */
    clickAndWaitForNavigationStableAsync(timeout?: number): Promise<void>;
    /** @deprecated Use clickAndWaitForUrlStable() instead */
    clickAndWaitForUrlStableAsync(urlPattern: string | RegExp, timeout?: number): Promise<void>;
    /** @deprecated Use getHref() instead */
    getHrefAsync(): Promise<string | null>;
    /** @deprecated Use getTarget() instead */
    getTargetAsync(): Promise<string | null>;
    /** @deprecated Use getText() instead */
    getTextAsync(): Promise<string>;
    /** @deprecated Use opensInNewTab() instead */
    opensInNewTabAsync(): Promise<boolean>;
    /** @deprecated Use isExternal() instead */
    isExternalAsync(): Promise<boolean>;
    /** @deprecated Use isInternal() instead */
    isInternalAsync(): Promise<boolean>;
    /** @deprecated Use isMailto() instead */
    isMailtoAsync(): Promise<boolean>;
    /** @deprecated Use isTel() instead */
    isTelAsync(): Promise<boolean>;
}
