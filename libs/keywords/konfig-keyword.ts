import { start } from "repl";
import { Page } from "@playwright/test";
import { KonfigPage } from "../pages/konfig-page";
import { NavigationPage } from "../pages/navigation-page";
export class AufgabenKeyword {
    page: Page;
    konfigPage: KonfigPage;
    navigationPage: NavigationPage;
    constructor(page: Page) {
        this.page = page;
        this.konfigPage = new KonfigPage(page);
        this.navigationPage = new NavigationPage(page);
    }
    async KBR0_Konfig_Benutzer_RollenRechteSetzen({ userName, role }) {
        await this.navigationPage.openBenutzerMenu();
        await this.konfigPage.benutzerTag();
        await this.konfigPage.selectRole(userName, role);
    }
}
