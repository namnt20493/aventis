import { Locator, Page, expect } from "@playwright/test";
import * as OTPAuth from "otpauth";
import { StabilityHelper } from "@utils/stability-helper";

export class MicrosoftLoginPage {
    private readonly page: Page;
    private stabilityHelper: StabilityHelper;

    // Timeout multiplier for slowmo environments (e.g., CI servers with slowmo 500)
    // Detects slowmo from PLAYWRIGHT_SLOWMO env var or defaults to 1x
    private readonly timeoutMultiplier: number;

    private readonly selectors = {
        useAnotherAccount: "#otherTileText",
        usernameInput: "#i0116",
        passwordInput: "#i0118",
        nextButton: "#idSIButton9",
        submitButton: 'input[type="submit"]',
        staySignedInNo: "#idBtn_Back",
        aventisLogo: '[data-testid="aventis-logo"]',
        nameElement: ".selection-card-slim.user-card .username .name",
        teamElement: ".team",
        navbarUsername: '[data-testid="navbar-username"]',
        wallisUsernameInput: "#username",
        wallisPasswordInput: "#password",
        wallisSignInBtn: "#kc-login",
        otpLoginButton: "#loginLdap",
        otpUsernameInput: "#username",
        otpPasswordInput: "#password",
        otpInput: "#otp",
        otpLoginSubmit: "#login"
    };

    private getUserSecret(username: string): string {
        const envSecrets: Record<string, string | undefined> = {
            retsch: process.env.TOTP_SECRET_RETSCH,
            retsco: process.env.TOTP_SECRET_RETSCO,
            retsce: process.env.TOTP_SECRET_RETSCE,
            retscd: process.env.TOTP_SECRET_RETSCD
        };

        const fallbackSecrets: Record<string, string> = {
            retsch: "HA3XCNKJNZRW64SDKNWHKQ3BKRBTCV3Q",
            retsco: "K5BWQ3SQHBUU44DYKFEDKUCTKRIGUYSQ",
            retsce: "MJTHESKXKA3TSSBYPFCTIQKOOR2XQ5SK",
            retscd: "JVBVMML2IY2VM6BYKBJHCYSBHFEWI3DG"
        };

        const normalizedUsername = username.toLowerCase();
        return envSecrets[normalizedUsername] || fallbackSecrets[normalizedUsername] || "";
    }

    constructor(page: Page) {
        this.page = page;
        this.stabilityHelper = new StabilityHelper(page);

        // Calculate timeout multiplier based on slowmo setting
        // slowmo 500 = 1.5x timeouts, slowmo 1000 = 2x timeouts, etc.
        const slowmo = parseInt(process.env.PLAYWRIGHT_SLOWMO || "0", 10);
        this.timeoutMultiplier = slowmo > 0 ? 1 + (slowmo / 1000) : 1;
        if (this.timeoutMultiplier > 1) {
            console.log(`🐢 Slowmo detected (${slowmo}ms), using ${this.timeoutMultiplier}x timeout multiplier`);
        }
    }

    // Helper to get adjusted timeout based on slowmo
    private getTimeout(baseTimeout: number): number {
        return Math.round(baseTimeout * this.timeoutMultiplier);
    }

