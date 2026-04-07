import { test } from "@libs/test-fixtures";

import { CommonKeyword } from "@libs/keywords";
import { PHKeyword } from "@keywords/ph-keyword";

import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { PathHelper } from "@utils/helpers/pathHelper";
import { TestMitarbeiter } from "@constants/testData";

test(
    "a05_Journal_Small",
    {
        tag: ["@[181254]", "@aufgaben", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var pHKeyword = new PHKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        await sharedTestLogic.generateDossierViaApi(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId, context);

        await test.step("PH01_JournalEintrag_erfassen", async () => {
            await pHKeyword.PH01_JournalEintrag_erfassen({
                titel: "Ein nettes Gespräch",
                erstelltAm: DateHelper.getTodayDateString(),
                jurnalArt: "Gespräch",
                thema: "Bildung",
                relevantSanktion: "x",
                interneVerwendung: "",
                teilnehmende: TestMitarbeiter.ADRIAN_MESSERLI,
                betroffene: testData.persons.FIRST_PERSON.fullName,
                notiz: "so was",
                dateiPfad: PathHelper.getDocumentPath("JournalEintrag.docx")
            });
        });
    }
);
