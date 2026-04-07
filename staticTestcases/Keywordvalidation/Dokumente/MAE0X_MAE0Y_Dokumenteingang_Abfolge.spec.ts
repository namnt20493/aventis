import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { DocumentKeyword } from "@keywords/document-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestUsers } from "@constants/credentials";
import { PathHelper } from "@utils/helpers/pathHelper";

test(
    "MAE0X_MAE0Y_Dokumenteingang_Abfolge",
    {
        tag: ["@[183003]", "@dokumente", "@keywordValidation"]
    },
    async ({ page, seed, authenticatedRequest, testData }) => {
        const commonKeyword = new CommonKeyword(page);
        const dokumenteKeyword = new DocumentKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        const todayDate = DateHelper.getTodayDateString();

        const bankverbindungPath = PathHelper.getDocumentPath("Bankverbindung.docx");
        const testDocPath = PathHelper.getDocumentPath("test.docx");
        const journalPath = PathHelper.getDocumentPath("JournalEintrag.docx");
        await test.step("M01_LoginMSOnline - Sachbearbeiterin", async () => {
            await commonKeyword.Stable_Login(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

        await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);

        await test.step("MAE01b_DokumenteLoeschen - Clean up before test", async () => {
            await dokumenteKeyword.MAE01b_DokumenteLoeschen({ all: "yes" });
        });

        await test.step("MAE01_DokumenteingangUpload - Upload Bankverbindung", async () => {
            await dokumenteKeyword.MAE01_DokumenteingangUpload({
                sozialDienst: `Regionaler Sozialdienst "Bern"`,
                document: bankverbindungPath
            });
        });

        await test.step("MAE01_DokumenteingangUpload - Upload test.docx", async () => {
            await dokumenteKeyword.MAE01_DokumenteingangUpload({
                sozialDienst: `Regionaler Sozialdienst "Bern"`,
                document: testDocPath
            });
        });

        await test.step("MAE01_DokumenteingangUpload - Upload JournalEintrag", async () => {
            await dokumenteKeyword.MAE01_DokumenteingangUpload({
                sozialDienst: `Regionaler Sozialdienst "Bern"`,
                document: journalPath
            });
        });

        await test.step("MAE0X_Dokumenteingang_NachUpload_Zuweisen_AbfolgeStart", async () => {
            await dokumenteKeyword.MAE0X_Dokumenteingang_NachUpload_Zuweisen_AbfolgeStart({
                hinzugefuegtDurch: "Bern Sachbearbeiterin",
                docType: "",
                dateiName: "Bankverbindung.docx",
                datum: todayDate,
                docAblageort: "Diverse Dokumente",
                dossier: uniqueDossiertId,
                leistungHas: "",
                klient: testData.persons.FIRST_PERSON.fullName,
                docTitle: "Bankverbindung " + seed,
                newDocType: "Diverse Dokumente",
                thema: "Allgemein",
                rechnBetrag: "",
                verwendungsPeriode: "",
                status: ""
            });
        });

        await test.step("MAE0Y_Dokumenteingang_NachUpload_Zuweisen_AbfolgeNext - Document 2", async () => {
            await dokumenteKeyword.MAE0Y_Dokumenteingang_NachUpload_Zuweisen_AbfolgeNext({
                docAblageort: "Diverse Dokumente",
                dossier: uniqueDossiertId,
                leistungHas: "",
                klient: testData.persons.FIRST_PERSON.fullName,
                docTitle: "JournalEintrag " + seed,
                newDocType: "Diverse Dokumente",
                thema: "Allgemein",
                rechnBetrag: "",
                verwendungsPeriode: "",
                status: ""
            });
        });

        await test.step("MAE0Y_Dokumenteingang_NachUpload_Zuweisen_AbfolgeNext - Document 3", async () => {
            await dokumenteKeyword.MAE0Y_Dokumenteingang_NachUpload_Zuweisen_AbfolgeNext({
                docAblageort: "Diverse Dokumente",
                dossier: uniqueDossiertId,
                leistungHas: "",
                klient: testData.persons.FIRST_PERSON.fullName,
                docTitle: "test " + seed,
                newDocType: "Diverse Dokumente",
                thema: "Allgemein",
                rechnBetrag: "",
                verwendungsPeriode: "",
                status: ""
            });
        });
    }
);
