import { Page, Locator, expect } from "@playwright/test";
import { CommonPage } from "./common-page";
import { NavigationPage } from "./navigation-page";
import { StabilityHelper } from "@utils/stability-helper";

export class WohnSituationPage {
    page: Page;
    private stabilityHelper: StabilityHelper;
    address: Locator;
    person: Locator;
    spinner: Locator;
    pageTitle: Locator;
    navWohnsituation: Locator;
    wohnsituationCard: Locator;
    vermieterOption: Locator;
    wohnungsgrosseOption: Locator;
    mietksten: Locator;
    nebenkosten: Locator;
    wohnsituationSichernBtn: Locator;
    appCardWohnkosten: Locator;
    wohnsituationMenu: Locator;
    personHinzufugenMenuItem: Locator;
    personNeuErfassenCheckbox: Locator;
    nameTxtbox: Locator;
    vornameTxtbox: Locator;
    geburtsdatumTxtbox: Locator;
    ahvNumberTxtbox: Locator;
    inHaushltSelection: Locator;
    ereignisSelection: Locator;
    personHinzifugen: Locator;
    personInHausltVon: Locator;
    personEntfernenMenuItem: Locator;
    appDefaultDialog: Locator;
    personHaushaltBis: Locator;
    ereignisSelect: Locator;
    zusatTxtbox: Locator | undefined;
    strasseTxtbox: Locator | undefined;
    hausnummerTxtbox: Locator | undefined;
    ortTxtbox: Locator;
    personEntfernenBtn: Locator;
    wohnsituationBearbeitebBtn: Locator;
    appCardToogle: Locator;
    timelineBtn: Locator;
    neueWohnsituationCheckBox: Locator;
    btnSpeichern: Locator;
    btnAddNewWohnsituationErfassen: Locator;
    txtBoxStartNeueWohnsituation: Locator;
    txtBoxEndeNeueWohnsituation: Locator;
    checkBoxpersonenInDossierIds: Locator;
    commonPage: CommonPage;
    navigation: NavigationPage;
    wohnsituationTypeSelect: Locator;
    weitereDokumenteUploadFile: Locator;
    fileMietvertragUploadFile: Locator;
    fileMietdepotUploadFile: Locator;
    fileMietzinsgarantieUploadFile: Locator;
    appCardGultigAb: Locator;
    constructor(page: Page) {
        this.page = page;
        this.stabilityHelper = new StabilityHelper(page);
        this.commonPage = new CommonPage(page);
        this.navigation = new NavigationPage(page);
        this.address = page.locator("h2 + span");
        this.person = page.locator("app-person-card-row");
        this.spinner = page.getByRole("progressbar");
        this.pageTitle = page.locator("h1").filter({
            hasText: /Wohnsituation - Haushalt|Situation résidentielle - ménage/i
        });
        this.navWohnsituation = page.getByRole("link", {
            name: /Wohnsituation - Haushalt|Situation résidentielle - ménage/i
        });
        this.wohnsituationCard = page.locator("app-wohnsituation-card");
        this.vermieterOption = page.getByTestId("vermieterInstitutionId").getByTestId("root-control");
        this.wohnungsgrosseOption = page.getByTestId("wohnungsgroesse").getByTestId("root-control");
        this.mietksten = page.getByTestId("mietkosten").getByTestId("root-control");
        this.nebenkosten = page.getByTestId("nebenkosten").getByTestId("root-control");
        this.wohnsituationSichernBtn = page.getByRole("button", {
            name: /Wohnsituation sichern|Enregistrer la situation résidentielle/i
        });
        this.appCardWohnkosten = page.locator("//span[normalize-space(text())='Wohnkosten' or normalize-space(text())='Frais de logement']/following-sibling::span");
        this.appCardGultigAb = page.locator("//span[normalize-space(text())='Gültig ab' or normalize-space(text())='Valable à partir du']/following-sibling::span");
        this.wohnsituationMenu = page.locator("app-wohnsituation button");
        this.personHinzufugenMenuItem = page.getByRole("menuitem", {
            name: /Person hinzufügen|Ajouter une personne/i
        });
        this.personNeuErfassenCheckbox = page
            .getByRole("row", {
                name: /Person neu erfassen|Saisir une nouvelle personne/i
            })
            .getByLabel("");
        this.nameTxtbox = page.getByTestId("nachname").getByTestId("root-control").last(); //todo: dirty fix. Only for POC Fix test-dataid.
        this.vornameTxtbox = page.getByTestId("vorname").getByTestId("root-control").last(); //todo: dirty fix. Only for POC Fix test-dataid.;
        this.geburtsdatumTxtbox = page.getByTestId("geburtsdatum").getByTestId("root-control").last(); //todo: dirty fix. Only for POC Fix test-dataid.;
        this.ahvNumberTxtbox = page.getByTestId("ahvNummer").getByTestId("root-control").last(); //todo: dirty fix. Only for POC Fix test-dataid.;
        this.inHaushltSelection = page.getByTestId("wohnsituationMitgliedTyp").getByTestId("root-control");
        this.ereignisSelection = page.getByTestId("hinzugefuegtMeldungstyp").getByTestId("root-control");
        this.personHinzifugen = page.getByRole("button", {
            name: /Person hinzufügen|Ajouter la personne/i
        });
        this.personInHausltVon = page.getByTestId("haushaltVon").getByTestId("root-control");
        this.personEntfernenMenuItem = page.getByRole("menuitem", {
            name: /entfernen|Retirer une ou plusieurs personnes/i
        });
        this.appDefaultDialog = page.locator("app-person-toggle-select");
        this.personHaushaltBis = page.getByTestId("haushaltBis").getByTestId("root-control");
        this.ereignisSelect = page.getByTestId("meldungstyp").getByTestId("root-control");
        this.ortTxtbox = page.getByRole("combobox", { name: /Ort|Localité/i });
        this.personEntfernenBtn = page.getByRole("button", {
            name: /entfernen|Retirer une ou plusieurs personnes/i
        });
        this.wohnsituationBearbeitebBtn = page.getByRole("menuitem", {
            name: /Wohnsituation bearbeiten|Modifier la situation résidentielle/i
        });
        this.appCardToogle = page.locator("app-person-toggle-select");
        this.timelineBtn = page.locator("app-timeline-toggle-button button");

        this.neueWohnsituationCheckBox = page.getByRole("radio", {
            name: /Kopieren|Copier/i
        });
        this.btnSpeichern = page.getByRole("button", {
            name: /Speichern|Enregistrer/i
        });
        this.btnAddNewWohnsituationErfassen = page.getByRole("menuitem", {
            name: /Neue Wohnsituation erfassen|Ajouter une nouvelle situation résidentielle/i
        });
        this.txtBoxStartNeueWohnsituation = page.getByTestId("startNeueWohnsituation").getByTestId("root-control");
        this.txtBoxEndeNeueWohnsituation = page.getByTestId("endeNeueWohnsituation").getByTestId("root-control");
        this.checkBoxpersonenInDossierIds = page.locator("app-person-toggle-select app-card");
        //
        this.wohnsituationTypeSelect = page.getByTestId("wohnsituationTyp").getByTestId("root-control");
        this.weitereDokumenteUploadFile = page.getByTestId("weitereDokumente").getByRole("button");
        this.fileMietvertragUploadFile = page.getByTestId("file_Mietvertrag").getByRole("button");
        this.fileMietdepotUploadFile = page.getByTestId("file_Mietdepot").getByRole("button");
        this.fileMietzinsgarantieUploadFile = page.getByTestId("file_Mietzinsgarantie").getByRole("button");
    }
    // search dossier - wohn nav - check
    async checkWohnsituation(zimmerWohnungTitel: string, strasseAdresse: string, Wohnkosten: number, beWohnerContains: string, gueltigAb: string) {
        const EXPECT_TIMEOUT = 2000;
        await expect.soft(this.page.locator("app-wohnsituation-card h2")).toContainText(zimmerWohnungTitel, { timeout: EXPECT_TIMEOUT });
        await expect.soft(this.page.locator("app-wohnsituation-card h2 + span")).toContainText(strasseAdresse, { timeout: EXPECT_TIMEOUT });
        await expect.soft(this.appCardWohnkosten).toContainText(this.commonPage.formatNumber(Wohnkosten), {
            timeout: EXPECT_TIMEOUT
        });
        for (const klientRaw of beWohnerContains.split(",")) {
            const klient = klientRaw.trim();
            if (klient) {
                await expect.soft(this.page.locator(`app-person-card-row:has-text('${klient}')`)).toBeVisible({ timeout: EXPECT_TIMEOUT });
            }
        }
        await expect.soft(this.appCardGultigAb).toContainText(gueltigAb, { timeout: EXPECT_TIMEOUT });
    }
    async selectWohnsituationType(doctype: string, document: string) {
        await this.uploadFile(doctype, document);
        await this.page.getByRole("button", { name: /sichern|Enregistrer/i }).click();
    }

