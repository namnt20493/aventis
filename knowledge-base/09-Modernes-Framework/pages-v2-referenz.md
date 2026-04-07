# Pages-v2 -- Referenz

Dieses Dokument beschreibt die bereits implementierten Page Objects im modernen Framework (`libs/pages-v2/`). Beide Pages erweitern `PageObjectBase` und sind Playwright-unabhaengig.

---

## LoginPage

**Datei**: `libs/pages-v2/login-page.ts`

Die LoginPage unterstuetzt drei Login-Varianten: Microsoft Online, Wallis (Keycloak) und OTP.

### Konstruktor

```typescript
constructor(page: Page, services?: IServiceContext)
```

Services sind optional -- Fallback auf `ServiceContext.for(page)`.

### Controls

#### Microsoft Online Login

| Property | Typ | Locator |
|----------|-----|---------|
| `useAnotherAccountLink` | `ILink` | `linkByText("Use another account")` |
| `usernameInput` | `ITextInput` | `textInputById("i0116")` |
| `passwordInput` | `ITextInput` | `textInputById("i0118")` |
| `submitButton` | `IButton` | `buttonBySelector('input[type="submit"]')` |

#### Wallis Login

| Property | Typ | Locator |
|----------|-----|---------|
| `wallisUsernameInput` | `ITextInput` | `textInputById("username")` |
| `wallisPasswordInput` | `ITextInput` | `textInputById("password")` |
| `wallisSignInButton` | `IButton` | `buttonBySelector("#kc-login")` |

#### OTP Login

| Property | Typ | Locator |
|----------|-----|---------|
| `ldapLoginButton` | `IButton` | `buttonBySelector("#loginLdap")` |
| `otpUsernameInput` | `ITextInput` | `textInputById("username")` |
| `otpPasswordInput` | `ITextInput` | `textInputById("password")` |
| `otpInput` | `ITextInput` | `textInputById("otp")` |
| `otpLoginButton` | `IButton` | `buttonBySelector("#login")` |

#### User Info

| Property | Typ | Locator |
|----------|-----|---------|
| `userNameDisplay` | `ITextInput` | `textInputBySelector(".selection-card-slim.user-card .username .name")` |
| `teamDisplay` | `ITextInput` | `textInputBySelector(".team")` |
| `navbarUsernameButton` | `IButton` | `button("navbar-username")` |
| `versionDisplay` | `ITextInput` | `textInputBySelector("div[class='versions'] span")` |

### Oeffentliche Methoden

| Methode | Beschreibung |
|---------|-------------|
| `loginWithMsOnline(username, password)` | Login via Microsoft Online. Behandelt "Use another account" automatisch. |
| `loginWithDifferentMsAccount(username, password)` | Login mit anderem MS-Konto (klickt explizit "Use another account"). |
| `loginWithWallisAccount(username, password)` | Login via Wallis/Keycloak. |
| `loginWithOtp(username, password)` | Login via OTP (TOTP). Benoetigt Umgebungsvariable `TOTP_SECRET_<USERNAME>`. |
| `expectUserLoggedIn(fullname)` | Prueft ob bestimmter User eingeloggt ist. |
| `expectUserTeam(team)` | Prueft Team-Zugehoerigkeit. |
| `checkVersionNumber(version)` | Prueft Versionsnummer (oeffnet User-Menue). |

### Verwendung

```typescript
import { LoginPage } from "@libs/pages-v2";
import { TestUsers } from "@constants/credentials";

const loginPage = new LoginPage(page);
await page.goto("/");
await loginPage.loginWithMsOnline(
    TestUsers.SOZIALARBEITERIN_1A.username,
    TestUsers.SOZIALARBEITERIN_1A.password
);
```

---

## NavigationPage

**Datei**: `libs/pages-v2/navigation-page.ts`

Die NavigationPage kapselt das Hauptmenue, die globale Suche, Sidebar-Navigation und User-Info.

### Konstruktor

```typescript
constructor(page: Page, services?: IServiceContext)
```

### Controls

#### Hauptmenue

| Property | Typ | Locator |
|----------|-----|---------|
| `mainMenuButton` | `IButton` | `button("aventis-menu")` |
| `dossierOpenButton` | `IButton` | `buttonByName("Dossier eröffnen")` |
| `soforthilfeButton` | `IButton` | `buttonByName("Soforthilfe erfassen")` |
| `aufgabenButton` | `IButton` | `buttonByName("Aufgabenübersicht")` |
| `dokumenteneingangButton` | `IButton` | `buttonByName("Dokumenteneingang")` |
| `bewilligungenButton` | `IButton` | Regex-Selektor (DE/FR) |
| `zeitErfassenButton` | `IButton` | `buttonByName("Zeit erfassen")` |
| `dossierfuhrungMenuItem` | `IButton` | Regex-Selektor (DE/FR) |
| `buchhaltungMenuItem` | `IButton` | Regex-Selektor (DE/FR) |
| `zahlungenMenuItem` | `ILink` | Regex-Selektor (DE/FR) |

#### Suche

| Property | Typ | Locator |
|----------|-----|---------|
| `globalSearchInput` | `ITextInput` | `textInputBySelector("#global-search-input")` |

#### Sidebar-Navigation (Links)

