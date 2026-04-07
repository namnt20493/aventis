# Aventis Playwright E2E Test Framework

Playwright E2E test automation framework for the **Aventis Sozialhilfe** (social assistance) application. Uses a **Keyword-Driven Testing** approach combined with **Page Object Model** patterns, running on Chromium (Microsoft Edge channel).

## Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

## Installation

1. Clone the repository

2. Install dependencies:

```bash
npm install
```

1. Install Playwright browsers:

```bash
npx playwright install
```

1. Configure environment:

```bash
cp .env.example .env
# Edit .env and set your values (BASE_URL, TOTP secrets, AZURE_TOKEN, etc.)
```

## Environment Configuration

The test environment is configured via the `.env` file (gitignored). Use `.env.example` as template.

### Key Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `BASE_URL` | Target environment URL | `https://qa.aventis.swiss/` |
| `TOTP_SECRET_*` | MFA/TOTP secrets per test user | _(required)_ |
| `AZURE_DEVOPS_TOKEN` | PAT for ADO REST API | _(optional)_ |
| `SLOWMO` | Global slowMo for browser actions (ms) | `500` |
| `STABILITY_DELAY` | Extra delay for critical sections (ms) | `1500` |
| `TIMEOUT_MULTIPLIER` | Multiplies all timeouts | `1.5` |

### Switching Between Environments

Edit `BASE_URL` in `.env`:

```bash
# QA (default)
BASE_URL=https://qa.aventis.swiss/
# DEV
BASE_URL=https://dev.aventis.swiss/
```

Or override via command line:

```bash
# PowerShell
$env:BASE_URL="https://dev.aventis.swiss/"; npx playwright test --headed

# Bash
BASE_URL=https://dev.aventis.swiss/ npx playwright test --headed
```

## Running Tests

### By Test Category

```bash
# Keyword Validation tests (primary test suite)
npx playwright test staticTestcases/Keywordvalidation/ --headed --workers 1

# Smoke tests
npx playwright test staticTestcases/Smoke/ --headed --workers 1

# Journey tests
npx playwright test staticTestcases/Journey/ --headed --workers 1

# Acceptance tests
npx playwright test staticTestcases/Acceptance/ --headed --workers 1

# Functional UI tests
npx playwright test staticTestcases/FunctionalUI/ --headed --workers 1
```

### By Tag

```bash
npx playwright test --grep @smoke --headed        # Smoke tests only
npx playwright test --grep @all --headed           # All stable tests
npx playwright test --grep @coreBusiness --headed   # Core business tests
npx playwright test --grep @wip --headed           # Work-in-progress tests
```

### With Specific Config

```bash
npx playwright test --config=playwright.kv.config.ts         # KV tests
npx playwright test --config=playwright.journey.config.ts    # Journey tests
npx playwright test --config=playwright.acceptance.config.ts # Acceptance tests
```

### Debug and Interactive

```bash
npx playwright test --debug       # Interactive debug mode
npx playwright test --ui          # UI mode for test exploration
npm run test:unit                 # Jest unit tests
```

## Project Structure

