# Test Patterns Reference

## Tag System

- `@smoke` - Only for Smoke folder tests (quick validation)
- `@all` - All stable tests (excludes @wip)
- `@{category}` - Business area tags (e.g., `@zahlungen`, `@dossier`)
- `@wip` - Work in progress (not in pipeline)
- `@[XXXXXX]` - Azure DevOps test case ID

### Tag Format

```typescript
// Standard test
test("TestName", { tag: ["@zahlungen", "@all"] }, async ...);

// Test with Azure DevOps ID
test("TestName", { tag: ["@[182210]", "@bedarfspruefung", "@all"] }, async ...);

// WIP test
test("TestName", { tag: ["@wip"] }, async ...);
```

### Pipeline Commands

```bash
npx playwright test --grep @smoke              # Smoke tests only
npx playwright test --grep @all                # All stable tests
npx playwright test --grep @zahlungen          # Specific business area
npx playwright test --grep "@zahlungen|@dossier" # Multiple areas
npx playwright test --grep-invert @wip         # Exclude WIP
```

## The Keyword-Driven Pattern

Keywords are reusable test building blocks in `libs/keywords/`:
```typescript
await bedarfsprufungKeyword.A01_AnspruchPruefung_Bedarfspruefung({
    entscheidVom: DateHelper.getTodayDateString(),
    begrundung: "Begruendung",
    unterstutzungab: DateHelper.getFirstOfMonthString()
});
```

**Before using any keyword, always read its source file to verify:**
- Parameter names and types
- Required vs optional parameters
- Expected behavior

## Canonical Test Structure

```typescript
import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@keywords/common-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestPersons } from "@constants/testData";
import { TestUsers } from "@constants/credentials";

test(
    "TestName",
    {
        tag: ["@new"]  // @new for tests without ID, @wip for WIP, ["@[ID]", "@smoke"] with ID
    },
    async ({ page, seed, context, authenticatedRequest }) => {
        // 1. Initialize keywords
        var commonKeyword = new CommonKeyword(page);
        var specificKeyword = new SpecificKeyword(page);

        // 2. Generate unique ID
        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);

        // 3. Login
        await test.step("L00_URLAventis", async () => {
            await commonKeyword.L00_URLAventis({ url: "/" });
        });

        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(
                TestUsers.SOZIALARBEITERIN_1A.username,
                TestUsers.SOZIALARBEITERIN_1A.password
            );
        });

        // 4. Setup test data via API (preferred)
        await sharedTestLogic.createDossierViaApiOnly(
            authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId
        );

        // 5. Execute test steps
        await test.step("Step Description", async () => {
            await specificKeyword.SomeKeyword({
                param1: DateHelper.getTodayDateString(),
                param2: TestPersons.FIRST_PERSON.fullName
            });
        });
    }
);
```

## Unique ID Generation

Every test needs unique identifiers to avoid conflicts:
```typescript
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";

const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);
```

Utilities in `libs/utils/testDataUtilities.ts`:
- `generateTestcaseSeed()` - Creates unique seed per test execution
- `generateUniqueDossierId(seed)` - Unique dossier ID from seed
- `generateAhvNumber(seed)` - Unique AHV (social security) number
- `generateUniqueIban(seed)` - Unique IBAN

## Multi-User Workflow Pattern

Use a single test with user switches (isolated, parallel-safe):

```typescript
// User 1: Create (Sozialarbeiterin)
await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN_1A...);
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
```

## User Role Constants

| Role | Constant | Purpose |
|------|----------|---------|
| Sozialarbeiterin 1A | `TestUsers.SOZIALARBEITERIN_1A` | Creates dossiers, assessments |
| Sachbearbeiterin | `TestUsers.SACHBEARBEITERIN` | First approval level |
| Gemeinde-MA | `TestUsers.GEMEINDE_MA` | Second approval level |
| Buchhalter | `TestUsers.BUCHHALTER` | Payment release |
| Amtsleiter | `TestUsers.AMTSLEITER` | Final approval |
| Kantons-MA | `TestUsers.KANTONS_MA` | Audits, dossier review |

## Excel-Based Test Generation

Tests can be auto-generated from Excel files:
1. Place Excel file in `testData/` directory
2. Each worksheet becomes a test (except "Keywords" sheet)
3. Run `npm run test` to generate test files
4. Generated tests appear in `testcases/{excelFileName}/`

See `libs/utils/generator-testcase.ts` for the generation logic.
