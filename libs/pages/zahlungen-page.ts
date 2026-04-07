import { Page, Locator, expect } from "@playwright/test";
import { NavigationPage } from "./navigation-page";
import { CommonPage } from "./common-page";
import { StabilityHelper } from "@utils/stability-helper";

export class ZahlungenPage {
    page: Page;
    private stabilityHelper: StabilityHelper;
    zahlungenNavlink: Locator;
    rows: Locator;
    valuta: Locator;
    checkbox: Locator;
    auswahlFreigebenBtn: Locator;
    freizugebenendeTab: Locator;
    checkboxAll: Locator;
    freigegebeneZahlugenTab: Locator;
    ausgefuhrteZahlungenTab: Locator;
    navigation: NavigationPage;
    zahlungenField: Locator;
    zahlungenNav: Locator;
    ubersichtTab: Locator;
    zahlungenTab: Locator;
    commonPage: CommonPage;
    rechnungenTab: Locator;
    dossierSearchInput: Locator;
    filterLeerenBtn: Locator;
    kommentarTxtbox: Locator;
    freigenbenBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.stabilityHelper = new StabilityHelper(page);
        this.navigation = new NavigationPage(page);
        this.commonPage = new CommonPage(page);
        this.zahlungenNavlink = page.getByTestId("ZahlungenInDossierFreigebenRoute");
        this.rows = page.locator("tbody tr");
        this.valuta = this.rows.locator("td[class='date-column']");
        this.checkbox = this.rows.locator("td[class*='checkbox-column']");
        this.auswahlFreigebenBtn = page.getByRole("button", {
            name: /^Auswahl freigeben$|^Libérer la sélection$/i
        });
        this.freizugebenendeTab = page.getByRole("tab").filter({ hasText: /Freizugebende Zahlungen|Paiements à libérer/i });
        this.checkboxAll = page.locator("thead mat-checkbox input[type='checkbox']");
        this.freigegebeneZahlugenTab = page.getByRole("tab").filter({ hasText: /Freigegebene Zahlungen|Paiements libérés/i });
        this.ausgefuhrteZahlungenTab = page.getByRole("tab").filter({ hasText: /Ausgeführte Zahlungen|Paiements effectués/i });
        //
        this.zahlungenField = page.getByRole("button", {
            name: /Zahlungen|Paiements/i
        });
        this.zahlungenNav = page.getByRole("link", {
            name: /Zahlungen freigeben|Libérer les paiements/i
        });
        this.zahlungenTab = page.getByRole("tab", { name: /Zahlungen|Paiements/i });
        this.ubersichtTab = page.getByRole("tab", {
            name: /Übersicht Dossiers|Aperçu des dossiers/i
        });
        this.rechnungenTab = page.getByRole("tab", {
            name: /Rechnungen|Factures/i
        });
        this.dossierSearchInput = page.getByTestId("suchbegriff").getByTestId("root-control");
        this.filterLeerenBtn = page.getByRole("button", {
            name: /Filter leeren|Vider le filtre/i
        });
        this.kommentarTxtbox = page.getByTestId("bemerkung").getByTestId("root-control");
        this.freigenbenBtn = page.getByRole("button", {
            name: /Freigeben|Libérer/i
        });
    }

    async goToRechnungenTab() {
        await this.rechnungenTab.click();
    }
    async inputDossierSearch(dossier: string) {
        await this.filterLeerenBtn.click();
        await this.dossierSearchInput.fill(dossier);
    }
    async editRechnungen(dossier: string, kommentar: string, rechnungsText: string) {
        if (rechnungsText !== "") {
            await this.page.locator(`tr:has-text('${dossier}'):has-text('${rechnungsText}') a`).first().click();
        } else {
            await this.page.locator(`tr:has-text('${dossier}') a`).first().click();
        }
        await this.kommentarTxtbox.fill(kommentar);
        await this.freigenbenBtn.click();
    }
    async goToUbersichtDossiers() {
        await this.zahlungenTab.click();
        await this.ubersichtTab.click();
    }
    async selectfreigebenZahlungen(dossier: string) {
        await this.page.locator(`tr:has-text('${dossier}') mat-checkbox`).click();
    }
    async clickZahlungenBtn() {
        await this.page.getByRole("link", { name: /Auswahl freigeben|Libérer la sélection/i }).click();
    }
    async checkzahlungenNumber() {
        await this.navigation.waitForPageReady();
        await this.navigation.waitForSpinnerToDisappear();
        const text = await this.freigegebeneZahlugenTab.textContent();
        if (text) {
            const number = this.commonPage.extractNumber(text);
            console.log(number);
            expect.soft(number).toBeGreaterThan(0);
        }
    }
    async selectZahlungen(dossier: string, totalBetrag: string) {
        // First, click on the correct tab ("Dossiers zu bearbeiten")
        const dossierZuBearbeitenTab = this.page.getByRole("tab", {
            name: /Dossiers zu bearbeiten|Dossiers à traiter/i
        });
        if (await dossierZuBearbeitenTab.isVisible({ timeout: 5000 }).catch(() => false)) {
            await dossierZuBearbeitenTab.click();
            await this.navigation.waitForPageReady();
        }

        // Filter by dossier name using the search field
        const searchField = this.page.getByPlaceholder(/Search|Suche|Recherche/i).first();
        if (await searchField.isVisible({ timeout: 5000 }).catch(() => false)) {
            await searchField.clear();
            await searchField.fill(dossier);
            await searchField.press("Enter");
            await this.navigation.waitForPageReady();
            await this.page.waitForTimeout(1000);
        }

        // Wait for filtered results to appear
        const dossierRow = this.page.locator(`tr:has-text('${dossier}')`).first();
        await dossierRow.waitFor({ state: "visible", timeout: 15000 });

        // Select the dossier checkbox
        await this.page.locator(`tr:has-text('${dossier}') input`).first().click();
        await this.page
            .getByRole("link", {
                name: /^Auswahl freigeben$|^Libérer la sélection$/i
            })
            .click();
        await this.clickCheckbox();
        await this.auswahlFreigebenBtn.click();
    }

    //check amount in ausgefuhrte Zahlungen tab
    async checkAmountZalungen(ausgefuehrteZahlungen: string) {
        await expect(this.ausgefuhrteZahlungenTab).toContainText(`${ausgefuehrteZahlungen}`);
    }

    async clickZalungenNavlink() {
        const zahlungenLink = this.page.getByRole("link", { name: /^Zahlungen$/i }).first();
        const combinedLocator = this.zahlungenNavlink.or(zahlungenLink);

        if (await combinedLocator.first().isVisible({ timeout: 5000 }).catch(() => false)) {
            await combinedLocator.first().click();
            await this.navigation.waitForPageReady();
            return;
        }

        const wshButton = this.page.locator("button").filter({ hasText: /^Wirtschaftliche Sozialhilfe$/i }).first();
        if (await wshButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            await wshButton.click();
        }

        await combinedLocator.first().click({ timeout: 5000 });
        await this.navigation.waitForPageReady();
    }
    async checkRowCount() {
        const rowCount = await this.rows.count();
        expect.soft(rowCount).toBeGreaterThan(1);
    }
    async clickFreizugebenenTab() {
        await this.freizugebenendeTab.click();
        await this.navigation.waitForPageReady();
        await this.navigation.waitForSpinnerToDisappear();
    }
    async clickAuswahlFreigenbenBtn() {
        await expect(this.auswahlFreigebenBtn).toBeEnabled({ timeout: 10000 });
        await this.auswahlFreigebenBtn.click();
        await this.navigation.waitForPageReady();
    }
    async clickCheckBoxAll() {
        await this.page.waitForSelector("tbody", { state: "visible" });
        if (!(await this.checkboxAll.isChecked())) {
            await this.checkboxAll.check();
        }
        // await this.checkboxAll.check()
    }
    async clickCheckbox() {
        await this.page.waitForSelector("tbody", { state: "visible" });
        await this.navigation.waitForSpinnerToDisappear();

        const checkboxLocator = this.page.locator("td mat-checkbox input[type='checkbox']");
        await checkboxLocator.first().waitFor({ state: "visible", timeout: 15000 });

        const count = await checkboxLocator.count();
        for (let i = 0; i < count; i++) {
            const checkbox = checkboxLocator.nth(i);
            const isEnabled = await checkbox.isEnabled().catch(() => false);
            const isChecked = await checkbox.isChecked().catch(() => true);
            if (isEnabled && !isChecked) {
                await checkbox.click({ force: true });
            }
        }
    }

    async selectRowInDateRange(startDate: string, endDate: string) {
        const rowsCount = await this.rows.count();
        for (let i = 0; i < rowsCount; i++) {
            const valutaText = await this.valuta.nth(i).innerText();
            const valutaDate = new Date(valutaText);
            if (valutaDate >= new Date(startDate) && valutaDate <= new Date(endDate)) {
                await this.checkbox.nth(i).check();
            }
        }
    }

    async checkFreigegebeneZahlungen(freigegebeneZahlungen: string) {
        if (freigegebeneZahlungen !== "") {
            await expect(this.freigegebeneZahlugenTab).toContainText(`(${freigegebeneZahlungen})`, { timeout: 15000 });
        }
    }
}
