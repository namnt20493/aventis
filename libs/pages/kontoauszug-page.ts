import { Page, Locator, expect } from "@playwright/test";
import { NavigationPage } from "./navigation-page";
import { RahmenbudgetPage } from "./rahmenbudget-page";
import { CommonPage } from "./common-page";
import { StabilityHelper } from "@utils/stability-helper";

export class KontoauszugPage {
    page: Page;
    private stabilityHelper: StabilityHelper;
    navigation: NavigationPage;
    aventisMenu!: Locator;
    leistungWahlen: Locator;
    sucheBtn: Locator;
    auszuwertenderZeitraumStartDate: Locator;
    auszuwertenderZeitraumEndDate: Locator;
    zahlungsempfanger!: Locator;
    zeitraum: Locator;
    keineDetails: Locator;
    inklMonatstotale: Locator;
    inklVorsaldo: Locator;
    ruckerBuchCheckbox: Locator;
    buchOriginalCheckbox: Locator;
    suchenBtn: Locator;
    kontoauszugBtn: Locator;
    auswertenMenu: Locator;
    kontoauszugItem: Locator;
    totalRow: Locator;
    sozialhilfeschuldTab: Locator;
    stichdatum: Locator;
    btnSozialhilfeschuldBerechnen: Locator;
    klientSelect: Locator;
    bescheinigungSelect: Locator;
    btnBescheinigungHinzufugen: Locator;
    rahmenbudgetPage: RahmenbudgetPage;
    kontoauszugNavLink: Locator;
    sozialhilfeschuldTable: Locator;
    sozialhifeschldRow: Locator;
    common: CommonPage;
    filter: Locator;
    zahlungsempfangerIns: Locator;
    zahlungsempfangerPer: Locator;
    zeitRaumVon: Locator;
    zeitRaumBis: Locator;
    zeitraumSelect: Locator;
    filterLeeren: Locator;
    personSelect: Locator;
    institutionSelect: Locator;
    constructor(page: Page) {
        this.page = page;
        this.stabilityHelper = new StabilityHelper(page);
        this.common = new CommonPage(page);
        this.navigation = new NavigationPage(page);
        this.rahmenbudgetPage = new RahmenbudgetPage(page);
        this.common = new CommonPage(page);
        this.auswertenMenu = page.locator("a").filter({ hasText: /Auswerten|Évaluer/i });
        this.kontoauszugItem = page.getByRole("button", {
            name: /Kontoauszug|Extrait de compte/i
        });
        this.leistungWahlen = page.getByTestId(/leistungId|leistungFormControl/).getByTestId("root-control");
        this.sucheBtn = page.getByTestId("suchbegriff").getByTestId("root-control");
        this.auszuwertenderZeitraumStartDate = page.locator("app-date-range-picker").locator("input").first();
        this.auszuwertenderZeitraumEndDate = page.locator("app-date-range-picker").locator("input").last();
        this.zahlungsempfangerIns = page.getByTestId(/institutionIdKreditorDebitor|institutionId_KreditorDebitor/).getByTestId("root-control");
        this.zahlungsempfangerPer = page.getByTestId(/personIdKreditorDebitor|personId_KreditorDebitor/).getByTestId("root-control");
        this.zeitraum = page.getByTestId("zeitraum").getByTestId("root-control");
        this.keineDetails = page.getByRole("radio", {
            name: /Keine Details|Pas de détails/i
        });
        this.inklMonatstotale = page.getByRole("radio", {
            name: /inkl. Monatstotale|y compris les totaux mensuels/i
        });
        this.inklVorsaldo = page.getByRole("radio", {
            name: /inkl. Vorsaldo|y compris le solde préalable/i
        });
        this.ruckerBuchCheckbox = page.getByTestId("nurRueckerstattungspflichtig").getByRole("checkbox");
        this.buchOriginalCheckbox = page.getByTestId("korrigierteBuchungenAnzeigen").getByRole("checkbox");
        this.suchenBtn = page.getByRole("button", { name: /Suche|Rechercher/i });
        this.kontoauszugBtn = page
            .getByRole("button", {
                name: /Kontoauszug herunterladen|Télécharger l'extrait de compte/i
            })
            .last();
        this.totalRow = page.locator("td[class='currency-column total-row']");
        this.sozialhilfeschuldTab = page.getByRole("tab", {
            name: /Sozialhilfeschuld|Dette d'aide sociale/i
        });
        this.stichdatum = page.getByTestId("stichtag").getByTestId("root-control");
        this.btnSozialhilfeschuldBerechnen = page.getByRole("button", {
            name: /Sozialhilfeschuld berechnen|Calculer la dette d'aide sociale/i
        });
        this.klientSelect = page.getByTestId("personInDossierId").getByTestId("root-control");
        this.bescheinigungSelect = page.getByTestId("templateId").getByTestId("root-control");
        this.btnBescheinigungHinzufugen = page.getByRole("button", {
            name: /Bescheinigung hinzufügen|Ajouter une attestation/i
        });
        this.kontoauszugNavLink = page.getByRole("link", {
            name: /Kontoauszug|Extrait de compte/i
        });
        this.sozialhilfeschuldTable = page.locator("app-sozialhilfeschuld-in-dossier-bescheinigungen-table");
        this.sozialhifeschldRow = this.sozialhilfeschuldTable.locator("tbody tr").first();
        this.filter = page.locator("app-kontoauszug-filter");
        //
        this.zeitRaumVon = page.locator("mat-date-range-input").locator("input").first();
        this.zeitRaumBis = page.locator("mat-date-range-input").locator("input").last();
        this.zeitraumSelect = page.getByTestId("zeitraum").getByTestId("root-control");
        this.filterLeeren = page.getByRole("button", {
            name: /Filter leeren|Effacer le filtre/i
        });
        this.sucheBtn = page.getByRole("button", { name: /Suche|Rechercher/i });
        this.personSelect = page.getByTestId("personId_KreditorDebitor").getByTestId("root-control");
        this.institutionSelect = page.getByTestId("institutionId_KreditorDebitor").getByTestId("root-control");
        //
    }
    async filterKontoauszug(zeitRaumVon: string, zeitRaumBis: string, zeitRaum: string, bezAnInstPerson: string | RegExp, zahlEmpfaenger: string, option: string) {
        await this.zeitRaumVon.fill(zeitRaumVon);
        await this.zeitRaumBis.fill(zeitRaumBis);
        if (zeitRaum !== "" && zeitRaum !== undefined && zeitRaum !== null) {
            await this.zeitraumSelect.click();
            console.log(zeitRaum, ":       *********zeitRaum");
            await this.page.locator(`mat-option:has-text('${zeitRaum}')`).click();
        }
        await this.page
            .getByTestId("empfaengerKategorie")
            .getByRole("radio", { name: `${bezAnInstPerson}` })
            .click();
        if (bezAnInstPerson === "person" || bezAnInstPerson === "Person") {
            await this.personSelect.fill(zahlEmpfaenger);
            await this.page.locator(`mat-option:has-text('${zahlEmpfaenger}')`).click();
        } else {
            await this.institutionSelect.fill(zahlEmpfaenger);
            await this.page.locator(`mat-option:has-text('${zahlEmpfaenger}')`).click();
        }
        await this.page
            .getByTestId("detail")
            .getByRole("radio", { name: `${option}` })
            .click();
        await this.sucheBtn.click();
        await this.navigation.waitForPageReady();
    }
    async validateKontoauszugFilter(totalAusgaben: number, totalEinahmen: number) {
        const isVisible = await this.totalRow.isVisible();
        if (isVisible) {
            await this.validateTotal(totalAusgaben, totalEinahmen);
        }
    }
    formatFilename(input: string) {
        return (
            input
                .replace(/\(.*?\)/g, "")
                .trim()
                .replace(/\.xlsx$/, "") + ".xlsx"
        );
    }
    async validateFileDownload(kontoauszugHerunterladenX: string, downLoadName: string) {
        if (kontoauszugHerunterladenX === "x" || kontoauszugHerunterladenX === "X") {
            const [download] = await Promise.all([this.page.waitForEvent("download"), this.kontoauszugBtn.click()]);
            expect.soft(download.suggestedFilename()).toBe(this.formatFilename(downLoadName));
        }
    }
    //validate sozialhilfeschuld info
    async validateSozialhilfeschuldInfo(klient: string, stichDatum: string) {
        const todayDate = this.common.getCurrentFormattedDate();
        await expect.soft(this.sozialhifeschldRow).toContainText(todayDate);
        await expect.soft(this.sozialhifeschldRow).toContainText(klient);
        await expect.soft(this.sozialhifeschldRow).toContainText(stichDatum);
    }
    //go to sozialhilfeschuld tab
    async goToSozialhilfeschuldTab() {
        await this.navigation.openMenuNav();
        await this.kontoauszugNavLink.click();
        await this.sozialhilfeschuldTab.click();
    }

