# Framework-Completion Plan: Acceptance Tests & Functional UI Tests

> Erstellt: 2026-03-16 | Status: ENTWURF
> Ziel: Framework so weit komplettieren, dass andere Teammitglieder eigenstaendig Acceptance-Tests und Functional UI-Tests schreiben koennen.

---

## 1. Ist-Analyse (Zusammenfassung)

### Was bereits vorhanden ist

| Bereich | Status | Details |
|---------|--------|---------|
| **Modernes Framework (Core)** | SOLIDE | `PageObjectBase`, 8 Control-Typen (Button, TextInput, Dropdown, Checkbox, DatePicker, Link, Table, Tab), Interfaces, ServiceContext, StabilityHelper |
| **Pages-v2** | MINIMAL | Nur 2 von ~33 Pages migriert: `LoginPage`, `NavigationPage` |
| **Test-Fixtures** | GUT | `seed`, `authenticatedRequest`, `stabilityHelper`, `services` -- alles vorhanden |
| **API-Workflows** | GUT | Dossier-Erstellung, Bedarfspruefung, Erwerbssituation, Bewilligungsworkflow -- alles via API moeglich |
| **Playwright Configs** | VOLLSTAENDIG | `playwright.acceptance.config.ts`, `playwright.functional-ui.config.ts` + lokale Varianten + Azure-Integration |
| **Keyword-Layer (Legacy)** | STARK | ~191 Keywords, ~144 aktiv getestet, 28 Keyword-Dateien |
| **Knowledge Base** | UMFANGREICH | Architektur-Docs, Keyword-Referenz, Patterns, Templates, Debugging-Guides |
| **Bestehende Tests** | UNBALANCIERT | 67 KV-Tests, 1 Journey-Test, 1 Acceptance-Test, 2 FunctionalUI-Tests |

### Identifizierte Luecken

| #   | Luecke                                                                                                                | Schwere  | Auswirkung                               |
| --- | --------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------- |
| L1  | **Nur 2 Pages in pages-v2** -- Teammitglieder koennen keine modernen Acceptance/FUI-Tests fuer Fachbereiche schreiben | KRITISCH | Blockiert neue Tests komplett            |
| L2  | **Keine Beispiel-Acceptance-Tests mit pages-v2** -- Der einzige AT nutzt Legacy-Keywords                              | HOCH     | Kein Referenz-Muster fuer Teammitglieder |
| L3  | **Keine Dossier-Page in pages-v2** -- Fast jeder Test braucht Dossier-Interaktion                                     | HOCH     | Grundlegende Flows nicht moeglich        |
| L4  | **Kein Onboarding-Guide fuer Teammitglieder** -- Wissen nur in KB verstreut                                           | MITTEL   | Lange Einarbeitungszeit                  |
| L5  | **Fehlende npm-Scripts fuer AT/FUI** -- Teammitglieder muessen Config-Pfade kennen                                    | NIEDRIG  | UX-Problem, kein Blocker                 |
| L6  | **FunctionalUI-Tests nutzen dev.aventis.swiss als Default** -- Abweichend von QA                                      | NIEDRIG  | Verwirrend bei lokalem Ausfuehren        |

---

## 2. Priorisierte Massnahmen

### Phase 1: Kern-Pages fuer pages-v2 (BLOCKER BESEITIGEN)

> Ohne diese Pages koennen keine fachlichen Acceptance-Tests geschrieben werden.

#### 1.1 DossierPage-v2 erstellen
- **Was**: Page Object fuer Dossier-Eroeffnung, -Suche, -Navigation
- **Warum**: Jeder Test beginnt mit einem Dossier
- **Quelle**: Migration von `libs/pages/openDossier-page.ts` + `libs/pages/dossierubersicht-page.ts`
- **Controls**: Suchfeld, Ergebnisliste, Dossier-Tabs, Filter
- **Aufwand**: ~2h

#### 1.2 KlientschaftPage-v2 erstellen
- **Was**: Page Object fuer Klientschaft (Erwerbssituation, Einnahmen, Versicherungen)
- **Warum**: Zentral fuer Bedarfspruefung und Rahmenbudget-Tests
- **Quelle**: Migration von `libs/pages/klientschaft-page.ts`
- **Controls**: Tabs, Formulare, Dropdowns, DatePicker
- **Aufwand**: ~3h

#### 1.3 RahmenbudgetPage-v2 erstellen
- **Was**: Page Object fuer Rahmenbudget (Spalten, Positionen, Monatsbudget)
- **Warum**: Business-kritischer Bereich mit vielen offenen Test-Cases
- **Quelle**: Migration von `libs/pages/rahmenbudget-page.ts`
- **Vorlage**: Bereits in `knowledge-base/09-Modernes-Framework/neue-page-erstellen.md` beschrieben
- **Aufwand**: ~3h

