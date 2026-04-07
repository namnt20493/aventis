import { NavigationPage } from "../pages/navigation-page";
import { Page } from "@playwright/test";
import { DossierubersichtPage } from "../pages/dossierubersicht-page";

export class DossierubersichtKeyword {
    page: Page;
    private readonly navigationPage: NavigationPage;
    private readonly dossierubersichtPage: DossierubersichtPage;

    constructor(page: Page) {
        this.page = page;
        this.navigationPage = new NavigationPage(page);
        this.dossierubersichtPage = new DossierubersichtPage(page);
    }

    async DO12_Dossieruebersicht_Zustaendigkeit_aendern({ zustBereich, menuSelect, teamSozial, persSozial, teamSach, persSach, gueltigAb, eintrUeberschrX, offeneAufgUebertrX }) {
        await this.navigationPage.openDossierubersichtLink();
        await this.dossierubersichtPage.openEditZustandig(zustBereich, menuSelect);
        await this.dossierubersichtPage.editInfoDossierubersicht(teamSozial, persSozial, teamSach, persSach, gueltigAb, eintrUeberschrX, offeneAufgUebertrX);
    }
    async DO12b_DossierMenge_Zustaendigkeit_aendern({ aktuelleZust, neuZust, gueltigAb, eintrUeberschrX, offeneAufgUebertrX }) {
        await this.navigationPage.openDossierzustandigkeitAndernLink();
        await this.dossierubersichtPage.fillInfoDossierZustandigkeitAndern(aktuelleZust, neuZust, gueltigAb, eintrUeberschrX, offeneAufgUebertrX);
    }
    async DO12b_DossierMenge_Zustaendigkeit_aendern_TEST({ aktuelleZust, neuZust, gueltigAb, eintrUeberschrX, offeneAufgUebertrX }) {
        await this.navigationPage.openDossierzustandigkeitAndernLink();
        await this.dossierubersichtPage.fillInfoDossierZustandigkeitAndern(aktuelleZust, neuZust, gueltigAb, eintrUeberschrX, offeneAufgUebertrX);
    }
}
