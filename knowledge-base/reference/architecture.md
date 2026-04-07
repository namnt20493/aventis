# Projekt-Architektur

## Ueberblick

Aventis Playwright ist ein E2E-Testautomatisierungsprojekt fuer die Sozialhilfe-Applikation **Aventis** (qa.aventis.swiss). Das Framework basiert auf **Keyword-Driven Testing (KDT)** kombiniert mit dem **Page Object Model (POM)** und wird mit **Microsoft Edge** auf der QA-Umgebung ausgefuehrt.

---

## Layered Architecture

Die Codebasis folgt einem strikten Schichtenmodell. Jede Schicht hat eine klar definierte Verantwortung und darf nur die direkt darunterliegende Schicht aufrufen.

```
Tests (staticTestcases/)
   |
   v
Keywords (libs/keywords/)         -- Business-Logik, orchestriert Pages
   |
   v
Pages (libs/pages/)               -- Locators und Low-Level-Interaktionen
   |
   v
Workflows (libs/workflows/)       -- Komplexe Multi-Step-Operationen (API + GUI)
```

Fuer das **"modernes Framework"** existiert eine zusaetzliche Schicht:

```
Pages-v2 (libs/pages-v2/)  -->  Interfaces (libs/core/interfaces/)  -->  Controls (libs/core/controls/)
```

Details dazu unter [[page-object-model]].

---

## Verzeichnisstruktur

```
Aventis_Playwright/
├── staticTestcases/                 # Aktive Tests (HIERHIN SCHREIBEN)
│   ├── Smoke/                       # Smoke Tests (@smoke)
│   └── Keywordvalidation/           # KV Tests, organisiert nach Business-Bereich
│       ├── Aufgaben/                # @aufgaben
│       ├── Bedarfspruefung/         # @bedarfspruefung
│       ├── Bewilligung/             # @bewilligung
│       ├── Dokumente/              # @dokumente
│       ├── Dossier/                # @dossier
│       ├── Erwerbsintegration/     # @erwerbsintegration
│       ├── Klient/                 # @klient
│       ├── Kontakte/               # @kontakte
│       ├── Kostengutsprache/       # @kostengutsprache
│       ├── Rahmenbudget/           # @rahmenbudget
│       ├── Rechnungen/             # @rechnungen
│       ├── Rechtsverfolgung/       # @rechtsverfolgung
│       ├── Wohnsituation/          # @wohnsituation
│       ├── Zahlungen/              # @zahlungen
│       ├── WIP/                    # Work in progress (@wip)
│       └── Debug/                  # Debug-Tests (nicht in Pipeline)
├── testcases/                       # Legacy Tests (NUR LESEN, nicht schreiben!)
├── libs/
│   ├── keywords/                    # Keyword-Klassen (Business-Logik)
│   ├── pages/                       # Page Objects (Standard, BasePage)
│   ├── pages-v2/                    # Modernisierte Pages (nur "modernes Framework")
│   ├── core/                        # Framework-Kern (nur "modernes Framework")
│   │   ├── interfaces/              # Interface-Definitionen (IButton, ITextInput etc.)
│   │   ├── controls/                # Playwright-Implementierungen
│   │   └── base/                    # PageObjectBase
│   ├── workflows/                   # API- und GUI-Workflows
│   ├── constants/                   # TestPersons, TestUsers, TestCompanies
│   ├── utils/                       # Helpers (DateHelper, StabilityHelper etc.)
│   ├── sharedTestSteps/             # Geteilte Test-Logik
│   └── test-fixtures.ts             # Custom Playwright Fixtures
├── azure-pipelines-kv-tests.yml     # Haupt-Pipeline-Definition
├── azure-pipelines/                 # Pipeline-Templates
│   ├── templates/
│   │   ├── jobs/                    # Job-Templates
│   │   └── steps/                   # Step-Templates
│   └── variables/                   # Gemeinsame Variablen
├── playwright.config.ts             # Standard-Config (QA)
├── playwright.azure.config.ts       # Azure Pipeline
├── playwright.kv.config.ts          # Keyword Validation (lokal)
├── playwright.kv-azure.config.ts    # KV auf Azure Workspace
├── playwright.e2e.config.ts         # End-to-End Tests
├── playwright.debug.config.ts       # Debug-Konfiguration
└── playwright.service.config.ts     # Service-spezifisch
```

