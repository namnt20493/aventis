import { Page, Locator, expect } from "@playwright/test";
import { CommonPage } from "./common-page";
import { StabilityHelper } from "@utils/stability-helper";
import { ErrorDetector } from "@libs/utils/error-detector";

export class NavigationPage {
    page: Page;
    username: Locator;
    menuDropdown: Locator;
    searchField: Locator;
    menuDossierOpen: Locator;
    contentHeader: Locator;
    buttonLeftBar: Locator;
    loadingSpiner: Locator;
    wohnsituationBtn: Locator;
    userteam: Locator;
    notificationBtn!: Locator;
    lastOpenedBtn: Locator;
    dossierfuhrungMenuItem: Locator;
    buchhaltungMenuItem: Locator;
    konfigurationMenuItem!: Locator;
    dossierMenuItem: Locator;
    zielvereinbarungenMenuItem: Locator;
    zahlungen$MenuItem: Locator;
    dossierOpenItem: Locator;
    soforthilfeItem: Locator;
    aufgabenübersichtItem: Locator;
    dokumenteneingang!: Locator;
    dossierzuständigkeitItem: Locator;
    auskunftssperreItem: Locator;
    bewilligungenItem: Locator;
    beschwerdenübersichtItem: Locator;
    zeitItem: Locator;
    datenqualitätItem: Locator;
    zielItem: Locator;
    zielvereinbarungItem: Locator;
    dokumenteneingangItem: Locator;
    table: Locator;
    searchResult: Locator;
    searchResultTitle: Locator;
    menuDossierOpenFR!: Locator;
    ubersichtLink: Locator;
    kontoauszugLink: Locator;
    journalLink: Locator;
    hauslicheGewaltLink: Locator;
    zieleLink: Locator;
    buttonRollUp: Locator;
    wohnsituationLink: Locator;
    zeitErfassenMenuItem: Locator;
    dossierfuhrungMenuList: Locator;
    auflagenLink: Locator;
    ruckforderungenLink: Locator;
    documentLink: Locator;
    bezugspersonenLink: Locator;
    beschwerdenLink: Locator;
    dossierubersichtLink: Locator;
    dossierzustandigkeitAndernLink: Locator;
    ermittlungenLink: Locator;
    freiwilligeEinkommensverwaltung: Locator;
    budgetNavlink: Locator;
    spinner: Locator;
    clearCacheBtn: Locator;
    btnClearNow: Locator;
    konfigButton: Locator;
    benutzerverwaltungButton: Locator;
    benutzerADButton: Locator;
    checkboxes: Locator;
    personlicheHilfeNavField: Locator;
    dossierListe: Locator;
    btnNotify: Locator;
    benachrichtigung: Locator;
    institutionenLink: Locator;
    kontoauszugTab: Locator;
    auswertenMenuItem: Locator;
    sozialhilfeschuldMenuItem: Locator;
    buttonRollDown: Locator;
    commonPage: CommonPage;
    frewilligeEinGroup: Locator;
    private stabilityHelper: StabilityHelper;

    constructor(page: Page) {
        this.page = page;
        this.commonPage = new CommonPage(page);
        this.stabilityHelper = new StabilityHelper(page);
        this.username = page.locator("span[class='name']");
        this.userteam = page.locator("span[class='team']");
        this.lastOpenedBtn = page.getByRole("button", { name: "zuletzt geöffnet" });
        this.menuDropdown = page.getByTestId("aventis-menu");
        this.searchField = page.locator("#global-search-input");
        this.menuDossierOpen = page.getByTestId("dossiers-neu");
        this.contentHeader = page.locator("app-content-header-base");
        this.buttonLeftBar = this.contentHeader.locator("button");
        this.loadingSpiner = page.getByLabel("1Person suchen").locator("app-progress-spinner");
        this.wohnsituationBtn = page.locator("//div[normalize-space()='Wohnsituation - Haushalt']");
        this.dossierfuhrungMenuItem = page.getByRole("menuitem", {
            name: /Dossierführung|Gestion des dossiers/i
        });
        this.buchhaltungMenuItem = page.getByRole("menuitem", {
            name: /Buchhaltung|Comptabilité/i
        });
        this.dossierMenuItem = page.locator("a").filter({ hasText: /^Dossier$/ });
        this.zielvereinbarungenMenuItem = page.locator("a").filter({ hasText: "Zielvereinbarungen" });
        this.zahlungen$MenuItem = page.locator("a").filter({ hasText: /^Zahlungen$|Paiements/ });
        this.dossierOpenItem = page.getByRole("button", {
            name: "Dossier eröffnen"
        });
        this.soforthilfeItem = page.getByRole("button", {
            name: "Soforthilfe erfassen"
        });
        this.aufgabenübersichtItem = page.getByRole("button", {
            name: "Aufgabenübersicht"
        });
        this.dokumenteneingangItem = page.getByRole("button", {
            name: "Dokumenteneingang"
        });
        this.dossierzuständigkeitItem = page.getByRole("button", {
            name: "Dossierzuständigkeit ändern"
        });
        this.auskunftssperreItem = page.getByRole("button", {
            name: "Auskunftssperre erfassen"
        });
        this.bewilligungenItem = page.getByRole("button", {
            name: /Bewilligungen Workflows|Validation des workflows/i
        });
        this.beschwerdenübersichtItem = page.getByRole("button", {
            name: "Beschwerdenübersicht"
        });
        this.zeitItem = page.getByRole("button", { name: "Zeit erfassen" });
        this.datenqualitätItem = page.getByRole("button", {
            name: "Datenqualität"
        });
        this.zielItem = page.getByRole("button", { name: "Ziel erfassen" });
        this.zielvereinbarungItem = page.getByRole("button", {
            name: "Zielvereinbarung erstellen"
        });
        this.table = page.locator("table");
        this.searchResult = page.locator("mark");
        this.searchResultTitle = page.locator("app-global-search div[class*='title-row']");
        this.ubersichtLink = page.getByTestId("FevUebersichtRoute");
        this.kontoauszugLink = page.getByTestId("KontoauszugInDossierRoute");
        this.journalLink = page.getByRole("link", { name: "Journal" });
        this.hauslicheGewaltLink = page.getByRole("link", {
            name: /Häusliche Gewalt|Violence domestique/i
        });
        this.zieleLink = page.getByTestId("ZieleRoute");
        this.buttonRollUp = page.locator("app-navigation-drawer-item[class*='navigation-tree-actions'] button").last();
        this.buttonRollDown = page.locator("app-navigation-drawer-item[class*='navigation-tree-actions'] button").first();
        this.wohnsituationLink = page.getByRole("link", {
            name: /Wohnsituation - Haushalt|Situation résidentielle/i
        });
        this.zeitErfassenMenuItem = page.getByRole("button", {
            name: /Zeit erfassen|Saisir des heures/i
        });
        this.auflagenLink = page.getByRole("link", {
            name: /Auflagen|Obligations/i
        });
        this.ruckforderungenLink = page.getByRole("link", {
            name: "Rückforderungen"
        });
        this.documentLink = page.getByTestId("DossierDokumenteRoute");
        this.bezugspersonenLink = page.getByRole("link", {
            name: /Bezugspersonen|Personnes de référence/i
        });
        this.institutionenLink = page.getByRole("link", {
            name: /Institutionen und Fachpersonen|Institutions et spécialiste·s/i
        });
        this.beschwerdenLink = page.getByTestId("BeschwerdenInDossierRoute");
        this.dossierubersichtLink = page.getByRole("link", {
            name: "Dossierübersicht"
        });
        this.dossierzustandigkeitAndernLink = page.getByRole("button", {
            name: /Dossierzuständigkeit ändern|Modifier la responsabilité du dossier/i
        });
        this.ermittlungenLink = page.getByRole("link", {
            name: /Ermittlungen|Enquêtes/i
        });
        this.freiwilligeEinkommensverwaltung = page.getByTestId("FevNode");
        this.budgetNavlink = page.getByRole("link", { name: /Budget/i });
        this.spinner = page.getByRole("progressbar");
        this.clearCacheBtn = page.getByRole("button", {
            name: /Choose what to clear|Auswählen, was gelöscht werden soll/i
        });
        this.btnClearNow = page.locator("#clear-now");
        this.konfigButton = page.getByRole("menuitem", {
            name: /Konfiguration|Configuration/i
        });
        this.benutzerverwaltungButton = page.locator("a").filter({
            hasText: /Benutzerverwaltung|Gestion des utilisateurs·trices/i
        });
        this.benutzerADButton = page.getByTestId("system-usermanagement-users");
        this.checkboxes = page.locator("#modal").locator("input");
        this.personlicheHilfeNavField = page.getByRole("button", {
            name: /Persönliche Hilfe|Aide personnelle/i
        });
        this.dossierListe = page.getByRole("button", {
            name: /Dossierliste|Liste des dossiers/i
        });
        this.dossierfuhrungMenuList = page.getByRole("menuitem", {
            name: /Dossierführung|Gestion des dossiers/i
        });
        this.btnNotify = page.getByTestId("aventis-benachrichtigungen");
        this.benachrichtigung = page.locator("div[class*='benachrichtigung-outer status-Ungelesen']");
        this.dokumenteneingangItem = page.getByRole("button", {
            name: /Dokumenteneingang|Entrée des documents/i
        });
        this.kontoauszugTab = page.getByRole("tab", {
            name: /Kontoauszug|Relevé de compte/i
        });
        this.auswertenMenuItem = page.getByText(/Auswerten|Évaluer/i);
        this.sozialhilfeschuldMenuItem = page.getByRole("button", {
            name: /Sozialhilfeschuld|Aide sociale/i
        });
        this.frewilligeEinGroup = page.getByTestId("FevNode");
    }

