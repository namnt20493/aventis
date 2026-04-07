# Controls-Referenz

Dieses Dokument beschreibt alle Control-Klassen des modernen Frameworks. Jedes Control implementiert ein Interface aus `libs/core/interfaces/` und kapselt die Playwright-spezifische Logik in `libs/core/controls/`.

Alle Controls erben von `ControlBase`, das die gemeinsamen Methoden aus `IControl` bereitstellt.

> **Phase 2.5 Update (2026-03-13):** Alle Methoden verwenden neue Namen ohne `Async`-Suffix (z.B. `click()` statt `clickAsync()`). Die alten Namen sind als `@deprecated` Aliases weiterhin verfuegbar. Alle Methoden haben `@step` Decorator (Report-Sichtbarkeit) und `executeWithContext()` (Error-Enrichment mit Control-Typ, Action, Locator und URL). Jedes Control hat eine `description` Property fuer menschenlesbare Fehlermeldungen.

---

## ControlBase (IControl) -- Gemeinsame Basis

**Datei**: `libs/core/controls/control-base.ts`
**Interface**: `libs/core/interfaces/IControl.ts`

Alle Controls erben diese Methoden. Sie werden nicht direkt instanziiert.

### State-Methoden

| Methode | Return | Beschreibung |
|---------|--------|-------------|
| `isVisible()` | `boolean` | Element sichtbar? |
| `isEnabled()` | `boolean` | Element aktiviert? |
| `isDisabled()` | `boolean` | Element deaktiviert? |
| `isEditable()` | `boolean` | Element editierbar? |

### Attribut-Methoden

| Methode | Return | Beschreibung |
|---------|--------|-------------|
| `getAttribute(name)` | `string \| null` | HTML-Attribut lesen |
| `getInnerText()` | `string` | Sichtbarer Text |
| `getTextContent()` | `string \| null` | Text-Inhalt inkl. versteckter Elemente |
| `hasClass(className)` | `boolean` | CSS-Klasse vorhanden? |

### Wait-Methoden

| Methode | Parameter | Beschreibung |
|---------|-----------|-------------|
| `waitForVisible(timeout?)` | timeout in ms | Warten bis sichtbar |
| `waitForHidden(timeout?)` | timeout in ms | Warten bis versteckt |
| `waitForAttached(timeout?)` | timeout in ms | Warten bis im DOM |
| `waitForDetached(timeout?)` | timeout in ms | Warten bis aus dem DOM entfernt |
| `waitForAngularStable()` | -- | Warten auf Angular-Stabilitaet |

### Focus- & Scroll-Methoden

| Methode | Beschreibung |
|---------|-------------|
| `focus()` | Element fokussieren |
| `blur()` | Fokus entfernen |
| `scrollIntoView()` | In den sichtbaren Bereich scrollen |
| `highlight()` | Element visuell hervorheben (Debugging) |

### Validierungs-Methoden (Should*)

| Methode | Beschreibung |
|---------|-------------|
| `shouldBeVisible(options?)` | Assert: sichtbar |
| `shouldBeHidden(options?)` | Assert: versteckt |
| `shouldBeAttached(options?)` | Assert: im DOM |
| `shouldBeEnabled(options?)` | Assert: aktiviert |
| `shouldBeDisabled(options?)` | Assert: deaktiviert |
| `shouldBeEditable(options?)` | Assert: editierbar |
| `shouldBeReadOnly(options?)` | Assert: nur-lesen |
| `shouldBeFocused(options?)` | Assert: fokussiert |
| `shouldHaveText(expected, options?)` | Assert: exakter Text |
| `shouldContainText(text, options?)` | Assert: Text enthalten |
| `shouldHaveAttribute(name, value, options?)` | Assert: Attribut-Wert |
| `shouldHaveClass(className, options?)` | Assert: CSS-Klasse |
| `shouldHaveCss(name, value, options?)` | Assert: CSS-Eigenschaft |
| `shouldHaveCount(count, options?)` | Assert: Anzahl Elemente |

Alle `options`-Parameter akzeptieren `{ timeout?: number }`.

---

## Button (IButton)

**Datei**: `libs/core/controls/button.ts`
**Interface**: `libs/core/interfaces/IButton.ts`

### Factory-Methoden

