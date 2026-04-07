import { Page, Locator, expect } from "@playwright/test";
import { NavigationPage } from "./navigation-page";
import { CommonPage } from "./common-page";
import { StabilityHelper } from "@utils/stability-helper";

// Timing multiplier for different execution speeds (same as StabilityHelper)
const isSlowMode = process.env.SLOW_MODE === "true";
const isFastMode = process.env.FAST_MODE === "true" || process.env.CI === "true";
const TIMING_MULTIPLIER = isSlowMode ? 2.5 : isFastMode ? 0.7 : 1.0;

export class AufgabenPage {
    private dokumentHref: string | null = null;
    page: Page;
    private stabilityHelper: StabilityHelper;
    aufgabenNavlink: Locator;
    nichtBegonnenAufgabeErfassenBtn: Locator;
    filterZurucksetzenBtn: Locator;
    zugewieseneComboBox: Locator;
    newAufgabenTitel: Locator;
    newZugewiesene: Locator;
    newStatus: Locator;
    newPrioritate: Locator;
    newStartDatum: Locator;
    newFaelligkeitDatum: Locator;
    newNotizenHinzufugen: Locator;
    aufgabeChecklist: Locator;
    checklistTxtbox: Locator;
    verknupfungHinzufugenBtn: Locator;
    urlTxtbox: Locator;
    linkHinzufugenBtn: Locator;
    speichernUndSchliessenBtn: Locator;
    anderungsprotokollItem: Locator;
    schhliessenBtn: Locator;
    nichBegonnenField: Locator;
    inArbeitField: Locator;
    erledigtField: Locator;
    navigationPage: NavigationPage;
    dossierSearchTxtbox: Locator;
    zugewieseneSearchComboBox: Locator;
    erstellDurchSearchComboBox: Locator;
    statusSearchComboBox: Locator;
    abbrechenBtn: Locator;
    anzuzeigenderTxtbox: Locator;
    commonPage: CommonPage;
    aufgabenInDossierNavlink: Locator;
    constructor(page: Page) {
        this.page = page;
        this.stabilityHelper = new StabilityHelper(page);
        this.aufgabenInDossierNavlink = page.getByTestId("AufgabenInDossierRoute");
        this.aufgabenNavlink = page.getByTestId("AufgabenRoute");
        this.navigationPage = new NavigationPage(page);
        this.commonPage = new CommonPage(page);
        this.nichtBegonnenAufgabeErfassenBtn = page.locator("app-inline-aufgabe-erstellung").first();
        this.filterZurucksetzenBtn = page.locator("app-aufgaben-filter button[mat-flat-button]").first();
        this.zugewieseneComboBox = page.locator("app-aufgaben-filter").getByTestId("userId_Zugewiesen").getByTestId("root-control");
        this.newAufgabenTitel = page.getByTestId("titel").getByTestId("root-control").last();
        this.newZugewiesene = page.getByTestId("userId_Zugewiesen").getByTestId("root-control").last();
        this.newStatus = page.getByTestId("status").getByTestId("root-control").last();
        this.newPrioritate = page.getByTestId("prioritaet").getByTestId("root-control").last();
        this.newStartDatum = page.getByTestId("startdatum").getByTestId("root-control").last();
        this.newFaelligkeitDatum = page.getByTestId("faelligkeitDatum").getByTestId("root-control").last();
        this.newNotizenHinzufugen = page.getByTestId("notizen").getByTestId("root-control");
        this.aufgabeChecklist = page.locator(".aufgabe-unteraufgaben button");
        this.checklistTxtbox = page.locator(".aufgabe-unteraufgaben").getByTestId("root-control");
        this.verknupfungHinzufugenBtn = page.getByTestId("urlLinks").locator("button");
        this.urlTxtbox = page.getByTestId("url").getByTestId("root-control");
        this.linkHinzufugenBtn = page.getByRole("button", {
            name: /Link hinzufügen|Ajouter un lien/i
        });
        this.speichernUndSchliessenBtn = page.getByRole("button", {
            name: /Speichern und schliessen|Enregistrer et fermer/i
        });
        this.anderungsprotokollItem = page.getByRole("menuitem", {
            name: /Änderungsprotokoll|Protocole des modifications/i
        });
        this.schhliessenBtn = page.getByTestId("close-dialog");
        this.nichBegonnenField = page.locator("div[class*='card-column']").first();
        this.inArbeitField = page.locator("div[class*='card-column']").nth(1);
        this.erledigtField = page.locator("div[class*='card-column']").last();
        this.dossierSearchTxtbox = page.getByTestId("dossierId").getByTestId("root-control");
        this.zugewieseneSearchComboBox = page.getByTestId("userId_Zugewiesen").getByTestId("root-control");
        this.erstellDurchSearchComboBox = page.getByTestId("userId_Ersteller").getByTestId("root-control");
        this.statusSearchComboBox = page.getByTestId("status").getByTestId("root-control");
        this.abbrechenBtn = page.getByRole("button", {
            name: /Abbrechen|Annuler/i
        });
        this.anzuzeigenderTxtbox = page.getByRole("textbox", {
            name: /Anzuzeigender Text|Anzuzeigender Text/i
        });
    }

