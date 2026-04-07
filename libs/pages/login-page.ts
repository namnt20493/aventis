import { Locator, Page, expect } from "@playwright/test";
import * as OTPAuth from "otpauth";
import { CommonPage } from "./common-page";
import { StabilityHelper } from "@utils/stability-helper";

export class LoginPage {
    readonly page: Page;
    private stabilityHelper: StabilityHelper;
    useAnotherAccount: Locator;
    username: Locator;
    nextBtn: Locator;
    password: Locator;
    wallisUsernameInput: Locator;
    wallisPasswordInput: Locator;
    wallisSignInBtn: Locator;
    commonPage: CommonPage;

    constructor(page: Page) {
        this.page = page;
        this.stabilityHelper = new StabilityHelper(page);
        this.commonPage = new CommonPage(page);
        this.useAnotherAccount = page.locator("#otherTileText");
        this.username = page.locator("#i0116");
        this.nextBtn = page.locator("#idSIButton9");
        this.password = page.locator("#i0118");
        this.wallisUsernameInput = page.locator("#username");
        this.wallisPasswordInput = page.locator("#password");
        this.wallisSignInBtn = page.locator("#kc-login");
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

    async loginOTP(username: string, password: string) {
        const normalizedUsername = username.toLowerCase();
        const secret = this.getUserSecret(normalizedUsername);
        if (!secret) {
            throw new Error(`No secret found for username: ${username}. Set TOTP_SECRET_${normalizedUsername.toUpperCase()} environment variable.`);
        }

        let totp = new OTPAuth.TOTP({
            issuer: "qas VS",
            label: normalizedUsername,
            algorithm: "SHA1",
            digits: 6,
            period: 30,
            secret: secret
        });

        await this.page.locator("#loginLdap").click();
        await this.page.locator("#username").fill(username);
        await this.page.locator("#password").fill(password);
        await this.page.locator("#login").click();
        let token = totp.generate();
        await this.page.locator("#otp").fill(token);
        await this.page.locator("#login").click();
    }

    //login with wallis account
    async loginWallisAcc(username: string, password: string) {
        await this.wallisUsernameInput.fill(username);
        await this.wallisPasswordInput.fill(password);
        await this.wallisSignInBtn.click();
    }

    async loginDiffAcc(username: string, password: string) {
        await this.useAnotherAccount.click();
        await this.page.waitForSelector("#i0116", { state: "visible" });
        await this.username.fill(username);
        await this.nextBtn.click();
        await this.password.waitFor({ state: "visible" });
        await this.password.click({ delay: 5000 });
        await this.password.fill(password);
        await this.nextBtn.click();
        try {
            await this.page.getByText(this.staySignedInText).waitFor({ state: "visible", timeout: 5000 });
            await this.nextBtn.click();
            await this.commonPage.waitForApiHelper(this.page, "DossierListeQuery", async () => {});
        } catch (e) {
            await this.commonPage.waitForApiHelper(this.page, "DossierListeQuery", async () => {});
        }
    }

    private readonly signInText = "Sign in";
    private readonly usernameInput = 'input[name="loginfmt"]';
    private readonly enterPasswordText = "Enter password";
    private readonly passwwordInput = 'input[name="passwd"]';
    private readonly submitButton = 'input[type="submit"]';
    private readonly staySignedInText = "Stay signed in?";
    private readonly nameElement = ".selection-card-slim.user-card .username .name";
    private readonly teamElement = ".team";

    async enterUsername(username: string, password: string) {
        try {
            await expect(this.page.locator("#i0116"), {
                message: "Is a new Login ?"
            }).toBeVisible({ timeout: 20000 });
            await this.username.fill(username);
            await this.page.click(this.submitButton);
            await this.enterPassword(password);
            await this.staySignedIn();
        } catch {
            await this.useAnotherAccount.click();
            await this.page.waitForSelector("#i0116", { state: "visible" });
            await this.username.fill(username);
            await this.page.click(this.submitButton);
            await this.enterPassword(password);
        }
    }

    async enterPassword(password: string) {
        await this.page.getByText(this.enterPasswordText).waitFor({ state: "visible" });
        await this.page.fill(this.passwwordInput, password);
        await this.page.waitForTimeout(1000);
        await this.page.locator(this.submitButton).waitFor({ state: "visible" });
        await this.page.click(this.submitButton);
    }

    async staySignedIn() {
        // await expect(this.page.getByText(this.staySignedInText),{message : 'Is a new Login ?'}).toBeVisible()
        // await this.page.getByText(this.staySignedInText).waitFor({ state: 'visible' });
        // await this.page.locator(this.submitButton).waitFor({ state: 'visible' });
        await this.page.click(this.submitButton);
    }

    async expectUserLogin(fullname: string) {
        if (fullname !== "") {
            await this.page.waitForSelector(this.nameElement, { state: "visible" });
            await expect.soft(this.page.locator(this.nameElement)).toContainText(fullname);
        }
    }

    async expectUserTeam(team: string) {
        if (team !== "") {
            await expect.soft(this.page.locator(this.teamElement)).toContainText(team);
        }
    }
    async checkVersionNum(version: string) {
        await this.page.getByTestId("navbar-username").click();
        await expect.soft(this.page.locator("div[class='versions']").locator("span")).toContainText(version, { timeout: 10000 });
    }
    async checkLinkContent(linkName: string, linkContent: string) {
        if (linkContent !== "" && linkContent !== undefined && linkContent !== null) {
            await this.page.getByTestId("navbar-username").click();
            const href = await this.page.getByRole("link", { name: linkName }).first().getAttribute("href");
            console.log(href);
            expect(href).toMatch(linkContent);
            await this.page.keyboard.press("Escape");
        }
    }
    async checkFachhilfeDocumentation(group: string, soubGroup: string, topic: string, topicLink: string, lang: string) {
        await this.page
            .locator("app-navigation-tree-actions button")
            .filter({
                has: this.page.locator('mat-icon[data-mat-icon-name="collapse"]')
            })
            .click();
        await this.page.locator(`app-navigation-drawer-item:has-text("${group}")`).click();
        await this.page.getByRole("link", { name: soubGroup }).click();
        await this.page.locator("app-dossier-header button").click();
        const sheetCard = this.page.locator("app-side-sheet-card").filter({ hasText: topic });
        if (lang !== "" && lang !== undefined && lang !== null) {
            await expect(this.page.locator("app-side-sheet-card").filter({ hasText: topic }), { message: `Could not find the link with topic name "${topic}"` }).toBeVisible({ timeout: 10000 });
            const href = await sheetCard.getByRole("link", { name: lang }).first().getAttribute("href");
            expect(href, {
                message: `The link for topic "${topic}" does not match the expected value: ${topicLink}`
            }).toMatch(topicLink);
        } else {
            const href = await this.page.getByRole("link", { name: topic }).first().getAttribute("href");
            expect(href, {
                message: `The link for topic "${topic}" does not match the expected value: ${topicLink}`
            }).toMatch(topicLink);
        }
        await this.page.reload();
    }
}
