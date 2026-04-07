# Performance-Optimierungsplan

Stand: 2026-03-06 | Branch: aventis_DEV

## Ziel

Gesamtlaufzeit der E2E-Tests minimieren durch systematische Entfernung von Wartezeiten, Workarounds und Einführung von Event-basiertem Warten.

## Uebersicht

| # | Massnahme | Einsparpotenzial | Aufwand | Prioritaet |
|---|-----------|-----------------|---------|------------|
| 1 | Login via storageState cachen | Minuten pro Test | Mittel | KRITISCH |
| 2 | sharedTestLogicDossier: Backend-Polls statt feste Waits | ~17 Min total | Gering | SEHR HOCH |
| 3 | bedarfsprufung-keyword: 3x reload entfernen | ~10-15s pro Test | Gering | HOCH |
| 4 | Page Object Waits >= 2000ms ersetzen | ~30-60s kumuliert | Mittel | HOCH |
| 5 | stability-helper Basis-Werte pruefen | multiplikativ | Gering | HOCH |
| 6 | Workflow Backend-Waits durch Polling ersetzen | ~8s pro Workflow | Gering | MITTEL |
| 7 | page.reload() Workarounds eliminieren | ~3-5s pro Reload | Mittel | MITTEL |
| 8 | Parallelisierung evaluieren | 50-75% Gesamtzeit | Hoch | STRATEGISCH |

---

## Phase 1: Quick Wins (geringe Komplexitaet, hoher Impact)

### 1.1 Login via storageState cachen

**Problem:** 121 Login-Aufrufe ueber 59 Tests. Jeder MS-Login dauert ~15-30s (MFA, Animationen, Redirects). `microsoftlogin-page.ts` hat 17 `waitForTimeout`-Stellen.

**Top-Offender (mehrfacher Login im selben Test):**
- `DossierKomplett.spec.ts` -- 18 Login-Aufrufe
- `RE01_RE02_RE03_Rechnungen.spec.ts` -- 8 Login-Aufrufe
- `BU01_BU02_Zahlungen.spec.ts` -- 6 Login-Aufrufe
- `a02b091011_Bedarfspruefung.spec.ts` -- 5 Login-Aufrufe
- `WSH99_Zahlungen_AnzahlPruefen.spec.ts` -- 5 Login-Aufrufe

**Loesung:**
- Playwright `storageState` Auth-Setup implementieren (global-setup.ts)
- Authentifizierte Session pro Benutzerrolle cachen
- Tests nutzen gespeicherten Auth-State statt jedem Login
- Referenz: https://playwright.dev/docs/auth

**Dateien:**
- Neu: `libs/auth/global-setup.ts`
- Aendern: `playwright.config.ts` (globalSetup + storageState)
- Aendern: Tests die `Stable_Login` nutzen

**Validierung:** Login-Anzahl pro Test messen vorher/nachher. Ziel: max 1 Login pro Test.

---

### 1.2 sharedTestLogicDossier: Feste Waits durch API-Polling ersetzen

**Problem:** ~20s feste Wartezeit pro Dossier-Erstellung, verwendet in ~50+ Tests = ~17 Min reine Leerlaufzeit.

**Betroffene Stellen:**
- `libs/sharedTestSteps/sharedTestLogicDossier.ts:259` -- `waitForTimeout(5000)`
- `libs/sharedTestSteps/sharedTestLogicDossier.ts:473` -- `waitForTimeout(5000)`
- `libs/sharedTestSteps/sharedTestLogicDossier.ts:180,344,570` -- je `waitForTimeout(2000)`
- `libs/sharedTestSteps/sharedTestLogicDossier.ts:356,389` -- je `waitForTimeout(1000)`

**Loesung:**
- API-Endpoint fuer Dossier-Status identifizieren
- Poll-Funktion implementieren: Dossier-Status abfragen bis "ready" (max 10s Timeout)
- Feste Waits ersetzen durch `await pollDossierReady(dossierId)`

**Validierung:** Betroffene Tests einzeln ausfuehren, Laufzeit messen.

---

### 1.3 bedarfsprufung-keyword: 3x reload entfernen

**Problem:** `libs/keywords/bedarfsprufung-keyword.ts:62-66` fuehrt 3 Reloads hintereinander aus. Jeder Reload kostet ~3-5s.

**Loesung:**
- Root-Cause identifizieren (vermutlich Angular-State oder Caching-Problem)
- Durch `waitForAngularStable()` oder gezieltes `waitForSelector` ersetzen
- Falls Reload noetig: maximal 1x mit anschliessendem Event-Wait

**Validierung:** Bedarfspruefungs-Tests ausfuehren (`a02b091011_Bedarfspruefung.spec.ts`).

---

## Phase 2: Systematische Wait-Optimierung

### 2.1 Page Object Waits >= 2000ms ersetzen

**Betroffene Dateien (nach Schwere sortiert):**

| Datei | Anzahl | Groesste Waits | Kumuliert |
|---|---|---|---|
| `bedarfsprufung-page.ts` | 9 | 2000ms x 3 | ~10s |
| `document-page.ts` | 8 | 3000ms, 500ms x 5 | ~6s |
| `wsh-page.ts` | 16 | 300-1000ms | ~6s |
| `klientschaft-page.ts` | 4 | 2000ms | ~4s |
| `rahmenbudget-page.ts` | 8 | 500ms x 5 | ~3s |
| `rechnung-page.ts` | 2 | 2000ms, 1000ms | ~3s |
| `ph-page.ts` | 4 | 1000ms, 500ms | ~2s |
| `freiwillige-page.ts` | 3 | 1000ms, 500ms | ~2s |
| `navigation-page.ts` | 3 | variabel | ~2s |

