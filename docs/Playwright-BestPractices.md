# Playwright TypeScript Architecture: A Complete Best Practices Guide

Modern Playwright test automation in TypeScript requires abandoning Selenium-era patterns in favor of Playwright's native capabilities. The framework's **Locator API**, **custom fixtures**, and **composition-based Page Objects** form the foundation of maintainable test suites. This guide distills official documentation and 2023-2025 community consensus into implementable patterns for small teams building robust test infrastructure.

## Playwright's modern Page Object Model differs fundamentally from Selenium patterns

The official Playwright documentation explicitly recommends Page Object Model for large test suites, but with crucial differences from traditional Selenium implementations. The key insight: **define locators as class properties using Playwright's Locator type**, not methods that query the DOM on each call.

```typescript
// pages/LoginPage.ts - Modern Playwright POM Pattern
import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // Locators defined once, resolved at action time
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async verifyLoginSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(/.*dashboard/);
  }
}
```

**Locator strategy priority** follows official Playwright recommendations: prefer `getByRole()` (uses ARIA roles), then `getByLabel()`, `getByPlaceholder()`, `getByText()`, and finally `getByTestId()` as fallback. Avoid raw CSS selectors like `button.buttonIcon.episode-actions-later`—these break easily with UI changes.

### Composition over inheritance for reusable components

The community consensus strongly favors **composition patterns** over deep inheritance hierarchies. Create separate component classes for reusable UI elements, then compose them into page objects:

```typescript
// components/CookiesComponent.ts
export class CookiesComponent {
  private page: Page;
  readonly acceptAllButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.acceptAllButton = page.getByRole('button', { name: 'Accept All Cookies' });
  }

  async acceptAllCookies(): Promise<void> {
    await this.acceptAllButton.click();
  }
}

// pages/ResourcesPage.ts - Composition approach
export class ResourcesPage {
  readonly page: Page;
  readonly cookies: CookiesComponent;  // Composed, not inherited
  readonly navbar: NavbarComponent;

  constructor(page: Page) {
    this.page = page;
    this.cookies = new CookiesComponent(page);
    this.navbar = new NavbarComponent(page);
  }
}
```

### Anti-patterns to avoid

- **Fixed timeouts**: Never use `page.waitForTimeout(2000)`—wait for specific conditions instead
- **Manual boolean assertions**: Use `await expect(locator).toBeVisible()` rather than `expect(await locator.isVisible()).toBe(true)`—the former auto-retries, the latter doesn't
- **Assertions in Page Objects**: Keep assertions in tests; Page Objects should expose interactions and state
- **Shared state between tests**: Each test must be completely independent

## Project structure optimized for small teams

A **feature-based organization** works best for teams of 2-3 developers working on a single application. This structure separates concerns clearly while remaining navigable:

```
project-root/
├── tests/                          # Test specs by feature
│   ├── auth/
│   │   ├── login.spec.ts
│   │   └── signup.spec.ts
│   ├── dashboard/
│   │   └── dashboard.spec.ts
│   └── checkout/
│       └── checkout.spec.ts
├── pages/                          # Page Object classes
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   └── BasePage.ts
├── components/                     # Reusable UI components
│   ├── navbar.component.ts
│   ├── footer.component.ts
│   └── modal.component.ts
├── fixtures/                       # Custom fixture definitions
│   └── test-setup.ts
├── utils/                          # Helper utilities
│   ├── date-utils.ts
│   └── api-helpers.ts
├── data/                           # Test data files
│   └── test-users.json
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

**Naming conventions** maintain consistency: test files use kebab-case with `.spec.ts` suffix (`login.spec.ts`), Page Objects use PascalCase (`LoginPage.ts`), components use kebab-case with `.component.ts` suffix, and utilities use kebab-case (`date-utils.ts`).

## Custom fixtures replace beforeEach/afterEach with superior patterns

Fixtures represent Playwright's most powerful architectural feature. They offer **encapsulation** (setup and teardown in one place), **composability** (fixtures can depend on each other), and **on-demand execution** (only requested fixtures run).

```typescript
// fixtures/test-setup.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

type TestFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  authenticatedPage: Page;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  // Fixture with setup and teardown
  authenticatedPage: async ({ page }, use) => {
    // Setup: perform login
    await page.goto('/login');
    await page.getByLabel('Username').fill(process.env.TEST_USER!);
    await page.getByLabel('Password').fill(process.env.TEST_PASSWORD!);
    await page.getByRole('button', { name: 'Sign in' }).click();

    await use(page);  // Test runs here

    // Teardown: cleanup if needed
    await page.evaluate(() => localStorage.clear());
  },
});

