import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { RahmenbudgetKeyword } from "@keywords/rahmenbudget-keyword";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { TestCompanies } from "@constants/testData";
import { generateDossierWithErwerbssituationAndWsh } from "@libs/workflows/guiDossierWorkflow";
import { Wohnsituation } from "@libs/keywords/wohnsituation-keyword";

/**
 * WIP: R10 Monatsbudget prüfen
 * Issue: The budget values depend on a completed Bedarfsprüfung workflow
 * Current setup only creates WSH-Leistung but doesn't run Bedarfsprüfung,
 * so Monatsbudget shows 0.00 instead of calculated values
 * Requires: Complete Bedarfsprüfung + Bewilligungsworkflow before R10 verification
 */
test.skip(
    "R10_RahmenBudget_Monatsbudget_Pruefen",
    {
        tag: ["@keywordValidation", "@wip"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        const commonKeyword = new CommonKeyword(page);
        const rahmenbudgetKeyword = new RahmenbudgetKeyword(page);
        const klientschaftKeyword = new KlientschaftKeyword(page);
        const wohnsituationKeyword = new Wohnsituation(page);
        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);

        const dossierResult = await generateDossierWithErwerbssituationAndWsh(
            authenticatedRequest,
            commonKeyword,
            page,
            klientschaftKeyword,
            seed,
            uniqueDossiertId,
            context
        );

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierResult.dossierId);
        });

        await test.step("WO32_01b_Wohnsituation_Haushalt_Wohnung_anpassen", async () => {
            await wohnsituationKeyword.WO32_01b_Wohnsituation_Haushalt_Wohnung_anpassen({
                vermieter: TestCompanies.GRABER_IMMOBILIEN,
                wohnungsgrosse: "3.5",
                mietkosten: "1800",
                nebenkosten: "150"
            });
        });

        await test.step("R10_RahmenBudget_Monatsbudget_Pruefen", async () => {
            await rahmenbudgetKeyword.R10_RahmenBudget_Monatsbudget_Pruefen({
                dossier: uniqueDossiertId,
                checkAusgabenTotal: 2297,
                checkWeitereAbzuege: 0,
                checkZusammenfassung: 2297
            });
        });
    }
);