#### 1.4 BedarfspruefungPage-v2 erstellen
- **Was**: Page Object fuer Anspruchspruefung / Bedarfspruefung
- **Warum**: Kernprozess der Sozialhilfe
- **Quelle**: Migration von `libs/pages/bedarfsprufung-page.ts`
- **Aufwand**: ~2h

#### 1.5 BewilligungPage-v2 erstellen
- **Was**: Page Object fuer Bewilligungsworkflows
- **Warum**: Alle Prozesse muessen bewilligt werden
- **Quelle**: Migration von `libs/pages/bewilligungenWorkflows-page.ts`
- **Aufwand**: ~2h

**Phase 1 Total: ~12h**

---

### Phase 2: Referenz-Tests erstellen (MUSTER SETZEN)

> Teammitglieder brauchen kopierbare Beispiele fuer beide Test-Typen.

#### 2.1 Acceptance-Test Referenz: AT_Dossier_Komplett_Flow
- **Was**: Ein Acceptance-Test der den Kern-Flow abdeckt: Dossier erstellen (API) -> Klient erfassen -> Bedarfspruefung -> Bewilligung
- **Muster**: Nutzt ausschliesslich pages-v2 + API-Workflows
- **Tags**: `@acceptance`, `@all`
- **Datei**: `staticTestcases/Acceptance/AT_Dossier_Bedarfspruefung_Bewilligung.spec.ts`
- **Aufwand**: ~3h

#### 2.2 Acceptance-Test Referenz: AT_Rahmenbudget_Positionen
- **Was**: Rahmenbudget-Positionen erstellen und pruefen
- **Muster**: API-Setup + pages-v2 Validierung
- **Tags**: `@acceptance`, `@rahmenbudget`, `@all`
- **Datei**: `staticTestcases/Acceptance/AT_Rahmenbudget_Positionen_Pruefen.spec.ts`
- **Aufwand**: ~2h

#### 2.3 FunctionalUI-Test Referenz: FUI_Dossier_Search_Validation
- **Was**: Dossier-Suche UI-Validierung (Suchfeld, Ergebnisse, Filter, Navigation)
- **Muster**: Rein UI-fokussiert, keine Business-Logik
- **Tags**: `@functionalUI`
- **Datei**: `staticTestcases/FunctionalUI/DossierSearch_UIValidation.spec.ts`
- **Aufwand**: ~2h

#### 2.4 FunctionalUI-Test Referenz: FUI_Formular_Validierung
- **Was**: Formular-Validierung (Pflichtfelder, Fehlermeldungen, Speichern-Button-State)
- **Muster**: Generisches UI-Pattern, wiederverwendbar
- **Tags**: `@functionalUI`
- **Datei**: `staticTestcases/FunctionalUI/Formular_Validierung_Pflichtfelder.spec.ts`
- **Aufwand**: ~2h

**Phase 2 Total: ~9h**

---

### Phase 3: Onboarding & Developer Experience

#### 3.1 Onboarding-Guide fuer Teammitglieder erstellen
- **Was**: Eine Markdown-Datei mit:
  - Projektstruktur-Uebersicht (welche Ordner, was ist wo)
  - "Mein erster Test" -- Schritt-fuer-Schritt-Anleitung
  - Entscheidungsbaum: Wann Acceptance vs FunctionalUI vs Keyword-Validation
  - Verfuegbare API-Workflows und wann sie einsetzen
  - Haeufige Fehler und Loesungen
- **Datei**: `knowledge-base/00-ONBOARDING.md`
- **Aufwand**: ~2h

#### 3.2 Test-Typ-Entscheidungsbaum dokumentieren
- **Was**: Klare Definition wann welcher Test-Typ

```
Acceptance Test (@acceptance)
  - Prueft einen Geschaeftsprozess Ende-zu-Ende
  - Setup via API, Validierung via UI (pages-v2)
  - Beispiel: "Dossier erstellen -> Bedarfspruefung -> Bewilligung -> Zahlung"

Functional UI Test (@functionalUI)
  - Prueft UI-Verhalten isoliert
  - Keine Business-Logik, nur Interaktion + Validierung
  - Beispiel: "Navigation funktioniert", "Formular zeigt Pflichtfeld-Fehler"

Keyword Validation Test (@keywordValidation)
  - Prueft einzelne Keywords (bestehender Legacy-Ansatz)
  - Nutzt Keywords + Legacy-Pages
  - Beispiel: "R06 Spalten ein/ausblenden"
```

