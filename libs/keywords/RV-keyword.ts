import { Page } from "@playwright/test";
import { NavigationPage } from "../pages/navigation-page";
import { RVPage } from "../pages/RV-page";

export class WSHKeyword {
    private readonly page: Page;
    private readonly rvPage: RVPage;
    private readonly navigation: NavigationPage;

    constructor(page: Page) {
        this.page = page;
        this.rvPage = new RVPage(page);
        this.navigation = new NavigationPage(page);
    }

    async RV02_Auflagen_erfassen({ verfahren, status1, erstelltDurch, betroffenPersonen, titel, zugeteiltAn, erstelltAm, frist, status2, ausgangslage, auflagen, entscheid, sanktionen, weitereSanktionen, document }) {
        await this.navigation.openAuflagenLink();
        await this.rvPage.addNewAuflagenVerfahren();
        await this.rvPage.fillAuflagenDialog({
            titel,
            zustaendig: zugeteiltAn,
            betroffenPersonen,
            ausgangslage
        });
        await this.rvPage.saveAndCloseDialog();
    }

    async RV02b_Auflagen_Folgeschritt({ seit, titelForSelect, typeOfNextStep, titel, sanktionVon, erstelltAm, sanktionBis, status, zugeteiltAn, ausgangslage, auflagen, entscheid, sanktionen, weitereSanktionen, document }) {
        await this.navigation.openAuflagenLink();
        await this.rvPage.openAuflagenFolgeschrittEdit(seit, titelForSelect);
        await this.rvPage.selectTypeForNextSteps(typeOfNextStep);
        await this.rvPage.fillInforAuflagenFolgeschritt(typeOfNextStep, titel, sanktionVon, erstelltAm, sanktionBis, status, zugeteiltAn);
        await this.rvPage.fillInfomationBoxes(ausgangslage, auflagen, entscheid, sanktionen, weitereSanktionen);
        await this.rvPage.slectDocument(document);
        await this.rvPage.clickBtnVerfahrenSpeichern();
    }
    //RV01 Beschwerde erfassen
    async RV01_Beschwerde_erstellen({ titel, zustaendig, beschFuehrer, vName, vVorname, vStrasseInklNr, vOrt, beschwerdeVon, grund, anfechtDatumEnscheid, zustellungDatumEnscheid, documente }) {
        await this.navigation.openBeschwerdenLink();
        await this.rvPage.addNewBeschwerden();
        await this.rvPage.fillInfoToBeschwerde(titel, zustaendig, beschFuehrer, vName, vVorname, vStrasseInklNr, vOrt, beschwerdeVon, grund, anfechtDatumEnscheid, zustellungDatumEnscheid, documente);
    }

    async RV01b_Beschwerde_erweitern({ titel, instanz, status, beschwerdenummer, stellungNahme, datumVom, artDerEntsch, dokument1, zugestVom, entscheidOk, weiterzug, beschwerdeDoc, grund }) {
        await this.navigation.openBeschwerdenLink();
        await this.rvPage.openEditBeschwerden(titel);
        await this.rvPage.chosseInstanzHinzufugen(instanz);
        await this.rvPage.fillInfoInstanzFrom(status, beschwerdenummer, stellungNahme, datumVom, artDerEntsch, dokument1, zugestVom, entscheidOk, weiterzug, beschwerdeDoc, grund);
    }
    async RV00_Ermittlung_erfassen({ dossier, betrifft, gueltigAb, Bemerkung, document }) {
        await this.navigation.searchDossier(dossier);
        await this.navigation.openErmittlungenLink();
        await this.rvPage.addNewErmittlungErfassen();
        await this.rvPage.fillValueErmittlungErfassen(betrifft, gueltigAb, Bemerkung, document);
        await this.rvPage.genDocumentErmittlungen(gueltigAb);
        await this.rvPage.saveErmittlungErfassen();
    }
}
