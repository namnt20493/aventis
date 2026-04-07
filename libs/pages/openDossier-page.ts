import { Page, Locator, expect } from "@playwright/test";
import { CommonPage } from "./common-page";
import { NavigationPage } from "./navigation-page";
import { StabilityHelper } from "@utils/stability-helper";

export class DossierOpenPage {
    page: Page;
    private stabilityHelper: StabilityHelper;
    background: Locator;
    table: Locator;
    tbody: Locator;
    row: Locator;
    newDossier: Locator;
    gemeinde: Locator;
    inputNameTextbox: Locator;
    inputAHVNumbTextbox: Locator;
    inputVornameTextbox: Locator;
    inputBirthDayTextbox: Locator;
    genderComboBox: Locator;
    languageCombobox: Locator;
    nationalComboBox: Locator;
    zivilstandComboBox: Locator;
    residencyComboBox: Locator;
    dropdownOption: Locator;
    mobileNumTxtbox: Locator;
    privateNumTxtbox: Locator;
    emailTxtbox: Locator;
    zusatzTxtbox: Locator;
    strasseTxtbox: Locator;
    houseNumberTxtbox: Locator;
    ortComboBox: Locator;
    institutionRadioBox: Locator;
    freeAdressRadioBox: Locator;
    institutionComboBox: Locator;
    ibanTxtbox: Locator;
    createDossierBtn: Locator;
    householdTakeOverBtn: Locator;
    zustandigeCombobox: Locator;
    sozialarbeitTeamDropdown: Locator;
    sozialarbeitInchargeDropdown: Locator;
    sachbeareitungDropdown: Locator;
    sachbearitInchargeDropdown: Locator;
    personenBtn: Locator;
    dossierOpen: Locator;
    inputDateTxtbox: Locator;
    aufenthaltsstatusComboBox: Locator;
    personUbernehmenBtn: Locator;
    personenZuweisenBtn: Locator;
    dossierOpenBtn: Locator;
    inputValidDateTxtbox: Locator;
    newDossierBtn: Locator;
    nameSearchInput: Locator;
    vornameSearchInput: Locator;
    ahvSearchInput: Locator;
    geburtsdatumSearchInput: Locator;
    ahvErrorMsg: Locator;
    dossierbezeichnungTxtbox: Locator;
    eroffnetAmtxtbox: Locator;
    dossierspracheSelectOption: Locator;
    newDossierBtnFR: Locator;
    inputNameTextboxFR: Locator;
    inputVornameTextboxFR: Locator;
    inputBirthDayTextboxFR: Locator;
    genderComboBoxFR: Locator;
    mobileNumTxtboxFR: Locator;
    privateNumTxtboxFR: Locator;
    zusatzTxtboxFR: Locator;
    ortComboBoxFR: Locator;
    personUbernehmenBtnFR: Locator;
    householdTakeOverBtnFR: Locator;
    zustandigeComboboxFR: Locator;
    dossierbezeichnungTxtboxFR: Locator;
    eroffnetAmtxtboxFR: Locator;
    aufenthaltsadresseErfassenBtn: Locator;
    institutionCheckBox: Locator;
    selectInstitution: Locator;
    fillGueltigVon: Locator;
    fillGueltigBis: Locator;
    btnSpeichern: Locator;
    freieAdresseCheckBox: Locator;
    zusatzTextBox: Locator;
    strasseTextBox: Locator;
    hausnummerTextBox: Locator;
    textBoxOrt: Locator;
    zivilstandSeitDate: Locator;
    aufenthalsstatusGultigVon: Locator;
    aufenthalsstatusGultigBis: Locator;
    erweiterteSucheFilter: Locator;
    btnAusgewahltePerson: Locator;
    leistungartComboBox: Locator;
    leistungStatusComboBox: Locator;
    dossierSearchInput: Locator;
    zustandigkeitTeamComboBox: Locator;
    zustandigkeitSAR: Locator;
    zustandigeGemeindeComboBox: Locator;
    commonPage: CommonPage;
    buttnClearFilter: Locator;
    navigationPage: NavigationPage;
    constructor(page: Page) {
        this.page = page;
        this.stabilityHelper = new StabilityHelper(page);
        this.commonPage = new CommonPage(page);
        this.navigationPage = new NavigationPage(page);
        this.background = this.table = page.locator("table");
        this.tbody = page.locator("tbody");
        this.row = this.tbody.locator("tr");
        this.newDossierBtn = page.getByRole("button", {
            name: /Person manuell erfassen|Ajouter une personne manuellement/i
        });
        this.gemeinde = page.getByLabel("Zuständige Gemeinde");
        //-------------------------//
        this.inputNameTextbox = page.getByTestId("pd-lastname").getByTestId("root-control");
        this.inputAHVNumbTextbox = page.getByTestId("pd-ahv").getByTestId("root-control");
        this.inputVornameTextbox = page.getByTestId("pd-firstname").getByTestId("root-control");
        this.inputBirthDayTextbox = page.getByTestId("geburtsdatum").getByTestId("root-control").last();
        this.genderComboBox = page.getByRole("combobox", { name: "Geschlecht" });
        this.languageCombobox = page.getByTestId("language_Korrespondenz").getByTestId("root-control");
        this.nationalComboBox = page.getByTestId("landId_Nationalitaet").getByTestId(/|root-control/);
        this.zivilstandComboBox = page.getByTestId("zivilstand").getByTestId("root-control");
        this.aufenthaltsstatusComboBox = page.getByTestId("aufenthaltsstatus").getByTestId("root-control");
        this.residencyComboBox = page.getByLabel("Aufenthaltsstatus").locator("span");
        this.dropdownOption = page.locator("mat-option");
        this.mobileNumTxtbox = page.getByTestId("comm_mobile").getByTestId("root-control");
        this.privateNumTxtbox = page.getByTestId("telefonPrivat").getByTestId("root-control");
        this.emailTxtbox = page.getByTestId("co-mobile").getByTestId("root-control");
        this.zusatzTxtbox = page.getByTestId("zusatz").getByTestId("root-control").last();
        this.strasseTxtbox = page.getByTestId("strasse").getByTestId("root-control").last();
        this.houseNumberTxtbox = page.getByTestId("hausnummer").getByTestId("root-control").last();
        this.ortComboBox = page.getByTestId("plzOrt").locator("input").last();
        this.institutionRadioBox = page.getByRole("radio", { name: "Institution" });
        this.freeAdressRadioBox = page.getByRole("radio", {
            name: "Freie Adresse"
        });
        this.institutionComboBox = page.getByTestId("institutionId").getByTestId("root-control");
        this.ibanTxtbox = page.getByTestId("iban_Zahlungsverbindung").getByTestId("root-control");
        //-------------------------//
        this.personUbernehmenBtn = page.getByRole("button", {
            name: /Person übernehmen|Reprendre la personne/i
        });
        this.householdTakeOverBtn = page.getByRole("button", {
            name: /Haushalt übernehmen|Reprendre le ménage/i
        });
        this.zustandigeCombobox = page.getByTestId("gemeindeId_Zustaendig").getByTestId("root-control");
        this.sozialarbeitTeamDropdown = page.getByTestId("sozialarbeiter-team").getByTestId("root-control");
        this.sozialarbeitInchargeDropdown = page.getByTestId("sozialarbeiter-user").getByTestId("root-control");
        this.sachbeareitungDropdown = page.getByTestId("sachbearbeiter-team").getByTestId("root-control").last();
        this.sachbearitInchargeDropdown = page.getByTestId("sachbearbeiter-user").getByTestId("root-control").last();
        this.personenZuweisenBtn = page.getByRole("button", {
            name: /Personen zuweisen|Assigner aux personnes/i
        });
        this.dossierOpenBtn = page.getByRole("button", {
            name: /Dossier eröffnen|Ouvrir un dossier/i
        });
        this.inputValidDateTxtbox = page.getByTestId("validFrom").getByTestId("root-control");
        this.nameSearchInput = page.getByTestId("nachname").getByTestId("root-control");
        this.vornameSearchInput = page.getByTestId("vorname").getByTestId("root-control");
        this.ahvSearchInput = page.getByTestId("ahvNummer").getByTestId("root-control");
        this.geburtsdatumSearchInput = page.getByTestId("geburtsdatum").getByTestId("root-control").first();
        this.ahvErrorMsg = page.locator("mat-error[aria-live$='polite']");
        this.dossierbezeichnungTxtbox = page.getByTestId("cd-description").getByTestId("root-control");
        this.eroffnetAmtxtbox = page.getByTestId("eroeffnungsDatum").getByTestId("root-control");
        this.dossierspracheSelectOption = page.getByTestId("dossiersprache").getByTestId("root-control");
        //-------------------------//
        this.aufenthaltsadresseErfassenBtn = page.locator("a[href$='wohnsituation?aufenthalt=']");
        this.institutionCheckBox = page.getByRole("radio", { name: "Institution" });
        this.selectInstitution = page.getByRole("combobox", {
            name: "Institution"
        });
        this.fillGueltigVon = page.getByTestId("validFrom").getByTestId("root-control");
        this.fillGueltigBis = page.getByTestId("validThrough").getByTestId("root-control");
        this.btnSpeichern = page.getByRole("button", {
            name: /Speichern|Enregistrer/i
        });
        this.freieAdresseCheckBox = page.getByTestId("typ").locator("input").last();
        this.zusatzTextBox = page.getByTestId("zusatz").getByTestId("root-control");
        this.strasseTextBox = page.getByTestId("strasse").getByTestId("root-control");
        this.hausnummerTextBox = page.getByTestId("hausnummer").getByTestId("root-control");
        this.textBoxOrt = page.getByTestId("plzOrt").locator("input");
        this.zivilstandSeitDate = page.getByTestId("zivilstandSeit").getByTestId("root-control");
        this.aufenthalsstatusGultigVon = page.getByTestId("aufenthaltsstatusValidFrom").getByTestId("root-control");
        this.aufenthalsstatusGultigBis = page.getByTestId("aufenthaltsstatusValidThrough").getByTestId("root-contrnol");
        this.erweiterteSucheFilter = page.locator("mat-expansion-panel-header").filter({ hasText: /Erweiterte Suche|Recherche avancée/i });
        this.btnAusgewahltePerson = page.getByRole("button", {
            name: /Ausgewählte Person übernehmen|Reprendre la personne sélectionnée/i
        });
        //
        this.leistungartComboBox = page.getByTestId("dossierArten").getByTestId("root-control");
        this.leistungStatusComboBox = page.getByTestId("leistungsStatus").getByTestId("root-control");
        this.dossierSearchInput = page.getByTestId("searchInDossierbezeichnung").getByTestId("root-control");
        this.zustandigkeitTeamComboBox = page.getByTestId("zustaendigkeit_TeamIds").getByTestId("root-control");
        this.zustandigkeitSAR = page.getByTestId("zustaendigkeit_SarSbIds").getByTestId("root-control");
        this.zustandigeGemeindeComboBox = page.getByTestId("zustaendigkeit_GemeindeIds").getByTestId("root-control");
        this.buttnClearFilter = page.getByRole("button", { name: /Filter leeren|Réinitialiser le filtre/i }).last();

        // Initialize missing properties
        this.newDossier = page.locator("[data-testid='new-dossier']"); // placeholder - adjust selector as needed
        this.createDossierBtn = page.getByRole("button", {
            name: /Dossier erstellen/i
        });
        this.personenBtn = page.getByRole("button", { name: /Personen/i });
        this.dossierOpen = page.locator("[data-testid='dossier-open']"); // placeholder
        this.inputDateTxtbox = page.getByTestId("date").getByTestId("root-control");

        // French versions
        this.newDossierBtnFR = page.getByRole("button", {
            name: /Nouveau dossier/i
        });
        this.inputNameTextboxFR = page.getByTestId("pd-lastname-fr").getByTestId("root-control");
        this.inputVornameTextboxFR = page.getByTestId("pd-firstname-fr").getByTestId("root-control");
        this.inputBirthDayTextboxFR = page.getByTestId("geburtsdatum-fr").getByTestId("root-control");
        this.genderComboBoxFR = page.getByRole("combobox", { name: "Sexe" });
        this.mobileNumTxtboxFR = page.getByTestId("comm_mobile-fr").getByTestId("root-control");
        this.privateNumTxtboxFR = page.getByTestId("telefonPrivat-fr").getByTestId("root-control");
        this.zusatzTxtboxFR = page.getByTestId("zusatz-fr").getByTestId("root-control");
        this.ortComboBoxFR = page.getByTestId("plzOrt-fr").locator("input");
        this.personUbernehmenBtnFR = page.getByRole("button", {
            name: /Reprendre la personne/i
        });
        this.householdTakeOverBtnFR = page.getByRole("button", {
            name: /Reprendre le ménage/i
        });
        this.zustandigeComboboxFR = page.getByTestId("gemeindeId_Zustaendig-fr").getByTestId("root-control");
        this.dossierbezeichnungTxtboxFR = page.getByTestId("cd-description-fr").getByTestId("root-control");
        this.eroffnetAmtxtboxFR = page.getByTestId("eroeffnungsDatum-fr").getByTestId("root-control");
    }
    async inputFilter(dossier: string, leistungart: string, leistungstatus: string, team: string, zustaendigSARSB: string, gemeinde: string) {
        await this.stabilityHelper.stableClick(this.buttnClearFilter);
        if (dossier !== "") {
            await this.dossierSearchInput.fill(dossier);
            await this.page.keyboard.press("Enter");
            await this.navigationPage.waitForPageReady();
        }
        if (leistungart !== "") {
            await this.leistungartComboBox.click();
            const leistungArt = this.commonPage.separateText(leistungart);

            for (const leistung of leistungArt) {
                await this.page
                    .getByRole("option", {
                        name: `${this.commonPage.separateText(leistung)}`
                    })
                    .click();
            }
            await this.page.keyboard.press("Escape");
        }
        if (team !== "") {
            await this.zustandigkeitTeamComboBox.pressSequentially(team);
            await this.page.getByRole("option", { name: `${team}` }).click();
            await this.navigationPage.waitForPageReady();
        }
        if (zustaendigSARSB !== "") {
            await this.zustandigkeitSAR.pressSequentially(zustaendigSARSB);
            await this.page
                .getByRole("option", { name: `${zustaendigSARSB}` })
                .first()
                .click();
            await this.navigationPage.waitForPageReady();
        }
        if (leistungstatus !== "") {
            const leistungStatus = this.commonPage.separateText(leistungstatus);
            await this.leistungStatusComboBox.click();
            for (const leistung of leistungStatus) {
                await this.page.getByRole("option", { name: `${leistung}` }).click();
            }
            await this.page.keyboard.press("Escape");
        }
        if (gemeinde !== "") {
            await this.zustandigeGemeindeComboBox.pressSequentially(gemeinde);
            await this.page
                .getByRole("option", { name: `${gemeinde}` })
                .last()
                .click();
            await this.navigationPage.waitForPageReady();
        }
    }
    async validateAnzahl(anzahlTrefferBigger: string) {
        // Wait for search results to appear (aria-live region updates)
        await this.page.locator("div[aria-live='polite']:visible").first().waitFor({ state: "visible", timeout: 10000 });

        // Small delay to ensure the count text has updated
        await this.page.waitForTimeout(500);

        const textContent = await this.page.locator("div[aria-live='polite']:visible").first().textContent();
        const match = textContent?.match(/(?:von|sur)\s+(\d+)/i);
        const total = match ? parseInt(match[1], 10) : 0;
        console.log("Anzahl: ***" + total);
        expect.soft(total).toBeGreaterThan(parseInt(anzahlTrefferBigger));
    }

