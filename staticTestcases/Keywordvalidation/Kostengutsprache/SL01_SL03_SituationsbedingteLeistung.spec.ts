import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { RahmenbudgetKeyword } from "@keywords/rahmenbudget-keyword";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { TestCompanies } from "@constants/testData";
import * as DateHelper from "@utils/helpers/DateHelper";
import { generateDossierWithErwerbssituationAndWsh } from "@libs/workflows/guiDossierWorkflow";
import { Wohnsituation } from "@libs/keywords/wohnsituation-keyword";

test(
    "SL01_SL03_SituationsbedingteLeistung",
    {
        tag: ["@[183011]", "@kostengutsprache", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        const commonKeyword = new CommonKeyword(page);
        const rahmenbudgetKeyword = new RahmenbudgetKeyword(page);
        const klientschaftKeyword = new KlientschaftKeyword(page);
        const wohnsituationKeyword = new Wohnsituation(page);
        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);

        const dossierResult = await generateDossierWithErwerbssituationAndWsh(authenticatedRequest, commonKeyword, page, klientschaftKeyword, seed, uniqueDossiertId, context);

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierResult.dossierId);
        });

        await test.step("WO32_01b_Wohnsituation_Haushalt_Wohnung_anpassen", async () => {
            await wohnsituationKeyword.WO32_01b_Wohnsituation_Haushalt_Wohnung_anpassen({
                vermieter: TestCompanies.GRABER_IMMOBILIEN,
                wohnungsgrosse: "3.5",
                mietkosten: "1800",
                nebenkosten: "150"
            });
        });

        await test.step("SL01_SituationsbedingteLeistung_erfassen", async () => {
            await rahmenbudgetKeyword.SL01_SituationsbedingteLeistung_erfassen({
                klient: testData.persons.FIRST_PERSON.fullName,
                kontonummer: 3410.99,
                bezeichnung: "KVG überhöhter Anteil",
                leistungserbringer: "Zahnarzpraxis Zentrum",
                value: 120,
                datumVon: DateHelper.getFirstOfMonthString(),
                datumBis: DateHelper.getLastDayOfYearString()
            });
        });

        await test.step("SL01_SituationsbedingteLeistung_erfassen_Zweite", async () => {
            await rahmenbudgetKeyword.SL01_SituationsbedingteLeistung_erfassen({
                klient: testData.persons.FIRST_PERSON.fullName,
                kontonummer: 3510.2,
                bezeichnung: "Zusatzversicherung VVG",
                leistungserbringer: TestCompanies.AGRISANO,
                value: 30,
                datumVon: DateHelper.getFirstOfMonthString(),
                datumBis: DateHelper.getLastDayOfYearString()
            });
        });

        await test.step("GoTo_Dossier_After_SL01", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierResult.dossierId);
        });

        await test.step("SL03_SituationsbedingteLeistung_imRahmenbudget_Anzeigen", async () => {
            await rahmenbudgetKeyword.SL03_SituationsbedingteLeistung_imRahmenbudget_Anzeigen({
                dossier: uniqueDossiertId,
                category: "Grundversorgende SIL",
                element: "KVG überhöhter Anteil",
                leistungsErbringer: "Zahnarzpraxis Zentrum",
                betragMonatlich: "120.00",
                geplantVon: DateHelper.getFirstOfMonthString(),
                geplantBis: ""
            });
        });
    }
);
