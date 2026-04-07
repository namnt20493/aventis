import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { DossierubersichtKeyword } from "@keywords/dossierubersicht-keyword";
import { TestUsers } from "@constants/credentials";
import { TestMitarbeiter } from "@constants/testData";
import * as DateHelper from "@utils/helpers/DateHelper";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";

test.skip(
    "DO12b_DossierMenge_Zustaendigkeit_aendern",
    {
        tag: ["@[182980]", "@dossier", "@keywordValidation"]
    },
    async ({ page, seed, authenticatedRequest }) => {
        var commonKeyword = new CommonKeyword(page);
        var dossierubersichtKeyword = new DossierubersichtKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        const gueltigAb = DateHelper.getTodayDateString();
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);

        await test.step("DO12b_DossierMenge_Zustaendigkeit_aendern - 1A to 1B", async () => {
            await dossierubersichtKeyword.DO12b_DossierMenge_Zustaendigkeit_aendern({
                aktuelleZust: TestMitarbeiter.SOZIALARBEITERIN_1A,
                neuZust: "Bern Sozialarbeiterin 1B",
                gueltigAb: gueltigAb,
                eintrUeberschrX: "x",
                offeneAufgUebertrX: "x"
            });
        });

        await test.step("DO12b_DossierMenge_Zustaendigkeit_aendern - 1B to 1A (revert)", async () => {
            await dossierubersichtKeyword.DO12b_DossierMenge_Zustaendigkeit_aendern({
                aktuelleZust: "Bern Sozialarbeiterin 1B",
                neuZust: TestMitarbeiter.SOZIALARBEITERIN_1A,
                gueltigAb: gueltigAb,
                eintrUeberschrX: "x",
                offeneAufgUebertrX: "x"
            });
        });
    }
);