    private readonly searchSelectors = {
        searchInput: "#global-search-input",
        searchWrapper: ".search-wrapper",
        resultRow: ".result-row",
        resultMark: "mark",
        noResultsText: "Die Suche hat keine Treffer gefunden",
        parentRow: ".parent-row",
        indentedRow: ".indented",
        progressSpinner: "app-progress-spinner"
    };
    async goToInstitutionenUndFachpersonen() {
        await this.closeBlockingDialog();
        await this.menuDropdown.click();
        await this.konfigButton.click();
        await this.page
            .locator("a")
            .filter({ hasText: /Stammdaten|Données de base/ })
            .click();
        await this.page
            .getByRole("button", {
                name: /Institution \/ Fachperson erfassen|Institutions et spécialiste·s/i
            })
            .click();
        await this.waitForPageReady();
    }
    async goToZalungenfreigeben() {
        await this.menuDropdown.click();
        await expect(this.dossierfuhrungMenuList).toBeVisible();
        await this.dossierfuhrungMenuList.click();
        await expect(this.zahlungen$MenuItem).toBeVisible();
        await this.zahlungen$MenuItem.click();
        await this.page
            .getByRole("button", {
                name: /Zahlungen und Rechnungen freigeben|Paiements et factures à approuver/i
            })
            .click();
        await this.waitForPageReady();
    }
    async goToRechnungenBearbeiten() {
        await this.menuDropdown.click();
        await expect(this.dossierfuhrungMenuList).toBeVisible();
        await this.dossierfuhrungMenuList.click();
        await expect(this.zahlungen$MenuItem).toBeVisible();
        await this.zahlungen$MenuItem.click();
        await this.page
            .getByRole("button", {
                name: /Rechnungen bearbeiten|Modifier les factures/i
            })
            .click();
        await this.waitForPageReady();
    }
    async gotoAufgabenUbersicht() {
        await this.menuDropdown.click();
        await expect(this.dossierfuhrungMenuItem).toBeVisible();
        await this.dossierfuhrungMenuItem.click();
        await expect(this.dossierMenuItem).toBeVisible();
        await this.dossierMenuItem.click();
        const aufgabenBoard = this.page.getByTestId("my-aventis-aufgaben-board");
        await expect(aufgabenBoard).toBeVisible();
        await aufgabenBoard.click();
        await this.waitForPageReady();
    }
    async waitForSpinnerToDisappear() {
        await this.page.waitForFunction(
            () => {
                const spinners = document.querySelectorAll('mat-spinner, [role="progressbar"], app-sticky-progress-spinner');

                return Array.from(spinners).every((spinner) => {
                    const el = spinner as HTMLElement;
                    const style = window.getComputedStyle(el);

                    return !document.body.contains(el) || style.display === "none" || style.visibility === "hidden" || style.opacity === "0" || el.getBoundingClientRect().width === 0;
                });
            },
            { timeout: 5000 }
        );
    }
    async gotoSozialhilfeschuld() {
        await this.menuDropdown.click();
        await expect(this.buchhaltungMenuItem).toBeVisible();
        await this.buchhaltungMenuItem.click();
        await expect(this.auswertenMenuItem).toBeVisible();
        await this.auswertenMenuItem.click();
        await expect(this.sozialhilfeschuldMenuItem).toBeVisible();
        await this.stabilityHelper.stableClick(this.sozialhilfeschuldMenuItem);
        await this.waitForPageReady();
    }
    async gotoKontoauszug() {
        await this.openKontoauszugLink();
        await expect(this.kontoauszugTab).toBeVisible();
        await this.kontoauszugTab.click();
        await this.waitForPageReady();
    }
    async gotoZahlungen() {
        await this.menuDropdown.click();
        await expect(this.zahlungen$MenuItem).toBeVisible();
        await this.zahlungen$MenuItem.click();
        //26.06.2025 change to getByTestId to avoid issue with label changing
        const zahlungenBtn = this.page.getByRole("button", {
            name: /Zahlungen und Rechnungen freigeben|Paiements et factures à approuver/i
        });
        await expect(zahlungenBtn).toBeVisible();
        await zahlungenBtn.click();
        await this.waitForPageReady();
    }
    async openDokumenteneingang() {
        await this.menuDropdown.click();
        await expect(this.dossierfuhrungMenuList).toBeVisible();
        await this.dossierfuhrungMenuList.click();
        await expect(this.dossierMenuItem).toBeVisible();
        await this.dossierMenuItem.click();
        await expect(this.dokumenteneingangItem).toBeVisible();
        await this.dokumenteneingangItem.click({ delay: 1000 });
        await expect(this.table).toBeVisible();
        await this.waitForPageReady();
    }

