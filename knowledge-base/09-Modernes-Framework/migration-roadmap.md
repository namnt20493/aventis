# Migration Roadmap

Phasen-Plan fuer die schrittweise Migration vom Legacy-Framework zum modernen Framework.

---

## Uebersicht

| Phase | Bezeichnung | Status | Beschreibung |
|-------|------------|--------|-------------|
| Phase 1 | Core Framework | ABGESCHLOSSEN | Interfaces, Controls, PageObjectBase, ServiceContext, Exceptions |
| Phase 2 | Basis-Pages | ABGESCHLOSSEN | LoginPage, NavigationPage migriert, Demo-Tests |
| Phase 2.5 | **Voraussetzungen fuer Phase 3** | **ABGESCHLOSSEN** | @step Decorator, executeWithContext, Async-Suffix entfernt, ServiceContext Fixture, CommonPage-Services, Table+Tab Controls |
| Phase 3 | Geschaeftsbereich-Pages | GEPLANT | Schrittweise Migration der 26 fachlichen Pages (11 EASY, 12 MEDIUM, 2 HARD) |
| Phase 4 | Neue Controls | **TABLE + TAB DONE** -- Rest bedarfsgetrieben | Table + Tab implementiert (Phase 2.5), Autocomplete/RadioButton/ToggleSwitch/FileUpload bedarfsgetrieben |
| Phase 5 | Test-Migration | OPTIONAL | Keywords auf pages-v2 umstellen |

---

## Phase 1: Core Framework -- ABGESCHLOSSEN

### Interfaces definiert (`libs/core/interfaces/`)

| Interface | Datei | Beschreibung |
|-----------|-------|-------------|
| `IControl` | `IControl.ts` | Basis-Interface: Sichtbarkeit, Enabled-Status, Warten |
| `IButton` | `IButton.ts` | Click-Aktionen (Standard + Stable), State Properties |
| `ITextInput` | `ITextInput.ts` | Fill, Clear, Validate, InnerText |
| `IDropdown` | `IDropdown.ts` | Select by Text/Value, Get Selected |
| `ICheckbox` | `ICheckbox.ts` | Check, Uncheck, IsChecked |
| `IDatePicker` | `IDatePicker.ts` | Datumseingabe und -auswahl |
| `ILink` | `ILink.ts` | Click, GetHref |
| `ILocatorProvider` | `ILocatorProvider.ts` | Locator-Abstraktion |
| `IStabilityHelper` | `IStabilityHelper.ts` | Alle StabilityHelper-Methoden als Interface |
| `IStabilityService` | `IStabilityService.ts` | Service-Interface fuer DI |
| `IServiceContext` | `IServiceContext.ts` | Service-Container Interface |

### Controls implementiert (`libs/core/controls/`)

| Control | Datei | Implementiert |
|---------|-------|-------------|
| `ControlBase` | `control-base.ts` | Basis fuer alle Controls, gemeinsame Methoden |
| `Button` | `button.ts` | `IButton` -- Factory-Methods: `byTestId`, `byName`, `byText`, `bySelector` |
| `TextInput` | `text-input.ts` | `ITextInput` -- Factory-Methods: `byTestId`, `byLabel`, `byId`, `byAngularTestId` |
| `Dropdown` | `dropdown.ts` | `IDropdown` -- Factory-Methods: `byTestId`, `byLabel`, `byAngularTestId` |
| `Checkbox` | `checkbox.ts` | `ICheckbox` -- Factory-Methods: `byTestId`, `byLabel` |
| `DatePicker` | `date-picker.ts` | `IDatePicker` -- Factory-Methods: `byTestId`, `byLabel`, `byAngularTestId` |
| `Link` | `link.ts` | `ILink` -- Factory-Methods: `byTestId`, `byText`, `bySelector`, `byPattern` |

### PageObjectBase erstellt (`libs/core/base/page-object-base.ts`)

