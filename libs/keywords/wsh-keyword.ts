import { Page } from "@playwright/test";

import { NavigationPage } from "../pages/navigation-page";
import { WSHPage } from "../pages/wsh-page";
import { KontoauszugPage } from "../pages/kontoauszug-page";

export class WSHKeyword {
    private readonly page: Page;
    private readonly wshPage: WSHPage;
    private readonly navigation: NavigationPage;
    kontoauszug: KontoauszugPage;

    constructor(page: Page) {
        this.page = page;
        this.wshPage = new WSHPage(page);
        this.navigation = new NavigationPage(page);
        this.kontoauszug = new KontoauszugPage(page);
    }
    async WSH05_Haftung_Sozialhilfeschuld_Bearbeiten({ haftungsType, haftungDurch, haftungVon, haftungBis, haftungFuer, person1, person2 }) {
        // Navigate to WSH Übersicht - first open the menu
        await this.navigation.openMenuNav();
        await this.page.waitForTimeout(500);

        // Find the WSH Übersicht link directly - it has a unique href pattern with /wsh/ and /uebersicht
        const wshUebersichtLink = this.page.locator("a[href*='/wsh/'][href$='/uebersicht']");

        if (await wshUebersichtLink.isVisible({ timeout: 5000 }).catch(() => false)) {
            console.log("Found WSH Übersicht link, clicking...");
            await wshUebersichtLink.click();
        } else {
            // If not visible, try to expand the WSH section first
            console.log("WSH Übersicht link not visible, trying to expand WSH section...");
            const wshButton = this.page.getByRole("button", { name: /^Wirtschaftliche Sozialhilfe$/i });
            if (await wshButton.isVisible({ timeout: 3000 }).catch(() => false)) {
                await wshButton.click();
                await this.page.waitForTimeout(500);

                // Now try clicking the link again
                if (await wshUebersichtLink.isVisible({ timeout: 3000 }).catch(() => false)) {
                    await wshUebersichtLink.click();
                }
            }
        }

        await this.navigation.waitForPageReady();

        // Wait for the WSH Widget to be visible
        const wshWidget = this.page.locator("app-card-header").filter({ hasText: /Unterstützungseinheit WSH|Unité d'assistance ASE/i });
        await wshWidget.waitFor({ state: "visible", timeout: 10000 });

        await this.wshPage.addHaftungSozialhilfeschuldBearbeiten(haftungsType, haftungDurch, haftungVon, haftungBis, haftungFuer, person1, person2);
    }
    async WSH04_Rueckforderung_erfassen_persoenlich({ titel, rueckModus, datum, verJahrung, betrag, schuldner, monatlicherBetrag, erstmalig, dateiPfad, begruendung }) {
        //20.06.2025 replace with openMenuNav to prevent the error "Navigation timeout of 30000 ms exceeded"
        await this.navigation.openMenuNav();
        await this.wshPage.goToWirtschaftlicheSozialhilfe();
        await this.wshPage.addNewPersonlicheRuckerstattungErfassen();
        await this.wshPage.fillInfoPersonlicheRuckerstattungErfassen(titel, rueckModus, datum, verJahrung, betrag, schuldner, monatlicherBetrag, erstmalig, dateiPfad, begruendung);
        await this.wshPage.checkTotalAtTheEnd(titel, datum, betrag);
    }
    async WSH06_Kontoauszug_Sozialhilfeschuld_Berechnen({ stichDatum, dossier, person, solidarSchuld, einzelSchuld, sozialHilfeSchuld }) {
        await this.navigation.searchDossier(dossier);
        await this.navigation.openKontoauszugLink();
        await this.wshPage.openSozialhilfeschuldPage();
        await this.wshPage.fillBisValutaDatum(stichDatum);
        await this.wshPage.BtnSozialhilfeschuldBerechnen();
        await this.wshPage.checkTotalSolidarschuldExisted(person, einzelSchuld, solidarSchuld, sozialHilfeSchuld);
    }
    async WSH09_Unterstuetzung_ende_UE({ dossier, letzerMonat, grundBFS }) {
        await this.navigation.searchDossier(dossier);
        await this.navigation.openUbersichtLink();
        await this.wshPage.openUnterstutzungBeenden();
        await this.wshPage.fillValueUnterstuetzung(letzerMonat, grundBFS);
        await this.wshPage.checkDateString(letzerMonat);
        await this.wshPage.checkTimeLineUnterstuetzung();
    }
    async WSH08_Kontoauszug_Sozialhilfeschuld_Bescheinigen({ stichDatum, dossier, klient, bescheinigungsArt }) {
        await this.navigation.searchDossier(dossier);
        await this.kontoauszug.goToSozialhilfeschuldTab();
        await this.kontoauszug.inputSozialhifeschuldSearch(stichDatum);
        await this.kontoauszug.sozialhilfeschuldBescheinigungen(klient, bescheinigungsArt, stichDatum);
        await this.kontoauszug.validateSozialhilfeschuldInfo(klient, stichDatum);
    }
    async WSH08b_Kontoauszug_Sozialhilfeschuld_Buchhaltung({ stichDatum, klient, sozialHilfeSchuld }) {
        await this.navigation.gotoSozialhilfeschuld();
        await this.wshPage.selectKlient(stichDatum, klient);
        await this.wshPage.validateTotalSolidarschuld(sozialHilfeSchuld);
    }
    async WSH10_Weiterverrechnung({ dossier, gultVon, gultBis, weiterVerRechnArt, betrPerson }) {
        await this.navigation.searchDossier(dossier);
        await this.navigation.openUbersichtLink();
        await this.wshPage.editWeiterverrechnung();
        await this.wshPage.fillValueWeiterverrechnung(gultVon, gultBis, weiterVerRechnArt, betrPerson);
        await this.wshPage.checkTotalEnd(gultBis, weiterVerRechnArt, betrPerson);
    }
}
