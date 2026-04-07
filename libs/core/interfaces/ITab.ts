import { IControl } from "./IControl";

export interface ITab extends IControl {
    selectByName(name: string | RegExp): Promise<void>;
    selectByIndex(index: number): Promise<void>;
    getActiveTabName(): Promise<string>;
    getTabNames(): Promise<string[]>;
    getTabCount(): Promise<number>;
    shouldBeSelected(name: string | RegExp, options?: { timeout?: number }): Promise<void>;
    waitForTabPanelContent(timeout?: number): Promise<void>;
}
