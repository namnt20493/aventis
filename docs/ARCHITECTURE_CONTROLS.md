# Framework-Architektur: Control-basiertes Page Object Pattern

## Übersicht

> **Phase 2.5 Update (2026-03-13):** Methoden verwenden neue Namen ohne `Async`-Suffix (z.B. `click()` statt `clickAsync()`). Alte Namen sind als `@deprecated` Aliases verfuegbar. Alle Methoden haben `@step` Decorator und `executeWithContext()`. Neue Controls: Table, Tab. Neuer Fixture: `services: IServiceContext`.

Das Aventis Playwright Framework verwendet eine modernisierte Architektur mit typisierten Control-Klassen und Interface-basierter Abstraktion.

## Architektur-Prinzipien

### 1. Playwright-Unabhängigkeit für Page Objects

**Page Objects (pages-v2) sind Playwright-unabhängig.**

```
┌─────────────────────────────────────────────────────────────────┐
│  Test Layer (Tests)                                              │
│  - Verwendet Page Objects und Keywords                           │
│  - Keine direkte Playwright-Nutzung (außer Fixtures)             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Page Object Layer (libs/pages-v2/)                             │
│  - Extends PageObjectBase                                        │
│  - Verwendet nur Interfaces (IButton, ITextInput, etc.)          │
│  - KEINE direkten Playwright-Aufrufe (page.xxx, expect)          │
│  - Framework-agnostisch                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Interface Layer (libs/core/interfaces/)                         │
│  - IControl, IButton, ITextInput, IDropdown, etc.                │
│  - Definiert den Vertrag zwischen Page Objects und Controls      │
│  - Keine Implementierungsdetails                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Control Layer (libs/core/controls/)                             │
│  - Playwright-spezifische Implementierungen                      │
│  - Button, TextInput, Dropdown implementieren Interfaces         │
│  - Enthält alle Playwright-Abhängigkeiten (Page, Locator, expect)│
│  - StabilityHelper für Angular-Unterstützung                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Playwright (Framework)                                          │
│  - Browser-Automatisierung                                       │
│  - Wird nur im Control Layer verwendet                           │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Verzeichnisstruktur

```
libs/
├── core/                           # Framework-Kern
│   ├── interfaces/                 # ⭐ NEU: Interface-Definitionen
│   │   ├── IControl.ts             # Basis-Interface für alle Controls
│   │   ├── IButton.ts              # Button-Interface
│   │   ├── ITextInput.ts           # TextInput-Interface
│   │   ├── IDropdown.ts            # Dropdown-Interface
│   │   ├── ICheckbox.ts            # Checkbox-Interface
│   │   ├── IDatePicker.ts          # DatePicker-Interface
│   │   ├── ILink.ts                # Link-Interface
│   │   ├── ITable.ts              # Table-Interface (NEU Phase 2.5)
│   │   ├── ITab.ts                # Tab-Interface (NEU Phase 2.5)
│   │   ├── ILocatorProvider.ts     # Locator-Abstraktion
│   │   ├── IStabilityHelper.ts     # Stability-Abstraktion
│   │   └── index.ts                # Barrel Export
│   ├── controls/                   # Playwright-Implementierungen
│   │   ├── control-base.ts         # Implementiert IControl
│   │   ├── button.ts               # Implementiert IButton
│   │   ├── text-input.ts           # Implementiert ITextInput
│   │   ├── dropdown.ts             # Implementiert IDropdown
│   │   ├── checkbox.ts             # Implementiert ICheckbox
│   │   ├── date-picker.ts          # Implementiert IDatePicker
│   │   ├── link.ts                 # Implementiert ILink
│   │   ├── table.ts               # Implementiert ITable (NEU Phase 2.5)
│   │   ├── tab.ts                 # Implementiert ITab (NEU Phase 2.5)
│   │   └── index.ts                # Barrel Export
│   ├── base/                       # Basis-Klassen
│   │   ├── page-object-base.ts     # Basis für Page Objects
│   │   └── index.ts
│   ├── decorators/                # Method-Decorators
│   │   └── step.ts                # @step -- Report-Sichtbarkeit (NEU Phase 2.5)
│   ├── services/
│   │   ├── service-context.ts      # DI-Container
│   │   ├── number-formatter.ts     # Zahlen-Formatierung CH/FR (NEU Phase 2.5)
│   │   ├── string-helper.ts        # String-Utilities (NEU Phase 2.5)
│   │   ├── file-upload-helper.ts   # Datei-Upload (NEU Phase 2.5)
│   │   └── index.ts                # Barrel Export
│   ├── exceptions/                 # Typisierte Exceptions
│   │   └── index.ts
│   └── index.ts                    # Haupt-Export
├── pages/                          # Legacy Pages (UNVERÄNDERT)
├── pages-v2/                       # Neue Pages mit Controls
│   ├── login-page.ts               # Playwright-unabhängig
│   ├── navigation-page.ts          # Playwright-unabhängig
│   └── index.ts
├── keywords/                       # Keywords (UNVERÄNDERT)
└── utils/
    └── stability-helper.ts         # Wird von Controls intern genutzt
