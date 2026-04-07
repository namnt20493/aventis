# Migrate Page to BasePage (Page Object zu BasePage migrieren)

Migriere eine existierende Page-Klasse zur BasePage-Architektur für verbesserte Stabilität und Konsistenz.

## When to Use This Skill

Verwende diesen Skill wenn:
- Eine neue Page erstellt werden soll (ALWAYS use BasePage)
- Eine bestehende Page bekannte Stabilitätsprobleme hat (flaky tests, timing issues)
- Eine Page gerade refactored wird (good opportunity for migration)
- Der User explizit nach BasePage-Migration fragt

**Wann NICHT migrieren:**
- Utility-Klassen ohne Browser-Interaktionen (DateHelper, TestDataGenerator)
- API-only Pages
- Stabile, gut funktionierende Pages ohne Probleme (unnecessary risk)

## Out of Scope

- Do NOT use `PageObjectBase` from `libs/pages-v2/` or `libs/core/` — that is the "modernes Framework" architecture and is only used when explicitly requested
- Do NOT create new keyword or test files — this skill only migrates page objects
- Do NOT change the public API of a page (method signatures must stay the same)

## Arguments

- Page-Name oder Dateipfad (z.B. "UserProfilePage" oder "libs/pages/user-profile-page.ts")

## BasePage-Architektur Übersicht

### Was ist BasePage?

`BasePage` ist die Foundation-Klasse für alle Page Objects. Sie bietet:
- **Automatisches Angular Hydration Handling** - Wartet auf Framework-Stabilität
- **Built-in Retry Logic** - Aktionen werden automatisch bei transienten Fehlern wiederholt
- **Konsistente API** - Alle Pages nutzen dieselben Methoden
- **Reduzierter Boilerplate** - Kein manuelles StabilityHelper-Management

### Verfügbare Protected Methods

BasePage stellt folgende stability-enhanced Methoden bereit:

#### Click Operations
```typescript
protected async click(locator: Locator, options?: ClickOptions): Promise<void>
```
- Wartet auf Angular-Stabilität
- Retries bei Fehlern (default: 3x)
- Options: `timeout`, `retries`, `waitBefore`, `waitAfter`, `force`, `verifyAction`

#### Fill Operations
```typescript
protected async fill(locator: Locator, value: string, options?: FillOptions): Promise<void>
```
- Wartet auf Angular-Stabilität
- Validiert Input-Wert nach dem Füllen
- Options: `timeout`, `retries`, `clearFirst`, `validate`

#### Dropdown Selection
```typescript
protected async selectOption(dropdownLocator: Locator, optionName: string, options?: SelectOptions): Promise<void>
```
- Handled Material Dropdowns und native Selects
- Retry-Logic bis Option ausgewählt ist
- Verifiziert erfolgreiche Selektion

#### Dialog Operations
```typescript
protected async openDialog(triggerLocator: Locator, options?: {...}): Promise<void>
protected async closeDialog(options?: {...}): Promise<void>
protected async closeDialogWithCancel(options?: {...}): Promise<void>
```
- Stellt sicher, dass Dialog tatsächlich geöffnet/geschlossen wird
- Wartet auf Dialog-Animationen

#### Form Submission
```typescript
protected async submitForm(
    submitButton: Locator,
    successIndicator: Locator | (() => Promise<void>),
    options?: {...}
): Promise<void>
```
- Stellt sicher, dass Button enabled ist
- Verifiziert Submit-Erfolg via Locator oder Function
- Retry bei transienten Fehlern

#### Table Interactions
```typescript
protected async clickTableRow(
    tableLocator: Locator,
    rowIdentifier: string | RegExp,
    options?: {...}
): Promise<void>
```
- Wartet auf Tabellen-Daten
- Findet Row via Text oder RegExp
- Nutzt stable click

#### Wait Operations
```typescript
protected async waitForReady(): Promise<void>
protected async prepareForInteraction(locator: Locator): Promise<void>
protected async waitForElementStability(locator: Locator, options?: {...}): Promise<void>
```

#### Advanced Operations
```typescript
protected async retryAction(
    action: () => Promise<void>,
    verify: () => Promise<void>,
    options?: {...}
): Promise<void>

protected async dragAndDrop(
    source: Locator,
    target: Locator,
    options?: {...}
): Promise<boolean>
```

## Migrations-Checkliste

### Phase 1: Analyse (ALWAYS DO THIS FIRST)

