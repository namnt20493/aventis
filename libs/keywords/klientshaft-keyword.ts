import { Page } from "@playwright/test";
import { KlientschaftPage } from "../pages/klientschaft-page";
import { LoginPage } from "../pages/login-page";
import { NavigationPage } from "../pages/navigation-page";
import { CommonKeyword } from "./common-keyword";
import { PassThrough } from "node:stream";

export class KlientschaftKeyword {
    page: Page;
    klientschaft: KlientschaftPage;
    login: LoginPage;
    navigation: NavigationPage;
    common: CommonKeyword;
    constructor(page: Page) {
        this.page = page;
        this.klientschaft = new KlientschaftPage(page);
        this.login = new LoginPage(page);
        this.navigation = new NavigationPage(page);
        this.common = new CommonKeyword(page);
    }
    async KL41b_Vermoegen_Eigenheim_erfassen_doc({ bezeichnung, stichtag, betrag, glaeubiger, maximalGrund, divDoc }: { bezeichnung: string; stichtag: string; betrag: string; glaeubiger: string; maximalGrund: string; divDoc: string }) {
        await this.klientschaft.vermoegenEigenheimErfassen(bezeichnung, stichtag, betrag, glaeubiger, maximalGrund, divDoc);
    }
    async KL0X_ErwerbsituationEinnahmen_erfassen({
        dossier,
        klientschaft,
        topMenu,
        subMenu,
        zahlbarDurch,
        pensumm,
        checkbox,
        betrag,
        gueltigVon,
        gueltigBis,
        schweregrad,
        diverseDok
    }: {
        dossier: string;
        klientschaft: string;
        topMenu: string;
        subMenu: string;
        zahlbarDurch: string;
        pensumm: string;
        checkbox: string;
        betrag: string;
        gueltigVon: string;
        gueltigBis: string;
        schweregrad: string;
        diverseDok: string;
    }) {
        await this.navigation.searchDossier(dossier);
        await this.klientschaft.selectKlientSchaft(klientschaft);
        await this.klientschaft.selectTopMenu(topMenu);
        await this.klientschaft.selectMenuitem(subMenu);
        await this.klientschaft.inputErwerbssituationInfo(pensumm, zahlbarDurch, checkbox, betrag, gueltigVon, gueltigBis, diverseDok, subMenu, schweregrad);
    }
    async BW04_ZahlungsVerbindung_Freigeben({ dossierInstitution, klientschaft, buttonBewilligung, checkStatus }: { dossierInstitution: string; klientschaft: string; buttonBewilligung: string; checkStatus: string }) {
        // await this.klientschaft.waitForApiBW04();
        await this.navigation.waitForAngularStable();
        await this.navigation.searchDossier(dossierInstitution);
        await this.navigation.openMenuNav();
        await this.klientschaft.goToKlientSchaftNavLink(klientschaft);
        await this.klientschaft.acceptZahlungsverbindungen(buttonBewilligung, checkStatus);
    }

    async BW04_ZahlungsVerbindung_Freigeben_OhneNavigation({ klientschaft, buttonBewilligung, checkStatus }: { klientschaft: string; buttonBewilligung: string; checkStatus: string }) {
        await this.navigation.openMenuNav();
        await this.klientschaft.goToKlientSchaftNavLink(klientschaft);
        await this.klientschaft.acceptZahlungsverbindungen(buttonBewilligung, checkStatus);
    }
    async KL01_Klientschaft_select({ dossier, klientschaft }: { dossier: string; klientschaft: string }) {
        await this.navigation.searchDossier(dossier);
        await this.klientschaft.selectKlient(klientschaft);
    }