```

### 3. Regeln für Page Objects (pages-v2)

**ERLAUBT:**
```typescript
import { Page } from "@playwright/test";  // Nur für Konstruktor-Parameter
import { IButton, ITextInput } from "@core/interfaces";

class MeinePage extends PageObjectBase {
    readonly speichernBtn: IButton = this.button("speichern");
    readonly nameInput: ITextInput = this.textInput("name");

    async speichern(): Promise<void> {
        await this.speichernBtn.click();
        await this.waitForPageReady();  // Von PageObjectBase
    }
}
```

**VERBOTEN:**
```typescript
// ❌ NIEMALS in Page Objects:
import { expect } from "@playwright/test";
await this.page.click(...);
await this.page.fill(...);
await expect(this.page.locator(...)).toBeVisible();
await this.page.waitForSelector(...);
await this.page.getByText(...).click();
```

### 4. Interface-Hierarchie

```
IControl (Basis-Interface)
├── isVisible(), isEnabled(), ...
├── waitForVisible(), waitForHidden(), ...
├── shouldBeVisible(), shouldBeEnabled(), shouldHaveText(), ...
│
├── IButton extends IControl
│   ├── click(), forceClick(), doubleClick()
│   ├── hover(), clickStable()
│   └── getText(), isPrimary(), isLoading()
│
├── ITextInput extends IControl
│   ├── fill(), clear(), type()
│   ├── getValue(), isEmpty()
│   └── shouldHaveValue(), shouldBeEmpty()
│
├── IDropdown extends IControl
│   ├── select(), selectByIndex()
│   ├── getSelectedText(), getOptions()
│   └── shouldHaveSelected()
│
├── ICheckbox extends IControl
│   ├── check(), uncheck(), toggle()
│   ├── isChecked()
│   └── shouldBeChecked(), shouldBeUnchecked()
│
├── IDatePicker extends IControl
│   ├── setDate(), setToday(), clear()
│   ├── getValue(), getDate()
│   └── shouldHaveValue(), shouldHaveDate()
│
├── ILink extends IControl
│   ├── click(), hover()
│   ├── getHref(), getText()
│   └── shouldHaveHref(), shouldOpenInNewTab()
│
├── ITable extends IControl          # NEU Phase 2.5
│   ├── getRowCount(), getRow(), getRowByText()
│   ├── getAllRowTexts(), getHeaderTexts()
│   └── shouldHaveRowCount(), shouldContainRowWithText()
│
└── ITab extends IControl            # NEU Phase 2.5
    ├── selectByName(), selectByIndex()
    ├── getActiveTabName(), getTabNames()
    └── shouldBeSelected(), waitForTabPanelContent()
```

### 5. PageObjectBase Factory-Methoden

Alle Factory-Methoden geben Interface-Typen zurück:

```typescript
class PageObjectBase {
    // Button Factory
    protected button(testId: string): IButton;
    protected buttonByName(name: string, exact?: boolean): IButton;
    protected buttonBySelector(selector: string): IButton;
    protected buttonByText(text: string, exact?: boolean): IButton;

    // TextInput Factory
    protected textInput(testId: string): ITextInput;
    protected angularTextInput(testId: string): ITextInput;
    protected textInputByLabel(label: string, exact?: boolean): ITextInput;
    protected textInputById(id: string): ITextInput;
    protected textInputBySelector(selector: string): ITextInput;

    // Dropdown Factory
    protected dropdown(testId: string): IDropdown;
    protected angularDropdown(testId: string): IDropdown;
    protected dropdownByLabel(label: string, exact?: boolean): IDropdown;

    // Checkbox Factory
    protected checkbox(testId: string): ICheckbox;
    protected checkboxByLabel(label: string, exact?: boolean): ICheckbox;

    // DatePicker Factory
    protected datePicker(testId: string): IDatePicker;
    protected angularDatePicker(testId: string): IDatePicker;
    protected datePickerByLabel(label: string, exact?: boolean): IDatePicker;

    // Link Factory
    protected link(testId: string): ILink;
    protected linkByText(text: string, exact?: boolean): ILink;
    protected linkBySelector(selector: string): ILink;
    protected linkByPattern(pattern: RegExp): ILink;

    // Table Factory (NEU Phase 2.5)
    protected table(testId: string): ITable;
    protected tableBySelector(selector: string): ITable;

    // Tab Factory (NEU Phase 2.5)
    protected tab(testId: string): ITab;
    protected tabBySelector(selector: string): ITab;
}
```

## Verwendungs-Beispiele

### Neues Page Object erstellen

```typescript
import { Page } from "@playwright/test";
import { PageObjectBase } from "@core/base";
import { IButton, ITextInput, IDropdown } from "@core/interfaces";

