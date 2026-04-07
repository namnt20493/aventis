# Architektur -- Modernes Framework (Control-basiert)

## Ueberblick

Das moderne Framework ersetzt direkte Playwright-Aufrufe in Page Objects durch typisierte Controls und Interfaces. Page Objects in `libs/pages-v2/` sind Playwright-unabhaengig -- sie arbeiten ausschliesslich mit Interfaces (`IButton`, `ITextInput`, etc.). Die gesamte Playwright-Logik ist in den Control-Klassen (`libs/core/controls/`) gekapselt.

Dieses Kapitel dokumentiert ausschliesslich das **neue** Framework. Fuer das Legacy-Framework siehe [[page-object-model]].

---

## Schichten-Modell

```
+---------------------------------------------------------------+
|  Test Layer (staticTestcases/)                                 |
|  - Instanziiert Page Objects aus pages-v2/                     |
|  - Kann Controls direkt verwenden (Button.byTestId, etc.)      |
|  - Playwright-Fixtures (page, context) werden hier injiziert   |
+---------------------------------------------------------------+
                              |
                              v
+---------------------------------------------------------------+
|  Page Object Layer (libs/pages-v2/)                            |
|  - Extends PageObjectBase                                      |
|  - Nur Interfaces: IButton, ITextInput, IDropdown, etc.        |
|  - KEINE direkten Playwright-Aufrufe (page.xxx, expect)        |
|  - Framework-agnostisch                                        |
+---------------------------------------------------------------+
                              |
                              v
+---------------------------------------------------------------+
|  Interface Layer (libs/core/interfaces/)                       |
|  - IControl (Basis), IButton, ITextInput, IDropdown, ...       |
|  - ILocatorProvider, IElementLocator                           |
|  - IStabilityHelper, IStabilityService, IServiceContext         |
|  - Definiert den Vertrag zwischen Page Objects und Controls    |
+---------------------------------------------------------------+
                              |
                              v
+---------------------------------------------------------------+
|  Control Layer (libs/core/controls/)                           |
|  - ControlBase, Button, TextInput, Dropdown, Checkbox, ...     |
|  - Implementiert die Interfaces mit Playwright                 |
|  - Enthaelt ALLE Playwright-Abhaengigkeiten (Page, Locator)   |
|  - StabilityHelper fuer Angular-Unterstuetzung eingebaut       |
+---------------------------------------------------------------+
                              |
                              v
+---------------------------------------------------------------+
|  Playwright (Framework)                                        |
|  - Browser-Automatisierung (Page, Locator, expect)             |
|  - Wird NUR im Control Layer verwendet                         |
+---------------------------------------------------------------+
```

---

## ServiceContext und Dependency Injection

Der `ServiceContext` ist der zentrale Dependency-Injection-Container des modernen Frameworks. Er stellt Services (aktuell `IStabilityService`) bereit, die von Controls und PageObjectBase benoetigt werden.

### Aufbau

```typescript
// libs/core/services/service-context.ts
export class ServiceContext implements IServiceContext {
    readonly stability: IStabilityService;

    constructor(stability: IStabilityService) {
        this.stability = stability;
    }

    static for(page: Page): ServiceContext {
        // Cached pro Page-Instanz (WeakMap)
        // Erstellt automatisch StabilityHelper
    }
}
```

### Lebenszyklus

1. **Automatisch**: `ServiceContext.for(page)` wird als Fallback in `ControlBase` und `PageObjectBase` verwendet. Jeder `Page`-Instanz wird genau ein `ServiceContext` zugeordnet (via `WeakMap`-Cache).
2. **Explizit**: Page Objects koennen einen `IServiceContext` im Konstruktor empfangen, z.B. fuer Tests mit gemockten Services.
3. **Als Fixture**: In `test-fixtures.ts` steht `services: IServiceContext` als Playwright Fixture bereit. Tests koennen es destrukturieren und an Page Objects weitergeben:
```typescript
async ({ page, services }) => {
    const loginPage = new LoginPage(page, services);
}
```

### Fluss

```
Test erstellt PageObject:
  new LoginPage(page)
    -> PageObjectBase(page, ServiceContext.for(page))
       -> this.stability = services.stability
       -> Factory-Methoden uebergeben services an Controls

Control erhaelt Services:
  Button.byTestId(page, "id", services)
    -> ControlBase(page, locator, services)
       -> this.stability = services.stability
```

---

## Verzeichnisstruktur

