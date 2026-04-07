# Flaky Tests

Bekannte Instabilitaeten, deren Ursachen und Loesungen.

## Bekannte Flaky Patterns

### 1. Navigation + API-Wait Kombination

**Symptom:** Test schlaegt sporadisch mit `waitForResponse: Timeout exceeded` fehl.

**Ursache:** Keyword navigiert und wartet auf API-Response. Wenn die Seite bereits geladen ist, wird die Navigation uebersprungen, aber der API-Wait laeuft trotzdem.

**Fix:**
```typescript
const alreadyOnPage = page.url().includes("/expected/path");
if (!alreadyOnPage) {
    await navMethod();
    await waitForApiMethod();
}
```

**Workaround (temporaer):** Timeout erhoehen. Aber: Kein dauerhafter Fix.

### 2. Autocomplete/Sucheingaben

**Symptom:** Suche liefert keine Ergebnisse, obwohl der Suchbegriff eingegeben wurde.

**Ursache:** `pressSequentially()` triggert Angular-Change-Detection nicht zuverlaessig.

**Fix:** Immer `fill()` + `Enter` verwenden.

### 3. Dialog-Animationen

**Symptom:** Klick auf Dialog-Button schlaegt fehl oder trifft falsches Element.

**Ursache:** CSS-Animation des Dialogs ist noch nicht abgeschlossen.

**Fix:** `stabilityHelper.closeDialog()` verwenden -- hat eingebaute Retry-Logik und Animation-Waits.

### 4. Formular-Pristine-Problem (Angular)

**Symptom:** Save-Button bleibt disabled, obwohl Felder ausgefuellt sind.

**Ursache:** Angular erkennt Playwright's `fill()` nicht als User-Interaktion. Formular bleibt "pristine".

**Fix:**
```typescript
await stabilityHelper.stableClick(saveButton, {
    triggerChangeDetection: true
});
```

### 5. Expandierte Tabellenzeilen

**Symptom:** `strict mode violation` bei Tabellen-Locators.

**Ursache:** Detailzeilen sind aufgeklappt und erzeugen zusaetzliche DOM-Elemente mit gleichem Text.

**Fix:** Spezifischere Selektoren verwenden:
```typescript
// Statt: page.locator("tbody tr td")
// Besser: page.locator("tbody > tr:first-child > td:nth-child(2)")
```

## Timing-bezogene Instabilitaeten

### Slow-Mode Einstellungen

Das Projekt verwendet `SLOWMO`-Umgebungsvariable fuer globale Verzoegerung zwischen Aktionen:

| Umgebung | SLOWMO | STABILITY_DELAY |
|----------|--------|----------------|
| Lokal (stabil) | 300ms | 1000ms |
| Lokal (problematisch) | 1000ms | 3000ms |
| CI/Azure | Automatisch 0.3x Multiplikator | - |

### Timeout-Konfiguration

Globale Timeouts (aus `playwright.config.ts` und `test-fixtures.ts`):

| Timeout | Wert | Zweck |
|---------|------|-------|
| Action Timeout | 45s (Config) / 30s (Fixture) | Klicks, Fill, etc. |
| Navigation Timeout | 60s | `page.goto()`, Navigation |
| Expect Timeout | 15s | Assertions mit Auto-Retry |

### test.slow() Verwendung

`test.slow()` verdreifacht alle Timeouts. Verwenden fuer:

- Multi-User-Workflows (3+ Rollenwechsel)
- Journey-Tests mit vielen Steps
- Tests mit mehreren API-Calls in Folge

```typescript
test("Langer_Workflow", { tag: ["@all"] }, async ({ page, ... }) => {
    test.slow(); // 45s * 3 = 135s Action Timeout
    // ... viele Steps
});
```

**Nicht verwenden als Fix fuer einzelne fehlschlagende Steps.** Stattdessen den spezifischen Step analysieren und reparieren.

## Workarounds vs. Richtige Fixes

| Workaround | Problem | Richtiger Fix |
|------------|---------|---------------|
| `page.waitForTimeout(2000)` | Fester Timeout, fragil | `waitFor({ state: "visible" })` oder Assertion |
| `test.slow()` fuer einzelnen Step | Versteckt das eigentliche Problem | Locator oder Timing des Steps fixen |
| `{ force: true }` bei Click | Klickt auf verdecktes Element | Overlay-Wait oder Scroll davor |
| Retry im Test-Code | Kaschiert Instabilitaet | Root Cause analysieren |
| Timeout erhoehen | Langsamer, fragil | Auf korrektes Event/Element warten |

## StabilityHelper als Loesung

Der `StabilityHelper` (`libs/utils/stability-helper.ts`) bietet stabile Alternativen fuer haeufige Interaktionen:

| Methode | Ersetzt | Vorteil |
|---------|---------|---------|
| `stableClick()` | `locator.click()` | Retry-Logik, Wait-Before/After, Change-Detection |
| `stableFill()` | `locator.fill()` | Validierung, Blur-Trigger |
| `stableFormSubmit()` | Manueller Submit-Flow | Change-Detection + Success-Verification |
| `closeDialog()` | `btnSchliessen.click()` | Animation-Wait, Retry, Visibility-Check |
| `stableSelectOption()` | Manueller Dropdown-Click | Angular-Material-kompatibel |
| `waitForAngularStable()` | `waitForTimeout()` | DOM-Mutation-basiert, schneller |

## Debugging-Workflow fuer flaky Tests

1. Test lokal mehrmals ausfuehren (5-10x) um das Muster zu identifizieren
2. `STABILITY_VERBOSE_LOGGING=true` setzen fuer detailliertes Logging
3. Fehlerstelle identifizieren (welcher Step schlaegt fehl?)
4. Pruefen: Timing-Problem oder Locator-Problem?
5. Passende Loesung aus dieser Seite anwenden
6. Erneut 5-10x ausfuehren um Stabilitaet zu verifizieren

## Verwandte Seiten

- [[error-solutions]] -- Spezifische Fehlermeldungen und Loesungen
- [[ci-vs-local]] -- CI-spezifische Flaky-Probleme
- [[../05-Patterns/locator-strategies]] -- Stabile Locators
