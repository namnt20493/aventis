import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@keywords/common-keyword";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { TestUsers } from "@constants/credentials";
import * as path from "path";

test(
    "P10b_P19_Person_Communication_Update",
    {
        tag: ["@[182985]", "@klient", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var klientschaftKeyword = new KlientschaftKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        const documentPath = path.resolve("testfiles/documents/test.docx");
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);

        await test.step("P10b_Person_Communikation", async () => {
            await klientschaftKeyword.P10b_Person_Communikation({
                dossier: uniqueDossiertId,
                klient: testData.persons.FIRST_PERSON.fullName,
                kanal: "Telefonnummer erfassen",
                typ: "Telefonnummer Mobil",
                numberOrEmail: "078 222 33 44",
                mainChannel: "nein"
            });
        });

        await test.step("P19_Person_Personendaten_Update", async () => {
            await klientschaftKeyword.P19_Person_Personendaten_Update({
                dossier: uniqueDossiertId,
                klient: testData.persons.FIRST_PERSON.fullName,
                national: "Schweiz",
                geschlecht: "männlich",
                zivilstand: "ledig",
                korrSprache: "Deutsch",
                todesDatum: "",
                dokumente: ""
            });
        });

        await test.step("P19_Person_Personendaten_Update_with_Document", async () => {
            await klientschaftKeyword.P19_Person_Personendaten_Update({
                dossier: uniqueDossiertId,
                klient: testData.persons.FIRST_PERSON.fullName,
                national: "Italien",
                geschlecht: "männlich",
                zivilstand: "verheiratet",
                korrSprache: "Französisch",
                todesDatum: "",
                dokumente: documentPath
            });
        });
    }
);
