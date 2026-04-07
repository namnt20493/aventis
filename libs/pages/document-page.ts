import { Page, Locator, expect, Dialog } from "@playwright/test";
import * as assert from "assert";
import { NavigationPage } from "./navigation-page";
import { CommonPage } from "./common-page";
import { RahmenbudgetPage } from "./rahmenbudget-page";
import { stat } from "fs";
import { StabilityHelper } from "@utils/stability-helper";

export class DocumentPage {
    page: Page;
    private stabilityHelper: StabilityHelper;
    btnAddNewDocument: Locator;
    closeButton: Locator;
    briefAnDritteTitle: Locator;
    briefAnDritteThemaKeys: Locator;
    briefAnDritteAbsender: Locator;
    briefAnDritteAddBtn: Locator;
    briefAnDritteInstitution: Locator;
    navigation: NavigationPage;
    btnFilter: Locator;
    stichwortInput: Locator;
    dokumentNavLink: Locator;
    commonpage: CommonPage;
    documentField: Locator;
    klientSelect: Locator;
    addressSelect: Locator;
    dokumentAblageortKeyTxtbox: Locator;
    dossierWahlenSelect: Locator;
    leistungWahlenSelect: Locator;
    dokumentTitleTxtbox: Locator;
    zahlbarDurchSelect: Locator;
    einnahmepositionSelect: Locator;
    verwendungsperiodeSelect: Locator;
    effektiverBetragTxtbox: Locator;
    speichernBtn: Locator;
    btnVerarbeiten: Locator;
    uploadBtn!: Locator;
    statusSelect: Locator;
    hinzugefugtDurchSelect: Locator;
    rahmenbudget: RahmenbudgetPage;
    themaSelect: Locator;
    barauszahlungNumber: Locator;
    barauszahlungSelect: Locator;
    loschenBtn: Locator;
    dokumenttypKeySelect: Locator;
    saveBtn: Locator;
    btnEditPersonendaten: Locator;
    dokumentDetailMenu: Locator;
    btnVersionsverlaufVerwalten: Locator;