    async searchForDossier(name: string, vorname: string, ahvNumber: string, geburtsdatum: string, geschlecht: string, strasse: string, hausNr: string, ort: string) {
        await this.nameSearchInput.pressSequentially(name);
        await Promise.all([this.navigationPage.waitForSpinnerToDisappear(), this.commonPage.waitForApiHelper(this.page, "SearchPersonInMultipleSystemsQuery", async () => {})]);
        await this.vornameSearchInput.fill(vorname);
        await Promise.all([this.navigationPage.waitForSpinnerToDisappear(), this.commonPage.waitForApiHelper(this.page, "SearchPersonInMultipleSystemsQuery", async () => {})]);
        if (ahvNumber !== "") {
            await this.ahvSearchInput.fill(this.commonPage.formatAHV(ahvNumber));
            await Promise.all([this.navigationPage.waitForSpinnerToDisappear(), this.commonPage.waitForApiHelper(this.page, "SearchPersonInMultipleSystemsQuery", async () => {})]);
        }
        if (geburtsdatum !== "") {
            await this.geburtsdatumSearchInput.fill(geburtsdatum);
            await Promise.all([this.navigationPage.waitForSpinnerToDisappear(), this.commonPage.waitForApiHelper(this.page, "SearchPersonInMultipleSystemsQuery", async () => {})]);
        }
        if (geschlecht !== "") {
            await this.genderComboBox.click();
            await this.page.getByRole("option", { name: `${geschlecht}` }).click();
            await Promise.all([this.navigationPage.waitForSpinnerToDisappear(), this.commonPage.waitForApiHelper(this.page, "SearchPersonInMultipleSystemsQuery", async () => {})]);
        }
        if (strasse !== "") {
            await this.strasseTextBox.fill(strasse);
            await Promise.all([this.navigationPage.waitForSpinnerToDisappear(), this.commonPage.waitForApiHelper(this.page, "SearchPersonInMultipleSystemsQuery", async () => {})]);
        }
        if (hausNr !== "") {
            await this.hausnummerTextBox.fill(hausNr);
            await Promise.all([this.navigationPage.waitForSpinnerToDisappear(), this.commonPage.waitForApiHelper(this.page, "SearchPersonInMultipleSystemsQuery", async () => {})]);
        }
        if (ort !== "") {
            await this.ortComboBox.pressSequentially(ort);
            await this.page.getByRole("option", { name: `${ort}` }).click();
            await Promise.all([this.navigationPage.waitForSpinnerToDisappear(), this.commonPage.waitForApiHelper(this.page, "SearchPersonInMultipleSystemsQuery", async () => {})]);
        }
        await this.page.locator(`tr:has-text('${name}')`).first().locator("button").click();
    }

