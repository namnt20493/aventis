import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import { BedarfsprufungKeyword } from "@keywords/bedarfsprufung-keyword";
import { BewilligungenKeywords } from "@keywords/bewilligungen-keywords";
import { RahmenbudgetKeyword } from "@keywords/rahmenbudget-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestUsers } from "@constants/credentials";
import { TestCompanies } from "@constants/testData";
import { PathHelper } from "@utils/helpers/pathHelper";

test(
    "BW03c_Bewilligungs_WF_FreigabeVerwendungsPeriode_mitDokumenten",
    {
        tag: ["@[182992]", "@bewilligung", "@keywordValidation", "@coreBusiness"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        test.slow();
        var commonKeyword = new CommonKeyword(page);
        var klientschaftKeyword = new KlientschaftKeyword(page);
        var bedarfsprufungKeyword = new BedarfsprufungKeyword(page);
        var bewilligungenKeywords = new BewilligungenKeywords(page);
        var rahmenbudgetKeyword = new RahmenbudgetKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        const documentPath = PathHelper.getDocumentPath("Bankverbindung.docx");

        const dossierGuid = await sharedTestLogic.generateDossierViaApi(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId, context);
        await sharedTestLogic.addZahlungsVerbindung(commonKeyword, page, klientschaftKeyword, uniqueDossiertId, context, testData.persons);

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierGuid);
        });

        await test.step("M01_LoginMSOnline - Sozialarbeiterin", async () => {
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
                begrundung: "Begründung für BW03c Test",
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

        await test.step("L03_LogoutAndLoginDiffAccount - Sachbearbeiterin", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

        await test.step("BW02b_Bewilligungs_Workflow_Step_V2 - Prüfung OK", async () => {
            await bewilligungenKeywords.BW02b_Bewilligungs_Workflow_Step_V2({
                dossier: uniqueDossiertId,
                buttonName: "Prüfung OK",
                checkEntscheid: "Geprüft"
            });
        });

        await test.step("L03_LogoutAndLoginDiffAccount - Gemeinde-MA", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.GEMEINDE_MA.username, TestUsers.GEMEINDE_MA.password);
        });

        await test.step("BW02b_Bewilligungs_Workflow_Step_V2 - Bewilligen", async () => {
            await bewilligungenKeywords.BW02b_Bewilligungs_Workflow_Step_V2({
                dossier: uniqueDossiertId,
                buttonName: "Bewilligen",
                checkEntscheid: ""
            });
        });

        await test.step("L03_LogoutAndLoginDiffAccount - Sachbearbeiterin", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierGuid);
        });

        await test.step("BW03c_Bewilligungs_WF_FreigabeVerwendungsPeriode_mitDokumenten", async () => {
            await rahmenbudgetKeyword.BW03c_Bewilligungs_WF_FreigabeVerwendungsPeriode_mitDokumenten({
                dossierKlient: uniqueDossiertId,
                verwendungPeriode: DateHelper.getMonthYearAsString(),
                status: "Unvollständig",
                documents: documentPath
            });
        });
    }
);
