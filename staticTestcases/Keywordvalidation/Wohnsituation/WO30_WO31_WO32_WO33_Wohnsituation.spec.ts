import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { Wohnsituation } from "@keywords/wohnsituation-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { TestUsers } from "@constants/credentials";
import { HaushaltsEreignis, InHaushalt, Birthdays, TestCompanies } from "@constants/testData";
import * as DateHelper from "@libs/utils/helpers/DateHelper";
import { generateAhvNumber } from "@libs/utils/TestdataGenerator";

test(
    "WO30_WO31_WO32_WO33_Wohnsituation",
    {
        tag: ["@[182217]", "@wohnsituation", "@keywordValidation", "@coreBusiness"]
    },
    async ({ page, seed, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var wohnsituationKeyword = new Wohnsituation(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);

        await test.step("WO32_01b_Wohnsituation_Haushalt_Wohnung_anpassen", async () => {
            await wohnsituationKeyword.WO32_01b_Wohnsituation_Haushalt_Wohnung_anpassen({
                vermieter: TestCompanies.GRABER_IMMOBILIEN,
                wohnungsgrosse: "3.5",
                mietkosten: "1200",
                nebenkosten: "150"
            });
        });

        await test.step("WO30_Wohnsituation_Haushalt_Person_Hinzufuegen", async () => {
            await wohnsituationKeyword.WO30_Wohnsituation_Haushalt_Person_Hinzufuegen({
                name: testData.persons.SECOND_PERSON.name,
                vorname: testData.persons.SECOND_PERSON.vorname,
                geburtsdatum: Birthdays.ADULT_1,
                ahvNumber: generateAhvNumber().toString(),
                personInhausltVon: DateHelper.getFirstDayOfTheYearString(),
                inHauslt: InHaushalt.UEBERNEHMEN,
                ereignis: HaushaltsEreignis.EHESCHLIESSUNG
            });
        });

        await test.step("WO33_Wohnsituation_Haushalt_DateienHochladen", async () => {
            await wohnsituationKeyword.WO33_Wohnsituation_Haushalt_DateienHochladen({
                dossier: uniqueDossiertId,
                docType: "Mietvertrag",
                document: "testfiles/documents/JournalEintrag.docx"
            });
        });

        await test.step("WO31_Wohnsituation_Haushalt_PersonEn_entfernen", async () => {
            await wohnsituationKeyword.WO31_Wohnsituation_Haushalt_PersonEn_entfernen({
                dossier: uniqueDossiertId,
                klient: testData.persons.SECOND_PERSON.fullName,
                inHaushaltBis: DateHelper.getTodayDateString(),
                inUeBis: DateHelper.getTodayDateString(),
                ereignis: "Wegzug"
            });
        });
    }
);