    async inputPrivateNumber(privateNumber: string | number) {
        await this.privateNumTxtbox.fill(String(privateNumber));
    }
    async inputdossierbezeichnungInfo(dossierBezeichnung: string, eroeffnetAm: string, dossiersprache: string) {
        await this.dossierbezeichnungTxtbox.fill(dossierBezeichnung);
        await this.eroffnetAmtxtbox.fill(eroeffnetAm);
        await this.dossierspracheSelectOption.click();
        await this.page.locator(`mat-option:has-text("${dossiersprache}")`).click();
    }
    async inputdossierbezeichnungInfoFR(dossierBezeichnung: string, eroeffnetAm: string, dossiersprache: string) {
        await this.dossierbezeichnungTxtboxFR.fill(dossierBezeichnung);
        await this.eroffnetAmtxtboxFR.fill(eroeffnetAm);
        await this.dossierspracheSelectOption.click();
        await this.page.locator(`mat-option:has-text("${dossiersprache}")`).click();
    }
    async expectBtnDossierEroffnenActived() {
        await expect.soft(this.dossierOpenBtn).toBeEnabled();
    }
    async expectBtnPersonZuweisenActived() {
        await this.page.waitForLoadState("load");
        await expect.soft(this.personenZuweisenBtn).toBeEnabled();
    }
    async expectBtnHaushaltUbernehmenActived() {
        await expect.soft(this.householdTakeOverBtn).toBeEnabled();
    }
    async expectBtnHaushaltUbernehmenActivedFR() {
        await expect.soft(this.householdTakeOverBtnFR).toBeEnabled();
    }
    async expectBtnPersonUbernehmenActived() {
        const matError = this.page
            .locator("mat-error", {
                hasText: /Bei Angabe einer Zahlungsverbindung ist der Ort ein Pflichtfeld|Si vous indiquez un lien de paiement, le lieu est un champ obligatoire/i
            })
            .last();
        if (!matError.isVisible()) {
            await expect.soft(this.personUbernehmenBtn).toBeEnabled();
        }
    }
    async expectErrorMsgNotVisible() {
        await expect.soft(this.ahvErrorMsg).not.toBeVisible();
    }
    //click on searched dossier
    async clickOnSearchedDossier(name: string, vorname: string, geburtsTag: string, aHV: string, dossier: string) {
        await this.page
            .getByRole("button", {
                name: /Filter zurücksetzen|Réinitialiser le filtre/i
            })
            .click();
        await this.page.getByTestId("nachname").getByTestId("root-control").fill(name);
        await this.page.getByTestId("vorname").getByTestId("root-control").fill(vorname);
        await this.page.getByTestId("ahvNummer").getByTestId("root-control").fill(aHV);
        await this.geburtsdatumSearchInput.fill(geburtsTag);
        await this.navigationPage.waitForPageReady();
        await this.navigationPage.waitForSpinnerToDisappear();
        try {
            await this.page.locator(`tr:has-text('${name}')`).waitFor({ state: "visible", timeout: 5000 });
            await this.page.locator(`tr:has-text('${name}') a`).click();
        } catch {
            await this.page.getByTestId("nachname").getByTestId("root-control").fill("");
            await this.page.getByTestId("nachname").getByTestId("root-control").pressSequentially(name);
        }
    }

