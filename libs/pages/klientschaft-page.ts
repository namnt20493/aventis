import { Page, Locator, expect } from "@playwright/test";
import * as path from "path";
import { CommonPage } from "./common-page";
import { NavigationPage } from "./navigation-page";
import { StabilityHelper } from "@utils/stability-helper";

export class KlientschaftPage {
    page: Page;
    klientschaftNavLink: any;
    bewilligungOffnen: Locator;
    anfragenBtn!: Locator;
    bewilligungsanfrage: Locator;
    angefragtLabel!: Locator;
    bewilligenBtn!: Locator;
    status: Locator;
    erwerbseinkommenMenu: Locator;
    erwerbslohnMenuItem: Locator;
    zahlbarDurch: Locator;
    arbeitspensumTxtbox: Locator;
    betragTxtbox: Locator;
    gultigVonTxtbox: Locator;
    gultigBisTxtbox: Locator;
    erhaltCheckbox: Locator;
    spichernBtn: Locator;
    ausbildungslohnMenuItem: Locator;
    rentenMenu: Locator;
    ahvErwachsenenrenteMenuItem: Locator;
    ansprucheGegenuberDrittenMenu: Locator;
    arbeitslosenentschadigungMenuItem: Locator;
    kinderunterhaltMenuItem: Locator;
    ivErwachsenenrente: Locator;
    kinderzulage: Locator;
    vermogenEditBtn: Locator;
    vermogenErfassenBtn: Locator;
    kontoMenuItem: Locator;
    eigentumswohnungMenuItem: Locator;
    autoMenuItem: Locator;
    bezeichnungTxtbox: Locator;
    stichtagTxtbox: Locator;
    glaubigerTxtbox: Locator;
    maximaleTxtbox: Locator;
    beziehungenEditBtn: Locator;
    beziehungErfassenBtn: Locator;
    beziehungCombobox: Locator;
    klientschaftComboBox: Locator;
    uploadFileInput: Locator;
    uploadFileKrankenversicherungenInput: Locator;
    gultigkeitStartDateVVG: Locator;
    gultigkeitEndDateVVG: Locator;
    comboBoxKrankenkasseVVG: Locator;
    textBoxVersichertenVVG: Locator;
    textBoxGrundpramieVVG: Locator;
    checkBoxJaVVG: Locator;
    textBoxFranchiseVVG: Locator;
    textBoxBemerkungVVG: Locator;
    BtnKrankenversicherung: Locator;
    btnVVG: Locator;
    btnIPV: Locator;
    gultigkeitStartDateIPV: Locator;
    gultigkeitEndDateIPV: Locator;
    btnKrankenversicherungenEdit: Locator;
    btnKVG: Locator;
    gultigkeitStartDateKVG: Locator;
    gultigkeitEndDateKVG: Locator;
    comboBoxKrankenkasseKVG: Locator;
    textBoxVersichertenKVG: Locator;
    textBoxGrundpramieKVG: Locator;
    checkBoxJaKVG: Locator;
    textBoxFranchiseKVG: Locator;
    textBoxBemerkungKVG: Locator;
    uploadFileVVGInput: Locator;
    uploadFileCard: Locator;
    klientschaftNavBtn!: Locator;
    ibanAppCardBtn: Locator;
    zahlungensverbindungErfassenBtn: Locator;
    ibanInputTxtbox: Locator;
    strasseInputTxtbox: Locator;
    hauNrInputTxtbox: Locator;
    postfactInputTxtbox: Locator;
    ortInputTxtbox: Locator;
    betragVermogen: Locator;
    nationalitatTxtBox: Locator;
    geschlechtTxtBox: Locator;
    zivilstandTxtBox: Locator;
    korrespondenzspracheTxtBox: Locator;
    todesdatumTxtBox: Locator;
    btnEditKommunikation: Locator;
    mainChannelBtn: Locator;
    btnEinnahmeErfassen: Locator;
    btnEditPanel: Locator;
    commonPage: CommonPage;
    navigation: NavigationPage;
    stabilityHelper: StabilityHelper;
    schuldenErafassenBtn: Locator;
    vermogenMenuItem: Locator;
    btnHypothetischesEinkommen: Locator;
    scheweregradTxtbox: Locator;
    btnEditAusbildung: Locator;
    hochsteAusbildungSelect: Locator;
    anzahlJahreTxtbox: Locator;

