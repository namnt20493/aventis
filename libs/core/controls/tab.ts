import { Page, Locator, expect } from "@playwright/test";
import { ControlBase } from "./control-base";
import { ITab, IServiceContext } from "@core/interfaces";
import { step } from "@core/decorators";

export class Tab extends ControlBase implements ITab {
    constructor(page: Page, locator: Locator, services?: IServiceContext, description?: string) {
        super(page, locator, services, description);
    }

    // ============================================================
    // Factory Methods
    // ============================================================

    static byTestId(page: Page, testId: string, services?: IServiceContext): Tab {
        return new Tab(page, page.getByTestId(testId), services, `Tab[testId="${testId}"]`);
    }

    static bySelector(page: Page, selector: string, services?: IServiceContext): Tab {
        return new Tab(page, page.locator(selector), services, `Tab[${selector}]`);
    }

    // ============================================================
    // Private Helpers
    // ============================================================

    private get tabLabels(): Locator {
        return this.locator.locator(".mat-tab-label, .mat-mdc-tab, [role='tab']");
    }

    private get activeTabLabel(): Locator {
        return this.locator.locator(".mat-tab-label-active, .mat-mdc-tab.mdc-tab--active, [role='tab'][aria-selected='true']");
    }

    private get tabPanel(): Locator {
        return this.locator.locator(".mat-tab-body-active, .mat-mdc-tab-body-active, [role='tabpanel']");
    }

    // ============================================================
    // Selection Methods (ITab)
    // ============================================================

    @step
    async selectByName(name: string | RegExp): Promise<void> {
        await this.executeWithContext("selectByName", async () => {
            const tab = typeof name === "string"
                ? this.tabLabels.filter({ hasText: name })
                : this.tabLabels.filter({ hasText: name });
            await tab.first().click();
        });
    }

    @step
    async selectByIndex(index: number): Promise<void> {
        await this.executeWithContext("selectByIndex", () => this.tabLabels.nth(index).click());
    }

    // ============================================================
    // State Methods (ITab)
    // ============================================================

    @step
    async getActiveTabName(): Promise<string> {
        return await this.executeWithContext("getActiveTabName", () => this.activeTabLabel.innerText());
    }

    @step
    async getTabNames(): Promise<string[]> {
        return await this.executeWithContext("getTabNames", () => this.tabLabels.allInnerTexts());
    }

    @step
    async getTabCount(): Promise<number> {
        return await this.executeWithContext("getTabCount", () => this.tabLabels.count());
    }

    // ============================================================
    // Validation Methods (ITab)
    // ============================================================

    @step
    async shouldBeSelected(name: string | RegExp, options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldBeSelected", () =>
            expect(this.activeTabLabel).toHaveText(name, options)
        );
    }

    @step
    async waitForTabPanelContent(timeout?: number): Promise<void> {
        await this.executeWithContext("waitForTabPanelContent", () =>
            this.tabPanel.first().waitFor({ state: "visible", timeout })
        );
    }
}
