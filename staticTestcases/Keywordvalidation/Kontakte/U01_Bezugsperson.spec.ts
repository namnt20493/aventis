import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { UmfeldKeyword } from "@keywords/umfeld-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { TestUsers } from "@constants/credentials";

test(
    "U01_Bezugsperson_erfassen",
    {
        tag: ["@[182218]", "@kontakte", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest }) => {
        const commonKeyword = new CommonKeyword(page);
        const umfeldKeyword = new UmfeldKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);

        // Login als Sozialarbeiterin

        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        // Dossier via API erstellen
        await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);

        // U01: Bezugsperson erfassen
        await test.step("U01_Bezugsperson_erfassen", async () => {
            await umfeldKeyword.U01_Bezugsperson_erfassen({
                name: "Testfirma AG",
                vorname: "",
                rolle: "Arbeitgeber",
                zusatz: "",
                strasse: "Firmenstrasse",
                hausNummer: "1",
                Ort: ""
            });
        });
    }
);
