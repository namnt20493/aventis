import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { DossierubersichtKeyword } from "@keywords/dossierubersicht-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestUsers } from "@constants/credentials";
import { TestMitarbeiter } from "@constants/testData";

test(
    "DO12_Dossieruebersicht_Zustaendigkeit_aendern",
    {
        annotation: { type: "known-bug", description: "https://diartis.visualstudio.com/Aventis/_workitems/edit/184174" },
        tag: ["@[183079]", "@dossier", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest }) => {
        var commonKeyword = new CommonKeyword(page);
        var dossierubersichtKeyword = new DossierubersichtKeyword(page);

        test.skip(true, "Known Bug #184174: Issue with changing dossier responsibility");
        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);

        // Login als Sozialarbeiterin

        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        // Dossier via API erstellen
        await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);

        // DO12: Zuständigkeit ändern zu 1B
        await test.step("DO12_Dossieruebersicht_Zustaendigkeit_aendern - zu 1B", async () => {
            await dossierubersichtKeyword.DO12_Dossieruebersicht_Zustaendigkeit_aendern({
                zustBereich: "Zuständigkeit Beratung",
                menuSelect: "Zuständigkeit ändern",
                teamSozial: "Sozialarbeit Bern 1",
                persSozial: "Bern Sozialarbeiterin 1B",
                teamSach: "Sachbearbeitung Bern",
                persSach: "Bern Sachbearbeiterin",
                gueltigAb: DateHelper.getTodayDateString(),
                eintrUeberschrX: "x",
                offeneAufgUebertrX: "x"
            });
        });

        // DO12: Zuständigkeit zurück ändern zu 1A
        await test.step("DO12_Dossieruebersicht_Zustaendigkeit_aendern - zurück zu 1A", async () => {
            await dossierubersichtKeyword.DO12_Dossieruebersicht_Zustaendigkeit_aendern({
                zustBereich: "Zuständigkeit Beratung",
                menuSelect: "Zuständigkeit ändern",
                teamSozial: "Sozialarbeit Bern 1",
                persSozial: TestMitarbeiter.SOZIALARBEITERIN_1A,
                teamSach: "Sachbearbeitung Bern",
                persSach: "Bern Sachbearbeiterin",
                gueltigAb: DateHelper.getTodayDateString(),
                eintrUeberschrX: "x",
                offeneAufgUebertrX: "x"
            });
        });
    }
);