    async uploadFile(doctype: string, filePath: string) {
        const fileChooserPromise = this.page.waitForEvent("filechooser");
        if (doctype === "Diverse Dokumente") {
            await this.weitereDokumenteUploadFile.click();
        } else if (doctype === "Mietvertrag") {
            await this.fileMietvertragUploadFile.click();
        } else if (doctype === "Mietzinsgarantie") {
            await this.fileMietzinsgarantieUploadFile.click();
        } else {
            await this.fileMietdepotUploadFile.click();
        }
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(`${filePath}`);
    }

    // select wohnsituation from navigation
    async selectWohnsituation() {
        await this.navWohnsituation.click();
    }
    // + 1 in days
    incrementDay(inHaushaltBis: string) {
        // Split the string to separate day, month, and year
        const parts = inHaushaltBis.split(".");
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Adjust month for JavaScript Date (0-11)
        const year = parseInt(parts[2], 10);

        // Create a new Date object
        const date = new Date(year, month, day);

        // Add one day
        date.setDate(date.getDate() + 1);

        // Extract the new day, month, and year
        const newDay = date.getDate();
        const newMonth = date.getMonth() + 1; // Adjust back to normal month numbers (1-12)
        const newYear = date.getFullYear();

        // Format day and month to always be two digits
        const formattedDay = newDay.toString().padStart(2, "0");
        const formattedMonth = newMonth.toString().padStart(2, "0");

        // Reconstruct the date string
        return `${formattedDay}.${formattedMonth}.${newYear}`;
    }
    async editWohnsituation() {
        await this.wohnsituationMenu.click();
        await this.wohnsituationBearbeitebBtn.click();
    }