    async searchDossier(name: string, vorname: string, ahvNumber: string, geburtsdatum: string) {
        await this.page.getByTestId("nachname").getByTestId("root-control").fill(name);
        await this.page.getByTestId("vorname").getByTestId("root-control").fill(vorname);
        await this.page.getByTestId("ahvNummer").getByTestId("root-control").fill(ahvNumber);
        await this.geburtsdatumSearchInput.fill(geburtsdatum);
    }
    async inputValidDate(validDate: string) {
        await this.inputValidDateTxtbox.fill(validDate);
    }

    async clickBtnPersonManuellErfassen() {
        await this.newDossierBtn.click();
    }
    async inputName(name: string) {
        await this.inputNameTextbox.fill(name);
    }

    async inputVorname(vorname: string) {
        await this.inputVornameTextbox.fill(vorname);
    }

    async inputAHVNumber(ahvNumber: string) {
        if (ahvNumber !== "" && ahvNumber !== "-") {
            await this.inputAHVNumbTextbox.fill(ahvNumber);
        }
    }
    async selectLanguage(language: string) {
        if (language !== "" && language !== "-") {
            await this.languageCombobox.click();
            await this.page.locator(`mat-option:has-text("${language}")`).click();
        }
    }
    async selectZivilstand(zivilstand: string, zivilstandSeit: string | undefined | null) {
        if (zivilstand !== "" && zivilstand !== "-") {
            await this.zivilstandComboBox.click();
            await this.page.locator(`mat-option:has-text("${zivilstand}")`).first().click();
        }
        if (zivilstandSeit !== "" && zivilstandSeit !== "-" && zivilstandSeit !== undefined && zivilstandSeit !== null) {
            await this.zivilstandSeitDate.fill(zivilstandSeit);
        }
    }
    async selectNationality(national: string) {
        if (national !== "" && national !== "-") {
            await this.nationalComboBox.click();
            await this.page.locator(`mat-option:has-text("${national}")`).click();
        }
    }

