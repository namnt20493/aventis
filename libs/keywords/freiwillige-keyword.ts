import { FreiwilligePage } from "../pages/freiwillige-page";
import { NavigationPage } from "../pages/navigation-page";
import { Page } from "@playwright/test";

export class FreiwilligeKeyword {
    page: Page;
    navigationPage: NavigationPage;
    freiwilligePage: FreiwilligePage;
    constructor(page: Page) {
        this.page = page;
        this.navigationPage = new NavigationPage(page);
        this.freiwilligePage = new FreiwilligePage(page);
    }

    async FE01_FEV_BudgetPosition_New({ dossier, konto, beschreibung, betragMonatl, geplantAb, geplantBis, zahlMethode, zahlungsEmpfang, zahlungsVerbindung, periode, referenzScor, mitteilung }) {
        await this.navigationPage.searchDossier(dossier);
        await this.freiwilligePage.goToBudgetLink();
        await this.freiwilligePage.createNewPosition(konto, beschreibung, betragMonatl, geplantAb, geplantBis, zahlMethode, zahlungsEmpfang, zahlungsVerbindung, periode, referenzScor, mitteilung);
        await this.freiwilligePage.validateValue(beschreibung, betragMonatl, geplantAb);
    }
    async FE02_FEV_Budget_Anzeige({ dossier, beschreibung, zahlEmpf, zahlMeth, konto, gueltigkeit, zahlVerbinudung, periode, betrag, total }) {
        await this.navigationPage.searchDossier(dossier);
        await this.freiwilligePage.goToBudgetLink();
        await this.freiwilligePage.selectHeader();
        await this.freiwilligePage.validateBudget(beschreibung, zahlEmpf, zahlMeth, konto, gueltigkeit, zahlVerbinudung, periode, betrag, total);
    }
    async FE03_FEV_Zahlungen_freigeben({ dossier, ausgewaehltePosSum, saldoVorschau, clickAuswahlFreigeben }) {
        await this.navigationPage.searchDossier(dossier);
        await this.freiwilligePage.goToZahlungenLink();
        await this.freiwilligePage.clickCheckbox();
        await this.freiwilligePage.clickAuswahlFreigeben(ausgewaehltePosSum, saldoVorschau, clickAuswahlFreigeben);
    }
}
