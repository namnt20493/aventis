# BasePage Migration Plan

## Overview

This document tracks the migration of all page objects to extend `BasePage` for improved stability and consistency.

**Goal**: Migrate all 31 page classes to inherit from `BasePage` to leverage:
- Automatic Angular hydration handling
- Built-in retry logic for interactions
- Consistent API across all pages
- Reduced boilerplate code

**Strategy**:
1. Start with smaller, low-risk pages
2. Test after each migration
3. Gradually move to larger, more critical pages
4. Keep legacy pages working during migration

## Migration Progress

**Total Pages**: 31
**Migrated**: 0
**In Progress**: 0
**Remaining**: 31
**Progress**: 0%

---

## Phase 1: Small Pages (< 200 Lines) - Quick Wins

These pages are small and have fewer dependencies, making them ideal candidates for initial migration.

| Page | Lines | Status | Test Command | Notes |
|------|-------|--------|--------------|-------|
| `zieterfassung-page.ts` | 44 | ⏳ Pending | `npx playwright test --grep @zeiterfassung` | Smallest page |
| `konfig-page.ts` | 48 | ⏳ Pending | `npx playwright test --grep @konfig` | Configuration page |
| `databrowser-page.ts` | 73 | ⏳ Pending | `npx playwright test --grep @databrowser` | Data browser utility |
| `buchungsJournal-page.ts` | 107 | ⏳ Pending | `npx playwright test --grep @buchungsjournal` | Accounting journal |
| `dossierubersicht-page.ts` | 135 | ⏳ Pending | `npx playwright test --grep @dossier` | Dossier overview |
| `erfassung-page.ts` | 139 | ⏳ Pending | `npx playwright test --grep @dokumente` | Document intake (RE01) |
| `vorlagenErafassen-page.ts` | 151 | ⏳ Pending | `npx playwright test --grep @vorlagen` | Template creation |
| `wirtschaftlicheSozialhilfe-page.ts` | 155 | ⏳ Pending | `npx playwright test --grep @wsh` | Economic social assistance |
| `rechnung-page.ts` | 158 | ⏳ Pending | `npx playwright test --grep @rechnungen` | Invoice management (RE02/RE03) |
| `dossierprufung-page.ts` | 166 | ⏳ Pending | `npx playwright test --grep @dossier` | Dossier review (DO13/DO14) |
| `login-page.ts` | 191 | ⏳ Pending | `npx playwright test --grep @smoke` | **Critical: Test thoroughly** |
| `anspruchsprufung-page.ts` | 196 | ⏳ Pending | `npx playwright test --grep @bedarfspruefung` | Entitlement check |

**Phase 1 Progress**: 0/12 (0%)

---

## Phase 2: Medium Pages (200-500 Lines) - Standard Migration

| Page | Lines | Status | Test Command | Notes |
|------|-------|--------|--------------|-------|
| `zahlungen-page.ts` | 219 | ⏳ Pending | `npx playwright test --grep @zahlungen` | Payment processing |
| `bewilligungenWorkflows-page.ts` | 222 | ⏳ Pending | `npx playwright test --grep @bewilligung` | Approval workflows |
| `freiwillige-page.ts` | 226 | ⏳ Pending | `npx playwright test --grep @freiwillige` | Volunteer management |
| `institutionenstamm-page.ts` | 245 | ⏳ Pending | `npx playwright test --grep @kontakte` | Institution master |
| `kontoauszug-page.ts` | 306 | ⏳ Pending | `npx playwright test --grep @zahlungen` | Account statements |
| `wohnsituation-page.ts` | 351 | ⏳ Pending | `npx playwright test --grep @wohnsituation` | Housing situation |
| `common-page.ts` | 377 | ⏳ Pending | `npx playwright test --grep @smoke` | **Critical: Core utility page** |
| `aufgaben-page.ts` | 381 | ⏳ Pending | `npx playwright test --grep @aufgaben` | Task management (DO04*) |
| `buchhaltung-page.ts` | 400 | ⏳ Pending | `npx playwright test --grep @zahlungen` | Accounting |
| `RV-page.ts` | 455 | ⏳ Pending | `npx playwright test --grep @rechtsverfolgung` | Legal proceedings |
| `bedarfsprufung-page.ts` | 498 | ⏳ Pending | `npx playwright test --grep @bedarfspruefung` | Needs assessment |

**Phase 2 Progress**: 0/11 (0%)

---

## Phase 3: Large Pages (> 500 Lines) - Careful Migration

These pages are complex and widely used. Migration requires careful planning and extensive testing.

| Page | Lines | Status | Test Command | Notes |
|------|-------|--------|--------------|-------|
| `microsoftlogin-page.ts` | 519 | ⏳ Pending | `npx playwright test --grep @smoke` | **Critical: Authentication** |
| `wsh-page.ts` | 537 | ⏳ Pending | `npx playwright test --grep @zahlungen` | WSH payments |
| `umfeld-page.ts` | 578 | ⏳ Pending | `npx playwright test --grep @kontakte` | Environment/contacts |
| `ph-page.ts` | 610 | ⏳ Pending | `npx playwright test --grep @aufgaben` | PH (Persönliche Hilfe) |
| `openDossier-page.ts` | 622 | ⏳ Pending | `npx playwright test --grep @dossier` | Dossier opening |
| `document-page.ts` | 696 | ⏳ Pending | `npx playwright test --grep @dokumente` | Document management |
| `navigation-page.ts` | 1191 | ⏳ Pending | `npx playwright test --grep @smoke` | **Critical: Core navigation** |
| `rahmenbudget-page.ts` | 1228 | ⏳ Pending | `npx playwright test --grep @rahmenbudget` | Framework budget (R0*) |
| `klientschaft-page.ts` | 1253 | ⏳ Pending | `npx playwright test --grep @klient` | **Largest: Client management** |

