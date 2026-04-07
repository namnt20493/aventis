import { Page, Locator } from "@playwright/test";
import { StabilityHelper } from "@utils/stability-helper";

export class ZieterfassungPage {
    page: Page;
    private stabilityHelper: StabilityHelper;
    zeitErfassenBtn: Locator;
    dossierInput: Locator;
    dienstleistungskategorieCombobox: Locator;
    datumInput: Locator;
    dauerInput: Locator;
    beschreibungInput: Locator;
    speichernBtn: Locator;
    constructor(page: Page) {
        this.page = page;
        this.stabilityHelper = new StabilityHelper(page);
        this.zeitErfassenBtn = page.getByRole("link", {
            name: /Zeit erfassen|Saisir des heures/i
        });
        this.dossierInput = page.getByTestId("dossierId").getByTestId("root-control");
        this.dienstleistungskategorieCombobox = page.getByTestId("dienstleistungskategorieKey").getByTestId("root-control");
        this.datumInput = page.getByTestId("datum").getByTestId("root-control");
        this.dauerInput = page.getByTestId("dauer").getByTestId("root-control");
        this.beschreibungInput = page.getByTestId("beschreibung").getByTestId("root-control");
        this.speichernBtn = page.getByRole("button", {
            name: /Speichern|Enregistrer/i
        });
    }
    async clickZeitErfassenBtn() {
        await this.zeitErfassenBtn.click();
    }
    async inputZeitInfo(dossier: string, dienstLeistung: string, datum: string, dauerHHMM: string, beschreibung: string) {
        await this.dossierInput.fill(dossier);
        await this.page.locator("mat-option").filter({ hasText: dossier }).first().click();
        await this.dienstleistungskategorieCombobox.click();
        await this.page.locator("mat-option").filter({ hasText: dienstLeistung }).first().click();
        await this.datumInput.fill(datum);
        await this.dauerInput.fill(dauerHHMM);
        await this.beschreibungInput.fill(beschreibung);
    }
    async clickSpeichernBtn() {
        await this.stabilityHelper.stableClick(this.speichernBtn);
    }
}
