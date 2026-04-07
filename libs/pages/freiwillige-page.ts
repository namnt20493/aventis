import { Page, Locator, expect } from "@playwright/test";
import { NavigationPage } from "./navigation-page";
import { CommonPage } from "./common-page";
import { StabilityHelper } from "@utils/stability-helper";

export class FreiwilligePage {
    page: Page;
    private stabilityHelper: StabilityHelper;
    navigation: NavigationPage;
    common: CommonPage;
    budgetNavlink: Locator;
    btnNeusPosition: Locator;
    kontoSelect: Locator;
    beschreibungInput: Locator;
    betragMonatlichInput: Locator;
    geplantAbInput: Locator;
    zalungsMethodeRadioGroup: Locator;
    zalungsempfangerRadioGroup: Locator;
    zahlungsinformationSelect: Locator;
    periodzitatSelect: Locator;
    referenznummerInput: Locator;
    mitteilungInput: Locator;
    btnErfassenUndSchliessen: Locator;
    freiwilligeField: Locator;
    geplantBisInput: Locator;
    headerCollumnSelect: Locator;
    checkbox: Locator;
    rowTotal: Locator;
    zahlungzenNavLink: Locator;
    checkboxAll: Locator;
    ausgewahltePositionTotal: Locator;
    saldovorschauTotal: Locator;
    btnAuswahlFreigeben: Locator;
    zahlungsempfangerInput: Locator;
    btnTimeline: Locator;
    constructor(page: Page) {
        this.page = page;
        this.stabilityHelper = new StabilityHelper(page);
        this.navigation = new NavigationPage(page);
        this.common = new CommonPage(page);
        this.freiwilligeField = page.locator("app-navigation-tree-group").filter({
            hasText: /Freiwillige Einkommensverwaltung|Gestion volontaire des revenus/i
        });
        this.budgetNavlink = this.freiwilligeField.getByRole("link", { name: /Budget/i });
        this.btnNeusPosition = page.getByRole("button", {
            name: /Neue Position|Nouvelle position/i
        });
        this.kontoSelect = page.getByTestId("kontoId").getByTestId("root-control");
        this.beschreibungInput = page.getByTestId("beschreibung").getByTestId("root-control");
        this.betragMonatlichInput = page.getByTestId("betragMonatlich").getByTestId("root-control");
        this.geplantAbInput = page.getByTestId("validFrom").getByTestId("root-control");
        this.geplantBisInput = page.getByTestId("validThrough").getByTestId("root-control");
        this.zalungsMethodeRadioGroup = page.getByTestId("zahlungsmethode");
        this.zalungsempfangerRadioGroup = page.getByTestId("empfaengerKategorie");
        this.zahlungsinformationSelect = page.getByTestId("zahlungsverbindungId").getByTestId("root-control");
        this.periodzitatSelect = page.getByTestId("periodizitaet").getByTestId("root-control");
        this.referenznummerInput = page.getByTestId("referenznummer").getByTestId("root-control");
        this.mitteilungInput = page.getByTestId("mitteilung").getByTestId("root-control");
        this.btnErfassenUndSchliessen = page.getByRole("button", {
            name: /Erfassen und schliessen|Ajouter et fermer/i
        });
        this.headerCollumnSelect = page.getByTestId("rahmenbudget-dialog-button");
        this.checkbox = page.getByTestId("rahmenbudget-dialog").locator("mat-checkbox input");
        this.rowTotal = page.locator("tr").filter({
            hasText: /Differenz (Einnahmen - Ausgaben)|Différence (recettes - dépenses)/i
        });
        this.zahlungzenNavLink = this.page.getByTestId("ZahlungenInDossierFreigebenFevRoute");
        this.checkboxAll = this.page.locator("thead mat-checkbox input");
        this.ausgewahltePositionTotal = this.page
            .locator(`div`)
            .filter({ hasText: /Ausgewählte Positionen|Positions sélectionnées/i })
            .locator(`+ div`);
        this.saldovorschauTotal = this.page
            .locator(`div`)
            .filter({ hasText: /Saldovorschau|Aperçu du solde/i })
            .locator(`+ div`);
        this.btnAuswahlFreigeben = this.page.getByRole("button", {
            name: /Auswahl freigeben|Libérer la sélection/i
        });
        this.zahlungsempfangerInput = this.page.getByTestId("institutionId_Empfaenger").getByTestId("root-control");
        this.btnTimeline = this.page.locator("app-timeline-toggle-button button");
    }
    //go to Zahlungen page
    async goToZahlungenLink() {
        await this.navigation.openMenuNav();

        // Check if link is already visible
        let linkVisible = await this.zahlungzenNavLink.isVisible().catch(() => false);

        if (!linkVisible) {
            // Link not visible - need to expand FEV group
            console.log("🔄 [FEV] Expanding FEV group to reveal Zahlungen link...");

            // Use FevNode testId to find the FEV group button
            const fevNode = this.page.getByTestId("FevNode");
            const fevNodeExists = await fevNode.count();

            if (fevNodeExists > 0) {
                // Click FEV node to expand it
                await fevNode.click();
                await this.page.waitForTimeout(1000); // Wait for expansion

                // Check again for the testId-based link
                linkVisible = await this.zahlungzenNavLink.isVisible().catch(() => false);

                if (!linkVisible) {
                    // Try finding by text if testId doesn't work
                    console.log("⚠️ [FEV] testId 'ZahlungenInDossierFreigebenFevRoute' not found, trying by text...");

                    const fevSection = this.page.locator("app-navigation-tree-group").filter({
                        hasText: /Freiwillige Einkommensverwaltung|Gestion volontaire des revenus/i
                    });

                    const zahlungenByText = fevSection.getByRole("link", {
                        name: /Zahlungen|Paiements/i
                    });

                    const zahlungenByTextExists = await zahlungenByText.count();

                    if (zahlungenByTextExists > 0) {
                        console.log("✅ [FEV] Found Zahlungen link by text");
                        await zahlungenByText.click();
                        await this.navigation.waitForPageReady();
                        return;
                    }

                    // Log available links for debugging
                    const allLinks = await fevSection
                        .getByRole("link")
                        .allTextContents()
                        .catch(() => []);
                    console.error(`❌ [FEV] Available links in FEV section:`, allLinks);
                    throw new Error(`Cannot find Zahlungen link in FEV section. Available links: ${allLinks.join(", ")}`);
                }
            } else {
                throw new Error("Cannot find FEV node (testId: FevNode) in navigation. FEV may not have been created successfully.");
            }
        }

        console.log("✅ [FEV] Found Zahlungen link, clicking...");
        await this.zahlungzenNavLink.click();
        await this.navigation.waitForPageReady();
    }

