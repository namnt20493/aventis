# Modern Framework Bundle
<!-- Agent: aventis-e2e-test-agent | Alles fuer pages-v2, Controls, PageObjectBase -->

## 1. Entscheidung: Legacy vs Modern

| Aufgabe | Framework | Verzeichnis |
|---------|-----------|-------------|
| Keyword-Validation Test | **Legacy** (BasePage, libs/pages/, libs/keywords/) | staticTestcases/Keywordvalidation/ |
| Functional UI Test | **Modern** (PageObjectBase, libs/pages-v2/) | staticTestcases/FunctionalUI/ |
| Acceptance Test | **Hybrid** (Keywords + pages-v2 + API Workflows) | staticTestcases/Acceptance/ |
| Bestehenden Test reparieren | **Gleiches Framework beibehalten** | -- |
| Neue Page erstellen | **Immer pages-v2** (nie libs/pages/) | libs/pages-v2/ |

> **Phase 2.5 (2026-03-13):** Methoden ohne `Async`-Suffix (z.B. `click()` statt `clickAsync()`). `@step` Decorator fuer Report-Sichtbarkeit. `services: IServiceContext` Fixture. Neue Controls: `Table`, `Tab`. Neue Services: `NumberFormatter`, `StringHelper`, `FileUploadHelper`.

## 2. Schichten-Modell (kompakt)

```
Test (staticTestcases/)
  |  new LoginPage(page), new NavigationPage(page)
  v
Page Object (libs/pages-v2/)          extends PageObjectBase
  |  this.button(), this.textInput()   nur Interface-Typen (IButton, ITextInput...)
  v
Interfaces (libs/core/interfaces/)     IControl, IButton, ITextInput, IDropdown...
  |
  v
Controls (libs/core/controls/)         Button, TextInput, Dropdown, Checkbox...
  |  Playwright-Logik + StabilityHelper
  v
Playwright (Page, Locator, expect)     NUR hier Playwright-APIs
```

## 3. Template: Functional UI Test (Copy-Paste)

```typescript
import { test, expect } from "@libs/test-fixtures";
import { LoginPage, NavigationPage } from "@libs/pages-v2";
import { TestUsers } from "@constants/credentials";

test(
    "MeinePage_Feature_Validieren",
    { tag: ["@[ADO_ID]", "@functionalUI"] },
    async ({ page, services }) => {
        const loginPage = new LoginPage(page, services);
        const nav = new NavigationPage(page, services);

        await test.step("Login", async () => {
            await page.goto("/");
            await loginPage.loginWithMsOnline(
                TestUsers.SOZIALARBEITERIN_1A.username,
                TestUsers.SOZIALARBEITERIN_1A.password
            );
            await nav.mainMenuButton.shouldBeVisible({ timeout: 15000 });
        });

        await test.step("Feature validieren", async () => {
            await nav.openMainMenu();
            await nav.dossierfuhrungMenuItem.shouldBeVisible();
            await page.keyboard.press("Escape");
        });
    }
);
```

## 4. Template: Acceptance Test (Copy-Paste)

```typescript
import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { MeineKeyword } from "@keywords/meine-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { generateDossierViaApiWithPerson } from "@libs/workflows/apiDossierWorkflow";

test(
    "AT_Feature_Beschreibung",
    { tag: ["@[ADO_ID]", "@acceptance", "@all"] },
    async ({ page, seed, context, authenticatedRequest }) => {
        const commonKeyword = new CommonKeyword(page);
        const meineKeyword = new MeineKeyword(page);
        const uniqueDossierId = sharedTestLogic.generateUniqueDossierId(seed);

        const dossierResult = await generateDossierViaApiWithPerson(
            authenticatedRequest, commonKeyword, page, seed, uniqueDossierId
        );

        await test.step("GoTo_Dossier", async () => {
            await commonKeyword.GoTo_Dossier_With_Url(dossierResult.dossierId);
        });

        await test.step("Feature testen", async () => {
            await meineKeyword.MeineAktion({ dossier: uniqueDossierId });
        });
    }
);
```

## 5. Neue Page erstellen (Step-by-Step)

1. **Datei erstellen**: `libs/pages-v2/mein-formular-page.ts` (kebab-case)
2. **PageObjectBase extenden** mit optionalem ServiceContext:
3. **Controls als readonly Properties** mit Interface-Typen deklarieren
4. **Methoden** verwenden nur Controls, keine Playwright-APIs
5. **Export** in `libs/pages-v2/index.ts` ergaenzen

```typescript
import { Page } from "@playwright/test";
import { PageObjectBase } from "@core/base";
import { IButton, ITextInput, IDropdown, IDatePicker, IServiceContext } from "@core/interfaces";
import { ServiceContext } from "@core/services";

export class MeinFormularPage extends PageObjectBase {
    readonly vornameInput: ITextInput = this.textInput("vorname");
    readonly nachnameInput: ITextInput = this.angularTextInput("nachname");
    readonly rolleDropdown: IDropdown = this.angularDropdown("rolle");
    readonly gueltigAbPicker: IDatePicker = this.datePickerByLabel("Gueltig ab");
    readonly speichernButton: IButton = this.button("speichern");
    readonly abbrechenButton: IButton = this.buttonByText("Abbrechen");

    constructor(page: Page, services?: IServiceContext) {
        super(page, services ?? ServiceContext.for(page));
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
}
```

