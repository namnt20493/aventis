# CLAUDE.md

## Project Overview

Playwright E2E test automation for **Aventis Sozialhilfe** (social assistance).
Keyword-Driven Testing + Page Object Model. Chromium (Edge channel) on QA environment.
Node.js 20+, TypeScript, `.env`-based configuration, Azure DevOps CI/CD.

## Core Rules

1. **Use testData fixture** -- Destructure `testData` from test fixtures. Access persons via `testData.persons.FIRST_PERSON.*`. `TestUsers`, `TestCompanies` from `@constants/`. Never hardcode names. The `testData` fixture generates realistic, seed-deterministic Swiss data via `TestDataFactory`.
2. **Use DateHelper** -- `DateHelper.*` from `@utils/helpers/DateHelper`. Never hardcode dates.
3. **Generate unique IDs** -- `generateUniqueDossierId(seed)` for every test.
4. **API-first setup** -- Use API workflows from `@workflows/` for test data (100ms vs 5min GUI).
5. **Write to `staticTestcases/`** -- `testcases/` is READ-ONLY legacy reference (writes blocked).
6. **Read keyword source first** -- Always verify parameter names/types before using any keyword.
7. **Use path aliases** -- `@keywords/`, `@pages/`, `@constants/`, `@utils/`, `@workflows/`, `@core`, `@libs/`.
8. **BasePage is default** -- `PageObjectBase` only for explicit "modernes Framework" work.
9. **No comments** unless explicitly requested -- code should be self-documenting.
10. **Code is truth** -- Local grep results override any documentation.

### Code Validation (Architecture Requirements)

**BLOCKED (Will cause write failure):**
- Writing to `testcases/` directory -> Use `staticTestcases/` instead

**MUST AVOID (Architecture violations):**
- Hardcoded dates like `"27.02.2026"` -> Use `DateHelper.getTodayDateString()`
- Hardcoded emails like `"user@diartis.ch"` -> Use `TestUsers.*` constants

## Key Architecture

### Layer Model
```
Test Spec (.spec.ts)  -- staticTestcases/
  └── Keywords         -- libs/keywords/ (~29 keyword files)
       └── Pages       -- libs/pages/ (BasePage, ~33 files) OR libs/pages-v2/ (PageObjectBase)
            └── Core   -- libs/core/ (Controls: Button, Dropdown, Table, DatePicker, etc.)
```

### Two Page Object Generations
| Generation | Base Class | Location | When to use |
|------------|-----------|----------|-------------|
| Legacy (default) | `BasePage` | `libs/pages/` | Default for all work |
| Modern | `PageObjectBase` | `libs/pages-v2/` + `libs/core/` | Only when explicitly requested |

### Authentication (API-based Login)

Login uses **API-based Azure AD authentication** (`libs/utils/api-login.ts`) -- no Microsoft GUI.
`AuthManager.swapUser()` tries API login first, falls back to GUI login on failure.

| Component | Location | Purpose |
|-----------|----------|---------|
| `api-login.ts` | `libs/utils/api-login.ts` | HTTP-based Azure AD login (5 steps, ~3s) |
| `AuthManager` | `libs/utils/auth-manager.ts` | Session cache + API login orchestration |
| `MicrosoftLoginPage` | `libs/pages/microsoftlogin-page.ts` | GUI fallback only |

**Login flow**: `Stable_Login` / `Stable_LogoutAndLoginDiffAccount` → `AuthManager.swapUser()` → API login (or cache hit) → cookie injection
**Never use `MicrosoftLoginPage` directly** -- always go through `AuthManager` / `Stable_Login`.

### Custom Fixtures (`libs/test-fixtures.ts`)
- `seed` -- Unique test case seed
- `testData` -- Test data container with sub-properties: `testData.persons` (Swiss names from `TestDataFactory`)
- `stabilityHelper` -- Retry & stability mechanisms
- `services` -- ServiceContext for modern controls
- `authenticatedRequest` -- API context sharing browser cookies

### Test Categories
| Category | Directory | Tag | Config |
|----------|-----------|-----|--------|
| Keyword Validation | `staticTestcases/Keywordvalidation/` | `@all`, `@smoke`, `@coreBusiness` | `playwright.kv.config.ts` |
| Journey | `staticTestcases/Journey/` | -- | `playwright.journey.config.ts` |
| Acceptance | `staticTestcases/Acceptance/` | `@acceptance` | `playwright.acceptance.config.ts` |
| Functional UI | `staticTestcases/FunctionalUI/` | `@functionalUI` | `playwright.functional-ui.config.ts` |
| Smoke | `staticTestcases/Smoke/` | `@smoke` | -- |
| Debug | `staticTestcases/Debug/` | -- | `playwright.debug.config.ts` |
| WIP | `staticTestcases/Keywordvalidation/WIP/` | `@wip` | -- |

### KV Test Domains
Aufgaben, Bedarfspruefung, Bewilligung, Buchhaltung, Dokumente, Dossier, Erwerbsintegration, Klient, Kontakte, Kostengutsprache, Rahmenbudget, Rechnungen, Rechtsverfolgung, Wohnsituation, Zahlungen

## Agent Routing

