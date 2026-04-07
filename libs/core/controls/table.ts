import { Page, Locator, expect } from "@playwright/test";
import { ControlBase } from "./control-base";
import { ITable, ITableRow, IServiceContext } from "@core/interfaces";
import { step } from "@core/decorators";

class TableRow implements ITableRow {
    constructor(private readonly rowLocator: Locator) {}

    async click(): Promise<void> {
        await this.rowLocator.click();
    }

    async getText(): Promise<string> {
        return await this.rowLocator.innerText();
    }

    getCell(columnIndex: number): Locator {
        return this.rowLocator.locator("td, mat-cell, [role='gridcell']").nth(columnIndex);
    }

    getCellByText(text: string): Locator {
        return this.rowLocator.locator("td, mat-cell, [role='gridcell']").filter({ hasText: text });
    }
}

export class Table extends ControlBase implements ITable {
    constructor(page: Page, locator: Locator, services?: IServiceContext, description?: string) {
        super(page, locator, services, description);
    }

    // ============================================================
    // Factory Methods
    // ============================================================

    static byTestId(page: Page, testId: string, services?: IServiceContext): Table {
        return new Table(page, page.getByTestId(testId), services, `Table[testId="${testId}"]`);
    }

    static bySelector(page: Page, selector: string, services?: IServiceContext): Table {
        return new Table(page, page.locator(selector), services, `Table[${selector}]`);
    }

    static byRole(page: Page, services?: IServiceContext): Table {
        return new Table(page, page.getByRole("table"), services, `Table[role="table"]`);
    }

    // ============================================================
    // Private Helpers
    // ============================================================

    private get rowLocator(): Locator {
        return this.locator.locator("tbody tr, mat-row, [role='row']:not([role='row']:first-child)");
    }

    private get headerLocator(): Locator {
        return this.locator.locator("thead th, mat-header-cell, [role='columnheader']");
    }

    // ============================================================
    // Row Access Methods (ITable)
    // ============================================================

    @step
    async getRowCount(): Promise<number> {
        return await this.executeWithContext("getRowCount", () => this.rowLocator.count());
    }

    getRow(index: number): ITableRow {
        return new TableRow(this.rowLocator.nth(index));
    }

    @step
    async getRowByText(text: string, options?: { column?: number; timeout?: number }): Promise<ITableRow> {
        return await this.executeWithContext("getRowByText", async () => {
            const rows = this.rowLocator;
            let matchingRow: Locator;

            if (options?.column !== undefined) {
                matchingRow = rows.filter({
                    has: this.page.locator("td, mat-cell, [role='gridcell']").nth(options.column).filter({ hasText: text }),
                }).first();
            } else {
                matchingRow = rows.filter({ hasText: text }).first();
            }

            await matchingRow.waitFor({ state: "visible", timeout: options?.timeout });
            return new TableRow(matchingRow);
        });
    }

    @step
    async getAllRowTexts(): Promise<string[]> {
        return await this.executeWithContext("getAllRowTexts", () => this.rowLocator.allInnerTexts());
    }

    // ============================================================
    // Header Methods (ITable)
    // ============================================================

    @step
    async getHeaderTexts(): Promise<string[]> {
        return await this.executeWithContext("getHeaderTexts", () => this.headerLocator.allInnerTexts());
    }

    // ============================================================
    // Cell Access Methods (ITable)
    // ============================================================

    @step
    async getCellText(rowIndex: number, columnIndex: number): Promise<string> {
        return await this.executeWithContext("getCellText", async () => {
            const row = this.rowLocator.nth(rowIndex);
            const cell = row.locator("td, mat-cell, [role='gridcell']").nth(columnIndex);
            return await cell.innerText();
        });
    }

    // ============================================================
    // Validation Methods (ITable)
    // ============================================================

    @step
    async shouldHaveRowCount(count: number, options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldHaveRowCount", () =>
            expect(this.rowLocator).toHaveCount(count, options)
        );
    }

    @step
    async shouldContainRowWithText(text: string, options?: { timeout?: number }): Promise<void> {
        await this.executeWithContext("shouldContainRowWithText", () =>
            expect(this.rowLocator.filter({ hasText: text }).first()).toBeVisible(options)
        );
    }
}
