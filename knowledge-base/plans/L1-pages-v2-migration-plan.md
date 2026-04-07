# L1: Alle Pages nach pages-v2 migrieren

> Erstellt: 2026-03-17 | Status: ENTWURF
> Ziel: Alle 30 verbleibenden Legacy-Pages aus `libs/pages/` als v2-Version in `libs/pages-v2/` erstellen.
> Prinzip: **Koexistenz** -- Legacy-Pages bleiben fuer Keywords erhalten. Rollback jederzeit moeglich.

---

## 1. Architektur-Entscheidungen

### 1.1 Koexistenz-Strategie (kein Breaking Change)

```
libs/pages/          <-- BLEIBT UNANGETASTET (Keywords nutzen diese weiter)
libs/pages-v2/       <-- Neue v2-Pages werden hier erstellt
libs/keywords/       <-- Importieren weiter aus libs/pages/ (KEIN Umbau)
staticTestcases/     <-- Neue Tests nutzen pages-v2, bestehende KV-Tests bleiben
```

**Warum:** Keywords (`libs/keywords/`) importieren direkt aus `libs/pages/`. Eine Aenderung dort wuerde ~67 KV-Tests und ~191 Keywords gefaehrden. Stattdessen erstellen wir parallele v2-Pages. Neue Acceptance/FUI-Tests nutzen pages-v2; Legacy-KV-Tests bleiben stabil.

### 1.2 Rollback-Strategie

Falls eine v2-Page auf dem Server flaky wird:

1. **Sofort-Rollback im Test**: Import von `@libs/pages-v2` auf `@pages/` aendern -- eine Zeile pro Test
2. **Feature-Flag Pattern** (optional):
   ```typescript
   // In test-fixtures.ts oder einem shared-helper
   const USE_V2_PAGES = process.env.USE_V2_PAGES !== "false"; // Default: true

   // Im Test:
   const dossierPage = USE_V2_PAGES
     ? new DossierPageV2(page, services)
     : new DossierOpenPage(page);
   ```
3. **Git-Revert**: Jede Wave ist ein eigener Commit -> `git revert` einer ganzen Wave moeglich

**Empfehlung:** Option 1 (Import-Swap) ist am einfachsten. Option 2 nur bei systematischer Flakiness.

### 1.3 Verifikations-Strategie

Nach **jeder Wave**:
1. `npm run typecheck` -- TypeScript-Kompilierung pruefen
2. Bestehende KV-Tests laufen lassen (Smoke-Subset) -- Legacy darf nicht brechen
3. Einen Referenz-Test mit der neuen v2-Page schreiben und ausfuehren
4. Bei Fehler: Wave nicht committen, Problem analysieren

```bash
# Typecheck nach jeder Wave
npm run typecheck 2>&1 | tee test-results/pw-output.txt; echo "EXIT:$?"

# KV Smoke-Tests (Legacy) -- duerfen nicht brechen
npx playwright test --grep @smoke --config=playwright.kv.config.ts --headed --workers 1 2>&1 | tee test-results/pw-output.txt; echo "EXIT:$?"

# Neuen v2-Referenztest ausfuehren
npx playwright test staticTestcases/FunctionalUI/<wave-test>.spec.ts --headed --workers 1 2>&1 | tee test-results/pw-output.txt; echo "EXIT:$?"
```

---

## 2. Inventar: Alle Pages zu migrieren

### Bereits migriert (2/33)

| # | Legacy Page | v2 Page | Status |
|---|-------------|---------|--------|
| - | `login-page.ts` (LoginPage) | `pages-v2/login-page.ts` | DONE |
| - | `navigation-page.ts` (NavigationPage) | `pages-v2/navigation-page.ts` | DONE |

### Nicht zu migrieren (1/33)

| # | Datei | Grund |
|---|-------|-------|
| - | `base-page.ts` (BasePage) | Ist die Legacy-Basisklasse, wird durch `PageObjectBase` ersetzt |

