# Ist-Zustand vs Soll-Zustand

Gegenuberstellung des aktuellen Legacy-Frameworks mit dem angestrebten modernen Framework.

---

## Ist-Zustand (Legacy)

### Architektur

```
Tests (staticTestcases/)
   |
   v
Keywords (libs/keywords/)         -- Business-Logik, orchestriert Pages
   |
   v
Pages (libs/pages/)               -- Direkte Playwright-Locators
   |
   v
StabilityHelper (libs/utils/)     -- Komposition, kein Interface
```

### Merkmale

| Aspekt | Beschreibung |
|--------|-------------|
| **Page Objects** | 33 Dateien in `libs/pages/`, keine einheitliche Basisklasse. `BasePage` existiert, wird aber von keiner Page extended. |
| **Locators** | Direkte Playwright-Locators (`page.getByRole(...)`, `page.locator(...)`) in jeder Page. |
| **StabilityHelper** | Direkt instanziert via `new StabilityHelper(page)` in fast jeder Page (Komposition). Kein Interface. |
| **Keywords** | Orchestrieren Legacy-Pages. Enthalten Business-Logik und Test-Steps. |
| **Tests** | Keyword-Driven in `staticTestcases/Keywordvalidation/`. |
| **Interface-Layer** | Keiner. Pages verwenden Playwright-APIs direkt. |
| **Business-Logik** | Vermischt mit UI-Interaktion in Page-Methoden. |
| **Control-Abstraktion** | Keine. Locators werden als `Locator`-Typ deklariert, ohne typisierte Controls. |
| **Exception-Handling** | Standard-Playwright-Fehler, keine dedizierten Exception-Klassen. |
| **Zweisprachigkeit** | Regex-Muster in Locators (`/Suche|Rechercher/i`). |

### Basis-Pages (Infrastruktur)

| Page | Datei | Beschreibung |
|------|-------|-------------|
| `BasePage` | `base-page.ts` | Definiert, aber nicht extended. Protected StabilityHelper-Wrapper. |
| `CommonPage` | `common-page.ts` | Utility: Formatierung, API-Warten, Datei-Upload. |
| `LoginPage` | `login-page.ts` | Aventis-Login mit OTP, Kontowechsel. |
| `MicrosoftLoginPage` | `microsoftlogin-page.ts` | Microsoft Online Login. |
| `NavigationPage` | `navigation-page.ts` | Hauptnavigation, Spinner-Warten, Dossier-Suche. |
| `KonfigPage` | `konfig-page.ts` | Benutzer-Tag und Rollenwechsel. |
| `DataBrowserPage` | `databrowser-page.ts` | Debugging/Admin. |

### Geschaeftsbereich-Pages

26 Pages fuer fachliche Bereiche (Dossier, Bedarfspruefung, Rahmenbudget, Zahlungen, etc.). Vollstaendige Liste in [[_page-index]].

### Abhaengigkeiten

- Fast alle Geschaeftsbereich-Pages verwenden `NavigationPage` und `CommonPage` intern.
- `StabilityHelper` wird in ~30 von 33 Pages direkt instanziert.
- Meistverwendete Page in Keywords: `RahmenbudgetPage` (6 Keywords), `NavigationPage` (fast alle).

---

## Soll-Zustand (Modernes Framework)

### Architektur

```
Tests (staticTestcases/)
   |
   v
Keywords (libs/keywords/)                    -- Business-Logik (weiterhin Legacy)
   |                                           ODER
Pages-v2 (libs/pages-v2/)                   -- Modernisierte Pages
   |
   v
PageObjectBase (libs/core/base/)             -- Abstrakte Basis mit Factory-Methods
   |
   v
Interfaces (libs/core/interfaces/)           -- IButton, ITextInput, IDropdown, ...
   |
   v
Controls (libs/core/controls/)               -- Playwright-Implementierungen
   |
   v
ServiceContext (libs/core/services/)          -- DI-Pattern fuer StabilityHelper
   |
   v
IStabilityService (libs/core/interfaces/)    -- Interface fuer StabilityHelper
```

### Merkmale

| Aspekt | Beschreibung |
|--------|-------------|
| **Page Objects** | In `libs/pages-v2/`, erben von `PageObjectBase`. |
| **Locators** | Keine direkten Playwright-Locators. Controls ueber Factory-Methods (`this.button(...)`, `this.textInput(...)`). |
| **StabilityHelper** | Ueber `ServiceContext` (DI-Pattern). Implementiert `IStabilityService`. Gecacht per `WeakMap<Page>`. |
| **Interface-Layer** | Vollstaendig: `IButton`, `ITextInput`, `IDropdown`, `ICheckbox`, `IDatePicker`, `ILink`, `IControl`. |
| **Control-Implementierungen** | `Button`, `TextInput`, `Dropdown`, `Checkbox`, `DatePicker`, `Link` -- alle in `libs/core/controls/`. |
| **Playwright-Unabhaengigkeit** | Page Objects verwenden nur Interfaces. Playwright-Logik ist in Controls gekapselt. |
| **Factory-Methods** | `this.button(testId)`, `this.buttonByName(name)`, `this.textInput(testId)`, etc. Geben Interface-Typen zurueck. |
| **Typed Properties** | Controls als `readonly` Properties mit explizitem Interface-Typ (`readonly saveButton: IButton`). |
| **Exception-Handling** | Dedizierte Klassen: `ElementNotFoundException`, `TestDataException`, `AssertionException`, `NavigationException`, `DialogException`. |
| **Neue Test-Typen** | Functional UI Tests, Acceptance Tests (geplant). |