| Methode | Locator-Strategie |
|---------|-------------------|
| `Button.byTestId(page, testId, services?)` | `data-testid` Attribut (bevorzugt) |
| `Button.byName(page, name, exact?, services?)` | `getByRole("button", { name })` |
| `Button.byText(page, text, exact?, services?)` | `button:has-text("...")` |
| `Button.byLabel(page, label, services?)` | `getByLabel(label)` |
| `Button.bySelector(page, selector, services?)` | CSS-Selektor |
| `Button.nth(page, selector, index, services?)` | n-tes Element eines Selektors |

### Click-Aktionen (Standard Playwright)

| Methode | Beschreibung |
|---------|-------------|
| `click()` | Normaler Klick |
| `forceClick()` | Klick mit `force: true` (umgeht Sichtbarkeits-Checks) |
| `doubleClick()` | Doppelklick |
| `rightClick()` | Rechtsklick |
| `hover()` | Hover ueber Element |

### Click-Aktionen mit StabilityHelper

| Methode | Beschreibung |
|---------|-------------|
| `clickStable(options?)` | Stabiler Klick mit Angular-Handling |
| `waitAndClickStable(timeout?)` | Warten + stabiler Klick |
| `clickAndWaitForNavigationStable(timeout?)` | Klick + auf URL-Wechsel warten |
| `clickAndWaitForUrlStable(urlPattern, timeout?)` | Klick + auf bestimmte URL warten |
| `clickAndWaitForLoadStateStable(state?, timeout?)` | Klick + auf Load State warten |
| `clickAndWaitForResponseStable(urlPattern, timeout?)` | Klick + auf API-Response warten |
| `clickAndWaitForRequestStable(urlPattern, timeout?)` | Klick + auf Request warten |

**IButtonClickOptions:**
```typescript
{
    timeout?: number;
    retries?: number;
    waitBefore?: number;
    waitAfter?: number;
    force?: boolean;
    triggerChangeDetection?: boolean;
    waitForEnabled?: number;
}
```

### State-Properties

| Methode | Return | Beschreibung |
|---------|--------|-------------|
| `getText()` | `string` | Button-Text |
| `isPrimary()` | `boolean` | Primary-Button? (diverse CSS-Klassen) |
| `isFocused()` | `boolean` | Hat Fokus? |
| `getType()` | `string \| null` | type-Attribut |
| `isSubmitButton()` | `boolean` | Submit-Button? |
| `isLoading()` | `boolean` | Loading-State? |

### Beispiel

```typescript
const speichernBtn = Button.byTestId(page, "speichern");
await speichernBtn.click();
await speichernBtn.shouldBeEnabled();
await speichernBtn.shouldHaveText("Speichern");
```

---

## TextInput (ITextInput)

**Datei**: `libs/core/controls/text-input.ts`
**Interface**: `libs/core/interfaces/ITextInput.ts`

### Factory-Methoden

| Methode | Locator-Strategie |
|---------|-------------------|
| `TextInput.byTestId(page, testId, services?)` | `data-testid` Attribut |
| `TextInput.byAngularTestId(page, testId, services?)` | `data-testid` + `root-control` (Angular Material) |
| `TextInput.byLabel(page, label, exact?, services?)` | `getByLabel(label)` |
| `TextInput.byPlaceholder(page, placeholder, exact?, services?)` | `getByPlaceholder(...)` |
| `TextInput.byRole(page, name, exact?, services?)` | `getByRole("textbox", { name })` |
| `TextInput.byName(page, name, services?)` | `input[name="..."]` |
| `TextInput.byId(page, id, services?)` | `#id` Selektor |
| `TextInput.bySelector(page, selector, services?)` | CSS-Selektor |

### Fill-Operationen (Standard)

| Methode | Beschreibung |
|---------|-------------|
| `fill(value)` | Feld fuellen (ersetzt Inhalt) |
| `type(text, delay?)` | Zeichen fuer Zeichen tippen |
| `fillIfEmpty(value)` | Nur fuellen wenn leer, gibt `boolean` zurueck |
| `fillDate(date, format?)` | Datum als Date-Objekt eingeben |
| `fillDecimal(value, decimalPlaces?)` | Dezimalzahl formatiert eingeben |

### Fill-Operationen mit StabilityHelper

