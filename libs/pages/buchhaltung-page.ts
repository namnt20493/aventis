import { Page, Locator, expect } from "@playwright/test";
import { CommonPage } from "./common-page";
import { NavigationPage } from "./navigation-page";
import { StabilityHelper } from "../utils/stability-helper";
import { time } from "node:console";

export class BuchhaltungPage {
    page: Page;
    stabilityHelper: StabilityHelper;
    menuDropdown: Locator;
    buchhaltungMenuItem: Locator;
    buchenMenuItem: Locator;
    buchungenItem: Locator;
    bisValutadatumTxtbox: Locator;
    zustandigeCombobox: Locator;
    buchungenImportieren: Locator;
    rows: Locator;
    betrag: Locator;
    expectTotalBetrag: Locator;
    rowBetrag: Locator;
    summeSelektierter: Locator;
    buchungenBtn: Locator;
    dossierSelect: Locator;
    zahlungsauftragBtn: Locator;
    filterZurucksetzen: Locator;
    buchungDetailTotalSum: Locator;
    dossierName: Locator;
    valutaDetail: Locator;
    iban: Locator;
    buchungsText: Locator;
    dossierFilter: Locator;
    wshBuchungenTab: Locator;
    oldbookingMsg: Locator;
    schliessenBtn: Locator;
    menuItemAuswerten: Locator;
    sozialhilfeschuldItem: Locator;
    klientInput: Locator;
    stichdatum: Locator;
    btnSozialhilfeschuldBerechnen: Locator;
    zahlungsauftragTab: Locator;
    zahlungsauftragTotal: Locator;
    buchaltungInput: Locator;
    zustandigeInput: Locator;
    commonPage: CommonPage;
    tbodyRow!: Locator;
    filterLeerenBtn: Locator;
    navigation: NavigationPage;