```
libs/
├── core/                           # Framework-Kern
│   ├── interfaces/                 # Interface-Definitionen
│   │   ├── IControl.ts             # Basis-Interface fuer alle Controls
│   │   ├── IButton.ts              # Button-Interface
│   │   ├── ITextInput.ts           # TextInput-Interface
│   │   ├── IDropdown.ts            # Dropdown-Interface
│   │   ├── ICheckbox.ts            # Checkbox-Interface
│   │   ├── IDatePicker.ts          # DatePicker-Interface
│   │   ├── ILink.ts                # Link-Interface
│   │   ├── ITable.ts              # Table-Interface (NEU Phase 2.5)
│   │   ├── ITab.ts                # Tab-Interface (NEU Phase 2.5)
│   │   ├── ILocatorProvider.ts     # Locator-Abstraktion
│   │   ├── IStabilityHelper.ts     # Stability-Abstraktion
│   │   ├── IStabilityService.ts    # Stability-Service-Interface
│   │   ├── IServiceContext.ts      # DI-Container-Interface
│   │   └── index.ts                # Barrel Export
│   ├── controls/                   # Playwright-Implementierungen
│   │   ├── control-base.ts         # Implementiert IControl
│   │   ├── button.ts               # Implementiert IButton
│   │   ├── text-input.ts           # Implementiert ITextInput
│   │   ├── dropdown.ts             # Implementiert IDropdown
│   │   ├── checkbox.ts             # Implementiert ICheckbox
│   │   ├── date-picker.ts          # Implementiert IDatePicker
│   │   ├── link.ts                 # Implementiert ILink
│   │   ├── table.ts               # Implementiert ITable (NEU Phase 2.5)
│   │   ├── tab.ts                 # Implementiert ITab (NEU Phase 2.5)
│   │   └── index.ts                # Barrel Export
│   ├── base/                       # Basis-Klassen
│   │   └── page-object-base.ts     # Basis fuer Page Objects
│   ├── decorators/                # Method-Decorators
│   │   └── step.ts                # @step -- Report-Sichtbarkeit (NEU Phase 2.5)
│   ├── services/
│   │   ├── service-context.ts      # DI-Container
│   │   ├── number-formatter.ts     # Zahlen-Formatierung CH/FR (NEU Phase 2.5)
│   │   ├── string-helper.ts        # String-Utilities (NEU Phase 2.5)
│   │   ├── file-upload-helper.ts   # Datei-Upload (NEU Phase 2.5)
│   │   └── index.ts                # Barrel Export
│   ├── exceptions/                 # Typisierte Exceptions
│   │   └── index.ts
│   └── index.ts                    # Haupt-Export
├── pages/                          # Legacy Pages (NICHT AENDERN)
├── pages-v2/                       # Neue Pages mit Controls
│   ├── login-page.ts
│   ├── navigation-page.ts
│   └── index.ts
└── utils/
    └── stability-helper.ts         # StabilityHelper (von Controls genutzt)
```

---

## Design-Prinzipien

### 1. Playwright-Unabhaengigkeit

Page Objects in `pages-v2/` importieren **keine** Playwright-APIs ausser `Page` fuer den Konstruktor-Parameter. Alle Interaktionen laufen ueber Interfaces.

**Erlaubt in pages-v2:**
```typescript
import { Page } from "@playwright/test";  // Nur fuer Konstruktor
import { IButton, ITextInput } from "@core/interfaces";
```

**Verboten in pages-v2:**
```typescript
import { expect } from "@playwright/test";
await this.page.click(...);
await this.page.fill(...);
await expect(this.page.locator(...)).toBeVisible();
```

### 2. Interface-First

Jedes Control hat ein Interface (`IButton`, `ITextInput`, ...) und eine Implementierung (`Button`, `TextInput`, ...). Page Objects deklarieren Properties mit Interface-Typen:

```typescript
readonly speichernBtn: IButton = this.button("speichern");
```

### 3. Factory-Methoden

Controls werden ueber statische Factory-Methoden erstellt (`Button.byTestId()`, `TextInput.byLabel()`, etc.) oder ueber die Factory-Methoden von `PageObjectBase` (`this.button()`, `this.textInput()`, etc.).

### 4. Eingebaute Stabilitaet

Alle Controls verwenden den `StabilityHelper` intern. Es gibt keine Unterscheidung zwischen "stabilen" und "normalen" Methoden -- Stabilitaet ist Standard. Fuer Angular-Apps stehen zusaetzlich `*StableAsync()`-Varianten mit erweiterten Optionen bereit.

