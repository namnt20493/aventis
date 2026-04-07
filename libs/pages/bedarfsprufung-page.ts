import { Page, Locator, expect } from "@playwright/test";
import { NavigationPage } from "./navigation-page";
import { RahmenbudgetPage } from "./rahmenbudget-page";
import { CommonPage } from "./common-page";
import { StabilityHelper } from "../utils/stability-helper";

export class BedarfsprufungPage {
    page: Page;
    stabilityHelper: StabilityHelper;
    bedarfsprufungLink: Locator;
    bedarfsprufungErafassenBtn: Locator;
    eintretensentscheidTab: Locator;
    eintretenRadioBtn: Locator;
    entscheidVomInput: Locator;
    begrundungTxtbox: Locator;
    bedarfsprufungSichernBtn: Locator;
    wirtschaftlicheSozialhilfeErafassenBtn: Locator;
    ganzeKlientschaftAppcard: Locator;
    ganzeKlientSchaftBtnSwitch: Locator;
    unterstutzungabTxtbox: Locator;
    wshLeistungErfassenBtn: Locator;
    rahmenbudgetLink: Locator;
    unterstutzungsbetragCurrency: Locator;
    navigation: NavigationPage;
    rahmenbudget: RahmenbudgetPage;
    freiwilligeEinkommensverwaltung: Locator;
    unterstutzungAb: Locator;
    verwaltetes: Locator;
    btnFEVleistungErfassen: Locator;
    ubersitchContent: Locator;
    appSnackbar: Locator;
    appSnackbarButton: Locator;
    common: CommonPage;
    entscheidrelevanteDokumenteTab: Locator;
    btnWordgenerate: Locator;
    kategorieFilter: Locator;
    dokumentStatusFilter: Locator;
    betrifftPersonFilter: Locator;
    constructor(page: Page) {
        this.page = page;
        this.stabilityHelper = new StabilityHelper(page);
        this.navigation = new NavigationPage(page);
        this.rahmenbudget = new RahmenbudgetPage(page);
        this.common = new CommonPage(page);
        this.bedarfsprufungLink = page.getByTestId("BedarfspruefungRoute");
        this.bedarfsprufungErafassenBtn = this.page.getByRole("button", {
            name: /Bedarfsprüfung erfassen|Enregistrer l'évaluation des besoins/i
        });
        this.eintretensentscheidTab = page.getByRole("tab", { name: "Eintretensentscheid" }).last();
        this.eintretenRadioBtn = page.locator("mat-radio-button[value='Eintreten'] input");
        this.entscheidVomInput = page.getByTestId("entscheidVom").getByTestId("root-control");
        this.begrundungTxtbox = this.page.getByTestId("entscheidBemerkung").getByTestId("root-control");
        this.bedarfsprufungSichernBtn = page.getByRole("button", {
            name: /Bedarfsprüfung sichern|Enregistrer l'évaluation des besoins/i
        });
        this.wirtschaftlicheSozialhilfeErafassenBtn = page.locator("app-berechnung-entscheid-readonly button").first();
        this.ganzeKlientschaftAppcard = this.page.locator("app-person-toggle-select").locator("app-card").first();
        this.ganzeKlientSchaftBtnSwitch = this.ganzeKlientschaftAppcard.locator("button");
        this.unterstutzungabTxtbox = page.getByTestId("unterstuetztAb").getByTestId("root-control");
        this.wshLeistungErfassenBtn = page.getByRole("button", {
            name: /WSH-Leistung erfassen|Enregistrer une prestation d'aide sociale économique/i
        });
        this.rahmenbudgetLink = page.getByRole("link", {
            name: /Rahmenbudget|Budget-cadre/i
        });
        this.unterstutzungsbetragCurrency = page.locator("tbody[class*='rahmenbudget-footer'] td[class*='currency-column']");
        this.freiwilligeEinkommensverwaltung = page.getByRole("button", {
            name: /Freiwillige Einkommensverwaltung erfassen|Saisir une gestion volontaire des revenus/i
        });
        this.unterstutzungAb = page.getByTestId("verwaltungAb").getByTestId("root-control");
        this.verwaltetes = page.getByTestId("zahlungsverbindungId").getByTestId("root-control");
        this.btnFEVleistungErfassen = page.getByRole("button", {
            name: /FEV-Leistung erfassen|Saisir une prestation GVR/i
        });
        this.ubersitchContent = page.locator("app-content strong");
        this.appSnackbar = page.locator("app-snackbar");
        this.appSnackbarButton = page.locator("app-snackbar button");
        this.entscheidrelevanteDokumenteTab = page.getByRole("tab", {
            name: /Entscheidrelevante Dokumente|Documents pertinents pour la décision/i
        });
        this.btnWordgenerate = page.locator("app-dokument-generieren mat-button-toggle[role='button'] button");
        this.kategorieFilter = page.getByRole("combobox", {
            name: /Kategorien|Catégorie/i
        });
        this.dokumentStatusFilter = page.getByTestId("dokumentStatus").getByTestId("root-control");
        this.betrifftPersonFilter = page.getByTestId("dokumentPersonId");
    }
    async filterBedarfsprufungDokumente(filterKategorie: string, filterStatus: string, filterBetrifft: string) {
        await this.entscheidrelevanteDokumenteTab.click();
        // await this.page.getByRole('button', {name : /Filter zurücksetzen|Réinitialiser le filtre/i}).dblclick()
        await this.kategorieFilter.waitFor({ state: "visible" });
        const kategories = this.common.separateText(filterKategorie);
        await this.page.keyboard.press("Escape");
        await this.dokumentStatusFilter.click({ delay: 100 });
        await this.stabilityHelper.stableClick(this.page.getByRole("option", { name: new RegExp(filterStatus, "i") }));
        if (filterBetrifft !== "" && filterBetrifft !== null && filterBetrifft !== undefined) {
            await this.betrifftPersonFilter.click();
            await this.stabilityHelper.stableClick(this.page.getByRole("option", { name: new RegExp(filterBetrifft, "i") }));
        }
        for (const kat of kategories) {
            await this.kategorieFilter.click();
            await this.stabilityHelper.stableClick(this.page.getByRole("option", { name: new RegExp(kat, "i") }));
            await this.page.keyboard.press("Tab");
        }
        await this.navigation.waitForPageReady();
    }
    async verifyKategorieInDokumenteList(filterKategorie: string) {
        const kategories = this.common.separateText(filterKategorie);
        const headers = await this.page.locator("mat-expansion-panel-header").allTextContents();
        for (const kat of kategories) {
            const found = headers.some((text) => new RegExp(kat, "i").test(text));
            expect
                .soft(found, {
                    message: `Category "${kat}" should be found in the document list.`
                })
                .toBeTruthy();
        }
    }
    async generateWordDokument() {
        await this.btnWordgenerate.click();
        await this.navigation.waitForPageReady();
        const link = this.page.locator("app-file-download-base-link").getByRole("link");
        const content = await link.textContent();
        const date = this.common.extractAndFormatDate(content as string);
        await expect(link).toContainText(".docx");
        const today = new Date();
        const todayStr = `${today.getDate().toString().padStart(2, "0")}.${(today.getMonth() + 1).toString().padStart(2, "0")}.${today.getFullYear()}`;
        expect(date).toBe(todayStr);
    }