    //check checkbox if needed
    async clickCheckbox() {
        if (!(await this.checkboxAll.isChecked())) {
            await this.checkboxAll.click();
        }
    }
    async clickAuswahlFreigeben(ausgewaehltePosSum: string, saldoVorschau: string, clickAuswahlFreigeben: string) {
        await expect
            .soft(this.ausgewahltePositionTotal, {
                message: `Ausgewählte Positionen total should be "${ausgewaehltePosSum}"`
            })
            .toContainText(ausgewaehltePosSum, { timeout: 7000 });
        await expect
            .soft(this.saldovorschauTotal, {
                message: `Saldovorschau total should be "${saldoVorschau}"`
            })
            .toContainText(saldoVorschau, { timeout: 7000 });
        if (clickAuswahlFreigeben === "ok") {
            await expect
                .soft(this.btnAuswahlFreigeben, {
                    message: "Auswahl freigeben button should be enabled"
                })
                .toBeEnabled({ timeout: 5000 });
            // await this.btnAuswahlFreigeben.click();
        } else {
            await expect
                .soft(this.btnAuswahlFreigeben, {
                    message: "Auswahl freigeben button should be disabled"
                })
                .toBeDisabled({ timeout: 5000 });
        }
    }

    //select header comllumn
    async selectHeader() {
        await this.headerCollumnSelect.click();
        for (let i = 0; i < (await this.checkbox.count()); i++) {
            const checkbox = this.checkbox.nth(i);
            if (!(await checkbox.isChecked())) {
                await checkbox.check();
                await this.headerCollumnSelect.click();
            }
        }
        await this.page.keyboard.press("Escape");
    }

    //validate row
    async validateBudget(beschreibung: string, zahlEmpf: string, zahlMeth: string, konto: string, gueltigkeit: string, zahlVerbinudung: string, periode: string, betrag: number, total: number) {
        let tr = this.page.locator(`tbody tr`);
        let zahlEmpftext = this.common.convertString(zahlVerbinudung);
        console.log(zahlEmpftext);
        let combinedText = `${beschreibung} ${zahlEmpf} ${zahlMeth} ${konto} ${this.common.modifyDate(gueltigkeit)}  ${periode}`.trim();
        //${this.common.convertString(zahlVerbinudung)}
        if (combinedText) {
            tr = tr.filter({
                hasText: new RegExp(
                    combinedText
                        .split(" ")
                        .map((text) => `(?=.*${text})`)
                        .join(""),
                    "i"
                )
            });
            await expect.soft(tr.filter({ hasText: `${zahlEmpftext}` })).toBeVisible();
        }
        const regExBetrag = this.common.formatNumber(betrag);
        await expect.soft(tr.locator("td[class*='column-BetragProMonat']").first()).toContainText(regExBetrag);

        const regExTotal = this.common.formatNumber(total);
        await expect.soft(this.page.locator("th[class*='currency-column']")).toContainText(regExTotal);
    }

