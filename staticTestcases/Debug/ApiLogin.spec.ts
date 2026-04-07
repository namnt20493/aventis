import { test, expect } from "@libs/test-fixtures";
import { loginAndInjectCookies } from "@utils/api-login";
import { TestUsers } from "@constants/credentials";

test.describe("API Login - Debug Tests", () => {
    test("should login via API without Microsoft GUI", async ({ page, context }) => {
        const user = TestUsers.SOZIALARBEITERIN;

        await loginAndInjectCookies(context, user.username, user.password);

        await page.goto("/", { waitUntil: "domcontentloaded", timeout: 30000 });

        const aventisLogo = page.locator('[data-testid="aventis-logo"]');
        await expect(aventisLogo).toBeAttached({ timeout: 20000 });

        console.log(`Current URL after API login: ${page.url()}`);
        expect(page.url()).toContain("aventis.swiss");

        const navbarUsername = page.locator('[data-testid="navbar-username"]');
        await expect(navbarUsername).toBeAttached({ timeout: 15000 });
        console.log("API Login test passed - app loaded without Microsoft GUI!");
    });

    test("should login via API and verify GraphQL works", async ({ page, context }) => {
        const user = TestUsers.SOZIALARBEITERIN;

        await loginAndInjectCookies(context, user.username, user.password);

        await page.goto("/", { waitUntil: "domcontentloaded", timeout: 30000 });

        const aventisLogo = page.locator('[data-testid="aventis-logo"]');
        await expect(aventisLogo).toBeAttached({ timeout: 20000 });

        const navbarUsername = page.locator('[data-testid="navbar-username"]');
        await expect(navbarUsername).toBeAttached({ timeout: 15000 });

        const usernameText = await navbarUsername.textContent();
        console.log(`Logged in as: ${usernameText}`);
        expect(usernameText).toBeTruthy();
    });
});
