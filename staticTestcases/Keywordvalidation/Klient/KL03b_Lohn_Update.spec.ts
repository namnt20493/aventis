import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@keywords/common-keyword";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestCompanies } from "@constants/testData";
import { TestUsers } from "@constants/credentials";

/**
 * KL03b_ErwerbsituationEinnahmen_Lohn_Update
 *
 * VORBEDINGUNG: Erfordert existierenden Erwerbslohn (via KL03)
 * Dieser Test erstellt erst einen Lohn (KL03) und aktualisiert ihn dann (KL03b)
 *
 * STATUS: @wip - Benötigt Prüfung der Lohn-Update-Logik
 */
test(
    "KL03b_Lohn_Update",
    {
        tag: ["@[182984]", "@klient", "@keywordValidation"]
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

        await test.step("KL03_ErwerbsituationEinnahmen_Lohn_erfassen", async () => {
            await klientschaftKeyword.KL03_ErwerbsituationEinnahmen_Lohn_erfassen({
                zahlbarDurch: TestCompanies.BKW,
                pensumm: "100",
                betrag: "1500",
                gueltigVon: gueltigVon,
                gueltigBis: gueltigBis,
                checkbox: "",
                migration: ""
            });
        });

        await test.step("KL01_Klientschaft_select_for_Update", async () => {
            await klientschaftKeyword.KL01_Klientschaft_select({
                dossier: uniqueDossiertId,
                klientschaft: testData.persons.FIRST_PERSON.fullName
            });
        });

        await test.step("KL03b_ErwerbsituationEinnahmen_Lohn_Update", async () => {
            await klientschaftKeyword.KL03b_ErwerbsituationEinnahmen_Lohn_Update({
                zahlbarDurch: TestCompanies.BKW,
                pensumm: "100",
                betrag: "1800",
                gueltigVonActual: gueltigVon,
                gueltigVonNew: "",
                gueltigBis: gueltigBis,
                checkbox13: "",
                docType: "",
                docPathName: ""
            });
        });
    }
);
