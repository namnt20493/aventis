# Agent Playbook: Modernes Framework

Entscheidungsbaum und Regeln fuer AI-Agents bei der Arbeit mit dem modernen Framework.

---

## Entscheidungsbaum

```
Welche Aufgabe liegt vor?
|
+-- "Neuer Functional UI Test?"
|   --> Modernes Framework (pages-v2 + PageObjectBase + Controls)
|   --> Siehe: "Neue Page erstellen" weiter unten
|
+-- "Neuer Acceptance Test?"
|   --> Modernes Framework (pages-v2 + API Workflows)
|   --> Kombiniert pages-v2 mit createDossierViaApiOnly() etc.
|
+-- "Keyword-Validation Test?"
|   --> Legacy Framework (Keywords + libs/pages/)
|   --> NICHT pages-v2 verwenden
|   --> Siehe: [[create-test-playbook]]
|
+-- "Bestehender Test reparieren?"
|   --> Im GLEICHEN Framework bleiben
|   --> Legacy-Test -> Legacy-Pages verwenden
|   --> Modern-Test -> pages-v2 verwenden
|   --> Siehe: [[fix-test-playbook]]
|
+-- "Neue Page noetig?"
|   --> IMMER in libs/pages-v2/ erstellen
|   --> NIEMALS in libs/pages/
|   --> Siehe: [[neue-page-erstellen]]
|
+-- "Neuer Control noetig?"
|   --> Interface in libs/core/interfaces/ definieren
|   --> Implementation in libs/core/controls/ erstellen
|   --> Factory-Method in PageObjectBase ergaenzen
|   --> Siehe: [[migration-roadmap#Phase 4: Neue Controls -- GEPLANT]]
|
+-- "Keyword auf Modern umstellen?"
|   --> Nur wenn EXPLIZIT beauftragt
|   --> Siehe: [[migration-roadmap#Phase 5: Test-Migration -- OPTIONAL]]
```

---

## Regeln

### MUSS-Regeln

1. **NIEMALS Legacy und Modern in derselben Page-Datei mischen.**
   - `libs/pages/rahmenbudget-page.ts` darf NICHT von `PageObjectBase` erben.
   - `libs/pages-v2/rahmenbudget-page.ts` darf NICHT direkte Playwright-Locators verwenden.

2. **Keywords verwenden weiterhin Legacy-Pages.**
   - Alle Keyword-Klassen in `libs/keywords/` verwenden `libs/pages/`.
   - Das wird erst in Phase 5 geaendert, und nur auf expliziten Auftrag.

3. **Neue Pages IMMER in pages-v2.**
   - Auch wenn der Agent "nur schnell eine Page braucht" -- immer `libs/pages-v2/`.
   - Einzige Ausnahme: Bugfix in einer bestehenden Legacy-Page.

4. **Bestehende Tests NICHT auf Modern migrieren ohne expliziten Auftrag.**
   - "Repariere diesen Test" heisst NICHT "Migriere diesen Test auf pages-v2".
   - Bleibe im Framework das der Test bereits verwendet.

5. **PageObjectBase + ServiceContext verwenden (NICHT BasePage).**
   - `BasePage` (`libs/pages/base-page.ts`) gehoert zum Legacy-Framework.
   - `PageObjectBase` (`libs/core/base/page-object-base.ts`) gehoert zum modernen Framework.
   - Wenn "modernes Framework" erwaehnt wird, ist IMMER `PageObjectBase` gemeint.

### SOLL-Regeln

6. **Controls ueber Factory-Methods erstellen, nicht direkt instanzieren.**
   - Richtig: `readonly saveButton: IButton = this.buttonByName("Speichern");`
   - Falsch: `readonly saveButton = new Button(this.page, this.page.locator("..."));`

7. **Interface-Typen verwenden, nicht Implementierungs-Typen.**
   - Richtig: `IButton`, `ITextInput`, `IDropdown`
   - Falsch: `Button`, `TextInput`, `Dropdown`

8. **Async-Suffix-Konvention einhalten.**
   - Alle Control-Methoden enden auf `Async`: `clickAsync()`, `fillAsync()`, `selectByTextAsync()`.
   - Page-Methoden verwenden kein Suffix: `navigateToRahmenbudget()`, `addSblPosition()`.

