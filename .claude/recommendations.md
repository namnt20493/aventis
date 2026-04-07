# Claude Code Empfehlungen -- Aventis Playwright

Analyse vom 16.03.2026. Basierend auf vollständigem Projekt-Scan.

## Bestandsaufnahme

### Agents (5x in `.claude/agents/`)

| Agent | Zweck | Model |
|-------|-------|-------|
| `aventis-e2e-test-agent` | Neue Tests/Keywords/Pages erstellen | sonnet |
| `test-healer-agent` | Failing/WIP Tests fixen | sonnet |
| `test-planner-agent` | Journey-Design, ADO Test Cases, Coverage | sonnet |
| `mcp-browser-agent` | Interaktive Browser-Automation via MCP | sonnet |
| `perf-optimizer-agent` | Workarounds entfernen, Performance | sonnet |

### Commands (2x in `.claude/commands/`)

| Command | Zweck |
|---------|-------|
| `/migrate-to-basepage` | Page Object zu BasePage migrieren |
| `/project-reflection` | Session-Analyse, Memory/KB aktualisieren |

### MCP Server (2x in `.claude/mcp.json`)

| Server | Zweck |
|--------|-------|
| `playwright` | Browser-Automation via MCP |
| `azure-devops` | ADO Work Items, Test Plans, Repos |

### Knowledge Base Bundles (3x in `knowledge-base/agent-bundles/`)

| Bundle | Zweck |
|--------|-------|
| `create-test-bundle.md` | Template + Checkliste fuer neue KV-Tests |
| `fix-test-bundle.md` | Diagnose + Fix-Workflow |
| `modern-framework-bundle.md` | PageObjectBase + Controls Architektur |

---

## Empfehlungen: Neue Commands

### Prioritaet 1 -- Hoher Alltagsnutzen

#### 1. `/run-test` Command

Kapselt das MANDATORY Single-Run-Pattern aus CLAUDE.md. Verhindert doppelte Ausfuehrungen und vergessene `tee`-Redirects.

```
Nutzung: /run-test staticTestcases/Keywordvalidation/Dossier/DO12_Zustaendigkeit.spec.ts
```

Implementierung:

- Argument: Spec-Dateipfad (required)
- Fuehrt aus: `npx playwright test <spec> --headed --workers 1 2>&1 | tee test-results/pw-output.txt; echo "EXIT:$?"`
- Bei EXIT:0 -> Meldung "Test bestanden"
- Bei EXIT:1 -> Automatisch `grep -B2 -A15 "Error\|FAILED\|Timeout\|expect(" test-results/pw-output.txt`
- Aufwand: Klein

#### 2. `/keyword-lookup` Command

Schnelle Keyword-Recherche: Grep in `libs/keywords/*.ts`, Parameter-Extraktion, Test-Existenz-Check.

```
Nutzung: /keyword-lookup DO12
```

Implementierung:

- Argument: Keyword-Name oder Teilstring (required)
- Schritt 1: `grep -rn "<name>" libs/keywords/*.ts` -> Datei + Zeile
- Schritt 2: Methoden-Signatur lesen -> Parameter extrahieren
- Schritt 3: `grep -rn "<name>" staticTestcases/` -> Test-Coverage pruefen
- Output: Datei:Zeile, Parameter-Liste, Test-Status (getestet/ungetestet)
- Aufwand: Klein

#### 3. `/fix-build` Command

Azure-Pipeline-Batch-Fix als One-Liner. Holt fehlgeschlagene Tests, mappt lokal, startet Healing.

```
Nutzung: /fix-build 232168
```

Implementierung:

- Argument: Azure DevOps Build ID (required)
- Schritt 1: Build-Ergebnisse via ADO MCP abrufen
- Schritt 2: Fehlgeschlagene Tests identifizieren und auf lokale Spec-Dateien mappen
- Schritt 3: `test-healer-agent` pro fehlgeschlagenem Test aufrufen
- Schritt 4: Zusammenfassung der Fixes ausgeben
- Aufwand: Mittel

#### 4. `/create-test` Command

Vereinfachter Einstieg fuer neue Tests. Generiert Boilerplate mit korrektem Template.

```
Nutzung: /create-test DO12_Zustaendigkeit --domain Dossier
```