    async selectAufenthaltsStatus(aufenthalt: string | undefined | null, aufenGultigVon: string | undefined | null, aufenGultigBis: string | undefined | null) {
        if (aufenthalt !== "" && aufenthalt !== "-" && aufenthalt !== undefined && aufenthalt !== null) {
            await this.aufenthaltsstatusComboBox.click();
            await this.page.locator(`mat-option:has-text("${aufenthalt}")`).click();
        }
        if (aufenGultigVon !== "" && aufenGultigVon !== "-" && aufenGultigVon !== undefined && aufenGultigVon !== null) {
            await this.aufenthalsstatusGultigVon.fill(aufenGultigVon);
        }
        if (aufenGultigBis !== "" && aufenGultigBis !== "-" && aufenGultigBis !== undefined && aufenGultigBis !== null) {
            await this.aufenthalsstatusGultigBis.fill(aufenGultigBis);
        }
    }
    async selectGender(gender: string) {
        if (gender !== "" && gender !== "-") {
            await this.genderComboBox.click();
            await this.page.locator(`mat-option:has-text("${gender}")`).click();
        }
    }

    async inputBirthday(geburtsdatum: string) {
        if (geburtsdatum !== "" && geburtsdatum !== "-") {
            await this.inputBirthDayTextbox.fill(geburtsdatum);
        }
    }

