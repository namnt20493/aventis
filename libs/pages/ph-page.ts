import { Page, Locator, expect } from "@playwright/test";
import { CommonPage } from "./common-page";
import { NavigationPage } from "./navigation-page";
import { StabilityHelper } from "@utils/stability-helper";
interface InfoZieleParams {
    titel: string;
    zielVom: string;
    fristBis: string;
    thema: string;
    mitarbeiter: string;
    klientschaft: string;
    status: string;
    beschreibung: string;
    erwarteteHandlung: string;
    beschaeftigungsMassnahme: string;
    partner: string;
}
export class PHPage {
    page: Page;
    btnAddJournaleintragerfassen: Locator;
    checkBoxRelevantSanktion: Locator;
    checkBoxInterneVerwendung: Locator;
    teilnehmende: Locator;
    noteArea: Locator;
    btnSpeichernUndSchliessen: Locator;
    meldungErfassen: Locator;
    textBoxMeldungVom: Locator;
    valueArtDerGewaltBox: Locator;
    erlauterungZurMeldungTextBox: Locator;
    zielvereinbarungenLink: Locator;
    btnAddNewZielvereinbarungen: Locator;
    textBoxBemerkungen: Locator;
    titelInput: Locator;
    erstelltAmInput: Locator;
    journalartSelect: Locator;
    themaSelect: Locator;
    meldungStatus: Locator;
    beziehungSelect: Locator;
    artDerGewaltSelect: Locator;
    kontaktierAm: Locator;
    verlauf: Locator;
    meldungSichernBtn: Locator;
    zielErfassenBtn: Locator;
    titelDesZielsInput: Locator;
    zielVomInput: Locator;
    fristInput: Locator;
    editZielVereinbarungButton: Locator;
    themaKeySelect: Locator;
    zielStatus: Locator;
    mitarbeiterSelect: Locator;
    klientschaftSelect: Locator;
    beschreibungTextArea: Locator;
    erwarteteHandlungenTextArea: Locator;
    massnahmenTextArea: Locator;
    partnerSelect: Locator;
    zielSichernBtn: Locator;
    uploadFile: Locator;
    uploadFilePath: Locator;
    vereinbarungSichernBtn: Locator;
    dokumentGenerierenBtn: Locator;
    txtBoxTitelJournaleintrag: Locator;
    txtBoxErstelltAmJournaleintrag: Locator;
    txtBoxJournalartJournaleintrag: Locator;
    txtBoxThemaJournaleintrag: Locator;
    commonPage: CommonPage;
    zieltab: Locator;
    iizDokumentSelectbox: Locator;
    navigation: NavigationPage;
    private stabilityHelper: StabilityHelper;