    async acceptAusbildung(bedarfsPrDate: string, klient: string, thema: string) {
        await this.page
            .getByRole("tab", {
                name: /Entscheidrelevante Dokumente|Documents pertinents pour la décision/i
            })
            .click();
        await this.page
            .locator(`mat-expansion-panel-header:has-text('${bedarfsPrDate}')`)
            .getByRole("button", { name: /Bearbeiten|Modifier/i })
            .last()
            .click();
        await this.page.locator(`mat-expansion-panel-header:has-text('${thema}') button`).click();
        await expect.soft(this.page.locator(`mat-expansion-panel-header:has-text('${thema}') app-status-icon`)).toContainText(/Terminé|Erledigt/i);
        await this.bedarfsprufungSichernBtn.click();
        await this.navigation.waitForPageReady();
    }
    async editBedarfsprufung(bedarfsPrDate: string, klient: string, thema: string, unterLagen: string, status: string, bemerkung: string) {
        await this.page
            .locator(`mat-expansion-panel-header:has-text('${bedarfsPrDate}')`)
            .getByRole("button", { name: /Bearbeiten|Modifier/i })
            .last()
            .click();
        await this.page.locator(`mat-expansion-panel-header:has-text('${thema}')`).click();
        const field = this.page.locator(`div[class*='grid-row']:has-text('${unterLagen}')`);
        await field
            .locator(`div[class*='grid-row margin-top-12']:has-text('${klient}')`)
            .getByRole("radio", { name: new RegExp(status, "i") })
            .click();
        await field.locator(`div[class*='grid-row margin-top-12']:has-text('${klient}')`).getByTestId("bemerkung").getByTestId("root-control").fill(bemerkung);
        await this.bedarfsprufungSichernBtn.click();
        await this.navigation.waitForPageReady();
    }