    /**
     * Environment-aware wait that adjusts for server performance
     * @param ms - Base wait time in milliseconds
     */
    private async environmentAwareWait(ms: number): Promise<void> {
        await this.page.waitForTimeout(Math.round(ms * TIMING_MULTIPLIER));
    }

    async selectDokument(): Promise<string | null> {
        await this.navigationPage.openMenuNav();
        await this.navigationPage.documentLink.click();
        await this.page.locator("td:has-text('Interinstitutionelle Zusammenarbeit')").first().click();
        const href = await this.page.locator("app-file-download-base-link a").getAttribute("href");
        console.log("href : " + href);
        this.dokumentHref = href;
        return href;
    }
    async getDokumentHref(): Promise<string | null> {
        return this.dokumentHref;
    }

    async editAufgabeDokumentLink(dokumentName: string) {
        await this.verknupfungHinzufugenBtn.last().click();
        const href = await this.getDokumentHref();
        if (!href) {
            throw new Error("Document href not found");
        }
        await this.urlTxtbox.fill(href);
        await this.anzuzeigenderTxtbox.fill(dokumentName);
        await this.linkHinzufugenBtn.click();
        await this.stabilityHelper.stableClick(this.speichernUndSchliessenBtn);
    }
    async selectAugabenNavLink() {
        await this.page.getByTestId("AufgabenRoute").click();
    }
    async searchAufgabe(dossier: string, zugewMitarbeiter: string, erstellMitarbeiter: string, status: string) {
        await this.page.getByRole("button", { name: /Filter leeren|Effacer les filtres/i }).click();
        await this.navigationPage.waitForPageReady();
        if (zugewMitarbeiter) {
            await this.zugewieseneSearchComboBox.fill(zugewMitarbeiter);
            await this.page.locator(`mat-option:has-text('${zugewMitarbeiter}')`).first().click();
            await this.navigationPage.waitForPageReady();
        }
        if (erstellMitarbeiter) {
            await this.erstellDurchSearchComboBox.fill(erstellMitarbeiter);
            await this.page.locator(`mat-option:has-text('${erstellMitarbeiter}')`).first().click();
            await this.navigationPage.waitForPageReady();
        }
        if (status) {
            for (const stat of status.split(",")) {
                await this.statusSearchComboBox.click();
                await this.page.locator(`mat-option:has-text('${stat}')`).first().click();
            }
            await this.navigationPage.waitForPageReady();
        }
        if (dossier) {
            await this.dossierSearchTxtbox.fill(dossier);
            await this.page.locator(`mat-option:has-text('${dossier}')`).first().click();
            await this.navigationPage.waitForPageReady();
        }
    }
    async editNotiz(notiz: string) {
        if (notiz) {
            await this.newNotizenHinzufugen.fill(notiz);
            await this.stabilityHelper.stableClick(this.speichernUndSchliessenBtn);
        } else {
            await this.abbrechenBtn.click();
        }
    }

    async searchAufgabeFilter(zugewiesenAn: string) {
        if (zugewiesenAn) {
            await this.zugewieseneSearchComboBox.fill(zugewiesenAn);
            await this.page.locator(`mat-option:has-text('${zugewiesenAn}')`).first().click();
        }
    }

