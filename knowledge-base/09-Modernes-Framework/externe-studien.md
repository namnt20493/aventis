# Externe Studien -- Framework Best Practices

Erstellt: 2026-03-13
Zweck: Externe Best Practices recherchieren bevor Phase 3 der Modernisierung beginnt.

---

## Studie 1: Control-Abstraktions-Patterns in etablierten Frameworks

### Vergleichstabelle

| Framework | Element-Abstraktion | Granularitaet | Factory-Pattern | Fluent API | Auto-Wait |
|-----------|-------------------|---------------|-----------------|------------|-----------|
| **Selenide** (Java) | `SelenideElement` -- universeller Wrapper, KEIN Typ-Unterschied Button/Input | Niedrig (1 Klasse fuer alles) | `$()` / `$$()` Kurzschreibweise | Ja (`shouldBe(visible).click()`) | Ja (eingebaut, 4s default) |
| **Boa Constrictor** (.NET) | `IWebLocator` -- nur Lokalisierung, Interaktion via Tasks | Sehr niedrig (Locator hat keine Methoden) | `L("desc", By.xpath(...))` statisch | Nein (Screenplay: `actor.AttemptsTo(Click.On(locator))`) | Ja (in Tasks eingebaut) |
| **CodeceptJS** | Keine Element-Objekte, alles via `I.click()`, `I.fillField()` | Keine (action-basiert) | Keines (Locator als String) | Nein (sequentiell) | Ja (Helper-Ebene) |
| **Playwright nativ** | `Locator` -- universell, untypisiert | Niedrig (1 Klasse) | `page.getByRole()`, `page.getByTestId()` | Nein (async/await) | Ja (eingebaut) |
| **Unser Framework** | `IButton`, `ITextInput`, `IDropdown`, etc. -- typisierte Interfaces | Hoch (7 Interface-Typen) | `Button.byTestId()`, `this.button()` | Nein (async/await) | Ja (via StabilityHelper) |

### Analyse: Interface-Granularitaet

**Selenide**: `SelenideElement` hat ~40+ Methoden auf EINEM Typ. Kein Unterschied zwischen Button und Input. Alles ist ein `SelenideElement`. Vorteil: Einfach. Nachteil: Keine Typ-Sicherheit (man kann `setValue` auf einen Button aufrufen).

**Boa Constrictor**: Gegenteil -- Locator hat NULL Interaktions-Methoden. Alles passiert ueber Tasks (`Click.On()`, `Enter.TheValue().Into()`). Vorteil: SOLID-konform. Nachteil: Viel Boilerplate.

**Unser Ansatz (typisierte Interfaces)**: Mittelweg. `IButton` hat ~8 Methoden, `ITextInput` hat ~8 Methoden. Typ-Sicherheit verhindert unsinnige Aufrufe. Die Granularitaet ist **angemessen** -- nicht zu viel (Selenide), nicht zu wenig (Boa Constrictor).

### Befund: Methoden-Zaehlung pro Interface

Detaillierte Code-Analyse zeigt **deutlich mehr Methoden als angenommen**:

| Control | Eigene Methoden | Geerbte (ControlBase) | Total |
|---------|:-:|:-:|:-:|
| IButton | 16 | 30 | **46** |
| ITextInput | 27 | 30 | **57** |
| IDropdown | 18 | 30 | **48** |
| ICheckbox | 12 | 30 | **42** |
| IDatePicker | 18 | 30 | **48** |
| ILink | 14 | 30 | **44** |

Zum Vergleich: Selenide hat ~50 Methoden auf EINEM universellen Typ. Wir haben 42-57 pro typisiertem Interface.

**Problem identifiziert:** IButton hat 7 `clickAndWaitFor*StableAsync`-Varianten. Kein anderes Framework hat kombinierte Click+Wait-Methoden. Besser: Komposition (click + separater Wait-Call).

### Empfehlung fuer unser Framework

