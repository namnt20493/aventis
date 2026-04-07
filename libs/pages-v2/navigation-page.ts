import { Page } from "@playwright/test";
import { PageObjectBase } from "@core/base";
import { IButton, ITextInput, ILink, IServiceContext } from "@core/interfaces";

/**
 * NavigationPage - Modernized version using the new Control pattern.
 *
 * ARCHITECTURE:
 * - This page object is Playwright-independent (no direct page/expect usage)
 * - All interactions go through Controls (IButton, ITextInput, ILink)
 * - All methods use StabilityHelper internally - no separate "stable" variants needed
 */
export class NavigationPage extends PageObjectBase {
    // Menu Controls
    readonly mainMenuButton: IButton = this.button("aventis-menu");
    readonly dossierOpenButton: IButton = this.buttonByName("Dossier eröffnen");
    readonly soforthilfeButton: IButton = this.buttonByName("Soforthilfe erfassen");
    readonly aufgabenButton: IButton = this.buttonByName("Aufgabenübersicht");
    readonly dokumenteneingangButton: IButton = this.buttonByName("Dokumenteneingang");
    readonly bewilligungenButton: IButton = this.buttonBySelector("role=button[name=/Bewilligungen Workflows|Validation des workflows/i]");
    readonly zeitErfassenButton: IButton = this.buttonByName("Zeit erfassen");

    // Search Controls
    readonly globalSearchInput: ITextInput = this.textInputBySelector("#global-search-input");
    private readonly searchWrapper: IButton = this.buttonBySelector(".search-wrapper");
    private readonly firstResultRow: IButton = this.buttonBySelector(".result-row >> nth=0");
    private readonly firstResultMark: IButton = this.buttonBySelector(".parent-row mark >> nth=0");

    // Menu Items
    readonly dossierfuhrungMenuItem: IButton = this.buttonBySelector("role=menuitem[name=/Dossierführung|Gestion des dossiers/i]");
    readonly buchhaltungMenuItem: IButton = this.buttonBySelector("role=menuitem[name=/Buchhaltung|Comptabilité/i]");
    readonly zahlungenMenuItem: ILink = this.linkBySelector('a:text-matches("^Zahlungen$|Paiements")');

    // Navigation Links
    readonly ubersichtLink: ILink = this.link("FevUebersichtRoute");
    readonly kontoauszugLink: ILink = this.link("KontoauszugInDossierRoute");
    readonly journalLink: ILink = this.linkByText("Journal");
    readonly zieleLink: ILink = this.link("ZieleRoute");
    readonly wohnsituationLink: ILink = this.linkByPattern(/Wohnsituation - Haushalt|Situation résidentielle/i);
    readonly bezugspersonenLink: ILink = this.linkByText("Bezugspersonen");
    readonly institutionenLink: ILink = this.linkByText("Institutionen");
    readonly beschwerdenLink: ILink = this.linkByText("Beschwerden");
    readonly dossierubersichtLink: ILink = this.linkByText("Dossierübersicht");
    readonly dokumenteLink: ILink = this.linkByText("Dokumente");
    readonly rahmenbudgetLink: ILink = this.link("RahmenbudgetRoute");

    // User Info
    readonly userNameElement: ITextInput = this.textInputBySelector("span.name");
    readonly userTeamElement: ITextInput = this.textInputBySelector("span.team");
    readonly notificationButton: IButton = this.button("navbar-notification");
    readonly lastOpenedButton: IButton = this.buttonByName("zuletzt geöffnet");

    // Roll Up/Down Navigation
    readonly rollUpButton: IButton = this.buttonBySelector("app-navigation-drawer-item[class*='navigation-tree-actions'] button:last-child");
    readonly rollDownButton: IButton = this.buttonBySelector("app-navigation-drawer-item[class*='navigation-tree-actions'] button:first-child");

    constructor(page: Page, services?: IServiceContext) {
        super(page, services);
    }

