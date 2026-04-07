import { test } from "@libs/test-fixtures";

import { DocumentKeyword } from "@keywords/document-keyword";
import { CommonKeyword } from "@libs/keywords";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";

test(
    "a06_DokuAusVorlage",
    {
        tag: ["@[181255]", "@dokumente", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        const commonKeyword = new CommonKeyword(page);
        const documentKeyword = new DocumentKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        const dossierGuid = await sharedTestLogic.generateDossierViaApi(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId, context);

        await test.step("H04_Dokumente_ausVorlage_erstellen_IIS_Form", async () => {
            await documentKeyword.H04_Dokumente_ausVorlage_erstellen_IIS_Form({
                vorlage: "IIZ Formular",
                sprache: "Deutsch",
                titel: "Wunderbar",
                klient: testData.persons.FIRST_PERSON.fullName,
                adresse: "Wohnsituation: Strasse_831 27, 3302 Moosseedorf"
            });
        });

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierGuid);
        });

        await test.step("H04_Dokumente_ausVorlage_erstellen_IIS_Form", async () => {
            await documentKeyword.H04_Dokumente_ausVorlage_erstellen_IIS_Form({
                vorlage: "IIZ Formular",
                sprache: "Deutsch",
                titel: "Wunder 2 ist alles schön",
                klient: testData.persons.FIRST_PERSON.fullName,
                adresse: "Wohnsituation: Strasse_831 27, 3302 Moosseedorf"
            });
        });
    }
);
