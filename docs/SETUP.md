# Aventis Playwright E2E Test Setup Guide

Welcome to the Aventis Sozialhilfe E2E test automation project. This guide will help you get started as a new developer.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required

- **Node.js 20.x or higher** (check `.nvmrc` or run `node --version`)
  - npm 10.0.0 or higher comes bundled with Node.js 20+
- **Microsoft Edge browser** (required for test execution)
- **Git** (for cloning the repository)

### Optional

- **Azure CLI** (for Azure Playwright Workspaces integration)
  - Install from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
  - Login: `az login`

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Aventis_Playwright
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Playwright Browsers

```bash
npx playwright install chromium
```

Note: The project uses Microsoft Edge for test execution, but Chromium is needed for Playwright's internal tooling.

### 4. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then edit `.env` with your configuration.

## Environment Variables

The `.env` file is developer-specific and gitignored. Here's what each section contains:

### Aventis Test Environment

```env
BASE_URL=https://qa.aventis.swiss/
```

- **BASE_URL**: The QA environment URL (default: `https://qa.aventis.swiss/`)
- Available environments: `qa`, `def`

### Azure DevOps & Playwright Service

```env
PLAYWRIGHT_SERVICE_URL=wss://westeurope.api.playwright.microsoft.com/...
AZURE_TOKEN=YOUR_TOKEN_HERE
URL=https://diartis.visualstudio.com/Aventis
```

- **PLAYWRIGHT_SERVICE_URL**: Azure Playwright Workspace connection (already configured)
- **AZURE_TOKEN**: Get from your team lead for Azure Playwright Service access
- **URL**: Azure DevOps project URL (default: `https://diartis.visualstudio.com/Aventis`)

### Azure Test Sync CLI

```env
AZURE_DEVOPS_TOKEN=
AZURE_DEVOPS_ORG_URL=https://diartis.visualstudio.com
AZURE_DEVOPS_PROJECT=Aventis
```

- **AZURE_DEVOPS_TOKEN**: Personal Access Token for Azure DevOps REST API
  - Generate at: https://diartis.visualstudio.com/_usersSettings/tokens
  - Required scopes: Work Items (Read & Write), Test Management (Read & Write)
  - Needed for `npm run azure:*` commands
- **AZURE_DEVOPS_ORG_URL**: Organization URL (default provided)
- **AZURE_DEVOPS_PROJECT**: Project name (default: `Aventis`)

### TOTP / MFA Secrets (Required for Login)

```env
TOTP_SECRET_RETSCH=
TOTP_SECRET_RETSCO=
TOTP_SECRET_RETSCE=
TOTP_SECRET_RETSCD=
```

Each test user needs its own TOTP secret for 2FA login. Without these, login will fail with:
```
No secret found for username: xxx. Set TOTP_SECRET_XXX environment variable.
```

**How to get these:**
- Ask your team lead
- Or retrieve from Azure Key Vault (if you have access)

### Stability Configuration (Optional)

These settings control test execution speed and timing. You can use the defaults initially:

```env
SLOWMO=500                          # Global slowMo for browser actions (ms)
STABILITY_DELAY=1500                # Delay for critical sections (ms)
TIMEOUT_MULTIPLIER=1.5              # Multiplies all timeouts
NAVIGATION_STABILITY_WAIT=2000      # Wait after page navigation (ms)
ACTION_STABILITY_WAIT=500           # Wait after clicks/fills (ms)
STABILITY_VERBOSE_LOGGING=true     # Enable verbose logging
```

**Recommendations:**
- `SLOWMO`: 300-1000 for stability issues
- `STABILITY_DELAY`: 1000-3000 for problematic applications
- `TIMEOUT_MULTIPLIER`: 1.5-2.0 for slower applications

## Running Tests

### Local Test Execution

**Run tests headed (with visible browser):**
```bash
npx playwright test staticTestcases/path/to/test.spec.ts --headed --workers 1
```

**Run specific test by title:**
```bash
npx playwright test staticTestcases/ --headed --workers 1 --grep "test name"
```

**Run tests by tag:**
```bash
npx playwright test --grep @smoke      # Smoke tests
npx playwright test --grep @all        # All stable tests
```

**Debug mode (interactive UI):**
```bash
npx playwright test --config=playwright.debug.config.ts --ui
```

### Keyword Validation Tests

```bash
npx playwright test --config=playwright.kv.config.ts
```

Keyword validation tests verify that keyword implementations work correctly in isolation.

### Unit Tests

```bash
npm run test:unit              # Run all Jest unit tests
npm run test:unit:watch        # Watch mode
npm run test:unit:coverage     # With coverage report
```

### Azure DevOps Integration

```bash
npm run azure:sync              # Sync test results to Azure DevOps
npm run azure:validate          # Validate ADO test case mapping
npm run azure:report            # Generate test execution report
npm run azure:list              # List all ADO test cases
npm run azure:update-comments   # Update test case comments
npm run azure:create-missing    # Create missing ADO test cases
npm run azure:help              # Show CLI help
```

Requires `AZURE_DEVOPS_TOKEN` in `.env`.

## Project Structure

