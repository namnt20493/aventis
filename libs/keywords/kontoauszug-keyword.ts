import { Page } from "@playwright/test";
import { PHPage } from "../pages/ph-page";
import { NavigationPage } from "../pages/navigation-page";
import { KontoauszugPage } from "../pages/kontoauszug-page";

export class KontoauszugKeyword {
    page: Page;
    kontoauszugPage: KontoauszugPage;
    navigationPage: NavigationPage;
    constructor(page: Page) {
        this.page = page;
        this.kontoauszugPage = new KontoauszugPage(page);
        this.navigationPage = new NavigationPage(page);
    }
    async AW01_Kontoauszug({ leistungSuchen, suche, zeitRaumBis, zeitRaum, insOrKlient, zahlEmpfaenger, option, nurRueckerstBuchX, korrBuchInklOriginalX, totalAusgaben, totalEinahmen, kontoauszugHerunterladenX }) {
        await this.kontoauszugPage.goToKontoauszugPage();
        await this.kontoauszugPage.searchForKontoauszug(leistungSuchen, suche, zeitRaumBis, zeitRaum, insOrKlient, zahlEmpfaenger, option);
        await this.kontoauszugPage.selectOption(nurRueckerstBuchX, korrBuchInklOriginalX);
        await this.kontoauszugPage.clickSearchBtn();
        await this.kontoauszugPage.validateTotal(totalAusgaben, totalEinahmen);
        await this.kontoauszugPage.verifyDownload(kontoauszugHerunterladenX);
    }
    async AW01b_Kontoauszug_DossierSicht({ dossier, zeitRaumVon, zeitRaumBis, zeitRaum, bezAnInstPerson, zahlEmpfaenger, option, totalAusgaben, totalEinahmen, kontoauszugHerunterladenX, downLoadName }) {
        await this.navigationPage.searchDossier(dossier);
        await this.navigationPage.gotoKontoauszug();
        await this.kontoauszugPage.filterKontoauszug(zeitRaumVon, zeitRaumBis, zeitRaum, bezAnInstPerson, zahlEmpfaenger, option);
        await this.kontoauszugPage.validateKontoauszugFilter(totalAusgaben, totalEinahmen);
        await this.kontoauszugPage.validateFileDownload(kontoauszugHerunterladenX, downLoadName);
    }
}