    constructor(page: Page) {
        this.page = page;
        this.commonPage = new CommonPage(page);
        this.navigation = new NavigationPage(page);
        this.stabilityHelper = new StabilityHelper(page);
        // this.bewilligungOffnen = page.getByRole("link", { name: /Bewilligung öffnen|Ouvrir la validation/i });
        this.bewilligungOffnen = page.locator("app-approval-workflow-open-button").first().locator("a");
        this.bewilligungsanfrage = page.locator("mat-stepper").first();
        this.btnEinnahmeErfassen = page
            .getByRole("button", {
                name: /Einnahme erfassen|Arbeitssituation erfassen|Einnahmen/i
            })
            .last();
        // this.status = page.locator("span[aria-label=]:visible");
        this.status = page.getByLabel(/Status|Statut/i);
        this.erwerbseinkommenMenu = page.getByRole("menuitem", {
            name: /Erwerbseinkommen|Revenu de l'activité lucrative/i
        });
        this.rentenMenu = page.getByRole("menuitem", {
            name: /Sozialversicherungsleistungen|Renten/i
        });
        this.ansprucheGegenuberDrittenMenu = page.getByRole("menuitem", {
            name: /Ansprüche gegenüber Dritten|Prétentions envers des tiers/i
        });
        //12.6 change label
        this.erwerbslohnMenuItem = page.getByRole("button", {
            name: /^Unselbständiges Erwerbseinkommen|Revenus gagnés|^Unselbständiger Erwerbslohn|Actif occupé, salarié/i,
            exact: true
        });
        this.ahvErwachsenenrenteMenuItem = page.getByRole("button", {
            name: /AHV Leistungen|Prestation AVS|AVS Rente d'adulte/i
        });
        this.ausbildungslohnMenuItem = page.getByRole("button", {
            name: /Ausbildungslohn|Salaire de formation/i
        });
        this.arbeitslosenentschadigungMenuItem = page.getByRole("button", {
            name: /ALV-Taggeld|Indemnité de chômage/i
        });
        this.kinderunterhaltMenuItem = page.getByRole("button", {
            name: /Unterhaltsbeiträge Kinder|Pensions alimentaires des enfants/i
        });
        this.ivErwachsenenrente = page.getByRole("button", {
            name: /IV Erwachsenenrente|Rente AI pour adulte|Prestation AI|IV Leistungen/i
        });
        this.kinderzulage = page.getByRole("button", {
            name: /Kinderzulage|Allocations familiales/i
        });
        this.zahlbarDurch = page.getByTestId("bezahler").getByTestId("root-control").last();
        this.arbeitspensumTxtbox = page.getByTestId("pensumProzent").getByTestId("root-control").last();
        this.betragTxtbox = page.getByTestId("betragMonatlich").getByTestId("root-control").last();
        this.betragVermogen = page.getByTestId("betrag").getByTestId("root-control").last();
        this.gultigVonTxtbox = page.getByTestId("validFrom").getByTestId("root-control").last();
        this.gultigBisTxtbox = page.getByTestId("validThrough").getByTestId("root-control").last();
        this.erhaltCheckbox = page.getByTestId("dreizehnterMonatslohn").locator("input").last();
        this.spichernBtn = page.getByRole("button", {
            name: /Speichern|Enregistrer/i
        });
        this.vermogenEditBtn = page.getByRole("button", { name: /Vermögen \/ Schulden|Fortune \/ Dettes/i }).getByRole("button", { name: "bearbeiten" });
        this.beziehungenEditBtn = page.getByRole("button", { name: /Beziehungen|Relations/i }).getByRole("button", { name: "bearbeiten" });
        this.vermogenErfassenBtn = page.getByRole("button", {
            name: /Vermögen erfassen|Saisir la fortune/i
        });
        this.kontoMenuItem = page.getByRole("button", { name: /Konto|Compte/i });
        this.eigentumswohnungMenuItem = page.getByRole("button", {
            name: /Eigentumswohnung oder Eigenheim|Appartement en copropriété ou maison individuelle/i
        });
        this.autoMenuItem = page.getByRole("button", { name: /Auto|Voiture/i });
        this.bezeichnungTxtbox = page.getByTestId("bezeichnung").getByTestId("root-control").last();
        this.stichtagTxtbox = page.getByTestId("stichtag").getByTestId("root-control").last();
        this.glaubigerTxtbox = page.getByTestId("grundpfandGlaeubiger").getByTestId("root-control").last();
        this.maximaleTxtbox = page.getByTestId("grundpfandMaximalGesicherteForderung").getByTestId("root-control").last();
        this.beziehungErfassenBtn = page.getByRole("button", {
            name: /Beziehung erfassen|Saisir une relation/i
        });
        this.beziehungCombobox = page.getByTestId("beziehungsart").getByTestId("root-control").last();
        this.klientschaftComboBox = page.getByTestId("personInDossierId").getByTestId("root-control").last();
        this.uploadFileKrankenversicherungenInput = page.getByTestId("file_Police").locator("input").first();
        this.uploadFileVVGInput = page.getByTestId("file_Police").locator("input").last();
        this.ibanAppCardBtn = page.locator("app-iban-card");
        this.ibanInputTxtbox = page.getByTestId("iban").getByTestId("root-control");
        this.zahlungensverbindungErfassenBtn = page.locator("button[type='submit']");
        this.uploadFileInput = page.locator("app-file-upload-card:has-text('Diverse Dokumente') input[type='file']").last();
        this.uploadFileCard = page.locator("app-file-upload-card:has-text('Diverse Dokumente')").last();
        this.gultigkeitStartDateVVG = page.getByTestId("krankenversicherungVvg-card").last().getByTestId("root-control").last();
        this.gultigkeitEndDateVVG = page.getByTestId("krankenversicherungVvg-card").last().getByTestId("root-control").last();
        this.comboBoxKrankenkasseVVG = page.getByTestId("krankenversicherungVvg-card").last().getByTestId("institutionId_Krankenkasse").getByTestId("root-control");
        this.textBoxVersichertenVVG = page.getByTestId("krankenversicherungVvg-card").last().getByTestId("versichertennummer").getByTestId("root-control");
        this.textBoxGrundpramieVVG = page.getByTestId("krankenversicherungVvg-card").last().getByTestId("grundpraemie").getByTestId("root-control");
        this.checkBoxJaVVG = page.getByTestId("krankenversicherungVvg-card").last().getByTestId("mitZahnversicherung").locator("input").first();
        this.textBoxFranchiseVVG = page.getByTestId("krankenversicherungVvg-card").last().getByTestId("franchiseBetrag").getByTestId("root-control");
        this.textBoxBemerkungVVG = page.getByTestId("krankenversicherungVvg-card").last().getByTestId("bemerkung").getByTestId("root-control");
        this.BtnKrankenversicherung = page.getByRole("button", {
            name: /Krankenversicherung erfassen|Assurances maladie/i
        });
        this.btnVVG = page.getByRole("button", { name: /VVG|LCA/i }).last();
        this.btnIPV = page.getByRole("button", { name: "IPV-Anmeldung" });
        this.gultigkeitStartDateIPV = page.getByRole("group", { name: "Gültigkeit" }).last().getByRole("textbox", { name: "" }).first();
        this.gultigkeitEndDateIPV = page.getByRole("group", { name: "Gültigkeit" }).last().getByRole("textbox", { name: "" }).last();
        this.btnKrankenversicherungenEdit = page
            .getByRole("button", {
                name: /Krankenversicherungen|Assurances maladie/i
            })
            .getByLabel("bearbeiten");
        this.btnKVG = page.getByRole("button", { name: /KVG|LAMal/i });
        this.gultigkeitStartDateKVG = page.getByTestId("krankenversicherungKvg-card").getByTestId("root-control").last();
        this.gultigkeitEndDateKVG = page.getByTestId("krankenversicherungKvg-card").getByTestId("root-control").last();
        this.comboBoxKrankenkasseKVG = page.getByTestId("krankenversicherungKvg-card").getByTestId("institutionId_Krankenkasse").getByTestId("root-control");
        this.textBoxVersichertenKVG = page.getByTestId("krankenversicherungKvg-card").getByTestId("versichertennummer").getByTestId("root-control");
        this.textBoxGrundpramieKVG = page.getByTestId("krankenversicherungKvg-card").getByTestId("grundpraemie").getByTestId("root-control");
        this.checkBoxJaKVG = page.getByTestId("krankenversicherungKvg-card").getByTestId("hatUnfallversicherung").locator("input").last();
        this.textBoxFranchiseKVG = page.getByTestId("krankenversicherungKvg-card").getByTestId("franchiseBetrag").getByTestId("root-control");
        this.textBoxBemerkungKVG = page.getByTestId("krankenversicherungKvg-card").getByTestId("bemerkung").getByTestId("root-control");
        this.hauNrInputTxtbox = page.getByTestId("inhaberHausNr").getByTestId("root-control");
        this.strasseInputTxtbox = page.getByTestId("inhaberStrasse").getByTestId("root-control");
        this.postfactInputTxtbox = page.getByTestId("inhaberPostfach").getByTestId("root-control");
        this.ortInputTxtbox = page.getByTestId("inhaberInlandPlzOrt").getByTestId("root-control");
        this.nationalitatTxtBox = page.getByTestId("landId_Nationalitaet").getByTestId("root-control");
        this.geschlechtTxtBox = page.getByTestId("geschlecht").getByTestId("root-control");
        this.zivilstandTxtBox = page.getByTestId("zivilstand").getByTestId("root-control");
        this.korrespondenzspracheTxtBox = page.getByTestId("language_Korrespondenz").getByTestId("root-control");
        this.todesdatumTxtBox = page.getByTestId("todesdatum").getByTestId("root-control");
        this.btnEditKommunikation = page.getByRole("button", { name: /Kommunikation bearbeiten/i }).getByRole("button", { name: "bearbeiten" });
        this.mainChannelBtn = page.locator(".mat-mdc-menu-item-text").first();
        //11/6 add label to btnEditPanel
        this.btnEditPanel = page
            .locator("mat-expansion-panel-header")
            .filter({ hasText: /Einnahmen|recettes/i })
            .locator("button");
        this.schuldenErafassenBtn = page.getByRole("button", {
            name: "Schulden erfassen"
        });
        // this.schuldenErafassenBtn = page.gbr(/Schulden erfassen|Saisir des dettes/i);
        this.vermogenMenuItem = page.getByRole("menuitem", {
            name: /Vermögen\/Hypothetische Einnahmen|Fortune \/ Imputation de la fortune hypothétique/i
        });
        this.btnHypothetischesEinkommen = page.getByRole("button", {
            name: /Hypothetisches Einkommen|Revenu hypothétique/i
        });
        this.scheweregradTxtbox = page.getByTestId("hilflosigkeit").getByTestId("root-control");
        this.btnEditAusbildung = page
            .locator("mat-expansion-panel-header")
            .filter({ hasText: /Berufliche Laufbahn|Formation/i })
            .locator("button");
        this.hochsteAusbildungSelect = page.getByTestId("hoechsteAusbildung").getByTestId("root-control");
        this.anzahlJahreTxtbox = page.getByTestId("anzahlJahreSchule").getByTestId("root-control");

        //
    }
    async editAbtretung(KVG: string, VVG: string) {
        await this.btnKrankenversicherungenEdit.click();
        if (KVG?.toLowerCase() === "yes") {
            const appCard = this.page.getByTestId("krankenversicherungKvg-card");
            await appCard.getByTestId("abgetreten").locator("input").first().click();
        }
        if (VVG?.toLowerCase() === "yes") {
            const appCard = this.page.getByTestId("krankenversicherungVvg-card");
            await appCard.getByTestId("abgetreten").locator("input").first().check();
        }
        await this.spichernBtn.click();
        await this.navigation.waitForSpinnerToDisappear();
        await this.navigation.waitForPageReady();
    }
    async generateDokument(KVG: string, VVG: string) {
        const today = new Date();
        const todayStr = `${today.getDate().toString().padStart(2, "0")}${(today.getMonth() + 1).toString().padStart(2, "0")}${today.getFullYear()}`;
        if (KVG?.toLowerCase() === "yes") {
            const appCard = this.page.locator("app-krankenversicherungen-widget-readonly app-card").filter({ hasText: /KVG|LAMal/i });
            await appCard
                .locator("app-dokument-generieren")
                .filter({ hasText: /Abtretung|Cession/i })
                .locator("button")
                .first()
                .click();
            //check download
            const downloadLink = appCard.locator("a").filter({ hasText: "Abtretung_" });
            await expect
                .soft(downloadLink, {
                    message: 'Download link with "Abtretung_" should be found in appCard'
                })
                .toContainText("Abtretung_");
            await expect
                .soft(downloadLink, {
                    message: `Download link should contain today's date: ${todayStr}`
                })
                .toContainText(todayStr);
        }
        if (VVG?.toLowerCase() === "yes") {
            const appCard = this.page.locator("app-krankenversicherungen-widget-readonly app-card").filter({ hasText: /VVG|LCA/i });
            await appCard
                .locator("app-dokument-generieren")
                .filter({ hasText: /Abtretung|Cession/i })
                .locator("button")
                .first()
                .click();
            //check download
            const downloadLink = appCard.locator("a").filter({ hasText: "Abtretung_" });
            await expect
                .soft(downloadLink, {
                    message: 'Download link with "Abtretung_" should be found in appCard'
                })
                .toContainText("Abtretung_");
            await expect
                .soft(downloadLink, {
                    message: `Download link should contain today's date: ${todayStr}`
                })
                .toContainText(todayStr);
        }
    }
    async generateWiderrufAbtretungDokument(KVG: string, VVG: string) {
        const today = new Date();
        const todayStr = `${today.getDate().toString().padStart(2, "0")}${(today.getMonth() + 1).toString().padStart(2, "0")}${today.getFullYear()}`;
        if (KVG?.toLowerCase() === "yes") {
            const appCard = this.page.locator("app-krankenversicherungen-widget-readonly app-card").filter({ hasText: /KVG|LAMal/i });
            await appCard
                .locator("app-dokument-generieren")
                .filter({ hasText: /Widerruf Abtretung/i })
                .locator("button")
                .first()
                .click();
            //check download
            const downloadLink = appCard.locator("a").filter({ hasText: "Abtretungwiderruf_" });
            await expect
                .soft(downloadLink, {
                    message: 'Download link with "Abtretungwiderruf_" should be found in appCard'
                })
                .toContainText("Abtretungwiderruf_");
            await expect
                .soft(downloadLink, {
                    message: `Download link should contain today's date: ${todayStr}`
                })
                .toContainText(todayStr);
        }
        if (VVG?.toLowerCase() === "yes") {
            const appCard = this.page.locator("app-krankenversicherungen-widget-readonly app-card").filter({ hasText: /VVG|LCA/i });
            await appCard
                .locator("app-dokument-generieren")
                .filter({ hasText: /Widerruf Abtretung/i })
                .locator("button")
                .first()
                .click();
            //check download
            const downloadLink = appCard.locator("a").filter({ hasText: "Abtretungwiderruf_" });
            await expect
                .soft(downloadLink, {
                    message: 'Download link with "Abtretungwiderruf_" should be found in appCard'
                })
                .toContainText("Abtretungwiderruf_");
            await expect
                .soft(downloadLink, {
                    message: `Download link should contain today's date: ${todayStr}`
                })
                .toContainText(todayStr);
        }
    }
    async editOffAbtretung(KVG: string, VVG: string) {
        await this.btnKrankenversicherungenEdit.click();
        if (KVG?.toLowerCase() === "yes") {
            const appCard = this.page.getByTestId("krankenversicherungKvg-card");
            await appCard.getByTestId("abgetreten").locator("input").last().click();
        }
        if (VVG?.toLowerCase() === "yes") {
            const appCard = this.page.getByTestId("krankenversicherungVvg-card");
            await appCard.getByTestId("abgetreten").locator("input").last().check();
        }
        await this.spichernBtn.click();
        await this.navigation.waitForSpinnerToDisappear();
        await this.navigation.waitForPageReady();
        const status = this.page.locator("app-readmode-field").filter({ hasText: "Status" });
        //check status
        if (KVG?.toLowerCase() === "yes") {
            const appCardKVG = this.page.locator("app-krankenversicherungen-widget-readonly app-card").filter({ hasText: /KVG|LAMal/i });
            const statusKVG = appCardKVG.locator("app-readmode-field").filter({ hasText: "Status" });
            await expect.soft(statusKVG, { message: 'KVG status should contain "Nein"' }).toContainText("Nein");
        }
        if (VVG?.toLowerCase() === "yes") {
            const appCardKVG = this.page.locator("app-krankenversicherungen-widget-readonly app-card").filter({ hasText: /VVG|LCA/i });
            const statusKVG = appCardKVG.locator("app-readmode-field").filter({ hasText: "Status" });
            await expect.soft(statusKVG, { message: 'VVG status should contain "Nein"' }).toContainText("Nein");
        }
    }

