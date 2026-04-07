import { test } from "@libs/test-fixtures";

import { CommonKeyword } from "@libs/keywords";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import { BedarfsprufungKeyword } from "@keywords/bedarfsprufung-keyword";
import { BewilligungenKeywords } from "@keywords/bewilligungen-keywords";
import { ZahlungenKeyword } from "@keywords/zahlungen-keyword";
import { BuchhaltungKeyword } from "@keywords/buchhaltung-keyword";
import { BuchungsJournalKeyword } from "@keywords/buchungsJournal-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestUsers } from "@constants/credentials";
import { TestCompanies } from "@constants/testData";

test(
    "a02b091011_Bedarfspruefung",
    {
        annotation: { type: "known-bug", description: "https://diartis.visualstudio.com/Aventis/_workitems/edit/184290" },
        tag: ["@[181260]", "@bedarfspruefung", "@keywordValidation", "@coreBusiness", "@perfMonitoring"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        test.skip(true, "Known Bug #184290: Performance issues in Bedarfsprüfung workflow causing test instability");
        test.slow();
        var commonKeyword = new CommonKeyword(page);
        var klientschaftKeyword = new KlientschaftKeyword(page);
        var bedarfsprufungKeyword = new BedarfsprufungKeyword(page);
        var bewilligungenKeywords = new BewilligungenKeywords(page);
        var zahlungenKeyword = new ZahlungenKeyword(page);
        var buchhaltungKeyword = new BuchhaltungKeyword(page);
        var buchungsJournalKeyword = new BuchungsJournalKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        const dossierGuid = await sharedTestLogic.generateDossierViaApi(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId, context);
        await sharedTestLogic.addZahlungsVerbindung(commonKeyword, page, klientschaftKeyword, uniqueDossiertId, context, testData.persons);

        //a02 - Wohnsituation setup (as SOZIALARBEITERIN_1A who created the dossier)
        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierGuid);
        });

        //b09 - Switch to SOZIALARBEITERIN_1A for Bedarfsprüfung and workflow
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await test.step("KL01_Klientschaft_select", async () => {
            await klientschaftKeyword.KL01_Klientschaft_select({
                dossier: uniqueDossiertId,
                klientschaft: testData.persons.FIRST_PERSON.fullName
            });
        });

        await test.step("KL03_ErwerbsituationEinnahmen_Lohn_erfassen", async function erfasseLohnEinnahmen() {
            const gueltigVon = DateHelper.getFirstDayOfTheYearString();
            const gueltigBis = DateHelper.getLastDayOfYearString();

            const lohnEinnahmen = {
                zahlbarDurch: TestCompanies.BKW,
                pensumm: "100",
                betrag: "1000",
                gueltigVon,
                gueltigBis,
                checkbox: "x",
                migration: "x"
            };

            await klientschaftKeyword.KL03_ErwerbsituationEinnahmen_Lohn_erfassen(lohnEinnahmen);
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
                begrundung: "Gar keine Begründung",
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

        await test.step("L03_LogoutAndLoginDiffAccount", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

        await test.step("BW02b_Bewilligungs_Workflow_Step_V2", async () => {
            await bewilligungenKeywords.BW02b_Bewilligungs_Workflow_Step_V2({
                dossier: uniqueDossiertId,
                buttonName: "Prüfung OK",
                checkEntscheid: "Geprüft"
            });
        });

        await test.step("L03_LogoutAndLoginDiffAccount", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.GEMEINDE_MA.username, TestUsers.GEMEINDE_MA.password);
        });

        await test.step("BW02b_Bewilligungs_Workflow_Step_V2", async () => {
            await bewilligungenKeywords.BW02b_Bewilligungs_Workflow_Step_V2({
                dossier: uniqueDossiertId,
                buttonName: "Bewilligen",
                checkEntscheid: ""
            });
        });

        await test.step("L03_LogoutAndLoginDiffAccount", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierGuid);
        });

        await test.step("BW03b_Bewilligungs_WF_FreigabeVerwendungsPeriode", async () => {
            await bewilligungenKeywords.BW03b_Bewilligungs_WF_FreigabeVerwendungsPeriode({
                verwendungPeriode: `${DateHelper.getMonthYearAsString()},${DateHelper.getMonthYearAsString(0)},${DateHelper.getMonthYearAsString(1)},${DateHelper.getMonthYearAsString(2)},${DateHelper.getMonthYearAsString(3)},${DateHelper.getMonthYearAsString(4)},${DateHelper.getMonthYearAsString(5)}`,
                status: "Zu bezahlen"
            });
        });

        //b11

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierGuid);
        });

        await test.step("Z01_WSH_Zahlungen_Freigeben", async () => {
            await zahlungenKeyword.Z01_WSH_Zahlungen_Freigeben_NoCheck({
                dossierInstitution: uniqueDossiertId
            });
        });

        await test.step("L03_LogoutAndLoginDiffAccount", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.BUCHHALTER.username, TestUsers.BUCHHALTER.password);
        });

        await test.step("BU01_ZahlungsAuftrag_Erstellen", async () => {
            await buchhaltungKeyword.BU01_ZahlungsAuftrag_Erstellen({
                bisValutaDatum: DateHelper.getLastDayOfYearString(),
                dossier: uniqueDossiertId,
                checkZahlungTotal: "",
                buchhaltung: "Regionaler Sozialdienst",
                zustGemeinde: "Moosseedorf"
            });
        });
    }
);