- [ ] **Lies die bestehende Page-Klasse vollständig**
- [ ] **Identifiziere alle public methods** (diese müssen erhalten bleiben)
- [ ] **Prüfe Abhängigkeiten** - Welche Keywords/Tests nutzen diese Page?
- [ ] **Suche nach Stabilitätsproblemen** - Hat die Page `waitForTimeout`, manuelle Retries, etc.?
- [ ] **Entscheide: Full Migration vs. Gradual Migration** (siehe unten)

### Phase 2: Backup & Setup

- [ ] **Erstelle Backup** (optional, da Git vorhanden)
- [ ] **Prüfe zugehörige Tests** - Sind Tests vorhanden die diese Page nutzen?
- [ ] **Import hinzufügen**: `import { BasePage } from "./base-page";`

### Phase 3: Klassen-Struktur Ändern

#### Vorher (Alt):
```typescript
export class UserProfilePage {
    page: Page;
    private stabilityHelper: StabilityHelper;

    constructor(page: Page) {
        this.page = page;
        this.stabilityHelper = new StabilityHelper(page);
        // Locators...
    }
}
```

#### Nachher (Neu):
```typescript
export class UserProfilePage extends BasePage {
    // page und stability sind bereits vorhanden durch BasePage
    // Nur noch Locators definieren

    constructor(page: Page) {
        super(page); // WICHTIG: super() MUSS als erstes aufgerufen werden
        // Locators...
    }
}
```

**Regeln:**
- [ ] **Entferne `page: Page` Property** (geerbt von BasePage als `protected page`)
- [ ] **Entferne `private stabilityHelper: StabilityHelper`** (geerbt als `protected stability`)
- [ ] **Entferne `this.stabilityHelper = new StabilityHelper(page)`** aus Constructor
- [ ] **Füge `super(page)` hinzu** als ERSTE Zeile im Constructor
- [ ] **Ändere Klassendeklaration** zu `extends BasePage`

### Phase 4: Method-Calls Ersetzen

Ersetze direkte Playwright-Calls und StabilityHelper-Aufrufe durch BasePage-Methoden:

#### Click Operations

**Vorher:**
```typescript
await this.page.locator("#btn").click();
// ODER
await this.stabilityHelper.stableClick(this.saveButton);
```

**Nachher:**
```typescript
await this.click(this.saveButton);
```

#### Fill Operations

**Vorher:**
```typescript
await this.nameInput.fill("Max");
// ODER
await this.stabilityHelper.stableFill(this.nameInput, "Max");
```

**Nachher:**
```typescript
await this.fill(this.nameInput, "Max");
```

#### Dropdown Selection

**Vorher:**
```typescript
await this.dropdown.click();
await this.page.getByRole("option", { name: "Option" }).click();
// ODER
await this.stabilityHelper.stableSelectOption(this.dropdown, "Option");
```

**Nachher:**
```typescript
await this.selectOption(this.dropdown, "Option");
```

#### Dialog Operations

**Vorher:**
```typescript
await this.openButton.click();
await this.page.waitForTimeout(300);
await expect(this.page.locator("mat-dialog-container")).toBeVisible();
// ODER
await this.stabilityHelper.stableOpenDialog(this.openButton);
```

**Nachher:**
```typescript
await this.openDialog(this.openButton);
```

#### Form Submission

**Vorher:**
```typescript
await this.saveButton.click();
await this.page.waitForTimeout(2000);
await expect(this.successToast).toBeVisible();
// ODER
await this.stabilityHelper.stableFormSubmit(this.saveButton, this.successToast);
```

**Nachher:**
```typescript
await this.submitForm(this.saveButton, this.successToast);
```

#### Wait Operations

**Vorher:**
```typescript
await this.page.waitForLoadState("networkidle");
await this.page.waitForTimeout(500);
// ODER
await this.stabilityHelper.waitForPageStability();
await this.stabilityHelper.waitForAngularStable();
```

**Nachher:**
```typescript
await this.waitForReady();
```

### Phase 5: Verbesserungen Hinzufügen

Nach der Basis-Migration, füge Verbesserungen hinzu wo sinnvoll:

#### Success Verification für Form Submits

**Vorher (keine Verification):**
```typescript
async save(): Promise<void> {
    await this.click(this.saveButton);
}
```

**Nachher (mit Success Verification):**
```typescript
async save(): Promise<void> {
    await this.submitForm(
        this.saveButton,
        this.successToast, // Oder: async () => { await expect(this.page.url()).toContain("/success"); }
        { timeout: 15000 }
    );
}
```