    async inputMobileNumber(mobile: number | string) {
        await this.mobileNumTxtbox.fill(`${mobile}`);
    }

    async inputEmail(email: string) {
        await this.emailTxtbox.fill(email);
    }
    async inputZusatz(zuzats: string) {
        await this.zusatzTxtbox.fill(zuzats);
    }

    async inputStrasse(strasse: string) {
        await this.strasseTxtbox.fill(strasse);
    }
    async inputHouseNumber(houseNumber: string | number) {
        await this.houseNumberTxtbox.fill(String(houseNumber));
    }
    async inputIban(iban: string) {
        await this.ibanTxtbox.pressSequentially(iban, { delay: 10 });
        await this.ibanTxtbox.blur();
        await this.page.waitForTimeout(500);
    }

    async selectGemeinde(gemeinde: string) {
        await this.zustandigeCombobox.fill(gemeinde);
        await this.page.locator(`mat-option:has-text("${gemeinde}")`).last().click();
    }

    async selectSozialarbeit(sozialarbeitTeam: string, sozialarbeitIncharge: string) {
        await this.sozialarbeitTeamDropdown.fill(sozialarbeitTeam);
        await this.page.locator(`mat-option:has-text("${sozialarbeitTeam}")`).first().click();
        await this.sozialarbeitInchargeDropdown.click();
        await this.sozialarbeitInchargeDropdown.fill(sozialarbeitIncharge);
        await this.page.locator(`mat-option:has-text("${sozialarbeitIncharge}")`).first().click();
    }
    async selectSachbearbeitung(sachbeareitungTeam: string, sachbearitIncharge: string) {
        await this.sachbeareitungDropdown.fill(sachbeareitungTeam);
        await this.page.locator(`mat-option:has-text("${sachbeareitungTeam}")`).first().click();
        await this.sachbearitInchargeDropdown.dblclick();
        await this.sachbearitInchargeDropdown.fill(sachbearitIncharge);
        await this.page.locator(`mat-option:has-text("${sachbearitIncharge}")`).first().click();
    }

