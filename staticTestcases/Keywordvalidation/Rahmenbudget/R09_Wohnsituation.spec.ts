import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { RahmenbudgetKeyword } from "@keywords/rahmenbudget-keyword";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { TestUsers } from "@constants/credentials";
import { generateDossierWithErwerbssituationAndWsh } from "@libs/workflows/guiDossierWorkflow";
import { Wohnsituation } from "@libs/keywords/wohnsituation-keyword";

test(
    "R09_Wohnsituation_AnzeigenPruefen",
    {
        tag: ["@[182997]", "@rahmenbudget", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest }) => {
        const commonKeyword = new CommonKeyword(page);
        const rahmenbudgetKeyword = new RahmenbudgetKeyword(page);
        const klientschaftKeyword = new KlientschaftKeyword(page);
        const wohnsituationKeyword = new Wohnsituation(page);
        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);

        const dossierResult = await generateDossierWithErwerbssituationAndWsh(authenticatedRequest, commonKeyword, page, klientschaftKeyword, seed, uniqueDossiertId, context);

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierResult.dossierId);
        });

        await test.step("WO32_01b_Wohnsituation_Haushalt_Wohnung_anpassen", async () => {
            await wohnsituationKeyword.WO32_01b_Wohnsituation_Haushalt_Wohnung_anpassen({
                vermieter: "Graber Immobilien",
                wohnungsgrosse: "3.5",
                mietkosten: "1300",
                nebenkosten: "150"
            });
        });

        await test.step("R09_RahmenBudget_Wohnsituation_AnzeigenPruefen", async () => {
            await rahmenbudgetKeyword.R09_RahmenBudget_Wohnsituation_AnzeigenPruefen({
                dossier: uniqueDossiertId,
                checkUebernomWohnKosten: 650
            });
        });
    }
);
