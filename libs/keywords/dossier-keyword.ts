import { Page } from "@playwright/test";
import { NavigationPage } from "../pages/navigation-page";
import { DossierOpenPage } from "../pages/openDossier-page";
import { WohnSituationPage } from "../pages/wohnsituation-page";
export class DossierKeyword {
    private readonly page: Page;
    private readonly navigation: NavigationPage;
    private readonly dossierOpen: DossierOpenPage;
    private readonly wohnSituationPage: WohnSituationPage;

    constructor(page: Page) {
        this.page = page;
        this.navigation = new NavigationPage(page);
        this.dossierOpen = new DossierOpenPage(page);
        this.wohnSituationPage = new WohnSituationPage(page);
    }
    async DO16_Suche_Filtern_Anzahl({ dossierSuche, leistungArt, team, zustaendigSARSB, gemeinde, leistungArtStatus, anzahlTrefferBigger }) {
        await this.navigation.goToDossierList();
        await this.dossierOpen.inputFilter(dossierSuche, leistungArt, leistungArtStatus, team, zustaendigSARSB, gemeinde);
        await this.dossierOpen.validateAnzahl(anzahlTrefferBigger);
    }
    async D03_Dossier_Suche({ name, vorname, AHVNummer, geburtsdatum, geschlecht, strasse, hausNr, ort }) {
        await this.navigation.goToOpenDossier();
        await this.dossierOpen.searchForDossier(name, vorname, AHVNummer, geburtsdatum, geschlecht, strasse, hausNr, ort);
    }

    async P01_Person_Search({ name, vorname, ahvNumber, geburtsdatum }) {
        await this.navigation.goToOpenDossier();
        await this.dossierOpen.searchDossier(name, vorname, ahvNumber, geburtsdatum); //AHV
    }
    async P05_Person_Create_Manual_Complete({ name, vorname, ahvNumber, language, zivilstand, zivilstandSeit, geburtsdatum, national, gender, aufenthalt, aufenGultigVon, aufenGultigBis }) {
        await this.navigation.goToOpenDossier();
        await this.dossierOpen.enterPersonManually();
        await this.dossierOpen.inputName(name);
        await this.dossierOpen.inputVorname(vorname);
        await this.dossierOpen.inputAHVNumber(ahvNumber);
        await this.dossierOpen.selectLanguage(language);
        await this.dossierOpen.selectZivilstand(zivilstand, zivilstandSeit);
        await this.dossierOpen.inputBirthday(geburtsdatum);
        await this.dossierOpen.selectNationality(national);
        await this.dossierOpen.selectGender(gender);
        if (national !== "Schweiz" || national !== "Swaziland") {
            await this.dossierOpen.selectAufenthaltsStatus(aufenthalt, aufenGultigVon, aufenGultigBis);
        }
        await this.dossierOpen.expectErrorMsgNotVisible();
    }
    async P10_Person_Communikation_Complete({ mobile, privateNumber, email }) {
        await this.dossierOpen.inputMobileNumber(mobile);
        await this.dossierOpen.inputPrivateNumber(privateNumber);
        await this.dossierOpen.inputEmail(email);
    }
    async P15_Person_Adress({ zusatz, strasse, houseNumber, ort, validDate }) {
        await this.dossierOpen.inputZusatz(zusatz);
        await this.dossierOpen.inputStrasse(strasse);
        await this.dossierOpen.inputHouseNumber(houseNumber);
        await this.dossierOpen.selectOrt(ort);
        await this.dossierOpen.inputValidDate(validDate);
    }
    async P20_Person_ZahlungsVerbindung({ iban }) {
        await this.dossierOpen.inputIban(iban);
        await this.dossierOpen.expectBtnPersonUbernehmenActived();
    }

    async H01_Haushalt_Uebernehmen_Zustaendigkeit({ zust_Gemeinde, zust_SozTeam, zust_SozMitarbeiter, zust_SachbTeam, zust_SachbMitarbeiter }) {
        await this.dossierOpen.clickBtnHouseholdTakeOver();
        await this.dossierOpen.selectGemeinde(zust_Gemeinde);
        await this.dossierOpen.selectSozialarbeit(zust_SozTeam, zust_SozMitarbeiter);
        await this.dossierOpen.selectSachbearbeitung(zust_SachbTeam, zust_SachbMitarbeiter);
        await this.dossierOpen.expectBtnPersonZuweisenActived();
    }

    async D01_Dossier_Eroeffnen({ dossierBezeichnung, eroeffnetAm, dossierSprache }): Promise<string> {
        await this.dossierOpen.clickBtnPersonenZuewisen();
        await this.dossierOpen.inputdossierbezeichnungInfo(dossierBezeichnung, eroeffnetAm, dossierSprache);
        await this.dossierOpen.expectBtnDossierEroffnenActived();
        const dossierGuid = await this.dossierOpen.clickBtnDossierOpen();

        // clickBtnDossierOpen already waits for page ready (includes Angular stability + domcontentloaded)
        // Only verify the new dossier was created - no need for redundant networkidle wait
        await Promise.all([this.wohnSituationPage.verifyNewDossierCreated(), this.navigation.waitForSpinnerToDisappear()]);

        // Reduced from 2000ms - Angular stability check in Phase 1 makes this less necessary
        await this.page.waitForTimeout(500);

        await this.navigation.checkForErrors("Fehler beim Erfassen eines Dossiers");
        return dossierGuid;
    }

    async P30_Person_Uebernehmen() {
        await this.dossierOpen.clickBtnTakeOverPerson();
        await this.dossierOpen.expectBtnHaushaltUbernehmenActived();
    }
    async P17_Person_AufenthaltsAdresseInstitution({ institution, gueltigVon, gueltigBis, personZuweisen }) {
        await this.navigation.openWohnsituationLink();
        await this.dossierOpen.addNewAufenthaltsadresseErfassen();
        await this.dossierOpen.fillValueAufenthaltsadresseErfassenInstitution(institution, gueltigVon, gueltigBis, personZuweisen);
    }

    async P16_Person_AufenthaltsAdresseFrei({ zusatz, strasse, hausnummer, PLZ_Ort, gueltigVon, gueltigBis, personZuweisen }) {
        await this.navigation.openWohnsituationLink();
        await this.dossierOpen.addNewAufenthaltsadresseErfassen();
        await this.dossierOpen.fillValueAufenthaltsadresseErfassenFreieAdresse(zusatz, strasse, hausnummer, PLZ_Ort, gueltigVon, gueltigBis, personZuweisen);
    }
    async D01b_Dossier_eroeffnen_absprung({ name, vorname, geburtsTag, aHV, dossierName }) {
        await this.navigation.goToOpenDossier();
        await this.dossierOpen.clickOnSearchedDossier(name, vorname, geburtsTag, aHV, dossierName);
    }
}
