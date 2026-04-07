# Neue Page in pages-v2 erstellen

Schritt-fuer-Schritt-Anleitung zur Erstellung einer neuen Page im modernen Framework.

---

## Voraussetzungen

- `libs/core/` ist vorhanden (Interfaces, Controls, Services, Exceptions)
- `libs/pages-v2/` existiert mit `index.ts`
- `PageObjectBase` in `libs/core/base/page-object-base.ts`
- `ServiceContext` in `libs/core/services/service-context.ts`

---

## Schritt 1: Controls identifizieren

Analysiere die Legacy-Page (falls vorhanden) oder die Anwendungs-UI, um die benoetigten Controls zu bestimmen.

**Verfuegbare Controls:**

| Control | Interface | Factory-Methods in PageObjectBase |
|---------|-----------|----------------------------------|
| Button | `IButton` | `button(testId)`, `buttonByName(name)`, `buttonByText(text)`, `buttonBySelector(selector)` |
| TextInput | `ITextInput` | `textInput(testId)`, `angularTextInput(testId)`, `textInputByLabel(label)`, `textInputById(id)`, `textInputBySelector(selector)` |
| Dropdown | `IDropdown` | `dropdown(testId)`, `angularDropdown(testId)`, `dropdownByLabel(label)` |
| Checkbox | `ICheckbox` | `checkbox(testId)`, `checkboxByLabel(label)` |
| DatePicker | `IDatePicker` | `datePicker(testId)`, `angularDatePicker(testId)`, `datePickerByLabel(label)` |
| Link | `ILink` | `link(testId)`, `linkByText(text)`, `linkBySelector(selector)`, `linkByPattern(regex)` |
| Table | `ITable` | `table(testId)`, `tableBySelector(selector)` |
| Tab | `ITab` | `tab(testId)`, `tabBySelector(selector)` |

