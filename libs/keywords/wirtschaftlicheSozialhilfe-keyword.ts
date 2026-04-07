import { Page, Locator, expect } from "@playwright/test";
import { NavigationPage } from "../pages/navigation-page";
import { CommonPage } from "../pages/common-page";
import { WirtschaftlicheSozialhilfePage } from "../pages/wirtschaftlicheSozialhilfe-page";
import { title } from "process";

export class WirtschaftlicheSozialhilfeKeyword {
    page: Page;

    wirtschaftlicheSozialhilfePage: WirtschaftlicheSozialhilfePage;
    navigationPage: NavigationPage;
    commonPage: CommonPage;
    constructor(page: Page) {
        this.page = page;
        this.navigationPage = new NavigationPage(page);
        this.commonPage = new CommonPage(page);
        this.wirtschaftlicheSozialhilfePage = new WirtschaftlicheSozialhilfePage(page);
    }

    async WSH20_Vermoegensverzehr_erfassen({ dossier, klient, titel, datum, betrag, monatBetrag, startDatum, begrundung, divDokumente }) {
        await this.navigationPage.searchDossier(dossier);
        await this.wirtschaftlicheSozialhilfePage.goToVermogensverzehr();
        await this.wirtschaftlicheSozialhilfePage.createNewVermogensverzehr();
        await this.wirtschaftlicheSozialhilfePage.fillVermogensverzehrForm(titel, datum, betrag, monatBetrag, startDatum, klient, begrundung);
        await this.wirtschaftlicheSozialhilfePage.uploadFile(divDokumente);
        await this.wirtschaftlicheSozialhilfePage.saveVermogensverzehr();
    }
    async WSH04b_Rueckforderung_erfassen_persoenlich_missbrauch({ dossier, titel, rueckModus, datum, verJahrung, betrag, schuldner, monatlicherBetrag, erstmalig, dateiPfad, begruendung }) {
        await this.navigationPage.searchDossier(dossier);
        await this.wirtschaftlicheSozialhilfePage.goToVermogensverzehr();
        await this.wirtschaftlicheSozialhilfePage.createNewRuckerstattung();
        await this.wirtschaftlicheSozialhilfePage.fillRuckerstattungBei(titel, rueckModus, datum, verJahrung, betrag, monatlicherBetrag, erstmalig, schuldner, begruendung);
        await this.wirtschaftlicheSozialhilfePage.uploadFile(dateiPfad);
        await this.wirtschaftlicheSozialhilfePage.saveRuckerstattung();
        await this.wirtschaftlicheSozialhilfePage.validateNewRuckerstattung(titel);
    }
}