    async KL03_ErwerbsituationEinnahmen_Lohn_erfassen({ zahlbarDurch, pensumm, betrag, gueltigVon, gueltigBis, checkbox, migration }: { zahlbarDurch: string; pensumm: string; betrag: string; gueltigVon: string; gueltigBis: string; checkbox: string; migration: string }) {
        await this.klientschaft.selectErwerbslohnMenuItem();
        await this.klientschaft.inputInfo(zahlbarDurch, pensumm, betrag, gueltigVon, gueltigBis, checkbox);
        await this.klientschaft.clickSpeichernBtn();
    }
    async KL04_ErwerbsituationEinnahmen_AusbildungsLohn_erfassen({ zahlbarDurch, pensumm, betrag, gueltigVon, gueltigBis, checkbox, migration }: { zahlbarDurch: string; pensumm: string; betrag: string; gueltigVon: string; gueltigBis: string; checkbox: string; migration: string }) {
        await this.klientschaft.editPanel();
        await this.klientschaft.selectAusbildungslohnMenuItem();
        await this.klientschaft.inputInfo(zahlbarDurch, pensumm, betrag, gueltigVon, gueltigBis, checkbox);
        await this.klientschaft.clickSpeichernBtn();
    }
    async KL05_ErwerbssituationEinnahmen_AHVErwachsen_erfassen({ zahlbarDurch, betrag, gueltigVon, gueltigBis }: { zahlbarDurch: string; betrag: string; gueltigVon: string; gueltigBis: string }) {
        await this.klientschaft.editPanel();
        await this.klientschaft.selectAHVErwachsenenrente();
        await this.klientschaft.inputBetrag(betrag);
        await this.klientschaft.inputFromDateToDate(gueltigVon, gueltigBis);
        await this.klientschaft.selectZahlbarDurch(zahlbarDurch);
        await this.klientschaft.clickSpeichernBtn();
    }
    async KL06_ErwerbssituationEinnahmen_ArbeitsLosEntsch_erfassen({ zahlbarDurch, betrag, gueltigVon, gueltigBis }: { zahlbarDurch: string; betrag: string; gueltigVon: string; gueltigBis: string }) {
        await this.klientschaft.editPanel();
        await this.klientschaft.selectArbeitslosenentschadigung();
        await this.klientschaft.inputBetrag(betrag);
        await this.klientschaft.inputFromDateToDate(gueltigVon, gueltigBis);
        await this.klientschaft.selectZahlbarDurch(zahlbarDurch);
        await this.klientschaft.clickSpeichernBtn();
    }
    async KL07_ErwerbssituationEinnahmen_Kinderunterhalt_erfassen({ zahlbarDurch, betrag, gueltigVon, gueltigBis }: { zahlbarDurch: string; betrag: string; gueltigVon: string; gueltigBis: string }) {
        await this.klientschaft.editPanel();
        await this.klientschaft.selectKinderunterhalt();
        await this.klientschaft.inputBetrag(betrag);
        await this.klientschaft.inputFromDateToDate(gueltigVon, gueltigBis);
        await this.klientschaft.selectZahlbarDurch(zahlbarDurch);
        await this.klientschaft.clickSpeichernBtn();
    }
    async KL08_ErwerbssituationEinnahmen_IVErwachsen_erfassen({ zahlbarDurch, betrag, gueltigVon, gueltigBis }: { zahlbarDurch: string; betrag: string; gueltigVon: string; gueltigBis: string }) {
        await this.klientschaft.editPanel();
        await this.klientschaft.selectIVErwachsenenrente();
        await this.klientschaft.inputBetrag(betrag);
        await this.klientschaft.inputFromDateToDate(gueltigVon, gueltigBis);
        await this.klientschaft.selectZahlbarDurch(zahlbarDurch);
        await this.klientschaft.clickSpeichernBtn();
    }
    async KL09_ErwerbssituationEinnahmen_Kinderzulage_erfassen({ zahlbarDurch, betrag, gueltigVon, gueltigBis }: { zahlbarDurch: string; betrag: string; gueltigVon: string; gueltigBis: string }) {
        await this.klientschaft.editPanel();
        await this.klientschaft.selectKinderzulage();
        await this.klientschaft.inputBetrag(betrag);
        await this.klientschaft.inputFromDateToDate(gueltigVon, gueltigBis);
        await this.klientschaft.selectZahlbarDurch(zahlbarDurch);
        await this.klientschaft.clickSpeichernBtn();
    }
    async KL00_ErwerbssituationEinnahmen_erfassen({ erwerbssituationType, zahlbarDurch, pensumm, betrag, gueltigVon, gueltigBis, checkbox }: { erwerbssituationType: string; zahlbarDurch: string; pensumm: string; betrag: string; gueltigVon: string; gueltigBis: string; checkbox: string }) {
        await this.klientschaft.erwerbssituationEinnahmen(erwerbssituationType, zahlbarDurch, pensumm, betrag, gueltigVon, gueltigBis, checkbox);
    }

