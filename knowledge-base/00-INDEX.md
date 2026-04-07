# Aventis Playwright Knowledge Base

Zentrale Wissensbasis. Strukturregeln: [[kb-architecture]]

---

## Agent Task Routing

| Ich will... | Lies dieses Bundle |
|-------------|-------------------|
| Neuen Test erstellen (Keyword-Driven) | [[agent-bundles/create-test-bundle]] |
| Test reparieren / WIP-Test fixen | [[agent-bundles/fix-test-bundle]] |
| Modernes Framework (pages-v2, Controls) | [[agent-bundles/modern-framework-bundle]] |
| Keyword-Parameter nachschlagen | [[keyword-reference/_keyword-lookup]] |

---

## Einzelne Nachschlage-Dateien (nur bei Bedarf)

| Ich brauche... | Datei |
|----------------|-------|
| Prerequisite-Ketten / Workflow-Abhaengigkeiten | [[domain/workflow-chains]] |
| Benutzerrollen und Berechtigungen | [[domain/user-roles]] |
| Fachbegriffe Sozialhilfe | [[domain/business-glossary]] |
| Berechnungsregeln (Wohnkosten, GBL) | [[domain/calculation-rules]] |
| Epics/Features aus ADO | [[domain/epics/_epic-index]] |
| Error-to-Solution Mapping | [[debugging/error-solutions]] |
| Flaky Tests / Timing | [[debugging/flaky-tests]] |
| CI vs Lokal Unterschiede | [[debugging/ci-vs-local]] |
| Projektarchitektur | [[reference/architecture]] |
| Coverage-Matrix (Keyword->Test) | [[reference/coverage-matrix]] |
| Modernes Framework (Detail) | [[09-Modernes-Framework/architektur]] |

---

## Verzeichnisstruktur

```
knowledge-base/
|-- 00-INDEX.md                     # Routing-Hub (dieses File)
|-- kb-architecture.md              # Strukturregeln
|-- agent-bundles/                  # Task-spezifische Bundles
|-- keyword-reference/              # Keyword-Nachschlagewerk
|-- domain/                         # Fachliches Wissen
|   +-- epics/                      # ADO-synchronisierte Epics (READ-ONLY)
|-- debugging/                      # Fehleranalyse
|-- reference/                      # Architektur, Coverage
|-- 09-Modernes-Framework/          # Modernes Framework Detail-Docs
+-- plans/                          # Implementierungsplaene
```

## Aktualisierung

- **keyword-reference/**, **reference/coverage-matrix**: Via Script regenerierbar
- **domain/epics/**: Automatisch via `npm run azure:sync-domain` (READ-ONLY)
- **agent-bundles/**: Manuell nach Workflow-Aenderungen oder `/project-reflection`
- **debugging/**: Manuell nach neuen Error-Patterns

## Konventionen

- Sprache: Deutsch (Fachbegriffe), Code in Englisch
- Links: `[[Wiki-Links]]` fuer Navigation
- Keine Umlaute in Dateinamen
- Strukturregeln: [[kb-architecture]]
