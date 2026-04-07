import { Page, Locator, expect } from "@playwright/test";
import { NavigationPage } from "./navigation-page";
import { CommonPage } from "./common-page";
import { StabilityHelper } from "@utils/stability-helper";

export class DossierprufungPage {
    page: Page;
    private stabilityHelper: StabilityHelper;
    navigation: NavigationPage;
    anspruchsprufungField: Locator;
    dossierprufungNavlink: Locator;
    dossierPanel: Locator;
    dossierprufungEditbtn: Locator;
    pruferSelection: Locator;
    statusSelection: Locator;
    datumTextbox: Locator;
    beanstandungsErfassenBtn: Locator;
    aufgabentitel: Locator;
    falligkeitsdatum: Locator;
    zugewiesene: Locator;
    aufgabeErfassen: Locator;
    speichernBtn: Locator;
    dossierprufungStarten: Locator;
    common: CommonPage;
    dossierListeNavlink: Locator;
    listenField: Locator;
    dossierInput: Locator;
    zustanTeam: Locator;
    menuVertical: Locator;
    deleteBtn: Locator;
    menu: any;
    abbrechenBtn: Locator;
    zustanSar: Locator;
    zustanTeamSearch: Locator;
    constructor(page: Page) {
        this.page = page;
        this.stabilityHelper = new StabilityHelper(page);
        this.navigation = new NavigationPage(page);
        this.common = new CommonPage(page);
        this.anspruchsprufungField = page.getByRole("button", {
            name: /Anspruchsprüfung|Evaluation des droits/i
        });
        this.dossierprufungNavlink = page.getByRole("link", {
            name: /Dossierprüfung|Contrôle du dossier/i
        });
        this.dossierPanel = page.locator("app-expansion-panel").first();
        this.listenField = page.getByRole("button", { name: /Listen|Listes/i });
        this.dossierListeNavlink = page.getByRole("link", {
            name: /Dossierliste|Liste des dossiers/i
        });
        this.dossierprufungStarten = page.getByRole("button", {
            name: /Dossierprüfung starten|Démarrer le contrôle de dossier/i
        });
        this.dossierprufungEditbtn = page
            .locator("app-expansion-panel button")
            .filter({ has: this.page.locator("mat-icon[data-mat-icon-name='edit']") })
            .first();
        this.pruferSelection = this.dossierPanel.getByTestId("userId_Pruefer").getByTestId("root-control");
        this.statusSelection = this.dossierPanel.getByTestId("status").getByTestId("root-control");
        this.datumTextbox = this.dossierPanel.getByTestId("abschlussAm").getByTestId("root-control");
        this.beanstandungsErfassenBtn = this.dossierPanel.getByRole("button", {
            name: /Beanstandungs-Aufgabe erfassen|Saisir une tâche de contestation/i
        });
        this.aufgabentitel = this.dossierPanel.getByTestId("inline-aufgabentitel").getByTestId("root-control");
        this.falligkeitsdatum = this.dossierPanel.getByTestId("inline-faelligkeitsdatum").getByTestId("root-control");
        this.zugewiesene = this.dossierPanel.getByTestId("inline-user").getByTestId("root-control");
        this.aufgabeErfassen = this.dossierPanel.getByRole("button", {
            name: /Aufgabe erfassen|Ajouter une tâche/i
        });
        this.speichernBtn = this.dossierPanel.getByRole("button", {
            name: /Dossierprüfung speichern|Enregistrer le contrôle de dossier/i
        });
        this.dossierInput = page.getByTestId("searchInDossierbezeichnung").getByTestId("root-control");
        this.zustanSar = page.getByTestId("zustaendigkeit_SarSbIds").getByTestId("root-control");
        this.menuVertical = page
            .locator("app-expansion-panel button")
            .filter({
                has: this.page.locator("mat-icon[data-mat-icon-name='menu_vertical']")
            })
            .first();
        this.deleteBtn = page.getByRole("button", {
            name: /Dossierprüfung löschen|Supprimer le contrôle de dossier/i
        });
        this.abbrechenBtn = page.getByRole("button", {
            name: /Abbrechen|Annuler/i
        });
        this.zustanTeam = page.getByTestId("zustaendigkeit_TeamIds").getByTestId("internalDataFormControl");
        this.zustanTeamSearch = page.getByTestId("zustaendigkeit_TeamIds").getByTestId("root-control");
    }
    async validateDossierprufung() {
        await expect.soft(this.dossierPanel).toContainText(/Dossierprüfung|Contrôle du dossier/i);
        await expect.soft(this.dossierPanel).toContainText(/In Bearbeitung|En cours/i);
    }
    async createNewDossierprufung() {
        await this.dossierprufungStarten.click();
        await this.navigation.waitForPageReady();
    }
    async deleteDossierprufung() {
        await this.menuVertical.click();
        await this.deleteBtn.click();
    }

