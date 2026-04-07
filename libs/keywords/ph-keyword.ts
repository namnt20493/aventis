import { Page } from "@playwright/test";
import { PHPage } from "../pages/ph-page";
import { NavigationPage } from "../pages/navigation-page";

export class PHKeyword {
    private readonly page: Page;
    private readonly phPage: PHPage;
    private readonly navigation: NavigationPage;

    constructor(page: Page) {
        this.page = page;
        this.phPage = new PHPage(page);
        this.navigation = new NavigationPage(page);
    }

    async PH01_JournalEintrag_erfassen({ titel, erstelltAm, jurnalArt, thema, relevantSanktion, interneVerwendung, teilnehmende, betroffene, notiz, dateiPfad }) {
        await this.navigation.openJournalLink();
        await this.phPage.addJournaleintragerfassen();
        await this.phPage.fillValue(titel, erstelltAm, jurnalArt, thema);
        await this.phPage.checkBoxOfRelevantSanktionAndInterneVerwendung(relevantSanktion, interneVerwendung);
        await this.phPage.chosseTeilnehmende(teilnehmende);
        await this.phPage.choseBetroffenePerson(betroffene);
        await this.phPage.inputNote(notiz);
        //19/4
        await this.phPage.selectFile(dateiPfad);
        //~~~~~~~~//
        await this.phPage.addButton();
        await this.phPage.verifyNewJournal(titel);
    }

    async PH03_HaueslicheGewalt_Meldung_erfassen({ MeldungVom, Status, Beziehung, ArtDerGewalt, Opfer, Erlaeuterung, InfoOperH, OHVerlauf, OHKontaktAm }) {
        //30.06.2025 add openMenuNav
        await this.navigation.openMenuNav();
        await this.navigation.openHauslicheGewaltLink();
        await this.phPage.addMeldungErfassen();
        await this.phPage.fillInfoMeldung(MeldungVom, Status, Beziehung, ArtDerGewalt, Erlaeuterung);
        await this.phPage.selectOpfer(Opfer);
        await this.phPage.chooseKontaktiertAndFillValue(InfoOperH, OHVerlauf, OHKontaktAm);
        await this.phPage.buttonMeldungSichern();
    }

    async PH04_Ziele_erfassen({ Titel, ZielVom, FristBis, Mitarbeiter, Klientschaft, Thema, Status, Beschreibung, ErwarteteHandlung, BeschaeftigungsMassnahme, Partner }) {
        await this.navigation.openZieleLink();
        await this.phPage.clickZielErfassenBtn();
        await this.phPage.fillInfoZiele({
            titel: Titel,
            zielVom: ZielVom,
            fristBis: FristBis,
            mitarbeiter: Mitarbeiter,
            klientschaft: Klientschaft,
            thema: Thema,
            status: Status,
            beschreibung: Beschreibung,
            erwarteteHandlung: ErwarteteHandlung,
            beschaeftigungsMassnahme: BeschaeftigungsMassnahme,
            partner: Partner
        });
        await this.phPage.btnZielSichern();
    }
    //19/4
    async PH01c_Journaleintrag_UeberDatei_erfassen({ documentPath, titel, teilNehmer, erstelltAm, jurnalArt, thema, relevantSanktion, interneVerwendung, teilnehmende, notiz, dateiPfad }) {
        await this.navigation.openJournalLink();
        await this.phPage.openUploadFile(documentPath);
        await this.phPage.fillValue(titel, erstelltAm, jurnalArt, thema);
        await this.phPage.checkBoxOfRelevantSanktionAndInterneVerwendung(relevantSanktion, interneVerwendung);
        await this.phPage.chosseTeilnehmende(teilnehmende);
        await this.phPage.choseBetroffenePerson(teilNehmer);
        await this.phPage.inputNote(notiz);
        await this.phPage.selectFile(dateiPfad);
        await this.phPage.addButton();
        await this.phPage.verifyNewJournal(titel);
    }

    async PH05_Zielvereinbarung_ohneWorkflow_erfassen({ dossier, bemerkung, zugeZielTitelSelect, unterzeichnZielvereinbarungPfad }) {
        await this.navigation.searchDossier(dossier);
        await this.navigation.openZieleLink();
        await this.phPage.openZielvereinbarungenLink();
        await this.phPage.addNewZielvereinbarungen();
        await this.phPage.fillInfoZielvereinbarungen(bemerkung, zugeZielTitelSelect, unterzeichnZielvereinbarungPfad);
        await this.phPage.clickVereinbarungSichernBtn();
        await this.phPage.generateDocument();
    }
    async PH07_Zielvereinbarung_Beurteilung({ zielVereinbarungVon, fristVon, datei }) {
        await this.navigation.openZieleLink();
        await this.phPage.openZielvereinbarungenLink();
        await this.phPage.editzuelvereinbarung(zielVereinbarungVon, fristVon, datei);
    }
    //~~~~~~~~~~~~~~~~~~~~~//
    async PH01d_Journal_Eintrag_editieren({ dossier, erstelltAm, titel, deleteBetroffene, adBetroffene, adDocument, atNameOrInstitution, noteTextAsFollows }) {
        await this.navigation.searchDossier(dossier);
        await this.navigation.openJournalLink();
        await this.phPage.openEditJournal(erstelltAm, titel);
        await this.phPage.fillEditJournalFrom(deleteBetroffene, adBetroffene, adDocument, atNameOrInstitution, noteTextAsFollows);
        await this.phPage.addButton();
    }
    async PH05b_Zielvereinbarung_ohneWorkflow_erfassen_mit_IIZ({ dossier, bemerkung, zugeZielTitelSelect, unterzeichnZielvereinbarungPfad, IIZTitel }) {
        await this.navigation.searchDossier(dossier);
        await this.navigation.openZieleLink();
        await this.phPage.openZielvereinbarungenLink();
        await this.phPage.addNewZielvereinbarungen();
        await this.phPage.fillInfoZielvereinbarungen(bemerkung, zugeZielTitelSelect, unterzeichnZielvereinbarungPfad);
        await this.phPage.selectZielvereinbarung(IIZTitel);
        await this.phPage.clickVereinbarungSichernBtn();
        await this.phPage.generateDocument();
    }
}
