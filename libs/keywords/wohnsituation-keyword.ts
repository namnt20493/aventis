import { Page } from "@playwright/test";
import { WohnSituationPage } from "../pages/wohnsituation-page";
import { NavigationPage } from "../pages/navigation-page";

export class Wohnsituation {
    private readonly page: Page;
    private readonly wohnsituation: WohnSituationPage;
    navigation: NavigationPage;

    constructor(page: Page) {
        this.page = page;
        this.wohnsituation = new WohnSituationPage(page);
        this.navigation = new NavigationPage(page);
    }
    async DW01_Dossier_Haushalt_pruefen({ dossier, zimmerWohnungTitel, strasseAdresse, Wohnkosten, beWohnerContains, gueltigAb }) {
        await this.navigation.searchDossier(dossier);
        await this.navigation.openMenuNav();
        await this.wohnsituation.clickOnWohnsituantionNav();
        await this.wohnsituation.checkWohnsituation(zimmerWohnungTitel, strasseAdresse, Wohnkosten, beWohnerContains, gueltigAb);
    }
    async WO33_Wohnsituation_Haushalt_DateienHochladen({ dossier, docType, document }) {
        await this.navigation.searchDossier(dossier);
        await this.navigation.openMenuNav();
        await this.wohnsituation.clickOnWohnsituantionNav();
        await this.wohnsituation.editWohnsituation();
        await this.wohnsituation.selectWohnsituationType(docType, document);
    }
    async WO32_Wohnsituation_Haushalt_Wohnung_anpassen({ vermieter, wohnungsgrosse, mietkosten, nebenkosten }) {
        await this.navigation.rollUpMenu();
        await this.wohnsituation.clickOnWohnsituantionNav();
        await this.wohnsituation.clickOnWohnsituantionCard();
        await this.wohnsituation.inputWohnsituationInfo(vermieter, wohnungsgrosse, mietkosten, nebenkosten);
    }
    async WO32_01b_Wohnsituation_Haushalt_Wohnung_anpassen({ vermieter, wohnungsgrosse, mietkosten, nebenkosten }) {
        await this.navigation.openMenuNav();
        await this.wohnsituation.clickOnWohnsituantionNav();
        await this.wohnsituation.editWohnsituation();
        await this.wohnsituation.inputWohnsituationInfo(vermieter, wohnungsgrosse, mietkosten, nebenkosten);
    }
    async WO30_Wohnsituation_Haushalt_Person_Hinzufuegen({ name, vorname, geburtsdatum, ahvNumber, personInhausltVon, inHauslt, ereignis }) {
        await this.wohnsituation.personHinzufuegen(name, vorname, geburtsdatum, ahvNumber, personInhausltVon, inHauslt, ereignis);
    }

    async WO31_Wohnsituation_Haushalt_PersonEn_entfernen({ dossier, klient, inHaushaltBis, inUeBis, ereignis }) {
        await this.navigation.searchDossier(dossier);
        await this.navigation.openMenuNav();
        await this.wohnsituation.selectWohnsituation();
        await this.wohnsituation.personDelete(klient, inHaushaltBis, inUeBis, ereignis);
    }
    async WO32b_Wohnsituation_Wohnung_neuErfassenKopie({ gultigVon, gultigBis, ohnePerson, mitPerson }) {
        await this.wohnsituation.clickOnWohnsituantionNav();
        await this.wohnsituation.addNewWohnsituationErfassen();
        await this.wohnsituation.fillInfoWohnsituationErfassen(gultigVon, gultigBis, ohnePerson, mitPerson);
    }
}
