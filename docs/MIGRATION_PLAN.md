# Test Migration Plan: Legacy to Static Test Architecture

## Executive Summary

This document captures the knowledge from analyzing legacy `testcases/` and modern `staticTestcases/` to create a comprehensive migration strategy.

---

## 1. Legacy Architecture Analysis

### 1.1 Serial Test Dependency Pattern (001_DossierKomplett_Seriell_QA)

Legacy tests rely on **alphabetical ordering** to create dependencies:

```
00_NewDossier.spec.ts       → Creates Dossier with p.DossierName99
01_ZahlgsVerbind.spec.ts    → Uses same dossier (payment approval)
a02_WohnSituation.spec.ts   → Adds household members
a03_Aufgaben.spec.ts        → Creates tasks
a04_Versicherungen.spec.ts  → Insurance data
a05_Journal.spec.ts         → Journal entries
a06_DokuAusVorlage.spec.ts  → Documents
a07_Ziele.spec.ts           → Goals
a08_BezugsPerson.spec.ts    → Recipient
b09_Bedarfspruefung.spec.ts → Needs assessment (creates workflow)
b10_SozialHilfeSchuld.spec.ts → Debt management
b11_Zahlung.spec.ts         → Payment processing
```

**Key Insight:** Each test depends on the previous test's data. They share `p.DossierName99` from `parameter.json`.

### 1.2 Parameter Sharing Mechanism

```
parameter.json
├── DossierName1-100    (Unique dossier IDs with timestamps)
├── FamilyName1-100     (Surnames with random suffix: "Müller25612")
├── ManFirstName1-100   (Male first names)
├── AHVNumber1-400      (Social security numbers)
├── IBAN1-100           (Swiss bank accounts)
└── Date constants      (dayTodayDate, endOfMonthDate, etc.)
```

### 1.3 Problems with Legacy Approach

| Problem | Impact |
|---------|--------|
| Sequential execution required | Cannot parallelize, slow CI |
| Hardcoded dates | Tests break over time |
| Shared state via parameter.json | Race conditions in parallel |
| GUI-only dossier creation | ~5 min per test setup |
| Hardcoded credentials | Security risk, maintenance burden |
| No test isolation | One failure cascades to all |

---

## 2. Modern Architecture (staticTestcases/)

### 2.1 Key Improvements

| Aspect | Legacy | Modern |
|--------|--------|--------|
| Fixture | Custom per file | `@libs/test-fixtures` |
| Credentials | Hardcoded | `TestUsers` constants |
| Test Data | `parameter.json` | `TestPersons`, `TestCompanies` |
| Unique IDs | Hardcoded | `seed` + `generateUniqueDossierId()` |
| Dossier Setup | GUI (~5 min) | API (~100ms) |
| Dates | Hardcoded | `DateHelper` utilities |
| Login | `M01_LoginMSOnline` | `Stable_Login` |
| Parallel Safe | No | Yes |

### 2.2 Standard Test Structure

```typescript
import { test } from "@libs/test-fixtures";
import { TestUsers } from "@constants/credentials";
import { TestPersons } from "@constants/testData";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";

test(
    "TestName",
    { tag: ["@smoke"] },
    async ({ page, seed, context, authenticatedRequest }) => {
        // 1. Initialize keywords
        const commonKeyword = new CommonKeyword(page);

        // 2. Generate unique ID
        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);

        // 3. Login
        await test.step("Login", async () => {
            await commonKeyword.L00_URLAventis({ url: "/" });
            await commonKeyword.Stable_Login(
                TestUsers.SOZIALARBEITERIN_1A.username,
                TestUsers.SOZIALARBEITERIN_1A.password
            );
        });

        // 4. API Setup (FAST!)
        const dossierGuid = await sharedTestLogic.createDossierViaApiOnly(
            authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId
        );

        // 5. Actual Test Steps
        await test.step("Test Feature", async () => {
            // Test code here
        });
    }
);
```

---

## 3. Migration Strategy

### 3.1 Phase 1: Identify Test Categories

**Category A: Independent Tests**
- Smoke tests that create own dossier
- Single-feature validation
- Can migrate directly to isolated tests

**Category B: Sequential Workflow Tests**
- Need multiple users (approval workflows)
- Build on previous state
- Migrate using API setup + multi-user pattern

**Category C: Complex Integration Tests**
- Full E2E scenarios
- Multiple dossiers/persons
- Migrate using workflow helper functions

### 3.2 Phase 2: Create Shared Workflows

Map legacy dependencies to reusable API workflows:

```
Legacy: 00_NewDossier + 01_ZahlgsVerbind
Modern: createDossierViaApiOnlyWithPaymentConnection()

Legacy: 00_ + a02_ + KL03_
Modern: generateDossierWithErwerbssituationAndWsh()

Legacy: 00_ + 01_ + b09_ + approval steps
Modern: createBedarfspruefungViaApi() + setBewilligungsworkflowStepViaApi()
```