    constructor(page: Page) {
        this.page = page;
        this.stabilityHelper = new StabilityHelper(page);
        this.navigation = new NavigationPage(page);
        this.commonpage = new CommonPage(page);
        this.rahmenbudget = new RahmenbudgetPage(page);
        this.dokumentNavLink = page.getByRole("link", {
            name: /Dokumente|Documents/i
        });
        this.btnAddNewDocument = page.getByRole("button", {
            name: /Dokument aus Vorlage erstellen|Créer un document à partir d'un modèle/i
        });
        this.closeButton = page.getByRole("button", { name: /Fermer|Schliessen/i });
        this.briefAnDritteTitle = page.getByTestId("title").getByTestId("root-control");
        this.briefAnDritteThemaKeys = page.getByTestId("themaKeys").getByTestId("root-control");
        this.briefAnDritteAbsender = page.getByTestId("userId_Absender").getByTestId("root-control");
        this.briefAnDritteAddBtn = page.getByRole("button", {
            name: /Dokument erstellen|Créer un document/i
        });
        this.briefAnDritteInstitution = page.getByTestId("empfaengerId_Institution").getByTestId("root-control");
        this.btnFilter = page.getByRole("button", { name: /Filter|Filtre/i });
        this.stichwortInput = page.locator("app-stichwort-filter").getByTestId("root-control");
        this.documentField = page.getByRole("button", {
            name: /Persönliche Hilfe|Aide personnelle/i
        });
        this.klientSelect = page.getByTestId("personInDossierId").getByTestId("root-control");
        this.addressSelect = page.getByTestId("adresse").getByTestId("root-control");
        this.dokumentAblageortKeyTxtbox = page.getByTestId("dokumentAblageortKey").getByTestId("root-control");
        this.dossierWahlenSelect = page.getByTestId("dossierId").getByTestId("root-control");
        this.leistungWahlenSelect = page.getByTestId("leistungId").getByTestId("root-control");
        this.dokumentTitleTxtbox = page.getByTestId("titel").getByTestId("root-control");
        this.zahlbarDurchSelect = page.getByTestId("bezahler").getByTestId("root-control");
        this.einnahmepositionSelect = page.getByTestId("erwerbssituationId").getByTestId("root-control");
        this.verwendungsperiodeSelect = page.getByTestId("verwendungsperiode").getByTestId("root-control");
        this.effektiverBetragTxtbox = page.getByTestId("effektiverBetrag").getByTestId("root-control");
        this.speichernBtn = page.getByRole("button", {
            name: /Speichern und Schliessen|Enregistrer/i
        });
        this.saveBtn = page.getByRole("button", { name: /Speichern|Enregistrer/i });
        // this.monatbudgetTab = page.getByRole('tab', {name : /Monatsbudget|Budget mensuel/i})
        this.btnVerarbeiten = page.getByRole("radio", {
            name: /Verarbeiten und zum nächsten Dokument|Traiter/i
        });
        this.statusSelect = page.getByTestId("status").getByTestId("root-control");
        this.themaSelect = page.getByTestId("themaKeys").getByTestId("root-control");
        this.hinzugefugtDurchSelect = page.getByTestId("userIds_Importiert").getByTestId("root-control");
        this.barauszahlungNumber = page.getByTestId("barauszahlungNummer").getByTestId("root-control");
        this.barauszahlungSelect = page.getByTestId("barauszahlungId").getByTestId("root-control");
        this.loschenBtn = page.getByTestId("dialog-confirm");
        this.dokumenttypKeySelect = page.getByTestId("dokumenttypKey").getByTestId("root-control");
        //
        this.btnEditPersonendaten = page.locator('mat-expansion-panel-header:has-text("Personendaten")').locator("button");
        this.dokumentDetailMenu = page.locator("app-file-download-base-link").locator("button");
        this.btnVersionsverlaufVerwalten = page.getByRole("button", {
            name: /Versionsverlauf verwalten|Gérer l'historique des versions/i
        });
    }
    async editPersonendaten(klient: string, dokumente: string, docPath: string) {
        // Navigate to the Klient page by clicking on the Klient link in the sidebar
        // The sidebar link contains the klient name but may have additional text like "(m46)"
        const sidebarKlientLink = this.page.locator("app-navigation-tree").getByRole("link").filter({ hasText: klient });

        // Check if we need to navigate to the Klient page
        const klientRouteVisible = await this.page
            .getByTestId("KlientRoute")
            .filter({ hasText: klient })
            .isVisible()
            .catch(() => false);

        if (!klientRouteVisible) {
            // Navigate via sidebar link
            await sidebarKlientLink.first().click();
            await this.navigation.waitForPageReady();
        } else {
            // KlientRoute is visible, click it
            await this.page.getByTestId("KlientRoute").filter({ hasText: klient }).click();
        }

        await this.btnEditPersonendaten.click();
        const files = this.commonpage.separateText(dokumente);
        if (files[0]) {
            const file1 = `${docPath}/${files[0]}`;
            await this.uploadPersonendatenFile(file1);
            await this.saveBtn.click();
            await this.navigation.waitForPageReady();
            await this.navigation.waitForSpinnerToDisappear();
        }
        await this.dokumentDetailMenu.click();
        await this.btnVersionsverlaufVerwalten.click();
        if (files[1]) {
            const file2 = `${docPath}/${files[1]}`;
            await this.uploadPersonendatenFile(file2);
            await this.checkOrderOfUploadedFiles(files[1]);
        }

        if (files[2]) {
            const file3 = `${docPath}/${files[2]}`;
            await this.uploadPersonendatenFile(file3);
            await this.checkOrderOfUploadedFiles(files[2]);
        }
        //check
        await this.page
            .getByRole("button", { name: /Schliessen|Fermer/i })
            .first()
            .click();
    }
    async checkOrderOfUploadedFiles(fileName: string) {
        const today = new Date();
        const todayStr = `${today.getDate().toString().padStart(2, "0")}.${(today.getMonth() + 1).toString().padStart(2, "0")}.${today.getFullYear()}`;
        const firstRow = this.page.locator("tbody tr").first();
        await expect
            .soft(firstRow, {
                message: `First row should contain file name: ${fileName}`
            })
            .toContainText(fileName);
        await expect
            .soft(firstRow, {
                message: `First row should contain today's date: ${todayStr}`
            })
            .toContainText(todayStr);
    }
    async uploadPersonendatenFile(file: string) {
        await this.commonpage.uploadFileWithApiWait(this.page.locator("app-file-upload-card"), file);
    }