    constructor(page: Page) {
        this.page = page;
        this.commonPage = new CommonPage(page);
        this.navigation = new NavigationPage(page);
        this.stabilityHelper = new StabilityHelper(page);
        this.btnAddJournaleintragerfassen = page.getByRole("button", { name: /^Journaleintrag erfassen$|^Ajouter une entrée de journal$/i });
        this.checkBoxRelevantSanktion = page.locator("mat-dialog-container").getByTestId("relevantFuerSanktionen").locator("input");
        this.editZielVereinbarungButton = page.getByTestId("activateEditMode").first();
        this.checkBoxInterneVerwendung = page.locator("mat-dialog-container").getByTestId("interneVerwendung").locator("input");
        this.teilnehmende = page.locator("mat-dialog-container").getByTestId("teilnehmer").getByTestId("root-control");
        this.noteArea = page.locator("mat-dialog-container div[class='editor-target']");
        this.btnSpeichernUndSchliessen = page.locator("app-aventis-dialog-host").getByRole("button", { name: /speichern|Enregistrer et fermer/i });
        this.meldungErfassen = page.getByRole("button", {
            name: /Meldung erfassen|Enregistrer un rapport/i
        });
        this.textBoxMeldungVom = page.getByTestId("meldungVom").getByTestId("root-control");
        this.valueArtDerGewaltBox = page.locator('div[role="listbox"] mat-option');
        this.erlauterungZurMeldungTextBox = page.getByTestId("erlaeuterung").getByTestId("root-control");
        this.zielvereinbarungenLink = page.getByRole("tab", {
            name: /Zielvereinbarungen|Accords sur les objectifs/i
        });
        this.btnAddNewZielvereinbarungen = page.getByRole("button", {
            name: /Zielvereinbarung ohne Bewilligungsworkflow erstellen|Créer un accord sur les objectifs sans workflow de validation/i
        });
        this.textBoxBemerkungen = page.getByTestId("bemerkungen").getByTestId("root-control");
        this.titelInput = page.getByTestId("titel").getByTestId("root-control");
        this.erstelltAmInput = page.getByTestId("erstelltAm").getByTestId("root-control");
        this.journalartSelect = page.getByTestId("journalart").getByTestId("root-control");
        this.themaSelect = page.getByTestId("themenKeys").getByTestId("root-control");
        this.meldungStatus = page.getByTestId("status").getByTestId("root-control");
        this.beziehungSelect = page.getByTestId("beziehung").getByTestId("root-control");
        this.artDerGewaltSelect = page.getByTestId("art").getByTestId("root-control");
        this.kontaktierAm = page.getByRole("textbox", {
            name: /Kontaktiert am|Contacté le/i
        });
        this.verlauf = page.getByRole("textbox", { name: /Verlauf|Détails/i });
        this.meldungSichernBtn = this.page.getByRole("button", { name: "Meldung sichern" }).first();
        this.zielErfassenBtn = page.getByRole("button", {
            name: /Ziel erfassen|Ajouter un nouvel objectif/i
        });
        this.titelDesZielsInput = page.getByTestId("titel").getByTestId("root-control");
        this.zielVomInput = page.getByTestId("zielVom").getByTestId("root-control");
        this.fristInput = page.getByTestId("frist").getByTestId("root-control");
        this.themaKeySelect = page.getByTestId("themaKey").getByTestId("root-control");
        this.zielStatus = page.getByTestId("status").getByTestId("root-control");
        this.mitarbeiterSelect = page.getByTestId("userId").getByTestId("root-control");
        this.klientschaftSelect = page.getByTestId("personInDossierIds_Betroffen").getByTestId("root-control");
        this.beschreibungTextArea = page.getByTestId("beschreibungHtml").locator("div[class='editor-target']").first();
        this.erwarteteHandlungenTextArea = page.getByTestId("erwarteteHandlungenHtml").locator("div[class='editor-target']").first();
        this.massnahmenTextArea = page.getByTestId("massnahmenHtml").locator("div[class='editor-target']").first();
        this.partnerSelect = page.getByTestId("institutionId").getByTestId("root-control");
        this.zielSichernBtn = page
            .getByRole("button", {
                name: /Ziel sichern|Enregistrer/i
            })
            .first();
        this.uploadFile = page.getByTestId("uploadControl");
        this.uploadFilePath = page.locator("mat-dialog-container").getByRole("button", {
            name: /Diverse Dokumente Datei hierhin ziehen oder klicken|Glisser et déposer le Fichier ou cliquer ici/i
        });
        this.vereinbarungSichernBtn = page.getByRole("button", { name: "Vereinbarung sichern" }).last();
        this.dokumentGenerierenBtn = page.getByRole("radio", { name: /Word generieren|Générer le Word/i }).first();
        this.txtBoxTitelJournaleintrag = page.locator("mat-dialog-container").getByTestId("titel").getByTestId("root-control");
        this.txtBoxErstelltAmJournaleintrag = page.locator("mat-dialog-container").getByTestId("erstelltAm").getByTestId("root-control");
        this.txtBoxJournalartJournaleintrag = page.locator("mat-dialog-container").getByTestId("journalart").getByTestId("root-control");
        this.txtBoxThemaJournaleintrag = page.locator("mat-dialog-container").getByTestId("themenKeys").getByTestId("root-control");
        this.zieltab = page.getByRole("tab", { name: /^Ziele$|Objectifs/i });
        this.iizDokumentSelectbox = page.getByTestId("weiteresDossierDokumentId_Iiz").getByTestId("root-control");
    }
    //edit zuelvereinbarung
    async editzuelvereinbarung(zielVereinbarungVon: string, fristVon: string, datei: string) {
        // Click on the Zielvereinbarung panel - use button role selector instead of mat-panel-title
        // The panel header is rendered as a button with text like "Zielvereinbarung Vom 26.01.2026 Frist: ..."
        const panelButton = this.page.getByRole("button", { name: new RegExp(`Zielvereinbarung.*${zielVereinbarungVon}`) }).first();
        await this.stabilityHelper.stableClick(panelButton, { timeout: 15000, waitBefore: 500, waitAfter: 500 });

        // Click on the Beurteilung section header to expand it
        const beurteilungHeader = this.page.getByRole("button", { name: /Beurteilung der Zielvereinbarung.*bearbeiten/i }).first();
        await this.stabilityHelper.stableWaitFor(beurteilungHeader, { state: "visible", timeout: 15000, waitAfter: 300 });
        await this.stabilityHelper.stableClick(beurteilungHeader, {
            timeout: 15000,
            waitBefore: 300,
            waitAfter: 500
        });

        // Click the inner "bearbeiten" button to enter edit mode (the section expands to VIEW mode first)
        const bearbeitenButton = beurteilungHeader.getByRole("button", { name: "bearbeiten" }).first();
        await this.stabilityHelper.stableWaitFor(bearbeitenButton, { state: "visible", timeout: 15000, waitAfter: 300 });
        await this.stabilityHelper.stableClick(bearbeitenButton, {
            timeout: 15000,
            waitBefore: 300,
            waitAfter: 500
        });

        // Upload file using expansion panel context (not dialog)
        if (datei !== "") {
            const fileUploadBtn = this.page.getByRole("button", {
                name: /Diverse Dokumente Datei hierhin ziehen oder klicken|Glisser et déposer le Fichier ou cliquer ici/i
            });
            await this.stabilityHelper.stableWaitFor(fileUploadBtn, { state: "visible", timeout: 15000, waitAfter: 300 });
            const fileChooserPromise = this.page.waitForEvent("filechooser");
            await fileUploadBtn.click();
            const fileChooser = await fileChooserPromise;
            await fileChooser.setFiles(`${datei}`);
        }

        await expect.soft(this.page.locator("app-file-collection-input app-file-download-base-link")).toHaveText(this.commonPage.getFileName(datei));
        await this.stabilityHelper.stableClick(this.page.getByRole("button", { name: /Beurteilung speichern|Enregistrer/i }), { timeout: 15000, waitBefore: 300, waitAfter: 500 });
        await this.navigation.waitForPageReady();
    }
    // choseBetroffenePerson
    async choseBetroffenePerson(betroffene: string) {
        const personArrayAdd = this.commonPage.splitText(betroffene);
        for (const person of personArrayAdd) {
            await this.page
                .locator("mat-dialog-container")
                .getByTestId("personInDossierIds")
                .locator("app-card")
                .filter({ hasText: `${person}` })
                .getByRole("switch")
                .click();
        }
    }
    async fillEditJournalFrom(deleteBetroffene: string, adBetroffene: string, adDocument: string, atNameOrInstitution: string, noteTextAsFollows: string) {
        const dialog = this.page.locator("mat-dialog-container");

        if (adDocument !== "") {
            const fileChooserPromise = this.page.waitForEvent("filechooser");
            await dialog
                .getByRole("button", {
                    name: "Diverse Dokumente Datei hierhin ziehen oder klicken"
                })
                .click();
            const fileChooser = await fileChooserPromise;
            await fileChooser.setFiles(`${adDocument}`);
        }
        const personArrayAdd = this.commonPage.splitText(adBetroffene);
        const personArrayDeLe = this.commonPage.splitText(deleteBetroffene);
        if (deleteBetroffene !== "") {
            for (const personDele of personArrayDeLe) {
                const switchElementDele = dialog
                    .getByTestId("personInDossierIds")
                    .locator("app-card")
                    .filter({ hasText: `${personDele}` })
                    .getByRole("switch");
                const isChecked = await switchElementDele.isChecked();

                if (isChecked) {
                    await switchElementDele.click();
                }
            }
        }

        if (adBetroffene !== "") {
            for (const personAdd of personArrayAdd) {
                const switchElementAdd = dialog
                    .getByTestId("personInDossierIds")
                    .locator("app-card")
                    .filter({ hasText: `${personAdd}` })
                    .getByRole("switch");
                const isChecked = await switchElementAdd.isChecked();

                if (!isChecked) {
                    await switchElementAdd.click();
                }
            }
        }

        await this.noteArea.last().click();
        await this.page.keyboard.press("Control+a");
        await this.page.keyboard.press("Delete");
        await dialog.getByTestId("beschreibungHtml").getByTestId("control").locator(".editor-target").last().pressSequentially(`${atNameOrInstitution}`, { delay: 100 });
        if (atNameOrInstitution.startsWith("@")) {
            await this.page.locator(".mat-mdc-option.mdc-list-item.ng-star-inserted").first().click();
        }
        await dialog.getByTestId("control").locator(".editor-target").last().click();
        await dialog.getByTestId("control").locator(".editor-target").last().type(`${noteTextAsFollows}`);
    }
    async openEditJournal(erstelltAm: string, titel: string) {
        await this.page
            .getByRole("row", { name: `${erstelltAm} ${titel}` })
            .getByRole("button")
            .first()
            .click();
    }
    async addJournaleintragerfassen() {
        await this.page.waitForLoadState("domcontentloaded");
        await this.navigation.waitForSpinnerToDisappear();
        await this.navigation.closeBlockingDialog();

        await this.stabilityHelper.stableWaitFor(this.btnAddJournaleintragerfassen, {
            timeout: 30000,
            state: "visible",
            waitAfter: 500
        });
        await this.btnAddJournaleintragerfassen.scrollIntoViewIfNeeded();

        await this.stabilityHelper.stableClick(this.btnAddJournaleintragerfassen, {
            timeout: 15000,
            waitBefore: 500,
            waitAfter: 1000,
            retries: 3
        });

        const dialog = this.page.locator("mat-dialog-container");
        await this.stabilityHelper.stableWaitFor(dialog, {
            timeout: 30000,
            state: "visible",
            waitAfter: 500
        });

        const isCreateDialog = await this.page
            .locator("app-file-collection-input app-file-upload-card")
            .isVisible()
            .catch(() => false);
        if (!isCreateDialog) {
            const dialogHeader = this.page.locator("mat-dialog-container h2").first();
            const headerText = await dialogHeader.textContent().catch(() => "");
            if (headerText?.includes("bearbeiten") || headerText?.includes("éditer")) {
                await this.stabilityHelper.closeDialog({
                    closeButtonSelector: '[data-testid="close-dialog"]',
                    dialogSelector: "mat-dialog-container",
                    timeout: 10000,
                    retries: 3
                });

                await this.page.waitForTimeout(500);

                await this.stabilityHelper.stableClick(this.btnAddJournaleintragerfassen, {
                    timeout: 15000,
                    waitBefore: 500,
                    waitAfter: 1000,
                    retries: 3
                });

                await this.stabilityHelper.stableWaitFor(dialog, {
                    timeout: 30000,
                    state: "visible",
                    waitAfter: 500
                });
            }
        }

        await this.stabilityHelper.stableWaitFor(this.page.locator("app-file-collection-input app-file-upload-card"), {
            timeout: 30000,
            state: "visible",
            waitAfter: 500
        });
    }

