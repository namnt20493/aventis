import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { AufgabenKeyword } from "@keywords/aufgaben-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestMitarbeiter } from "@constants/testData";
import { TestUsers } from "@constants/credentials";

test(
    "a03_Aufgaben_Small",
    {
        annotation: { type: "known-bug", description: "https://diartis.visualstudio.com/Aventis/_workitems/edit/184872" },
        tag: ["@[181252]", "@aufgaben", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest }) => {
        test.skip(true, "Known Bug #184872: Database timeout in DO04c_Aufgabe_GUI");
        test.slow(); // Aufgaben-Tests benötigen mehr Zeit
        var commonKeyword = new CommonKeyword(page);
        var aufgabenKeyword = new AufgabenKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);

        // Login als Sozialarbeiterin

        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        // Dossier via API erstellen
        var dossierGuid = await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);

        const aufgabenTitel = "Eine wichtige Aufgabe_012";
        const faelligkeitDatum = DateHelper.getDaysFutureString(10);

        // DO04: Aufgabe erfassen
        await test.step("DO04_Aufgabe_erfassen", async () => {
            await aufgabenKeyword.DO04_Aufgabe_erfassen({
                aufgabenStatus: "Nicht begonnen",
                aufgabenTitel: aufgabenTitel,
                faelligkeitDatum: faelligkeitDatum,
                zugewiesenAn: TestMitarbeiter.SOZIALARBEITERIN,
                check: aufgabenTitel
            });
        });

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierGuid);
        });

        // DO04b: Aufgabe editieren
        await test.step("DO04b_Aufgabe_editieren", async () => {
            await aufgabenKeyword.DO04b_Aufgabe_editieren({
                oldFaelligkeitDatum: faelligkeitDatum,
                oldAufgabenTitel: aufgabenTitel,
                oldzugewiesenAn: TestMitarbeiter.SOZIALARBEITERIN,
                zugewiesenAn: TestMitarbeiter.SOZIALARBEITERIN,
                aufgabenTitel: "Editierte Aufgabe",
                status: "In Arbeit",
                prio: "Wichtig",
                startDatum: "",
                notizen: "Eine wichtige Notiz",
                checkList: "'Alles wird gut', 'Der Himmel ist blau', 'Das wasser ist grün'",
                verKnuepfung: "https://www.google.com/"
            });
        });

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierGuid);
        });

        // DO04c: Aufgabe GUI - Status per Drag&Drop ändern
        await test.step("DO04c_Aufgabe_GUI", async () => {
            await aufgabenKeyword.DO04c_Aufgabe_GUI({
                dossierBezeichnung: uniqueDossiertId,
                zugewiesenAn: TestMitarbeiter.SOZIALARBEITERIN,
                aufgabenTitel: "Editierte Aufgabe",
                statusDragTo: "Nicht begonnen"
            });
        });

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierGuid);
        });

        // DO04d: Aufgaben filtern und Notiz editieren
        // await test.step('DO04d_Aufgaben_filtern_selektieren', async ()=> {
        //     await aufgabenKeyword.DO04d_Aufgaben_filtern_selektieren({
        //         dossier: uniqueDossiertId,
        //         zugewMitarbeiter: TestMitarbeiter.SOZIALARBEITERIN,
        //         erstelltDurch: TestMitarbeiter.SOZIALARBEITERIN,
        //         status: "",
        //         aufGabeTitel: "Editierte Aufgabe",
        //         datum: faelligkeitDatum,
        //         notiz: "Notiz durch DO04d aktualisiert"
        //     });
        // });
        // await test.step('GoTo_Dossier_With_Url', async ()=> {
        //     await commonKeyword.GoTo_Dossier_With_Url(dossierGuid);
        // });

        // DO04e: Dokument zu Aufgabe hinzufügen
        // await test.step('DO04e_zuAufgabe_Dokument_hinzufuegen', async ()=> {
        //     await aufgabenKeyword.DO04e_zuAufgabe_Dokument_hinzufuegen({
        //         dossier: uniqueDossiertId,
        //         zugewMitarbeiter: TestMitarbeiter.SOZIALARBEITERIN,
        //         erstelltDurch: TestMitarbeiter.SOZIALARBEITERIN,
        //         status: "",
        //         aufGabeTitel: "Editierte Aufgabe",
        //         datum: faelligkeitDatum,
        //         dokumentName: "Interinstitutionelle Zusammenarbeit"
        //     });
        // });
    }
);