    async waitForApiBW04() {
        await this.page.locator("app-content").waitFor({ state: "visible" });
    }
    async vermoegenEigenheimErfassen(bezeichnung: string, stichtag: string, betrag: string, glaeubiger: string, maximalGrund: string, divDoc: string) {
        await this.vermogenEditBtn.click();
        await this.vermogenErfassenBtn.click();
        await this.eigentumswohnungMenuItem.click();
        await this.bezeichnungTxtbox.pressSequentially(bezeichnung);
        await this.stichtagTxtbox.pressSequentially(stichtag);
        await this.betragVermogen.pressSequentially(betrag);
        await this.glaubigerTxtbox.pressSequentially(glaeubiger);
        await this.maximaleTxtbox.pressSequentially(maximalGrund);
        await this.uploadFileVermogen(divDoc);
        await this.clickBtnSpeichern();
    }
    async uploadFileVermogen(divDoc: string) {
        const cardLocator = this.page
            .locator("app-card")
            .filter({
                hasText: /Eigentumswohnung oder Eigenheim|Appartement en copropriété ou maison individuelle/i
            })
            .last();
        const uploadVermongenLocator = cardLocator
            .locator("app-file-upload-card")
            .filter({ hasText: /Diverse Dokumente|Documents divers/i })
            .last();
        if (divDoc !== "") {
            await this.commonPage.uploadFile(uploadVermongenLocator, divDoc);
        }
    }
    async editAusbildung(hoechstAusbild: string, anzJahre: string) {
        await this.btnEditAusbildung.click();
        await this.hochsteAusbildungSelect.click();
        await this.page.locator(`mat-option:has-text('${hoechstAusbild}')`).click();
        await this.anzahlJahreTxtbox.fill(anzJahre);
        await this.spichernBtn.click();
    }
    async checkAusBildung(hoechstAusbild: string, anzJahre: string) {
        await expect(this.page.locator(`app-berufliche-laufbahn-widget-readonly span:has-text('${hoechstAusbild}')`).first()).toBeVisible();
        await expect(this.page.locator(`app-berufliche-laufbahn-widget-readonly span:has-text('${anzJahre}')`).first()).toBeVisible();
    }

