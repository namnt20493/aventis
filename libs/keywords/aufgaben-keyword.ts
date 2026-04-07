import { AufgabenPage } from "../pages/aufgaben-page";
import { NavigationPage } from "../pages/navigation-page";
import { Page } from "@playwright/test";

export class AufgabenKeyword {
    page: Page;
    navigationPage: NavigationPage;
    aufgabenPage: AufgabenPage;
    constructor(page: Page) {
        this.page = page;
        this.navigationPage = new NavigationPage(page);
        this.aufgabenPage = new AufgabenPage(page);
    }
    async DO04_Aufgabe_erfassen({ aufgabenStatus, aufgabenTitel, faelligkeitDatum, zugewiesenAn, check }) {
        await this.navigationPage.openDossierverwaltungMenu();
        await this.aufgabenPage.selectAufgabenNavLink();
        await this.aufgabenPage.selectAufgabeErfassen(aufgabenStatus);
        await this.aufgabenPage.inputInfo(aufgabenStatus, aufgabenTitel, faelligkeitDatum, zugewiesenAn);
        await this.aufgabenPage.inputSearchZugewiesene(zugewiesenAn);
        await this.aufgabenPage.validateAufgabe(faelligkeitDatum, check);
    }
    async DO04b_Aufgabe_editieren({ oldFaelligkeitDatum, oldAufgabenTitel, oldzugewiesenAn, zugewiesenAn, aufgabenTitel, status, prio, startDatum, notizen, checkList, verKnuepfung }) {
        await this.navigationPage.openDossierverwaltungMenu();
        await this.aufgabenPage.selectAufgabenNavLink();
        await this.aufgabenPage.inputSearchZugewiesene(oldzugewiesenAn, oldFaelligkeitDatum);
        await this.aufgabenPage.editAufgabe(oldFaelligkeitDatum, oldAufgabenTitel);
        await this.aufgabenPage.editAufgabeInfo(zugewiesenAn, aufgabenTitel, status, prio, startDatum, notizen, checkList, verKnuepfung);
    }
    async DO04c_Aufgabe_GUI({ dossierBezeichnung, zugewiesenAn, aufgabenTitel, statusDragTo }) {
        //await this.navigationPage.searchDossier(dossierBezeichnung)
        await this.aufgabenPage.selectAufgabenNavLink();
        await this.aufgabenPage.clearFilter();
        await this.aufgabenPage.searchAufgabeFilter(zugewiesenAn);
        await this.aufgabenPage.checkStatus(aufgabenTitel, zugewiesenAn, statusDragTo);
    }
    async DO04d_Aufgaben_filtern_selektieren({ dossier, zugewMitarbeiter, erstelltDurch, status, aufGabeTitel, datum, notiz }) {
        await this.aufgabenPage.selectAufgabenNavLink();
        await this.aufgabenPage.searchAufgabe(dossier, zugewMitarbeiter, erstelltDurch, status);
        await this.aufgabenPage.editAufgabe(datum, aufGabeTitel);
        await this.aufgabenPage.editNotiz(notiz);
    }
    async DO04e_zuAufgabe_Dokument_hinzufuegen({ dossier, zugewMitarbeiter, erstelltDurch, status, aufGabeTitel, datum, dokumentName }) {
        //await this.navigationPage.searchDossier(dossier);
        await this.aufgabenPage.selectDokument();
        await this.navigationPage.gotoAufgabenUbersicht();
        await this.aufgabenPage.searchAufgabe(dossier, zugewMitarbeiter, erstelltDurch, status);
        await this.aufgabenPage.editAufgabe(aufGabeTitel, datum);
        await this.aufgabenPage.editAufgabeDokumentLink(dokumentName);
    }
}
