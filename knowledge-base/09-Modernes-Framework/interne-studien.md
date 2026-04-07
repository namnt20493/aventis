# Interne Studien -- Code-Analyse des Legacy-Frameworks

Erstellt: 2026-03-13
Zweck: Analyse des bestehenden Codes in libs/pages/ als Basis fuer Phase 3+ der Framework-Modernisierung.

---

## Studie 1: Control-Coverage-Analyse

### Fragestellung

Welche UI-Controls werden in den 33 Legacy-Pages tatsaechlich verwendet?

### Daten

**Locator-Interaktionen (gesamt: 1'654 Locator-Aufrufe in 32 Dateien):**

| Interaktionstyp | Vorkommen | Dateien | Vorhandenes Control |
|-----------------|:-:|:-:|---|
| `.click()` | ~800+ | 32 | Button, Link |
| `.fill()` / `.type()` | ~300+ | 28 | TextInput |
| `.selectOption()` | 3 (nur README) | 1 | Dropdown (via Angular Material Overlay) |
| `.check()` / `.uncheck()` | 31 | 11 | Checkbox |
| `.setInputFiles()` | 3 | 1 (klientschaft) | **FEHLT: FileUpload** |
| Rolle `radio` | 8 | 5 | **FEHLT: RadioButton** |
| Rolle `tab` | 22 | 8 | **FEHLT: Tab** |
| Rolle `table` / `row` / `cell` | 88 | 24 | **FEHLT: Table** |
| Autocomplete-Pattern | ~15 | 6 | **FEHLT: Autocomplete** |

### Fehlende Controls (priorisiert nach Haeufigkeit)

| Prioritaet | Control | Vorkommen | Benoetigt fuer |
|:-:|---------|:-:|---|
| 1 | **Table** (ITable) | 88 Rollen-Matches in 24 Dateien | Zahlungen, Kontoauszug, Buchungsjournal, WSH, PH |
| 2 | **Tab** (ITab) | 22 Matches in 8 Dateien | Rahmenbudget, Bedarfspruefung, Dossier |
| 3 | **Autocomplete** (IAutocomplete) | ~15 in 6 Dateien | Dossier-Suche, Personen-Suche |
| 4 | **RadioButton** (IRadioButton) | 8 in 5 Dateien | Bedarfspruefung, Klientschaft |
| 5 | **FileUpload** (IFileUpload) | 3 in 1 Datei | Klientschaft, Dokumente |
| 6 | **ToggleSwitch** (IToggleSwitch) | Nicht quantifiziert | Diverse Formulare |

### Ergebnis

Die 6 vorhandenen Controls (Button, TextInput, Dropdown, Checkbox, DatePicker, Link) decken ~85% der Interaktionen ab. **Table ist das mit Abstand wichtigste fehlende Control** (88 Rollen-Matches), gefolgt von Tab (22) und Autocomplete (~15).

**Empfehlung Phase 4 Reihenfolge:** Table > Tab > Autocomplete > RadioButton > FileUpload > ToggleSwitch

---

## Studie 2: Locator-Strategie-Audit

### Fragestellung

Wie werden Elemente aktuell lokalisiert und was ist der Soll-Zustand?

### Daten (1'654 Locator-Aufrufe in 32 Dateien)

| Strategie | Vorkommen | Anteil | Bewertung |
|-----------|:-:|:-:|---|
| `page.locator()` (CSS/XPath) | 558 | 33.7% | SCHLECHT -- fragil, Angular-Struktur-abhaengig |
| `page.getByTestId()` | 535 | 32.3% | GUT -- stabil, aenderungsresistent |
| `page.getByRole()` | 533 | 32.2% | GUT -- semantisch, accessibility-konform |
| `page.getByLabel()` | 19 | 1.1% | GUT -- aber unterverwendet |
| `page.getByText()` | 11 | 0.7% | OK -- fuer statische Texte |
| `page.getByPlaceholder()` | 1 | 0.06% | OK -- Einzelfall |

### Zweisprachigkeits-Pattern

**451 Regex-Patterns** (`/deutsch|francais/i`) in 29 Dateien fuer bilinguale Locators.

Beispiel: `page.getByRole('button', { name: /Speichern|Enregistrer/i })`

**Bewertung:** Diese Regex-Patterns sind ein guter pragmatischer Ansatz fuer Zweisprachigkeit, ABER:
- Sie machen Locators komplex und schwer lesbar
- Bei Control-Migration sollten die Regex-Patterns in die Factory-Methods wandern
- Langfristig: `data-testid`-Attribute sind sprachunabhaengig und stabiler

### Verteilung pro Page (Auszug Top-6)

| Page | TestId | Role | CSS/XPath | Total | Bewertung |
|------|:-:|:-:|:-:|:-:|---|
| rahmenbudget-page | 45 | 89 | 102 | 236 | Role-heavy, viel CSS |
| klientschaft-page | 68 | 72 | 85 | 225 | Gemischt |
| ph-page | 38 | 55 | 42 | 135 | Relativ ausgewogen |
| umfeld-page | 35 | 48 | 40 | 123 | Relativ ausgewogen |
| wsh-page | 42 | 38 | 35 | 115 | TestId-lastig (gut) |
| document-page | 28 | 45 | 52 | 125 | CSS-lastig (schlecht) |

### Ergebnis

- **1/3 der Locators sind CSS/XPath** -- diese muessen bei Migration auf `getByTestId` oder `getByRole` umgestellt werden
- **1/3 sind getByTestId** -- direkt kompatibel mit Factory-Methods (`this.button(testId)`)
- **1/3 sind getByRole** -- kompatibel mit `byName()`/`byText()` Factory-Methods
- **Zweisprachigkeits-Regex** ist ein Querschnitts-Thema das in der Control-Abstraktion adressiert werden muss

### Best-Practice-Empfehlung fuer Locator-Hierarchie

```
1. data-testid         -- Bevorzugt (sprachunabhaengig, aenderungsresistent)
2. getByRole + name    -- Wenn kein TestId vorhanden (semantisch, accessibility)
3. getByLabel          -- Fuer Formularfelder (nutzerfreundlich)
4. CSS-Selektor        -- Nur als letzter Ausweg (Angular Material Overlays, etc.)
```

---

## Studie 3: Abhaengigkeits-Graph der Pages

### Fragestellung

Wie haengen die 33 Legacy-Pages untereinander zusammen?

### Dependency-Graph

```
                    NavigationPage (importiert von ~28 Pages)
                         |
                    CommonPage (importiert von ~25 Pages)
                         |
           +-------------+-------------+
           |             |             |
    RahmenbudgetPage  DossierOpenPage  KlientschaftPage
    (importiert von 4)  (eigenstaendig)  (eigenstaendig)
           |
    +------+------+------+
    |      |      |      |
  Bedarfs- Bewilli- Document- Kontoauszug-
  prufung  gungen   Page      Page
                              |
                        BuchungsJournal
```

### Import-Matrix (Top-Abhaengigkeiten)

| Page | Wird importiert von | Anzahl |
|------|-------------------|:-:|
| NavigationPage | Fast alle Pages | ~28 |
| CommonPage | Fast alle Pages | ~25 |
| RahmenbudgetPage | bedarfsprufung, bewilligungen, document, kontoauszug | 4 |
| WohnSituationPage | rahmenbudget | 1 |
| KontoauszugPage | buchungsJournal | 1 |
| LoginPage | databrowser | 1 |

### Querschnitts-Abhaengigkeiten

- **NavigationPage**: Wird intern von fast jeder Page fuer Navigation und Spinner-Warten verwendet. **Bereits migriert (pages-v2).**
- **CommonPage**: Wird fuer Utility-Funktionen (Formatierung, API-Wait, Upload) verwendet. **Muss als Service modelliert werden** (siehe Studie 5).
- **StabilityHelper**: Direkt instanziert in ~30 von 33 Pages via `new StabilityHelper(page)`. **Wird durch ServiceContext ersetzt.**

### Optimale Migrations-Reihenfolge (Bottom-Up)

```
Bereits migriert:
  [x] LoginPage (pages-v2)
  [x] NavigationPage (pages-v2)

Schritt 1 -- Infrastruktur (Voraussetzung):
  [ ] CommonPage -> Aufsplitten in Services (DateHelper, NumberFormatter, etc.)

Schritt 2 -- Leaf-Pages ohne Abhaengigkeiten:
  [ ] WohnSituationPage (wird von RahmenbudgetPage benoetigt)
  [ ] KlientschaftPage (eigenstaendig)
  [ ] DossierOpenPage (eigenstaendig)

Schritt 3 -- Hub-Pages:
  [ ] RahmenbudgetPage (wird von 4 anderen Pages benoetigt)

Schritt 4 -- Abhaengige Pages:
  [ ] BedarfsprufungPage (braucht RahmenbudgetPage)
  [ ] BewilligungenWorkflowsPage (braucht RahmenbudgetPage)
  [ ] DocumentPage (braucht RahmenbudgetPage)
  [ ] KontoauszugPage (eigenstaendig, aber einfach)

Schritt 5 -- Restliche Pages nach Bedarf
```

### Ergebnis

Die Roadmap-Reihenfolge (CommonPage -> WohnSituation -> Rahmenbudget -> Dossier -> Bedarfsprufung -> Bewilligungen) wird durch die Dependency-Daten **bestaetigt**. Einzige Korrektur: **KlientschaftPage und DossierOpenPage koennen parallel zu WohnSituationPage migriert werden** (keine gegenseitigen Abhaengigkeiten).

---

## Studie 4: Methoden-Komplexitaets-Analyse

### Fragestellung

Welche Page-Methoden sind 1:1 migrierbar, welche brauchen Redesign?

### Gesamt-Statistik (675 async-Methoden in 33 Pages)

| Page | Zeilen | Methoden | Simple | Composite | Business-Logic | Schwierigkeit |
|------|:-:|:-:|:-:|:-:|:-:|---|
| **RahmenbudgetPage** | 1228 | 70 | 35 | 28 | 7 | **HARD** |
| **KlientschaftPage** | 1253 | 85 | 40 | 35 | 10 | **HARD** |
| **NavigationPage** | -- | 69 | 30 | 30 | 9 | Bereits migriert |
| **DossierOpenPage** | 622 | 44 | 30 | 10 | 4 | MEDIUM |
| **DocumentPage** | 696 | 28 | 10 | 15 | 3 | MEDIUM |
| **BuchhaltungPage** | 400 | 30 | 15 | 12 | 3 | MEDIUM |
| **PHPage** | 610 | 29 | 12 | 14 | 3 | MEDIUM |
| **UmfeldPage** | 578 | 29 | 15 | 11 | 3 | MEDIUM |
| **WSHPage** | 537 | 27 | 12 | 12 | 3 | MEDIUM |
| **BedarfsprufungPage** | 498 | 23 | 12 | 8 | 3 | MEDIUM |
| **WohnSituationPage** | 351 | 20 | 12 | 6 | 2 | EASY-MEDIUM |
| **RVPage** | 455 | 20 | 10 | 8 | 2 | MEDIUM |
| **AufgabenPage** | 381 | 18 | 10 | 6 | 2 | EASY-MEDIUM |
| **ZahlungenPage** | 219 | 17 | 10 | 5 | 2 | EASY |
| **KontoauszugPage** | 306 | 13 | 8 | 4 | 1 | EASY |
| **RechnungPage** | 158 | 11 | 6 | 4 | 1 | EASY |
| **WirtschaftlicheSozialhilfePage** | 155 | 10 | 6 | 3 | 1 | EASY |
| **DossierprufungPage** | 166 | 9 | 5 | 3 | 1 | EASY |
| **InstitutionenstammPage** | 245 | 9 | 5 | 3 | 1 | EASY |
| **BewilligungenWorkflowsPage** | 222 | 8 | 2 | 5 | 1 | MEDIUM |
| **FreiwilligePage** | 226 | 8 | 4 | 3 | 1 | EASY |
| **VorlagenErafassenPage** | 151 | 7 | 4 | 2 | 1 | EASY |
| **AnspruchsprufungPage** | 196 | 5 | 3 | 2 | 0 | EASY |
| **ErfassungPage** | 139 | 5 | 3 | 2 | 0 | EASY |
| **BuchungsJournalPage** | 107 | 4 | 2 | 2 | 0 | EASY |
| **DossierubersichtPage** | 135 | 4 | 2 | 2 | 0 | EASY |
| **ZieterfassungPage** | 44 | 3 | 2 | 1 | 0 | EASY |

### Kategorisierung der Methoden-Typen

**Simple (~55% aller Methoden):** Einzelne Locator-Interaktion -- direkt migrierbar.
```typescript
// Beispiel: clickBedarfNavLink(), inputBetrag(), selectAHVErwachsenenrente()
async clickBedarfNavLink() { await this.bedarfNavLink.click(); }
```

**Composite (~35% aller Methoden):** Mehrere UI-Steps in einer Methode -- migrierbar, evtl. aufteilen.
```typescript
// Beispiel: erwerbssituationEinnahmen() -- switch + fill + click + wait
// Beispiel: createLeistungsentscheid() -- 70 Zeilen mit try/catch, retries, polling
// Beispiel: searchBewillingung() -- 9 Parameter, bedingte Felder
```

**Business-Logic-Heavy (~10% aller Methoden):** Berechnungen, Validierungen, Formatierungen -- in Services auslagern.
```typescript
// Beispiel: verifyRahmenKrankenDetails() -- 15 Parameter, komplexe Validierungslogik
// Beispiel: checkMonatsbudget() -- Betragsberechnungen
// Beispiel: acceptBewillingungProcess() -- Workflow-Orchestrierung mit Polling
```

### Stichproben-Analyse: Problematische Patterns

| Pattern | Vorkommen | Beispiel | Problem |
|---------|:-:|---|---|
| **try/catch mit page.reload()** | ~8 | createLeistungsentscheid | Workaround statt stabiler Locator |
| **Polling-Loop (waitForTimeout)** | ~12 | createLeistungsentscheid, acceptBewillingungProcess | Sollte expect.poll nutzen |
| **console.log Debug-Output** | ~20+ | Diverse | Sollte in Reports, nicht in Console |
| **pressSequentially statt fill** | ~15 | inputFromDateToDate, selectZahlbarDurch | Langsam, fragil -- fill ist besser |
| **Locator-Konstruktion in Methode** | ~25 | selectZahlbarDurch, clickRahmenbudgetNavLink | Sollte als Control-Property |
| **Direkte expect-Aufrufe** | ~40 | Diverse verify/check-Methoden | Playwright-Kopplung in Page |
| **switch/case fuer Typ-Auswahl** | ~5 | erwerbssituationEinnahmen | Business-Logik in Page |

### Ergebnis

| Schwierigkeit | Pages | Anteil |
|:-:|:-:|:-:|
| EASY | 11 Pages (< 300 Zeilen) | 42% |
| MEDIUM | 12 Pages (300-700 Zeilen) | 46% |
| HARD | 2 Pages (> 1200 Zeilen) | 8% |
| Bereits migriert | 2 Pages (Login, Navigation) | -- |

**RahmenbudgetPage und KlientschaftPage sind die beiden schwierigsten Migrationen** (je 1200+ Zeilen, 70-85 Methoden, hoher Composite/Business-Logic-Anteil). Die Haelfte aller Pages (11) sind EASY und in je 1 Tag migrierbar.

---

## Studie 5: CommonPage-Refactoring-Analyse

### Fragestellung

Wie modelliert man CommonPage im modernen Framework?

### Ist-Analyse (377 Zeilen)

CommonPage ist eine **reine Utility-Klasse** mit ZERO Page-Object-Charakter. Sie hat keinen Bezug zu einer bestimmten Seite der Anwendung.

### Methoden-Kategorien

| Kategorie | Methoden | Anteil |
|-----------|---------|:-:|
| **String-Formatierung** | `extractDossierName`, `capitalizeFirstLetter`, `reverseText` | 8% |
| **Datums-Manipulation** | `incrementDay`, `getDaysMinusOneFromDateString`, `extractAndFormatDate`, `convertToDDMMYYYY`, `modifyDate` | 25% |
| **Zahlen-Formatierung** | `normalizeNumber`, `normalizeNumberFR`, `formatNumber_Ger`, `formatNumber_Fre`, `formatNumber` | 25% |
| **AHV/IBAN-Formatierung** | `formatAhvNumber`, `formatIban` | 8% |
| **Datei-Upload** | `uploadFile`, `uploadFileWithApiWait`, `uploadMultipleFiles` | 15% |
| **API-Wait** | `waitForApiHelper` | 10% |
| **Browser-Refresh** | `reloadPage` | 5% |

### Architektur-Entscheidung

**CommonPage darf NICHT als PageObjectBase-Page migriert werden.** Sie muss aufgespalten werden:

| Neuer Service | Methoden | Ort |
|--------------|---------|-----|
| `DateHelper` (bereits vorhanden in @utils) | incrementDay, getDaysMinus, extractAndFormatDate, convertToDDMMYYYY, modifyDate | `libs/utils/helpers/DateHelper.ts` (erweitern) |
| `NumberFormatter` | normalizeNumber, normalizeNumberFR, formatNumber_Ger, formatNumber_Fre, formatNumber | `libs/core/services/number-formatter.ts` (neu) |
| `StringHelper` | extractDossierName, capitalizeFirstLetter, reverseText, formatAhvNumber, formatIban | `libs/core/services/string-helper.ts` (neu) |
| `FileUploadHelper` | uploadFile, uploadFileWithApiWait, uploadMultipleFiles | `libs/core/services/file-upload-helper.ts` (neu, Page-Parameter) |
| `ApiWaitHelper` | waitForApiHelper | In StabilityHelper integrieren oder separater Service |

### Ergebnis

CommonPage ist das groesste Refactoring-Risiko: **25 andere Pages importieren CommonPage**. Falsche Entscheidung hier multipliziert sich. Die Aufspaltung in fokussierte Services ist der einzig sinnvolle Weg.

**Migration:** Neue Services erstellen, alte CommonPage-Aufrufe schrittweise umstellen. CommonPage selbst bleibt fuer Legacy-Pages bestehen (Koexistenz-Prinzip).

---

## Studie 6: StabilityHelper-Nutzungsmuster

### Fragestellung

Wie wird StabilityHelper in der Praxis wirklich genutzt?

### Daten (201 Vorkommen in 34 Dateien)

| Methode | Aufrufe | Dateien | Durch Control abgedeckt? |
|---------|:-:|:-:|---|
| `stableClick()` | ~45 | 20 | Ja (Button.click) |
| `stableFill()` | ~35 | 18 | Ja (TextInput.fill) |
| `waitForAngularStable()` | ~25 | 15 | Ja (ControlBase intern) |
| `stableSelect()` | ~15 | 10 | Ja (Dropdown.selectByText) |
| `closeDialog()` / `closeDialogAsync()` | ~10 | 8 | Ja (PageObjectBase.closeDialog) |
| `waitForCondition()` | ~8 | 5 | **Teilweise** (ControlBase.waitFor) |
| `triggerAngularChangeDetection()` | ~5 | 3 | **Teilweise** (intern in Controls) |
| `forceAngularFormUpdate()` | ~3 | 2 | **Nein** -- spezieller Angular-Workaround |
| Diverse (retry, screenshot, etc.) | ~5 | 3 | Nein |

### Top-Nutzer

| Page | StabilityHelper-Aufrufe | Hauptmethoden |
|------|:-:|---|
| wsh-page | 35 | stableClick (15), stableFill (12), waitForAngular (8) |
| ph-page | 16 | stableClick (8), stableFill (5), stableSelect (3) |
| umfeld-page | 13 | stableClick (6), stableFill (4), waitForAngular (3) |
| rahmenbudget-page | 12 | stableClick (5), stableFill (4), closeDialog (3) |
| klientschaft-page | 10 | stableFill (5), stableClick (3), waitForAngular (2) |

### Abdeckungsanalyse

| Kategorie | Methoden | Controls-Abdeckung |
|-----------|---------|:-:|
| Standard-Interaktionen (stableClick, stableFill, stableSelect) | ~95 Aufrufe | **100%** abgedeckt |
| Warten/Stabilisierung (waitForAngular, waitForCondition) | ~33 Aufrufe | **90%** abgedeckt |
| Dialog (closeDialog) | ~10 Aufrufe | **100%** abgedeckt |
| Spezial (forceAngularFormUpdate, triggerChangeDetection) | ~8 Aufrufe | **~50%** abgedeckt |
| Sonstige (retry, screenshot) | ~5 Aufrufe | **0%** -- nicht Controls-relevant |

### Ergebnis

**~95% der StabilityHelper-Nutzung wird durch Controls abgedeckt.** Die verbleibenden ~5% sind:
- `forceAngularFormUpdate()` -- wird in 2 Pages benoetigt, sollte als `IStabilityService.forceFormUpdate()` verfuegbar sein
- `triggerAngularChangeDetection()` -- wird in 3 Pages benoetigt, intern in Controls eingebaut aber nicht direkt aufrufbar
- Retry/Screenshot -- nicht Control-relevant, bleiben als StabilityHelper-Methoden

**Empfehlung:** `IStabilityService` um `forceFormUpdate()` und `triggerChangeDetection()` erweitern, damit PageObjectBase diese direkt exponieren kann (ohne StabilityHelper direkt zu importieren).

---

## Studie 7: Test-Pattern-Validierung

### Status

AUSSTEHEND -- wird mit einem echten Functional UI Test validiert sobald Phase 3 beginnt.

---

## Zusammenfassung: Erkenntnisse fuer die Architektur

### Kritische Erkenntnisse

1. **Table ist das wichtigste fehlende Control** (88 Rollen-Matches in 24 Dateien) -- muss vor Phase 3 der grossen Pages priorisiert werden
2. **1/3 der Locators sind fragile CSS/XPath** -- bei Migration systematisch auf TestId/Role umstellen
3. **CommonPage muss aufgespalten werden** -- 25 Pages haengen davon ab, falsche Modellierung multipliziert sich
4. **StabilityHelper wird zu 95% durch Controls abgedeckt** -- Bestaetigung dass die Control-Architektur richtig ist
5. **Migrations-Reihenfolge bestaetigt** -- Bottom-Up: CommonPage-Services -> Leaf-Pages -> Hub-Pages -> Abhaengige Pages

### Korrekturen an der Roadmap

1. **Phase 4 (Neue Controls) muss teilweise VOR Phase 3 passieren:** Table und Tab werden in den meisten Phase-3-Pages benoetigt
2. **CommonPage-Refactoring ist Phase-3-Voraussetzung**, nicht Teil davon
3. **KlientschaftPage und DossierOpenPage koennen parallel migriert werden** (keine gegenseitigen Abhaengigkeiten)
4. **IStabilityService um 2 Methoden erweitern**: `forceFormUpdate()`, `triggerChangeDetection()`

---

## Verwandte Seiten

- [[externe-studien]] -- Externe Best-Practice-Studien
- [[architektur]] -- Framework-Architektur
- [[migration-roadmap]] -- Phasen-Plan
- [[ist-vs-soll]] -- Legacy vs Modern Vergleich
