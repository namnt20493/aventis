import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { TestUsers } from "@constants/credentials";

test(
    "KL20_KL30_Sorgerecht_Beziehungen",
    {
        tag: ["@[182215]", "@klient", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        const commonKeyword = new CommonKeyword(page);
        const klientschaftKeyword = new KlientschaftKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId, true);

        await test.step("KL20_Sorgerecht_erfassen", async () => {
            await klientschaftKeyword.KL20_Sorgerecht_erfassen({
                Klientschaft: testData.persons.FIRST_PERSON.fullName,
                Sorgerecht: "gemeinsame elterliche Vorsorge",
                Betroffener: "",
                GueltigVon: "",
                GueltigBis: "",
                Besuchsrecht: ""
            });
        });

        await test.step("KL30_Beziehungen_erfassen", async () => {
            await klientschaftKeyword.KL30_Beziehungen_erfassen({
                beziehung: "Vater",
                von: testData.persons.FIRST_PERSON.fullName,
                gueltigVon: "",
                gueltigBis: ""
            });
        });
    }
);
