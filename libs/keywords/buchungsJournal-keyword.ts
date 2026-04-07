import { Page } from "@playwright/test";
import { BuchungsJournalPage } from "../pages/buchungsJournal-page";

export class BuchungsJournalKeyword {
    page: Page;
    buchungsJournalPage: BuchungsJournalPage;
    constructor(page: Page) {
        this.page = page;
        this.buchungsJournalPage = new BuchungsJournalPage(page);
    }

    async BC04_BuchungsJournal_filtern({ buchaltung, zeitRaum, belegNummer, dossier, zeitRaumTyp, anzeigeDetail, konten, total }) {
        await this.buchungsJournalPage.goToBuchungsJournalPage();
        await this.buchungsJournalPage.searchForJournal(buchaltung, zeitRaum, belegNummer, dossier, zeitRaumTyp, anzeigeDetail, konten);
        await this.buchungsJournalPage.validateTotal(total);
    }
}
