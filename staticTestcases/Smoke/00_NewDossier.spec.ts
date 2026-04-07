import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { DossierKeyword } from "@keywords/dossier-keyword";

test(
    "00_NewDossier",
    {
        tag: ["@[181200]", "@smoke", "@all"]
    },
    async ({ page, seed, context, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var dossierKeyword = new DossierKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        await sharedTestLogic.generateDossier(commonKeyword, page, dossierKeyword, uniqueDossiertId, context, testData.persons);
    }
);