    async deleteDokument(all: string) {
        const MAX_ITERATIONS = 500;
        await this.page.locator("app-dokumenteneingang-dropzone").waitFor({ state: "visible" });
        for (let i = 0; i < MAX_ITERATIONS; i++) {
            const rows = this.page.locator("tbody tr");
            const rowCount = await rows.count();
            console.log("ROWWW", rowCount);

            if (rowCount === 0) {
                console.log("No more documents found, exiting loop.");
                break;
            }

            const firstRow = rows.first();
            const deleteButton = firstRow.locator("button").last();

            if (await deleteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
                console.log("Deleting first document row...");
                await deleteButton.click();
                await this.page.getByRole("menuitem", { name: "Dokument inkl. Datensatz löschen" }).click();
                await this.loschenBtn.click();
                await this.navigation.waitForPageReady();
            } else {
                console.log("Delete button not found, exiting loop.");
                break;
            }
        }
    }

    async filterDokument(hinzugefuegtDurch: string, docType: string, dateiName: string, datum: string) {
        const normalizedDatum = datum
            .split(".")
            .map((part) => part.padStart(2, "0"))
            .join(".");

        // Fill the filter and select option or press Enter
        await this.hinzugefugtDurchSelect.fill(hinzugefuegtDurch);
        await this.page.waitForTimeout(500);

        // Try to click option, or press Enter if it's a chip-based filter
        const option = this.page.getByRole("option", { name: `${hinzugefuegtDurch}` }).first();
        const optionVisible = await option.isVisible().catch(() => false);
        if (optionVisible) {
            await option.click();
        } else {
            await this.hinzugefugtDurchSelect.press("Enter");
        }

        await this.page.waitForTimeout(500);

        if (docType !== "") {
            await this.page.locator(`tr:has-text("${docType}"):has-text("${dateiName}"):has-text("${datum}")`).locator('button mat-icon[data-mat-icon-name="edit"]').click();
        } else {
            await this.page.locator(`tr:has-text("${dateiName}"):has-text("${normalizedDatum}")`).first().locator('button mat-icon[data-mat-icon-name="edit"]').click();
        }
    }
    async uploadDokument(sozialDienst: string, file: string) {
        const fileChooserPromise = this.page.waitForEvent("filechooser");
        await this.page
            .getByTestId("uploadControl")
            .filter({ hasText: `${sozialDienst}` })
            .click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(`${file}`);
        await expect.soft(this.page.locator("app-snackbar").first()).toBeVisible();
        await this.page.locator("app-snackbar button").first().click();
    }
    async fillDokumentVerarbeitenFreigabeForm(newDocType: string, dossier: string, leistung: string, docTitle: string, thema: string, verwendungsPeriode: string, status: string) {
        await this.dokumentAblageortKeyTxtbox.click();
        await this.page.getByRole("option", { name: `${newDocType}` }).click();

        // Wait for form to update after selecting type
        await this.page.waitForTimeout(500);

        // Dossier selection - check if field exists and needs filling
        const dossierField = this.dossierWahlenSelect;
        if (await dossierField.isVisible().catch(() => false)) {
            await dossierField.fill("");
            await dossierField.pressSequentially(dossier);
            await this.page.waitForTimeout(500);
            const dossierOption = this.page.getByRole("option", { name: `${dossier}` });
            if (await dossierOption.isVisible({ timeout: 3000 }).catch(() => false)) {
                await dossierOption.click();
            }
        }

        // Leistung selection - optional field, only fill if visible
        const leistungField = this.leistungWahlenSelect;
        if (leistung && (await leistungField.isVisible().catch(() => false))) {
            await leistungField.click();
            await this.page.getByRole("option", { name: `${leistung}` }).click();
        }

        // Document title - fill if visible
        if (docTitle && (await this.dokumentTitleTxtbox.isVisible().catch(() => false))) {
            await this.dokumentTitleTxtbox.fill("");
            await this.dokumentTitleTxtbox.pressSequentially(docTitle);
        }

        // Dokument-Typ - required field, fill if visible
        if (await this.dokumenttypKeySelect.isVisible().catch(() => false)) {
            await this.dokumenttypKeySelect.click();
            // Try to select first available option if no specific type is needed
            const firstOption = this.page.locator("mat-option:not([emptyoption])").first();
            if (await firstOption.isVisible({ timeout: 3000 }).catch(() => false)) {
                await firstOption.click();
            }
        }

        // Thema - required field
        if (thema && (await this.themaSelect.isVisible().catch(() => false))) {
            await this.themaSelect.click();
            const themaOption = this.page.getByRole("option", { name: `${thema}` });
            if (await themaOption.isVisible({ timeout: 3000 }).catch(() => false)) {
                await themaOption.click();
            } else {
                // Select first available option
                const firstThemaOption = this.page.locator("mat-option:not([emptyoption])").first();
                if (await firstThemaOption.isVisible({ timeout: 3000 }).catch(() => false)) {
                    await firstThemaOption.click();
                }
            }
            // Close dropdown if multi-select
            await this.page.keyboard.press("Escape");
        }

        // Verwendungsperiode - optional field
        if (verwendungsPeriode && (await this.verwendungsperiodeSelect.isVisible().catch(() => false))) {
            await this.page.keyboard.press("Escape"); // Dismiss any tooltip blocking the dropdown
            await this.verwendungsperiodeSelect.click();
            await this.page.getByRole("option", { name: `${verwendungsPeriode}` }).click();
        }

        // Status - optional field
        if (status && status !== "" && (await this.statusSelect.isVisible().catch(() => false))) {
            await this.statusSelect.click();
            await this.page.getByRole("option", { name: `${status}` }).click();
        }

        // Click "Verarbeiten und Schliessen"
        await this.page.locator("app-split-button").first().getByRole("radio").last().click();
        await this.page.getByRole("menuitem", { name: "Verarbeiten und Schliessen" }).click();
    }
    async clickbtnNextDokument() {
        await this.btnVerarbeiten.click();
        await this.navigation.waitForPageReady();
    }
    async clickBtnSave() {
        await this.page
            .getByRole("button", {
                name: /Speichern und Schliessen|Enregistrer et fermer/i
            })
            .click();
    }
    async checkfreigabeStatus(dossier: string, verwendungsPeriode: string, status: string) {
        await this.navigation.searchDossier(dossier);
        await this.rahmenbudget.clickRahmenbudgetNavLink();
        await this.rahmenbudget.FreigabeVerwenTab.click();
        const td = this.page.locator(`tr:has-text('${verwendungsPeriode}')`).getByTestId("status").getByTestId("root-control");
        await expect.soft(td).toContainText(`${status}`);
    }
    async fillDokumnentForm(docAblageort: string, dossier: string, leistungHas: string, klient: string, docTitle: string, newDocType: string, thema: string, rechnBetrag: string, verwendungsPeriode: string, status: string) {
        //replace WaitForTimeout with waitForSelector
        await this.page
            .getByRole("button", {
                name: /Verarbeiten und zum nächsten Dokument|Traiter et passer au document suivant/i
            })
            .waitFor({ state: "attached" });
        await this.dokumentAblageortKeyTxtbox.click();
        await this.page.getByRole("option", { name: `${docAblageort}` }).click();
        if (dossier !== "" && dossier !== undefined && dossier !== null) {
            await this.dossierWahlenSelect.fill(dossier);
            await this.page.getByRole("option", { name: `${dossier}` }).click();
        }

        if (leistungHas !== "" && leistungHas !== undefined && leistungHas !== null) {
            await this.leistungWahlenSelect.click();
            await this.page.getByRole("option", { name: `${leistungHas}` }).click();
        }

        if (klient !== "" && klient !== undefined && klient !== null) {
            await this.klientSelect.fill(klient);
            await this.page.getByRole("option", { name: `${klient}` }).click();
        }

        await this.dokumentTitleTxtbox.fill(docTitle);
        if (thema !== "" && thema !== undefined && thema !== null) {
            await this.themaSelect.click();
            await this.page.getByRole("option", { name: `${this.commonpage.separateText(thema)}` }).click();
            await this.page.keyboard.press("Escape");
        }
        if (newDocType !== "" && newDocType !== undefined && newDocType !== null) {
            await this.dokumenttypKeySelect.click();
            await this.page.getByRole("option", { name: `${newDocType}`, exact: true }).click();
        }
        if (verwendungsPeriode !== "" && verwendungsPeriode !== undefined && verwendungsPeriode !== null) {
            await this.verwendungsperiodeSelect.click();
            await this.page.getByRole("option", { name: `${verwendungsPeriode}` }).click();
        }

        if (status !== "" && status !== undefined && status !== null) {
            await this.statusSelect.click();
            await this.page.getByRole("option", { name: `${status}` }).click();
        }
    }
    async selectAblageort(docAblageort: string) {
        try {
            await this.dokumentAblageortKeyTxtbox.click({ delay: 1000 });
            await expect(this.page.getByRole("option", { name: `${docAblageort}` })).toBeVisible({ timeout: 5000 });
            await this.page.getByRole("option", { name: `${docAblageort}` }).click();
        } catch {
            await this.dokumentAblageortKeyTxtbox.click({ delay: 1000 });
            await this.page.getByRole("option", { name: `${docAblageort}` }).click();
        }
    }
    async fillDokumnentForm1(docAblageort: string, dossier: string, leistungHas: string, klient: string, docTitle: string, newDocType: string, thema: string, rechnBetrag: string, verwendungsPeriode: string, status: string) {
        await this.page.locator("app-file-preview").waitFor({ state: "attached" });
        await this.selectAblageort(docAblageort);
        if (dossier !== "" && dossier !== undefined && dossier !== null) {
            await this.dossierWahlenSelect.fill(dossier);
            await this.page.getByRole("option", { name: `${dossier}` }).click();
        }

        if (leistungHas !== "" && leistungHas !== undefined && leistungHas !== null) {
            await this.leistungWahlenSelect.click();
            await this.page.getByRole("option", { name: `${leistungHas}` }).click();
        }

        if (klient !== "" && klient !== undefined && klient !== null) {
            await this.klientSelect.fill(klient);
            await this.page.getByRole("option", { name: `${klient}` }).click();
        }

        await this.dokumentTitleTxtbox.fill(docTitle);
        if (thema !== "" && thema !== undefined && thema !== null) {
            await this.themaSelect.click();
            await this.page.getByRole("option", { name: `${this.commonpage.separateText(thema)}` }).click();
            await this.page.keyboard.press("Escape");
        }
        if (newDocType !== "" && newDocType !== undefined && newDocType !== null) {
            await this.dokumenttypKeySelect.click();
            await this.page.getByRole("option", { name: `${newDocType}`, exact: true }).click();
        }
        if (verwendungsPeriode !== "" && verwendungsPeriode !== undefined && verwendungsPeriode !== null) {
            await this.verwendungsperiodeSelect.click();
            await this.page.getByRole("option", { name: `${verwendungsPeriode}` }).click();
        }

        if (status !== "" && status !== undefined && status !== null) {
            await this.statusSelect.click();
            await this.page.getByRole("option", { name: `${status}` }).click();
        }
    }
    async fillDokumentVerarbeitenLohnabrechnung(newDocType: string, dossier: string, leistungHas: string, klient: string, docTitle: string, zahlbarDurch: string, einnahmePosHas: string, verwendungsPeriode: string, effektiverBetrag: number) {
        await this.dokumentAblageortKeyTxtbox.click();
        await this.page.getByRole("option", { name: `${newDocType}` }).click();
        await this.dossierWahlenSelect.click();
        await this.page.getByRole("option", { name: `${dossier}` }).click();
        await this.leistungWahlenSelect.click();
        await this.page.getByRole("option", { name: `${leistungHas}` }).click();
        await this.klientSelect.click();
        await this.page.getByRole("option", { name: `${klient}` }).click();
        await this.dokumentTitleTxtbox.fill(docTitle);
        await this.zahlbarDurchSelect.fill(zahlbarDurch);
        await this.page.keyboard.press("Backspace");
        await this.page.getByRole("option", { name: `${zahlbarDurch}` }).click({ delay: 1000 });
        await this.einnahmepositionSelect.click();
        await this.page.getByRole("option", { name: `${einnahmePosHas}` }).click();
        await this.verwendungsperiodeSelect.click({ delay: 1000 });
        await this.page.getByRole("option", { name: `${verwendungsPeriode}` }).click();
        await this.effektiverBetragTxtbox.fill(effektiverBetrag.toString());
        await this.page.locator("app-split-button").last().getByRole("radio").last().click();
        await this.stabilityHelper.stableClick(this.page.getByRole("menuitem", { name: "Speichern und Schliessen" }));
    }