### 3.3 Phase 3: Multi-User Pattern

Replace serial tests with single-test multi-login:

```typescript
// BEFORE: 3 separate test files sharing state
// test1.spec.ts - User A creates
// test2.spec.ts - User B approves
// test3.spec.ts - User C finalizes

// AFTER: Single isolated test with user switches
test("Complete Approval Workflow", async ({ page, seed, authenticatedRequest }) => {
    const uniqueId = generateUniqueDossierId(seed);

    // User A: Create
    await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN_1A...);
    await createBedarfspruefung(...);

    // User B: Approve
    await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN...);
    await approveStep1(...);

    // User C: Finalize
    await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.GEMEINDE_MA...);
    await finalizeApproval(...);
});
```

---

## 4. Skill Definition: Test Migration

### 4.1 Skill Prompt Template

```markdown
## Aventis Test Migration Skill

When migrating legacy tests from `testcases/` to `staticTestcases/`:

### Step 1: Analyze Legacy Test
1. Read the legacy test file
2. Identify dependencies (which tests run before this one?)
3. Map parameter.json references to constants
4. List GUI steps that can be replaced with API

### Step 2: Map Dependencies to API Setup
| Legacy Dependency | Modern API Equivalent |
|-------------------|----------------------|
| 00_NewDossier | createDossierViaApiOnly() |
| 01_ZahlgsVerbind | addZahlungsVerbindung() |
| a02_WohnSituation + KL03_ | generateDossierWithErwerbssituationAndWsh() |
| b09_Bedarfspruefung | createBedarfspruefungViaApi() |
| Approval workflow | setBewilligungsworkflowStepViaApi() |

### Step 3: Convert Test Structure
```typescript
// Import modern fixtures
import { test } from "@libs/test-fixtures";
import { TestUsers } from "@constants/credentials";
import { TestPersons } from "@constants/testData";
import * as DateHelper from "@utils/helpers/DateHelper";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";

// Replace hardcoded values
// OLD: p.DossierName99
// NEW: sharedTestLogic.generateUniqueDossierId(seed)

// OLD: "22.11.2025"
// NEW: DateHelper.getTodayDateString()

// OLD: "FamilyName1"
// NEW: TestPersons.FIRST_PERSON.name
```

### Step 4: Handle Multi-User Scenarios
If legacy uses different users across tests:
1. Identify user sequence
2. Use Stable_LogoutAndLoginDiffAccount() between user switches
3. Keep all steps in single test for isolation

### Step 5: Apply Tags
- `@smoke` for core tests
- `@wip` for tests in development
- `@[issueId]` for issue tracking
```

### 4.2 Dependency Resolution Map

```typescript
// libs/workflows/dependencyMap.ts

export const LEGACY_TO_API_MAP = {
    // Dossier Creation
    "00_NewDossier": "createDossierViaApiOnly",
    "D01_Dossier_Eroeffnen": "createDossierViaApiOnly",

    // Payment Connection
    "01_ZahlgsVerbind": "addZahlungsVerbindung",
    "ZV01_Zahlungsverbindung": "addZahlungsVerbindung",

    // Person Setup
    "P01_Person": "createPersonViaApi", // TODO: implement
    "a02_WohnSituation": "addHouseholdMembers", // TODO: implement

    // Erwerbssituation
    "KL03_ErwerbsituationEinnahmen": "createErwerbssituationViaApi",

    // Bedarfsprüfung
    "b09_Bedarfspruefung": "createBedarfspruefungViaApi",
    "A01_AnspruchPruefung_Bedarfspruefung": "createBedarfspruefungViaApi",

    // Workflow Approval
    "BW02b_Bewilligungs_Workflow": "setBewilligungsworkflowStepViaApi",

    // Zahlungen
    "b11_Zahlung": "createZahlungViaApi" // TODO: implement
};

export const USER_ROLE_MAP = {
    "Sozialarbeiterin 1A": "SOZIALARBEITERIN_1A",
    "Sachbearbeiterin": "SACHBEARBEITERIN",
    "Gemeinde-MA": "GEMEINDE_MA",
    "Buchhalter": "BUCHHALTER",
    "Amtsleiter": "AMTSLEITER"
};
```

---

## 5. Migration Checklist

### Per-Test Migration Checklist

- [ ] Read legacy test and understand what it tests
- [ ] Identify all dependencies (previous tests it relies on)
- [ ] Map dependencies to API workflows
- [ ] Replace `parameter.json` references with constants
- [ ] Replace hardcoded dates with DateHelper
- [ ] Replace hardcoded credentials with TestUsers
- [ ] Use `generateUniqueDossierId(seed)` for unique IDs
- [ ] Use `createDossierViaApiOnly()` for fast setup
- [ ] Handle multi-user with `Stable_LogoutAndLoginDiffAccount()`
- [ ] Add appropriate tags (`@smoke`, `@wip`)
- [ ] Place in correct folder (Smoke/, Keywordvalidation/, WIP/)
- [ ] Verify test runs in isolation
- [ ] Verify test can run in parallel

