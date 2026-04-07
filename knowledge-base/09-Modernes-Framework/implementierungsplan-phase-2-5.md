# Implementierungsplan Phase 2.5 -- Framework-Modernisierung

Erstellt: 2026-03-13
Basis: [[architektur]] (ADR-1 bis ADR-8), [[interne-studien]], [[externe-studien]]

> **Status: ABGESCHLOSSEN** (2026-03-13)
> Alle 8 Schritte sind implementiert und validiert. TypeScript kompiliert fehlerfrei.
> Neue Methoden-Namen (ohne Async-Suffix) sind aktiv, alte Namen als `@deprecated` Aliases verfuegbar.

---

## Grundprinzip

**Keine Aenderung darf bestehende Keyword-Validation-Tests brechen.**

- `libs/pages/` (Legacy) wird NICHT angefasst
- `libs/keywords/` wird NICHT angefasst
- `staticTestcases/Keywordvalidation/` wird NICHT angefasst
- Alle Aenderungen betreffen nur `libs/core/`, `libs/pages-v2/`, `libs/test-fixtures.ts`
- Validierung erfolgt ausschliesslich ueber **Functional UI Tests** in `staticTestcases/FunctionalUI/`

---

## Bestehender Functional UI Test (Baseline)

```
staticTestcases/FunctionalUI/NavigationPage_MenuNavigation.spec.ts
staticTestcases/Debug/ControlsDemo.spec.ts
```

Diese Tests nutzen pages-v2 (LoginPage, NavigationPage) und Controls direkt. Sie dienen als **Regressionstest** nach jeder Aenderung.

---

## Uebersicht: 8 Schritte

| # | Massnahme | Dateien | Validierung | ADR | Status |
|---|-----------|---------|-------------|-----|--------|
| 1 | `description` Property auf Controls | control-base.ts, alle Controls, Interfaces | Unit-artig: ControlsDemo.spec.ts | ADR-8 | DONE |
| 2 | `executeWithContext()` in ControlBase | control-base.ts | FunctionalUI Tests (Error-Enrichment bei Failure) | ADR-8 | DONE |
| 3 | `@step` Decorator | libs/core/decorators/step.ts (neu) | FunctionalUI Tests (HTML-Report pruefen) | ADR-8 | DONE |
| 4 | Async-Suffix entfernen | Alle Interfaces + Controls + pages-v2 | Alle FunctionalUI Tests | ADR-7 | DONE |
| 5 | ServiceContext als Fixture | test-fixtures.ts, PageObjectBase | FunctionalUI Tests | ADR-5 | DONE |
| 6 | IStabilityService erweitern | IStabilityService.ts, StabilityHelper | FunctionalUI Test (neuer Test) | ADR-4 | DONE |
| 7 | CommonPage-Services erstellen | libs/core/services/ (neu) | FunctionalUI Test (neuer Test) | ADR-6 | DONE |
| 8 | Table + Tab Controls | libs/core/controls/ + interfaces/ (neu) | FunctionalUI Test (neuer Test) | Control-Coverage | DONE |

---

## Schritt 1: `description` Property auf Controls

### Ziel
Jedes Control traegt eine menschenlesbare Beschreibung fuer bessere Fehlermeldungen und Reports.

### Aenderungen

**1a. IControl erweitern:**
```typescript
// libs/core/interfaces/IControl.ts
export interface IControl {
    readonly description: string;   // NEU
    readonly element: Locator;      // NEU (bereits in ControlBase, aber nicht im Interface)
    // ... bestehende Methoden
}
```

**1b. ControlBase anpassen:**
```typescript
// libs/core/controls/control-base.ts
export abstract class ControlBase implements IControl {
    readonly description: string;

    constructor(page: Page, locator: Locator, services?: IServiceContext, description?: string) {
        // ... bestehend
        this.description = description ?? this.deriveDescription(locator);
    }

    private deriveDescription(locator: Locator): string {
        return locator.toString();  // Playwright gibt "[data-testid=xxx]" zurueck
    }
}
```