| Task | Agent |
|------|-------|
| Create new test/keyword/page | aventis-e2e-test-agent |
| Fix failing test / WIP test / Azure batch fix | test-healer-agent |
| Design journey test / ADO test cases / coverage | test-planner-agent |
| Interactive browser automation | mcp-browser-agent |
| Optimize performance / remove workarounds | perf-optimizer-agent |
| Migrate page to BasePage | `/migrate-to-basepage` |
| Review & improve Claude instructions | `/project-reflection` |

## Common Commands

```bash
npx playwright test --headed --workers 1                        # Run all headed
npx playwright test staticTestcases/Keywordvalidation/ --headed  # KV tests
npx playwright test --grep @smoke --headed                       # Smoke tests
npx playwright test --grep @all --headed                         # All stable
npx playwright test --debug                                      # Debug mode
npx playwright test --ui                                         # Interactive UI
npm run test:unit                                                # Jest unit tests
npm run typecheck                                                # TypeScript check
```

## Running Tests Efficiently (MANDATORY)

**NEVER run tests twice.** Always capture output in a single run.

### Single Run Pattern
```bash
npx playwright test <spec> --headed --workers 1 2>&1 | tee test-results/pw-output.txt; echo "EXIT:$?"
```
- `tee` streams output live AND saves to `test-results/pw-output.txt`
- `echo "EXIT:$?"` shows pass (0) or fail (1)
- **One run. No re-runs for output capture.**
- All test artifacts go into `test-results/` (already in `.gitignore`)
- If writing JSON results (e.g. test-result.json), always write to `test-results/test-result.json`
- **Never write test output or result files to the project root**

### On Success (EXIT:0)
Done. No further reading needed.

### On Failure (EXIT:1) -- Selective Read Only
```bash
# Option A: Extract only errors (preferred, most token-efficient)
grep -B2 -A15 "Error\|FAILED\|Timeout\|expect(" test-results/pw-output.txt

# Option B: Read summary (last 50 lines)
tail -50 test-results/pw-output.txt

# Option C: Full output (ONLY if A+B are insufficient)
# Read test-results/pw-output.txt
```

### BLOCKED Patterns
- Running `npx playwright test` twice for the same spec (once to see, once to capture)
- Reading the entire output file when `grep` or `tail` would suffice
- Running tests without `2>&1 | tee test-results/pw-output.txt` redirect

## Knowledge Base (Obsidian Vault)

**Einstiegspunkt:** `knowledge-base/00-INDEX.md`
**Strukturregeln:** `knowledge-base/kb-architecture.md`

### Task-Bundles (ONE read = alles was du brauchst)

| Ich will... | Lies EINE Datei |
|-------------|-----------------|
| Neuen Test erstellen | `knowledge-base/agent-bundles/create-test-bundle.md` |
| Test reparieren / WIP fixen | `knowledge-base/agent-bundles/fix-test-bundle.md` |
| Modernes Framework (pages-v2) | `knowledge-base/agent-bundles/modern-framework-bundle.md` |
| Keyword-Parameter nachschlagen | `knowledge-base/keyword-reference/_keyword-lookup.md` |

### Nachschlage-Dateien (nur bei Bedarf)

| Ich brauche... | Datei |
|----------------|-------|
| Workflow-Ketten / Prerequisites | `knowledge-base/domain/workflow-chains.md` |
| Benutzerrollen | `knowledge-base/domain/user-roles.md` |
| Error-Diagnose | `knowledge-base/debugging/error-solutions.md` |
| Fachbegriffe | `knowledge-base/domain/business-glossary.md` |

**Regel: Bundle vor Einzeldatei.** Lies zuerst das Task-Bundle, dann nur bei Bedarf Nachschlage-Dateien.

## Legacy Reference Documentation

- **Performance-Optimierung**: `docs/performance-optimization-plan.md`
- **Controls Architecture**: `docs/ARCHITECTURE_CONTROLS.md`
- **Migration (archived)**: `docs/archive/migration-guide.md`

## AI Behavior Rules

### Validation Principles

**ALWAYS before claiming "keyword/feature is missing":**

1. `grep` in `libs/keywords/*.ts` -- if found, keyword exists
2. `grep` in `staticTestcases/` -- check if already tested
3. Documentation is reference, NOT truth -- always validate against code

### Implementation Status Checklist

```
grep in libs/keywords/*.ts  -> Keyword method found?
grep in libs/pages/*.ts     -> Page methods exist?
grep in staticTestcases/    -> Used in tests?

ALL found    -> "Keyword is implemented"
Keyword only -> "Keyword exists, test missing"
Nothing      -> "Keyword missing"
```

### Data Source Priority

| Source | Priority |
|--------|----------|
| Local grep/read | HIGHEST |
| Azure DevOps (MCP) | MEDIUM |
| Markdown docs | LOW |

### Error Prevention

- Never say "keyword missing" without grepping `libs/keywords/`
- Never treat outdated checklists as truth
- Never confuse ADO test cases with code implementation
- Always distinguish "keyword missing" vs "test missing" vs "both missing"

## Learning & Reflection

Run `/project-reflection` after major work sessions to update memory files and knowledge base.
Knowledge Base: `knowledge-base/00-INDEX.md` (Obsidian Vault)
Memory files: `memory/domain-knowledge.md` | `memory/patterns.md` | `memory/debugging.md`
