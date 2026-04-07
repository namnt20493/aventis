import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { TestUsers } from "@constants/credentials";
import { TestCompanies } from "@constants/testData";
import { UmfeldKeyword } from "@keywords/umfeld-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";

test(
    "UM02_InstitutionFachperson_erfassen",
    {
        tag: ["@[183693]", "@183164", "@kontakte", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest }) => {
        var commonKeyword = new CommonKeyword(page);
        var umfeldKeyword = new UmfeldKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);

        await test.step("UM02_InstitutionFachperson_erfassen", async () => {
            await umfeldKeyword.UM02_InstitutionFachperson_erfassen({
                institution: TestCompanies.BKW,
                kontaktPerson: "",
                Rolle: "Energielieferant"
            });
        });
    }
);

test(
    "UM03_Institution_erfassen_details",
    {
        tag: ["@183165", "@kontakte", "@keywordValidation"]
    },
    async ({ page, seed, authenticatedRequest }) => {
        var commonKeyword = new CommonKeyword(page);
        var umfeldKeyword = new UmfeldKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        const uniqueInstitutionName = `TestInstitution_${seed.substring(0, 8)}`;
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SUPERUSER.username, TestUsers.SUPERUSER.password);
        });

        await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);

        await test.step("UM03_Institution_erfassen_details", async () => {
            await umfeldKeyword.UM03_Institution_erfassen_details({
                name: uniqueInstitutionName,
                strasse: "Teststrasse",
                hausNr: "42",
                gueltigVon: DateHelper.getTodayDateString(),
                gueltigBis: DateHelper.getLastDayOfYearString(),
                typisierung: "Krankenkasse",
                tel: "0311234567",
                eMail: "test@institution.ch",
                ort: "5210 Windisch",
                kPName: "Kontakt",
                kPVorname: "Person",
                kPTel: "0319876543",
                kPMobile: "0791234567",
                kPEmail: "kontakt@institution.ch",
                kPAbteilung: "Verwaltung",
                kPIBAN: "CH2100789100000064411",
                iBANName: uniqueInstitutionName,
                iBANStrasse: "Teststrasse",
                iBANhausNr: "42",
                iBANPostfach: "",
                iBANOrt: "5210 Windisch",
                iBANGultigVon: DateHelper.getTodayDateString(),
                iBANGueltigBis: DateHelper.getLastDayOfYearString()
            });
        });
    }
);