    async selectTopMenu(topMenu: string) {
        const btnExpand = this.page
            .locator("mat-expansion-panel-header")
            .filter({ hasText: /Einnahmen|recettes/i })
            .first();
        const expanded = await btnExpand.getAttribute("aria-expanded");
        if (expanded === "false") {
            await btnExpand.click();
        }
        await this.page
            .locator("app-expansion-panel")
            .filter({ hasText: /Einnahmen|recettes$/i })
            .locator("button")
            .first()
            .click();
        await this.stabilityHelper.stableClick(this.btnEinnahmeErfassen, {
            waitBefore: 500,
            waitAfter: 1000
        });
        const topMenuLocator = this.page.getByRole("menuitem", {
            name: new RegExp(`^${topMenu}$`, "i")
        });
        await topMenuLocator.waitFor({ state: "visible", timeout: 10000 });
        await topMenuLocator.scrollIntoViewIfNeeded();
        await topMenuLocator.click();
    }
    async selectMenuitem(subMenu: string) {
        if (subMenu === "Andere bedarfsabhängige Leistungen (Beihilfen)" || subMenu === "Autres prestations sous condition de ressources (aides)") {
            await this.page
                .getByRole("button", {
                    name: /Andere bedarfsabhängige Leistungen|Autres prestations sous condition de ressources/i
                })
                .click();
        } else {
            await this.page
                .getByRole("button", { name: new RegExp(`${subMenu}`, "i") })
                .first()
                .click();
        }
    }
    async inputErwerbssituationInfo(pensumm: string | null | undefined, zahlbarDurch: string | null | undefined, checkbox: string | null | undefined, betrag: string, gueltigVon: string, gueltigBis: string, diverseDok: string, subMenu: string, schweregrad: string) {
        await this.betragTxtbox.pressSequentially(betrag);
        await this.gultigVonTxtbox.pressSequentially(gueltigVon);
        await this.gultigBisTxtbox.pressSequentially(gueltigBis);

        if (pensumm !== "" && pensumm !== "-" && pensumm !== null && pensumm !== undefined) {
            await this.arbeitspensumTxtbox.last().fill("");
            await this.arbeitspensumTxtbox.last().pressSequentially(pensumm);
        }
        if (checkbox !== "" && checkbox !== "-" && checkbox !== null && checkbox !== undefined) {
            await this.erhaltCheckbox.last().check();
        }
        if (schweregrad !== "" && schweregrad !== "-" && schweregrad !== null && schweregrad !== undefined) {
            await this.scheweregradTxtbox.last().click();
            await this.page.locator(`mat-option:has-text('${schweregrad}')`).click();
        }

        if (diverseDok !== "") {
            await this.commonPage.uploadMultipleFiles(this.page.getByTestId("dokumente").last(), diverseDok);
        }
        if (zahlbarDurch !== "" && zahlbarDurch !== "-" && zahlbarDurch !== null && zahlbarDurch !== undefined) {
            await this.zahlbarDurch.last().clear();
            await this.zahlbarDurch.last().pressSequentially(this.commonPage.getTextBeforeComma(zahlbarDurch));
            await this.page
                .locator(`mat-option:has-text('${this.commonPage.getTextBeforeComma(zahlbarDurch)}')`)
                .first()
                .click();
        }
        await this.spichernBtn.click();
        await this.navigation.waitForSpinnerToDisappear();
    }
    async selectHypEinkommen() {
        await this.btnEditPanel.click();
        await this.stabilityHelper.stableClick(this.btnEinnahmeErfassen, {
            waitBefore: 500,
            waitAfter: 1000
        });
        await this.vermogenMenuItem.click();
        await this.btnHypothetischesEinkommen.click();
    }
    async inputHypothetisches(betrag: string, geplantVon: string, geplantBis: string) {
        await this.betragTxtbox.fill(betrag);
        await this.gultigVonTxtbox.fill(geplantVon);
        await this.gultigBisTxtbox.fill(geplantBis);
    }
    async uploadAbtretung(abTretung: string) {
        if (abTretung !== "") {
            await this.commonPage.uploadMultipleFiles(this.page.getByTestId("file_Abtretung").last(), abTretung);
        }
    }

    async inputSchulden(bezeichnung: string, stichtag: string, betrag: number) {
        await this.bezeichnungTxtbox.fill(bezeichnung);
        await this.stichtagTxtbox.fill(stichtag);
        await this.betragVermogen.fill(betrag.toString());
    }
    async uploadFileSchulden(divDokumente: string) {
        if (divDokumente !== "") {
            await this.commonPage.uploadMultipleFiles(this.page.locator("app-file-upload-card").last(), divDokumente);
        }
    }

    async createNewSchulden(schuldenTyp: string) {
        await this.editVermogen();
        await this.schuldenErafassenBtn.click();
        // Wait for the menu overlay to be visible
        await this.page.locator(".mat-mdc-menu-panel").waitFor({ state: "visible" });
        // Use more specific selector for menu items
        await this.page
            .locator(".mat-mdc-menu-item")
            .filter({ hasText: new RegExp(`^\\s*${schuldenTyp}\\s*$`) })
            .click();
    }

    getTextBeforeComma(str: string): string {
        const index = str.indexOf(",");
        if (index === -1) {
            return str;
        }

        if (/\d$/.test(str.substring(0, index))) {
            return str;
        }
        return str.substring(0, index);
    }
    //-----------------------//
    async clickZalungensverbindungErfassenBtn() {
        await this.zahlungensverbindungErfassenBtn.click();
        await this.navigation.waitForPageReady();
    }
    async inputIBAN(IBAN: string) {
        await this.ibanInputTxtbox.fill(IBAN);
    }
    extractLeadingNumber(input: string): string | null {
        const match = input.trim().match(/^(\d+)/);
        return match ? match[1] : null;
    }
    async inputZahlungensverbindung(strasse: string, HausNr: string, postfach: string, GueltigVon: string, GueltigBis: string, ort: string) {
        await this.strasseInputTxtbox.last().fill(strasse);
        await this.hauNrInputTxtbox.last().fill(HausNr);
        await this.postfactInputTxtbox.last().fill(postfach);
        await this.ortInputTxtbox.last().click({ delay: 1000 });
        await this.ortInputTxtbox.last().fill(this.extractLeadingNumber(ort) ?? "");
        await this.page.locator(`mat-option:has-text("${ort}")`).first().click();
        await this.gultigVonTxtbox.last().fill(GueltigVon);
        await this.gultigBisTxtbox.last().fill(GueltigBis);
    }

