import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { DossierKeyword } from "@keywords/dossier-keyword";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import { Wohnsituation } from "@keywords/wohnsituation-keyword";
import { AufgabenKeyword } from "@keywords/aufgaben-keyword";
import { PHKeyword } from "@keywords/ph-keyword";
import { DocumentKeyword } from "@keywords/document-keyword";
import { UmfeldKeyword } from "@keywords/umfeld-keyword";
import { BewilligungenKeywords } from "@keywords/bewilligungen-keywords";
import { BedarfsprufungKeyword } from "@keywords/bedarfsprufung-keyword";
import { RahmenbudgetKeyword } from "@keywords/rahmenbudget-keyword";
import { WSHKeyword } from "@keywords/wsh-keyword";
import { ZahlungenKeyword } from "@keywords/zahlungen-keyword";
import { BuchhaltungKeyword } from "@keywords/buchhaltung-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestUsers } from "@constants/credentials";
import { TestCompanies, Birthdays, HaushaltsEreignis, InHaushalt, TestMitarbeiter } from "@constants/testData";
import { generateAhvNumber, generateUniqueIban } from "@libs/utils/TestdataGenerator";
import { PathHelper } from "@utils/helpers/pathHelper";

test(
    "DossierKomplett_Journey",
    {
        tag: ["@[183873]", "@journey"]
    },
    async ({ page, seed, context, testData }) => {
        test.slow();

        const commonKeyword = new CommonKeyword(page);
        const dossierKeyword = new DossierKeyword(page);
        const klientschaftKeyword = new KlientschaftKeyword(page);
        const wohnsituation = new Wohnsituation(page);
        const aufgabenKeyword = new AufgabenKeyword(page);
        const phKeyword = new PHKeyword(page);
        const documentKeyword = new DocumentKeyword(page);
        const umfeldKeyword = new UmfeldKeyword(page);
        const bewilligungenKeywords = new BewilligungenKeywords(page);
        const bedarfsprufungKeyword = new BedarfsprufungKeyword(page);
        const rahmenbudgetKeyword = new RahmenbudgetKeyword(page);
        const wshKeyword = new WSHKeyword(page);
        const zahlungenKeyword = new ZahlungenKeyword(page);
        const buchhaltungKeyword = new BuchhaltungKeyword(page);

        const uniqueDossierId = sharedTestLogic.generateUniqueDossierId(seed, "Journey");
        const ahvNumber1 = generateAhvNumber(seed + "-1");
        const ahvNumber2 = generateAhvNumber(seed + "-2");
        const ahvNumber3 = generateAhvNumber(seed + "-3");
        const ahvNumber4 = generateAhvNumber(seed + "-4");
        const iban = generateUniqueIban(seed);
        const documentPath = PathHelper.getDocumentPath("JournalEintrag.docx");
        const policePath = PathHelper.getDocumentPath("KrankenVersicherungPolice.docx");
        const verwendungPeriode = [0, 1, 2, 3, 4, 5].map((i) => DateHelper.getMonthYearAsString(i)).join(",");

        // === Phase 1: Dossier-Erstellung (Sozialarbeiterin 1A) ===

        await test.step("L00_URLAventis", async () => {
            await commonKeyword.L00_URLAventis({ url: "/" });
        });

        await test.step("Stable_Login - Sozialarbeiterin 1A", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await test.step("P01_Person_Search", async () => {
            await dossierKeyword.P01_Person_Search({
                name: testData.persons.FIRST_PERSON.name,
                vorname: testData.persons.FIRST_PERSON.vorname,
                ahvNumber: "",
                geburtsdatum: ""
            });
        });

        await test.step("P05_Person_Create_Manual_Complete", async () => {
            await dossierKeyword.P05_Person_Create_Manual_Complete({
                name: testData.persons.FIRST_PERSON.name,
                vorname: testData.persons.FIRST_PERSON.vorname,
                ahvNumber: ahvNumber1,
                language: "Deutsch",
                zivilstand: "ledig",
                zivilstandSeit: DateHelper.getOneYearAgoString(),
                geburtsdatum: Birthdays.ADULT_1,
                national: "Schweiz",
                gender: "männlich",
                aufenthalt: "",
                aufenGultigVon: DateHelper.getOneMonthAgoString(),
                aufenGultigBis: ""
            });
        });

        await test.step("P10_Person_Communikation_Complete", async () => {
            await dossierKeyword.P10_Person_Communikation_Complete({
                mobile: "079 5305949",
                privateNumber: "079 5479429",
                email: "1704abc@gmail.com"
            });
        });

        await test.step("P15_Person_Adress", async () => {
            await dossierKeyword.P15_Person_Adress({
                zusatz: "",
                strasse: "Strasse_200",
                houseNumber: "66",
                ort: "3302 Moosseedorf",
                validDate: DateHelper.getOneYearAgoString()
            });
        });

        await test.step("P20_Person_ZahlungsVerbindung", async () => {
            await dossierKeyword.P20_Person_ZahlungsVerbindung({
                iban: iban
            });
        });

        await test.step("P30_Person_Uebernehmen", async () => {
            await dossierKeyword.P30_Person_Uebernehmen();
        });

        await test.step("H01_Haushalt_Uebernehmen_Zustaendigkeit", async () => {
            await dossierKeyword.H01_Haushalt_Uebernehmen_Zustaendigkeit({
                zust_Gemeinde: "Moosseedorf",
                zust_SozTeam: "Sozialarbeit Bern 1",
                zust_SozMitarbeiter: "Bern Sozialarbeiterin 1B",
                zust_SachbTeam: "Sachbearbeitung Bern",
                zust_SachbMitarbeiter: TestMitarbeiter.SACHBEARBEITERIN_BERN
            });
        });

        await test.step("D01_Dossier_Eroeffnen", async () => {
            await dossierKeyword.D01_Dossier_Eroeffnen({
                dossierBezeichnung: uniqueDossierId,
                eroeffnetAm: DateHelper.getTodayDateString(),
                dossierSprache: "Deutsch"
            });
        });

        // === Phase 2: Zahlungsverbindung Freigabe (Rollenwechsel) ===

        await test.step("BW04_ZahlungsVerbindung_Freigeben - Anfragen", async () => {
            await klientschaftKeyword.BW04_ZahlungsVerbindung_Freigeben({
                dossierInstitution: uniqueDossierId,
                klientschaft: testData.persons.FIRST_PERSON.fullName,
                buttonBewilligung: "Anfragen",
                checkStatus: "In Bearbeitung"
            });
        });

        await test.step("Stable_LogoutAndLoginDiffAccount - Sachbearbeiterin", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

        await test.step("DO11_Dossier_Search_Lupe", async () => {
            await commonKeyword.DO11_Dossier_Search_Lupe({
                searchDossierOrKlient: uniqueDossierId,
                resultType: "Dossiers"
            });
        });

        await test.step("KL01_Klientschaft_select", async () => {
            await klientschaftKeyword.KL01_Klientschaft_select({
                dossier: uniqueDossierId,
                klientschaft: testData.persons.FIRST_PERSON.fullName
            });
        });

        await test.step("BW04_ZahlungsVerbindung_Freigeben - Bewilligen", async () => {
            await klientschaftKeyword.BW04_ZahlungsVerbindung_Freigeben({
                dossierInstitution: uniqueDossierId,
                klientschaft: testData.persons.FIRST_PERSON.fullName,
                buttonBewilligung: "Bewilligen",
                checkStatus: "Bewilligt"
            });
        });

        await test.step("Stable_LogoutAndLoginDiffAccount - Sozialarbeiterin 1A", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await test.step("DO11_Dossier_Search_Lupe", async () => {
            await commonKeyword.DO11_Dossier_Search_Lupe({
                searchDossierOrKlient: uniqueDossierId,
                resultType: "Dossiers"
            });
        });

        // === Phase 3: Wohnsituation (Sozialarbeiterin 1A) ===

        await test.step("WO32_01b - Wohnung anpassen (initial)", async () => {
            await wohnsituation.WO32_01b_Wohnsituation_Haushalt_Wohnung_anpassen({
                vermieter: TestCompanies.GRABER_IMMOBILIEN,
                wohnungsgrosse: "4 Zimmer",
                mietkosten: 1200,
                nebenkosten: 100
            });
        });

        await test.step("WO30 - Person 2 hinzufuegen (Eheschliessung)", async () => {
            await wohnsituation.WO30_Wohnsituation_Haushalt_Person_Hinzufuegen({
                name: testData.persons.SECOND_PERSON.name,
                vorname: testData.persons.SECOND_PERSON.vorname,
                geburtsdatum: Birthdays.ADULT_2,
                ahvNumber: ahvNumber2,
                personInhausltVon: DateHelper.getOneYearAgoString(),
                inHauslt: InHaushalt.UEBERNEHMEN,
                ereignis: HaushaltsEreignis.EHESCHLIESSUNG
            });
        });

        await test.step("WO30 - Person 3 hinzufuegen (Kind 1)", async () => {
            await wohnsituation.WO30_Wohnsituation_Haushalt_Person_Hinzufuegen({
                name: testData.persons.THIRD_PERSON.name,
                vorname: testData.persons.THIRD_PERSON.vorname,
                geburtsdatum: Birthdays.KID_1,
                ahvNumber: ahvNumber3,
                personInhausltVon: DateHelper.getFirstDayOfTheYearString(),
                inHauslt: InHaushalt.UEBERNEHMEN,
                ereignis: HaushaltsEreignis.GEBURT
            });
        });

        await test.step("WO30 - Person 4 hinzufuegen (Kind 2)", async () => {
            await wohnsituation.WO30_Wohnsituation_Haushalt_Person_Hinzufuegen({
                name: testData.persons.FOURTH_PERSON.name,
                vorname: testData.persons.FOURTH_PERSON.vorname,
                geburtsdatum: Birthdays.KID_2,
                ahvNumber: ahvNumber4,
                personInhausltVon: DateHelper.getFirstDayOfTheYearString(),
                inHauslt: InHaushalt.UEBERNEHMEN,
                ereignis: HaushaltsEreignis.GEBURT
            });
        });

        await test.step("WO32_01b - Wohnung anpassen (erhoehte Kosten)", async () => {
            await wohnsituation.WO32_01b_Wohnsituation_Haushalt_Wohnung_anpassen({
                vermieter: TestCompanies.GRABER_IMMOBILIEN,
                wohnungsgrosse: "4 Zimmer",
                mietkosten: 3000,
                nebenkosten: 300
            });
        });

        // === Phase 4: Aufgaben, Krankenversicherungen, Journal, Ziele, Dokumente, Bezugsperson (Sozialarbeiterin 1A) ===

        await test.step("DO04_Aufgabe_erfassen", async () => {
            await aufgabenKeyword.DO04_Aufgabe_erfassen({
                aufgabenStatus: "Nicht begonnen",
                aufgabenTitel: "Journey Test Aufgabe",
                faelligkeitDatum: DateHelper.getLastDayOfYearString(),
                zugewiesenAn: TestMitarbeiter.SOZIALARBEITERIN_1A,
                check: "Journey Test Aufgabe"
            });
        });

        await test.step("DO11_Dossier_Search_Lupe", async () => {
            await commonKeyword.DO11_Dossier_Search_Lupe({
                searchDossierOrKlient: uniqueDossierId,
                resultType: "Dossiers"
            });
        });

        await test.step("KL10_Krankenversicherungen_VVG_erfassen", async () => {
            await klientschaftKeyword.KL10_Krankenversicherungen_VVG_erfassen({
                klientschaft: testData.persons.FIRST_PERSON.fullName,
                Gueltigkeit: `${DateHelper.getFirstDayOfTheYearString()} - ${DateHelper.getLastDayOfYearString()}`,
                KKasse: "Arcosana AG",
                VersNummer: "123",
                GrundPraemie: "45",
                ZahnInklusive: "ja",
                Franchise: "100",
                Bemerkung: "Test"
            });
        });

        await test.step("KL11b_Krankenversicherungen_KVG_erfassen", async () => {
            await klientschaftKeyword.KL11b_Krankenversicherungen_KVG_erfassen({
                klientschaft: testData.persons.FIRST_PERSON.fullName,
                gueltigkeit: `${DateHelper.getFirstDayOfTheYearString()} - ${DateHelper.getLastDayOfYearString()}`,
                kKasse: "Arcosana AG",
                versNummer: "123",
                grundPraemie: "450",
                unfall: "ja",
                franchise: "100",
                bemerkung: "Test",
                IPV: "65",
                police: policePath
            });
        });

        await test.step("DO11_Dossier_Search_Lupe", async () => {
            await commonKeyword.DO11_Dossier_Search_Lupe({
                searchDossierOrKlient: uniqueDossierId,
                resultType: "Dossiers"
            });
        });

        await test.step("PH01_JournalEintrag_erfassen", async () => {
            await phKeyword.PH01_JournalEintrag_erfassen({
                titel: "Journey Test Gespraech",
                erstelltAm: DateHelper.getTodayDateString(),
                jurnalArt: "Gespräch",
                thema: "Bildung",
                relevantSanktion: "x",
                interneVerwendung: "",
                teilnehmende: testData.persons.FIRST_PERSON.fullName,
                betroffene: testData.persons.FIRST_PERSON.fullName,
                notiz: "Journey Test Notiz",
                dateiPfad: documentPath
            });
        });

        await test.step("PH04_Ziele_erfassen", async () => {
            await phKeyword.PH04_Ziele_erfassen({
                Titel: "Journey Test Ziel",
                ZielVom: DateHelper.getTodayDateString(),
                FristBis: DateHelper.getLastDayOfYearString(),
                Mitarbeiter: TestMitarbeiter.SOZIALARBEITERIN_1A,
                Klientschaft: testData.persons.FIRST_PERSON.fullName,
                Thema: "Bildung",
                Status: "offen",
                Beschreibung: "Journey Test Beschreibung",
                ErwarteteHandlung: "Journey Test Handlung",
                BeschaeftigungsMassnahme: "Journey Test Massnahme",
                Partner: "AFOREM"
            });
        });

        await test.step("PH05_Zielvereinbarung_ohneWorkflow_erfassen", async () => {
            await phKeyword.PH05_Zielvereinbarung_ohneWorkflow_erfassen({
                dossier: uniqueDossierId,
                bemerkung: "Journey Test Bemerkung",
                zugeZielTitelSelect: "Journey Test Ziel",
                unterzeichnZielvereinbarungPfad: ""
            });
        });

        await test.step("DO11_Dossier_Search_Lupe", async () => {
            await commonKeyword.DO11_Dossier_Search_Lupe({
                searchDossierOrKlient: uniqueDossierId,
                resultType: "Dossiers"
            });
        });

        await test.step("H04_Dokumente_ausVorlage_erstellen_IIS_Form", async () => {
            await documentKeyword.H04_Dokumente_ausVorlage_erstellen_IIS_Form({
                vorlage: "IIZ Formular",
                sprache: "Deutsch",
                titel: "Journey Test Dokument",
                klient: testData.persons.FIRST_PERSON.fullName,
                adresse: "Wohnsituation: Strasse_200 66, 3302 Moosseedorf"
            });
        });

        await test.step("DO11_Dossier_Search_Lupe", async () => {
            await commonKeyword.DO11_Dossier_Search_Lupe({
                searchDossierOrKlient: uniqueDossierId,
                resultType: "Dossiers"
            });
        });

        await test.step("H04_Dokumente_ausVorlage_erstellen_IIS_Form (2)", async () => {
            await documentKeyword.H04_Dokumente_ausVorlage_erstellen_IIS_Form({
                vorlage: "IIZ Formular",
                sprache: "Deutsch",
                titel: "Journey Test Dokument 2",
                klient: testData.persons.FIRST_PERSON.fullName,
                adresse: "Wohnsituation: Strasse_200 66, 3302 Moosseedorf"
            });
        });

        await test.step("U01_Bezugsperson_erfassen", async () => {
            await umfeldKeyword.U01_Bezugsperson_erfassen({
                name: "Moser",
                vorname: "Luici",
                rolle: "Clown",
                zusatz: "",
                strasse: "Strassenweg",
                hausNummer: "12",
                Ort: "4566 Halten"
            });
        });

        await test.step("U01b_Bezugsperson_ZahlVerbindung_erfassen", async () => {
            await umfeldKeyword.U01b_Bezugsperson_ZahlVerbindung_erfassen({
                dossier: uniqueDossierId,
                bezPerson: "Moser, Luici",
                IBAN: "CH21 0078 9100 0000 2920 0",
                gueltigVon: DateHelper.getTodayDateString(),
                gueltigBis: DateHelper.getLastDayOfYearString(),
                strasse: "Weg",
                nummer: "12",
                postfach: "",
                ort: "4566 Halten",
                datei: ""
            });
        });

        await test.step("U01c_Bezugsperson_ZahlVerbindung_freigeben", async () => {
            await umfeldKeyword.U01c_Bezugsperson_ZahlVerbindung_freigeben({
                dossier: uniqueDossierId,
                bezPerson: "Moser, Luici"
            });
        });

        await test.step("Stable_LogoutAndLoginDiffAccount - Sachbearbeiterin", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

        await test.step("E01_Delay", async () => {
            await commonKeyword.E01_Delay.call(commonKeyword, { Pause: "3000" });
        });

        await test.step("BW02_Bewilligungs_Workflow_Step - Bezugsperson ZV bewilligen", async () => {
            await bewilligungenKeywords.BW02_Bewilligungs_Workflow_Step({
                dossier: uniqueDossierId,
                buttonName: "Bewilligen",
                checkStatus: "Bewilligt"
            });
        });

        // === Phase 5: Erwerbssituation, Bedarfspruefung, Rahmenbudget & Bewilligung ===

        await test.step("Stable_LogoutAndLoginDiffAccount - Sozialarbeiterin 1A", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await test.step("KL01_Klientschaft_select", async () => {
            await klientschaftKeyword.KL01_Klientschaft_select({
                dossier: uniqueDossierId,
                klientschaft: testData.persons.FIRST_PERSON.fullName
            });
        });

        await test.step("KL03_ErwerbsituationEinnahmen_Lohn_erfassen", async () => {
            await klientschaftKeyword.KL03_ErwerbsituationEinnahmen_Lohn_erfassen({
                zahlbarDurch: TestCompanies.BKW,
                pensumm: "100",
                betrag: "1000",
                gueltigVon: DateHelper.getFirstDayOfTheYearString(),
                gueltigBis: DateHelper.getLastDayOfYearString(),
                checkbox: "x",
                migration: ""
            });
        });

        await test.step("DO11_Dossier_Search_Lupe", async () => {
            await commonKeyword.DO11_Dossier_Search_Lupe({
                searchDossierOrKlient: uniqueDossierId,
                resultType: "Dossiers"
            });
        });

        await test.step("KL01_Klientschaft_select", async () => {
            await klientschaftKeyword.KL01_Klientschaft_select({
                dossier: uniqueDossierId,
                klientschaft: testData.persons.FIRST_PERSON.fullName
            });
        });

        await test.step("A01_AnspruchPruefung_Bedarfspruefung", async () => {
            await bedarfsprufungKeyword.A01_AnspruchPruefung_Bedarfspruefung({
                entscheidVom: DateHelper.getTodayDateString(),
                begrundung: "Journey Test Begruendung",
                unterstutzungab: DateHelper.getFirstDayOfTheYearString()
            });
        });

        await test.step("E01_Delay", async () => {
            await commonKeyword.E01_Delay.call(commonKeyword, { Pause: "6000" });
        });

        await test.step("R01_Rahmenbudget_Wohnkosten_Anpassen_V2", async () => {
            await rahmenbudgetKeyword.R01_Rahmenbudget_Wohnkosten_Anpassen_V2({
                ubernahmeWohnkostenCFH: 100,
                uebernahmeWohnkostenVon: DateHelper.getFirstDayOfTheYearString(),
                uebernahmeWohnkostenBis: DateHelper.getLastDayOfYearString(),
                uebernahemBegruendung: "Die Wohnungen sind teuer hier"
            });
        });

        await test.step("BW01_Bewilligungs_Workflow_LeistungsEntscheid", async () => {
            await bewilligungenKeywords.BW01_Bewilligungs_Workflow_LeistungsEntscheid({
                lEvonDate: DateHelper.getFirstDayOfTheYearString(),
                lEbisDate: DateHelper.getLastDayOfFutureYearString(),
                checkStatus: "In Bearbeitung"
            });
        });

        await test.step("Stable_LogoutAndLoginDiffAccount - Sachbearbeiterin", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

        await test.step("BW02b - Pruefung OK", async () => {
            await bewilligungenKeywords.BW02b_Bewilligungs_Workflow_Step_V2({
                dossier: uniqueDossierId,
                buttonName: "Prüfung OK",
                checkEntscheid: "Geprüft"
            });
        });

        await test.step("Stable_LogoutAndLoginDiffAccount - Gemeinde-MA", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.GEMEINDE_MA.username, TestUsers.GEMEINDE_MA.password);
        });

        await test.step("BW02b - Bewilligen", async () => {
            await bewilligungenKeywords.BW02b_Bewilligungs_Workflow_Step_V2({
                dossier: uniqueDossierId,
                buttonName: "Bewilligen",
                checkEntscheid: ""
            });
        });

        await test.step("Stable_LogoutAndLoginDiffAccount - Sachbearbeiterin", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

        await test.step("DO11_Dossier_Search_Lupe", async () => {
            await commonKeyword.DO11_Dossier_Search_Lupe({
                searchDossierOrKlient: uniqueDossierId,
                resultType: "Dossiers"
            });
        });

        await test.step("BW03b_Bewilligungs_WF_FreigabeVerwendungsPeriode", async () => {
            await bewilligungenKeywords.BW03b_Bewilligungs_WF_FreigabeVerwendungsPeriode({
                verwendungPeriode: verwendungPeriode,
                status: "Zu bezahlen"
            });
        });

        // === Phase 6: Sozialhilfeschuld & Zahlungen ===

        await test.step("WSH05_Haftung_Sozialhilfeschuld_Bearbeiten", async () => {
            await wshKeyword.WSH05_Haftung_Sozialhilfeschuld_Bearbeiten({
                haftungsType: "Einseitige Solidarhaftung erfassen",
                haftungDurch: testData.persons.FIRST_PERSON.fullName,
                haftungVon: DateHelper.getFirstDayOfTheYearString(),
                haftungBis: DateHelper.getLastDayOfFutureYearString(),
                haftungFuer: testData.persons.SECOND_PERSON.fullName,
                person1: "",
                person2: ""
            });
        });

        await test.step("A00_BrowserRefresh_F5", async () => {
            await commonKeyword.A00_BrowserRefresh_F5();
        });

        await test.step("DO11_Dossier_Search_Lupe", async () => {
            await commonKeyword.DO11_Dossier_Search_Lupe({
                searchDossierOrKlient: uniqueDossierId,
                resultType: "Dossiers"
            });
        });

        await test.step("Z01_WSH_Zahlungen_Freigeben", async () => {
            await zahlungenKeyword.Z01_WSH_Zahlungen_Freigeben({
                dossierInstitution: uniqueDossierId,
                freigegebeneZahlungen: ""
            });
        });

        await test.step("Stable_LogoutAndLoginDiffAccount - Buchhalter", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.BUCHHALTER.username, TestUsers.BUCHHALTER.password);
        });

        await test.step("BU01_ZahlungsAuftrag_Erstellen", async () => {
            await buchhaltungKeyword.BU01_ZahlungsAuftrag_Erstellen({
                bisValutaDatum: DateHelper.getLastDayOfYearString(),
                dossier: uniqueDossierId,
                checkZahlungTotal: "",
                buchhaltung: "Regionaler Sozialdienst",
                zustGemeinde: "Moosseedorf"
            });
        });
    }
);
