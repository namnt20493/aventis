import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@keywords/common-keyword";
import { BedarfsprufungKeyword } from "@keywords/bedarfsprufung-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestUsers } from "@constants/credentials";

test(
    "A01_1_AnspruchPruefung_Bedarfspruefung",
    {
        tag: ["@[183692]", "@bedarfspruefung", "@keywordValidation"]
    },
    async ({ page, seed, authenticatedRequest }) => {
        var commonKeyword = new CommonKeyword(page);
        var bedarfsprufungKeyword = new BedarfsprufungKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await test.step("Create Dossier via API", async () => {
            await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);
        });

        await test.step("A01_1_AnspruchPruefung_Bedarfspruefung", async () => {
            await bedarfsprufungKeyword.A01_1_AnspruchPruefung_Bedarfspruefung({
                entscheidVom: DateHelper.getTodayDateString(),
                begrundung: "Begründung für Anspruchsprüfung",
                unterstutzungab: DateHelper.getFirstOfMonthString()
            });
        });
    }
);