## 6. Controls Quick-Ref

### Factory-Methoden (statisch & PageObjectBase)

| Control | Interface | Static Factory | PageObjectBase Factory |
|---------|-----------|---------------|----------------------|
| **Button** | `IButton` | `Button.byTestId(page,id)`, `.byName()`, `.byText()`, `.byLabel()`, `.bySelector()`, `.nth()` | `this.button(testId)`, `buttonByName()`, `buttonByText()`, `buttonBySelector()` |
| **TextInput** | `ITextInput` | `TextInput.byTestId()`, `.byAngularTestId()`, `.byLabel()`, `.byPlaceholder()`, `.byRole()`, `.byName()`, `.byId()`, `.bySelector()` | `this.textInput(testId)`, `angularTextInput()`, `textInputByLabel()`, `textInputById()`, `textInputBySelector()` |
| **Dropdown** | `IDropdown` | `Dropdown.byTestId()`, `.byAngularTestId()`, `.byLabel()`, `.byRole()`, `.bySelector()` | `this.dropdown(testId)`, `angularDropdown()`, `dropdownByLabel()` |
| **Checkbox** | `ICheckbox` | `Checkbox.byTestId()`, `.byLabel()`, `.byRole()`, `.byName()`, `.bySelector()` | `this.checkbox(testId)`, `checkboxByLabel()` |
| **DatePicker** | `IDatePicker` | `DatePicker.byTestId()`, `.byAngularTestId()`, `.byLabel()`, `.byPlaceholder()`, `.bySelector()` | `this.datePicker(testId)`, `angularDatePicker()`, `datePickerByLabel()` |
| **Link** | `ILink` | `Link.byTestId()`, `.byText()`, `.byPattern()`, `.byHref()`, `.bySelector()`, `.nth()` | `this.link(testId)`, `linkByText()`, `linkBySelector()`, `linkByPattern()` |
| **Table** | `ITable` | `Table.byTestId()`, `.bySelector()`, `.byRole()` | `this.table(testId)`, `tableBySelector()` |
| **Tab** | `ITab` | `Tab.byTestId()`, `.bySelector()` | `this.tab(testId)`, `tabBySelector()` |

### Key Methods per Control

| Control | Aktionen | State/Get | Should* |
|---------|---------|-----------|---------|
| **Button** | `click()`, `forceClick()`, `doubleClick()`, `hover()`, `clickStable(opts?)` | `getText()`, `isLoading()` | (erbt ControlBase) |
| **TextInput** | `fill(val)`, `clear()`, `clearAndFill(val)`, `fillStable(val,opts?)`, `fillAndTab(val)` | `getValue()`, `isEmpty()`, `hasValidationError()` | `shouldHaveValue()`, `shouldBeEmpty()`, `shouldNotBeEmpty()` |
| **Dropdown** | `select(text)`, `selectByIndex(i)`, `typeAndSelect(search,option?)`, `selectStable(text,opts?)` | `getSelectedText()`, `getOptions()`, `hasSelection()` | `shouldHaveSelected()`, `shouldContainOption()` |
| **Checkbox** | `check()`, `uncheck()`, `toggle()`, `setChecked(bool)` | `isChecked()`, `isIndeterminate()` | `shouldBeChecked()`, `shouldBeUnchecked()` |
| **DatePicker** | `setDate(date)`, `setDateString(str)`, `setToday()`, `setRelativeDate(days)`, `clear()` | `getValue()`, `getDate()`, `hasValue()` | `shouldHaveValue()`, `shouldBeEmpty()` |
| **Link** | `click()`, `hover()`, `clickStable(opts?)`, `clickAndOpenNewTab()` | `getHref()`, `getText()`, `opensInNewTab()` | `shouldHaveHref()`, `shouldHaveLinkText()` |
| **Table** | `getRow()`, `getRowByText()`, `waitForRows()` | `getRowCount()`, `getAllRowTexts()`, `getHeaderTexts()` | `shouldHaveRowCount()`, `shouldContainRowWithText()` |
| **Tab** | `selectByName()`, `selectByIndex()` | `getActiveTabName()`, `getTabNames()`, `getTabCount()` | `shouldBeSelected()` |
| **ControlBase** | `focus()`, `blur()`, `scrollIntoView()` | `isVisible()`, `isEnabled()`, `getInnerText()` | `shouldBeVisible()`, `shouldBeHidden()`, `shouldBeEnabled()`, `shouldBeDisabled()`, `shouldHaveText()`, `shouldContainText()` |

## 7. PageObjectBase Helper Methods