```
Aventis_Playwright/
├── staticTestcases/         # Test files (WRITE HERE)
│   ├── Keywordvalidation/   # Keyword validation tests
│   ├── Journey/             # End-to-end journey tests
│   └── Acceptance/          # Acceptance tests
├── testcases/               # Legacy tests (READ-ONLY, do not modify)
├── libs/
│   ├── keywords/            # Keyword implementations (business logic)
│   ├── pages/               # Page objects (BasePage - default)
│   ├── pages-v2/            # Modern framework pages (PageObjectBase)
│   ├── core/controls/       # UI controls (modern framework only)
│   ├── workflows/           # API test data setup workflows
│   ├── constants/           # TestPersons, TestUsers, TestCompanies
│   ├── utils/               # Helper utilities (DateHelper, etc.)
│   └── test-fixtures/       # Custom Playwright fixtures
├── playwright.*.config.ts   # Playwright configuration files
├── docs/                    # Project documentation
├── knowledge-base/          # Obsidian vault (domain knowledge)
└── memory/                  # AI agent memory files
```

### Key Directories

- **staticTestcases/**: Write all new tests here. Tests in `testcases/` are legacy and read-only.
- **libs/keywords/**: Keyword-driven testing layer. Keywords abstract business logic.
- **libs/pages/**: Page object model. Use `BasePage` by default.
- **libs/pages-v2/** and **libs/core/controls/**: Modern framework (only when explicitly needed).
- **libs/constants/**: Never hardcode test data. Use `TestPersons`, `TestUsers`, `TestCompanies`.
- **libs/workflows/**: API-first test data setup (100ms vs 5min GUI).

## Playwright Configurations

The project has multiple Playwright configs for different scenarios:

### playwright.config.ts (Default)
Default configuration for local test execution on QA environment.
```bash
npx playwright test
```

### playwright.debug.config.ts (Debug)
For debugging tests with Playwright UI mode.
```bash
npx playwright test --config=playwright.debug.config.ts --ui
```

### playwright.kv.config.ts (Keyword Validation - Local)
For running keyword validation tests locally.
```bash
npx playwright test --config=playwright.kv.config.ts
```

### playwright.kv-azure.config.ts (Keyword Validation - Azure)
For running keyword validation tests in Azure Pipelines.

### playwright.azure.config.ts (Azure Pipeline)
Configuration for Azure Pipeline execution with parallel workers.

### playwright.e2e.config.ts (End-to-End)
Configuration for end-to-end journey tests.

All configs read `BASE_URL` from `.env`.

## IDE Setup

### VS Code (Recommended)

The project includes shared VS Code configuration:

**Recommended Extensions** (`.vscode/extensions.json`):
- `ms-playwright.playwright` - Playwright Test for VS Code
- `hb432.prettier-eslint-typescript` - Prettier ESLint
- `editorconfig.editorconfig` - EditorConfig support
- `ms-vscode.vscode-typescript-next` - TypeScript support

VS Code will prompt you to install these when you open the project.

**Shared Settings** (`.vscode/settings.json`):
- Prettier formatting configuration
- TypeScript settings
- ESLint integration

**Personal Settings**:
- Use User Settings for personal preferences (colors, keybindings, etc.)
- Do not commit personal preferences to `.vscode/settings.json`

### Running Tests from VS Code

1. Install the Playwright extension
2. Open the Test Explorer (Testing icon in sidebar)
3. Click the play button next to any test to run it
4. Right-click for debug options

## AI Assistant Setup (Optional)

If using Claude Code:

- **Shared config**: `.claude/settings.json` (committed)
- **Personal config**: `.claude/settings.local.json` and `.claude/claudian-settings.json` (gitignored)

Project instructions are in `CLAUDE.md` and knowledge base in `knowledge-base/`.

## Verification

### Verify Node.js Version

```bash
node --version  # Should be 20.x or higher
npm --version   # Should be 10.x or higher
```

### Run a Simple Test

```bash
npx playwright test staticTestcases/Keywordvalidation/ --headed --workers 1
```

If keyword validation tests run successfully, your setup is complete.

### Common Issues

**Issue: Login fails with "No secret found"**
- Solution: Set `TOTP_SECRET_*` environment variables in `.env`

**Issue: Tests timeout or fail randomly**
- Solution: Increase stability settings in `.env` (`SLOWMO`, `TIMEOUT_MULTIPLIER`)

**Issue: Cannot find module errors**
- Solution: Run `npm install` again

**Issue: Browser not found**
- Solution: Run `npx playwright install chromium`

## Next Steps

1. Read `CLAUDE.md` - Project overview and core rules
2. Browse `knowledge-base/00-INDEX.md` - Domain knowledge and patterns
3. Review `docs/Playwright-BestPractices.md` - Best practices
4. Explore `staticTestcases/Keywordvalidation/` - Example tests
5. Check `memory/` - AI agent memory files with common pitfalls

## Getting Help

- Project documentation: `docs/`
- Knowledge base: `knowledge-base/`
- Memory files: `memory/domain-knowledge.md`, `memory/patterns.md`, `memory/debugging.md`
- Azure DevOps: https://diartis.visualstudio.com/Aventis

Welcome to the team!