### Migration Priority Order

1. **Smoke Tests First** (simple, validate migration works)
2. **Keyword Validation** (single-feature tests)
3. **Complex Workflows** (multi-user approval chains)
4. **Integration Tests** (full E2E scenarios)

---

## 6. Example Migrations

### Example 1: Simple Test (00_NewDossier → Smoke/00_NewDossier.spec.ts)

**Legacy:**
```typescript
test('00_NewDossier', async ({ page }) => {
    await commonKeyword.M01_LoginMSOnline({
        username: "bern.sozialarbeiterin1a@diartis.ch",
        password: "...",
    });
    // 15+ GUI steps to create dossier
});
```

**Modern:**
```typescript
test("00_NewDossier", { tag: ["@smoke"] }, async ({ page, seed, authenticatedRequest }) => {
    const uniqueId = sharedTestLogic.generateUniqueDossierId(seed);

    await commonKeyword.Stable_Login(
        TestUsers.SOZIALARBEITERIN_1A.username,
        TestUsers.SOZIALARBEITERIN_1A.password
    );

    // API creates dossier in ~100ms
    await sharedTestLogic.createDossierViaApiOnly(
        authenticatedRequest, commonKeyword, page, seed, uniqueId
    );
});
```

### Example 2: Multi-User Workflow (b09_ + b10_ + b11_ → Single Test)

**Legacy (3 files, must run sequentially):**
```
b09_Bedarfspruefung.spec.ts (User: Sozialarbeiterin)
b10_SozialHilfeSchuld.spec.ts (User: Sachbearbeiterin)
b11_Zahlung.spec.ts (User: Buchhalter)
```

**Modern (1 file, isolated):**
```typescript
test("Bedarfspruefung_Complete_Workflow", async ({ page, seed, context, authenticatedRequest }) => {
    const uniqueId = generateUniqueDossierId(seed);

    // Setup via API
    await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN_1A...);
    const dossierGuid = await createDossierViaApiOnlyWithPaymentConnection(...);
    await createErwerbssituationViaApi(...);

    // Step 1: Create Bedarfsprüfung (Sozialarbeiterin)
    await bedarfsprufungKeyword.A01_AnspruchPruefung_Bedarfspruefung({...});

    // Step 2: First Approval (Sachbearbeiterin)
    await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN...);
    await bewilligungenKeywords.BW02b_Bewilligungs_Workflow_Step_V2({...});

    // Step 3: Second Approval (Gemeinde-MA)
    await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.GEMEINDE_MA...);
    await bewilligungenKeywords.BW02b_Bewilligungs_Workflow_Step_V2({...});

    // Step 4: Payment (Buchhalter)
    await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.BUCHHALTER...);
    await zahlungenKeyword.Z01_WSH_Zahlungen_Freigeben({...});
});
```

---

## 7. API Workflow Gaps

Current API workflows available in `libs/workflows/`:

| Workflow | Status | Function |
|----------|--------|----------|
| Create Dossier | ✅ Available | `createDossierViaApiOnly()` |
| Add Payment Connection | ✅ Available | `addZahlungsVerbindung()` |
| Create Bedarfsprüfung | ✅ Available | `createBedarfspruefungViaApi()` |
| Create Erwerbssituation | ✅ Available | `createErwerbssituationViaApi()` |
| Set Workflow Step | ✅ Available | `setBewilligungsworkflowStepViaApi()` |
| Create Person | ❌ TODO | Need to implement |
| Add Household Members | ❌ TODO | Need to implement |
| Create Zahlung | ❌ TODO | Need to implement |
| Create Versicherung | ❌ TODO | Need to implement |
| Create Aufgabe | ❌ TODO | Need to implement |

---

## 8. Next Steps

1. **Immediate:** Repair broken staticTestcases using this knowledge
2. **Short-term:** Create missing API workflows for common setup patterns
3. **Medium-term:** Migrate all legacy tests to staticTestcases
4. **Long-term:** Deprecate and remove legacy testcases/ folder

---

## Appendix A: Quick Reference Card

```
LEGACY → MODERN MAPPING

p.DossierName99        → generateUniqueDossierId(seed)
p.FamilyName1          → TestPersons.FIRST_PERSON.name
p.aventisURL           → "/" (relative URL)
"22.11.2025"           → DateHelper.getTodayDateString()
.call(keyword, {...})  → keyword.method({...}) (direct call)

M01_LoginMSOnline      → Stable_Login
L03_LogoutAndLogin     → Stable_LogoutAndLoginDiffAccount

GUI Dossier creation   → createDossierViaApiOnly()
GUI Payment setup      → addZahlungsVerbindung()
GUI Bedarfsprüfung     → createBedarfspruefungViaApi()

test.use({video:...})  → Configured in test-fixtures.ts
custom fixtures        → import { test } from "@libs/test-fixtures"
```