    //input sozialhilfeschuld search
    async inputSozialhifeschuldSearch(stichDatum: string) {
        await this.stichdatum.first().fill(stichDatum);
        await this.btnSozialhilfeschuldBerechnen.click();
    }

    //Sozialhilfeschuld-Bescheinigungen
    async sozialhilfeschuldBescheinigungen(klient: string, bescheinigungsArt: string, stichDatum: string) {
        await this.klientSelect.click();
        await this.page.locator(`mat-option:has-text('${klient}')`).click();
        await this.bescheinigungSelect.click();
        await this.page.locator(`mat-option:has-text('${bescheinigungsArt}')`).click();
        await this.stichdatum.last().fill(stichDatum);
        await this.btnBescheinigungHinzufugen.click();
    }
    // go to Kontoauszug page
    async goToKontoauszugPage() {
        await this.navigation.menuDropdown.click();
        await this.navigation.buchhaltungMenuItem.click();
        await this.auswertenMenu.click();
        await this.kontoauszugItem.click();
    }

    // search for Kontoauszug
    async searchForKontoauszug(leistungSuchen: string, suche: string, zeitRaumBis: string, zeitRaum: string, insOrKlient: string | RegExp, zahlEmpfaenger: string, option: string | RegExp) {
        await this.leistungWahlen.fill(leistungSuchen);
        await this.page.locator(`mat-option:has-text('${leistungSuchen}')`).first().click();
        //,mat-option:has-text('${leistungSuchen} | ASE')
        // ,mat-option:has-text('${leistungSuchen} | DOS')
        await expect.soft(this.page.locator("app-kontoauszug-filter")).toBeVisible();
        await this.page.getByTestId("suchbegriff").getByTestId("root-control").clear();
        await this.page.getByTestId("suchbegriff").getByTestId("root-control").pressSequentially(suche, { delay: 50 });

        await this.page.locator(`mat-radio-button:has-text('${insOrKlient}')`).click();
        await this.zeitraumSelect.click();
        await this.page.locator(`mat-option:has-text('${zeitRaum}')`).click();
        if (zahlEmpfaenger !== "") {
            if (insOrKlient === "institution") {
                await this.zahlungsempfangerIns.fill(zahlEmpfaenger);
            } else {
                await this.zahlungsempfangerPer.fill(zahlEmpfaenger);
            }
            await expect(this.page.locator(`mat-option:has-text('${zahlEmpfaenger}')`).last(), { message: "is there any option ?" }).toBeVisible();
            await this.page.locator(`mat-option:has-text('${zahlEmpfaenger}')`).click();
        }
        await this.auszuwertenderZeitraumEndDate.fill(zeitRaumBis);
        switch (option) {
            case /Keine Details|Pas de détails/i:
                await this.keineDetails.click();
                break;
            case /Inkl. Monatstotale|y compris les totaux mensuels/i:
                await this.inklMonatstotale.click();
                break;
            case /Inkl. Vorsaldo|y compris le solde préalable/i:
                await this.inklVorsaldo.click();
                break;
        }
    }
    //select checkbox
    async selectOption(nurRueckerstBuchX: string, korrBuchInklOriginalX: string) {
        if (nurRueckerstBuchX === "x" && (await this.ruckerBuchCheckbox.isChecked()) === false) {
            await this.ruckerBuchCheckbox.click();
        }
        if (korrBuchInklOriginalX === "x" && (await this.buchOriginalCheckbox.isChecked()) === false) {
            await this.buchOriginalCheckbox.click();
        }
    }