    async selectOrt(ort: string): Promise<void> {
        await this.ortComboBox.pressSequentially(ort, { delay: 0 });
        const optionLocator = this.page.locator(`mat-option:has-text('${ort}')`);
        const isOptionVisible = await optionLocator.first().isVisible();
        console.log(" ORT ", isOptionVisible);
        try {
            await expect(optionLocator).toBeVisible({ timeout: 10000 });
            await this.page.getByRole("option", { name: `${ort}`, exact: true }).click();
        } catch {
            await this.page.keyboard.press("Escape");
            await this.ortComboBox.fill("");
            await this.ortComboBox.pressSequentially(ort, { delay: 0 });
            await this.page.getByRole("option", { name: `${ort}`, exact: true }).click();
        }
    }

    async clickBtnPersonenZuewisen() {
        await this.personenZuweisenBtn.click();
    }

    async clickBtnDossierOpen(): Promise<string> {
        await this.dossierOpenBtn.click();

        // waitForPageReady now includes Angular stability check (Phase 1)
        await this.navigationPage.waitForPageReady({ timeout: 15000 });
        // Changed from networkidle to domcontentloaded for better performance
        // networkidle can take 5-15s+ in apps with polling/analytics
        await this.page.waitForLoadState("domcontentloaded", { timeout: 15000 });

        const currentUrl = this.page.url();
        const guidMatch = currentUrl.match(/\/dossiers\/([a-f0-9-]{36})/i);
        const dossierGuid = guidMatch ? guidMatch[1] : "";

        return dossierGuid;
    }
    async clickBtnTakeOverPerson() {
        await this.personUbernehmenBtn.focus();
        await this.personUbernehmenBtn.click({ delay: 1000 });
    }

