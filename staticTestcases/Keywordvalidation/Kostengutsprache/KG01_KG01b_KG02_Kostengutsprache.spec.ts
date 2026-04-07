import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { RahmenbudgetKeyword } from "@keywords/rahmenbudget-keyword";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { TestUsers } from "@constants/credentials";
import { TestCompanies } from "@constants/testData";
import * as DateHelper from "@utils/helpers/DateHelper";
import { generateDossierWithErwerbssituationAndWsh } from "@libs/workflows/guiDossierWorkflow";
import { Wohnsituation } from "@libs/keywords/wohnsituation-keyword";
import { PathHelper } from "@utils/helpers/pathHelper";

test(
    "KG01_KG01b_KG02_Kostengutsprache",
    {
        tag: ["@[183012]", "@kostengutsprache", "@keywordValidation", "@coreBusiness", "@perfMonitoring"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        const commonKeyword = new CommonKeyword(page);
        const rahmenbudgetKeyword = new RahmenbudgetKeyword(page);
        const klientschaftKeyword = new KlientschaftKeyword(page);
        const wohnsituationKeyword = new Wohnsituation(page);
        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);

        const dossierResult = await generateDossierWithErwerbssituationAndWsh(authenticatedRequest, commonKeyword, page, klientschaftKeyword, seed, uniqueDossiertId, context);

        await test.step("GoTo_Dossier_With_Url", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierResult.dossierId);
        });

        await test.step("WO32_01b_Wohnsituation_Haushalt_Wohnung_anpassen", async () => {
            await wohnsituationKeyword.WO32_01b_Wohnsituation_Haushalt_Wohnung_anpassen({
                vermieter: TestCompanies.GRABER_IMMOBILIEN,
                wohnungsgrosse: "3.5",
                mietkosten: "1800",
                nebenkosten: "150"
            });
        });

        await test.step("KG01_Antrag_Kostengutsprache_Erfassen", async () => {
            await rahmenbudgetKeyword.KG01_Antrag_Kostengutsprache_Erfassen({
                dossier: uniqueDossiertId,
                level1: "Situationsbedingte Leistungen",
                level2: "Gesundheit",
                level3: "Brille",
                titel: "Brille Antrag",
                leistungserbringer: `${TestCompanies.AGRISANO}, 5210 Brugg`,
                betrag: 1500,
                klient: testData.persons.FIRST_PERSON.fullName,
                gultigAb: DateHelper.getTodayDateString(),
                verFallDatum: DateHelper.getLastDayOfYearString(),
                begruendung: "Sehschwäche"
            });
        });

        await test.step("KG02_Antrag_Kostengutsprache_Bewilligen_WF", async () => {
            await rahmenbudgetKeyword.KG02_Antrag_Kostengutsprache_Bewilligen_WF({
                dossier: uniqueDossiertId,
                titel: "Brille Antrag",
                betrag: 1500
            });
        });

        const kostenVorDocPath = PathHelper.getDocumentPath("Bankverbindung.docx");

        await test.step("KG01b_Antrag_Kostengutsprache_Erfassen_mitDocument", async () => {
            await rahmenbudgetKeyword.KG01b_Antrag_Kostengutsprache_Erfassen_mitDocument({
                dossier: uniqueDossiertId,
                level1: "Situationsbedingte Leistungen",
                level2: "Gesundheit",
                level3: "Zahnarzt",
                titel: "Zahnarzt Behandlung",
                leistungserbringer: `${TestCompanies.AGRISANO}, 5210 Brugg`,
                betrag: 2000,
                klient: testData.persons.FIRST_PERSON.fullName,
                gultigAb: DateHelper.getTodayDateString(),
                verFallDatum: DateHelper.getLastDayOfYearString(),
                begruendung: "Zahnbehandlung erforderlich",
                kostenVorDoc: kostenVorDocPath,
                bewilligtDoc: kostenVorDocPath,
                diverseDoc: kostenVorDocPath
            });
        });
    }
);
