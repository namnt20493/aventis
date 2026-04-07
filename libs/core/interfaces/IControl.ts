/**
 * Base interface for all UI controls.
 * Defines common functionality that all controls must implement.
 *
 * This interface allows Page Objects to be Playwright-independent.
 */
import { Locator } from "@playwright/test";
export interface IControl {
    readonly description: string;
    readonly element: Locator;

    // State Methods
    isVisible(): Promise<boolean>;
    isEnabled(): Promise<boolean>;
    isDisabled(): Promise<boolean>;
    isEditable(): Promise<boolean>;

    // Attribute Methods
    getAttribute(name: string): Promise<string | null>;
    getInnerText(): Promise<string>;
    getTextContent(): Promise<string | null>;
    hasClass(className: string): Promise<boolean>;

    // Wait Methods
    waitForVisible(timeout?: number): Promise<void>;
    waitForHidden(timeout?: number): Promise<void>;
    waitForAttached(timeout?: number): Promise<void>;
    waitForDetached(timeout?: number): Promise<void>;
    waitForAngularStable(): Promise<void>;

    // Focus & Scroll Methods
    focus(): Promise<void>;
    blur(): Promise<void>;
    scrollIntoView(): Promise<void>;
    highlight(): Promise<void>;

    // Validation Methods (Should*)
    shouldBeVisible(options?: { timeout?: number }): Promise<void>;
    shouldBeHidden(options?: { timeout?: number }): Promise<void>;
    shouldBeAttached(options?: { timeout?: number }): Promise<void>;
    shouldBeEnabled(options?: { timeout?: number }): Promise<void>;
    shouldBeDisabled(options?: { timeout?: number }): Promise<void>;
    shouldBeEditable(options?: { timeout?: number }): Promise<void>;
    shouldBeReadOnly(options?: { timeout?: number }): Promise<void>;
    shouldBeFocused(options?: { timeout?: number }): Promise<void>;
    shouldHaveText(expected: string | RegExp, options?: { timeout?: number; ignoreCase?: boolean }): Promise<void>;
    shouldContainText(text: string | RegExp, options?: { timeout?: number; ignoreCase?: boolean }): Promise<void>;
    shouldHaveAttribute(name: string, value: string | RegExp, options?: { timeout?: number }): Promise<void>;
    shouldHaveClass(className: string | RegExp, options?: { timeout?: number }): Promise<void>;
    shouldHaveCss(name: string, value: string | RegExp, options?: { timeout?: number }): Promise<void>;
    shouldHaveCount(count: number, options?: { timeout?: number }): Promise<void>;

    // Deprecated aliases (Async suffix)
    /** @deprecated Use isVisible() instead */
    isVisibleAsync(): Promise<boolean>;
    /** @deprecated Use isEnabled() instead */
    isEnabledAsync(): Promise<boolean>;
    /** @deprecated Use isDisabled() instead */
    isDisabledAsync(): Promise<boolean>;
    /** @deprecated Use isEditable() instead */
    isEditableAsync(): Promise<boolean>;
    /** @deprecated Use getAttribute() instead */
    getAttributeAsync(name: string): Promise<string | null>;
    /** @deprecated Use getInnerText() instead */
    getInnerTextAsync(): Promise<string>;
    /** @deprecated Use getTextContent() instead */
    getTextContentAsync(): Promise<string | null>;
    /** @deprecated Use hasClass() instead */
    hasClassAsync(className: string): Promise<boolean>;
    /** @deprecated Use waitForVisible() instead */
    waitForVisibleAsync(timeout?: number): Promise<void>;
    /** @deprecated Use waitForHidden() instead */
    waitForHiddenAsync(timeout?: number): Promise<void>;
    /** @deprecated Use waitForAttached() instead */
    waitForAttachedAsync(timeout?: number): Promise<void>;
    /** @deprecated Use waitForDetached() instead */
    waitForDetachedAsync(timeout?: number): Promise<void>;
    /** @deprecated Use waitForAngularStable() instead */
    waitForAngularStableAsync(): Promise<void>;
    /** @deprecated Use focus() instead */
    focusAsync(): Promise<void>;
    /** @deprecated Use blur() instead */
    blurAsync(): Promise<void>;
    /** @deprecated Use scrollIntoView() instead */
    scrollIntoViewAsync(): Promise<void>;
    /** @deprecated Use highlight() instead */
    highlightAsync(): Promise<void>;
}
