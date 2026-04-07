import { Page } from "@playwright/test";
import { BedarfsprufungPage } from "../pages/bedarfsprufung-page";
import { RahmenbudgetPage } from "../pages/rahmenbudget-page";
import { BuchhaltungPage } from "../pages/buchhaltung-page";

export class BuchhaltungKeyword {
    page: Page;
    buchhaltungPage: BuchhaltungPage;
    constructor(page: Page) {
        this.page = page;
        this.buchhaltungPage = new BuchhaltungPage(page);
    }

    async BU01_ZahlungsAuftrag_Erstellen({ bisValutaDatum, dossier, checkZahlungTotal, buchhaltung, zustGemeinde }) {
        await this.buchhaltungPage.goToBuchungenImportieren();
        await this.buchhaltungPage.clickFilterLeeren();
        await this.buchhaltungPage.fillDossier(dossier);
        await this.buchhaltungPage.fillBisValuatadatum(bisValutaDatum);
        await this.buchhaltungPage.clickBuchungenBtn();
        await this.buchhaltungPage.switchToZahlungsauftragErstellen();
        await this.buchhaltungPage.clickFilterZurucksetzen();
        await this.buchhaltungPage.fillDossierForZahlungsauftrag(dossier);
        await this.buchhaltungPage.fillBisValuatadatumForZahlungsauftrag(bisValutaDatum);
        await this.buchhaltungPage.selectZalungensauftrag(dossier, bisValutaDatum);
        await this.buchhaltungPage.checkZahlungTotal(checkZahlungTotal);
        await this.buchhaltungPage.clickZahlungsauftragBtn();
    }

    async BC02_Buchungen_importieren_Check({ bisDatum, dossier, zustGemeinde, buDate, buText, IBAN, sumBetrag }) {
        await this.buchhaltungPage.goToBuchungenImportieren();
        await this.buchhaltungPage.clickFilterLeeren();
        await this.buchhaltungPage.buchhaltungFilter(bisDatum, zustGemeinde, dossier);
        await this.buchhaltungPage.clickBuchungsposition(buDate, buText, dossier);
        await this.buchhaltungPage.validateBuchungsDetail(buDate, buText, IBAN, dossier, sumBetrag);
    }

    async BU02_Klient_SozialhilfeSchuld_anzeigen({ klient, dossier, stichDatum, zeilenTotal }) {
        await this.buchhaltungPage.selectSozialhilfeschuldItem();
        await this.buchhaltungPage.inputSozialhifeschuldSearch(klient, stichDatum);
        await this.buchhaltungPage.validateSozialhilfeschuld(dossier, zeilenTotal);
    }
}