    async KL40_Vermoegen_Konto_erfassen({ bezeichnung, stichtag, betrag }: { bezeichnung: string; stichtag: string; betrag: string }) {
        await this.klientschaft.editVermogen();
        await this.klientschaft.vermogenKontoErfassen();
        await this.klientschaft.inputBezeichnung(bezeichnung);
        await this.klientschaft.inputStichtag(stichtag);
        await this.klientschaft.inputVermogenBetrag(betrag);
        await this.klientschaft.clickSpeichernBtn();
    }
    async KL41_Vermoegen_Eigenheim_erfassen({ bezeichnung, stichtag, betrag, glaeubiger, maximalGrund }: { bezeichnung: string; stichtag: string; betrag: string; glaeubiger: string; maximalGrund: string }) {
        await this.klientschaft.editVermogen();
        await this.klientschaft.vermogenEigenErfassen();
        await this.klientschaft.inputBezeichnung(bezeichnung);
        await this.klientschaft.inputStichtag(stichtag);
        await this.klientschaft.inputVermogenBetrag(betrag);
        await this.klientschaft.inputGlaubiger(glaeubiger);
        await this.klientschaft.inputMaximale(maximalGrund);
        await this.klientschaft.clickSpeichernBtn();
    }
    async KL42_Vermoegen_Auto_erfassen({ bezeichnung, stichtag, betrag }: { bezeichnung: string; stichtag: string; betrag: string }) {
        await this.klientschaft.editVermogen();
        await this.klientschaft.vermogenAutoErfassen();
        await this.klientschaft.inputBezeichnung(bezeichnung);
        await this.klientschaft.inputStichtag(stichtag);
        await this.klientschaft.inputVermogenBetrag(betrag);
        await this.klientschaft.clickSpeichernBtn();
    }
    async KL4X_Vermoegen_erfassen({ vermogenType, bezeichnung, stichtag, betrag, glaeubiger, maximalGrund }: { vermogenType: string; bezeichnung: string; stichtag: string; betrag: string; glaeubiger: string; maximalGrund: string }) {
        await this.klientschaft.vermogenErfassen(vermogenType, bezeichnung, stichtag, betrag, glaeubiger, maximalGrund);
    }
    async KL30_Beziehungen_erfassen({ beziehung, von, gueltigVon, gueltigBis }: { beziehung: string; von: string; gueltigVon: string; gueltigBis: string }) {
        await this.klientschaft.editBeziehungen();
        await this.klientschaft.beziehungErfassen();
        await this.klientschaft.selectBeziehung(beziehung);
        await this.klientschaft.selectKlientschaft(von);
        await this.klientschaft.inputFromDateToDate(gueltigVon, gueltigBis);
        await this.klientschaft.clickBtnSpeichern();
    }
    async KL10_Krankenversicherungen_VVG_erfassen({ klientschaft, Gueltigkeit, KKasse, VersNummer, GrundPraemie, ZahnInklusive, Franchise, Bemerkung }: { klientschaft: string; Gueltigkeit: string; KKasse: string; VersNummer: string; GrundPraemie: string; ZahnInklusive: string; Franchise: string; Bemerkung: string }) {
        await this.klientschaft.selectKlientSchaft(klientschaft);
        await this.klientschaft.openKrankenversicherungenEdit();
        await this.klientschaft.addNewVVGFrom();
        await this.klientschaft.fillInfoInVVGFrom(Gueltigkeit, KKasse, VersNummer, GrundPraemie, ZahnInklusive, Franchise, Bemerkung);
        await this.klientschaft.clickBtnSpeichern();
    }

