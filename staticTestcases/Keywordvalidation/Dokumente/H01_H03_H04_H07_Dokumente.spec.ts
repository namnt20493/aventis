import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { DossierKeyword } from "@keywords/dossier-keyword";
import { DocumentKeyword } from "@keywords/document-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { TestUsers } from "@constants/credentials";
import { TestMitarbeiter } from "@constants/testData";
import { PathHelper } from "@utils/helpers/pathHelper";

test(
    "H01_H03_H04_H07_Dokumente",
    {
        tag: ["@[182211]", "@dokumente", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var dokumenteKeyword = new DocumentKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);

        // Login als Sozialarbeiterin

        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        // Dossier via API erstellen
        await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);

        // H04: Dokument aus Vorlage erstellen
        await test.step("H04_Dokumente_ausVorlage_erstellen", async () => {
            await dokumenteKeyword.H04_Dokumente_ausVorlage_erstellen({
                vorlage: "Brief an Klientschaft",
                sprache: "Deutsch",
                titel: "TestDokument " + seed,
                thema: "Allgemein",
                betrifft: "Ganze Klientschaft",
                instOderBezug: "",
                instOBezNamen: "",
                kontPerson: "",
                absender: ""
            });
        });

        // H03: Dokumente filtern und öffnen
        await test.step("H03_Dokumente_Filtern_Oeffnen", async () => {
            await dokumenteKeyword.H03_Dokumente_Filtern_Oeffnen({
                searchDossierOrKlient: uniqueDossiertId,
                filterThema: "",
                stichWort: "TestDokument",
                docType: "",
                person: "",
                zeitRaum: "",
                checkDokument: "TestDokument " + seed
            });
        });

        // H07: Dokument hochladen
        await test.step("H07_Dokumente_Hochladen_Versionen", async () => {
            await dokumenteKeyword.H07_Dokumente_Hochladen_Versionen({
                klient: testData.persons.FIRST_PERSON.fullName,
                dokumente: "JournalEintrag.docx",
                docPath: PathHelper.getTestDataPath("documents")
            });
        });
    }
);