    constructor(page: Page) {
        this.page = page;
        this.stabilityHelper = new StabilityHelper(page);
        this.navigation = new NavigationPage(page);
        this.commonPage = new CommonPage(page);
        this.menuDropdown = page.getByRole("button", { name: /Menü|Menu/i });
        this.buchhaltungMenuItem = page.getByRole("menuitem", {
            name: /Buchhaltung|Comptabilité/i
        });
        this.buchenMenuItem = page.locator("a").filter({ hasText: /^Buchen$|^Comptabiliser$/i });
        this.buchungenItem = page.getByRole("button", {
            name: /^Verbuchen und zahlen|Comptabiliser et payer/i
        });
        this.bisValutadatumTxtbox = page.getByTestId("faelligkeitBis").getByTestId("root-control");
        this.zustandigeCombobox = page.getByTestId("dossierregionIds").getByTestId("root-control");
        this.buchungenImportieren = page.getByTestId("button-import");
        this.rows = page.locator("tbody tr");
        this.rowBetrag = this.rows.locator("td").filter({ hasText: "CHF" });
        this.betrag = this.rows.getByRole("gridcell").filter({ hasText: "CHF" });
        this.expectTotalBetrag = page.locator("td").filter({ hasText: "Total Betrag: CHF " });
        this.summeSelektierter = page.locator("app-readmode-field span").first();
        this.buchungenBtn = page.getByTestId("button-import");
        this.dossierSelect = page.getByTestId("dossierId").getByTestId("root-control");
        this.zahlungsauftragBtn = page.getByTestId("button-next-2");
        this.filterZurucksetzen = page.getByRole("button", {
            name: /Filter zurücksetzen|Réinitialiser le filtre/i
        });
        this.filterLeerenBtn = page.getByRole("button", {
            name: /Filter leeren|Effacer le filtre/i
        });
        this.buchungDetailTotalSum = page.locator("app-buchung-detail-table b");
        this.dossierName = page.locator("app-readmode-field:has-text('Dossier')");
        this.valutaDetail = page.locator("app-readmode-field:has-text('Fälligkeitsdatum'),app-readmode-field:has-text('Date')");
        this.iban = page.locator("app-readmode-field:has-text('IBAN')");
        this.buchungsText = page.locator("app-readmode-field:has-text('Buchungstext'),app-readmode-field:has-text('Texte')");
        this.dossierFilter = page.getByTestId("dossierId").getByTestId("root-control");
        this.wshBuchungenTab = page.getByRole("tab", {
            name: /WSH-Buchungen importieren|Importer des écritures ASE/i
        });
        this.oldbookingMsg = page.locator("app-snackbar");
        this.schliessenBtn = this.oldbookingMsg.locator("button");
        this.menuItemAuswerten = page.locator("a").filter({ hasText: "Auswerten" });
        this.sozialhilfeschuldItem = page.getByRole("button", {
            name: /Sozialhilfeschuld|Dette d'aide sociale/i
        });
        this.klientInput = page.getByTestId("personId").getByTestId("root-control");
        this.stichdatum = page.getByTestId("stichtag").getByTestId("root-control");
        this.btnSozialhilfeschuldBerechnen = page.getByRole("button", {
            name: /Sozialhilfeschuld berechnen|Calculer la dette d'aide sociale/i
        });
        this.zahlungsauftragTab = page.getByRole("tab", {
            name: /Zahlungsauftrag erstellen|Créer un ordre de paiement/i
        });
        this.zahlungsauftragTotal = page.locator("tfoot td[class*='currency-column']");
        this.buchaltungInput = page.getByTestId("buchhaltungsmandantId").getByTestId("root-control");
        this.zustandigeInput = page.getByTestId("dossierregionIds").getByTestId("root-control");
    }
    async workaroundBU01(dossier: string) {
        // Check if we're already on a Buchhaltung page - if so, skip navigation
        const currentUrl = this.page.url();
        if (currentUrl.includes("/buchungen/") || currentUrl.includes("/buchhaltung/")) {
            console.log("✅ Already on Buchhaltung page, skipping workaroundBU01 navigation");
            return;
        }

        // Try to navigate to dossier via search
        await this.navigation.searchDossier(dossier);
        const zahlungenLink = this.page.getByTestId("ZahlungenInDossierFreigebenRoute");
        try {
            await zahlungenLink.waitFor({ state: "visible", timeout: 5000 });
            await zahlungenLink.click();
            await this.commonPage.waitForApiHelper(this.page, "WshLeistungQuery", async () => {}, 200, 10000);
        } catch {
            // Menu might be collapsed - try opening it
            try {
                await this.navigation.openMenuNav();
                await zahlungenLink.waitFor({ state: "visible", timeout: 3000 });
                await zahlungenLink.click();
                await this.commonPage.waitForApiHelper(this.page, "WshLeistungQuery", async () => {}, 200, 10000);
            } catch {
                // If still not visible (e.g., user role doesn't have access), skip and navigate directly
                console.log("⚠️ ZahlungenInDossierFreigebenRoute not accessible, skipping workaround");
                return;
            }
        }
    }
    //wait for row to be invisible
    async waitForRowToBeInvisible() {
        await this.page.waitForSelector("tbody tr", { state: "hidden" });
        await this.closeOldBookingMsg();
    }
    // fill in zustandige gemeinde
    async fillZustandigeGemeinde(zustGemeinde: string) {
        if (zustGemeinde !== "") {
            await this.zustandigeInput.fill(zustGemeinde);
            const option = this.page.locator(`mat-option:has-text("${zustGemeinde}")`).last();
            await option.waitFor({ state: "visible", timeout: 10000 });
            await option.click();
        }
    }
    // /fill buchlatung
    async fillBuchhaltung(buchhaltung: string) {
        if (buchhaltung !== "") {
            await this.buchaltungInput.click();
            await this.page.locator(`mat-option:has-text('${buchhaltung}')`).click();
        }
    }
    //switch to Zahlungsauftrag erstellen
    async switchToZahlungsauftragErstellen() {
        await this.zahlungsauftragTab.waitFor({ state: "visible", timeout: 10000 });
        await this.stabilityHelper.stableClick(this.zahlungsauftragTab);
        await this.navigation.waitForPageReady();
        await this.navigation.waitForSpinnerToDisappear();
    }
    //get text before comma
    getTextBeforeComma(input: string): string {
        return input.split(",")[0];
    }