---

## Ist-Zustand vs Soll-Zustand

Das Projekt hat zwei koexistierende Frameworks. Beide sind produktiv im Einsatz.

### Ist-Zustand: Legacy Framework (Keyword-Driven)

- **Pages** in `libs/pages/` -- 31 Page Objects, direkte Playwright-Aufrufe
- **Keywords** in `libs/keywords/` -- Business-Logik, orchestrieren Legacy-Pages
- **Tests** in `staticTestcases/Keywordvalidation/` -- Keyword-Driven Tests
- StabilityHelper direkt instanziert (Komposition)
- Kein Interface-Layer zwischen Pages und Playwright
- **Status:** Funktional, wird gepflegt, aber nicht weiter ausgebaut

### Soll-Zustand: Modernes Framework (Control-basiert)

- **Pages** in `libs/pages-v2/` -- erben von `PageObjectBase`
- **Controls** in `libs/core/controls/` -- typisierte UI-Elemente (Button, TextInput, etc.)
- **Interfaces** in `libs/core/interfaces/` -- Playwright-unabhaengige Contracts
- **Tests** in `staticTestcases/FunctionalUI/` und `staticTestcases/Acceptance/`
- ServiceContext fuer Dependency Injection
- Factory-Methods fuer alle Controls
- **Status:** Core komplett, 2 Pages migriert, bereit fuer Ausbau

### Koexistenz-Strategie

| Test-Typ | Framework | Verzeichnis |
|----------|-----------|-------------|
| Keyword-Validation Tests | Legacy (Keywords + Pages) | `staticTestcases/Keywordvalidation/` |
| Functional UI Tests | Modern (Pages-v2 + Controls) | `staticTestcases/FunctionalUI/` |
| Acceptance Tests | Modern + API Workflows | `staticTestcases/Acceptance/` |
| Smoke Tests | Legacy (bestehend) | `staticTestcases/Smoke/` |
| Journey Tests | Legacy (Keywords) | `staticTestcases/Journey/` |

**Regel:** Neue Functional UI und Acceptance Tests immer mit modernem Framework. Keyword-Validation Tests bleiben auf Legacy. Siehe [[09-Modernes-Framework/ist-vs-soll]] fuer die vollstaendige Gegenuberstellung.

---

## BasePage vs PageObjectBase

| Kriterium | BasePage (Legacy) | PageObjectBase (Modern) |
|-----------|-------------------|-------------------------|
| **Verzeichnis** | `libs/pages/` | `libs/pages-v2/` |
| **Verwendung** | Keyword-Validation Tests | Functional UI + Acceptance Tests |
| **Playwright-Abhaengigkeit** | Direkte Playwright-Aufrufe | Playwright-unabhaengig via Interfaces |
| **Controls** | Keine (raw Locators) | IButton, ITextInput, IDropdown, etc. |
| **DI Pattern** | Kein (direkte Instanzierung) | ServiceContext |

Entscheidungsregel:
- **Keyword-Validation Test oder Keyword aendern?** → Legacy (`libs/pages/`)
- **Functional UI Test oder Acceptance Test?** → Modern (`libs/pages-v2/`)
- **Neue Page erstellen?** → Modern (`libs/pages-v2/`), siehe [[09-Modernes-Framework/neue-page-erstellen]]

Siehe [[page-object-model]] und [[09-Modernes-Framework/architektur]] fuer Details.

---

## Locator Placement Rules

