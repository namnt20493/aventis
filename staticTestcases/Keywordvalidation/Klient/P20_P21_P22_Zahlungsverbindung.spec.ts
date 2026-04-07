import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { createDossierViaApi } from "@utils/apiSetup";
import { generateAhvNumber, generateUniqueIban } from "@utils/TestdataGenerator";
import { TestUsers } from "@constants/credentials";
import * as DateHelper from "@utils/helpers/DateHelper";

test(
    "P21_P22_Zahlungsverbindung_Ausbildung",
    {
        tag: ["@[182990]", "@klient", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var klientschaftKeyword = new KlientschaftKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        let dossierResult: { dossierId: string; personInDossierId: string };
        await test.step("API: CreateDossier ohne Zahlungsverbindung", async () => {
            dossierResult = await createDossierViaApi(
                authenticatedRequest,
                {
                    bezeichnung: uniqueDossiertId,
                    person: {
                        vorname: testData.persons.FIRST_PERSON.vorname,
                        nachname: testData.persons.FIRST_PERSON.name,
                        geburtsdatum: "1980-01-01T00:00:00",
                        ahvNummer: generateAhvNumber(seed).toString(),
                        iban: null
                    }
                },
                seed,
                page
            );
        });

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierResult.dossierId);
        });

        await test.step("P21_Person_ZahlungsVerbindung_Klienten", async () => {
            await klientschaftKeyword.P21_Person_ZahlungsVerbindung_Klienten({
                klient: testData.persons.FIRST_PERSON.fullName,
                IBAN: generateUniqueIban(seed),
                gueltigVon: DateHelper.getTodayDateString(),
                gueltigBis: DateHelper.getLastDayOfYearString(),
                strasse: "Teststrasse",
                nummer: "1",
                postfach: "",
                ort: "3000 Bern"
            });
        });

        await test.step("P22_Person_Ausbildung_Create", async () => {
            await klientschaftKeyword.P22_Person_Ausbildung_Create({
                dossier: uniqueDossiertId,
                klient: testData.persons.FIRST_PERSON.fullName,
                hoechstAusbild: "Hochschule",
                anzJahre: "12"
            });
        });
    }
);