### Zu migrieren (30 Pages)

| # | Legacy Datei | Klasse | Keyword-Abhaengigkeit | Prioritaet |
|---|-------------|--------|----------------------|------------|
| 1 | `common-page.ts` | CommonPage | common-keyword | HOCH |
| 2 | `openDossier-page.ts` | DossierOpenPage | common-keyword, dossier-keyword | HOCH |
| 3 | `dossierubersicht-page.ts` | DossierubersichtPage | -- | HOCH |
| 4 | `klientschaft-page.ts` | KlientschaftPage | klientshaft-keyword | HOCH |
| 5 | `bedarfsprufung-page.ts` | BedarfsprufungPage | bedarfsprufung-keyword, buchhaltung-keyword, bewilligungen-keyword | HOCH |
| 6 | `rahmenbudget-page.ts` | RahmenbudgetPage | rahmenbudget-keyword, buchhaltung-keyword, zahlungen-keyword, document-keyword | HOCH |
| 7 | `bewilligungenWorkflows-page.ts` | BewilligungenWorkflowsPage | bewilligungen-keyword | HOCH |
| 8 | `wohnsituation-page.ts` | WohnSituationPage | wohnsituation-keyword, common-keyword, dossier-keyword | MITTEL |
| 9 | `document-page.ts` | DocumentPage | document-keyword, vorlagen-keyword | MITTEL |
| 10 | `zahlungen-page.ts` | ZahlungenPage | zahlungen-keyword | MITTEL |
| 11 | `buchhaltung-page.ts` | BuchhaltungPage | buchhaltung-keyword | MITTEL |
| 12 | `kontoauszug-page.ts` | KontoauszugPage | kontoauszug-keyword, wsh-keyword | MITTEL |
| 13 | `dossierprufung-page.ts` | DossierprufungPage | dossierprufung-keyword | MITTEL |
| 14 | `anspruchsprufung-page.ts` | AnspruchsprufungPage | -- | MITTEL |
| 15 | `aufgaben-page.ts` | AufgabenPage | aufgaben-keyword | MITTEL |
| 16 | `umfeld-page.ts` | umfeldPage | umfeld-keyword | MITTEL |
| 17 | `microsoftlogin-page.ts` | MicrosoftLoginPage | common-keyword | MITTEL |
| 18 | `wsh-page.ts` | WSHPage | wsh-keyword, zahlungen-keyword | MITTEL |
| 19 | `rechnung-page.ts` | RechnungPage | erfassung-keyword | MITTEL |
| 20 | `erfassung-page.ts` | ErfassungPage | erfassung-keyword | MITTEL |
| 21 | `buchungsJournal-page.ts` | BuchungsJournalPage | buchungsJournal-keyword | MITTEL |
| 22 | `freiwillige-page.ts` | FreiwilligePage | freiwillige-keyword, erfassung-keyword | MITTEL |
| 23 | `ph-page.ts` | PHPage | ph-keyword, kontoauszug-keyword | MITTEL |
| 24 | `wirtschaftlicheSozialhilfe-page.ts` | WirtschaftlicheSozialhilfePage | wirtschaftlicheSozialhilfe-keyword | NIEDRIG |
| 25 | `RV-page.ts` | RVPage | RV-keyword | NIEDRIG |
| 26 | `vorlagenErafassen-page.ts` | VorlagenErafassenPage | vorlagen-keyword | NIEDRIG |
| 27 | `databrowser-page.ts` | DataBrowserPage | dataBrowser-keyword | NIEDRIG |
| 28 | `institutionenstamm-page.ts` | InstitutionenstammPage | institutionenstamm-keyword | NIEDRIG |
| 29 | `konfig-page.ts` | KonfigPage | konfig-keyword | NIEDRIG |
| 30 | `zieterfassung-page.ts` | ZieterfassungPage | zieterfassung-keyword | NIEDRIG |

---

