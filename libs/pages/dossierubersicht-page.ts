import { Page, Locator, expect } from "@playwright/test";
import { NavigationPage } from "./navigation-page";
import { StabilityHelper } from "@utils/stability-helper";

export class DossierubersichtPage {
    page: Page;
    private stabilityHelper: StabilityHelper;
    navigation: NavigationPage;
    zustandigkeitBtn: Locator;
    txtBoxTeamSozial: Locator;
    txtBoxPersSozial: Locator;
    txtBoxteamSach: Locator;
    txtBoxPersSach: Locator;
    txtBoxGueltigAb: Locator;
    eintrUeberschrCheckBox: Locator;
    offeneAufgUebertrCheckBox: Locator;
    aktuelleZustTxtBox: Locator;
    neuZustTxtBox: Locator;
    gueltigAbTxtBox: Locator;
    dossierzustandigkeitAndernBtn: Locator;
    checkboxAll: Locator;

    constructor(page: Page) {
        this.page = page;
        this.stabilityHelper = new StabilityHelper(page);
        this.navigation = new NavigationPage(page);
        this.zustandigkeitBtn = page.locator(".primary.mdc-button.mdc-button--unelevated.mat-mdc-unelevated-button.mat-unthemed.mat-mdc-button-base");
        this.txtBoxTeamSozial = page.getByTestId("teamId_Sozialarbeit").getByTestId("root-control");
        this.txtBoxPersSozial = page.getByTestId("userId_Sozialarbeit").getByTestId("root-control");
        this.txtBoxteamSach = page.getByTestId("teamId_Sachbearbeitung").getByTestId("root-control");
        this.txtBoxPersSach = page.getByTestId("userId_Sachbearbeitung").getByTestId("root-control");
        this.txtBoxGueltigAb = page.getByTestId("aenderungAb").getByTestId("root-control");
        this.eintrUeberschrCheckBox = page.getByTestId("zukuenftigeUeberschreiben").getByRole("checkbox");
        this.offeneAufgUebertrCheckBox = page.getByTestId("aufgabenUebertragen").getByRole("checkbox");
        this.aktuelleZustTxtBox = page.getByTestId("userId_Bisher").getByTestId("root-control");
        this.neuZustTxtBox = page.getByTestId("userId_Neu").getByTestId("root-control");
        this.gueltigAbTxtBox = page.getByTestId("zustaendigkeit-ab").getByTestId("root-control");
        this.dossierzustandigkeitAndernBtn = page.getByTestId("button-import");
        this.checkboxAll = page.locator("thead tr th mat-checkbox input");
    }
    async openEditZustandig(zustBereich: string, menuSelect: string) {
        await this.navigation.closeBlockingDialog();
        const menuButton = this.page
            .locator("app-card-header")
            .filter({ hasText: `${zustBereich}` })
            .getByRole("button");
        await menuButton.waitFor({ state: "visible", timeout: 15000 });
        await this.stabilityHelper.stableClick(menuButton, {
            timeout: 10000,
            waitAfter: 500
        });
        // Menu items are rendered as menuitem role in Angular Material menus
        const menuItem = this.page.getByRole("menuitem", { name: `${menuSelect}` });
        await menuItem.waitFor({ state: "visible", timeout: 10000 });
        await this.stabilityHelper.stableClick(menuItem);
    }

    async editInfoDossierubersicht(teamSozial: string, persSozial: string, teamSach: string, persSach: string, gueltigAb: string, eintrUeberschrX: string, offeneAufgUebertrX: string) {
        await this.txtBoxTeamSozial.fill(teamSozial);
        await this.page.getByRole("option", { name: `${teamSozial}` }).click();
        await this.txtBoxPersSozial.fill(persSozial);
        await this.page.getByRole("option", { name: `${persSozial}` }).click();
        await this.txtBoxteamSach.fill(teamSach);
        await this.page.getByRole("option", { name: `${teamSach}` }).click();
        await this.txtBoxPersSach.fill(persSach);
        await this.page
            .getByRole("option", { name: `${persSach}` })
            .first()
            .click();
        await this.txtBoxGueltigAb.fill(gueltigAb);
        if (eintrUeberschrX === "") {
            await this.eintrUeberschrCheckBox.uncheck();
        } else {
            await this.eintrUeberschrCheckBox.check();
        }
        if (offeneAufgUebertrX === "") {
            await this.offeneAufgUebertrCheckBox.uncheck();
        } else {
            await this.offeneAufgUebertrCheckBox.check();
        }
        await this.zustandigkeitBtn.click();
    }
    async fillInfoDossierZustandigkeitAndern(aktuelleZust: string, neuZust: string, gueltigAb: string, eintrUeberschrX: string, offeneAufgUebertrX: string) {
        await this.aktuelleZustTxtBox.fill(aktuelleZust);
        await this.page.getByRole("option", { name: `${aktuelleZust}` }).click();
        await this.neuZustTxtBox.fill(neuZust);
        await this.page.getByRole("option", { name: `${neuZust}` }).click();
        await this.navigation.waitForPageReady();
        await this.page.waitForFunction(
            () => {
                const tbody = document.querySelector("tbody");
                return tbody && tbody.querySelectorAll("tr").length >= 1;
            },
            { timeout: 30000 }
        );
        await this.gueltigAbTxtBox.fill(gueltigAb);
        if (eintrUeberschrX === "") {
            await this.eintrUeberschrCheckBox.uncheck();
        } else {
            await this.eintrUeberschrCheckBox.check();
        }
        if (offeneAufgUebertrX === "") {
            await this.offeneAufgUebertrCheckBox.uncheck();
        } else {
            await this.offeneAufgUebertrCheckBox.check();
        }
        if (!(await this.checkboxAll.isChecked())) {
            await this.checkboxAll.click();
        }
        await expect(this.dossierzustandigkeitAndernBtn.first()).toBeEnabled({ timeout: 10000 });
        await this.stabilityHelper.stableClick(this.dossierzustandigkeitAndernBtn.first());
        await this.navigation.waitForPageReady();
    }
    async fillInfoDossierZustandigkeitAndern_Test(aktuelleZust: string, neuZust: string, gueltigAb: string, eintrUeberschrX: string, offeneAufgUebertrX: string) {
        await this.aktuelleZustTxtBox.fill(aktuelleZust);
        await this.page.getByRole("option", { name: `${aktuelleZust}` }).click();
        await this.neuZustTxtBox.fill(neuZust);
        await this.page.getByRole("option", { name: `${neuZust}` }).click();
        await this.navigation.waitForPageReady();
        await this.page.waitForFunction(
            () => {
                const tbody = document.querySelector("tbody");
                return tbody && tbody.querySelectorAll("tr").length >= 1;
            },
            { timeout: 30000 }
        );
        await this.gueltigAbTxtBox.fill(gueltigAb);
        if (eintrUeberschrX === "") {
            await this.eintrUeberschrCheckBox.uncheck();
        } else {
            await this.eintrUeberschrCheckBox.check();
        }
        if (offeneAufgUebertrX === "") {
            await this.offeneAufgUebertrCheckBox.uncheck();
        } else {
            await this.offeneAufgUebertrCheckBox.check();
        }
        await this.checkboxAll.click();
        await expect(this.dossierzustandigkeitAndernBtn.first()).toBeEnabled({ timeout: 10000 });
        await this.stabilityHelper.stableClick(this.dossierzustandigkeitAndernBtn.first());
        await this.navigation.waitForPageReady();
    }
}
