import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { RahmenbudgetKeyword } from "@keywords/rahmenbudget-keyword";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { generateDossierWithErwerbssituationAndWsh } from "@libs/workflows/guiDossierWorkflow";
import { Wohnsituation } from "@libs/keywords/wohnsituation-keyword";

test(
    "AT_Rahmenbudget_Spalten_Ein_Ausblenden",
    {
        tag: ["@[112373]", "@acceptance", "@rahmenbudget"]
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
                mietkosten: "1800",
                nebenkosten: "150"
            });
        });

        await test.step("R06_Rahmenbudget_SpaltenEinAusblenden_Konto", async () => {
            await rahmenbudgetKeyword.R06_Rahmenbudget_SpaltenEinAusblenden({
                dossier: uniqueDossiertId,
                spaltenName: "Konto anzeigen",
                pruefenVisibleTitel: "Konto"
            });
        });

        await test.step("R06_Rahmenbudget_SpaltenEinAusblenden_Zahlungsempfaenger", async () => {
            await rahmenbudgetKeyword.R06_Rahmenbudget_SpaltenEinAusblenden({
                dossier: uniqueDossiertId,
                spaltenName: "Zahlungsempfänger/in anzeigen",
                pruefenVisibleTitel: "Zahlungsempfänger/in"
            });
        });

        await test.step("R06_Rahmenbudget_SpaltenEinAusblenden_Bewilligung", async () => {
            await rahmenbudgetKeyword.R06_Rahmenbudget_SpaltenEinAusblenden({
                dossier: uniqueDossiertId,
                spaltenName: "Bewilligung anzeigen",
                pruefenVisibleTitel: "Bewilligung"
            });
        });

        await test.step("R06_Rahmenbudget_SpaltenEinAusblenden_GueltigkeitPosition", async () => {
            await rahmenbudgetKeyword.R06_Rahmenbudget_SpaltenEinAusblenden({
                dossier: uniqueDossiertId,
                spaltenName: "Gültigkeit Position anzeigen",
                pruefenVisibleTitel: "Gültigkeit Position"
            });
        });
    }
);
