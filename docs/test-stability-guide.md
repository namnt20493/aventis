# Test Stability Guide

## Problem: Tests Running Too Fast

When your Playwright tests run faster than your application can respond, you'll see these symptoms:
- Random test failures
- "Element not found" errors
- Actions happening before the UI is ready
- Inconsistent test results

## Solution: Use Stability Helpers

### 1. **Quick Fixes** (Configuration Level)

#### Global Settings
The configuration has been updated with better default timeouts:
- Action timeout: 45 seconds (was 20s)
- Navigation timeout: 60 seconds (was 20s)
- Expect timeout: 15 seconds (was 5s)
- SLOWMO: 500ms (was 10ms)

#### Environment Variables
Create a `.env` file with these stability settings:
```bash
# For stable applications
SLOWMO=300
STABILITY_DELAY=1000
TIMEOUT_MULTIPLIER=1.5

# For problematic applications
SLOWMO=1000
STABILITY_DELAY=3000
TIMEOUT_MULTIPLIER=2.0
```

### 2. **Code-Level Improvements**

#### Instead of Direct Actions, Use Stable Methods

❌ **Old Way (Unstable):**
```typescript
await page.locator("#button").click();
await page.locator("#input").fill("text");
```

✅ **New Way (Stable):**
```typescript
// In your test or keyword class
await commonKeyword.stableClick(page.locator("#button"), {
    description: "Submit button",
    waitBefore: 500,
    waitAfter: 1000
});

await commonKeyword.stableFill(page.locator("#input"), "text", {
    description: "Name field",
    validate: true
});
```

#### Wait for Application Readiness

❌ **Old Way:**
```typescript
await page.goto(url);
// Immediately continue - might be too fast!
```

✅ **New Way:**
```typescript
await commonKeyword.L00_URLAventis({ url });
await commonKeyword.waitForApplicationReady();
```

#### Add Stability Delays for Critical Sections

```typescript
await test.step("Critical operation", async () => {
    await commonKeyword.stabilityDelay(); // Uses STABILITY_DELAY env var
    await someAction();
    await commonKeyword.waitForApplicationReady();
});
```

### 3. **Keyword Development Best Practices**

#### When Creating New Keywords:

1. **Always use stability helpers for interactions:**
   ```typescript
   // Import at the top
   import { StabilityHelper } from "@utils/stability-helper";

   export class MyKeyword {
       private stability: StabilityHelper;

       constructor(page: Page) {
           this.stability = new StabilityHelper(page);
       }

       async MY_KEYWORD_Method() {
           // Use stable methods
           await this.stability.stableClick(locator);
           await this.stability.stableFill(input, value);
           await this.stability.waitForPageStability();
       }
   }
   ```

2. **Add waits after navigation:**
   ```typescript
   async navigateToPage() {
       await this.page.goto(url);
       await this.stability.waitForPageStability({
           additionalWait: 2000 // 2 second buffer
       });
   }
   ```

3. **Use descriptive logging:**
   ```typescript
   await this.stability.stableClick(button, {
       description: "Save dossier button", // Helps debugging
       waitBefore: 500,
       waitAfter: 1000
   });
   ```

### 4. **Closing Dialogs Reliably**

Dialog closing is a common source of test flakiness due to animations and timing issues. Use the global `closeDialog` methods:

#### Using StabilityHelper directly (in Page classes):
```typescript
import { StabilityHelper } from "@utils/stability-helper";

export class MyPage {
    private stabilityHelper: StabilityHelper;

    constructor(page: Page) {
        this.stabilityHelper = new StabilityHelper(page);
    }

    async closeDialog() {
        // Uses default close button selector [data-testid="close-dialog"]
        await this.stabilityHelper.closeDialog();
    }

    async closeCustomDialog() {
        // For dialogs with different close button
        await this.stabilityHelper.closeDialog({
            closeButtonSelector: '[data-cy="custom-close"]',
            dialogSelector: 'app-custom-dialog',
            retries: 5
        });
    }

    async cancelDialog() {
        // Close via "Abbrechen" button
        await this.stabilityHelper.closeDialogWithCancel();
    }
}
```