    // ============================================================
    // Menu Navigation Methods
    // ============================================================

    async openMainMenu(): Promise<void> {
        await this.mainMenuButton.click();
    }

    async openDossierfuhrungMenu(): Promise<void> {
        await this.openMainMenu();
        await this.dossierfuhrungMenuItem.click();
    }

    async openBuchhaltungMenu(): Promise<void> {
        await this.openMainMenu();
        await this.buchhaltungMenuItem.click();
    }

    async navigateToDossierOpen(): Promise<void> {
        await this.openDossierfuhrungMenu();
        await this.dossierOpenButton.click();
        await this.waitForPageReady();
    }

    async navigateToDokumenteneingang(): Promise<void> {
        await this.openDossierfuhrungMenu();
        await this.dokumenteneingangButton.click();
        await this.waitForPageReady();
    }

    async navigateToBewilligungen(): Promise<void> {
        await this.openDossierfuhrungMenu();
        await this.bewilligungenButton.click();
        await this.waitForPageReady();
    }

    async navigateToAufgaben(): Promise<void> {
        await this.openDossierfuhrungMenu();
        await this.aufgabenButton.click();
        await this.waitForPageReady();
    }

    // ============================================================
    // Search Methods
    // ============================================================

    async searchGlobal(searchTerm: string): Promise<void> {
        await this.globalSearchInput.fill(searchTerm);
        await this.globalSearchInput.pressKey("Enter");
        await this.waitForPageReady();
    }

    async navigateToDossier(dossierName: string): Promise<void> {
        await this.globalSearchInput.waitForVisible(10000);
        await this.globalSearchInput.shouldBeEditable();

        await this.globalSearchInput.fillStable(dossierName, {
            clearFirst: true,
            validate: true,
            triggerBlur: false
        });

        await this.globalSearchInput.pressKey("Enter");
        await this.waitForAngularStable();

        await this.globalSearchInput.click();

        await this.searchWrapper.waitForVisible(8000);
        await this.firstResultRow.waitForVisible(6000);

        const isMarkVisible = await this.firstResultMark.isVisible();
        if (isMarkVisible) {
            await this.firstResultMark.doubleClick();
        } else {
            await this.firstResultRow.click();
        }

        await this.waitForUrl(/.*\/dossiers\/.*/, 10000);
        await this.waitForPageReady();
    }

    // ============================================================
    // Sidebar Navigation Methods
    // ============================================================

    async navigateToJournal(): Promise<void> {
        await this.journalLink.click();
        await this.waitForPageReady();
    }

    async navigateToWohnsituation(): Promise<void> {
        await this.wohnsituationLink.click();
        await this.waitForPageReady();
    }

    async navigateToRahmenbudget(): Promise<void> {
        await this.rahmenbudgetLink.click();
        await this.waitForPageReady();
    }

    async navigateToZiele(): Promise<void> {
        await this.zieleLink.click();
        await this.waitForPageReady();
    }

    async navigateToKontoauszug(): Promise<void> {
        await this.kontoauszugLink.click();
        await this.waitForPageReady();
    }

    async navigateToDokumente(): Promise<void> {
        await this.dokumenteLink.click();
        await this.waitForPageReady();
    }

    // ============================================================
    // Navigation Tree Methods
    // ============================================================

    async collapseNavigationTree(): Promise<void> {
        await this.rollUpButton.click();
    }

    async expandNavigationTree(): Promise<void> {
        await this.rollDownButton.click();
    }

    // ============================================================
    // User Info Methods
    // ============================================================

    async getCurrentUserName(): Promise<string> {
        return await this.userNameElement.getInnerText();
    }

    async getCurrentUserTeam(): Promise<string> {
        return await this.userTeamElement.getInnerText();
    }

    async openNotifications(): Promise<void> {
        await this.notificationButton.click();
    }

    async openLastOpened(): Promise<void> {
        await this.lastOpenedButton.click();
    }
}