- Abstrakte Basisklasse fuer alle modernen Pages.
- Factory-Methods fuer alle Controls (geben Interface-Typen zurueck).
- Page-Wait-Methods (`waitForPageReadyAsync`, `waitForAngularStableAsync`, `waitForUrlAsync`).
- Dialog-Methods (`waitForDialogAsync`, `closeDialogAsync`, `isDialogOpenAsync`).
- Low-level Locator-Methods nur fuer Ausnahmefaelle.

### ServiceContext + Exceptions

- `ServiceContext` (`libs/core/services/service-context.ts`): DI-Container mit `WeakMap`-Caching pro `Page`-Instanz.
- `StabilityHelper` implementiert `IStabilityService`.
- Exception-Klassen (`libs/core/exceptions/index.ts`): `ElementNotFoundException`, `TestDataException`, `AssertionException`, `NavigationException`, `DialogException`.

---

## Phase 2: Basis-Pages -- ABGESCHLOSSEN

### Migrierte Pages

| Legacy Page | Modern Page | Datei |
|-------------|------------|-------|
| `LoginPage` + `MicrosoftLoginPage` | `LoginPage` | `libs/pages-v2/login-page.ts` |
| `NavigationPage` | `NavigationPage` | `libs/pages-v2/navigation-page.ts` |

### Export

Beide Pages exportiert in `libs/pages-v2/index.ts`:

```typescript
import { LoginPage, NavigationPage } from "@libs/pages-v2";
```

### Erkenntnisse aus Phase 2

- Controls als `readonly` Properties im Klassen-Body funktionieren gut (keine Constructor-Zuweisung noetig).
- `ServiceContext.for(page)` als Default-Parameter im Constructor vereinfacht die Verwendung.
- Methoden-Benennung: `navigateTo*` statt `goTo*` fuer bessere Lesbarkeit.
- Async-Suffix (`clickAsync`, `fillAsync`) ist konsistent mit Interface-Konvention.

---

## Phase 3: Geschaeftsbereich-Pages -- GEPLANT

### Alle 26 Legacy-Pages zur Migration

Sortiert nach Prioritaet (hoch nach niedrig), basierend auf Keyword-Abhaengigkeiten und Verwendungshaeufigkeit.

#### Prioritaet HOCH (am meisten Keywords, kritische Abhaengigkeiten)

| # | Legacy Page | Datei | Lines | Verwendet von Keywords | Interne Abhaengigkeiten |
|---|-------------|-------|-------|----------------------|------------------------|
| 1 | `RahmenbudgetPage` | `rahmenbudget-page.ts` | 1228 | 6 Keywords (rahmenbudget, bedarfsprufung, bewilligungen, buchhaltung, document, zahlungen) | WohnSituationPage, NavigationPage, CommonPage |
| 2 | `KlientschaftPage` | `klientschaft-page.ts` | 1253 | klientshaft-keyword | CommonPage, NavigationPage |
| 3 | `DossierOpenPage` | `openDossier-page.ts` | 622 | dossier-keyword, common-keyword | CommonPage, NavigationPage |
| 4 | `BedarfsprufungPage` | `bedarfsprufung-page.ts` | 498 | bedarfsprufung-keyword, bewilligungen, buchhaltung | NavigationPage, RahmenbudgetPage, CommonPage |
| 5 | `DocumentPage` | `document-page.ts` | 696 | document-keyword, vorlagen-keyword | NavigationPage, CommonPage, RahmenbudgetPage |
| 6 | `BewilligungenWorkflowsPage` | `bewilligungenWorkflows-page.ts` | 222 | bewilligungen-keywords | NavigationPage, RahmenbudgetPage, CommonPage |

#### Prioritaet MITTEL (regelmaessig verwendet)

