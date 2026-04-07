# Fix Test Bundle
<!-- Agent: test-healer-agent | Alles fuer Test-Reparatur und WIP-Tests -->

## 1. Kernregel

Keywords (`libs/keywords/*.ts`) NICHT aendern.
Fix-Orte nach Prioritaet: 1) `libs/pages/*.ts` 2) `staticTestcases/*.spec.ts` 3) `libs/workflows/*.ts`

## 2. Diagnose-Workflow

| Schritt | Aktion | Kommando |
|---------|--------|----------|
| 1 | Test finden | `grep -rn "Testname" staticTestcases/ --include="*.spec.ts" -l` |
| 2 | Test + Keywords + Pages lesen | Source in `libs/keywords/` und `libs/pages/` lesen |
| 3 | Test ausfuehren | `npx playwright test <spec> --headed --workers 1 2>&1 \| tee test-results/pw-output.txt; echo "EXIT:$?"` |
| 4 | Fehler extrahieren | `grep -B2 -A15 "Error\|FAILED\|Timeout\|expect(" test-results/pw-output.txt` |
| 5 | Zusammenfassung | `tail -50 test-results/pw-output.txt` |
| 6 | Root Cause bestimmen | Tabelle in Abschnitt 3 konsultieren |

## 3. Error-Pattern Quick-Ref

| Error Pattern | Symptom | Root Cause | Fix-Ort | Fix |
|---------------|---------|------------|---------|-----|
| `waitForResponse: Timeout` | Nav-Timeout nach clickNavLink | Seite bereits geladen, API-Wait laeuft ins Leere | `libs/pages/` | URL-Check vor Navigation+Wait (siehe Fix 1) |
| `strict mode violation` (Tabelle) | Locator resolved to N elements | Breiter Locator trifft expandierte Detailzeilen | `libs/pages/` | Spezifischeren Selektor (siehe Fix 2) |
| `strict mode violation` (Dialog) | Button resolved to 2 elements | Mehrere Dialoge im DOM | `libs/pages/` | `.last()` auf Dialog-Container (siehe Fix 3) |
| `TimeoutError: locator.click` (Overlay) | Element nicht klickbar | Loading-Spinner/Backdrop verdeckt Element | `libs/pages/` | `waitFor({ state: "hidden" })` auf Overlay (siehe Fix 4) |
| `TimeoutError: locator.click` (Render) | Element nicht sichtbar | Angular Change-Detection noch nicht fertig | `libs/pages/` | `waitFor({ state: "visible" })` vor Click |
| `page.goto: Timeout` | Navigation-Timeout | Langsame Server-Antwort | `libs/pages/` | `GoTo_Dossier_With_Url()` oder `waitForApplicationReady()` |
| Suche liefert keine Ergebnisse | Keine Fehlermeldung | `pressSequentially()` triggert Angular nicht | `libs/pages/` | `fill()` + `press("Enter")` (siehe Fix 5) |
| Save-Button bleibt disabled | Kein Fehler, Button ausgegraut | Formular bleibt "pristine" | `libs/pages/` | `stableFormSubmit()` oder `triggerChangeDetection` |
| Dialog schliesst nicht | Timeout bei Schliessen-Button | CSS-Animation nicht abgeschlossen | `libs/pages/` | `stabilityHelper.closeDialog()` |
| `expect()` fehlschlaegt nach API | Wert stimmt nicht | UI hat nach API-Setup nicht aktualisiert | `*.spec.ts` | `page.reload()` + `waitForApplicationReady()` |
| Betraege stimmen nicht | Wohnkosten-Assertion falsch | System begrenzt auf Richtlinien-Werte | `*.spec.ts` | Berechneten Wert verwenden, nicht Eingabewert |
| Lokal OK, CI Timeout | Nur in Pipeline | Headless langsamer, kein GPU | `libs/pages/` | Explizite Waits statt implizite Timings |

### Top 5 Code-Fixes

**Fix 1: waitForResponse Timeout (Nav bereits geladen)**
```typescript
// VORHER -- waitForResponse laeuft ins Leere
await this.rahmenbudgetPage.clickRahmenbudgetNavLink();
await this.rahmenbudgetPage.waitRahmenbudgetQueryAPI();

// NACHHER -- URL-Check schuetzt beide Aufrufe
const alreadyOnPage = page.url().includes("/budget/budget");
if (!alreadyOnPage) {
    await this.rahmenbudgetPage.clickRahmenbudgetNavLink();
    await this.rahmenbudgetPage.waitRahmenbudgetQueryAPI();
}
```

**Fix 2: strict mode violation (Tabelle)**
```typescript
// VORHER -- zu breit, trifft expandierte Zeilen
const cell = page.locator("tbody tr td").filter({ hasText: "Wohnkosten" });

// NACHHER -- spezifisch auf Hauptzeile
const cell = page.locator("tbody > tr:first-child > td:nth-child(2)");
```