    async fillDokumentVerarbeitenLohnabrechnungForm(newDocType: string, dossier: string, leistungHas: string, klient: string, docTitle: string, zahlbarDurch: string, einnahmePosHas: string, verwendungsPeriode: string, effektiverBetrag: string) {
        await this.dokumentAblageortKeyTxtbox.click();
        await this.page.getByRole("option", { name: `${newDocType}` }).click();
        await this.dossierWahlenSelect.click();
        await this.page.getByRole("option", { name: `${dossier}` }).click();
        await this.leistungWahlenSelect.click();
        await this.page.getByRole("option", { name: `${leistungHas}` }).click();
        await this.klientSelect.click();
        await this.page.getByRole("option", { name: `${klient}` }).click();
        await this.dokumentTitleTxtbox.fill(docTitle);
        await this.zahlbarDurchSelect.click();
        await this.page.getByRole("option", { name: `${zahlbarDurch}` }).click();
        await this.einnahmepositionSelect.click();
        await this.page.getByRole("option", { name: `${einnahmePosHas}` }).click();
        await this.verwendungsperiodeSelect.click();
        await this.page.getByRole("option", { name: `${verwendungsPeriode}` }).click();
        await this.effektiverBetragTxtbox.fill(effektiverBetrag);
        await this.stabilityHelper.stableClick(this.speichernBtn);
    }
    async fillInfoToDocument_IIS_Form(titel: string, klient: string, adresse: string) {
        await this.briefAnDritteTitle.fill(titel);
        await this.selectClient(klient);
        await this.addressSelect.click();
        await this.page.getByRole("option", { name: `${adresse}` }).click();
        await expect(this.briefAnDritteAddBtn, {
            message: "Is Dokument Erstellen enable ?"
        }).toBeEnabled();
        await this.briefAnDritteAddBtn.click();
        await expect.soft(this.page.getByRole("link", { name: `${titel}` }).first()).toBeVisible();
    }