#### Using CommonKeyword (in Keywords/Tests):
```typescript
// In your test or keyword
await commonKeyword.closeDialog();

// Or with custom options
await commonKeyword.closeDialog({
    closeButtonSelector: '[data-testid="close-dialog"]',
    dialogSelector: 'mat-dialog-container',
    timeout: 15000,
    retries: 5
});

// Cancel dialog
await commonKeyword.closeDialogWithCancel();
```

#### How it works:
1. Checks if dialog is visible (exits early if not)
2. Waits for close button to be visible
3. Waits for animation (200ms default)
4. Clicks close button with `force: true`
5. Waits for dialog to disappear
6. Retries up to 3 times if dialog is still visible
7. Throws error only if all retries fail and dialog is still visible

#### Migration from old closeDialog:

❌ **Old Way (Unreliable):**
```typescript
async closeDialog() {
    await this.btnSchliessen.click();
}
```

✅ **New Way (Reliable):**
```typescript
async closeDialog() {
    await this.stabilityHelper.closeDialog();
}
```

### 5. **Angular-Specific Stability Features**

The `StabilityHelper` class includes special handling for Angular-specific issues that commonly cause test flakiness:

#### Angular Form Pristine Problem
Angular forms remain "pristine" until user interaction triggers change detection. Playwright's `fill()` doesn't always mark forms as dirty, causing save buttons to stay disabled.

**Solution: Use `triggerChangeDetection` option:**
```typescript
// Click with Angular change detection
await this.stabilityHelper.stableClick(saveButton, {
    triggerChangeDetection: true  // Triggers Angular change detection before click
});

// Fill with automatic blur (commits value to Angular)
await this.stabilityHelper.stableFill(inputField, "value", {
    triggerBlur: true  // Default: true - blurs element after fill
});
```

#### asyncClick Directive
Aventis uses `asyncClick` directive that disables buttons during async operations. `stableClick` automatically waits for the button to be re-enabled after clicking.

#### throttledClick Directive
The `throttledClick` directive adds a 500ms debounce. `stableClick` handles this via the `waitForEnabled` option.

#### Force Angular Form Update
When a form is stuck in "pristine" state despite having values:
```typescript
await this.stabilityHelper.forceAngularFormUpdate();
// Dispatches input/change/blur events on ALL form inputs
// Also handles mat-select elements
```

### 6. **stableClick - Complete Options Reference**

The `stableClick` method is the most important stability helper. Here are all available options:

```typescript
await this.stabilityHelper.stableClick(locator, {
    timeout: 30000,              // Overall timeout (default: 30s)
    retries: 3,                  // Number of retry attempts (default: 3)
    waitBefore: 150,             // Wait before click in ms (default: 150ms)
    waitAfter: 300,              // Wait after click in ms (default: 300ms)
    force: false,                // Force click even if element is obscured
    triggerChangeDetection: false, // Trigger Angular change detection before click
    waitForEnabled: 10000        // Wait for button to be enabled (default: 10s)
});
```

**When to use which option:**

| Option | Use When |
|--------|----------|
| `triggerChangeDetection: true` | Save/Submit buttons stay disabled after filling forms |
| `waitForEnabled: 15000` | Button takes long to validate/enable |
| `force: true` | Element is covered by tooltip/overlay |
| `retries: 5` | Network-dependent buttons that sometimes fail |
| `waitBefore: 500` | UI animation needs to complete first |
| `waitAfter: 1000` | Need to wait for page response after click |

### 7. **stableFormSubmit - For Form Submissions**

A specialized method for reliable form submission that handles all Angular quirks:

```typescript
await this.stabilityHelper.stableFormSubmit(
    saveButton,                          // The submit button locator
    successToast,                        // Success indicator (locator or async function)
    {
        timeout: 20000,                  // Overall timeout
        waitBeforeSubmit: 200,           // Wait before clicking submit
        ensureEnabled: true,             // Wait for button to be enabled first
        waitForEnabledTimeout: 10000,    // How long to wait for enabled
        triggerChangeDetection: true,    // Trigger Angular change detection
        blurActiveElement: true          // Blur focused element to commit values
    }
);
```

**What it does automatically:**
1. Blurs the active element (commits pending input values)
2. Triggers Angular change detection (marks form as dirty)
3. Waits for submit button to be enabled
4. If still disabled, calls `forceAngularFormUpdate()` as fallback
5. Clicks with retry logic
6. Verifies success indicator appears

