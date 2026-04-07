import { Page } from "@playwright/test";
import { RahmenbudgetPage } from "../pages/rahmenbudget-page";
import { NavigationPage } from "../pages/navigation-page";

export class RahmenbudgetKeyword {
    page: Page;
    rahmenbudgetPage: RahmenbudgetPage;
    navigation: NavigationPage;

    constructor(page: Page) {
        this.page = page;
        this.rahmenbudgetPage = new RahmenbudgetPage(page);
        this.navigation = new NavigationPage(page);
    }
    async DW02_Rahmenbudget_Wohnkosten_pruefen({ dossier, firstLevelBetrag, wohnKostenGemAnspruch, uebernommeneWohnkosten, totalWohnkosten }: { dossier: string; firstLevelBetrag: number; wohnKostenGemAnspruch: number; uebernommeneWohnkosten: number; totalWohnkosten: number }) {
        await this.navigation.searchDossier(dossier);
        await this.navigation.openMenuNav();
        await this.rahmenbudgetPage.clickRahmenbudgetNavLink();
        await this.rahmenbudgetPage.checkWohnKostenFirstLevel(firstLevelBetrag);
        await this.rahmenbudgetPage.expandWohnkostenRow();
        await this.rahmenbudgetPage.checkWohnkosten(wohnKostenGemAnspruch, uebernommeneWohnkosten, totalWohnkosten);
    }
    async R09_RahmenBudget_Wohnsituation_AnzeigenPruefen({ dossier, checkUebernomWohnKosten }: { dossier: string; checkUebernomWohnKosten: number }) {
        await this.navigation.searchDossier(dossier);
        await this.rahmenbudgetPage.gotoRamenbudgetPage();
        await this.rahmenbudgetPage.openWohnsituationPage();
        await this.rahmenbudgetPage.verifyWohnsituationHeader();
        await this.rahmenbudgetPage.gotoRamenbudgetPage();
        await this.rahmenbudgetPage.checkUbernommene(checkUebernomWohnKosten);
    }
    async R09b_RahmenBudget_Wohnsituation_AnzeigenPruefenKomplett({ dossier, checkWohntyp, checkAdresse, checkGueltigAb, checkWohnKosten, checkBewohnerListe, checkWohnSituation }: { dossier: string; checkWohntyp: string; checkAdresse: string; checkGueltigAb: string; checkWohnKosten: string; checkBewohnerListe: string; checkWohnSituation: string }) {
        await this.rahmenbudgetPage.goToWohnsituation();
        await this.rahmenbudgetPage.verifyWohnsituationInfo(dossier, checkWohntyp, checkAdresse, checkGueltigAb, checkWohnKosten, checkBewohnerListe, checkWohnSituation);
    }

    async R07_Einkommen_Freibetrag_anpassen({ dossier, klient, geplantVon, geplantBis, eFB, begruendung, totalNeu }: { dossier: string; klient: string; geplantVon: string; geplantBis: string; eFB: number; begruendung: string; totalNeu: number }) {
        await this.navigation.searchDossier(dossier);
        await this.navigation.openMenuNav();
        await this.rahmenbudgetPage.clickRahNav();
        await this.rahmenbudgetPage.editErwerbseinkommen(klient, geplantVon, geplantBis, eFB, begruendung);
        await this.rahmenbudgetPage.checkEinkommensfreibetrag(eFB, geplantVon, totalNeu);
    }