**1c. Factory-Methods aktualisieren (Button als Beispiel):**
```typescript
// libs/core/controls/button.ts
static byTestId(page: Page, testId: string, services?: IServiceContext): Button {
    return new Button(page, page.getByTestId(testId), services, `Button[testId="${testId}"]`);
}
static byName(page: Page, name: string, exact = false, services?: IServiceContext): Button {
    return new Button(page, page.getByRole("button", { name, exact }), services, `Button[name="${name}"]`);
}
```

**Gleiches Muster fuer:** TextInput, Dropdown, Checkbox, DatePicker, Link

**1d. PageObjectBase Factory-Methods weitergeben:**
```typescript
// libs/core/base/page-object-base.ts
protected button(testId: string): IButton {
    return Button.byTestId(this.page, testId, this.services);
    // description wird automatisch von Factory gesetzt
}
```

### Validierung
- `npx playwright test staticTestcases/Debug/ControlsDemo.spec.ts --headed --workers 1`
- `npx playwright test staticTestcases/FunctionalUI/ --headed --workers 1`

### Risiko
KEINS -- rein additiv. Bestehende Signatur bleibt abwaertskompatibel (description ist optional).

---

## Schritt 2: `executeWithContext()` in ControlBase

### Ziel
Fehler werden automatisch mit Control-Typ, Action, Locator und Page-URL angereichert.

### Aenderungen

**2a. Methode in ControlBase:**
```typescript
// libs/core/controls/control-base.ts
protected async executeWithContext<T>(actionName: string, fn: () => Promise<T>): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        const enrichedMessage = [
            `[${this.constructor.name}] ${actionName}() failed on "${this.description}"`,
            `  Element: ${this.locator.toString()}`,
            `  Page URL: ${this.page.url()}`,
            error instanceof Error ? `  Reason: ${error.message}` : `  Reason: ${String(error)}`
        ].join("\n");

        const enrichedError = new Error(enrichedMessage);
        enrichedError.stack = error instanceof Error ? error.stack : undefined;
        throw enrichedError;
    }
}
```

**2b. In Button-Methoden anwenden (Beispiel):**
```typescript
// libs/core/controls/button.ts
async clickAsync(): Promise<void> {
    await this.executeWithContext("click", () => this.locator.click());
}

async clickStableAsync(options?: IButtonClickOptions): Promise<void> {
    await this.executeWithContext("clickStable", () => this.stability.stableClick(this.locator, options));
}
```

**Gleiches Muster fuer alle Methoden in:** TextInput, Dropdown, Checkbox, DatePicker, Link

### Validierung
- Bestehende FunctionalUI-Tests muessen WEITERHIN bestehen (Happy Path: 0ms Overhead)
- Neuer Test: Absichtlich fehlerhaften Locator verwenden, pruefen ob enriched Error Message erscheint

### Risiko
NIEDRIG -- nur Fehlerfall betroffen. Happy Path unveraendert.

---

## Schritt 3: `@step` Decorator

### Ziel
Jede Control-Methode erscheint als benannter Step im Playwright HTML-Report.

### Aenderungen

**3a. Decorator erstellen:**
```typescript
// libs/core/decorators/step.ts
import { test } from "@playwright/test";

export function step(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (this: any, ...args: any[]) {
        const description = this.description ?? this.constructor.name;
        const stepName = `${description}.${propertyKey}(${args.map(a => JSON.stringify(a)).join(", ")})`;
        return await test.step(stepName, async () => {
            return await originalMethod.apply(this, args);
        });
    };
    return descriptor;
}
```

**3b. Decorator auf Control-Methoden anwenden:**
```typescript
// libs/core/controls/button.ts
import { step } from "@core/decorators/step";

export class Button extends ControlBase implements IButton {
    @step
    async clickAsync(): Promise<void> {
        await this.executeWithContext("click", () => this.locator.click());
    }

    @step
    async clickStableAsync(options?: IButtonClickOptions): Promise<void> {
        await this.executeWithContext("clickStable", () => this.stability.stableClick(this.locator, options));
    }
    // ... alle public async Methoden
}
```

**Gleiches Muster fuer:** TextInput, Dropdown, Checkbox, DatePicker, Link

**3c. tsconfig.json pruefen:**
```json
{
    "compilerOptions": {
        "experimentalDecorators": true  // Muss true sein
    }
}
```

