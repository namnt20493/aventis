import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { WSHKeyword } from "@keywords/wsh-keyword";
import { WirtschaftlicheSozialhilfeKeyword } from "@keywords/wirtschaftlicheSozialhilfe-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { TestUsers } from "@constants/credentials";
import * as DateHelper from "@utils/helpers/DateHelper";
import { createDossierViaApi, createWshLeistungViaApi } from "@utils/apiSetup";
import { generateAhvNumber } from "@utils/TestdataGenerator";
import { PathHelper } from "@utils/helpers/pathHelper";

test(
    "WSH_Consolidated_All_Keywords",
    {
        tag: ["@[183097]", "@zahlungen", "@keywordValidation", "@perfMonitoring"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var wshKeyword = new WSHKeyword(page);
        var wirtschaftlicheSozialhilfeKeyword = new WirtschaftlicheSozialhilfeKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        const klientFullName = `${testData.persons.FIRST_PERSON.name}, ${testData.persons.FIRST_PERSON.vorname}`;
        const testFilePath = PathHelper.getDocumentPath("ErwerbssituationAbtretung.docx");
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SUPERUSER.username, TestUsers.SUPERUSER.password);
        });

        let dossierResult: any;
        await test.step("API: CreateDossier", async () => {
            dossierResult = await createDossierViaApi(
                authenticatedRequest,
                {
                    bezeichnung: uniqueDossiertId,
                    person: {
                        vorname: testData.persons.FIRST_PERSON.vorname,
                        nachname: testData.persons.FIRST_PERSON.name,
                        geburtsdatum: "1980-01-01T00:00:00",
                        ahvNummer: generateAhvNumber(seed).toString()
                    }
                },
                seed,
                page
            );
        });

        await page.waitForTimeout(2000);

        await test.step("API: CreateWshLeistung", async () => {
            await createWshLeistungViaApi(
                authenticatedRequest,
                {
                    dossierId: dossierResult.dossierId,
                    personInDossierId: dossierResult.personInDossierId
                },
                page
            );
        });

        await page.waitForTimeout(2000);

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierResult.dossierId);
        });

        await test.step("WSH04_Rueckforderung_erfassen_persoenlich", async () => {
            await wshKeyword.WSH04_Rueckforderung_erfassen_persoenlich({
                titel: "Wichtig",
                rueckModus: "Monatlicher Abzug",
                datum: DateHelper.getTodayDateString(),
                verJahrung: "01.01.2034",
                betrag: 1000,
                schuldner: klientFullName,
                monatlicherBetrag: 100,
                erstmalig: DateHelper.getMonthYearAsString(1),
                dateiPfad: testFilePath,
                begruendung: "keine"
            });
        });

        await test.step("WSH04b_Rueckforderung_erfassen_persoenlich_missbrauch", async () => {
            await wirtschaftlicheSozialhilfeKeyword.WSH04b_Rueckforderung_erfassen_persoenlich_missbrauch({
                dossier: uniqueDossiertId,
                titel: "Tolle Sache",
                rueckModus: "Monatlicher Abzug",
                datum: DateHelper.getTodayDateString(),
                verJahrung: "09.05.2035",
                betrag: 1000,
                schuldner: klientFullName,
                monatlicherBetrag: 100,
                erstmalig: "01.02.2025",
                dateiPfad: testFilePath,
                begruendung: "keine"
            });
        });

        await test.step("WSH06_Kontoauszug_Sozialhilfeschuld_Berechnen", async () => {
            await wshKeyword.WSH06_Kontoauszug_Sozialhilfeschuld_Berechnen({
                stichDatum: DateHelper.getLastDayOfYearString(),
                dossier: uniqueDossiertId,
                person: klientFullName,
                solidarSchuld: 0.0,
                einzelSchuld: 0.0,
                sozialHilfeSchuld: 0.0
            });
        });

        await test.step("WSH08_Kontoauszug_Sozialhilfeschuld_Bescheinigen", async () => {
            await wshKeyword.WSH08_Kontoauszug_Sozialhilfeschuld_Bescheinigen({
                stichDatum: DateHelper.getLastDayOfFutureYearString(),
                dossier: uniqueDossiertId,
                klient: klientFullName,
                bescheinigungsArt: "SozialhilfeschuldBescheinigung - Deutsch"
            });
        });

        const futureMonth = DateHelper.getLastMonthAndYearFromFutureYear();

        await test.step("WSH10_Weiterverrechnung", async () => {
            await wshKeyword.WSH10_Weiterverrechnung({
                dossier: uniqueDossiertId,
                gultVon: DateHelper.getTodayDateString(),
                gultBis: futureMonth,
                weiterVerRechnArt: "HarmG",
                betrPerson: klientFullName
            });
        });

        await test.step("WSH20_Vermoegensverzehr_erfassen", async () => {
            await wirtschaftlicheSozialhilfeKeyword.WSH20_Vermoegensverzehr_erfassen({
                dossier: uniqueDossiertId,
                klient: klientFullName,
                titel: "Vermögensverzehr Test",
                datum: DateHelper.getTodayDateString(),
                betrag: 10000,
                monatBetrag: 100,
                startDatum: DateHelper.getFirstOfMonthString(),
                begrundung: "Testbegründung Vermögensverzehr",
                divDokumente: testFilePath
            });
        });

        await test.step("WSH09_Unterstuetzung_ende_UE", async () => {
            await wshKeyword.WSH09_Unterstuetzung_ende_UE({
                dossier: uniqueDossiertId,
                letzerMonat: futureMonth,
                grundBFS: "Aufnahme einer Erwerbstätigkeit"
            });
        });
    }
);
