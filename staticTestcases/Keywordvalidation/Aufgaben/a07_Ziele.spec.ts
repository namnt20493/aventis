import { test } from "@libs/test-fixtures";

import { CommonKeyword } from "@libs/keywords";
import { PHKeyword } from "@keywords/ph-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestMitarbeiter } from "@constants/testData";

test(
    "a07_Ziele",
    {
        tag: ["@[183091]", "@aufgaben", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var pHKeyword = new PHKeyword(page);

        const ziel1Titel = "Ziel heute minus 10 Tage";
        const ziel2Titel = "Ziel heute bis 30 Tage";
        const ziel3Titel = "Ziel heute plus 10 Tage";
        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        await sharedTestLogic.generateDossierViaApi(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId, context);

        await test.step("PH04_Ziele_erfassen", async () => {
            await pHKeyword.PH04_Ziele_erfassen({
                Titel: ziel1Titel,
                ZielVom: DateHelper.getDaysFutureString(-10),
                FristBis: DateHelper.getDaysFutureString(30),
                Mitarbeiter: TestMitarbeiter.SOZIALARBEITERIN_1A,
                Klientschaft: testData.persons.FIRST_PERSON.fullName,
                Thema: "Bildung",
                Status: "offen",
                Beschreibung: "Ein kleiner Text",
                ErwarteteHandlung: "Eine wichtige Handlung",
                BeschaeftigungsMassnahme: "Eine wichtige Handlung",
                Partner: "AFOREM"
            });
        });

        await test.step("PH05_Zielvereinbarung_ohneWorkflow_erfassen", async () => {
            await pHKeyword.PH05_Zielvereinbarung_ohneWorkflow_erfassen({
                dossier: uniqueDossiertId,
                bemerkung: "Wichtige Bemerkung",
                zugeZielTitelSelect: ziel1Titel,
                unterzeichnZielvereinbarungPfad: ""
            });
        });

        await test.step("PH04_Ziele_erfassen", async () => {
            await pHKeyword.PH04_Ziele_erfassen({
                Titel: ziel2Titel,
                ZielVom: DateHelper.getTodayDateString(),
                FristBis: DateHelper.getDaysFutureString(30),
                Mitarbeiter: TestMitarbeiter.SOZIALARBEITERIN_1A,
                Klientschaft: testData.persons.FIRST_PERSON.fullName,
                Thema: "Bildung",
                Status: "offen",
                Beschreibung: "Ein kleiner Text",
                ErwarteteHandlung: "Eine wichtige Handlung",
                BeschaeftigungsMassnahme: "Eine wichtige Handlung",
                Partner: "AFOREM"
            });
        });

        await test.step("PH05_Zielvereinbarung_ohneWorkflow_erfassen", async () => {
            await pHKeyword.PH05_Zielvereinbarung_ohneWorkflow_erfassen({
                dossier: uniqueDossiertId,
                bemerkung: "Wichtige Bemerkung 1",
                zugeZielTitelSelect: ziel2Titel,
                unterzeichnZielvereinbarungPfad: ""
            });
        });

        await test.step("PH04_Ziele_erfassen", async () => {
            await pHKeyword.PH04_Ziele_erfassen({
                Titel: ziel3Titel,
                ZielVom: DateHelper.getDaysFutureString(10),
                FristBis: DateHelper.getDaysFutureString(20),
                Mitarbeiter: TestMitarbeiter.SOZIALARBEITERIN_1A,
                Klientschaft: testData.persons.FIRST_PERSON.fullName,
                Thema: "Bildung",
                Status: "offen",
                Beschreibung: "Ein kleiner Text",
                ErwarteteHandlung: "Eine wichtige Handlung",
                BeschaeftigungsMassnahme: "Eine wichtige Handlung",
                Partner: "AFOREM"
            });
        });

        await test.step("PH05_Zielvereinbarung_ohneWorkflow_erfassen", async () => {
            await pHKeyword.PH05_Zielvereinbarung_ohneWorkflow_erfassen({
                dossier: uniqueDossiertId,
                bemerkung: "Wichtige Bemerkung 2",
                zugeZielTitelSelect: ziel3Titel,
                unterzeichnZielvereinbarungPfad: ""
            });
        });
    }
);
