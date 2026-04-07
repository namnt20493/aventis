import { Page, Locator, expect } from "@playwright/test";
import { CommonPage } from "./common-page";
import { NavigationPage } from "./navigation-page";
import { StabilityHelper } from "@utils/stability-helper";

export class ErfassungPage {
    page: Page;
    erfassungField: Locator;
    dokumenteneingangNav: Locator;
    doisserWahlenInput: Locator;
    leistungInput: Locator;
    klientInput: Locator;
    documentTitle: Locator;
    dokumentAblageortInput: Locator;
    dokumentTypInput: Locator;
    themaInput: Locator;
    speichernBtn: Locator;
    commonPage: CommonPage;
    btnVerarbeiten: Locator;
    navigationPage: NavigationPage;
    private stabilityHelper: StabilityHelper;
    constructor(page: Page) {
        this.page = page;
        this.commonPage = new CommonPage(page);
        this.navigationPage = new NavigationPage(page);
        this.stabilityHelper = new StabilityHelper(page);
        this.erfassungField = page.getByRole("button", {
            name: /Erfassung \/ Import|Enregistrement \/ Importation/i
        });
        this.dokumenteneingangNav = page.getByRole("link", {
            name: /Dokumenteneingang|Entrée des documents/i
        });
        // this.regionaleBernUploadBtn = page.getByRole("button", { name: /Regionaler Sozialdienst "Bern"|/i });
        this.doisserWahlenInput = page.getByTestId("dossierId").getByTestId("root-control");
        this.leistungInput = page.getByTestId("leistungId").locator("input");
        this.klientInput = page.getByTestId("personInDossierId").getByTestId("root-control");
        this.documentTitle = page.getByTestId("titel").getByTestId("root-control");
        this.dokumentAblageortInput = page.getByTestId("dokumentAblageortKey").getByTestId("root-control");
        this.dokumentTypInput = page.getByTestId("dokumenttypKey").getByTestId("root-control");
        this.themaInput = page.getByTestId("themaKeys").getByTestId("root-control");
        this.speichernBtn = page.getByRole("button", {
            name: /Speichern und Schliessen|Enregistrer et fermer/i
        });
        this.btnVerarbeiten = page.getByRole("button", {
            name: /Verarbeiten und zum nächsten Dokument|Traiter et passer au document suivant/i
        });
    }

    //go to dokumenteneingang
    async goToDokumenteneingang() {
        await this.navigationPage.rollUpMenu();
        await this.erfassungField.click();
        await this.dokumenteneingangNav.click();
    }

    async uploadRegionaleBernFile(sozialDienstRegion: string, document: string) {
        const regionalUpload = this.page.getByRole("button", {
            name: `${sozialDienstRegion}`
        });
        const fileChooserPromise = this.page.waitForEvent("filechooser");
        await regionalUpload.click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(`${document}`);
    }
    async editDocument(document: string) {
        const fileName = this.commonPage.getFileName(document);
        console.log(`🔍 [EditDocument] Looking for document: ${fileName}`);

        await this.navigationPage.waitForPageReady();

        const docRow = this.page.locator(`tr:has-text('${fileName}')`).last();
        const rowCount = await docRow.count();

        if (rowCount === 0) {
            console.error(`❌ [EditDocument] Document row not found: ${fileName}`);
            const availableRows = await this.page.locator("tbody tr").allTextContents();
            throw new Error(`Document "${fileName}" not found in table. Available rows: ${availableRows.join(" | ")}`);
        }

        const editButton = docRow.locator("button").filter({ has: this.page.locator("mat-icon[data-mat-icon-name='edit']") });

        const buttonCount = await editButton.count();
        if (buttonCount === 0) {
            throw new Error(`Edit button not found for document "${fileName}"`);
        }

        console.log(`✅ [EditDocument] Found document, clicking edit button`);
        await this.stabilityHelper.stableClick(editButton, {
            timeout: 15000,
            waitBefore: 500,
            waitAfter: 1000,
            retries: 3
        });
    }
    async editInfoErfassung(dossier: string, leistung: string, klient: string, documentTitle: string, button: string) {
        await this.navigationPage.waitForPageReady();

        if (await this.dokumentAblageortInput.isVisible()) {
            // den vorselektierten AblageOrt nicht überschreiben
            //    await this.dokumentAblageortInput.click();
            //    await this.page.getByRole("option").first().click();
        }

        await this.doisserWahlenInput.fill(dossier);
        await this.stabilityHelper.stableClick(this.page.getByRole("option", { name: `${dossier}` }));

        await this.klientInput.fill(klient);
        await this.stabilityHelper.stableClick(this.page.getByRole("option", { name: `${klient}` }));

        await this.documentTitle.fill(documentTitle);

        if (leistung !== "") {
            await this.leistungInput.fill(leistung);
            await this.stabilityHelper.stableClick(this.page.getByRole("option", { name: `${leistung}` }));
        }
        // den wird dann gar nicht angezeigt
        // if (await this.dokumentTypInput.isVisible()) {
        //     const currentDokTypValue = await this.dokumentTypInput.textContent();
        //     if (!currentDokTypValue || currentDokTypValue.trim() === "") {
        //         await this.dokumentTypInput.click();
        //         const rechnungOption = this.page.getByRole("option", { name: /^Rechnung$/i });
        //         if ((await rechnungOption.count()) > 0) {
        //             await rechnungOption.click();
        //         } else {
        //             await this.page.getByRole("option").first().click();
        //         }
        //     }
        // }

        if (await this.themaInput.isVisible()) {
            const currentThemaValue = await this.themaInput.textContent();
            if (!currentThemaValue || currentThemaValue.trim() === "") {
                await this.themaInput.click();
                await this.page.getByRole("option").first().click();
                await this.page.keyboard.press("Escape");
            }
        }

        if (button === "Verarbeiten" || button === "Verarbeiten und zum nächsten Dokument" || button === "Verarbeiten und Schliessen") {
            const splitButton = this.page.locator("app-split-button").first();
            const dropdownTrigger = splitButton.getByRole("radio").last();
            await this.stabilityHelper.stableClick(dropdownTrigger, { timeout: 10000, waitAfter: 500 });
            const verarbeitenMenuItem = this.page.getByRole("menuitem", { name: /Verarbeiten und Schliessen|Verarbeiten und zum nächsten Dokument/i });
            await this.stabilityHelper.stableClick(verarbeitenMenuItem, { timeout: 10000, waitAfter: 1000 });
        } else {
            const splitButton = this.page.locator("app-split-button").last();
            const dropdownTrigger = splitButton.getByRole("radio").last();
            await this.stabilityHelper.stableClick(dropdownTrigger, { timeout: 10000, waitAfter: 500 });
            const speichernMenuItem = this.page.getByRole("menuitem", { name: /Speichern und Schliessen|Enregistrer et fermer/i });
            await this.stabilityHelper.stableClick(speichernMenuItem, { timeout: 10000, waitAfter: 1000 });
        }
    }

    async waitForTRdisappear(document: string) {
        await this.page.waitForSelector("div[class*='mdc-circular-progress__circle-right']", { state: "detached" });
        // await this.page.waitForSelector(`tr:has-text('${this.commonPage.getFileName(document)}')`, {state: 'detached'});
    }
}
