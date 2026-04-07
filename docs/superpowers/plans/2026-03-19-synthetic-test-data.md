# Synthetic Test Data Generation - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace generic test person names (`FamilyName1`, `FirstName1`) with realistic, seed-deterministic Swiss names using `@faker-js/faker` to eliminate database index performance issues caused by thousands of identical name strings.

**Architecture:** A new `TestDataFactory` generates realistic Swiss names (de_CH locale) deterministically from the test seed. A new Playwright fixture `testPersons` makes generated data available to all test layers. Workflows and API functions receive person data from the fixture — ensuring every test creates unique, reproducible names while maintaining full backward compatibility during migration.

**Tech Stack:** `@faker-js/faker` (de_CH + de locale), TypeScript, Playwright test fixtures

---

## Problem Analysis

### Current State
1. **Static constants** (`libs/constants/testData.ts`): `TestPersons.FIRST_PERSON.name` = `"FamilyName1"` — every test creates persons with identical names
2. **Legacy JSON generator** (`libs/utils/parameters/createJSON.ts`): Appends random numbers to real names → `"Müller28471"` — slightly better but still creates index hotspots
3. **API defaults** (`libs/utils/apiSetup.ts`): Hardcoded `"FamilyName1"` / `"FamilyName2"` as fallback defaults
4. **Workflows** (`libs/workflows/`, `libs/sharedTestSteps/`): All reference `TestPersons.FIRST_PERSON.*` static values
5. **53 spec files** import static `TestPersons` and use `.fullName` for client selection in UI

### Impact
- Database indexes degrade because thousands of records share `"FamilyName1"` as surname
- Search/autocomplete becomes slow as the index cannot efficiently partition
- No test isolation — parallel tests can collide on identical person names

### Target State
- Every test creates persons with **unique, realistic Swiss names** derived from the test `seed`
- Names are **deterministic** (same seed → same names) for reproducibility
- Names look like real data: `"Brunner"`, `"Meier"`, `"Schneider"` — not `"FamilyName1"` or `"Müller28471"`
- Database indexes distribute evenly across varied surnames

---

## Critical Coupling Constraint

**53 spec files** import `TestPersons` (a static constant) and use `TestPersons.FIRST_PERSON.fullName` for:
- Creating persons via API (`nachname: TestPersons.FIRST_PERSON.name`)
- Selecting clients in UI (`klientschaft: TestPersons.FIRST_PERSON.fullName`)

**If the API creates `"Brunner, Liam"` but the spec file still selects `"FamilyName1, FirstName1"`, the test BREAKS.**

### Solution: Fixture-based approach (propagates names consistently)

A new `testPersons` fixture in `libs/test-fixtures.ts` generates names from `seed` and makes them available to ALL layers:
- Spec files use `testPersons.FIRST_PERSON.fullName` (dynamic, from fixture)
- Workflows receive `testPersons` as parameter
- API setup uses person data passed from callers (no internal defaults)

This ensures **the same names flow through creation AND selection**.

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `libs/utils/TestDataFactory.ts` | Central factory: seed → realistic person data (names, birthdays) |
| `libs/utils/__tests__/TestDataFactory.test.ts` | Unit tests for determinism, uniqueness, and Swiss locale |

### Modified Files (Phase 1 — Infrastructure)
| File | Change |
|------|--------|
| `package.json` | Add `@faker-js/faker` dependency |
| `libs/constants/testData.ts` | Deprecate static `TestPersons`, route `createTestPersons(seed)` through factory |
| `libs/test-fixtures.ts` | Add `testPersons` fixture based on `seed` |
| `libs/utils/apiSetup.ts` | Replace hardcoded `"FamilyName1"` defaults with factory-generated defaults |

### Modified Files (Phase 2 — Workflow Migration)
| File | Change |
|------|--------|
| `libs/workflows/apiDossierWorkflow.ts` | Accept `testPersons` parameter, remove static `TestPersons` import |
| `libs/sharedTestSteps/sharedTestLogicDossier.ts` | Accept `testPersons` parameter, remove static `TestPersons` import |
| `libs/workflows/guiDossierWorkflow.ts` | Accept `testPersons` parameter, replace hardcoded `"FamilyName1"` |
| `libs/workflows/paymentConnectionWorkflow.ts` | Accept `testPersons` parameter (~15 replacements) |