    async R01_Rahmenbudget_Wohnkosten_Anpassen({ ubernahmeWohnkostenCFH, uebernahmeWohnkostenVon, uebernahmeWohnkostenBis, uebernahemBegruendung }: { ubernahmeWohnkostenCFH: number; uebernahmeWohnkostenVon: string; uebernahmeWohnkostenBis: string; uebernahemBegruendung: string }) {
        //13.6 add openMenuNav
        await this.navigation.openMenuNav();
        await this.rahmenbudgetPage.clickRahmenbudgetNavLink();
        await this.rahmenbudgetPage.clickWohnkostenMenuBtn();
        await this.rahmenbudgetPage.clickEntscheidungMennuItem();
        await this.rahmenbudgetPage.clickJaRadioBtn();
        await this.rahmenbudgetPage.clickJaRadioBtn();
        await this.rahmenbudgetPage.inputUbernahmenInfo(ubernahmeWohnkostenCFH, uebernahmeWohnkostenVon, uebernahmeWohnkostenBis, uebernahemBegruendung);
        await this.rahmenbudgetPage.verifyUbernahmeWohnkostenStatus();
    }
    async R01_Rahmenbudget_Wohnkosten_Anpassen_V2({ ubernahmeWohnkostenCFH, uebernahmeWohnkostenVon, uebernahmeWohnkostenBis, uebernahemBegruendung }: { ubernahmeWohnkostenCFH: number; uebernahmeWohnkostenVon: string; uebernahmeWohnkostenBis: string; uebernahemBegruendung: string }) {
        await this.rahmenbudgetPage.clickWohnkostenErfassen();
        await this.rahmenbudgetPage.inputUbernahmenInfo(ubernahmeWohnkostenCFH, uebernahmeWohnkostenVon, uebernahmeWohnkostenBis, uebernahemBegruendung);
        await this.rahmenbudgetPage.verifyUbernahmeWohnkostenStatus();
    }
    async SL01_SituationsbedingteLeistung_erfassen({ klient, kontonummer, bezeichnung, leistungserbringer, value, datumVon, datumBis }: { klient: string; kontonummer: number; bezeichnung: string; leistungserbringer: string; value: number; datumVon: string; datumBis: string }) {
        await this.navigation.openMenuNav();
        await this.rahmenbudgetPage.clickRahNav();
        await this.rahmenbudgetPage.clickNeuePositionBtn();
        await this.rahmenbudgetPage.neuePositionErfassen(klient, kontonummer, bezeichnung, leistungserbringer, value, datumVon, datumBis);
    }

    async R02_Rahmenbudget_ZahlungsInfosAnpassen({ zahlungsEmpfaengerCheck, gueltigMonatJahr, zahlungsEmpfaenger, periodizitaet, referenzNummer, mitteilung }: { zahlungsEmpfaengerCheck: string; gueltigMonatJahr: string; zahlungsEmpfaenger: string; periodizitaet: string; referenzNummer: string; mitteilung: string }) {
        await this.navigation.openMenuNav();
        await this.rahmenbudgetPage.clickRahNav();
        await this.rahmenbudgetPage.clickZahlungsInfosAnpassen();
        await this.rahmenbudgetPage.openEditBearbeiten(zahlungsEmpfaengerCheck);
        await this.rahmenbudgetPage.fillZahlungsinformationenBearbeitenValue(gueltigMonatJahr, zahlungsEmpfaenger, periodizitaet, referenzNummer, mitteilung);
        await this.rahmenbudgetPage.clickBtnZahlungsinformationenSichern();
    }
    async KG02_Antrag_Kostengutsprache_Bewilligen_WF({ dossier, titel, betrag }: { dossier: string; titel: string; betrag: number }) {
        await this.navigation.searchDossier(dossier);
        await this.navigation.openMenuNav();
        await this.rahmenbudgetPage.clickRahNav();
        await this.rahmenbudgetPage.clickKostengutspracheTab();
        await this.rahmenbudgetPage.kostengutspracheBewillingung(titel, betrag);
        await this.rahmenbudgetPage.validateKostengutspracheStatus();
    }