## 3. Migrations-Waves

### Migrations-Muster pro Page

```
1. Legacy-Page lesen und verstehen (Methoden, Locatoren, Logik)
2. v2-Page erstellen:
   - extends PageObjectBase
   - Controls als readonly Properties (IButton, ITextInput, IDropdown, ...)
   - Factory-Methoden (this.button(), this.textInput(), ...)
   - Kein direktes Playwright in der Page
   - constructor(page, services?) mit ServiceContext.for(page) Default
3. Export in pages-v2/index.ts ergaenzen
4. Typecheck: npm run typecheck
5. Mini-Test schreiben oder bestehenden Test anpassen
```

---

### Wave 1: Dossier-Kern (BLOCKER)
**Aufwand:** ~4-5h | **Commit:** `feat(pages-v2): wave-1 dossier-kern`

| # | v2-Page | Migriert von | Schwerpunkt |
|---|---------|-------------|-------------|
| 1 | `CommonPage` | `common-page.ts` | Generische UI-Helfer (Dialoge, Toasts, Tabs, Speichern) |
| 2 | `DossierOpenPage` | `openDossier-page.ts` | Dossier-Eroeffnung, -Suche, Person-Auswahl |
| 3 | `DossierubersichtPage` | `dossierubersicht-page.ts` | Dossier-Details, Sidebar, Status |

**Verifikation Wave 1:**
- [ ] `npm run typecheck` -- PASS
- [ ] KV Smoke-Tests (`--grep @smoke`) -- PASS (Legacy nicht gebrochen)
- [ ] Referenz-Test: `FUI_DossierOpen_Validierung.spec.ts` -- Dossier oeffnen und Uebersicht pruefen

---

### Wave 2: Klient & Bedarfspruefung
**Aufwand:** ~4-5h | **Commit:** `feat(pages-v2): wave-2 klient-bedarfspruefung`

| # | v2-Page | Migriert von | Schwerpunkt |
|---|---------|-------------|-------------|
| 4 | `KlientschaftPage` | `klientschaft-page.ts` | Tabs (Erwerbssituation, Einnahmen, Versicherungen), Formulare |
| 5 | `BedarfsprufungPage` | `bedarfsprufung-page.ts` | Anspruchspruefung, Bedarfsberechnung, Positionen |
| 6 | `AnspruchsprufungPage` | `anspruchsprufung-page.ts` | Anspruchskriterien, Validierungen |

**Verifikation Wave 2:**
- [ ] `npm run typecheck` -- PASS
- [ ] KV Smoke-Tests -- PASS
- [ ] Referenz-Test: `FUI_Klientschaft_Formular.spec.ts` -- Klientschaft-Formular oeffnen, Felder pruefen
- [ ] Referenz-Test: `AT_Bedarfspruefung_Basis.spec.ts` -- Dossier (API) -> Bedarfspruefung via v2-Page

---

### Wave 3: Rahmenbudget & Finanzen
**Aufwand:** ~5-6h | **Commit:** `feat(pages-v2): wave-3 rahmenbudget-finanzen`

| # | v2-Page | Migriert von | Schwerpunkt |
|---|---------|-------------|-------------|
| 7 | `RahmenbudgetPage` | `rahmenbudget-page.ts` | Spalten, Positionen, Monatsbudget, Table-Controls |
| 8 | `BuchhaltungPage` | `buchhaltung-page.ts` | Konten, Buchungen, Filter |
| 9 | `BuchungsJournalPage` | `buchungsJournal-page.ts` | Journal-Eintraege, Suche, Filter |
| 10 | `KontoauszugPage` | `kontoauszug-page.ts` | Kontoauszug-Ansicht, Positionen, Drucken |

**Verifikation Wave 3:**
- [ ] `npm run typecheck` -- PASS
- [ ] KV Smoke-Tests -- PASS
- [ ] Referenz-Test: `FUI_Rahmenbudget_Spalten.spec.ts` -- Rahmenbudget oeffnen, Spalten/Positionen pruefen