    async selectNoti(entryTitel: string, entryDate: string, entryTime: string, textPart: string, buttonName: string) {
        await this.btnNotify.click();
        const notifyField = await this.benachrichtigung
            .filter({ hasText: `${entryTitel}` })
            .filter({ hasText: `${entryDate}` })
            .filter({ hasText: `${textPart}` })
            .filter({ hasText: `${entryTime}` });
        await expect(notifyField.getByRole("button", { name: `${buttonName}` })).toBeVisible();
        await notifyField.getByRole("button", { name: `${buttonName}` }).click();
    }
    async goToBewillingungWorkflow() {
        await this.menuDropdown.click();
        await this.page.getByTestId("my-aventis-bewilligung-workflows").click();
        await this.waitForPageReady();
    }
    async openBenutzerMenu() {
        await this.menuDropdown.click();
        await expect(this.konfigButton).toBeVisible();
        await this.konfigButton.click();
        await expect(this.benutzerverwaltungButton).toBeVisible();
        await this.benutzerverwaltungButton.click();
        await expect(this.benutzerADButton).toBeVisible();
        await this.benutzerADButton.click();
        await this.waitForPageReady();
    }
    async adjustSlowMotion(slowMotionMilliseconds: number) {}
    async clearCache() {
        await this.page.context().clearCookies();
    }
    async waitForSpinner() {
        await this.loadingSpiner.first().waitFor({ state: "hidden" });
    }
    async goToUbersichtLink() {
        await this.openMenuNav();

        // Check if FEV section exists
        const fevGroupExists = await this.frewilligeEinGroup.count();
        if (fevGroupExists === 0) {
            throw new Error(`Cannot navigate to FEV Übersicht: FEV node (testId: FevNode) not found in navigation. ` + `This likely means the FEV (Freiwillige Einkommensverwaltung) was not created successfully.`);
        }

        console.log("✅ [FEV] FEV node found in navigation");

        // Try to find Übersicht link by testId first
        let ubersichtExists = await this.ubersichtLink.count();

        if (ubersichtExists === 0) {
            await this.frewilligeEinGroup.waitFor({ state: "visible", timeout: 5000 });
            await this.frewilligeEinGroup.click();
            await this.page.waitForTimeout(1000);

            // Check again
            ubersichtExists = await this.ubersichtLink.count();

            if (ubersichtExists === 0) {
                // Still not found by testId - try finding by role and text within FEV group
                console.log("⚠️ [FEV] testId 'FevUebersichtRoute' not found, trying by role and text...");

                // Create a locator for Übersicht link within FEV navigation group
                const fevSection = this.page.locator("app-navigation-tree-group").filter({
                    hasText: /Freiwillige Einkommensverwaltung|Gestion volontaire des revenus/i
                });

                const ubersichtLinkByText = fevSection.getByRole("link", {
                    name: /Übersicht|Aperçu/i
                });

                const linkByTextExists = await ubersichtLinkByText.count();

                if (linkByTextExists === 0) {
                    // Final attempt: log what we can see and all links in FEV section
                    const fevNodeHtml = await this.frewilligeEinGroup.innerHTML().catch(() => "Could not get HTML");
                    const allLinksInFev = await fevSection
                        .getByRole("link")
                        .allTextContents()
                        .catch(() => []);

                    console.error(`❌ [FEV] FevNode HTML:`, fevNodeHtml);
                    console.error(`❌ [FEV] All links in FEV section:`, allLinksInFev);

                    throw new Error(`Cannot navigate to FEV Übersicht: Übersicht link not found after expanding FEV group. ` + `Available links in FEV section: ${allLinksInFev.join(", ")}. ` + `This may indicate the FEV structure has changed or is still loading.`);
                }

                // Click using the text-based locator
                console.log("✅ [FEV] Found Übersicht link by text, clicking...");
                await ubersichtLinkByText.waitFor({ state: "visible", timeout: 5000 });
                await ubersichtLinkByText.click();
                await this.waitForPageReady();
                return;
            }
        }

        // Click using testId-based locator
        console.log("✅ [FEV] Found Übersicht link by testId, clicking...");
        await this.ubersichtLink.waitFor({ state: "visible", timeout: 5000 });
        await this.ubersichtLink.click();
        await this.waitForPageReady();
    }
    async goToBudgetLink() {
        await expect(this.budgetNavlink).toBeVisible();
        await this.budgetNavlink.click();
        await this.waitForPageReady();
    }
    async openRuckforderungenLink() {
        await expect(this.ruckforderungenLink).toBeVisible();
        await this.ruckforderungenLink.click();
        await this.waitForPageReady();
    }
    async openAuflagenLink() {
        await this.openMenuNav();
        await expect(this.auflagenLink).toBeVisible();
        await this.auflagenLink.click();
        await this.waitForPageReady();
    }
    async openZeitErfassenMenuItem() {
        await this.menuDropdown.click();
        await expect(this.dossierfuhrungMenuItem).toBeVisible();
        await this.dossierfuhrungMenuItem.click();
        await expect(this.dossierMenuItem).toBeVisible();
        await this.dossierMenuItem.click();
        await expect(this.zeitErfassenMenuItem).toBeVisible();
        await this.zeitErfassenMenuItem.click();
        await this.waitForPageReady();
    }
    async openDossierverwaltungMenu() {
        await this.openMenuNav();
    }
    async delayWait(pause: string) {
        await this.page.waitForTimeout(parseInt(pause));
    }
    async openWohnsituationLink() {
        await this.openMenuNav();
        await expect(this.wohnsituationLink).toBeVisible({ timeout: 15000 });
        await this.wohnsituationLink.click();
        await this.waitForPageReady();
    }
    async openMenuNav() {
        await this.page.waitForLoadState("domcontentloaded");

        // Close any blocking dialogs (like "Zugriff verweigert", "Fehler aufgetreten") before proceeding
        await this.closeBlockingDialog();

        // First, ensure the navigation drawer is visible
        const navigationDrawer = this.page.locator("app-navigation-drawer");
        const isDrawerVisible = await navigationDrawer.isVisible({ timeout: 3000 }).catch(() => false);

        if (!isDrawerVisible) {
            // Navigation drawer is hidden - try to navigate to dossier overview to show it
            const currentUrl = this.page.url();
            const dossierIdMatch = currentUrl.match(/\/dossiers\/([a-f0-9-]+)/);

            if (dossierIdMatch) {
                const dossierId = dossierIdMatch[1];
                console.log("Navigation drawer not visible, navigating to dossier overview...");
                await this.page.goto(`/dossiers/${dossierId}/uebersicht`, { waitUntil: "domcontentloaded" });
                await this.waitForPageReady();
            }
        }

        // Always try to expand all navigation tree nodes to ensure nested items are visible
        // This is more reliable than trying to detect collapsed state
        try {
            const isButtonRollDownVisible = await this.buttonRollDown.isVisible({ timeout: 2000 }).catch(() => false);
            if (isButtonRollDownVisible) {
                await this.stabilityHelper.stableClick(this.buttonRollDown, {
                    timeout: 10000,
                    waitAfter: 500
                });
                await this.page.waitForTimeout(300);
            }
        } catch {
            // If buttonRollDown fails, try the alternative expand menu button
            const btnExpandMenu = this.page
                .locator("button")
                .filter({ has: this.page.locator("mat-icon[svgicon='expand_menu']") })
                .first();

            const isExpandButtonVisible = await btnExpandMenu.isVisible({ timeout: 2000 }).catch(() => false);
            if (isExpandButtonVisible) {
                await this.stabilityHelper.stableClick(btnExpandMenu, {
                    timeout: 10000,
                    waitAfter: 500
                });
            }
        }
    }
    async roolDownMenu() {
        await expect(this.buttonRollDown).toBeVisible();
        await this.buttonRollDown.click();
    }

