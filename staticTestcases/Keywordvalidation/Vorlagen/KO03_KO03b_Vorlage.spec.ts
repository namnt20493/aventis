import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { VorlagenKeyword } from "@keywords/vorlagen-keyword";
import { TestUsers } from "@constants/credentials";
import { PathHelper } from "@utils/helpers/pathHelper";
import * as DateHelper from "@utils/helpers/DateHelper";

/**
 * KO03/KO03b: Template creation and deletion test
 *
 * Uses unique template name based on seed and a less common context/language/region
 * combination (E-Mail/Französisch/Bern) to avoid conflicts with existing QA templates.
 * If this combination also becomes occupied, try different combinations or delete
 * existing templates via cleanup.
 */
test(
    "KO03_KO03b_Vorlage_erfassen_loeschen",
    {
        tag: ["@[183100]", "@vorlagen", "@keywordValidation"]
    },
    async ({ page, seed }) => {
        var commonKeyword = new CommonKeyword(page);
        var vorlagenKeyword = new VorlagenKeyword(page);

        const uniqueSuffix = seed.substring(0, 8);
        const vorlageBez = `Vorlage_${uniqueSuffix}`;
        const gueltigVon = DateHelper.getFirstOfMonthString();
        const gueltigBis = DateHelper.getLastDayOfYearString();
        const testDocPath = PathHelper.getDocumentPath("test.docx");
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SUPERUSER.username, TestUsers.SUPERUSER.password);
        });

        await test.step("Cleanup: Vorlage loeschen falls vorhanden", async () => {
            await vorlagenKeyword.KO03b_Vorlage_loeschen_IfExists({
                vorlageBez: "",
                verwKontext: "Einnahme Abtretung",
                vorlageSprache: "Französisch"
            });
        });

        await test.step("KO03_Vorlage_erfassen", async () => {
            await vorlagenKeyword.KO03_Vorlage_erfassen({
                datei: testDocPath,
                vorlageBez: vorlageBez,
                verwKontext: "Einnahme Abtretung",
                vorlageSprache: "Französisch",
                gueltigVon: gueltigVon,
                gueltigBis: gueltigBis,
                erlaueterung: "Test Vorlage erstellt durch Automation",
                dossierRegion: "Bern"
            });
        });

        await test.step("KO03b_Vorlage_loeschen", async () => {
            await vorlagenKeyword.KO03b_Vorlage_loeschen({
                vorlageBez: vorlageBez,
                verwKontext: "Einnahme Abtretung",
                vorlageSprache: "Französisch"
            });
        });
    }
);
