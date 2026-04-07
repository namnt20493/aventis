import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@keywords/common-keyword";
import { WSHKeyword } from "@keywords/wsh-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestUsers } from "@constants/credentials";
import { createDossierViaApi, createWshLeistungViaApi } from "@utils/apiSetup";
import { generateAhvNumber, generateUniqueIban } from "@libs/utils/TestdataGenerator";

test(
    "WSH09_WSH10_Unterstuetzung_Weiterverrechnung",
    {
        tag: ["@[183095]", "@zahlungen", "@keywordValidation", "@coreBusiness"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var wshKeyword = new WSHKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SUPERUSER.username, TestUsers.SUPERUSER.password);
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

        await test.step("WSH09_Unterstuetzung_ende_UE", async () => {
            await wshKeyword.WSH09_Unterstuetzung_ende_UE({
                dossier: uniqueDossiertId,
                letzerMonat: DateHelper.getMonthYearAsString(6),
                grundBFS: "Aufnahme einer Erwerbstätigkeit"
            });
        });

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierId);
        });

        await test.step("WSH10_Weiterverrechnung", async () => {
            await wshKeyword.WSH10_Weiterverrechnung({
                dossier: uniqueDossiertId,
                gultVon: DateHelper.getTodayDateString(),
                gultBis: DateHelper.getLastDayOfYearString(),
                weiterVerRechnArt: "HarmG",
                betrPerson: testData.persons.FIRST_PERSON.fullName
            });
        });
    }
);
