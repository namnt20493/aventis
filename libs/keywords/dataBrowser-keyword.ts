import { Page } from "@playwright/test";
import { DataBrowserPage } from "../pages/databrowser-page";
export class DataBrowserkeyword {
    page: Page;
    dataBrowserPage: DataBrowserPage;
    constructor(page: Page) {
        this.page = page;
        this.dataBrowserPage = new DataBrowserPage(page);
    }
    async DB01_DataBrowser_aufrufen({ thema, fitlerName, fitlerValue, checkItemsEqualOrMore }) {
        await this.dataBrowserPage.openDatabrowser(thema, fitlerName, fitlerValue, checkItemsEqualOrMore);
    }
}