### Modified Files (Phase 3 — Spec File Migration)
All ~53 spec files that import `TestPersons` need migration to use the `testPersons` fixture. This is done incrementally — see Task 7 for the pattern and Task 8 for the batch migration.

### Modified Files (Phase 4 — Legacy Cleanup)
| File | Change |
|------|--------|
| `libs/utils/parameters/createJSON.ts` | Use faker for name generation instead of inline arrays + random numbers |

### Untouched Files
| File | Reason |
|------|--------|
| `libs/utils/TestdataGenerator.ts` | AHV/IBAN generation — already seed-based, independent of names |
| `libs/constants/credentials.ts` | User logins — not affected |

### Known Duplication (Out of Scope)
`sharedTestLogicDossier.ts` and `apiDossierWorkflow.ts` contain near-identical functions (`generateDossierViaApiWithPerson`, `createDossierViaApiOnly`, etc.). This plan updates BOTH consistently but does not deduplicate them. A separate cleanup task should consolidate these into a single source.

---

## Design Decisions

### Why @faker-js/faker instead of own name lists?
1. **Maintained library** with 70+ locales including `de_CH` (Swiss German)
2. **Built-in seeding** — `faker.seed(number)` produces deterministic sequences
3. **Rich data types** — names, addresses, phone numbers, emails — all locale-aware
4. **No maintenance burden** — name lists are community-maintained

### Why a fixture instead of direct factory calls?
The critical problem: if the API creates a person with name X, but the spec file selects a client with name Y, the test breaks. A fixture ensures:
- One call to `TestDataFactory.createPersons(seed)` per test
- The same `testPersons` object flows through spec → workflow → API
- No possibility of name mismatch between layers

### Seed Strategy
- Convert the UUID-based test `seed` string to a numeric hash (reuse existing `seedToHash` from `testDataUtilities.ts`)
- Pass numeric hash to `faker.seed()` — produces deterministic name sequence
- Each person slot (FIRST, SECOND, THIRD, FOURTH) uses sequential faker calls to get different names from same seed

### Import Strategy for Faker
Use selective locale import to minimize bundle size:
```typescript
import { de, de_CH, Faker } from "@faker-js/faker";
// NOT: import { faker } from "@faker-js/faker" (bundles all 70+ locales)
```

### Backward Compatibility
- `TestPersons` constant remains but is **deprecated** (marked with JSDoc `@deprecated`)
- `createTestPersons(seed)` function signature stays identical — internal implementation changes
- Spec files are migrated incrementally — unmigrated files still work with static `TestPersons`
- **Key invariant:** Within each spec file, the name used to CREATE a person must equal the name used to SELECT that person

---

## Tasks

### Task 1: Install @faker-js/faker

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the dependency**

```bash
npm install --save-dev @faker-js/faker
```

- [ ] **Step 2: Verify installation**

```bash
node -e "const { de, de_CH, Faker } = require('@faker-js/faker'); const f = new Faker({locale:[de_CH,de]}); f.seed(42); console.log(f.person.lastName(), f.person.firstName())"
```
Expected: Two Swiss-sounding names printed to console.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @faker-js/faker for realistic test data generation"
```

---

### Task 2: Create TestDataFactory

**Files:**
- Create: `libs/utils/TestDataFactory.ts`
- Create: `libs/utils/__tests__/TestDataFactory.test.ts`

- [ ] **Step 1: Write the unit test**

Create `libs/utils/__tests__/TestDataFactory.test.ts`:

```typescript
import { TestDataFactory } from "../TestDataFactory";

