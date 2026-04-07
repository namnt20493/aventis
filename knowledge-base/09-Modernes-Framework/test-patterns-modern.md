# Test-Patterns -- Modernes Framework

Dieses Dokument beschreibt, wie Tests mit dem modernen Framework (Control-basiert, `libs/pages-v2/`) geschrieben werden. Es zeigt die Unterschiede zu Keyword-Driven Tests und stellt Templates fuer verschiedene Testarten bereit.

> **Phase 2.5 (2026-03-13):** Methoden ohne `Async`-Suffix (z.B. `click()` statt `clickAsync()`). `@step` Decorator fuer Report-Sichtbarkeit. `services: IServiceContext` Fixture. Neue Controls: `Table`, `Tab`. Neue Services: `NumberFormatter`, `StringHelper`, `FileUploadHelper`.

---

## Import-Patterns

### Pages-v2 importieren

```typescript
import { LoginPage, NavigationPage } from "@libs/pages-v2";
```

### Controls direkt importieren (fuer Inline-Nutzung im Test)

```typescript
import { Button, TextInput, Dropdown } from "@core/controls";
```

### Interfaces importieren (fuer Typ-Deklarationen)

```typescript
import { IButton, ITextInput, IDropdown } from "@core/interfaces";
```

### PageObjectBase importieren (fuer neue Pages)

```typescript
import { PageObjectBase } from "@core/base";
```

### ServiceContext importieren (selten noetig, nur in Pages)

```typescript
import { ServiceContext } from "@core/services";
```

---

## Testarten im Vergleich

| Aspekt | Keyword-Driven (Legacy) | Functional UI (Modern) | Acceptance (Hybrid) |
|--------|------------------------|----------------------|---------------------|
| **Page Objects** | `libs/pages/` (BasePage) | `libs/pages-v2/` (PageObjectBase) | Beide moeglich |
| **Abstraktions-Layer** | Keywords (`libs/keywords/`) | Direkte Page-Methoden | Keywords + Pages-v2 |
| **Typischer Einsatz** | Business-Logik, Regressionstests | UI-Validierung, Navigation | End-to-End mit API-Setup |
| **Tags** | `@keywordValidation`, `@all` | `@functionalUI` | `@acceptance` |
| **Verzeichnis** | `staticTestcases/Keywordvalidation/` | `staticTestcases/FunctionalUI/` | `staticTestcases/Acceptance/` |

---

## Template: Functional UI Test

Functional UI Tests validieren UI-Verhalten direkt ueber Page Objects aus `pages-v2/`. Kein Keyword-Layer.

```typescript
import { test, expect } from "@libs/test-fixtures";
import { LoginPage, NavigationPage } from "@libs/pages-v2";
import { TestUsers } from "@constants/credentials";

test(
    "MeinePage_Feature_Validieren",
    {
        tag: ["@[ADO_ID]", "@functionalUI"]
    },
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
            // Direkte Interaktion mit Page-Controls
            await nav.openMainMenu();
            await nav.dossierfuhrungMenuItem.shouldBeVisible();
            await page.keyboard.press("Escape");
        });
    }
);
```

### Beispiel aus der Codebasis: NavigationPage_MenuNavigation

Quelle: `staticTestcases/FunctionalUI/NavigationPage_MenuNavigation.spec.ts`

Dieser Test validiert alle Menue-Navigations-Methoden der NavigationPage:

```typescript
import { test, expect } from "@libs/test-fixtures";
import { LoginPage, NavigationPage } from "@libs/pages-v2";
import { TestUsers } from "@constants/credentials";

test(
    "NavigationPage_MenuNavigation_Methods",
    {
        tag: ["@[183690]", "@functionalUI"]
    },
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

        await test.step("openMainMenu - Top-Level validieren", async () => {
            await nav.openMainMenu();
            await nav.dossierfuhrungMenuItem.shouldBeVisible();
            await nav.buchhaltungMenuItem.shouldBeVisible();
            await page.keyboard.press("Escape");
        });

        await test.step("navigateToDossierOpen - Seite validieren", async () => {
            await nav.navigateToDossierOpen();
            await expect(
                page.getByText(/Dossier eröffnen|Ouvrir un dossier/i).first()
            ).toBeVisible({ timeout: 10000 });
        });
    }
);
```