**Phase 3 Progress**: 0/8 (0%)

---

## Migration Checklist Template

For each page migration, follow these steps:

### Pre-Migration
- [ ] Read the page class to understand current structure
- [ ] Identify all methods using direct Playwright calls
- [ ] Check for existing `StabilityHelper` usage
- [ ] Find all test files that use this page
- [ ] Run baseline tests to ensure they pass before migration

### Migration Steps
- [ ] Change class declaration: `export class XPage extends BasePage`
- [ ] Add `super(page)` call in constructor (first line after opening brace)
- [ ] Remove `private stabilityHelper` property if exists
- [ ] Replace direct Playwright calls with BasePage methods:
  - [ ] `.click()` → `this.click()`
  - [ ] `.fill()` → `this.fill()`
  - [ ] Dropdown selections → `this.selectOption()`
  - [ ] Dialog operations → `this.openDialog()`, `this.closeDialog()`
  - [ ] Form submissions → `this.submitForm()`
  - [ ] Table clicks → `this.clickTableRow()`
- [ ] Update imports: Add `import { BasePage } from "./base-page";`
- [ ] Remove direct `StabilityHelper` instantiation if using inherited one

### Post-Migration Testing
- [ ] Run unit tests (if applicable): `npm run test:unit`
- [ ] Run page-specific tests: See "Test Command" in tables above
- [ ] Run smoke tests: `npx playwright test --grep @smoke`
- [ ] Check for any regressions or unexpected behavior
- [ ] Update this document with migration status

### Documentation
- [ ] Update migration status in this file
- [ ] Add migration date
- [ ] Note any issues encountered
- [ ] Update progress percentage

---

## Test Strategy

### After Each Migration
Run the following test suite to validate the migration:

```bash
# 1. Test the specific page's functionality
npx playwright test --grep @<tag> --headed --workers=1

# 2. Run smoke tests to ensure core flows still work
npx playwright test --grep @smoke --workers=1

# 3. If issues arise, run in debug mode
npx playwright test --grep @<tag> --debug
```

### Full Regression After Phase Completion
After completing each phase, run the full test suite:

```bash
# Run all stable tests
npx playwright test --grep @all --workers=1
```

---

## Common Migration Patterns

### Pattern 1: Simple Click
```typescript
// Before
await this.saveButton.click();

// After
await this.click(this.saveButton);
```

### Pattern 2: Fill with Validation
```typescript
// Before
await this.nameInput.fill(name);
await this.page.waitForTimeout(500);

// After
await this.fill(this.nameInput, name, {
    validate: true,
    waitAfter: 500
});
```

### Pattern 3: Dropdown Selection
```typescript
// Before
await this.dropdown.click();
await this.page.getByRole("option", { name: "Option" }).click();

// After
await this.selectOption(this.dropdown, "Option");
```

### Pattern 4: Form Submit with Verification
```typescript
// Before
await this.submitButton.click();
await this.page.waitForTimeout(2000);
await expect(this.successMessage).toBeVisible();

// After
await this.submitForm(
    this.submitButton,
    this.successMessage,
    { timeout: 5000 }
);
```

### Pattern 5: Using Inherited StabilityHelper
```typescript
// Before
export class MyPage {
    private stabilityHelper: StabilityHelper;

    constructor(page: Page) {
        this.page = page;
        this.stabilityHelper = new StabilityHelper(page);
    }

    async someMethod() {
        await this.stabilityHelper.waitForAngularStable();
    }
}

// After
export class MyPage extends BasePage {
    constructor(page: Page) {
        super(page); // this.stability is now available
    }

    async someMethod() {
        await this.stability.waitForAngularStable();
    }
}
```

---

## Known Issues & Workarounds

### Issue 1: Page with Composition Instead of Inheritance
Some pages (like `common-page.ts`) are used as composition helpers.

**Workaround**: Keep composition pattern but use BasePage methods internally:
```typescript
export class CommonPage {
    private basePage: BasePage;

    constructor(page: Page) {
        this.page = page;
        this.basePage = new BasePage(page);
    }

    async stableClick(locator: Locator) {
        await this.basePage["click"](locator); // Access protected method
    }
}
```

### Issue 2: Circular Dependencies
Pages that depend on each other may cause import cycles.

**Solution**: Extract shared utilities to separate files.

---

## Migration Log

### 2026-02-02 - Migration Plan Created
- Created comprehensive migration plan
- Identified all 31 pages requiring migration
- Categorized pages by size and complexity
- Defined testing strategy

---

## Next Steps

1. **Start Phase 1**: Begin with `zieterfassung-page.ts` (smallest page)
2. **Validate approach**: Ensure migration pattern works before scaling
3. **Create migration script**: Consider automating repetitive parts
4. **Update CI/CD**: Ensure pipeline tests catch any regressions

---

## Resources

- [BasePage API Documentation](../libs/pages/README-BasePage.md)
- [StabilityHelper Documentation](../libs/utils/stability-helper.ts)
- [CLAUDE.md - Architecture Guidelines](../CLAUDE.md)
- [Hydration Stability Plan](./HYDRATION_STABILITY_PLAN.md)