| Property | Typ | Locator |
|----------|-----|---------|
| `ubersichtLink` | `ILink` | `link("FevUebersichtRoute")` |
| `kontoauszugLink` | `ILink` | `link("KontoauszugInDossierRoute")` |
| `journalLink` | `ILink` | `linkByText("Journal")` |
| `zieleLink` | `ILink` | `link("ZieleRoute")` |
| `wohnsituationLink` | `ILink` | `linkByPattern(/Wohnsituation - Haushalt\|.../i)` |
| `bezugspersonenLink` | `ILink` | `linkByText("Bezugspersonen")` |
| `institutionenLink` | `ILink` | `linkByText("Institutionen")` |
| `beschwerdenLink` | `ILink` | `linkByText("Beschwerden")` |
| `dossierubersichtLink` | `ILink` | `linkByText("Dossierübersicht")` |
| `dokumenteLink` | `ILink` | `linkByText("Dokumente")` |
| `rahmenbudgetLink` | `ILink` | `link("RahmenbudgetRoute")` |

#### User Info & Sonstiges

| Property | Typ | Locator |
|----------|-----|---------|
| `userNameElement` | `ITextInput` | `textInputBySelector("span.name")` |
| `userTeamElement` | `ITextInput` | `textInputBySelector("span.team")` |
| `notificationButton` | `IButton` | `button("navbar-notification")` |
| `lastOpenedButton` | `IButton` | `buttonByName("zuletzt geöffnet")` |
| `rollUpButton` | `IButton` | Navigation Tree zuklappen |
| `rollDownButton` | `IButton` | Navigation Tree aufklappen |

### Oeffentliche Methoden

#### Menue-Navigation

| Methode | Beschreibung |
|---------|-------------|
| `openMainMenu()` | Hauptmenue oeffnen |
| `openDossierfuhrungMenu()` | Hauptmenue -> Dossierfuehrung |
| `openBuchhaltungMenu()` | Hauptmenue -> Buchhaltung |
| `navigateToDossierOpen()` | Dossierfuehrung -> Dossier eroeffnen |
| `navigateToDokumenteneingang()` | Dossierfuehrung -> Dokumenteneingang |
| `navigateToBewilligungen()` | Dossierfuehrung -> Bewilligungen |
| `navigateToAufgaben()` | Dossierfuehrung -> Aufgabenuebersicht |

#### Suche

| Methode | Beschreibung |
|---------|-------------|
| `searchGlobal(searchTerm)` | Globale Suche ausfuehren (fill + Enter) |
| `navigateToDossier(dossierName)` | Dossier suchen und zum ersten Ergebnis navigieren. Verwendet `fillStableAsync` mit Validierung. |

#### Sidebar

| Methode | Beschreibung |
|---------|-------------|
| `navigateToJournal()` | Sidebar: Journal oeffnen |
| `navigateToWohnsituation()` | Sidebar: Wohnsituation oeffnen |
| `navigateToRahmenbudget()` | Sidebar: Rahmenbudget oeffnen |
| `navigateToZiele()` | Sidebar: Ziele oeffnen |
| `navigateToKontoauszug()` | Sidebar: Kontoauszug oeffnen |
| `navigateToDokumente()` | Sidebar: Dokumente oeffnen |

#### Navigation Tree

| Methode | Beschreibung |
|---------|-------------|
| `collapseNavigationTree()` | Navigationsbaum zuklappen |
| `expandNavigationTree()` | Navigationsbaum aufklappen |

#### User Info

| Methode | Return | Beschreibung |
|---------|--------|-------------|
| `getCurrentUserName()` | `string` | Aktueller Benutzername |
| `getCurrentUserTeam()` | `string` | Aktuelles Team |
| `openNotifications()` | -- | Benachrichtigungen oeffnen |
| `openLastOpened()` | -- | Zuletzt geoeffnet anzeigen |

### Verwendung

```typescript
import { NavigationPage } from "@libs/pages-v2";

const nav = new NavigationPage(page);

// Zum Dossier navigieren
await nav.navigateToDossier("2026-TestDossier-001");

// Sidebar-Navigation
await nav.navigateToRahmenbudget();

// Hauptmenue
await nav.navigateToDossierOpen();
```

---

## Status-Uebersicht

### Implementiert

| Page | Datei | Controls | Methoden |
|------|-------|----------|----------|
| LoginPage | `login-page.ts` | 12 | 7 oeffentliche |
| NavigationPage | `navigation-page.ts` | 23 | 17 oeffentliche |

### Noch nicht migriert (in `libs/pages/` als Legacy)

Alle weiteren Pages existieren nur im Legacy-Framework. Kandidaten fuer Migration:

- RahmenbudgetPage
- DossierPage
- KlientschaftPage
- WohnsituationPage
- BuchhaltungPage
- DokumentePage
- BedarfspruefungPage
- BewilligungPage
- u.v.m.

Migration erfolgt bei Bedarf via `/migrate-to-basepage` Kommando.

---

## Verwandte Seiten

- [[architektur]] -- Framework-Architektur
- [[page-object-base-referenz]] -- PageObjectBase Methoden-Referenz
- [[controls-referenz]] -- Control-Klassen im Detail
- [[test-patterns-modern]] -- Test-Templates fuer pages-v2
