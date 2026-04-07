import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { PHKeyword } from "@keywords/ph-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { PathHelper } from "@utils/helpers/pathHelper";
import { TestMitarbeiter } from "@constants/testData";
import { TestUsers } from "@constants/credentials";

test(
    "PH05b_PH07_Zielvereinbarung_Erweitert",
    {
        tag: ["@[183090]", "@aufgaben", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var phKeyword = new PHKeyword(page);

        const zielTitel = "Automatisiertes Ziel für Beurteilung";
        const zielVomDatum = DateHelper.getDaysFutureString(-10);
        const fristBisDatum = DateHelper.getDaysFutureString(30);
        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);

        await test.step("PH04_Ziele_erfassen - Setup für Zielvereinbarung", async () => {
            await phKeyword.PH04_Ziele_erfassen({
                Titel: zielTitel,
                ZielVom: zielVomDatum,
                FristBis: fristBisDatum,
                Mitarbeiter: TestMitarbeiter.SOZIALARBEITERIN_1A,
                Klientschaft: testData.persons.FIRST_PERSON.fullName,
                Thema: "Bildung",
                Status: "offen",
                Beschreibung: "Ziel für Zielvereinbarungs-Test",
                ErwarteteHandlung: "Erwartete Handlung definiert",
                BeschaeftigungsMassnahme: "Massnahme definiert",
                Partner: "AFOREM"
            });
        });

        await test.step("PH05_Zielvereinbarung_ohneWorkflow_erfassen - Setup", async () => {
            await phKeyword.PH05_Zielvereinbarung_ohneWorkflow_erfassen({
                dossier: uniqueDossiertId,
                bemerkung: "Bemerkung für Beurteilungs-Test",
                zugeZielTitelSelect: zielTitel,
                unterzeichnZielvereinbarungPfad: PathHelper.getDocumentPath("JournalEintrag.docx")
            });
        });

        await test.step("Navigate_to_refresh_state", async () => {
            await page.reload({ waitUntil: "domcontentloaded" });
            await page.waitForLoadState("load");
        });

        await test.step("PH07_Zielvereinbarung_Beurteilung", async () => {
            await phKeyword.PH07_Zielvereinbarung_Beurteilung({
                zielVereinbarungVon: DateHelper.getTodayDateString(),
                fristVon: fristBisDatum,
                datei: PathHelper.getDocumentPath("test.docx")
            });
        });
    }
);
