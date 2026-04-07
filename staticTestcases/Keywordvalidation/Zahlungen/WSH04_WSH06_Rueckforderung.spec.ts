import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@keywords/common-keyword";
import { WSHKeyword } from "@keywords/wsh-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestUsers } from "@constants/credentials";
import { createDossierViaApi, createWshLeistungViaApi } from "@utils/apiSetup";
import { generateAhvNumber, generateUniqueIban } from "@libs/utils/TestdataGenerator";
import path from "path";
const testDocumentPath = path.resolve("testfiles/documents/test.docx");

test(
    "WSH04_WSH06_Rueckforderung_Kontoauszug",
    {
        tag: ["@[183098]", "@zahlungen", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var wshKeyword = new WSHKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        await test.step("M01_LoginMSOnline", async () => {
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

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierId);
        });

        await test.step("Reload page for menu stability", async () => {
            await page.reload();
            await page.waitForLoadState("networkidle");
        });

        await test.step("WSH04_Rueckforderung_erfassen_persoenlich", async () => {
            const verjaehrungsDatum = `01.01.${new Date().getFullYear() + 8}`;
            await wshKeyword.WSH04_Rueckforderung_erfassen_persoenlich({
                titel: "Rückforderung Test",
                rueckModus: "Monatlicher Abzug",
                datum: DateHelper.getTodayDateString(),
                verJahrung: verjaehrungsDatum,
                betrag: "1000",
                schuldner: ` ${testData.persons.FIRST_PERSON.fullName}`,
                monatlicherBetrag: "100",
                erstmalig: DateHelper.getMonthYearAsString(1),
                dateiPfad: testDocumentPath,
                begruendung: "Begründung der Rückforderung"
            });
        });

        await test.step("WSH06_Kontoauszug_Sozialhilfeschuld_Berechnen", async () => {
            await wshKeyword.WSH06_Kontoauszug_Sozialhilfeschuld_Berechnen({
                stichDatum: DateHelper.getLastDayOfYearString(),
                dossier: uniqueDossiertId,
                person: testData.persons.FIRST_PERSON.fullName,
                solidarSchuld: 0.0,
                einzelSchuld: 0.0,
                sozialHilfeSchuld: 0.0
            });
        });
    }
);