| Methode | Beschreibung |
|---------|-------------|
| `fillStable(value, options?)` | Stabiles Fuellen mit Angular-Handling |
| `waitAndFillStable(value, timeout?)` | Warten + stabiles Fuellen |

**ITextInputFillOptions:**
```typescript
{
    timeout?: number;
    retries?: number;
    clearFirst?: boolean;
    validate?: boolean;
    triggerBlur?: boolean;
}
```

### Clear-Operationen

| Methode | Beschreibung |
|---------|-------------|
| `clear()` | Feld leeren |
| `clearWithKeyboard()` | Ctrl+A + Delete |
| `clearAndFill(value)` | Leeren + Fuellen |

### Get-Operationen

| Methode | Return | Beschreibung |
|---------|--------|-------------|
| `getValue()` | `string` | Aktueller Wert |
| `getPlaceholder()` | `string \| null` | Placeholder-Text |
| `getType()` | `string` | Input-Typ (text, email, ...) |
| `getMaxLength()` | `number \| null` | maxlength-Attribut |

### Validation State

| Methode | Return | Beschreibung |
|---------|--------|-------------|
| `hasValue(expected)` | `boolean` | Wert gleich? |
| `isEmpty()` | `boolean` | Feld leer? |
| `isRequired()` | `boolean` | Pflichtfeld? |
| `isReadOnly()` | `boolean` | Nur-lesen? |
| `hasValidationError()` | `boolean` | Validierungsfehler? (Angular CSS-Klassen) |

### Keyboard-Operationen

| Methode | Beschreibung |
|---------|-------------|
| `pressKey(key)` | Taste druecken |
| `fillAndSubmit(value)` | Fuellen + Enter |
| `fillAndTab(value)` | Fuellen + Tab |

### Focus-Operationen

| Methode | Beschreibung |
|---------|-------------|
| `click()` | Klick auf Feld |
| `isFocused()` | Hat Fokus? |
| `selectAll()` | Alles selektieren (Ctrl+A) |

### Should*-Methoden (zusaetzlich zu ControlBase)

| Methode | Beschreibung |
|---------|-------------|
| `shouldHaveValue(expected, options?)` | Assert: Wert |
| `shouldHaveValueStartingWith(prefix, options?)` | Assert: Wert beginnt mit |
| `shouldHaveValueContaining(text, options?)` | Assert: Wert enthaelt |
| `shouldBeEmpty(options?)` | Assert: leer |
| `shouldNotBeEmpty(options?)` | Assert: nicht leer |
| `shouldHaveValueMatching(pattern, options?)` | Assert: Wert passt zu RegExp |

### Beispiel

```typescript
const nameInput = TextInput.byLabel(page, "Name");
await nameInput.fill("Hans Muster");
await nameInput.shouldHaveValue("Hans Muster");
```

---

## Dropdown (IDropdown)

**Datei**: `libs/core/controls/dropdown.ts`
**Interface**: `libs/core/interfaces/IDropdown.ts`

Unterstuetzt Angular Material `mat-select`, native `<select>` und Comboboxen.

### Factory-Methoden

| Methode | Locator-Strategie |
|---------|-------------------|
| `Dropdown.byTestId(page, testId, services?)` | `data-testid` |
| `Dropdown.byAngularTestId(page, testId, services?)` | `data-testid` + `root-control` |
| `Dropdown.byLabel(page, label, exact?, services?)` | `getByLabel(label)` |
| `Dropdown.byRole(page, name, exact?, services?)` | `getByRole("combobox", { name })` |
| `Dropdown.bySelector(page, selector, services?)` | CSS-Selektor |

### Select-Aktionen (Standard)

| Methode | Beschreibung |
|---------|-------------|
| `select(optionText, exact?, timeout?)` | Option per Text auswaehlen |
| `selectByIndex(index, timeout?)` | Option per Index auswaehlen |
| `typeAndSelect(searchText, optionText?, exact?, timeout?)` | Tippen + Option waehlen (Autocomplete) |
| `clear()` | Auswahl leeren |

### Select mit StabilityHelper

| Methode | Beschreibung |
|---------|-------------|
| `selectStable(optionText, options?)` | Stabile Auswahl mit Angular-Handling |

### State & Werte

