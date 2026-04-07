import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { ZieterfassungKeyword } from "@keywords/zieterfassung-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { TestUsers } from "@constants/credentials";
import * as DateHelper from "@utils/helpers/DateHelper";

test(
    "MALI03_Zeit_erfassen",
    {
        annotation: { type: "known-bug", description: "https://diartis.visualstudio.com/Aventis/_workitems/edit/181363" },
        tag: ["@[183695]", "@aufgaben", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest }) => {
        var commonKeyword = new CommonKeyword(page);
        var zeitKeyword = new ZieterfassungKeyword(page);

        test.skip(true, "Known Bug #181363: Issue with time entry");

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);

        await test.step("MALI03_Zeit_erfassen", async () => {
            await zeitKeyword.MALI03_Zeit_erfassen({
                dossier: uniqueDossiertId,
                dienstLeistung: "Klientengespräche intern",
                datum: DateHelper.getTodayDateString(),
                dauerHHMM: "01:00",
                beschreibung: "Beratungsgespräch"
            });
        });
    }
);