```
├── staticTestcases/              # Active tests (write new tests here)
│   ├── Acceptance/               # Acceptance tests (@acceptance)
│   ├── Debug/                    # Debug/experimental tests
│   ├── FunctionalUI/             # Functional UI tests (@functionalUI)
│   ├── Journey/                  # End-to-end journey tests
│   ├── Keywordvalidation/        # Keyword validation tests (primary suite)
│   │   ├── Aufgaben/             # Tasks, journal, goals
│   │   ├── Bedarfspruefung/      # Needs assessment
│   │   ├── Bewilligung/          # Approvals
│   │   ├── Buchhaltung/          # Accounting
│   │   ├── Dokumente/            # Documents
│   │   ├── Dossier/              # Dossier management
│   │   ├── Erwerbsintegration/   # Employment integration
│   │   ├── Klient/               # Client data (persons, income, assets)
│   │   ├── Kontakte/             # Contacts and institutions
│   │   ├── Kostengutsprache/     # Cost approvals
│   │   ├── Rahmenbudget/         # Budget framework
│   │   ├── Rechnungen/           # Invoices
│   │   ├── Rechtsverfolgung/     # Legal proceedings
│   │   ├── WIP/                  # Work in progress (@wip)
│   │   ├── Wohnsituation/        # Housing situation
│   │   └── Zahlungen/            # Payments
│   └── Smoke/                    # Core smoke tests
├── testcases/                    # Legacy tests (READ-ONLY reference)
├── libs/
│   ├── keywords/                 # Reusable test keywords (~29 files, business logic layer)
│   ├── pages/                    # Page Objects using BasePage (~33 files)
│   ├── pages-v2/                 # Modern Page Objects using PageObjectBase + Controls
│   ├── core/                     # Controls framework (modern architecture)
│   │   ├── base/                 # PageObjectBase base class
│   │   ├── controls/             # UI controls (Button, Dropdown, Table, DatePicker, etc.)
│   │   ├── interfaces/           # Control interfaces (IButton, ITextInput, etc.)
│   │   ├── decorators/           # Step decorator for reporting
│   │   ├── services/             # ServiceContext, helpers
│   │   └── exceptions/           # Custom exceptions
│   ├── workflows/                # Test data setup workflows
│   │   ├── apiDossierWorkflow    # API-based dossier creation (fast)
│   │   ├── guiDossierWorkflow    # GUI-based dossier creation
│   │   └── paymentConnectionWorkflow
│   ├── sharedTestSteps/          # Shared test logic (seed generation, dossier ID)
│   ├── constants/                # Test data (TestPersons, TestUsers, TestCompanies)
│   ├── utils/                    # Utilities
│   │   ├── helpers/              # DateHelper, formFillHelper, pathHelper
│   │   ├── ado-sync/             # Azure DevOps test sync modules
│   │   ├── auth-manager          # Authentication and cookie management
│   │   ├── stability-helper      # Retry and stability mechanisms
│   │   ├── azure-test-sync-cli   # CLI for ADO test plan sync
│   │   └── custom-reporter       # Custom Playwright reporter
│   └── test-fixtures.ts          # Custom Playwright fixtures (seed, stabilityHelper, services)
├── knowledge-base/               # Obsidian Vault (domain knowledge, agent bundles)
├── docs/                         # Architecture and migration documentation
├── testfiles/                    # Upload test documents
├── Smoketests/                   # Excel files for legacy test generation
├── playwright.config.ts          # Default Playwright config
├── playwright.shared.ts          # Shared config base (URLs, browser args, viewport)
└── azure-pipelines*.yml          # CI/CD pipeline definitions
```

## Configuration Files

| Config | Purpose |
|--------|---------|
| `playwright.config.ts` | Default local config (Chromium, headed) |
| `playwright.shared.ts` | Shared base: URLs, browser args, viewport, slowMo |
| `playwright.kv.config.ts` | Keyword validation tests (local) |
| `playwright.kv-azure.config.ts` | KV tests on Azure Pipeline |
| `playwright.journey.config.ts` | Journey tests (Azure) |
| `playwright.journey-local.config.ts` | Journey tests (local) |
| `playwright.acceptance.config.ts` | Acceptance tests (Azure) |
| `playwright.acceptance-local.config.ts` | Acceptance tests (local) |
| `playwright.functional-ui.config.ts` | Functional UI tests (Azure) |
| `playwright.functional-ui-local.config.ts` | Functional UI tests (local) |
| `playwright.e2e.config.ts` | E2E tests |
| `playwright.azure.config.ts` | Azure Pipeline execution |
| `playwright.service.config.ts` | Playwright Service (cloud browsers) |
| `playwright.debug.config.ts` | Debug configuration |

## Architecture

### Keyword-Driven Testing

Tests are composed of reusable **keywords** that encapsulate business operations:

```
Test Spec (.spec.ts)
  └── Keywords (libs/keywords/)     -- Business logic layer
       └── Pages (libs/pages/)      -- UI interaction layer
            └── Playwright API      -- Browser automation
```

### Two Page Object Generations

| Generation | Base Class | Location | Controls |
|------------|-----------|----------|----------|
| Legacy (default) | `BasePage` | `libs/pages/` | Direct Playwright locators |
| Modern | `PageObjectBase` | `libs/pages-v2/` + `libs/core/` | Typed Controls (IButton, IDropdown, ITable, etc.) |

### Custom Fixtures

Tests use custom fixtures from `libs/test-fixtures.ts`:

