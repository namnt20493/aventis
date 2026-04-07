# Legacy Test Migration Guide (Archived)

> **Status:** Archived as of Feb 2026. Legacy migration is complete.
> This document is preserved for historical reference.

## Understanding Legacy Test Dependencies

Legacy tests in `testcases/` use **alphabetical ordering** for dependencies:
```
00_NewDossier       -> Creates Dossier (p.DossierName99)
01_ZahlgsVerbind    -> Payment approval (same dossier)
a02_WohnSituation   -> Household setup
b09_Bedarfspruefung -> Needs assessment + workflow
b11_Zahlung         -> Payment processing
```

Tests share data via `parameter.json` (DossierName99, FamilyName1, etc.)

## Legacy -> Modern Conversion Map

| Legacy Pattern | Modern Replacement |
|----------------|-------------------|
| `p.DossierName99` | `generateUniqueDossierId(seed)` |
| `p.FamilyName1` | `TestPersons.FIRST_PERSON.name` |
| `p.aventisURL` | `"/"` (relative URL) |
| `"22.11.2025"` (hardcoded) | `DateHelper.getTodayDateString()` |
| `.call(keyword, {...})` | `keyword.method({...})` (direct) |
| `M01_LoginMSOnline` | `Stable_Login` |
| `L03_LogoutAndLoginDiffAccount` | `Stable_LogoutAndLoginDiffAccount` |

## Legacy Dependencies -> API Workflows

| Legacy Test/Keyword | API Workflow Replacement |
|--------------------|-------------------------|
| `00_NewDossier` (GUI, ~5min) | `createDossierViaApiOnly()` (~100ms) |
| `01_ZahlgsVerbind` | `addZahlungsVerbindung()` or `createDossierViaApiOnlyWithPaymentConnection()` |
| `KL03_ErwerbsituationEinnahmen` | `createErwerbssituationViaApi()` |
| `b09_Bedarfspruefung` | `createBedarfspruefungViaApi()` |
| `BW02b_Bewilligungs_Workflow` | `setBewilligungsworkflowStepViaApi()` |

## Multi-User Workflow Pattern

Legacy uses **separate test files** for different users (serial execution required).
Modern uses **single test with user switches** (isolated, parallel-safe):

```typescript
test("Complete_Approval_Workflow", async ({ page, seed, authenticatedRequest }) => {
    const uniqueId = generateUniqueDossierId(seed);

    // Setup via API (fast)
    await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN_1A...);
    const dossierGuid = await createDossierViaApiOnly(...);

    // User 1: Create (Sozialarbeiterin)
    await bedarfsprufungKeyword.A01_AnspruchPruefung_Bedarfspruefung({...});

    // User 2: Review (Sachbearbeiterin)
    await commonKeyword.Stable_LogoutAndLoginDiffAccount(
        TestUsers.SACHBEARBEITERIN.username,
        TestUsers.SACHBEARBEITERIN.password
    );
    await bewilligungenKeywords.BW02b_Bewilligungs_Workflow_Step_V2({...});

    // User 3: Approve (Gemeinde-MA)
    await commonKeyword.Stable_LogoutAndLoginDiffAccount(
        TestUsers.GEMEINDE_MA.username,
        TestUsers.GEMEINDE_MA.password
    );
    await bewilligungenKeywords.BW02b_Bewilligungs_Workflow_Step_V2({...});

    // User 4: Payment (Buchhalter)
    await commonKeyword.Stable_LogoutAndLoginDiffAccount(
        TestUsers.BUCHHALTER.username,
        TestUsers.BUCHHALTER.password
    );
    await zahlungenKeyword.Z01_WSH_Zahlungen_Freigeben({...});
});
```

## User Role Constants

| Role | Constant | Purpose |
|------|----------|---------|
| Sozialarbeiterin 1A | `TestUsers.SOZIALARBEITERIN_1A` | Creates dossiers, assessments |
| Sachbearbeiterin | `TestUsers.SACHBEARBEITERIN` | First approval level |
| Gemeinde-MA | `TestUsers.GEMEINDE_MA` | Second approval level |
| Buchhalter | `TestUsers.BUCHHALTER` | Payment release |
| Amtsleiter | `TestUsers.AMTSLEITER` | Final approval |

## Migration Checklist

When migrating a legacy test:
- [ ] Replace `parameter.json` references with constants
- [ ] Replace hardcoded dates with `DateHelper`
- [ ] Replace hardcoded credentials with `TestUsers`
- [ ] Use `generateUniqueDossierId(seed)` for unique IDs
- [ ] Replace GUI dossier creation with API (`createDossierViaApiOnly`)
- [ ] Combine multi-user tests into single test with `Stable_LogoutAndLoginDiffAccount`
- [ ] Add appropriate tags (`@smoke`, `@wip`)
- [ ] Place in `staticTestcases/Keywordvalidation/`
- [ ] Verify test runs in isolation (no dependencies on other tests)

## Detailed Migration Documentation

For complete migration details, see `docs/MIGRATION_PLAN.md`