| # | Legacy Page | Datei | Lines | Verwendet von Keywords |
|---|-------------|-------|-------|----------------------|
| 7 | `ZahlungenPage` | `zahlungen-page.ts` | 219 | zahlungen-keyword |
| 8 | `WohnSituationPage` | `wohnsituation-page.ts` | 351 | wohnsituation-keyword, dossier-keyword, common-keyword |
| 9 | `WSHPage` | `wsh-page.ts` | 537 | wsh-keyword, zahlungen-keyword |
| 10 | `umfeldPage` | `umfeld-page.ts` | 578 | umfeld-keyword |
| 11 | `AufgabenPage` | `aufgaben-page.ts` | 381 | aufgaben-keyword |
| 12 | `PHPage` | `ph-page.ts` | 610 | ph-keyword, kontoauszug-keyword |
| 13 | `BuchhaltungPage` | `buchhaltung-page.ts` | 400 | buchhaltung-keyword |
| 14 | `KontoauszugPage` | `kontoauszug-page.ts` | 306 | kontoauszug-keyword, wsh-keyword |
| 15 | `FreiwilligePage` | `freiwillige-page.ts` | 226 | freiwillige-keyword, erfassung-keyword |
| 16 | `CommonPage` | `common-page.ts` | 377 | common-keyword, erfassung-keyword, wirtschaftlicheSozialhilfe-keyword |

#### Prioritaet NIEDRIG (wenig verwendet oder Spezial-Pages)

| # | Legacy Page | Datei | Lines | Verwendet von Keywords |
|---|-------------|-------|-------|----------------------|
| 17 | `RVPage` | `RV-page.ts` | 455 | RV-keyword |
| 18 | `DossierprufungPage` | `dossierprufung-page.ts` | 166 | dossierprufung-keyword |
| 19 | `DossierubersichtPage` | `dossierubersicht-page.ts` | 135 | dossierubersicht-keyword |
| 20 | `InstitutionenstammPage` | `institutionenstamm-page.ts` | 245 | institutionenstamm-keyword |
| 21 | `WirtschaftlicheSozialhilfePage` | `wirtschaftlicheSozialhilfe-page.ts` | 155 | wirtschaftlicheSozialhilfe-keyword |
| 22 | `RechnungPage` | `rechnung-page.ts` | 158 | erfassung-keyword |
| 23 | `ErfassungPage` | `erfassung-page.ts` | 139 | erfassung-keyword |
| 24 | `AnspruchsprufungPage` | `anspruchsprufung-page.ts` | 196 | anspruchsprufung-keyword |
| 25 | `VorlagenErafassenPage` | `vorlagenErafassen-page.ts` | 151 | vorlagen-keyword |
| 26 | `BuchungsJournalPage` | `buchungsJournal-page.ts` | 107 | buchungsJournal-keyword |
| -- | `ZieterfassungPage` | `zieterfassung-page.ts` | 44 | zieterfassung-keyword |

### Empfohlene Migrations-Reihenfolge (validiert durch interne Studien)

Basierend auf Dependency-Graph-Analyse (28 Pages importieren NavigationPage, 25 importieren CommonPage, 4 importieren RahmenbudgetPage):

**Voraussetzung (Phase 2.5 -- VOR Phase 3):**
1. **CommonPage aufsplitten** in Services (DateHelper erweitern, NumberFormatter, StringHelper, FileUploadHelper). CommonPage ist KEINE Page -- sie ist eine Utility-Klasse (377 Zeilen, 0 UI-Interaktion). 25 Pages haengen davon ab.
2. **Table + Tab Controls implementieren** (Phase 4 teilweise vorziehen). Table wird in 24 Pages benoetigt, Tab in 8 Pages.

**Schritt 1 -- Leaf-Pages ohne gegenseitige Abhaengigkeiten (parallel migrierbar):**
- **WohnSituationPage** (351 Zeilen, EASY-MEDIUM, wird von RahmenbudgetPage benoetigt)
- **KlientschaftPage** (1253 Zeilen, HARD, eigenstaendig)
- **DossierOpenPage** (622 Zeilen, MEDIUM, eigenstaendig)

