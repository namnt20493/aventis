import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { WSHKeyword } from "@keywords/RV-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestUsers } from "@constants/credentials";
import { PathHelper } from "@libs/utils/helpers/pathHelper";

test(
    "RV00_RV01_RV01b_RV02_RV02b_Ermittlung_Beschwerde",
    {
        tag: ["@[183074]", "@rechtsverfolgung", "@keywordValidation", "@coreBusiness"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var rvKeyword = new WSHKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        const beschwerdeTitel = `Test Beschwerde ${seed.substring(0, 8)}`;
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SUPERUSER.username, TestUsers.SUPERUSER.password);
        });

        await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);

        await test.step("RV00_Ermittlung_erfassen", async () => {
            await rvKeyword.RV00_Ermittlung_erfassen({
                dossier: uniqueDossiertId,
                betrifft: testData.persons.FIRST_PERSON.fullName,
                gueltigAb: DateHelper.getTodayDateString(),
                Bemerkung: "Test Ermittlung",
                document: ""
            });
        });

        await test.step("RV01_Beschwerde_erstellen", async () => {
            await rvKeyword.RV01_Beschwerde_erstellen({
                titel: beschwerdeTitel,
                zustaendig: "Bern Sozialarbeiterin 1A",
                beschFuehrer: testData.persons.FIRST_PERSON.fullName,
                vName: "Vertreter",
                vVorname: "Test",
                vStrasseInklNr: "Vertreterstrasse 1",
                vOrt: "3000 Bern",
                beschwerdeVon: DateHelper.getTodayDateString(),
                grund: "Hypothetisches Einkommen",
                anfechtDatumEnscheid: DateHelper.getTodayDateString(),
                zustellungDatumEnscheid: DateHelper.getTodayDateString(),
                documente: ""
            });
        });

        await test.step("RV01b_Beschwerde_erweitern", async () => {
            await rvKeyword.RV01b_Beschwerde_erweitern({
                titel: beschwerdeTitel,
                instanz: "Kantonsgericht",
                status: "In Beurteilung",
                beschwerdenummer: "BNR-2025-001",
                stellungNahme: DateHelper.getTodayDateString(),
                datumVom: DateHelper.getTodayDateString(),
                artDerEntsch: "Neuer Entscheid",
                dokument1: "",
                zugestVom: DateHelper.getTodayDateString(),
                entscheidOk: "",
                weiterzug: "",
                beschwerdeDoc: "",
                grund: "Formelle Fehler"
            });
        });

        await test.step("RV02_Auflagen_erfassen", async () => {
            await rvKeyword.RV02_Auflagen_erfassen({
                verfahren: "Verfahren erfassen",
                status1: "Laufend",
                erstelltDurch: "Bern Sozialarbeiterin 1A",
                betroffenPersonen: testData.persons.FIRST_PERSON.fullName,
                titel: "Test Auflage " + seed.substring(0, 8),
                zugeteiltAn: "Bern Sozialarbeiterin 1A",
                erstelltAm: DateHelper.getTodayDateString(),
                frist: DateHelper.getDaysFutureString(30),
                status2: "in Vorbereitung",
                ausgangslage: "Testausgangslage",
                auflagen: "Testauflagen",
                entscheid: "Testentscheid",
                sanktionen: "Testsanktionen",
                weitereSanktionen: "",
                document: ""
            });
        });

        // Needs rework
        // await test.step("RV02b_Auflagen_Folgeschritt", async () => {
        //     await rvKeyword.RV02b_Auflagen_Folgeschritt({
        //         seit: DateHelper.getTodayDateString(),
        //         titelForSelect: "Test Auflage " + seed.substring(0, 8),
        //         typeOfNextStep: "Leistungskürzung",
        //         titel: "Kürzung wegen Nichterfüllung",
        //         sanktionVon: DateHelper.getTodayDateString(),
        //         erstelltAm: DateHelper.getTodayDateString(),
        //         sanktionBis: DateHelper.getDaysFutureString(90),
        //         status: "in Vorbereitung",
        //         zugeteiltAn: "Bern Sozialarbeiterin 1A",
        //         ausgangslage: "Ausgangslage für Folgeschritt",
        //         auflagen: "Auflagen für Folgeschritt",
        //         entscheid: "Entscheid für Folgeschritt",
        //         sanktionen: "Sanktionen für Folgeschritt",
        //         weitereSanktionen: "Weitere Sanktionen für Folgeschritt",
        //         document: PathHelper.getDocumentPath("test.docx")
        //     });
        // });
    }
);