| Methode | Return | Beschreibung |
|---------|--------|-------------|
| `getSelectedText()` | `string` | Aktuell gewaehlter Text |
| `getInputValue()` | `string` | Input-Wert (Combobox) |
| `hasSelection()` | `boolean` | Auswahl vorhanden? |
| `getOptions(timeout?)` | `string[]` | Alle verfuegbaren Optionen |
| `hasOption(optionText, timeout?)` | `boolean` | Option vorhanden? |
| `getOptionCount(timeout?)` | `number` | Anzahl Optionen |

### Native Select

| Methode | Beschreibung |
|---------|-------------|
| `selectByValue(value)` | Per value-Attribut |
| `selectByLabel(label)` | Per label |
| `selectMultiple(...values)` | Mehrfachauswahl |

### Should*-Methoden

| Methode | Beschreibung |
|---------|-------------|
| `shouldHaveSelected(expectedText, options?)` | Assert: gewaehlter Text |
| `shouldHaveSelectedValue(expectedValue, options?)` | Assert: gewaehlter Wert |
| `shouldContainOption(optionText, options?)` | Assert: Option vorhanden |
| `shouldHaveNoSelection(options?)` | Assert: keine Auswahl |

### Beispiel

```typescript
const statusDropdown = Dropdown.byAngularTestId(page, "status");
await statusDropdown.select("Aktiv");
await statusDropdown.shouldHaveSelected("Aktiv");

// Autocomplete
await statusDropdown.typeAndSelect("Akt", "Aktiv");
```

---

## Checkbox (ICheckbox)

**Datei**: `libs/core/controls/checkbox.ts`
**Interface**: `libs/core/interfaces/ICheckbox.ts`

Unterstuetzt Angular Material `mat-checkbox` und native Checkboxen.

### Factory-Methoden

| Methode | Locator-Strategie |
|---------|-------------------|
| `Checkbox.byTestId(page, testId, services?)` | `data-testid` |
| `Checkbox.byLabel(page, label, exact?, services?)` | `getByLabel(label)` |
| `Checkbox.byRole(page, name, exact?, services?)` | `getByRole("checkbox", { name })` |
| `Checkbox.byName(page, name, services?)` | `input[type='checkbox'][name='...']` |
| `Checkbox.bySelector(page, selector, services?)` | CSS-Selektor |

### Check-Aktionen

| Methode | Beschreibung |
|---------|-------------|
| `check(options?)` | Ankreuzen |
| `uncheck(options?)` | Abwaehlen |
| `toggle()` | Umschalten (Klick) |
| `setChecked(checked, options?)` | Auf bestimmten Zustand setzen |
| `checkIfNotChecked()` | Ankreuzen falls nicht angekreuzt. Gibt `boolean` zurueck. |
| `uncheckIfChecked()` | Abwaehlen falls angekreuzt. Gibt `boolean` zurueck. |

**ICheckboxOptions:**
```typescript
{ timeout?: number; force?: boolean; }
```

### State

| Methode | Return | Beschreibung |
|---------|--------|-------------|
| `isChecked()` | `boolean` | Angekreuzt? |
| `isIndeterminate()` | `boolean` | Unbestimmter Zustand? |
| `isRequired()` | `boolean` | Pflichtfeld? |

### Wait-Methoden

| Methode | Beschreibung |
|---------|-------------|
| `waitForChecked(timeout?)` | Warten bis angekreuzt |
| `waitForUnchecked(timeout?)` | Warten bis abgewaehlt |

### Should*-Methoden

| Methode | Beschreibung |
|---------|-------------|
| `shouldBeChecked(options?)` | Assert: angekreuzt |
| `shouldBeUnchecked(options?)` | Assert: nicht angekreuzt |
| `shouldBeIndeterminate(options?)` | Assert: unbestimmt |

### Beispiel

```typescript
const agreeCheckbox = Checkbox.byLabel(page, "Ich akzeptiere");
await agreeCheckbox.check();
await agreeCheckbox.shouldBeChecked();
```

---

## DatePicker (IDatePicker)

**Datei**: `libs/core/controls/date-picker.ts`
**Interface**: `libs/core/interfaces/IDatePicker.ts`

Unterstuetzt Angular Material `mat-datepicker` und native Datums-Inputs. Standard-Format: `dd.MM.yyyy` (Schweizer Format).

### Factory-Methoden

