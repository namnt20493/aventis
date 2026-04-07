import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { PHKeyword } from "@keywords/ph-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { PathHelper } from "@utils/helpers/pathHelper";
import { TestMitarbeiter } from "@constants/testData";
import { TestUsers } from "@constants/credentials";

test(
    "PH05b_Zielvereinbarung_mit_IIZ",
    {
        tag: ["@[183691]", "@new", "@aufgaben", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var phKeyword = new PHKeyword(page);

        const zielTitel = "Ziel für IIZ Zielvereinbarung";
        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);

        await test.step("PH04_Ziele_erfassen - Setup", async () => {
            await phKeyword.PH04_Ziele_erfassen({
                Titel: zielTitel,
                ZielVom: DateHelper.getTodayDateString(),
                FristBis: DateHelper.getDaysFutureString(30),
                Mitarbeiter: TestMitarbeiter.SOZIALARBEITERIN_1A,
                Klientschaft: testData.persons.FIRST_PERSON.fullName,
                Thema: "Bildung",
                Status: "offen",
                Beschreibung: "Ziel für IIZ Test",
                ErwarteteHandlung: "Handlung für IIZ",
                BeschaeftigungsMassnahme: "Massnahme für IIZ",
                Partner: "AFOREM"
            });
        });

        await test.step("PH05b_Zielvereinbarung_ohneWorkflow_erfassen_mit_IIZ", async () => {
            await phKeyword.PH05b_Zielvereinbarung_ohneWorkflow_erfassen_mit_IIZ({
                dossier: uniqueDossiertId,
                bemerkung: "Bemerkung mit IIZ Verknüpfung",
                zugeZielTitelSelect: zielTitel,
                unterzeichnZielvereinbarungPfad: PathHelper.getDocumentPath("JournalEintrag.docx"),
                IIZTitel: ""
            });
        });
    }
);