Falls ein benoetigter Control-Typ fehlt (z.B. RadioButton, Autocomplete), muss dieser zuerst in Phase 4 implementiert werden. Siehe [[migration-roadmap#Phase 4: Neue Controls -- GEPLANT]].

---

## Schritt 2: Datei erstellen

Erstelle eine neue Datei in `libs/pages-v2/`. Dateiname in kebab-case, passend zum Fachbereich.

Beispiel: `libs/pages-v2/rahmenbudget-page.ts`

---

## Schritt 3: PageObjectBase extenden

Grundstruktur:

```typescript
import { Page } from "@playwright/test";
import { PageObjectBase } from "@core/base";
import { IButton, ITextInput, IDropdown, ILink, IServiceContext } from "@core/interfaces";
import { ServiceContext } from "@core/services";

export class RahmenbudgetPage extends PageObjectBase {
    constructor(page: Page, services?: IServiceContext) {
        super(page, services ?? ServiceContext.for(page));
    }
}
```

Wichtig:
- `ServiceContext.for(page)` als Default-Wert im Constructor. Ermoeglicht optionales Injizieren eines eigenen ServiceContext (z.B. fuer Tests).
- Der Constructor ruft `super(page, services)` auf, was `this.page`, `this.services` und `this.stability` initialisiert.

---

## Schritt 4: Controls als readonly Properties deklarieren

Controls werden im Klassen-Body als `readonly` Properties deklariert und mit Factory-Methods initialisiert. Keine Constructor-Zuweisung noetig.

```typescript
export class RahmenbudgetPage extends PageObjectBase {
    // Navigation
    readonly rahmenbudgetNavLink: ILink = this.link("RahmenbudgetRoute");

    // Tabs
    readonly grundbedarfTab: IButton = this.buttonByName("Grundbedarf");
    readonly wohnkostenTab: IButton = this.buttonByName("Wohnkosten");
    readonly freigabeVerwendungTab: IButton = this.buttonByName("Freigabe / Verwendung");

    // Formular-Felder
    readonly betragInput: ITextInput = this.textInputByLabel("Betrag");
    readonly kategorieDropdown: IDropdown = this.dropdownByLabel("Kategorie");
    readonly gueltigAbDatePicker: IDatePicker = this.datePickerByLabel("Gueltig ab");

    // Aktionen
    readonly sblHinzufuegenButton: IButton = this.buttonByName("SBL hinzufuegen");
    readonly speichernButton: IButton = this.buttonByName("Speichern");
    readonly leistungsentscheidButton: IButton = this.buttonByName("Leistungsentscheid");

    constructor(page: Page, services?: IServiceContext) {
        super(page, services ?? ServiceContext.for(page));
    }
}
```

Regeln fuer Properties:
- Immer `readonly` (unveraenderlich nach Initialisierung).
- Typ ist immer das Interface (`IButton`, nicht `Button`).
- Benennung: beschreibend, camelCase, kein Praefix wie `btn` oder `txt`.
- Bevorzugte Factory-Methode: `byTestId` wenn moeglich, sonst `byName`, `byLabel`, `bySelector`.

---

## Schritt 5: Public Methoden implementieren

Methoden verwenden ausschliesslich Controls -- keine direkten Playwright-Aufrufe.

```typescript
export class RahmenbudgetPage extends PageObjectBase {
    // ... Controls (siehe Schritt 4) ...

    constructor(page: Page, services?: IServiceContext) {
        super(page, services ?? ServiceContext.for(page));
    }

    async navigateToRahmenbudget(): Promise<void> {
        await this.rahmenbudgetNavLink.click();
        await this.waitForPageReady();
    }

    async addSblPosition(params: {
        kategorie: string;
        betrag: string;
        gueltigAb: string;
    }): Promise<void> {
        await this.sblHinzufuegenButton.click();
        await this.waitForDialog();

        await this.kategorieDropdown.select(params.kategorie);
        await this.betragInput.fill(params.betrag);
        await this.gueltigAbDatePicker.fill(params.gueltigAb);

        await this.speichernButton.clickStable();
        await this.waitForAngularStable();
    }

    async openFreigabeVerwendungTab(): Promise<void> {
        await this.freigabeVerwendungTab.click();
        await this.waitForAngularStable();
    }

    async addLeistungsentscheid(): Promise<void> {
        await this.leistungsentscheidButton.click();
        await this.waitForDialog();
    }

    async validateMonatsbudget(expectedBetrag: string): Promise<void> {
        await this.betragInput.shouldContainText(expectedBetrag);
    }
}
```

Regeln fuer Methoden:
- Immer `async` mit Return-Type `Promise<void>` (oder `Promise<string>` etc.).
- Verwende `click()` fuer Standard-Klicks, `clickStable()` fuer kritische Klicks mit Retry.
- Nach Navigationen: `await this.waitForPageReady()`.
- Nach Formularen: `await this.waitForAngularStable()`.
- Fuer Dialoge: `await this.waitForDialog()` nach dem Oeffnen.
- Alte `*Async()` Methoden-Namen sind `@deprecated` Aliases und sollten nicht mehr verwendet werden.
- Parameter als Objekt-Typen fuer Methoden mit mehreren Parametern.

---

## Schritt 6: In index.ts exportieren

Fuege den Export in `libs/pages-v2/index.ts` hinzu:

```typescript
export { LoginPage } from "./login-page";
export { NavigationPage } from "./navigation-page";
export { RahmenbudgetPage } from "./rahmenbudget-page";  // NEU
```

---

## Schritt 7: Test schreiben

Erstelle einen Test der die neue Page validiert:

```typescript
import { test } from "@libs/test-fixtures";
import { TestUsers } from "@constants/credentials";
import { RahmenbudgetPage } from "@libs/pages-v2";
import { LoginPage, NavigationPage } from "@libs/pages-v2";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";

test(
    "Rahmenbudget-v2: SBL Position hinzufuegen",
    { tag: ["@functional-ui"] },
    async ({ page, seed, authenticatedRequest }) => {
        const loginPage = new LoginPage(page);
        const navigationPage = new NavigationPage(page);
        const rahmenbudgetPage = new RahmenbudgetPage(page);

        const uniqueId = sharedTestLogic.generateUniqueDossierId(seed);

        await test.step("Login", async () => {
            await loginPage.loginWithMsOnline(
                TestUsers.SOZIALARBEITERIN_1A.username,
                TestUsers.SOZIALARBEITERIN_1A.password
            );
        });

        await test.step("Dossier erstellen via API", async () => {
            await sharedTestLogic.createDossierViaApiOnly(
                authenticatedRequest, null, page, seed, uniqueId
            );
        });

        await test.step("Zum Rahmenbudget navigieren", async () => {
            await rahmenbudgetPage.navigateToRahmenbudget();
        });

        await test.step("SBL Position hinzufuegen", async () => {
            await rahmenbudgetPage.addSblPosition({
                kategorie: "Grundbedarf",
                betrag: "500.00",
                gueltigAb: "01.01.2026",
            });
        });
    }
);
```

---

## Vollstaendiges Beispiel: RahmenbudgetPage-v2

```typescript
// libs/pages-v2/rahmenbudget-page.ts

import { Page } from "@playwright/test";
import { PageObjectBase } from "@core/base";
import {
    IButton,
    ITextInput,
    IDropdown,
    IDatePicker,
    ILink,
    IServiceContext,
} from "@core/interfaces";
import { ServiceContext } from "@core/services";

export class RahmenbudgetPage extends PageObjectBase {
    // Navigation
    readonly rahmenbudgetNavLink: ILink = this.link("RahmenbudgetRoute");

    // Tabs
    readonly grundbedarfTab: IButton = this.buttonByName("Grundbedarf");
    readonly wohnkostenTab: IButton = this.buttonByName("Wohnkosten");
    readonly freigabeVerwendungTab: IButton = this.buttonByName(
        "Freigabe / Verwendung"
    );
    readonly monatsbudgetTab: IButton = this.buttonByName("Monatsbudget");

    // SBL Dialog
    readonly sblHinzufuegenButton: IButton = this.buttonByName(
        "SBL hinzufuegen"
    );
    readonly sblKategorieDropdown: IDropdown = this.dropdownByLabel("Kategorie");
    readonly sblBetragInput: ITextInput = this.textInputByLabel("Betrag");
    readonly sblGueltigAbDatePicker: IDatePicker =
        this.datePickerByLabel("Gueltig ab");

    // Leistungsentscheid
    readonly leistungsentscheidButton: IButton = this.buttonByName(
        "Leistungsentscheid"
    );

    // Common Actions
    readonly speichernButton: IButton = this.buttonByName("Speichern");
    readonly abbrechenButton: IButton = this.buttonByName("Abbrechen");

    // Validation Elements
    readonly monatsbudgetBetrag: ITextInput = this.textInputBySelector(
        ".monatsbudget-total"
    );

    constructor(page: Page, services?: IServiceContext) {
        super(page, services ?? ServiceContext.for(page));
    }

    async navigateToRahmenbudget(): Promise<void> {
        await this.rahmenbudgetNavLink.click();
        await this.waitForPageReady();
    }

    async addSblPosition(params: {
        kategorie: string;
        betrag: string;
        gueltigAb: string;
    }): Promise<void> {
        await this.sblHinzufuegenButton.click();
        await this.waitForDialog();

        await this.sblKategorieDropdown.select(params.kategorie);
        await this.sblBetragInput.fill(params.betrag);
        await this.sblGueltigAbDatePicker.fill(params.gueltigAb);

        await this.speichernButton.clickStable();
        await this.waitForAngularStable();
    }

    async openFreigabeVerwendungTab(): Promise<void> {
        await this.freigabeVerwendungTab.click();
        await this.waitForAngularStable();
    }

    async openMonatsbudgetTab(): Promise<void> {
        await this.monatsbudgetTab.click();
        await this.waitForAngularStable();
    }

    async addLeistungsentscheid(): Promise<void> {
        await this.leistungsentscheidButton.click();
        await this.waitForDialog();
    }

    async validateMonatsbudget(expectedBetrag: string): Promise<void> {
        await this.monatsbudgetBetrag.shouldContainText(expectedBetrag);
    }
}
```

---

## Haeufige Fehler vermeiden

| Fehler | Richtig |
|--------|---------|
| `this.page.click(...)` in einer Page-Methode | `this.speichernButton.click()` -- immer Controls verwenden |
| `private saveBtn = this.page.locator(...)` | `readonly speichernButton: IButton = this.buttonByName("Speichern")` -- Interface-Typ verwenden |
| Constructor ohne `ServiceContext.for(page)` Default | `constructor(page: Page, services?: IServiceContext) { super(page, services ?? ServiceContext.for(page)); }` |
| Import von `Button` statt `IButton` | Nur Interfaces importieren: `import { IButton } from "@core/interfaces"` |
| Neue Page in `libs/pages/` erstellen | Immer in `libs/pages-v2/` |
| `Locator` als Property-Typ | Verwende Interface-Typen: `IButton`, `ITextInput`, etc. |

---

## Verwandte Seiten

- [[ist-vs-soll]] -- Gegenuberstellung Ist vs Soll
- [[migration-roadmap]] -- Phasen-Plan und Prioritaeten
- [[agent-playbook-modern]] -- Entscheidungsbaum fuer Agents
- [[page-object-model]] -- BasePage vs PageObjectBase
