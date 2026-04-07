import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { DossierprufungKeyword } from "@keywords/dossierprufung-keyword";
import { TestUsers } from "@constants/credentials";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";

/**
 * DO14: Dossierprüfung with Beanstandung (complaint)
 *
 * This test creates a Dossierprüfung (dossier review) and adds a Beanstandung (complaint).
 *
 * KEY CONSTRAINT: The logged-in user (KANTONS_MA) cannot select themselves as Prüfer.
 * The Prüfer dropdown only shows OTHER users who have permission to review the dossier.
 * Solution: Use "Bern Sozialarbeiterin 1A" as the Prüfer (the dossier's zuständige Person).
 */
test(
    "DO14_Dossier_pruefen_durchfuehren_mitBeanstandung",
    {
        tag: ["@[182981]", "@dossier", "@keywordValidation"]
    },
    async ({ page, seed, authenticatedRequest }) => {
        var commonKeyword = new CommonKeyword(page);
        var dossierprufungKeyword = new DossierprufungKeyword(page);

        const uniqueDossierId = sharedTestLogic.generateUniqueDossierId(seed);
        const falligDatum = DateHelper.getLastDayOfYearString();
        await test.step("Login as SOZIALARBEITERIN to create dossier", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await test.step("Create Dossier via API", async () => {
            await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossierId);
        });

        await test.step("Switch to KANTONS_MA for Dossierprüfung", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.KANTONS_MA.username, TestUsers.KANTONS_MA.password);
        });

        await test.step("DO13_Dossier_pruefen_starten", async () => {
            await dossierprufungKeyword.DO13_Dossier_pruefen_starten({
                dossier: uniqueDossierId
            });
        });

        await test.step("DO14_Dossier_pruefen_durchfuehren_mitBeanstandung", async () => {
            await dossierprufungKeyword.DO14_Dossier_pruefen_durchfuehren_mitBeanstandung({
                dossier: uniqueDossierId,
                zustTeam: "Sozialarbeit Bern 1",
                pruefer: "Bern Sozialarbeiterin 1A",
                status: "In Bearbeitung",
                aufgabeTitel: "Aufgabe durch Dossierprüfung " + seed.substring(0, 6),
                falligDatum: falligDatum,
                zugMitarbeiter: "Bern Sozialarbeiterin 1A",
                kontrollPunkte: "Subsidiaritätsprüfung"
            });
        });
    }
);
