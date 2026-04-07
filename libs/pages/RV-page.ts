import { Page, Locator, expect } from "@playwright/test";
import { NavigationPage } from "./navigation-page";
import { StabilityHelper } from "@utils/stability-helper";

export class RVPage {
    page: Page;
    private stabilityHelper: StabilityHelper;
    btnVerfahrenSpeichern: Locator;
    verfahrensStatus: Locator;
    erstelltDurchTxt: Locator;
    fillTitel: Locator;
    fillZugeteiltan: Locator;
    fillErstelltAm: Locator;
    fillFrist: Locator;
    selectStatus: Locator;
    fillAusgangslage: Locator;
    fillAuflagen: Locator;
    fillEntscheid: Locator;
    fillSanktionen: Locator;
    fillWeitereSanktionen: Locator;
    btnExpandAll: Locator;
    fillLeistungskurzungTitel: Locator;
    fillLeistungskurzungErstelltAm: Locator;
    fillLeistungskurzungSanktionVon: Locator;
    fillLeistungskurzungSanktionBis: Locator;
    chosseLeistungskurzungVerfahrensschrittStatus: Locator;
    chosseLeistungskurzungZugeteiltAn: Locator;
    genLeistungskurzungDocument: Locator;

    fillAussetzenDerLeistungenTitel: Locator;
    fillAussetzenDerLeistungenErstelltAm: Locator;
    fillAussetzenDerLeistungenSanktionVon: Locator;
    fillAussetzenDerLeistungenSanktionBis: Locator;
    chosseAussetzenDerLeistungenVerfahrensschrittStatus: Locator;
    chosseAussetzenDerLeistungenZugeteiltAn: Locator;
    btnAddNewBeschwerden: Locator;
    txtBoxTitelBeschwerden: Locator;
    txtBoxZustaendigBeschwerden: Locator;
    txtBoxBeschFuehrerBeschwerden: Locator;
    txtBoxVertretungNameBeschwerden: Locator;
    txtBoxVertretungVorname: Locator;
    txtBoxVertretungStrasseHausnummer: Locator;
    txtBoxOrt: Locator;
    txtBoxBeschwerdeVom: Locator;
    txtBoxBeschwerdeGrundKey: Locator;
    txtBoxEntscheidAngefochten: Locator;
    txtBoxRntscheidMitgeteilt: Locator;
    beschwerdeBtn: Locator;
    txtBoxTitelInstanzHinzufugen: Locator;
    txtBoxNummerInstanzHinzufugen: Locator;
    txtBoxStellungnahmeInstanzHinzufugen: Locator;
    txtBoxDatumInstanzHinzufugen: Locator;
    txtBoxArtDerEntschInstanzHinzufugen: Locator;
    txtBoxXerkuendungInstanzHinzufugen: Locator;
    txtBoxWeiterzugDatumInstanzHinzufugen: Locator;
    txtBoxWeiterzugGrundInstanzHinzufugen: Locator;
    inKraftGetretenCheckBox: Locator;
    btnAddNewErmittlungErfassen: Locator;
    txtBoxGueltigAbErmittlungErfassen: Locator;
    txtBoxBemerkungen: Locator;
    btnAntragSichern: Locator;
    btnBewilligungOffnen: Locator;
    btnGenDocument: Locator;
    btnAnfragen: Locator;
    navigation: NavigationPage;
    dialogContainer: Locator;
    dialogTitel: Locator;
    dialogZustaendig: Locator;
    dialogKommentar: Locator;
    dialogStatus: Locator;
    dialogBetroffenePersonen: Locator;
    dialogAusgangslage: Locator;
    btnSaveAndClose: Locator;
    btnCancelAndClose: Locator;

