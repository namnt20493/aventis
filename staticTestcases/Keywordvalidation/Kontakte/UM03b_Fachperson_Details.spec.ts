import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { UmfeldKeyword } from "@keywords/umfeld-keyword";
import { TestUsers } from "@constants/credentials";
import * as DateHelper from "@utils/helpers/DateHelper";
import { generateUniqueIban } from "@libs/utils/TestdataGenerator";

test(
    "UM03b_Fachperson_erfassen_details",
    {
        tag: ["@[183694]", "@kontakte", "@keywordValidation"]
    },
    async ({ page, seed }) => {
        var commonKeyword = new CommonKeyword(page);
        var umfeldKeyword = new UmfeldKeyword(page);

        const uniqueSuffix = seed.substring(0, 6);
        const fachpersonName = `Müller${uniqueSuffix}`;
        const fachpersonVorname = `Paula${uniqueSuffix}`;
        const gueltigVon = DateHelper.getFirstOfMonthString();
        const gueltigBis = DateHelper.getLastDayOfYearString();
        const uniqueIban = generateUniqueIban(seed);
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SUPERUSER.username, TestUsers.SUPERUSER.password);
        });

        await test.step("UM03b_Fachperson_erfassen_details", async () => {
            await umfeldKeyword.UM03b_Fachperson_erfassen_details({
                name: fachpersonName,
                strasse: "Weckerweg",
                vorname: fachpersonVorname,
                hausNr: "12",
                gueltigVon: gueltigVon,
                gueltigBis: gueltigBis,
                tel: "0311234567",
                eMail: "test@fachperson.ch",
                ort: "5210 Windisch",
                typisierung: "Kinderbetreuung",
                geschlecht: "weiblich",
                iBanNummer: uniqueIban,
                iBANName: "TEST",
                iBANStrasse: "",
                iBANhausNr: "",
                iBANPostfach: "",
                iBANOrt: "5210 Windisch",
                iBANGultigVon: "",
                iBANGueltigBis: ""
            });
        });
    }
);