### 5. Diagnostics (Phase 2.5)

Zwei Mechanismen fuer bessere Fehlermeldungen und Reports:

- **`@step` Decorator**: Jede Control-Methode erscheint als benannter Step im Playwright HTML-Report. Format: `Button[testId="speichern"].click()`.
- **`executeWithContext()`**: Fehler werden automatisch mit Control-Typ, Action, Locator und Page-URL angereichert:
```
[Button] click() failed on "Button[testId="speichern"]"
  Element: getByTestId("speichern")
  Page URL: https://qa.aventis.swiss/dossier/123
  Reason: Timeout 30000ms exceeded
```

---

## Architektur-Entscheidungen (aus internen + externen Studien)

Die folgenden Entscheidungen basieren auf 6 externen Best-Practice-Studien ([[externe-studien]]) und 7 internen Code-Analysen ([[interne-studien]]).

### ADR-1: Enhanced POM + Component Controls beibehalten

**Entscheidung:** Kein Wechsel zu Screenplay oder Component Model. Unser Framework ist bereits ein POM-Screenplay-Component-Hybrid (Keywords=Tasks, Controls=Components, Pages-v2=Lean Pages). Die "POM is dead"-Debatte trifft nicht zu, da wir bereits Abstraktionsschichten haben.

### ADR-2: Interface-Granularitaet (7 typisierte Interfaces) beibehalten

**Entscheidung:** Die typisierten Interfaces (IButton, ITextInput, IDropdown, ICheckbox, IDatePicker, ILink + IControl-Basis) sind ein guter Mittelweg zwischen Selenide (1 universeller Typ) und Boa Constrictor (Locator ohne Methoden). Beibehalten.

**Handlungsbedarf:** Methoden-Anzahl reduzieren (42-57 pro Interface ist zu hoch):
- 7 kombinierte Click+Wait-Methoden auf IButton durch Komposition ersetzen
- Angular-Material-spezifische Methoden (isPrimary, isLoading) in MaterialHelper extrahieren

### ADR-3: Eigene Controls statt CDK Harnesses

**Entscheidung:** Kein Angular CDK Component Harness verwenden. `@ngx-playwright/harness` ist bei v0.12 (25 Stars, 3 Contributors) -- zu fragil. Eigene Controls sind massgeschneidert und bewaehrt. Neu evaluieren wenn Angular offiziell einen Playwright-Adapter liefert.

### ADR-4: StabilityHelper ist zoneless-kompatibel

**Entscheidung:** Der StabilityHelper nutzt DOM Mutation-basierte Stabilitaet (requestAnimationFrame + MutationObserver) -- nicht Zone.js-abhaengig. Bei Angular 21+ (Zoneless Default) sind keine Aenderungen noetig. `IStabilityService` Interface erlaubt Austausch der Implementierung ohne Page-Aenderungen.

### ADR-5: ServiceContext beibehalten + als Fixture bereitstellen

**Entscheidung:** ServiceContext (WeakMap pro Page) beibehalten. Zusaetzlich als Playwright Fixture `services: IServiceContext` in `test-fixtures.ts` exponieren, um die Dualitaet (ServiceContext vs Playwright Fixtures als zwei getrennte DI-Systeme) aufzuloesen.

**Skalierbarkeit:** Neue Services als optionale Properties:
```typescript
IServiceContext {
    readonly stability: IStabilityService;
    readonly logger?: ILoggerService;       // spaeter
    readonly config?: IConfigService;        // Worker-scoped via Fixture
}
```

### ADR-6: CommonPage als Services aufsplitten (NICHT als Page migrieren)

**Entscheidung:** CommonPage (377 Zeilen) ist eine reine Utility-Klasse mit Zero Page-Object-Charakter. 25 Legacy-Pages importieren sie. Sie wird aufgespalten in:

| Neuer Service | Methoden |
|--------------|---------|
| DateHelper (erweitern) | incrementDay, getDaysMinus, convertToDDMMYYYY, modifyDate |
| NumberFormatter (neu) | normalizeNumber, formatNumber_Ger, formatNumber_Fre |
| StringHelper (neu) | extractDossierName, capitalizeFirstLetter, formatAhvNumber, formatIban |
| FileUploadHelper (neu) | uploadFile, uploadFileWithApiWait, uploadMultipleFiles |

Legacy-CommonPage bleibt fuer bestehende Pages bestehen (Koexistenz).

