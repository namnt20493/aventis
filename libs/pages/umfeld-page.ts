import { Page, Locator, expect, Dialog } from "@playwright/test";
import { NavigationPage } from "./navigation-page";
import { CommonPage } from "./common-page";
import { expectValue, fillForm } from "../utils/helpers/formFillHelper";
import { StabilityHelper } from "../utils/stability-helper";

export class umfeldPage {
    page: Page;
    stabilityHelper: StabilityHelper;
    bezugspersonenBtn: Locator;
    txtBoxNachname: Locator;
    txtVorName: Locator;
    txtRolle: Locator;
    btnBezugspersonAccept: Locator;
    editBtnInSiteAdressen: Locator;
    txtBoxZusatz: Locator;
    txtBoxStrasse: Locator;
    txtBoxHausnummer: Locator;
    txtBoxOrt: Locator;
    btnSpeichern: Locator;
    btnSchliessen: Locator;
    btnAnfragen: Locator;
    openZahlungsverbindungenEdit: Locator;
    btnAddZahlungsverbindung: Locator;
    txtBoxIban: Locator;
    txtBoxStrasseZahlungsverbindungen: Locator;
    txtBoxNumZahlungsverbindungen: Locator;
    txtBoxPostfachZahlungsverbindungen: Locator;
    txtBoxOrtZahlungsverbindungen: Locator;
    txtBoxGueltigVonZahlungsverbindungen: Locator;
    txtBoxGueltigBisZahlungsverbindungen: Locator;
    btnBewilligungOffnen: Locator;
    navigation: NavigationPage;
    navi: any;
    btnEditKommunikation: Locator;
    btnAddTelefonNumber: Locator;
    btnTelefonnummerGeschaft: Locator;
    txtBoxTelefonnummerGeschaft: Locator;
    btnAddAndererKommunikationskanal: Locator;
    btnAddEmailPrivat: Locator;
    txtBoxEmailPrivat: Locator;
    btnAddEmailGeschaft: Locator;
    txtBoxEmailGeschaft: Locator;
    btnEditBeziehungen: Locator;
    txtBoxRolleInDossier: Locator;
    btnAddBeziehungErfassen: Locator;
    txtBoxBeziehung: Locator;
    txtBoxKlientschaft: Locator;
    txtBoxGueltVon: Locator;
    txtBoxgueltBis: Locator;
    btnInstitutionenErfassen: Locator;
    institutionCombobox: Locator;
    kontaktpersonCombobox: Locator;
    rolleTxtbox: Locator;
    institutionOderBtn: Locator;
    institutionOrFachPersonNameTxtbox: Locator;
    namenszusatzTxtbox: Locator;
    telefonNumberTxtbox: Locator;
    postfachTxtbox: Locator;
    typenCombobox: Locator;
    mailTxtbox: Locator;
    websiteTxtbox: Locator;
    postleitzahlOrtCombobox: Locator;
    commonPage: CommonPage;
    abteilungTxtbox: Locator;
    telefonGeschaeftTxtbox: Locator;
    telefonMobileTxtbox: Locator;
    inhaberNameTxtbox: Locator;
    inhaberPlzOrtTxtbox: Locator;
    fachpersonGeschlechtCombobox: Locator;
    fachpersonErfassenBtn: Locator;
    searchInputTxtbox: Locator;
    kontaktpersonErfassenBtn: Locator;
    zahlungsverbindungErfassenBtn: Locator;
    zahlungenEditBtn: Locator;
    kontaktPersonEditBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.navigation = new NavigationPage(page);
        this.commonPage = new CommonPage(page);
        this.stabilityHelper = new StabilityHelper(page);
        this.bezugspersonenBtn = page.getByRole("button", {
            name: /Bezugsperson erfassen|Ajouter une personne de référence/i
        });
        this.txtBoxNachname = page.getByTestId("nachname").getByTestId("root-control");
        this.txtVorName = page.getByTestId("vorname").getByTestId("root-control");
        this.txtRolle = page.getByTestId("rolleInDossier").getByTestId("root-control");
        this.btnBezugspersonAccept = page.getByRole("button", {
            name: /Bezugsperson erfassen|Ajouter une personne de référence/i
        });
        this.editBtnInSiteAdressen = page
            .locator("mat-expansion-panel")
            .filter({ hasText: /Adressen|Adresses/i })
            .locator("button");
        this.txtBoxZusatz = page.getByTestId("zusatz").getByTestId("root-control");
        this.txtBoxStrasse = page.getByTestId("strasse").getByTestId("root-control");
        this.txtBoxHausnummer = page.getByTestId("hausnummer").getByTestId("root-control");
        this.txtBoxOrt = page.getByTestId("plzOrt").getByTestId("root-control");
        this.btnSchliessen = page.getByTestId("close-dialog");
        this.btnSpeichern = page.getByRole("button", {
            name: /Speichern|Enregistrer/i
        });
        this.openZahlungsverbindungenEdit = page
            .locator("mat-expansion-panel")
            .filter({ hasText: /Zahlungsverbindungen|Coordonnées de paiement/i })
            .locator("button");
        this.btnAddZahlungsverbindung = page.getByRole("button", {
            name: /Zahlungsverbindung erfassen|Ajouter des coordonnées de paiement/i
        });
        this.txtBoxIban = page.getByTestId("iban").getByTestId("root-control");
        this.txtBoxStrasseZahlungsverbindungen = page.getByTestId("inhaberStrasse").getByTestId("root-control");
        this.txtBoxNumZahlungsverbindungen = page.getByTestId("inhaberHausNr").getByTestId("root-control");
        this.txtBoxPostfachZahlungsverbindungen = page.getByTestId("inhaberPostfach").getByTestId("root-control");
        this.txtBoxOrtZahlungsverbindungen = page.getByRole("combobox", {
            name: /Ort|Localité/i
        });
        this.txtBoxGueltigVonZahlungsverbindungen = page.getByTestId("validFrom").getByTestId("root-control");
        this.txtBoxGueltigBisZahlungsverbindungen = page.getByTestId("validThrough").getByTestId("root-control");
        this.btnBewilligungOffnen = page.locator("app-approval-workflow-open-button", { hasText: /Bewilligung öffnen|Ouvrir la validation/i });
        this.btnAnfragen = page.getByRole("button", {
            name: /Anfragen|Demande de la validation/i
        });
        this.btnEditKommunikation = page.getByRole("button", { name: /Kommunikation| Communication /i }).getByTestId("widget-edit");
        this.btnAddTelefonNumber = page.getByRole("button", {
            name: /Telefonnummer erfassen|Ajouter le numéro de téléphone/i
        });
        this.btnTelefonnummerGeschaft = page.getByRole("button", {
            name: /Numéro de téléphone professionnel|Telefonnummer Geschäft/i
        });
        this.txtBoxTelefonnummerGeschaft = page.getByRole("textbox", {
            name: /Telefonnummer Geschäft|Numéro de téléphone professionnel/i
        });
        this.btnAddAndererKommunikationskanal = page.getByRole("button", {
            name: /Anderer Kommunikationskanal erfassen|Ajouter un autre canal de communication/i
        });
        this.btnAddEmailPrivat = page.getByRole("button", {
            name: /E-Mail Privat|E-mail privé/i
        });
        this.txtBoxEmailPrivat = page.getByRole("textbox", {
            name: /E-Mail Privat|E-mail privé/i
        });
        this.btnAddEmailGeschaft = page.getByRole("button", {
            name: /E-Mail Geschäft|E-mail professionnel/i
        });
        this.txtBoxEmailGeschaft = page.getByRole("textbox", {
            name: /E-Mail Geschäft|E-mail professionnel/i
        });
        this.btnEditBeziehungen = page.getByRole("button", { name: /Beziehungen|Relations/i }).getByTestId("widget-edit");
        this.txtBoxRolleInDossier = page.getByTestId("rolleInDossier").getByTestId("root-control");
        this.btnAddBeziehungErfassen = page.getByRole("button", {
            name: /Beziehung erfassen|Ajouter une relation/i
        });
        this.txtBoxBeziehung = page.getByTestId("beziehungsart").getByTestId("root-control");
        this.txtBoxKlientschaft = page.getByTestId("personInDossierId").getByTestId("root-control");
        this.txtBoxGueltVon = page.getByTestId("validFrom").getByTestId("root-control");
        this.txtBoxgueltBis = page.getByTestId("validThrough").getByTestId("root-control");
        this.btnInstitutionenErfassen = page.locator("app-content").getByRole("button", {
            name: /Institution erfassen|Saisir une institution/i
        });
        this.institutionCombobox = page.getByTestId("institutionId").getByRole("combobox");
        this.kontaktpersonCombobox = page.getByTestId("institutionKontaktpersonId").getByRole("combobox");
        this.rolleTxtbox = page.getByTestId("rolle").getByTestId("root-control");
        this.institutionOderBtn = page.getByRole("button", {
            name: /Institution oder Fachperson hinzufügen|Ajouter une institution ou un·e spécialiste/i
        });
        //23.10.2025
        this.fachpersonErfassenBtn = page.getByRole("button", {
            name: /Fachperson erfassen|Ajouter un·e spécialiste/i
        });
        this.institutionOrFachPersonNameTxtbox = page.getByTestId("name").getByTestId("root-control");
        this.namenszusatzTxtbox = page.getByTestId("namenszusatz").getByTestId("root-control");
        this.telefonNumberTxtbox = page.getByTestId("telefon").getByTestId("root-control");
        this.postfachTxtbox = page.getByTestId("postfach").getByTestId("root-control");
        this.typenCombobox = page.getByTestId("typen").getByRole("combobox");
        this.mailTxtbox = page.getByTestId("mail").getByTestId("root-control");
        this.websiteTxtbox = page.getByTestId("website").getByTestId("root-control");
        this.postleitzahlOrtCombobox = page.getByTestId("postleitzahl").getByTestId("root-control");
        this.telefonGeschaeftTxtbox = page.getByTestId("telefonGeschaeft").getByTestId("root-control");
        this.telefonMobileTxtbox = page.getByTestId("telefonMobile").getByTestId("root-control");
        this.abteilungTxtbox = page.getByTestId("abteilung").getByTestId("root-control");
        this.inhaberNameTxtbox = page.getByTestId("inhaberName").getByTestId("root-control");
        this.inhaberPlzOrtTxtbox = page.getByTestId("inhaberPlzOrt").getByTestId("root-control");
        this.fachpersonGeschlechtCombobox = page.getByTestId("fachpersonGeschlecht").getByRole("combobox");
        //
        this.searchInputTxtbox = page.getByTestId("suchbegriff").getByTestId("root-control");
        this.kontaktpersonErfassenBtn = page.getByRole("button", {
            name: /Kontaktperson erfassen|Ajouter une personne de contact/i
        });
        this.zahlungsverbindungErfassenBtn = page.getByRole("button", {
            name: /Zahlungsverbindung erfassen|Ajouter des coordonnées de paiement/i
        });
        this.kontaktPersonEditBtn = page.locator("app-widget-host").filter({ hasText: "Kontaktperson" }).locator("button mat-icon[data-mat-icon-name='edit']");
        this.zahlungenEditBtn = page
            .locator("app-widget-host")
            .filter({ hasText: /Zahlungsverbindungen|Coordonnées de paiement/i })
            .locator("button mat-icon[data-mat-icon-name='edit']");
    }
    async zahlungsverbindungUpdate(titleBank: string, IBAN: string, vonDatum: string, bisDatum: string, divDocument: string) {
        const zahlungsverbindungenAppCard = this.page
            .getByTestId("zahlungsverbindung-card")
            .filter({ hasText: this.commonPage.formatIBAN(IBAN) })
            .filter({ hasText: titleBank });
        const vonDatumField = zahlungsverbindungenAppCard.getByTestId("validFrom").getByTestId("root-control");
        const bisDatumField = zahlungsverbindungenAppCard.getByTestId("validThrough").getByTestId("root-control");
        await this.zahlungenEditBtn.click();
        await fillForm(vonDatumField, vonDatum);
        await fillForm(bisDatumField, bisDatum);
        const fileInput = zahlungsverbindungenAppCard.locator('app-file-upload-card input[type="file"]');
        await this.commonPage.uploadFile(fileInput, divDocument);
        await this.navigation.waitForPageReady();
        await this.stabilityHelper.stableClick(this.btnSpeichern);
        await this.navigation.waitForPageReady();
        await this.navigation.waitForSpinnerToDisappear();
    }

    async verifyZahlungsverbindungAddedSuccessfully(IBAN: string) {
        const zahlungenCard = this.page
            .locator("app-zahlungsverbindungen-widget-readonly")
            .locator("app-card")
            .filter({ hasText: this.commonPage.formatIBAN(IBAN) });
        const gultikeitField = zahlungenCard.locator("app-readmode-field").filter({ hasText: /Gültigkeit|Validité/i });
        await expect(zahlungenCard, "Zahlungsverbindung card should be present").toBeVisible();
    }
    async fillZahlungsverbindungenInfo(IBAN: string, vonDatum: string, bisDatum: string) {
        const zahlungsverbindungenAppCard = this.page.getByTestId("zahlungsverbindung-card").filter({ hasText: this.commonPage.formatIBAN(IBAN) });
        const vonDatumField = zahlungsverbindungenAppCard.getByTestId("validFrom").getByTestId("root-control");
        const bisDatumField = zahlungsverbindungenAppCard.getByTestId("validThrough").getByTestId("root-control");
        await Promise.all([fillForm(vonDatumField, vonDatum), fillForm(bisDatumField, bisDatum)]);
        await this.stabilityHelper.stableClick(this.btnSpeichern);
        await this.navigation.waitForPageReady();
        await this.navigation.waitForSpinnerToDisappear();
    }
    async addZahlungsverbindungen(IBAN: string) {
        await this.zahlungenEditBtn.click();
        await this.zahlungsverbindungErfassenBtn.click();
        await this.txtBoxIban.fill(IBAN);
        await this.navigation.waitForPageReady();
        await this.zahlungsverbindungErfassenBtn.click();
        await this.navigation.waitForPageReady();
    }
    async verifyKontaktpersonAddedSuccessfully(vorName: string, nachName: string, telGeschaft: number, telMobile: number, eMail: string, abteilung: string) {
        const personCard = this.page
            .locator("app-card")
            .filter({ hasText: `${nachName} ${vorName}` })
            .first();
        const vornameField = personCard.locator("app-readmode-field").filter({ hasText: /vorname|Prénom/i });
        const nachnameField = personCard.locator("app-readmode-field").filter({ hasText: /name|Nom/i });
        const telefonGeschaftField = personCard.locator("app-readmode-field").filter({ hasText: /Telefon Geschäft|Téléphone professionnel/i });
        const telefonMobileField = personCard.locator("app-readmode-field").filter({ hasText: /Telefon Mobile|Téléphone mobile/i });
        const emailField = personCard.locator("app-readmode-field").filter({ hasText: "E-Mail" });
        const abteilungField = personCard.locator("app-readmode-field").filter({ hasText: /Abteilung|Département/i });
        await expect(personCard, "Personkontakt should be present").toBeVisible();
        await expect.soft(vornameField, "Vorname value is incorrect").toContainText(vorName);
        await expect.soft(nachnameField, "Nachname value is incorrect").toContainText(nachName);
        await Promise.all([expectValue(telefonGeschaftField, telGeschaft, "Telefon Geschäft value is incorrect"), expectValue(telefonMobileField, telMobile, "Telefon Mobile value is incorrect"), expectValue(emailField, eMail, "E-Mail value is incorrect"), expectValue(abteilungField, abteilung, "Abteilung value is incorrect")]);
    }
    async addKontaktperson(vorName: string, nachName: string, telGeschaft: number, telMobile: number, eMail: string, abteilung: string) {
        const newPersonCard = this.page.locator("app-kontaktpersonen-of-institution-editable-widget-card").last();
        await this.kontaktPersonEditBtn.click();
        await this.kontaktpersonErfassenBtn.click();
        await newPersonCard.getByTestId("vorname").getByTestId("root-control").fill(vorName);
        await newPersonCard.getByTestId("nachname").getByTestId("root-control").fill(nachName);
        await fillForm(newPersonCard.getByTestId("telefonGeschaeft").getByTestId("root-control"), telGeschaft),
            await fillForm(newPersonCard.getByTestId("telefonMobile").getByTestId("root-control"), telMobile),
            await fillForm(newPersonCard.getByTestId("mail").getByTestId("root-control"), eMail),
            await fillForm(newPersonCard.getByTestId("abteilung").getByTestId("root-control"), abteilung),
            await this.stabilityHelper.stableClick(this.btnSpeichern);
        await this.navigation.waitForPageReady();
        await Promise.all([this.navigation.waitForSpinnerToDisappear(), this.page.waitForResponse((response) => response.url().includes("InstitutionKontaktpersonenQuery") && response.status() === 200)]);
    }
    async verifyIfEditKontaktpersonIsSuccessful(vorName: string, nachName: string, telGeschaeft: number, telMobile: number, eMail: string, abteilung: string) {
        const personCard = this.page
            .locator("app-card")
            .filter({ hasText: `${nachName} ${vorName}` })
            .first();
        const vornameField = personCard.locator("app-readmode-field").filter({ hasText: /vorname|Prénom/i });
        const nachnameField = personCard.locator("app-readmode-field").filter({ hasText: /^name|^Nom/i });
        const telefonGeschaftField = personCard.locator("app-readmode-field").filter({ hasText: /Telefon Geschäft|Téléphone professionnel/i });
        const telefonMobileField = personCard.locator("app-readmode-field").filter({ hasText: /Telefon Mobile|Téléphone mobile/i });
        const emailField = personCard.locator("app-readmode-field").filter({ hasText: "E-Mail" });
        const abteilungField = personCard.locator("app-readmode-field").filter({ hasText: /Abteilung|Département/i });
        await expect.soft(vornameField, "Vorname value is incorrect").toContainText(vorName);
        await expect.soft(nachnameField, "Nachname value is incorrect").toContainText(nachName);
        await Promise.all([expectValue(telefonGeschaftField, telGeschaeft, "Telefon Geschäft value is incorrect"), expectValue(telefonMobileField, telMobile, "Telefon Mobile value is incorrect"), expectValue(emailField, eMail, "E-Mail value is incorrect"), expectValue(abteilungField, abteilung, "Abteilung value is incorrect")]);
    }
    async editKontaktperson(oldPersonName: string, vorName: string, nachName: string, telGeschaeft: number, telMobile: number, eMail: string, abteilung: string) {
        const personCard = this.page.locator("app-kontaktpersonen-of-institution-editable-widget-card").filter({ hasText: oldPersonName }).first();
        await this.kontaktPersonEditBtn.click();
        await personCard.getByTestId("vorname").getByTestId("root-control").fill(vorName);
        await personCard.getByTestId("nachname").getByTestId("root-control").fill(nachName);
        await fillForm(personCard.getByTestId("telefonGeschaeft").getByTestId("root-control"), telGeschaeft),
            await fillForm(personCard.getByTestId("telefonMobile").getByTestId("root-control"), telMobile),
            await fillForm(personCard.getByTestId("mail").getByTestId("root-control"), eMail),
            await fillForm(personCard.getByTestId("abteilung").getByTestId("root-control"), abteilung),
            await this.stabilityHelper.stableClick(this.btnSpeichern);
        await this.navigation.waitForPageReady();
        await this.navigation.waitForSpinnerToDisappear();
    }

    async institutionDetails(institution: string, plzOrt: string) {
        const institutionRow = this.page.locator("tr").filter({ hasText: institution }).filter({ hasText: plzOrt }).first();
        await institutionRow.locator("button mat-icon[data-mat-icon-name='eye']").click();
    }
    async searchForInstitution(institution: string) {
        await this.searchInputTxtbox.pressSequentially(institution, { delay: 50 });
        await this.navigation.waitForPageReady();
    }
    async goToInstituionenUndFachpersonen() {}
    async institutionErfassen() {
        await this.navigation.closeBlockingDialog();
        await this.btnInstitutionenErfassen.waitFor({ state: "visible", timeout: 30000 });
        await this.stabilityHelper.stableClick(this.btnInstitutionenErfassen);
        await this.navigation.waitForPageReady();
        await this.navigation.waitForSpinnerToDisappear();
    }
    async fachpersonErfassen() {
        await this.fachpersonErfassenBtn.waitFor({ state: "visible", timeout: 30000 });
        await this.stabilityHelper.stableClick(this.fachpersonErfassenBtn);
        await this.navigation.waitForPageReady();
        await this.navigation.waitForSpinnerToDisappear();
    }
    async inputFachpersonDetails(name: string, strasse: string, vorname: string, hausNr: string, gueltigVon: string, gueltigBis: string, tel: string, eMail: string, ort: string, typisierung: string, geschlecht: string) {
        await this.institutionOrFachPersonNameTxtbox.fill(name);
        await this.txtVorName.fill(vorname);
        await this.txtBoxStrasse.fill(strasse);
        await this.txtBoxHausnummer.fill(hausNr);
        await this.txtBoxGueltVon.fill(gueltigVon);
        await this.txtBoxgueltBis.fill(gueltigBis);
        const typen = this.commonPage.separateText(typisierung);
        for (const type of typen) {
            await this.typenCombobox.click();
            await this.page.getByRole("option", { name: `${type}` }).click();
        }
        await this.page.keyboard.press("Tab");
        await this.telefonNumberTxtbox.fill(tel);
        await this.mailTxtbox.fill(eMail);
        await this.postleitzahlOrtCombobox.pressSequentially(ort, { delay: 200 });
        await this.page.getByRole("option", { name: `${ort}` }).click();
        await this.fachpersonGeschlechtCombobox.click();
        await this.page.getByRole("option", { name: `${geschlecht}` }).click();
        const enabledBtn = this.page
            .locator("button:enabled")
            .filter({ hasText: /Speichern|Enregistrer/i })
            .first();
        await enabledBtn.click();
        await this.navigation.waitForPageReady();
        await this.navigation.waitForSpinnerToDisappear();
    }
    async inputInstitutionDetails(name: string, strasse: string | number, hausNr: number, gueltigVon: string, gueltigBis: string, typisierung: string, tel: number, eMail: string, ort: string) {
        await this.institutionOrFachPersonNameTxtbox.fill(name);
        await this.txtBoxStrasse.fill(String(strasse));
        await this.txtBoxHausnummer.fill(String(hausNr));
        await this.txtBoxGueltVon.fill(gueltigVon);
        await this.txtBoxgueltBis.fill(gueltigBis);
        const typen = this.commonPage.separateText(typisierung);
        for (const type of typen) {
            await this.typenCombobox.click();
            await this.page.getByRole("option", { name: `${type}` }).click();
        }
        await this.telefonNumberTxtbox.fill(String(tel));
        await this.mailTxtbox.fill(eMail);
        await this.postleitzahlOrtCombobox.pressSequentially(ort, { delay: 200 });
        await this.page.getByRole("option", { name: `${ort}`, exact: true }).click();
        await this.page.keyboard.press("Escape");
        await this.navigation.waitForPageReady();
        const enabledBtn = this.page
            .locator("button:enabled")
            .filter({ hasText: /Speichern|Enregistrer/i })
            .first();
        await this.stabilityHelper.stableClick(enabledBtn);
        await this.navigation.waitForPageReady();
        await this.navigation.waitForSpinnerToDisappear();
    }

    async inputKontaktPersonDetails(kPName: string, kPVorname: string, kPTel: number, kPMobile: string | number, kPMail: string, kPAbteilung: string) {
        await this.page
            .getByRole("button", {
                name: /Kontaktperson erfassen|Ajouter une personne de contact/i
            })
            .click();
        await this.txtVorName.fill(kPVorname);
        await this.txtBoxNachname.fill(kPName);
        await this.telefonGeschaeftTxtbox.fill(String(kPTel));
        await this.telefonMobileTxtbox.fill(String(kPMobile));
        await this.mailTxtbox.fill(kPMail);
        await this.abteilungTxtbox.fill(kPAbteilung);
        const enabledBtn = this.page
            .locator("button:enabled")
            .filter({ hasText: /Speichern|Enregistrer/i })
            .first();
        await enabledBtn.click();
        await this.navigation.waitForPageReady();
        await this.navigation.waitForSpinnerToDisappear();
    }

    async inputIBAN(kPIBAN: string, iBANName: string, iBANStrasse: string, iBANhausNr: string, iBANPostfach: string, iBANOrt: string, iBANGultigVon: string, iBANGueltigBis: string) {
        await this.page
            .getByRole("button", {
                name: /Zahlungsverbindung erfassen|Coordonnées de paiement/i
            })
            .click();
        await this.txtBoxIban.fill(kPIBAN);
        await this.navigation.waitForPageReady();
        await this.btnAddZahlungsverbindung.click();
        await this.navigation.waitForPageReady();
        await this.navigation.waitForSpinnerToDisappear();
        await this.inhaberNameTxtbox.fill(iBANName);
        await this.txtBoxStrasseZahlungsverbindungen.first().fill(iBANStrasse);
        await this.txtBoxNumZahlungsverbindungen.first().fill(iBANhausNr);
        await this.txtBoxPostfachZahlungsverbindungen.first().fill(iBANPostfach);
        await this.txtBoxOrtZahlungsverbindungen.last().click();
        await this.txtBoxOrtZahlungsverbindungen.last().fill("");
        await this.txtBoxOrtZahlungsverbindungen.last().pressSequentially(iBANOrt, { delay: 100 });
        await this.page.getByRole("option", { name: `${iBANOrt}` }).click();
        await this.txtBoxGueltigVonZahlungsverbindungen.first().fill(iBANGultigVon);
        await this.txtBoxGueltigBisZahlungsverbindungen.first().fill(iBANGueltigBis);
        const enabledBtn = this.page
            .locator("button:enabled")
            .filter({ hasText: /Speichern|Enregistrer/i })
            .first();
        await enabledBtn.click();
        await this.navigation.waitForPageReady();
        await this.navigation.waitForSpinnerToDisappear();
    }
    async closeDialog() {
        await this.stabilityHelper.closeDialog();
    }

    async createNewInstitution(institution: string, kontaktPerson: string, rolle: string) {
        await this.btnInstitutionenErfassen.click();
        //26.06.2025 change to pressSequentially
        await this.institutionCombobox.pressSequentially(institution);
        await this.page
            .getByRole("option", { name: `${institution}` })
            .first()
            .click();
        if (kontaktPerson !== "") {
            await this.kontaktpersonCombobox.click();
            await this.page.getByRole("option", { name: `${kontaktPerson}` }).click();
        }
        await this.rolleTxtbox.fill(rolle);
        await this.institutionOderBtn.click();
        await this.navigation.waitForPageReady();
    }

    async editAdressen(ort: string, strasse: string, zusatz: string, hNummer: string) {
        await this.editBtnInSiteAdressen.click();
        await this.txtBoxZusatz.fill(zusatz);
        await this.txtBoxStrasse.fill(strasse);
        await this.txtBoxHausnummer.fill(hNummer);
        await this.txtBoxOrt.clear();
        await this.txtBoxOrt.first().pressSequentially(ort, { delay: 100 });
        await this.page.getByRole("option", { name: `${ort}` }).click();
        await this.stabilityHelper.stableClick(this.btnSpeichern);
        await this.navigation.waitForPageReady();
    }
    async editKommunikation(telefonGeschaeft: string, emailPrivat: string, emailGeschaeft: string) {
        await this.btnEditKommunikation.click();
        await this.btnAddTelefonNumber.click();
        await this.btnTelefonnummerGeschaft.click();
        await this.txtBoxTelefonnummerGeschaft.last().fill(telefonGeschaeft);
        await this.btnAddAndererKommunikationskanal.click();
        await this.btnAddEmailPrivat.click();
        await this.txtBoxEmailPrivat.last().fill(emailPrivat);
        await this.btnAddAndererKommunikationskanal.click();
        await this.btnAddEmailGeschaft.click();
        await this.txtBoxEmailGeschaft.last().fill(emailGeschaeft);
        await this.stabilityHelper.stableClick(this.btnSpeichern);
        await this.navigation.waitForPageReady();
        await this.navigation.waitForSpinnerToDisappear();
        await this.closeDialog();
    }
    async editBeziehungen(beziehungRolle: string, beziehungsTyp: string, vonKlient: string, gueltVon: string, gueltBis: string) {
        await this.btnEditBeziehungen.click();
        await this.txtBoxRolleInDossier.fill(beziehungRolle);
        await this.btnAddBeziehungErfassen.click();
        await this.txtBoxBeziehung.click();
        await this.page.getByRole("option", { name: `${beziehungsTyp}` }).click();
        await this.txtBoxKlientschaft.click();
        await this.page.getByRole("option", { name: `${vonKlient}` }).click();
        await this.txtBoxGueltVon.fill(gueltVon);
        await this.txtBoxgueltBis.fill(gueltBis);
        await this.stabilityHelper.stableClick(this.btnSpeichern);
        await this.navigation.waitForPageReady();
        await this.navigation.waitForSpinnerToDisappear();
        await this.closeDialog();
    }

    async addNewBezugspersonen() {
        await this.bezugspersonenBtn.click();
    }

    async fillInfoBezugsperson(name: string, vorname: string, rolle: string) {
        await this.txtBoxNachname.fill(name);
        await this.txtVorName.fill(vorname);
        await this.txtRolle.fill(rolle);
        await this.btnBezugspersonAccept.click();
    }

    async editBezugspersonen(name: string, vorname: string, zusatz: string, strasse: string, hausNummer: string | number, Ort: string) {
        await this.page
            .locator("app-person-card-row")
            .filter({ hasText: `${name}, ${vorname}` })
            .locator("a")
            .click();
        await this.editBtnInSiteAdressen.click();
        await this.page.getByRole("button", { name: /Abbrechen|Annuler/i }).click();
        await this.page
            .locator("mat-expansion-panel-header")
            .filter({ hasText: /Adressen|Adresses/i })
            .locator("button")
            .last()
            .click();
        await this.txtBoxZusatz.pressSequentially(zusatz);
        await this.txtBoxStrasse.fill(strasse);
        if (Ort !== "") {
            await this.txtBoxOrt.pressSequentially(Ort, { delay: 100 });
            // Wait for a non-disabled option (skip emptyoption)
            const enabledOption = this.page.locator('mat-option:not([aria-disabled="true"])').first();
            try {
                await enabledOption.waitFor({ state: "visible", timeout: 5000 });
                await enabledOption.click();
            } catch {
                // Fallback: try any visible option
                await this.page
                    .locator("mat-option")
                    .filter({ hasText: Ort.split(" ").pop() })
                    .first()
                    .click();
            }
        }
        await this.txtBoxHausnummer.fill(String(hausNummer));
        await this.stabilityHelper.stableClick(this.btnSpeichern);
        await this.navigation.waitForPageReady();
        await this.navigation.waitForSpinnerToDisappear();
        await this.closeDialog();
    }
    async openEditBezugspersonen(bezPerson: string) {
        await this.page
            .locator("app-person-card-row")
            .filter({ hasText: `${bezPerson}` })
            .locator("a")
            .click();
    }

    async openEditZahlungsverbindungen() {
        await this.openZahlungsverbindungenEdit.click();
        await this.btnAddZahlungsverbindung.click();
    }

    async fillValueZahlungsverbindungen(IBAN: string, gueltigVon: string, gueltigBis: string, strasse: string, nummer: string, postfach: string, ort: string, datei: string) {
        await this.txtBoxIban.fill(IBAN);
        await this.btnAddZahlungsverbindung.click();
        await this.txtBoxStrasseZahlungsverbindungen.last().fill(strasse);
        await this.txtBoxNumZahlungsverbindungen.last().fill(String(nummer));
        await this.txtBoxPostfachZahlungsverbindungen.last().fill(postfach);
        await this.txtBoxOrtZahlungsverbindungen.last().click({ delay: 1000 });
        await this.txtBoxOrtZahlungsverbindungen.last().fill("");
        await this.txtBoxOrtZahlungsverbindungen.last().pressSequentially(ort, { delay: 200 });
        // await this.page.locator('mat-option').first().waitFor({ state: 'visible' })
        await this.page
            .getByRole("option", { name: `${ort}`, exact: true })
            .last()
            .click();
        await this.txtBoxGueltigVonZahlungsverbindungen.last().fill(gueltigVon);
        await this.txtBoxGueltigBisZahlungsverbindungen.last().fill(gueltigBis);
        if (datei !== "") {
            const fileChooserPromise = this.page.waitForEvent("filechooser");
            await this.page.getByTestId("titleReady").last().click();
            const fileChooser = await fileChooserPromise;
            await fileChooser.setFiles(datei);
        }
        await this.stabilityHelper.stableClick(this.btnSpeichern.last());
        await this.navigation.waitForPageReady();
        await this.navigation.waitForSpinnerToDisappear();
        await this.closeDialog();
    }

    async requestConfirmation() {
        await this.btnBewilligungOffnen.click();
        await this.btnAnfragen.click();
        await this.navigation.waitForSpinnerToDisappear();
        await this.closeDialog();
    }
}