**Schritt 2 -- Hub-Page:**
- **RahmenbudgetPage** (1228 Zeilen, HARD, wird von 4 anderen Pages benoetigt, 70 Methoden)

**Schritt 3 -- Abhaengige Pages:**
- **BedarfsprufungPage** (braucht RahmenbudgetPage)
- **BewilligungenWorkflowsPage** (braucht RahmenbudgetPage)
- **DocumentPage** (braucht RahmenbudgetPage)

**Schritt 4 -- Restliche Pages nach Bedarf (11 EASY-Pages je 1 Tag)**

### Migrations-Schwierigkeit pro Page (aus Methoden-Komplexitaets-Analyse)

| Schwierigkeit | Pages | Typische Groesse | Aufwand |
|:-:|:-:|---|---|
| EASY | 11 Pages | < 300 Zeilen, 3-11 Methoden | 0.5-1 Tag |
| MEDIUM | 12 Pages | 300-700 Zeilen, 13-30 Methoden | 1-2 Tage |
| HARD | 2 Pages (Rahmenbudget, Klientschaft) | 1200+ Zeilen, 70-85 Methoden | 3-5 Tage |

### Migrations-Checkliste pro Page

- [ ] Legacy-Page analysieren: Methoden, Locators, Abhaengigkeiten
- [ ] Methoden kategorisieren: Simple (1:1) / Composite (aufteilen) / Business-Logic (Service)
- [ ] Benoetigte Controls identifizieren (existierende oder neue)
- [ ] Fragile CSS/XPath-Locators auf TestId/Role umstellen
- [ ] Neue Datei in `libs/pages-v2/` erstellen
- [ ] `PageObjectBase` extenden, `ServiceContext.for(page)` im Constructor
- [ ] Controls als `readonly` Properties mit Factory-Methods deklarieren
- [ ] Public Methoden implementieren (nur Controls verwenden, keine direkten Playwright-Aufrufe)
- [ ] Business-Logic-Methoden in Services auslagern
- [ ] In `libs/pages-v2/index.ts` exportieren
- [ ] Test schreiben der die neue Page validiert

### Bekannte Probleme bei Migration (aus Code-Analyse)

| Problem | Vorkommen | Loesung |
|---------|:-:|---|
| try/catch mit page.reload() | ~8 Methoden | Stabile Locators verwenden, Controls haben eingebautes Retry |
| Polling-Loops (waitForTimeout) | ~12 | expect.poll() oder Control.waitForVisible() |
| pressSequentially statt fill | ~15 | fill() verwenden (schneller, stabiler) |
| Locator-Konstruktion in Methoden | ~25 | Als Control-Property im Klassen-Body |
| Direkte expect-Aufrufe in Pages | ~40 | control.shouldBeVisible() oder via PageObjectBase |
| console.log Debug-Output | ~20+ | @step Decorator fuer Reports |

---

## Phase 4: Neue Controls -- TABLE + TAB DONE

### Wann noetig

**Table und Tab muessen VOR Phase 3 implementiert werden** (in 24 bzw. 8 Legacy-Pages benoetigt). Restliche Controls bedarfsgetrieben.

### Geplante Controls

| Control | Interface | Beschreibung | Benoetigt fuer | Status |
|---------|-----------|-------------|---------------|--------|
| `RadioButton` | `IRadioButton` | Radio-Button-Gruppe | Bedarfspruefung (Eintretens-Radio), Klientschaft | |
| `ToggleSwitch` | `IToggleSwitch` | Angular Material Toggle | Diverse Formulare | |
| `FileUpload` | `IFileUpload` | Datei-Upload mit Drag-and-Drop | Dokumente, Rechnungen | |
| `Table` | `ITable` | Tabellen-Interaktion (Sortieren, Filtern, Zeilen) | Zahlungen, Kontoauszug, Buchungsjournal | IMPLEMENTIERT (Phase 2.5) |
| `Tab` | `ITab` | Tab-Navigation (Angular Material Tabs) | Rahmenbudget, Bedarfspruefung | IMPLEMENTIERT (Phase 2.5) |
| `Autocomplete` | `IAutocomplete` | Autocomplete/Typeahead-Felder | Dossier-Suche, Personen-Suche | |

