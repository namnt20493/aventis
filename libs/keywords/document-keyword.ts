import { Page } from "@playwright/test";
import { DocumentPage } from "../pages/document-page";
import { NavigationPage } from "../pages/navigation-page";
import { RahmenbudgetPage } from "../pages/rahmenbudget-page";

export class DocumentKeyword {
    page: Page;
    private readonly navigation: NavigationPage;
    private readonly documentPage: DocumentPage;
    rahmenbudgetPage: RahmenbudgetPage;

    constructor(page: Page) {
        this.page = page;
        this.navigation = new NavigationPage(page);
        this.documentPage = new DocumentPage(page);
        this.rahmenbudgetPage = new RahmenbudgetPage(page);
    }
    async H07_Dokumente_Hochladen_Versionen({ klient, dokumente, docPath }) {
        await this.documentPage.editPersonendaten(klient, dokumente, docPath);
    }

    async MAE0Y_Dokumenteingang_NachUpload_Zuweisen_AbfolgeNext({ docAblageort, dossier, leistungHas, klient, docTitle, newDocType, thema, rechnBetrag, verwendungsPeriode, status }) {
        await this.documentPage.fillDokumnentForm1(docAblageort, dossier, leistungHas, klient, docTitle, newDocType, thema, rechnBetrag, verwendungsPeriode, status);
        await this.documentPage.clickbtnNextDokument();
    }
    async MAE0X_Dokumenteingang_NachUpload_Zuweisen_AbfolgeStart({ hinzugefuegtDurch, docType, dateiName, datum, docAblageort, dossier, leistungHas, klient, docTitle, newDocType, thema, rechnBetrag, verwendungsPeriode, status }) {
        await this.navigation.rollUpMenu();
        await this.navigation.openDokumenteneingang();
        await this.documentPage.showHinzugefugt();
        await this.documentPage.sortDokumentByName();
        await this.documentPage.filterDokument(hinzugefuegtDurch, docType, dateiName, datum);
        await this.documentPage.fillDokumnentForm(docAblageort, dossier, leistungHas, klient, docTitle, newDocType, thema, rechnBetrag, verwendungsPeriode, status);
        await this.documentPage.clickbtnNextDokument();
    }
    async MAE03_Dokumenteingang_NachUpload_Zuweisen_Lohnabrechnung({ hinzugefuegtDurch, docType, dateiName, datum, newDocType, dossier, leistungHas, klient, docTitle, zahlbarDurch, einnahmePosHas, verwendungsPeriode, effektiverBetrag }) {
        await this.navigation.rollUpMenu();
        await this.navigation.openDokumenteneingang();
        await this.documentPage.showHinzugefugt();
        await this.documentPage.filterDokument(hinzugefuegtDurch, docType, dateiName, datum);
        await this.documentPage.fillDokumentVerarbeitenLohnabrechnung(newDocType, dossier, leistungHas, klient, docTitle, zahlbarDurch, einnahmePosHas, verwendungsPeriode, effektiverBetrag);
        await this.navigation.searchDossier(dossier);
        await this.rahmenbudgetPage.clickRahmenbudgetNavLink();
        await this.rahmenbudgetPage.gotoMonatsbudgetTab();
        await this.rahmenbudgetPage.validateEinnahmen(effektiverBetrag);
    }
    async MAE02_Dokumenteingang_NachUpload_Zuweisen_Freigabe({ hinzugefuegtDurch, docType, dateiName, datum, newDocType, dossier, leistung, klient, docTitle, thema, verwendungsPeriode, status }) {
        await this.navigation.openDokumenteneingang();
        await this.documentPage.showHinzugefugt();
        await this.documentPage.filterDokument(hinzugefuegtDurch, docType, dateiName, datum);
        await this.documentPage.fillDokumentVerarbeitenFreigabeForm(newDocType, dossier, leistung, docTitle, thema, verwendungsPeriode, status);
        // await this.documentPage.checkfreigabeStatus(dossier,verwendungsPeriode,status)
    }
    async MAE01b_DokumenteLoeschen({ all }) {
        await this.navigation.openDokumenteneingang();
        await this.documentPage.deleteDokument(all);
    }
    async MAE01_DokumenteingangUpload({ sozialDienst, document }) {
        await this.navigation.openDokumenteneingang();
        await this.documentPage.uploadDokument(sozialDienst, document);
        //
    }
    async H04_Dokumente_ausVorlage_erstellen({ vorlage, sprache, titel, thema, betrifft, instOderBezug, instOBezNamen, kontPerson, absender }) {
        await this.navigation.openDocumentLink();
        await this.documentPage.addNewDocument();
        await this.documentPage.chosseVorlage(vorlage, sprache);
        await this.documentPage.fillInfoToDocumentSimple(titel, thema, betrifft, instOderBezug, instOBezNamen, kontPerson, absender);
    }
    async H04c_Dokumente_ausVorlage_erstellen_Brief_anKlient({ vorlage, sprache, titel, klient, adresse, thema }) {
        await this.navigation.openDocumentLink();
        await this.documentPage.addNewDocument();
        await this.documentPage.chosseVorlage(vorlage, sprache);
        await this.documentPage.fillInfoToDocument_Brief_Form(titel, klient, adresse, thema);
    }
    async H04_Dokumente_ausVorlage_erstellen_IIS_Form({ vorlage, sprache, titel, klient, adresse }) {
        await this.navigation.openDocumentLink();
        await this.documentPage.addNewDocument();
        await this.documentPage.chosseVorlage(vorlage, sprache);
        await this.documentPage.fillInfoToDocument_IIS_Form(titel, klient, adresse);
    }

    async H03_Dokumente_Filtern_Oeffnen({ searchDossierOrKlient, filterThema, stichWort, docType, person, zeitRaum, checkDokument }) {
        await this.navigation.searchDossier(searchDossierOrKlient);
        await this.documentPage.openDocumentLink();
        await this.documentPage.filterDocument(stichWort, filterThema, person, zeitRaum, docType);
        await this.documentPage.checkDocument(checkDokument);
    }
}
