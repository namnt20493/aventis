# Coding Conventions Reference

## Language Rules

- Variable/function names: English
- Test step names: German OR English (stay consistent within each file)
- Comments: English (only when necessary -- code should be self-documenting)
- No comments unless explicitly requested

## Constants -- Never Hardcode

### Test Data (`libs/constants/testData.ts`)

Centralized test data: TestPersons, TestCompanies, TestMitarbeiter, etc.

```typescript
// GOOD
name: TestPersons.FIRST_PERSON.name,
vorname: TestPersons.FIRST_PERSON.vorname,
fullName: TestPersons.FIRST_PERSON.fullName

// BAD
name: "FamilyName1",
vorname: "ManFirstName1"
```

### Credentials (`libs/constants/credentials.ts`)

```typescript
// GOOD
username: TestUsers.SOZIALARBEITERIN_1A.username,
password: TestUsers.SOZIALARBEITERIN_1A.password

// BAD
username: "bern.sozialarbeiterin1a@diartis.ch"
```

## DateHelper (`libs/utils/helpers/DateHelper.ts`)

Use date helper functions for ALL date values:

| Function | Returns | Example |
|----------|---------|---------|
| `getTodayDateString()` | Today in DD.MM.YYYY | "27.02.2026" |
| `getFirstOfMonthString()` | First day of current month | "01.02.2026" |
| `getFirstDayOfTheYearString()` | 01.01.YYYY | "01.01.2026" |
| `getLastDayOfYearString()` | 31.12.YYYY | "31.12.2026" |
| `getTodayWithFutureYearString()` | Today +1 year | "27.02.2027" |
| `getDaysFutureString(days)` | Date N days in future | varies |
| `getMonthYearAsString(addMonths)` | German month name + year | "Februar 2026" |
| `getLastDayOfMonthString()` | Last day of current month | "28.02.2026" |

## Path Aliases (tsconfig.json)

Use TypeScript path aliases for clean imports:

```typescript
import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@keywords/common-keyword";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestPersons } from "@constants/testData";
import { TestUsers } from "@constants/credentials";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
```

### Available Aliases

| Alias | Maps To |
|-------|---------|
| `@libs/*` | `libs/*` |
| `@keywords/*` | `libs/keywords/*` |
| `@pages/*` | `libs/pages/*` |
| `@utils/*` | `libs/utils/*` |
| `@constants/*` | `libs/constants/*` |
| `@workflows` | `libs/workflows/index` |
| `@workflows/*` | `libs/workflows/*` |
| `@sharedTestsSteps/*` | `libs/sharedTestSteps/*` |
| `@parameters/*` | `libs/utils/parameters/*` |

## Code Validation Rules

These rules are enforced to maintain code quality and prevent common anti-patterns:

### Hard Blocks (Will Fail)

1. **No writes to legacy `testcases/` directory**
   - All new tests MUST be written to `staticTestcases/`
   - `testcases/` is READ-ONLY reference material
   - Error: "Cannot modify legacy testcases/ directory. Write to staticTestcases/ instead."

### Warnings (Should Fix)

2. **No hardcoded date patterns**
   - Pattern: `"DD.MM.YYYY"` in code (outside comments)
   - Solution: Use `DateHelper.*` functions
   - Example: Replace `"27.02.2026"` with `DateHelper.getTodayDateString()`

3. **No hardcoded email addresses**
   - Pattern: `@diartis.ch` in code (outside comments)
   - Solution: Use `TestUsers.*` constants
   - Example: Replace `"bern.sozialarbeiterin1a@diartis.ch"` with `TestUsers.SOZIALARBEITERIN_1A.username`

### Validation Logic Location

Validation rules previously implemented in `.claude/hooks/validate-test-file.js` hook.
Hook was removed due to performance issues, but rules remain architecture requirements.

## Legacy -> Modern Conversion Map

| Legacy Pattern | Modern Replacement |
|----------------|-------------------|
| `p.DossierName99` | `generateUniqueDossierId(seed)` |
| `p.FamilyName1` | `TestPersons.FIRST_PERSON.name` |
| `p.ManFirstName1` | `TestPersons.FIRST_PERSON.vorname` |
| `p.aventisURL` | `"/"` (relative URL) |
| `"22.11.2025"` (hardcoded) | `DateHelper.getTodayDateString()` |
| `.call(keyword, {...})` | `keyword.method({...})` (direct) |
| `M01_LoginMSOnline` | `Stable_Login` |
| `L03_LogoutAndLoginDiffAccount` | `Stable_LogoutAndLoginDiffAccount` |