---

### Wave 4: Bewilligung & Pruefung
**Aufwand:** ~3-4h | **Commit:** `feat(pages-v2): wave-4 bewilligung-pruefung`

| # | v2-Page | Migriert von | Schwerpunkt |
|---|---------|-------------|-------------|
| 11 | `BewilligungenWorkflowsPage` | `bewilligungenWorkflows-page.ts` | Workflow-Steps, Genehmigung, Ablehnung |
| 12 | `DossierprufungPage` | `dossierprufung-page.ts` | Pruefung zuweisen, Pruefergebnis, Kommentare |

**Verifikation Wave 4:**
- [ ] `npm run typecheck` -- PASS
- [ ] KV Smoke-Tests -- PASS
- [ ] Referenz-Test: `AT_Bewilligung_Workflow.spec.ts` -- Dossier (API) -> Bewilligung via v2-Page

---

### Wave 5: Zahlungen & Rechnungen
**Aufwand:** ~4-5h | **Commit:** `feat(pages-v2): wave-5 zahlungen-rechnungen`

| # | v2-Page | Migriert von | Schwerpunkt |
|---|---------|-------------|-------------|
| 13 | `ZahlungenPage` | `zahlungen-page.ts` | Zahlungslauf, Auszahlungen, Stornierung |
| 14 | `RechnungPage` | `rechnung-page.ts` | Rechnungserfassung, Belege |
| 15 | `ErfassungPage` | `erfassung-page.ts` | Manuelle Erfassung, Formular-Wizard |

**Verifikation Wave 5:**
- [ ] `npm run typecheck` -- PASS
- [ ] KV Smoke-Tests -- PASS
- [ ] Referenz-Test: `FUI_Zahlungen_Uebersicht.spec.ts`

---

### Wave 6: Dokumente & Wohnsituation
**Aufwand:** ~4-5h | **Commit:** `feat(pages-v2): wave-6 dokumente-wohnsituation`

| # | v2-Page | Migriert von | Schwerpunkt |
|---|---------|-------------|-------------|
| 16 | `DocumentPage` | `document-page.ts` | Upload, Vorlagen, Dokumentenliste, Filter |
| 17 | `VorlagenErafassenPage` | `vorlagenErafassen-page.ts` | Vorlagen erstellen/bearbeiten |
| 18 | `WohnSituationPage` | `wohnsituation-page.ts` | Haushalt, Adresse, Mietkosten |

**Verifikation Wave 6:**
- [ ] `npm run typecheck` -- PASS
- [ ] KV Smoke-Tests -- PASS
- [ ] Referenz-Test: `FUI_Dokumente_Upload.spec.ts`

---

### Wave 7: Umfeld & Soziales
**Aufwand:** ~3-4h | **Commit:** `feat(pages-v2): wave-7 umfeld-soziales`

| # | v2-Page | Migriert von | Schwerpunkt |
|---|---------|-------------|-------------|
| 19 | `UmfeldPage` | `umfeld-page.ts` | Bezugspersonen, Institutionen |
| 20 | `FreiwilligePage` | `freiwillige-page.ts` | Freiwillige Leistungen |
| 21 | `AufgabenPage` | `aufgaben-page.ts` | Aufgaben erstellen, zuweisen, abschliessen |

**Verifikation Wave 7:**
- [ ] `npm run typecheck` -- PASS
- [ ] KV Smoke-Tests -- PASS
- [ ] Referenz-Test: `FUI_Aufgaben_Erstellen.spec.ts`

---

### Wave 8: WSH & Spezial-Fachbereiche
**Aufwand:** ~4-5h | **Commit:** `feat(pages-v2): wave-8 wsh-spezial`

