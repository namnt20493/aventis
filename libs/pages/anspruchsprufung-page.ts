import { Page, Locator, expect } from "@playwright/test";
import { NavigationPage } from "./navigation-page";
import { CommonPage } from "./common-page";
import { StabilityHelper } from "@utils/stability-helper";

export class AnspruchsprufungPage {
    page: Page;
    soforthilfeBtn: Locator;
    anspruchsprufungField: Locator;
    soforthilfeNavLink: Locator;
    betragInput: Locator;
    zahlungsverbindungSelect: Locator;
    btnSpeichern: Locator;
    bewilligungOffenBtn: Locator;
    btnAnfragen: Locator;
    commonPage: CommonPage;
    navigationPage: NavigationPage;
    private stabilityHelper: StabilityHelper;
    constructor(page: Page) {
        this.page = page;
        this.commonPage = new CommonPage(page);
        this.navigationPage = new NavigationPage(page);
        this.stabilityHelper = new StabilityHelper(page);
        this.anspruchsprufungField = page.getByRole("button", {
            name: /Anspruchsprüfung|Evaluation des droits/i
        });
        this.soforthilfeNavLink = page.getByRole("link", {
            name: /Soforthilfe|Aide immédiate/i
        });
        this.soforthilfeBtn = page.getByRole("button", {
            name: /Soforthilfe erfassen|Ajouter une aide immédiate/i
        });
        this.betragInput = page.getByTestId("betrag").getByTestId("root-control");
        this.zahlungsverbindungSelect = page.getByTestId("zahlungsverbindungId");
        this.btnSpeichern = page.getByRole("button", {
            name: /Speichern|Enregistrer/i
        });
        this.bewilligungOffenBtn = page.locator("app-approval-workflow-open-button a").first();
        this.btnAnfragen = page.getByRole("button", {
            name: /Anfragen|Demande de la validation/i
        });
    }
    async checkSoforthilfeStatus(zahlungsArt: string, buchungsDatum: string) {
        const isDisabled = await this.soforthilfeBtn.isDisabled();
        if (!isDisabled) {
            await this.page.waitForTimeout(5000);
            await this.page.reload();
            await this.navigationPage.waitForPageReady();
            await this.goToSoforthilfe();
        }
        await expect(this.soforthilfeBtn, {
            message: "Soforthilfe Button should be disabled?"
        }).toBeDisabled();
        await expect(this.page.locator("app-soforthilfe-panel").getByRole("button", { name: /^bearbeiten|^modifier/i }), { message: "Soforthilfe bearbeiten Button should be disabled?" }).toBeVisible();
        await this.page.locator("app-soforthilfe-panel").click();
        const zahlungsart = this.page.locator("app-readmode-field").filter({ hasText: /Zahlungsart|Type de paiement/i });
        await expect
            .soft(zahlungsart, {
                message: `Zahlungsart field should contain ${zahlungsArt}`
            })
            .toContainText(zahlungsArt);

        // Only check Buchungsdatum if a value is expected
        if (buchungsDatum && buchungsDatum !== "") {
            const buchungsdatum = this.page.locator("app-readmode-field").filter({ hasText: /Buchungsdatum|Date de comptabilisation/i });
            const buchungsDatumCount = await buchungsdatum.count();
            if (buchungsDatumCount === 0) {
                throw new Error(`Buchungsdatum field not found. Soforthilfe did not been paid`);
            } else {
                await expect
                    .soft(buchungsdatum, {
                        message: `Buchungsdatum field should contain ${buchungsDatum}`
                    })
                    .toContainText(buchungsDatum);
            }
        }
    }

