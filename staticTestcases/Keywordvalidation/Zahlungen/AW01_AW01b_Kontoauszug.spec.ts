import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { KontoauszugKeyword } from "@keywords/kontoauszug-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestUsers } from "@constants/credentials";
import { createDossierViaApi, createWshLeistungViaApi } from "@utils/apiSetup";
import { generateAhvNumber, generateUniqueIban } from "@libs/utils/TestdataGenerator";

test(
    "AW01_AW01b_Kontoauszug",
    {
        tag: ["@[183249]", "@zahlungen", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var kontoauszugKeyword = new KontoauszugKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        await test.step("Login als Sozialarbeiterin", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        let dossierId: string;
        let personInDossierId: string;

        await test.step("API: Create Dossier with Person", async () => {
            const result = await createDossierViaApi(
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
            dossierId = result.dossierId;
            personInDossierId = result.personInDossierId;
        });

        await test.step("API: Create WSH Leistung", async () => {
            await createWshLeistungViaApi(
                authenticatedRequest,
                {
                    dossierId: dossierId,
                    personInDossierId: personInDossierId
                },
                page
            );
        });

        await page.waitForTimeout(2000);

        await test.step("Wechsel zu Buchhalter", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.BUCHHALTER.username, TestUsers.BUCHHALTER.password);
        });

        await test.step("AW01_Kontoauszug", async () => {
            await kontoauszugKeyword.AW01_Kontoauszug({
                leistungSuchen: uniqueDossiertId,
                suche: "GBL",
                zeitRaumBis: DateHelper.getLastDayOfYearString(),
                zeitRaum: "Verwendungsperiode",
                insOrKlient: "Person",
                zahlEmpfaenger: testData.persons.FIRST_PERSON.fullName,
                option: "Keine Details",
                nurRueckerstBuchX: "",
                korrBuchInklOriginalX: "x",
                totalAusgaben: 0,
                totalEinahmen: 0,
                kontoauszugHerunterladenX: "x"
            });
        });

        await test.step("Wechsel zu Sachbearbeiterin", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

        await test.step("AW01b_Kontoauszug_DossierSicht", async () => {
            await kontoauszugKeyword.AW01b_Kontoauszug_DossierSicht({
                dossier: uniqueDossiertId,
                zeitRaumVon: DateHelper.getFirstOfMonthString(),
                zeitRaumBis: DateHelper.getLastDayOfYearString(),
                zeitRaum: "",
                bezAnInstPerson: "Person",
                zahlEmpfaenger: testData.persons.FIRST_PERSON.fullName,
                option: "Keine Details",
                totalAusgaben: 0,
                totalEinahmen: 0,
                kontoauszugHerunterladenX: "x",
                downLoadName: "Kontoauszug"
            });
        });
    }
);