    async personDelete(klient: string, inHaushaltBis: string, inUeBis: string, ereignis: string) {
        try {
            await expect(this.wohnsituationMenu).toBeVisible({ timeout: 2000 });
            await this.wohnsituationMenu.click();
        } catch {
            await this.navigation.openMenuNav();
            await this.wohnsituationMenu.click();
        }
        await this.personEntfernenMenuItem.click();
        await this.personHaushaltBis.fill(inHaushaltBis);
        await this.ereignisSelect.click();
        await this.page.locator(`mat-option:has-text("${ereignis}")`).first().click();
        await this.appCardToogle.locator(`app-person-card-row:has-text('${klient}') button`).click();
        await expect.soft(this.personEntfernenBtn).toBeEnabled();
        await this.personEntfernenBtn.click();
        await this.timelineBtn.click();
        const incrementedDate = this.incrementDay(inHaushaltBis);
        await expect.soft(this.page.locator(`div[class*='date-caption']:has-text('${incrementedDate}')`)).toBeVisible();

        // Check for clickable element - try anchor first (QA), then date-caption itself (DEV)
        const anchorLocator = this.page.locator(`div[class*='date-caption']:has-text('${incrementedDate}') + a`);
        const dateCaptionLocator = this.page.locator(`div[class*='date-caption']:has-text('${incrementedDate}')`);
        const anchorExists = (await anchorLocator.count().catch(() => 0)) > 0;
        if (anchorExists) {
            await expect.soft(anchorLocator).toBeVisible();
        } else {
            console.log(`✅ [Timeline] Date '${incrementedDate}' found without anchor (DEV structure)`);
            await expect.soft(dateCaptionLocator).toBeVisible();
        }
    }

