# PageObjectBase -- Referenz

**Datei**: `libs/core/base/page-object-base.ts`

`PageObjectBase` ist die abstrakte Basis-Klasse fuer alle Page Objects im modernen Framework (`libs/pages-v2/`). Sie stellt Factory-Methoden fuer Controls, Helper-Methoden und Low-Level-Locator-Methoden bereit.

---

## Konstruktor

```typescript
abstract class PageObjectBase {
    protected readonly page: Page;
    protected readonly services: IServiceContext;
    protected readonly stability: IStabilityService;

    constructor(page: Page, services?: IServiceContext) { ... }
}
```

- `page`: Playwright `Page`-Instanz (einzige Playwright-Abhaengigkeit)
- `services`: `IServiceContext` -- jetzt **optional**. Fallback auf `ServiceContext.for(page)` wenn nicht uebergeben.
- `stability`: Shortcut fuer `services.stability`

> **Phase 2.5:** `services` ist auch als Playwright Fixture verfuegbar (`services: IServiceContext` aus `@libs/test-fixtures`). Damit entfaellt das manuelle Erstellen via `ServiceContext.for(page)` in Tests.

Typisches Muster in konkreten Pages:

```typescript
constructor(page: Page, services?: IServiceContext) {
    super(page, services);
}
```

---

## Factory-Methoden (27 Methoden)

Alle Factory-Methoden sind `protected` und geben Interface-Typen zurueck. Sie uebergeben `this.services` automatisch an die Controls.

### Button (4 Methoden)

| Methode | Signatur | Erstellt |
|---------|----------|---------|
| `button(testId)` | `(testId: string): IButton` | `Button.byTestId(page, testId, services)` |
| `buttonByName(name, exact?)` | `(name: string, exact?: boolean): IButton` | `Button.byName(page, name, exact, services)` |
| `buttonBySelector(selector)` | `(selector: string): IButton` | `Button.bySelector(page, selector, services)` |
| `buttonByText(text, exact?)` | `(text: string, exact?: boolean): IButton` | `Button.byText(page, text, exact, services)` |

### TextInput (5 Methoden)

| Methode | Signatur | Erstellt |
|---------|----------|---------|
| `textInput(testId)` | `(testId: string): ITextInput` | `TextInput.byTestId(page, testId, services)` |
| `angularTextInput(testId)` | `(testId: string): ITextInput` | `TextInput.byAngularTestId(page, testId, services)` |
| `textInputByLabel(label, exact?)` | `(label: string, exact?: boolean): ITextInput` | `TextInput.byLabel(page, label, exact, services)` |
| `textInputById(id)` | `(id: string): ITextInput` | `TextInput.byId(page, id, services)` |
| `textInputBySelector(selector)` | `(selector: string): ITextInput` | `TextInput.bySelector(page, selector, services)` |

### Dropdown (3 Methoden)

| Methode | Signatur | Erstellt |
|---------|----------|---------|
| `dropdown(testId)` | `(testId: string): IDropdown` | `Dropdown.byTestId(page, testId, services)` |
| `angularDropdown(testId)` | `(testId: string): IDropdown` | `Dropdown.byAngularTestId(page, testId, services)` |
| `dropdownByLabel(label, exact?)` | `(label: string, exact?: boolean): IDropdown` | `Dropdown.byLabel(page, label, exact, services)` |

### Checkbox (2 Methoden)

| Methode | Signatur | Erstellt |
|---------|----------|---------|
| `checkbox(testId)` | `(testId: string): ICheckbox` | `Checkbox.byTestId(page, testId, services)` |
| `checkboxByLabel(label, exact?)` | `(label: string, exact?: boolean): ICheckbox` | `Checkbox.byLabel(page, label, exact, services)` |

### DatePicker (3 Methoden)

| Methode | Signatur | Erstellt |
|---------|----------|---------|
| `datePicker(testId)` | `(testId: string): IDatePicker` | `DatePicker.byTestId(page, testId, services)` |
| `angularDatePicker(testId)` | `(testId: string): IDatePicker` | `DatePicker.byAngularTestId(page, testId, services)` |
| `datePickerByLabel(label, exact?)` | `(label: string, exact?: boolean): IDatePicker` | `DatePicker.byLabel(page, label, exact, services)` |

### Link (4 Methoden)

| Methode | Signatur | Erstellt |
|---------|----------|---------|
| `link(testId)` | `(testId: string): ILink` | `Link.byTestId(page, testId, services)` |
| `linkByText(text, exact?)` | `(text: string, exact?: boolean): ILink` | `Link.byText(page, text, exact, services)` |
| `linkBySelector(selector)` | `(selector: string): ILink` | `Link.bySelector(page, selector, services)` |
| `linkByPattern(pattern)` | `(pattern: RegExp): ILink` | `Link.byPattern(page, pattern, services)` |

### Table (2 Methoden)

| Methode | Signatur | Erstellt |
|---------|----------|---------|
| `table(testId)` | `(testId: string): ITable` | `Table.byTestId(page, testId, services)` |
| `tableBySelector(selector)` | `(selector: string): ITable` | `Table.bySelector(page, selector, services)` |

### Tab (2 Methoden)

