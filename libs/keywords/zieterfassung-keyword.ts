import { Page } from "@playwright/test";
import { NavigationPage } from "../pages/navigation-page";
import { ZieterfassungPage } from "../pages/zieterfassung-page";

export class ZieterfassungKeyword {
    page: Page;
    navigationPage: NavigationPage;
    zueterfassungPage: ZieterfassungPage;
    constructor(page: Page) {
        this.page = page;
        this.navigationPage = new NavigationPage(page);
        this.zueterfassungPage = new ZieterfassungPage(page);
    }
    async MALI03_Zeit_erfassen({ dossier, dienstLeistung, datum, dauerHHMM, beschreibung }) {
        await this.navigationPage.openZeitErfassenMenuItem();
        await this.zueterfassungPage.clickZeitErfassenBtn();
        await this.zueterfassungPage.inputZeitInfo(dossier, dienstLeistung, datum, dauerHHMM, beschreibung);
        await this.zueterfassungPage.clickSpeichernBtn();
        await this.navigationPage.checkForErrors("Fehler beim Erfassen der Zeit");
    }
}
