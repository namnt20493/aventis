import { Page } from "@playwright/test";
import { BewilligungenWorkflowsPage } from "../pages/bewilligungenWorkflows-page";
import { RahmenbudgetPage } from "../pages/rahmenbudget-page";
import { LoginPage } from "../pages/login-page";
import { NavigationPage } from "../pages/navigation-page";
import { BedarfsprufungPage } from "../pages/bedarfsprufung-page";

export class BewilligungenKeywords {
    page: Page;
    bewilligungenWorkflowsPage: BewilligungenWorkflowsPage;
    rahmenbudgetPage: RahmenbudgetPage;
    login: LoginPage;
    navigation: NavigationPage;
    bedarfsprufungPage: BedarfsprufungPage;

    constructor(page: Page) {
        this.page = page;
        this.bewilligungenWorkflowsPage = new BewilligungenWorkflowsPage(page);
        this.rahmenbudgetPage = new RahmenbudgetPage(page);
        this.login = new LoginPage(page);
        this.navigation = new NavigationPage(page);
        this.bedarfsprufungPage = new BedarfsprufungPage(page);
    }
    async DO15_Glocke_Absprung({ entryTitel, entryDate, entryTime, textPart, buttonName, nurUngelesen }: { entryTitel: string; entryDate: string; entryTime: string; textPart: string; buttonName: string; nurUngelesen: string }) {
        await this.bewilligungenWorkflowsPage.selectNotification(entryTitel, entryDate, textPart, buttonName, nurUngelesen);
    }
    async BW0X_Bewilligungs_Workflow_Filter({
        dossierBezeichnung,
        institution,
        bearbeitbarDurch,
        typ,
        zustTeam,
        angefragtVon,
        statusBearbeitung,
        userSARSB,
        gemeinde,
        minAnzahl,
        select
    }: {
        dossierBezeichnung: string;
        institution: string;
        bearbeitbarDurch: string;
        typ: string;
        zustTeam: string;
        angefragtVon: string;
        statusBearbeitung: string;
        userSARSB: string;
        gemeinde: string;
        minAnzahl: string;
        select: string;
    }) {
        await this.navigation.goToBewillingungWorkflow();
        await this.bewilligungenWorkflowsPage.searchBewillingung(dossierBezeichnung, institution, bearbeitbarDurch, typ, zustTeam, angefragtVon, statusBearbeitung, userSARSB, gemeinde);
        await this.bewilligungenWorkflowsPage.validateAnzahl(Number(minAnzahl));
        await this.bewilligungenWorkflowsPage.goToBewillingungWorkflow(dossierBezeichnung, select);
    }

    async BW01_Bewilligungs_Workflow_LeistungsEntscheid({ lEvonDate, lEbisDate, checkStatus }: { lEvonDate: string; lEbisDate: string; checkStatus: string }) {
        await this.rahmenbudgetPage.clickRahmenbudgetNavLink();
        await this.rahmenbudgetPage.createLeistungsentscheid(lEvonDate, lEbisDate, checkStatus);
    }
    async BW02_Bewilligungs_Workflow_Step({ dossier, buttonName, checkStatus }: { dossier: string; buttonName: string; checkStatus: string }) {
        await this.bewilligungenWorkflowsPage.acceptBewillingungProcess(dossier, buttonName, checkStatus);
    }
    async BW02b_Bewilligungs_Workflow_Step_V2({ dossier, buttonName, checkEntscheid }: { dossier: string; buttonName: string; checkEntscheid: string }) {
        await this.navigation.searchDossier(dossier);
        await this.bewilligungenWorkflowsPage.goToBewillingungProcess();
        await this.bewilligungenWorkflowsPage.acceptProcess(buttonName);
        await this.bewilligungenWorkflowsPage.validateStatus(checkEntscheid);
    }

    async BW03_Bewilligungs_WF_FreigabeVerwendungsPeriode({ dossierInstitution, verwendungPeriode, status }: { dossierInstitution: string; verwendungPeriode: string; status: string }) {
        await this.navigation.searchDossier(dossierInstitution);
        await this.navigation.rollUpMenu();
        await this.rahmenbudgetPage.selectVerwendungsperiode(verwendungPeriode, status);
    }
    async BW03b_Bewilligungs_WF_FreigabeVerwendungsPeriode({ verwendungPeriode, status }: { verwendungPeriode: string; status: string }) {
        await this.navigation.openMenuNav();
        await this.rahmenbudgetPage.selectVerwendungsperiodeForB(verwendungPeriode, status);
    }

    async logoutAndLoginDiffAcc({ username, password, familie }: { username: string; password: string; familie: string }) {
        await this.navigation.logout();
        await this.login.loginDiffAcc(username, password);
        await this.bedarfsprufungPage.searchDossier(familie);
    }
}
