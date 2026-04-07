# Control Classes Usage Guide

This document describes how to use the new Control classes in the Aventis Playwright framework.

## Overview

The Control classes provide typed, stable wrappers around Playwright locators. **All interaction methods use StabilityHelper internally** - there is no distinction between "stable" and "standard" methods. Stability is built-in by default.

## Available Controls

| Control | Description | Common Use Cases |
|---------|-------------|------------------|
| `Button` | Buttons, submit, icons | Click actions, form submission |
| `TextInput` | Text fields, inputs | Form filling, search |
| `Dropdown` | Mat-select, autocomplete | Option selection |
| `Checkbox` | Checkboxes, switches | Toggle states |
| `DatePicker` | Date inputs, calendars | Date entry |
| `Link` | Anchor tags, navigation | Page navigation |

## Import Patterns

```typescript
// Import specific controls
import { Button, TextInput, Dropdown } from "@core/controls";

// Import from main core module
import { Button, TextInput, PageObjectBase } from "@core";

// Import for page objects
import { PageObjectBase } from "@core/base";
```

## Creating Controls

### Factory Methods

Each control provides multiple factory methods for common locator patterns:

```typescript
// By data-testid (preferred)
const submitBtn = Button.byTestId(page, "submit-btn");

// By accessible name/role
const loginBtn = Button.byName(page, "Login");

// By label text
const emailInput = TextInput.byLabel(page, "Email");

// By placeholder
const searchInput = TextInput.byPlaceholder(page, "Search...");

// By CSS selector
const customBtn = Button.bySelector(page, ".custom-button");

// Angular Material pattern (testId + root-control)
const dropdown = Dropdown.byAngularTestId(page, "status");
```

## Using Controls

### Button

```typescript
const submitBtn = Button.byTestId(page, "submit");

// Click (uses StabilityHelper internally)
await submitBtn.clickAsync();

// Click with options
await submitBtn.clickAsync({ timeout: 5000, retries: 3 });

// Click and wait for navigation
await submitBtn.clickAndWaitForNavigationAsync();

// Click and wait for API response
const response = await submitBtn.clickAndWaitForResponseAsync("/api/save");
```

### TextInput

```typescript
const nameInput = TextInput.byLabel(page, "Name");

// Fill (uses StabilityHelper internally)
await nameInput.fillAsync("John Doe");

// Fill with options
await nameInput.fillAsync("John", { clearFirst: true, triggerBlur: true });

// Type character by character
await nameInput.typeAsync("John", 50); // 50ms delay

// Fill date
await nameInput.fillDateAsync(new Date());

// Fill decimal
await nameInput.fillDecimalAsync(1234.56, 2);

// Fill and submit (press Enter)
await nameInput.fillAndSubmitAsync("search term");
```

### Dropdown

```typescript
const statusDropdown = Dropdown.byAngularTestId(page, "status");

// Select by text (uses StabilityHelper internally)
await statusDropdown.selectAsync("Active");

// Select with options
await statusDropdown.selectAsync("Active", { exact: true, timeout: 5000 });

// Type and select (autocomplete)
await statusDropdown.typeAndSelectAsync("Act", "Active");

// Get all options
const options = await statusDropdown.getOptionsAsync();

// Get selected text
const selected = await statusDropdown.getSelectedTextAsync();
```

### Checkbox

```typescript
const agreeCheckbox = Checkbox.byLabel(page, "I agree");

// Check
await agreeCheckbox.checkAsync();

// Uncheck
await agreeCheckbox.uncheckAsync();

// Toggle
await agreeCheckbox.toggleAsync();

// Set specific state
await agreeCheckbox.setCheckedAsync(true);

// Get state
const isChecked = await agreeCheckbox.isCheckedAsync();
```

### DatePicker

```typescript
const startDate = DatePicker.byAngularTestId(page, "startDate");

// Set date from Date object
await startDate.setDateAsync(new Date(2024, 2, 15));

// Set date string (Swiss format)
await startDate.setDateStringAsync("15.03.2024");

// Set today
await startDate.setTodayAsync();

// Set relative date
await startDate.setRelativeDateAsync(30); // 30 days from today

// Set first of month
await startDate.setFirstOfMonthAsync();
```

### Link

```typescript
const homeLink = Link.byText(page, "Home");

// Click (uses StabilityHelper internally)
await homeLink.clickAsync();

// Click and wait for navigation
await homeLink.clickAndWaitForNavigationAsync();

// Open in new tab
const newPage = await homeLink.clickAndOpenNewTabAsync();

// Get href
const href = await homeLink.getHrefAsync();
```

