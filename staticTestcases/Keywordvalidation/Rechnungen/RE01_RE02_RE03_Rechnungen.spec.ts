import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { ErfassungKeyword } from "@keywords/erfassung-keyword";
import { Wohnsituation } from "@keywords/wohnsituation-keyword";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import { BedarfsprufungKeyword } from "@keywords/bedarfsprufung-keyword";
import { BewilligungenKeywords } from "@keywords/bewilligungen-keywords";
import { RechnungPage } from "@pages/rechnung-page";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestUsers } from "@constants/credentials";
import { TestCompanies } from "@constants/testData";
import { PathHelper } from "@utils/helpers/pathHelper";

test(
    "RE01_RE02_RE03_Rechnungen_Referenznummer",
    {
        tag: ["@[183871]", "@keywordValidation", "@coreBusiness", "@rechnungen"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        test.slow();

        const commonKeyword = new CommonKeyword(page);
        const erfassungKeyword = new ErfassungKeyword(page);
        const wohnsituationKeyword = new Wohnsituation(page);
        const klientschaftKeyword = new KlientschaftKeyword(page);
        const bedarfsprufungKeyword = new BedarfsprufungKeyword(page);
        const bewilligungenKeywords = new BewilligungenKeywords(page);
        const rechnungPage = new RechnungPage(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        const rechnungNummer = `R-${seed.substring(0, 8)}`;
        const qrRechnungPath = PathHelper.getDocumentPath("QRRechnung.pdf");

        // ========================================================================
        // PHASE 1: Login und Dossier erstellen (als Sozialarbeiterin)
        // ========================================================================

        await test.step("M01_LoginMSOnline - Sozialarbeiterin 1A", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        const dossierId = await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);

        // ========================================================================
        // PHASE 2: Zahlungsverbindung freigeben
        // ========================================================================
        await test.step("BW04_ZahlungsVerbindung_Anfragen", async () => {
            await klientschaftKeyword.BW04_ZahlungsVerbindung_Freigeben_OhneNavigation({
                klientschaft: testData.persons.FIRST_PERSON.fullName,
                buttonBewilligung: "Anfragen",
                checkStatus: "In Bearbeitung"
            });
        });

        await test.step("L03_LogoutAndLoginDiffAccount - Sachbearbeiterin", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

        await test.step("KL01_Klientschaft_select", async () => {
            await klientschaftKeyword.KL01_Klientschaft_select({
                dossier: uniqueDossiertId,
                klientschaft: testData.persons.FIRST_PERSON.fullName
            });
        });

        await test.step("BW04_ZahlungsVerbindung_Bewilligen", async () => {
            await klientschaftKeyword.BW04_ZahlungsVerbindung_Freigeben({
                dossierInstitution: uniqueDossiertId,
                klientschaft: testData.persons.FIRST_PERSON.fullName,
                buttonBewilligung: "Bewilligen",
                checkStatus: "Bewilligt"
            });
        });

        // ========================================================================
        // PHASE 3: Wohnsituation + Erwerbssituation (Sozialarbeiterin)
        // ========================================================================
        await test.step("L03_LogoutAndLoginDiffAccount - Sozialarbeiterin 1A", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierId);
        });

        await test.step("WO32_01b_Wohnsituation_Haushalt_Wohnung_anpassen", async () => {
            await wohnsituationKeyword.WO32_01b_Wohnsituation_Haushalt_Wohnung_anpassen({
                vermieter: "Graber Immobilien",
                wohnungsgrosse: "4 Zimmer",
                mietkosten: 1200,
                nebenkosten: 100
            });
        });

        await test.step("KL01_Klientschaft_select", async () => {
            await klientschaftKeyword.KL01_Klientschaft_select({
                dossier: uniqueDossiertId,
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

        // ========================================================================
        // PHASE 4: Bedarfsprüfung und Leistungsentscheid
        // ========================================================================
        await test.step("DO11_Dossier_Search_Lupe", async () => {
            await commonKeyword.DO11_Dossier_Search_Lupe({
                searchDossierOrKlient: uniqueDossiertId,
                resultType: "Dossiers"
            });
        });

        await test.step("A01_AnspruchPruefung_Bedarfspruefung", async () => {
            await bedarfsprufungKeyword.A01_AnspruchPruefung_Bedarfspruefung({
                entscheidVom: DateHelper.getTodayDateString(),
                begrundung: "Begründung für Rechnungstest",
                unterstutzungab: DateHelper.getFirstOfMonthString()
            });
        });

        await test.step("BW01_Bewilligungs_Workflow_LeistungsEntscheid", async () => {
            await bewilligungenKeywords.BW01_Bewilligungs_Workflow_LeistungsEntscheid({
                lEvonDate: DateHelper.getFirstOfMonthString(),
                lEbisDate: DateHelper.getDaysFutureString(365),
                checkStatus: "In Bearbeitung"
            });
        });

        // ========================================================================
        // PHASE 5: Bewilligungsworkflow
        // ========================================================================
        await test.step("L03_LogoutAndLoginDiffAccount - Sachbearbeiterin", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

        await test.step("BW02b_Bewilligungs_Workflow_Step - Prüfung OK", async () => {
            await bewilligungenKeywords.BW02b_Bewilligungs_Workflow_Step_V2({
                dossier: uniqueDossiertId,
                buttonName: "Prüfung OK",
                checkEntscheid: "Geprüft"
            });
        });

        await test.step("L03_LogoutAndLoginDiffAccount - Gemeinde-MA", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.GEMEINDE_MA.username, TestUsers.GEMEINDE_MA.password);
        });

        await test.step("BW02b_Bewilligungs_Workflow_Step - Bewilligen", async () => {
            await bewilligungenKeywords.BW02b_Bewilligungs_Workflow_Step_V2({
                dossier: uniqueDossiertId,
                buttonName: "Bewilligen",
                checkEntscheid: ""
            });
        });

        // ========================================================================
        // PHASE 6: Freigabe Verwendungsperiode (Sachbearbeiterin)
        // ========================================================================
        await test.step("L03_LogoutAndLoginDiffAccount - Sachbearbeiterin", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

        await test.step("DO11_Dossier_Search_Lupe", async () => {
            await commonKeyword.DO11_Dossier_Search_Lupe({
                searchDossierOrKlient: uniqueDossiertId,
                resultType: "Dossiers"
            });
        });

        await test.step("BW03b_Bewilligungs_WF_FreigabeVerwendungsPeriode", async () => {
            await bewilligungenKeywords.BW03b_Bewilligungs_WF_FreigabeVerwendungsPeriode({
                verwendungPeriode: `${DateHelper.getMonthYearAsString()},${DateHelper.getMonthYearAsString(0)},${DateHelper.getMonthYearAsString(1)},${DateHelper.getMonthYearAsString(2)},${DateHelper.getMonthYearAsString(3)},${DateHelper.getMonthYearAsString(4)},${DateHelper.getMonthYearAsString(5)}`,
                status: "Zu bezahlen"
            });
        });

        // ========================================================================
        // PHASE 7: RE01 - Rechnung via Dokumenteneingang (Sachbearbeiterin)
        // Key fix: pass leistung "WSH" to associate document with WSH leistung
        // ========================================================================
        await test.step("RE01_Rechnung_DokEingang_Erfassen", async () => {
            await erfassungKeyword.RE01_Rechnung_DokEingang_Erfassen({
                sozialDienstRegion: `Regionaler Sozialdienst "Bern"`,
                document: qrRechnungPath,
                dossierBezeichnung: uniqueDossiertId,
                leistung: "WSH",
                klient: testData.persons.FIRST_PERSON.fullName,
                docTitle: `Rechnung ${rechnungNummer}`,
                button: "Verarbeiten und Schliessen"
            });
        });

        // ========================================================================
        // PHASE 8: RE02 - Rechnung bearbeiten (Buchhalter)
        // Includes new Referenznummer field from User Story
        // ========================================================================
        await test.step("L03_LogoutAndLoginDiffAccount - Buchhalter", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.BUCHHALTER.username, TestUsers.BUCHHALTER.password);
        });

        await test.step("RE02_Rechnung_DokEingang_Bearbeiten", async () => {
            await erfassungKeyword.RE02_Rechnung_DokEingang_Bearbeiten({
                dossier: uniqueDossiertId,
                zahlEmpfaenger: TestCompanies.BKW,
                betrag: 550,
                selBelDatum: "",
                selValutaDatum: "",
                statusSet: "zur Freigabe",
                setBelDatum: DateHelper.getTodayDateString(),
                rechNummer: rechnungNummer,
                referenzNummer: "",
                kommentar: "Testrechnung",
                faellDatum: DateHelper.getLastDayOfYearString(),
                finanzierung: "Eigenkompetenz",
                konto: "3310.01 Wohnkosten gem. Richtlinien",
                betrifftPerson: "",
                zahlBetrag: 550
            });
        });

        // ========================================================================
        // PHASE 10: Verify search in "Zahlungen und Rechnungen freigeben" (Sachbearbeiterin)
        // User Story: Rechnungen-Tab Suchfeld soll Referenznummer berücksichtigen
        // Done BEFORE RE03 approval because invoice moves to different state after
        // ========================================================================
        await test.step("L03_LogoutAndLoginDiffAccount - Sachbearbeiterin", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

        await test.step("Navigate to Zahlungen und Rechnungen freigeben", async () => {
            await rechnungPage.navigation.gotoZahlungen();
        });

        await test.step("Verify search by Rechnungsnummer in Rechnungen tab", async () => {
            await rechnungPage.searchInRechnungenTabAndVerify(rechnungNummer, uniqueDossiertId);
        });

        await commonKeyword.E01_Delay({ Pause: 5000 }); // Add delay to ensure UI is updated before next search

        // ========================================================================
        // PHASE 11: RE03 - Rechnung freigeben (Sachbearbeiterin)
        // ========================================================================
        await test.step("RE03_Rechnung_Freigeben", async () => {
            await erfassungKeyword.RE03_Rechnung_Freigeben({
                dossier: uniqueDossiertId,
                zahlEmpfaenger: TestCompanies.BKW,
                belDatum: DateHelper.getTodayDateString(),
                valutaDatum: DateHelper.getLastDayOfYearString(),
                betrag: 550,
                kommentar: "Freigabe Test",
                statusNeu: "Freigeben"
            });
        });
    }
);
