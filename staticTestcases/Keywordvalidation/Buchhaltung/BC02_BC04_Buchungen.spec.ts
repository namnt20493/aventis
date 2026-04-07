import { test } from "@libs/test-fixtures";

import { CommonKeyword } from "@libs/keywords";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import { Wohnsituation } from "@keywords/wohnsituation-keyword";
import { BedarfsprufungKeyword } from "@keywords/bedarfsprufung-keyword";
import { RahmenbudgetKeyword } from "@keywords/rahmenbudget-keyword";
import { BewilligungenKeywords } from "@keywords/bewilligungen-keywords";
import { ZahlungenKeyword } from "@keywords/zahlungen-keyword";
import { BuchhaltungKeyword } from "@keywords/buchhaltung-keyword";
import { BuchungsJournalKeyword } from "@keywords/buchungsJournal-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestUsers } from "@constants/credentials";
import { TestCompanies } from "@constants/testData";

test(
    "BC02_BC04_Buchungen",
    {
        annotation: { type: "known-bug", description: "https://diartis.visualstudio.com/Aventis/_workitems/edit/184290" },
        tag: ["@[184094]", "@buchhaltung", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        test.skip();
        test.slow();
        const commonKeyword = new CommonKeyword(page);
        const klientschaftKeyword = new KlientschaftKeyword(page);
        const wohnsituation = new Wohnsituation(page);
        const bedarfsprufungKeyword = new BedarfsprufungKeyword(page);
        const rahmenbudgetKeyword = new RahmenbudgetKeyword(page);
        const bewilligungenKeywords = new BewilligungenKeywords(page);
        const zahlungenKeyword = new ZahlungenKeyword(page);
        const buchhaltungKeyword = new BuchhaltungKeyword(page);
        const buchungsJournalKeyword = new BuchungsJournalKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        const verwendungPeriode = [0, 1, 2, 3, 4, 5].map((i) => DateHelper.getMonthYearAsString(i)).join(",");

        // === SETUP: Dossier + Zahlungsverbindung via API ===
        const dossierGuid = await sharedTestLogic.generateDossierViaApi(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId, context);
        await sharedTestLogic.addZahlungsVerbindung(commonKeyword, page, klientschaftKeyword, uniqueDossiertId, context, testData.persons);

        // === Wohnsituation erfassen (Sozialarbeiterin 1A) ===
        await test.step("L03_LogoutAndLoginDiffAccount - Sozialarbeiterin", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierGuid);
        });

        await test.step("WO32_01b - Wohnung anpassen", async () => {
            await wohnsituation.WO32_01b_Wohnsituation_Haushalt_Wohnung_anpassen({
                vermieter: TestCompanies.GRABER_IMMOBILIEN,
                wohnungsgrosse: "4 Zimmer",
                mietkosten: 1200,
                nebenkosten: 100
            });
        });

        // === Erwerbssituation + Bedarfspruefung ===
        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierGuid);
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

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierGuid);
        });

        await test.step("KL01_Klientschaft_select", async () => {
            await klientschaftKeyword.KL01_Klientschaft_select({
                dossier: uniqueDossiertId,
                klientschaft: testData.persons.FIRST_PERSON.fullName
            });
        });

        await test.step("A01_AnspruchPruefung_Bedarfspruefung", async () => {
            await bedarfsprufungKeyword.A01_AnspruchPruefung_Bedarfspruefung({
                entscheidVom: DateHelper.getTodayDateString(),
                begrundung: "Test BC02/BC04 Buchungen Keywords",
                unterstutzungab: DateHelper.getFirstDayOfTheYearString()
            });
        });

        // === Rahmenbudget Wohnkosten anpassen ===
        await test.step("R01_Rahmenbudget_Wohnkosten_Anpassen_V2", async () => {
            await rahmenbudgetKeyword.R01_Rahmenbudget_Wohnkosten_Anpassen_V2({
                ubernahmeWohnkostenCFH: 100,
                uebernahmeWohnkostenVon: DateHelper.getFirstDayOfTheYearString(),
                uebernahmeWohnkostenBis: DateHelper.getLastDayOfYearString(),
                uebernahemBegruendung: "Wohnkosten Anpassung fuer BC02/BC04"
            });
        });

        // === Bewilligungs-Workflow ===
        await test.step("BW01_Bewilligungs_Workflow_LeistungsEntscheid", async () => {
            await bewilligungenKeywords.BW01_Bewilligungs_Workflow_LeistungsEntscheid({
                lEvonDate: DateHelper.getFirstDayOfTheYearString(),
                lEbisDate: DateHelper.getLastDayOfFutureYearString(),
                checkStatus: "In Bearbeitung"
            });
        });

        await test.step("L03_LogoutAndLoginDiffAccount - Sachbearbeiterin", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

        await test.step("BW02b_Bewilligungs_Workflow_Step_V2 - Pruefung OK", async () => {
            await bewilligungenKeywords.BW02b_Bewilligungs_Workflow_Step_V2({
                dossier: uniqueDossiertId,
                buttonName: "Prüfung OK",
                checkEntscheid: "Geprüft"
            });
        });

        await test.step("L03_LogoutAndLoginDiffAccount - Gemeinde-MA", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.GEMEINDE_MA.username, TestUsers.GEMEINDE_MA.password);
        });

        await test.step("BW02b_Bewilligungs_Workflow_Step_V2 - Bewilligen", async () => {
            await bewilligungenKeywords.BW02b_Bewilligungs_Workflow_Step_V2({
                dossier: uniqueDossiertId,
                buttonName: "Bewilligen",
                checkEntscheid: ""
            });
        });

        // === Verwendungsperiode freigeben ===
        await test.step("L03_LogoutAndLoginDiffAccount - Sachbearbeiterin", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierGuid);
        });

        await test.step("BW03b_Bewilligungs_WF_FreigabeVerwendungsPeriode", async () => {
            await bewilligungenKeywords.BW03b_Bewilligungs_WF_FreigabeVerwendungsPeriode({
                verwendungPeriode: verwendungPeriode,
                status: "Zu bezahlen"
            });
        });

        // === Zahlungen freigeben ===
        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierGuid);
        });

        await test.step("Z01_WSH_Zahlungen_Freigeben", async () => {
            await zahlungenKeyword.Z01_WSH_Zahlungen_Freigeben({
                dossierInstitution: uniqueDossiertId,
                freigegebeneZahlungen: ""
            });
        });

        // === KEYWORD VALIDATION: BC02 - Pending Vorbuchungen pruefen (VOR Import) ===
        await test.step("L03_LogoutAndLoginDiffAccount - Superuser fuer BC02", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SUPERUSER.username, TestUsers.SUPERUSER.password);
        });

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierGuid);
        });

        await test.step("BC02_Buchungen_importieren_Check", async () => {
            await buchhaltungKeyword.BC02_Buchungen_importieren_Check({
                bisDatum: DateHelper.getLastDayOfYearString(),
                dossier: uniqueDossiertId,
                zustGemeinde: "Moosseedorf",
                buDate: "",
                buText: "GBL",
                IBAN: "",
                sumBetrag: ""
            });
        });

        await test.step("Close_BC02_Dialog", async () => {
            const closeBtn = page.getByRole("button", { name: /Schliessen|schliessen/i });
            if (await closeBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
                await closeBtn.click();
            } else {
                await page.keyboard.press("Escape");
            }
        });

        // === BU01: Vorbuchungen importieren + Zahlungsauftrag erstellen (Buchhalter) ===
        await test.step("L03_LogoutAndLoginDiffAccount - Buchhalter", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.BUCHHALTER.username, TestUsers.BUCHHALTER.password);
        });

        await test.step("BU01_ZahlungsAuftrag_Erstellen", async () => {
            await buchhaltungKeyword.BU01_ZahlungsAuftrag_Erstellen({
                bisValutaDatum: DateHelper.getLastDayOfYearString(),
                dossier: uniqueDossiertId,
                checkZahlungTotal: "",
                buchhaltung: "Regionaler Sozialdienst",
                zustGemeinde: "Moosseedorf"
            });
        });

        // === KEYWORD VALIDATION: BC04 - BuchungsJournal pruefen (NACH Import) ===
        // Stay as BUCHHALTER (already logged in from BU01) - correct default Buchhaltung for Bern dossiers

        await test.step("BC04_BuchungsJournal_filtern", async () => {
            await buchungsJournalKeyword.BC04_BuchungsJournal_filtern({
                buchaltung: "",
                zeitRaum: DateHelper.getLastDayOfYearString(),
                belegNummer: "",
                dossier: uniqueDossiertId,
                zeitRaumTyp: "Verwendungsperiode",
                anzeigeDetail: "Beleg",
                konten: "2000.01",
                total: ""
            });
        });
    }
);
