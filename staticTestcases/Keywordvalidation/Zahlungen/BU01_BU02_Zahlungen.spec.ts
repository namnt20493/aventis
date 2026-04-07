import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { BuchhaltungKeyword } from "@keywords/buchhaltung-keyword";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import { BedarfsprufungKeyword } from "@keywords/bedarfsprufung-keyword";
import { BewilligungenKeywords } from "@keywords/bewilligungen-keywords";
import { ZahlungenKeyword } from "@keywords/zahlungen-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestCompanies } from "@constants/testData";
import { TestUsers } from "@constants/credentials";

test(
    "BU01_BU02_ZahlungsAuftrag_Erstellen",
    {
        annotation: { type: "known-bug", description: "https://diartis.visualstudio.com/Aventis/_workitems/edit/184290" },
        tag: ["@[183092]", "@zahlungen", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        test.skip(true, "Known Bug #184290: Performance issues in Bedarfsprüfung workflow causing test instability");
        test.slow();
        var commonKeyword = new CommonKeyword(page);
        var buchhaltungKeyword = new BuchhaltungKeyword(page);
        var klientschaftKeyword = new KlientschaftKeyword(page);
        var bedarfsprufungKeyword = new BedarfsprufungKeyword(page);
        var bewilligungenKeywords = new BewilligungenKeywords(page);
        var zahlungenKeyword = new ZahlungenKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);

        // === SETUP: Create dossier with complete payment workflow ===
        const dossierGuid = await sharedTestLogic.generateDossierViaApi(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId, context);

        await sharedTestLogic.addZahlungsVerbindung(commonKeyword, page, klientschaftKeyword, uniqueDossiertId, context, testData.persons);

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
                begrundung: "Test BU01 Keyword",
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

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierGuid);
        });

        await test.step("Z01_WSH_Zahlungen_Freigeben_NoCheck", async () => {
            await zahlungenKeyword.Z01_WSH_Zahlungen_Freigeben_NoCheck({
                dossierInstitution: uniqueDossiertId
            });
        });

        // === KEYWORD TEST: BU01 ===
        await test.step("L03_LogoutAndLoginDiffAccount - Buchhalter", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.BUCHHALTER.username, TestUsers.BUCHHALTER.password);
        });

        await test.step("BU01_ZahlungsAuftrag_Erstellen", async () => {
            await buchhaltungKeyword.BU01_ZahlungsAuftrag_Erstellen({
                bisValutaDatum: DateHelper.getLastDayOfYearString(),
                dossier: uniqueDossiertId,
                checkZahlungTotal: "",
                buchhaltung: "",
                zustGemeinde: ""
            });
        });

        // Switch to Sozialarbeiterin for BU02 (Buchhalter doesn't have read access to view Sozialhilfeschuld for this dossier)
        await test.step("L03_LogoutAndLoginDiffAccount - Sozialarbeiterin for BU02", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await test.step("BU02_Klient_SozialhilfeSchuld_anzeigen", async () => {
            await buchhaltungKeyword.BU02_Klient_SozialhilfeSchuld_anzeigen({
                klient: testData.persons.FIRST_PERSON.fullName,
                dossier: uniqueDossiertId,
                stichDatum: DateHelper.getLastDayOfYearString(),
                zeilenTotal: "CHF 0.00"
            });
        });
    }
);