- **Aufwand**: ~1h

#### 3.3 npm-Scripts hinzufuegen
- **Was**: Bequeme Scripts in `package.json`:
  ```json
  "test:acceptance": "npx playwright test --config=playwright.acceptance-local.config.ts",
  "test:functional-ui": "npx playwright test --config=playwright.functional-ui-local.config.ts",
  "test:acceptance:headed": "npx playwright test --config=playwright.acceptance-local.config.ts --headed --workers 1"
  ```
- **Aufwand**: ~15min

**Phase 3 Total: ~3.5h**

---

### Phase 4: Weitere Pages nach Bedarf (OPTIONAL / LAUFEND)

Diese Pages werden erst erstellt wenn konkrete Tests sie benoetigen:

| Page | Fachbereich | Prioritaet |
|------|-------------|-----------|
| DokumentePage-v2 | Dokumentenverwaltung | HOCH (viele offene Test-Cases) |
| ZahlungenPage-v2 | Zahlungen & Kontoauszug | HOCH |
| WohnsituationPage-v2 | Wohnsituation & Haushalt | MITTEL |
| UmfeldPage-v2 | Bezugspersonen & Institutionen | MITTEL |
| AufgabenPage-v2 | Aufgaben & Journal | MITTEL |
| RechtsverfolgungPage-v2 | Beschwerden & Auflagen | NIEDRIG |

**Regel: Neue Page nur erstellen wenn ein konkreter Test sie benoetigt -- nicht auf Vorrat.**

---

## 3. Zusammenfassung & Timeline

| Phase | Beschreibung | Aufwand | Ergebnis |
|-------|-------------|---------|----------|
| **Phase 1** | 5 Kern-Pages in pages-v2 | ~12h | Teammitglieder koennen Fachbereichs-Tests schreiben |
| **Phase 2** | 4 Referenz-Tests (2 AT + 2 FUI) | ~9h | Kopierbare Muster fuer beide Test-Typen |
| **Phase 3** | Onboarding + DX | ~3.5h | Teammitglieder koennen sich selbst einarbeiten |
| **Phase 4** | Weitere Pages nach Bedarf | Laufend | Organisches Wachstum |

**Gesamt Phase 1-3: ~24.5h (ca. 3-4 Arbeitstage)**

---

## 4. Definition of Done

Das Framework ist "bereit fuer das Team" wenn:

- [ ] Mindestens 5 Kern-Pages in `libs/pages-v2/` existieren (Login, Navigation, Dossier, Klientschaft, Rahmenbudget)
- [ ] Mindestens 2 Acceptance-Tests mit `@acceptance` Tag laufen stabil
- [ ] Mindestens 3 FunctionalUI-Tests mit `@functionalUI` Tag laufen stabil
- [ ] Ein Onboarding-Guide existiert mit "Mein erster Test"-Anleitung
- [ ] npm-Scripts fuer lokale Ausfuehrung beider Test-Typen existieren
- [ ] Alle Referenz-Tests in der Pipeline (Azure) erfolgreich durchlaufen

---

## 5. Was bereits NICHT fehlt (Staerken)

Diese Bereiche sind solid und benoetigen keine Arbeit:

1. **Core-Framework** (`libs/core/`): Interfaces, Controls, Services, Exceptions -- alles implementiert
2. **API-Workflows**: Schnelles Testdaten-Setup vorhanden
3. **Test-Fixtures**: `seed`, `authenticatedRequest`, `services` -- alles da
4. **Playwright-Configs**: Acceptance + FunctionalUI Configs fuer Azure und lokal vorhanden
5. **Knowledge Base**: Umfangreiche Dokumentation zu Architektur, Keywords, Patterns
6. **Keyword-Layer**: 144 aktiv getestete Keywords als Business-Logik-Referenz
7. **CI/CD**: Azure DevOps Integration mit ADO-Reporter konfiguriert

---

## Verwandte Seiten

- [[ist-vs-soll]] -- Ist-Zustand vs Soll-Zustand des Frameworks
- [[neue-page-erstellen]] -- Anleitung: Neue Page in pages-v2 erstellen
- [[migration-roadmap]] -- Phasen-Plan fuer die Framework-Migration
- [[test-template]] -- Kanonische Teststruktur
- [[api-setup-patterns]] -- API-Workflow-Methoden
- [[coverage-matrix]] -- Keyword-zu-Test Zuordnung
- [[missing-keywords]] -- Nicht getestete Keywords
