import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";

test(
    "01_ZahlgsVerbind",
    {
        tag: ["@[181251]", "@smoke", "@all"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var klientschaftKeyword = new KlientschaftKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        await sharedTestLogic.generateDossierViaApiWithPerson(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId, context);

        await sharedTestLogic.addZahlungsVerbindung(commonKeyword, page, klientschaftKeyword, uniqueDossiertId, context, testData.persons);
    }
);
