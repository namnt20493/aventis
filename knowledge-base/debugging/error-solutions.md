# Error-Solutions Mapping

Bekannte Fehler und ihre Loesungen, sortiert nach Fehlermeldung.

## waitForPageReady timed out after 20000ms

### Error Dialog Blocking Page (Zeitraum ueberdeckt)

**Fehlermeldung:**
```
Error: waitForPageReady timed out after 20000ms
```

**Screenshot zeigt:** Error-Dialog "Fehler aufgetreten" mit "Der angegebene Zeitraum ueberdeckt vorhandene Eintraege vollstaendig."

**Ursache:** Der Test versucht eine Position mit einem Datum zu erstellen, das die bestehende Position ueberlappt. Der Error-Dialog blockiert die Seite, `waitForPageReady` wartet endlos.

**Loesung:** Fuer "Folgeposition"-Tests (nachfolgende Positionen) ein ZUKUENFTIGES Datum verwenden:

```typescript
// FALSCH - ueberlappt mit bestehender Position
geplantVon: DateHelper.getTodayDateString()

// RICHTIG - 30 Tage in der Zukunft
geplantVon: DateHelper.getDaysFutureString(30)
```

**Datum:** 2026-04-01
**Test:** R05_GBL_Rahmenbudget_anpassen_Folgeposition

## waitForResponse: Timeout exceeded

### Nach clickRahmenbudgetNavLink / clickNavLink

**Fehlermeldung:**
```
waitForResponse: Timeout 30000ms exceeded while waiting for response matching URL pattern
```

**Ursache:** Keywords wie `clickRahmenbudgetNavLink()` pruefen, ob die Seite bereits geladen ist, und ueberspringen die Navigation. Aber `waitRahmenbudgetQueryAPI()` wartet trotzdem auf eine API-Antwort, die nie kommt (weil keine Navigation stattfand).

**Loesung:** Vor Navigation UND API-Wait pruefen, ob die Seite bereits geladen ist:

```typescript
const alreadyOnRahmenbudget = page.url().includes("/budget/budget");
if (!alreadyOnRahmenbudget) {
    await this.rahmenbudgetPage.clickRahmenbudgetNavLink();
    await this.rahmenbudgetPage.waitRahmenbudgetQueryAPI();
}
```

**Generelles Muster:** Wenn ein Keyword `clickNavLink()` + `waitForApi()` verkettet, muessen BEIDE zusammen durch einen URL-Check geschuetzt werden.

## strict mode violation

### Zu breiter Locator

**Fehlermeldung:**
```
Error: strict mode violation: locator("tbody tr td").filter({ hasText: "Wohnkosten" }) resolved to 8 elements
```

**Ursache:** Der Locator `page.locator("tbody tr td")` ist zu breit. Wenn Detailzeilen (z.B. Wohnkosten-Aufschluesselung) aufgeklappt sind, gibt es mehrere Zellen mit dem gleichen Text.

**Loesung:** Locator einschraenken auf die Hauptzeile:

```typescript
// VORHER (zu breit)
const rowHeader = page.locator("tbody tr td").filter({ hasText: "Wohnkosten" });

// NACHHER (spezifisch)
const rowHeader = page.locator("tbody > tr:first-child > td:nth-child(2)");
```

Siehe auch: [[../05-Patterns/locator-strategies]]

### Mehrere Dialoge/Overlays

**Fehlermeldung:**
```
strict mode violation: getByRole("button", { name: "Speichern" }) resolved to 2 elements
```

**Ursache:** Mehrere Dialoge oder Overlays im DOM, von denen nur einer sichtbar ist.

**Loesung:** Locator auf den sichtbaren Dialog einschraenken:

```typescript
const dialog = page.locator("mat-dialog-container").last();
await dialog.getByRole("button", { name: "Speichern" }).click();
```

## TimeoutError: locator.click

### Element hinter Overlay

**Fehlermeldung:**
```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log: waiting for locator('...') to be visible
```

**Ursache:** Das Element ist im DOM vorhanden, aber durch ein Overlay (Loading-Spinner, Dialog-Backdrop) verdeckt.

**Loesungen:**

