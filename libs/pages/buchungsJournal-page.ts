import { Page, Locator, expect } from "@playwright/test";
import { NavigationPage } from "./navigation-page";
import { KontoauszugPage } from "./kontoauszug-page";
import { CommonPage } from "./common-page";
import { StabilityHelper } from "@utils/stability-helper";

export class BuchungsJournalPage {
    page: Page;
    private stabilityHelper: StabilityHelper;
    kontoauszugPage: KontoauszugPage;
    buchungsJournalitem: Locator;
    buchhaltung: Locator;
    zeitraumStartDate: Locator;
    zeitraumEndDate: Locator;
    beiegnummer: Locator;
    dossierWahlen: Locator;
    filterZeitraumTyp: Locator;
    konten: Locator;
    detailRadio: Locator;
    belegRadio: Locator;
    totalValue: Locator;
    navigation: NavigationPage;
    sucheBtn: Locator;
    betragCell: Locator;
    buchhaltungField: Locator;
    commonPage: CommonPage;
    constructor(page: Page) {
        this.page = page;
        this.stabilityHelper = new StabilityHelper(page);
        this.navigation = new NavigationPage(page);
        this.kontoauszugPage = new KontoauszugPage(page);
        this.commonPage = new CommonPage(page);
        this.buchungsJournalitem = page.getByRole("button", {
            name: /Buchungsjournal|Journal des écritures/i
        });
        this.buchhaltung = page.getByRole("combobox", {
            name: /Buchhaltung|Comptabilité/i
        });
        this.buchhaltungField = page.getByLabel("Buchhaltung", { exact: true });
        this.zeitraumStartDate = page.locator("mat-date-range-input").locator("input").first();
        this.zeitraumEndDate = page.locator("mat-date-range-input").locator("input").last();
        this.beiegnummer = page.getByTestId("belegnummer").getByTestId("root-control");
        this.dossierWahlen = page.getByTestId("dossierId").getByTestId("root-control");
        this.filterZeitraumTyp = page.getByTestId("zeitraumTyp").getByTestId("root-control");
        this.konten = page.getByTestId("kontoIds").getByTestId("root-control");
        this.detailRadio = page.getByRole("radio", { name: /Detail|Détail/i });
        this.belegRadio = page.getByRole("radio", { name: /Beleg|Justificatif/i });
        this.totalValue = page.locator("p:has-text('Total')");
        //3.5
        this.sucheBtn = page.getByRole("button", { name: /Suche|Rechercher/i });
        this.betragCell = page.locator("td[class*='mat-column-Betrag']").first();
    }
    // check betrag
    async validateTotal(total: string) {
        await expect.soft(this.betragCell).toContainText(total);
    }
    // go to BuchungsJournal page
    async goToBuchungsJournalPage() {
        await this.navigation.menuDropdown.click({ delay: 2000 });
        await this.navigation.buchhaltungMenuItem.click();
        await this.kontoauszugPage.auswertenMenu.click();
        await this.buchungsJournalitem.click();
    }

    //seach for journal
    async searchForJournal(buchhaltung: string, zeitRaum: string, belegNummer: string, dossier: string, zeitRaumTyp: string, anzeigeDetail: string, konten: number) {
        if (buchhaltung !== "") {
            await this.buchhaltung.click();
            await this.page.locator(`mat-option:has-text('${this.getTextBeforeQuotes(buchhaltung)}')`).first().click();
        }
        await this.zeitraumEndDate.fill(zeitRaum);
        await this.beiegnummer.fill(belegNummer);
        if (dossier !== "") {
            await this.dossierWahlen.fill(dossier);
            await this.page.locator(`mat-option:has-text('${dossier}')`).click();
        }
        await this.filterZeitraumTyp.click();
        await this.page.locator(`mat-option:has-text('${zeitRaumTyp}')`).click();
        await this.konten.fill(String(konten));
        await this.page.locator(`mat-option:has-text('${konten}')`).click();
        switch (anzeigeDetail) {
            case "Detail":
                await this.detailRadio.click();
                break;
            case "Beleg":
                await this.belegRadio.click();
                break;
            case "Détail":
                await this.detailRadio.click();
                break;
            case "Justificatif":
                await this.belegRadio.click();
                break;
        }
        await this.sucheBtn.click();
    }
    // validate total value
    // async validateTotalValue(total : number){
    //     const totalValue = this.kontoauszugPage.normalizeNumber(total)
    //     const totalValueFr = this.kontoauszugPage.normalizeNumberFR(total)
    //     const regex = new RegExp(`${totalValue}|${totalValueFr}`, 'i');
    //     await expect.soft(this.totalValue).toContainText(regex)

    // }

    getTextBeforeQuotes(str: string): string {
        const index = str.indexOf('"');
        if (index === -1) {
            return str;
        }
        return str.substring(0, index).trim();
    }
}
