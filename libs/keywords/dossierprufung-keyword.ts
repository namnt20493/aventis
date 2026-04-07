import { DossierprufungPage } from "../pages/dossierprufung-page";
import { NavigationPage } from "../pages/navigation-page";
import { Page } from "@playwright/test";

export class DossierprufungKeyword {
    page: Page;
    navigationPage: NavigationPage;
    dossierprufungPage: DossierprufungPage;
    constructor(page: Page) {
        this.page = page;
        this.navigationPage = new NavigationPage(page);
        this.dossierprufungPage = new DossierprufungPage(page);
    }
    async DO13_Dossier_pruefen_starten({ dossier }) {
        await this.navigationPage.searchDossier(dossier);
        await this.dossierprufungPage.goToDossierprufung();
        await this.dossierprufungPage.createNewDossierprufung();
        await this.dossierprufungPage.validateDossierprufung();
        await this.dossierprufungPage.deleteDossierprufung();
        await this.dossierprufungPage.abbrechenBtn.click();
    }
    async DO14_Dossier_pruefen_durchfuehren_mitBeanstandung({ dossier, zustTeam, pruefer, status, aufgabeTitel, falligDatum, zugMitarbeiter, kontrollPunkte }) {
        await this.dossierprufungPage.goTodossierliste();
        await this.dossierprufungPage.searchDossier(dossier, zustTeam);
        await this.dossierprufungPage.goToDossierprufung();
        //await this.dossierprufungPage.createNewDossierprufung();
        await this.dossierprufungPage.startenDossierprufung(pruefer, status);
        await this.dossierprufungPage.selectKontrollierende(kontrollPunkte);
        await this.dossierprufungPage.createNewBeanstandungs(aufgabeTitel, falligDatum, zugMitarbeiter);
    }
}
