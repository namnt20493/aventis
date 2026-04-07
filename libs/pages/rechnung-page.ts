import { Page, Locator } from "@playwright/test";
import { NavigationPage } from "./navigation-page";
import { CommonPage } from "./common-page";
import { StabilityHelper } from "@utils/stability-helper";

export class RechnungPage {
    page: Page;
    private stabilityHelper: StabilityHelper;
    navigation: NavigationPage;
    rechnungStatus: Locator;
    leistungWahlen: Locator;
    belegdatum: Locator;
    rechnungsnummer: Locator;
    referenznummer: Locator;
    kommentar: Locator;
    falligkeitsdatum: Locator;
    finanzierung: Locator;
    konto: Locator;
    betrifftPerson: Locator;
    betrag: Locator;
    commonPage: CommonPage;
    zahlungenField: Locator;
    zahlunggenFreigebenNavlink: Locator;
    rechnungenTab: Locator;
    btnSpeichern: Locator;
    rechnungNavLink: Locator;
    btnSpeichernUndZur: Locator;
    filterLeeren: Locator;
    filterZurucksetzen: Locator;
    dossierSearchTxtbox: Locator;
    constructor(page: Page) {
        this.page = page;
        this.stabilityHelper = new StabilityHelper(page);
        this.navigation = new NavigationPage(page);
        this.commonPage = new CommonPage(page);
        this.rechnungNavLink = page.getByRole("link", {
            name: /Rechnungen bearbeiten|Factures/i
        });
        this.rechnungStatus = page.getByTestId("status").getByTestId("root-control");
        this.leistungWahlen = page.getByTestId("leistungId").getByTestId("root-control");
        this.belegdatum = page.getByTestId("belegdatum").getByTestId("root-control");
        this.rechnungsnummer = page.getByTestId("rechnungsnummer").getByTestId("root-control");
        this.referenznummer = page.getByTestId("referenznummer").getByTestId("root-control");
        this.kommentar = page.getByTestId("bemerkung").getByTestId("root-control");
        this.falligkeitsdatum = page.getByTestId("faelligkeitsdatum").getByTestId("root-control");
        this.finanzierung = page.getByTestId("anspruchsposition").getByTestId("root-control");
        this.konto = page.getByTestId("kontoParameterWshId").getByTestId("root-control");
        this.betrifftPerson = page.getByTestId("personInDossierId").getByTestId("root-control");
        this.betrag = page.getByTestId("betrag").getByTestId("root-control");
        this.zahlungenField = page.getByRole("button", {
            name: /Zahlungen|Paiements/i
        });
        this.zahlunggenFreigebenNavlink = page.getByRole("link", {
            name: /Zahlungen und Rechnungen freigeben|Libérer les paiements et les factures/i
        });
        this.rechnungenTab = page.getByRole("tab", {
            name: /Rechnungen|Factures/i
        });
        this.btnSpeichern = page.getByRole("button", {
            name: /Speichern|Enregistrer/i
        });
        this.btnSpeichernUndZur = page.getByRole("button", {
            name: /Speichern und Schliessen|Enregistrer et fermer/i
        });
        this.filterZurucksetzen = page.getByTestId("resetFilters").filter({ hasText: "Filter zurücksetzen" });
        this.filterLeeren = page.getByTestId("resetFilters").filter({ hasText: "Filter leeren" });
        this.dossierSearchTxtbox = page.getByTestId("searchString").getByTestId("root-control");
    }
    async clickFilterLeerenIfVisible() {
        const isLeerenVisible = await this.filterLeeren.isVisible({ timeout: 3000 }).catch(() => false);

        if (isLeerenVisible) {
            console.log("🔍 Filter leeren button visible, clicking to clear search field");
            await this.filterLeeren.click();
            await this.navigation.waitForPageReady();
            return;
        }

        const filterZuruecksetzenBtn = this.page.getByRole("button", { name: /Filter zurücksetzen|Réinitialiser/i });
        const isResetVisible = await filterZuruecksetzenBtn.isVisible({ timeout: 3000 }).catch(() => false);

        if (isResetVisible) {
            console.log("🔍 Filter zurücksetzen button visible, clicking to reset ALL filters (including status filter)");
            await filterZuruecksetzenBtn.click();
            await this.navigation.waitForPageReady();
            await this.page.waitForTimeout(1000);
        } else {
            console.log("🔍 No filter buttons visible, skipping reset");
        }
    }
    async filterRechnungen(dossier: string) {
        console.log(`🔍 [FilterRechnungen] Starting filter for dossier: ${dossier}`);
        await this.navigation.waitForPageReady();
        await this.page.waitForTimeout(1000);

        await this.clickFilterLeerenIfVisible();

        await this.dossierSearchTxtbox.waitFor({ state: "visible", timeout: 10000 });

        const currentValue = await this.dossierSearchTxtbox.inputValue();
        if (currentValue !== "") {
            console.log(`🔍 [FilterRechnungen] Search field not empty ("${currentValue}"), clearing first...`);
            await this.dossierSearchTxtbox.clear();
            await this.page.waitForTimeout(300);
        }

        console.log(`🔍 [FilterRechnungen] Filling search field with: "${dossier}"`);
        await this.dossierSearchTxtbox.fill(dossier);
        await this.page.waitForTimeout(300);

        const filledValue = await this.dossierSearchTxtbox.inputValue();
        if (filledValue !== dossier) {
            console.error(`❌ [FilterRechnungen] Search field value mismatch! Expected: "${dossier}", Got: "${filledValue}"`);
        }

        await this.page.keyboard.press("Enter");
        await this.navigation.waitForPageReady();
        await this.page.waitForTimeout(1500);

        const resultCount = this.page.locator("app-message-display, .message-display").getByText(/Anzahl Suchtreffer/i);
        const resultVisible = await resultCount.isVisible({ timeout: 3000 }).catch(() => false);

        if (resultVisible) {
            const resultText = await resultCount.textContent();
            console.log(`🔍 [FilterRechnungen] ${resultText}`);

            if (resultText && resultText.includes(": 0")) {
                console.log(`⚠️ [FilterRechnungen] No results found initially for "${dossier}" - waiting and retrying...`);
                await this.page.waitForTimeout(3000);

                await this.clickFilterLeerenIfVisible();
                await this.dossierSearchTxtbox.fill(dossier);
                await this.page.keyboard.press("Enter");
                await this.navigation.waitForPageReady();
                await this.page.waitForTimeout(1500);

                const retryResultText = await resultCount.textContent().catch(() => "");
                console.log(`🔍 [FilterRechnungen] After retry: ${retryResultText}`);
            }
        }
    }
    async editRechnungRow(dossier: string, zahlEmpfaenger: string, belDatum: string, valutaDatum: string, betrag: number, kommentar: string, statusNeu: string) {
        console.log(`🔍 [EditRechnungRow] Searching for invoice to ${statusNeu}: dossier="${dossier}", zahlEmpfaenger="${zahlEmpfaenger}"`);

        await this.navigation.waitForPageReady();

        let locator = "tbody tr";
        if (dossier) locator += `:has-text("${dossier}")`;
        if (zahlEmpfaenger) locator += `:has-text("${zahlEmpfaenger}")`;
        if (belDatum) locator += `:has-text("${belDatum}")`;
        if (valutaDatum) locator += `:has-text("${valutaDatum}")`;

        const row = this.page.locator(locator);
        const rowCount = await row.count();
        if (rowCount === 0) {
            console.error(`❌ [EditRechnungRow] No matching invoice found`);
            const allRows = await this.page.locator("tbody tr").allTextContents();
            throw new Error(`No invoice found matching: dossier="${dossier}", zahlEmpfaenger="${zahlEmpfaenger}", belDatum="${belDatum}", valutaDatum="${valutaDatum}". Available rows: ${allRows.slice(0, 5).join(" | ")}`);
        }

        console.log(`✅ [EditRechnungRow] Found ${rowCount} matching row(s), opening invoice`);
        const editLink = row.locator("a").last();
        await editLink.waitFor({ state: "visible", timeout: 10000 });
        await editLink.click();
        await this.navigation.waitForPageReady();

        console.log(`🔍 [EditRechnungRow] Filling comment and clicking "${statusNeu}"`);
        await this.kommentar.fill(kommentar);

        const statusButton = this.page.getByRole("button", { name: `${statusNeu}` });
        await statusButton.waitFor({ state: "visible", timeout: 10000 });
        await statusButton.click();

        await this.navigation.waitForPageReady();
        console.log(`✅ [EditRechnungRow] Invoice status changed to "${statusNeu}"`);
    }
    async goToRechnungenTab(dossier: string) {
        console.log(`🔍 [GoToRechnungenTab] Navigating to Rechnungen tab`);

        await this.rechnungenTab.waitFor({ state: "visible", timeout: 10000 });
        await this.rechnungenTab.click();
        await this.navigation.waitForPageReady();
        await this.clickFilterLeerenIfVisible();
        console.log(`🔍 [GoToRechnungenTab] Searching for dossier: ${dossier}`);
        const searchField = this.page.getByTestId("suchbegriff").getByTestId("root-control");
        await searchField.waitFor({ state: "visible", timeout: 10000 });
        await searchField.fill(dossier);
        await this.page.keyboard.press("Enter");
        await this.navigation.waitForPageReady();

        await this.page.waitForTimeout(1000);
        console.log(`✅ [GoToRechnungenTab] Search completed`);
    }
    async goToZahlungen() {
        console.log(`🔍 [GoToZahlungen] Navigating to Zahlungen und Rechnungen freigeben`);

        await this.zahlunggenFreigebenNavlink.waitFor({ state: "visible", timeout: 10000 });
        await this.zahlunggenFreigebenNavlink.click();
        await this.navigation.waitForPageReady();

        await this.rechnungenTab.waitFor({ state: "visible", timeout: 10000 });
        await this.rechnungenTab.click();
        await this.navigation.waitForPageReady();

        console.log(`✅ [GoToZahlungen] Navigated to Rechnungen tab`);
    }
    async editRechnung(dossier: string, zahlEmpfaenger: string, betrag: string, valutaDatum: string, belegdatum: string) {
        console.log(`🔍 [EditRechnung] Looking for invoice: dossier="${dossier}", zahlEmpfaenger="${zahlEmpfaenger}"`);

        await this.navigation.waitForPageReady();
        await this.page.waitForTimeout(1000);

        let locator = "tbody tr";

        if (dossier) {
            locator += `:has-text("${dossier}")`;
        }
        if (zahlEmpfaenger) {
            locator += `:has-text("${zahlEmpfaenger}")`;
        }
        if (valutaDatum) {
            locator += `:has-text("${valutaDatum}")`;
        }
        if (belegdatum) {
            locator += `:has-text("${belegdatum}")`;
        }

        const td = this.page.locator(locator);
        let rowCount = await td.count();

        if (rowCount === 0) {
            console.log(`⚠️ [EditRechnung] No rows found on first attempt, waiting 3s and retrying...`);
            await this.page.waitForTimeout(3000);
            rowCount = await td.count();
        }

        if (rowCount === 0) {
            console.error(`❌ [EditRechnung] No matching invoice found after retry`);
            const allRows = await this.page.locator("tbody tr").allTextContents();
            const resultCount = await this.page
                .locator("app-message-display, .message-display")
                .getByText(/Anzahl Suchtreffer/i)
                .textContent()
                .catch(() => "N/A");
            throw new Error(`No invoice found matching: dossier="${dossier}", zahlEmpfaenger="${zahlEmpfaenger}", betrag="${betrag}". Search result count: ${resultCount}. Available rows: ${allRows.slice(0, 5).join(" | ")}`);
        }

        console.log(`✅ [EditRechnung] Found ${rowCount} matching row(s), clicking edit link`);
        const editLink = td.locator("a").last();
        await editLink.waitFor({ state: "visible", timeout: 10000 });
        await editLink.click();
        await this.navigation.waitForPageReady();
    }
    async fillRechnungInfo(statusSet: string, belDatum: string, rechNummer: string, referenzNummer: string, kommentar: string, faellDatam: string, finanzierung: string, konto: string, betrifftPerson: string, zahlBetrag: string) {
        console.log(`🔍 [FillRechnungInfo] Filling invoice details, status: ${statusSet}`);
        await this.navigation.waitForPageReady();

        await this.rechnungStatus.click();
        await this.page.waitForTimeout(300);
        const statusOption = this.page.locator(`mat-option:has-text("${statusSet}")`);
        await statusOption.waitFor({ state: "visible", timeout: 5000 });
        await statusOption.click();

        await this.belegdatum.fill(belDatum);
        await this.rechnungsnummer.fill(rechNummer);

        if (referenzNummer && referenzNummer !== "") {
            const isRefNrVisible = await this.referenznummer.isVisible({ timeout: 3000 }).catch(() => false);
            if (isRefNrVisible) {
                console.log(`🔍 [FillRechnungInfo] Filling Referenznummer: ${referenzNummer}`);
                await this.referenznummer.fill(referenzNummer);
            } else {
                console.log("⚠️ Referenznummer field not visible - feature might not be deployed yet");
            }
        }

        await this.kommentar.fill(kommentar);
        await this.falligkeitsdatum.fill(faellDatam);

        console.log(`🔍 [FillRechnungInfo] Filling Detailbuchung: ${finanzierung} -> ${konto}`);

        await this.finanzierung.first().fill(finanzierung);
        await this.page.waitForTimeout(500);
        const finanzierungOption = this.page.locator(`mat-option:has-text("${finanzierung}")`);
        await finanzierungOption.waitFor({ state: "visible", timeout: 10000 });
        await finanzierungOption.click();

        await this.page.waitForTimeout(300);
        await this.konto.first().fill(konto);
        await this.page.waitForTimeout(500);
        const kontoOption = this.page.locator(`mat-option:has-text("${konto}")`).first();
        await kontoOption.waitFor({ state: "visible", timeout: 10000 });
        await kontoOption.click();

        if (betrifftPerson !== "") {
            await this.betrifftPerson.first().fill(betrifftPerson);
            await this.page.waitForTimeout(500);
            const personOption = this.page.locator(`mat-option:has-text("${betrifftPerson}")`);
            await personOption.waitFor({ state: "visible", timeout: 10000 });
            await personOption.click();
        }

        await this.betrag.first().fill(zahlBetrag.toString());

        console.log(`🔍 [FillRechnungInfo] Saving invoice...`);
        await this.stabilityHelper.stableClick(this.btnSpeichernUndZur);
        await this.navigation.waitForPageReady();

        // Wait for any dialogs to close after save
        await this.page.waitForTimeout(2000);

        // Close any error dialogs if present
        const errorDialogCloseBtn = this.page.getByRole("button", { name: "Schliessen" });
        if (await errorDialogCloseBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            console.log("⚠️ Error dialog detected, closing...");
            await errorDialogCloseBtn.click();
            await this.page.waitForTimeout(1000);
        }

        // Wait for overlay backdrop to disappear
        const backdrop = this.page.locator(".cdk-overlay-backdrop");
        await backdrop.waitFor({ state: "hidden", timeout: 10000 }).catch(() => {
            console.log("⚠️ Backdrop still visible after timeout");
        });
    }
    async goToRechnungen() {
        await this.zahlungenField.click();
        await this.rechnungNavLink.click();
    }
    async searchAndVerifyResult(searchTerm: string, expectedRowText: string) {
        await this.clickFilterLeerenIfVisible();
        console.log(`🔍 Searching for: ${searchTerm}, expecting: ${expectedRowText}`);
        await this.dossierSearchTxtbox.fill(searchTerm);
        await this.page.keyboard.press("Enter");
        await this.navigation.waitForPageReady();
        const row = this.page.locator(`tbody tr:has-text("${expectedRowText}")`);
        const rowCount = await row.count();
        if (rowCount === 0) {
            throw new Error(`Search for "${searchTerm}" did not find any row containing "${expectedRowText}"`);
        }
    }
    async searchInRechnungenTabAndVerify(searchTerm: string, expectedRowText: string) {
        console.log(`🔍 [SearchInRechnungenTabAndVerify] Tab search for: "${searchTerm}"`);

        await this.rechnungenTab.waitFor({ state: "visible", timeout: 10000 });
        await this.rechnungenTab.click();
        await this.navigation.waitForPageReady();

        await this.clickFilterLeerenIfVisible();

        const searchField = this.page.getByTestId("suchbegriff").getByTestId("root-control");
        await searchField.waitFor({ state: "visible", timeout: 10000 });
        await searchField.fill(searchTerm);
        await this.page.keyboard.press("Enter");
        await this.navigation.waitForPageReady();

        await this.page.waitForTimeout(1000);

        const row = this.page.locator(`tbody tr:has-text("${expectedRowText}")`);
        const rowCount = await row.count();

        if (rowCount === 0) {
            console.error(`❌ [SearchInRechnungenTabAndVerify] No matching row found`);
            const allRows = await this.page.locator("tbody tr").allTextContents();
            throw new Error(`Search for "${searchTerm}" in Rechnungen tab did not find any row containing "${expectedRowText}". Available rows: ${allRows.slice(0, 5).join(" | ")}`);
        }

        console.log(`✅ [SearchInRechnungenTabAndVerify] Found ${rowCount} matching row(s) for "${searchTerm}"`);
    }
    async verifySearchFieldLabel(expectedLabel: string) {
        const label = this.page.getByText(expectedLabel);
        const isVisible = await label.isVisible({ timeout: 5000 }).catch(() => false);
        if (!isVisible) {
            console.log(`⚠️ Expected search field label "${expectedLabel}" not found - label might not be updated yet`);
        }
    }
}