### Bereits implementierte Interfaces

| Interface | Datei | Methoden (Auswahl) |
|-----------|-------|-------------------|
| `IControl` | `IControl.ts` | `isVisibleAsync()`, `waitForVisibleAsync()`, `shouldBeVisible()`, `shouldBeEnabled()` |
| `IButton` | `IButton.ts` | `clickAsync()`, `forceClickAsync()`, `doubleClickAsync()`, `clickStableAsync()`, `hoverAsync()` |
| `ITextInput` | `ITextInput.ts` | `fillAsync()`, `fillStableAsync()`, `clearAndFillAsync()`, `getValueAsync()`, `shouldContainText()` |
| `IDropdown` | `IDropdown.ts` | `selectByTextAsync()`, `selectStableAsync()`, `getSelectedTextAsync()` |
| `ICheckbox` | `ICheckbox.ts` | `checkAsync()`, `uncheckAsync()`, `isCheckedAsync()` |
| `IDatePicker` | `IDatePicker.ts` | Datumseingabe und -auswahl |
| `ILink` | `ILink.ts` | `clickAsync()`, `getHrefAsync()` |
| `IStabilityService` | `IStabilityService.ts` | `stableClick()`, `stableFill()`, `waitForAngularStable()`, `closeDialog()` |
| `IServiceContext` | `IServiceContext.ts` | `stability: IStabilityService` |

### Bereits migrierte Pages (Phase 2 abgeschlossen)

| Page | Datei | Status |
|------|-------|--------|
| `LoginPage` | `libs/pages-v2/login-page.ts` | Migriert |
| `NavigationPage` | `libs/pages-v2/navigation-page.ts` | Migriert |

---

## Koexistenz-Strategie

### Grundprinzip

Legacy und Modern existieren parallel. Keine erzwungene Gesamtmigration.

```
libs/pages/           -- Legacy Pages (bestehende Keywords nutzen diese)
libs/pages-v2/        -- Moderne Pages (neue Tests nutzen diese)
libs/core/            -- Framework-Kern (Interfaces, Controls, Services)
```

### Regeln

| Szenario | Framework | Begruendung |
|----------|-----------|-------------|
| **Keyword-Validation Test** | Legacy (`libs/pages/` + `libs/keywords/`) | Keywords orchestrieren Legacy-Pages. Funktioniert, kein Migrations-Zwang. |
| **Neuer Functional UI Test** | Modern (`libs/pages-v2/`) | Neue Tests sollen von Anfang an modern sein. |
| **Neuer Acceptance Test** | Modern (`libs/pages-v2/` + API Workflows) | Kombiniert moderne Pages mit schnellem API-Setup. |
| **Bestehenden Test reparieren** | Im gleichen Framework bleiben | Nicht mischen. Legacy bleibt Legacy, Modern bleibt Modern. |
| **Neue Page noetig** | Modern (`libs/pages-v2/`) | NIEMALS neue Pages in `libs/pages/` erstellen. |
| **Keywords auf Modern umstellen** | Optional (Phase 5) | Nur wenn explizit beauftragt. |

### Was NICHT passiert

- Bestehende Keyword-Validation-Tests werden NICHT auf `pages-v2` umgeschrieben.
- Legacy-Pages werden NICHT geloescht.
- Keywords verwenden weiterhin Legacy-Pages (bis ein expliziter Migrationsauftrag kommt).
- `BasePage` (`libs/pages/base-page.ts`) bleibt fuer Legacy-Kontext verfuegbar, wird aber nicht aktiv promoted.

### Ziel

- Neue Tests: Immer modern (`pages-v2` + `PageObjectBase` + Controls).
- Bestehende Tests: Pflegen im Legacy-Framework.
- Schrittweise Migration: Bei Bedarf, nicht pauschal.
- Langfristig: Alle neuen fachlichen Pages nur noch in `pages-v2`.

---

## Verwandte Seiten

- [[migration-roadmap]] -- Phasen-Plan fuer die Migration
- [[neue-page-erstellen]] -- Anleitung: Neue Page in pages-v2 erstellen
- [[agent-playbook-modern]] -- Entscheidungsbaum fuer Agents
- [[project-overview]] -- Aktuelle Architektur
- [[page-object-model]] -- BasePage vs PageObjectBase
- [[_page-index]] -- Vollstaendige Legacy-Page-Liste
