import { Page } from "@playwright/test";
import * as OTPAuth from "otpauth";
import { PageObjectBase } from "@core/base";
import { IButton, ITextInput, ILink, IServiceContext } from "@core/interfaces";

/**
 * LoginPage - Modernized version using the new Control pattern.
 *
 * ARCHITECTURE:
 * - This page object is Playwright-independent (no direct page/expect usage)
 * - All interactions go through Controls (IButton, ITextInput, ILink)
 * - All methods use StabilityHelper internally - no separate "stable" variants needed
 */
export class LoginPage extends PageObjectBase {
    // Microsoft Online Login Controls
    readonly useAnotherAccountLink: ILink = this.linkByText("Use another account");
    readonly usernameInput: ITextInput = this.textInputById("i0116");
    readonly passwordInput: ITextInput = this.textInputById("i0118");
    readonly submitButton: IButton = this.buttonBySelector('input[type="submit"]');

    // Wallis Login Controls
    readonly wallisUsernameInput: ITextInput = this.textInputById("username");
    readonly wallisPasswordInput: ITextInput = this.textInputById("password");
    readonly wallisSignInButton: IButton = this.buttonBySelector("#kc-login");

    // OTP Login Controls
    readonly ldapLoginButton: IButton = this.buttonBySelector("#loginLdap");
    readonly otpUsernameInput: ITextInput = this.textInputById("username");
    readonly otpPasswordInput: ITextInput = this.textInputById("password");
    readonly otpInput: ITextInput = this.textInputById("otp");
    readonly otpLoginButton: IButton = this.buttonBySelector("#login");

    // User info Controls
    readonly userNameDisplay: ITextInput = this.textInputBySelector(".selection-card-slim.user-card .username .name");
    readonly teamDisplay: ITextInput = this.textInputBySelector(".team");
    readonly navbarUsernameButton: IButton = this.button("navbar-username");
    readonly versionDisplay: ITextInput = this.textInputBySelector("div[class='versions'] span");

    // Text elements for wait/check
    private readonly enterPasswordText: ITextInput = this.textInputBySelector('div[data-text="Enter password"]');
    private readonly staySignedInText: ITextInput = this.textInputBySelector('[data-text="Stay signed in?"]');

    constructor(page: Page, services?: IServiceContext) {
        super(page, services);
    }

    async loginWithMsOnline(username: string, password: string): Promise<void> {
        try {
            await this.usernameInput.shouldBeVisible({ timeout: 20000 });
            await this.enterMsOnlineCredentials(username, password);
            await this.handleStaySignedIn();
        } catch {
            await this.useAnotherAccountLink.click();
            await this.usernameInput.waitForVisible(10000);
            await this.enterMsOnlineCredentials(username, password);
        }
        await this.waitForPageReady();
    }

    async loginWithDifferentMsAccount(username: string, password: string): Promise<void> {
        await this.useAnotherAccountLink.click();
        await this.usernameInput.waitForVisible(10000);
        await this.usernameInput.fill(username);
        await this.submitButton.click();

        await this.passwordInput.waitForVisible();
        await this.waitForStabilityDelay(5000);
        await this.passwordInput.click();
        await this.passwordInput.fill(password);
        await this.submitButton.click();

        try {
            await this.staySignedInText.waitForVisible(5000);
            await this.submitButton.click();
        } catch {
            // Stay signed in prompt may not appear
        }
    }

    async loginWithWallisAccount(username: string, password: string): Promise<void> {
        await this.wallisUsernameInput.fill(username);
        await this.wallisPasswordInput.fill(password);
        await this.wallisSignInButton.click();
    }

    async loginWithOtp(username: string, password: string): Promise<void> {
        const secret = this.getUserSecret(username.toLowerCase());
        if (!secret) {
            throw new Error(`No secret found for username: ${username}. Set TOTP_SECRET_${username.toUpperCase()} environment variable.`);
        }

        const totp = new OTPAuth.TOTP({
            issuer: "qas VS",
            label: username.toLowerCase(),
            algorithm: "SHA1",
            digits: 6,
            period: 30,
            secret: secret
        });

        await this.ldapLoginButton.click();
        await this.otpUsernameInput.fill(username);
        await this.otpPasswordInput.fill(password);
        await this.otpLoginButton.click();

        const token = totp.generate();
        await this.otpInput.fill(token);
        await this.otpLoginButton.click();
    }

    async expectUserLoggedIn(fullname: string): Promise<void> {
        if (fullname) {
            await this.userNameDisplay.waitForVisible();
            await this.userNameDisplay.shouldContainText(fullname);
        }
    }

    async expectUserTeam(team: string): Promise<void> {
        if (team) {
            await this.teamDisplay.shouldContainText(team);
        }
    }

    async checkVersionNumber(version: string): Promise<void> {
        await this.navbarUsernameButton.click();
        await this.versionDisplay.shouldContainText(version);
    }

    // ============================================================
    // Private Helper Methods
    // ============================================================

    private async enterMsOnlineCredentials(username: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.submitButton.forceClick();
        await this.enterPassword(password);
    }

    private async enterPassword(password: string): Promise<void> {
        await this.passwordInput.waitForVisible();
        await this.passwordInput.clearAndFill(password);
        await this.waitForStabilityDelay(1000);
        await this.submitButton.waitForVisible();
        await this.submitButton.forceClick();
    }

    private async handleStaySignedIn(): Promise<void> {
        await this.submitButton.forceClick();
    }

    private async waitForStabilityDelay(ms: number): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, ms));
    }

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
}