    async KG01_Antrag_Kostengutsprache_Erfassen({ dossier, level1, level2, level3, titel, leistungserbringer, betrag, klient, gultigAb, verFallDatum, begruendung }: { dossier: string; level1: string; level2: string; level3: string; titel: string; leistungserbringer: string; betrag: number; klient: string; gultigAb: string; verFallDatum: string; begruendung: string }) {
        await this.navigation.searchDossier(dossier);
        await this.navigation.openMenuNav();
        await this.rahmenbudgetPage.clickRahNav();
        await this.rahmenbudgetPage.clickKostengutspracheTab();
        await this.rahmenbudgetPage.clickKostengutspracheErfassen();
        await this.rahmenbudgetPage.selectMenuItem(level1, level2, level3);
        await this.rahmenbudgetPage.inputKostengutspracheInfo(titel, betrag, leistungserbringer, klient, gultigAb, verFallDatum, begruendung);
        await this.rahmenbudgetPage.clickKostengutspracheSpeichern();
    }
    async KG01b_Antrag_Kostengutsprache_Erfassen_mitDocument({
        dossier,
        level1,
        level2,
        level3,
        titel,
        leistungserbringer,
        betrag,
        klient,
        gultigAb,
        verFallDatum,
        begruendung,
        kostenVorDoc,
        bewilligtDoc,
        diverseDoc
    }: {
        dossier: string;
        level1: string;
        level2: string;
        level3: string;
        titel: string;
        leistungserbringer: string;
        betrag: number;
        klient: string;
        gultigAb: string;
        verFallDatum: string;
        begruendung: string;
        kostenVorDoc: string;
        bewilligtDoc: string;
        diverseDoc: string;
    }) {
        await this.navigation.searchDossier(dossier);
        await this.navigation.openMenuNav();
        await this.rahmenbudgetPage.clickRahNav();
        await this.rahmenbudgetPage.clickKostengutspracheTab();
        await this.rahmenbudgetPage.clickKostengutspracheErfassen();
        await this.rahmenbudgetPage.selectMenuItem(level1, level2, level3);
        await this.rahmenbudgetPage.inputKostengutspracheInfo(titel, betrag, leistungserbringer, klient, gultigAb, verFallDatum, begruendung);
        await this.rahmenbudgetPage.uploadKostenFile(kostenVorDoc);
        await this.rahmenbudgetPage.uploadBewilligteFile(bewilligtDoc);
        await this.rahmenbudgetPage.openUploadFile(diverseDoc);
        await this.rahmenbudgetPage.clickKostengutspracheSpeichern();
    }
    async R03_RahmenBudget_Kennzahlen_pruefen({ dossier, unterstBetrag, valutaTerminNext, valutaDatum }: { dossier: string; unterstBetrag: string; valutaTerminNext: string; valutaDatum: string }) {
        await this.navigation.searchDossier(dossier);
        await this.rahmenbudgetPage.clickRahmenbudgetNavLink();
        await this.rahmenbudgetPage.openKennzahlen();
        await this.rahmenbudgetPage.checkOutBudget(unterstBetrag, valutaTerminNext, valutaDatum);
    }
    async R12_RahmenBudget_KVGVVG_detail_pruefen({ dossier, klient, gultigkeit, krankenkasse, versNummer, grundPraemie, IPV, praemieGAnspruch, kostenUeRichtlinie, franchise, periode, police, bemkerkung, zahlungsEmpf, zahlMethode, unfall }) {
        await this.navigation.searchDossier(dossier);
        await this.rahmenbudgetPage.clickRahmenbudgetNavLink();
        await this.rahmenbudgetPage.waitRahmenbudgetQueryAPI();
        await this.rahmenbudgetPage.verifyRahmenKrankenDetails(klient, gultigkeit, krankenkasse, versNummer, grundPraemie, IPV, praemieGAnspruch, kostenUeRichtlinie, franchise, periode, police, bemkerkung, zahlungsEmpf, zahlMethode, unfall);
    }

    /**
     * @deprecated R13_RahmenBudget_Darstellung_Pruefen visual mparison should be handled by a different conzept
     */
    async R13_RahmenBudget_Darstellung_Pruefen({ dossier, checkColTitle, checkTotalAusgaben, checkTotalEinnahmen, checkTotalUnterstutzungsbetrag, checkRowTitle }) {
        const alreadyOnRahmenbudget = this.page.url().includes("/budget/budget");
        if (!alreadyOnRahmenbudget) {
            await this.navigation.searchDossier(dossier);
            await this.rahmenbudgetPage.clickRahmenbudgetNavLink();
            await this.rahmenbudgetPage.waitRahmenbudgetQueryAPI();
        }
        await this.rahmenbudgetPage.rahmenbudgetVisualComparison(checkColTitle, checkRowTitle);
        await this.rahmenbudgetPage.verfifyRahmenbudgetDetails(checkTotalAusgaben, checkTotalEinnahmen, checkTotalUnterstutzungsbetrag);
    }
    async R11_RahmenBudget_KVGVVG_uebersicht_pruefen({ dossier, beschreibung, zahlungsEmpfaenger, bewilligung, betrag }: { dossier: string; beschreibung: string; zahlungsEmpfaenger: string; bewilligung: string; betrag: number }) {
        await this.navigation.searchDossier(dossier);
        await this.rahmenbudgetPage.clickRahmenbudgetNavLink();
        await this.rahmenbudgetPage.verifyDossierRahmenbudgetDetails(beschreibung, zahlungsEmpfaenger, bewilligung, betrag);
    }
    async R10_RahmenBudget_Monatsbudget_Pruefen({ dossier, checkAusgabenTotal, checkWeitereAbzuege, checkZusammenfassung }: { dossier: string; checkAusgabenTotal: number; checkWeitereAbzuege: number; checkZusammenfassung: number }) {
        await this.navigation.searchDossier(dossier);
        await this.rahmenbudgetPage.clickRahmenbudgetNavLink();
        await this.rahmenbudgetPage.goToMonatsbudgetTab();
        await this.rahmenbudgetPage.checkMonatsbudget(checkAusgabenTotal, checkWeitereAbzuege, checkZusammenfassung);
    }
    async SL03_SituationsbedingteLeistung_imRahmenbudget_Anzeigen({ dossier, category, element, leistungsErbringer, betragMonatlich, geplantVon, geplantBis }: { dossier: string; category: string; element: string; leistungsErbringer: string; betragMonatlich: string; geplantVon: string; geplantBis: string }) {
        await this.navigation.searchDossier(dossier);
        await this.rahmenbudgetPage.clickRahmenbudgetNavLink();
        await this.rahmenbudgetPage.expandSituationsbedingteLeistungen();
        await this.rahmenbudgetPage.verifySituationsbedingteLeistungExists(category, element, leistungsErbringer, betragMonatlich, geplantVon, geplantBis);
    }

