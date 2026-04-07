import { BrowserContext, expect, Locator, Page } from "@playwright/test";
import { LoginPage } from "../pages/login-page";
import { NavigationPage } from "../pages/navigation-page";
import { DossierOpenPage } from "../pages/openDossier-page";
import { WohnSituationPage } from "../pages/wohnsituation-page";
import { CommonPage } from "../pages/common-page";
import { MicrosoftLoginPage } from "@pages/microsoftlogin-page";
import { clearCookiesOnly } from "@utils/browser-cleanup";
import { StabilityHelper } from "@utils/stability-helper";
import { AuthManager } from "@utils/auth-manager";
import * as util from "node:util";
import { Context } from "node:vm";

export class CommonKeyword {
    private readonly page: Page;
    private readonly loginPage: LoginPage;
    private readonly msloginPage: MicrosoftLoginPage;
    private readonly navigation: NavigationPage;
    private readonly dossierOpen: DossierOpenPage;
    private readonly wohnSituation: WohnSituationPage;
    commonPage: CommonPage;
    private readonly stability: StabilityHelper;

    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.msloginPage = new MicrosoftLoginPage(page);
        this.navigation = new NavigationPage(page);
        this.dossierOpen = new DossierOpenPage(page);
        this.wohnSituation = new WohnSituationPage(page);
        this.commonPage = new CommonPage(page);
        this.stability = new StabilityHelper(page);
    }
    async M01c_LoginWallis2025({ username, password, fullname, team }) {
        await this.loginPage.loginOTP(username, password);
        await this.loginPage.expectUserLogin(fullname);
        await this.loginPage.expectUserTeam(team);
    }
    async L03c_LogoutAndLoginDiffAccountVS2025({ username, password }) {
        await this.navigation.logout();
        await this.loginPage.loginOTP(username, password);
    }
    async X01_Delete_BrowserCache() {
        // await this.navigation.clearCache()
    }
    async L03b_LogoutAndLoginDiffAccountVS({ username, password }) {
        await this.navigation.logout();
        await this.loginPage.loginWallisAcc(username, password);
    }
    async M01b_LoginWallis({ username, password, fullname, team }) {
        await this.loginPage.loginWallisAcc(username, password);
        await this.loginPage.expectUserTeam(team);
        await this.loginPage.expectUserLogin(fullname);
    }
    async A00_BrowserRefresh_F5() {
        await this.commonPage.refreshBrowser();
    }
    async haushaltDefinieren() {
        await this.dossierOpen.householdTakeOverBtn.click();
    }

    async L00_URLAventis({ url }) {
        await this.stability.stableNavigation(url, {
            timeout: 60000,
            waitUntil: "domcontentloaded",
            stabilityWait: 2000
        });

        // Wait for either the target URL (if already logged in) or login page
        try {
            await Promise.race([this.page.waitForURL(url, { timeout: 5000 }), this.page.waitForURL(/login\.microsoftonline\.com/, { timeout: 5000 }), this.page.waitForURL(/aventis/, { timeout: 5000 })]);
        } catch {
            // If neither URL is reached within timeout, continue anyway
            // The login step will handle authentication
        }
    }

    async login({ username, password }) {
        await this.page.locator("#lightbox").waitFor({ state: "visible" });
        await this.loginPage.enterUsername(username, password);
        //
    }

    //To Replace login after testing
    async Stable_Login(username: string, password: string) {
        const authManager = AuthManager.getInstance();
        await authManager.swapUser(this.page.context(), this.page, username, password);
    }

    //Excel Wrapper
    async L01_Stable_Login({ username, password }) {
        await this.Stable_Login(username, password);
    }

    async M01_LoginMSOnline({ username, password, fullname, team }) {
        await this.msloginPage.login(username, password);
    }

    async L10_Logout() {
        await this.navigation.logout();
    }
    async L03_LogoutAndLoginDiffAccount({ username, password }) {
        await this.Stable_LogoutAndLoginDiffAccount(username, password);
    }

    //To replace L03_LogoutAndLoginDiffAccount
    async Stable_LogoutAndLoginDiffAccount(username: string, password: string) {
        const authManager = AuthManager.getInstance();
        await authManager.swapUser(this.page.context(), this.page, username, password);
    }

    async L04_LogoutAndLoginDiffLanguage({ language, username, password }) {
        await this.navigation.selectLanguage(language);
        await this.page.reload();
    }

    async expectUserLogin(fullname: string) {
        await this.loginPage.expectUserLogin(fullname);
    }

    async verifyAddress({ strasse, houseNumber, ort }) {
        await this.wohnSituation.verifyAddress(strasse, houseNumber, ort);
    }

    async verifyNameOfNewDossier({ firstname, lastname }) {
        await this.wohnSituation.verifyNewDossier(firstname, lastname);
    }
    async DO11_Dossier_Search_Lupe({ searchDossierOrKlient, resultType }) {
        await this.navigation.stableSearchDossierOrKlient(searchDossierOrKlient, resultType);
    }
    async E01_Delay({ Pause }) {
        await this.navigation.delayWait(Pause);
    }
    async L05_Check_VersionNumber({ version }) {
        await this.loginPage.checkVersionNum(version);
    }
    async SM0_SetSlowMotion({ sloMo }) {
        await this.navigation.adjustSlowMotion(sloMo);
    }
    async L06_Check_Support_Infos({ linkName, linkContent }) {
        await this.loginPage.checkLinkContent(linkName, linkContent);
    }
    async L07_Check_Fachhilfe_Documentation({ group, soubGroup, topic, topicLink, lang }) {
        await this.loginPage.checkFachhilfeDocumentation(group, soubGroup, topic, topicLink, lang);
    }

    async GoTo_Dossier_With_Url(dossierGuid: string) {
        const currentUrl = new URL(this.page.url());
        const baseUrl = currentUrl.origin;
        const dossierUrl = `${baseUrl}/dossiers/${dossierGuid}/uebersicht`;
        console.log(`[DEBUG] Navigating to dossier: ${dossierUrl}`);

        const maxRetries = 3;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            await this.stability.stableNavigation(dossierUrl, {
                timeout: 60000,
                waitUntil: "domcontentloaded",
                stabilityWait: 3000
            });

            const hasAccessViolation = await this.checkForAccessViolation();

            if (!hasAccessViolation) {
                console.log(`[DEBUG] Dossier navigation complete`);
                return;
            }
            await this.stability.waitForPageStability({
                additionalWait: 2000
            });

            console.warn(`[RETRY ${attempt}/${maxRetries}] Access denied dialog detected - dossier may not be ready yet`);

            if (attempt < maxRetries) {
                const waitTime = attempt * 2000;
                console.log(`[RETRY] Waiting ${waitTime}ms before retry...`);
                await this.page.waitForTimeout(waitTime);
                await this.page.reload({ waitUntil: "domcontentloaded" });
            }
        }

        throw new Error(`Dossier ${dossierGuid} not accessible after ${maxRetries} retries - "Zugriff verweigert" dialog persists`);
    }

    async checkForAccessViolation(): Promise<boolean> {
        return this.commonPage.checkForAccessViolation();
    }

    //------------------------------------------//

    // STABILITY METHODS
    // Use these methods when tests are running too fast for the application

    /**
     * Stable click with automatic retries and proper waits
     * Use this instead of direct locator.click() for better stability
     */
    async stableClick(
        locator: Locator,
        options?: {
            description?: string;
            timeout?: number;
            retries?: number;
            waitBefore?: number;
            waitAfter?: number;
        }
    ) {
        const { description = "element", ...stableOptions } = options || {};
        console.log(`[STABILITY] Stable click on ${description}`);
        await this.stability.stableClick(locator, stableOptions);
    }

    /**
     * Stable fill with validation and proper waits
     * Use this instead of direct locator.fill() for better stability
     */
    async stableFill(
        locator: Locator,
        value: string,
        options?: {
            description?: string;
            timeout?: number;
            retries?: number;
            waitBefore?: number;
            waitAfter?: number;
            validate?: boolean;
        }
    ) {
        const { description = "input field", ...stableOptions } = options || {};
        console.log(`[STABILITY] Stable fill "${value}" in ${description}`);
        await this.stability.stableFill(locator, value, stableOptions);
    }

    /**
     * Wait for any loading/processing to complete
     * Call this after navigation or major actions
     */
    async waitForApplicationReady(options?: { timeout?: number; additionalWait?: number }) {
        console.log(`[STABILITY] Waiting for application to be ready`);
        await this.stability.waitForPageStability({
            timeout: options?.timeout || 30000,
            additionalWait: options?.additionalWait || 2000
        });
    }

    /**
     * Smart wait for element with multiple strategies
     * Use this when you need to wait for elements that might take time to appear
     */
    async waitForElement(
        locator: Locator,
        options?: {
            description?: string;
            timeout?: number;
            state?: "visible" | "hidden" | "attached" | "detached";
            waitAfter?: number;
        }
    ) {
        const { description = "element", ...waitOptions } = options || {};
        console.log(`[STABILITY] Waiting for ${description} to be ready`);
        await this.stability.stableWaitFor(locator, waitOptions);
    }

    /**
     * Configurable delay for when you need to slow down specific parts of tests
     * Better than hardcoded timeouts as it can be controlled via environment variable
     */
    async stabilityDelay(customMs?: number) {
        const delayMs = customMs || parseInt(process.env.STABILITY_DELAY || "1000", 10);
        if (delayMs > 0) {
            console.log(`[STABILITY] Stability delay: ${delayMs}ms`);
            await this.page.waitForTimeout(delayMs);
        }
    }

    /**
     * Robustly close a dialog with retry logic and proper animation handling.
     * This method ensures the dialog is actually closed before returning.
     * Use this for closing dialogs via the X button (data-testid="close-dialog")
     */
    async closeDialog(options?: { closeButtonSelector?: string; dialogSelector?: string; timeout?: number; retries?: number }) {
        console.log(`[STABILITY] Closing dialog`);
        await this.stability.closeDialog(options);
    }

    /**
     * Close dialog using the "Abbrechen" (Cancel) button
     * Use this when you need to cancel/abort a dialog action
     */
    async closeDialogWithCancel(options?: { dialogSelector?: string; timeout?: number; retries?: number }) {
        console.log(`[STABILITY] Closing dialog with cancel button`);
        await this.stability.closeDialogWithCancel(options);
    }

    //------------------------------------------//
}