    constructor(page: Page) {
        this.page = page;
        this.stabilityHelper = new StabilityHelper(page);
        this.navigation = new NavigationPage(page);
        this.btnVerfahrenSpeichern = page.getByRole("button", {
            name: /Verfahren speichern|Enregistrer la procédure/i
        });
        this.verfahrensStatus = page.getByTestId("verfahrensstatus");
        this.erstelltDurchTxt = page.getByTestId("userId_ErstelltDurch").getByTestId("root-control");
        this.fillTitel = page.getByTestId("titel").getByTestId("root-control").first();
        this.fillZugeteiltan = page.getByTestId("userId_Zugeteilt").getByTestId("root-control");
        this.fillErstelltAm = page.getByTestId("datum").getByTestId("root-control");
        this.fillFrist = page.getByTestId("frist").getByTestId("root-control");
        this.selectStatus = page.getByTestId("verfahrensschrittStatus").getByTestId("root-control");
        this.fillAusgangslage = page.getByTestId("ausgangslageHtml").locator("div");
        this.fillAuflagen = page.getByTestId("auflagenHtml").locator("div");
        this.fillEntscheid = page.getByTestId("entscheidHtml").locator("div");
        this.fillSanktionen = page.getByTestId("sanktionenHtml").locator("div");
        this.fillWeitereSanktionen = page.getByTestId("weitereSanktionenHtml").locator("div");
        this.btnExpandAll = page.getByTestId("navigationTree-expandAll");
        this.fillLeistungskurzungTitel = page.getByLabel(/Leistungskürzung|Réduction des prestations/i).getByPlaceholder(/Titel|Titre/i);
        this.fillLeistungskurzungErstelltAm = page.getByLabel(/Leistungskürzung|Réduction des prestations/i).getByPlaceholder(/Erstellt|Créé/i);
        this.fillLeistungskurzungSanktionVon = page.getByLabel(/Leistungskürzung|Réduction des prestations/i).getByPlaceholder(/Sanktion von|Sanction du/i);
        this.fillLeistungskurzungSanktionBis = page.getByLabel(/Leistungskürzung|Réduction des prestations/i).getByPlaceholder(/Sanktion bis|Sanction jusqu'au/i);
        this.chosseLeistungskurzungVerfahrensschrittStatus = page
            .getByLabel(/Leistungskürzung|Réduction des prestations/i)
            .getByTestId("verfahrensschrittStatus")
            .locator("svg");
        this.chosseLeistungskurzungZugeteiltAn = page
            .getByLabel(/Leistungskürzung|Réduction des prestations/i)
            .getByTestId("root-control")
            .last();
        this.genLeistungskurzungDocument = page.getByLabel(/Leistungskürzung|Réduction des prestations/i).getByRole("button", { name: "Dokument generieren" });

        this.fillAussetzenDerLeistungenTitel = page.getByLabel(/Aussetzen der Leistungen|Suspension des prestations/i).getByPlaceholder(/Titel|Titre/i);
        this.fillAussetzenDerLeistungenErstelltAm = page.getByLabel(/Aussetzen der Leistungen|Suspension des prestations/i).getByPlaceholder(/Erstellt|Créé/i);
        this.fillAussetzenDerLeistungenSanktionVon = page.getByLabel(/Aussetzen der Leistungen|Suspension des prestations/i).getByPlaceholder(/Sanktion von|Sanction du/i);
        this.fillAussetzenDerLeistungenSanktionBis = page.getByLabel(/Aussetzen der Leistungen|Suspension des prestations/i).getByPlaceholder(/Sanktion bis|Sanction jusqu'au/i);
        this.chosseAussetzenDerLeistungenVerfahrensschrittStatus = page
            .getByLabel(/Aussetzen der Leistungen|Suspension des prestations/i)
            .getByTestId("verfahrensschrittStatus")
            .locator("svg");
        this.chosseAussetzenDerLeistungenZugeteiltAn = page
            .getByLabel(/Aussetzen der Leistungen|Suspension des prestations/i)
            .getByTestId("root-control")
            .last();

        this.btnAddNewBeschwerden = page.getByRole("button", {
            name: /Beschwerde|Recours/i
        });
        this.txtBoxTitelBeschwerden = page.getByTestId("titel").getByTestId("root-control");
        this.txtBoxZustaendigBeschwerden = page.getByTestId("userIds_Zustaendigkeit").getByTestId("root-control");
        this.txtBoxBeschFuehrerBeschwerden = page.getByTestId("personInDossierId_Beschwerdefuehrer").getByTestId("root-control");
        this.txtBoxVertretungNameBeschwerden = page.getByTestId("vertretungName").getByTestId("root-control");
        this.txtBoxVertretungVorname = page.getByTestId("vertretungVorname").getByTestId("root-control");
        this.txtBoxVertretungStrasseHausnummer = page.getByTestId("vertretungStrasseHausnummer").getByTestId("root-control");
        this.txtBoxOrt = page.getByRole("combobox", { name: /Ort|Localité/i });
        this.txtBoxBeschwerdeVom = page.getByTestId("beschwerdeVom").getByTestId("root-control");
        this.txtBoxBeschwerdeGrundKey = page.getByTestId("beschwerdeGrundKey").getByTestId("root-control");
        this.txtBoxEntscheidAngefochten = page.getByTestId("entscheidAngefochten").getByTestId("root-control");
        this.txtBoxRntscheidMitgeteilt = page.getByTestId("entscheidMitgeteilt").getByTestId("root-control");
        this.beschwerdeBtn = page.getByRole("button", {
            name: /Enregistrer le recours|Beschwerde sichern/i
        });
        this.txtBoxTitelInstanzHinzufugen = page.getByTestId("status").getByTestId("root-control");
        this.txtBoxNummerInstanzHinzufugen = page.getByTestId("nummer").getByTestId("root-control");
        this.txtBoxStellungnahmeInstanzHinzufugen = page.getByTestId("stellungnahme").getByTestId("root-control");
        this.txtBoxDatumInstanzHinzufugen = page.getByTestId("datum").getByTestId("root-control");
        this.txtBoxArtDerEntschInstanzHinzufugen = page.getByTestId("beschwerdeEntscheidungArtKey").getByTestId("root-control");
        this.txtBoxXerkuendungInstanzHinzufugen = page.getByTestId("verkuendung").getByTestId("root-control");
        this.txtBoxWeiterzugDatumInstanzHinzufugen = page.getByTestId("weiterzugDatum").getByTestId("root-control");
        this.txtBoxWeiterzugGrundInstanzHinzufugen = page.getByTestId("weiterzugGrund").getByTestId("root-control");
        this.inKraftGetretenCheckBox = page.getByTestId("inKraftGetreten").getByRole("checkbox");
        this.btnAddNewErmittlungErfassen = page.getByRole("button", {
            name: /Ermittlung erfassen|Enregistrer l'enquête/i
        });
        this.txtBoxGueltigAbErmittlungErfassen = page.getByTestId("antragsdatum").getByTestId("root-control");
        this.txtBoxBemerkungen = page.getByTestId("bemerkungen").getByTestId("root-control");
        this.btnAntragSichern = page.getByRole("button", {
            name: /Antrag sichern|Enregistrer la demande/i
        });
        this.btnBewilligungOffnen = page.getByRole("link", {
            name: /Bewilligung öffnen|Ouvrir la validation/i
        });
        this.btnGenDocument = page.getByRole("radio", {
            name: /Word generieren|Générer le document/i
        });
        this.btnAnfragen = page.getByRole("button", {
            name: /Anfragen|Demande de la validation/i
        });
        this.dialogContainer = page.locator("mat-dialog-container");
        this.dialogTitel = this.dialogContainer.getByTestId("titel").getByTestId("root-control");
        this.dialogZustaendig = this.dialogContainer.getByTestId("userId_Zustaendig").getByTestId("root-control");
        this.dialogKommentar = this.dialogContainer.getByTestId("kommentar").getByTestId("root-control");
        this.dialogStatus = this.dialogContainer.getByTestId("status").getByTestId("root-control");
        this.dialogBetroffenePersonen = this.dialogContainer.getByTestId("personInDossierIds_Betroffen");
        this.dialogAusgangslage = this.dialogContainer.getByTestId("ausgangslageHtml").locator("div.editor-target");
        this.btnSaveAndClose = this.dialogContainer.getByTestId("saveAndClose");
        this.btnCancelAndClose = this.dialogContainer.getByTestId("cancelAndClose");
    }

    async addNewAuflagenVerfahren() {
        await this.stabilityHelper.stableClick(this.page.getByTestId("auflagenverfahrenErfassen"));
        await this.navigation.waitForPageReady();
    }

    async fillInfoToTheVerfahren(verfahren: string, status1: string, erstelltDurch: string, betroffenPersonen: string) {
        await this.erstelltDurchTxt.fill(`${erstelltDurch}`);
        await this.page.getByRole("option", { name: `${erstelltDurch}` }).click();
        await this.verfahrensStatus.click({ delay: 1000 });
        await this.page.getByRole("option", { name: `${status1}` }).click();
        await this.page.reload();
        await this.erstelltDurchTxt.fill(`${erstelltDurch}`);
        await this.page.getByRole("option", { name: `${erstelltDurch}` }).click();
        await this.verfahrensStatus.click({ delay: 1000 });
        await this.page.getByRole("option", { name: `${status1}` }).click();
        await this.page
            .getByTestId("personInDossierIds_Betroffen")
            .locator("div")
            .filter({ hasText: `${betroffenPersonen}` })
            .nth(2)
            .getByRole("switch", { name: "" })
            .click();
    }
    async fillInForAuflagen(titel: string, zugeteiltAn: string, erstelltAm: string, frist: string, status2: string) {
        if (titel !== "") {
            await this.fillTitel.fill(`${titel}`);
        }

        if (zugeteiltAn !== "") {
            await this.fillZugeteiltan.fill(`${zugeteiltAn}`);
            await this.page.getByRole("option", { name: `${zugeteiltAn}` }).click();
        }
        if (erstelltAm !== "") {
            await this.fillErstelltAm.fill(`${erstelltAm}`);
        }
        if (frist !== "") {
            await this.fillFrist.fill(`${frist}`);
        }
        if (status2 !== "") {
            await this.selectStatus.click();
            await this.page.getByRole("option", { name: `${status2}` }).click();
        }
    }

    async slectDocument(document: string) {
        if (document !== "") {
            const fileChooserPromise = this.page.waitForEvent("filechooser");
            await this.page.getByTestId("dokumente").last().click();
            const fileChooser = await fileChooserPromise;
            await fileChooser.setFiles(`${document}`);
        }
    }

    async fillInfomationBoxes(ausgangslage: string, auflagen: string, entscheid: string, sanktionen: string, weitereSanktionen: string) {
        if (ausgangslage !== "") {
            await this.fillAusgangslage.last().fill(`${ausgangslage}`);
        }
        if (auflagen !== "") {
            await this.fillAuflagen.last().fill(`${auflagen}`);
        }
        if (entscheid !== "") {
            await this.fillEntscheid.last().fill(`${entscheid}`);
        }
        if (sanktionen !== "") {
            await this.fillSanktionen.last().fill(`${sanktionen}`);
        }
        if (weitereSanktionen !== "") {
            await this.fillWeitereSanktionen.last().fill(`${weitereSanktionen}`);
        }
    }

    async clickBtnVerfahrenSpeichern() {
        await this.stabilityHelper.stableClick(this.btnVerfahrenSpeichern);
        await this.navigation.waitForPageReady();
    }

    async fillAuflagenDialog(params: { titel: string; zustaendig: string; betroffenPersonen: string; ausgangslage?: string; kommentar?: string }) {
        const { titel, zustaendig, betroffenPersonen, ausgangslage, kommentar } = params;
        await this.dialogContainer.waitFor({ state: "visible", timeout: 15000 });
        await this.navigation.waitForPageReady();

        if (titel) {
            await this.dialogTitel.fill(titel);
        }

        if (zustaendig) {
            await this.dialogZustaendig.fill(zustaendig);
            await this.page.getByRole("option", { name: zustaendig }).click();
        }

        if (kommentar) {
            await this.dialogKommentar.fill(kommentar);
        }

        if (betroffenPersonen) {
            const personToggle = this.dialogBetroffenePersonen.locator("app-card").filter({ hasText: betroffenPersonen }).getByRole("switch");
            await personToggle.click();
        }

        if (ausgangslage) {
            await this.dialogAusgangslage.fill(ausgangslage);
        }
    }

    async saveAndCloseDialog() {
        await this.stabilityHelper.stableClick(this.btnSaveAndClose, { timeout: 15000 });
        await this.dialogContainer.waitFor({ state: "hidden", timeout: 15000 });
        await this.navigation.waitForPageReady();
    }

    async closeDialogWithoutSave() {
        const closeButton = this.dialogContainer.getByTestId("close-dialog");
        await this.stabilityHelper.stableClick(closeButton, { timeout: 15000 });
        await this.dialogContainer.waitFor({ state: "hidden", timeout: 15000 });
        await this.navigation.waitForPageReady();
    }

    async openAuflagenFolgeschrittEdit(seit: string, titelForSelect: string) {
        await this.navigation.waitForSpinnerToDisappear();
        await this.page.locator("app-auflagenverfahren-panel").waitFor({ state: "visible" });
        await this.btnExpandAll.click();
        const output = seit.replace(/(\d{1,2})\.(\d{1,2})\.(\d{4})/, (match, day, month, year) => {
            const paddedDay = day.padStart(2, "0");
            const paddedMonth = month.padStart(2, "0");
            return `${paddedDay}.${paddedMonth}.${year}`;
        });
        const rowLocator = this.page.locator("app-auflagenverfahren-liste");
        const child = this.page.getByRole("button", { name: `${titelForSelect}` });
        const parent = rowLocator
            .filter({ hasText: `seit ${output}` })
            .filter({ has: child })
            .first();
        await parent.getByLabel("bearbeiten").click();
    }

    async selectTypeForNextSteps(typeOfNextStep: string) {
        await this.page
            .getByRole("button", { name: `${typeOfNextStep}` })
            .last()
            .click();
    }

    async fillInforAuflagenFolgeschritt(typeOfNextStep: string, titel: string, sanktionVon: string, erstelltAm: string, sanktionBis: string, status: string, zugeteiltAn: string) {
        if (typeOfNextStep === "Leistungskürzung") {
            await this.fillLeistungskurzungTitel.last().fill(`${titel}`);
            await this.fillLeistungskurzungErstelltAm.last().fill(`${erstelltAm}`);
            await this.fillLeistungskurzungSanktionVon.last().fill(`${sanktionVon}`);
            await this.fillLeistungskurzungSanktionBis.last().fill(`${sanktionBis}`);
            await this.chosseLeistungskurzungVerfahrensschrittStatus.last().click();
            await this.page
                .getByRole("option", { name: `${status}` })
                .last()
                .click();
            await this.chosseLeistungskurzungZugeteiltAn.last().fill(`${zugeteiltAn}`);
            await this.page
                .getByRole("option", { name: `${zugeteiltAn}` })
                .last()
                .click();
        }
        if (typeOfNextStep === "Aussetzen der Leistungen") {
            await this.fillAussetzenDerLeistungenTitel.last().fill(`${titel}`);
            await this.fillAussetzenDerLeistungenErstelltAm.last().fill(`${erstelltAm}`);
            await this.fillAussetzenDerLeistungenSanktionVon.last().fill(`${sanktionVon}`);
            await this.fillAussetzenDerLeistungenSanktionBis.last().fill(`${sanktionBis}`);
            await this.chosseAussetzenDerLeistungenVerfahrensschrittStatus.last().click();
            await this.page
                .getByRole("option", { name: `${status}` })
                .last()
                .click();
            await this.chosseAussetzenDerLeistungenZugeteiltAn.last().fill(`${zugeteiltAn}`);
            await this.page
                .getByRole("option", { name: `${zugeteiltAn}` })
                .last()
                .click();
        }
    }

    async genDocument(titel: string) {
        await this.genLeistungskurzungDocument.click();
        await expect.soft(this.page.getByLabel(`${titel} Leistungskürzung `).locator(".file-name.text-overflow-ellipsis").first()).toHaveText(/\.pdf/);
    }

    // async fillInfoAussetzenDerLeistungen(titel: string, sanktionVon: string, erstelltAm: string, sanktionBis: string, status: string, zugeteiltAn: string) {
    //     await this.fillAussetzenDerLeistungenTitel.fill(`${titel}`);
    //     await this.fillAussetzenDerLeistungenErstelltAm.fill(`${erstelltAm}`);
    //     await this.fillAussetzenDerLeistungenSanktionVon.fill(`${sanktionVon}`);
    //     await this.fillAussetzenDerLeistungenSanktionBis.fill(`${sanktionBis}`);
    //     await this.chosseAussetzenDerLeistungenVerfahrensschrittStatus.click();
    //     await this.page.getByRole('option', { name: `${status}` }).click();
    //     await this.chosseAussetzenDerLeistungenZugeteiltAn.fill(`${zugeteiltAn}`);
    //     await this.page.getByRole('option', { name: `${zugeteiltAn}` }).click();

    // }

    async addNewBeschwerden() {
        await this.navigation.waitForPageReady();

        // Wait for the Beschwerden heading to confirm we're on the correct page
        const beschwerdenHeading = this.page.getByRole("heading", { name: /Beschwerden|Recours/i, level: 1 });
        await beschwerdenHeading.waitFor({ state: "visible", timeout: 30000 });

        await this.stabilityHelper.stableClick(this.btnAddNewBeschwerden, {
            timeout: 30000,
            waitAfter: 500
        });
    }

    async fillInfoToBeschwerde(titel: string, zustaendig: string, beschFuehrer: string, vName: string, vVorname: string, vStrasseInklNr: string, vOrt: string, beschwerdeVon: string, grund: string, anfechtDatumEnscheid: string, zustellungDatumEnscheid: string, documente: string) {
        await this.navigation.waitForPageReady();
        await this.txtBoxZustaendigBeschwerden.pressSequentially(zustaendig, {
            delay: 100
        });
        await this.page.getByRole("option", { name: `${zustaendig}` }).click();
        //11/6 change to pressSequentially to avoid issue with typing
        await this.txtBoxTitelBeschwerden.pressSequentially(titel);
        await this.txtBoxBeschFuehrerBeschwerden.fill(beschFuehrer);
        await this.page.getByRole("option", { name: `${beschFuehrer}` }).click();
        await this.txtBoxVertretungNameBeschwerden.fill(vName);
        await this.txtBoxVertretungVorname.fill(vVorname);
        await this.txtBoxVertretungStrasseHausnummer.fill(vStrasseInklNr);
        await this.txtBoxOrt.fill(vOrt);
        await this.page.getByRole("option", { name: `${vOrt}`, exact: true }).click();
        await this.txtBoxBeschwerdeVom.fill(beschwerdeVon);
        await this.txtBoxBeschwerdeGrundKey.click();
        await this.page.getByRole("option", { name: `${grund}` }).click();
        await this.txtBoxEntscheidAngefochten.fill(anfechtDatumEnscheid);
        await this.txtBoxRntscheidMitgeteilt.fill(zustellungDatumEnscheid);
        if (documente !== "") {
            const fileChooserPromise = this.page.waitForEvent("filechooser");
            await this.page.getByTestId("weitereDokumente").last().click();
            const fileChooser = await fileChooserPromise;
            await fileChooser.setFiles(`${documente}`);
        }
        await this.beschwerdeBtn.click();
        await this.navigation.waitForPageReady();
    }

    async openEditBeschwerden(title: string) {
        await this.page
            .getByRole("button", { name: `${title}` })
            .getByLabel("bearbeiten")
            .first()
            .click();
    }

    async chosseInstanzHinzufugen(instanz: string) {
        await this.page
            .getByRole("button", { name: `${instanz}` })
            .first()
            .click();
    }

    async fillInfoInstanzFrom(status: string, beschwerdenummer: number, stellungNahme: string, datumVom: string, artDerEntsch: string, dokument1: string, zugestVom: string, entscheidOk: string, weiterzug: string, beschwerdeDoc: string, grund: string) {
        await this.txtBoxTitelInstanzHinzufugen.click();
        await this.page.getByRole("option", { name: `${status}` }).click();
        await this.txtBoxNummerInstanzHinzufugen.fill(String(beschwerdenummer));
        await this.txtBoxStellungnahmeInstanzHinzufugen.fill(stellungNahme);
        await this.txtBoxDatumInstanzHinzufugen.fill(datumVom);
        await this.txtBoxArtDerEntschInstanzHinzufugen.click();
        await this.page.getByRole("option").filter({ hasText: artDerEntsch }).first().click();
        if (dokument1 !== "") {
            const fileChooserPromise = this.page.waitForEvent("filechooser");
            await this.page.getByTestId("file").last().click();
            const fileChooser = await fileChooserPromise;
            await fileChooser.setFiles(`${dokument1}`);
        }
        await this.txtBoxXerkuendungInstanzHinzufugen.fill(zugestVom);
        if (entscheidOk === "x") {
            await this.inKraftGetretenCheckBox.check();
        } else {
            await this.inKraftGetretenCheckBox.uncheck();
        }
        await this.txtBoxWeiterzugDatumInstanzHinzufugen.fill(weiterzug);
        if (beschwerdeDoc !== "") {
            const fileChooserPromise = this.page.waitForEvent("filechooser");
            await this.page.getByTestId("file_Weiterzug").last().click();
            const fileChooser = await fileChooserPromise;
            await fileChooser.setFiles(`${beschwerdeDoc}`);
        }
        await this.txtBoxWeiterzugGrundInstanzHinzufugen.fill(grund);
        await this.beschwerdeBtn.click();
    }

    async addNewErmittlungErfassen() {
        await this.btnAddNewErmittlungErfassen.click();
    }

    async fillValueErmittlungErfassen(betrifft: string, gueltigAb: string, Bemerkung: string, document: string) {
        const today = new Date();
        const day = today.getDate().toString().padStart(2, "0");
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const year = today.getFullYear();

        const path = document;
        const parts = path.split("/");
        const fileName = parts[parts.length - 1];

        const regex = new RegExp(`Ermittlung ${day}\\.${month}\\.${year} - - menu|Enquête ${day}\\.${month}\\.${year} - - menu`, "i");
        await this.page.getByRole("button", { name: regex }).last().click();
        await this.txtBoxGueltigAbErmittlungErfassen.fill(gueltigAb);
        await this.page
            .getByTestId("betroffenePersonInDossierIds")
            .locator("div")
            .filter({ hasText: `${betrifft}` })
            .nth(2)
            .getByRole("switch")
            .click();
        await this.txtBoxBemerkungen.fill(Bemerkung);
        if (document !== "") {
            const fileChooserPromise = this.page.waitForEvent("filechooser");
            await this.page.getByTestId("titleReady").last().click();
            const fileChooser = await fileChooserPromise;
            await fileChooser.setFiles(document);
            await expect.soft(this.page.getByRole("link", { name: `${fileName}` })).toHaveText(fileName);
        }

        await this.btnAntragSichern.click();
    }

    async saveErmittlungErfassen() {
        await this.btnBewilligungOffnen.click();
        await this.btnAnfragen.click();
    }

    async genDocumentErmittlungen(gueltigAb: string) {
        const dateStr = gueltigAb;
        const [day, month, year] = dateStr.split(".");
        const formattedDate = day + month + year;

        await this.btnGenDocument.click();
        const docLink = this.page.getByRole("link", { name: `Ermittlung_${formattedDate}.docx` });
        await docLink.waitFor({ state: "visible", timeout: 15000 });
        await expect.soft(docLink).toHaveText(`Ermittlung_${formattedDate}.docx`);
    }
}
