import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { Wohnsituation } from "@keywords/wohnsituation-keyword";
import { RahmenbudgetKeyword } from "@keywords/rahmenbudget-keyword";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import { BedarfsprufungKeyword } from "@keywords/bedarfsprufung-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestCompanies } from "@constants/testData";

test(
    "DW01_DW02_Wohnsituation",
    {
        tag: ["@[183287]", "@wohnsituation", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var wohnsituationKeyword = new Wohnsituation(page);
        var rahmenbudgetKeyword = new RahmenbudgetKeyword(page);
        var klientschaftKeyword = new KlientschaftKeyword(page);
        var bedarfsprufungKeyword = new BedarfsprufungKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);

        // === SETUP: Create dossier (already logs in as SOZIALARBEITERIN_1A) ===
        const dossierGuid = await sharedTestLogic.generateDossierViaApi(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId, context);

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierGuid);
        });

        await test.step("KL01_Klientschaft_select", async () => {
            await klientschaftKeyword.KL01_Klientschaft_select({
                dossier: uniqueDossiertId,
                klientschaft: testData.persons.FIRST_PERSON.fullName
            });
        });

        // === Setup Wohnsituation (required before DW01/DW02) ===
        await test.step("WO32_01b_Wohnsituation_Haushalt_Wohnung_anpassen", async () => {
            await wohnsituationKeyword.WO32_01b_Wohnsituation_Haushalt_Wohnung_anpassen({
                vermieter: TestCompanies.GRABER_IMMOBILIEN,
                wohnungsgrosse: "3.5",
                mietkosten: "1300",
                nebenkosten: "150"
            });
        });

        // === KEYWORD TEST: DW01 - Dossier Haushalt prüfen ===
        await test.step("DW01_Dossier_Haushalt_pruefen", async () => {
            await wohnsituationKeyword.DW01_Dossier_Haushalt_pruefen({
                dossier: uniqueDossiertId,
                zimmerWohnungTitel: "3.5-Zimmer-Wohnung",
                strasseAdresse: "",
                Wohnkosten: 1450,
                beWohnerContains: testData.persons.FIRST_PERSON.fullName,
                gueltigAb: ""
            });
        });

        // Navigate back to dossier before A01 (DW01 leaves us on Wohnsituation page)
        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierGuid);
        });

        await test.step("KL01_Klientschaft_select", async () => {
            await klientschaftKeyword.KL01_Klientschaft_select({
                dossier: uniqueDossiertId,
                klientschaft: testData.persons.FIRST_PERSON.fullName
            });
        });

        // A01: Create WSH/Bedarfsprüfung (required for Rahmenbudget)
        await test.step("A01_AnspruchPruefung_Bedarfspruefung", async () => {
            await bedarfsprufungKeyword.A01_AnspruchPruefung_Bedarfspruefung({
                entscheidVom: DateHelper.getTodayDateString(),
                begrundung: "Test DW02 Rahmenbudget",
                unterstutzungab: DateHelper.getFirstOfMonthString()
            });
        });

        // === KEYWORD TEST: DW02 - Rahmenbudget Wohnkosten prüfen ===
        // Note: System caps housing costs at guideline (650 CHF for 1 person household)
        // Total = actual costs (1300+150=1450), other values = capped at 650
        await test.step("DW02_Rahmenbudget_Wohnkosten_pruefen", async () => {
            await rahmenbudgetKeyword.DW02_Rahmenbudget_Wohnkosten_pruefen({
                dossier: uniqueDossiertId,
                firstLevelBetrag: 650,
                wohnKostenGemAnspruch: 650,
                uebernommeneWohnkosten: 650,
                totalWohnkosten: 1450
            });
        });
    }
);