    async goToSoforthilfe() {
        await this.navigationPage.closeBlockingDialog();
        await this.navigationPage.openMenuNav();
        await this.stabilityHelper.stableWaitFor(this.soforthilfeNavLink, {
            timeout: 15000,
            state: "visible",
            waitAfter: 500
        });
        await this.stabilityHelper.stableClick(this.soforthilfeNavLink, {
            timeout: 10000,
            waitAfter: 500
        });
        await this.navigationPage.waitForSpinnerToDisappear();
    }
    async inputInfo(expectedErrorContains: string | null | undefined, klientschaft: string, betrag: number, zahlungsverbindung: string) {
        if (!expectedErrorContains) {
            await this.navigationPage.closeBlockingDialog();
            await this.stabilityHelper.stableClick(this.soforthilfeBtn, {
                timeout: 15000,
                retries: 3,
                waitBefore: 300,
                waitAfter: 500
            });
            await this.navigationPage.waitForPageReady();
            await this.navigationPage.waitForSpinnerToDisappear();
            await this.navigationPage.closeBlockingDialog();
            await this.navigationPage.waitForPageReady();
            const allClientButton = this.page.locator(`app-card`).first().locator("button");
            await allClientButton.waitFor({ state: "visible", timeout: 10000 });
            const isAllChecked = (await allClientButton.getAttribute("aria-checked")) === "true";
            if (isAllChecked) {
                await this.stabilityHelper.stableClick(allClientButton, {
                    timeout: 10000,
                    retries: 2,
                    waitBefore: 200,
                    waitAfter: 300
                });
            }
            const clientButton = this.page.locator(`app-card:has-text('${klientschaft}')`).locator("button");
            await clientButton.waitFor({ state: "visible", timeout: 10000 });
            const isChecked = (await clientButton.getAttribute("aria-checked")) === "true";
            if (!isChecked) {
                await this.stabilityHelper.stableClick(clientButton, {
                    timeout: 10000,
                    retries: 2,
                    waitBefore: 200,
                    waitAfter: 300
                });
            }
            await this.zahlungsverbindungSelect.highlight();
            await this.stabilityHelper.stableClick(this.zahlungsverbindungSelect);
            await this.page.locator("mat-option").first().waitFor({ state: "visible" });
            // Handle Barzahlung/Barauszahlung specially (no IBAN)
            if (zahlungsverbindung.toLowerCase().includes("bar")) {
                await this.page.locator(`mat-option`).filter({ hasText: /Bar/i }).last().click();
            } else {
                const iban = await this.extractSwissIBAN(zahlungsverbindung);
                await this.page
                    .locator(`mat-option`)
                    .filter({ hasText: iban ?? undefined })
                    .last()
                    .click();
            }
            await this.stabilityHelper.stableFill(this.betragInput, betrag.toString(), {
                timeout: 10000,
                retries: 3,
                waitBefore: 300,
                waitAfter: 500,
                clearFirst: true,
                validate: false
            });
            await this.navigationPage.waitForSpinnerToDisappear();
            await expect(async () => {
                await expect(this.btnSpeichern, { message: "Save button should be enabled" }).toBeEnabled();
            }).toPass({ timeout: 20000, intervals: [500, 1000, 2000, 3000] });
            await this.stabilityHelper.stableClick(this.btnSpeichern, {
                timeout: 10000,
                retries: 2,
                waitBefore: 300,
                waitAfter: 500
            });
            await this.navigationPage.waitForPageReady();
            await this.bewillingungOffnen();
        } else {
            await expect(this.page.getByText(expectedErrorContains), {
                message: `Error message contains "${expectedErrorContains}"`
            }).toBeVisible({ timeout: 5000 });
        }
    }
    async extractSwissIBAN(text: string): Promise<string | null> {
        const regex = /CH\d{2}(?:\s?\d{4}){4}\s?\d{2}\s?\d{1}/;
        const match = text.match(regex);
        return match ? match[0] : null;
    }
    async bewillingungOffnen() {
        await this.stabilityHelper.stableWaitFor(this.bewilligungOffenBtn, {
            timeout: 15000,
            state: "visible",
            waitAfter: 300
        });
        await this.stabilityHelper.stableClick(this.bewilligungOffenBtn, {
            timeout: 10000,
            retries: 3,
            waitBefore: 300,
            waitAfter: 500
        });
        await this.navigationPage.waitForSpinnerToDisappear();
        await this.stabilityHelper.stableWaitFor(this.btnAnfragen, {
            timeout: 15000,
            state: "visible",
            waitAfter: 300
        });
        await this.stabilityHelper.stableClick(this.btnAnfragen, {
            timeout: 10000,
            retries: 3,
            waitBefore: 300,
            waitAfter: 500
        });
        await this.navigationPage.waitForSpinnerToDisappear();
    }
}
