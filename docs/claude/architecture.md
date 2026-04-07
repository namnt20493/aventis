# Architecture Reference

## High-Level Structure

The codebase follows a layered architecture pattern:
1. **Tests** (`testcases/`, `staticTestcases/`) -> Call Keywords
2. **Keywords** (`libs/keywords/`) -> Business logic, orchestrate Pages
3. **Pages** (`libs/pages/`) -> Element locators and low-level interactions
4. **Pages-v2** (`libs/pages-v2/`) -> Modernized pages with Control pattern (only for "modernes Framework")
5. **Core Controls** (`libs/core/controls/`) -> Typed UI control classes (only for "modernes Framework")
6. **Workflows** (`libs/workflows/`) -> Complex multi-step operations

## Page Object Architecture Decision

> **Default: Use `BasePage`** from `libs/pages/base-page.ts` for all new and existing page objects.

| Scenario | Use | Location |
|----------|-----|----------|
| **Default (all normal work)** | `BasePage` | `libs/pages/base-page.ts` |
| New page objects | `BasePage` extends | `libs/pages/` |
| Modifying existing pages | `BasePage` extends | `libs/pages/` |
| Existing keywords/tests | Keep using `libs/pages/` | `libs/pages/` |
| Complex business logic | Keywords in `libs/keywords/` | `libs/keywords/` |
| **"modernes Framework" work only** | `PageObjectBase` + Interfaces | `libs/pages-v2/` |

**"modernes Framework"** refers to explicit framework modernization work on the Control-based architecture. This is ONLY used when the user specifically requests work on the modern framework layer. See `docs/ARCHITECTURE_CONTROLS.md` for full details.

## Control-Based Architecture (libs/core/) -- Only for "modernes Framework"

> **Activation keyword:** Only use this architecture when the user explicitly mentions "modernes Framework" or asks to work on `libs/pages-v2/`, `libs/core/`, or the Control/Interface layer.

The modern framework uses Interface-based decoupling (Playwright-independent page objects):

```
Page Objects (libs/pages-v2/) -> Interfaces (libs/core/interfaces/) -> Controls (libs/core/controls/)
```

| Interface | Key Methods |
|-----------|-------------|
| `IButton` | `clickAsync()`, `shouldBeEnabled()`, `getTextAsync()` |
| `ITextInput` | `fillAsync()`, `clearAsync()`, `shouldHaveValue()` |
| `IDropdown` | `selectAsync()`, `getOptionsAsync()`, `shouldHaveSelected()` |
| `ICheckbox` | `checkAsync()`, `uncheckAsync()`, `shouldBeChecked()` |
| `IDatePicker` | `setDateAsync()`, `setTodayAsync()`, `shouldHaveDate()` |
| `ILink` | `clickAsync()`, `getHrefAsync()`, `shouldHaveHref()` |

All Control methods are stable -- no need for separate "stable" methods.

## Test Organization

- **`staticTestcases/`** - Active, maintained tests (WRITE HERE, MANDATORY)
  - `Smoke/` - Core smoke tests (`@smoke` tag)
  - `Keywordvalidation/` - Keyword validation tests organized by business area:
    - `Aufgaben/` - Tasks, Journal, Ziele (`@aufgaben`)
    - `Bedarfspruefung/` - Anspruchspruefung, Soforthilfe (`@bedarfspruefung`)
    - `Bewilligung/` - Bewilligungsworkflow (`@bewilligung`)
    - `Dokumente/` - Dokumenteingang, Briefe (`@dokumente`)
    - `Dossier/` - Dossier-Management, Suche (`@dossier`)
    - `Erwerbsintegration/` - FEV (`@erwerbsintegration`)
    - `Klient/` - Personendaten, Einnahmen, Vermoegen (`@klient`)
    - `Kontakte/` - Institutionen, Bezugspersonen (`@kontakte`)
    - `Kostengutsprache/` - KG, SL (`@kostengutsprache`)
    - `Rahmenbudget/` - Budget, GBL, Freibetrag (`@rahmenbudget`)
    - `Rechnungen/` - Rechnungsverarbeitung (`@rechnungen`)
    - `Rechtsverfolgung/` - Ermittlung, Beschwerde (`@rechtsverfolgung`)
    - `Wohnsituation/` - Wohnung, Haushalt (`@wohnsituation`)
    - `Zahlungen/` - Zahlungen, Buchungen, WSH (`@zahlungen`)
    - `WIP/` - Work in progress tests (`@wip` tag)
    - `Debug/` - Debug tests (not in pipeline)
- **`testcases/`** - Legacy tests, **READ-ONLY** (writes blocked, reference for learning patterns only)

## Page Object Model

Each page class in `libs/pages/` contains:
- Locator definitions (elements on the page)
- Low-level interaction methods
- No business logic (that belongs in Keywords)

All pages inherit from or use `PHPage` as the base.

## Test Fixtures (`libs/test-fixtures.ts`)

Custom test fixtures extend Playwright's base test:
- `seed` - Unique test seed for data generation
- `authenticatedRequest` - API request context that shares cookies with browser
- `baseURL` - Base URL from project config
- Auto-logging of test start/finish and status

Always import test from fixtures:
```typescript
import { test } from "@libs/test-fixtures";
```

## Workflow Layer

The `libs/workflows/` directory provides high-level reusable flows:

**API Workflows** (Fast test data setup):
- `generateDossierViaApiWithPerson()` - Creates dossier + person via API with login
- `createDossierViaApiOnly()` - Creates dossier via API (assumes already logged in)
- `quickCreateDossier()` - Minimal dossier creation
- `createBedarfspruefungViaApi()` - Create needs assessment via API
- `createErwerbssituationViaApi()` - Create employment situation via API
- `setBewilligungsworkflowStepViaApi()` - Set approval workflow step

**GUI Workflows**:
- `generateDossier()` - Creates dossier through UI

**Payment Workflows**:
- `addZahlungsVerbindung()` - Add payment connection
- `createDossierViaApiOnlyWithPaymentConnection()` - Dossier with payment setup

**Best Practice**: Use API workflows for test data setup (much faster than GUI), then use GUI for the actual test scenario.

## Multiple Playwright Configs

- `playwright.config.ts` - Default config (QA environment)
- `playwright.azure.config.ts` - Azure Pipeline execution
- `playwright.kv.config.ts` - Keyword validation tests
- `playwright.kv-azure.config.ts` - KV tests on Azure
- `playwright.e2e.config.ts` - End-to-end tests
- `playwright.debug.config.ts` - Debug configuration
- `playwright.service.config.ts` - Service-specific config

All configs use Microsoft Edge with automation detection countermeasures.

## CI/CD

Azure Pipelines configuration in `azure-pipelines-kv-tests.yml`:
- Nightly test runs at 02:00 UTC
- Runs smoke tests first, then keyword validation tests
- Uses Playwright Azure Reporter
- Service principal authentication for Microsoft Graph API
- Test filter parameter supports tags like `@smoke`, `@wip`

## Environment

- Node version: 20.x+ (specified in `.nvmrc` and `package.json` engines)
- Base URL: `https://qa.aventis.swiss/` (default)
- Browser: Microsoft Edge (with extensive automation detection countermeasures)
- Viewport: 1920x1200