    async rollUpMenu() {
        await expect(this.buttonRollUp).toBeVisible();
        await this.buttonRollUp.click({ delay: 500 });
    }
    async openJournalLink() {
        await this.openMenuNav();
        await expect(this.journalLink).toBeVisible({ timeout: 15000 });
        await this.journalLink.click();
        await this.waitForPageReady();
    }
    async openHauslicheGewaltLink() {
        await this.stabilityHelper.stableWaitFor(this.hauslicheGewaltLink, {
            state: "visible",
            timeout: 15000,
            waitAfter: 500
        });
        // Use force click due to menu animation overlay intercepting pointer events
        await this.hauslicheGewaltLink.click({ force: true, timeout: 15000 });
        await this.page.waitForURL(/.*haeusliche-gewalt.*/, { timeout: 15000 });
        await this.waitForPageReady();
    }
    async openZieleLink() {
        await this.openMenuNav();
        await expect(this.zieleLink.first()).toBeVisible();
        await this.zieleLink.first().click();
        await this.waitForPageReady();
    }
    async waitForSearchResultUpdate() {
        await this.page.waitForFunction(() => {
            const results = document.querySelectorAll(".result-row.ng-star-inserted");
            return results.length >= 1;
        });
    }
    private async fillInputWithRetry(field: Locator, value: string): Promise<void> {
        await expect(async () => {
            await field.click();
            await field.fill("");
            await field.pressSequentially(value);

            // Verify value persists (handle hydration/reload wipe)
            await expect(field).toHaveValue(value, { timeout: 500 });
        }).toPass({
            timeout: 10_000,
            intervals: [250, 500, 1000]
        });
    }

