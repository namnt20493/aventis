import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@keywords/common-keyword";
import { DossierKeyword } from "@keywords/dossier-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { generateAhvNumber } from "@libs/utils/TestdataGenerator";
import { TestUsers } from "@constants/credentials";
import { Birthdays } from "@constants/testData";
import * as DateHelper from "@utils/helpers/DateHelper";

test(
    "P01_P05_P10_P30_PersonCreation_Manual_Workflow",
    {
        tag: ["@[183697]", "@keywordValidation", "@klient"]
    },
    async ({ page, seed }) => {
        const commonKeyword = new CommonKeyword(page);
        const dossierKeyword = new DossierKeyword(page);

        const uniqueDossierId = sharedTestLogic.generateUniqueDossierId(seed);
        const uniqueAhvNumber = generateAhvNumber(seed).toString();
        const uniquePersonName = `TestPerson_${seed.substring(0, 8)}`;
        const uniqueStrasse = `Strasse_${seed.substring(0, 6)}`;
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await test.step("P05_Person_Create_Manual_Complete", async () => {
            await dossierKeyword.P05_Person_Create_Manual_Complete({
                name: uniquePersonName,
                vorname: "Peter",
                ahvNumber: uniqueAhvNumber,
                language: "",
                zivilstand: "ledig",
                zivilstandSeit: undefined,
                geburtsdatum: Birthdays.ADULT_1,
                national: "Schweiz",
                gender: "männlich",
                aufenthalt: "",
                aufenGultigVon: undefined,
                aufenGultigBis: undefined
            });
        });

        await test.step("P10_Person_Communikation_Complete", async () => {
            await dossierKeyword.P10_Person_Communikation_Complete({
                mobile: "079 5320286",
                privateNumber: "079 5462626",
                email: "test.automation@gmail.com"
            });
        });

        await test.step("P15_Person_Adress", async () => {
            await dossierKeyword.P15_Person_Adress({
                zusatz: "",
                strasse: uniqueStrasse,
                houseNumber: "42",
                ort: "3302 Moosseedorf",
                validDate: "02.06.2021"
            });
        });

        await test.step("P20_Person_ZahlungsVerbindung", async () => {
            await dossierKeyword.P20_Person_ZahlungsVerbindung({
                iban: "CH21 0078 9100 0000 2920 0"
            });
        });

        await test.step("P30_Person_Uebernehmen", async () => {
            await dossierKeyword.P30_Person_Uebernehmen();
        });

        await test.step("H01_Haushalt_Uebernehmen_Zustaendigkeit", async () => {
            await dossierKeyword.H01_Haushalt_Uebernehmen_Zustaendigkeit({
                zust_Gemeinde: "Moosseedorf",
                zust_SozTeam: "Sozialarbeit Bern 1",
                zust_SozMitarbeiter: "Bern Sozialarbeiterin 1B",
                zust_SachbTeam: "Sachbearbeitung Bern",
                zust_SachbMitarbeiter: "Bern Sachbearbeiterin"
            });
        });

        await test.step("D01_Dossier_Eroeffnen", async () => {
            await dossierKeyword.D01_Dossier_Eroeffnen({
                dossierBezeichnung: uniqueDossierId,
                eroeffnetAm: DateHelper.getTodayDateString(),
                dossierSprache: "Deutsch"
            });
        });
    }
);