    async fillValue(Titel: string, estelltAm: string, JurnalArt: string, Thema: string) {
        await this.page.locator("mat-dialog-container").waitFor({ state: "visible" });
        await this.txtBoxErstelltAmJournaleintrag.fill(`${estelltAm}`);
        await this.txtBoxTitelJournaleintrag.click();
        await this.txtBoxTitelJournaleintrag.fill("");
        await this.txtBoxTitelJournaleintrag.pressSequentially(`${Titel}`);
        await this.txtBoxJournalartJournaleintrag.click();
        await this.page.getByRole("option", { name: `${JurnalArt}` }).click();
        await this.txtBoxThemaJournaleintrag.click();
        await this.page.getByRole("option", { name: `${Thema}` }).click();
        await this.page.keyboard.press("Escape");
    }

    async checkBoxOfRelevantSanktionAndInterneVerwendung(RelevantSanktion: string, InterneVerwendung: string) {
        if (RelevantSanktion === "x") {
            await this.checkBoxRelevantSanktion.click();
        }
        if (InterneVerwendung === "x") {
            await this.checkBoxInterneVerwendung.click();
        }
    }

    async chosseTeilnehmende(teilnehmende: string) {
        const personArrayAdd = teilnehmende
            .split(";")
            .map((s) => s.trim())
            .filter(Boolean);
        for (const person of personArrayAdd) {
            // Click to open dropdown
            await this.stabilityHelper.stableClick(this.teilnehmende, {
                waitBefore: 500,
                waitAfter: 1000,
                timeout: 30000
            });

            // Type just the first part of the name (last name) to trigger search
            const searchTerm = person.split(",")[0].trim();
            await this.teilnehmende.fill(searchTerm);
            await this.page.waitForTimeout(1000);

            // Wait for and click the matching option (use contains to match partial)
            const optionLocator = this.page.locator(`mat-option:has-text("${person}")`).first();
            await this.stabilityHelper.stableWaitFor(optionLocator, {
                state: "visible",
                timeout: 30000,
                waitAfter: 300
            });
            await this.stabilityHelper.stableClick(optionLocator, {
                waitBefore: 300,
                waitAfter: 500,
                timeout: 15000
            });
        }
    }
    async inputNote(note: string) {
        await this.noteArea.last().fill(`${note}`);
    }