1. Warten bis Overlay verschwindet:
```typescript
await page.getByTestId("loading-spinner").waitFor({ state: "hidden" });
await targetElement.click();
```

2. `waitForPageReady()` verwenden:
```typescript
await commonKeyword.waitForApplicationReady();
await targetElement.click();
```

3. Als letzte Option `force: true`:
```typescript
await targetElement.click({ force: true });
```

### Element noch nicht gerendert

**Ursache:** Angular-Change-Detection hat das Element noch nicht gerendert.

**Loesung:**
```typescript
await targetElement.waitFor({ state: "visible" });
await targetElement.click();
```

## Navigation Timing Issues

### Seite laedt nach Navigation nicht vollstaendig

**Fehlermeldung:**
```
TimeoutError: page.goto: Timeout 60000ms exceeded.
```

**Ursache:** Langsame Server-Antwort oder Heavy-Page mit vielen API-Calls.

**Loesungen:**

1. `waitForPageReady()` nach Navigation:
```typescript
await page.goto(url);
await commonKeyword.waitForApplicationReady();
```

2. `GoTo_Dossier_With_Url` verwenden (hat eingebautes Warten):
```typescript
await commonKeyword.GoTo_Dossier_With_Url(dossierId);
```

## Search Input triggert nicht

**Fehlermeldung:** Kein Fehler, aber Suchergebnisse erscheinen nicht.

**Ursache:** `pressSequentially()` triggert nicht immer Angular-Change-Detection. Die Suche wird nicht ausgeloest.

**Loesung:** `fill()` + `Enter` verwenden:

```typescript
// FALSCH
await searchInput.pressSequentially("Suchbegriff");

// RICHTIG
await searchInput.fill("Suchbegriff");
await searchInput.press("Enter");
```

## Save-Button bleibt disabled

**Fehlermeldung:** Kein Fehler, aber der Speichern-Button ist nicht klickbar.

**Ursache:** Angular-Formular ist noch im "pristine"-Zustand. `fill()` allein markiert das Formular nicht immer als "dirty".

**Loesungen:**

1. `triggerChangeDetection` nutzen:
```typescript
await stabilityHelper.stableClick(saveButton, {
    triggerChangeDetection: true
});
```

2. `forceAngularFormUpdate()` als Fallback:
```typescript
await stabilityHelper.forceAngularFormUpdate();
await saveButton.click();
```

3. `stableFormSubmit()` fuer zuverlaessiges Absenden:
```typescript
await stabilityHelper.stableFormSubmit(saveButton, successToast);
```

## Dialog schliesst nicht

**Fehlermeldung:**
```
TimeoutError: locator.click: Timeout exceeded
```
beim Klick auf den Schliessen-Button eines Dialogs.

**Ursache:** Animation des Dialogs, Timing-Problem zwischen Click und DOM-Update.

**Loesung:** `closeDialog()` des StabilityHelpers verwenden:

```typescript
// Statt manuell:
// await this.btnSchliessen.click();

// StabilityHelper verwenden:
await stabilityHelper.closeDialog();
// Oder mit Cancel-Button:
await stabilityHelper.closeDialogWithCancel();
```

## expect()-Assertion schlaegt fehl

### Wert stimmt nicht nach API-Setup

**Ursache:** API hat die Daten erstellt, aber die UI hat noch nicht aktualisiert.

**Loesung:** Seite neu laden oder auf spezifische API-Response warten:

```typescript
await page.reload();
await commonKeyword.waitForApplicationReady();
await expect(element).toHaveText("Erwarteter Wert");
```

### Betraege stimmen nicht (z.B. Wohnkosten)

**Ursache:** Das System begrenzt Wohnkosten auf Richtlinien-Werte (~650 CHF fuer Einzelperson). Der eingegebene Wert (z.B. 1800 CHF) wird nicht 1:1 uebernommen.

**Loesung:** Den vom System berechneten Wert verwenden, nicht den eingegebenen.

## Verwandte Seiten

- [[flaky-tests]] -- Wiederholbare Timing-Probleme
- [[ci-vs-local]] -- Umgebungsspezifische Fehler
- [[../05-Patterns/locator-strategies]] -- Locator-Best-Practices
- [[../05-Patterns/date-handling]] -- Datumsfehler vermeiden