    async SL02_SituationsbedingteLeistung_anpassen({ bezeichnung, betrifft, geplantVon, geplantVonNeu, geplantBis, betragNeu }: { bezeichnung: string; betrifft: string; geplantVon: string; geplantVonNeu: string; geplantBis: string; betragNeu: number }) {
        await this.rahmenbudgetPage.clickRahmenbudgetNavLink();
        await this.rahmenbudgetPage.openEditSituationsbedingteLeistung(bezeichnung, betrifft, geplantVon);
        await this.rahmenbudgetPage.fillInfoEditSituationsbedingteLeistung(geplantVonNeu, betragNeu, geplantBis);
    }
    async R06_Rahmenbudget_SpaltenEinAusblenden({ dossier, spaltenName, pruefenVisibleTitel }: { dossier: string; spaltenName: string; pruefenVisibleTitel: string }) {
        await this.navigation.searchDossier(dossier);
        await this.rahmenbudgetPage.clickRahmenbudgetNavLink();
        await this.rahmenbudgetPage.clickCheckbox(spaltenName);
        await this.rahmenbudgetPage.checkColumnHeader(pruefenVisibleTitel);
    }
    async R05_GBL_Rahmenbudget_anpassen_Folgeposition({ dossier, klient, berGrundlage, geplantVon, gueltigBis, individuelleAnpa, begruendung, newTotal }: { dossier: string; klient: string; berGrundlage: string; geplantVon: string; gueltigBis: string; individuelleAnpa: string; begruendung: string; newTotal: string }) {
        await this.navigation.searchDossier(dossier);
        await this.rahmenbudgetPage.clickRahmenbudgetNavLink();
        await this.rahmenbudgetPage.openGrundbedarfLebensunterhaltEdit(klient);
        await this.rahmenbudgetPage.fillValueNeuePosition(berGrundlage, geplantVon, gueltigBis, individuelleAnpa, begruendung);
        await this.rahmenbudgetPage.checkNewTotal(newTotal, geplantVon, individuelleAnpa, berGrundlage);
    }
    async KL03c_ErwerbsituationEinnahmen_EffektiverLohn_erfassen({ dossier, klient, geplantVon, geplantBis, verwPeriode, betragEff, freiBetragEff }: { dossier: string; klient: string; geplantVon: string; geplantBis: string; verwPeriode: string; betragEff: string; freiBetragEff: string }) {
        await this.navigation.searchDossier(dossier);
        await this.rahmenbudgetPage.clickRahmenbudgetNavLink();
        await this.rahmenbudgetPage.openDropDownEinnahmen();
        await this.rahmenbudgetPage.openEditErwerbseinkommen(klient, geplantVon, geplantBis);
        await this.rahmenbudgetPage.fillValueErfassungEffektiverBetrage(verwPeriode, betragEff, freiBetragEff);
    }
    async R08_RahmenBudget_Rueckbehalt_erfassen({ dossier, titel, monatBetrag, startMonat, endMonat, beschreibung, documents }: { dossier: string; titel: string; monatBetrag: number; startMonat: string; endMonat: string; beschreibung: string; documents: string }) {
        await this.navigation.searchDossier(dossier);
        await this.navigation.openMenuNav();
        await this.rahmenbudgetPage.goToRuckbehalteTab();
        await this.rahmenbudgetPage.ruchbehalteErfassen(titel, monatBetrag, startMonat, endMonat, beschreibung, documents);
    }
    async BW03c_Bewilligungs_WF_FreigabeVerwendungsPeriode_mitDokumenten({ dossierKlient, verwendungPeriode, status, documents }: { dossierKlient: string; verwendungPeriode: string; status: string; documents: string }) {
        await this.navigation.searchDossier(dossierKlient);
        await this.navigation.openMenuNav();
        await this.rahmenbudgetPage.selectVerwendungsperiodeForC(verwendungPeriode, status, documents);
    }
}
