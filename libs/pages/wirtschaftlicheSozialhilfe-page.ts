import { Page, Locator, expect } from "@playwright/test";
import { CommonPage } from "./common-page";
import { NavigationPage } from "./navigation-page";
import { StabilityHelper } from "@utils/stability-helper";

export class WirtschaftlicheSozialhilfePage {
    page: Page;
    commonPage: CommonPage;
    stabilityHelper: StabilityHelper;
    wirtschaftlicheSozialhilfeField: Locator;
    ruckerstattungenNavLink: Locator;
    ruckerstattungenTab: Locator;
    ruckerstattungenErafassenBtn: Locator;
    vermogensverzehrMenuItem: Locator;
    titleTxtbox: Locator;
    datumTxtbox: Locator;
    monatlicherBetragTxtbox: Locator;
    betragTxtbox: Locator;
    erstmaligAbTxtbox: Locator;
    klientCombobox: Locator;
    begrundungTxtbox: Locator;
    speichernBtn: Locator;
    uploadfileInput: Locator;
    navigationPage: NavigationPage;
    ruckerstattungMissbrauchlichemBezugMenuItem: Locator;
    verjahrungTxtbox: Locator;
    schuldnerSelect: Locator;
    ruckzahlungsmodusSelect: Locator;
    ruckerstattungSpeichernBtn: Locator;
    constructor(page: Page) {
        this.page = page;
        this.commonPage = new CommonPage(page);
        this.navigationPage = new NavigationPage(page);
        this.stabilityHelper = new StabilityHelper(page);
        this.wirtschaftlicheSozialhilfeField = page.getByRole("button", {
            name: /Wirtschaftliche Sozialhilfe|Aide sociale économique/i
        });
        this.ruckerstattungenNavLink = page.getByRole("link", {
            name: /Rückerstattungen \/ Vermögensverzehr|Remboursements/i
        });
        this.ruckerstattungenTab = page.getByRole("tab", {
            name: /Rückerstattungen \/ Vermögensverzehr|Remboursements \/ Imputation de la fortune/i
        });
        this.ruckerstattungenErafassenBtn = page.getByRole("button", {
            name: /Rückerstattungen \/ Vermögensverzehr erfassen|Saisir un·e remboursements \/ imputation de la fortune/i
        });
        this.vermogensverzehrMenuItem = page.getByRole("menuitem", {
            name: /Vermögensverzehr|Imputation de la fortune/i
        });
        this.titleTxtbox = page.getByTestId("titel").getByTestId("root-control").first();
        this.datumTxtbox = page.getByTestId("datumEinmalig").getByTestId("root-control").first();
        this.monatlicherBetragTxtbox = page.getByTestId("rueckzahlungBetragMonatlich").getByTestId("root-control").first();
        this.betragTxtbox = page.getByTestId("betragEinmalig").getByTestId("root-control").first();
        this.erstmaligAbTxtbox = page.getByTestId("rueckzahlungErstmaligAb").getByTestId("root-control").first();
        this.klientCombobox = page.getByTestId("personInDossierId_Schuldner").getByTestId("root-control").first();
        this.begrundungTxtbox = page.getByTestId("begruendung").getByTestId("root-control").first();
        this.speichernBtn = page
            .getByRole("button", {
                name: /Vermögensverzehr speichern|Enregistrer l'imputation de la fortune/i
            })
            .first();
        this.uploadfileInput = page.locator("app-file-upload-card").first();
        this.ruckerstattungMissbrauchlichemBezugMenuItem = page.getByRole("menuitem", {
            name: /Persönliche Rückerstattung bei missbräuchlichem Bezug|Remboursement personnel en cas de retrait abusif/i
        });
        this.verjahrungTxtbox = page.getByTestId("verjaehrung").getByTestId("root-control");
        this.schuldnerSelect = page.getByTestId("personInDossierId_Schuldner").getByTestId("root-control");
        this.ruckzahlungsmodusSelect = page.getByTestId("rueckzahlungsmodus").getByTestId("root-control");
        //3.5
        this.ruckerstattungSpeichernBtn = page.getByRole("button", {
            name: /Rückerstattung speichern|Enregistrer le remboursement/i
        });
    }
    async validateNewRuckerstattung(titel: string) {
        await expect.soft(this.page.locator("app-readmode-field").filter({ hasText: `${titel}` })).toBeVisible();
    }
    async createNewRuckerstattung() {
        await this.ruckerstattungenErafassenBtn.click();
        await this.ruckerstattungMissbrauchlichemBezugMenuItem.click();
        await this.navigationPage.waitForPageReady();
    }
    async inputRuckerstattungBei(titel: string, rueckModus: string, datum: string, verJahrung: string, betrag: number, monatlicherBetrag: number, erstmalig: string, schuldner: string, begruendung: string) {
        await this.datumTxtbox.first().fill(datum);
        await this.ruckzahlungsmodusSelect.first().click();
        await this.page.locator(`mat-option:has-text('${rueckModus}')`).click();
        if (verJahrung !== "") {
            await this.verjahrungTxtbox.first().fill(verJahrung);
        }
        await this.betragTxtbox.fill(String(betrag));
        await this.monatlicherBetragTxtbox.fill(String(monatlicherBetrag));
        await this.titleTxtbox.first().fill(titel);
        await this.schuldnerSelect.click();
        await this.page.locator(`mat-option:has-text('${schuldner}')`).click();
        await this.erstmaligAbTxtbox.fill(erstmalig);
        await this.begrundungTxtbox.fill(begruendung);
    }