    async login(username: string, password: string, maxPageReloads = 2): Promise<void> {
        for (let reloadAttempt = 0; reloadAttempt <= maxPageReloads; reloadAttempt++) {
            try {
                const needsNewLogin = await this.isNewLoginRequired();

                if (needsNewLogin) {
                    await this.enterUsername(username);
                    await this.enterPassword(password);
                    await this.handleStaySignedInPrompt();
                } else {
                    await this.loginWithDifferentAccount(username, password);
                }

                await this.waitForSuccessfulLogin();
                console.log(`✅ Login successful${reloadAttempt > 0 ? ` after ${reloadAttempt} retry/retries` : ""}`);
                return; // Success - exit the method
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);

                // Check if it's a white screen or field not fillable error
                // IMPORTANT: When slowmo is active, do NOT treat TimeoutError as white screen
                // because slowmo naturally causes operations to take longer
                const isTimeoutError = errorMessage.includes("TimeoutError");
                const isActualWhiteScreen = errorMessage.includes("blank/white") || errorMessage.includes("not fillable");
                const isWhiteScreenError = isActualWhiteScreen || (isTimeoutError && this.timeoutMultiplier === 1);

                // With slowmo active, do NOT reload on timeout - just rethrow
                if (isTimeoutError && this.timeoutMultiplier > 1) {
                    console.log(`❌ Timeout error with slowmo active (${this.timeoutMultiplier}x) - not retrying with reload`);
                    throw error;
                }

                if (isWhiteScreenError && reloadAttempt < maxPageReloads) {
                    console.log(`⚠️ Login attempt ${reloadAttempt + 1} failed with white screen error`);

                    if (reloadAttempt === 0) {
                        // First retry: Simple page reload (preserves cookies, fast recovery)
                        console.log("🔄 Strategy 1: Simple page reload");
                        await this.page.reload({
                            waitUntil: "domcontentloaded",
                            timeout: 20000
                        });
                        await this.page.waitForTimeout(2000);
                    } else {
                        // Second retry: Clear cookies + fresh navigation (nuclear option)
                        console.log("🔄 Strategy 2: Clearing cookies and forcing fresh session");
                        await this.page.context().clearCookies();
                        console.log("🍪 Cookies cleared");

                        // Navigate to base URL to force completely fresh authentication
                        await this.page.goto("/", {
                            waitUntil: "domcontentloaded",
                            timeout: 20000
                        });
                        await this.page.waitForTimeout(2000);
                    }
                } else {
                    // Either not a white screen error, or we've exhausted all reload attempts
                    if (isWhiteScreenError) {
                        console.log(`❌ All ${maxPageReloads + 1} login attempts failed with white screen`);
                    }
                    throw error;
                }
            }
        }
    }

    async loginWithDifferentAccount(username: string, password: string, isRetry = false): Promise<void> {
        // If this is a retry after page reload, we might need to click "use another account" again
        if (!isRetry) {
            // Wait for account picker to be stable before clicking
            await this.page.waitForLoadState("domcontentloaded", { timeout: this.getTimeout(10000) });
            await this.page.waitForTimeout(500);

            // Try clicking "Use another account" with longer wait and retry
            const useAnotherAccount = this.page.locator(this.selectors.useAnotherAccount);
            try {
                await useAnotherAccount.waitFor({ state: "visible", timeout: this.getTimeout(15000) });
                await this.page.waitForTimeout(300); // Wait for animation
                await useAnotherAccount.click();
            } catch {
                // Maybe account tiles are shown instead - try clicking any visible account tile first
                const accountTile = this.page.locator('.table[role="presentation"]').first();
                if (await accountTile.isVisible().catch(() => false)) {
                    // Click the "Use another account" option which might be at the bottom
                    await this.page
                        .locator('div[data-test-id="otherTile"]')
                        .click()
                        .catch(() => {});
                }
            }

            await this.page.waitForSelector(this.selectors.usernameInput, {
                state: "visible",
                timeout: this.getTimeout(15000)
            });
        }
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.handleStaySignedInPrompt();
        await this.waitForSuccessfulLogin();
    }

    async loginWallis(username: string, password: string, maxPageReloads = 2): Promise<void> {
        for (let reloadAttempt = 0; reloadAttempt <= maxPageReloads; reloadAttempt++) {
            try {
                await this.fillWithRetry(this.selectors.wallisUsernameInput, username);
                await this.fillWithRetry(this.selectors.wallisPasswordInput, password);
                await this.clickWithRetry(this.selectors.wallisSignInBtn);
                await this.waitForSuccessfulLogin();
                console.log(`✅ Wallis login successful${reloadAttempt > 0 ? ` after ${reloadAttempt} retry/retries` : ""}`);
                return; // Success
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                const isWhiteScreenError = errorMessage.includes("blank/white") || errorMessage.includes("not fillable") || errorMessage.includes("TimeoutError");

                if (isWhiteScreenError && reloadAttempt < maxPageReloads) {
                    console.log(`⚠️ Wallis login attempt ${reloadAttempt + 1} failed with white screen error`);

                    if (reloadAttempt === 0) {
                        // First retry: Simple page reload
                        console.log("🔄 Strategy 1: Simple page reload");
                        await this.page.reload({
                            waitUntil: "domcontentloaded",
                            timeout: 20000
                        });
                        await this.page.waitForTimeout(1500);
                    } else {
                        // Second retry: Clear cookies + fresh navigation
                        console.log("🔄 Strategy 2: Clearing cookies and forcing fresh session");
                        await this.page.context().clearCookies();
                        console.log("🍪 Cookies cleared");

                        await this.page.goto("/", {
                            waitUntil: "domcontentloaded",
                            timeout: 20000
                        });
                        await this.page.waitForTimeout(1500);
                    }
                } else {
                    if (isWhiteScreenError) {
                        console.log(`❌ All ${maxPageReloads + 1} Wallis login attempts failed with white screen`);
                    }
                    throw error;
                }
            }
        }
    }

    async loginOTP(username: string, password: string): Promise<void> {
        const normalizedUsername = username.toLowerCase();
        const secret = this.getUserSecret(normalizedUsername);

        if (!secret) {
            throw new Error(`No OTP secret found for username: ${username}. Set TOTP_SECRET_${normalizedUsername.toUpperCase()} environment variable.`);
        }

        const totp = new OTPAuth.TOTP({
            issuer: "qas VS",
            label: normalizedUsername,
            algorithm: "SHA1",
            digits: 6,
            period: 30,
            secret: secret
        });

        await this.clickWithRetry(this.selectors.otpLoginButton);
        await this.fillWithRetry(this.selectors.otpUsernameInput, username);
        await this.fillWithRetry(this.selectors.otpPasswordInput, password);
        await this.clickWithRetry(this.selectors.otpLoginSubmit);

        const token = totp.generate();
        await this.fillWithRetry(this.selectors.otpInput, token);
        await this.clickWithRetry(this.selectors.otpLoginSubmit);

        await this.waitForSuccessfulLogin();
    }

    private async isNewLoginRequired(): Promise<boolean> {
        // Wait for page to stabilize first
        await this.page.waitForLoadState("domcontentloaded", { timeout: this.getTimeout(15000) });
        await this.page.waitForTimeout(1000);

        // Check which login state we're in
        const usernameInput = this.page.locator(this.selectors.usernameInput);
        const useAnotherAccount = this.page.locator(this.selectors.useAnotherAccount);

        // Race: either username input is visible (new login) or account picker is visible
        try {
            const result = await Promise.race([usernameInput.waitFor({ state: "visible", timeout: this.getTimeout(10000) }).then(() => "username"), useAnotherAccount.waitFor({ state: "visible", timeout: this.getTimeout(10000) }).then(() => "picker")]);
            return result === "username";
        } catch {
            // Neither visible - try to detect page state
            if (await usernameInput.isVisible().catch(() => false)) {
                return true;
            }
            return false;
        }
    }

    private async enterUsername(username: string): Promise<void> {
        const usernameInput = this.page.locator(this.selectors.usernameInput);
        await usernameInput.waitFor({ state: "visible", timeout: this.getTimeout(10000) });

        // Focus the element before filling (recommended for hydration issues)
        await usernameInput.click();
        await this.fillWithRetry(this.selectors.usernameInput, username);
        await this.clickSubmitButton();

        // BEST PRACTICE: Wait for element detachment after submit
        // This ensures the form has fully processed before continuing
        try {
            await usernameInput.waitFor({ state: "detached", timeout: this.getTimeout(10000) });
        } catch {
            // Element may not detach in some flows, fallback to load state
            await this.page.waitForLoadState("domcontentloaded", { timeout: this.getTimeout(15000) });
        }

        // Additional wait for animations/transitions
        await this.page.waitForTimeout(500);
    }

    private async enterPassword(password: string): Promise<void> {
        const passwordInput = this.page.locator(this.selectors.passwordInput);
        const accountPicker = this.page.locator(this.selectors.useAnotherAccount);
        const errorElement = this.page.locator("#usernameError, #passwordError, .alert-error");

        // Use domcontentloaded instead of networkidle to avoid Microsoft redirect issues
        await this.page.waitForLoadState("domcontentloaded", { timeout: this.getTimeout(15000) });

        // Race: wait for password field, account picker, or error
        // Microsoft might show different pages depending on tenant configuration
        const maxWaitTime = this.getTimeout(20000);
        const startTime = Date.now();

        while (Date.now() - startTime < maxWaitTime) {
            // Check for password field first (most common case)
            if (await passwordInput.isVisible({ timeout: this.getTimeout(1000) }).catch(() => false)) {
                console.log("✅ Password field detected");
                break;
            }

            // Check if account picker appeared (might need to select account again)
            if (await accountPicker.isVisible({ timeout: 500 }).catch(() => false)) {
                console.log("⚠️ Account picker appeared after username - clicking use another account");
                await accountPicker.click();
                await this.page.waitForTimeout(500);
                continue;
            }

            // Check for error messages
            if (await errorElement.isVisible({ timeout: 500 }).catch(() => false)) {
                const errorText = await errorElement.textContent().catch(() => "Unknown error");
                throw new Error(`Microsoft login error: ${errorText}`);
            }

            // Check if we're already logged in (Aventis app loaded)
            const aventisLogo = this.page.locator(this.selectors.aventisLogo);
            if (await aventisLogo.isVisible({ timeout: 500 }).catch(() => false)) {
                console.log("✅ Already logged in - Aventis app detected");
                return; // Skip password entry, already authenticated
            }

            await this.page.waitForTimeout(500);
        }

        // Final check - if password field still not visible, throw with debug info
        if (!(await passwordInput.isVisible({ timeout: this.getTimeout(2000) }).catch(() => false))) {
            const currentUrl = this.page.url();
            const pageTitle = await this.page.title().catch(() => "Unknown");
            throw new Error(
                `Password field not visible after ${maxWaitTime}ms. ` +
                    `Current URL: ${currentUrl}, Page title: ${pageTitle}. ` +
                    `Microsoft may have shown a different page (MFA, account picker, or federated redirect).`
            );
        }

        // Extra wait for Microsoft's animation to complete
        await this.page.waitForTimeout(500);

        // Focus the element before filling (recommended for hydration issues)
        await passwordInput.click();
        await this.fillWithRetry(this.selectors.passwordInput, password);
        await this.clickSubmitButton();

        // BEST PRACTICE: Wait for element detachment after submit
        // This ensures the form has fully processed before continuing
        try {
            await passwordInput.waitFor({ state: "detached", timeout: this.getTimeout(10000) });
        } catch {
            // Element may not detach in some flows, fallback to load state
            await this.page.waitForLoadState("domcontentloaded", { timeout: this.getTimeout(15000) });
        }
    }

    private async fillWithRetry(selector: string, value: string, maxRetries = 3): Promise<void> {
        const locator = this.page.locator(selector);

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                // Wait for element to be visible (adjusted for slowmo)
                await locator.waitFor({ state: "visible", timeout: this.getTimeout(10000) });

                // Wait for animations to complete (Microsoft login fields animate in)
                // With slowmo, animations are already slowed, so base wait is sufficient
                await this.page.waitForTimeout(500);

                // Ensure element is attached and stable
                await locator.waitFor({ state: "attached", timeout: this.getTimeout(5000) });

                // Check if element is actually interactable (not covered, not animating)
                const isEnabled = await locator.isEnabled({ timeout: this.getTimeout(5000) });
                if (!isEnabled) {
                    throw new Error("Element not enabled");
                }

                await locator.clear();
                await locator.fill(value);

                // Wait longer for value to settle with slowmo
                await this.page.waitForTimeout(this.getTimeout(300));

                const currentValue = await locator.inputValue();
                if (currentValue === value) {
                    return;
                }

                // Value verification failed - log for debugging
                console.log(`⚠️ Fill verification failed: expected "${value}", got "${currentValue}" (attempt ${attempt + 1}/${maxRetries})`);

                if (attempt < maxRetries - 1) {
                    await locator.clear();
                    await this.page.waitForTimeout(this.getTimeout(500));
                }
            } catch (error) {
                if (attempt === maxRetries - 1) {
                    // Last attempt failed - check if page is blank/white
                    const pageContent = await this.page.content();
                    if (pageContent.length < 100) {
                        throw new Error(`Page appears to be blank/white. Content length: ${pageContent.length}. Original error: ${error}`);
                    }
                    throw new Error(`Field ${selector} not fillable after ${maxRetries} attempts. Error: ${error}`);
                }
                // Wait before retry (adjusted for slowmo)
                await this.page.waitForTimeout(this.getTimeout(1000));
            }
        }

        throw new Error(`Field ${selector} value not stable after ${maxRetries} attempts`);
    }

    private async clickWithRetry(selector: string, maxRetries = 3): Promise<void> {
        const locator = this.page.locator(selector);

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                await locator.waitFor({ state: "visible", timeout: this.getTimeout(5000) });
                await locator.click();
                return;
            } catch (error) {
                if (attempt === maxRetries - 1) {
                    throw new Error(`Failed to click ${selector} after ${maxRetries} attempts`);
                }
                await this.page.waitForTimeout(this.getTimeout(500));
            }
        }
    }

    private async clickSubmitButton(): Promise<void> {
        const submitSelectors = [this.selectors.nextButton, this.selectors.submitButton];

        for (const selector of submitSelectors) {
            const button = this.page.locator(selector);
            const isVisible = await button.isVisible().catch(() => false);

            if (isVisible) {
                await button.click();
                return;
            }
        }

        throw new Error("No submit button found");
    }

    private async handleStaySignedInPrompt(): Promise<void> {
        try {
            const noButton = this.page.locator(this.selectors.staySignedInNo);
            const yesButton = this.page.locator(this.selectors.nextButton);

            // Use domcontentloaded for better reliability with Microsoft redirects
            await this.page.waitForLoadState("domcontentloaded", { timeout: this.getTimeout(10000) });
            // Wait for potential animations
            await this.page.waitForTimeout(500);

            if (await noButton.isVisible({ timeout: this.getTimeout(5000) }).catch(() => false)) {
                await noButton.click();
                // Wait after clicking No to let redirect complete
                await this.page.waitForLoadState("domcontentloaded", {
                    timeout: this.getTimeout(15000)
                });
            } else if (await yesButton.isVisible({ timeout: this.getTimeout(2000) }).catch(() => false)) {
                await yesButton.click();
                // Wait after clicking Yes to let redirect complete
                await this.page.waitForLoadState("domcontentloaded", {
                    timeout: this.getTimeout(15000)
                });
            }
        } catch (error) {
            console.log("Stay signed in prompt handling skipped or not visible");
        }
    }

    private async waitForSuccessfulLogin(): Promise<void> {
        const primarySelector = this.selectors.aventisLogo;
        const fallbackSelectors = [
            '[data-testid="navbar-username"]',
            '.navbar',
            'app-root',
            '[class*="aventis"]'
        ];

        try {
            await this.page.locator(primarySelector).waitFor({
                state: "attached",
                timeout: this.getTimeout(20000)
            });
        } catch (error) {
            console.log(`⚠️ Primary selector "${primarySelector}" not found. Trying fallbacks...`);
            console.log(`📍 Current URL: ${this.page.url()}`);

            let foundFallback = false;
            for (const selector of fallbackSelectors) {
                try {
                    await this.page.locator(selector).waitFor({
                        state: "attached",
                        timeout: this.getTimeout(5000)
                    });
                    console.log(`✅ Fallback selector "${selector}" found - login appears successful`);
                    foundFallback = true;
                    break;
                } catch {
                    console.log(`❌ Fallback "${selector}" not found`);
                }
            }

            if (!foundFallback) {
                const pageContent = await this.page.content();
                console.log(`📄 Page content (first 500 chars): ${pageContent.substring(0, 500)}`);
                throw error;
            }
        }
    }

    async expectUserLogin(fullname: string): Promise<void> {
        if (fullname === "") return;

        await this.page.waitForSelector(this.selectors.nameElement, {
            state: "visible"
        });
        await expect.soft(this.page.locator(this.selectors.nameElement)).toContainText(fullname);
    }

    async expectUserTeam(team: string): Promise<void> {
        if (team === "") return;

        await expect.soft(this.page.locator(this.selectors.teamElement)).toContainText(team);
    }

    async checkVersionNum(version: string): Promise<void> {
        await this.clickWithRetry(this.selectors.navbarUsername);
        await expect.soft(this.page.locator("div.versions-container.ng-star-inserted").locator("span.version-row")).toHaveText(version, { timeout: 10000 });
    }

    async checkLinkContent(linkName: string, linkContent: string): Promise<void> {
        if (!linkContent) return;

        await this.clickWithRetry(this.selectors.navbarUsername);
        const href = await this.page.getByRole("link", { name: linkName }).first().getAttribute("href");
        expect(href).toMatch(linkContent);
        await this.page.keyboard.press("Escape");
    }
}
