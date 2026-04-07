import { Page, Locator, expect } from "@playwright/test";
import { CommonPage } from "./common-page";
import { NavigationPage } from "./navigation-page";
import { StabilityHelper } from "@utils/stability-helper";

export class WSHPage {
    page: Page;
    private stabilityHelper: StabilityHelper;
    navigation: NavigationPage;
    clickBtnRipple: Locator;
    clickBtnHaftungSozialhilfeschuld: Locator;
    clickNeueHaftungBtn: Locator;
    clickEinseitigeSolidarhaftungBtn: Locator;
    clickBtnSchliessen: Locator;
    openHaftungVonDropDown: Locator;
    fillHaftungVon: Locator;
    fillHaftungBis: Locator;
    openHaftungFurDropDown: Locator;
    clickSozialhilfeschuldTag: Locator;
    textBoxStichdatum: Locator;
    clickBtnSozialhilfeschuldBerechnen: Locator;
    sichernBtn: Locator;
    haftungGegenseitigDropdown1st: Locator;
    haftungGegenseitigDropdown2nd: Locator;
    einzehaftungVonDropdown: Locator;
    btnNewPersonlicheRuckerstattungErfassen: Locator;
    textBoxRuckforderungTitle: Locator;
    textBoxRuckzahlungsmodus: Locator;
    textBoxRuckforderungDatum: Locator;
    textBoxRuckforderungBetrag: Locator;
    textBoxRuckzahlungMonatlicherBetrag: Locator;
    textBoxRuckforderungVerjahrung: Locator;
    textBoxRuckzahlungErstmaligab: Locator;
    textBoxRuckforderungSchuldner: Locator;
    textBoxBegrundung: Locator;
    btnDocument: Locator;
    btnRuckerstattungSpeichern: Locator;
    btnUnterstutzungsende: Locator;
    letzterUnterstutzter: Locator;
    grundNachBFS: Locator;
    cardTitle: Locator;
    btnTimeline: Locator;
    btnSpeichern: Locator;
    spic: any;
    commonPage: CommonPage;
    totalSolidarschuld: Locator;
    totalSozialhilfeschuld: Locator;
    wirtschaftlicheField: Locator;
    ruckerstattungenNavLink: Locator;
    btnRuckerstattungen: Locator;
    btnEditWeiterverrechnung: Locator;
    btnAddNewWeiterverrechnungsEinheit: Locator;
    txtBoxGultVon: Locator;
    txtBoxGultBis: Locator;
    txtBoxWeiterverrechnungsartKey: Locator;
    gultigkeitLine: Locator;
    weiterverrechnungsartLine: Locator;
    betroffenePersonLine: Locator;
    klientSelect: Locator;
    stichdatumInput: Locator;
    sozialhifeschuldBtn: Locator;
    totalSozialhilfeschuldCell: Locator;
    constructor(page: Page) {
        this.page = page;
        this.stabilityHelper = new StabilityHelper(page);
        this.navigation = new NavigationPage(page);
        this.commonPage = new CommonPage(page);
        this.wirtschaftlicheField = page.getByRole("button", {
            name: /Wirtschaftliche Sozialhilfe|Aide sociale économique/i
        });
        this.ruckerstattungenNavLink = page.getByRole("link", {
            name: /Rückerstattungen \/ Vermögensverzehr|Remboursements/i
        });
        this.clickBtnRipple = page
            .locator("app-card-header")
            .filter({ hasText: /Unterstützungseinheit WSH|Unité d'assistance ASE/i })
            .getByRole("button");
        this.clickBtnHaftungSozialhilfeschuld = page.getByRole("menuitem", {
            name: /Haftung Sozialhilfeschuld|Modifier la responsabilité de la dette/i
        });
        this.clickNeueHaftungBtn = page.getByRole("button", {
            name: /Neue Haftung Sozialhilfeschuld erfassen|Saisir une nouvelle responsabilité/i
        });
        this.clickEinseitigeSolidarhaftungBtn = page.getByRole("menuitem", {
            name: /Einseitige Solidarhaftung|Saisir une responsabilité solidaire unilatérale/i
        });
        this.clickBtnSchliessen = page.getByRole("button", { name: "Schliessen" });
        this.openHaftungVonDropDown = page.getByTestId("personInDossierId_HaftungVon").getByTestId("root-control");
        this.einzehaftungVonDropdown = page.getByTestId("personInDossierId").getByTestId("root-control").last();
        this.fillHaftungVon = page.getByTestId("validFrom").getByTestId("root-control").last();
        this.fillHaftungBis = page.getByTestId("validThrough").getByTestId("root-control").last();
        this.openHaftungFurDropDown = page.getByTestId("personInDossierId_HaftungFuer").getByTestId("root-control");
        this.clickSozialhilfeschuldTag = page.getByRole("tab", {
            name: /Sozialhilfeschuld|Dette d'aide sociale/i
        });
        this.textBoxStichdatum = page.getByTestId("stichtag").getByTestId("root-control").first();
        this.clickBtnSozialhilfeschuldBerechnen = page.getByRole("button", {
            name: /Sozialhilfeschuld berechnen|Calculer la dette d'aide sociale/i
        });
        this.sichernBtn = this.page.getByRole("button", {
            name: /Sichern|Enregistrer/i
        });
        this.haftungGegenseitigDropdown1st = page.getByTestId("personInDossierId_1").getByTestId("root-control").last();
        this.haftungGegenseitigDropdown2nd = page.getByTestId("personInDossierId_2").getByTestId("root-control").last();
        this.btnRuckerstattungen = page.getByRole("button", {
            name: /Rückerstattungen \/ Vermögensverzehr erfassen|Saisir un·e remboursements \/ imputation de la fortune/i
        });
        this.btnNewPersonlicheRuckerstattungErfassen = page
            .getByRole("menuitem", {
                name: /Persönliche Rückerstattung|Remboursement personnel/i
            })
            .first();
        //5-10
        this.textBoxRuckforderungTitle = page.getByTestId("titel").getByTestId("root-control");
        this.textBoxRuckzahlungsmodus = page.getByTestId("rueckzahlungsmodus").getByTestId("root-control");
        this.textBoxRuckforderungDatum = page.getByTestId("datumEinmalig").getByTestId("root-control");
        this.textBoxRuckforderungBetrag = page.getByTestId("betragEinmalig").getByTestId("root-control");
        this.textBoxRuckzahlungMonatlicherBetrag = page.getByTestId("rueckzahlungBetragMonatlich").getByTestId("root-control");
        this.textBoxRuckforderungVerjahrung = page.getByTestId("verjaehrung").getByTestId("root-control");
        this.textBoxRuckzahlungErstmaligab = page.getByTestId("rueckzahlungErstmaligAb").getByTestId("root-control");
        this.textBoxRuckforderungSchuldner = page.getByTestId("personInDossierId_Schuldner").getByTestId("root-control");
        this.textBoxBegrundung = page.getByTestId("begruendung").getByTestId("root-control");
        this.btnDocument = page.getByRole("button", {
            name: "Diverse Dokumente Datei hierhin ziehen oder klicken"
        });
        this.btnRuckerstattungSpeichern = page.getByRole("button", {
            name: "Rückerstattung speichern"
        });
        this.btnUnterstutzungsende = page.getByRole("menuitem", {
            name: /Unterstützungsende bearbeiten|Modifier la fin de droit/i
        });
        this.letzterUnterstutzter = page.getByTestId("date").getByTestId("root-control");
        this.grundNachBFS = page.getByTestId("reason").getByTestId("root-control");
        this.cardTitle = page.locator("div[class='card-title']").first().locator("span");
        this.btnTimeline = page.locator("app-timeline-toggle-button button");
        this.btnSpeichern = page.getByRole("button", {
            name: /Speichern|Enregistrer/i
        });
        this.totalSolidarschuld = page.locator("th").filter({ hasText: `CHF` }).nth(1);
        this.totalSozialhilfeschuld = page.locator("th").filter({ hasText: "CHF" }).last();
        this.btnEditWeiterverrechnung = page.getByRole("button", { name: /Weiterverrechnung|Refacturation/i }).getByTestId("widget-edit");
        this.btnAddNewWeiterverrechnungsEinheit = page.getByRole("button", {
            name: /Neue Weiterverrechnungs-Einheit erfassen|Saisir une nouvelle unité de refacturation/i
        });
        this.txtBoxGultVon = page.getByTestId("validFrom").getByTestId("root-control");
        this.txtBoxGultBis = page.getByTestId("validThrough").getByTestId("root-control");
        this.txtBoxWeiterverrechnungsartKey = page.getByTestId("weiterverrechnungsartKey").getByTestId("root-control");
        this.btnSpeichern = page.getByRole("button", {
            name: /Speichern|Enregistrer/i
        });
        this.gultigkeitLine = page.locator("app-readmode-field span").first();
        this.weiterverrechnungsartLine = page.getByLabel("Weiterverrechnungsart");
        this.betroffenePersonLine = page.getByLabel("Betroffene Person(en)").last();
        //
        this.klientSelect = page.getByTestId("personId").getByTestId("root-control");
        this.stichdatumInput = page.getByTestId("stichtag").getByTestId("root-control");
        this.sozialhifeschuldBtn = page.getByRole("button", {
            name: /Sozialhilfeschuld berechnen|Dette d'aide sociale/i
        });
        this.totalSozialhilfeschuldCell = page.locator("tfoot th[class*='currency-column']").last();
    }
    async selectKlient(stichDatum: string, klient: string) {
        await this.stichdatumInput.fill(stichDatum);
        await this.klientSelect.pressSequentially(klient);
        await this.page.locator(`mat-option:has-text('${klient}')`).first().click();
        await this.sozialhifeschuldBtn.click();
    }
    async validateTotalSolidarschuld(sozialHilfeSchuld: number) {
        await expect.soft(this.totalSozialhilfeschuldCell).toContainText(this.commonPage.formatNumber(sozialHilfeSchuld));
    }
    async goToWirtschaftlicheSozialhilfe() {
        // First check if the link is already visible
        const isLinkVisible = await this.ruckerstattungenNavLink.isVisible({ timeout: 3000 }).catch(() => false);

        if (isLinkVisible) {
            await this.ruckerstattungenNavLink.click();
            return;
        }

        // Link not visible - expand the WSH section first
        console.log("Rückerstattungen link not visible, expanding WSH section...");

        // Find the WSH drawer item and check if it's collapsed
        const wshDrawerItem = this.page
            .locator("app-navigation-drawer-item")
            .filter({
                has: this.page.locator('span.item-title:has-text("Wirtschaftliche Sozialhilfe")')
            })
            .first();

        // Try multiple strategies to expand the WSH section
        const expandStrategies = [
            // Strategy 1: Click the expand/collapse button within the WSH drawer item
            async () => {
                const expandBtn = wshDrawerItem.locator('button[aria-expanded="false"]').first();
                if (await expandBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await expandBtn.click();
                    await this.page.waitForTimeout(500);
                    return true;
                }
                return false;
            },
            // Strategy 2: Click the WSH drawer item itself (the text/label area)
            async () => {
                const wshLabel = this.page
                    .locator("app-navigation-drawer-item span.item-title")
                    .filter({
                        hasText: /^Wirtschaftliche Sozialhilfe$/i
                    })
                    .first();
                if (await wshLabel.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await wshLabel.click();
                    await this.page.waitForTimeout(500);
                    return true;
                }
                return false;
            },
            // Strategy 3: Use getByRole button with the WSH name
            async () => {
                const wshButton = this.page.getByRole("button", { name: /Wirtschaftliche Sozialhilfe/i }).first();
                if (await wshButton.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await wshButton.click();
                    await this.page.waitForTimeout(500);
                    return true;
                }
                return false;
            },
            // Strategy 4: Click the "expand all" button via navigation helper
            async () => {
                const expandAllBtn = this.page.locator("app-navigation-drawer-item[class*='navigation-tree-actions'] button").first();
                if (await expandAllBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await expandAllBtn.click();
                    await this.page.waitForTimeout(1000);
                    return true;
                }
                return false;
            }
        ];

        for (const strategy of expandStrategies) {
            try {
                const success = await strategy();
                if (success) {
                    // Check if the link is now visible
                    const linkNowVisible = await this.ruckerstattungenNavLink.isVisible({ timeout: 2000 }).catch(() => false);
                    if (linkNowVisible) {
                        break;
                    }
                }
            } catch {
                // Strategy failed, try next one
            }
        }

        // Final wait and click
        await this.ruckerstattungenNavLink.waitFor({ state: "visible", timeout: 15000 });
        await this.ruckerstattungenNavLink.click();
    }
    //edit unterstutzungsende
    async editUnterstutzungsende(date: string, grund: string) {
        await this.clickBtnRipple.click();
        await this.btnUnterstutzungsende.click();

        // Fill date with blur to mark form as dirty
        await this.stabilityHelper.stableFill(this.letzterUnterstutzter, date, { triggerBlur: true });

        // Select reason with change detection
        await this.stabilityHelper.stableSelectOption(this.grundNachBFS, grund, { triggerChangeDetection: true });

        // Click save with change detection
        await this.stabilityHelper.stableClick(this.btnSpeichern, {
            triggerChangeDetection: true,
            waitForEnabled: 10000
        });
        await this.navigation.waitForPageReady();
    }
    // check date in ubersicht
    async validateLetzterUnterstutzter(date: string) {
        await expect.soft(this.cardTitle).toContainText(date);
    }
    // check if timeline unterstut is visible
    async checkTimelineUnterstutzung() {
        await this.btnTimeline.click();
        await expect.soft(this.page.locator("app-timeline a:has-text('Unterstützungsende'),app-timeline a:has-text('Fin de droit')")).toBeVisible();
    }

    async addHaftungSozialhilfeschuldBearbeiten(haftungsType: string, haftungDurch: string, haftungVon: string, haftungBis: string, haftungFuer: string, person1: string, person2: string) {
        await this.clickBtnRipple.click();
        await this.clickBtnHaftungSozialhilfeschuld.click();
        await this.clickNeueHaftungBtn.click();
        switch (haftungsType) {
            case "Einzelhaftung erfassen":
                await this.page
                    .getByRole("menuitem", {
                        name: /Einzelhaftung erfassen|Saisir une responsabilité individuelle/i
                    })
                    .click();
                await this.inputEinzelhafungInfo(haftungDurch, haftungVon, haftungBis);
                await this.page.locator("app-default-dialog").waitFor({ state: "detached" });
                break;
            case "Saisir une responsabilité individuelle":
                await this.page
                    .getByRole("menuitem", {
                        name: /Einzelhaftung erfassen|Saisir une responsabilité individuelle/i
                    })
                    .click();
                await this.inputEinzelhafungInfo(haftungDurch, haftungVon, haftungBis);
                await this.page.locator("app-default-dialog").waitFor({ state: "detached" });
                break;
            case "Einseitige Solidarhaftung erfassen":
                await this.page
                    .getByRole("menuitem", {
                        name: /Einseitige Solidarhaftung erfassen|Saisir une responsabilité solidaire unilatérale/i
                    })
                    .click();
                await this.inputEinseitigeSolidarhaftung(haftungDurch, haftungVon, haftungBis, haftungFuer);
                await this.page.locator("app-default-dialog").waitFor({ state: "detached" });
                break;
            case "Saisir une responsabilité solidaire unilatérale":
                await this.page
                    .getByRole("menuitem", {
                        name: /Einseitige Solidarhaftung erfassen|Saisir une responsabilité solidaire unilatérale/i
                    })
                    .click();
                await this.inputEinseitigeSolidarhaftung(haftungDurch, haftungVon, haftungBis, haftungFuer);
                await this.page.locator("app-default-dialog").waitFor({ state: "detached" });
                break;
            case "Gegenseitige Solidarhaftung erfassen":
                await this.page
                    .getByRole("menuitem", {
                        name: /Gegenseitige Solidarhaftung erfassen|Saisir une responsabilité solidaire mutuelle/i
                    })
                    .click();
                await this.inputGegenseitigeSolidarhaftungInfo(person1, person2, haftungVon, haftungBis);
                await this.page.locator("app-default-dialog").waitFor({ state: "detached" });
                break;
            case "Saisir une responsabilité solidaire mutuelle":
                await this.page
                    .getByRole("menuitem", {
                        name: /Gegenseitige Solidarhaftung erfassen|Saisir une responsabilité solidaire mutuelle/i
                    })
                    .click();
                await this.inputGegenseitigeSolidarhaftungInfo(person1, person2, haftungVon, haftungBis);
                await this.page.locator("app-default-dialog").waitFor({ state: "detached" });
                break;
            default:
                throw new Error(`Invalid haftungsType: ${haftungsType}`);
        }
    }
    async validateUbersicht() {}
    async inputEinzelhafungInfo(haftungDurch: string, haftungVon: string, haftungBis: string) {
        // Scope all locators to the Einzelhaftung card to avoid conflicts with other haftung types
        const haftungCard = this.page.locator("app-haftung-sozialhilfeschuld-card[typ='Einzelhaftung']");

        // Select person using fill + click option pattern (autocomplete field)
        const haftungVonInput = haftungCard.getByTestId("personInDossierId").getByTestId("root-control");
        await haftungVonInput.click();
        await this.page.waitForTimeout(300);
        await haftungVonInput.fill(haftungDurch);
        await this.page.waitForTimeout(300);
        const haftungVonOption = this.page.getByRole("option", { name: haftungDurch });
        await haftungVonOption.waitFor({ state: "visible", timeout: 5000 });
        await haftungVonOption.click();
        await this.page.waitForTimeout(200);

        // Fill dates with blur to mark form as dirty
        await this.stabilityHelper.stableFill(haftungCard.getByTestId("validFrom").getByTestId("root-control").last(), haftungVon, { triggerBlur: true });
        await this.stabilityHelper.stableFill(haftungCard.getByTestId("validThrough").getByTestId("root-control").last(), haftungBis, { triggerBlur: true });

        // Click save with change detection
        await this.stabilityHelper.stableClick(this.sichernBtn, {
            triggerChangeDetection: true,
            waitForEnabled: 10000
        });
    }
    async inputEinseitigeSolidarhaftung(haftungDurch: string, haftungVon: string, haftungBis: string, haftungFuer: string) {
        const haftungCard = this.page.locator("app-haftung-sozialhilfeschuld-card[typ='SolidarhaftungEinseitig']");

        // Select "Haftung für" person - use fill + click option pattern for autocomplete
        const haftungFuerInput = haftungCard.getByTestId("personInDossierId_HaftungFuer").getByTestId("root-control").last();
        await haftungFuerInput.click();
        await this.page.waitForTimeout(300);
        await haftungFuerInput.fill(haftungFuer);
        await this.page.waitForTimeout(300);
        const haftungFuerOption = this.page.getByRole("option", { name: haftungFuer });
        await haftungFuerOption.waitFor({ state: "visible", timeout: 5000 });
        await haftungFuerOption.click();
        await this.page.waitForTimeout(200);

        // Select "Haftung von" person - use fill + click option pattern for autocomplete
        const haftungVonInput = haftungCard.getByTestId("personInDossierId_HaftungVon").getByTestId("root-control").last();
        await haftungVonInput.click();
        await this.page.waitForTimeout(300);
        await haftungVonInput.fill(haftungDurch);
        await this.page.waitForTimeout(300);
        const haftungVonOption = this.page.getByRole("option", { name: haftungDurch });
        await haftungVonOption.waitFor({ state: "visible", timeout: 5000 });
        await haftungVonOption.click();
        await this.page.waitForTimeout(200);

        // Fill dates with blur
        await this.stabilityHelper.stableFill(haftungCard.getByTestId("validFrom").getByTestId("root-control").last(), haftungVon, { triggerBlur: true });
        await this.stabilityHelper.stableFill(haftungCard.getByTestId("validThrough").getByTestId("root-control").last(), haftungBis, { triggerBlur: true });

        // Click save with change detection
        await this.stabilityHelper.stableClick(this.sichernBtn, {
            triggerChangeDetection: true,
            waitForEnabled: 10000
        });
    }

    async inputGegenseitigeSolidarhaftungInfo(person1: string, person2: string, haftungVon: string, haftungBis: string) {
        // Fill and select person 1
        await this.stabilityHelper.stableFill(this.haftungGegenseitigDropdown1st, person1, { triggerBlur: false });
        await this.page.getByRole("option", { name: `${person1}` }).click();

        // Fill and select person 2
        await this.stabilityHelper.stableFill(this.haftungGegenseitigDropdown2nd, person2, { triggerBlur: false });
        await this.page.getByRole("option", { name: `${person2}` }).click();

        // Fill dates with blur
        const haftungCard = this.page.locator("app-haftung-sozialhilfeschuld-card[typ='SolidarhaftungGegenseitig']");
        await this.stabilityHelper.stableFill(haftungCard.locator("app-date-picker[formcontrolname='validFrom'] input").last(), haftungVon, { triggerBlur: true });
        await this.stabilityHelper.stableFill(haftungCard.locator("app-date-picker[formcontrolname='validThrough'] input").last(), haftungBis, { triggerBlur: true });

        // Click save with change detection
        await this.stabilityHelper.stableClick(this.sichernBtn, {
            triggerChangeDetection: true,
            waitForEnabled: 10000
        });
    }

    async fillInfo(HaftungDurch: string, HaftungVon: string, HaftungBis: string, HaftungFuer: string) {
        await this.openHaftungVonDropDown.last().click();
        await this.page.getByRole("option", { name: `${HaftungDurch}` }).click();
        await this.fillHaftungVon.last().fill(`${HaftungVon}`);
        await this.fillHaftungBis.last().fill(`${HaftungBis}`);
        await this.openHaftungFurDropDown.last().click();
        await this.page.getByRole("option", { name: `${HaftungFuer}` }).click();
    }

    async openSozialhilfeschuldPage() {
        await this.clickSozialhilfeschuldTag.click();
    }
    async fillBisValutaDatum(BisValutaDatum: string) {
        await this.textBoxStichdatum.fill(`${BisValutaDatum}`);
    }

    async BtnSozialhilfeschuldBerechnen() {
        await this.clickBtnSozialhilfeschuldBerechnen.click();
    }
    async checkTotalSolidarschuld(solidarSchuld: string, sozialHilfeSchuld: string) {
        let num1: number = Number(solidarSchuld);
        let num2: number = Number(sozialHilfeSchuld);
        let formattedNumber1_1 = this.commonPage.formatNumber_Ger(num1);
        let formattedNumber1_2 = this.commonPage.formatNumber_Fre(num1);
        let formattedNumber2_1 = this.commonPage.formatNumber_Ger(num2);
        let formattedNumber2_2 = this.commonPage.formatNumber_Fre(num2);
        const regex1 = new RegExp(`(${formattedNumber1_1}|${formattedNumber1_2})`, "i");
        const regex2 = new RegExp(`(${formattedNumber2_1}|${formattedNumber2_2})`, "i");
        await expect.soft(this.totalSolidarschuld).toContainText(regex1);
        await expect.soft(this.totalSozialhilfeschuld).toContainText(regex2);
    }
    async checkTotalSolidarschuldExisted(person: string, einzelSchuld: number, solidarSchuld: number, sozialHilfeSchuld: number) {
        const klient = this.page.locator(`tr:has-text('${person}')`);
        await expect(klient).toBeVisible();
        await expect(klient.locator("td[class*='currency-column']").first()).toContainText(this.commonPage.formatNumber(einzelSchuld));
        await expect(klient.locator("td[class*='currency-column']").nth(1)).toContainText(this.commonPage.formatNumber(solidarSchuld));
        await expect(klient.locator("td[class*='currency-column']").last()).toContainText(this.commonPage.formatNumber(sozialHilfeSchuld));
    }
    async addNewPersonlicheRuckerstattungErfassen() {
        await this.btnRuckerstattungen.click();
        await this.stabilityHelper.stableClick(this.btnNewPersonlicheRuckerstattungErfassen);
        await this.navigation.waitForPageReady();
    }

    async fillInfoPersonlicheRuckerstattungErfassen(titel: string, rueckModus: string, datum: string, verJahrung: string, betrag: number, schuldner: string, monatlicherBetrag: number, erstmalig: string, dateiPfad: string, begruendung: string) {
        // Select Rückzahlungsmodus
        await this.stabilityHelper.stableSelectOption(this.textBoxRuckzahlungsmodus, rueckModus, { triggerChangeDetection: true });

        // Fill form fields with blur to mark form as dirty
        await this.stabilityHelper.stableFill(this.textBoxRuckforderungDatum, datum, { triggerBlur: true });
        await this.stabilityHelper.stableFill(this.textBoxRuckforderungBetrag, String(betrag), { triggerBlur: true });
        await this.stabilityHelper.stableFill(this.textBoxRuckforderungTitle, titel, { triggerBlur: true });
        await this.stabilityHelper.stableFill(this.textBoxRuckzahlungMonatlicherBetrag, String(monatlicherBetrag), { triggerBlur: true });
        await this.stabilityHelper.stableFill(this.textBoxRuckforderungVerjahrung, verJahrung, { triggerBlur: true });
        await this.stabilityHelper.stableFill(this.textBoxRuckzahlungErstmaligab, erstmalig, { triggerBlur: true });

        // Select Schuldner (autocomplete field - click to open, then select option)
        await this.textBoxRuckforderungSchuldner.click();
        await this.page.waitForTimeout(300);
        await this.page.locator(`mat-option:has-text("${schuldner}")`).first().click();
        await this.page.waitForTimeout(200);

        // Fill Begründung
        await this.stabilityHelper.stableFill(this.textBoxBegrundung, begruendung, { triggerBlur: true });

        // Upload document if provided
        if (dateiPfad !== "") {
            const fileChooserPromise = this.page.waitForEvent("filechooser");
            await this.btnDocument.click();
            const fileChooser = await fileChooserPromise;
            await fileChooser.setFiles(`${dateiPfad}`);
        }

        // Click save with change detection
        await this.stabilityHelper.stableClick(this.btnRuckerstattungSpeichern, {
            triggerChangeDetection: true,
            waitForEnabled: 10000
        });
    }

    async checkTotalAtTheEnd(title: string, datum: string, betrag: string) {
        function formatNumber(num: number): string {
            let numStr = num.toFixed(2);
            let parts = numStr.split(".");
            let integerPart = parts[0];
            let decimalPart = parts[1];
            let formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, "’");
            return `${formattedIntegerPart}.${decimalPart}`;
        }
        function formatNumber_Fre(num: number): string {
            let numStr = num.toFixed(2);
            let parts = numStr.split(".");
            let integerPart = parts[0];
            let decimalPart = parts[1];
            let formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            return `${formattedIntegerPart}.${decimalPart}`;
        }
        let num: number = Number(betrag);
        let formattedNumber = formatNumber(num);
        let formattedNumber_Fre = formatNumber_Fre(num);
        await expect
            .soft(
                this.page
                    .getByRole("cell", {
                        name: new RegExp(`CHF ${formattedNumber}|${formattedNumber_Fre} CHF`)
                    })
                    .last()
            )
            .toBeVisible();
    }
    async openUnterstutzungBeenden() {
        await this.page
            .locator("app-card-header")
            .filter({
                hasText: /Unterstützungseinheit WSH|Unité d\'assistance ASE Depuis/i
            })
            .getByRole("button")
            .click();
        await this.page
            .getByRole("menuitem", {
                name: /Unterstützung beenden|Arrêter le droit/i
            })
            .click();
    }
    async fillValueUnterstuetzung(letzerMonat: string, grundBFS: string) {
        // Use stableFill with blur to mark form as dirty
        await this.stabilityHelper.stableFill(this.page.getByTestId("date").getByTestId("root-control"), letzerMonat, { triggerBlur: true });

        // Select reason with change detection
        await this.stabilityHelper.stableSelectOption(this.page.getByTestId("reason").getByTestId("root-control"), grundBFS, { triggerChangeDetection: true });

        // Click submit with change detection to ensure form is marked as dirty
        await this.stabilityHelper.stableClick(this.page.getByTestId("submitForm"), { triggerChangeDetection: true, waitForEnabled: 10000 });
    }

    async checkDateString(letzerMonat: string) {
        await expect.soft(this.page.locator("app-card-header").first()).toContainText(`${letzerMonat}`);
    }

    async checkTimeLineUnterstuetzung() {
        await this.btnTimeline.click();
        await this.page.getByRole("link", { name: "Unterstützungsende" }).hover();
    }
    async editWeiterverrechnung() {
        await this.navigation.waitForPageReady();
        await this.navigation.closeBlockingDialog();

        const weiterverrechnungSection = this.page.getByRole("button", {
            name: /Weiterverrechnung|Refacturation/i
        });

        await weiterverrechnungSection.scrollIntoViewIfNeeded({ timeout: 10000 }).catch(() => {});
        await this.page.waitForTimeout(500);

        const widgetEditBtn = this.page.getByTestId("WeiterverrechnungWidget").getByTestId("activateEditMode");
        const isWidgetEditVisible = await widgetEditBtn.isVisible({ timeout: 3000 }).catch(() => false);

        if (isWidgetEditVisible) {
            await this.stabilityHelper.stableClick(widgetEditBtn, { timeout: 15000, waitAfter: 500 });
        } else {
            await this.stabilityHelper.stableClick(weiterverrechnungSection, { timeout: 15000, waitAfter: 500 });
        }

        await this.navigation.waitForPageReady();

        // Check if button is visible, retry click if not (CI timing issue)
        const isButtonVisible = await this.btnAddNewWeiterverrechnungsEinheit.isVisible({ timeout: 5000 }).catch(() => false);

        if (!isButtonVisible) {
            // Retry: click section again
            if (isWidgetEditVisible) {
                await this.stabilityHelper.stableClick(widgetEditBtn, { timeout: 15000, waitAfter: 500 });
            } else {
                await this.stabilityHelper.stableClick(weiterverrechnungSection, { timeout: 15000, waitAfter: 500 });
            }
            await this.navigation.waitForPageReady();
        }

        await this.btnAddNewWeiterverrechnungsEinheit.waitFor({ state: "visible", timeout: 30000 });
        await this.stabilityHelper.stableClick(this.btnAddNewWeiterverrechnungsEinheit, { timeout: 15000, waitAfter: 500 });
    }
    async fillValueWeiterverrechnung(gultVon: string, gultBis: string, weiterVerRechnArt: string, betrPerson: string) {
        // Fill dates with blur to mark form as dirty
        await this.stabilityHelper.stableFill(this.txtBoxGultVon.last(), gultVon, { triggerBlur: true });
        await this.stabilityHelper.stableFill(this.txtBoxGultBis.last(), gultBis, { triggerBlur: true });

        // Select Weiterverrechnungsart
        await this.stabilityHelper.stableSelectOption(this.txtBoxWeiterverrechnungsartKey.last(), weiterVerRechnArt, { triggerChangeDetection: true });

        // Toggle person switch using robust locator (pattern from ph-page.ts)
        const personSwitch = this.page.getByTestId("personInDossierIds").locator("app-card").filter({ hasText: betrPerson }).getByRole("switch");

        await personSwitch.waitFor({ state: "visible", timeout: 10000 });
        await personSwitch.click();

        // Wait for form validation after switch toggle
        await this.page.waitForTimeout(500);

        // Click save with change detection
        await this.stabilityHelper.stableClick(this.btnSpeichern.last(), {
            triggerChangeDetection: true,
            waitForEnabled: 10000
        });
        await this.navigation.waitForPageReady();
    }
    async checkTotalEnd(gultBis: string, weiterVerRechnArt: string, betrPerson: string) {
        let betrPersonTrim = betrPerson.replace(/\(.*?\)/g, "").trim();
        await expect.soft(this.gultigkeitLine.filter({ hasText: `${gultBis}` })).toBeVisible();
        await expect.soft(this.weiterverrechnungsartLine).toHaveText(weiterVerRechnArt);
        await expect.soft(this.betroffenePersonLine).toHaveText(betrPersonTrim);
    }
}
