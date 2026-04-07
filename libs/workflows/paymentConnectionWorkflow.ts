import { test, BrowserContext, Page, APIRequestContext } from "@playwright/test";
import { generateAhvNumber, generateUniqueIban } from "@libs/utils/TestdataGenerator";
import { CommonKeyword } from "@keywords/common-keyword";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import { createDossierViaApi, CreateDossierResult } from "@utils/apiSetup";
import { TestDataFactory } from "@utils/TestDataFactory";
import type { TestPersonSet } from "@utils/TestDataFactory";

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
        await commonKeyword.Stable_LogoutAndLoginDiffAccount("Bern.Sachbearbeiterin@diartis.ch", "XXxa22?pdTA66-S@");
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
            await commonKeyword.Stable_LogoutAndLoginDiffAccount("Bern.Sachbearbeiterin@diartis.ch", "XXxa22?pdTA66-S@");
        });

        await test.step("Navigate_And_Select_Client", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(result!.dossierId);
            await klientschaftKeyword.KL01_Klientschaft_select({
                dossier: result!.dossierId,
                klientschaft: persons.FIRST_PERSON.fullName
            });
        });

        await test.step("BW04_ZahlungsVerbindung_Approve", async () => {
            await klientschaftKeyword.BW04_ZahlungsVerbindung_Freigeben({
                dossierInstitution: result!.dossierId,
                klientschaft: persons.FIRST_PERSON.fullName,
                buttonBewilligung: "Bewilligen",
                checkStatus: "Bewilligt"
            });
        });

        await test.step("Switch_Back_To_Sozialarbeiterin", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount("bern.sozialarbeiterin1a@diartis.ch", "SMze97-jkSJ59!F.");
            await commonKeyword.GoTo_Dossier_With_Url(result!.dossierId);
        });
    });

    return result!.dossierId;
};