    async selectClient(klient: string) {
        const input = this.page.getByTestId("personInDossierId").getByTestId("root-control");

        await input.click();

        await this.page.waitForSelector(".mat-mdc-autocomplete-panel", {
            state: "visible",
            timeout: 5000
        });

        await this.page.waitForTimeout(300);

        console.log("\n=== Gesuchter Klient ===");
        console.log(`"${klient}"`);

        // Versuche getByRole zu finden
        const option = this.page.locator("mat-option:not([emptyoption])").filter({ hasText: klient.replace(/\s*,\s*/, ", ") });

        console.log("\ngetByRole gefunden:", await option.count());

        // Falls nicht gefunden, versuche verschiedene Varianten
        if ((await option.count()) === 0) {
            console.log("\nVersuche Varianten:");
            console.log("Mit trim:", await this.page.getByRole("option", { name: klient.trim() }).count());
            console.log("Mit regex:", await this.page.getByRole("option", { name: new RegExp(klient) }).count());
        }

        await option.click({
            force: true,
            timeout: 10000
        });
    }

    async fillInfoToDocument_Brief_Form(titel: string, klient: string, adresse: string, thema: string) {
        await this.briefAnDritteTitle.fill(titel);
        await this.page.locator(`app-card:has-text('${klient}') button`).click();
        await this.addressSelect.click();
        await this.page.getByRole("option", { name: `${adresse}` }).click();
        const themas = this.commonpage.separateText(thema);
        for (const them of themas) {
            await this.themaSelect.click();
            await this.page.getByRole("option", { name: `${them}` }).click();
            await this.page.keyboard.press("Escape");
        }
        await expect(this.briefAnDritteAddBtn, {
            message: "Is Dokument Erstellen enable ?"
        }).toBeEnabled();
        await this.briefAnDritteAddBtn.click();
    }
    async openDocumentLink() {
        await this.navigation.waitForPageReady();
        await this.navigation.openMenuNav();
        await this.dokumentNavLink.click();
    }
    groupElementsFromString(inputString: string): string[] {
        const input = inputString.split(", ");
        const groups: string[] = [];

        for (let i = 0; i < input.length; i += 2) {
            const key = input[i];
            const value = input[i + 1];

            if (value !== undefined) {
                groups.push(`${key}, ${value}`);
            }
        }

        return groups;
    }