    async KL11_Krankenversicherungen_KVG_erfassen({ Klientschaft, Gueltigkeit, KKasse, VersNummer, GrundPraemie, Unfall, Franchise, Bemerkung }: { Klientschaft: string; Gueltigkeit: string; KKasse: string; VersNummer: string; GrundPraemie: string; Unfall: string; Franchise: string; Bemerkung: string }) {
        await this.klientschaft.selectKlientSchaft(Klientschaft);
        await this.klientschaft.openKrankenversicherungenEdit();
        await this.klientschaft.addNewKVGFrom();
        await this.klientschaft.fillInfoInKVGFrom(Gueltigkeit, KKasse, VersNummer, GrundPraemie, Unfall, Franchise, Bemerkung);
        await this.klientschaft.clickBtnSpeichern();
    }

    async KL12_Krankenversicherungen_IPV_erfassen({ Klientschaft, Gueltigkeit }: { Klientschaft: string; Gueltigkeit: string }) {
        await this.klientschaft.selectKlientSchaft(Klientschaft);
        await this.klientschaft.openKrankenversicherungenEdit();
        await this.klientschaft.addNewIPVFrom();
        await this.klientschaft.fillInfoInIPVFrom(Gueltigkeit);
        await this.klientschaft.clickBtnSpeichern();
    }

    async KL20_Sorgerecht_erfassen({ Klientschaft, Sorgerecht, Betroffener, GueltigVon, GueltigBis, Besuchsrecht }: { Klientschaft: string; Sorgerecht: string; Betroffener: string; GueltigVon: string; GueltigBis: string; Besuchsrecht: string }) {
        await this.klientschaft.selectKlientSchaft(Klientschaft);
        await this.klientschaft.openSorgerechtEdit();
        await this.klientschaft.addNewSorgerecht();
        await this.klientschaft.fillInfoSorgerecht(Sorgerecht, Betroffener, GueltigVon, GueltigBis, Besuchsrecht);
        await this.klientschaft.clickBtnSpeichern();
    }