| # | v2-Page | Migriert von | Schwerpunkt |
|---|---------|-------------|-------------|
| 22 | `WSHPage` | `wsh-page.ts` | Wirtschaftliche Sozialhilfe Detailansicht |
| 23 | `WirtschaftlicheSozialhilfePage` | `wirtschaftlicheSozialhilfe-page.ts` | WSH-Uebersicht |
| 24 | `PHPage` | `ph-page.ts` | Persoenliche Hilfe |
| 25 | `RVPage` | `RV-page.ts` | Rechtsverfolgung (Beschwerden, Auflagen) |

**Verifikation Wave 8:**
- [ ] `npm run typecheck` -- PASS
- [ ] KV Smoke-Tests -- PASS

---

### Wave 9: Infrastruktur & Admin
**Aufwand:** ~3-4h | **Commit:** `feat(pages-v2): wave-9 infrastruktur-admin`

| # | v2-Page | Migriert von | Schwerpunkt |
|---|---------|-------------|-------------|
| 26 | `MicrosoftLoginPage` | `microsoftlogin-page.ts` | MS-Login spezifisch (evtl. in LoginPage-v2 mergen) |
| 27 | `DataBrowserPage` | `databrowser-page.ts` | Daten-Explorer, Filter, Export |
| 28 | `InstitutionenstammPage` | `institutionenstamm-page.ts` | Stammdaten Institutionen |
| 29 | `KonfigPage` | `konfig-page.ts` | System-Konfiguration |
| 30 | `ZieterfassungPage` | `zieterfassung-page.ts` | Zeiterfassung |

**Verifikation Wave 9:**
- [ ] `npm run typecheck` -- PASS
- [ ] KV Smoke-Tests -- PASS
- [ ] **Gesamtlauf:** Alle FUI + Acceptance Tests mit v2-Pages

---

## 4. Rollback-Checkliste pro Wave

Wenn ein v2-Page-Test auf dem Server flaky wird:

```
1. SOFORT: Test-Import auf Legacy-Page umstellen
   - import { DossierOpenPage } from "@pages/openDossier-page";
   + import { DossierOpenPage } from "@libs/pages-v2";
   (oder umgekehrt zurueck)

2. ANALYSE: Warum flaky?
   - Locator-Problem? -> v2-Page fixen
   - Timing-Problem? -> waitForPageReady() / StabilityHelper pruefen
   - Angular-spezifisch? -> waitForAngularStable() ergaenzen

3. ENTSCHEIDUNG:
   - Fix moeglich -> v2-Page fixen, Test zurueck auf v2
   - Systematisch -> Feature-Flag einfuehren (USE_V2_PAGES env var)
   - Unlösbar -> v2-Page fuer diesen Bereich zurueckstellen
```

---

## 5. Qualitaets-Gates

### Gate 1: Nach Wave 1-2 (Basis)
- [ ] Typecheck OK
- [ ] KV Smoke-Tests PASS
- [ ] Mindestens 2 FUI-Tests mit v2-Pages PASS
- [ ] **Entscheidung:** Weitermachen oder Kurs-Korrektur?

### Gate 2: Nach Wave 3-5 (Finanzen komplett)
- [ ] Typecheck OK
- [ ] KV Smoke-Tests PASS
- [ ] Mindestens 1 Acceptance-Test (Dossier -> Bedarfspruefung -> Bewilligung) PASS
- [ ] Pipeline-Lauf auf Azure: Keine Regression
- [ ] **Entscheidung:** Weitermachen oder Stabilisieren?

### Gate 3: Nach Wave 6-9 (Alles migriert)
- [ ] Typecheck OK
- [ ] ALLE KV-Tests PASS (nicht nur Smoke)
- [ ] Alle FUI + Acceptance Tests PASS
- [ ] Azure Pipeline: Gruenes Build
- [ ] **Definition of Done erreicht**

---

## 6. Migrations-Regeln (fuer Agenten)

### MUSS-Regeln pro Page