Implementierung:

- Argument: Testname (required), Domain (optional, wird aus Keyword-Name abgeleitet)
- Schritt 1: Keyword in `libs/keywords/` suchen -> Parameter extrahieren
- Schritt 2: Template aus `knowledge-base/agent-bundles/create-test-bundle.md` laden
- Schritt 3: Spec-Datei generieren mit korrekten Imports, Tags, API-Setup
- Schritt 4: In `staticTestcases/Keywordvalidation/<Domain>/` schreiben
- Aufwand: Mittel

#### 5. `/sync-ado` Command

One-Liner fuer den kompletten ADO-Sync-Workflow.

```
Nutzung: /sync-ado [--create]
```

Implementierung:

- Ohne Flag: `npm run azure:sync && npm run azure:validate`
- Mit `--create`: zusaetzlich `npm run azure:create-missing`
- Output: Zusammenfassung (synced/drifted/missing Counts)
- Aufwand: Klein

---

### Prioritaet 2 -- Qualitaets-Workflows

#### 6. `/coverage-check` Command

Automatische Coverage-Analyse: Welche Keywords haben Tests, welche nicht?

```
Nutzung: /coverage-check [--domain Dossier]
```

Implementierung:

- Schritt 1: Alle Keyword-Methoden aus `libs/keywords/*.ts` extrahieren
- Schritt 2: Fuer jede Methode in `staticTestcases/` nach Verwendung suchen
- Schritt 3: Report generieren: getestet vs ungetestet, gruppiert nach Domain
- Optional: `test-manifest.json` als Datenquelle falls vorhanden
- Aufwand: Mittel

#### 7. `/stability-report` Command

Analysiert letzte Test-Ausfuehrung auf Retry-Stats, Timing-Probleme, Flaky-Patterns.

```
Nutzung: /stability-report
```

Implementierung:

- Schritt 1: `test-results/pw-output.txt` lesen
- Schritt 2: Retry-Events extrahieren (StabilityHelper loggt diese)
- Schritt 3: Slow-Tests identifizieren (Duration > Threshold)
- Schritt 4: Bekannte Flaky-Patterns matchen (aus `knowledge-base/debugging/flaky-tests.md`)
- Output: Tabelle mit Stability-Score pro Test
- Aufwand: Mittel

#### 8. `/create-keyword` Command

Neues Keyword erstellen mit korrektem Boilerplate.

```
Nutzung: /create-keyword BW05_Bewilligung_Stornieren --page bewilligungenWorkflows-page
```

Implementierung:

- Argument: Keyword-Name (required), zugehoerige Page (optional)
- Schritt 1: Existierende Keyword-Klasse im Fachbereich finden oder neue erstellen
- Schritt 2: Method-Stub mit Parameter-Object-Pattern generieren
- Schritt 3: Page-Method-Stubs generieren falls Page angegeben
- Schritt 4: Export in `libs/keywords/index.ts` registrieren falls noetig
- Aufwand: Mittel

---

### Prioritaet 3 -- Erweiterte Automatisierung

#### 9. `/migrate-to-pageobjectbase` Command

Pendant zu `/migrate-to-basepage` fuer die moderne `PageObjectBase` + Controls-Architektur.

```
Nutzung: /migrate-to-pageobjectbase libs/pages/aufgaben-page.ts
```

Implementierung:

- Analog zu `/migrate-to-basepage`, aber Ziel-Architektur ist `libs/core/`
- Konvertiert Locators zu Typed Controls (IButton, IDropdown, ITable, etc.)
- Verschiebt migrierte Page nach `libs/pages-v2/`
- Aufwand: Gross (erfordert deep Controls-Wissen)

#### 10. `/api-workflow` Command

API-basierten Test-Data-Setup fuer eine Domain generieren.

```
Nutzung: /api-workflow Bedarfspruefung
```

Implementierung:

- Schritt 1: Bestehende API-Workflows in `libs/workflows/` als Referenz lesen
- Schritt 2: API-Endpoints aus `libs/utils/apiSetup.ts` identifizieren
- Schritt 3: Workflow-Funktion nach Pattern von `apiDossierWorkflow.ts` generieren
- Schritt 4: In `libs/workflows/` schreiben und in `index.ts` exportieren
- Aufwand: Gross

