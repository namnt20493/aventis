import { Page, Locator, expect } from "@playwright/test";
import { ControlBase } from "./control-base";
import { ICheckbox, ICheckboxOptions, IServiceContext } from "@core/interfaces";
import { step } from "@core/decorators";

/**
 * Represents a checkbox control on the page.
 * Implements ICheckbox interface with Playwright-specific logic.
 *
 * Supports Angular Material mat-checkbox and native checkboxes.
 * Based on Aventis TypeScript patterns for handling checkboxes.
 */
export class Checkbox extends ControlBase implements ICheckbox {
    // ============================================================
    // Constructors
    // ============================================================

    constructor(page: Page, locator: Locator, services?: IServiceContext, description?: string) {
        super(page, locator, services, description);
    }

    // ============================================================
    // Factory Methods
    // ============================================================

    static byTestId(page: Page, testId: string, services?: IServiceContext): Checkbox {
        return new Checkbox(page, page.getByTestId(testId), services, `Checkbox[testId="${testId}"]`);
    }

    static byLabel(page: Page, label: string, exact: boolean = false, services?: IServiceContext): Checkbox {
        return new Checkbox(page, page.getByLabel(label, { exact }), services, `Checkbox[label="${label}"]`);
    }

    static byRole(page: Page, name: string, exact: boolean = false, services?: IServiceContext): Checkbox {
        return new Checkbox(page, page.getByRole("checkbox", { name, exact }), services, `Checkbox[role="${name}"]`);
    }

    static byName(page: Page, name: string, services?: IServiceContext): Checkbox {
        return new Checkbox(page, page.locator(`input[type='checkbox'][name='${name}']`), services, `Checkbox[name="${name}"]`);
    }

    static bySelector(page: Page, selector: string, services?: IServiceContext): Checkbox {
        return new Checkbox(page, page.locator(selector), services, `Checkbox[${selector}]`);
    }

    // ============================================================
    // Check Actions (ICheckbox)
    // ============================================================

    @step
    async check(options?: ICheckboxOptions): Promise<void> {
        await this.executeWithContext("check", () => this.locator.check(options));
    }

    @step
    async uncheck(options?: ICheckboxOptions): Promise<void> {
        await this.executeWithContext("uncheck", () => this.locator.uncheck(options));
    }

    @step
    async toggle(): Promise<void> {
        await this.executeWithContext("toggle", () => this.locator.click());
    }

    @step
    async setChecked(checked: boolean, options?: ICheckboxOptions): Promise<void> {
        await this.executeWithContext("setChecked", () => this.locator.setChecked(checked, options));
    }

    @step
    async checkIfNotChecked(): Promise<boolean> {
        return await this.executeWithContext("checkIfNotChecked", async () => {
            const checked = await this.isChecked();
            if (!checked) {
                await this.check();
                return true;
            }
            return false;
        });
    }

    @step
    async uncheckIfChecked(): Promise<boolean> {
        return await this.executeWithContext("uncheckIfChecked", async () => {
            const checked = await this.isChecked();
            if (checked) {
                await this.uncheck();
                return true;
            }
            return false;
        });
    }

    // ============================================================
    // State (ICheckbox)
    // ============================================================

    @step
    async isChecked(): Promise<boolean> {
        return await this.executeWithContext("isChecked", () => this.locator.isChecked());
    }

    @step
    async isIndeterminate(): Promise<boolean> {
        return await this.executeWithContext("isIndeterminate", async () => {
            const indeterminate = await this.getAttribute("aria-checked");
            return indeterminate === "mixed";
        });
    }

    @step
    async isRequired(): Promise<boolean> {
        return await this.executeWithContext("isRequired", async () => {
            const required = await this.getAttribute("required");
            return required !== null;
        });
    }

    // ============================================================
    // Wait Methods (ICheckbox)
    // ============================================================

    @step
    async waitForChecked(timeout?: number): Promise<void> {
        await this.executeWithContext("waitForChecked", async () => {
            await this.locator.waitFor({ state: "attached", timeout });
            await expect(this.locator).toBeChecked({ timeout });
        });
    }

    @step
    async waitForUnchecked(timeout?: number): Promise<void> {
        await this.executeWithContext("waitForUnchecked", () => expect(this.locator).toBeChecked({ checked: false, timeout }));
    }

    // ============================================================
    // Validation Methods (ICheckbox - Should*)
    // ============================================================

    @step
    async shouldBeChecked(options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldBeChecked", () => expect(this.locator).toBeChecked(options));
    }

    @step
    async shouldBeUnchecked(options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldBeUnchecked", () => expect(this.locator).not.toBeChecked(options));
    }

    @step
    async shouldBeIndeterminate(options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldBeIndeterminate", () => expect(this.locator).toHaveAttribute("aria-checked", "mixed", options));
    }

    // ============================================================
    // Deprecated Aliases (Async suffix → delegates to new names)
    // ============================================================

    /** @deprecated Use check() instead */
    async checkAsync(options?: ICheckboxOptions): Promise<void> { return this.check(options); }
    /** @deprecated Use uncheck() instead */
    async uncheckAsync(options?: ICheckboxOptions): Promise<void> { return this.uncheck(options); }
    /** @deprecated Use toggle() instead */
    async toggleAsync(): Promise<void> { return this.toggle(); }
    /** @deprecated Use setChecked() instead */
    async setCheckedAsync(checked: boolean, options?: ICheckboxOptions): Promise<void> { return this.setChecked(checked, options); }
    /** @deprecated Use checkIfNotChecked() instead */
    async checkIfNotCheckedAsync(): Promise<boolean> { return this.checkIfNotChecked(); }
    /** @deprecated Use uncheckIfChecked() instead */
    async uncheckIfCheckedAsync(): Promise<boolean> { return this.uncheckIfChecked(); }
    /** @deprecated Use isChecked() instead */
    async isCheckedAsync(): Promise<boolean> { return this.isChecked(); }
    /** @deprecated Use isIndeterminate() instead */
    async isIndeterminateAsync(): Promise<boolean> { return this.isIndeterminate(); }
    /** @deprecated Use isRequired() instead */
    async isRequiredAsync(): Promise<boolean> { return this.isRequired(); }
    /** @deprecated Use waitForChecked() instead */
    async waitForCheckedAsync(timeout?: number): Promise<void> { return this.waitForChecked(timeout); }
    /** @deprecated Use waitForUnchecked() instead */
    async waitForUncheckedAsync(timeout?: number): Promise<void> { return this.waitForUnchecked(timeout); }
}
