import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { TestUsers } from "@constants/credentials";
import { getTodayDateString } from "@utils/helpers/DateHelper";

test(
    "KL40_KL50_Vermoegen_Schulden",
    {
        tag: ["@[182214]", "@klient", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var klientschaftKeyword = new KlientschaftKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
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

        await test.step("KL40_Vermoegen_Konto_erfassen", async () => {
            await klientschaftKeyword.KL40_Vermoegen_Konto_erfassen({
                bezeichnung: "Sparkonto",
                stichtag: getTodayDateString(),
                betrag: "5000"
            });
        });

        await test.step("KL41_Vermoegen_Eigenheim_erfassen", async () => {
            await klientschaftKeyword.KL41_Vermoegen_Eigenheim_erfassen({
                bezeichnung: "Eigenheim",
                stichtag: getTodayDateString(),
                betrag: "500000",
                glaeubiger: "",
                maximalGrund: ""
            });
        });

        await test.step("KL42_Vermoegen_Auto_erfassen", async () => {
            await klientschaftKeyword.KL42_Vermoegen_Auto_erfassen({
                bezeichnung: "Auto",
                stichtag: getTodayDateString(),
                betrag: "10000"
            });
        });

        await test.step("KL50_Schulden_erfassen", async () => {
            await klientschaftKeyword.KL50_Schulden_erfassen({
                schuldenTyp: "Schulden",
                bezeichnung: "Kredit Bank AG",
                stichtag: getTodayDateString(),
                betrag: "20000",
                divDokumente: ""
            });
        });
    }
);