| Methode | Beschreibung |
|---------|-------------|
| `waitForPageReady(opts?)` | Wartet auf Page + Angular Stabilitaet |
| `waitForAngularStable(opts?)` | Nur Angular-Stabilitaet |
| `waitForUrl(pattern, timeout?)` | Auf URL-Pattern warten |
| `waitForDialog(selector?, timeout?)` | Warten bis Dialog sichtbar (default: `mat-dialog-container`) |
| `closeDialog(opts?)` | Dialog schliessen |
| `closeDialogWithCancel(opts?)` | Dialog mit Abbrechen schliessen |
| `isDialogOpen(selector?)` | Prueft ob Dialog offen |
| `forceFormUpdate()` | Angular-Formular-Update erzwingen |
| `triggerChangeDetection()` | Angular Change Detection ausloesen |
| `locator(selector)` | Low-Level CSS-Selektor (Edge Cases) |
| `getByTestId(id)` | Low-Level data-testid (Edge Cases) |
| `getByRole(role, opts?)` | Low-Level ARIA-Rolle (Edge Cases) |
| `getByLabel(label, opts?)` | Low-Level Label (Edge Cases) |
| `getByText(text, opts?)` | Low-Level Text (Edge Cases) |

## 8. Import-Patterns

```typescript
// Pages-v2
import { LoginPage, NavigationPage } from "@libs/pages-v2";

// PageObjectBase (fuer neue Pages)
import { PageObjectBase } from "@core/base";

// Interfaces (fuer Property-Typen in Pages)
import { IButton, ITextInput, IDropdown, ICheckbox, IDatePicker, ILink, IServiceContext } from "@core/interfaces";

// ServiceContext (fuer Konstruktor-Default)
import { ServiceContext } from "@core/services";

// Controls direkt (fuer Inline-Nutzung im Test)
import { Button, TextInput, Dropdown, Checkbox, DatePicker, Link } from "@core/controls";

// Table + Tab Controls direkt
import { Table, Tab } from "@core/controls";

// Neue Services (Phase 2.5)
import { NumberFormatter, StringHelper, FileUploadHelper } from "@core/services";

// Test-Fixtures
import { test, expect } from "@libs/test-fixtures";

// Constants
import { TestUsers } from "@constants/credentials";
import { TestPersons } from "@constants/testpersonen";
```

## 9. MUSS-Regeln

1. **Kein Playwright in pages-v2** -- Kein `page.click()`, `page.fill()`, `expect(locator)` in Page-Klassen. Nur `Page` fuer Konstruktor-Parameter.
2. **Kein Mix Legacy/Modern** -- Eine Datei erbt von `BasePage` ODER `PageObjectBase`, nie beides.
3. **Interface-Typen** -- Properties als `IButton`, `ITextInput` etc., nie `Button`, `TextInput`.
4. **Factory-Methoden** -- `this.button("id")` statt `new Button(page, locator)`.
5. **ServiceContext.for(page)** -- Immer als Default im Konstruktor: `services ?? ServiceContext.for(page)`.
6. **readonly Properties** -- Controls immer `readonly`, nie reassigned.
7. **Kein Async-Suffix** -- Neue Methoden-Namen: `click()`, `fill()`, `select()`, `waitForPageReady()`. Alte `*Async()` Namen sind `@deprecated` Aliases.
8. **Nach Navigation warten** -- `waitForPageReady()` nach Navigation, `waitForDialog()` nach Dialog-Open.
9. **Keywords bleiben Legacy** -- Keywords in `libs/keywords/` verwenden weiter `libs/pages/`. Keine Migration ohne Auftrag.
10. **Neue Pages immer pages-v2** -- Auch fuer "schnelle" Pages nie `libs/pages/`.

## 10. Checkliste

- [ ] Datei in `libs/pages-v2/` (nicht `libs/pages/`)?
- [ ] `extends PageObjectBase` (nicht `BasePage`)?
- [ ] Konstruktor mit `services ?? ServiceContext.for(page)` Default?
- [ ] Alle Controls: Interface-Typen (`IButton`, `ITextInput`, ...)?
- [ ] Alle Controls: Factory-Methoden (`this.button()`, `this.textInput()`, ...)?
- [ ] Keine direkten Playwright-Aufrufe in Page-Methoden?
- [ ] Export in `libs/pages-v2/index.ts` hinzugefuegt?
- [ ] Kein Legacy/Modern-Mix in derselben Datei?

## 11. Tiefergehend (nur bei Bedarf)

- [[../09-Modernes-Framework/controls-referenz]] -- Alle Controls im Detail (Should*-Methoden, StabilityHelper-Varianten)
- [[../09-Modernes-Framework/architektur]] -- ServiceContext, DI, Exceptions, Verzeichnisstruktur
- [[../09-Modernes-Framework/pages-v2-referenz]] -- LoginPage und NavigationPage Controls/Methoden
- [[../09-Modernes-Framework/ist-vs-soll]] -- Koexistenz-Strategie Legacy vs Modern
