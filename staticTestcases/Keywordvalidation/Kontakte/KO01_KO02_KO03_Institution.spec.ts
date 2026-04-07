import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { InstitutionenstammKeyword } from "@keywords/institutionenstamm-keyword";
import { VorlagenKeyword } from "@keywords/vorlagen-keyword";
import { TestUsers } from "@constants/credentials";
import { PathHelper } from "@utils/helpers/pathHelper";
import * as DateHelper from "@utils/helpers/DateHelper";

test(
    "KO01_KO02_KO02b_Institution_Fachperson",
    {
        tag: ["@[183099]", "@kontakte", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest }) => {
        var commonKeyword = new CommonKeyword(page);
        var institutionKeyword = new InstitutionenstammKeyword(page);

        const uniqueSuffix = seed.substring(0, 8);
        const uniqueInstName = `Testinstitut_${uniqueSuffix}`;
        const uniqueFachpersonVorname = `FPVn${uniqueSuffix}`;
        const uniqueFachpersonName = `FPNm${uniqueSuffix}`;
        const gueltigVon = DateHelper.getFirstOfMonthString();
        const gueltigBis = DateHelper.getLastDayOfYearString();
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

        await test.step("KO01_Institution_erfassen", async () => {
            await institutionKeyword.KO01_Institution_erfassen({
                instName: uniqueInstName,
                namenZusatz: "Inst.",
                zusatz: "am",
                strasse: "Strasse",
                hausNum: "12",
                telNummer: "123123123",
                email: "ein@zwei.ch",
                ort: "4566 Halten",
                postfach: "4567",
                website: "https://www.web.ww",
                typisierung: "Kollektivunterkunft",
                gueltigVon: gueltigVon,
                gueltigBis: gueltigBis
            });
        });

        await test.step("KO02_Fachperson_erfassen", async () => {
            await institutionKeyword.KO02_Fachperson_erfassen({
                vorname: uniqueFachpersonVorname,
                fachPersName: uniqueFachpersonName,
                namenZusatz: "",
                zusatz: "",
                strasse: "Fachpersonstrasse",
                geschlecht: "Männlich",
                hausNum: "10",
                telNummer: "0319876543",
                email: "fachperson@test.ch",
                ort: "Bern",
                postfach: "",
                website: "",
                typisierung: "Vermieter/in",
                gueltigVon: gueltigVon,
                gueltigBis: gueltigBis
            });
        });

        await test.step("KO02b_Fachperson_loeschen", async () => {
            await institutionKeyword.KO02b_Fachperson_loeschen({
                suche: `${uniqueFachpersonVorname},${uniqueFachpersonName}`,
                gueltigVon: gueltigVon,
                gueltigBis: gueltigBis
            });
        });
    }
);