    // click search button
    async clickSearchBtn() {
        await this.suchenBtn.click();
    }

    //validate amount
    async validateTotal(totalAusgaben: number, totalEinahmen: number) {
        const isVisible = await this.totalRow.isVisible();
        if (!isVisible && totalAusgaben === 0 && totalEinahmen === 0) {
            return;
        }
        const totalAusgabenStr = this.normalizeNumber(totalAusgaben);
        const totalEinahmenStr = this.normalizeNumber(totalEinahmen);
        const totalAusgabenStrFR = this.normalizeNumberFR(totalAusgaben);
        const totalEinahmenStrFR = this.normalizeNumberFR(totalEinahmen);
        const regEx = new RegExp(`(${totalAusgabenStrFR}.*${totalEinahmenStrFR})|(${totalAusgabenStr}.*${totalEinahmenStr})`, "i");
        await expect.soft(this.totalRow).toContainText(regEx);
    }
    // verfify Download
    async verifyDownload(kontoauszugHerunterladenX: string) {
        if (kontoauszugHerunterladenX === "x") {
            const [download] = await Promise.all([this.page.waitForEvent("download"), this.kontoauszugBtn.click()]);
            expect.soft(download.suggestedFilename()).toBe("Kontoauszug.xlsx");
        }
    }
    normalizeNumber(num: number): string {
        let str = num.toString();

        let [integerPart, decimalPart] = str.split(".");

        const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, "’");

        if (decimalPart) {
            if (decimalPart.length < 2) {
                decimalPart = decimalPart.padEnd(2, "0");
            } else if (decimalPart.length > 2) {
                decimalPart = decimalPart.slice(0, 2);
            }
        } else {
            decimalPart = "00";
        }

        const formattedStr = formattedIntegerPart + "." + decimalPart;

        return formattedStr;
    }
    normalizeNumberFR(num: number): string {
        let str = num.toString();

        let [integerPart, decimalPart] = str.split(".");

        const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

        if (decimalPart) {
            if (decimalPart.length < 2) {
                decimalPart = decimalPart.padEnd(2, "0");
            } else if (decimalPart.length > 2) {
                decimalPart = decimalPart.slice(0, 2);
            }
        } else {
            decimalPart = "00";
        }

        const formattedStr = formattedIntegerPart + "," + decimalPart;

        return formattedStr;
    }
}
