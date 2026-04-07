import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { DocumentKeyword } from "@keywords/document-keyword";
import { TestUsers } from "@constants/credentials";
import { PathHelper } from "@utils/helpers/pathHelper";

test(
    "MAE01_MAE01b_Dokumenteingang_Upload_Loeschen",
    {
        tag: ["@[183082]", "@dokumente", "@keywordValidation"]
    },
    async ({ page, seed }) => {
        const commonKeyword = new CommonKeyword(page);
        const dokumenteKeyword = new DocumentKeyword(page);

        const bankverbindungPath = PathHelper.getDocumentPath("Bankverbindung.docx");
        const testDocPath = PathHelper.getDocumentPath("test.docx");
        await test.step("M01_LoginMSOnline - Sachbearbeiterin", async () => {
            await commonKeyword.Stable_Login(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

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

        await test.step("MAE01b_DokumenteLoeschen - Clean up after test", async () => {
            await dokumenteKeyword.MAE01b_DokumenteLoeschen({ all: "yes" });
        });
    }
);