#### Retry-Logic für komplexe Operationen

**Vorher:**
```typescript
async waitForUserToAppear(userName: string): Promise<void> {
    await this.page.waitForTimeout(2000);
    await expect(this.userTable.getByText(userName)).toBeVisible();
}
```

**Nachher:**
```typescript
async waitForUserToAppear(userName: string): Promise<void> {
    await this.retryAction(
        async () => {
            await this.page.reload(); // Action: Refresh
        },
        async () => {
            await expect(this.userTable.getByText(userName)).toBeVisible({ timeout: 1000 }); // Verify
        },
        { timeout: 10000, intervals: [500, 1000, 2000] }
    );
}
```

### Phase 6: Testing & Validation

- [ ] **Führe zugehörige Tests aus** - Prüfe, dass keine Regression auftritt
- [ ] **Teste kritische Flows** - Fokus auf Form-Submits, Dialogs, Dropdowns
- [ ] **Prüfe Error-Handling** - Werden Fehler korrekt propagiert?
- [ ] **Performance Check** - Sind Tests schneller/langsamer? (sollten ähnlich sein)

## Migrations-Strategien

### Strategie 1: Full Migration (Empfohlen für neue/kleine Pages)

**Wann verwenden:**
- Neue Page erstellen
- Kleine Page (<200 Zeilen)
- Page mit wenigen Dependencies
- Page mit bekannten Stabilitätsproblemen

**Schritte:**
1. Backup erstellen
2. Klassenstruktur ändern (siehe Phase 3)
3. Alle Method-Calls ersetzen (siehe Phase 4)
4. Tests ausführen
5. Commit

### Strategie 2: Gradual Migration (Empfohlen für große/kritische Pages)

**Wann verwenden:**
- Große Page (>200 Zeilen)
- Viele Dependencies (>5 Keywords nutzen die Page)
- Kritische Page (in vielen Tests verwendet)
- Risiko-averse Situation

**Schritte:**
1. Füge BasePage als Helper-Property hinzu (OHNE extends):
```typescript
export class ExistingPage {
    page: Page;
    private stability: StabilityHelper;
    private basePage: BasePage; // NEU: Helper

    constructor(page: Page) {
        this.page = page;
        this.stability = new StabilityHelper(page);
        this.basePage = new BasePage(page); // NEU
    }

    // Nutze BasePage-Methoden über Helper
    async saveData(): Promise<void> {
        await this.basePage["submitForm"](
            this.saveButton,
            this.successToast
        );
    }
}
```

2. Nach und nach Methods auf `this.basePage["method"]()` umstellen
3. Wenn alle Methods migriert sind, zu Full Migration wechseln (extends BasePage)

### Strategie 3: No Migration (Bestehende Page beibehalten)

**Wann verwenden:**
- Page funktioniert stabil ohne Probleme
- Page wird selten geändert
- Hohe Anzahl an Dependencies
- Keine Zeit für Testing

**Alternative:**
- Nutze StabilityHelper direkt weiter
- Alle Stability-Features sind auch über StabilityHelper verfügbar
- BasePage ist nur eine convenience-Schicht darüber

## Typische Probleme & Lösungen

### Problem 1: `this.page` ist nicht mehr accessible

**Error:**
```
Property 'page' is private and only accessible within class 'BasePage'
```

**Ursache:** BasePage hat `page` als `protected`, nicht `public`

**Lösung:** Page sollte nicht direkt außerhalb der Klasse verwendet werden. Wenn nötig:
- Erstelle eine getter-Methode: `getPage(): Page { return this.page; }`
- Oder erstelle spezifische Methods für die benötigte Funktionalität

### Problem 2: `this.stability` nicht gefunden

**Error:**
```
Property 'stability' does not exist on type 'MyPage'
```

**Ursache:** Nach Migration zu BasePage ist `stability` protected, nicht mehr als eigene Property

**Lösung:** Verwende BasePage-Methoden direkt statt `this.stability.method()`:
```typescript
// Vorher
await this.stability.stableClick(locator);

// Nachher
await this.click(locator);
```

### Problem 3: Bestehende Keywords/Tests funktionieren nicht mehr

**Error:** Tests brechen nach Migration

**Ursache:** Public API der Page hat sich geändert

