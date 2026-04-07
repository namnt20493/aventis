import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { PHKeyword } from "@keywords/ph-keyword";
import { Wohnsituation } from "@keywords/wohnsituation-keyword";
import { BedarfsprufungKeyword } from "@keywords/bedarfsprufung-keyword";
import { BewilligungenKeywords } from "@keywords/bewilligungen-keywords";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestUsers } from "@constants/credentials";

/**
 * PH03_HaeuslicheGewalt_Meldung
 *
 * STATUS: @wip - BLOCKED BY SYSTEM CONFIGURATION
 *
 * ISSUE:
 * The "Häusliche Gewalt" (Domestic Violence) module is locked for newly created dossiers.
 * The lock icon remains even after completing the full Bewilligungsworkflow.
 *
 * WHAT WORKS:
 * - Dossier creation via API
 * - Adding 4-person household (main person, adult woman, boy child, girl child)
 * - Creating Bedarfsprüfung via GUI (A01)
 * - Creating Leistungsentscheid via GUI (BW01)
 * - Bewilligungsworkflow approval (BW02b with Sachbearbeiterin and Gemeinde_MA)
 *
 * WHAT DOESN'T WORK:
 * - The Häusliche Gewalt link shows a lock icon after ALL workflow steps
 * - Clicking the link does NOT navigate to the module page
 * - The module remains inaccessible regardless of workflow status
 *
 * ROOT CAUSE ANALYSIS:
 * The legacy test (PH03.spec.ts) uses DossierName2 ("2_E2E_KW_Smoketest_V4_QA") which is a
 * pre-existing dossier in the QA environment. This dossier has the Häusliche Gewalt module
 * enabled at the system level (likely Gemeinde or Mandant configuration).
 *
 * RESOLUTION REQUIRED:
 * A system administrator must enable the "Häusliche Gewalt" module for:
 * - The test Gemeinde (Moosseedorf/Münchenbuchsee)
 * - OR the test user roles
 * - OR the specific dossier types created by the test
 *
 * This is NOT a code issue - it's a system-level configuration issue.
 *
 * WORKAROUNDS CONSIDERED BUT NOT IMPLEMENTED:
 * 1. Use pre-existing DossierName2 - breaks test isolation
 * 2. API call to enable module - no such API endpoint found
 * 3. Different user role - all tested roles (SOZIALARBEITERIN_1A, KANTONS_MA) blocked
 */
test.skip(
    "PH03_HaeuslicheGewalt_Meldung",
    {
        tag: ["@keywordValidation", "@wip"]
    },
    async ({ page, seed, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var phKeyword = new PHKeyword(page);
        var wohnsituationKeyword = new Wohnsituation(page);
        var bedarfspruefungKeyword = new BedarfsprufungKeyword(page);
        var bewilligungsKeyword = new BewilligungenKeywords(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        // Create dossier with 4-person household, Bedarfsprüfung and full Bewilligungsworkflow
        // This workflow creates all necessary prerequisites but the module remains locked
        await sharedTestLogic.createDossierWithHouseholdForHaeuslicheGewalt(authenticatedRequest, commonKeyword, wohnsituationKeyword, bedarfspruefungKeyword, bewilligungsKeyword, page, seed, uniqueDossiertId);

        // Execute the PH03 keyword with the girl child as Opfer
        // This step fails because the Häusliche Gewalt module is locked
        await test.step("PH03_HaueslicheGewalt_Meldung_erfassen", async () => {
            await phKeyword.PH03_HaueslicheGewalt_Meldung_erfassen({
                MeldungVom: DateHelper.getTodayDateString(),
                Status: "Unbekannt",
                Beziehung: "Kind",
                ArtDerGewalt: "Physisch",
                Opfer: `${testData.persons.FIRST_PERSON.name}, ${testData.persons.CHILD_GIRL.vorname}`,
                Erlaeuterung: "Testmeldung häusliche Gewalt",
                InfoOperH: "ja",
                OHVerlauf: "Ein Text",
                OHKontaktAm: DateHelper.getTodayDateString()
            });
        });
    }
);
