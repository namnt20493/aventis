import { Locator } from "@playwright/test";
import { IControl } from "./IControl";

export interface ITableRow {
    click(): Promise<void>;
    getText(): Promise<string>;
    getCell(columnIndex: number): Locator;
    getCellByText(text: string): Locator;
}

export interface ITable extends IControl {
    getRowCount(): Promise<number>;
    getRow(index: number): ITableRow;
    getRowByText(text: string, options?: { column?: number; timeout?: number }): Promise<ITableRow>;
    getAllRowTexts(): Promise<string[]>;
    getHeaderTexts(): Promise<string[]>;
    getCellText(rowIndex: number, columnIndex: number): Promise<string>;
    shouldHaveRowCount(count: number, options?: { timeout?: number }): Promise<void>;
    shouldContainRowWithText(text: string, options?: { timeout?: number }): Promise<void>;
}