    //click app snackbar if it appears
    async clickAppSnackbar() {
        if (await this.appSnackbar.isVisible()) {
            await this.appSnackbarButton.click();
        }
    }
    //click Freiwillige Einkommensverwaltung
    async clickFreiwilligeEinkommensverwaltung(unterstuetzungAb: string, kontoVerbindung: string) {
        console.log(`🔍 [FEV] Clicking Freiwillige Einkommensverwaltung with account: ${kontoVerbindung}`);

        await this.freiwilligeEinkommensverwaltung.first().click();
        await this.navigation.waitForPageReady();

        console.log(`🔍 [FEV] Filling support date: ${unterstuetzungAb}`);
        await this.unterstutzungAb.fill(unterstuetzungAb);

        console.log(`🔍 [FEV] Clicking payment connection dropdown`);
        await this.verwaltetes.click();

        // Select account in dropdown
        try {
            console.log(`🔍 [FEV] Checking account availability: ${kontoVerbindung}`);
            await this.page.waitForTimeout(1000);

            // Check if the correct option is already selected
            const selectedOption = await this.page.locator("option[selected]").count();
            let accountSelected = false;

            if (selectedOption > 0) {
                const selectedText = await this.page.locator("option[selected]").textContent();
                console.log(`🔍 [FEV] Account already selected: ${selectedText}`);

                if (selectedText && (selectedText.includes(kontoVerbindung) || selectedText.includes(kontoVerbindung.split(",")[0]))) {
                    console.log(`✅ [FEV] Correct account already selected`);
                    accountSelected = true;
                }
            }

            if (!accountSelected) {
                // Try to find and click the correct option
                const optionExists = await this.page.getByRole("option", { name: kontoVerbindung }).count();

                if (optionExists === 0) {
                    // Try partial match if exact match fails
                    const partialMatch = await this.page.getByRole("option", { name: new RegExp(kontoVerbindung.split(",")[0]) }).count();

                    if (partialMatch === 0) {
                        const availableOptions = await this.page.locator("option").allTextContents();
                        console.error(`❌ [FEV] Account '${kontoVerbindung}' not found. Available:`, availableOptions);
                        throw new Error(`Payment connection '${kontoVerbindung}' not found. Available: ${availableOptions.join(", ")}`);
                    } else {
                        console.log(`🔍 [FEV] Using partial match for account selection`);
                        await this.page
                            .getByRole("option", { name: new RegExp(kontoVerbindung.split(",")[0]) })
                            .first()
                            .click();
                    }
                } else {
                    console.log(`🔍 [FEV] Selecting account: ${kontoVerbindung}`);
                    await this.page.getByRole("option", { name: kontoVerbindung }).click();
                }
            }
        } catch (error) {
            console.error(`❌ [FEV] Failed to select payment connection:`, error instanceof Error ? error.message : String(error));
            throw error;
        }

        // Always click the FEV-Leistung erfassen button
        console.log(`🔍 [FEV] Clicking FEV-Leistung erfassen button`);
        await this.btnFEVleistungErfassen.click();

        // Wait for spinner and Angular to stabilize after FEV creation
        await this.navigation.waitForSpinnerToDisappear();
        await this.navigation.waitForAngularStable();

        // Additional wait for backend processing to complete
        await this.page.waitForTimeout(2000);

        // Check for error snackbar that might indicate failure
        const errorSnackbar = this.page.locator("app-snackbar.error, snack-bar-container.error, .mat-snack-bar-container");
        const hasError = await errorSnackbar.isVisible().catch(() => false);
        if (hasError) {
            const errorText = await errorSnackbar.textContent().catch(() => "Unknown error");
            console.error(`❌ [FEV] Creation failed with error: ${errorText}`);
            throw new Error(`FEV creation failed: ${errorText}`);
        }

        console.log(`✅ [FEV] FEV-Leistung erfassen button clicked - waiting for backend processing...`);
    }

