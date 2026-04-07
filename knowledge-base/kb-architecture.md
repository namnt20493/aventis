# Knowledge Base Architecture

Dieses Dokument definiert die Struktur und Regeln der Knowledge Base.
Jeder Agent und jedes Script, das Inhalte in die KB schreibt, MUSS diese Regeln einhalten.

---

## Kernprinzip: One Task = One Read

Ein Agent soll fuer eine Aufgabe **maximal 1-2 Dateien** lesen muessen.
Informationen werden nach **Task** gebundelt, nicht nach Kategorie.

---

## Verzeichnisstruktur

```
knowledge-base/
|-- kb-architecture.md              # DIESES FILE: Regeln fuer die KB-Struktur
|-- 00-INDEX.md                     # Routing-Hub: Task -> Bundle/Datei (kompakt)
|
|-- agent-bundles/                  # Task-spezifische Bundles (alles in einer Datei)
|   |-- create-test-bundle.md       # Neuen Test erstellen (Legacy/Keyword-Driven)
|   |-- fix-test-bundle.md          # Failing Test reparieren
|   +-- modern-framework-bundle.md  # Modernes Framework (pages-v2, Controls)
|
|-- keyword-reference/              # Keyword-Nachschlagewerk (kompakt)
|   +-- _keyword-lookup.md          # EINE Datei: alle Keywords mit Params inline
|
|-- domain/                         # Fachliches Wissen (selektiv lesen)
|   |-- workflow-chains.md          # Prerequisite-Ketten (essentiell)
|   |-- user-roles.md               # Rollen und Berechtigungen
|   |-- business-glossary.md        # Fachbegriffe
|   |-- calculation-rules.md        # Berechnungsregeln
|   +-- epics/                      # ADO-synchronisierte Epics (READ-ONLY)
|       +-- _epic-index.md
|
|-- debugging/                      # Fehleranalyse
|   |-- error-solutions.md          # Error -> Solution Mapping
|   |-- flaky-tests.md              # Timing-Probleme
|   +-- ci-vs-local.md              # Umgebungsunterschiede
|
|-- reference/                      # Nachschlage-Dateien (nur bei Bedarf)
|   |-- architecture.md             # Projektarchitektur (zusammengefasst)
|   +-- coverage-matrix.md          # Keyword -> Test Zuordnung
|
|-- 09-Modernes-Framework/          # Detail-Docs fuer modernes Framework
|   |-- architektur.md              # Architektur-Uebersicht
|   |-- controls-referenz.md        # Control-Interfaces und Implementierungen
|   |-- pages-v2-referenz.md        # Pages-v2 Referenz
|   +-- ...                         # Weitere Detail-Docs
|
+-- plans/                          # Implementierungsplaene
    +-- *.md                        # Aktive Plaene
```

---

## Regeln fuer neue Inhalte

### Regel 1: Bundle-First

Wenn eine Information fuer einen Agent-Task relevant ist, gehoert sie in das Bundle.
Bundles enthalten **alles was der Agent braucht** -- keine Links zu anderen Dateien die er erst lesen muss.

- RICHTIG: Template-Code direkt im Bundle
- FALSCH: "Siehe [[test-template]] fuer das Template"

### Regel 2: Kompakt, nicht erklaerend

Bundles und Lookups sind **Spickzettel**, keine Lehrbuecher.
- Tabellen statt Fliesstext
- Copy-Paste-Bloecke statt Erklaerungen
- 1-3 Zeilen pro Eintrag im Keyword-Lookup

### Regel 3: Keine Redundanz zwischen CLAUDE.md und KB

| Information | Ort | NICHT in |
|-------------|-----|---------|
| Core Rules, Agent Routing | CLAUDE.md | KB |
| Test-Run-Pattern | CLAUDE.md | KB |
| Task-spezifisches Wissen | KB Bundles | CLAUDE.md |
| Keyword-Parameter | KB keyword-lookup | CLAUDE.md |
| Error-Solutions | KB debugging/ | CLAUDE.md |

### Regel 4: Links sind Navigations-Hilfen, keine Lese-Auftraege

Links in Bundles zeigen dem Agent wo er bei Bedarf **mehr** findet.
Der Bundle-Inhalt muss aber **ohne die verlinkten Dateien** funktionieren.

Format: `Mehr Details: [[domain/workflow-chains]]` (am Ende einer Sektion)

### Regel 5: Keyword-Lookup ist die Single Source

Neue Keywords werden NUR in `keyword-reference/_keyword-lookup.md` eingetragen.
Format pro Keyword:
```
## KEYWORD_NAME
File: source-file.ts | Page: page-file.ts
Params: param1 (type), param2 (type), ...
Prereq: Was muss vorher existieren
[Optional] CONSTRAINT: Wichtige Einschraenkung
```

### Regel 6: Domain-Wissen bleibt separat

`domain/` enthaelt Fachwissen das NICHT task-spezifisch ist:
- Workflow-Ketten (werden von Bundles referenziert, nicht dupliziert)
- Rollen (kompakte Tabelle)
- Fachbegriffe (Glossar)

Diese Dateien werden nur gelesen wenn der Agent sie **explizit braucht**.

### Regel 7: Debugging bleibt separat

`debugging/` ist ein Nachschlagewerk fuer Fehleranalyse.
Error-Patterns werden hier gesammelt, NICHT in den Bundles.
Das fix-test-bundle verlinkt auf debugging/, enthaelt aber die Top-5-Patterns inline.

---

## Bundle-Aufbau (Template)

Jedes Bundle folgt dieser Struktur:

```markdown
# {Task} Bundle
<!-- Agent: {agent-name} | Ziel: {was der Agent damit tun kann} -->

## Quick-Ref: {Wichtigstes zuerst}
[Tabelle oder kompakter Block]

## Template (Copy-Paste)
[Code-Block, direkt verwendbar]

## Checkliste
[Validierung vor Abschluss]

## Tiefergehend (nur bei Bedarf)
- [[link-zu-detail]] -- Wann lesen
```

---

## Aktualisierungsprozess

| Was | Wie | Wann |
|-----|-----|------|
| keyword-lookup | `npm run kb:generate` oder manuell | Nach neuem Keyword |
| agent-bundles | Manuell nach Workflow-Aenderungen | Nach /project-reflection |
| domain/ | Manuell nach neuen Erkenntnissen | Bei Domain-Aenderungen |
| debugging/ | Manuell nach geloesten Fehlern | Nach neuem Error-Pattern |
| coverage-matrix | `npm run kb:generate` | Nach neuem Test |

---

## Navigation: Wie findet der Agent was er braucht?

```
Agent erhaelt Task
  |
  v
CLAUDE.md (automatisch geladen)
  |-- Core Rules, Agent Routing
  |-- Verweis auf 00-INDEX.md
  |
  v
00-INDEX.md (1 Read)
  |-- Task -> Bundle Zuordnung
  |-- "Neuen Test erstellen" -> [[agent-bundles/create-test-bundle]]
  |
  v
Bundle (1 Read, alles drin)
  |-- Template, Quick-Refs, Checkliste
  |-- Optional: Link zu keyword-lookup fuer spezifische Params
  |
  v
keyword-lookup (1 grep/Read, nur bei Bedarf)
  |-- Keyword -> Params -> Constraints
```

Maximale Reads pro Task: **2-3** (Index + Bundle + optional Lookup/Debug)