### Implementierungs-Muster

Jeder neue Control folgt dem etablierten Muster:

1. Interface in `libs/core/interfaces/` definieren (z.B. `IRadioButton.ts`)
2. Implementation in `libs/core/controls/` erstellen (z.B. `radio-button.ts`)
3. Export in `libs/core/interfaces/index.ts` und `libs/core/controls/index.ts` hinzufuegen
4. Factory-Method in `PageObjectBase` ergaenzen (z.B. `protected radioButton(testId: string): IRadioButton`)

---

## Phase 5: Test-Migration -- OPTIONAL

### Grundsatz

Keyword-Driven Tests bleiben auf Legacy. Sie funktionieren, es gibt keinen Migrations-Zwang.

### Szenarien

| Szenario | Empfehlung |
|----------|-----------|
| **Neue Tests** | Immer modern (pages-v2) |
| **Keyword-Validation Tests** | Bleiben auf Legacy (Keywords + pages/) |
| **Keywords auf pages-v2 umstellen** | Nur wenn explizit beauftragt |
| **Bestehende Tests reparieren** | Im gleichen Framework bleiben |
| **Neuer Keyword** | Kann wahlweise Legacy oder Modern verwenden |

### Optionaler Migrations-Pfad fuer Keywords

Falls eine schrittweise Keyword-Migration gewuenscht wird:

1. **Adapter-Pattern**: Keyword instanziert sowohl Legacy-Page als auch pages-v2-Page. Methoden werden schrittweise umgestellt.
2. **Vollstaendige Umstellung**: Keyword verwendet nur noch pages-v2-Page. Legacy-Page wird entfernt.
3. **Validation**: Alle Tests die den Keyword verwenden muessen nach Migration gruendlich getestet werden.

Dieser Schritt wird nur durchgefuehrt, wenn ein expliziter Auftrag dafuer vorliegt.

---

## Zeitlicher Rahmen (Schaetzung -- aktualisiert mit Studien-Ergebnissen)

| Phase | Aufwand | Voraussetzung |
|-------|---------|---------------|
| Phase 1 | -- | Abgeschlossen |
| Phase 2 | -- | Abgeschlossen |
| Phase 2.5 (Voraussetzungen) | ~~3-5 Tage~~ DONE | Phase 2 |
| Phase 3 EASY (11 Pages) | 0.5-1 Tag pro Page (~8 Tage) | Phase 2.5 |
| Phase 3 MEDIUM (12 Pages) | 1-2 Tage pro Page (~18 Tage) | Phase 2.5 |
| Phase 3 HARD (2 Pages) | 3-5 Tage pro Page (~8 Tage) | Phase 2.5 + Table/Tab Controls |
| Phase 4 Rest (4 Controls) | 0.5-1 Tag pro Control | Phase 1 |
| Phase 5 (pro Keyword) | 1-2 Tage | Phase 3 fuer betroffene Pages |

**Gesamt Phase 3:** ~34 Arbeitstage fuer 25 Pages (2 bereits migriert).
Phase 3 und 4 werden bedarfsgetrieben umgesetzt -- nicht als Block, sondern wenn eine neue Page oder ein neuer Control fuer einen konkreten Test benoetigt wird.

---

## Verwandte Seiten

- [[ist-vs-soll]] -- Gegenuberstellung Ist vs Soll
- [[neue-page-erstellen]] -- Anleitung: Neue Page in pages-v2 erstellen
- [[agent-playbook-modern]] -- Entscheidungsbaum fuer Agents
- [[_page-index]] -- Vollstaendige Legacy-Page-Liste
- [[interne-studien]] -- Code-Analysen die diese Roadmap validiert haben
- [[externe-studien]] -- Best-Practice-Studien als Grundlage der Architektur-Entscheidungen
