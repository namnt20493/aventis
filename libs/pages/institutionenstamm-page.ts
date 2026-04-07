import { Page, Locator, expect } from "@playwright/test";
import * as assert from "assert";
import { NavigationPage } from "./navigation-page";
import { CommonPage } from "./common-page";
import { StabilityHelper } from "../utils/stability-helper";

export class InstitutionenstammPage {
    page: Page;
    stabilityHelper: StabilityHelper;
    konfiguartionMenu: Locator;
    stammdatenMenu: Locator;
    institutionMenuItem: Locator;
    institutionErfassenBtn: Locator;
    nameInput: Locator;
    strasseInput: Locator;
    hausnummerInput: Locator;
    gultigVonInput: Locator;
    gultigBisInput: Locator;
    namenZusatzInput: Locator;
    zusatzInput: Locator;
    telefonInput: Locator;
    postfachInput: Locator;
    typisierungSelect: Locator;
    emailInput: Locator;
    ortInput: Locator;
    websiteInput: Locator;
    institutionSpeichernBtn: Locator;
    searchInstitution: Locator;
    navigation: NavigationPage;
    filterZurucksetzen: Locator;
    schliessenBtn: Locator;
    cellContaintInstitution: Locator;
    vornameInput: Locator;
    fachpersonErfassenBtn: Locator;
    geschlechtSelect: Locator;
    common: CommonPage;
    btnMenuVertical: Locator;
    btnloschen: Locator;
    constructor(page: Page) {
        this.page = page;
        this.stabilityHelper = new StabilityHelper(page);
        this.common = new CommonPage(page);
        this.navigation = new NavigationPage(page);
        this.konfiguartionMenu = page.getByRole("menuitem", {
            name: /Konfiguration|Configuration/i
        });
        this.stammdatenMenu = page.locator("a").filter({ hasText: /Stammdaten|Données de base/i });
        this.institutionMenuItem = page.getByTestId("konfiguration-institutionenstamm");
        this.institutionErfassenBtn = page.locator("app-content").getByRole("button", {
            name: /Institution erfassen|Saisir une institution/i
        });
        this.nameInput = page.getByTestId("name").getByTestId("root-control");
        this.strasseInput = page.getByTestId("strasse").getByTestId("root-control");
        this.hausnummerInput = page.getByTestId("hausnummer").getByTestId("root-control");
        this.gultigVonInput = page.getByTestId("validFrom").getByTestId("root-control");
        this.gultigBisInput = page.getByTestId("validThrough").getByTestId("root-control");
        this.namenZusatzInput = page.getByTestId("namenszusatz").getByTestId("root-control");
        this.zusatzInput = page.getByTestId("zusatz").getByTestId("root-control");
        this.telefonInput = page.getByTestId("telefon").getByTestId("root-control");
        this.postfachInput = page.getByTestId("postfach").getByTestId("root-control");
        this.typisierungSelect = page.getByTestId("typen").getByTestId("root-control");
        this.emailInput = page.getByTestId("mail").getByTestId("root-control");
        this.ortInput = page.getByTestId("postleitzahl").locator("input");
        this.websiteInput = page.getByTestId("website").getByTestId("root-control");
        this.institutionSpeichernBtn = page.locator("app-widget-host:has-text('institution')").getByRole("button", { name: /Speichern|Enregistrer/i });
        this.searchInstitution = page.getByTestId("suchbegriff").getByTestId("root-control");
        this.filterZurucksetzen = page.getByRole("button", {
            name: /Filter zurücksetzen|Réinitialiser le filtre/i
        });
        this.schliessenBtn = page.getByRole("button", { name: /Schliessen|Fermer/i }).first();
        this.cellContaintInstitution = page.locator("tbody tr").first().locator("td").first();
        this.fachpersonErfassenBtn = page.getByRole("button", {
            name: /Fachperson erfassen|Saisir un·e spécialiste/i
        });
        this.vornameInput = page.getByTestId("vorname").getByTestId("root-control");
        this.geschlechtSelect = page.getByTestId("fachpersonGeschlecht").getByTestId("root-control");
        this.btnMenuVertical = page.locator("tr button mat-icon[data-mat-icon-name='menu_vertical']");
        this.btnloschen = page.getByRole("menuitem", {
            name: /Institution \/ Fachperson löschen|Supprimer/i
        });
    }
    formatGueltigVon(gueltigVon: string, gueltigBis: string): string {
        const vonParts = gueltigVon.split(".");
        const bisParts = gueltigBis.split(".");
        if (vonParts.length === 3 && bisParts.length === 3 && vonParts[2] === bisParts[2]) {
            return `${vonParts[0]}.${vonParts[1]}.`;
        }
        return gueltigVon;
    }
    async searchForFachperson(suche: string) {
        await this.filterZurucksetzen.click();
        await this.searchInstitution.pressSequentially(suche);
        await this.page.keyboard.press("Enter");
        await this.navigation.waitForPageReady();
    }
    reverseSuche(suche: string): string {
        const parts = suche.split(",").map((s) => s.trim());
        if (parts.length === 2) {
            return `${parts[1]}, ${parts[0]}`;
        }
        return suche;
    }
    private formatGueltigkeitForFilter(gueltigVon: string, gueltigBis: string): string {
        const vonParts = gueltigVon?.split(".") ?? [];
        const bisParts = gueltigBis?.split(".") ?? [];
        const monthsDe = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

        if (vonParts.length === 3 && bisParts.length === 3) {
            const vonDay = vonParts[0];
            const vonMonth = vonParts[1];
            const vonYear = vonParts[2];
            const bisDay = bisParts[0];
            const bisMonth = bisParts[1];
            const bisYear = bisParts[2];

            // same month & year
            if (vonMonth === bisMonth && vonYear === bisYear) {
                if (vonDay === "01" || vonDay === "1") {
                    const monthIndex = parseInt(vonMonth, 10) - 1;
                    const monthName = monthsDe[monthIndex] ?? `${vonMonth}`;
                    return `${monthName} ${vonYear}`;
                }
                return `${vonDay}. - ${gueltigBis}`;
            }

            // cross-month range: first of month to last of month in same year
            if (vonYear === bisYear && (vonDay === "01" || vonDay === "1")) {
                const lastDayOfBisMonth = new Date(parseInt(bisYear, 10), parseInt(bisMonth, 10), 0).getDate();
                if (parseInt(bisDay, 10) === lastDayOfBisMonth) {
                    const vonMonthIndex = parseInt(vonMonth, 10) - 1;
                    const bisMonthIndex = parseInt(bisMonth, 10) - 1;
                    const vonMonthName = monthsDe[vonMonthIndex] ?? `${vonMonth}`;
                    const bisMonthName = monthsDe[bisMonthIndex] ?? `${bisMonth}`;
                    return `${vonMonthName} - ${bisMonthName} ${vonYear}`;
                }
            }
        }

        const formattedVon = this.formatGueltigVon(gueltigVon, gueltigBis);
        return `${formattedVon} - ${gueltigBis}`;
    }
    async deleteFachperson(suche: string, gueltigVon: string, gueltigBis: string) {
        const countBefore = await this.page.locator("tbody tr").count();
        const filterText = this.formatGueltigkeitForFilter(gueltigVon, gueltigBis);
        const tr = this.page
            .locator("tbody tr")
            .filter({ hasText: this.reverseSuche(suche) })
            .filter({ hasText: filterText })
            .first();
        await tr.locator("button mat-icon[data-mat-icon-name='menu_vertical']").click();
        await this.btnloschen.click({ delay: 1000 });
        await this.navigation.waitForPageReady();
        if (countBefore === 1) {
            await expect(this.page.locator("table")).toContainText("Keine Institutionen gefunden.");
        } else {
            await expect(this.page.locator("table")).not.toContainText("Keine Institutionen gefunden.");
            const countAfter = await this.page.locator("tbody tr").count();
            expect(countAfter).toBeLessThan(countBefore);
        }
    }
    // validate new fachperson
    async validateFachperson(vorname: string, fachPersName: string) {
        await expect.soft(this.cellContaintInstitution).toHaveText(`${fachPersName}, ${vorname}`);
    }
    //add new fachperson
    async addNewFachperson(vorname: string, fachPersName: string, namenZusatz: string, zusatz: string, strasse: string, geschlecht: any, hausNum: number, telNummer: number, email: string, ort: string, postfach: string | number, website: string, typisierung: any, gueltigVon: string, gueltigBis: string) {
        await this.fachpersonErfassenBtn.click();
        await this.navigation.waitForPageReady();
        await this.navigation.waitForSpinnerToDisappear();
        await this.telefonInput.pressSequentially(String(telNummer));

        //11/6 change to pressSequentially to avoid issue with special characters
        await this.vornameInput.pressSequentially(vorname);
        await this.nameInput.pressSequentially(fachPersName);
        //20.06.2025 change order of steps
        await this.geschlechtSelect.click();
        await this.page.locator(`mat-option:has-text("${geschlecht}")`).click();
        await this.strasseInput.fill(strasse);
        await this.hausnummerInput.fill(String(hausNum));
        await this.gultigVonInput.fill(gueltigVon);
        await this.gultigBisInput.fill(gueltigBis);
        await this.namenZusatzInput.fill(namenZusatz);
        await this.zusatzInput.fill(zusatz);

        await this.postfachInput.fill(String(postfach));
        await this.typisierungSelect.click();
        await this.page.locator(`mat-option:has-text("${typisierung}")`).click();
        await this.page.keyboard.press("Escape");
        await this.emailInput.fill(email);
        await this.ortInput.fill(ort);
        await this.page.keyboard.press("Enter");
        await this.websiteInput.fill(website);
        await this.stabilityHelper.stableClick(this.institutionSpeichernBtn);
        await this.navigation.waitForPageReady();
        await this.navigation.waitForSpinnerToDisappear();
        await this.stabilityHelper.closeDialog();
    }
    //go to institution page
    async goToInstitutionPage() {
        await this.navigation.menuDropdown.click();
        await this.konfiguartionMenu.click();
        await this.stammdatenMenu.click();
        await this.institutionMenuItem.click();
        await this.navigation.waitForPageReady();
    }