    async goTodossierliste() {
        await this.navigation.menuDropdown.first().click();
        await this.navigation.dossierfuhrungMenuList.click();
        await this.navigation.dossierMenuItem.click();
        await this.navigation.dossierListe.click();
    }

    async searchDossier(dossier: string, zustTeam: string) {
        await this.page.reload();
        await this.dossierInput.clear();
        await this.dossierInput.pressSequentially(dossier);
        const removeBtns = await this.zustanTeam.locator("button").count();
        for (let i = 0; i < removeBtns; i++) {
            await this.zustanTeam.locator("button").nth(i).click();
        }
        await this.zustanTeamSearch.clear();
        await this.zustanTeamSearch.pressSequentially(zustTeam, { delay: 100 });
        await this.page.locator(`mat-option:has-text('${zustTeam}')`).waitFor({ state: "visible" });
        await this.page.locator(`mat-option:has-text('${zustTeam}')`).click();
        await this.common.waitForApiHelper(this.page, "DossierListeQuery", async () => {});
        try {
            await this.page.locator(`tbody tr:has-text('${dossier}')`).first().waitFor({ state: "visible", timeout: 5000 });
        } catch {
            await this.dossierInput.clear();
            await this.dossierInput.pressSequentially(dossier);
        }
        const dossierLink = this.page.locator(`tbody td a:has-text("${dossier}")`).first();
        await dossierLink.click();
        await this.page.waitForURL(/\/dossiers\//);
        await this.navigation.waitForPageReady();
    }
    async goToDossierprufung() {
        await this.navigation.openMenuNav();
        await this.dossierprufungNavlink.click();
    }
    async startenDossierprufung(pruefer: string, status: string) {
        await this.page.reload();
        await this.dossierprufungEditbtn.click();
        await this.pruferSelection.click();
        await this.pruferSelection.pressSequentially(pruefer, { delay: 100 });
        await this.page.locator(`mat-option:has-text('${pruefer}')`).click();
        await this.statusSelection.click();
        await this.page.locator(`mat-option:has-text('${status}')`).click();
    }
    async selectKontrollierende(kontrollPunkte: string) {
        const kontrolls = this.common.separateText(kontrollPunkte);
        for (const kontroll of kontrolls) {
            await this.dossierPanel
                .locator("mat-checkbox")
                .filter({ hasText: `${kontroll}` })
                .locator("input")
                .check();
        }
    }
    async createNewBeanstandungs(aufgabeTitel: string, falligDatum: string, zugMitarbeiter: string) {
        await this.beanstandungsErfassenBtn.click();
        await this.aufgabentitel.fill(aufgabeTitel);
        await this.falligkeitsdatum.fill(falligDatum);
        await this.zugewiesene.click({ force: true });
        await this.page.locator(`mat-option:has-text('${zugMitarbeiter}')`).click();
        await this.aufgabeErfassen.click();
        await this.stabilityHelper.stableClick(this.speichernBtn);
    }
}
