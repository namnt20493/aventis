import { AnspruchsprufungPage } from "../pages/anspruchsprufung-page";
import { NavigationPage } from "../pages/navigation-page";
import { Page } from "@playwright/test";
export class AnspruchsprufungKeyword {
    page: Page;
    anspruchsprufungPage: AnspruchsprufungPage;
    navigationPage: NavigationPage;
    constructor(page: Page) {
        this.page = page;
        this.anspruchsprufungPage = new AnspruchsprufungPage(page);
        this.navigationPage = new NavigationPage(page);
    }
    async AN01_Soforthilfe_erfassen({ dossier, expectedErrorContains, klientschaft, betrag, Zahlungsverbindung }) {
        await this.navigationPage.goToDossierList();
        await this.navigationPage.searchDossier(dossier);
        await this.anspruchsprufungPage.goToSoforthilfe();
        await this.anspruchsprufungPage.inputInfo(expectedErrorContains, klientschaft, betrag, Zahlungsverbindung);
    }
    async AN02_Soforthilfe_in_RahmenbudgetPruefen({ dossier, zahlungsArt, buchungsDatum }) {
        await this.navigationPage.searchDossier(dossier);
        await this.anspruchsprufungPage.goToSoforthilfe();
        await this.anspruchsprufungPage.checkSoforthilfeStatus(zahlungsArt, buchungsDatum);
    }
}
