import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@keywords/common-keyword";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestCompanies } from "@constants/testData";
import { TestUsers } from "@constants/credentials";

/**
 * KL13b_Krankenversicherungen_Abtretung_beenden
 *
 * VORBEDINGUNG: Erfordert existierende KVG/VVG-Versicherung mit aktiver Abtretung
 * Dieser Test erstellt erst Krankenversicherungen (KL11, KL10) und startet eine Abtretung (KL13),
 * bevor er die Abtretung beendet (KL13b)
 *
 * STATUS: @wip - Komplexer Workflow mit mehreren Vorbedingungen
 */
test(
    "KL13b_KV_Abtretung_beenden",
    {
        tag: ["@[182993]", "@klient", "@keywordValidation"]
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        var commonKeyword = new CommonKeyword(page);
        var klientschaftKeyword = new KlientschaftKeyword(page);

        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
        const gueltigkeit = DateHelper.getTodayDateString();
        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId);

        await test.step("KL11_Krankenversicherungen_KVG_erfassen", async () => {
            await klientschaftKeyword.KL11_Krankenversicherungen_KVG_erfassen({
                Klientschaft: testData.persons.FIRST_PERSON.fullName,
                Gueltigkeit: gueltigkeit,
                KKasse: TestCompanies.AGRISANO,
                VersNummer: "123456789",
                GrundPraemie: "350",
                Unfall: "ja",
                Franchise: "300",
                Bemerkung: "Test KVG"
            });
        });

        await test.step("KL10_Krankenversicherungen_VVG_erfassen", async () => {
            await klientschaftKeyword.KL10_Krankenversicherungen_VVG_erfassen({
                klientschaft: testData.persons.FIRST_PERSON.fullName,
                Gueltigkeit: gueltigkeit,
                KKasse: TestCompanies.AGRISANO,
                VersNummer: "987654321",
                GrundPraemie: "50",
                ZahnInklusive: "ja",
                Franchise: "0",
                Bemerkung: "Test VVG"
            });
        });

        await test.step("KL13_Krankenversicherungen_Abtretung_starten", async () => {
            await klientschaftKeyword.KL13_Krankenversicherungen_Abtretung_starten({
                klientschaft: testData.persons.FIRST_PERSON.fullName,
                KVG: "yes",
                VVG: "yes"
            });
        });

        await test.step("KL13b_Krankenversicherungen_Abtretung_beenden", async () => {
            await klientschaftKeyword.KL13b_Krankenversicherungen_Abtretung_beenden({
                klientschaft: testData.persons.FIRST_PERSON.fullName,
                KVG: "yes",
                VVG: "yes"
            });
        });
    }
);