export { expect } from '@playwright/test';
```

**Worker-scoped fixtures** share state across tests running in the same worker, useful for expensive setup like account creation:

```typescript
account: [async ({ browser }, use, workerInfo) => {
  const username = `user-${workerInfo.workerIndex}`;
  // Create account once per worker...
  await use({ username, password: 'testpass' });
}, { scope: 'worker' }],
```

**Auto-fixtures** run for every test without explicit request—ideal for logging, screenshots on failure, or global navigation:

```typescript
autoLogger: [async ({}, use, testInfo) => {
  const logs: string[] = [];
  await use();
  if (testInfo.status !== testInfo.expectedStatus) {
    await testInfo.attach('logs', { body: logs.join('\n'), contentType: 'text/plain' });
  }
}, { auto: true }],
```

## Configuration management spans environments and security

The `playwright.config.ts` file centralizes project settings. A production-ready configuration handles multiple environments, CI optimization, and browser matrix:

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.TEST_ENV || 'dev'}` });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Setup project for authentication
    { name: 'setup', testMatch: '**/*.setup.ts' },

    // Browser projects depend on setup
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: 'auth.json' },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: 'auth.json' },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: 'auth.json' },
      dependencies: ['setup'],
    },
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Environment management** uses `.env` files (never committed) with dotenv:

```bash
# .env.staging
BASE_URL=https://staging.example.com
TEST_USER=staging-test@example.com
TEST_PASSWORD=secure-password
API_KEY=staging-api-key
```

**Authentication state reuse** via `storageState` eliminates repeated login flows:

```typescript
// auth.setup.ts
import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill(process.env.TEST_USER!);
  await page.getByLabel('Password').fill(process.env.TEST_PASSWORD!);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.context().storageState({ path: 'auth.json' });
});
```

## TypeScript configuration enables strict type safety

The recommended `tsconfig.json` enables strict checking and path aliases for clean imports:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "node",
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "noEmit": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@pages/*": ["pages/*"],
      "@components/*": ["components/*"],
      "@fixtures/*": ["fixtures/*"],
      "@utils/*": ["utils/*"]
    },
    "types": ["@playwright/test"]
  },
  "include": ["tests/**/*.ts", "pages/**/*.ts", "fixtures/**/*.ts", "playwright.config.ts"]
}
```

**Critical note**: Playwright does not perform TypeScript type checking. Run `tsc --noEmit` separately in CI, and use ESLint with `@typescript-eslint/no-floating-promises` to catch missing `await` statements.

**Interface definitions** document Page Object contracts:

```typescript
// interfaces/IPageAction.ts
export interface IPageAction {
  goto(): Promise<void>;
  verifyPageLoaded(): Promise<void>;
}

// pages/LoginPage.ts
export class LoginPage implements IPageAction {
  async goto(): Promise<void> { /* ... */ }
  async verifyPageLoaded(): Promise<void> { /* ... */ }
}
```

## Patterns for maintainability and AI-assisted test generation

Consistent patterns enable both human maintenance and future AI tooling. **Self-documenting code** uses descriptive names that reveal intent:

```typescript
// Intent-revealing names
async loginWithValidCredentials(email: string, password: string): Promise<void> { }
async verifyErrorMessageDisplayed(expectedMessage: string): Promise<void> { }

// test.step() for readable reports
test('user completes checkout flow', async ({ page }) => {
  await test.step('Add product to cart', async () => {
    await page.getByRole('button', { name: 'Add to Cart' }).click();
  });

  await test.step('Proceed to checkout', async () => {
    await page.getByRole('link', { name: 'Checkout' }).click();
  });
});
```

**AI-friendly patterns** include strong typing, consistent structure across all Page Objects, and `data-testid` attributes for stable locator generation. Playwright's codegen tool (`npx playwright codegen`) generates code following the same locator priority you should use manually.

**Data-driven testing** scales test coverage efficiently:

```typescript
const loginScenarios = [
  { user: 'valid@test.com', pass: 'correct', expectSuccess: true },
  { user: 'invalid@test.com', pass: 'wrong', expectSuccess: false },
];

for (const scenario of loginScenarios) {
  test(`login with ${scenario.user}`, async ({ loginPage }) => {
    await loginPage.login(scenario.user, scenario.pass);
    if (scenario.expectSuccess) {
      await expect(loginPage.page).toHaveURL(/dashboard/);
    } else {
      await expect(loginPage.errorMessage).toBeVisible();
    }
  });
}
```

## Conclusion

Building a maintainable Playwright TypeScript architecture requires embracing the framework's native patterns rather than porting Selenium conventions. **Five principles** define success: use composition-based Page Objects with typed Locator properties, leverage custom fixtures for dependency injection and setup encapsulation, configure strict TypeScript with separate type checking, implement role-based locator strategies, and maintain consistent naming conventions throughout.

For small teams, start with the feature-based folder structure and expand components as reuse patterns emerge. The investment in proper fixture architecture pays dividends immediately—tests become more readable, setup logic centralizes, and parallel execution works reliably. Most importantly, avoid the common anti-patterns: no hardcoded waits, no manual boolean assertions, and no shared state between tests.