    //go to budget page
    async goToBudgetLink() {
        await this.navigation.openMenuNav();
        await this.freiwilligeField.waitFor({ state: "visible", timeout: 5000 });

        // Get the FEV Budget link href and navigate directly
        const fevBudgetLink = this.freiwilligeField.getByRole("link", { name: /Budget/i });
        await fevBudgetLink.waitFor({ state: "visible", timeout: 5000 });
        const href = await fevBudgetLink.getAttribute("href");

        if (href) {
            await this.page.goto(href);
        } else {
            await fevBudgetLink.click();
        }

        await this.navigation.waitForPageReady();
        await this.page.waitForURL(/\/fev\/.*\/budget/, { timeout: 10000 });
    }

    // create new position
    async createNewPosition(konto: string, beschreibung: string, betragMonatlich: number, geplantAb: string, geplantBis: string, zahlMethode: string, zahlungsEmpfang: string, zahlungsVerbindung: string, periode: string, referenzScor: string, mitteilung: string) {
        await this.btnNeusPosition.click();
        // await this.common.waitForApiHelper(this.page, 'BudgetFevQuery',async () => {});
        await this.kontoSelect.fill(konto);
        await expect(this.page.locator(`mat-option:has-text("${konto}")`).first(), {
            message: "is there any option to select ?"
        }).toBeVisible();
        await this.page.locator(`mat-option:visible`).first().click();
        await this.beschreibungInput.fill(beschreibung);
        await this.betragMonatlichInput.fill(betragMonatlich.toString());
        await this.geplantAbInput.fill(geplantAb);
        await this.geplantBisInput.fill(geplantBis);
        await this.zalungsMethodeRadioGroup.locator(`mat-radio-button:has-text('${zahlMethode}') input`).click();
        if (zahlungsEmpfang === "Klientschaft") {
            await this.zalungsempfangerRadioGroup.locator(`mat-radio-button:has-text('${this.common.getTextBeforeComma(zahlungsEmpfang)}') input`).click();
        } else {
            await this.zalungsempfangerRadioGroup.locator(`mat-radio-button:has-text('Dritte') input`).click();
            await this.zahlungsempfangerInput.fill(this.common.getTextBeforeComma(zahlungsEmpfang));
            await this.page
                .locator(`mat-option:has-text('${this.common.getTextBeforeComma(zahlungsEmpfang)}')`)
                .first()
                .click();
        }
        await this.periodzitatSelect.click();
        await this.page.locator(`mat-option:has-text('${periode}')`).last().click();
        await this.zahlungsinformationSelect.first().click({ delay: 1000 });
        const zahlungsOption = this.page.getByRole("option").filter({ hasText: zahlungsVerbindung });
        await expect(zahlungsOption).toBeVisible();
        await zahlungsOption.click();
        await this.referenznummerInput.fill(referenzScor);
        await this.mitteilungInput.fill(mitteilung);
        await this.btnErfassenUndSchliessen.click();
        await this.navigation.waitForPageReady();
    }

    // check value of new position
    async validateValue(beschreibung: string, betragMonatlich: number, geplantAb: string) {
        await this.btnTimeline.click();
        await this.page.waitForTimeout(500);

        // Try multiple strategies to click on the timeline date entry
        const strategies = [
            // Strategy 1: Original - div.date-caption followed by anchor (QA structure)
            () => this.page.locator(`div[class*='date-caption']:has-text('${geplantAb}') + a`),
            // Strategy 2: Click on the date-caption div itself
            () => this.page.locator(`div[class*='date-caption']:has-text('${geplantAb}')`),
            // Strategy 3: Find mat-expansion-panel-header containing the date
            () => this.page.locator(`mat-expansion-panel-header:has-text('${geplantAb}')`),
            // Strategy 4: Find any clickable element in timeline row with the date
            () => this.page.locator(`[class*='timeline'] >> text='${geplantAb}'`).locator("..").locator("a, button").first(),
            // Strategy 5: Find timeline entry by date text and click parent row
            () => this.page.locator(`mat-list-item:has-text('${geplantAb}'), div[class*='timeline-entry']:has-text('${geplantAb}')`)
        ];

        let clicked = false;
        for (let i = 0; i < strategies.length; i++) {
            const locator = strategies[i]();
            const count = await locator.count().catch(() => 0);
            if (count > 0) {
                const isVisible = await locator
                    .first()
                    .isVisible()
                    .catch(() => false);
                if (isVisible) {
                    console.log(`✅ [Timeline] Using strategy ${i + 1} for date '${geplantAb}'`);
                    await locator.first().click();
                    clicked = true;
                    break;
                }
            }
        }

        if (!clicked) {
            console.log(`⚠️ [Timeline] No strategy worked for date '${geplantAb}', continuing with validation...`);
        }

        await this.page.waitForTimeout(500);
        const betrag = this.common.normalizeNumber(betragMonatlich);
        const betragFr = this.common.normalizeNumberFR(betragMonatlich);
        const regEx = new RegExp(`${betrag}|${betragFr}`, "i");
        await expect.soft(this.page.locator(`tbody tr:has-text('${beschreibung}')`).first()).toBeVisible();
        await expect.soft(this.page.locator(`tbody tr:has-text('${beschreibung}')`).first().locator("td[class*='currency-column']")).toContainText(regEx);
    }
}
