import { Page, Locator, expect } from "@playwright/test";
import { NavigationPage } from "./navigation-page";
import { RahmenbudgetPage } from "./rahmenbudget-page";
import { CommonPage } from "./common-page";
import { StabilityHelper } from "../utils/stability-helper";

export class BewilligungenWorkflowsPage {
    page: Page;
    stabilityHelper: StabilityHelper;
    bewilligungenNavLink: Locator;
    filterZurucksetzen: Locator;
    filterLeeren: Locator;
    dossierSearch: Locator;
    gotoDossier: Locator;
    prufungOKBtn: Locator;
    bewilligenBtn: Locator;
    status: Locator;
    btnBewilligungOffnen: Locator;
    btnSchliessen: Locator;
    navigation: NavigationPage;
    rahmenbudgetPage: RahmenbudgetPage;
    bewilligungOffnenBtn: Locator;
    leistungsentscheidTab: Locator;
    leistungsentscheidPanel: Locator;
    btnPrufungOK: Locator;
    statusField: Locator;
    dossierSearchTxtbox: Locator;
    institutionSearchTxtbox: Locator;
    bearbeitbarSearchTxtbox: Locator;
    typSelect: Locator;
    zustandigkeitSelect: Locator;
    angefragtSelect: Locator;
    statusBewilligungSelect: Locator;
    userSelect: Locator;
    zustandigeSelect: Locator;
    filterBtn: Locator;
    commonPage: CommonPage;
    notificationBtn: Locator;
    constructor(page: Page) {
        this.page = page;
        this.stabilityHelper = new StabilityHelper(page);
        this.navigation = new NavigationPage(page);
        this.rahmenbudgetPage = new RahmenbudgetPage(page);
        this.commonPage = new CommonPage(page);
        this.bewilligungenNavLink = page.locator("a[href$='bewilligung-workflows']");
        this.filterZurucksetzen = page.getByTestId("resetFilters").filter({ hasText: "Filter zurücksetzen" });
        this.filterLeeren = page.getByTestId("resetFilters").filter({ hasText: "Filter leeren" });
        this.dossierSearch = page.locator("app-txt[iconkey*='search'] input");
        this.gotoDossier = page.locator("td a");
        this.prufungOKBtn = page.getByRole("button", { name: "Prüfung OK" });
        this.bewilligenBtn = page.getByRole("button", { name: "Bewilligen" });
        this.status = page.locator("span[aria-label='Status']:visible, span[aria-label='Statut']:visible");
        this.btnBewilligungOffnen = page.locator("app-approval-workflow-open-button a", { hasText: /Bewilligung öffnen|Ouvrir la validation/i });
        this.btnSchliessen = page.getByRole("button", {
            name: /Schliessen|Fermer/i
        });
        this.leistungsentscheidTab = page.getByRole("tab", {
            name: /Leistungsentscheid|Décision de prestation/i
        });
        this.leistungsentscheidPanel = page.locator("app-leistungsentscheid-panel");
        // this.bewilligungOffnenBtn = page.getByRole('link', {name : /Bewilligung öffnen|Ouvrir la validation/i})
        this.bewilligungOffnenBtn = page.locator("app-approval-workflow-open-button a");
        this.btnPrufungOK = page.getByRole("button", {
            name: /Prüfung OK|Validation OK/i
        });
        this.statusField = page.locator("app-readmode-field:visible").filter({ has: page.getByLabel(/Entscheid|Entscheid/i) });
        //
        this.dossierSearchTxtbox = page.getByTestId("searchString").getByTestId("root-control");
        this.institutionSearchTxtbox = page.getByTestId("institutionId").getByTestId("root-control");
        this.bearbeitbarSearchTxtbox = page.getByTestId("userId_BeantwortbarDurch").getByTestId("root-control");
        this.typSelect = page.getByTestId("bezeichnung").getByTestId("root-control");
        this.zustandigkeitSelect = page.getByTestId("teamId_Leistung").getByTestId("root-control");
        this.angefragtSelect = page.getByTestId("userId_Angefragt").getByTestId("root-control");
        this.statusBewilligungSelect = page.getByTestId("status").getByTestId("root-control");
        this.userSelect = page.getByTestId("userId_Leistung").getByTestId("root-control");
        this.zustandigeSelect = page.getByTestId("zustaendigeGemeindeIds").getByTestId("root-control");
        this.filterBtn = page.getByRole("button", {
            name: /Filter leeren|Appliquer le filtre/i
        });
        //
        this.notificationBtn = page.getByTestId("aventis-benachrichtigungen");
    }
    async selectNotification(entryTitel: string, entryDate: string, textPart: string, buttonName: string, nurUngelesen: string) {
        await this.notificationBtn.click();
        // setze die Checkbox RSC 21.1.
        const checkboxInput = this.page.locator("app-benachrichtigungen mat-checkbox input").first();
        const classAttr = await checkboxInput.getAttribute("class");

        if (nurUngelesen.toLowerCase().trim() === "false") {
            if (classAttr && classAttr.includes("selected")) {
                await checkboxInput.uncheck();
            }
        }
        if (nurUngelesen.toLowerCase().trim() === "true") {
            await checkboxInput.check();
        }

        // hier habe ich nocht nicht hingeschaut ...
        const notification = this.page.locator(`div[class*='overlay-outer']:has-text('${entryTitel}'):has-text('${entryDate}'):has-text('${textPart}')`);
        await notification.locator(`a:has-text('${buttonName}')`).first().click({ timeout: 10000 });
        if (buttonName === "Bewilligung öffnen" || buttonName === "Validation des workflows") {
            await expect.soft(this.page.locator("tbody tr").first()).toContainText(entryDate, { timeout: 5000 });
        }
    }

