import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@keywords/common-keyword";
import { WSHKeyword } from "@keywords/wsh-keyword";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import { Wohnsituation } from "@keywords/wohnsituation-keyword";
import { BedarfsprufungKeyword } from "@keywords/bedarfsprufung-keyword";
import { BewilligungenKeywords } from "@keywords/bewilligungen-keywords";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestUsers } from "@constants/credentials";

test(
    "WSH05_Haftung_Sozialhilfeschuld_Bearbeiten",
    {
        tag: ["@[183093]", "@zahlungen", "@keywordValidation", "@coreBusiness"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var wshKeyword = new WSHKeyword(page);
        var klientschaftKeyword = new KlientschaftKeyword(page);
        var wohnsituation = new Wohnsituation(page);
        var bedarfsprufungKeyword = new BedarfsprufungKeyword(page);
        var bewilligungenKeywords = new BewilligungenKeywords(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        const dossierId = await sharedTestLogic.createDossierViaApiOnlyWithPaymentConnection(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId, true);

        await test.step("WO32_01b_Wohnsituation_Haushalt_Wohnung_anpassen", async () => {
            await wohnsituation.WO32_01b_Wohnsituation_Haushalt_Wohnung_anpassen({
                vermieter: "Graber Immobilien",
                wohnungsgrosse: "3.5",
                mietkosten: "1300",
                nebenkosten: "150"
            });
        });

        await test.step("KL01_Klientschaft_select", async () => {
            await klientschaftKeyword.KL01_Klientschaft_select({
                dossier: uniqueDossiertId,
                klientschaft: testData.persons.FIRST_PERSON.fullName
            });
        });

        await test.step("KL03_ErwerbsituationEinnahmen_Lohn_erfassen", async () => {
            await klientschaftKeyword.KL03_ErwerbsituationEinnahmen_Lohn_erfassen({
                zahlbarDurch: "BKW Energie AG",
                pensumm: "100",
                betrag: "1000",
                gueltigVon: DateHelper.getFirstOfMonthString(),
                gueltigBis: DateHelper.getLastDayOfYearString(),
                checkbox: "x",
                migration: ""
            });
        });

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierId);
        });

        await test.step("A01_AnspruchPruefung_Bedarfspruefung", async () => {
            await bedarfsprufungKeyword.A01_AnspruchPruefung_Bedarfspruefung({
                entscheidVom: DateHelper.getTodayDateString(),
                begrundung: "Begründung für Bedarfsprüfung",
                unterstutzungab: DateHelper.getFirstOfMonthString()
            });
        });

        await test.step("BW01_Bewilligungs_Workflow_LeistungsEntscheid", async () => {
            await bewilligungenKeywords.BW01_Bewilligungs_Workflow_LeistungsEntscheid({
                lEvonDate: DateHelper.getTodayDateString(),
                lEbisDate: DateHelper.getDaysFutureString(180),
                checkStatus: "In Bearbeitung"
            });
        });

        await test.step("L03_LogoutAndLoginDiffAccount - Sachbearbeiterin", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

        await test.step("GoTo_Dossier_With_Url - Sachbearbeiterin", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierId);
        });

        await test.step("BW02b_Bewilligungs_Workflow_Step_V2 - Prüfung OK", async () => {
            await bewilligungenKeywords.BW02b_Bewilligungs_Workflow_Step_V2({
                dossier: uniqueDossiertId,
                buttonName: "Prüfung OK",
                checkEntscheid: "-"
            });
        });

        await test.step("L03_LogoutAndLoginDiffAccount - Gemeinde MA", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.GEMEINDE_MA.username, TestUsers.GEMEINDE_MA.password);
        });

        await test.step("GoTo_Dossier_With_Url - Gemeinde MA", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierId);
        });

        await test.step("BW02b_Bewilligungs_Workflow_Step_V2 - Bewilligen", async () => {
            await bewilligungenKeywords.BW02b_Bewilligungs_Workflow_Step_V2({
                dossier: uniqueDossiertId,
                buttonName: "Bewilligen",
                checkEntscheid: "-"
            });
        });

        await test.step("L03_LogoutAndLoginDiffAccount - Sachbearbeiterin", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

        await test.step("GoTo_Dossier_With_Url - before WSH05", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierId);
        });

        await test.step("WSH05_Haftung_Sozialhilfeschuld_Bearbeiten - Einseitige Solidarhaftung", async () => {
            await wshKeyword.WSH05_Haftung_Sozialhilfeschuld_Bearbeiten({
                haftungsType: "Einseitige Solidarhaftung erfassen",
                haftungDurch: testData.persons.FIRST_PERSON.fullName,
                haftungVon: DateHelper.getFirstOfMonthString(),
                haftungBis: DateHelper.getLastDayOfYearString(),
                haftungFuer: testData.persons.SECOND_PERSON.fullName,
                person1: "",
                person2: ""
            });
        });

        await test.step("WSH05_Haftung_Sozialhilfeschuld_Bearbeiten - Einseitige Solidarhaftung", async () => {
            await wshKeyword.WSH05_Haftung_Sozialhilfeschuld_Bearbeiten({
                haftungsType: "Einzelhaftung erfassen",
                haftungDurch: testData.persons.FIRST_PERSON.fullName,
                haftungVon: DateHelper.getFirstOfMonthString(),
                haftungBis: DateHelper.getLastDayOfYearString(),
                haftungFuer: testData.persons.SECOND_PERSON.fullName,
                person1: "",
                person2: ""
            });
        });
    }
);