| Methode | Locator-Strategie |
|---------|-------------------|
| `DatePicker.byTestId(page, testId, services?)` | `data-testid` |
| `DatePicker.byAngularTestId(page, testId, services?)` | `data-testid` + `root-control` |
| `DatePicker.byLabel(page, label, exact?, services?)` | `getByLabel(label)` |
| `DatePicker.byPlaceholder(page, placeholder, exact?, services?)` | `getByPlaceholder(...)` |
| `DatePicker.bySelector(page, selector, services?)` | CSS-Selektor |

### Datums-Eingabe

| Methode | Beschreibung |
|---------|-------------|
| `setDate(date, format?)` | Datum via Date-Objekt setzen |
| `setDateString(dateString)` | Datums-String direkt eingeben |
| `setToday(format?)` | Heutiges Datum setzen |
| `setRelativeDate(days, format?)` | Relatives Datum (z.B. +30 Tage) |
| `setFirstOfMonth(format?)` | Erster des aktuellen Monats |
| `setLastOfMonth(format?)` | Letzter des aktuellen Monats |
| `setFirstOfYear(format?)` | Erster des aktuellen Jahres |
| `setLastOfYear(format?)` | Letzter des aktuellen Jahres |
| `clear()` | Feld leeren |

### Kalender-Operationen

| Methode | Beschreibung |
|---------|-------------|
| `openCalendar(toggleSelector?)` | Kalender-Popup oeffnen |
| `selectTodayFromCalendar()` | Heutiges Datum im Kalender klicken |
| `closeCalendar()` | Kalender schliessen (Escape) |

### Get-Operationen

| Methode | Return | Beschreibung |
|---------|--------|-------------|
| `getValue()` | `string` | Aktueller Wert als String |
| `getDate(format?)` | `Date \| null` | Wert als Date-Objekt |
| `hasValue()` | `boolean` | Hat einen Wert? |

### Validierung

| Methode | Return | Beschreibung |
|---------|--------|-------------|
| `hasValidationError()` | `boolean` | Validierungsfehler? |
| `getValidationError()` | `string \| null` | Fehlermeldung aus mat-error |

### Should*-Methoden

| Methode | Beschreibung |
|---------|-------------|
| `shouldHaveValue(expected, options?)` | Assert: String-Wert |
| `shouldHaveDate(expected, format?, options?)` | Assert: Date-Objekt |
| `shouldBeEmpty(options?)` | Assert: leer |
| `shouldNotBeEmpty(options?)` | Assert: nicht leer |

### Beispiel

```typescript
const startDate = DatePicker.byAngularTestId(page, "startDate");
await startDate.setToday();
await startDate.shouldNotBeEmpty();

await startDate.setRelativeDate(30);
await startDate.setDateString("15.03.2024");
```

---

## Link (ILink)

**Datei**: `libs/core/controls/link.ts`
**Interface**: `libs/core/interfaces/ILink.ts`

### Factory-Methoden

| Methode | Locator-Strategie |
|---------|-------------------|
| `Link.byTestId(page, testId, services?)` | `data-testid` |
| `Link.byText(page, text, exact?, services?)` | `getByRole("link", { name })` |
| `Link.byPattern(page, pattern, services?)` | `getByRole("link", { name: /regex/ })` |
| `Link.byHref(page, href, services?)` | `a[href*='...']` |
| `Link.bySelector(page, selector, services?)` | CSS-Selektor |
| `Link.nth(page, selector, index, services?)` | n-tes Element |

### Click-Aktionen (Standard)

| Methode | Beschreibung |
|---------|-------------|
| `click()` | Normaler Klick |
| `hover()` | Hover |
| `clickAndOpenNewTab(timeout?)` | Ctrl+Klick, gibt neue `Page` zurueck |

### Click-Aktionen mit StabilityHelper

| Methode | Beschreibung |
|---------|-------------|
| `clickStable(options?)` | Stabiler Klick |
| `clickAndWaitForNavigationStable(timeout?)` | Klick + URL-Wechsel |
| `clickAndWaitForUrlStable(urlPattern, timeout?)` | Klick + bestimmte URL |

### Properties