### ADR-7: Async-Suffix entfernen

**Entscheidung:** `clickAsync()` wird zu `click()`, `fillAsync()` zu `fill()`. Der Async-Suffix ist ein .NET-Muster, in TypeScript unueblich. Kein grosses Framework (Playwright, Testing Library, WebdriverIO) verwendet ihn. `eslint/no-floating-promises` faengt fehlende awaits statisch ab.

### ADR-8: @step Decorator + executeWithContext() fuer Diagnostics

**Entscheidung:** Zwei Mechanismen:
1. `@step` Decorator -- wrapped Control-Methoden in `test.step()` fuer strukturierte HTML-Reports
2. `executeWithContext()` in ControlBase -- enriched Errors mit Control-Typ, Action, Locator, Page-URL

Error-Template:
```
[ControlType] action() failed on "description"
  Element: locator-strategy = "value"
  Page URL: current-url
  Timeout: Xms
```

---

## Fehlende Controls (aus interner Code-Analyse)

Basierend auf der Analyse von 1'654 Locator-Aufrufen in 33 Legacy-Pages:

| Prioritaet | Control | Vorkommen | Benoetigte Pages | Status |
|:-:|---------|:-:|---|---|
| 1 | **Table** (ITable) | 88 Rollen-Matches in 24 Dateien | Zahlungen, Kontoauszug, WSH, PH, BuchungsJournal | **IMPLEMENTIERT** (Phase 2.5) |
| 2 | **Tab** (ITab) | 22 in 8 Dateien | Rahmenbudget, Bedarfspruefung, Dossier | **IMPLEMENTIERT** (Phase 2.5) |
| 3 | **Autocomplete** (IAutocomplete) | ~15 in 6 Dateien | Dossier-Suche, Personen-Suche | GEPLANT |
| 4 | **RadioButton** (IRadioButton) | 8 in 5 Dateien | Bedarfspruefung, Klientschaft | GEPLANT |
| 5 | **FileUpload** (IFileUpload) | 3 in 1 Datei | Klientschaft, Dokumente | GEPLANT |
| 6 | **ToggleSwitch** (IToggleSwitch) | Nicht quantifiziert | Diverse Formulare | GEPLANT |

**Wichtig:** Table und Tab muessen **vor** Phase 3 der grossen Pages implementiert werden (Phase 4 teilweise vorziehen).

---

## Locator-Strategie (Soll-Zustand)

Aktuelle Verteilung im Legacy-Code: 34% CSS/XPath, 32% getByTestId, 32% getByRole, 2% andere.

### Locator-Hierarchie (Best Practice)

```
1. data-testid              -- Bevorzugt (sprachunabhaengig, aenderungsresistent)
2. getByRole + name         -- Wenn kein TestId (semantisch, accessibility-konform)
3. getByLabel               -- Fuer Formularfelder
4. CSS-Selektor             -- Letzter Ausweg (Angular Material Overlays, CDK)
```

### Zweisprachigkeit

451 Regex-Patterns (`/deutsch|francais/i`) in 29 Dateien. Bei Control-Migration:
- `data-testid` bevorzugen (sprachunabhaengig)
- Regex-Patterns in Factory-Methods kapseln wenn noetig
- Langfristig: TestID-Coverage in der Anwendung erhoehen

### Angular Material Locator-Patterns

| Component | Trigger | Options | Besonderheit |
|-----------|---------|---------|--------------|
| MatSelect | `getByRole('combobox', { name })` | `getByRole('option', { name })` | Options im CDK Overlay |
| MatAutocomplete | `getByLabel('Feldname')` | `getByRole('option', { name })` | Fill input, wait panel |
| MatDatePicker | `getByLabel('Datum')` | -- | Direkt `fill()` bevorzugen |
| MatTable | `getByRole('table')` | Rows/Cells via Role | Wait for rows |
| MatTabs | `getByRole('tab', { name })` | `getByRole('tabpanel')` | Lazy-loaded Content |
| MatDialog | -- | `locator('mat-dialog-container')` | Wait container |

---

## Sofort-Massnahmen (vor Phase 3)