| Aspekt | Bewertung | Aktion |
|--------|-----------|--------|
| Interface-Granularitaet (7 Typen) | GUT -- Mittelweg zwischen Selenide und Boa Constrictor | Beibehalten |
| Factory-Methods (`Button.byTestId()`) | GUT -- Industrie-Standard | Beibehalten |
| Methoden-Anzahl (42-57 pro Interface) | ZU HOCH -- kombinierte Methoden aufloesen | Click+Wait als Komposition statt kombiniert (-5 Methoden auf IButton) |
| Angular-Material-spezifische Methoden | FALSCH PLATZIERT | `isPrimaryAsync`, `isLoadingAsync` aus IButton in MaterialHelper extrahieren |
| Description/Alias fuer Controls | FEHLT | Boa-Constrictor-inspiriert: `description: string` fuer bessere Fehlermeldungen |
| ControlCollection fuer Listen | FEHLT | Typisierte Abstraktion fuer "Liste von Controls" (wie Selenide's `ElementsCollection`) |
| Fehlende Controls | LUECKE | `Table`, `RadioButton`, `Autocomplete`, `Tab`, `FileUpload` ergaenzen (Phase 4) |

---

## Studie 2: POM vs Screenplay vs Component Model

### Vergleichsmatrix

| Kriterium | POM (klassisch) | Screenplay | Component Model |
|-----------|----------------|------------|-----------------|
| Skalierbarkeit (30+ Pages) | Mittel | Hoch (Tasks kompositorisch) | Hoch (Controls wiederverwendbar) |
| Wartbarkeit | Mittel | Hoch (Single Responsibility) | Hoch (Aenderungen isoliert) |
| Lernkurve | Niedrig | Hoch (5 Konzepte) | Mittel |
| Code-Reuse | Mittel (Vererbung) | Hoch (Komposition) | Hoch (Controls per Definition) |
| Testbarkeit der Infra | Niedrig | Mittel | Hoch (Controls unit-testbar) |
| Playwright-Kompatibilitaet | Nativ (empfohlen) | Gut (via Serenity/JS) | Nativ |
| Angular-Kompatibilitaet | Neutral | Neutral | Hoch (CDK Harnesses) |
| Keyword-Driven Kompatibilitaet | Hoch (unser Modell) | Redundanz-Risiko | Hoch |

### Kernerkenntnisse

1. **Unser Framework ist bereits ein POM-Screenplay-Component-Hybrid:**
   - Keywords = Task-Layer (Screenplay-Aequivalent)
   - Controls = Component-Layer
   - Pages-v2 = Lean Page Objects
   - Es fehlt nur die konsequente Durchsetzung auf alle 33 Pages

2. **Die "POM is dead"-Debatte trifft auf uns NICHT zu**, weil wir bereits eine Task-Schicht (Keywords) und ein Component-System (Controls) haben. Die Kritik zielt auf "nacktes POM ohne Abstraktionsschichten".

3. **Serenity/JS einzufuehren waere kontraproduktiv** -- Keywords und Tasks sind redundant. Der Aufwand uebersteigt den Nutzen.

### Entscheidung

**Enhanced POM + Component Controls beibehalten.** Evolutionaer erweitern:
- Legacy Pages bei Beruehrung nach pages-v2-Muster migrieren (Lean Pages: nur Controls, keine Logik)
- Control-Bibliothek um Angular-Material-spezifische Komponenten erweitern
- Keyword-Komposition verbessern (wiederkehrende Patterns extrahieren)

---

## Studie 3: Angular-spezifische Test-Strategien

### Angular CDK Component Harness

**Verfuegbare Playwright-Adapter:**
- `@ngx-playwright/test` -- Built-in CDK Harness Support, ersetzt `@playwright/test` Import
- `@ngx-playwright/harness` -- Standalone, ohne Angular-Abhaengigkeiten
- `playwright-harness` (kylejwatson) -- Community-Adapter mit `getHarness()`, `getAllHarnesses()`, `waitForAngular()`

**Bewertung fuer unseren Case:**

| Aspekt | Eigene Controls | CDK Harnesses | Hybrid |
|--------|----------------|---------------|--------|
| Angular-Material-Abdeckung | Manuell implementiert | Automatisch (MatSelect, MatDatePicker, etc.) | Beste aus beiden Welten |
| Pflege-Aufwand | Hoch (bei Angular-Updates) | Niedrig (vom Angular-Team gepflegt) | Mittel |
| Komplexitaet | Niedrig (eigener Code) | Mittel (zusaetzliche Abhaengigkeit) | Mittel |
| Playwright-Integration | Nativ | Via Adapter | Adapter fuer Material, nativ fuer Custom |

**Empfehlung: Eigene Controls beibehalten (vorerst kein CDK Harness).**

Begruendung:
- `@ngx-playwright/harness` ist bei v0.12, hat nur 25 GitHub Stars und 3 Contributors -- zu fragil fuer Production
- Es gibt keinen offiziellen Angular Playwright-Adapter (Feature Request Issue #30692 seit Maerz 2025, Status "needs triage")
- Eigene Controls sind massgeschneidert und bewaehrt
- **Neu evaluieren** wenn Angular offiziell einen Playwright-Adapter liefert oder wenn ein Major Angular Material Update DOM-Strukturen bricht

### Stability-Strategie

**Ist-Zustand:** Unser `StabilityHelper` nutzt **DOM Mutation-basierte Stabilitaet** (requestAnimationFrame + MutationObserver) -- das ist bewusst framework-agnostisch und **besser als der Standard** (`getAllAngularTestabilities().whenStable()`).

**Bewertung:** Ueberdurchschnittlich gut. Kombiniert mehrere Strategien (DOM-Mutation, rAF, Spinner-Detection, Retry mit Exponential Backoff). Nicht von Zone.js abhaengig.

**Zukunft (Zoneless Angular):** StabilityHelper ist **bereits zoneless-kompatibel**:

| Methode | Zoneless-Status | Aktion noetig? |
|---------|----------------|----------------|
| `waitForAngularStable()` | Kompatibel (DOM-basiert) | Nein |
| `triggerAngularChangeDetection()` | Funktioniert via Events | Vereinfachen wenn App zoneless wird |
| `forceAngularFormUpdate()` | Events triggern Signal-Updates | Nein |
| `stableClick/stableFill` | Kompatibel | Nein |

**Angular Roadmap:**

| Version | Zeitpunkt | Relevanz |
|---------|-----------|---------|
| Angular 20 | Mai 2025 | Signal-Primitives stabil |
| Angular 21 | Nov 2025 | **Zoneless ist Default**, Zone.js nicht mehr inkludiert |
| Angular 22 | 2026 | Signal Forms (experimentell) |

**Aktion:** `IStabilityService` Interface ist bereits richtig -- die Implementierung kann ausgetauscht werden ohne Pages anzufassen. Bei Angular-Upgrade der Aventis-App pruefen ob `triggerAngularChangeDetection()` vereinfacht werden kann.

### Angular Material Locator-Empfehlungen

**Kernprinzip:** Angular Material rendert Popups (Select-Options, Datepicker-Kalender, Autocomplete-Panels) in einem CDK Overlay Container am Ende des `<body>`, NICHT innerhalb der Komponente.

| Component | Trigger | Options/Content | Pattern |
|-----------|---------|-----------------|---------|
| **MatSelect** | `page.getByRole('combobox', { name })` | `page.getByRole('option', { name })` | Click trigger -> Wait panel -> Click option |
| **MatAutocomplete** | `page.getByLabel('Feldname')` | `page.getByRole('option', { name })` | Fill input -> Wait panel -> Click option |
| **MatDatePicker** | `page.getByLabel('Datum')` | -- | **Direkt `fill('27.03.2026')`** bevorzugen (Kalender-UI nur wenn noetig) |
| **MatTable** | `page.getByRole('table')` | Zeilen: `getByRole('row')`, Zellen: `getByRole('cell')` | Wait for rows -> Interact |
| **MatTabs** | `page.getByRole('tab', { name })` | `page.getByRole('tabpanel')` | Click tab -> Wait tabpanel content (lazy-loaded!) |
| **MatDialog** | -- | `page.locator('mat-dialog-container')` | Wait container -> Interact -> Close |

**Locator-Prioritaet (Best Practice):**
1. `getByRole` (bevorzugt -- semantisch, resilient)
2. `getByLabel` (fuer Formularfelder)
3. `getByTestId` (fuer Elemente ohne semantische Rolle)
4. CSS-Selektoren (`mat-select`, `mat-option`) als Fallback

---

## Studie 4: DI-Patterns und Service-Architektur

### Vergleich DI-Ansaetze

| Ansatz | Komplexitaet | Testbarkeit | Typ-Sicherheit | Overhead |
|--------|-------------|-------------|-----------------|----------|
| **Unser ServiceContext/WeakMap** | Niedrig | Gut (mockbar via Constructor) | Gut (IServiceContext) | Minimal |
| **Playwright Fixtures** | Niedrig | Sehr gut (Playwright-native) | Sehr gut | Keiner |
| **tsyringe/InversifyJS** | Hoch | Sehr gut | Sehr gut | Hoch (Decorators, Reflect-Metadata) |
| **Pure Factory Pattern** | Sehr niedrig | Mittel | Mittel | Keiner |

### Playwright Fixtures als DI

Playwright Fixtures sind de facto ein DI-System:
- `test.extend<MyFixtures>()` definiert typisierte Services
- Fixtures koennen voneinander abhaengen (Composition)
- Automatisches Setup/Teardown
- Worker-scoped vs Test-scoped Lifecycle

**Vergleich mit unserem Ansatz:**

```
Unser ServiceContext:         Playwright Fixtures:
- WeakMap<Page, Context>      - test.extend<Fixtures>()
- ServiceContext.for(page)    - Fixture per Destructuring
- Manuelles Caching           - Automatisches Lifecycle
- Eigene Implementation       - Playwright-native
```

### Befund: Zwei parallele DI-Mechanismen

Im Ist-Zustand existieren **zwei nicht verbundene DI-Systeme**:
1. `ServiceContext` (fuer Controls/Pages) -- erstellt eigenen StabilityHelper via WeakMap
2. Playwright Fixtures (`test-fixtures.ts`) -- liefern `stabilityHelper` direkt als Fixture

Diese Dualitaet sollte aufgeloest werden.

### Empfehlung

**ServiceContext beibehalten UND als Playwright Fixture bereitstellen.**

Konkreter Vorschlag:
1. `services: IServiceContext` als Test-scoped Fixture in `test-fixtures.ts` hinzufuegen
2. Eliminiert die Dualitaet (eine einzige Quelle fuer StabilityHelper)
3. `ServiceContext.for(page)` Fallback in Controls bleibt als Sicherheitsnetz
4. Worker-scoped Fixtures fuer globale Services (Config, Reporter) wenn spaeter benoetigt
5. **KEIN** tsyringe/InversifyJS -- Overkill fuer Test-Framework (bei 3-7 Services)

**Skalierbarkeit:** Neue Services als optionale Properties im Interface:
```
IServiceContext {
    readonly stability: IStabilityService;
    readonly logger?: ILoggerService;      // spaeter
    readonly config?: IConfigService;       // Worker-scoped via Fixture
}
```

---

## Studie 5: Fluent API Design

### Das "async kills fluent" Problem

| Ansatz | Beispiel | Lesbarkeit | Implementierungsaufwand |
|--------|---------|------------|------------------------|
| **await-per-line** (unser Ansatz) | `await btn.clickAsync()` | Gut | Keiner |
| **Selenide-Style Chaining** | `btn.shouldBe(visible).click()` | Sehr gut | Nicht moeglich mit async |
| **proxymise Library** | `await scraper.getSource().getLinks()` | Gut | Mittel (fragile Proxy-Magie) |
| **Custom Thenable** | `await btn.shouldBeVisible().andClick()` | Gut | Hoch (jede Methode braucht Custom-Klasse) |
| **Cypress Command Queue** | `cy.get().should().click()` | Sehr gut | Nicht auf Playwright uebertragbar |

### Kernerkenntnisse

1. **await-per-line ist fuer TypeScript/Playwright der Standard.** Kein grosses Framework (Playwright, Testing Library, Serenity/JS) hat erfolgreich Fluent-Chaining mit async/await implementiert.

2. **proxymise und Custom Thenables sind fragil** -- sie brechen leicht bei TypeScript-Strict-Mode, sind schwer zu debuggen, und IDE-Support (IntelliSense) ist schlecht.

3. **Selenide's Fluent API funktioniert nur weil Java synchron ist.** Das ist in TypeScript nicht nachbaubar ohne erhebliche Komplexitaet.

### Naming Conventions

| Konvention | Verbreitung | Empfehlung |
|------------|-------------|-----------|
| `clickAsync()` / `fillAsync()` | .NET Standard, unueblich in TS | Erwaegen zu entfernen |
| `click()` / `fill()` | Playwright, Testing Library, Selenide | **Empfohlen** -- TS-Community-Standard |
| `shouldBeVisible()` | Unser Ansatz | OK, aber Playwright's `expect()` ist maecthiger |
| `expect(x).toBeVisible()` | Playwright native | **Empfohlen** fuer Assertions |

### Empfehlung

1. **await-per-line beibehalten** -- es ist der TypeScript-Standard
2. **`Async`-Suffix entfernen**: `clickAsync()` -> `click()`, `fillAsync()` -> `fill()`. In TypeScript ist jede async-Methode offensichtlich (`await` ist Pflicht). Das Suffix ist Rauschen.
3. **Playwright `expect()` fuer Assertions nutzen** statt eigene `shouldBeVisible()` -- Playwright expect hat Auto-Retry und bessere Fehlermeldungen
4. **Eigene shouldBe-Methods als convenience behalten** aber intern auf `expect()` delegieren

### Naming-Vergleich Industrie

| Framework/Library | Naming-Stil | Beispiel |
|---|---|---|
| Playwright | Kein Suffix | `locator.click()`, `locator.fill()` |
| WebdriverIO | Kein Suffix | `element.click()`, `element.setValue()` |
| Testing Library | Kein Suffix | `findByRole()`, `waitFor()` |
| Node.js Core | Kein Suffix | `fs.promises.readFile()` |
| .NET (C#) | Async-Suffix | `ClickAsync()`, `FillAsync()` |
| Unser Framework | Async-Suffix | `clickAsync()`, `fillAsync()` |

Der `Async`-Suffix ist ein .NET-Muster, in TypeScript unueblich. `eslint/no-floating-promises` faengt fehlende `await`s statisch ab.

### Assertion-Strategie: Hybrid

- **Haeufige Assertions** als `should*` auf Controls behalten (gute Discoverability via IntelliSense)
- **Komplexe Assertions** via `expect(control.element).toHaveAttribute(...)` direkt
- **Domain-Assertions** via `expect.extend()` registrieren (seit Playwright 1.39: `mergeExpects`)

### Beispiel Ziel-API

```typescript
// ACTIONS -- ohne Async-Suffix (langfristiges Ziel)
await this.speichernBtn.click();
await this.vornameInput.fill("Max");
await this.rolleDropdown.selectByText("Sachbearbeiter");

// ASSERTIONS -- should*-Prefix beibehalten (gute Ergonomie)
await this.speichernBtn.shouldBeVisible();
await this.vornameInput.shouldContainText("Max");

// KOMPLEXE ASSERTIONS -- direkt mit Playwright expect
await expect(this.betragInput.element).toHaveValue(/^\d+\.\d{2}$/);

// DOMAIN ASSERTIONS -- via expect.extend() (spaeter)
await expect(this.betragInput.element).toHaveBetrag("1'250.00 CHF");
```

---

## Studie 6: Error-Reporting und Diagnostics

### Reporting-Stack Empfehlung

| Feature | Playwright Built-in | Allure | Custom |
|---------|-------------------|--------|--------|
| HTML Report | Ja (default) | Ja (reicher) | - |
| Test Steps | `test.step()` | `allure.step()` + auto-steps | - |
| Screenshots on Failure | `screenshot: 'only-on-failure'` | Automatisch attached | - |
| Traces | `trace: 'retain-on-failure'` | Attached als Artifact | - |
| Custom Metadata | `test.info().annotations` | `allure.label()`, `allure.link()` | - |
| CI Integration (Azure) | JUnit XML Reporter | Allure Azure Plugin | - |
| Step-Level Breakdown | Begrenzt | Sehr detailliert | - |
| Execution History | Nein | Ja (Trend-Charts, Flaky-Detection) | - |

**Empfehlung:** Kurzfristig Playwright Built-in nutzen (bereits konfiguriert). Mittelfristig Allure hinzufuegen fuer:
- Execution History und Flaky-Detection
- Detaillierte Step-Breakdown
- Bessere CI-Integration

### Error Message Guidelines

**Template fuer Control-Fehlermeldungen:**

```
[ControlType] Action failed on "[description]"
  Element: [locator-strategy] = "[locator-value]"
  Page URL: [current-url]
  Timeout: [timeout]ms
  Reason: [playwright-error-message]
```

**Beispiel:**
```
[Button] click() failed on "Speichern Button"
  Element: data-testid = "speichern"
  Page URL: https://qa.aventis.swiss/dossier/12345/rahmenbudget
  Timeout: 5000ms
  Reason: Element is not visible
```

### Befund: Ist-Stand Diagnostics

- **Exceptions**: 5 typisierte Exceptions in `libs/core/exceptions/index.ts` mit Factory-Methoden -- ABER: kein Page-URL, kein Action-Kontext, keine Hints
- **ControlBase**: KEINE automatische Diagnostik bei Fehlern
- **`@step` Decorator**: Wird NICHT verwendet -- kein strukturierter Report
- **Reporter**: Custom Excel-Reporter + HTML-Reporter + Azure-Reporter (gut konfiguriert)
- **Trace/Screenshot**: `trace: "on-first-retry"`, `screenshot: "only-on-failure"` (korrekt)

### Error Message Template (Selenide-inspiriert)

```
[ExceptionType]: Failed to [ACTION] on [CONTROL_TYPE] "[DESCRIPTION]"
  Locator:  [SELECTOR_OR_TESTID]
  Page URL: [CURRENT_URL]
  Timeout:  [TIMEOUT]ms
  Expected: [EXPECTED_STATE]
  Actual:   [ACTUAL_STATE]
  Hint:     [ACTIONABLE_SUGGESTION]
```

Fehlende Felder in bestehenden Exceptions: `pageUrl`, `action`, `hint`.

### Control-Level Diagnostics

**Empfehlung: Zwei Mechanismen kombinieren.**

**1. `@step` Decorator** fuer automatische Report-Steps:
- Wrapped jede Control-Methode in `test.step()`
- HTML-Report zeigt strukturierte Steps ("Button.click", "TextInput.fill('Max')")
- 0ms Performance-Overhead
- Referenz: [Checkly @step Decorator](https://www.checklyhq.com/docs/learn/playwright/steps-decorators/)

**2. `executeWithContext()` in ControlBase** fuer Error-Enrichment:
- `protected async executeWithContext(actionName, fn)` als zentrale Methode
- Happy Path: fuehrt fn() direkt aus -- kein Overhead
- Fehlerfall: reichert Error an mit Control-Typ, Action, Locator, Page-URL
- try/catch statt Decorator/Proxy (TypeScript-nativ, einfach debugbar)

**Performance-Budget:** 0ms im Happy Path. Bis zu 50ms im Fehlerfall (URL-Erfassung). Keine Screenshots in Controls -- das ist Playwright's Job.

### CI-Pipeline (Azure DevOps)

**Bereits gut konfiguriert:** `@alex_neo/playwright-azure-reporter` mit Attachments, HTML-Reporter, Traces.

**Fehlend/Empfohlen:**
1. **JUnit XML Reporter** hinzufuegen fuer native Azure "Tests"-Tab: `["junit", { outputFile: "test-results/results.xml" }]`
2. **`retries: 1` in CI** aktivieren -- mit `trace: "on-first-retry"` fuer automatische Trace-Erfassung bei Flaky Tests
3. **HTML Report** als Pipeline-Artifact hochladen (enthaelt inline-Links zu Traces)
4. **Allure** (spaeter) nur wenn Cross-Run-History und Trend-Analyse dringend benoetigt werden (Achtung: Java-Abhaengigkeit)

---

## Gesamtbild: Empfehlungen fuer das Framework

### Sofort umsetzen (vor Phase 3)

| # | Massnahme | Begruendung |
|---|-----------|-------------|
| 1 | `Async`-Suffix entfernen (`click()` statt `clickAsync()`) | TypeScript-Standard, weniger Rauschen |
| 2 | Assertions intern auf Playwright `expect()` delegieren | Auto-Retry, bessere Fehlermeldungen |
| 3 | `executeWithContext()` in ControlBase + Exceptions um pageUrl/action erweitern | Selenide-inspirierte Error Messages |
| 4 | `@step` Decorator einfuehren fuer Controls und Pages | Strukturierte HTML-Reports ohne Allure |
| 5 | DI-Dualitaet aufloesen: ServiceContext als Playwright Fixture | Zwei parallele DI-Systeme vereinen |
| 6 | JUnit Reporter in Azure Config + `retries: 1` in CI | Azure "Tests"-Tab + Flaky-Detection |

### Bei Phase 3 umsetzen

| # | Massnahme | Begruendung |
|---|-----------|-------------|
| 7 | Kombinierte Click+Wait-Methoden durch Komposition ersetzen | 7 Methoden auf IButton reduzierbar, Industrie-Standard |
| 8 | Angular-Material-spezifische Methoden aus generischen Interfaces extrahieren | `isPrimaryAsync`, `isLoadingAsync` gehoeren nicht in IButton |
| 9 | `description`-Property auf Controls einfuehren | Boa-Constrictor-inspiriert, verbessert Error Messages und Reports |
| 10 | Neue Controls: `Table`, `RadioButton`, `Autocomplete`, `Tab`, `ControlCollection` | Benoetigte Controls identifiziert + Listen-Abstraktion |
| 11 | CommonPage als Service/Mixin modellieren (nicht als Page) | Utility-Funktionalitaet gehoert nicht in ein Page Object |
| 12 | Playwright Fixtures staerker nutzen fuer Test-Setup | Natuerlichere DI als unser ServiceContext auf Test-Ebene |

### Langfristig evaluieren

| # | Massnahme | Begruendung |
|---|-----------|-------------|
| 9 | Allure Reporting einbauen | Execution History, Flaky-Detection |
| 10 | Zoneless Angular Support vorbereiten | Angular-Zukunft: Signals statt Zone.js |
| 11 | Conditions-System (Selenide-inspiriert) | Erweiterbarere Assertions |

---

## Quellen

### Studie 1 -- Control-Abstraktions-Patterns
- [Selenide Docs](https://selenide.org/documentation.html)
- [Selenide GitHub](https://github.com/selenide/selenide)
- [SelenideElement User Guide](https://selenide.gitbooks.io/user-guide/content/en/selenide-api/selenide-element.html)
- [Boa Constrictor -- Screenplay Pattern](https://q2ebanking.github.io/boa-constrictor/getting-started/screenplay/)
- [Boa Constrictor Quickstart](https://q2ebanking.github.io/boa-constrictor/getting-started/quickstart/)
- [CodeceptJS Playwright Helper](https://codecept.io/helpers/Playwright/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

### Studie 2 -- POM vs Screenplay vs Component
- [POM Is Dead: Heres What Replaced It](https://scrolltest.medium.com/page-object-model-is-dead-heres-what-replaced-it-ab4956381dbe)
- [Page Objects that Suck Less -- John Ferguson Smart](https://johnfergusonsmart.com/page-objects-that-suck-less-tips-for-writing-more-maintainable-page-objects/)
- [Serenity/JS Lean Page Objects](https://serenity-js.org/handbook/web-testing/page-objects-pattern/)
- [Serenity/JS Screenplay Pattern](https://serenity-js.org/handbook/design/screenplay-pattern/)
- [Angular CDK Component Test Harnesses](https://angular.dev/guide/testing/using-component-harnesses)
- [Cypress: Stop Using Page Objects](https://www.cypress.io/blog/stop-using-page-objects-and-start-using-app-actions)

### Studie 3 -- Angular-spezifisch
- [@ngx-playwright/test (npm)](https://www.npmjs.com/package/@ngx-playwright/test)
- [@ngx-playwright/harness (npm)](https://www.npmjs.com/package/@ngx-playwright/harness)
- [playwright-harness (GitHub)](https://github.com/kylejwatson/playwright-harness)
- [Playwright: Migrating from Protractor](https://playwright.dev/docs/protractor)
- [Playwright Issue #8433: Wait for Angular zone](https://github.com/microsoft/playwright/issues/8433)
- [Modern E2E Testing for Angular Apps](https://angular.love/modern-e2e-testing-for-angular-apps-with-playwright/)

### Studie 4 -- DI-Patterns
- [Playwright Fixtures Docs](https://playwright.dev/docs/test-fixtures)
- [Playwright Fixtures Complete Guide (Dec 2025)](https://medium.com/javarevisited/playwright-fixtures-a-complete-guide-for-scalable-test-automation-e41446872abb)
- [Serenity/JS Playwright Test Integration](https://serenity-js.org/handbook/test-runners/playwright-test/)

### Studie 5 -- Fluent API
- [Fluent API with Playwright (DEV Community)](https://dev.to/10-minutes-qa-story/fluent-api-pattern-implementation-with-playwright-and-javascripttypescript-2lk1)
- [Building Awaitable Fluent Interfaces](https://evertpot.com/await-fluent-interfaces/)
- [Playwright Test Steps with TypeScript Decorators](https://www.checklyhq.com/blog/playwright-test-steps-with-typescript-decorators/)

### Studie 6 -- Error-Reporting
- [Allure Playwright Docs](https://allurereport.org/docs/playwright/)
- [Allure + Playwright (BrowserStack)](https://www.browserstack.com/guide/integrate-allure-with-playwright)
- [Allure + Azure DevOps](https://abigailarmijo.substack.com/p/enhancing-test-reporting-integrating)
- [Playwright Configuration](https://playwright.dev/docs/test-configuration)
