import { NavigationPage } from "../pages/navigation-page";
import { Page } from "@playwright/test";
import { VorlagenErafassenPage } from "../pages/vorlagenErafassen-page";
import { DocumentPage } from "../pages/document-page";

export class VorlagenKeyword {
    page: Page;
    navigation: NavigationPage;
    vorlagenPage: VorlagenErafassenPage;
    documentPage: DocumentPage;

    constructor(page: Page) {
        this.page = page;
        this.navigation = new NavigationPage(page);
        this.vorlagenPage = new VorlagenErafassenPage(page);
        this.documentPage = new DocumentPage(page);
    }
    async KO03_Vorlage_erfassen({ datei, vorlageBez, verwKontext, vorlageSprache, gueltigVon, gueltigBis, erlaueterung, dossierRegion }) {
        await this.vorlagenPage.goToVorlagenErfassen();
        await this.vorlagenPage.addNewVorlagen(datei, vorlageBez, verwKontext, vorlageSprache, gueltigVon, gueltigBis, erlaueterung, dossierRegion);
        await this.vorlagenPage.searchVorlagen(verwKontext, vorlageSprache, gueltigVon, vorlageBez);
    }
    async KO03b_Vorlage_loeschen({ vorlageBez, verwKontext, vorlageSprache }) {
        await this.vorlagenPage.goToVorlagenErfassen();
        await this.vorlagenPage.deleteRow(vorlageBez, verwKontext, vorlageSprache);
    }
    async KO03b_Vorlage_loeschen_IfExists({ vorlageBez, verwKontext, vorlageSprache }): Promise<boolean> {
        await this.vorlagenPage.goToVorlagenErfassen();
        return await this.vorlagenPage.deleteRowIfExists(vorlageBez, verwKontext, vorlageSprache);
    }
}
