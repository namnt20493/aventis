/**
 * WIP Test: MAE10_Zahlungen_freigeben and Z01b_WSH_Zahlungen_Freigeben_meinAventis
 *
 * KNOWN LIMITATION:
 * These keywords require the dossier to appear in the GLOBAL "Zahlungen freigeben" view.
 * Freshly created dossiers do NOT appear in this view immediately because:
 * 1. The global view shows all dossiers across the system with payments to release
 * 2. It appears to be filtered/cached and doesn't include newly created dossiers
 * 3. Legacy tests used pre-existing dossiers that were already in the system
 *
 * WORKAROUND OPTIONS:
 * 1. Use an existing dossier from the global view (not reliable for automated tests)
 * 2. Wait for backend indexing/caching to include new dossiers (timing uncertain)
 * 3. Use Z01_WSH_Zahlungen_Freigeben which works at dossier level (RECOMMENDED)
 *
 * ALTERNATIVE KEYWORDS THAT WORK:
 * - Z01_WSH_Zahlungen_Freigeben: Releases payments from within the dossier's Zahlungen tab
 * - Z01_WSH_Zahlungen_Freigeben_NoCheck: Same as above without verification
 *
 * These work because they navigate to the specific dossier first, then access Zahlungen.
 */

import { test } from "@libs/test-fixtures";

import { CommonKeyword } from "@libs/keywords";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import { BedarfsprufungKeyword } from "@keywords/bedarfsprufung-keyword";
import { BewilligungenKeywords } from "@keywords/bewilligungen-keywords";
import { ZahlungenKeyword } from "@keywords/zahlungen-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestUsers } from "@constants/credentials";
import { TestCompanies } from "@constants/testData";

test.skip(
    "MAE10_Z01b_Zahlungen_GlobalView - WIP",
    {
        tag: ["@keywordValidation", "@wip"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        test.slow();
        var commonKeyword = new CommonKeyword(page);
        var klientschaftKeyword = new KlientschaftKeyword(page);
        var bedarfsprufungKeyword = new BedarfsprufungKeyword(page);
        var bewilligungenKeywords = new BewilligungenKeywords(page);
        var zahlungenKeyword = new ZahlungenKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);

        // Create dossier with full workflow for payment testing
        const dossierGuid = await sharedTestLogic.generateDossierViaApi(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId, context);
        await sharedTestLogic.addZahlungsVerbindung(commonKeyword, page, klientschaftKeyword, uniqueDossiertId, context, testData.persons);

        // Switch to Sozialarbeiterin for setup
        await test.step("L03_LogoutAndLoginDiffAccount - Sozialarbeiterin", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierGuid);
        });

        await test.step("KL01_Klientschaft_select", async () => {
            await klientschaftKeyword.KL01_Klientschaft_select({
                dossier: uniqueDossiertId,
                klientschaft: testData.persons.FIRST_PERSON.fullName
            });
        });

        await test.step("KL03_ErwerbsituationEinnahmen_Lohn_erfassen", async () => {
            await klientschaftKeyword.KL03_ErwerbsituationEinnahmen_Lohn_erfassen({
                zahlbarDurch: TestCompanies.BKW,
                pensumm: "100",
                betrag: "1000",
                gueltigVon: DateHelper.getFirstDayOfTheYearString(),
                gueltigBis: DateHelper.getLastDayOfYearString(),
                checkbox: "x",
                migration: "x"
            });
        });

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierGuid);
        });

        await test.step("KL01_Klientschaft_select", async () => {
            await klientschaftKeyword.KL01_Klientschaft_select({
                dossier: uniqueDossiertId,
                klientschaft: testData.persons.FIRST_PERSON.fullName
            });
        });

        await test.step("A01_AnspruchPruefung_Bedarfspruefung", async () => {
            await bedarfsprufungKeyword.A01_AnspruchPruefung_Bedarfspruefung({
                entscheidVom: DateHelper.getTodayDateString(),
                begrundung: "Test Global Zahlungen View",
                unterstutzungab: DateHelper.getFirstOfMonthString()
            });
        });

        await test.step("BW01_Bewilligungs_Workflow_LeistungsEntscheid", async () => {
            await bewilligungenKeywords.BW01_Bewilligungs_Workflow_LeistungsEntscheid({
                lEvonDate: DateHelper.getTodayDateString(),
                lEbisDate: DateHelper.getTodayWithFutureYearString(),
                checkStatus: "In Bearbeitung"
            });
        });

        // Sachbearbeiterin: Prüfung OK
        await test.step("L03_LogoutAndLoginDiffAccount - Sachbearbeiterin", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

        await test.step("BW02b_Bewilligungs_Workflow_Step_V2", async () => {
            await bewilligungenKeywords.BW02b_Bewilligungs_Workflow_Step_V2({
                dossier: uniqueDossiertId,
                buttonName: "Prüfung OK",
                checkEntscheid: "Geprüft"
            });
        });

        // Gemeinde-MA: Bewilligen
        await test.step("L03_LogoutAndLoginDiffAccount - Gemeinde-MA", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.GEMEINDE_MA.username, TestUsers.GEMEINDE_MA.password);
        });

        await test.step("BW02b_Bewilligungs_Workflow_Step_V2", async () => {
            await bewilligungenKeywords.BW02b_Bewilligungs_Workflow_Step_V2({
                dossier: uniqueDossiertId,
                buttonName: "Bewilligen",
                checkEntscheid: ""
            });
        });

        // Sachbearbeiterin: Verwendungsperiode freigeben
        await test.step("L03_LogoutAndLoginDiffAccount - Sachbearbeiterin", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierGuid);
        });

        await test.step("BW03b_Bewilligungs_WF_FreigabeVerwendungsPeriode", async () => {
            await bewilligungenKeywords.BW03b_Bewilligungs_WF_FreigabeVerwendungsPeriode({
                verwendungPeriode: `${DateHelper.getMonthYearAsString()},${DateHelper.getMonthYearAsString(0)},${DateHelper.getMonthYearAsString(1)}`,
                status: "Zu bezahlen"
            });
        });

        // === KEYWORD TEST: MAE10_Zahlungen_freigeben ===
        // This will likely FAIL because the dossier doesn't appear in the global Übersicht Dossiers view
        await test.step("MAE10_Zahlungen_freigeben", async () => {
            await zahlungenKeyword.MAE10_Zahlungen_freigeben({
                freigeben: "Zahlungen freigeben",
                dossier: uniqueDossiertId
            });
        });

        // === KEYWORD TEST: Z01b_WSH_Zahlungen_Freigeben_meinAventis ===
        // Switch to Sozialarbeiterin for meinAventis view
        await test.step("L03_LogoutAndLoginDiffAccount - Sozialarbeiterin", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await test.step("Z01b_WSH_Zahlungen_Freigeben_meinAventis", async () => {
            // This will likely FAIL because the dossier doesn't appear in the global Zahlungen view
            await zahlungenKeyword.Z01b_WSH_Zahlungen_Freigeben_meinAventis({
                dossier: uniqueDossiertId,
                totalbetrag: 0
            });
        });
    }
);