    async enterPersonManually() {
        await this.clickBtnPersonManuellErfassen();
    }

    async clickBtnHouseholdTakeOver() {
        await this.householdTakeOverBtn.click();
    }

    //PL17
    async addNewAufenthaltsadresseErfassen() {
        await this.aufenthaltsadresseErfassenBtn.click();
    }

    async fillValueAufenthaltsadresseErfassenInstitution(institution: string, gueltigVon: string, gueltigBis: string, personZuweisen: string) {
        await this.institutionCheckBox.click();
        await this.selectInstitution.click();
        await this.page.getByRole("option", { name: `${institution}` }).click();
        await this.fillGueltigVon.fill(`${gueltigVon}`);
        await this.fillGueltigBis.fill(`${gueltigBis}`);
        await this.clickPersonToggle(personZuweisen);
        await this.stabilityHelper.stableClick(this.btnSpeichern);
        await this.navigationPage.waitForPageReady();
    }
    //PL16
    async fillValueAufenthaltsadresseErfassenFreieAdresse(zusatz: string, strasse: string, hausnummer: string, PLZ_Ort: string, gueltigVon: string, gueltigBis: string, personZuweisen: string) {
        await this.freieAdresseCheckBox.click();
        await this.zusatzTextBox.fill(`${zusatz}`);
        await this.strasseTextBox.fill(`${strasse}`);
        await this.hausnummerTextBox.fill(`${hausnummer}`);
        //fix
        await this.textBoxOrt.pressSequentially(`${PLZ_Ort}`, { delay: 100 });
        await this.page.keyboard.press("Backspace");
        await this.page.getByRole("option", { name: `${PLZ_Ort}`, exact: true }).click();
        await this.fillGueltigVon.fill(`${gueltigVon}`);
        await this.fillGueltigBis.fill(`${gueltigBis}`);
        await this.clickPersonToggle(personZuweisen);
        await this.stabilityHelper.stableClick(this.btnSpeichern);
        await this.navigationPage.waitForPageReady();
    }

    /**
     * Clicks the toggle switch for a specific person in the person-toggle-select component.
     * Uses multiple strategies for robustness across different DOM structures.
     */
    private async clickPersonToggle(personName: string): Promise<void> {
        const personToggleContainer = this.page.locator("app-person-toggle-select");

        // Strategy 1: Try app-card with switch role (most common structure)
        const appCardSwitch = personToggleContainer.locator("app-card").filter({ hasText: personName }).getByRole("switch");

        if ((await appCardSwitch.count()) > 0) {
            await appCardSwitch.click();
            return;
        }

        // Strategy 2: Try app-person-card-row with button (used in wohnsituation)
        const personCardRowButton = personToggleContainer.locator(`app-person-card-row:has-text("${personName}")`).locator("button");

        if ((await personCardRowButton.count()) > 0) {
            await personCardRowButton.click();
            return;
        }

        // Strategy 3: Try mat-slide-toggle within filtered container
        const matSlideToggle = personToggleContainer.locator("app-card, app-person-card-row").filter({ hasText: personName }).locator("mat-slide-toggle, button[role='switch']");

        if ((await matSlideToggle.count()) > 0) {
            await matSlideToggle.click();
            return;
        }

        // Strategy 4: Fallback to original pattern (for backward compatibility)
        await this.page.locator("app-person-toggle-select div").filter({ hasText: personName }).nth(2).getByRole("switch", { name: "" }).click();
    }
}