    async ClickZahlungensverbindungErfassenAppCard() {
        // await this.ibanAppCardBtn.waitFor({state:'visible'})
        await this.ibanAppCardBtn.click();
    }

    async openKlientschaft(klientschaft: string) {
        await this.klientschaftNavBtn.click();
        await this.page.getByRole("button", { name: `${klientschaft}` }).click();
    }
    async editZahlungsverbindungen() {
        await this.page.locator("mat-expansion-panel-header:has-text('Zahlungsverbindungen') button").click();
    }
    async openKrankenversicherungenEdit() {
        await this.btnKrankenversicherungenEdit.click();
    }
    // VVG From
    async addNewVVGFrom() {
        await this.BtnKrankenversicherung.click();
        await this.btnVVG.click({ delay: 1000 });
    }

    async fillInfoInVVGFrom(gueltigkeit: string, KKasse: string, VersNummer: string, GrundPraemie: string, ZahnInklusive: string, Franchise: string, Bemerkung: string) {
        const dateRange = gueltigkeit;
        const dates = dateRange.split("-").map((date) => date.trim());
        const startDate = dates[0];
        const endDate = dates[1];
        await this.gultigkeitStartDateVVG.fill(`${startDate}`);
        await this.gultigkeitEndDateVVG.fill(`${endDate}`);
        await this.comboBoxKrankenkasseVVG.fill(this.commonPage.getTextBeforeComma(KKasse));
        await this.page
            .getByRole("option", {
                name: `${this.commonPage.getTextBeforeComma(KKasse)}`
            })
            .click();
        await this.textBoxVersichertenVVG.fill(`${VersNummer}`);
        await this.textBoxGrundpramieVVG.fill(`${GrundPraemie}`);
        if (ZahnInklusive === "ja") {
            await this.checkBoxJaVVG.click();
        }
        await this.textBoxFranchiseVVG.fill(`${Franchise}`);
        await this.textBoxBemerkungVVG.fill(`${Bemerkung}`);
    }
    async clickBtnSpeichern() {
        await this.spichernBtn.click();
        //replace waitForTimeout with waitForLocator
        await this.navigation.waitForSpinnerToDisappear();
    }
    async waitResponseKL11b() {
        await this.navigation.waitForSpinnerToDisappear();
        await this.navigation.waitForPageReady();
    }

    //KVG From
    async addNewKVGFrom() {
        await this.BtnKrankenversicherung.click();
        await this.btnKVG.click();
    }

    async fillInfoInKVGFrom(gueltigkeit: string, KKasse: string, VersNummer: string | number, GrundPraemie: string | number, Unfall: string, Franchise: string | number, Bemerkung: string) {
        const dateRange = gueltigkeit;
        const dates = dateRange.split("-").map((date) => date.trim());
        const startDate = dates[0];
        const endDate = dates[1];
        const appCardCount = await this.page.locator("app-krankenversicherungen-widget-editable app-card").count();
        console.log("appCardCount: " + appCardCount);
        await this.page.waitForFunction((expectedCount) => document.querySelectorAll("[data-testid='institutionId_Krankenkasse'] [data-testid='root-control']").length === expectedCount, appCardCount);
        await this.gultigkeitStartDateKVG.last().fill(`${startDate}`);
        await this.gultigkeitEndDateKVG.last().fill(`${endDate}`);
        await this.comboBoxKrankenkasseKVG.last().pressSequentially(this.commonPage.getTextBeforeComma(KKasse));
        await this.page
            .getByRole("option", {
                name: `${this.commonPage.getTextBeforeComma(KKasse)}`
            })
            .click();
        await this.textBoxVersichertenKVG.last().fill(`${VersNummer}`);
        await this.textBoxGrundpramieKVG.last().fill(`${GrundPraemie}`);
        if (Unfall === "ja") {
            await this.checkBoxJaKVG.click();
        }
        await this.textBoxFranchiseKVG.last().fill(`${Franchise}`);
        await this.textBoxBemerkungKVG.last().fill(`${Bemerkung}`);
    }

    //IPV From
    async addNewIPVFrom() {
        await this.BtnKrankenversicherung.click();
        await this.btnIPV.click();
    }

    async fillInfoInIPVFrom(Gueltigkeit: string) {
        const dateRange = Gueltigkeit;
        const dates = dateRange.split("-").map((date) => date.trim());
        const startDate = dates[0];
        const endDate = dates[1];
        await this.gultigkeitStartDateIPV.fill(`${startDate}`);
        await this.gultigkeitEndDateIPV.fill(`${endDate}`);
    }

    //Sorgerecht from
    async openSorgerechtEdit() {
        await this.page.getByRole("button", { name: " Sorgerecht " }).getByLabel("bearbeiten").click();
    }

    async addNewSorgerecht() {
        await this.page.getByRole("button", { name: "Sorgerecht erfassen" }).click();
    }

    async fillInfoSorgerecht(Sorgerecht: string, Betroffener: string, GueltigVon: string, GueltigBis: string, Besuchsrecht: string) {
        if (Sorgerecht !== "") {
            await this.page.getByRole("combobox", { name: "Elterliche Sorge" }).last().click();
            // Try exact match first, then regex, then first option
            const exactOption = this.page.getByRole("option", { name: Sorgerecht });
            const regexOption = this.page.getByRole("option", {
                name: new RegExp(Sorgerecht, "i")
            });
            if ((await exactOption.count()) > 0) {
                await exactOption.click();
            } else if ((await regexOption.count()) > 0) {
                await regexOption.click();
            } else {
                // Fallback: select first available option
                await this.page.getByRole("option").first().click();
            }
        }
        if (Betroffener !== "") {
            await this.page.getByRole("button", { name: "Betroffene Person(en)" }).last().click();
            await this.page.getByRole("option", { name: `${Betroffener}` }).click();
        }
        if (GueltigVon !== "") {
            await this.page.getByRole("textbox", { name: "Gültig von" }).last().fill(`${GueltigVon}`);
        }
        if (GueltigBis !== "") {
            await this.page.getByRole("textbox", { name: "Gültig bis" }).last().fill(`${GueltigBis}`);
        }
        if (Besuchsrecht !== "") {
            await this.page.getByRole("textbox", { name: "Besuchsrecht" }).last().fill(`${Besuchsrecht}`);
        }
    }

    //upload file
    async uploadFile(file: string) {
        // await this.uploadFileCard.click()
        await this.uploadFileInput.setInputFiles(file);
    }

    async uploadKVG(file: string) {
        await this.uploadFileKrankenversicherungenInput.setInputFiles(file);
    }
    async uploadVVG(file: string) {
        await this.uploadFileVVGInput.setInputFiles(file);
    }

    //----------------------------//