**Example with success verification function:**
```typescript
await this.stabilityHelper.stableFormSubmit(
    this.page.getByRole("button", { name: "Speichern" }),
    async () => {
        // Custom verification: wait for dialog to close
        await expect(this.page.locator("mat-dialog-container")).toBeHidden();
    }
);
```

### 8. **stableSelectOption - For Dropdowns**

Handles Angular Material dropdowns and native selects:

```typescript
await this.stabilityHelper.stableSelectOption(
    dropdownLocator,           // The dropdown trigger
    "Option Text",             // Text of option to select
    {
        timeout: 10000,
        waitBefore: 100,
        waitAfter: 200,
        useRole: true,                  // Use getByRole("option") - default: true
        triggerChangeDetection: true    // Mark form as dirty after selection
    }
);
```

### 9. **stableDragAndDrop - For Drag Operations**

Reliable drag and drop with verification:

```typescript
const success = await this.stabilityHelper.stableDragAndDrop(
    sourceElement,
    targetElement,
    {
        timeout: 30000,
        retries: 3,
        steps: 10,                      // Number of intermediate mouse positions
        waitBefore: 300,
        waitAfter: 200,
        verifyMove: async (source, target) => {
            // Custom verification that drag succeeded
            return await target.locator(".dropped-item").count() > 0;
        }
    }
);
```

### 10. **waitForAngularStable - Fast Angular Stability Check**

A fast alternative to waiting for Angular testabilities (which can be slow):

```typescript
await this.stabilityHelper.waitForAngularStable({ timeout: 2000 });
```

**How it works:**
1. Waits for 2 RequestAnimationFrame callbacks (ensures rendering complete)
2. Monitors DOM mutations until they settle (300ms stability window)
3. Falls back to timeout if mutations don't settle

### 11. **retryAction - Generic Retry Pattern**

For any action that needs retry with verification:

```typescript
await this.stabilityHelper.retryAction(
    async () => {
        // Action to perform
        await element.click();
    },
    async () => {
        // Verification that action succeeded
        await expect(result).toBeVisible();
    },
    {
        timeout: 10000,
        intervals: [100, 250, 500, 1000]  // Exponential backoff
    }
);
```

### 12. **Environment-Aware Timing**

The StabilityHelper automatically adjusts timing based on environment:

```typescript
// In CI/Azure (FAST_MODE=true or CI=true):
// - Waits are 30% of normal duration (0.3x multiplier)

// Locally:
// - Waits use full duration (1.0x multiplier)
```

This means tests run faster in CI while remaining stable locally.

### 13. **Retry Statistics**

Track which interactions need retries (useful for identifying flaky areas):

```typescript
// Get retry statistics
const stats = this.stabilityHelper.getRetryStats();
console.log(stats);
// Output: { "stableClick": 2, "stableFill": 1 }

// Reset statistics
this.stabilityHelper.resetRetryStats();
```

### 14. **Advanced Stability Patterns**

#### For Complex Forms:
```typescript
async fillComplexForm(data) {
    // Wait for form to be ready
    await this.stability.waitForPageStability();

    // Fill each field with validation
    for (const [field, value] of Object.entries(data)) {
        await this.stability.stableFill(
            this.page.locator(`[name="${field}"]`),
            value,
            { validate: true, waitAfter: 300 }
        );
    }

    // Final stability check
    await this.stability.waitForPageStability();
}
```

#### For Dynamic Content:
```typescript
async waitForDynamicContent() {
    // Wait for element to stop moving/changing
    await this.stability.waitForElementStability(
        this.page.locator(".dynamic-content"),
        { stableTime: 2000 }
    );
}
```

#### For API-Dependent UI:
```typescript
async waitForDataLoad() {
    // Wait for loading indicators to disappear
    await this.stability.waitForPageStability({
        spinnerSelectors: [
            '.loading-spinner',
            '[data-testid="loading"]',
            'app-progress-spinner'
        ],
        additionalWait: 1500
    });
}
```

### 15. **Environment-Specific Configuration**

Create different stability profiles:

