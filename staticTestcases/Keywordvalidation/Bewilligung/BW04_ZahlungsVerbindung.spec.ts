import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { createDossierViaApi } from "@utils/apiSetup";
import { generateAhvNumber, generateUniqueIban } from "@utils/TestdataGenerator";
import { TestUsers } from "@constants/credentials";

test(
    "BW04_ZahlungsVerbindung_Freigeben",
    {
        tag: ["@[182991]", "@bewilligung", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var klientschaftKeyword = new KlientschaftKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        let dossierResult: { dossierId: string; personInDossierId: string };
        await test.step("API: CreateDossier mit Zahlungsverbindung", async () => {
            dossierResult = await createDossierViaApi(
                authenticatedRequest,
                {
                    bezeichnung: uniqueDossiertId,
                    person: {
                        vorname: testData.persons.FIRST_PERSON.vorname,
                        nachname: testData.persons.FIRST_PERSON.name,
                        geburtsdatum: "1980-01-01T00:00:00",
                        ahvNummer: generateAhvNumber(seed).toString(),
                        iban: generateUniqueIban(seed)
                    }
                },
                seed,
                page
            );
        });

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierResult.dossierId);
        });

        await test.step("BW04_ZahlungsVerbindung_Freigeben - Anfragen", async () => {
            await klientschaftKeyword.BW04_ZahlungsVerbindung_Freigeben({
                dossierInstitution: uniqueDossiertId,
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

        await test.step("BW04_ZahlungsVerbindung_Freigeben - Bewilligen", async () => {
            await klientschaftKeyword.BW04_ZahlungsVerbindung_Freigeben({
                dossierInstitution: uniqueDossiertId,
                klientschaft: testData.persons.FIRST_PERSON.fullName,
                buttonBewilligung: "Bewilligen",
                checkStatus: "Bewilligt"
            });
        });
    }
);
