import { CommonPage } from "../pages/common-page";
import { ErfassungPage } from "../pages/erfassung-page";
import { FreiwilligePage } from "../pages/freiwillige-page";
import { NavigationPage } from "../pages/navigation-page";
import { Page } from "@playwright/test";
import { RechnungPage } from "../pages/rechnung-page";

export class ErfassungKeyword {
    page: Page;
    navigationPage: NavigationPage;
    commonPage: CommonPage;
    erfassungPage: ErfassungPage;
    rechnungPage: RechnungPage;
    constructor(page: Page) {
        this.page = page;
        this.navigationPage = new NavigationPage(page);
        this.commonPage = new CommonPage(page);
        this.erfassungPage = new ErfassungPage(page);
        this.rechnungPage = new RechnungPage(page);
    }
    async RE01_Rechnung_DokEingang_Erfassen({ sozialDienstRegion, document, dossierBezeichnung, leistung, klient, docTitle, button }) {
        await this.navigationPage.rollUpMenu();
        await this.navigationPage.openDokumenteneingang();
        await this.erfassungPage.uploadRegionaleBernFile(sozialDienstRegion, document);
        await this.erfassungPage.editDocument(document);
        await this.erfassungPage.editInfoErfassung(dossierBezeichnung, leistung, klient, docTitle, button);
        await this.erfassungPage.waitForTRdisappear(document);
    }
    async RE02_Rechnung_DokEingang_Bearbeiten({ dossier, zahlEmpfaenger, betrag, selBelDatum, selValutaDatum, statusSet, setBelDatum, rechNummer, referenzNummer = "", kommentar, faellDatum, finanzierung, konto, betrifftPerson, zahlBetrag }) {
        await this.navigationPage.goToRechnungenBearbeiten();
        await this.rechnungPage.filterRechnungen(dossier);
        await this.rechnungPage.editRechnung(dossier, zahlEmpfaenger, betrag, selValutaDatum, selBelDatum);
        await this.rechnungPage.fillRechnungInfo(statusSet, setBelDatum, rechNummer, referenzNummer, kommentar, faellDatum, finanzierung, konto, betrifftPerson, zahlBetrag);
    }
    async RE03_Rechnung_Freigeben({ dossier, zahlEmpfaenger, belDatum, valutaDatum, betrag, kommentar, statusNeu }) {
        await this.navigationPage.goToZalungenfreigeben();
        await this.rechnungPage.goToRechnungenTab(dossier);
        await this.rechnungPage.editRechnungRow(dossier, zahlEmpfaenger, belDatum, valutaDatum, betrag, kommentar, statusNeu);
    }
}