    async editBeziehungen() {
        await this.beziehungenEditBtn.click();
    }
    async beziehungErfassen() {
        await this.beziehungErfassenBtn.click();
    }
    async selectBeziehung(beziehung: string) {
        await this.beziehungCombobox.click();
        await this.page.getByRole("option", { name: `${beziehung}`, exact: true }).click();
    }
    async selectKlientschaft(von: string) {
        await this.klientschaftComboBox.click();
        // Try exact match first, then regex match for flexibility
        const exactOption = this.page.getByRole("option", {
            name: von,
            exact: true
        });
        const regexOption = this.page.getByRole("option", {
            name: new RegExp(von.replace(/,/g, ".*"), "i")
        });
        if ((await exactOption.count()) > 0) {
            await exactOption.click();
        } else if ((await regexOption.count()) > 0) {
            await regexOption.click();
        } else {
            // Fallback: select first available option
            await this.page.getByRole("option").first().click();
        }
    }
    //-----------------------//
    async vermogenErfassen(vermogenType: string, bezeichnung: string, stichtag: string, betrag: string, glaeubiger: string, maximalGrund: string) {
        await this.editVermogen();
        switch (vermogenType) {
            case "Konto":
                await this.vermogenKontoErfassen();
                break;
            case "Auto":
                await this.vermogenAutoErfassen();
                break;
            case "Eigenheim":
                await this.vermogenEigenErfassen();
                await this.inputGlaubiger(glaeubiger);
                await this.inputMaximale(maximalGrund);
                break;
            default:
                break;
        }
        await this.inputBezeichnung(bezeichnung);
        await this.inputStichtag(stichtag);
        await this.inputVermogenBetrag(betrag);
        await this.clickSpeichernBtn();
    }
    //-----------------------//
    async inputStichtag(stichtag: string) {
        await this.stichtagTxtbox.fill(stichtag);
    }
    async inputGlaubiger(glaeubiger: string) {
        await this.glaubigerTxtbox.fill(glaeubiger);
    }
    async inputMaximale(maximalGrund: string) {
        await this.maximaleTxtbox.fill(maximalGrund);
    }

    async editVermogen() {
        await this.vermogenEditBtn.click();
    }
    async vermogenKontoErfassen() {
        await this.vermogenErfassenBtn.click();
        await this.kontoMenuItem.click();
        await this.page.waitForLoadState("domcontentloaded");
    }
    async vermogenEigenErfassen() {
        await this.vermogenErfassenBtn.click();
        await this.eigentumswohnungMenuItem.click();
    }
    async vermogenAutoErfassen() {
        await this.vermogenErfassenBtn.click();
        await this.autoMenuItem.click();
    }
    async inputBezeichnung(bezeichnung: string) {
        await this.bezeichnungTxtbox.fill(bezeichnung);
    }
    //----------------------------------//
    async handleCheckbox(checkbox: string) {
        if (checkbox === "x") {
            await this.erhaltCheckbox.click();
        }
    }
    async erwerbssituationEinnahmen(erwerbssituationType: string | RegExp, zahlbarDurch: string, pensumm: string, betrag: string, gueltigVon: string, gueltigBis: string, checkbox: string) {
        await this.editPanel();
        switch (erwerbssituationType) {
            case /^Erwerbslohn|Revenus gagnés|^Unselbständiger Erwerbslohn|Actif occupé, salarié/i:
                await this.selectErwerbslohnMenuItem();
                await this.arbeitspensumTxtbox.fill(pensumm);
                await this.handleCheckbox(checkbox);
                break;
            case /AusbildungsLohn|Salaire de formation/i:
                await this.selectAusbildungslohnMenuItem();
                await this.arbeitspensumTxtbox.fill(pensumm);
                await this.handleCheckbox(checkbox);
                break;

            case "AHVErwachsen":
                await this.selectAHVErwachsenenrente();
                break;

            case "ArbeitsLosEntsch":
                await this.selectArbeitslosenentschadigung();
                break;

            case "Kinderunterhalt":
                await this.selectKinderunterhalt();
                break;

            case "IVErwachsen":
                await this.selectIVErwachsenenrente();
                break;

            case "Kinderzulage":
                await this.selectKinderzulage();
                break;

            default:
                break;
        }
        await this.selectZahlbarDurch(zahlbarDurch);
        await this.inputBetrag(betrag);
        await this.inputFromDateToDate(gueltigVon, gueltigBis);
        await this.clickSpeichernBtn();
        await this.page.locator("app-progress-spinner").first().waitFor({ state: "hidden" });
    }

    //----------------------------------//
    async selectIVErwachsenenrente() {
        await this.rentenMenu.click();
        await this.ivErwachsenenrente.click();
    }
    async selectKinderunterhalt() {
        await this.ansprucheGegenuberDrittenMenu.click();
        await this.kinderunterhaltMenuItem.click();
    }
    async selectKinderzulage() {
        await this.ansprucheGegenuberDrittenMenu.click();
        await this.kinderzulage.click();
    }
    async selectArbeitslosenentschadigung() {
        await this.page.getByRole("menuitem", { name: "Sozialversicherungsleistungen" }).click();
        await this.arbeitslosenentschadigungMenuItem.click();
    }

    async clickSpeichernBtn() {
        await this.spichernBtn.click();
        await this.navigation.waitForSpinnerToDisappear();
        await this.navigation.waitForPageReady();
    }
    async selectAHVErwachsenenrente() {
        await this.rentenMenu.click();
        await this.ahvErwachsenenrenteMenuItem.click();
    }
    async selectZahlbarDurch(zahlbarDurch: string) {
        await this.page.locator("app-bezahlt-durch-lookup").first().waitFor({ state: "visible" });
        await this.zahlbarDurch.last().fill("");
        await this.zahlbarDurch.last().pressSequentially(this.getTextBeforeComma(zahlbarDurch));
        await this.page.keyboard.press("Backspace"); // 30.06.2025
        await this.page
            .locator(`mat-option:has-text('${this.getTextBeforeComma(zahlbarDurch)}')`)
            .first()
            .click();
    }
    async inputBetrag(betrag: string) {
        await this.betragTxtbox.fill("");
        await this.betragTxtbox.pressSequentially(betrag);
    }
    async inputVermogenBetrag(betrag: string) {
        await this.betragVermogen.fill(betrag);
    }
    async inputFromDateToDate(gueltigVon: string, gueltigBis: string) {
        await this.gultigVonTxtbox.last().fill("");
        await this.gultigVonTxtbox.last().pressSequentially(gueltigVon, { delay: 50 });
        await this.gultigBisTxtbox.last().fill("");
        await this.gultigBisTxtbox.last().pressSequentially(gueltigBis, { delay: 50 });
    }
    async inputInfo(zahlbarDurch: string, pensumm: string | number, betrag: string | number, gueltigVon: string, gueltigBis: string, checkbox: string) {
        await this.page.locator("app-bezahlt-durch-lookup").first().waitFor({ state: "visible" });
        await this.arbeitspensumTxtbox.fill("");
        await this.arbeitspensumTxtbox.pressSequentially(String(pensumm));
        await this.betragTxtbox.fill("");
        await this.betragTxtbox.pressSequentially(String(betrag));
        await this.gultigVonTxtbox.fill("");
        await this.gultigVonTxtbox.pressSequentially(gueltigVon);
        await this.gultigBisTxtbox.fill("");
        await this.gultigBisTxtbox.pressSequentially(gueltigBis);
        let isChecked = checkbox === "x";
        if (isChecked) {
            await this.erhaltCheckbox.click();
        }
        await this.zahlbarDurch.last().fill("");
        await this.zahlbarDurch.last().pressSequentially(this.getTextBeforeComma(zahlbarDurch));
        await this.page
            .locator(`mat-option:has-text('${this.getTextBeforeComma(zahlbarDurch)}')`)
            .first()
            .click();
    }
    async selectErwerbslohnMenuItem() {
        const btnExpand = this.page
            .locator("mat-expansion-panel-header")
            .filter({ hasText: /Einnahmen|recettes/i })
            .first();
        const expanded = await btnExpand.getAttribute("aria-expanded");
        if (expanded === "false") {
            await btnExpand.click();
        }
        await this.btnEditPanel.click();
        await this.stabilityHelper.stableClick(this.btnEinnahmeErfassen, {
            waitBefore: 500,
            waitAfter: 1000
        });
        await this.erwerbseinkommenMenu.click();
        await this.erwerbslohnMenuItem.click();
    }
    async selectAusbildungslohnMenuItem() {
        await this.erwerbseinkommenMenu.click();
        await this.ausbildungslohnMenuItem.click();
    }

