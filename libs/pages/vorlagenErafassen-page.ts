import { Page, Locator, expect } from "@playwright/test";
import * as assert from "assert";
import { NavigationPage } from "./navigation-page";
import { StabilityHelper } from "../utils/stability-helper";

export class VorlagenErafassenPage {
    page: Page;
    stabilityHelper: StabilityHelper;
    navigationPage: NavigationPage;
    vorlagenMenu: Locator;
    vorlagenErfassenMenuItem: Locator;
    vorlagebezeichnungInput: Locator;
    verwendungskontextSelect: Locator;
    vorlagenspracheSelect: Locator;
    gultigVonInput: Locator;
    gultigBisInput: Locator;
    erlauterungenInput: Locator;
    dossierregionSelect: Locator;
    speichernBtn: Locator;
    uploadSection: Locator;
    verwendungskontextSearchInput: Locator;
    vorlagenspracheSearchInput: Locator;
    gultigAmSearchInput: Locator;
    konfiguartionMenu: Locator;
    vorlagenErfassenBtn: Locator;
    sucheSearchInput: Locator;
    cellContaintInstitution!: Locator;
    cellContaintVorlagen: Locator;
    btnPopupMenu: Locator;
    constructor(page: Page) {
        this.page = page;
        this.stabilityHelper = new StabilityHelper(page);
        this.navigationPage = new NavigationPage(page);
        this.konfiguartionMenu = page.getByRole("menuitem", {
            name: /Konfiguration|Configuration/i
        });
        this.vorlagenMenu = page.locator("a.menu-subnode", { hasText: "Vorlagen" }).first();
        this.vorlagenErfassenMenuItem = page.getByRole("button", { name: /Vorlagen verwalten|Gérer les modèles/i }).first();
        this.vorlagenErfassenBtn = page.getByRole("link", {
            name: /Vorlagen erfassen|Saisir un modèle/i
        });
        this.vorlagebezeichnungInput = page.getByTestId("bezeichnung").getByTestId("root-control");
        this.verwendungskontextSelect = page.getByTestId("contextKey").getByTestId("root-control");
        this.vorlagenspracheSelect = page.getByTestId("sprache").getByTestId("root-control");
        this.gultigVonInput = page.getByTestId("validFrom").getByTestId("root-control");
        this.gultigBisInput = page.getByTestId("validThrough").getByTestId("root-control");
        this.erlauterungenInput = page.getByTestId("bemerkungen").getByTestId("root-control");
        this.dossierregionSelect = page.getByTestId("zugewieseneDossierregionIds").getByTestId("root-control");
        this.speichernBtn = page.getByRole("button", {
            name: /Speichern|Enregistrer/i
        });
        this.uploadSection = page.locator("app-file-upload-card input");
        this.verwendungskontextSearchInput = page.getByTestId("contextKeys").getByTestId("root-control");
        this.vorlagenspracheSearchInput = page.getByTestId("sprache").getByTestId("root-control");
        this.gultigAmSearchInput = page.getByTestId("gueltigkeit").getByTestId("root-control");
        this.sucheSearchInput = page.getByTestId("suchbegriff").getByTestId("root-control");
        this.cellContaintVorlagen = page.locator("tbody tr").first().locator("td").nth(1);
        this.btnPopupMenu = page.locator("button[aria-haspopup='menu']");
    }
    async deleteRowIfExists(vorlageBez: string, verwKontext: string, vorlageSprache: string): Promise<boolean> {
        if (vorlageBez !== "" && vorlageBez !== undefined && vorlageBez !== null && vorlageBez !== ``) {
            await this.sucheSearchInput.fill(vorlageBez);
        }
        await this.verwendungskontextSearchInput.click();
        await this.page.locator(`mat-option:has-text("${verwKontext}")`).first().click();
        await this.page.keyboard.press("Escape");
        await this.vorlagenspracheSearchInput.click();
        await this.page.locator(`mat-option:has-text("${vorlageSprache}")`).click();
        await this.navigationPage.waitForPageReady();

        let row = this.page.locator("tbody tr").filter({ hasText: verwKontext }).filter({ hasText: vorlageSprache });
        if (vorlageBez) {
            row = row.filter({ hasText: vorlageBez });
        }
        const rowCount = await row.count();
        if (rowCount === 0) {
            return false;
        }

        await this.stabilityHelper.stableClick(row.first().locator(".mat-mdc-menu-trigger"));
        await this.page.getByRole("button", { name: /Vorlage löschen|Supprimer/i }).click();
        await this.page
            .getByRole("button", { name: /Löschen|Supprimer/i })
            .last()
            .click();
        await this.navigationPage.waitForPageReady();
        return true;
    }
    async deleteRow(vorlageBez: string, verwKontext: string, vorlageSprache: string) {
        if (vorlageBez !== "" && vorlageBez !== undefined && vorlageBez !== null && vorlageBez !== ``) {
            await this.sucheSearchInput.fill(vorlageBez);
        }
        await this.verwendungskontextSearchInput.click();
        await this.page.locator(`mat-option:has-text("${verwKontext}")`).first().click();
        await this.page.keyboard.press("Escape");
        await this.vorlagenspracheSearchInput.click();
        await this.page.locator(`mat-option:has-text("${vorlageSprache}")`).click();
        await this.page.locator("tbody").waitFor({ state: "attached" });
        const row = this.page.locator(`tbody tr:has-text('${vorlageBez}'):has-text('${verwKontext}'):has-text('${vorlageSprache}')`);
        await this.stabilityHelper.stableClick(row.locator(".mat-mdc-menu-trigger"));
        await this.page.getByRole("button", { name: /Vorlage löschen|Supprimer/i }).click();
        await this.page
            .getByRole("button", { name: /Löschen|Supprimer/i })
            .last()
            .click();
        await this.navigationPage.waitForPageReady();
    }
    // go to vorlagen erfassen
    async goToVorlagenErfassen() {
        await this.stabilityHelper.stableClick(this.navigationPage.menuDropdown);
        await this.stabilityHelper.stableClick(this.konfiguartionMenu);
        await this.vorlagenMenu.click();
        await this.stabilityHelper.stableClick(this.vorlagenErfassenMenuItem);
        await this.navigationPage.waitForPageReady();
    }
    //create vorlagen
    async addNewVorlagen(datei: string, vorlageBez: string, verwKontext: string, vorlageSprache: string, gueltigVon: string, gueltigBis: string, erlauterungen: string, dossierRegion: string) {
        await this.vorlagenErfassenBtn.click();
        await this.vorlagebezeichnungInput.fill(vorlageBez);
        await this.verwendungskontextSelect.click();
        await this.page.locator(`mat-option:has-text("${verwKontext}")`).first().click();
        await this.vorlagenspracheSelect.last().click();
        await this.page.locator(`mat-option:has-text("${vorlageSprache}")`).first().click();
        await this.gultigVonInput.fill(gueltigVon);
        await this.gultigBisInput.fill(gueltigBis);
        await this.erlauterungenInput.fill(erlauterungen);
        await this.dossierregionSelect.click();
        const dossier = this.separateText(dossierRegion, ",");
        for (let i = 0; i < dossier.length; i++) {
            await this.page.locator(`mat-option:has-text("${dossier[i]}")`).click();
        }
        await this.page.keyboard.press("Escape");
        await this.uploadFile(datei);
        await this.stabilityHelper.stableClick(this.speichernBtn);
    }
    //seperate text
    separateText(text: string, separator: string): string[] {
        return text.split(separator);
    }