Locators gehoeren IMMER in Page Objects, NIE in Keywords.

### FALSCH
```typescript
// In Keyword -- NIEMALS Locators hier
async checkForAccessViolation(): Promise<boolean> {
    const dialog = this.page.locator('mat-dialog-container:has-text("...")'); // ❌
    const closeBtn = this.page.locator('button:has-text("Schliessen")'); // ❌
}
```

### RICHTIG
```typescript
// In Page Object (z.B. common-page.ts)
export class CommonPage {
    readonly accessDeniedDialog: Locator;  // ✅ Locator als Klasseneigenschaft
    readonly dialogCloseButton: Locator;   // ✅ Locator als Klasseneigenschaft
    
    constructor(page: Page) {
        this.accessDeniedDialog = page.locator('mat-dialog-container:has-text("...")');
        this.dialogCloseButton = page.locator('button:has-text("...")').first();
    }
    
    async checkForAccessViolation(): Promise<boolean> {
        // Methode verwendet Klassen-Locators
    }
}

// In Keyword -- delegiert an POM
async checkForAccessViolation(): Promise<boolean> {
    return this.commonPage.checkForAccessViolation();  // ✅ Delegation
}
```

### Checkliste vor UI-Interaktionen

1. Gibt es ein wiederverwendbares Muster? → Methode im passenden POM erstellen
2. Wo gehoeren Locators? → Immer im Page Object Constructor
3. Soll das Keyword delegieren? → Ja, Keywords orchestrieren, POMs interagieren mit UI

---

## Playwright Konfigurationen

| Config-Datei | Zweck | Umgebung |
|---|---|---|
| `playwright.config.ts` | Standard (lokal, QA) | QA |
| `playwright.kv.config.ts` | Keyword Validation lokal | QA |
| `playwright.kv-azure.config.ts` | KV auf Azure Workspace (Cloud) | QA |
| `playwright.azure.config.ts` | Azure Pipeline Ausfuehrung | QA |
| `playwright.e2e.config.ts` | End-to-End Tests | QA |
| `playwright.debug.config.ts` | Debug-Modus | QA |
| `playwright.service.config.ts` | Service-spezifisch | variabel |

Alle Configs verwenden **Microsoft Edge** mit Automation-Detection-Countermeasures. Viewport: **1920x1200**.

---

## Path Aliases

Die `tsconfig.json` definiert Path Aliases fuer saubere Imports:

| Alias | Zielverzeichnis |
|---|---|
| `@libs/*` | `libs/*` |
| `@keywords/*` | `libs/keywords/*` |
| `@pages/*` | `libs/pages/*` |
| `@utils/*` | `libs/utils/*` |
| `@constants/*` | `libs/constants/*` |
| `@workflows` / `@workflows/*` | `libs/workflows/index` / `libs/workflows/*` |
| `@sharedTestsSteps/*` | `libs/sharedTestSteps/*` |
| `@parameters/*` | `libs/utils/parameters/*` |
| `@core` / `@core/*` | `libs/core/index` / `libs/core/*` |

Beispiel:

```typescript
import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@keywords/common-keyword";
import { TestPersons } from "@constants/testData";
import * as DateHelper from "@utils/helpers/DateHelper";
```

---

## Umgebung

- **Node.js**: 20.x+ (definiert in `.nvmrc` und `package.json`)
- **Browser**: Microsoft Edge
- **Base URL**: `https://qa.aventis.swiss/`
- **Viewport**: 1920x1200
- **Betriebssystem**: Windows 11 (lokal), Linux (Azure Workspace)

---

## Verwandte Seiten

- [[keyword-driven-testing]] -- KDT-Konzept und Keyword-Aufbau
- [[page-object-model]] -- BasePage vs PageObjectBase
- [[test-fixtures]] -- Custom Fixtures
- [[ci-cd-pipeline]] -- Azure Pipelines und Deployment
