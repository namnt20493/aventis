import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { DocumentKeyword } from "@keywords/document-keyword";
import { BedarfsprufungKeyword } from "@keywords/bedarfsprufung-keyword";
import { BewilligungenKeywords } from "@keywords/bewilligungen-keywords";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestUsers } from "@constants/credentials";
import { PathHelper } from "@utils/helpers/pathHelper";

test(
    "MAE02_Dokumenteingang_NachUpload_Zuweisen_Freigabe",
    {
        tag: ["@[183008]", "@dokumente", "@keywordValidation"]
    },
    async ({ page, seed, authenticatedRequest, testData }) => {
        const commonKeyword = new CommonKeyword(page);
        const dokumenteKeyword = new DocumentKeyword(page);
        const bedarfsprufungKeyword = new BedarfsprufungKeyword(page);
        const bewilligungenKeywords = new BewilligungenKeywords(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        const todayDate = DateHelper.getTodayDateString();
        const firstOfMonth = DateHelper.getFirstOfMonthString();
        const currentMonthYear = DateHelper.getMonthYearAsString(0);

        const freigabePath = PathHelper.getDocumentPath("test.docx");
        await test.step("M01_LoginMSOnline - Sachbearbeiterin", async () => {
            await commonKeyword.Stable_Login(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

        await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);

        await test.step("A01_AnspruchPruefung_Bedarfspruefung", async () => {
            await bedarfsprufungKeyword.A01_AnspruchPruefung_Bedarfspruefung({
                entscheidVom: todayDate,
                begrundung: "Test Bedarfsprüfung",
                unterstutzungab: firstOfMonth
            });
        });

        await test.step("BW01_Bewilligungs_Workflow_LeistungsEntscheid", async () => {
            await bewilligungenKeywords.BW01_Bewilligungs_Workflow_LeistungsEntscheid({
                lEvonDate: todayDate,
                lEbisDate: DateHelper.getDaysFutureString(365),
                checkStatus: "In Bearbeitung"
            });
        });

        await test.step("L03_LogoutAndLoginDiffAccount - Sozialarbeiterin", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await test.step("BW02b_Bewilligungs_Workflow_Step_V2 - Prüfung OK", async () => {
            await bewilligungenKeywords.BW02b_Bewilligungs_Workflow_Step_V2({
                dossier: uniqueDossiertId,
                buttonName: "Prüfung OK",
                checkEntscheid: "Geprüft"
            });
        });

        await test.step("L03_LogoutAndLoginDiffAccount - Gemeinde MA", async () => {
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

        await test.step("MAE01b_DokumenteLoeschen - Clean up", async () => {
            await dokumenteKeyword.MAE01b_DokumenteLoeschen({ all: "yes" });
        });

        await test.step("MAE01_DokumenteingangUpload - Upload Freigabe Document", async () => {
            await dokumenteKeyword.MAE01_DokumenteingangUpload({
                sozialDienst: `Regionaler Sozialdienst "Bern"`,
                document: freigabePath
            });
        });

        await test.step("MAE02_Dokumenteingang_NachUpload_Zuweisen_Freigabe", async () => {
            await dokumenteKeyword.MAE02_Dokumenteingang_NachUpload_Zuweisen_Freigabe({
                hinzugefuegtDurch: "Bern Sachbearbeiterin",
                docType: "",
                dateiName: "test.docx",
                datum: todayDate,
                newDocType: "Freigabe Verwendungsperiode",
                dossier: uniqueDossiertId,
                leistung: "WSH",
                klient: "",
                docTitle: "Freigabe " + seed,
                thema: "",
                verwendungsPeriode: currentMonthYear,
                status: "Einzureichen"
            });
        });
    }
);
