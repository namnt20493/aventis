import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { BedarfsprufungKeyword } from "@keywords/bedarfsprufung-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestUsers } from "@constants/credentials";

test(
    "A01bcd_Checklist",
    {
        tag: ["@[182210]", "@bedarfspruefung", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var bedarfsprufungKeyword = new BedarfsprufungKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);

        // Login als Sozialarbeiterin

        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        // Dossier via API erstellen
        await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);

        // Zuerst Bedarfsprüfung erstellen (Vorbedingung für A01b)
        await test.step("A01_AnspruchPruefung_Bedarfspruefung", async () => {
            await bedarfsprufungKeyword.A01_AnspruchPruefung_Bedarfspruefung({
                entscheidVom: DateHelper.getTodayDateString(),
                begrundung: "Gar keine Begründung",
                unterstutzungab: DateHelper.getFirstOfMonthString()
            });
        });

        // Keyword unter Test: Checklist ergänzen mit verschiedenen Themen
        await test.step("A01b_Zu_AnsprPruef_Bedarfspruef_ChecklistErgaenzen - Ausbildung", async () => {
            await bedarfsprufungKeyword.A01b_Zu_AnsprPruef_Bedarfspruef_ChecklistErgaenzen({
                bedarfsPrDate: DateHelper.getTodayDateString(),
                klient: testData.persons.FIRST_PERSON.fullName,
                thema: "Ausbildung",
                unterLagen: "Studien / Ausbildungsbestätigung",
                status: "vorhanden",
                bemerkung: "keine"
            });
        });

        await test.step("A01b_Zu_AnsprPruef_Bedarfspruef_ChecklistErgaenzen - Versicherungen", async () => {
            await bedarfsprufungKeyword.A01b_Zu_AnsprPruef_Bedarfspruef_ChecklistErgaenzen({
                bedarfsPrDate: DateHelper.getTodayDateString(),
                klient: testData.persons.FIRST_PERSON.fullName,
                thema: "Versicherungen",
                unterLagen: "Krankenkassenpolicen (KVG und VVG)",
                status: "einzureichen",
                bemerkung: "keine"
            });
        });

        await test.step("A01b_Zu_AnsprPruef_Bedarfspruef_ChecklistErgaenzen - Vermögen/Schulden", async () => {
            await bedarfsprufungKeyword.A01b_Zu_AnsprPruef_Bedarfspruef_ChecklistErgaenzen({
                bedarfsPrDate: DateHelper.getTodayDateString(),
                klient: testData.persons.FIRST_PERSON.fullName,
                thema: "Vermögen / Schulden",
                unterLagen: "Bank- und Postkontoauszüge",
                status: "nicht relevant",
                bemerkung: "keine"
            });
        });

        // A01c: Checklist-Kategorie als "nicht relevant" markieren
        await test.step("A01c_Zu_AnsprPruef_Bedarfspruef_ChecklistNichtRelevant - Allgemeine Dokumente", async () => {
            await bedarfsprufungKeyword.A01c_Zu_AnsprPruef_Bedarfspruef_ChecklistNichtRelevant({
                bedarfsPrDate: DateHelper.getTodayDateString(),
                klient: testData.persons.FIRST_PERSON.fullName,
                thema: "Allgemeine Dokumente"
            });
        });

        // A01d: Checklist filtern und als Word exportieren
        await test.step("A01d_Zu_AnsprPruef_Bedarfspruef_Checklist_als_WordExport", async () => {
            await bedarfsprufungKeyword.A01d_Zu_AnsprPruef_Bedarfspruef_Checklist_als_WordExport({
                bedarfsPrDate: DateHelper.getTodayDateString(),
                klient: testData.persons.FIRST_PERSON.fullName,
                filterKategorie: "Versicherungen",
                filterStatus: "einzureichen",
                filterBetrifft: ""
            });
        });
    }
);