    async editPanel() {
        const btnExpand = this.page
            .locator("mat-expansion-panel-header")
            .filter({ hasText: /Einnahmen|recettes/i })
            .first();
        const expanded = await btnExpand.getAttribute("aria-expanded");
        if (expanded === "false") {
            await btnExpand.click();
        }
        await this.btnEditPanel.click({ delay: 1000 });
        await this.stabilityHelper.stableClick(this.btnEinnahmeErfassen, {
            waitBefore: 500,
            waitAfter: 1000
        });
    }
    async clickErafassenBtn(panelTitle: string) {
        await this.page.locator(`app-widget-host:has-text('${panelTitle}') app-card-button`).click();
    }
    /**
     * Robustly finds and clicks a navigation item by text using multiple strategies.
     * This handles cases where navigation items may be links, buttons, or drawer items.
     */
    private async findAndClickNavItem(itemText: string, timeout: number = 30000): Promise<void> {
        const navDrawer = this.page.locator("app-navigation-drawer");
        const navTree = this.page.locator("app-navigation-tree");

        // Wait for navigation drawer to be visible
        await this.stabilityHelper.stableWaitFor(navDrawer, { timeout, state: "visible", waitAfter: 500 });

        // Wait for navigation tree to have Klientschaft items loaded (person links)
        // The tree has structure elements immediately, but person names load asynchronously
        const klientschaftPersonIndicators = [
            navTree.locator("app-navigation-drawer-item a").first(), // Person links are in drawer items
            navTree.locator("app-navigation-tree-group").locator("a").first(), // Or in tree groups
            navTree.getByRole("link").first() // Any link in the tree
        ];

        let personLinksLoaded = false;
        const personLoadDeadline = Date.now() + 10000; // 10 seconds to wait for person names

        while (Date.now() < personLoadDeadline && !personLinksLoaded) {
            for (const indicator of klientschaftPersonIndicators) {
                try {
                    const isVisible = await indicator.isVisible({ timeout: 1000 }).catch(() => false);
                    if (isVisible) {
                        personLinksLoaded = true;
                        break;
                    }
                } catch {
                    // Try next indicator
                }
            }

            if (!personLinksLoaded) {
                // Re-expand menu to trigger refresh of navigation items
                const buttonRollDown = this.page.locator("app-navigation-drawer-item[class*='navigation-tree-actions'] button").first();
                const isExpandVisible = await buttonRollDown.isVisible({ timeout: 500 }).catch(() => false);
                if (isExpandVisible) {
                    await buttonRollDown.click().catch(() => {});
                    await this.page.waitForTimeout(500);
                }
            }
        }

        if (!personLinksLoaded) {
            console.warn(`⚠️ [Navigation] No person links found in navigation tree after 10s, proceeding with search anyway...`);
        }

        const strategies = [
            () => navTree.getByRole("link", { name: itemText }),
            () => navTree.getByRole("link").filter({ hasText: itemText }),
            () => navTree.getByRole("button", { name: itemText }),
            () => navDrawer.locator(`app-navigation-drawer-item:has-text("${itemText}")`),
            () => navTree.locator(`a:has-text("${itemText}"), button:has-text("${itemText}")`).first(),
            () => navTree.locator(`.item-title:has-text("${itemText}")`).first(),
            () => navTree.locator(`[class*="item"]:has-text("${itemText}")`).first()
        ];

        const deadline = Date.now() + timeout;
        let attempt = 0;

        while (Date.now() < deadline) {
            attempt++;
            for (let i = 0; i < strategies.length; i++) {
                const locator = strategies[i]();
                try {
                    const isVisible = await locator.isVisible({ timeout: 2000 }).catch(() => false);
                    if (isVisible) {
                        console.log(`Found navigation item "${itemText}" using strategy ${i + 1} (attempt ${attempt})`);
                        await this.stabilityHelper.stableClick(locator, { timeout: 10000, waitBefore: 300, waitAfter: 500 });
                        return;
                    }
                } catch {
                    // Strategy failed, try next
                }
            }

            if (Date.now() < deadline) {
                await this.page.waitForTimeout(1000);
            }
        }

        // Diagnostic: Log what's actually visible in the navigation tree
        const allLinks = await navTree
            .getByRole("link")
            .allTextContents()
            .catch(() => [] as string[]);
        const allItems = await navDrawer
            .locator("app-navigation-drawer-item")
            .allTextContents()
            .catch(() => [] as string[]);
        console.error(`❌ [Navigation] Failed to find "${itemText}". Available links: [${allLinks.slice(0, 10).join(", ")}]. Available items: [${allItems.slice(0, 10).join(", ")}]`);

        throw new Error(`Could not find navigation item "${itemText}" in the navigation tree after ${attempt} attempt(s). ` + `Tried ${strategies.length} selector strategies per attempt. ` + `Available links in tree: [${allLinks.slice(0, 5).join(", ")}]. ` + `The navigation structure may have changed or the item does not exist.`);
    }

    async selectKlient(klientschaft: string) {
        // Wait for page stability before interacting with navigation
        // This ensures all async data (including Klientschaft names) is loaded
        await this.navigation.waitForPageReady({ useNetworkIdle: true, additionalWait: 500 });
        await this.navigation.openMenuNav();
        await this.findAndClickNavItem(klientschaft, 30000);
        await this.navigation.waitForPageReady();
    }

    async selectKlientSchaft(klientschaft: string) {
        // Wait for page stability before interacting with navigation
        // This ensures all async data (including Klientschaft names) is loaded
        await this.navigation.waitForPageReady({ useNetworkIdle: true, additionalWait: 500 });
        await this.navigation.openMenuNav();
        await this.findAndClickNavItem(klientschaft, 30000);
        await this.navigation.waitForSpinnerToDisappear();
    }

