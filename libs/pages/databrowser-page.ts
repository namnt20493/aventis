import { Page, Locator, expect } from "@playwright/test";
import { NavigationPage } from "./navigation-page";
import { CommonPage } from "./common-page";
import { LoginPage } from "./login-page";
import { StabilityHelper } from "@utils/stability-helper";

export class DataBrowserPage {
    page: Page;
    private stabilityHelper: StabilityHelper;
    commonPage: CommonPage;
    navigationPage: NavigationPage;
    dossierFuhrungMenu: Locator;
    auswertenMenu: Locator;
    databrowserMenu: Locator;
    databrowserMenuBtn: Locator;
    loginPage: LoginPage;
    constructor(page: Page) {
        this.page = page;
        this.stabilityHelper = new StabilityHelper(page);
        this.commonPage = new CommonPage(page);
        this.navigationPage = new NavigationPage(page);
        this.loginPage = new LoginPage(page);
        this.dossierFuhrungMenu = page.getByRole("menuitem", {
            name: /Dossierführung|Gestion des dossiers/i
        });
        this.auswertenMenu = page.locator("app-mega-menu a").filter({ hasText: /Auswerten|Évaluer/i });
        this.databrowserMenu = page.getByRole("button", {
            name: /Data Browser öffnen|Ouvrir le Data Browser/i
        });
        this.databrowserMenuBtn = page.locator("dx-toolbar div[role='button']").first();
    }
    async openDatabrowser(thema: string, fitlerName?: string, fitlerValue?: string, checkItemsEqualOrMore?: number) {
        await this.navigationPage.openMenuDropdown();
        await this.dossierFuhrungMenu.click();
        await this.auswertenMenu.click();
        const [newPage] = await Promise.all([this.page.context().waitForEvent("page"), this.databrowserMenu.click()]);

        await newPage.waitForLoadState("networkidle");
        this.page = newPage;
        this.databrowserMenuBtn = newPage.locator("dx-toolbar div[role='button']").first();
        //login if necessary
        await newPage.getByLabel("bern.sozialarbeiterin1a@diartis.ch").waitFor({ state: "visible", timeout: 10000 });
        await newPage.getByLabel("bern.sozialarbeiterin1a@diartis.ch").click();
        await this.databrowserMenuBtn.waitFor({ state: "visible", timeout: 10000 });
        await this.databrowserMenuBtn.click();
        // await newPage.getByRole('option', { name: `${thema}` }).waitFor({ state: 'visible', timeout: 5000 });
        await newPage.getByRole("option", { name: `${thema}` }).click();
        await newPage.locator(`tbody td:has-text("${fitlerName}")`).first().getByRole("button").click();
        await newPage.getByRole("textbox", { name: "Search" }).fill(fitlerValue ?? "");
        //catch error if no value found

        try {
            await newPage.locator("div[class*='dx-item dx-list-item']").filter({ hasText: fitlerValue }).first().waitFor({ state: "visible", timeout: 5000 });
            await newPage.locator("div[class*='dx-item dx-list-item']").filter({ hasText: fitlerValue }).first().click();
        } catch (error) {
            throw new Error(`Filter value "${fitlerValue}" not found in the list.`);
        }

        await newPage.locator("div[class='dx-list-items']").last().locator("div[class='dx-checkbox-container']").first().click();
        await newPage.getByRole("button", { name: "OK" }).click();

        const rowCount = await newPage.locator("tbody").last().locator("tr").count();

        await expect
            .soft(newPage.locator("tbody").last().locator("tr"), {
                message: `Databrowser should return at least ${checkItemsEqualOrMore} items for filter ${fitlerName} with value ${fitlerValue}`
            })
            .toHaveCount(rowCount);
        if (checkItemsEqualOrMore !== undefined && rowCount <= checkItemsEqualOrMore) {
            throw new Error(`Expected at least ${checkItemsEqualOrMore} rows, but got ${rowCount}`);
        }
    }
}
