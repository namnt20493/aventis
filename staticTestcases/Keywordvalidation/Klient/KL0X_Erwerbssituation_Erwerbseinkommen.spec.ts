import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { PathHelper } from "@utils/helpers/pathHelper";
import { TestCompanies } from "@constants/testData";

test(
    "KL0X_Erwerbssituation_Erwerbseinkommen",
    {
        tag: ["@[182213]", "@klient", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var klientschaftKeyword = new KlientschaftKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        await sharedTestLogic.generateDossierViaApi(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId, context);

        await test.step("KL0X_ErwerbsituationEinnahmen_erfassen - Unselbständiges Erwerbseinkommen", async () => {
            await klientschaftKeyword.KL0X_ErwerbsituationEinnahmen_erfassen({
                dossier: uniqueDossiertId,
                klientschaft: testData.persons.FIRST_PERSON.fullName,
                topMenu: "Erwerbseinkommen",
                subMenu: "Unselbständiges Erwerbseinkommen",
                zahlbarDurch: TestCompanies.BKW,
                pensumm: "44",
                checkbox: "x",
                betrag: "1100",
                gueltigVon: DateHelper.getFirstDayOfTheYearString(),
                gueltigBis: DateHelper.getLastDayOfYearString(),
                schweregrad: "",
                diverseDok: PathHelper.getDocumentPath("ErwerbssituationAbtretung.docx")
            });
        });

        await test.step("KL0X_ErwerbsituationEinnahmen_erfassen - Selbständiges Erwerbseinkommen", async () => {
            await klientschaftKeyword.KL0X_ErwerbsituationEinnahmen_erfassen({
                dossier: uniqueDossiertId,
                klientschaft: testData.persons.FIRST_PERSON.fullName,
                topMenu: "Erwerbseinkommen",
                subMenu: "Selbständiges Erwerbseinkommen",
                zahlbarDurch: TestCompanies.AMT_JUSTIZVOLLZUG,
                pensumm: "",
                checkbox: "x",
                betrag: "1200",
                gueltigVon: DateHelper.getFirstDayOfTheYearString(),
                gueltigBis: DateHelper.getLastDayOfYearString(),
                schweregrad: "",
                diverseDok: PathHelper.getDocumentPath("ErwerbssituationAbtretung.docx")
            });
        });

        await test.step("KL0X_ErwerbsituationEinnahmen_erfassen - Ausbildungslohn", async () => {
            await klientschaftKeyword.KL0X_ErwerbsituationEinnahmen_erfassen({
                dossier: uniqueDossiertId,
                klientschaft: testData.persons.FIRST_PERSON.fullName,
                topMenu: "Erwerbseinkommen",
                subMenu: "Ausbildungslohn",
                zahlbarDurch: TestCompanies.AGRISANO,
                pensumm: "",
                checkbox: "",
                betrag: "1300",
                gueltigVon: DateHelper.getFirstDayOfTheYearString(),
                gueltigBis: DateHelper.getLastDayOfYearString(),
                schweregrad: "",
                diverseDok: PathHelper.getDocumentPath("ErwerbssituationAbtretung.docx")
            });
        });

        await test.step("KL0X_ErwerbsituationEinnahmen_erfassen - Praktikumslohn", async () => {
            await klientschaftKeyword.KL0X_ErwerbsituationEinnahmen_erfassen({
                dossier: uniqueDossiertId,
                klientschaft: testData.persons.FIRST_PERSON.fullName,
                topMenu: "Erwerbseinkommen",
                subMenu: "Praktikumslohn",
                zahlbarDurch: TestCompanies.ASSOCIATION_TRANSIT,
                pensumm: "",
                checkbox: "x",
                betrag: "1400",
                gueltigVon: DateHelper.getFirstDayOfTheYearString(),
                gueltigBis: DateHelper.getLastDayOfYearString(),
                schweregrad: "",
                diverseDok: PathHelper.getDocumentPath("ErwerbssituationAbtretung.docx")
            });
        });
    }
);