    async goToKlientSchaftNavLink(klientschaft: string) {
        // Wait for page stability before interacting with navigation
        await this.navigation.waitForPageReady({ useNetworkIdle: true, additionalWait: 500 });
        await this.findAndClickNavItem(klientschaft, 30000);
        await this.bewilligungOffnen.scrollIntoViewIfNeeded();
        await this.bewilligungOffnen.click();
    }
    async acceptZahlungsverbindungen(buttonBewilligung: string, checkStatus: string) {
        await this.bewilligungOffnen.click();
        await this.page.waitForLoadState("load");
        await this.page
            .getByRole("button", { name: `${buttonBewilligung}` })
            .first()
            .click();
        await this.navigation.waitForSpinner();

        const startTime = Date.now();
        const intervals = [1000, 2000, 10000];
        const timeout = 60000;
        let intervalIndex = 0;

        while (Date.now() - startTime < timeout) {
            try {
                const statusText = await this.status.last().textContent();
                if (statusText?.includes(checkStatus)) {
                    return;
                }
            } catch (error) {
                console.log(`Status check failed, retrying: ${error}`);
            }

            const waitTime = intervalIndex < intervals.length ? intervals[intervalIndex] : intervals[intervals.length - 1];

            intervalIndex = Math.min(intervalIndex + 1, intervals.length - 1);

            await this.page.waitForTimeout(waitTime);
        }
    }

    // KL3b
    async getValueFromRootControl(locator: Locator): Promise<string> {
        const tagName = await locator.evaluate((node) => node.tagName);
        if (tagName === "INPUT" || tagName === "TEXTAREA") {
            return await locator.inputValue();
        } else {
            return (await locator.textContent())?.trim() || "";
        }
    }
    async checkInfoAndLohnUpdate(zahlbarDurch: string, pensumm: string, betrag: string, gueltigVonActual: string, gueltigVonNew: string, gueltigBis: string, checkbox13: string, docType: string, docPathName: string) {
        //replace waitForTimeout with waitForLocator
        // await this.navigation.waitForSpinnerToDisappear()

        const appCardLocator = this.page.locator("app-person-erwerbssituationen-widget-editable app-card");
        const appCardCount = await appCardLocator.count();
        console.log(appCardCount, " App card **&*****");
        const pensumControl = appCardLocator.getByTestId("pensumProzent").getByTestId("root-control").first();
        const betragControl = appCardLocator.getByTestId("betragMonatlich").getByTestId("root-control").first();
        const validThroughControl = appCardLocator.getByTestId("validThrough").getByTestId("root-control").first();
        const validFromControl = appCardLocator.getByTestId("validFrom").getByTestId("root-control").first();

        await pensumControl.click();
        await this.page.keyboard.press("Control+a");
        await pensumControl.fill(pensumm);

        await betragControl.click();
        await this.page.keyboard.press("Control+a");
        await betragControl.fill(betrag);

        await validThroughControl.fill(gueltigBis);

        if (checkbox13 === "") {
            await appCardLocator.getByRole("checkbox", { name: "Erhält 13. Monatslohn" }).first().uncheck();
        }
        if (checkbox13 === "x") {
            await appCardLocator.getByRole("checkbox", { name: "Erhält 13. Monatslohn" }).first().check();
        }

        if (gueltigVonNew !== "") {
            await validFromControl.fill(gueltigVonNew);
        }

        if (docPathName !== "") {
            const uploadLocator = appCardLocator.locator("app-file-upload-card").first().filter({ hasText: docType });
            await this.commonPage.uploadFile(uploadLocator, docPathName);
        }
    }
    //11b
    async fill_IPV_Value(IPV: string | number) {
        await this.page
            .getByRole("textbox", { name: /IPV-Betrag|Montant RIP/i })
            .last()
            .fill(`${IPV}`);
    }

    async slectDocument(document: string) {
        if (document !== "") {
            const uploadLocator = this.page
                .getByTestId("krankenversicherungKvg-card")
                .last()
                .getByRole("button", {
                    name: /Police Datei hierhin ziehen oder klicken|Police Glisser et déposer le Fichier ou cliquer ici/i
                });
            await this.commonPage.uploadFile(uploadLocator, document);
        }
    }
    //P19
    async editPersonendaten() {
        await this.page
            .getByRole("button", { name: /Personendaten bearbeiten/i })
            .getByRole("button", { name: "bearbeiten" })
            .click();
    }

    async fillInfoPersonUpdate(national: string, geschlecht: string, zivilstand: string, korrSprache: string, todesDatum: string) {
        const nationalitaetCombo = this.page.getByRole("combobox", { name: /Nationalität|Nationalité/i });
        const geschlechtCombo = this.page.getByRole("combobox", { name: /Geschlecht|Sexe/i });
        const korrSpracheCombo = this.page.getByRole("combobox", { name: /Korrespondenzsprache|Langue de correspondance/i });

        await this.stabilityHelper.stableClick(nationalitaetCombo, { waitAfter: 200 });
        const nationalOption = this.page.getByRole("option", { name: `${national}` });
        await nationalOption.waitFor({ state: "visible", timeout: 5000 });
        await nationalOption.click();
        await this.navigation.waitForSpinnerToDisappear();

        await this.stabilityHelper.stableClick(geschlechtCombo, { waitAfter: 200 });
        const geschlechtOption = this.page.getByRole("option", { name: `${geschlecht}` });
        await geschlechtOption.waitFor({ state: "visible", timeout: 5000 });
        await geschlechtOption.click();
        await this.navigation.waitForSpinnerToDisappear();

        // await this.zivilstandTxtBox.click();
        // await this.page.getByRole('option', { name: `${zivilstand}`, exact: true }).click();

        await this.stabilityHelper.stableClick(korrSpracheCombo, { waitAfter: 200 });
        const korrSpracheOption = this.page.getByRole("option", { name: `${korrSprache}` });
        await korrSpracheOption.waitFor({ state: "visible", timeout: 5000 });
        await korrSpracheOption.click();

        await this.todesdatumTxtBox.fill(`${todesDatum}`);
    }

    async addDocumentFile(dokumente: string) {
        if (dokumente !== "") {
            await this.commonPage.uploadMultipleFiles(this.page.getByRole("button", { name: "Diverse Dokumente Datei" }), dokumente);
        }
    }
    async editCommunikation() {
        await this.btnEditKommunikation.click();
    }

    async selectFormKommunikation(kanal: string, typ: string) {
        await this.page.getByRole("button", { name: `${kanal}` }).click();
        await this.page.getByRole("button", { name: `${typ}` }).click();
    }

    async fillInfoKommunikation(typ: string, numberOrEmail: string, mainChannel: string) {
        let appCardTelefonIndex = 0;
        let found = false;
        let y: number | undefined;
        await this.page
            .getByRole("textbox", { name: `${typ}` })
            .last()
            .fill(numberOrEmail);
        if (mainChannel === "ja") {
            while (!found) {
                const appCardTelefonLocator = this.page.locator(".grid-col-3 > div > div").nth(appCardTelefonIndex);
                try {
                    await appCardTelefonLocator.waitFor({
                        state: "visible",
                        timeout: 200
                    });
                    const children = appCardTelefonLocator.getByTestId("text").getByTestId("root-control");
                    for (let i = 0; i < (await children.count()); i++) {
                        const child = children.nth(i);
                        const inputValue = await child.inputValue();
                        if (inputValue === `${numberOrEmail}`) {
                            y = i;
                            break;
                        }
                    }
                    if (y !== undefined) {
                        found = true;
                    } else {
                        y = undefined;
                        appCardTelefonIndex++;
                    }
                } catch (error) {
                    appCardTelefonIndex++;
                }
            }
            if (found) {
                const parent = this.page.locator(".grid-col-3 > div > div").nth(appCardTelefonIndex);
                await parent.getByRole("button").click();
                await this.mainChannelBtn.click();
            }
        }
    }
    async editPanelB() {
        await this.btnEditPanel.click({ delay: 2000 });
    }
}