    // upload file
    async uploadFile(datei: string) {
        // if (datei !== '') {
        const fileChooserPromise = this.page.waitForEvent("filechooser");
        await this.page.getByTestId("file").click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(`${datei}`);
        // }
    }
    //search for new vorlagen
    async searchVorlagen(verwKontext: string, vorlageSprache: string, gultigVon: string, vorlageBez: string) {
        const isVisible = this.page.getByRole("button", { name: "Wiederholen" });
        try {
            await expect(isVisible).toBeVisible({ timeout: 5000 });
            await this.stabilityHelper.closeDialog();
            await this.stabilityHelper.closeDialogWithCancel();
            await this.sucheSearchInput.fill(vorlageBez);
            await this.verwendungskontextSearchInput.click();
            await this.page.locator(`mat-option:has-text("${verwKontext}")`).first().click();
            await this.page.keyboard.press("Escape");
            await this.vorlagenspracheSearchInput.click();
            await this.page.locator(`mat-option:has-text("${vorlageSprache}")`).click();
            await this.gultigAmSearchInput.fill(gultigVon);
            await this.validation(vorlageBez);
        } catch {
            await this.sucheSearchInput.fill(vorlageBez);
            await this.verwendungskontextSearchInput.click();
            await this.page.locator(`mat-option:has-text("${verwKontext}")`).first().click();
            await this.page.keyboard.press("Escape");
            await this.vorlagenspracheSearchInput.click();
            await this.page.locator(`mat-option:has-text("${vorlageSprache}")`).click();
            await this.gultigAmSearchInput.fill(gultigVon);
            await this.validation(vorlageBez);
        }
    }
    //validate new vorlagen
    async validation(vorlageBez: string) {
        await expect.soft(this.cellContaintVorlagen).toHaveText(vorlageBez);
    }
}