**Fix 3: strict mode violation (Dialog)**
```typescript
// VORHER -- trifft mehrere Dialoge im DOM
await page.getByRole("button", { name: "Speichern" }).click();

// NACHHER -- auf letzten (sichtbaren) Dialog einschraenken
const dialog = page.locator("mat-dialog-container").last();
await dialog.getByRole("button", { name: "Speichern" }).click();
```

**Fix 4: Element hinter Overlay**
```typescript
// VORHER -- Klick schlaegt fehl wegen Loading-Spinner
await targetElement.click();

// NACHHER -- Overlay abwarten
await page.getByTestId("loading-spinner").waitFor({ state: "hidden" });
await targetElement.click();
```

**Fix 5: Suche triggert nicht**
```typescript
// VORHER -- Angular erkennt Eingabe nicht
await searchInput.pressSequentially("Suchbegriff");

// NACHHER -- fill() + Enter triggert Change-Detection
await searchInput.fill("Suchbegriff");
await searchInput.press("Enter");
```

## 4. Fix-Entscheidungsbaum

| Fehlertyp | Fix in welcher Datei |
|-----------|---------------------|
| Locator veraltet / zu breit | `libs/pages/*.ts` |
| Wait/Timing fehlt | `libs/pages/*.ts` |
| Parameter falsch | `staticTestcases/*.spec.ts` |
| Prerequisite fehlt | `staticTestcases/*.spec.ts` (Setup) |
| Workflow-Logik geaendert | `libs/pages/*.ts` oder `libs/workflows/*.ts` |
| Hardcodierte Dates | `staticTestcases/*.spec.ts` |
| Falscher User-Kontext | `staticTestcases/*.spec.ts` |

## 5. WIP-Test Spezial

**Finden:** `grep -rn "@wip\|test.skip" staticTestcases/ --include="*.spec.ts" -l`

| Blocker | Pruefen mit | Fix |
|---------|-------------|-----|
| Hardcodierte Dates | `grep -n "\"[0-9][0-9]\.[0-9][0-9]\.[0-9][0-9][0-9][0-9]\"" <file>` | `DateHelper.getTodayDateString()` / `getFutureDateString(n)` |
| Hardcodierte Credentials | `grep -n "diartis.ch\|@.*\.ch" <file>` | `TestUsers.*` / `TestPersons.*` |
| Fehlende Prerequisites | Keyword-Chain pruefen | API-Setup: `createDossierViaApiOnly()`, `createBedarfspruefungViaApi()` |
| Leere Parameter | `grep -n '""' <file>` | Aus Legacy-Test extrahieren: `grep -rn "KEYWORD" testcases/ -A20` |
| Fehlende Unique IDs | `grep -n "generateUniqueDossierId" <file>` | `sharedTestLogic.generateUniqueDossierId(seed)` |
| Falscher User-Kontext | Keyword-Source lesen | `Stable_LogoutAndLoginDiffAccount` vor Rollen-Step |

**Abschluss:** `@wip` -> `@all` + Bereichs-Tag, WIP-Ordner -> Bereichsordner, `test.skip()` entfernen.

## 6. Azure Pipeline Batch Fix

1. Ergebnisse abrufen via Azure DevOps MCP Tool (Build-ID)
2. Failed Tests auf lokale Dateien mappen: `grep -r "@\[<testCaseReferenceId>\]" staticTestcases/`
3. Jeden Test einzeln durch Diagnose-Workflow (Abschnitt 2) fuehren
4. CI-spezifische Checks: Hardcodierte Daten? Explizite Waits? Viewport-Abhaengigkeiten?
5. Lokal mit CI-Config testen: `npx playwright test --config=playwright.kv-azure.config.ts <spec>`

**CI vs. Lokal Timing:** CI hat langsameres Rendering (headless, kein GPU) aber StabilityHelper reduziert Delays auf 0.3x -- Tests koennen in CI ZU SCHNELL sein.

## 7. Checkliste vor Abschluss

- [ ] Diagnose praesentiert und bestaetigt?
- [ ] Aenderung minimal (< 20 Zeilen)?
- [ ] Keine Keywords geaendert?
- [ ] Test laeuft 2x erfolgreich?
- [ ] Page-Aenderungen rueckwaertskompatibel? (`grep -rn "PageName" staticTestcases/ -l`)
- [ ] Keine Workarounds (`waitForTimeout`, `force: true`, Retry-Loops)?
- [ ] WIP: Tags aktualisiert, Ordner verschoben?

## 8. Tiefergehend (nur bei Bedarf)

- [[../debugging/error-solutions]] -- Alle Error-Patterns im Detail
- [[../debugging/flaky-tests]] -- Timing-spezifische Probleme, StabilityHelper-Methoden
- [[../debugging/ci-vs-local]] -- Umgebungsunterschiede, Config-Matrix
- [[../domain/workflow-chains]] -- Prerequisite-Ketten pruefen