**Lösung:**
1. Prüfe welche public methods existierten
2. Stelle sicher, dass alle public methods weiterhin existieren
3. Interne Implementation kann sich ändern, aber public API muss gleich bleiben

**Beispiel:**
```typescript
// Public API MUSS gleich bleiben
export class UserPage extends BasePage {
    // Alte Signatur beibehalten
    async fillName(name: string): Promise<void> {
        // Neue Implementation mit BasePage
        await this.fill(this.nameInput, name);
    }
}
```

### Problem 4: Tests sind langsamer nach Migration

**Ursache:** BasePage wartet auf Angular-Stabilität bei jeder Interaktion

**Lösung:**
- Das ist GEWOLLT für bessere Stabilität
- Wenn Performance kritisch: Nutze `waitAfter: 0` Option
- Oder verwende API-Setup statt GUI (viel schneller)

```typescript
// Schnellere Clicks (aber potenziell weniger stabil)
await this.click(this.button, { waitAfter: 0, waitBefore: 0 });
```

### Problem 5: Dialog wird nicht geöffnet

**Error:** `Dialog not visible after trigger`

**Lösung:** Nutze `openDialog()` statt direktem click:
```typescript
// Vorher (unzuverlässig)
await this.click(this.openDialogButton);
await expect(this.page.locator("mat-dialog-container")).toBeVisible();

// Nachher (zuverlässig)
await this.openDialog(this.openDialogButton);
```

## Vollständiges Migrations-Beispiel

### Vorher (Alte Page):

```typescript
import { Page, Locator, expect } from "@playwright/test";
import { StabilityHelper } from "@utils/stability-helper";

export class UserProfilePage {
    page: Page;
    private stabilityHelper: StabilityHelper;
    private firstNameInput: Locator;
    private lastNameInput: Locator;
    private roleDropdown: Locator;
    private saveButton: Locator;
    private successToast: Locator;

    constructor(page: Page) {
        this.page = page;
        this.stabilityHelper = new StabilityHelper(page);
        this.firstNameInput = page.locator("#firstName");
        this.lastNameInput = page.locator("#lastName");
        this.roleDropdown = page.locator("#role");
        this.saveButton = page.getByRole("button", { name: "Speichern" });
        this.successToast = page.locator(".toast-success");
    }

    async fillFirstName(firstName: string): Promise<void> {
        await this.firstNameInput.fill(firstName);
        await this.page.waitForTimeout(200);
    }

    async fillLastName(lastName: string): Promise<void> {
        await this.stabilityHelper.stableFill(this.lastNameInput, lastName);
    }

    async selectRole(role: string): Promise<void> {
        await this.roleDropdown.click();
        await this.page.waitForTimeout(200);
        await this.page.getByRole("option", { name: role }).click();
        await this.page.waitForTimeout(300);
    }

    async save(): Promise<void> {
        await this.saveButton.click();
        await this.page.waitForTimeout(2000);
    }

    async fillUserDetails(firstName: string, lastName: string, role: string): Promise<void> {
        await this.fillFirstName(firstName);
        await this.fillLastName(lastName);
        await this.selectRole(role);
    }
}
```

### Nachher (Migriert zu BasePage):

```typescript
import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base-page";

export class UserProfilePage extends BasePage {
    // page und stability sind bereits von BasePage geerbt
    private firstNameInput: Locator;
    private lastNameInput: Locator;
    private roleDropdown: Locator;
    private saveButton: Locator;
    private successToast: Locator;

    constructor(page: Page) {
        super(page); // WICHTIG: super() als erstes
        this.firstNameInput = page.locator("#firstName");
        this.lastNameInput = page.locator("#lastName");
        this.roleDropdown = page.locator("#role");
        this.saveButton = page.getByRole("button", { name: "Speichern" });
        this.successToast = page.locator(".toast-success");
    }

    async fillFirstName(firstName: string): Promise<void> {
        // Nutze BasePage's fill() - automatisch mit stability
        await this.fill(this.firstNameInput, firstName);
    }

    async fillLastName(lastName: string): Promise<void> {
        await this.fill(this.lastNameInput, lastName);
    }

    async selectRole(role: string): Promise<void> {
        // Nutze BasePage's selectOption() - automatisch mit retry
        await this.selectOption(this.roleDropdown, role);
    }

    async save(): Promise<void> {
        // Nutze submitForm() mit Success-Verification!
        await this.submitForm(
            this.saveButton,
            this.successToast, // Verifiziert, dass Toast erscheint
            { timeout: 15000 }
        );
    }

    async fillUserDetails(firstName: string, lastName: string, role: string): Promise<void> {
        await this.fillFirstName(firstName);
        await this.fillLastName(lastName);
        await this.selectRole(role);
    }
}
```

