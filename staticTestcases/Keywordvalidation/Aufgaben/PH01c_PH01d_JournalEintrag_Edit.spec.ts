import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { PHKeyword } from "@keywords/ph-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { PathHelper } from "@utils/helpers/pathHelper";
import { TestUsers } from "@constants/credentials";

test(
    "PH01c_PH01d_JournalEintrag_Edit",
    {
        tag: ["@[183089]", "@aufgaben", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var phKeyword = new PHKeyword(page);

        const journalTitel = "Automatisierter Journal Test";
        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        const dossierGuid = await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId, true);

        await test.step("PH01_JournalEintrag_erfassen", async () => {
            await phKeyword.PH01_JournalEintrag_erfassen({
                titel: journalTitel,
                erstelltAm: DateHelper.getTodayDateString(),
                jurnalArt: "Telefon",
                thema: "Bildung",
                relevantSanktion: "x",
                interneVerwendung: "",
                teilnehmende: testData.persons.SECOND_PERSON.fullName,
                betroffene: testData.persons.FIRST_PERSON.fullName,
                notiz: "Erster automatisierter Journaleintrag",
                dateiPfad: PathHelper.getDocumentPath("JournalEintrag.docx")
            });
        });

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierGuid);
        });

        await test.step("PH01c_Journaleintrag_UeberDatei_erfassen", async () => {
            await phKeyword.PH01c_Journaleintrag_UeberDatei_erfassen({
                documentPath: PathHelper.getDocumentPath("ErwerbssituationAbtretung.docx"),
                titel: "Journal über Datei Upload",
                teilNehmer: testData.persons.SECOND_PERSON.fullName,
                erstelltAm: DateHelper.getTodayDateString(),
                jurnalArt: "Gespräch",
                thema: "Wohnen",
                relevantSanktion: "",
                interneVerwendung: "x",
                teilnehmende: testData.persons.FIRST_PERSON.fullName,
                notiz: "Journaleintrag über Datei erstellt",
                dateiPfad: ""
            });
        });

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierGuid);
        });

        await test.step("PH01d_Journal_Eintrag_editieren", async () => {
            await phKeyword.PH01d_Journal_Eintrag_editieren({
                dossier: uniqueDossiertId,
                erstelltAm: DateHelper.getTodayDateString(),
                titel: journalTitel,
                deleteBetroffene: "",
                adBetroffene: testData.persons.SECOND_PERSON.fullName,
                adDocument: PathHelper.getDocumentPath("test.docx"),
                atNameOrInstitution: "",
                noteTextAsFollows: "Aktualisierte Notiz mit zusätzlichen Details"
            });
        });
    }
);
