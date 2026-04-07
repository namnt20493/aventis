import { Page } from "@playwright/test";
import { BedarfsprufungPage } from "../pages/bedarfsprufung-page";
import { RahmenbudgetPage } from "../pages/rahmenbudget-page";
import { NavigationPage } from "../pages/navigation-page";

export class BedarfsprufungKeyword {
    private readonly page: Page;
    private readonly bedarfsprufungPage: BedarfsprufungPage;
    private readonly rahmenbudgetPage: RahmenbudgetPage;
    navigationPage: NavigationPage;

    constructor(page: Page) {
        this.page = page;
        this.bedarfsprufungPage = new BedarfsprufungPage(page);
        this.rahmenbudgetPage = new RahmenbudgetPage(page);
        this.navigationPage = new NavigationPage(page);
    }
    async A01b_Zu_AnsprPruef_Bedarfspruef_ChecklistErgaenzen({ bedarfsPrDate, klient, thema, unterLagen, status, bemerkung }: { bedarfsPrDate: string; klient: string; thema: string; unterLagen: string; status: string; bemerkung: string }) {
        await this.bedarfsprufungPage.clickBedarfNavLink();
        await this.bedarfsprufungPage.editBedarfsprufung(bedarfsPrDate, klient, thema, unterLagen, status, bemerkung);
    }
    async A01c_Zu_AnsprPruef_Bedarfspruef_ChecklistNichtRelevant({ bedarfsPrDate, klient, thema }: { bedarfsPrDate: string; klient: string; thema: string }) {
        await this.bedarfsprufungPage.clickBedarfNavLink();
        await this.bedarfsprufungPage.acceptAusbildung(bedarfsPrDate, klient, thema);
    }
    async A01d_Zu_AnsprPruef_Bedarfspruef_Checklist_als_WordExport({ bedarfsPrDate, klient, filterKategorie, filterStatus, filterBetrifft }: { bedarfsPrDate: string; klient: string; filterKategorie: string; filterStatus: string; filterBetrifft: string }) {
        await this.bedarfsprufungPage.clickBedarfNavLink();
        await this.bedarfsprufungPage.filterBedarfsprufungDokumente(filterKategorie, filterStatus, filterBetrifft);
        await this.bedarfsprufungPage.verifyKategorieInDokumenteList(filterKategorie);
        await this.bedarfsprufungPage.generateWordDokument();
    }

    async A01_AnspruchPruefung_Bedarfspruefung({ entscheidVom, begrundung, unterstutzungab }: { entscheidVom: string; begrundung: string; unterstutzungab: string }) {
        if (process.env.SLOW_MODE === "true") {
            await this.page.waitForTimeout(2000);
        }
        await this.bedarfsprufungPage.clickBedarfNavLink();
        await this.bedarfsprufungPage.clickBedarfEraBtn();
        await this.bedarfsprufungPage.clickEintreTab();
        await this.bedarfsprufungPage.selectEintreRadioBtn();
        await this.bedarfsprufungPage.inputEntscheidVom(entscheidVom);
        await this.bedarfsprufungPage.inputBegrundung(begrundung);
        await this.bedarfsprufungPage.clickBedarfsprufungSichernBtn();
        await this.bedarfsprufungPage.clickAppSnackbar();
        await this.bedarfsprufungPage.clickWirtschaftlicheSozialhilfeErafassenBtn();
        await this.bedarfsprufungPage.inputUnterstutzungabTxtbox(unterstutzungab);
        await this.bedarfsprufungPage.selectGanzeKlientSchaft();
        await this.bedarfsprufungPage.clickWshLeistungErfassenBtn();
        await this.bedarfsprufungPage.clickRahmenbudgetLink();
    }
    // seems not to be used yet
    async A01_1_AnspruchPruefung_Bedarfspruefung({ entscheidVom, begrundung, unterstutzungab }: { entscheidVom: string; begrundung: string; unterstutzungab: string }) {
        await this.bedarfsprufungPage.clickBedarfLink();
        await this.bedarfsprufungPage.clickBedarfEraBtn();
        await this.bedarfsprufungPage.clickEintreTab();
        await this.bedarfsprufungPage.selectEintreRadioBtn();
        await this.bedarfsprufungPage.inputEntscheidVom(entscheidVom);
        await this.bedarfsprufungPage.inputBegrundung(begrundung);
        await this.bedarfsprufungPage.clickBedarfsprufungSichernBtn();
        await this.bedarfsprufungPage.clickWirtschaftlicheSozialhilfeErafassenBtn();
        await this.bedarfsprufungPage.selectGanzeKlientSchaft();
        await this.bedarfsprufungPage.inputUnterstutzungabTxtbox(unterstutzungab);
        await this.bedarfsprufungPage.clickWshLeistungErfassenBtn1();
        await this.bedarfsprufungPage.clickRahmenbudgetLink();
        await this.page.reload();
        await this.rahmenbudgetPage.verifyUnterstutzungsbetragIsGreaterThan0();
        await this.page.reload();
        await this.rahmenbudgetPage.verifyUnterstutzungsbetragIsGreaterThan0();
        await this.page.reload();
        await this.rahmenbudgetPage.verifyUnterstutzungsbetragIsGreaterThan0();
    }

    async A02_AnspruchPruefung_Bedarfspruefung_FEV({ dossier, entscheidVon, begruendung, unterstuetzungAb, kontoVerbindung }: { dossier: string; entscheidVon: string; begruendung: string; unterstuetzungAb: string; kontoVerbindung: string }) {
        console.log(`🔍 [A02] Starting FEV workflow for dossier: ${dossier}`);

        await this.navigationPage.searchDossier(dossier);
        await this.navigationPage.openMenuNav();
        await this.bedarfsprufungPage.clickBedarfNavLink();
        await this.bedarfsprufungPage.clickBedarfEraBtn();
        await this.bedarfsprufungPage.clickEintreTab();
        await this.bedarfsprufungPage.selectEintreRadioBtn();
        await this.bedarfsprufungPage.inputEntscheidVom(entscheidVon);
        await this.bedarfsprufungPage.inputBegrundung(begruendung);
        await this.bedarfsprufungPage.clickBedarfsprufungSichernBtn();
        await this.bedarfsprufungPage.clickFreiwilligeEinkommensverwaltung(unterstuetzungAb, kontoVerbindung);
        await this.bedarfsprufungPage.validateLeistungErfassen(kontoVerbindung);
    }
}
