import { Page } from "@playwright/test";
import { InstitutionenstammPage } from "../pages/institutionenstamm-page";

export class InstitutionenstammKeyword {
    page: Page;
    institutionenstammPage: InstitutionenstammPage;
    constructor(page: Page) {
        this.page = page;
        this.institutionenstammPage = new InstitutionenstammPage(page);
    }

    async KO01_Institution_erfassen({ instName, namenZusatz, zusatz, strasse, hausNum, telNummer, email, ort, postfach, website, typisierung, gueltigVon, gueltigBis }) {
        await this.institutionenstammPage.goToInstitutionPage();
        await this.institutionenstammPage.addNewInstitution(instName, namenZusatz, zusatz, strasse, hausNum, telNummer, email, ort, postfach, website, typisierung, gueltigVon, gueltigBis);
        await this.institutionenstammPage.searchInstitutionByName(instName);
        await this.institutionenstammPage.validateInstitution(instName);
    }
    async KO02_Fachperson_erfassen({ vorname, fachPersName, namenZusatz, zusatz, strasse, geschlecht, hausNum, telNummer, email, ort, postfach, website, typisierung, gueltigVon, gueltigBis }) {
        await this.institutionenstammPage.goToInstitutionPage();
        await this.institutionenstammPage.addNewFachperson(vorname, fachPersName, namenZusatz, zusatz, strasse, geschlecht, hausNum, telNummer, email, ort, postfach, website, typisierung, gueltigVon, gueltigBis);
        await this.institutionenstammPage.searchFachpersonByName(vorname, fachPersName);
        await this.institutionenstammPage.validateFachperson(vorname, fachPersName);
    }
    async KO02b_Fachperson_loeschen({ suche, gueltigVon, gueltigBis }) {
        await this.institutionenstammPage.goToInstitutionPage();
        await this.institutionenstammPage.searchForFachperson(suche);
        await this.institutionenstammPage.deleteFachperson(suche, gueltigVon, gueltigBis);
    }
}