1. **Legacy-Page zuerst lesen** -- Alle Methoden und Locatoren verstehen
2. **1:1 Method-Mapping** -- Jede oeffentliche Methode der Legacy-Page muss in v2 existieren
3. **Locatoren modernisieren** -- `data-testid` bevorzugen, CSS-Selektoren nur als Fallback
4. **Controls statt Locator** -- Kein `page.locator()` in der v2-Page
5. **Export in index.ts** -- Sofort nach Erstellung
6. **Namenskonvention**:
   - Datei: `kebab-case.ts` (z.B. `dossier-open-page.ts`)
   - Klasse: `PascalCase` (z.B. `DossierOpenPage`)
   - Methoden: `camelCase` ohne Async-Suffix

### DARF-NICHT-Regeln

1. **Legacy-Pages NICHT aendern** -- Keywords haengen davon ab
2. **Keywords NICHT umstellen** -- Bleiben auf Legacy
3. **Bestehende KV-Tests NICHT aendern** -- Nur neue Tests nutzen v2

---

## 7. Aufwands-Schaetzung

| Wave | Beschreibung | Pages | Aufwand | Kumulativ |
|------|-------------|-------|---------|-----------|
| Wave 1 | Dossier-Kern | 3 | ~4-5h | ~5h |
| Wave 2 | Klient & Bedarfspruefung | 3 | ~4-5h | ~10h |
| Wave 3 | Rahmenbudget & Finanzen | 4 | ~5-6h | ~16h |
| Wave 4 | Bewilligung & Pruefung | 2 | ~3-4h | ~20h |
| Wave 5 | Zahlungen & Rechnungen | 3 | ~4-5h | ~25h |
| Wave 6 | Dokumente & Wohnsituation | 3 | ~4-5h | ~30h |
| Wave 7 | Umfeld & Soziales | 3 | ~3-4h | ~34h |
| Wave 8 | WSH & Spezial | 4 | ~4-5h | ~39h |
| Wave 9 | Infrastruktur & Admin | 5 | ~3-4h | ~43h |
| **Total** | | **30** | **~35-43h** | **~5-6 Arbeitstage** |

---

## 8. Definition of Done

- [ ] Alle 30 Legacy-Pages haben ein v2-Aequivalent in `libs/pages-v2/`
- [ ] Alle v2-Pages sind in `libs/pages-v2/index.ts` exportiert
- [ ] `npm run typecheck` fehlerfrei
- [ ] Alle bestehenden KV-Tests laufen weiterhin (keine Regression)
- [ ] Mindestens 5 FunctionalUI-Tests nutzen ausschliesslich v2-Pages
- [ ] Mindestens 2 Acceptance-Tests nutzen v2-Pages
- [ ] Azure Pipeline: Gruenes Build mit v2-Pages
- [ ] Rollback-Verfahren dokumentiert und getestet

---

## 9. Abhaengigkeiten zum Gesamtplan

| Dieser Plan | Abhaengigkeit zu `framework-completion-plan.md` |
|-------------|------------------------------------------------|
| Wave 1-2 | Erledigt Phase 1 (1.1-1.4) des Gesamtplans |
| Wave 4 | Erledigt Phase 1.5 (BewilligungPage) des Gesamtplans |
| Wave 3 | Voraussetzung fuer Phase 2.2 (AT_Rahmenbudget) |
| Wave 1-4 | Voraussetzung fuer Phase 2.1 (AT_Dossier_Komplett_Flow) |
| Alle Waves | Grundlage fuer Phase 4 (Weitere Pages nach Bedarf) -- entfaellt dann |

---

## Verwandte Seiten

- [[framework-completion-plan]] -- Uebergeordneter Plan (L1-L6)
- [[../09-Modernes-Framework/neue-page-erstellen]] -- Step-by-Step Anleitung fuer v2-Pages
- [[../agent-bundles/modern-framework-bundle]] -- Templates und Controls-Referenz
- [[../09-Modernes-Framework/ist-vs-soll]] -- Koexistenz-Strategie
