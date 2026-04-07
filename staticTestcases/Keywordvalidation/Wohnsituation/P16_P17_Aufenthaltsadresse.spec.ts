import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { DossierKeyword } from "@keywords/dossier-keyword";
import { Wohnsituation } from "@keywords/wohnsituation-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { TestUsers } from "@constants/credentials";
import { HaushaltsEreignis, InHaushalt, Birthdays } from "@constants/testData";
import * as DateHelper from "@libs/utils/helpers/DateHelper";
import { generateAhvNumber } from "@libs/utils/TestdataGenerator";

test(
    "P16_P17_Aufenthaltsadresse",
    {
        tag: ["@[183076]", "@wohnsituation", "@keywordValidation"]
    },
    async ({ page, seed, authenticatedRequest, testData }) => {
        const commonKeyword = new CommonKeyword(page);
        const dossierKeyword = new DossierKeyword(page);
        const wohnsituationKeyword = new Wohnsituation(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId, true);

        await test.step("P16_Person_AufenthaltsAdresseFrei", async () => {
            await dossierKeyword.P16_Person_AufenthaltsAdresseFrei({
                zusatz: "",
                strasse: "Bleichenweg",
                hausnummer: "12",
                PLZ_Ort: "6000 Luzern",
                gueltigVon: DateHelper.getTodayDateString(),
                gueltigBis: DateHelper.getDaysFutureString(30),
                personZuweisen: testData.persons.SECOND_PERSON.fullName
            });
        });

        await test.step("P17_Person_AufenthaltsAdresseInstitution", async () => {
            await dossierKeyword.P17_Person_AufenthaltsAdresseInstitution({
                institution: "Blumenhaus Buchegg",
                gueltigVon: DateHelper.getTodayDateString(),
                gueltigBis: DateHelper.getDaysFutureString(60),
                personZuweisen: testData.persons.FIRST_PERSON.fullName
            });
        });
    }
);