**Vorgehen:** Pro Datei mit `perf-optimizer-agent`:
1. Waits >= 2000ms identifizieren
2. Durch Event-basiertes Warten ersetzen (`waitForSelector`, `waitForResponse`, `expect().toBeVisible()`)
3. Test ausfuehren und validieren
4. Naechste Datei

**Besonders teuer (einzeln adressieren):**
- `anspruchsprufung-page.ts:46` -- `waitForTimeout(5000)` + `page.reload()`
- `document-page.ts:649` -- `waitForTimeout(3000)` nach Dokument-Erstellung
- `bedarfsprufung-page.ts:239,259` -- je `waitForTimeout(2000)` fuer Backend-Processing

---

### 2.2 stability-helper Basis-Werte pruefen

**Problem:** 41 `waitForTimeout`-Aufrufe in `libs/utils/stability-helper.ts`. Da diese Utility von allen Page Objects genutzt wird, wirken die Werte multiplikativ.

**Stellen mit Optimierungspotenzial:**
- `t(500)` Basis-Retry-Delays -- ggf. auf `t(300)` reduzieren
- `t(300)` Animation-Waits -- ggf. auf `t(150)` reduzieren
- `t(100)` / `t(50)` Poll-Intervalle -- sind bereits niedrig, beibehalten

**Vorgehen:**
1. `t()` Multiplikatorfunktion analysieren
2. Basis-Werte um 30-50% reduzieren
3. Smoke-Tests ausfuehren
4. Bei Flakiness schrittweise erhoehen

---

### 2.3 Workflow Backend-Waits durch Polling ersetzen

**Betroffene Stellen:**
- `libs/workflows/apiDossierWorkflow.ts:47` -- `waitForTimeout(2000)`
- `libs/workflows/apiDossierWorkflow.ts:103` -- `waitForTimeout(2000)`
- `libs/workflows/paymentConnectionWorkflow.ts:79` -- `waitForTimeout(2000)`
- `libs/workflows/paymentConnectionWorkflow.ts:91` -- `waitForTimeout(1000)`

**Loesung:** Gleicher Ansatz wie 1.2 -- API-Readiness-Check statt fester Wait.

---

## Phase 3: Workaround-Elimination

### 3.1 page.reload() Workarounds eliminieren

**16 Reload-Stellen**, jeder kostet ~3-5s:

| Datei | Zeilen | Kontext |
|---|---|---|
| `bedarfsprufung-keyword.ts` | 62, 64, 66 | 3x reload hintereinander |
| `bedarfsprufung-page.ts` | 271, 352, 371 | nach Backend-Aktion |
| `dossierprufung-page.ts` | 111, 139 | Pruefungs-Workflow |
| `anspruchsprufung-page.ts` | 47 | nach 5s Wait |
| `common-keyword.ts` | 143 | generisch |
| `navigation-page.ts` | 786 | nach Navigation |
| `rahmenbudget-page.ts` | 1074 | in Polling-Loop |
| `institutionenstamm-page.ts` | 240, 248 | Institution-Setup |
| `login-page.ts` | 189 | Login-Recovery |
| `RV-page.ts` | 169 | Rechtsverfolgung |

**Vorgehen:** Pro Reload-Stelle:
1. Root-Cause identifizieren (Angular-State? Backend-Sync? Caching?)
2. Gezieltes Event-Wait oder Angular-Stability-Check einsetzen
3. Test validieren, bei Flakiness Reload als Fallback behalten

---

## Phase 4: Architektur (strategisch)

### 4.1 Parallelisierung evaluieren

**Aktueller Stand:**
```typescript
// playwright.config.ts
fullyParallel: false,                        // Tests laufen sequentiell
workers: process.env.CI ? 1 : undefined,     // CI: nur 1 Worker
```

**Blocker:**
- Tests teilen QA-Umgebung und Benutzer-Accounts
- Dossier-Erstellung kann Seiteneffekte haben
- Login-Sessions koennen sich gegenseitig stoeren

**Voraussetzungen fuer Parallelisierung:**
1. Test-Isolation: Jeder Test erstellt eigenes Dossier (bereits groesstenteils der Fall)
2. User-Pool: Mehrere Test-User fuer parallele Sessions
3. storageState pro Worker/User
4. Keine geteilten Dossiers zwischen parallelen Tests

**Umsetzung:**
1. `fullyParallel: true` setzen
2. `workers: 4` (oder mehr) fuer CI
3. User-Pool-Mechanismus implementieren
4. Schrittweise Tests auf Parallelisierbarkeit pruefen

**Potenzial:** Bei ~80 Tests mit ~2-3 Min Durchschnitt: von ~200 Min auf ~50 Min (4 Workers).

---

## Messung und Tracking

### Baseline erstellen
```bash
# Gesamtlaufzeit messen (alle stabilen Tests)
npx playwright test --grep @all --workers 1 2>&1 | tail -5
```

### Nach jeder Phase messen
- Gesamtlaufzeit notieren
- Flakiness-Rate pruefen (3x ausfuehren)
- Ergebnisse in diesem Dokument unter "Ergebnisse" dokumentieren

### Ergebnisse

| Datum | Phase | Gesamtlaufzeit | Flakiness | Bemerkung |
|---|---|---|---|---|
| (Baseline noch zu messen) | - | - | - | - |

---

## Ausfuehrung

Fuer die Umsetzung der Phasen 1-3 den `perf-optimizer-agent` nutzen:
- Einzelne Stellen iterativ optimieren
- Nach jeder Aenderung betroffene Tests ausfuehren
- Bei Flakiness: Aenderung rueckgaengig machen und alternativen Ansatz waehlen

Phase 4 (Parallelisierung) erfordert ein eigenes Design-Dokument und schrittweise Migration.
