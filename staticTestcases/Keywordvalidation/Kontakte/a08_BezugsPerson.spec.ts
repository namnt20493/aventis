import { test } from "@libs/test-fixtures";

import { CommonKeyword } from "@libs/keywords";
import { UmfeldKeyword } from "@keywords/umfeld-keyword";
import { BewilligungenKeywords } from "@keywords/bewilligungen-keywords";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { PathHelper } from "@utils/helpers/pathHelper";
import { TestUsers } from "@constants/credentials";

test(
    "a08_BezugsPerson",
    {
        tag: ["@[181256]", "@kontakte", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest }) => {
        var commonKeyword = new CommonKeyword(page);
        var umfeldKeyword = new UmfeldKeyword(page);
        var bewilligungenKeywords = new BewilligungenKeywords(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        await sharedTestLogic.generateDossierViaApi(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId, context);

        await test.step("U01_Bezugsperson_erfassen", async () => {
            await umfeldKeyword.U01_Bezugsperson_erfassen({
                name: "Moser",
                vorname: "Luici",
                rolle: "Clown",
                zusatz: "",
                strasse: "Strassenweg",
                hausNummer: "12",
                Ort: "4566 Halten"
            });
        });

        await test.step("U01b_Bezugsperson_ZahlVerbindung_erfassen", async () => {
            await umfeldKeyword.U01b_Bezugsperson_ZahlVerbindung_erfassen({
                dossier: uniqueDossiertId,
                bezPerson: "Moser, Luici",
                IBAN: "CH21 0078 9100 0000 2920 0",
                gueltigVon: DateHelper.getTodayDateString(),
                gueltigBis: DateHelper.getLastDayOfYearString(),
                strasse: "Weg",
                nummer: "12",
                postfach: "",
                ort: "4566 Halten",
                datei: PathHelper.getDocumentPath("test.docx")
            });
        });

        await test.step("U01c_Bezugsperson_ZahlVerbindung_freigeben", async () => {
            await umfeldKeyword.U01c_Bezugsperson_ZahlVerbindung_freigeben({
                dossier: uniqueDossiertId,
                bezPerson: "Moser, Luici"
            });
        });

        await test.step("L03_LogoutAndLoginDiffAccount", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

        await test.step("BW02_Bewilligungs_Workflow_Step", async () => {
            await bewilligungenKeywords.BW02_Bewilligungs_Workflow_Step({
                dossier: uniqueDossiertId,
                buttonName: "Bewilligen",
                checkStatus: "Bewilligt"
            });
        });
    }
);
5;