    //add new institution
    async addNewInstitution(instName: string, namenZusatz: string, zusatz: string, strasse: string, hausNum: number, telNummer: number, email: string, ort: string, postfach: string | number, website: string, typisierung: any, gueltigVon: string, gueltigBis: string) {
        await this.institutionErfassenBtn.click({ delay: 1000 });
        await this.navigation.waitForPageReady();
        await this.page.locator("app-default-dialog").waitFor({ state: "visible" });
        await this.navigation.waitForSpinnerToDisappear();
        //24.06.2025 change order of steps
        await this.typisierungSelect.click();
        await this.page.locator(`mat-option:has-text("${typisierung}")`).click();
        await this.page.keyboard.press("Escape");
        await this.nameInput.pressSequentially(instName);
        await this.strasseInput.fill(strasse);
        await this.hausnummerInput.fill(String(hausNum));
        await this.gultigVonInput.fill(gueltigVon);
        await this.gultigBisInput.fill(gueltigBis);
        await this.namenZusatzInput.fill(namenZusatz);
        await this.zusatzInput.fill(zusatz);
        await this.telefonInput.fill(String(telNummer));
        await this.postfachInput.fill(String(postfach));
        await this.emailInput.fill(email);
        //24.06.2025 change to pressSequentially
        await this.ortInput.pressSequentially(ort);
        await this.page.keyboard.press("Backspace");
        await this.page.locator(`mat-option:has-text("${ort}")`).click();
        await this.websiteInput.pressSequentially(website);
        await this.stabilityHelper.stableClick(this.institutionSpeichernBtn);
        await this.navigation.waitForPageReady();
        await this.navigation.waitForSpinnerToDisappear();
        await this.stabilityHelper.closeDialog();
    }
    // search for fachperson
    async searchFachpersonByName(vorname: string, fachPersName: string) {
        await this.filterZurucksetzen.click();
        await this.page.reload();
        await this.searchInstitution.pressSequentially(`${fachPersName} ${vorname}`);
        await this.page.keyboard.press("Enter");
        await this.common.waitForApiHelper(this.page, "InstitutionenQuery", async () => {});
    }
    // search for new institution
    async searchInstitutionByName(name: string) {
        await this.filterZurucksetzen.click();
        await this.page.reload();
        await this.searchInstitution.pressSequentially(name);
        await this.page.keyboard.press("Enter");
        await this.common.waitForApiHelper(this.page, "InstitutionenQuery", async () => {});
    }

    //validate new institution
    async validateInstitution(name: string) {
        await expect.soft(this.cellContaintInstitution).toHaveText(name);
    }
}
