import { Page, Locator, expect } from "@playwright/test";
import { NavigationPage } from "./navigation-page";
import { StabilityHelper } from "@utils/stability-helper";

export class KonfigPage {
    page: Page;
    private stabilityHelper: StabilityHelper;
    benutzerBtn: Locator;
    bearbeitenBtn: Locator;
    speichernBtn: Locator;
    abbrechenBtn: Locator;
    navigationPage: NavigationPage;
    constructor(page: Page) {
        this.page = page;
        this.stabilityHelper = new StabilityHelper(page);
        this.navigationPage = new NavigationPage(page);
        this.benutzerBtn = page.getByRole("tab", {
            name: /Benutzer\/in|Utilisateur·trice/i
        });
        this.bearbeitenBtn = page.getByRole("button", { name: /Bearbeiten|Modifier/i }).last();
        this.speichernBtn = page.getByRole("button", {
            name: /Speichern|Enregistrer/i
        });
        this.abbrechenBtn = page.getByRole("button", {
            name: /Abbrechen|Annuler/i
        });
    }
    async benutzerTag() {
        await this.benutzerBtn.click();
    }
    async selectRole(userName: string, role: string) {
        await this.page.getByRole("cell", { name: `${userName}` }).click({ delay: 1000 });
        await this.bearbeitenBtn.click();
        const rowElement = this.page.getByRole("row", { name: `${role}` });
        const labelElement = rowElement.getByLabel("");
        const isChecked = await labelElement.isChecked();
        if (!isChecked) {
            await labelElement.check();
            await this.stabilityHelper.stableClick(this.speichernBtn);
            //replace with waitForSpinnerToDisappear
            await this.navigationPage.waitForSpinnerToDisappear();
            await expect.soft(this.page.getByRole("option", { name: `${role}` })).toBeVisible();
        } else {
            await this.abbrechenBtn.click();
            await expect.soft(this.page.getByRole("option", { name: `${role}` })).toBeVisible();
        }
    }
}
