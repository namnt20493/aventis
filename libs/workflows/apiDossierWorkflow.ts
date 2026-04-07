import { test, BrowserContext, Page, APIRequestContext } from "@playwright/test";
import { generateAhvNumber, generateUniqueIban } from "@libs/utils/TestdataGenerator";
import { CommonKeyword } from "@keywords/common-keyword";
import { createDossierViaApi, CreateDossierResult } from "@utils/apiSetup";
import { TestDataFactory } from "@utils/TestDataFactory";

const API_SETTLE_WAIT = process.env.SLOW_MODE === "true" ? 8000 : 2000;

export interface GenerateDossierResult {
    dossierId: string;
    personInDossierId: string;
}

export const generateDossierViaApiWithPerson = async (request: APIRequestContext, commonKeyword: CommonKeyword, page: Page, seed: string, uniqueId: string, context: BrowserContext): Promise<GenerateDossierResult> => {
    const persons = TestDataFactory.createPersons(seed);

    await test.step("L00_URLAventis", async () => {
        await commonKeyword.L00_URLAventis.call(commonKeyword, { url: "/" });
    });

    await test.step("M01_LoginMSOnline", async () => {
        await commonKeyword.Stable_Login("bern.sozialarbeiterin1a@diartis.ch", "SMze97-jkSJ59!F.");
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

export { createDossierViaApi, quickCreateDossier, createErwerbssituationViaApi, createWshLeistungViaApi, createBedarfspruefungViaApi, setBewilligungsworkflowStepViaApi } from "@utils/apiSetup";
export type { CreateBedarfspruefungOptions, CreateBedarfspruefungResult, CreateErwerbssituationOptions } from "@utils/apiSetup";