    async fillRuckerstattungBei(titel: string, rueckModus: string, datum: string, verJahrung: string, betrag: number, monatlicherBetrag: number, erstmalig: string, schuldner: string, begruendung: string) {
        // Panel is already open in edit mode after createNewRuckerstattung() - directly fill the form
        await this.inputRuckerstattungBei(titel, rueckModus, datum, verJahrung, betrag, monatlicherBetrag, erstmalig, schuldner, begruendung);
    }
    async saveRuckerstattung() {
        await this.stabilityHelper.stableClick(this.ruckerstattungSpeichernBtn);
    }
    async goToVermogensverzehr() {
        //30.06.2025 replace with openMenuNav
        await this.navigationPage.openMenuNav();
        await this.ruckerstattungenNavLink.click();
        await this.ruckerstattungenTab.click();
    }
    async createNewVermogensverzehr() {
        await this.ruckerstattungenErafassenBtn.click();
        await this.vermogensverzehrMenuItem.click();
    }
    async fillVermogensverzehrForm(titel: string, datum: string, betrag: number, monatBetrag: number, startDatum: string, klient: string, begrundung: string) {
        await this.stabilityHelper.stableClick(this.klientCombobox, {
            waitBefore: 500,
            waitAfter: 1000
        });
        await this.page.locator(`mat-option:has-text("${klient}")`).first().click();
        await this.titleTxtbox.fill(titel);
        await this.datumTxtbox.fill(datum);
        await this.monatlicherBetragTxtbox.fill(monatBetrag.toString());
        await this.betragTxtbox.fill(betrag.toString());

        await this.erstmaligAbTxtbox.fill(startDatum);
        if (begrundung !== "") {
            await this.begrundungTxtbox.fill(begrundung);
        }
    }
    async saveVermogensverzehr() {
        await this.stabilityHelper.stableClick(this.speichernBtn);
    }
    async uploadFile(divDokumente: string) {
        if (divDokumente !== "") {
            const filePaths = this.commonPage.separateText(divDokumente);

            if (filePaths.length !== 0) {
                for (const filePath of filePaths) {
                    const fileChooserPromise = this.page.waitForEvent("filechooser");
                    await this.uploadfileInput.click();
                    const fileChooser = await fileChooserPromise;
                    await fileChooser.setFiles(filePath);
                }
                await this.navigationPage.waitForPageReady();
            }
        }
    }
}