Wichtige Merkmale:
- Kein Keyword-Layer -- direkte Nutzung von `LoginPage` und `NavigationPage`
- Should*-Methoden fuer Validierungen (`shouldBeVisible`, `waitForHidden`)
- `expect` aus Playwright nur fuer Assertions die kein Control abdeckt

---

## Template: Acceptance Test (Hybrid)

Acceptance Tests kombinieren API-Setup (schnell) mit modernen Page Objects fuer die Validierung. Keywords werden weiterhin fuer komplexe Business-Logik eingesetzt.

```typescript
import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { MeineKeyword } from "@keywords/meine-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { generateDossierViaApiWithPerson } from "@libs/workflows/apiDossierWorkflow";

test(
    "AT_Feature_Beschreibung",
    {
        tag: ["@[ADO_ID]", "@acceptance", "@all"]
    },
    async ({ page, seed, context, authenticatedRequest }) => {
        const commonKeyword = new CommonKeyword(page);
        const meineKeyword = new MeineKeyword(page);
        const uniqueDossierId = sharedTestLogic.generateUniqueDossierId(seed);

        // API-Setup (schnell)
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

### Beispiel aus der Codebasis: AT_Rahmenbudget_Spalten_Ein_Ausblenden

Quelle: `staticTestcases/Acceptance/AT_Rahmenbudget_Spalten_Ein_Ausblenden.spec.ts`

Dieser Acceptance Test nutzt API-Workflows fuer Setup und Keywords fuer Validierung:

```typescript
import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { RahmenbudgetKeyword } from "@keywords/rahmenbudget-keyword";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { generateDossierWithErwerbssituationAndWsh } from "@libs/workflows/guiDossierWorkflow";

test(
    "AT_Rahmenbudget_Spalten_Ein_Ausblenden",
    {
        tag: ["@[112373]", "@acceptance", "@rahmenbudget", "@all"]
    },
    async ({ page, seed, context, authenticatedRequest }) => {
        const commonKeyword = new CommonKeyword(page);
        const rahmenbudgetKeyword = new RahmenbudgetKeyword(page);
        const uniqueDossierId = sharedTestLogic.generateUniqueDossierId(seed);

        // Komplexes Setup via Workflow
        const dossierResult = await generateDossierWithErwerbssituationAndWsh(
            authenticatedRequest, commonKeyword, page, /* ... */ seed, uniqueDossierId, context
        );

        await test.step("R06_Spalten_Ein_Ausblenden", async () => {
            await rahmenbudgetKeyword.R06_Rahmenbudget_SpaltenEinAusblenden({
                dossier: uniqueDossierId,
                spaltenName: "Konto anzeigen",
                pruefenVisibleTitel: "Konto"
            });
        });
    }
);
```

Hinweis: Dieser Test nutzt das Legacy-Keyword-Framework (`RahmenbudgetKeyword`), da die Rahmenbudget-Page noch nicht in pages-v2 migriert ist. Das ist ein typisches Hybrid-Pattern.

---

## Template: Controls direkt im Test

Controls koennen auch direkt im Test erstellt werden, ohne eine Page-Klasse. Nuetzlich fuer einmalige Interaktionen.

```typescript
import { test } from "@libs/test-fixtures";
import { Button, TextInput } from "@core/controls";

test("Quick_Control_Check", { tag: ["@demo"] }, async ({ page }) => {
    await page.goto("/");

    // Controls direkt erstellen
    const menuButton = Button.byTestId(page, "aventis-menu");
    await menuButton.shouldBeVisible();
    await menuButton.shouldBeEnabled();

    // Factory-Methoden zeigen verschiedene Locator-Strategien
    const _byName = Button.byName(page, "Login");
    const _bySelector = Button.bySelector(page, "button.primary");
    const _inputByLabel = TextInput.byLabel(page, "Email");
    const _inputById = TextInput.byId(page, "email-input");
});
```

### Beispiel aus der Codebasis: ControlsDemo

Quelle: `staticTestcases/Debug/ControlsDemo.spec.ts`

Der ControlsDemo-Test zeigt drei Patterns:

1. **Pages-v2 nutzen**: `LoginPage` und `NavigationPage` instanziieren
2. **Controls direkt verwenden**: `Button.byTestId(page, "aventis-menu")` im Test
3. **Should*-Methoden fuer Validierung**: `menuButton.shouldBeVisible()`, `menuButton.shouldBeEnabled()`

```typescript
const loginPage = new LoginPage(page, services);
const navigationPage = new NavigationPage(page, services);