| Methode | Return | Beschreibung |
|---------|--------|-------------|
| `getHref()` | `string \| null` | href-Attribut |
| `getTarget()` | `string \| null` | target-Attribut |
| `getText()` | `string` | Link-Text |
| `opensInNewTab()` | `boolean` | target="_blank"? |
| `isExternal()` | `boolean` | Externer Link (http/https)? |
| `isInternal()` | `boolean` | Interner Link? |
| `isMailto()` | `boolean` | mailto-Link? |
| `isTel()` | `boolean` | tel-Link? |

### Should*-Methoden

| Methode | Beschreibung |
|---------|-------------|
| `shouldHaveHref(expected, options?)` | Assert: href |
| `shouldHaveLinkText(expected, options?)` | Assert: Link-Text |
| `shouldOpenInNewTab(options?)` | Assert: target="_blank" |

### Beispiel

```typescript
const journalLink = Link.byText(page, "Journal");
await journalLink.click();
await journalLink.shouldHaveHref(/journal/);
```

---

## Table (ITable)

**Datei**: `libs/core/controls/table.ts`
**Interface**: `libs/core/interfaces/ITable.ts`

Unterstuetzt HTML-Tabellen und Angular Material `mat-table`.

### Factory-Methoden

| Methode | Locator-Strategie |
|---------|-------------------|
| `Table.byTestId(page, testId, services?)` | `data-testid` |
| `Table.bySelector(page, selector, services?)` | CSS-Selektor |
| `Table.byRole(page, services?)` | `getByRole("table")` |

### Methoden

| Methode | Return | Beschreibung |
|---------|--------|-------------|
| `getRowCount()` | `number` | Anzahl Zeilen |
| `getRow(index)` | `ITableRow` | Zeile per Index |
| `getRowByText(text, options?)` | `ITableRow` | Zeile per Text-Suche |
| `getAllRowTexts()` | `string[]` | Alle Zeilen-Texte |
| `getHeaderTexts()` | `string[]` | Header-Texte |
| `getCellText(row, col)` | `string` | Zellen-Text |
| `waitForRows(options?)` | `void` | Warten auf Zeilen |

### ITableRow

| Methode | Return | Beschreibung |
|---------|--------|-------------|
| `click()` | `void` | Zeile klicken |
| `getText()` | `string` | Zeilen-Text |
| `getCell(columnIndex)` | `Locator` | Zelle per Index |
| `getCellByText(text)` | `Locator` | Zelle per Text |

### Should*-Methoden

| Methode | Beschreibung |
|---------|-------------|
| `shouldHaveRowCount(count, options?)` | Assert: Anzahl Zeilen |
| `shouldContainRowWithText(text, options?)` | Assert: Zeile mit Text vorhanden |

---

## Tab (ITab)

**Datei**: `libs/core/controls/tab.ts`
**Interface**: `libs/core/interfaces/ITab.ts`

Unterstuetzt Angular Material Tab Groups.

### Factory-Methoden

| Methode | Locator-Strategie |
|---------|-------------------|
| `Tab.byTestId(page, testId, services?)` | `data-testid` |
| `Tab.bySelector(page, selector, services?)` | CSS-Selektor |

### Methoden

| Methode | Return | Beschreibung |
|---------|--------|-------------|
| `selectByName(name)` | `void` | Tab per Name auswaehlen |
| `selectByIndex(index)` | `void` | Tab per Index auswaehlen |
| `getActiveTabName()` | `string` | Aktiver Tab-Name |
| `getTabNames()` | `string[]` | Alle Tab-Namen |
| `getTabCount()` | `number` | Anzahl Tabs |

### Should*-Methoden

| Methode | Beschreibung |
|---------|-------------|
| `shouldBeSelected(name, options?)` | Assert: Tab ist aktiv |
| `waitForTabPanelContent(timeout?)` | Warten auf Tab-Inhalt |

---

## Geplante Controls (noch nicht implementiert)

| Control | Interface | Zweck |
|---------|-----------|-------|
| RadioButton | IRadioButton | Radio-Button-Gruppen |
| ToggleSwitch | IToggleSwitch | Toggle-Switches (mat-slide-toggle) |
| FileUpload | IFileUpload | Datei-Uploads |

---

## Verwandte Seiten

- [[architektur]] -- Framework-Architektur und Design-Prinzipien
- [[page-object-base-referenz]] -- Factory-Methoden in PageObjectBase
- [[test-patterns-modern]] -- Wie Tests mit Controls geschrieben werden