    async validateAnzahl(minAnzahl: number, timeout = 10000) {
        await expect
            .poll(async () => await this.page.locator("tbody tr").count(), {
                timeout
            })
            .toBe(minAnzahl);
        const anzahl = await this.page.locator("tbody tr").count();
        console.log("Anzahl: ***" + anzahl);
    }

    async searchBewillingung(dossierBezeichnung: string, institution: string, bearbeitbarDurch: string, typ: string, zustTeam: string, angefragtVon: string, statusBearbeitung: string, userSARSB: string, gemeinde: string) {
        await this.filterBtn.dblclick();
        await this.dossierSearchTxtbox.pressSequentially(dossierBezeichnung);
        await this.navigation.waitForPageReady();
        if (institution !== "") {
            await this.institutionSearchTxtbox.fill(institution);
            await this.page.getByRole("option", { name: `${institution}`, exact: true }).click();
            await this.navigation.waitForPageReady();
        }

        if (bearbeitbarDurch !== "") {
            await this.bearbeitbarSearchTxtbox.fill(bearbeitbarDurch);
            await this.page.getByRole("option", { name: `${bearbeitbarDurch}`, exact: true }).click();
            await this.navigation.waitForPageReady();
        }
        if (typ !== "") {
            const types = this.commonPage.separateText(typ);
            for (const type of types) {
                await this.typSelect.click();
                await this.page.getByRole("option", { name: `${type}`, exact: true }).click();
            }
            await this.page.keyboard.press("Escape");
        }
        if (zustTeam !== "") {
            await this.zustandigkeitSelect.fill(zustTeam);
            await this.page.getByRole("option", { name: `${zustTeam}`, exact: true }).click();
        }
        if (angefragtVon !== "") {
            await this.angefragtSelect.fill(angefragtVon);
            await this.page.getByRole("option", { name: `${angefragtVon}`, exact: true }).click();
        }
        const status = this.commonPage.separateText(statusBearbeitung);
        for (const stat of status) {
            await this.statusBewilligungSelect.click();
            await this.page.getByRole("option", { name: `${stat}`, exact: true }).click();
        }
        await this.page.keyboard.press("Escape");
        if (userSARSB !== "") {
            await this.userSelect.fill(userSARSB);
            await this.page.getByRole("option", { name: `${userSARSB}`, exact: true }).click();
        }
        if (gemeinde !== "") {
            await this.zustandigeSelect.fill(gemeinde);
            await this.page.getByRole("option", { name: `${gemeinde}`, exact: true }).click();
        }
    }
    async goToBewillingungWorkflow(dossierBezeichnung: string, select: string) {
        if (select === "yes") {
            await this.page.locator(`tr:has-text('${dossierBezeichnung}') a`).click();
        }
    }
    async goToBewillingungProcess() {
        //11/6 change to OpenMenuNav to avoid issue with menu not opening
        await this.navigation.openMenuNav();
        await this.rahmenbudgetPage.clickRahmenbudgetNavLink();
        await this.stabilityHelper.stableClick(this.leistungsentscheidTab, { retries: 3 });
        await this.stabilityHelper.stableClick(this.leistungsentscheidPanel, { retries: 3 });
    }
    async acceptProcess(buttonName: string) {
        await this.bewilligungOffnenBtn.click();
        await this.page.getByRole("button", { name: `${buttonName}` }).click();
        await this.navigation.waitForPageReady();
    }
    async validateStatus(checkEntscheid: string | null | undefined) {
        if (checkEntscheid !== "" && checkEntscheid !== "-" && checkEntscheid !== null && checkEntscheid !== undefined) {
            await expect.soft(this.statusField.locator("span").first()).toContainText(checkEntscheid);
        }
    }

    async acceptBewillingungProcess(dossier: string, buttonName: string, checkStatus: string) {
        console.log(`[DEBUG] acceptBewillingungProcess started for dossier: ${dossier}, button: ${buttonName}`);
        await this.navigation.goToBewillingungWorkflow();
        await this.stabilityHelper.stableClick(this.filterLeeren.first(), {
            waitBefore: 500,
            waitAfter: 500
        });
        await this.dossierSearch.pressSequentially(dossier);
        await this.navigation.waitForPageReady();

        const dossierRow = this.page.locator(`tr:has-text('Dossier: ${dossier}')`).locator("a").first();
        await this.stabilityHelper.stableClick(dossierRow, {
            timeout: 30000,
            waitBefore: 500,
            waitAfter: 1000
        });

        await this.navigation.waitForPageReady();

        await this.stabilityHelper.stableClick(this.btnBewilligungOffnen, {
            timeout: 30000,
            waitBefore: 500,
            waitAfter: 1000,
            retries: 3
        });

        const actionButton = this.page.getByRole("button", { name: `${buttonName}` });
        await this.stabilityHelper.stableClick(actionButton, {
            timeout: 30000,
            waitBefore: 500,
            waitAfter: 1000
        });

        await this.navigation.waitForSpinnerToDisappear();
        console.log(`[DEBUG] acceptBewillingungProcess completed`);
        await this.stabilityHelper.closeDialog();
    }
}