    //validate leistung erfassen
    async validateLeistungErfassen(kontoVerbindung: string) {
        console.log(`🔍 [FEV] Validating FEV creation in overview...`);

        // Wait for Angular to stabilize before checking navigation
        await this.navigation.waitForAngularStable();
        await this.page.waitForTimeout(2000);

        // First check if FEV node is already visible without reload
        await this.navigation.openMenuNav();
        await this.page.waitForTimeout(500);

        const fevNode = this.page.getByTestId("FevNode");
        let fevNodeVisible = await fevNode.isVisible().catch(() => false);

        // If FEV node not visible, try reloading
        if (!fevNodeVisible) {
            console.log(`⚠️ [FEV] FEV node not visible yet, reloading page to refresh navigation...`);
            await this.page.reload();
            await this.navigation.waitForPageReady();
            await this.navigation.openMenuNav();
            await this.page.waitForTimeout(1000);
            fevNodeVisible = await fevNode.isVisible().catch(() => false);
        }

        // Wait for FEV section to appear in menu with retry logic
        const fevSection = this.page.locator("app-navigation-tree-group").filter({
            hasText: /Freiwillige Einkommensverwaltung|Gestion volontaire des revenus/i
        });

        let fevSectionVisible = false;
        const maxRetries = 2;

        for (let attempt = 1; attempt <= maxRetries && !fevSectionVisible; attempt++) {
            console.log(`🔍 [FEV] Checking for FEV section in navigation (attempt ${attempt}/${maxRetries})...`);

            fevSectionVisible = await fevSection.isVisible().catch(() => false);

            if (!fevSectionVisible && attempt < maxRetries) {
                console.log(`⚠️ [FEV] FEV section not visible, waiting and retrying...`);
                await this.page.waitForTimeout(2000);
                await this.navigation.openMenuNav();
            }
        }

        if (!fevSectionVisible) {
            // Log current page state for debugging
            const fevNodeExists = await fevNode.count();
            console.error(`❌ [FEV] FEV section not found in navigation after ${maxRetries} attempts`);
            console.error(`❌ [FEV] FevNode testId count: ${fevNodeExists}`);
            throw new Error(`FEV validation failed: FEV section not found in navigation menu. ` + `This indicates the FEV was not created successfully. ` + `FevNode elements found: ${fevNodeExists}`);
        }

        console.log(`✅ [FEV] FEV section found in navigation`);

        await this.navigation.goToUbersichtLink();
        await this.navigation.waitForPageReady();

        try {
            // Wait for overview content to be visible
            await this.ubersitchContent.first().waitFor({ state: "visible", timeout: 10000 });

            // Robust validation with retry logic
            let validationPassed = false;
            let attempts = 0;
            const maxAttempts = 3;

            while (!validationPassed && attempts < maxAttempts) {
                attempts++;
                console.log(`🔍 [FEV] Validation attempt ${attempts}/${maxAttempts}...`);

                try {
                    await expect.soft(this.ubersitchContent).toContainText(this.common.reverseText(kontoVerbindung));
                    validationPassed = true;
                    console.log(`✅ [FEV] Validation successful: Found '${kontoVerbindung}' in overview`);
                } catch (error) {
                    if (attempts === maxAttempts) {
                        console.error(`❌ [FEV] Validation failed after ${maxAttempts} attempts`);
                        throw error;
                    }
                    console.log(`⚠️ [FEV] Validation attempt ${attempts} failed, retrying...`);
                    await this.page.waitForTimeout(1000); // Wait before retry
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error(`❌ [FEV] Validation failed:`, error.message);
            } else {
                console.error(`❌ [FEV] Validation failed:`, error);
            }
            throw error;
        }
    }
    async clickBedarfNavLink() {
        await this.clickBedarfLink();
        await this.common.waitForApiHelper(this.page, "DossierIdByLeistungQuery", async () => {
            await this.page.reload();
        });
    }

    async clickBedarfLink() {
        await this.navigation.openMenuNav();
        await this.bedarfsprufungLink.click();
    }
    async clickBedarfEraBtn() {
        await this.bedarfsprufungErafassenBtn.click();
        await this.navigation.waitForPageReady();
    }
    async clickEintreTab() {
        try {
            await expect(this.eintretensentscheidTab).toBeVisible({ timeout: 5000 });
            await this.eintretensentscheidTab.scrollIntoViewIfNeeded();
            await this.eintretensentscheidTab.dblclick({ delay: 1000 });
            await this.page.keyboard.press("Escape");
        } catch {
            await this.page.reload();
            await this.eintretensentscheidTab.scrollIntoViewIfNeeded();
            await this.eintretensentscheidTab.dblclick({ delay: 1000 });
            await this.page.keyboard.press("Escape");
        }
        // Check if the tab is active, if not, click again
        const isActive = (await this.eintretensentscheidTab.getAttribute("aria-selected")) === "true";

        if (!isActive) {
            await this.eintretensentscheidTab.click();
        }
    }
    async selectEintreRadioBtn() {
        try {
            await expect(this.eintretenRadioBtn).toBeVisible({ timeout: 5000 });
            await this.eintretenRadioBtn.check();
        } catch {
            await this.stabilityHelper.stableClick(
                this.page
                    .locator("app-bedarfspruefung-panel button")
                    .filter({ has: this.page.locator("mat-icon[svgicon='edit']") })
                    .first()
            );
            await this.eintretenRadioBtn.check();
        }
    }
    async inputEntscheidVom(entscheidVom: string) {
        await this.entscheidVomInput.click();
        await this.entscheidVomInput.fill("");
        await this.entscheidVomInput.pressSequentially(entscheidVom);
    }
    async inputBegrundung(begrundung: string) {
        await this.begrundungTxtbox.pressSequentially(begrundung);
    }
    async clickBedarfsprufungSichernBtn() {
        await this.bedarfsprufungSichernBtn.click();
    }
    async clickWirtschaftlicheSozialhilfeErafassenBtn() {
        await this.wirtschaftlicheSozialhilfeErafassenBtn.click();
    }
    async selectGanzeKlientSchaft() {
        await this.page.waitForSelector("app-default-dialog", { state: "visible" });

        // Get all person toggle cards in the dialog (skip first one which is "Ganze Klientschaft" master toggle)
        const allPersonCards = this.page.locator("app-person-toggle-select").locator("app-card");
        const cardCount = await allPersonCards.count();

        console.log(`🔍 [Bedarfsprüfung] Found ${cardCount} card(s) in dialog`);

        // If there's more than 1 card (Ganze Klientschaft + individual persons), click individual toggles
        // Skip the first card (Ganze Klientschaft) and enable each individual person's toggle
        if (cardCount > 1) {
            for (let i = 1; i < cardCount; i++) {
                const card = allPersonCards.nth(i);
                const toggleSwitch = card.locator("button[role='switch']");

                // Check if toggle is already active
                const isActive = await toggleSwitch.getAttribute("aria-checked");
                if (isActive !== "true") {
                    console.log(`🔍 [Bedarfsprüfung] Enabling person ${i} for WSH support unit`);
                    try {
                        await toggleSwitch.hover({ timeout: 10000 });
                        await toggleSwitch.click({ timeout: 10000 });
                        await this.page.waitForTimeout(300);
                    } catch (error) {
                        console.error(`❌ [Bedarfsprüfung] Failed to enable person ${i}:`, error instanceof Error ? error.message : String(error));
                        throw new Error(`Failed to toggle person ${i} for WSH support: ${error instanceof Error ? error.message : String(error)}`);
                    }
                } else {
                    console.log(`🔍 [Bedarfsprüfung] Person ${i} already enabled`);
                }
            }
        } else {
            // Only "Ganze Klientschaft" exists (single person dossier) - click it
            console.log(`🔍 [Bedarfsprüfung] Single person dossier - clicking Ganze Klientschaft toggle`);
            try {
                await this.ganzeKlientSchaftBtnSwitch.hover({ timeout: 10000 });
                await this.ganzeKlientSchaftBtnSwitch.click({ timeout: 10000 });
            } catch (error) {
                console.error(`❌ [Bedarfsprüfung] Failed to click Ganze Klientschaft toggle:`, error instanceof Error ? error.message : String(error));
                throw new Error(`Failed to toggle Ganze Klientschaft: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    }
    async inputUnterstutzungabTxtbox(unterstutzungab: string) {
        await this.unterstutzungabTxtbox.click();
        await this.unterstutzungabTxtbox.pressSequentially(unterstutzungab);
    }
    async clickWshLeistungErfassenBtn() {
        await this.wshLeistungErfassenBtn.click();
        // await this.page.getByTestId('WshNode').waitFor({ state: 'visible' });
        await this.navigation.waitForPageReady();
    }
    async clickWshLeistungErfassenBtn1() {
        await this.wshLeistungErfassenBtn.click();
        await this.navigation.waitForSpinnerToDisappear();
        await this.stabilityHelper.closeDialog({ closeButtonSelector: "button[data-cy='close-dialog']" });
    }

    async searchDossier(familie: string) {
        await this.page.getByRole("button", { name: "Filter zurücksetzen" }).click();
        await this.page.locator("app-txt input").fill(familie);
        await this.page.waitForLoadState("domcontentloaded");
        await this.page
            .locator("tbody a")
            .filter({ hasText: `${familie}` })
            .first()
            .click();
    }
    async clickRahmenbudgetLink() {
        await this.page.waitForLoadState("domcontentloaded");
        await this.navigation.openMenuNav();

        // First try the direct RahmenbudgetRoute testid
        const rahmenbudgetRoute = this.page.getByTestId("RahmenbudgetRoute");
        try {
            await expect(rahmenbudgetRoute).toBeVisible({ timeout: 5000 });
            await rahmenbudgetRoute.click({ timeout: 3000 });
            await this.navigation.waitForPageReady();
            return;
        } catch {
            console.log("⚠️ RahmenbudgetRoute not visible, trying to expand WSH section...");
        }

        // Check if WSH section needs to be expanded first - use getByRole for more reliable matching
        const wshButton = this.page.getByTestId("WshNode");
        console.log("🔍 Looking for WSH button...");
        try {
            await expect(wshButton).toBeVisible({ timeout: 5000 });
            console.log("🔄 Expanding WSH section...");
            await wshButton.click();
            await this.page.waitForTimeout(1000);
        } catch (e) {
            console.log("⚠️ WSH button not found or not clickable:", e instanceof Error ? e.message : String(e));
        }

        // Now look for the Rahmenbudget link in the expanded sub-menu
        try {
            await expect(this.rahmenbudgetLink).toBeVisible({ timeout: 5000 });
            await this.rahmenbudgetLink.click();
            await this.navigation.waitForPageReady();
        } catch {
            // Try with testid after expansion
            await expect(rahmenbudgetRoute).toBeVisible({ timeout: 5000 });
            await rahmenbudgetRoute.click();
            await this.navigation.waitForPageReady();
        }
    }
}