**Verbesserungen in der migrierten Version:**
1. ✅ Weniger Boilerplate (kein `page` und `stabilityHelper` Management)
2. ✅ Automatische Angular-Stabilität bei allen Interaktionen
3. ✅ Dropdown-Auswahl mit Built-in Retry
4. ✅ Form-Submit mit Success-Verification
5. ✅ Keine manuellen `waitForTimeout()` mehr
6. ✅ Konsistente API mit anderen Pages

## Best Practices

### DO ✅

1. **IMMER BasePage für neue Pages verwenden**
2. **Public API beibehalten** - Interne Implementation kann sich ändern
3. **Success Indicators verwenden** - Immer verifizieren, dass Aktionen erfolgreich waren
4. **Descriptive method names** - `fillUserName()` nicht `fill()`
5. **Locators private halten** - Nur high-level methods public machen
6. **Options nutzen** wenn nötig - Timeouts, Retries, etc. sind konfigurierbar

### DON'T ❌

1. **NICHT direkt `this.page` verwenden** wenn BasePage-Method existiert
2. **NICHT `this.stability` direkt aufrufen** - Nutze BasePage-Methods
3. **NICHT manuelle Waits hinzufügen** - BasePage handled timing
4. **NICHT alle Pages auf einmal migrieren** - Schrittweise vorgehen
5. **NICHT public API ändern** ohne Keywords/Tests anzupassen
6. **NICHT StabilityHelper bypassen** - Das sind die Stability-Features!

## Validierung nach Migration

### Checkliste:

- [ ] **Alle Tests grün** - Keine Regression
- [ ] **Keine `waitForTimeout()` mehr** in der Page (außer in sehr speziellen Fällen)
- [ ] **Alle Form-Submits haben Success Indicators**
- [ ] **Dropdown-Auswahlen nutzen `selectOption()`**
- [ ] **Dialog-Operationen nutzen `openDialog()` / `closeDialog()`**
- [ ] **Keine direkten `locator.click()` mehr** - Alle über `this.click()`
- [ ] **Code ist sauberer** - Weniger Boilerplate, mehr Intent

### Performance-Check:

```bash
# Führe Tests mehrfach aus, um Stabilität zu verifizieren
npx playwright test path/to/test.spec.ts --repeat-each=5

# Prüfe, dass keine Flakiness entsteht
npx playwright test path/to/test.spec.ts --workers=1
```

## Related Documentation

- [BasePage Usage Guide](../../libs/pages/README-BasePage.md) - Vollständige BasePage-Dokumentation
- [Hydration Stability Plan](../../docs/HYDRATION_STABILITY_PLAN.md) - Background und Motivation
- [StabilityHelper API](../../libs/utils/stability-helper.ts) - Low-Level API
- [Test Fixtures](../../libs/test-fixtures.ts) - Global Hooks und Setup

## Schritt-für-Schritt Prozess (Zusammenfassung)

Wenn der User eine Page migrieren möchte:

1. **Lies die Page-Datei** vollständig
2. **Identifiziere public methods** die erhalten bleiben müssen
3. **Entscheide Migration-Strategie** (Full vs. Gradual)
4. **Erstelle Backup** (optional bei Git)
5. **Ändere Klassenstruktur**: `extends BasePage`, `super(page)`
6. **Entferne**: `page: Page`, `stabilityHelper: StabilityHelper`, deren Initialisierung
7. **Ersetze Method-Calls**:
   - `locator.click()` → `this.click(locator)`
   - `locator.fill()` → `this.fill(locator, value)`
   - `stableSelectOption()` → `this.selectOption()`
   - `waitForTimeout()` → `this.waitForReady()` oder entfernen
8. **Füge Verbesserungen hinzu**: Success indicators, retry logic
9. **Teste gründlich** mit zugehörigen Tests
10. **Commit** wenn alles grün ist

---

**Migration Status Tracking:**

Für jede Page-Migration, dokumentiere:
- ✅ Migrierte Pages: [Liste führen in CLAUDE.md oder separatem Dokument]
- ⏸️ Pages mit Stabilitätsproblemen (Migration-Kandidaten)
- ❌ Pages die NICHT migriert werden sollen (stable, rarely changed)