**3d. Barrel-Export:**
```typescript
// libs/core/decorators/index.ts
export { step } from "./step";
```

### Validierung
- FunctionalUI-Tests ausfuehren, HTML-Report oeffnen
- Pruefen: Steps sind als "Button[testId=...].clickAsync()" sichtbar
- Performance: Kein messbarer Overhead (test.step ist near-zero-cost)

### Risiko
NIEDRIG -- Decorator ist additiv. Wenn `experimentalDecorators` schon an ist: kein Risiko. Falls nicht: pruefen ob Legacy-Code betroffen ist (sollte nicht sein, da Legacy keine Decorators nutzt).

---

## Schritt 4: Async-Suffix entfernen (ADR-7)

### Ziel
`clickAsync()` -> `click()`, `fillAsync()` -> `fill()`, etc. TypeScript-Standard.

### Strategie: Deprecation + Alias

Nicht sofort entfernen, sondern erst Aliase einfuehren, dann spaeter alte Namen entfernen.

### Aenderungen

**4a. Interfaces: Neue Methoden hinzufuegen (alte behalten, deprecated markieren):**
```typescript
// libs/core/interfaces/IButton.ts
export interface IButton extends IControl {
    // Neue Namen (Standard)
    click(): Promise<void>;
    forceClick(): Promise<void>;
    doubleClick(): Promise<void>;
    rightClick(): Promise<void>;
    hover(): Promise<void>;
    clickStable(options?: IButtonClickOptions): Promise<void>;

    // Alte Namen (deprecated, aber noch vorhanden)
    /** @deprecated Use click() instead */
    clickAsync(): Promise<void>;
    /** @deprecated Use forceClick() instead */
    forceClickAsync(): Promise<void>;
    // ...
}
```

**4b. Implementierung: Aliases in Button:**
```typescript
// libs/core/controls/button.ts
@step async click(): Promise<void> {
    await this.executeWithContext("click", () => this.locator.click());
}

/** @deprecated Use click() instead */
async clickAsync(): Promise<void> { return this.click(); }
```

**4c. Gleiches Muster fuer alle Interfaces und Controls:**

| Interface | Methoden umbenennen |
|-----------|-------------------|
| IControl | isVisibleAsync->isVisible, waitForVisibleAsync->waitForVisible, shouldBeVisible bleibt |
| IButton | clickAsync->click, clickStableAsync->clickStable, hoverAsync->hover |
| ITextInput | fillAsync->fill, clearAsync->clear, getValueAsync->getValue |
| IDropdown | selectByTextAsync->selectByText, selectStableAsync->selectStable |
| ICheckbox | checkAsync->check, uncheckAsync->uncheck, isCheckedAsync->isChecked |
| IDatePicker | fillDateAsync->fillDate |
| ILink | clickAsync->click, getHrefAsync->getHref |

**4d. pages-v2 auf neue Namen umstellen:**
```typescript
// libs/pages-v2/navigation-page.ts
await this.mainMenuButton.click();  // statt clickAsync()
```

**4e. FunctionalUI-Tests auf neue Namen umstellen:**
```typescript
// staticTestcases/FunctionalUI/NavigationPage_MenuNavigation.spec.ts
await nav.mainMenuButton.shouldBeVisible({ timeout: 15000 });  // bleibt (kein Async-Suffix)
```

### Validierung
- `npx playwright test staticTestcases/FunctionalUI/ --headed --workers 1`
- `npx playwright test staticTestcases/Debug/ControlsDemo.spec.ts --headed --workers 1`
- Keyword-Validation-Tests: NICHT betroffen (nutzen Legacy pages/, nicht pages-v2)

### Risiko
MITTEL -- Groesster Refactoring-Schritt. Aber durch Alias-Strategie ist Abwaertskompatibilitaet fuer ControlsDemo.spec.ts (das noch alte Namen nutzt) gewaehrleistet. ControlsDemo.spec.ts erst am Ende umstellen.

---

## Schritt 5: ServiceContext als Fixture (ADR-5)

### Ziel
DI-Dualitaet aufloesen: `services: IServiceContext` als Playwright Fixture bereitstellen.