describe("TestDataFactory", () => {
    it("should generate deterministic names from same seed", () => {
        const persons1 = TestDataFactory.createPersons("test-seed-abc");
        const persons2 = TestDataFactory.createPersons("test-seed-abc");

        expect(persons1.FIRST_PERSON.name).toBe(persons2.FIRST_PERSON.name);
        expect(persons1.FIRST_PERSON.vorname).toBe(persons2.FIRST_PERSON.vorname);
        expect(persons1.SECOND_PERSON.name).toBe(persons2.SECOND_PERSON.name);
    });

    it("should generate different family names for different seeds", () => {
        const results = new Set<string>();
        const seeds = ["seed-aaa", "seed-bbb", "seed-ccc", "seed-ddd", "seed-eee"];
        for (const s of seeds) {
            results.add(TestDataFactory.createPersons(s).FIRST_PERSON.name);
        }
        expect(results.size).toBeGreaterThanOrEqual(3);
    });

    it("should share the same family name within a household", () => {
        const persons = TestDataFactory.createPersons("household-seed");

        expect(persons.FIRST_PERSON.name).toBe(persons.SECOND_PERSON.name);
        expect(persons.FIRST_PERSON.name).toBe(persons.ADULT_WOMAN.name);
        expect(persons.FIRST_PERSON.name).toBe(persons.CHILD_BOY.name);
        expect(persons.FIRST_PERSON.name).toBe(persons.CHILD_GIRL.name);
    });

    it("should build correct fullName format: 'Nachname, Vorname'", () => {
        const persons = TestDataFactory.createPersons("format-seed");

        expect(persons.FIRST_PERSON.fullName).toBe(
            `${persons.FIRST_PERSON.name}, ${persons.FIRST_PERSON.vorname}`
        );
    });

    it("should not contain generic placeholder names", () => {
        const seeds = ["real-1", "real-2", "real-3"];
        for (const s of seeds) {
            const persons = TestDataFactory.createPersons(s);
            expect(persons.FIRST_PERSON.name).not.toMatch(/FamilyName/i);
            expect(persons.FIRST_PERSON.vorname).not.toMatch(/FirstName/i);
        }
    });

    it("should not contain appended numbers in family names", () => {
        const persons = TestDataFactory.createPersons("no-numbers");
        expect(persons.FIRST_PERSON.name).not.toMatch(/\d/);
    });

    it("should generate valid person data for API usage", () => {
        const apiData = TestDataFactory.createApiPersonData("api-seed");

        expect(apiData.vorname).toBeTruthy();
        expect(apiData.nachname).toBeTruthy();
        expect(apiData.nachname).not.toMatch(/FamilyName/i);
        expect(apiData.geschlecht).toBe("Maennlich");
    });

    it("should generate a second person with different first name but same family name", () => {
        const person1 = TestDataFactory.createApiPersonData("multi-seed", "first");
        const person2 = TestDataFactory.createApiPersonData("multi-seed", "second");

        expect(person1.nachname).toBe(person2.nachname);
        expect(person1.vorname).not.toBe(person2.vorname);
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:unit -- --testPathPattern=TestDataFactory
```
Expected: FAIL — `TestDataFactory` module not found.

- [ ] **Step 3: Implement TestDataFactory**

Create `libs/utils/TestDataFactory.ts`:

```typescript
import { de, de_CH, Faker } from "@faker-js/faker";
import { seedToHash } from "./testDataUtilities";

const MALE_FIRST_NAMES_CH = [
    "Liam", "Noah", "Matteo", "Luca", "Elias", "Leon", "Gabriel", "Louis",
    "Samuel", "Benjamin", "Levi", "Julian", "David", "Jan", "Nico", "Elia",
    "Alexander", "Finn", "Jonas", "Nino", "Timo", "Dario", "Daniel", "Emil",
    "Diego", "Raphael", "Simon", "Luis", "Maximilian", "Tobias", "Florian",
    "Aaron", "Fabian", "Robin", "Tim", "Roman", "Philipp", "Vincent", "Rafael"
];

const FEMALE_FIRST_NAMES_CH = [
    "Emma", "Mia", "Sofia", "Lina", "Lea", "Elena", "Lara", "Anna",
    "Emilia", "Noemi", "Laura", "Maria", "Julia", "Livia", "Sara", "Nina",
    "Mila", "Ella", "Alicia", "Melina", "Valentina", "Jana", "Lena", "Mara",
    "Nora", "Zoe", "Eva", "Paula", "Hanna", "Selina", "Ava", "Lia", "Svenja"
];

const CHILD_FIRST_NAMES_MALE = [
    "Matteo", "Levi", "Nino", "Emil", "Diego", "Milo", "Aaron", "Jonah",
    "Tom", "Nick", "Linus", "Alessio", "Marvin", "Luc", "Robin", "Tim"
];

const CHILD_FIRST_NAMES_FEMALE = [
    "Mila", "Nora", "Ella", "Zoe", "Lia", "Amy", "Lou", "Elin",
    "Yara", "Bea", "Nelli", "Petra", "Tina", "Anna", "Leni", "Ava"
];

function createSeededFaker(seed: string): Faker {
    const faker = new Faker({ locale: [de_CH, de] });
    const numericSeed = parseInt(seedToHash(seed), 36);
    faker.seed(numericSeed);
    return faker;
}

function pickFromArray<T>(arr: T[], faker: Faker): T {
    return arr[Math.abs(faker.number.int()) % arr.length];
}

export interface TestPerson {
    name: string;
    vorname: string;
    fullName: string;
    geburtsdatum?: string;
}

export interface TestPersonSet {
    FIRST_PERSON: TestPerson;
    SECOND_PERSON: TestPerson;
    THIRD_PERSON: TestPerson;
    FOURTH_PERSON: TestPerson;
    ADULT_WOMAN: TestPerson;
    CHILD_BOY: TestPerson;
    CHILD_GIRL: TestPerson;
}

export interface ApiPersonData {
    vorname: string;
    nachname: string;
    geburtsdatum?: string;
    geschlecht?: string;
}

export class TestDataFactory {
    static createPersons(seed: string): TestPersonSet {
        const faker = createSeededFaker(seed);
        const familyName = faker.person.lastName();

        const maleFirst1 = pickFromArray(MALE_FIRST_NAMES_CH, faker);
        const femaleFirst1 = pickFromArray(FEMALE_FIRST_NAMES_CH, faker);
        const femaleFirst2 = pickFromArray(FEMALE_FIRST_NAMES_CH, faker);
        const maleFirst2 = pickFromArray(MALE_FIRST_NAMES_CH, faker);
        const adultWomanName = pickFromArray(FEMALE_FIRST_NAMES_CH, faker);
        const boyName = pickFromArray(CHILD_FIRST_NAMES_MALE, faker);
        const girlName = pickFromArray(CHILD_FIRST_NAMES_FEMALE, faker);

        return {
            FIRST_PERSON: {
                name: familyName,
                vorname: maleFirst1,
                fullName: `${familyName}, ${maleFirst1}`
            },
            SECOND_PERSON: {
                name: familyName,
                vorname: femaleFirst1,
                fullName: `${familyName}, ${femaleFirst1}`
            },
            THIRD_PERSON: {
                name: familyName,
                vorname: femaleFirst2,
                fullName: `${familyName}, ${femaleFirst2}`
            },
            FOURTH_PERSON: {
                name: familyName,
                vorname: maleFirst2,
                fullName: `${familyName}, ${maleFirst2}`
            },
            ADULT_WOMAN: {
                name: familyName,
                vorname: adultWomanName,
                fullName: `${familyName}, ${adultWomanName}`,
                geburtsdatum: "09.08.1975"
            },
            CHILD_BOY: {
                name: familyName,
                vorname: boyName,
                fullName: `${familyName}, ${boyName}`,
                geburtsdatum: "11.02.2008"
            },
            CHILD_GIRL: {
                name: familyName,
                vorname: girlName,
                fullName: `${familyName}, ${girlName}`,
                geburtsdatum: "12.04.2013"
            }
        };
    }

    static createApiPersonData(seed: string, slot: "first" | "second" = "first"): ApiPersonData {
        const fakerFirst = createSeededFaker(seed + "-first");
        const fakerSecond = createSeededFaker(seed + "-second");
        const nachname = createSeededFaker(seed).person.lastName();

        const targetFaker = slot === "first" ? fakerFirst : fakerSecond;
        const vorname = targetFaker.person.firstName();
        const geschlecht = slot === "first" ? "Maennlich" : "Weiblich";

        return { vorname, nachname, geschlecht };
    }

    static createFamilyName(seed: string): string {
        const faker = createSeededFaker(seed);
        return faker.person.lastName();
    }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test:unit -- --testPathPattern=TestDataFactory
```
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add libs/utils/TestDataFactory.ts libs/utils/__tests__/TestDataFactory.test.ts
git commit -m "feat: add TestDataFactory for realistic seed-based Swiss names"
```

---

### Task 3: Update testData.ts constants to use factory

**Files:**
- Modify: `libs/constants/testData.ts`

- [ ] **Step 1: Read current file**

- [ ] **Step 2: Update createTestPersons to use factory, deprecate static TestPersons**

```typescript
import { TestDataFactory } from "@utils/TestDataFactory";
import type { TestPersonSet } from "@utils/TestDataFactory";

// Re-export for convenience
export type { TestPerson, TestPersonSet } from "@utils/TestDataFactory";

/**
 * @deprecated Use TestDataFactory.createPersons(seed) or the testPersons fixture.
 * Static persons cause database index hotspots — thousands of records share "FamilyName1".
 * Kept only for backward compatibility during migration.
 */
export const TestPersons = { /* ... unchanged ... */ } as const;

/**
 * Creates test persons with realistic Swiss names derived from seed.
 * Names are deterministic: same seed always produces same names.
 */
export function createTestPersons(seed: string): TestPersonSet {
    return TestDataFactory.createPersons(seed);
}
```

Remove the old `generateFamilyName` and inline `createTestPersons` implementation.

- [ ] **Step 3: Run typecheck**

```bash
npm run typecheck
```

- [ ] **Step 4: Commit**

```bash
git add libs/constants/testData.ts
git commit -m "refactor: route createTestPersons through TestDataFactory"
```

---

### Task 4: Add testPersons fixture

**Files:**
- Modify: `libs/test-fixtures.ts`

This is the **key architectural change**. By adding `testPersons` as a fixture, all test layers receive consistent person data.

- [ ] **Step 1: Read current test-fixtures.ts**

- [ ] **Step 2: Add testPersons fixture**

```typescript
import { TestDataFactory } from "@utils/TestDataFactory";
import type { TestPersonSet } from "@utils/TestDataFactory";

// Add to the fixture type definition:
type CustomFixtures = {
    seed: string;
    testPersons: TestPersonSet;
    // ... existing fixtures ...
};

// Add the fixture:
testPersons: async ({ seed }, use) => {
    const persons = TestDataFactory.createPersons(seed);
    await use(persons);
},
```

- [ ] **Step 3: Run typecheck**

```bash
npm run typecheck
```

- [ ] **Step 4: Commit**

```bash
git add libs/test-fixtures.ts
git commit -m "feat: add testPersons fixture for seed-based person data"
```

---

### Task 5: Update apiSetup.ts defaults

**Files:**
- Modify: `libs/utils/apiSetup.ts`

- [ ] **Step 1: Read current file for exact content**

- [ ] **Step 2: Replace hardcoded FamilyName1/FamilyName2 defaults**

Extract `TestDataFactory.createPersons(seed)` once at the top of `createDossierViaApi`:

```typescript
import { TestDataFactory } from "./TestDataFactory";

export async function createDossierViaApi(request: APIRequestContext, options: CreateDossierOptions, seed: string, page?: Page): Promise<CreateDossierResult> {
    const persons = TestDataFactory.createPersons(seed);

    const personData: DossierPersonData = {
        vorname: persons.FIRST_PERSON.vorname,
        nachname: persons.FIRST_PERSON.name,
        geburtsdatum: "1980-01-01T00:00:00",
        ahvNummer: generateAhvNumber().toString(),
        geschlecht: "Maennlich",
        zivilstand: "Ledig",
        mailadresse: "test@example.com",
        iban: generateUniqueIban(seed).toString(),
        strasse: "Strasse_831",
        hausnummer: "27",
        ...options.person   // Caller overrides win
    };

    const secondPersonData: DossierPersonData | null = options.secondPerson
        ? {
              vorname: persons.SECOND_PERSON.vorname,
              nachname: persons.SECOND_PERSON.name,
              geburtsdatum: "2010-01-01T00:00:00",
              // ... rest unchanged ...
              ...options.secondPerson
          }
        : null;
    // ... rest of function unchanged ...
}
```

- [ ] **Step 3: Run typecheck**

```bash
npm run typecheck
```

- [ ] **Step 4: Commit**

```bash
git add libs/utils/apiSetup.ts
git commit -m "refactor: replace hardcoded FamilyName1 defaults in apiSetup with factory"
```

---

### Task 6a: Update apiDossierWorkflow.ts

**Files:**
- Modify: `libs/workflows/apiDossierWorkflow.ts`

- [ ] **Step 1: Read file and identify all TestPersons references**

- [ ] **Step 2: Add testPersons parameter to each function**

Pattern for each function:
```typescript
import { TestDataFactory } from "@utils/TestDataFactory";
import type { TestPersonSet } from "@utils/TestDataFactory";

// Functions that have seed: derive persons from seed
export const generateDossierViaApiWithPerson = async (
    request: APIRequestContext, commonKeyword: CommonKeyword, page: Page,
    seed: string, uniqueId: string, context: BrowserContext
): Promise<GenerateDossierResult> => {
    const persons = TestDataFactory.createPersons(seed);
    // Replace TestPersons.FIRST_PERSON.* → persons.FIRST_PERSON.*
    // Replace TestPersons.SECOND_PERSON.* → persons.SECOND_PERSON.*
};
```

- [ ] **Step 3: Run typecheck**

```bash
npm run typecheck
```

- [ ] **Step 4: Commit**

```bash
git add libs/workflows/apiDossierWorkflow.ts
git commit -m "refactor: use seed-based persons in apiDossierWorkflow"
```

---

### Task 6b: Update sharedTestLogicDossier.ts

**Files:**
- Modify: `libs/sharedTestSteps/sharedTestLogicDossier.ts`

- [ ] **Step 1: Read file and identify all TestPersons references**

Key functions to update:
- `generateDossierViaApiWithPerson` — has `seed`, derive persons
- `createDossierViaApiOnly` — has `seed`, derive persons
- `addZahlungsVerbindung` — needs `persons` parameter added
- `createDossierViaApiOnlyWithPaymentConnection` — has `seed`, derive persons
- `createDossierWithHouseholdForHaeuslicheGewalt` — has `seed`, derive persons

- [ ] **Step 2: Update each function**

For functions WITH seed: `const persons = TestDataFactory.createPersons(seed);`

For `addZahlungsVerbindung` (no seed): add `persons: TestPersonSet` parameter:

```typescript
export const addZahlungsVerbindung = async (
    commonKeyword: CommonKeyword, page: Page,
    klientschaftKeyword: KlientschaftKeyword,
    uniqueDossiertId: string, context: BrowserContext,
    persons: TestPersonSet   // NEW parameter
) => {
    // Replace TestPersons.FIRST_PERSON.fullName → persons.FIRST_PERSON.fullName
};
```

Update callers of `addZahlungsVerbindung` accordingly.

- [ ] **Step 3: Run typecheck**

```bash
npm run typecheck
```

- [ ] **Step 4: Commit**

```bash
git add libs/sharedTestSteps/sharedTestLogicDossier.ts
git commit -m "refactor: use seed-based persons in sharedTestLogicDossier"
```

---

### Task 6c: Update guiDossierWorkflow.ts

**Files:**
- Modify: `libs/workflows/guiDossierWorkflow.ts`

- [ ] **Step 1: Read file**

- [ ] **Step 2: Replace hardcoded "FamilyName1" on line 32**

This function has no `seed` parameter. Add `persons: TestPersonSet` parameter:

```typescript
import type { TestPersonSet } from "@utils/TestDataFactory";

export const generateDossier = async (
    commonKeyword: CommonKeyword, page: Page,
    dossierKeyword: DossierKeyword, uniqueId: string,
    context: BrowserContext, persons: TestPersonSet   // NEW
): Promise<string> => {
    // Replace "FamilyName1" → persons.FIRST_PERSON.name
    // Replace "FirstName1" → persons.FIRST_PERSON.vorname
};
```

- [ ] **Step 3: Run typecheck**

- [ ] **Step 4: Commit**

```bash
git add libs/workflows/guiDossierWorkflow.ts
git commit -m "refactor: use persons parameter in guiDossierWorkflow"
```

---

### Task 6d: Update paymentConnectionWorkflow.ts

**Files:**
- Modify: `libs/workflows/paymentConnectionWorkflow.ts`

This file has ~15 `TestPersons.*` references.

- [ ] **Step 1: Read file and list all TestPersons references**

- [ ] **Step 2: Add persons parameter to each exported function**

Each function gets `persons: TestPersonSet` as last parameter. Replace all `TestPersons.FIRST_PERSON.*` → `persons.FIRST_PERSON.*`.

- [ ] **Step 3: Run typecheck**

- [ ] **Step 4: Commit**

```bash
git add libs/workflows/paymentConnectionWorkflow.ts
git commit -m "refactor: use persons parameter in paymentConnectionWorkflow"
```

---

### Task 7: Migrate first spec file as template

**Files:**
- Modify: `staticTestcases/Keywordvalidation/Dokumente/a06_DokuAusVorlage.spec.ts`

This creates the migration template that all other spec files follow.

- [ ] **Step 1: Read the spec file**

- [ ] **Step 2: Apply migration pattern**

```typescript
// BEFORE:
import { TestPersons } from "@constants/testData";
// Uses: TestPersons.FIRST_PERSON.fullName, "FamilyName1 ,FirstName1"

// AFTER:
// Import test from fixtures (which provides testPersons)
import { test } from "@libs/test-fixtures";

test("...", async ({ page, seed, testPersons }) => {
    // Replace static references:
    // "FamilyName1 ,FirstName1" → `${testPersons.FIRST_PERSON.name} ,${testPersons.FIRST_PERSON.vorname}`
    // TestPersons.FIRST_PERSON.fullName → testPersons.FIRST_PERSON.fullName
});
```

- [ ] **Step 3: Run the test**

```bash
npx playwright test staticTestcases/Keywordvalidation/Dokumente/a06_DokuAusVorlage.spec.ts --headed --workers 1 2>&1 | tee test-results/pw-output.txt; echo "EXIT:$?"
```

- [ ] **Step 4: Commit**

```bash
git add staticTestcases/Keywordvalidation/Dokumente/a06_DokuAusVorlage.spec.ts
git commit -m "refactor: migrate a06_DokuAusVorlage to testPersons fixture (template)"
```

---

### Task 8: Batch-migrate remaining spec files

**Files:**
- All ~53 spec files importing `TestPersons`

This is the largest task. Each spec file follows the pattern from Task 7.

- [ ] **Step 1: Generate full list of files to migrate**

```bash
grep -rl "TestPersons" staticTestcases/ libs/workflows/ libs/sharedTestSteps/ --include="*.ts" | sort
```

- [ ] **Step 2: For each file, apply the migration pattern**

The pattern for each spec file:
1. Replace `import { TestPersons } from "@constants/testData"` → remove (or keep if other exports used)
2. Add `testPersons` to the destructured fixture params: `({ page, seed, testPersons })`
3. Replace all `TestPersons.FIRST_PERSON.*` → `testPersons.FIRST_PERSON.*`
4. Replace all `TestPersons.SECOND_PERSON.*` → `testPersons.SECOND_PERSON.*`

**Tip:** This is highly parallelizable — each spec file is independent.

- [ ] **Step 3: Run typecheck**

```bash
npm run typecheck
```

- [ ] **Step 4: Run smoke tests**

```bash
npx playwright test --grep @smoke --headed --workers 1 2>&1 | tee test-results/pw-output.txt; echo "EXIT:$?"
```

- [ ] **Step 5: Commit**

```bash
git add staticTestcases/ libs/workflows/ libs/sharedTestSteps/
git commit -m "refactor: migrate all spec files to testPersons fixture"
```

---

### Task 9: Update createJSON.ts legacy parameter generator

**Files:**
- Modify: `libs/utils/parameters/createJSON.ts`

- [ ] **Step 1: Read current file**

- [ ] **Step 2: Replace inline name arrays with faker-based generation**

```typescript
import { de, de_CH, Faker } from "@faker-js/faker";

// Use a fixed seed based on current date for CI reproducibility
const dailySeed = Math.floor(Date.now() / 86400000);

for (let i = 0; i < 100; i++) {
    const suffix = (i + 1).toString().padStart(2, "");
    const faker = new Faker({ locale: [de_CH, de] });
    faker.seed(dailySeed + i);
    families[`FamilyName${suffix}`] = faker.person.lastName();
    men[`ManFirstName${suffix}`] = faker.person.firstName("male");
    women[`WomanFirstName${suffix}`] = faker.person.firstName("female");
    girls[`GirlFirstName${suffix}`] = faker.person.firstName("female");
}
```

**Note:** Using `dailySeed` (day-granularity) means `parameter.json` changes once per day — predictable for CI, but still creates variety across days.

The inline name arrays (`familyNamesTexts`, `womanFirstNames`, etc.) can be removed.

- [ ] **Step 3: Regenerate parameter.json and verify**

```bash
npx ts-node libs/utils/parameters/createJSON.ts
head -30 parameter.json
```
Expected: `FamilyName1` through `FamilyName100` are realistic Swiss surnames without appended numbers.

- [ ] **Step 4: Commit**

```bash
git add libs/utils/parameters/createJSON.ts parameter.json
git commit -m "refactor: use faker for parameter.json name generation"
```

---

### Task 10: Smoke test end-to-end

**Files:** None (validation only)

- [ ] **Step 1: Run a KV test that creates a dossier via API**

```bash
npx playwright test staticTestcases/Keywordvalidation/Klient/P01_P05_P10_P30_PersonCreation.spec.ts --headed --workers 1 2>&1 | tee test-results/pw-output.txt; echo "EXIT:$?"
```

- [ ] **Step 2: Verify realistic names in test output**

```bash
grep -i "dossier created\|person\|name" test-results/pw-output.txt | head -20
```
Expected: Names like `"Brunner, Liam"` instead of `"FamilyName1, FirstName1"`.

- [ ] **Step 3: Run full typecheck**

```bash
npm run typecheck
```

- [ ] **Step 4: Run smoke suite**

```bash
npx playwright test --grep @smoke --headed --workers 1 2>&1 | tee test-results/pw-output.txt; echo "EXIT:$?"
```

---

### Task 11: Documentation update

**Files:**
- Modify: `CLAUDE.md`
- Modify: `knowledge-base/agent-bundles/create-test-bundle.md`

- [ ] **Step 1: Update CLAUDE.md core rules**

Add rule:
```markdown
11. **Use TestDataFactory** -- `TestDataFactory.createPersons(seed)` or `testPersons` fixture for person names. Never use static `TestPersons` or hardcode `"FamilyName1"`.
```

- [ ] **Step 2: Update create-test-bundle.md**

Add section about using `testPersons` fixture when creating new tests.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md knowledge-base/
git commit -m "docs: update instructions for TestDataFactory and testPersons fixture"
```

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Faker locale `de_CH` has limited coverage | Fallback chain: `de_CH` → `de` → `en`. Added explicit Swiss name arrays for first names as backup. |
| Seed produces same name for different person slots | Each slot calls `pickFromArray` which advances faker's internal state. Swiss name arrays have 33-39 entries — collision probability is low. |
| Name mismatch between creation and selection | **Fixture-based approach** ensures same `testPersons` object flows through all layers. |
| Existing tests break during migration | Static `TestPersons` stays available. Unmigrated spec files continue using static names. |
| `parameter.json` changes on every regeneration | Day-based seed (`dailySeed`) produces stable output within a day. Git diff is expected. |
| Performance overhead from faker initialization | `createSeededFaker()` is ~2ms per call, negligible vs. 5-60s test runtime. |
| Duplicate code in `sharedTestLogicDossier.ts` / `apiDossierWorkflow.ts` | Both updated consistently. Deduplication tracked as separate follow-up task. |

## Sources

- [Faker.js Frameworks & Usage Guide](https://fakerjs.dev/guide/frameworks)
- [Faker.js Localization (de_CH)](https://fakerjs.dev/guide/localization)
- [Playwright + Faker Integration (playwrightsolutions.com)](https://playwrightsolutions.com/how-to-quickly-get-realistic-data-with-faker-for-playwright-tests/)
- [DataFactory Pattern for Playwright (playwrightsolutions.com)](https://playwrightsolutions.com/the-definitive-guide-to-api-testcreating-a-datafactory-to-manage-test-data/)
- [Test Data Strategy for Parallel Automation (ultimateqa.com)](https://ultimateqa.com/a-test-data-strategy-for-parallel-automation-in-playwright/)
- [Handling Test Data with Playwright (checklyhq.com)](https://www.checklyhq.com/docs/learn/playwright/handling-test-data/)
- [Synthetic Test Data Best Practices (k2view.com)](https://www.k2view.com/blog/synthetic-test-data-generation/)
- [Test Data Generator Best Practices (testomat.io)](https://testomat.io/blog/test-data-generator-purpose-tools-and-best-practices/)
