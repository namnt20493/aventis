import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { TestUsers } from "@constants/credentials";

test(
    "DO11_Dossier_Search_Lupe",
    {
        tag: ["@[182978]", "@dossier", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);

        // Login als Sozialarbeiterin

        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        // Dossier via API erstellen
        await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);

        // DO11: Suche nach Dossier
        await test.step("DO11_Dossier_Search_Lupe - Dossiers", async () => {
            await commonKeyword.DO11_Dossier_Search_Lupe({
                searchDossierOrKlient: uniqueDossiertId,
                resultType: "Dossiers"
            });
        });

        // TODO: Validierung hier einfügen

        // DO11: Suche nach Klient
        await test.step("DO11_Dossier_Search_Lupe - Klienten", async () => {
            await commonKeyword.DO11_Dossier_Search_Lupe({
                searchDossierOrKlient: testData.persons.FIRST_PERSON.name,
                resultType: "Klienten"
            });
        });

        // TODO: Validierung hier einfügen

        // DO11: Suche nach Dossier (erneut)
        await test.step("DO11_Dossier_Search_Lupe - Dossiers erneut", async () => {
            await commonKeyword.DO11_Dossier_Search_Lupe({
                searchDossierOrKlient: uniqueDossiertId,
                resultType: "Dossiers"
            });
        });

        // TODO: Validierung hier einfügen
    }
);
