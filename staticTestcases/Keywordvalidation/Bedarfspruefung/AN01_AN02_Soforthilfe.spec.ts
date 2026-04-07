import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { AnspruchsprufungKeyword } from "@keywords/anspruchsprufung-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { TestUsers } from "@constants/credentials";

test(
    "AN01_AN02_Soforthilfe",
    {
        tag: ["@[182212]", "@bedarfspruefung", "@keywordValidation", "@coreBusiness"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var anspruchsprufungKeyword = new AnspruchsprufungKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);

        // Login als Sozialarbeiterin

        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        // Dossier via API erstellen
        await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);

        // Kurze Pause um sicherzustellen, dass das Dossier erstellt wurde
        await commonKeyword.E01_Delay({ Pause: "5000" });

        // AN01: Soforthilfe erfassen mit Barzahlung
        await test.step("AN01_Soforthilfe_erfassen", async () => {
            await anspruchsprufungKeyword.AN01_Soforthilfe_erfassen({
                dossier: uniqueDossiertId,
                expectedErrorContains: "",
                klientschaft: testData.persons.FIRST_PERSON.fullName,
                betrag: 100,
                Zahlungsverbindung: "Barzahlung"
            });
        });

        // AN02: Soforthilfe im Rahmenbudget prüfen
        await test.step("AN02_Soforthilfe_in_RahmenbudgetPruefen", async () => {
            await anspruchsprufungKeyword.AN02_Soforthilfe_in_RahmenbudgetPruefen({
                dossier: uniqueDossiertId,
                zahlungsArt: "Barauszahlung",
                buchungsDatum: ""
            });
        });
    }
);