    async clearFilter() {
        await this.filterZurucksetzenBtn.click();
        await this.navigationPage.waitForPageReady();
    }
    async checkStatus(titel: string, zugewiesenAn: string, statusDragTo: string) {
        const aufgabenCard = this.page.locator(`app-aufgabe-card:has-text('${titel}'):has-text('${zugewiesenAn}')`).first();
        const regexMap = {
            "In Arbeit": this.inArbeitField,
            Erledigt: this.erledigtField,
            "Nicht begonnen": this.nichBegonnenField,
            "Pas encore commencé": this.inArbeitField,
            "En cours": this.nichBegonnenField,
            Terminé: this.erledigtField
        };

        const targetField = regexMap[statusDragTo];

        if (targetField) {
            await this.stabilityHelper.stableDragAndDrop(aufgabenCard, targetField, {
                timeout: 30000,
                retries: 3,
                steps: 10,
                waitBefore: 1000,
                waitAfter: 500,
                verifyMove: async () => {
                    await this.navigationPage.waitForSpinnerToDisappear();
                    await this.page.waitForTimeout(500);
                    const cardInTarget = targetField.locator(`app-aufgabe-card:has-text('${titel}')`).first();
                    return (await cardInTarget.count()) > 0;
                }
            });
        }

        await this.navigationPage.waitForSpinnerToDisappear();
        await this.environmentAwareWait(500);

        const menuButton = aufgabenCard.locator("button").last();
        await menuButton.waitFor({ state: "visible", timeout: 10000 });
        await this.stabilityHelper.stableClick(menuButton, {
            timeout: 10000,
            retries: 3,
            waitBefore: 300,
            waitAfter: 500
        });

        await this.anderungsprotokollItem.waitFor({ state: "visible", timeout: 10000 });
        await this.stabilityHelper.stableClick(this.anderungsprotokollItem, {
            timeout: 10000,
            retries: 2,
            waitBefore: 200,
            waitAfter: 500
        });

        await this.navigationPage.waitForPageReady();
        const statusRow = this.page.locator("tbody tr").filter({ hasText: /Status|Statut/ }).first();
        await expect(statusRow, "The database did not respond within the expected time frame.").toBeVisible({ timeout: 30000 });
        await expect.soft(statusRow.locator("td").last()).toContainText(statusDragTo);
    }

    async selectAufgabenNavLink() {
        await this.navigationPage.openMenuNav();
        try {
            await expect(this.aufgabenInDossierNavlink).toBeVisible({
                timeout: 5000
            });
            await this.aufgabenInDossierNavlink.click();
        } catch {
            await this.aufgabenNavlink.click();
        }
    }
    async selectAufgabeErfassen(aufgabenStatus: string) {
        await this.page.locator(`h2:has-text('${aufgabenStatus}') + app-inline-aufgabe-erstellung`).click();
    }

    async inputInfo(aufgabenStatus: string, aufgabenTitel: string, faelligkeitDatum: string, zugewiesenAn: string) {
        const appCard = this.page.locator(`h2:has-text('${aufgabenStatus}') + app-inline-aufgabe-erstellung`);
        await appCard.locator("app-txt input").first().fill(aufgabenTitel);
        await appCard.locator("app-date-picker input").first().fill(faelligkeitDatum);
        await appCard.locator("app-user-lookup input").first().focus();
        await this.page.keyboard.press("Control+a");
        await appCard.locator("app-user-lookup input").first().fill(zugewiesenAn);
        const option = this.page.locator(`mat-option:has-text('${zugewiesenAn}')`).first();
        try {
            await expect(option).toBeVisible({ timeout: 3000 });
            await option.click({ timeout: 2000 });
        } catch {
            await appCard.locator("app-user-lookup input").first().fill("");
            await this.environmentAwareWait(300);
            await appCard.locator("app-user-lookup input").first().fill(zugewiesenAn);
            await appCard.locator("app-user-lookup input").first().click();
            await option.click();
        }
        await appCard.getByRole("button", { name: /Aufgabe erfassen|Ajouter une tâche/i }).click();
    }

