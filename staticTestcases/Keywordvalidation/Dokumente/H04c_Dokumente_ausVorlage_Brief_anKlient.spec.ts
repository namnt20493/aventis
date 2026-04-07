import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { DocumentKeyword } from "@keywords/document-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { TestUsers } from "@constants/credentials";

test(
    "H04c_Dokumente_ausVorlage_Brief_anKlient",
    {
        tag: ["@[183081]", "@dokumente", "@keywordValidation", "@coreBusiness"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        const commonKeyword = new CommonKeyword(page);
        const dokumenteKeyword = new DocumentKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);

        await test.step("H04c_Dokumente_ausVorlage_erstellen_Brief_anKlient", async () => {
            await dokumenteKeyword.H04c_Dokumente_ausVorlage_erstellen_Brief_anKlient({
                vorlage: "Brief an Klientschaft",
                sprache: "Deutsch",
                titel: "TestBrief " + seed,
                klient: testData.persons.FIRST_PERSON.fullName,
                adresse: "Wohnsituation: Strasse_831 27, 3302 Moosseedorf",
                thema: "Allgemein"
            });
        });
    }
);
