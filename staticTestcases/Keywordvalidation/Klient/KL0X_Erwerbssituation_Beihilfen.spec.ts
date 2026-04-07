import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import { Wohnsituation } from "@keywords/wohnsituation-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as TestdataGenerator from "@utils/TestdataGenerator";
import * as DateHelper from "@utils/helpers/DateHelper";
import { PathHelper } from "@utils/helpers/pathHelper";
import { TestCompanies, HaushaltsEreignis, InHaushalt, Birthdays } from "@constants/testData";

test(
    "KL0X_Erwerbssituation_Beihilfen",
    {
        tag: ["@[183403]", "@klient", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var klientschaftKeyword = new KlientschaftKeyword(page);
        var wohnsituation = new Wohnsituation(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        await sharedTestLogic.generateDossierViaApi(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId, context);

        await test.step("WO30_Wohnsituation_Haushalt_Person_Hinzufuegen", async () => {
            await wohnsituation.WO30_Wohnsituation_Haushalt_Person_Hinzufuegen({
                name: testData.persons.SECOND_PERSON.name,
                vorname: testData.persons.SECOND_PERSON.vorname,
                geburtsdatum: Birthdays.ADULT_2,
                ahvNumber: TestdataGenerator.generateAhvNumber(seed + "2"),
                personInhausltVon: DateHelper.getFirstDayOfTheYearString(),
                inHauslt: InHaushalt.UEBERNEHMEN,
                ereignis: HaushaltsEreignis.EHESCHLIESSUNG
            });
        });

        await test.step("KL0X_ErwerbsituationEinnahmen_erfassen - Alters- und Invaliditätsbeihilfen", async () => {
            await klientschaftKeyword.KL0X_ErwerbsituationEinnahmen_erfassen({
                dossier: uniqueDossiertId,
                klientschaft: testData.persons.SECOND_PERSON.fullName,
                topMenu: "Beihilfen",
                subMenu: "Alters- und Invaliditätsbeihilfen",
                zahlbarDurch: TestCompanies.BKW,
                pensumm: "",
                checkbox: "",
                betrag: "400",
                gueltigVon: DateHelper.getFirstDayOfTheYearString(),
                gueltigBis: DateHelper.getLastDayOfYearString(),
                schweregrad: "",
                diverseDok: PathHelper.getDocumentPath("ErwerbssituationAbtretung.docx")
            });
        });

        await test.step("KL0X_ErwerbsituationEinnahmen_erfassen - Arbeitslosenhilfen", async () => {
            await klientschaftKeyword.KL0X_ErwerbsituationEinnahmen_erfassen({
                dossier: uniqueDossiertId,
                klientschaft: testData.persons.SECOND_PERSON.fullName,
                topMenu: "Beihilfen",
                subMenu: "Arbeitslosenhilfen",
                zahlbarDurch: TestCompanies.BKW,
                pensumm: "",
                checkbox: "",
                betrag: "400",
                gueltigVon: DateHelper.getFirstDayOfTheYearString(),
                gueltigBis: DateHelper.getLastDayOfYearString(),
                schweregrad: "",
                diverseDok: PathHelper.getDocumentPath("ErwerbssituationAbtretung.docx")
            });
        });

        await test.step("KL0X_ErwerbsituationEinnahmen_erfassen - Wohnbeihilfen", async () => {
            await klientschaftKeyword.KL0X_ErwerbsituationEinnahmen_erfassen({
                dossier: uniqueDossiertId,
                klientschaft: testData.persons.SECOND_PERSON.fullName,
                topMenu: "Beihilfen",
                subMenu: "Wohnbeihilfen",
                zahlbarDurch: TestCompanies.BKW,
                pensumm: "",
                checkbox: "",
                betrag: "400",
                gueltigVon: DateHelper.getFirstDayOfTheYearString(),
                gueltigBis: DateHelper.getLastDayOfYearString(),
                schweregrad: "",
                diverseDok: PathHelper.getDocumentPath("ErwerbssituationAbtretung.docx")
            });
        });

        await test.step("KL0X_ErwerbsituationEinnahmen_erfassen - Familienbeihilfen", async () => {
            await klientschaftKeyword.KL0X_ErwerbsituationEinnahmen_erfassen({
                dossier: uniqueDossiertId,
                klientschaft: testData.persons.SECOND_PERSON.fullName,
                topMenu: "Beihilfen",
                subMenu: "Familienbeihilfen",
                zahlbarDurch: TestCompanies.BKW,
                pensumm: "",
                checkbox: "",
                betrag: "400",
                gueltigVon: DateHelper.getFirstDayOfTheYearString(),
                gueltigBis: DateHelper.getLastDayOfYearString(),
                schweregrad: "",
                diverseDok: PathHelper.getDocumentPath("ErwerbssituationAbtretung.docx")
            });
        });

        await test.step("KL0X_ErwerbsituationEinnahmen_erfassen - Andere bedarfsabhängige Leistungen", async () => {
            await klientschaftKeyword.KL0X_ErwerbsituationEinnahmen_erfassen({
                dossier: uniqueDossiertId,
                klientschaft: testData.persons.SECOND_PERSON.fullName,
                topMenu: "Beihilfen",
                subMenu: "Andere bedarfsabhängige Leistungen (Beihilfen)",
                zahlbarDurch: TestCompanies.BKW,
                pensumm: "",
                checkbox: "",
                betrag: "400",
                gueltigVon: DateHelper.getFirstDayOfTheYearString(),
                gueltigBis: DateHelper.getLastDayOfYearString(),
                schweregrad: "",
                diverseDok: PathHelper.getDocumentPath("ErwerbssituationAbtretung.docx")
            });
        });
    }
);