    async addButton() {
        await this.btnSpeichernUndSchliessen.focus();
        await this.stabilityHelper.stableClick(this.btnSpeichernUndSchliessen);
        await this.navigation.waitForPageReady();
        await this.navigation.closeBlockingDialog();
    }

    async verifyNewJournal(title: string) {
        await this.navigation.waitForPageReady();
        await this.navigation.closeBlockingDialog();
        // Wait for table to update after journal creation
        const journalCell = this.page.getByRole("cell", { name: title }).first();
        await journalCell.waitFor({ state: "visible", timeout: 15000 }).catch(() => {});
        await expect.soft(journalCell).toContainText(title, { timeout: 10000 });
    }

    async verifyDossier(Dossier: string) {
        await expect.soft(this.page.getByRole("gridcell", { name: ` ${Dossier}` })).toHaveText(`${Dossier}`);
    }

    async addMeldungErfassen() {
        await this.meldungErfassen.click();
        await this.navigation.waitForPageReady();
    }

    async fillInfoMeldung(MeldungVom: string, Status: string, Beziehung: string, ArtDerGewalt: string, Erlaeuterung: string) {
        await this.textBoxMeldungVom.first().fill(MeldungVom);
        await this.meldungStatus.first().click();
        await this.page
            .getByRole("option", { name: `${Status}` })
            .first()
            .click();
        await this.beziehungSelect.first().click();
        await this.page
            .getByRole("option", { name: `${Beziehung}` })
            .first()
            .click();
        await this.artDerGewaltSelect.first().click();
        const values = ArtDerGewalt.replace(/'/g, "").split(", ");
        for (const value of values) {
            await this.page.getByRole("option", { name: `${value}` }).click();
        }
        await this.page.keyboard.press("Escape");
        await this.erlauterungZurMeldungTextBox.first().fill(`${Erlaeuterung}`);
    }

    async selectOpfer(Opfer: string) {
        await this.page
            .locator("app-person-card-row")
            .filter({ hasText: `${Opfer}` })
            .first()
            .locator("button")
            .click();
    }

    async chooseKontaktiertAndFillValue(InfoOperH: string, OHVerlauf: string, OHKontaktAm: string) {
        if (InfoOperH === "ja") {
            await this.page
                .getByRole("radio", { name: `${InfoOperH}` })
                .first()
                .click();
            await this.kontaktierAm.first().click();
            await this.kontaktierAm.first().fill(`${OHKontaktAm}`);
            await this.verlauf.first().click();
            await this.verlauf.first().fill(`${OHVerlauf}`);
        }
    }

    async buttonMeldungSichern() {
        await this.meldungSichernBtn.click();
    }

    async clickZielErfassenBtn() {
        await this.stabilityHelper.stableClick(this.zieltab.first());
        await this.stabilityHelper.stableClick(this.zielErfassenBtn);
        await this.navigation.waitForPageReady();
        // const expectedUrls = [
        //     'ZielQuery',
        //     'ZieleQuery',
        // ];

        // await Promise.all(
        //   expectedUrls.map(urlPart =>
        //     this.page.waitForResponse(res =>
        //       res.url().includes(urlPart) && res.status() === 200
        //     )
        //   )
        // );
        // await this.page.reload({ waitUntil: "domcontentloaded" });
    }

    async selectDropdownOption(dropdown: Locator, optionName: string) {
        await dropdown.click();
        await this.page.getByRole("option", { name: optionName }).click();
    }

    async fillInfoZiele(params: InfoZieleParams) {
        // Helper to fill and trigger events
        const fillAndTrigger = async (locator: Locator, value: string) => {
            // Wait for element to be ready
            await locator.waitFor({ state: "visible" });

            // Clear and fill - much faster than pressSequentially
            await locator.clear();
            await locator.fill(value);

            // Trigger events to ensure Angular detects the change
            await locator.evaluate((el: any) => {
                el.dispatchEvent(new Event("input", { bubbles: true }));
                el.dispatchEvent(new Event("change", { bubbles: true }));
                el.blur();
            });

            // Short wait to let Angular process
            await this.page.waitForTimeout(100);
        };

        await expect(this.zielSichernBtn, {
            message: "Is Enable ?"
        }).toBeDisabled();

        // Use .last() for all fields to target the active/new form (avoids strict mode violation when multiple goals exist)
        await fillAndTrigger(this.titelDesZielsInput.last(), params.titel);
        await fillAndTrigger(this.beschreibungTextArea.last(), params.beschreibung);
        await fillAndTrigger(this.erwarteteHandlungenTextArea.last(), params.erwarteteHandlung);
        await fillAndTrigger(this.massnahmenTextArea.last(), params.beschaeftigungsMassnahme);
        await fillAndTrigger(this.zielVomInput.last(), params.zielVom);
        await fillAndTrigger(this.fristInput.last(), params.fristBis);

        await this.selectDropdownOption(this.themaKeySelect.last(), params.thema);
        await this.selectDropdownOption(this.zielStatus.last(), params.status);
        await this.selectDropdownOption(this.mitarbeiterSelect.last(), params.mitarbeiter);
        await this.selectDropdownOption(this.klientschaftSelect.last(), params.klientschaft);
        await this.selectDropdownOption(this.partnerSelect.last(), params.partner);

        // Wait for button to be enabled, retry reload if needed
        try {
            await expect(this.zielSichernBtn).toBeEnabled({ timeout: 2000 });
        } catch {
            await this.page.reload({ waitUntil: "domcontentloaded" });
            await this.fillInfoZiele(params);
        }
    }
    // locator("app-text-base-editor div").nth(1)
    async btnZielSichern() {
        await expect(this.zielSichernBtn, { message: "Is Enable ?" }).toBeEnabled();
        await this.zielSichernBtn.click();
        await this.navigation.waitForPageReady();
    }
    //19/4
    async openUploadFile(documentPath: string) {
        await this.navigation.closeBlockingDialog();
        const fileChooserPromise = this.page.waitForEvent("filechooser");
        await this.uploadFile.click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(`${documentPath}`);
    }
    async selectFile(dateiPfad: string) {
        if (dateiPfad !== "") {
            const fileChooserPromise = this.page.waitForEvent("filechooser");
            await this.uploadFilePath.click();
            const fileChooser = await fileChooserPromise;
            await fileChooser.setFiles(`${dateiPfad}`);
        }
    }

    async openZielvereinbarungenLink() {
        await this.stabilityHelper.stableClick(this.zielvereinbarungenLink, {
            timeout: 15000,
            waitBefore: 300,
            waitAfter: 500
        });
        await this.navigation.waitForPageReady();
    }

    async addNewZielvereinbarungen() {
        await this.stabilityHelper.stableClick(this.btnAddNewZielvereinbarungen, {
            timeout: 15000,
            waitBefore: 300,
            waitAfter: 500
        });
        await this.navigation.waitForPageReady();
    }

    async fillInfoZielvereinbarungen(bemerkung: string, zugeZielTitelSelect: string, unterzeichnZielvereinbarungPfad: string) {
        //await this.editZielVereinbarungButton.click();
        await this.textBoxBemerkungen.fill(`${bemerkung}`);
        if (zugeZielTitelSelect !== "") {
            // Find the goal button by its title and then the checkbox within it
            const goalButton = this.page.getByRole("button", { name: new RegExp(zugeZielTitelSelect) });
            const zielCheckbox = goalButton.getByRole("checkbox");

            await this.stabilityHelper.stableWaitFor(zielCheckbox, {
                state: "visible",
                timeout: 15000,
                waitAfter: 300
            });
            const isChecked = await zielCheckbox.isChecked();
            if (!isChecked) {
                await zielCheckbox.check();
            }
            await this.page.waitForTimeout(300);
        }
        if (unterzeichnZielvereinbarungPfad !== "") {
            const fileChooserPromise = this.page.waitForEvent("filechooser");
            await this.page.getByTestId("file_Unterzeichnet").click();
            const fileChooser = await fileChooserPromise;
            await fileChooser.setFiles(`${unterzeichnZielvereinbarungPfad}`);
            await expect.soft(this.page.getByTestId("file_Unterzeichnet")).toHaveText(/\.docx||\.txt||\.pdf||\.xlsx/);
        }
    }
    async clickVereinbarungSichernBtn() {
        await this.stabilityHelper.stableClick(this.vereinbarungSichernBtn, {
            timeout: 15000,
            waitBefore: 300,
            waitAfter: 500
        });
        await this.navigation.waitForPageReady();
    }
    async selectZielvereinbarung(IIZTitel: string) {
        await this.iizDokumentSelectbox.first().click();
        await this.page.locator(`mat-option:has-text('${IIZTitel}')`).first().click();
    }

    async generateDocument() {
        await this.navigation.waitForPageReady();
        await this.stabilityHelper.stableClick(this.dokumentGenerierenBtn, {
            timeout: 15000,
            waitBefore: 500,
            waitAfter: 1000
        });
        await expect.soft(this.page.locator(".file-name.text-overflow-ellipsis").last()).toHaveText(/\.docx/, { timeout: 60000 });
    }

    //~~~~~~~~~~~~~~~~~//
}
