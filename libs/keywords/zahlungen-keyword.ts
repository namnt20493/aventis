import { Page } from "@playwright/test";
import { ZahlungenPage } from "../pages/zahlungen-page";
import { RahmenbudgetPage } from "../pages/rahmenbudget-page";
import { NavigationPage } from "../pages/navigation-page";
import { LoginPage } from "../pages/login-page";
import { WSHPage } from "../pages/wsh-page";

export class ZahlungenKeyword {
    rahmenbudgetPage: RahmenbudgetPage;
    zalungenPage: ZahlungenPage;
    page: Page;
    login: LoginPage;
    navigation: NavigationPage;
    wshPage: WSHPage;

    constructor(page: Page) {
        this.page = page;
        this.rahmenbudgetPage = new RahmenbudgetPage(page);
        this.zalungenPage = new ZahlungenPage(page);
        this.login = new LoginPage(page);
        this.navigation = new NavigationPage(page);
        this.wshPage = new WSHPage(page);
    }
    async Z01b_WSH_Zahlungen_Freigeben_meinAventis({ dossier, totalbetrag }: { dossier: string; totalbetrag: number }) {
        await this.navigation.gotoZahlungen();
        await this.zalungenPage.selectZahlungen(dossier, totalbetrag.toString());
    }

    async WSH99_Zahlungen_AnzahlPruefen({ dossier, ausgefuehrteZahlungen }: { dossier: string; ausgefuehrteZahlungen: string }) {
        await this.navigation.searchDossier(dossier);
        await this.navigation.openMenuNav();
        await this.zalungenPage.clickZalungenNavlink();
        await this.zalungenPage.checkAmountZalungen(ausgefuehrteZahlungen);
    }

    async Z01_WSH_Zahlungen_Freigeben({ dossierInstitution, freigegebeneZahlungen }: { dossierInstitution: string; freigegebeneZahlungen: string }) {
        await this.navigation.searchDossier(dossierInstitution);
        await this.navigation.openMenuNav();
        await this.zalungenPage.clickZalungenNavlink();
        await this.zalungenPage.clickFreizugebenenTab();
        await this.zalungenPage.clickCheckbox();
        await this.zalungenPage.clickAuswahlFreigenbenBtn();
        await this.zalungenPage.checkFreigegebeneZahlungen(freigegebeneZahlungen);
    }

    async Z01_WSH_Zahlungen_Freigeben_NoCheck({ dossierInstitution }: { dossierInstitution: string }) {
        await this.navigation.searchDossier(dossierInstitution);
        await this.navigation.openMenuNav();
        await this.zalungenPage.clickZalungenNavlink();
        await this.zalungenPage.clickFreizugebenenTab();
        await this.zalungenPage.clickCheckbox();
        await this.zalungenPage.clickAuswahlFreigenbenBtn();
    }
    async MAE10_Zahlungen_freigeben({ freigeben, dossier }: { freigeben: string; dossier: string }) {
        await this.navigation.gotoZahlungen();
        await this.zalungenPage.goToUbersichtDossiers();
        await this.zalungenPage.selectfreigebenZahlungen(dossier);
        await this.zalungenPage.clickZahlungenBtn();
        await this.zalungenPage.clickCheckbox();
        await this.zalungenPage.clickAuswahlFreigenbenBtn();
        await this.zalungenPage.checkzahlungenNumber();
    }
    async MAE11_Rechnungen_freigeben({ dossier, kommentar, rechnungsText }: { dossier: string; kommentar: string; rechnungsText: string }) {
        await this.navigation.gotoZahlungen();
        await this.zalungenPage.goToRechnungenTab();
        await this.zalungenPage.inputDossierSearch(dossier);
        await this.zalungenPage.editRechnungen(dossier, kommentar, rechnungsText);
    }
}