#### `.env.dev` (Development - slower)
```bash
SLOWMO=800
STABILITY_DELAY=2000
TIMEOUT_MULTIPLIER=2.0
```

#### `.env.staging` (Staging - medium)
```bash
SLOWMO=500
STABILITY_DELAY=1500
TIMEOUT_MULTIPLIER=1.5
```

#### `.env.prod` (Production - faster)
```bash
SLOWMO=200
STABILITY_DELAY=1000
TIMEOUT_MULTIPLIER=1.2
```

### 16. **Debugging Stability Issues**

#### Enable Verbose Logging:
```bash
STABILITY_VERBOSE_LOGGING=true
```

#### Common Patterns for Different Issues:

**Issue: Element not found**
```typescript
// Add explicit wait
await this.stability.stableWaitFor(locator, {
    state: 'visible',
    timeout: 30000,
    waitAfter: 1000
});
```

**Issue: Stale element**
```typescript
// Use retries
await this.stability.stableClick(locator, {
    retries: 5,
    waitBefore: 500
});
```

**Issue: Form submission too fast**
```typescript
await this.stability.stableFill(input, value);
await this.stability.stabilityDelay(1000); // Extra delay
await this.stability.stableClick(submitButton);
await this.stability.waitForPageStability();
```

### 17. **Quick Reference**

| Problem | Solution |
|---------|----------|
| Tests too fast globally | Increase `SLOWMO` environment variable |
| Specific test sections too fast | Use `commonKeyword.stabilityDelay()` |
| Elements not found | Use `commonKeyword.waitForElement()` |
| Actions failing randomly | Use `commonKeyword.stableClick()` / `stableFill()` |
| Page not ready after navigation | Use `commonKeyword.waitForApplicationReady()` |
| Form submission issues | Add waits before and after form interactions |
| **Dialog not closing** | Use `commonKeyword.closeDialog()` or `stabilityHelper.closeDialog()` |
| Dialog cancel needed | Use `commonKeyword.closeDialogWithCancel()` |
| **Save button stays disabled** | Use `stableClick({ triggerChangeDetection: true })` |
| **Form stuck in pristine state** | Use `stabilityHelper.forceAngularFormUpdate()` |
| **Dropdown selection not working** | Use `stableSelectOption()` instead of manual click |
| **Form submit unreliable** | Use `stableFormSubmit()` with success verification |
| **Drag and drop failing** | Use `stableDragAndDrop()` with verification function |
| **Need to wait for Angular** | Use `waitForAngularStable()` (fast alternative) |
| **Button disabled after fill** | Use `stableFill({ triggerBlur: true })` |

### 18. **Method Cheat Sheet**

```typescript
// Basic stable interactions
await stabilityHelper.stableClick(locator);
await stabilityHelper.stableFill(locator, "value");
await stabilityHelper.stableSelect(locator, "option");

// Angular-specific
await stabilityHelper.stableClick(btn, { triggerChangeDetection: true });
await stabilityHelper.forceAngularFormUpdate();
await stabilityHelper.waitForAngularStable();

// Form handling
await stabilityHelper.stableFormSubmit(submitBtn, successIndicator);
await stabilityHelper.stableSelectOption(dropdown, "Option Name");

// Dialog handling
await stabilityHelper.closeDialog();
await stabilityHelper.closeDialogWithCancel();
await stabilityHelper.stableOpenDialog(triggerButton);

// Advanced
await stabilityHelper.stableDragAndDrop(source, target, { verifyMove: fn });
await stabilityHelper.retryAction(actionFn, verifyFn);
await stabilityHelper.waitForElementStability(locator);
```

Remember: **Start conservative** (higher delays) and **reduce gradually** as you find what works for your application.

---

## Changelog

### 2026-02-04
- Added documentation for `stableClick` Angular-specific options (`triggerChangeDetection`, `waitForEnabled`)
- Added `stableFormSubmit` documentation for reliable form submissions
- Added `stableSelectOption` for Angular Material dropdowns
- Added `stableDragAndDrop` for drag operations with verification
- Added `forceAngularFormUpdate` for stuck pristine forms
- Added `waitForAngularStable` fast alternative
- Added `retryAction` generic retry pattern
- Added environment-aware timing documentation
- Added retry statistics tracking
- Updated Quick Reference table with new methods