---

## Empfehlungen: Knowledge Base Erweiterungen

### Fehlende Agent-Bundles

| Bundle | Zweck | Aufwand |
|--------|-------|---------|
| `acceptance-test-bundle.md` | Template fuer Acceptance-Tests (eigenes Pattern, weniger API-Setup) | Klein |
| `functional-ui-bundle.md` | Template fuer FunctionalUI-Tests (Stability, Navigation, kein Dossier) | Klein |
| `journey-test-bundle.md` | Template fuer Journey-Tests (Multi-Role, langer Flow) | Mittel |

---

## Empfehlungen: Hooks

### Pre-Commit Hook

```bash
# TypeScript-Check vor jedem Commit
npm run typecheck
```

Status: `husky` ist bereits installiert (package.json). Hook muss nur konfiguriert werden.

### Post-Test-Run Analyse (konzeptuell)

Automatisch `test-results/pw-output.txt` auf bekannte Error-Patterns scannen und Loesungsvorschlaege aus `knowledge-base/debugging/error-solutions.md` anzeigen. Koennte als Teil von `/run-test` implementiert werden.

---

## Empfehlungen: Agent-Verbesserungen

### Model-Konfiguration

Aktuell nutzen alle Agents `model: sonnet`. Die `settings.json` konfiguriert Foundry-Models:

```json
"ANTHROPIC_DEFAULT_SONNET_MODEL": "claude-sonnet-4-5",
"ANTHROPIC_DEFAULT_HAIKU_MODEL": "claude-haiku-4-5",
"ANTHROPIC_DEFAULT_OPUS_MODEL": "claude-opus-4-6"
```

Empfehlung: Haiku-Model funktioniert derzeit nicht (Fehler bei Agent-Ausfuehrung). Pruefen ob `claude-haiku-4-5` im Foundry verfuegbar ist, oder auf ein verfuegbares Model umstellen.

### Agent Knowledge Base Referenzen

Die Agents referenzieren teilweise veraltete KB-Pfade (z.B. `knowledge-base/08-Agent-Playbooks/`, `knowledge-base/03-Keywords/`). Diese Legacy-Verzeichnisse existieren noch, aber die neue Bundle-Struktur ist bevorzugt. Agents sollten auf die neuen Pfade aktualisiert werden:

| Alt | Neu |
|-----|-----|
| `knowledge-base/08-Agent-Playbooks/create-test-playbook.md` | `knowledge-base/agent-bundles/create-test-bundle.md` |
| `knowledge-base/08-Agent-Playbooks/fix-test-playbook.md` | `knowledge-base/agent-bundles/fix-test-bundle.md` |
| `knowledge-base/03-Keywords/_keyword-index.md` | `knowledge-base/keyword-reference/_keyword-lookup.md` |

---

## Umsetzungs-Reihenfolge

| # | Was | Typ | Aufwand | Impact |
|---|-----|-----|---------|--------|
| 1 | `/run-test` | Command | Klein | Hoch -- taegliche Nutzung |
| 2 | `/keyword-lookup` | Command | Klein | Hoch -- spart Recherche-Zeit |
| 3 | `/sync-ado` | Command | Klein | Mittel -- vereinfacht ADO-Workflow |
| 4 | `/create-test` | Command | Mittel | Hoch -- beschleunigt Test-Erstellung |
| 5 | `/fix-build` | Command | Mittel | Hoch -- Pipeline-Fixes automatisiert |
| 6 | `/coverage-check` | Command | Mittel | Mittel -- Transparenz ueber Luecken |
| 7 | Acceptance + FunctionalUI Bundles | KB | Klein | Mittel -- fehlende Templates |
| 8 | Agent KB-Pfade aktualisieren | Agents | Klein | Mittel -- weniger Fehlreferenzen |
| 9 | `/create-keyword` | Command | Mittel | Mittel -- Boilerplate-Reduktion |
| 10 | `/stability-report` | Command | Mittel | Mittel -- Flaky-Test-Erkennung |
| 11 | `/migrate-to-pageobjectbase` | Command | Gross | Niedrig -- selten genutzt |
| 12 | `/api-workflow` | Command | Gross | Niedrig -- selten genutzt |