### Aenderungen

**5a. Fixture in test-fixtures.ts hinzufuegen:**
```typescript
// libs/test-fixtures.ts
import { ServiceContext } from "@core/services";
import { IServiceContext } from "@core/interfaces";

type Fixtures = {
    seed: number;
    baseURL: string | undefined;
    authenticatedRequest: APIRequestContext;
    stabilityHelper: StabilityHelper;
    services: IServiceContext;           // NEU
};

export const test = base.extend<Fixtures>({
    // ... bestehende Fixtures

    services: async ({ page }, use) => {
        const ctx = ServiceContext.for(page);
        await use(ctx);
    },
});
```

**5b. PageObjectBase akzeptiert optionalen ServiceContext:**
```typescript
// libs/core/base/page-object-base.ts
constructor(page: Page, services?: IServiceContext) {
    this.page = page;
    this.services = services ?? ServiceContext.for(page);
    this.stability = this.services.stability;
}
```

**5c. FunctionalUI-Tests koennen services nutzen:**
```typescript
// staticTestcases/FunctionalUI/NavigationPage_MenuNavigation.spec.ts
async ({ page, services }) => {
    const loginPage = new LoginPage(page, services);
    const nav = new NavigationPage(page, services);
    // ...
}
```

### Validierung
- FunctionalUI-Tests mit `services` Fixture ausfuehren
- Pruefen: Gleicher StabilityHelper fuer Page und Controls (keine doppelte Instanziierung)

### Risiko
NIEDRIG -- `services` ist ein neuer optionaler Parameter. Default-Fallback bleibt `ServiceContext.for(page)`. Bestehender Code aendert sich nicht.

---

## Schritt 6: IStabilityService erweitern

### Ziel
2 fehlende Methoden verfuegbar machen (aus interner Studie 6: 5% Luecke).

### Aenderungen

**6a. Interface erweitern:**
```typescript
// libs/core/interfaces/IStabilityService.ts
export interface IStabilityService {
    // ... bestehend
    forceFormUpdate(): Promise<void>;              // NEU
    triggerChangeDetection(): Promise<void>;        // NEU
}
```

**6b. StabilityHelper implementiert bereits diese Methoden** -- pruefen ob sie public sind und der Signatur entsprechen.

**6c. PageObjectBase exponiert sie:**
```typescript
// libs/core/base/page-object-base.ts
protected async forceFormUpdate(): Promise<void> {
    await this.stability.forceFormUpdate();
}
protected async triggerChangeDetection(): Promise<void> {
    await this.stability.triggerChangeDetection();
}
```

### Validierung
- Neuer FunctionalUI-Test: `StabilityService_Methods.spec.ts`
- Testet forceFormUpdate und triggerChangeDetection auf einer Angular-Form

### Risiko
NIEDRIG -- Additive Erweiterung eines Interfaces. StabilityHelper hat diese Methoden bereits.

---

## Schritt 7: CommonPage-Services erstellen (ADR-6)

### Ziel
CommonPage-Funktionalitaet als Services verfuegbar machen, ohne Legacy-CommonPage zu aendern.

### Aenderungen

**7a. NumberFormatter:**
```typescript
// libs/core/services/number-formatter.ts
export class NumberFormatter {
    static normalizeNumber(value: string): number { /* aus CommonPage extrahiert */ }
    static normalizeNumberFR(value: string): number { /* ... */ }
    static formatGerman(value: number): string { /* ... */ }
    static formatFrench(value: number): string { /* ... */ }
    static format(value: number, locale: "de" | "fr"): string { /* ... */ }
}
```

**7b. StringHelper:**
```typescript
// libs/core/services/string-helper.ts
export class StringHelper {
    static extractDossierName(text: string): string { /* ... */ }
    static capitalizeFirstLetter(text: string): string { /* ... */ }
    static reverseText(text: string): string { /* ... */ }
    static formatAhvNumber(ahv: string): string { /* ... */ }
    static formatIban(iban: string): string { /* ... */ }
}
```

