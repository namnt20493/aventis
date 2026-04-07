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
    "SL02_SituationsbedingteLeistung_anpassen",
    {
        tag: ["@[184222]", "@rahmenbudget", "@keywordValidation"]
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

        const datumVon = DateHelper.getFirstOfMonthString();
        const datumBis = DateHelper.getLastDayOfYearString();
        const bezeichnung = "KVG überhöhter Anteil";
        const betragOriginal = 120;

        await test.step("SL01_SituationsbedingteLeistung_erfassen", async () => {
            await rahmenbudgetKeyword.SL01_SituationsbedingteLeistung_erfassen({
                klient: testData.persons.FIRST_PERSON.fullName,
                kontonummer: 3410.99,
                bezeichnung: bezeichnung,
                leistungserbringer: "Zahnarzpraxis Zentrum",
                value: betragOriginal,
                datumVon: datumVon,
                datumBis: datumBis
            });
        });

        const geplantVonNeu = DateHelper.getDaysFutureString(7);
        const geplantBisNeu = DateHelper.getLastDayOfYearString();
        const betragNeu = 400;

        await test.step("SL02_SituationsbedingteLeistung_anpassen", async () => {
            await rahmenbudgetKeyword.SL02_SituationsbedingteLeistung_anpassen({
                bezeichnung: bezeichnung,
                betrifft: testData.persons.FIRST_PERSON.fullName,
                geplantVon: datumVon,
                geplantVonNeu: geplantVonNeu,
                geplantBis: geplantBisNeu,
                betragNeu: betragNeu
            });
        });
    }
);