    async personHinzufuegen(name: string, vorname: string, geburtsdatum: string, ahvNumber: string, personInHausltVon: string, inHaushlt: string, ereignis: string) {
        await this.navigation.openDossierverwaltungMenu();
        await this.navWohnsituation.click();
        await this.wohnsituationMenu.click();
        await this.personHinzufugenMenuItem.click();
        await this.personNeuErfassenCheckbox.check();
        await this.nameTxtbox.last().fill(name);
        await this.vornameTxtbox.last().fill(vorname);
        await this.geburtsdatumTxtbox.last().fill(geburtsdatum);
        await this.ahvNumberTxtbox.last().fill(ahvNumber);
        await this.personInHausltVon.last().fill(personInHausltVon);
        await this.inHaushltSelection.last().click();
        await this.page.locator(`mat-option:has-text("${inHaushlt}")`).first().click();
        await this.ereignisSelection.last().click();
        await this.page.locator(`mat-option:has-text("${ereignis}")`).first().click();
        await this.personHinzifugen.click();
        await this.navigation.waitForPageReady();
        await this.navigation.waitForSpinnerToDisappear();
        await this.page.waitForTimeout(1000);
    }
    removeCommas(str: string): string {
        const stringWithoutCommas = str.replace(/,/g, "");
        return stringWithoutCommas;
    }
    normalizeString(str: string): string {
        const normalizedStr = str.replace(/[^\d.]/g, "");
        // Separate the integer part and the decimal part
        const parts = normalizedStr.split(".");
        let integerPart = parts[0];
        let decimalPart = parts.length > 1 ? parts[1] : "";
        // Add a ' after every thousand
        const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, "’");
        // Keep 2 decimals
        if (decimalPart.length < 2) {
            decimalPart = decimalPart.padEnd(2, "0");
        } else if (decimalPart.length > 2) {
            decimalPart = decimalPart.slice(0, 2);
        }
        // Combine integer and decimal parts
        const formattedStr = formattedIntegerPart + (decimalPart ? `.${decimalPart}` : "");
        return formattedStr;
    }

    async inputWohnsituationInfo(vermieter: string, wohnungsgrosse: string, mietkosten: number, nebenkosten: number) {
        await this.wohnungsgrosseOption.click();
        await this.page.locator(`mat-option:has-text("${wohnungsgrosse}")`).click();
        await this.mietksten.dblclick();
        await this.mietksten.fill(`${mietkosten}`);
        await this.nebenkosten.dblclick();
        await this.nebenkosten.fill(`${nebenkosten}`);
        await this.vermieterOption.click();
        await this.page
            .locator(`mat-option:has-text("${this.commonPage.getTextBeforeComma(vermieter)}")`)
            .first()
            .click();
        await expect.soft(this.wohnsituationSichernBtn).toBeEnabled();
        await this.wohnsituationSichernBtn.click();
        const wohnkosten = Number(mietkosten) + Number(nebenkosten);
        const normalizedExpected = this.commonPage.formatNumber(wohnkosten);
        await this.page.waitForSelector("app-wohnsituation");
        await this.navigation.waitForPageReady();
        await expect.soft(this.appCardWohnkosten).toContainText(normalizedExpected);
    }
    async clickOnWohnsituantionCard() {
        await this.wohnsituationCard.click();
    }
    async clickOnWohnsituantionNav() {
        await expect(this.navWohnsituation).toBeVisible({ timeout: 30000 });
        await this.navWohnsituation.click();
    }
    async verifyNewDossierCreated() {
        await this.navigation.waitForSpinner();
        // await this.address.waitFor({ state: "visible" });
        // await this.person.waitFor({ state: "visible" });
    }

    async verifyAddress(strasse: string, houseNumber: string, ort: string) {
        await expect.soft(this.address).toContainText(`${strasse} ${houseNumber}, ${ort}`);
    }
    async verifyStrasse(strasse: string) {
        await expect.soft(this.address).toContainText(`${strasse}`);
    }
    async verifyHouseNumber(houseNumber: string) {
        await expect.soft(this.address).toContainText(`${houseNumber}`);
    }
    async verifyOrt(ort: string) {
        await expect.soft(this.address).toContainText(`${ort}`);
    }

    async verifyNewDossier(firstname: string, lastname: string) {
        await expect.soft(this.person).toContainText(` ${firstname}, ${lastname}`);
    }
    async verifyName(firstname: string) {
        await expect.soft(this.person).toContainText(`${firstname}`);
    }
    async verifyLastName(lastname: string) {
        await expect.soft(this.person).toContainText(`${lastname}`);
    }
    async addNewWohnsituationErfassen() {
        await this.wohnsituationMenu.click();
        await this.btnAddNewWohnsituationErfassen.click();
    }

    async fillInfoWohnsituationErfassen(gultigVon: string, gultigBis: string, ohnePerson: string, mitPerson: string) {
        const splitMitPerson = this.commonPage.splitText(mitPerson);
        const splitOhnePerson = this.commonPage.splitText(ohnePerson);
        await this.txtBoxStartNeueWohnsituation.fill(gultigVon);
        await this.txtBoxEndeNeueWohnsituation.fill(gultigBis);
        await this.neueWohnsituationCheckBox.click();
        for (const ohneperson of splitOhnePerson) {
            const isChecked = this.checkBoxpersonenInDossierIds.filter({ hasText: ohneperson }).locator("button");
            if (isChecked) {
                await this.checkBoxpersonenInDossierIds.filter({ hasText: ohneperson }).locator("button").click();
            }
        }
        for (const mitperson of splitMitPerson) {
            const isChecked = this.checkBoxpersonenInDossierIds.filter({ hasText: mitperson }).locator("button");
            if (!isChecked) {
                await this.checkBoxpersonenInDossierIds.filter({ hasText: mitperson }).locator("button").click();
            }
        }

        await this.stabilityHelper.stableClick(this.btnSpeichern);
        await this.navigation.waitForPageReady();
    }
}