**7c. FileUploadHelper:**
```typescript
// libs/core/services/file-upload-helper.ts
import { Page } from "@playwright/test";
import { IStabilityService } from "@core/interfaces";

export class FileUploadHelper {
    constructor(private page: Page, private stability: IStabilityService) {}

    async uploadFile(locator: Locator, filePath: string): Promise<void> { /* ... */ }
    async uploadFileWithApiWait(locator: Locator, filePath: string): Promise<void> { /* ... */ }
    async uploadMultipleFiles(locator: Locator, filePaths: string[]): Promise<void> { /* ... */ }
}
```

**7d. DateHelper erweitern** (bereits vorhanden in `libs/utils/helpers/DateHelper.ts`):
- `incrementDay`, `getDaysMinusOne`, `extractAndFormatDate`, `convertToDDMMYYYY`, `modifyDate` hinzufuegen

**7e. Barrel-Exports:**
```typescript
// libs/core/services/index.ts
export { ServiceContext } from "./service-context";
export { NumberFormatter } from "./number-formatter";
export { StringHelper } from "./string-helper";
export { FileUploadHelper } from "./file-upload-helper";
```

### Validierung
- Neuer FunctionalUI-Test: `CommonServices_Validation.spec.ts`
- Testet NumberFormatter, StringHelper mit bekannten Eingabe/Ausgabe-Werten
- Optional: Jest Unit Tests (schneller, kein Browser noetig)

### Risiko
KEINS -- Neue Dateien, keine Aenderungen an bestehenden. Legacy-CommonPage bleibt unangetastet.

---

## Schritt 8: Table + Tab Controls

### Ziel
Die 2 meistbenoetigten fehlenden Controls implementieren (88 + 22 Vorkommen im Legacy-Code).

### Aenderungen

**8a. ITable Interface:**
```typescript
// libs/core/interfaces/ITable.ts
export interface ITable extends IControl {
    getRowCount(): Promise<number>;
    getRow(index: number): Promise<ITableRow>;
    getRowByText(text: string): Promise<ITableRow>;
    getAllRows(): Promise<ITableRow[]>;
    getHeaderTexts(): Promise<string[]>;
    getCellText(rowIndex: number, columnIndex: number): Promise<string>;
    shouldHaveRowCount(count: number, options?: { timeout?: number }): Promise<void>;
    shouldContainRowWithText(text: string, options?: { timeout?: number }): Promise<void>;
}

export interface ITableRow {
    click(): Promise<void>;
    getText(): Promise<string>;
    getCell(columnIndex: number): Promise<Locator>;
    getCellByHeader(headerName: string): Promise<Locator>;
}
```

**8b. Table Control:**
```typescript
// libs/core/controls/table.ts
export class Table extends ControlBase implements ITable {
    static byTestId(page: Page, testId: string, services?: IServiceContext): Table { /* ... */ }
    static byRole(page: Page, services?: IServiceContext): Table { /* ... */ }
    static bySelector(page: Page, selector: string, services?: IServiceContext): Table { /* ... */ }
    // Implementierung...
}
```

**8c. ITab Interface:**
```typescript
// libs/core/interfaces/ITab.ts
export interface ITab extends IControl {
    selectByName(name: string | RegExp): Promise<void>;
    selectByIndex(index: number): Promise<void>;
    getActiveTabName(): Promise<string>;
    getTabNames(): Promise<string[]>;
    shouldBeSelected(name: string | RegExp, options?: { timeout?: number }): Promise<void>;
    waitForTabPanelContent(timeout?: number): Promise<void>;
}
```

**8d. Tab Control:**
```typescript
// libs/core/controls/tab.ts
export class Tab extends ControlBase implements ITab {
    static byTestId(page: Page, testId: string, services?: IServiceContext): Tab { /* ... */ }
    static bySelector(page: Page, selector: string, services?: IServiceContext): Tab { /* ... */ }
    // Implementierung mit MatTabs-Pattern: click tab -> wait tabpanel
}
```

**8e. PageObjectBase Factory-Methods:**
```typescript
protected table(testId: string): ITable { return Table.byTestId(this.page, testId, this.services); }
protected tab(testId: string): ITab { return Tab.byTestId(this.page, testId, this.services); }
```

