import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { RahmenbudgetKeyword } from "@keywords/rahmenbudget-keyword";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { TestCompanies } from "@constants/testData";
import * as DateHelper from "@utils/helpers/DateHelper";
import { Wohnsituation } from "@libs/keywords/wohnsituation-keyword";
import { PathHelper } from "@utils/helpers/pathHelper";
import { createWshLeistungViaApi } from "@workflows";

test(
    "R07_Einkommen_Freibetrag_anpassen",
    {
        tag: ["@[183268]", "@rahmenbudget", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        const commonKeyword = new CommonKeyword(page);
        const rahmenbudgetKeyword = new RahmenbudgetKeyword(page);
        const klientschaftKeyword = new KlientschaftKeyword(page);
        const wohnsituationKeyword = new Wohnsituation(page);
        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);

        const dossierResult = await sharedTestLogic.generateDossierViaApiWithPerson(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId, context);

        await test.step("Create WSH-Leistung via API", async () => {
            await createWshLeistungViaApi(
                authenticatedRequest,
                {
                    dossierId: dossierResult.dossierId,
                    personInDossierId: dossierResult.personInDossierId
                },
                page
            );
        });

        await test.step("KL0X_ErwerbsituationEinnahmen_erfassen", async () => {
            await klientschaftKeyword.KL0X_ErwerbsituationEinnahmen_erfassen({
                dossier: uniqueDossiertId,
                klientschaft: testData.persons.FIRST_PERSON.fullName,
                topMenu: "Erwerbseinkommen",
                subMenu: "Unselbständiges Erwerbseinkommen",
                zahlbarDurch: TestCompanies.BKW,
                pensumm: "100",
                checkbox: "x",
                betrag: "2000",
                gueltigVon: DateHelper.getFirstDayOfTheYearString(),
                gueltigBis: DateHelper.getLastDayOfYearString(),
                schweregrad: "",
                diverseDok: PathHelper.getDocumentPath("ErwerbssituationAbtretung.docx")
            });
        });

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierResult.dossierId);
        });

        await test.step("WO32_01b_Wohnsituation_Haushalt_Wohnung_anpassen", async () => {
            await wohnsituationKeyword.WO32_01b_Wohnsituation_Haushalt_Wohnung_anpassen({
                vermieter: "Graber Immobilien",
                wohnungsgrosse: "3.5",
                mietkosten: "1800",
                nebenkosten: "150"
            });
        });

        await test.step("R07_Einkommen_Freibetrag_anpassen", async () => {
            await rahmenbudgetKeyword.R07_Einkommen_Freibetrag_anpassen({
                dossier: uniqueDossiertId,
                klient: testData.persons.FIRST_PERSON.fullName,
                geplantVon: DateHelper.getDaysFutureString(30),
                geplantBis: DateHelper.getLastDayOfYearString(),
                eFB: 500,
                begruendung: "Testbegründung für Freibetrag",
                totalNeu: 147
            });
        });
    }
);