    async searchDossierOrKlient(searchDossierOrKlient: string, resultType: string) {
        await this.page.waitForSelector("#global-search-input", {
            state: "attached"
        });
        await this.waitForPageReady();
        await expect(this.searchField).toBeVisible();
        await expect(this.searchField).toBeEditable();
        await this.fillInputWithRetry(this.searchField, searchDossierOrKlient);
        // additional step to display search results (no search trigger on pressSequentially)
        await this.page.keyboard.press("Tab");
        await this.searchField.click();

        const resultText = this.page.locator("mark");
        try {
            await expect(resultText).toBeVisible({ timeout: 2000 });
        } catch {
            await this.reloadPageAndWaitForContent();
            await this.fillInputWithRetry(this.searchField, searchDossierOrKlient);
            await this.page.keyboard.press("Tab");
            await this.searchField.click();
        }
        await resultText.first().click();
        await this.waitForPageReady();
    }
    private async waitForSearchResults(): Promise<void> {
        const searchWrapper = this.page.locator(this.searchSelectors.searchWrapper);
        const resultRow = this.page.locator(this.searchSelectors.resultRow).first();
        const noResults = this.page.getByText(this.searchSelectors.noResultsText);

        // Wait for search wrapper to be visible with shorter initial timeout
        try {
            await searchWrapper.waitFor({ state: "visible", timeout: 5000 });
        } catch {
            // If search wrapper doesn't appear quickly, it might be a UI state issue
            // Try to reactivate search by clicking the field again
            const searchInput = this.page.locator(this.searchSelectors.searchInput);
            await searchInput.click().catch(() => {});
            await this.page.waitForTimeout(500);
            await searchWrapper.waitFor({ state: "visible", timeout: 8000 });
        }

        // Wait for either results or "no results" message
        try {
            await Promise.race([resultRow.waitFor({ state: "visible", timeout: 6000 }), noResults.waitFor({ state: "visible", timeout: 6000 })]);
        } catch {
            // If both timeout, wait for spinner to disappear and try once more
            const spinner = this.page.locator(this.searchSelectors.progressSpinner);
            await spinner.waitFor({ state: "hidden", timeout: 3000 }).catch(() => {});

            // Final attempt with shorter timeout
            await Promise.race([resultRow.waitFor({ state: "visible", timeout: 2000 }), noResults.waitFor({ state: "visible", timeout: 2000 })]).catch(() => {
                // If still no results, that's ok - hasSearchResults will handle it
                console.warn("Search results did not appear within timeout");
            });
        }
    }
    async stableSearchDossierOrKlient(searchTerm: string, resultType: string): Promise<void> {
        // Close any blocking dialogs first (permission errors, etc.)
        await this.closeBlockingDialog();

        // Check if we're already on a dossier page (by URL pattern)
        const currentUrl = this.page.url();
        const dossierUrlPattern = /\/dossiers\/[a-f0-9-]+\//;
        const isOnDossierPage = dossierUrlPattern.test(currentUrl);

        // Check if we're already on the desired dossier
        const currentDossierLocator = this.page.locator(".navigation-drawer-header.bg-color-blue-1 .item-title");
        try {
            const currentDossierName = await currentDossierLocator.textContent({
                timeout: 2000
            });
            if (currentDossierName?.trim() === searchTerm.trim()) {
                console.log(`Already on dossier "${searchTerm}". Skipping search.`);
                return;
            }
        } catch {
            // If UI detection fails but we're on a dossier page, skip search
            if (isOnDossierPage) {
                console.log(`Already on a dossier page (URL check). Skipping search.`);
                return;
            }
            console.log("Could not determine current dossier. Proceeding with search.");
        }

        const MAX_RETRIES = 3;
        const searchInput = this.page.locator(this.searchSelectors.searchInput);

        await this.page.waitForLoadState("domcontentloaded");

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                console.log(`Attempt ${attempt}/${MAX_RETRIES}: Starting search for "${searchTerm}".`);

                // 1. Wait for page to be ready and search input to be available
                await searchInput.waitFor({ state: "visible", timeout: 10000 });
                await expect(searchInput).toBeEditable();

                // 2. Wait for element to be fully stable (no hydration interference)
                await this.page.waitForFunction((selector) => {
                    const element = document.querySelector(selector) as HTMLInputElement;
                    return element && element.offsetParent !== null && !element.disabled;
                }, this.searchSelectors.searchInput);

                // 3. Use retry-based input filling (handles hydration and timing issues)
                await this.fillInputWithRetry(searchInput, searchTerm);

                await searchInput.press("Enter");
                await this.page.waitForTimeout(200);

                await this.closeBlockingDialog();

                await this.page.keyboard.press("Tab");
                await searchInput.click();

                // 6. Wait for search UI to appear (more flexible approach)
                try {
                    await this.waitForSearchResults();
                } catch (searchError) {
                    // Close any blocking dialogs before retrying
                    await this.closeBlockingDialog();
                    // If search wrapper doesn't appear, it might be a UI state issue
                    console.warn(`Search UI not ready on attempt ${attempt}. Retrying...`);
                    throw new Error(`Search wrapper not visible: ${(searchError as Error).message}`);
                }

                // 7. Check if we have results
                const hasResults = await this.hasSearchResults();

                if (hasResults) {
                    console.log(`Attempt ${attempt}: Results found. Finalizing.`);
                    await this.selectSearchResult(searchTerm, resultType);

                    // 8. Validate navigation (with longer timeout for stability)
                    const navigationSucceeded = await this.page
                        .waitForURL(/.*\/dossiers\/.*/, { timeout: 10000 })
                        .then(() => true)
                        .catch(() => false);

                    if (!navigationSucceeded) {
                        throw new Error(`Navigation to dossier failed for: "${searchTerm}"`);
                    }

                    return; // Success!
                } else {
                    throw new Error(`No result found for: "${searchTerm}"`);
                }
            } catch (error) {
                const errorMessage = (error as Error).message;
                console.warn(`Attempt ${attempt} failed. Reason: ${errorMessage}`);

                if (attempt === MAX_RETRIES) {
                    console.error(`Search for "${searchTerm}" failed after ${MAX_RETRIES} attempts.`);
                    throw error;
                }

                // Progressive wait between retries (longer for more serious issues)
                const waitTime = attempt === 1 ? 500 : attempt === 2 ? 1000 : 2000;
                await this.page.waitForTimeout(waitTime);

                // On retry, ensure we have a clean state
                try {
                    await searchInput.clear();
                } catch {
                    // Ignore clearing errors
                }
            }
        }
    }

    private async hasSearchResults(): Promise<boolean> {
        const noResultsLocator = this.page.getByText(this.searchSelectors.noResultsText);
        const resultsLocator = this.page.locator(this.searchSelectors.resultRow);

        const noResults = await noResultsLocator.isVisible().catch(() => false);
        if (noResults) {
            return false;
        }

        const resultCount = await resultsLocator.count();
        return resultCount > 0;
    }

    private async selectSearchResult(searchTerm: string, resultType: string = "Dossiers"): Promise<void> {
        const resultSelector = resultType === "Dossiers" ? this.searchSelectors.parentRow : this.searchSelectors.indentedRow;

        const markLocator = this.page.locator(`${resultSelector} ${this.searchSelectors.resultMark}`).first();

        const isMarkVisible = await markLocator.isVisible({ timeout: 3000 }).catch(() => false);

        if (isMarkVisible) {
            await markLocator.dblclick();
            return;
        }

        const fallbackLocator = this.page.locator(this.searchSelectors.resultRow).first();
        // Use dispatchEvent for fallback as well
        await fallbackLocator.evaluate((el) => {
            el.dispatchEvent(
                new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                    view: window
                })
            );
        });
        // Original click - kept for reference:
        // await fallbackLocator.click();
    }
    async searchDossier(dossierInstitution: string): Promise<void> {
        await this.stableSearchDossierOrKlient(dossierInstitution, "Dossiers");
    }

    private async reloadPageAndWaitForContent() {
        await this.page.reload();

        // Wait for app-content to be visible (not just attached)
        await this.page.waitForSelector("app-content", {
            state: "visible",
            timeout: 30000
        });

        // Wait for DOM to be loaded
        await this.page.waitForLoadState("domcontentloaded");

        // Wait for network to settle (catches API calls after reload)
        await this.page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {
            // Continue if network doesn't idle (some apps keep polling)
            console.log("Network idle timeout - continuing");
        });

        await this.waitForSpinnerToDisappear().catch(() => {});

        await this.page.waitForTimeout(1000);
    }

    // März 2024
    async waitForTableLoaded() {
        await this.table.waitFor({ state: "visible" });
    }
    async logout() {
        await this.page.getByTestId("navbar-username").click();
        const logoutBtn = this.page.getByRole("button", {
            name: /Abmelden|Fermer la session/i
        });
        await expect(logoutBtn).toBeVisible();

        await this.page.mouse.move(0, 0);
        await this.page.waitForTimeout(300);

        const tooltipOverlay = this.page.locator(".cdk-overlay-connected-position-bounding-box .mat-mdc-tooltip-surface");
        try {
            await tooltipOverlay.waitFor({ state: "hidden", timeout: 2000 });
        } catch {
            // Tooltip may not exist or already hidden
        }

        // Click with force as fallback if tooltip still intercepts
        try {
            await logoutBtn.click({ timeout: 5000 });
        } catch {
            await logoutBtn.click({ force: true });
        }

        // Wait for logout to complete - either redirected to MS login or Aventis login page
        await Promise.race([
            this.page.waitForURL(/login\.microsoftonline\.com/, { timeout: 15000 }),
            this.page.waitForURL(/login/, { timeout: 15000 }),
            this.page.waitForSelector("#i0116", { state: "visible", timeout: 15000 }), // MS username field
            this.page.waitForSelector("#otherTileText", {
                state: "visible",
                timeout: 15000
            }) // MS account picker
        ]).catch(() => {
            console.log("Logout redirect detection timed out, continuing...");
        });

        await this.page.waitForTimeout(1000);
    }
    async selectLanguage(language: string) {
        await this.page.getByTestId("navbar-username").click();
        const langOption = this.page.getByRole("option", { name: `${language}` });
        await expect(langOption).toBeVisible();
        await langOption.click();
        // await this.page.getByRole("button", { name: /Abmelden|Fermer la session/i }).click();
    }

    async goToDossierzustandigkeit() {
        await this.goToDossierMenu();
        await expect(this.dossierzuständigkeitItem).toBeVisible();
        await this.dossierzuständigkeitItem.click();
        await this.waitForPageReady();
    }
    async goToAuskunftssperre() {
        await this.goToDossierMenu();
        await expect(this.auskunftssperreItem).toBeVisible();
        await this.auskunftssperreItem.click();
        await this.waitForPageReady();
    }
    async goToBewilligungen() {
        await this.goToDossierMenu();
        await expect(this.bewilligungenItem).toBeVisible();
        await this.bewilligungenItem.click();
        await this.waitForPageReady();
    }
    async goToBeschwerdenubersicht() {
        await this.goToDossierMenu();
        await expect(this.beschwerdenübersichtItem).toBeVisible();
        await this.beschwerdenübersichtItem.click();
        await this.waitForPageReady();
    }
    async goToZeit() {
        await this.goToDossierMenu();
        await expect(this.zeitItem).toBeVisible();
        await this.zeitItem.click();
        await this.waitForPageReady();
    }
    async goToDatenqualitat() {
        await this.goToDossierMenu();
        await expect(this.datenqualitätItem).toBeVisible();
        await this.datenqualitätItem.click();
        await this.waitForPageReady();
    }

    async goToDokument() {
        await this.goToDossierMenu();
        await expect(this.dokumenteneingangItem).toBeVisible();
        await this.dokumenteneingangItem.click();
        await this.waitForPageReady();
    }
    async goToAufgabenubersicht() {
        await this.goToDossierMenu();
        await expect(this.aufgabenübersichtItem).toBeVisible();
        await this.aufgabenübersichtItem.click();
        await this.waitForPageReady();
    }

    async goToSoforthilfe() {
        await this.goToDossierMenu();
        await expect(this.soforthilfeItem).toBeVisible();
        await this.soforthilfeItem.click();
        await this.waitForPageReady();
    }

    async goToDossierMenu() {
        await this.goToDossierfuhrungMenu();
        await expect(this.dossierMenuItem).toBeVisible();
        await this.dossierMenuItem.click();
    }

    async goToDossierfuhrungMenu() {
        await this.openMenuDropdown();
        await expect(this.dossierfuhrungMenuItem).toBeVisible();
        await this.dossierfuhrungMenuItem.click();
    }

    async openLeftBar() {
        await expect(this.buttonLeftBar).toBeVisible();
        await this.buttonLeftBar.click();
    }

    async openMenuDropdown() {
        await expect(this.menuDropdown).toBeVisible();
        await this.menuDropdown.click();
    }

    async goToOpenDossier() {
        await this.openMenuDropdown();
        await expect(this.menuDossierOpen).toBeVisible();
        await this.menuDossierOpen.click();
        await this.waitForPageReady();
    }
    async goToDossierList() {
        await this.openMenuDropdown();
        await expect(this.dossierListe).toBeVisible();
        await this.dossierListe.click();
        await this.waitForPageReady();
    }
    async verifyProgress() {
        await expect.soft(this.loadingSpiner).toBeHidden();
    }
    async openUbersichtLink() {
        await this.openMenuNav();

        const uebersichtRoute = this.page.locator("[data-testid^='WshUebersichtRoute']");

        let isVisible = await uebersichtRoute.isVisible({ timeout: 3000 }).catch(() => false);

        if (!isVisible) {
            const wshButton = this.page.getByRole("button", { name: /^Wirtschaftliche Sozialhilfe$|^Aide sociale économique$/i });
            const wshButtonVisible = await wshButton.isVisible({ timeout: 5000 }).catch(() => false);

            if (wshButtonVisible) {
                await wshButton.click();
                await this.page.waitForTimeout(1000);
            }

            isVisible = await uebersichtRoute.isVisible({ timeout: 5000 }).catch(() => false);
        }

        if (isVisible) {
            await uebersichtRoute.click();
            await this.waitForPageReady();
            return;
        }

        const strategies = [
            this.page.locator("[data-testid^='WshUebersichtRoute']"),
            this.page.getByRole("link", { name: /^Übersicht$|^Aperçu$/i }).first(),
            this.page
                .locator("app-navigation-drawer-item a")
                .filter({ hasText: /^Übersicht$/i })
                .first()
        ];

        for (const locator of strategies) {
            const strategyVisible = await locator.isVisible({ timeout: 2000 }).catch(() => false);
            if (strategyVisible) {
                await locator.click();
                await this.waitForPageReady();
                return;
            }
        }

        await expect(uebersichtRoute).toBeVisible({ timeout: 15000 });
        await uebersichtRoute.click();
        await this.waitForPageReady();
    }

    async openKontoauszugLink() {
        await this.openMenuNav();

        // TestID might have a dynamic GUID suffix like other navigation routes
        // Try multiple strategies to find the Kontoauszug link
        const kontoauszugStrategies = [
            // Strategy 1: Exact testId match
            this.page.getByTestId("KontoauszugInDossierRoute"),
            // Strategy 2: Partial testId match (handles dynamic GUID suffix)
            this.page.locator("[data-testid^='KontoauszugInDossierRoute']"),
            // Strategy 3: Link by name
            this.page.getByRole("link", { name: /Kontoauszug|Relevé de compte/i }),
            // Strategy 4: Navigation drawer item with Kontoauszug text
            this.page.locator("app-navigation-drawer-item a").filter({ hasText: /Kontoauszug/i })
        ];

        for (const locator of kontoauszugStrategies) {
            const isVisible = await locator
                .first()
                .isVisible({ timeout: 2000 })
                .catch(() => false);
            if (isVisible) {
                await locator.first().click();
                await this.waitForPageReady();
                return;
            }
        }

        // If all strategies fail, try scrolling and looking for the link
        const navTree = this.page.locator("app-navigation-tree");
        await navTree.evaluate((el) => el.scrollTo(0, 0));
        await this.page.waitForTimeout(500);

        // Final attempt with longer timeout
        const fallbackLocator = this.page.locator("[data-testid^='KontoauszugInDossierRoute'], [data-testid^='Kontoauszug']").first();
        await expect(fallbackLocator).toBeVisible({ timeout: 10000 });
        await fallbackLocator.click();
        await this.waitForPageReady();
    }
    async openDocumentLink() {
        await this.openMenuNav();
        await this.documentLink.click();
        await this.waitForPageReady();
    }

    async openBezugspersonenLink() {
        await this.openMenuNav();
        await expect(this.bezugspersonenLink).toBeVisible();
        await this.bezugspersonenLink.click();
        await this.waitForPageReady();
    }
    async openInstitutionenUndFachpersonenLink() {
        await this.rollUpMenu();
        const umfeldBtn = this.page.getByRole("button", {
            name: /Umfeld|Environnement/i
        });
        await expect(umfeldBtn).toBeVisible();
        await umfeldBtn.click();
        await expect(this.institutionenLink).toBeVisible();
        await this.stabilityHelper.stableClick(this.institutionenLink);
        await this.waitForPageReady();
    }

    async openBeschwerdenLink() {
        await this.openMenuNav();
        await expect(this.beschwerdenLink).toBeVisible();
        await this.stabilityHelper.stableClick(this.beschwerdenLink);
        await this.waitForPageReady();
    }

    async openDossierubersichtLink() {
        await this.openMenuNav();
        await expect(this.dossierubersichtLink).toBeVisible({ timeout: 15000 });
        await this.stabilityHelper.stableClick(this.dossierubersichtLink);
        await this.waitForPageReady();
    }
    async openDossierzustandigkeitAndernLink() {
        await this.menuDropdown.click();
        await expect(this.dossierfuhrungMenuItem).toBeVisible();
        await this.dossierfuhrungMenuItem.click();
        await expect(this.dossierMenuItem).toBeVisible();
        await this.dossierMenuItem.click();
        await expect(this.dossierzustandigkeitAndernLink.last()).toBeVisible();
        await this.dossierzustandigkeitAndernLink.last().click();
        await this.waitForPageReady();
    }
    async openErmittlungenLink() {
        await this.openMenuNav();
        await expect(this.ermittlungenLink).toBeVisible();
        await this.ermittlungenLink.click();
        await this.waitForPageReady();
    }

    async waitForPageReady(options?: { useNetworkIdle?: boolean; additionalWait?: number; waitForAngular?: boolean; timeout?: number }): Promise<void> {
        const useNetworkIdle = options?.useNetworkIdle ?? false;
        const additionalWait = options?.additionalWait ?? 200;
        const waitForAngular = options?.waitForAngular ?? true;
        const timeout = options?.timeout ?? 20000;

        // Wait for dossier to be fully loaded (not "wird vorbereitet..." or "wurde noch nicht vorbereitet")
        // This is safe on non-dossier pages - waitFor state:"hidden" returns immediately if element doesn't exist
        const preparingMessage = this.page.locator('text="Dossier wird vorbereitet...", text="Dossier wurde noch nicht vorbereitet."');

        // Check if message is visible
        const isPreparingVisible = await preparingMessage.isVisible({ timeout: 500 }).catch(() => false);

        if (isPreparingVisible) {
            const messageText = await preparingMessage.textContent().catch(() => "preparation message");
            console.log(`⏳ ${messageText} detected, waiting for it to resolve...`);

            // Wait 2 seconds for the message to go away naturally
            const goneWithinTwoSeconds = await preparingMessage
                .waitFor({ state: "hidden", timeout: 2000 })
                .then(() => true)
                .catch(() => false);

            if (!goneWithinTwoSeconds) {
                // Message still visible after 2 seconds - reload and check again
                console.log("⚠️ Dossier preparation message still visible after 2s, reloading page...");
                await this.page.reload({ waitUntil: "domcontentloaded" });

                // After reload, wait for the message to be gone (with extended timeout)
                await preparingMessage.waitFor({ state: "hidden", timeout: 60000 }).catch(() => {
                    console.warn("⚠️ Dossier preparation message still visible after reload");
                });
            }
        }

        const waitPromises = [this.waitForSpinnerToDisappear(), this.page.waitForLoadState(useNetworkIdle ? "networkidle" : "domcontentloaded")];

        if (waitForAngular) {
            waitPromises.push(this.stabilityHelper.waitForAngularStable());
        }

        await Promise.race([Promise.all(waitPromises), new Promise<void>((_, reject) => setTimeout(() => reject(new Error(`waitForPageReady timed out after ${timeout}ms`)), timeout))]);

        if (additionalWait > 0) {
            await this.page.waitForTimeout(additionalWait);
        }
    }

    /**
     * Waits for Angular to stabilize
     * Ensures Angular has completed rendering and change detection cycles
     */
    async waitForAngularStable(options?: { timeout?: number }): Promise<void> {
        await this.stabilityHelper.waitForAngularStable(options);
    }

    async checkForErrors(contextInfo: string = "", waitMs: number = 2000): Promise<void> {
        const errorDetector = new ErrorDetector(this.page);
        await errorDetector.waitAndAssertNoErrors(contextInfo, waitMs);
    }
    /**
     * Closes any blocking dialog that might be open (like "Zugriff verweigert", error dialogs, etc.)
     * This is called before navigation to ensure the UI is not blocked.
     */
    /**
     * Closes a blocking dialog if one is visible.
     * @param options Configuration options
     * @param options.failOnError If true, throws an error when an error dialog is detected (default: false)
     * @param options.allowedDialogPatterns Array of regex patterns for dialog content that should be silently closed
     */
    async closeBlockingDialog(options: { failOnError?: boolean; allowedDialogPatterns?: RegExp[] } = {}): Promise<void> {
        const { failOnError = false, allowedDialogPatterns = [] } = options;
        const dialog = this.page.locator("mat-dialog-container").first();

        // Quick check if any dialog is visible
        const isDialogVisible = await dialog.isVisible({ timeout: 1000 }).catch(() => false);
        if (!isDialogVisible) {
            return;
        }

        // IMPORTANT: Read dialog content BEFORE closing to detect error dialogs
        let dialogContent = "";
        let dialogTitle = "";
        try {
            dialogContent = (await dialog.textContent({ timeout: 2000 })) || "";
            // Try to get just the title/header
            const titleLocator = dialog.locator("h1, h2, h3, mat-dialog-title, .mat-dialog-title, .dialog-title").first();
            dialogTitle = (await titleLocator.textContent({ timeout: 1000 }).catch(() => "")) || "";
        } catch {
            dialogContent = "[Could not read dialog content]";
        }

        // Detect error dialogs - these indicate real application errors
        const errorPatterns = [/Fehler aufgetreten/i, /Ein erwartetes Element wurde nicht gefunden/i, /Error occurred/i, /Unbekannter Fehler/i, /Server error/i, /500 Internal Server Error/i, /403 Forbidden/i, /401 Unauthorized/i, /nicht berechtigt/i, /Permission denied/i];

        const isErrorDialog = errorPatterns.some((pattern) => pattern.test(dialogContent) || pattern.test(dialogTitle));

        // Check if this dialog matches allowed patterns (expected dialogs that can be safely closed)
        const isAllowedDialog = allowedDialogPatterns.some((pattern) => pattern.test(dialogContent) || pattern.test(dialogTitle));

        // Log dialog detection with content
        const truncatedContent = dialogContent.length > 200 ? dialogContent.substring(0, 200) + "..." : dialogContent;
        console.log(`⚠️ Blocking dialog detected:`);
        console.log(`   Title: "${dialogTitle || "(no title)"}"`);
        console.log(`   Content: "${truncatedContent.replace(/\s+/g, " ").trim()}"`);

        if (isErrorDialog && !isAllowedDialog) {
            console.error(`🚨 ERROR DIALOG DETECTED! This may indicate a real application error.`);
            if (failOnError) {
                throw new Error(`Application error dialog detected: "${dialogTitle || truncatedContent}"`);
            } else {
                console.warn(`⚠️ Closing error dialog - TEST MAY BE HIDING A REAL BUG!`);
            }
        }

        // Try multiple close strategies (ordered by likelihood of success)
        const closeStrategies = [
            // Strategy 1: Use JavaScript to directly click any button with "Schliessen" text
            async () => {
                await this.page.evaluate(() => {
                    const buttons = Array.from(document.querySelectorAll("button"));
                    const schliessenBtn = buttons.find((btn) => btn.textContent?.includes("Schliessen") && btn.offsetParent !== null);
                    if (schliessenBtn) {
                        (schliessenBtn as HTMLElement).click();
                        return true;
                    }
                    return false;
                });
            },
            // Strategy 2: Direct text match for Schliessen button
            async () => {
                const schliessenBtn = this.page.locator('button:has-text("Schliessen")').first();
                await schliessenBtn.waitFor({ state: "visible", timeout: 2000 });
                await schliessenBtn.click({ force: true });
            },
            // Strategy 3: Click mat-dialog-actions button with Schliessen text
            async () => {
                await this.page.locator('mat-dialog-actions button:has-text("Schliessen")').first().click({ force: true });
            },
            // Strategy 4: Button with exact text "Schliessen" using getByText
            async () => {
                await this.page.getByText("Schliessen", { exact: true }).first().click({ force: true });
            },
            // Strategy 5: Primary action button in dialog actions area
            async () => {
                const primaryBtn = dialog
                    .locator("mat-dialog-actions button, .mat-dialog-actions button")
                    .filter({ hasText: /Schliessen|Close|Fermer|OK/i })
                    .first();
                await primaryBtn.waitFor({ state: "visible", timeout: 2000 });
                await primaryBtn.click({ force: true });
            },
            // Strategy 6: Any button with "Schliessen" text inside dialog
            async () => {
                const closeBtn = dialog.getByRole("button", { name: /Schliessen|Close|Fermer/i }).last();
                await closeBtn.click({ force: true });
            },
            // Strategy 7: Press Escape
            async () => {
                await this.page.keyboard.press("Escape");
                await this.page.waitForTimeout(500);
            },
            // Strategy 8: Click backdrop to dismiss (if dialog allows)
            async () => {
                await this.page.locator(".cdk-overlay-backdrop").click({ timeout: 2000, force: true });
            }
        ];

        for (let i = 0; i < closeStrategies.length; i++) {
            try {
                await closeStrategies[i]();
                await this.page.waitForTimeout(500);
                await dialog.waitFor({ state: "hidden", timeout: 2000 }).catch(() => {});
                const stillVisible = await dialog.isVisible().catch(() => false);
                if (!stillVisible) {
                    console.log(`✅ Dialog closed successfully (strategy ${i + 1}): "${dialogTitle || "(untitled)"}"`);
                    return;
                }
            } catch {
                // Strategy failed, try next one
            }
        }

        console.log("⚠️ Could not close dialog, proceeding anyway...");
    }
}