    async filterDocument(stichwort: string, filterThema: string, person: string, zeitRaum: string, doctype: string) {
        await this.btnFilter.click();
        await this.stichwortInput.fill(stichwort);
        const themas = this.commonpage.separateText(filterThema);
        // const persons = this.commonpage.separateText(person);
        const persons = this.groupElementsFromString(person);
        const zeitRaums = this.commonpage.separateText(zeitRaum);
        const doctypes = this.commonpage.separateText(doctype);
        for (const thema of themas) {
            const isSelected = this.page
                .locator("app-themen-filter")
                .getByRole("option", { name: `${thema}` })
                .getAttribute("aria-selected");
            if ((await isSelected) === "false") {
                await this.page
                    .locator("app-themen-filter")
                    .getByRole("option", { name: `${thema}` })
                    .click();
            }
        }
        for (const personen of persons) {
            const isSelected = this.page
                .locator("app-personen-filter")
                .getByRole("option", { name: `${personen}` })
                .getAttribute("aria-selected");
            if ((await isSelected) === "false") {
                await this.page
                    .locator("app-personen-filter")
                    .getByRole("option", { name: `${personen}` })
                    .click();
            }
        }
        for (const doc of doctypes) {
            const isSelected = this.page
                .locator("app-dokument-typen-filter")
                .getByRole("option", { name: `${doc}` })
                .getAttribute("aria-selected");
            if ((await isSelected) === "false") {
                await this.page
                    .locator("app-dokument-typen-filter")
                    .getByRole("option", { name: `${doc}` })
                    .click();
            }
        }
        for (const zRaum of zeitRaums) {
            const isSelected = this.page
                .locator("app-date-range-filter")
                .getByRole("option", { name: `${zRaum}` })
                .getAttribute("aria-selected");
            if ((await isSelected) === "false") {
                await this.page
                    .locator("app-date-range-filter")
                    .getByRole("option", { name: `${zRaum}` })
                    .click();
            }
        }
    }
    //check document
    async checkDocument(checkDokument: string) {
        if (!checkDokument) {
            return;
        }

        const dokumentName = checkDokument.split(".")[0];

        const matchingLink = this.page.locator("app-dokumenten-grid").locator("tr.header-row a").filter({ hasText: dokumentName });

        await expect.soft(matchingLink.first()).toBeVisible();
    }

