import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { DossierKeyword } from "@keywords/dossier-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { TestUsers } from "@constants/credentials";
import { TestMitarbeiter } from "@constants/testData";

test(
    "DO16_Suche_Filtern_Anzahl",
    {
        tag: ["@[182982]", "@dossier", "@keywordValidation", "@perfMonitoring"]
    },
    async ({ page, seed, context, authenticatedRequest }) => {
        var commonKeyword = new CommonKeyword(page);
        var dossierKeyword = new DossierKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);

        // Login als Sozialarbeiterin

        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        // Dossier via API erstellen
        await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);

        // Wait for search index to update
        await page.waitForTimeout(2000);

        // DO16: Suche filtern und Anzahl prüfen
        await test.step("DO16_Suche_Filtern_Anzahl", async () => {
            await dossierKeyword.DO16_Suche_Filtern_Anzahl({
                dossierSuche: uniqueDossiertId,
                leistungArt: "",
                team: "Sachbearbeitung Bern",
                zustaendigSARSB: "", // Empty - API-created dossiers have no specific user assigned
                gemeinde: "",
                leistungArtStatus: "",
                anzahlTrefferBigger: 0
            });
        });
    }
);