| Methode | Signatur | Erstellt |
|---------|----------|---------|
| `tab(testId)` | `(testId: string): ITab` | `Tab.byTestId(page, testId, services)` |
| `tabBySelector(selector)` | `(selector: string): ITab` | `Tab.bySelector(page, selector, services)` |

---

## Helper-Methoden

### Page Wait Methods

| Methode | Beschreibung |
|---------|-------------|
| `waitForPageReady(options?)` | Wartet parallel auf Page-Stabilitaet UND Angular-Stabilitaet. Options: `{ timeout?, additionalWait? }` |
| `waitForAngularStable(options?)` | Nur Angular-Stabilitaet abwarten. Options: `{ timeout? }` |
| `waitForUrl(urlPattern, timeout?)` | Auf URL-Pattern warten. Akzeptiert `string \| RegExp`. |

### Dialog Methods

| Methode | Beschreibung |
|---------|-------------|
| `waitForDialog(dialogSelector?, timeout?)` | Warten bis Dialog sichtbar. Default: `"mat-dialog-container"` |
| `closeDialog(options?)` | Dialog schliessen. Options: `{ closeButtonSelector?, dialogSelector?, timeout? }` |
| `closeDialogWithCancel(options?)` | Dialog mit Abbrechen schliessen. Options: `{ dialogSelector?, timeout? }` |
| `isDialogOpen(dialogSelector?)` | Prueft ob Dialog offen ist. Gibt `boolean` zurueck. |
| `forceFormUpdate()` | Angular-Formular-Update erzwingen |
| `triggerChangeDetection()` | Angular Change Detection ausloesen |

---

## Low-Level Locator Methods

Fuer Edge Cases, wenn kein Control passt. **Bevorzuge immer Controls.**

| Methode | Return | Beschreibung |
|---------|--------|-------------|
| `locator(selector)` | `Locator` | CSS-Selektor |
| `getByTestId(testId)` | `Locator` | data-testid |
| `getByRole(role, options?)` | `Locator` | ARIA-Rolle |
| `getByLabel(label, options?)` | `Locator` | Label-Text |
| `getByText(text, options?)` | `Locator` | Text-Inhalt |

---

## Neue Page-Klasse erstellen -- Template

```typescript
import { Page } from "@playwright/test";
import { PageObjectBase } from "@core/base";
import { IButton, ITextInput, IDropdown, IServiceContext } from "@core/interfaces";

export class MeinFormularPage extends PageObjectBase {
    readonly vornameInput: ITextInput = this.textInput("vorname");
    readonly nachnameInput: ITextInput = this.angularTextInput("nachname");
    readonly rolleDropdown: IDropdown = this.angularDropdown("rolle");
    readonly speichernButton: IButton = this.button("speichern");
    readonly abbrechenButton: IButton = this.buttonByText("Abbrechen");

    constructor(page: Page, services?: IServiceContext) {
        super(page, services);
    }

    async formularAusfuellen(vorname: string, nachname: string, rolle: string): Promise<void> {
        await this.vornameInput.fill(vorname);
        await this.nachnameInput.fill(nachname);
        await this.rolleDropdown.select(rolle);
    }

    async speichern(): Promise<void> {
        await this.speichernButton.click();
        await this.waitForPageReady();
    }

    async validieren(expectedVorname: string, expectedRolle: string): Promise<void> {
        await this.vornameInput.shouldHaveValue(expectedVorname);
        await this.rolleDropdown.shouldHaveSelected(expectedRolle);
        await this.speichernButton.shouldBeEnabled();
    }
}
```

### Regeln fuer neue Pages

1. Datei in `libs/pages-v2/` ablegen
2. `extends PageObjectBase`
3. Konstruktor mit optionalem `IServiceContext`
4. Alle Properties mit Interface-Typen (`IButton`, `ITextInput`, ...)
5. Factory-Methoden verwenden (`this.button()`, `this.textInput()`, ...)
6. **Kein** `import { expect }` aus Playwright
7. **Kein** `this.page.click()`, `this.page.fill()` etc.
8. Barrel-Export in `libs/pages-v2/index.ts` ergaenzen

---

## Vergleich: PageObjectBase vs BasePage

| Aspekt | PageObjectBase (Modern) | BasePage (Legacy) |
|--------|------------------------|-------------------|
| **Pfad** | `libs/core/base/page-object-base.ts` | `libs/pages/basePage.ts` |
| **Import** | `import { PageObjectBase } from "@core/base"` | `import { BasePage } from "@libs/pages"` |
| **Controls** | Typisierte Factory-Methoden (IButton, ITextInput, ...) | Keine -- direkte Locator-Nutzung |
| **Playwright-Abhaengigkeit** | Nur `Page` fuer Konstruktor | Volle Playwright-API |
| **StabilityHelper** | Eingebaut via ServiceContext | Manuell eingebunden |
| **Validierung** | `control.shouldBeVisible()` | `expect(locator).toBeVisible()` |
| **Verwendung** | `libs/pages-v2/` | `libs/pages/` |
| **Tests** | Functional UI, Acceptance | Keyword-Driven Tests |

---

## Verwandte Seiten

- [[architektur]] -- Framework-Architektur und Schichten-Modell
- [[controls-referenz]] -- Alle Control-Klassen im Detail
- [[pages-v2-referenz]] -- Implementierte Pages
- [[test-patterns-modern]] -- Test-Templates