export class BenutzerFormPage extends PageObjectBase {
    // Alle Properties mit Interface-Typen deklarieren
    readonly vornameInput: ITextInput = this.textInput("vorname");
    readonly nachnameInput: ITextInput = this.textInput("nachname");
    readonly rolleDropdown: IDropdown = this.dropdown("rolle");
    readonly speichernButton: IButton = this.button("speichern");
    readonly abbrechenButton: IButton = this.buttonByText("Abbrechen");

    constructor(page: Page) {
        super(page);
    }

    async formAusfuellen(vorname: string, nachname: string, rolle: string): Promise<void> {
        await this.vornameInput.fill(vorname);
        await this.nachnameInput.fill(nachname);
        await this.rolleDropdown.select(rolle);
    }

    async speichern(): Promise<void> {
        await this.speichernButton.click();
        await this.waitForPageReady();
    }

    async pruefeFormularGespeichert(): Promise<void> {
        await this.speichernButton.shouldBeEnabled();
    }
}
```

### Validierungen in Page Objects

```typescript
async validateUserData(expectedName: string, expectedRole: string): Promise<void> {
    // Verwende should*-Methoden der Interfaces
    await this.vornameInput.shouldHaveValue(expectedName);
    await this.rolleDropdown.shouldHaveSelected(expectedRole);
    await this.speichernButton.shouldBeEnabled();
}
```

## Migration von Legacy-Code

### Vorher (Legacy mit Playwright)
```typescript
class AltePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async klickeButton() {
        await this.page.click('[data-testid="submit"]');
    }

    async pruefeText(expected: string) {
        await expect(this.page.locator('.result')).toHaveText(expected);
    }
}
```

### Nachher (Neu mit Interfaces)
```typescript
class NeuePage extends PageObjectBase {
    readonly submitButton: IButton = this.button("submit");
    readonly resultText: ITextInput = this.textInputBySelector(".result");

    constructor(page: Page) {
        super(page);
    }

    async klickeButton(): Promise<void> {
        await this.submitButton.click();
    }

    async pruefeText(expected: string): Promise<void> {
        await this.resultText.shouldHaveText(expected);
    }
}
```

## Best Practices

### DO ✅
- Verwende Interface-Typen für alle Control-Properties
- Verwende Factory-Methoden von PageObjectBase
- Verwende `should*`-Methoden für Validierungen
- Erstelle neue Pages in `libs/pages-v2/`
- Halte Page Objects frei von Playwright-Aufrufen

### DON'T ❌
- Keine direkten `this.page.xxx` Aufrufe in Page Objects
- Kein `expect` Import in Page Objects
- Keine `page.locator()` Aufrufe (außer in `navigateToDossier` als Ausnahme)
- Keine neuen Pages in `libs/pages/` erstellen (Legacy)
- Keine Playwright-Typen in öffentlichen Interfaces exponieren

## Path-Aliases (tsconfig.json)

```json
{
  "paths": {
    "@core": ["libs/core/index"],
    "@core/*": ["libs/core/*"],
    "@core/interfaces": ["libs/core/interfaces/index"],
    "@libs/pages-v2": ["libs/pages-v2/index"]
  }
}
```

## Dateien-Referenz

| Datei | Beschreibung |
|-------|--------------|
| `libs/core/interfaces/IControl.ts` | Basis-Interface für alle Controls |
| `libs/core/interfaces/IButton.ts` | Button-Interface |
| `libs/core/interfaces/ITextInput.ts` | TextInput-Interface |
| `libs/core/interfaces/IDropdown.ts` | Dropdown-Interface |
| `libs/core/interfaces/ICheckbox.ts` | Checkbox-Interface |
| `libs/core/interfaces/IDatePicker.ts` | DatePicker-Interface |
| `libs/core/interfaces/ILink.ts` | Link-Interface |
| `libs/core/controls/control-base.ts` | Playwright-Implementierung (Basis) |
| `libs/core/controls/button.ts` | Playwright-Implementierung (Button) |
| `libs/core/base/page-object-base.ts` | Basis für alle Page Objects |
| `libs/pages-v2/login-page.ts` | Beispiel: Playwright-unabhängige Page |
| `libs/pages-v2/navigation-page.ts` | Beispiel: Playwright-unabhängige Page |
| `libs/core/interfaces/ITable.ts` | Table-Interface (NEU Phase 2.5) |
| `libs/core/interfaces/ITab.ts` | Tab-Interface (NEU Phase 2.5) |
| `libs/core/controls/table.ts` | Table-Implementierung (NEU Phase 2.5) |
| `libs/core/controls/tab.ts` | Tab-Implementierung (NEU Phase 2.5) |
| `libs/core/decorators/step.ts` | @step Decorator (NEU Phase 2.5) |
| `libs/core/services/number-formatter.ts` | Zahlen-Formatierung (NEU Phase 2.5) |
| `libs/core/services/string-helper.ts` | String-Utilities (NEU Phase 2.5) |
| `libs/core/services/file-upload-helper.ts` | Datei-Upload (NEU Phase 2.5) |
