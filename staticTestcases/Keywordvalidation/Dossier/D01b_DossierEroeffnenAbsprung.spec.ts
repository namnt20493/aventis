import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@keywords/common-keyword";
import { DossierKeyword } from "@keywords/dossier-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { TestUsers } from "@constants/credentials";
import { Birthdays } from "@constants/testData";
import { generateAhvNumber } from "@utils/TestdataGenerator";

test(
    "D01b_Dossier_eroeffnen_absprung",
    {
        tag: ["@[182986]", "@dossier", "@keywordValidation"]
    },
    async ({ page, seed, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var dossierKeyword = new DossierKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        const ahvNumber = generateAhvNumber(seed);
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await test.step("Create Dossier via API", async () => {
            await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);
        });

        await test.step("D01b_Dossier_eroeffnen_absprung", async () => {
            await dossierKeyword.D01b_Dossier_eroeffnen_absprung({
                name: testData.persons.FIRST_PERSON.name,
                vorname: testData.persons.FIRST_PERSON.vorname,
                geburtsTag: Birthdays.ADULT_1,
                aHV: ahvNumber,
                dossierName: uniqueDossiertId
            });
        });
    }
);
