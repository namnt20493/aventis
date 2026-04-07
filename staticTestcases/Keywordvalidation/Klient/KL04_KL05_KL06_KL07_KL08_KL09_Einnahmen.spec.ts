import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@keywords/common-keyword";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestCompanies } from "@constants/testData";
import { TestUsers } from "@constants/credentials";

test(
    "KL04_KL05_KL06_KL07_KL08_KL09_Einnahmen_Erwerbssituation",
    {
        tag: ["@[182983]", "@klient", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var klientschaftKeyword = new KlientschaftKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        const gueltigVon = DateHelper.getFirstOfMonthString();
        const gueltigBis = DateHelper.getLastDayOfYearString();
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);

        await test.step("KL01_Klientschaft_select", async () => {
            await klientschaftKeyword.KL01_Klientschaft_select({
                dossier: uniqueDossiertId,
                klientschaft: testData.persons.FIRST_PERSON.fullName
            });
        });

        await test.step("KL04_ErwerbsituationEinnahmen_AusbildungsLohn_erfassen", async () => {
            await klientschaftKeyword.KL04_ErwerbsituationEinnahmen_AusbildungsLohn_erfassen({
                zahlbarDurch: TestCompanies.BKW,
                pensumm: "30",
                betrag: "350",
                gueltigVon: gueltigVon,
                gueltigBis: gueltigBis,
                checkbox: "",
                migration: ""
            });
        });

        await test.step("KL01_Klientschaft_select_for_KL05", async () => {
            await klientschaftKeyword.KL01_Klientschaft_select({
                dossier: uniqueDossiertId,
                klientschaft: testData.persons.FIRST_PERSON.fullName
            });
        });

        await test.step("KL05_ErwerbssituationEinnahmen_AHVErwachsen_erfassen", async () => {
            await klientschaftKeyword.KL05_ErwerbssituationEinnahmen_AHVErwachsen_erfassen({
                zahlbarDurch: TestCompanies.BKW,
                betrag: "666",
                gueltigVon: gueltigVon,
                gueltigBis: gueltigBis
            });
        });

        await test.step("KL01_Klientschaft_select_for_KL06", async () => {
            await klientschaftKeyword.KL01_Klientschaft_select({
                dossier: uniqueDossiertId,
                klientschaft: testData.persons.FIRST_PERSON.fullName
            });
        });

        await test.step("KL06_ErwerbssituationEinnahmen_ArbeitsLosEntsch_erfassen", async () => {
            await klientschaftKeyword.KL06_ErwerbssituationEinnahmen_ArbeitsLosEntsch_erfassen({
                zahlbarDurch: "Arbeitslosenkasse Kanton Bern",
                betrag: "444",
                gueltigVon: gueltigVon,
                gueltigBis: gueltigBis
            });
        });

        await test.step("KL01_Klientschaft_select_for_KL07", async () => {
            await klientschaftKeyword.KL01_Klientschaft_select({
                dossier: uniqueDossiertId,
                klientschaft: testData.persons.FIRST_PERSON.fullName
            });
        });

        await test.step("KL07_ErwerbssituationEinnahmen_Kinderunterhalt_erfassen", async () => {
            await klientschaftKeyword.KL07_ErwerbssituationEinnahmen_Kinderunterhalt_erfassen({
                zahlbarDurch: testData.persons.FIRST_PERSON.fullName,
                betrag: "340",
                gueltigVon: gueltigVon,
                gueltigBis: gueltigBis
            });
        });

        await test.step("KL01_Klientschaft_select_for_KL08", async () => {
            await klientschaftKeyword.KL01_Klientschaft_select({
                dossier: uniqueDossiertId,
                klientschaft: testData.persons.FIRST_PERSON.fullName
            });
        });

        await test.step("KL08_ErwerbssituationEinnahmen_IVErwachsen_erfassen", async () => {
            await klientschaftKeyword.KL08_ErwerbssituationEinnahmen_IVErwachsen_erfassen({
                zahlbarDurch: TestCompanies.BKW,
                betrag: "123",
                gueltigVon: gueltigVon,
                gueltigBis: gueltigBis
            });
        });

        await test.step("KL01_Klientschaft_select_for_KL09", async () => {
            await klientschaftKeyword.KL01_Klientschaft_select({
                dossier: uniqueDossiertId,
                klientschaft: testData.persons.FIRST_PERSON.fullName
            });
        });

        await test.step("KL09_ErwerbssituationEinnahmen_Kinderzulage_erfassen", async () => {
            await klientschaftKeyword.KL09_ErwerbssituationEinnahmen_Kinderzulage_erfassen({
                zahlbarDurch: TestCompanies.BKW,
                betrag: "300",
                gueltigVon: gueltigVon,
                gueltigBis: gueltigBis
            });
        });
    }
);