| # | Massnahme | Begruendung | Referenz | Status |
|---|-----------|-------------|---------|--------|
| 1 | Async-Suffix entfernen | TypeScript-Standard | ADR-7 | DONE |
| 2 | Assertions intern auf `expect()` delegieren | Auto-Retry, bessere Fehler | Studie 5 | DONE |
| 3 | `executeWithContext()` in ControlBase | Selenide-inspirierte Error Messages | ADR-8 | DONE |
| 4 | `@step` Decorator einfuehren | Strukturierte HTML-Reports | ADR-8 | DONE |
| 5 | DI-Dualitaet aufloesen (ServiceContext als Fixture) | Zwei parallele DI-Systeme vereinen | ADR-5 | DONE |
| 6 | JUnit Reporter + `retries: 1` in CI | Azure Tests-Tab + Flaky-Detection | Studie 6 | DONE |
| 7 | Table + Tab Controls implementieren | Benoetigt in 24+8 Dateien | Control-Coverage | DONE |
| 8 | CommonPage-Services erstellen | Voraussetzung fuer Phase 3 | ADR-6 | DONE |

---

## Vergleich: Legacy vs Modern

| Aspekt | Legacy (`libs/pages/`) | Modern (`libs/pages-v2/`) |
|--------|----------------------|--------------------------|
| Basis-Klasse | `BasePage` | `PageObjectBase` |
| Playwright-Nutzung | Direkt (`page.click`, `expect`) | Nur via Controls (Interfaces) |
| Locator-Erstellung | `page.locator()`, `page.getByTestId()` | Factory-Methoden (`this.button()`, `Button.byTestId()`) |
| Stabilitaet | Manuell via `StabilityHelper` | Eingebaut in Controls |
| Validierung | `expect(locator).toBeVisible()` | `button.shouldBeVisible()` |
| Typisierung | Untypisiert (`Locator`) | Typisiert (`IButton`, `ITextInput`, ...) |
| Erweiterung | Schwierig (Playwright-Kopplung) | Einfach (neues Interface + Control) |
| Keyword-Layer | Nutzt Legacy-Pages | Nutzt (noch) Legacy-Pages |

### Wann was verwenden?

- **Legacy (`libs/pages/`, `BasePage`)**: Standard fuer alle Keyword-Driven Tests. Wird weiterhin fuer den gesamten bestehenden Keyword-Layer verwendet. Neue Pages hier nur, wenn sie von Keywords genutzt werden.
- **Modern (`libs/pages-v2/`, `PageObjectBase`)**: Fuer neue Functional UI Tests, Acceptance Tests und wenn explizit "modernes Framework" gewuenscht ist. Wird direkt von Tests ohne Keyword-Layer verwendet.

---

## Exceptions

Das Framework stellt typisierte Exception-Klassen bereit (`libs/core/exceptions/`):

| Exception | Zweck |
|-----------|-------|
| `ElementNotFoundException` | Element auf der Seite nicht gefunden |
| `TestDataException` | Testdaten ungueltig oder fehlend |
| `AssertionException` | Assertion fehlgeschlagen |
| `NavigationException` | Seitennavigation fehlgeschlagen |
| `DialogException` | Dialog-Operation fehlgeschlagen |

Jede Exception hat statische Factory-Methoden fuer haeufige Szenarien, z.B.:
```typescript
throw ElementNotFoundException.forTestId("submit-btn", 5000);
throw TestDataException.missingField("vorname");
```

---

## Path-Aliases

```json
{
  "@core": ["libs/core/index"],
  "@core/*": ["libs/core/*"],
  "@core/interfaces": ["libs/core/interfaces/index"],
  "@core/controls": ["libs/core/controls/index"],
  "@core/base": ["libs/core/base/index"],
  "@core/services": ["libs/core/services"],
  "@libs/pages-v2": ["libs/pages-v2/index"]
}
```

---

## Verwandte Seiten

- [[controls-referenz]] -- Alle Controls im Detail
- [[page-object-base-referenz]] -- PageObjectBase Factory- und Helper-Methoden
- [[pages-v2-referenz]] -- Implementierte Pages (LoginPage, NavigationPage)
- [[test-patterns-modern]] -- Test-Templates fuer das moderne Framework
- [[page-object-model]] -- Legacy-Framework Architektur
- [[externe-studien]] -- Externe Best-Practice-Studien (Selenide, Screenplay, Angular CDK, DI, Fluent API, Reporting)
- [[interne-studien]] -- Interne Code-Analysen (Control-Coverage, Locator-Audit, Dependencies, Komplexitaet, CommonPage, StabilityHelper)
- [[migration-roadmap]] -- Phasen-Plan fuer die Migration
- [[implementierungsplan-phase-2-5]] -- Konkreter Implementierungsplan fuer die Sofort-Massnahmen
