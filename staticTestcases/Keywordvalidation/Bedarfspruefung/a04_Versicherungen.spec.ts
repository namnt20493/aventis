import { test } from "@libs/test-fixtures";

import { CommonKeyword } from "@libs/keywords";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { PathHelper } from "@utils/helpers/pathHelper";
import { TestCompanies } from "@constants/testData";

test(
    "a04_Versicherungen",
    {
        tag: ["@[181253]", "@bedarfspruefung", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var klientschaftKeyword = new KlientschaftKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        await sharedTestLogic.generateDossierViaApiWithPerson(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId, context);

        await test.step("KL10_Krankenversicherungen_VVG_erfassen", async () => {
            await klientschaftKeyword.KL10_Krankenversicherungen_VVG_erfassen({
                klientschaft: testData.persons.FIRST_PERSON.fullName,
                Gueltigkeit: DateHelper.getFirstDayOfTheYearString() + " - " + DateHelper.getLastDayOfYearString(),
                KKasse: TestCompanies.ARCOSANA,
                VersNummer: "123",
                GrundPraemie: "45",
                ZahnInklusive: "ja",
                Franchise: "100",
                Bemerkung: "Test"
            });
        });

        await test.step("KL11b_Krankenversicherungen_KVG_erfassen", async () => {
            await klientschaftKeyword.KL11b_Krankenversicherungen_KVG_erfassen({
                klientschaft: testData.persons.FIRST_PERSON.fullName,
                gueltigkeit: DateHelper.getFirstDayOfTheYearString() + " - " + DateHelper.getLastDayOfYearString(),
                kKasse: TestCompanies.ARCOSANA,
                versNummer: "333",
                grundPraemie: "450",
                unfall: "ja",
                franchise: "100",
                bemerkung: "Test",
                IPV: "65",
                police: PathHelper.getDocumentPath("KrankenVersicherungPolice.docx")
            });
        });
    }
);
