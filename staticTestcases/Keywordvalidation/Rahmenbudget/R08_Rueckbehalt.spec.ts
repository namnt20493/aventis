import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { RahmenbudgetKeyword } from "@keywords/rahmenbudget-keyword";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { TestUsers } from "@constants/credentials";
import * as DateHelper from "@utils/helpers/DateHelper";
import { generateDossierWithErwerbssituationAndWsh } from "@libs/workflows/guiDossierWorkflow";
import { Wohnsituation } from "@libs/keywords/wohnsituation-keyword";
import { PathHelper } from "@utils/helpers/pathHelper";

test(
    "R08_Rueckbehalt_erfassen",
    {
        tag: ["@[182996]", "@rahmenbudget", "@keywordValidation"]
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

        await test.step("L03_LogoutAndLoginDiffAccount_Sachbearbeiterin", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

        const testDocumentPath = PathHelper.getDocumentPath("Bankverbindung.docx");

        await test.step("R08_RahmenBudget_Rueckbehalt_erfassen", async () => {
            await rahmenbudgetKeyword.R08_RahmenBudget_Rueckbehalt_erfassen({
                dossier: uniqueDossiertId,
                titel: "Test Rückbehalt",
                monatBetrag: 50,
                startMonat: DateHelper.getDaysFutureString(30),
                endMonat: "",
                beschreibung: "Testbeschreibung für Rückbehalt",
                documents: testDocumentPath
            });
        });
    }
);
