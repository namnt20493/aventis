import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@keywords/common-keyword";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestUsers } from "@constants/credentials";

test(
    "KL03d_HypEinkommen_Erfassen",
    {
        tag: ["@[182987]", "@klient", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var klientschaftKeyword = new KlientschaftKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        const geplantVon = DateHelper.getTodayDateString();
        const geplantBis = DateHelper.getLastDayOfYearString();
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

        await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);

        await test.step("KL03d_ErwerbsituationEinnahmen_HypEinkommen_Erfassen", async () => {
            await klientschaftKeyword.KL03d_ErwerbsituationEinnahmen_HypEinkommen_Erfassen({
                dossier: uniqueDossiertId,
                klient: testData.persons.FIRST_PERSON.fullName,
                betrag: "200",
                geplantVon: geplantVon,
                geplantBis: geplantBis,
                abTretung: ""
            });
        });
    }
);
