/**
 * Interface for providing element locators.
 * This abstracts the Playwright locator creation mechanism.
 *
 * Implementations of this interface handle the actual Playwright
 * interactions, keeping the Page Objects framework-independent.
 */
export interface ILocatorProvider {
    /**
     * Gets an element by its test ID (data-testid attribute).
     */
    getByTestId(testId: string): IElementLocator;

    /**
     * Gets an element by its role and optional accessible name.
     */
    getByRole(
        role: "button" | "checkbox" | "combobox" | "link" | "textbox" | "option" | "row" | "cell" | "heading" | "menuitem",
        options?: { name?: string | RegExp; exact?: boolean }
    ): IElementLocator;

    /**
     * Gets an element by its label text.
     */
    getByLabel(label: string, options?: { exact?: boolean }): IElementLocator;

    /**
     * Gets an element by its text content.
     */
    getByText(text: string | RegExp, options?: { exact?: boolean }): IElementLocator;

    /**
     * Gets an element by its placeholder text.
     */
    getByPlaceholder(placeholder: string, options?: { exact?: boolean }): IElementLocator;

    /**
     * Gets an element by CSS selector.
     */
    locator(selector: string): IElementLocator;

    /**
     * Gets the current URL.
     */
    url(): string;

    /**
     * Waits for a URL pattern.
     */
    waitForURL(urlPattern: string | RegExp | ((url: URL) => boolean), options?: { timeout?: number }): Promise<void>;

    /**
     * Waits for page load state.
     */
    waitForLoadState(state?: "load" | "domcontentloaded" | "networkidle", options?: { timeout?: number }): Promise<void>;

    /**
     * Waits for a timeout.
     */
    waitForTimeout(timeout: number): Promise<void>;

    /**
     * Presses a key on the keyboard.
     */
    keyboardPress(key: string): Promise<void>;

    /**
     * Evaluates JavaScript in the page context.
     */
    evaluate<T>(pageFunction: string | ((...args: unknown[]) => T), ...args: unknown[]): Promise<T>;
}

/**
 * Interface for element locators.
 * Abstracts Playwright's Locator type.
 */
export interface IElementLocator {
    // Navigation within locator
    getByTestId(testId: string): IElementLocator;
    locator(selector: string): IElementLocator;
    first(): IElementLocator;
    nth(index: number): IElementLocator;

    // State checks
    isVisible(options?: { timeout?: number }): Promise<boolean>;
    isEnabled(): Promise<boolean>;
    isDisabled(): Promise<boolean>;
    isEditable(): Promise<boolean>;
    isChecked(): Promise<boolean>;

    // Wait methods
    waitFor(options?: { state?: "attached" | "detached" | "visible" | "hidden"; timeout?: number }): Promise<void>;

    // Attribute methods
    getAttribute(name: string): Promise<string | null>;
    innerText(): Promise<string>;
    textContent(): Promise<string | null>;
    inputValue(): Promise<string>;
    count(): Promise<number>;
    allInnerTexts(): Promise<string[]>;

    // Actions
    click(options?: { force?: boolean; timeout?: number; button?: "left" | "right"; modifiers?: string[] }): Promise<void>;
    dblclick(options?: { timeout?: number }): Promise<void>;
    fill(value: string, options?: { timeout?: number }): Promise<void>;
    clear(options?: { timeout?: number }): Promise<void>;
    check(options?: { force?: boolean; timeout?: number }): Promise<void>;
    uncheck(options?: { force?: boolean; timeout?: number }): Promise<void>;
    setChecked(checked: boolean, options?: { force?: boolean; timeout?: number }): Promise<void>;
    selectOption(values: string | string[] | { label?: string; value?: string }): Promise<string[]>;
    pressSequentially(text: string, options?: { delay?: number }): Promise<void>;
    press(key: string): Promise<void>;
    hover(options?: { timeout?: number }): Promise<void>;
    focus(): Promise<void>;
    blur(): Promise<void>;
    scrollIntoViewIfNeeded(): Promise<void>;
    highlight(): Promise<void>;
}
