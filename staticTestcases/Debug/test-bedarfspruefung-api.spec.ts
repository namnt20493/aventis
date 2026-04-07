import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { KlientschaftKeyword } from "@keywords/klientshaft-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { generateDossierWithErwerbssituationAndWsh } from "@libs/workflows/guiDossierWorkflow";

// Test: Erwerbssituation + WSH-Leistung via API
test(
    "test-erwerbssituation-wsh-api",
    {
        tag: ["@debug"]
    },
    async ({ page, seed, context, authenticatedRequest }) => {
        console.log(`🔧 [TEST] Starting with seed: ${seed}`);

        if (!seed) {
            throw new Error("Test seed parameter is undefined");
        }

        const commonKeyword = new CommonKeyword(page);
        const klientschaftKeyword = new KlientschaftKeyword(page);
        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);

        // Call the exported workflow function
        await generateDossierWithErwerbssituationAndWsh(authenticatedRequest, commonKeyword, page, klientschaftKeyword, seed, uniqueDossiertId, context);

        console.log("✅ Test completed successfully");
    }
);