    async addNewDocument() {
        await this.btnAddNewDocument.click();
    }
    async chosseVorlage(vorlage: string, sprache: string) {
        //replace waitForTimeout with waitForSelector
        await this.page.getByTestId("language").getByTestId("root-control").waitFor({ state: "attached" });
        await this.page.getByTestId("template").getByTestId("root-control").waitFor({ state: "attached" });
        await this.page.getByTestId("language").getByTestId("root-control").click();
        await this.page.getByRole("option", { name: `${sprache}` }).click();
        await this.page.getByTestId("template").getByTestId("root-control").click();
        await this.page.locator(`mat-option:has-text('${vorlage}')`).click();
    }

    async chosseTypeOfNewDocument(vorlage: string) {
        await this.page.getByRole("button", { name: `${vorlage}` }).click();
        await this.closeButton.click();
        await this.btnAddNewDocument.click();
        await this.page.getByRole("button", { name: `${vorlage}` }).click();
    }

    async fillInfoToDocumentSimple(titel: string, thema: string, betrifft: string, instOderBezug: string, instOBezNamen: string, kontPerson: string, absender: string) {
        await this.briefAnDritteTitle.fill(titel);
        await this.briefAnDritteThemaKeys.click();
        await this.page.getByRole("option", { name: `${thema}` }).click();
        await this.page.keyboard.press("Escape");
        if (betrifft !== "Ganze Klientschaft") {
            await this.page
                .getByTestId("personIds_Betrifft")
                .locator("div")
                .filter({ hasText: `${betrifft}` })
                .nth(2)
                .getByRole("switch")
                .click();
        } else {
            await this.page.getByTestId("empfaengerIds").getByRole("switch").first().click();
        }

        await this.page.getByRole("button", { name: "Dokument erstellen" }).first().click();

        await this.page.waitForTimeout(3000);

        await this.page.keyboard.press("Control+W");
        await this.page.waitForTimeout(500);

        await this.page.bringToFront();
    }
    async fillInfoToDocument(titel: string, thema: string, betrifft: string, instOderBezug: string, instOBezNamen: string, kontPerson: string, absender: string) {
        await this.briefAnDritteTitle.fill(titel);
        await this.briefAnDritteThemaKeys.click();
        await this.page.getByRole("option", { name: `${thema}` }).click();
        await this.page.keyboard.press("Escape");
        if (betrifft !== "Ganze Klientschaft") {
            await this.page
                .getByTestId("personIds_Betrifft")
                .locator("div")
                .filter({ hasText: `${betrifft}` })
                .nth(2)
                .getByRole("switch")
                .click();
        }

        const errorElement = this.page.locator(".mat-mdc-form-field-error.mat-mdc-form-field-bottom-align.ng-star-inserted");
        if (await errorElement.isVisible()) {
            await this.page
                .getByTestId("personIds_Betrifft")
                .locator("div")
                .filter({ hasText: `${betrifft}` })
                .nth(2)
                .getByRole("switch")
                .click();
        }
        await this.page.getByRole("radio", { name: `${instOderBezug}` }).click();
        await this.briefAnDritteInstitution.pressSequentially(`${instOBezNamen}`, {
            delay: 100
        });
        await this.page.getByRole("option", { name: `${instOBezNamen}` }).click();
        await this.briefAnDritteAbsender.click();
        await this.page.getByRole("option", { name: `${absender}` }).click();

        await this.briefAnDritteAddBtn.click();
        this.page.once("dialog", (dialog) => dialog.dismiss().catch(() => {}));
        await this.page.keyboard.press("Enter");
    }
    async showHinzugefugt() {
        // await this.page.getByRole('button', {name : /Filter leeren|Réinitialiser le filtre/i}).click()
        const hinDurch = this.page.locator("app-dokumenteneingang-dropzone");
        await hinDurch.waitFor({ state: "visible" });
        await this.page.locator("thead button").waitFor({ state: "visible" });
        await this.page.locator("thead button").click();
        await this.page
            .getByRole("menuitem", { name: /Hinzugefügt|Ajouté/i })
            .locator("mat-checkbox")
            .click();
    }
    async sortDokumentByName() {
        const filenameSortHeader = this.page.locator("thead th[mat-sort-header='Filename']");
        const ariaSort = await filenameSortHeader.getAttribute("aria-sort");
        if (ariaSort === "none" || ariaSort === "descending") {
            await filenameSortHeader.click();
        }
    }
}
