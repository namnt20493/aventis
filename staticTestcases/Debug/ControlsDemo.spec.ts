import { test } from "@libs/test-fixtures";
import { LoginPage, NavigationPage } from "@libs/pages-v2";
import { Button, TextInput, Dropdown } from "@core/controls";
import { CommonKeyword } from "@keywords/common-keyword";
import { TestUsers } from "@constants/credentials";
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";

// Ensure all imports above resolve correctly in your project structure.

/**
 * Demo Test - Demonstrates the new Control-based framework.
 *
 * This test shows:
 * 1. Using the new pages-v2 (LoginPage, NavigationPage)
 * 2. Using Controls directly (Button, TextInput, Dropdown)
 * 3. All methods use StabilityHelper internally - no "stable" prefix needed
 */
test(
    "Controls_Framework_Demo",
    {
        tag: ["@demo"]
    },
    async ({ page, seed, authenticatedRequest, services }) => {
        // ============================================================
        // 1. Initialize Page Objects (old + new can coexist)
        // ============================================================
        const loginPage = new LoginPage(page, services);
        const navigationPage = new NavigationPage(page, services);
        const commonKeyword = new CommonKeyword(page); // Still needed for API calls

        // Generate unique ID for this test
        const uniqueDossierId = sharedTestLogic.generateUniqueDossierId(seed);

        // ============================================================
        // 2. Login using new LoginPage
        // ============================================================
        await test.step("Login mit neuem LoginPage", async () => {
            await page.goto("/");
            await loginPage.loginWithMsOnline(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        // ============================================================
        // 3. Create Dossier via API (fast setup)
        // ============================================================
        await test.step("Dossier via API erstellen", async () => {
            await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossierId);
        });

        // ============================================================
        // 4. Navigate using new NavigationPage
        // ============================================================
        await test.step("Navigation mit neuem NavigationPage", async () => {
            // Search and open dossier
            await navigationPage.searchGlobal(uniqueDossierId);

            // Click on search result using Controls directly
            const searchResult = Button.bySelector(page, `mark:has-text("${uniqueDossierId}")`);
            await searchResult.click();

            // Wait for page to be ready
            await page.waitForLoadState("networkidle");
        });

        // ============================================================
        // 5. Demonstrate Control usage directly in test
        // ============================================================
        await test.step("Controls direkt verwenden", async () => {
            // Example: Using Button control
            const menuButton = Button.byTestId(page, "aventis-menu");
            await menuButton.shouldBeVisible();

            // Example: Verify user info is displayed
            await navigationPage.userNameElement.waitForVisible();

            // Example: Open and close main menu
            await navigationPage.openMainMenu();
            await page.keyboard.press("Escape");
        });

        // ============================================================
        // 6. Validation using Should* methods
        // ============================================================
        await test.step("Validierung mit Should-Methoden", async () => {
            const menuButton = Button.byTestId(page, "aventis-menu");

            // These validations use Playwright expect internally
            await menuButton.shouldBeVisible();
            await menuButton.shouldBeEnabled();
        });
    }
);

/**
 * Simple Navigation Test - Shows NavigationPage usage
 */
test(
    "Navigation_Mit_Neuem_Framework",
    {
        tag: ["@demo", "@keywordValidation"]
    },
    async ({ page, seed, authenticatedRequest, services }) => {
        const loginPage = new LoginPage(page, services);
        const navigationPage = new NavigationPage(page, services);
        const commonKeyword = new CommonKeyword(page);
        const uniqueDossierId = sharedTestLogic.generateUniqueDossierId(seed);

        await test.step("Setup: Login und Dossier erstellen", async () => {
            await page.goto("/");
            await loginPage.loginWithMsOnline(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);

            await sharedTestLogic.createDossierViaApiOnly(authenticatedRequest, commonKeyword, page, seed, uniqueDossierId);
        });

        await test.step("Zum Dossier navigieren", async () => {
            await navigationPage.navigateToDossier(uniqueDossierId);
        });

        await test.step("Sidebar Navigation testen", async () => {
            // Navigate to Journal
            await navigationPage.navigateToJournal();

            // Verify we're on Journal page
            await page.waitForURL(/.*journal.*/i, { timeout: 10000 });
        });

        await test.step("Zurück zur Übersicht", async () => {
            // Navigate to Dossierübersicht
            await navigationPage.dossierubersichtLink.click();
            await page.waitForLoadState("networkidle");
        });
    }
);

/**
 * Control Factory Demo - Shows different ways to create controls
 * (This test only demonstrates API - no actual actions)
 */
test(
    "Control_Factory_Methoden_Demo",
    {
        tag: ["@demo", "@keywordValidation"]
    },
    async ({ page }) => {
        await test.step("Verschiedene Factory-Methoden demonstrieren", async () => {
            await page.goto("/");

            // Different ways to create a Button:
            const _byTestId = Button.byTestId(page, "some-button");
            const _byName = Button.byName(page, "Login");
            const _bySelector = Button.bySelector(page, "button.primary");
            const _byText = Button.byText(page, "Submit");

            // Different ways to create a TextInput:
            const _inputByTestId = TextInput.byTestId(page, "username");
            const _inputByLabel = TextInput.byLabel(page, "Email");
            const _inputByPlaceholder = TextInput.byPlaceholder(page, "Search...");
            const _inputById = TextInput.byId(page, "email-input");

            // Different ways to create a Dropdown:
            const _dropdownByTestId = Dropdown.byTestId(page, "status");
            const _dropdownByAngular = Dropdown.byAngularTestId(page, "status");
            const _dropdownByLabel = Dropdown.byLabel(page, "Status");

            // Verify login button is visible (actual interaction)
            const loginButton = Button.bySelector(page, 'input[type="submit"]');
            await loginButton.shouldBeVisible({ timeout: 30000 });
        });
    }
);
