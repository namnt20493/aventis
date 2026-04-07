import { umfeldPage } from "../pages/umfeld-page";
import { Page } from "@playwright/test";
import { NavigationPage } from "../pages/navigation-page";

export class UmfeldKeyword {
    private readonly page: Page;
    private readonly navigation: NavigationPage;
    private readonly umfeldPage: umfeldPage;

    constructor(page: Page) {
        this.page = page;
        this.navigation = new NavigationPage(page);
        this.umfeldPage = new umfeldPage(page);
    }
    async UM07_Institution_Bearbeiten_Zahlungsverbindung_update({ institution, plzOrt, titleBank, IBAN, vonDatum, bisDatum, divDocument }) {
        await this.navigation.goToInstitutionenUndFachpersonen();
        await this.umfeldPage.searchForInstitution(institution);
        await this.umfeldPage.institutionDetails(institution, plzOrt);
        await this.umfeldPage.zahlungsverbindungUpdate(titleBank, IBAN, vonDatum, bisDatum, divDocument);
    }
    async UM06_Institution_Bearbeiten_Zahlungsverbindung_hinzufuegen({ institution, plzOrt, IBAN, vonDatum, bisDatum }) {
        await this.navigation.goToInstitutionenUndFachpersonen();
        await this.umfeldPage.searchForInstitution(institution);
        await this.umfeldPage.institutionDetails(institution, plzOrt);
        await this.umfeldPage.addZahlungsverbindungen(IBAN);
        await this.umfeldPage.fillZahlungsverbindungenInfo(IBAN, vonDatum, bisDatum);
        await this.umfeldPage.verifyZahlungsverbindungAddedSuccessfully(IBAN);
    }
    async UM05_Institution_Bearbeiten_Kontaktperson_hinzufuegen({ institution, plzOrt, vorName, nachName, telGeschaft, telMobile, eMail, abteilung }) {
        await this.navigation.goToInstitutionenUndFachpersonen();
        await this.umfeldPage.searchForInstitution(institution);
        await this.umfeldPage.institutionDetails(institution, plzOrt);
        await this.umfeldPage.addKontaktperson(vorName, nachName, telGeschaft, telMobile, eMail, abteilung);
        await this.umfeldPage.verifyIfEditKontaktpersonIsSuccessful(vorName, nachName, telGeschaft, telMobile, eMail, abteilung);
    }
    async UM04_Institution_Bearbeiten_Kontaktperson_update({ institution, plzOrt, oldName, vorName, nachName, telGeschaft, telMobile, eMail, abteilung }) {
        await this.navigation.goToInstitutionenUndFachpersonen();
        await this.umfeldPage.searchForInstitution(institution);
        await this.umfeldPage.institutionDetails(institution, plzOrt);
        await this.umfeldPage.editKontaktperson(oldName, vorName, nachName, telGeschaft, telMobile, eMail, abteilung);
        await this.umfeldPage.verifyIfEditKontaktpersonIsSuccessful(vorName, nachName, telGeschaft, telMobile, eMail, abteilung);
    }
    async UM03b_Fachperson_erfassen_details({ name, strasse, vorname, hausNr, gueltigVon, gueltigBis, tel, eMail, ort, typisierung, geschlecht, iBanNummer, iBANName, iBANStrasse, iBANhausNr, iBANPostfach, iBANOrt, iBANGultigVon, iBANGueltigBis }) {
        await this.navigation.goToInstitutionenUndFachpersonen();
        await this.umfeldPage.fachpersonErfassen();
        await this.umfeldPage.inputFachpersonDetails(name, strasse, vorname, hausNr, gueltigVon, gueltigBis, tel, eMail, ort, typisierung, geschlecht);
        await this.umfeldPage.inputIBAN(iBanNummer, iBANName, iBANStrasse, iBANhausNr, iBANPostfach, iBANOrt, iBANGultigVon, iBANGueltigBis);
        await this.umfeldPage.closeDialog();
    }
    async UM03_Institution_erfassen_details({ name, strasse, hausNr, gueltigVon, gueltigBis, typisierung, tel, eMail, ort, kPName, kPVorname, kPTel, kPMobile, kPEmail, kPAbteilung, kPIBAN, iBANName, iBANStrasse, iBANhausNr, iBANPostfach, iBANOrt, iBANGultigVon, iBANGueltigBis }) {
        await this.navigation.goToInstitutionenUndFachpersonen();
        await this.umfeldPage.institutionErfassen();
        await this.umfeldPage.inputInstitutionDetails(name, strasse, hausNr, gueltigVon, gueltigBis, typisierung, tel, eMail, ort);
        await this.umfeldPage.inputKontaktPersonDetails(kPName, kPVorname, kPTel, kPMobile, kPEmail, kPAbteilung);
        await this.umfeldPage.inputIBAN(kPIBAN, iBANName, iBANStrasse, iBANhausNr, iBANPostfach, iBANOrt, iBANGultigVon, iBANGueltigBis);
        await this.umfeldPage.closeDialog();
    }
    async UM02_InstitutionFachperson_erfassen({ institution, kontaktPerson, Rolle }) {
        await this.navigation.openInstitutionenUndFachpersonenLink();
        await this.umfeldPage.createNewInstitution(institution, kontaktPerson, Rolle);
    }
    async U01_Bezugsperson_erfassen({ name, vorname, rolle, zusatz, strasse, hausNummer, Ort }) {
        await this.navigation.openBezugspersonenLink();
        await this.umfeldPage.addNewBezugspersonen();
        await this.umfeldPage.fillInfoBezugsperson(name, vorname, rolle);
        await this.umfeldPage.editBezugspersonen(name, vorname, zusatz, strasse, hausNummer, Ort);
    }
    async U01b_Bezugsperson_ZahlVerbindung_erfassen({ dossier, bezPerson, IBAN, gueltigVon, gueltigBis, strasse, nummer, postfach, ort, datei }) {
        await this.navigation.searchDossier(dossier);
        await this.navigation.openBezugspersonenLink();
        await this.umfeldPage.openEditBezugspersonen(bezPerson);
        await this.umfeldPage.openEditZahlungsverbindungen();
        await this.umfeldPage.fillValueZahlungsverbindungen(IBAN, gueltigVon, gueltigBis, strasse, nummer, postfach, ort, datei);
    }

    async U01c_Bezugsperson_ZahlVerbindung_freigeben({ dossier, bezPerson }) {
        await this.navigation.searchDossier(dossier);
        await this.navigation.openBezugspersonenLink();
        await this.umfeldPage.openEditBezugspersonen(bezPerson);
        await this.umfeldPage.requestConfirmation();
    }
    async P19b_Person_Bezugsperson_Stammdaten({ dossier, bezugsPerson, zusatz, telefonGeschaeft, emailPrivat, emailGeschaeft, strasse, hNummer, ort, beziehungRolle, beziehungsTyp, vonKlient, gueltVon, gueltBis }) {
        await this.navigation.searchDossier(dossier);
        await this.navigation.openBezugspersonenLink();
        await this.umfeldPage.openEditBezugspersonen(bezugsPerson);
        await this.umfeldPage.editAdressen(ort, strasse, zusatz, hNummer);
        await this.umfeldPage.editKommunikation(telefonGeschaeft, emailPrivat, emailGeschaeft);
        await this.umfeldPage.editBeziehungen(beziehungRolle, beziehungsTyp, vonKlient, gueltVon, gueltBis);
    }
}
