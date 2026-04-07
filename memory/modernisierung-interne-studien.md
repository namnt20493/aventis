# Interne Studien -- Framework-Modernisierung

Definiert am: 2026-03-13
Status: ABGESCHLOSSEN (Studie 1-6), Studie 7 AUSSTEHEND
Externe Studien: Siehe knowledge-base/09-Modernes-Framework/externe-studien.md (ABGESCHLOSSEN)
Ergebnisse: Siehe knowledge-base/09-Modernes-Framework/interne-studien.md

---

## Zusammenfassung der Ergebnisse

Alle 7 Studien definiert, 6 durchgefuehrt, Ergebnisse in Architektur-Dokumentation verankert.

| Studie | Status | Kern-Ergebnis |
|--------|--------|---------------|
| 1. Control-Coverage | ABGESCHLOSSEN | Table (88 Matches, 24 Dateien) wichtigstes fehlendes Control. 6 vorhandene Controls decken ~85% ab. |
| 2. Locator-Audit | ABGESCHLOSSEN | 34% CSS/XPath (fragil), 32% TestId, 32% Role. 451 Regex-Patterns fuer Zweisprachigkeit. |
| 3. Dependency-Graph | ABGESCHLOSSEN | NavigationPage (28 Imports), CommonPage (25), RahmenbudgetPage (4). Roadmap-Reihenfolge bestaetigt. |
| 4. Methoden-Komplexitaet | ABGESCHLOSSEN | 675 Methoden: 55% Simple, 35% Composite, 10% Business-Logic. 2 HARD Pages (Rahmenbudget, Klientschaft). |
| 5. CommonPage-Refactoring | ABGESCHLOSSEN | Reine Utility-Klasse, NICHT als Page migrieren. Aufsplitten in DateHelper, NumberFormatter, StringHelper, FileUploadHelper. |
| 6. StabilityHelper | ABGESCHLOSSEN | 95% Abdeckung durch Controls. IStabilityService um forceFormUpdate() + triggerChangeDetection() erweitern. |
| 7. Test-Pattern-Validierung | AUSSTEHEND | Proof-of-Concept bei Phase-3-Start |

## Verankert in Dokumentation

- knowledge-base/09-Modernes-Framework/architektur.md -- 8 ADRs + Fehlende Controls + Locator-Strategie + Sofort-Massnahmen
- knowledge-base/09-Modernes-Framework/migration-roadmap.md -- Phase 2.5 eingefuegt, Schwierigkeit pro Page, Migrations-Reihenfolge validiert
- knowledge-base/09-Modernes-Framework/interne-studien.md -- Detaillierte Ergebnisse aller Studien