- `seed` -- Unique test case seed for reproducible test data
- `stabilityHelper` -- Retry and stability mechanisms
- `services` -- ServiceContext for modern controls
- `authenticatedRequest` -- API request context sharing browser cookies

### Key Conventions

- Use constants from `@constants/` (`TestPersons`, `TestUsers`, `TestCompanies`)
- Use `DateHelper` for all date values (never hardcode dates)
- Generate unique IDs with `generateUniqueDossierId(seed)`
- Prefer API workflows for test data setup (100ms vs 5min GUI)
- Write new tests in `staticTestcases/` (`testcases/` is read-only legacy)
- Use path aliases: `@keywords/`, `@pages/`, `@constants/`, `@utils/`, `@workflows/`, `@core`

## Test Generation from Excel

Legacy tests can be auto-generated from Excel files in `Smoketests/`:

```bash
npm run test
```

Generated tests appear in `testcases/` (legacy, read-only reference).

## CI/CD

Azure Pipelines run on the `master` branch. Each test category has its own pipeline:

| Pipeline | Schedule | Test Category |
|----------|----------|---------------|
| `azure-pipelines-kv-tests.yml` | Nightly 22:00 CET | Keyword Validation (@all) |
| `azure-pipelines-journey.yml` | Manual/scheduled | Journey tests |
| `azure-pipelines-acceptance.yml` | Manual/scheduled | Acceptance tests |
| `azure-pipelines-functional-ui.yml` | Manual/scheduled | Functional UI tests |
| `azure-pipelines.yml` | Main pipeline | General/legacy |

Pipelines support parameters for environment selection (qa/dev), execution mode (local-agent/azure-workspace), and test filtering by tag or test case ID.

## Azure DevOps Test Management

The `azure-test-sync-cli` tool synchronizes Playwright tests with Azure DevOps Test Plans.

### Features

- **Multi-Test-Type Support**: Automatically routes tests to appropriate ADO test plans:
  - Keyword Validation tests -> Plan 181204 / Suite 181205
  - Journey tests -> Plan 183831 / Suite 183879
  - Acceptance tests -> Plan 183595 / Suite 183597
- **Parameter Extraction**: Test steps include actual parameter values in ADO
- **Bi-directional Sync**: Detect drift between local tests and ADO test cases
- **Auto-Creation**: Create missing ADO test cases from spec files
- **Step Updates**: Sync test step changes back to ADO

### Setup

1. Generate a Personal Access Token in Azure DevOps:
   - Go to: <https://diartis.visualstudio.com/_usersSettings/tokens>
   - Scopes needed: Work Items (Read & Write), Test Management (Read & Write)

2. Configure in `.env` (see `.env.example` for all variables)

### Commands

```bash
npm run azure:sync              # Generate test manifest from spec files
npm run azure:validate          # Validate manifest (check for issues)
npm run azure:list              # List all tests with ADO ID status
npm run azure:list -- --filter status=missing-ado-id
npm run azure:report            # Generate coverage report by domain
npm run azure:report -- --format json
npm run azure:create-missing -- --dry-run   # Dry run
npm run azure:create-missing                # Create missing ADO test cases
npm run azure:update-comments   # Update ADO test steps from spec files
npm run azure:help              # Show help
```

### Test Type Detection

Tests are automatically routed based on directory structure:

- `staticTestcases/Keywordvalidation/` -> Keyword Validation
- `staticTestcases/Journey/` -> Journey Test
- `staticTestcases/Acceptance/` -> Acceptance Test

ADO test case titles are prefixed by type:

- `KeywordValidationTest: A01_Aufgabe_erfassen`
- `JourneyTest: DossierKomplett_Journey`
- `AcceptanceTest: AT_Rahmenbudget_Spalten_Ein_Ausblenden`

### Workflow

1. Write test with `@[ID]` tag (or leave empty for new tests)
2. Run `azure:sync` to generate manifest
3. Run `azure:validate` to check for issues
4. Run `azure:create-missing` to create ADO test cases for tests without IDs
5. Test cases are automatically added to the correct suite based on test type
6. Run `azure:update-comments` when test steps change

### Generated Files

- `test-manifest.json` -- Complete test inventory with ADO sync status, test steps, keyword usage
