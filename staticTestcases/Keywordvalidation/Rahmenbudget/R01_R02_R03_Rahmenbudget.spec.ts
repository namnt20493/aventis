import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { RahmenbudgetKeyword } from "@keywords/rahmenbudget-keyword";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import { BedarfsprufungKeyword } from "@keywords/bedarfsprufung-keyword";
import { BewilligungenKeywords } from "@keywords/bewilligungen-keywords";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { TestUsers } from "@constants/credentials";
import * as DateHelper from "@utils/helpers/DateHelper";
import { createErwerbssituationViaApi } from "@utils/apiSetup";
import { generateDossierWithErwerbssituationAndWsh } from "@libs/workflows/guiDossierWorkflow";
import { Wohnsituation } from "@libs/keywords/wohnsituation-keyword";

test(
    "R01_R02_R03_Rahmenbudget",
    {
        tag: ["@[182219]", "@rahmenbudget", "@keywordValidation", "@perfMonitoring"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        const commonKeyword = new CommonKeyword(page);
        const rahmenbudgetKeyword = new RahmenbudgetKeyword(page);
        const klientschaftKeyword = new KlientschaftKeyword(page);
        const wohnsituationKeyword = new Wohnsituation(page);
        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);

        // Call the exported workflow function
        const dossierResult = await generateDossierWithErwerbssituationAndWsh(authenticatedRequest, commonKeyword, page, klientschaftKeyword, seed, uniqueDossiertId, context);

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierResult.dossierId);
        });

        await test.step("WO32_01b_Wohnsituation_Haushalt_Wohnung_anpassen", async () => {
            await wohnsituationKeyword.WO32_01b_Wohnsituation_Haushalt_Wohnung_anpassen({
                vermieter: "Graber Immobilien",
                wohnungsgrosse: "3.5",
                mietkosten: "1800",
                nebenkosten: "150"
            });
        });

        // R01: Wohnkosten anpassen
        await test.step("R01_Rahmenbudget_Wohnkosten_Anpassen", async () => {
            await rahmenbudgetKeyword.rahmenbudgetPage.clickRahNav();
            await rahmenbudgetKeyword.R01_Rahmenbudget_Wohnkosten_Anpassen_V2({
                ubernahmeWohnkostenCFH: 1300,
                uebernahmeWohnkostenVon: DateHelper.getTodayDateString(),
                uebernahmeWohnkostenBis: DateHelper.getTodayWithFutureYearString(),
                uebernahemBegruendung: "Testbegründung"
            });
        });

        // R02: Zahlungsinfos anpassen
        await test.step("R02_Rahmenbudget_ZahlungsInfosAnpassen", async () => {
            await rahmenbudgetKeyword.R02_Rahmenbudget_ZahlungsInfosAnpassen({
                zahlungsEmpfaengerCheck: testData.persons.FIRST_PERSON.fullName,
                gueltigMonatJahr: DateHelper.getFirstMonthAndYearFromFutureYear(),
                zahlungsEmpfaenger: "Barauszahlung",
                periodizitaet: "Monatlich",
                referenzNummer: "",
                mitteilung: "Testzahlung"
            });
        });

        // R03: Kennzahlen prüfen
        await test.step("R03_RahmenBudget_Kennzahlen_pruefen", async () => {
            await rahmenbudgetKeyword.R03_RahmenBudget_Kennzahlen_pruefen({
                dossier: uniqueDossiertId,
                unterstBetrag: "2947.00",
                valutaTerminNext: "",
                valutaDatum: ""
            });
        });

        // await test.step("R13_RahmenBudget_Darstellung_Pruefen", async () => {
        //     await rahmenbudgetKeyword.R13_RahmenBudget_Darstellung_Pruefen({
        //         dossier: uniqueDossiertId,
        //         checkColTitle: "Beschreibung, Zahlungsempfänger/in, Bewilligung, Betrag",
        //         checkTotalAusgaben: 2947,
        //         checkTotalEinnahmen: 0,
        //         checkTotalUnterstutzungsbetrag: 2947,
        //         checkRowTitle: "Grundbedarf Lebensunterhalt, Wohnkosten, Medizinische Grundversorgung"
        //     });
        // });

        // await test.step("GoTo_Dossier_With_Url", async () => {
        //     await commonKeyword.GoTo_Dossier_With_Url(dossierResult.dossierId);
        // });

        // // KL03c: Effektiver Lohn erfassen
        // await test.step("KL03c_ErwerbsituationEinnahmen_EffektiverLohn_erfassen", async () => {
        //     await rahmenbudgetKeyword.KL03c_ErwerbsituationEinnahmen_EffektiverLohn_erfassen({
        //         dossier: uniqueDossiertId,
        //         klient: testData.persons.FIRST_PERSON.fullName,
        //         geplantVon: DateHelper.getTodayDateString(),
        //         geplantBis: DateHelper.getTodayWithFutureYearString(),
        //         verwPeriode: DateHelper.getFirstMonthAndYearFromFutureYear(),
        //         betragEff: "1000",
        //         freiBetragEff: "200"
        //     });
        // });
    }
);