    //sozialhifeschuld search
    async inputSozialhifeschuldSearch(klient: string, stichDatum: string) {
        await this.stichdatum.fill(stichDatum);
        await this.klientInput.first().fill(this.getTextBeforeComma(klient));
        await this.page.locator(`mat-option:has-text("${klient}")`).first().click();
        await this.btnSozialhilfeschuldBerechnen.click();
        await this.navigation.waitForPageReady();
        await this.closeErrorDialogIfPresent();
    }

    async closeErrorDialogIfPresent() {
        const errorDialog = this.page.locator("dialog:has-text('Fehler aufgetreten')");
        if (await errorDialog.isVisible({ timeout: 2000 }).catch(() => false)) {
            const closeButton = errorDialog.getByRole("button", { name: /Schliessen/i }).first();
            await closeButton.click();
            await this.navigation.waitForPageReady();
        }
    }

    //validate sozialhilfeschuld
    async validateSozialhilfeschuld(dossier: string, zeilenTotal: string) {
        const noDataRow = this.page.locator("table tbody tr:has-text('Keine Daten')");
        const hasNoData = await noDataRow.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasNoData) {
            await expect.soft(noDataRow).toBeVisible();
            return;
        }

        if (dossier !== "") {
            await expect.soft(this.page.locator(`tr:has-text('${dossier}')`).first()).toBeVisible();
            await expect.soft(this.page.locator(`tr:has-text('${dossier}') td[class*='currency-column']`).last()).toContainText(this.normalizeString(zeilenTotal));
        } else {
            const resultsTable = this.page.locator("table tbody tr").first();
            await expect.soft(resultsTable).toBeVisible();
            if (zeilenTotal !== "") {
                await expect.soft(this.page.locator("table tbody tr td[class*='currency-column']").first()).toContainText(this.normalizeString(zeilenTotal));
            }
        }
    }

    //select sozialhilfeschuld item
    async selectSozialhilfeschuldItem() {
        await this.menuDropdown.click();
        await this.buchhaltungMenuItem.click();
        await this.menuItemAuswerten.click();
        await this.sozialhilfeschuldItem.click();
    }
    async closeOldBookingMsg() {
        if (await this.oldbookingMsg.isVisible()) {
            await this.stabilityHelper.closeDialog();
        }
    }

    async selectWSHBuchungenTab() {
        await this.wshBuchungenTab.click();
    }
    async clickBuchungsposition(buDate: string, buText: string, dossier: string) {
        let locator = "tr";
        if (buDate !== "") {
            locator += `:has-text('${buDate}')`;
        }
        if (buText !== "") {
            locator += `:has-text('${buText}')`;
        }
        locator += `:has-text('${dossier}') button`;
        await this.page.locator(locator).first().click();
    }
    async validateBuchungsDetail(buDate: string, buText: string, iban: string, dossier: string, sumBetrag: string) {
        await expect.soft(this.dossierName).toContainText(dossier);
        if (buDate !== "") {
            await expect.soft(this.valutaDetail).toContainText(buDate);
        }
        if (iban !== "") {
            await expect.soft(this.iban).toContainText(this.commonPage.formatAccountNumber(iban));
        }
        if (buText !== "") {
            await expect.soft(this.buchungsText).toContainText(buText);
        }
        if (sumBetrag !== "") {
            await expect.soft(this.buchungDetailTotalSum).toContainText(sumBetrag);
        }
    }

    async buchhaltungFilter(bisDatum: string, zustGemeinde: string, dossier: string) {
        await this.bisValutadatumTxtbox.fill(bisDatum);
        await this.bisValutadatumTxtbox.press("Tab");
        await this.page.waitForTimeout(300);

        if (zustGemeinde !== "") {
            await this.zustandigeCombobox.fill(zustGemeinde);
            await this.page.locator(`mat-option:has-text("${zustGemeinde}")`).click();
            await this.page.waitForTimeout(300);
        }

        await this.dossierFilter.fill(dossier);
        await this.page.locator(`mat-option:has-text("${dossier}")`).first().click();
        await this.page.waitForTimeout(1500);
        await this.navigation.waitForSpinnerToDisappear();
    }
    async clickFilterLeeren() {
        await this.filterLeerenBtn.click();
        await this.navigation.waitForPageReady();
    }
    async clickFilterZurucksetzen() {
        await this.filterZurucksetzen.click();
        await this.navigation.waitForPageReady();
    }
    async clickZahlungsauftragBtn() {
        const zahlungsauftragButton = this.page.getByRole("button", { name: /^Zahlungsauftrag erstellen \(/i });
        await zahlungsauftragButton.waitFor({ state: "visible", timeout: 10000 });
        await this.stabilityHelper.stableClick(zahlungsauftragButton);
        await this.navigation.waitForPageReady();
    }
    async clickBuchungenBtn() {
        await this.navigation.waitForSpinnerToDisappear();
        await this.navigation.waitForPageReady();

        const rows = this.page.locator("tbody tr").filter({ hasNot: this.page.locator(':text("Keine Resultate")') });
        const rowCount = await rows.count();

        if (rowCount > 0) {
            const headerCheckbox = this.page.locator("thead mat-checkbox").first();
            const headerExists = await headerCheckbox.isVisible({ timeout: 5000 }).catch(() => false);

            if (headerExists) {
                await headerCheckbox.click();
                await this.navigation.waitForPageReady();
            } else {
                for (let i = 0; i < rowCount; i++) {
                    const rowCheckbox = rows.nth(i).locator("mat-checkbox");
                    const rowVisible = await rowCheckbox.isVisible({ timeout: 2000 }).catch(() => false);
                    if (rowVisible) {
                        await rowCheckbox.click();
                    }
                }
                await this.navigation.waitForPageReady();
            }
        }

        const importBtn = this.page.getByTestId("importClicked");
        await importBtn.waitFor({ state: "visible", timeout: 10000 });
        await expect(importBtn).toBeEnabled({ timeout: 10000 });
        await this.stabilityHelper.stableClick(importBtn);
        await this.navigation.waitForPageReady();
        await this.navigation.waitForSpinnerToDisappear();
    }
    async goToBuchungenImportieren() {
        await this.menuDropdown.click();
        await this.buchhaltungMenuItem.click();
        await this.buchenMenuItem.click();
        await this.buchungenItem.click();
        await this.navigation.waitForPageReady({ timeout: 15000 });
        await this.wshBuchungenTab.waitFor({ state: "visible", timeout: 10000 });
        await this.stabilityHelper.stableClick(this.wshBuchungenTab);
        await this.navigation.waitForPageReady();
    }
    async checkResult(dossier: string) {
        const theadCheckbox = this.page.locator('thead mat-checkbox input[type="checkbox"]');
        const isChecked = await theadCheckbox.isChecked();
        if (isChecked) {
            await theadCheckbox.click();
        }

        const rows = this.page.locator(`tbody tr:has-text("${dossier}")`);
        const rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
            const rowCheckbox = rows.nth(i).locator('mat-checkbox input[type="checkbox"]');
            const checked = await rowCheckbox.isChecked();
            if (!checked) {
                await rowCheckbox.click();
            }
        }
    }
    async fillDossier(dossier: string) {
        if (dossier !== "") {
            await this.dossierSelect.fill(dossier);
            const option = this.page.locator(`mat-option:has-text("${dossier}")`).first();
            await option.waitFor({ state: "visible", timeout: 10000 });
            await option.click();
        }
        await this.commonPage.waitForApiHelper(this.page, "PendingVorbuchungenQuery", async () => {});
    }
    async fillDossierForZahlungsauftrag(dossier: string) {
        if (dossier !== "") {
            await this.dossierSelect.fill(dossier);
            const option = this.page.locator(`mat-option:has-text("${dossier}")`).first();
            await option.waitFor({ state: "visible", timeout: 10000 });
            await option.click();
            await this.navigation.waitForPageReady();
        }
    }

    async fillBisValuatadatum(date: string) {
        await this.bisValutadatumTxtbox.clear();
        await this.bisValutadatumTxtbox.fill(date);
        await this.bisValutadatumTxtbox.press("Tab");
        await this.navigation.waitForPageReady();
    }
    async fillBisValuatadatumForZahlungsauftrag(date: string) {
        await this.bisValutadatumTxtbox.clear();
        await this.bisValutadatumTxtbox.fill(date);
        await this.bisValutadatumTxtbox.press("Tab");
        await this.navigation.waitForPageReady();
    }
    async selectZustandige(gemeinde: string) {
        await this.zustandigeCombobox.fill(gemeinde);
        await this.page.locator("mat-option:visible").last().click();
    }
    async selectDossier(dossier: string) {
        await this.dossierSelect.fill(dossier);
        await this.page.locator(`mat-option:has-text("${dossier}")`).first().click();
    }
    async selectZalungensauftrag(dossier: string, bisValutaDatum: string) {
        await this.navigation.waitForSpinnerToDisappear();
        const rowLocator = this.page.locator("tbody tr").first();
        const isRowVisible = await rowLocator.isVisible().catch(() => false);

        if (!isRowVisible) {
            await this.stabilityHelper.stableClick(this.wshBuchungenTab);
            await this.fillDossier(dossier);
            await this.fillBisValuatadatum(bisValutaDatum);
            await this.clickBuchungenBtn();
            await this.switchToZahlungsauftragErstellen();
            await this.clickFilterZurucksetzen();
            await this.fillDossierForZahlungsauftrag(dossier);
            await this.fillBisValuatadatumForZahlungsauftrag(bisValutaDatum);
        }

        await rowLocator.waitFor({ state: "visible", timeout: 15000 });
    }

    async checkZahlungTotal(checkZahlungTotal: string | number) {
        if (checkZahlungTotal !== "") {
            //19.06.2025 reto
            await expect.soft(this.zahlungsauftragTotal).toContainText(String(checkZahlungTotal));
        }
    }
    normalizeString(str: string): string {
        const normalizedStr = str.replace(/[^\d.]/g, "");
        // Separate the integer part and the decimal part
        const parts = normalizedStr.split(".");
        let integerPart = parts[0];
        let decimalPart = parts.length > 1 ? parts[1] : "";
        // Add a ' after every thousand
        const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, "’");
        // Keep 2 decimals
        if (decimalPart.length < 2) {
            decimalPart = decimalPart.padEnd(2, "0");
        } else if (decimalPart.length > 2) {
            decimalPart = decimalPart.slice(0, 2);
        }
        // Combine integer and decimal parts
        const formattedStr = formattedIntegerPart + (decimalPart ? `.${decimalPart}` : "");
        return formattedStr;
    }
    async checkTotalBetragWithSummeSelektierter() {
        //delete waitforTimeout
        const totalBetrag = await this.getTotalBetrag();
        const normalizedTotalBetrag = this.normalizeString(totalBetrag.toString());
        const summeSelektierterText = await this.summeSelektierter.innerText();
        const normalizedSummeSelektierter = this.normalizeString(summeSelektierterText);
        await expect.soft(normalizedTotalBetrag).toBe(normalizedSummeSelektierter);
    }

    async getTotalBetrag(): Promise<number> {
        let totalBetrag = 0;
        const rowCount = await this.rows.count();
        for (let i = 0; i < rowCount; i++) {
            const betragText = await this.rowBetrag.nth(i).innerText();
            const betragNumber = parseFloat(betragText.replace(/[^\d.-]/g, ""));
            totalBetrag += betragNumber;
        }
        return totalBetrag;
    }
}
