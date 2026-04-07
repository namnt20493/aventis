import { test as base, chromium, Browser, BrowserContext, Page, test, APIRequestContext } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";
import { generateAhvNumber, generateUniqueIban } from "@libs/utils/TestdataGenerator";

import { CommonKeyword } from "@keywords/common-keyword";
import { DossierKeyword } from "@keywords/dossier-keyword";
import { TestUsers } from "@constants/credentials";
import { TestDataFactory } from "@utils/TestDataFactory";
import type { TestPersonSet } from "@utils/TestDataFactory";

const parameterFilePath = path.join(__dirname, "./../../parameter.json");
const p = JSON.parse(fs.readFileSync(parameterFilePath, "utf8"));

import { createDossierViaApi, quickCreateDossier, CreateDossierResult } from "@utils/apiSetup";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import { MicrosoftLoginPage } from "@pages/microsoftlogin-page";
import * as DateHelper from "@utils/helpers/DateHelper";

const API_SETTLE_WAIT = process.env.SLOW_MODE === "true" ? 10000 : 5000;

let counter = 0;

export function generateTestcaseSeed() {
    return randomUUID();
}

export function generateUniqueDossierId(seed?: string, prefix: string = "KVTest"): string {
    const actualSeed = seed || randomUUID();

    console.log(`[DossierID] Seed: ${actualSeed}`);

    const hash = seedToHash(actualSeed);

    return `${prefix}_${hash}_${counter++}`;
}

function seedToHash(seed: string): string {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36).substring(0, 8);
}