9. **Nach Navigationen und Dialogen warten.**
   - Nach Navigation: `await this.waitForPageReadyAsync();`
   - Nach Dialog-Oeffnung: `await this.waitForDialogAsync();`
   - Nach Angular-Aenderungen: `await this.waitForAngularStableAsync();`

---

## Framework-Erkennung

Wie erkennt der Agent, welches Framework ein bestehender Test verwendet?

| Merkmal | Legacy | Modern |
|---------|--------|--------|
| **Import-Pfad** | `from "@keywords/..."` oder `from "@pages/..."` | `from "@libs/pages-v2"` oder `from "@core/..."` |
| **Page-Instanzierung** | `new CommonKeyword(page)`, `new NavigationPage(page)` | `new LoginPage(page)`, `new NavigationPage(page)` (aus pages-v2) |
| **Locator-Typ** | `page.locator(...)`, `page.getByRole(...)` direkt | `this.button(...)`, `this.textInput(...)` Factory-Methods |
| **Basisklasse** | Keine oder `BasePage` | `PageObjectBase` |
| **Test-Ordner** | `staticTestcases/Keywordvalidation/` | (zukuenftig eigener Ordner fuer Functional UI Tests) |

---

## Neue Page erstellen: Kurzversion

Wenn ein Agent eine neue Page erstellen muss:

1. Datei in `libs/pages-v2/` erstellen (kebab-case).
2. `PageObjectBase` extenden.
3. `ServiceContext.for(page)` als Default im Constructor.
4. Controls als `readonly` Properties mit Interface-Typen.
5. Factory-Methods verwenden (`this.button(...)`, `this.textInput(...)` etc.).
6. Public Methoden: `async`, verwenden nur Controls.
7. In `libs/pages-v2/index.ts` exportieren.

Ausfuehrliche Anleitung: [[neue-page-erstellen]]

---

## Bestehende moderne Pages

Aktuell migrierte Pages (Stand Phase 2):

| Page | Import | Schluessel-Methoden |
|------|--------|-------------------|
| `LoginPage` | `import { LoginPage } from "@libs/pages-v2"` | `loginWithMsOnline()`, `loginWithDifferentMsAccount()`, `loginWithOtp()`, `expectUserLoggedIn()` |
| `NavigationPage` | `import { NavigationPage } from "@libs/pages-v2"` | `navigateToDossier()`, `navigateToRahmenbudget()`, `openMainMenu()`, `searchGlobal()` |

---

## Abgrenzung: Agent-Routing

| Aufgabe | Agent | Framework |
|---------|-------|-----------|
| Neuen Keyword-Validation Test erstellen | aventis-e2e-test-agent | Legacy |
| Neuen Functional UI Test erstellen | aventis-e2e-test-agent | Modern |
| Bestehenden Test reparieren | test-healer-agent | Bestehendes Framework beibehalten |
| Page in pages-v2 migrieren | aventis-e2e-test-agent | Modern |
| Neuen Control implementieren | aventis-e2e-test-agent | Modern |
| Keyword auf pages-v2 umstellen | aventis-e2e-test-agent | Modern (nur auf Auftrag) |

---

## Checkliste vor Abschluss

Bevor der Agent seine Arbeit als abgeschlossen meldet:

- [ ] Neue Page in `libs/pages-v2/` (NICHT `libs/pages/`)?
- [ ] `PageObjectBase` extended (NICHT `BasePage`)?
- [ ] Controls verwenden Interface-Typen (`IButton`, `ITextInput`, etc.)?
- [ ] Keine direkten Playwright-Aufrufe in Page-Methoden?
- [ ] `ServiceContext.for(page)` als Default im Constructor?
- [ ] Export in `libs/pages-v2/index.ts` hinzugefuegt?
- [ ] Kein Legacy/Modern-Mix in derselben Datei?

---

## Verwandte Seiten

- [[ist-vs-soll]] -- Gegenuberstellung Ist vs Soll
- [[migration-roadmap]] -- Phasen-Plan und Prioritaeten
- [[neue-page-erstellen]] -- Ausfuehrliche Anleitung
- [[create-test-playbook]] -- Playbook fuer neue Tests (Legacy)
- [[fix-test-playbook]] -- Playbook fuer Test-Reparaturen
- [[page-object-model]] -- BasePage vs PageObjectBase