**8f. Exports aktualisieren:**
- `libs/core/interfaces/index.ts`: ITable, ITab hinzufuegen
- `libs/core/controls/index.ts`: Table, Tab hinzufuegen

### Validierung
- Neuer FunctionalUI-Test: `Table_Tab_Controls.spec.ts`
- Login, Dossier oeffnen, Rahmenbudget-Tabelle und Tabs validieren

### Risiko
NIEDRIG -- Neue Dateien. Keine Aenderungen an bestehenden Controls.

---

## Abhaengigkeiten und Reihenfolge

```
Schritt 1 (description)
    |
    v
Schritt 2 (executeWithContext) -- braucht description
    |
    v
Schritt 3 (@step decorator) -- braucht executeWithContext
    |
    v
Schritt 4 (Async-Suffix) -- braucht @step (damit neue Namen sofort @step haben)
    |
    v
Schritt 5 (ServiceContext Fixture) -- unabhaengig, aber logisch nach 1-4

Schritt 6 (IStabilityService) -- unabhaengig, kann parallel zu 1-4
Schritt 7 (CommonPage-Services) -- unabhaengig, kann parallel zu 1-4
Schritt 8 (Table + Tab) -- unabhaengig, kann parallel zu 1-4
```

**Parallelisierbar:** Schritte 6, 7, 8 koennen parallel zu 1-4 oder danach.

---

## Neue FunctionalUI-Tests (erstellen waehrend Implementierung)

| Test-Datei | Validiert | Schritt |
|------------|----------|---------|
| `NavigationPage_MenuNavigation.spec.ts` | Baseline -- bestehend, nach jedem Schritt ausfuehren | Alle |
| `ControlsDemo.spec.ts` | Baseline -- bestehend, nach jedem Schritt ausfuehren | Alle |
| `ErrorDiagnostics_Validation.spec.ts` | executeWithContext enriched Errors, @step im Report | 2, 3 |
| `StabilityService_Methods.spec.ts` | forceFormUpdate, triggerChangeDetection | 6 |
| `CommonServices_Validation.spec.ts` | NumberFormatter, StringHelper, DateHelper | 7 |
| `Table_Tab_Controls.spec.ts` | Table + Tab auf Rahmenbudget-Seite | 8 |

---

## Validierungs-Protokoll (nach jedem Schritt)

```bash
# 1. Bestehende FunctionalUI-Tests (MUSS bestehen)
npx playwright test staticTestcases/FunctionalUI/ --headed --workers 1 2>&1 | tee test-results/pw-output.txt; echo "EXIT:$?"

# 2. ControlsDemo (MUSS bestehen)
npx playwright test staticTestcases/Debug/ControlsDemo.spec.ts --headed --workers 1 2>&1 | tee test-results/pw-output.txt; echo "EXIT:$?"

# 3. Keyword-Validation Smoke (MUSS bestehen -- Legacy nicht tangiert)
npx playwright test staticTestcases/Keywordvalidation/ --grep @smoke --headed --workers 1 2>&1 | tee test-results/pw-output.txt; echo "EXIT:$?"

# 4. TypeScript Compilation Check (MUSS bestehen)
npx tsc --noEmit
```

---

## Zeitschaetzung

| Schritt | Aufwand | Kumuliert |
|---------|---------|-----------|
| 1. description | 0.5 Tag | 0.5 |
| 2. executeWithContext | 0.5 Tag | 1.0 |
| 3. @step Decorator | 0.5 Tag | 1.5 |
| 4. Async-Suffix | 1.0 Tag | 2.5 |
| 5. ServiceContext Fixture | 0.5 Tag | 3.0 |
| 6. IStabilityService | 0.25 Tag | 3.25 |
| 7. CommonPage-Services | 1.0 Tag | 4.25 |
| 8. Table + Tab Controls | 1.5 Tage | 5.75 |
| **Total Phase 2.5** | **~6 Tage** | |

---

## Verwandte Seiten

- [[architektur]] -- ADR-1 bis ADR-8 als Grundlage
- [[interne-studien]] -- Datengrundlage (Control-Coverage, Locator-Audit, etc.)
- [[externe-studien]] -- Best-Practice-Referenzen
- [[migration-roadmap]] -- Phase 2.5 im Gesamtplan
