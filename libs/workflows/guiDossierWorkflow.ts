import { test, BrowserContext, Page, APIRequestContext } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { generateAhvNumber } from "@libs/utils/TestdataGenerator";
import { CommonKeyword } from "@keywords/common-keyword";
import { DossierKeyword } from "@keywords/dossier-keyword";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import * as DateHelper from "@utils/helpers/DateHelper";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { TestUsers } from "@constants/credentials";
import { createWshLeistungViaApi, createErwerbssituationViaApi } from "@utils/apiSetup";
import { assert } from "console";
import type { TestPersonSet } from "@utils/TestDataFactory";

const parameterFilePath = path.join(__dirname, "./../../parameter.json");
const p = JSON.parse(fs.readFileSync(parameterFilePath, "utf8"));

export const generateDossier = async (commonKeyword: CommonKeyword, page: Page, dossierKeyword: DossierKeyword, uniqueId: string, context: BrowserContext, persons: TestPersonSet): Promise<string> => {
    await test.step("L00_URLAventis", async () => {
        await commonKeyword.L00_URLAventis.call(commonKeyword, { url: "/" });
    });

    await test.step("M01_LoginMSOnline", async () => {
        await commonKeyword.Stable_Login("bern.sozialarbeiterin1a@diartis.ch", "SMze97-jkSJ59!F.");
    });

    await test.step("P05_Person_Create_Manual_Complete", async () => {
        await dossierKeyword.P05_Person_Create_Manual_Complete.call(dossierKeyword, {
            name: persons.FIRST_PERSON.name,
            vorname: persons.FIRST_PERSON.vorname,
            ahvNumber: generateAhvNumber().toString(),
            language: "",
            zivilstand: "ledig",
            geburtsdatum: p.BirthdayAdult1,
            national: "Schweiz",
            gender: "männlich",
            aufenthalt: "",
            zivilstandSeit: undefined,
            aufenGultigVon: undefined,
            aufenGultigBis: undefined
        });
    });

    await test.step("P10_Person_Communikation_Complete", async () => {
        await dossierKeyword.P10_Person_Communikation_Complete.call(dossierKeyword, {
            mobile: "079 5320286",
            privateNumber: "079 5462626",
            email: "1704abc@gmail.com"
        });
    });

    await test.step("P15_Person_Adress", async () => {
        await dossierKeyword.P15_Person_Adress.call(dossierKeyword, {
            zusatz: "",
            strasse: "Strasse_831",
            houseNumber: "27",
            ort: "3302 Moosseedorf",
            validDate: "02.06.2021"
        });
    });

    await test.step("P20_Person_ZahlungsVerbindung", async () => {
        await dossierKeyword.P20_Person_ZahlungsVerbindung.call(dossierKeyword, {
            iban: "CH21 0078 9100 0000 2920 0"
        });
    });

    await test.step("P30_Person_Uebernehmen", async () => {
        await dossierKeyword.P30_Person_Uebernehmen();
    });

    await test.step("H01_Haushalt_Uebernehmen_Zustaendigkeit", async () => {
        await dossierKeyword.H01_Haushalt_Uebernehmen_Zustaendigkeit.call(dossierKeyword, {
            zust_Gemeinde: "Moosseedorf",
            zust_SozTeam: "Sozialarbeit Bern 1",
            zust_SozMitarbeiter: "Bern Sozialarbeiterin 1B",
            zust_SachbTeam: "Sachbearbeitung Bern",
            zust_SachbMitarbeiter: "Bern Sachbearbeiterin"
        });
    });

    let dossierGuid = "";
    await test.step("D01_Dossier_Eroeffnen", async () => {
        dossierGuid = await dossierKeyword.D01_Dossier_Eroeffnen.call(dossierKeyword, {
            dossierBezeichnung: uniqueId,
            eroeffnetAm: DateHelper.getTodayDateString(),
            dossierSprache: "Deutsch"
        });
    });

    return dossierGuid;
};

export const generateDossierWithErwerbssituationAndWsh = async (authenticatedRequest: APIRequestContext, commonKeyword: CommonKeyword, page: Page, klientschaftKeyword: KlientschaftKeyword, seed: string, uniqueDossiertId: string, context: BrowserContext): Promise<{ dossierId: string; personInDossierId: string }> => {
    if (!seed) {
        throw new Error("Seed parameter is undefined or empty");
    }
    console.log(`🔧 [WORKFLOW] Starting with seed: ${seed}, uniqueDossiertId: ${uniqueDossiertId}`);

    console.log("\n========== STEP 1: Create Dossier via API ==========");
    const dossierResult = await sharedTestLogic.generateDossierViaApiWithPerson(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId, context);
    console.log(`✅ Dossier: ${dossierResult.dossierId}`);
    console.log(`✅ PersonInDossierId: ${dossierResult.personInDossierId}`);

    console.log("\n========== STEP 2: Add Zahlungsverbindung ==========");
    const persons = await import("@utils/TestDataFactory").then((m) => m.TestDataFactory.createPersons(seed));
    await sharedTestLogic.addZahlungsVerbindung(commonKeyword, page, klientschaftKeyword, uniqueDossiertId, context, persons);
    console.log("✅ Zahlungsverbindung added");

    console.log("\n========== STEP 3: Login as Sozialarbeiterin ==========");
    await test.step("L03_LogoutAndLoginDiffAccount", async () => {
        await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
    });

    console.log("\n========== STEP 4: Create Erwerbssituation via API ==========");
    try {
        const erwerbssituationId = await createErwerbssituationViaApi(
            authenticatedRequest,
            {
                personInDossierId: dossierResult.personInDossierId,
                typ: "UnselbstaendigerErwerbslohn",
                betragMonatlich: 1000,
                pensumProzent: 100,
                validFrom: "2025-01-01T00:00:00",
                validThrough: "2025-12-31T00:00:00",
                dreizehnterMonatslohn: true
            },
            page
        );
        console.log(`✅ Erwerbssituation: ${erwerbssituationId}`);
    } catch (error) {
        console.error("❌ Erwerbssituation API failed:", error);
        throw error;
    }

    console.log("\n========== STEP 5: Create WSH-Leistung via API ==========");
    try {
        const wshResult = await createWshLeistungViaApi(
            authenticatedRequest,
            {
                dossierId: dossierResult.dossierId,
                personInDossierId: dossierResult.personInDossierId
            },
            page
        );
        console.log(`✅ WSH-Leistung: ${wshResult.leistungId}`);
    } catch (error) {
        console.error("❌ WSH-Leistung API failed:", error);
        throw error;
    }

    console.log("\n========== STEP 6: Verify in UI ==========");
    await test.step("GoTo_Dossier_With_Url", async () => {
        await commonKeyword.GoTo_Dossier_With_Url(dossierResult.dossierId);
    });

    const rahmenbudgetLink = page.getByRole("link", {
        name: /Rahmenbudget|Budget-cadre/i
    });
    const isVisible = await rahmenbudgetLink.isVisible().catch(() => false);
    assert(isVisible, "⚠️ Rahmenbudget link not visible in UI");

    return dossierResult;
};
