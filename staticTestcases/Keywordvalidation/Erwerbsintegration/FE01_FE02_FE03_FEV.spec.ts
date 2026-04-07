import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { FreiwilligeKeyword } from "@keywords/freiwillige-keyword";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import { BedarfsprufungKeyword } from "@keywords/bedarfsprufung-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { TestCompanies } from "@constants/testData";
import { TestUsers } from "@constants/credentials";
import * as DateHelper from "@utils/helpers/DateHelper";
import { generateUniqueIban } from "@utils/TestdataGenerator";

test(
    "FE01_FE02_FE03_FEV_Erwerbsintegration",
    {
        tag: ["@[183103]", "@erwerbsintegration", "@keywordValidation", "@coreBusiness"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        const commonKeyword = new CommonKeyword(page);
        const freiwilligeKeyword = new FreiwilligeKeyword(page);
        const klientschaftKeyword = new KlientschaftKeyword(page);
        const bedarfsprufungKeyword = new BedarfsprufungKeyword(page);
        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        const dossierGuid = await sharedTestLogic.createDossierViaApiOnlyWithPaymentConnection(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);

        await test.step("A02_AnspruchPruefung_Bedarfspruefung_FEV - Enable FEV", async () => {
            await bedarfsprufungKeyword.A02_AnspruchPruefung_Bedarfspruefung_FEV({
                dossier: uniqueDossiertId,
                entscheidVon: DateHelper.getTodayDateString(),
                begruendung: "FEV Test Begründung",
                unterstuetzungAb: DateHelper.getFirstOfMonthString(),
                kontoVerbindung: `${testData.persons.FIRST_PERSON.name}, ${testData.persons.FIRST_PERSON.vorname}`
            });
        });

        const geplantAb = DateHelper.getFirstOfMonthString();
        const geplantBis = DateHelper.getLastDayOfYearString();
        const betragKlient = 1345.45;
        const beschreibungKlient = "Miete und Nebenkosten vom Lohn";
        const generatedIban = generateUniqueIban(seed);

        await test.step("FE01_FEV_BudgetPosition_New - Klientschaft", async () => {
            await freiwilligeKeyword.FE01_FEV_BudgetPosition_New({
                dossier: uniqueDossiertId,
                konto: "3000 Miete und Nebenkosten",
                beschreibung: beschreibungKlient,
                betragMonatl: betragKlient,
                geplantAb: geplantAb,
                geplantBis: geplantBis,
                zahlMethode: "Wiederkehrende Zahlung",
                zahlungsEmpfang: "Klientschaft",
                zahlungsVerbindung: testData.persons.FIRST_PERSON.name + ", " + testData.persons.FIRST_PERSON.vorname + " - " + generatedIban,
                periode: "Monatlich",
                referenzScor: "",
                mitteilung: "Miete und Nebenkosten Testzahlung"
            });
        });

        const totalBudget = betragKlient;

        await test.step("FE02_FEV_Budget_Anzeige", async () => {
            await freiwilligeKeyword.FE02_FEV_Budget_Anzeige({
                dossier: uniqueDossiertId,
                beschreibung: beschreibungKlient,
                zahlEmpf: "Klientschaft",
                zahlMeth: "Wiederkehrende Zahlung",
                konto: "3000 Miete und Nebenkosten",
                gueltigkeit: "",
                zahlVerbinudung: `${testData.persons.FIRST_PERSON.name}, ${testData.persons.FIRST_PERSON.vorname} - ${generatedIban}`,
                periode: "Monatlich",
                betrag: betragKlient,
                total: totalBudget
            });
        });

        const monthsOfPayment = 7;
        const totalPaymentValue = betragKlient * monthsOfPayment;
        const totalPayment = new Intl.NumberFormat("de-CH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(totalPaymentValue);
        const saldoVorschau = `-${totalPayment}`;

        await test.step("FE03_FEV_Zahlungen_freigeben", async () => {
            await freiwilligeKeyword.FE03_FEV_Zahlungen_freigeben({
                dossier: uniqueDossiertId,
                ausgewaehltePosSum: totalPayment,
                saldoVorschau: saldoVorschau,
                clickAuswahlFreigeben: ""
            });
        });
    }
);