## Validation Methods (Should*)

All controls inherit validation methods from `ControlBase`:

```typescript
// Visibility
await button.shouldBeVisible();
await button.shouldBeHidden();

// State
await button.shouldBeEnabled();
await button.shouldBeDisabled();
await input.shouldBeEditable();

// Content
await button.shouldHaveText("Submit");
await button.shouldContainText("Sub");
await input.shouldHaveValue("expected value");

// Attributes
await link.shouldHaveAttribute("href", "/home");
await button.shouldHaveClass("primary");
```

## Page Object Pattern

Use `PageObjectBase` as the base class for page objects:

```typescript
import { PageObjectBase } from "@core/base";
import { Button, TextInput } from "@core/controls";

class LoginPage extends PageObjectBase {
    // Define controls using factory methods from base class
    readonly usernameInput = this.textInput("username");
    readonly passwordInput = this.textInput("password");
    readonly loginButton = this.button("login-btn");

    // Or using control factory methods directly
    readonly forgotPasswordLink = Link.byText(this.page, "Forgot Password?");

    constructor(page: Page) {
        super(page);
    }

    async login(username: string, password: string): Promise<void> {
        await this.usernameInput.fillAsync(username);
        await this.passwordInput.fillAsync(password);
        await this.loginButton.clickAsync();
        await this.waitForPageReadyAsync();
    }
}
```

### PageObjectBase Helper Methods

```typescript
// Control factories
this.button("testId")           // Button.byTestId
this.buttonByName("Submit")     // Button.byName
this.textInput("testId")        // TextInput.byTestId
this.angularTextInput("testId") // TextInput.byAngularTestId
this.dropdown("testId")         // Dropdown.byTestId
this.angularDropdown("testId")  // Dropdown.byAngularTestId
this.checkbox("testId")         // Checkbox.byTestId
this.datePicker("testId")       // DatePicker.byTestId
this.link("testId")             // Link.byTestId
this.linkByText("Click me")     // Link.byText

// Page methods (all use StabilityHelper internally)
await this.waitForPageReadyAsync();
await this.waitForAngularStableAsync();
await this.waitForDialogAsync();
await this.closeDialogAsync();

// Direct interactions (all use StabilityHelper internally)
await this.clickAsync(locator);
await this.fillAsync(locator, "value");
await this.selectOptionAsync(dropdown, "option");
await this.formSubmitAsync(button, successIndicator);

// Table methods
await this.clickTableRowAsync(table, "row text");
```

## Key Design Principle

**All methods use StabilityHelper by default.** There is no need to choose between "stable" and "standard" methods. Every interaction automatically:
- Waits for Angular stability
- Handles retries on failure
- Triggers change detection when needed
- Handles async button directives

## Migration from Old Pages

### Before (Direct Locators)

```typescript
class OldLoginPage {
    readonly page: Page;
    usernameInput: Locator;
    passwordInput: Locator;
    loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator("#username");
        this.passwordInput = page.locator("#password");
        this.loginButton = page.locator("#login-btn");
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}
```

### After (Typed Controls)

```typescript
class NewLoginPage extends PageObjectBase {
    readonly usernameInput = TextInput.byId(this.page, "username");
    readonly passwordInput = TextInput.byId(this.page, "password");
    readonly loginButton = Button.bySelector(this.page, "#login-btn");

    constructor(page: Page) {
        super(page);
    }

    async login(username: string, password: string) {
        await this.usernameInput.fillAsync(username);
        await this.passwordInput.fillAsync(password);
        await this.loginButton.clickAsync();
    }
}
```

## Best Practices

1. **Use Factory Methods**: Prefer `byTestId()` for stable selectors
2. **Trust the Defaults**: All methods are stable by default - no special handling needed
3. **Extend PageObjectBase**: For page objects, extend `PageObjectBase` to get helper methods
4. **Use Control Type**: Match control type to element type (Button for buttons, etc.)
5. **Validation**: Use `should*` methods for assertions instead of raw expect

## Existing Code Compatibility

The new controls work alongside existing code:
- Existing pages in `libs/pages/` continue to work unchanged
- New pages can be created in `libs/pages-v2/` using controls
- Controls can be used in existing keywords by creating them inline
- `StabilityHelper` methods are used internally by controls