// Login mit neuem LoginPage
await loginPage.loginWithMsOnline(
    TestUsers.SOZIALARBEITERIN_1A.username,
    TestUsers.SOZIALARBEITERIN_1A.password
);

// Controls direkt im Test
const menuButton = Button.byTestId(page, "aventis-menu");
await menuButton.shouldBeVisible();
await menuButton.shouldBeEnabled();

// Page-Methoden nutzen
await navigationPage.openMainMenu();
```

---

## Unterschied zu Keyword-Driven Tests

### Keyword-Driven (Legacy-Pattern)

```typescript
// Keywords abstrahieren Business-Logik
const rahmenbudgetKeyword = new RahmenbudgetKeyword(page);
await rahmenbudgetKeyword.R05_Rahmenbudget_GBL_anpassen({ ... });
```

- Keywords nutzen `BasePage` und `libs/pages/`
- Hohe Abstraktion: Ein Keyword = kompletter Business-Schritt
- Tests lesen sich wie Testfall-Beschreibungen
- Wiederverwendbar ueber viele Tests

### Modern (Functional UI Pattern)

```typescript
// Direkte Page-Interaktion
const nav = new NavigationPage(page);
await nav.openMainMenu();
await nav.dossierfuhrungMenuItem.shouldBeVisible();
```

- Pages nutzen `PageObjectBase` und `libs/pages-v2/`
- Niedrigere Abstraktion: Einzelne UI-Interaktionen
- Tests validieren UI-Verhalten, nicht Business-Logik
- Geeignet fuer UI-Regressionstests

### Wann was verwenden?

| Szenario | Framework | Begruendung |
|----------|-----------|-------------|
| Neuer Business-Test (Rahmenbudget, Bewilligung, ...) | Keyword-Driven (Legacy) | Keywords existieren bereits, hohe Wiederverwendung |
| UI-Validierung (Navigation, Menu, Layout) | Modern (pages-v2) | Direkte UI-Interaktion, kein Business-Kontext |
| Neuer Page Object fuer bestehenden Bereich | Legacy (BasePage) | Keywords erwarten Legacy-Pages |
| Explizit "modernes Framework" gewuenscht | Modern (PageObjectBase) | Nutzervorgabe |
| Hybrid: API-Setup + UI-Validierung | Beide | API-Workflows + Keywords oder pages-v2 |

---

## Best Practices

1. **Kein Mix innerhalb einer Page**: Eine Page-Klasse erbt entweder von `BasePage` ODER `PageObjectBase`, nie beides.
2. **Controls vor Locators**: Verwende `this.button("id")` statt `this.page.getByTestId("id")` in pages-v2.
3. **Should*-Methoden vor expect**: Verwende `control.shouldBeVisible()` statt `expect(locator).toBeVisible()` wo moeglich.
4. **ServiceContext nicht manuell erstellen**: `ServiceContext.for(page)` wird automatisch im Konstruktor verwendet.
5. **Controls im Test nur fuer Einmal-Aktionen**: Wiederkehrende Controls gehoeren in eine Page-Klasse.

---

## Verwandte Seiten

- [[architektur]] -- Framework-Architektur
- [[controls-referenz]] -- Alle Controls im Detail
- [[page-object-base-referenz]] -- PageObjectBase Referenz
- [[pages-v2-referenz]] -- Implementierte Pages
- [[test-template]] -- Legacy Test-Template (Keyword-Driven)
- [[api-setup-patterns]] -- API-Workflows fuer Test-Setup
