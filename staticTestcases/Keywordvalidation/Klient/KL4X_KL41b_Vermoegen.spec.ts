import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@keywords/common-keyword";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestUsers } from "@constants/credentials";
import { PathHelper } from "@utils/helpers/pathHelper";

test(
    "KL4X_KL41b_Vermoegen_erfassen",
    {
        tag: ["@[182994]", "@klient", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var klientschaftKeyword = new KlientschaftKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        const stichtag = DateHelper.getTodayDateString();
        const documentPath = PathHelper.getDocumentPath("test.docx");
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);

        await test.step("KL01_Klientschaft_select", async () => {
            await klientschaftKeyword.KL01_Klientschaft_select({
                dossier: uniqueDossiertId,
                klientschaft: testData.persons.FIRST_PERSON.fullName
            });
        });

        await test.step("KL4X_Vermoegen_erfassen_Auto", async () => {
            await klientschaftKeyword.KL4X_Vermoegen_erfassen({
                vermogenType: "Auto",
                bezeichnung: "Ferrari F40",
                stichtag: stichtag,
                betrag: "4000",
                glaeubiger: "",
                maximalGrund: ""
            });
        });

        await test.step("KL4X_Vermoegen_erfassen_Eigenheim", async () => {
            await klientschaftKeyword.KL4X_Vermoegen_erfassen({
                vermogenType: "Eigenheim",
                bezeichnung: "Villa am See",
                stichtag: stichtag,
                betrag: "233000",
                glaeubiger: "Bank o Blitz",
                maximalGrund: "200000"
            });
        });

        await test.step("KL4X_Vermoegen_erfassen_Konto", async () => {
            await klientschaftKeyword.KL4X_Vermoegen_erfassen({
                vermogenType: "Konto",
                bezeichnung: "Sparkonto",
                stichtag: stichtag,
                betrag: "4000",
                glaeubiger: "",
                maximalGrund: ""
            });
        });

        await test.step("KL41b_Vermoegen_Eigenheim_erfassen_doc", async () => {
            await klientschaftKeyword.KL41b_Vermoegen_Eigenheim_erfassen_doc({
                bezeichnung: "Ferienhaus mit Dokument",
                stichtag: stichtag,
                betrag: "500000",
                glaeubiger: "Hypothekarbank",
                maximalGrund: "300000",
                divDoc: documentPath
            });
        });
    }
);