    async inputSearchZugewiesene(zugewiesenAn: string, oldFaelligkeitDatum?: string) {
        await this.navigationPage.waitForSpinnerToDisappear();
        await this.filterZurucksetzenBtn.click();
        await this.filterZurucksetzenBtn.click();
        await this.zugewieseneComboBox.focus();
        await this.page.keyboard.press("Control+a");
        await this.zugewieseneComboBox.fill(zugewiesenAn);
        await this.zugewieseneComboBox.click();
        await this.page.locator(`mat-option:has-text('${zugewiesenAn}')`).first().click();
        if (oldFaelligkeitDatum) {
            await this.page.locator("app-date-range-picker input").first().fill(oldFaelligkeitDatum);
        }
        await this.navigationPage.waitForPageReady();
    }
    async validateAufgabe(faelligkeitDatum: string, check: string) {
        await expect.soft(this.page.locator(`app-aufgabe-card:has-text('${check}')`)).toBeVisible();
    }
    async editAufgabe(oldFaelligkeitDatum: string, oldAufgabenTitel: string) {
        await this.page
            .locator(`app-aufgabe-card:has-text('${oldAufgabenTitel}'):has-text('${this.commonPage.convertToDDMMYYYY(oldFaelligkeitDatum)}')`)
            .first()
            .click();
        await this.navigationPage.waitForPageReady();
    }
    async editNotizAufgabe(oldAufgabenTitel: string) {
        await this.page.locator(`app-aufgabe-card:has-text('${oldAufgabenTitel}')`).first().click();
        await this.navigationPage.waitForPageReady();
    }
    async editAufgabeInfo(zugewiesenAn: string, aufgabenTitel: string, status: string, prio: string, startDatum: string, notizen: string, checkList: string, verKnuepfung: string) {
        if (verKnuepfung?.trim()) {
            await this.verknupfungHinzufugenBtn.last().click();
            await this.page.waitForSelector("app-link-list", { state: "attached" });
            await this.urlTxtbox.fill(verKnuepfung);
            await this.linkHinzufugenBtn.waitFor({ state: "attached" });
            await expect(this.linkHinzufugenBtn).toBeEnabled({ timeout: 10000 });
            await this.linkHinzufugenBtn.click();
            await this.navigationPage.waitForPageReady({ useNetworkIdle: true, additionalWait: 1000 });
        }

        await this.newZugewiesene.waitFor({ state: "visible", timeout: 10000 });
        await this.newZugewiesene.fill(zugewiesenAn);
        await this.environmentAwareWait(300);
        const zugewieseneOption = this.page.locator(`mat-option:has-text('${zugewiesenAn}')`).first();
        await zugewieseneOption.waitFor({ state: "visible", timeout: 5000 });
        await zugewieseneOption.click();
        await this.environmentAwareWait(300);

        await this.newAufgabenTitel.waitFor({ state: "visible", timeout: 10000 });
        await this.newAufgabenTitel.clear();
        await this.newAufgabenTitel.fill(aufgabenTitel);
        await this.environmentAwareWait(300);

        await this.newStatus.waitFor({ state: "visible", timeout: 10000 });
        await this.newStatus.click();
        await this.environmentAwareWait(200);
        const statusOption = this.page.locator(`mat-option:has-text('${status}')`);
        await statusOption.waitFor({ state: "visible", timeout: 5000 });
        await statusOption.click();
        await this.environmentAwareWait(300);

        await this.newPrioritate.waitFor({ state: "visible", timeout: 10000 });
        await this.newPrioritate.click();
        await this.environmentAwareWait(200);
        const prioOption = this.page.locator(`mat-option:has-text('${prio}')`);
        await prioOption.waitFor({ state: "visible", timeout: 5000 });
        await prioOption.click();
        await this.environmentAwareWait(300);

        if (startDatum?.trim()) {
            await this.newStartDatum.fill(startDatum);
            await this.environmentAwareWait(200);
        }

        await this.newNotizenHinzufugen.fill(notizen);
        await this.environmentAwareWait(200);
        if (checkList !== "") {
            await this.inputChecklist(checkList);
        }

        await expect(this.speichernUndSchliessenBtn).toBeEnabled({ timeout: 15000 });
        await this.stabilityHelper.stableClick(this.speichernUndSchliessenBtn, { timeout: 10000 });
    }
    async inputChecklist(checkList: string) {
        const textArray = checkList.split(",").map((item) => item.trim());

        let existingChecklists = await this.checklistTxtbox.count();

        while (existingChecklists > 0) {
            await this.checklistTxtbox.nth(existingChecklists - 1).clear({ timeout: 500 });

            existingChecklists = await this.checklistTxtbox.count();
        }
        for (let i = 0; i < textArray.length; i++) {
            await this.stabilityHelper.stableClick(this.aufgabeChecklist, { timeout: 1500 });
            await this.checklistTxtbox.nth(i).fill(textArray[i]);
        }
        if (textArray.length > 0) {
            await this.checklistTxtbox.nth(textArray.length - 1).blur();
            await this.environmentAwareWait(300);
        }
    }
}