export const generateDossier = async (commonKeyword: CommonKeyword, page: Page, dossierKeyword: DossierKeyword, uniqueId: string, context: BrowserContext, persons: TestPersonSet): Promise<string> => {
    await test.step("M01_LoginMSOnline", async () => {
        await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
    });

    await test.step("P01_Person_Search", async () => {
        await dossierKeyword.P01_Person_Search.call(dossierKeyword, {
            name: persons.FIRST_PERSON.name,
            vorname: persons.FIRST_PERSON.vorname,
            ahvNumber: "",
            geburtsdatum: ""
        });
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

export interface GenerateDossierResult {
    dossierId: string;
    personInDossierId: string;
}

export const generateDossierViaApiWithPerson = async (request: APIRequestContext, commonKeyword: CommonKeyword, page: Page, seed: string, uniqueId: string, context: BrowserContext): Promise<GenerateDossierResult> => {
    const persons = TestDataFactory.createPersons(seed);

    await test.step("M01_LoginMSOnline", async () => {
        await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
    });

    let result: CreateDossierResult;

    await test.step("API: CreateDossier", async () => {
        result = await createDossierViaApi(
            request,
            {
                bezeichnung: uniqueId,
                person: {
                    vorname: persons.FIRST_PERSON.vorname,
                    nachname: persons.FIRST_PERSON.name,
                    geburtsdatum: "1980-01-01T00:00:00",
                    ahvNummer: generateAhvNumber(seed).toString()
                }
            },
            seed,
            page
        );
    });

    await page.waitForTimeout(API_SETTLE_WAIT);

    await test.step("GoTo_Dossier_With_Url", async () => {
        await commonKeyword.GoTo_Dossier_With_Url(result!.dossierId);
    });

    return {
        dossierId: result!.dossierId,
        personInDossierId: result!.personInDossierId
    };
};

export const generateDossierViaApi = async (request: APIRequestContext, commonKeyword: CommonKeyword, page: Page, seed: string, uniqueId: string, context: BrowserContext): Promise<string> => {
    const result = await generateDossierViaApiWithPerson(request, commonKeyword, page, seed, uniqueId, context);
    return result.dossierId;
};

function formatBirthdayToISO(dateStr: string): string {
    if (!dateStr || dateStr.includes("T")) return dateStr;
    const parts = dateStr.split(".");
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`;
    }
    return dateStr;
}

export { createDossierViaApi, quickCreateDossier, createErwerbssituationViaApi, createWshLeistungViaApi, createBedarfspruefungViaApi, setBewilligungsworkflowStepViaApi } from "@utils/apiSetup";
export type { CreateBedarfspruefungOptions, CreateBedarfspruefungResult, CreateErwerbssituationOptions } from "@utils/apiSetup";

export const createDossierViaApiOnly = async (request: APIRequestContext, commonKeyword: CommonKeyword, page: Page, seed: string, uniqueId: string, includeSecondPerson: boolean = false): Promise<string> => {
    const persons = TestDataFactory.createPersons(seed);

    let result: CreateDossierResult;

    await test.step("API: CreateDossier", async () => {
        result = await createDossierViaApi(
            request,
            {
                bezeichnung: uniqueId,
                person: {
                    vorname: persons.FIRST_PERSON.vorname,
                    nachname: persons.FIRST_PERSON.name,
                    geburtsdatum: "1980-01-01T00:00:00",
                    ahvNummer: generateAhvNumber(seed).toString()
                },
                secondPerson: includeSecondPerson
                    ? {
                          vorname: persons.SECOND_PERSON.vorname,
                          nachname: persons.SECOND_PERSON.name,
                          geburtsdatum: "2010-01-01T00:00:00",
                          ahvNummer: generateAhvNumber(seed + "2").toString()
                      }
                    : undefined
            },
            seed,
            page
        );
    });

    await page.waitForTimeout(API_SETTLE_WAIT);

    await test.step("GoTo_Dossier_With_Url", async () => {
        await commonKeyword.GoTo_Dossier_With_Url(result!.dossierId);
    });

    return result!.dossierId;
};

export const addZahlungsVerbindung = async (commonKeyword: CommonKeyword, page: Page, klientschaftKeyword: KlientschaftKeyword, uniqueDossiertId: string, context: BrowserContext, persons: TestPersonSet) => {
    await test.step("BW04_ZahlungsVerbindung_Freigeben", async () => {
        await klientschaftKeyword.BW04_ZahlungsVerbindung_Freigeben_OhneNavigation.call(klientschaftKeyword, {
            dossierInstitution: uniqueDossiertId,
            klientschaft: persons.FIRST_PERSON.fullName,
            buttonBewilligung: "Anfragen",
            checkStatus: "In Bearbeitung"
        });
    });

    await test.step("L03_LogoutAndLoginDiffAccount", async () => {
        await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
    });

    await test.step("KL01_Klientschaft_select", async () => {
        await klientschaftKeyword.KL01_Klientschaft_select.call(klientschaftKeyword, {
            dossier: uniqueDossiertId,
            klientschaft: persons.FIRST_PERSON.fullName
        });
    });

    await test.step("BW04_ZahlungsVerbindung_Freigeben", async () => {
        await klientschaftKeyword.BW04_ZahlungsVerbindung_Freigeben.call(klientschaftKeyword, {
            dossierInstitution: uniqueDossiertId,
            klientschaft: persons.FIRST_PERSON.fullName,
            buttonBewilligung: "Bewilligen",
            checkStatus: "Bewilligt"
        });
    });
};

export const createDossierViaApiOnlyWithPaymentConnection = async (request: APIRequestContext, commonKeyword: CommonKeyword, page: Page, seed: string, uniqueId: string, includeSecondPerson: boolean = false): Promise<string> => {
    const persons = TestDataFactory.createPersons(seed);

    let result: CreateDossierResult;

    await test.step("API: CreateDossier with Payment Connection", async () => {
        result = await createDossierViaApi(
            request,
            {
                bezeichnung: uniqueId,
                person: {
                    vorname: persons.FIRST_PERSON.vorname,
                    nachname: persons.FIRST_PERSON.name,
                    geburtsdatum: "1980-01-01T00:00:00",
                    ahvNummer: generateAhvNumber(seed).toString(),
                    iban: generateUniqueIban(seed)
                },
                secondPerson: includeSecondPerson
                    ? {
                          vorname: persons.SECOND_PERSON.vorname,
                          nachname: persons.SECOND_PERSON.name,
                          geburtsdatum: "2010-01-01T00:00:00",
                          ahvNummer: generateAhvNumber(seed + "2").toString(),
                          iban: generateUniqueIban(seed + "2")
                      }
                    : undefined
            },
            seed,
            page
        );
    });

    await page.waitForTimeout(2000);

    await test.step("GoTo_Dossier_With_Url", async () => {
        await commonKeyword.GoTo_Dossier_With_Url(result!.dossierId);
    });

    await test.step("Approve_Payment_Connection_Via_Workflow", async () => {
        await page.click(`a[href*="klienten/${result!.personInDossierId}"]`);
        await page.waitForTimeout(1000);

        const klientschaftKeyword = new KlientschaftKeyword(page);

        await test.step("BW04_ZahlungsVerbindung_Request", async () => {
            try {
                await klientschaftKeyword.BW04_ZahlungsVerbindung_Freigeben_OhneNavigation({
                    klientschaft: persons.FIRST_PERSON.fullName,
                    buttonBewilligung: "Anfragen",
                    checkStatus: "In Bearbeitung"
                });
            } catch (error) {
                console.log("Payment connection request might already be in progress:", error instanceof Error ? error.message : String(error));
            }
        });

        await test.step("Switch_To_Sachbearbeiterin", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

        await test.step("Navigate_And_Select_Client", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(result!.dossierId);
            await klientschaftKeyword.KL01_Klientschaft_select({
                dossier: uniqueId,
                klientschaft: persons.FIRST_PERSON.fullName
            });
        });

        await test.step("BW04_ZahlungsVerbindung_Approve", async () => {
            await page.waitForTimeout(1000);

            await klientschaftKeyword.BW04_ZahlungsVerbindung_Freigeben({
                dossierInstitution: uniqueId,
                klientschaft: persons.FIRST_PERSON.fullName,
                buttonBewilligung: "Bewilligen",
                checkStatus: "Bewilligt"
            });

            console.log("🔍 [Payment] Waiting for approval to be processed...");
            await page.waitForTimeout(2000);
        });

        await test.step("Switch_Back_To_Sozialarbeiterin", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
            await commonKeyword.GoTo_Dossier_With_Url(result!.dossierId);
        });
    });

    return result!.dossierId;
};

export interface HouseholdDossierResult {
    dossierId: string;
    personInDossierId: string;
    leistungId: string;
}

export const createDossierWithHouseholdForHaeuslicheGewalt = async (
    request: APIRequestContext,
    commonKeyword: CommonKeyword,
    wohnsituationKeyword: { WO30_Wohnsituation_Haushalt_Person_Hinzufuegen: Function },
    bedarfspruefungKeyword: { A01_AnspruchPruefung_Bedarfspruefung: Function },
    bewilligungsKeyword: { BW01_Bewilligungs_Workflow_LeistungsEntscheid: Function; BW02b_Bewilligungs_Workflow_Step_V2: Function },
    page: Page,
    seed: string,
    uniqueId: string
): Promise<HouseholdDossierResult> => {
    const persons = TestDataFactory.createPersons(seed);
    const { createDossierViaApi } = await import("@utils/apiSetup");
    let dossierId: string;
    let personInDossierId: string;

    await test.step("API: CreateDossier with main person", async () => {
        const result = await createDossierViaApi(
            request,
            {
                bezeichnung: uniqueId,
                person: {
                    vorname: persons.FIRST_PERSON.vorname,
                    nachname: persons.FIRST_PERSON.name,
                    geburtsdatum: "1962-02-17T00:00:00",
                    ahvNummer: generateAhvNumber(seed).toString(),
                    geschlecht: "Maennlich"
                }
            },
            seed,
            page
        );
        dossierId = result.dossierId;
        personInDossierId = result.personInDossierId;
    });

    await page.waitForTimeout(5000);

    await test.step("GoTo_Dossier_With_Url", async () => {
        await commonKeyword.GoTo_Dossier_With_Url(dossierId!);
    });

    const today = DateHelper.getTodayDateString();

    await test.step("WO30: Add adult woman to household", async () => {
        await wohnsituationKeyword.WO30_Wohnsituation_Haushalt_Person_Hinzufuegen({
            name: persons.FIRST_PERSON.name,
            vorname: persons.ADULT_WOMAN.vorname,
            geburtsdatum: persons.ADULT_WOMAN.geburtsdatum,
            ahvNumber: generateAhvNumber(seed + "_woman").toString(),
            personInhausltVon: today,
            inHauslt: "Übernehmen",
            ereignis: "Eheschliessung"
        });
    });

    await test.step("WO30: Add boy child to household", async () => {
        await wohnsituationKeyword.WO30_Wohnsituation_Haushalt_Person_Hinzufuegen({
            name: persons.FIRST_PERSON.name,
            vorname: persons.CHILD_BOY.vorname,
            geburtsdatum: persons.CHILD_BOY.geburtsdatum,
            ahvNumber: generateAhvNumber(seed + "_boy").toString(),
            personInhausltVon: today,
            inHauslt: "Übernehmen",
            ereignis: "Geburt"
        });
    });

    await test.step("WO30: Add girl child to household (Opfer)", async () => {
        await wohnsituationKeyword.WO30_Wohnsituation_Haushalt_Person_Hinzufuegen({
            name: persons.FIRST_PERSON.name,
            vorname: persons.CHILD_GIRL.vorname,
            geburtsdatum: persons.CHILD_GIRL.geburtsdatum,
            ahvNumber: generateAhvNumber(seed + "_girl").toString(),
            personInhausltVon: today,
            inHauslt: "Übernehmen",
            ereignis: "Geburt"
        });
    });

    await test.step("A01: Create Bedarfsprüfung via GUI", async () => {
        await bedarfspruefungKeyword.A01_AnspruchPruefung_Bedarfspruefung({
            entscheidVom: today,
            begrundung: "Bedarfsprüfung für Test",
            unterstutzungab: DateHelper.getFirstOfMonthString()
        });
        console.log(`✅ Bedarfsprüfung created via GUI`);
    });

    await test.step("BW01: Create Leistungsentscheid", async () => {
        await bewilligungsKeyword.BW01_Bewilligungs_Workflow_LeistungsEntscheid({
            lEvonDate: DateHelper.getFirstOfMonthString(),
            lEbisDate: DateHelper.getLastDayOfYearString(),
            checkStatus: "In Bearbeitung"
        });
        console.log(`✅ Leistungsentscheid created via GUI`);
    });

    await test.step("BW02b: Sachbearbeiterin approval (Prüfung OK)", async () => {
        await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        await bewilligungsKeyword.BW02b_Bewilligungs_Workflow_Step_V2({
            dossier: uniqueId,
            buttonName: "Prüfung OK",
            checkEntscheid: "Prüfung OK"
        });
        console.log(`✅ Sachbearbeiterin approved (Prüfung OK)`);
    });

    await test.step("BW02b: Gemeinde_MA approval (Bewilligen)", async () => {
        await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.GEMEINDE_MA.username, TestUsers.GEMEINDE_MA.password);
        await bewilligungsKeyword.BW02b_Bewilligungs_Workflow_Step_V2({
            dossier: uniqueId,
            buttonName: "Bewilligen",
            checkEntscheid: "Bewilligt"
        });
        console.log(`✅ Gemeinde_MA approved (Bewilligt)`);
    });

    await test.step("Switch back to Sozialarbeiterin", async () => {
        await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
    });

    await page.waitForTimeout(2000);

    await test.step("Navigate back to dossier", async () => {
        await commonKeyword.GoTo_Dossier_With_Url(dossierId!);
    });

    return {
        dossierId: dossierId!,
        personInDossierId: personInDossierId!,
        leistungId: ""
    };
};

export function generateDossierWithErwerbssituationAndWsh(authenticatedRequest: APIRequestContext, commonKeyword: CommonKeyword, page: Page, seed: string, uniqueDossiertId: string) {
    throw new Error("Function not implemented.");
}