    async P21_Person_ZahlungsVerbindung_Klienten({ klient, IBAN, gueltigVon, gueltigBis, strasse, nummer, postfach, ort }: { klient: string; IBAN: string; gueltigVon: string; gueltigBis: string; strasse: string; nummer: string; postfach: string; ort: string }) {
        await this.navigation.rollUpMenu();
        await this.klientschaft.selectKlientSchaft(klient);
        await this.klientschaft.editZahlungsverbindungen();
        await this.klientschaft.ClickZahlungensverbindungErfassenAppCard();
        await this.klientschaft.inputIBAN(IBAN);
        await this.klientschaft.clickZalungensverbindungErfassenBtn();
        await this.klientschaft.inputZahlungensverbindung(strasse, nummer, postfach, gueltigVon, gueltigBis, ort);
        await this.klientschaft.clickBtnSpeichern();
    }
    async KL11b_Krankenversicherungen_KVG_erfassen({ klientschaft, gueltigkeit, kKasse, versNummer, grundPraemie, unfall, franchise, bemerkung, IPV, police }: { klientschaft: string; gueltigkeit: string; kKasse: string; versNummer: string; grundPraemie: string; unfall: string; franchise: string; bemerkung: string; IPV: string; police: string }) {
        await this.klientschaft.selectKlientSchaft(klientschaft);
        await this.klientschaft.openKrankenversicherungenEdit();
        await this.klientschaft.addNewKVGFrom();
        await this.klientschaft.fillInfoInKVGFrom(gueltigkeit, kKasse, versNummer, grundPraemie, unfall, franchise, bemerkung);
        await this.klientschaft.fill_IPV_Value(IPV);
        await this.klientschaft.slectDocument(police);
        await this.klientschaft.clickBtnSpeichern();
    }
    async KL03b_ErwerbsituationEinnahmen_Lohn_Update({ zahlbarDurch, pensumm, betrag, gueltigVonActual, gueltigVonNew, gueltigBis, checkbox13, docType, docPathName }: { zahlbarDurch: string; pensumm: string; betrag: string; gueltigVonActual: string; gueltigVonNew: string; gueltigBis: string; checkbox13: string; docType: string; docPathName: string }) {
        await this.klientschaft.editPanelB();
        await this.klientschaft.checkInfoAndLohnUpdate(zahlbarDurch, pensumm, betrag, gueltigVonActual, gueltigVonNew, gueltigBis, checkbox13, docType, docPathName);
        await this.klientschaft.clickSpeichernBtn();
    }
    async P19_Person_Personendaten_Update({ dossier, klient, national, geschlecht, zivilstand, korrSprache, todesDatum, dokumente }: { dossier: string; klient: string; national: string; geschlecht: string; zivilstand: string; korrSprache: string; todesDatum: string; dokumente: string }) {
        await this.navigation.searchDossier(dossier);
        await this.klientschaft.selectKlientSchaft(klient);
        await this.klientschaft.editPersonendaten();
        await this.klientschaft.fillInfoPersonUpdate(national, geschlecht, zivilstand, korrSprache, todesDatum);
        await this.klientschaft.addDocumentFile(dokumente);
        await this.klientschaft.clickSpeichernBtn();
    }
    async P10b_Person_Communikation({ dossier, klient, kanal, typ, numberOrEmail, mainChannel }: { dossier: string; klient: string; kanal: string; typ: string; numberOrEmail: string; mainChannel: string }) {
        await this.navigation.searchDossier(dossier);
        await this.klientschaft.selectKlientSchaft(klient);
        await this.klientschaft.editCommunikation();
        await this.klientschaft.selectFormKommunikation(kanal, typ);
        await this.klientschaft.fillInfoKommunikation(typ, numberOrEmail, mainChannel);
        await this.klientschaft.clickBtnSpeichern();
    }
    async KL50_Schulden_erfassen({ schuldenTyp, bezeichnung, stichtag, betrag, divDokumente }: { schuldenTyp: string; bezeichnung: string; stichtag: string; betrag: string; divDokumente: string }) {
        await this.klientschaft.createNewSchulden(schuldenTyp);
        await this.klientschaft.inputSchulden(bezeichnung, stichtag, parseFloat(betrag));
        await this.klientschaft.uploadFileSchulden(divDokumente);
        await this.klientschaft.clickSpeichernBtn();
    }
    async KL03d_ErwerbsituationEinnahmen_HypEinkommen_Erfassen({ dossier, klient, betrag, geplantVon, geplantBis, abTretung }: { dossier: string; klient: string; betrag: string; geplantVon: string; geplantBis: string; abTretung: string }) {
        await this.navigation.searchDossier(dossier);
        await this.klientschaft.selectKlientSchaft(klient);
        await this.klientschaft.selectHypEinkommen();
        await this.klientschaft.inputHypothetisches(betrag, geplantVon, geplantBis);
        await this.klientschaft.uploadAbtretung(abTretung);
        await this.klientschaft.clickSpeichernBtn();
    }
    async P22_Person_Ausbildung_Create({ dossier, klient, hoechstAusbild, anzJahre }: { dossier: string; klient: string; hoechstAusbild: string; anzJahre: string }) {
        await this.navigation.searchDossier(dossier);
        await this.klientschaft.selectKlientSchaft(klient);
        await this.klientschaft.editAusbildung(hoechstAusbild, anzJahre);
        await this.klientschaft.checkAusBildung(hoechstAusbild, anzJahre);
    }
    async KL13_Krankenversicherungen_Abtretung_starten({ klientschaft, KVG, VVG }: { klientschaft: string; KVG: string; VVG: string }) {
        await this.klientschaft.selectKlientSchaft(klientschaft);
        await this.klientschaft.editAbtretung(KVG, VVG);
        await this.klientschaft.generateDokument(KVG, VVG);
    }
    async KL13b_Krankenversicherungen_Abtretung_beenden({ klientschaft, KVG, VVG }: { klientschaft: string; KVG: string; VVG: string }) {
        await this.klientschaft.selectKlientSchaft(klientschaft);
        await this.klientschaft.generateWiderrufAbtretungDokument(KVG, VVG);
        await this.klientschaft.editOffAbtretung(KVG, VVG);
    }
}
