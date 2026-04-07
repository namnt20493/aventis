import { Page, Locator, expect } from "@playwright/test";
import { WohnSituationPage } from "./wohnsituation-page";
import { NavigationPage } from "./navigation-page";
import { CommonPage } from "./common-page";
import { StabilityHelper } from "../utils/stability-helper";
import { expectValue, expectVisible } from "../utils/helpers/formFillHelper";

export class RahmenbudgetPage {
    page: Page;
    private stability: StabilityHelper;
    rahmenbudgetNavLink: Locator;
    unterstutzungsbetrag: Locator;
    test: Locator;
    wohnkostenMenuBtn: Locator;
    entscheidungMenuItem: Locator;
    jaRadioBtn: Locator;
    ubernahmeWohnkostenInput: Locator;
    vonTxtbox: Locator;
    bisTxtbox: Locator;
    begrundungTxtArea: Locator;
    spichernBtn: Locator;
    ubernahmeWohnkostenStatus: Locator;
    wohnkostenRow: Locator;
    neuenLeistungsentcheidBtn: Locator;
    leistungsentscheid: Locator;
    leistungsentcheidSpeichernBtn: Locator;
    bewilligungOffnenBtn: Locator;
    anfragenBtn: Locator;
    status: Locator;
    FreigabeVerwenTab: Locator;
    verwendungRow: Locator | undefined;
    frea: any;
    freigabeVerwendungSpeichernBtn: Locator;
    gultigAb: Locator;
    gultigBis: Locator;
    situationbedingteLeistungenBtn: Locator;
    neuePositionBtn: Locator;
    selectAllCard: Locator | undefined;
    searchInput: Locator;
    vervollstandigenBtn: Locator;
    leistungserbringer: Locator;
    betragMonatlich: Locator;
    geplantVon: Locator;
    geplantBis: Locator;
    erfassenBtn: Locator;
    wohPage: WohnSituationPage;
    zahlungsInfosAnpassenBtn: Locator;
    chosseOptionEditBearbeiten: Locator;
    fillGultigAbValue: Locator;
    zahlungsempfangerBox: Locator;
    periodizitaetBox: Locator;
    fillMitteilungValue: Locator;
    btnZahlungsinformationenSichern: Locator;
    kostengutspracheTab: Locator;
    btnKostengutspracheErfassen: Locator;
    titlederKostengutsprache: Locator;
    beantragterBetrag: Locator;
    leistungserbringerKostengutsprache: Locator;
    klientschaftKostengutsprache: Locator;
    gultigAbKostengutsprache: Locator;
    verfallDatumKostengutsprache: Locator;
    begrundungKostengutsprache: Locator;
    btnKostengutspracheSichern: Locator;
    iconDropDownKVG: Locator;
    editItemBtn: Locator;
    txtGeplantVon: Locator;
    txtGeplantBis: Locator;
    btnKennzahlen: Locator;
    btnDropDownKennzahlen: Locator;
    btnDropDownGeplanteValutatermine: Locator;
    navigation: NavigationPage;
    rahmenField: Locator;
    tableHeader: Locator;
    menutriggerBtn: any;
    captainRow: Locator;
    erwerbseinkommenEditMenuBtn: Locator;
    btnGrundbedarfLebensunterhalt: Locator;
    btnEditGrundbedarfLebensunterhalt: Locator;
    textBoxBerGrundlage: Locator;
    textBoxGeplantVon: Locator;
    textBoxGueltigBis: Locator;
    textBoxIndividuelleAnpa: Locator;
    textBoxBegruendung: Locator;
    btnTimeLine: Locator;
    checkToolTip: Locator;
    folgepositionBtn: Locator;
    freibetragEffektiv: Locator;
    begrundung: Locator;
    common: CommonPage;
    fillReferenzNummer: Locator;
    wohnkostenExpandBtn: Locator;
    ausgabenWohnkostenRow: Locator;
    ueberhoehteWohnkostenBtn: Locator;
    ueberhoehteWohnkostenErfassenBtn: Locator;
    dropDownIconEinnahmen: Locator;
    btnVerlaufEffektiverBetrageOffnen: Locator;
    btnSichernVerlaufEffektiverBetrageOffnen: Locator;
    ruckbehalteTab: Locator;
    btnRuckbehaltErfassen: Locator;
    ruckbehaltTitel: Locator;
    betraMonatlichtxtbox: Locator;
    startMonatTxtbox: Locator;
    endMonatTxtbox: Locator;
    beschreibungTxtbox: Locator;
    uploadFile: Locator;
    monatsbudgetTab: Locator;
    wohnsituationOffnenBtn: Locator;
    wohnkostenMenuVerticalBtn: Locator;
    wohnsituationCard: Locator;
    wohnType: Locator;
    appCardHeader: Locator;
    wohnAddress: Locator;
    appPersoncard: Locator;
    appCardWohnkosten: Locator;
    appCardGultigab: Locator;
    wohnSituationStatus: Locator;
    wohnsituationNavLink: Locator;
    dossierRow: Locator;
    grundbedardIconImg: Locator;
    wohnkostenIconImg: Locator;
    medizinischegrundversorgung: Locator;
    rahmenbudgetDialogBtn: Locator;
    rahmenbudgetExpandBtn: Locator;
    rahmenbudgetCollapseBtn: Locator;
    rowHeader: Locator;
    totalCurrency: Locator;
    rahmenKrankenDetailAppcard: Locator;
    kvgExpandBtn: Locator;
    constructor(page: Page) {
        this.page = page;
        this.stability = new StabilityHelper(page);
        this.navigation = new NavigationPage(page);
        this.wohPage = new WohnSituationPage(page);
        this.common = new CommonPage(page);
        this.rahmenbudgetNavLink = page.getByTestId("RahmenbudgetRoute");
        this.unterstutzungsbetrag = page.locator("td[class='currency-column']").last();
        this.test = page.locator("tr[class='section-summery-row'] td[class='currency-column']").last();
        this.wohnkostenMenuBtn = page.getByTestId("budget-zeile-context-menu").first();
        this.entscheidungMenuItem = page.locator("div[role='menu']").getByRole("button").nth(1);
        this.jaRadioBtn = page.getByTestId("uebernehmen").locator("input").first();
        this.ubernahmeWohnkostenInput = page.getByTestId("betragUebernommen").getByTestId("root-control");
        this.vonTxtbox = page.getByTestId("validFrom").getByTestId("root-control");
        this.bisTxtbox = page.getByTestId("validThrough").getByTestId("root-control");
        this.begrundungTxtArea = page.getByTestId("begruendung").getByTestId("root-control");
        this.spichernBtn = page.getByRole("button", {
            name: /Speichern|Enregistrer/i
        });
        this.ubernahmeWohnkostenStatus = page.locator("span[aria-label='Übernahme Wohnkosten'],span[aria-label='Prise en charge des frais de logement']");
        this.wohnkostenRow = page.locator("tbody:has-text('wohnkosten'),tbody:has-text('frais de logement')");
        this.leistungsentscheid = page.locator("nav a[href$='leistungsentscheid'], [role='tab']:has-text('Leistungsentscheid')");
        this.neuenLeistungsentcheidBtn = page.getByRole("button", {
            name: /Neuen Leistungsentscheid erfassen|Ajouter une nouvelle décision de prestation/i
        });
        this.leistungsentcheidSpeichernBtn = page.getByRole("button", {
            name: /Leistungsentscheid speichern|Enregistrer la décision de prestation/i
        });
        this.bewilligungOffnenBtn = page.locator("app-approval-workflow-open-button a");
        this.anfragenBtn = page.getByRole("button", {
            name: /Anfragen|Demande de la validation/i
        });
        this.status = page.getByLabel(/Status|Statut/i);
        this.FreigabeVerwenTab = page.getByRole("tab", {
            name: /Freigabe Verwendungsperiode|Libération Période d'utilisation/i
        });
        this.freigabeVerwendungSpeichernBtn = page.getByRole("button", {
            name: /Freigabe Verwendungsperiode speichern|Enregistrer la libération de la période d'utilisation/i
        });
        this.gultigAb = page.getByTestId("validFrom").getByTestId("root-control");
        this.gultigBis = page.getByTestId("validThrough").getByTestId("root-control");
        this.situationbedingteLeistungenBtn = page.getByTestId("budget-zeile-context-menu").last();
        this.neuePositionBtn = page.getByRole("menuitem", {
            name: /Neue Position|Nouvelle position/i
        });
        this.searchInput = page.getByTestId("wshParameter").getByTestId("root-control");
        this.vervollstandigenBtn = page.getByRole("button", {
            name: /vervollständigen|sélectionné·e·s/i
        });
        this.leistungserbringer = page.getByTestId("institutionId_Leistungserbringer").getByTestId("root-control");
        this.betragMonatlich = page.getByTestId("betragMonatlich").getByTestId("root-control");
        this.geplantVon = page.getByTestId("validFrom").getByTestId("root-control");
        this.geplantBis = page.getByTestId("validThrough").getByTestId("root-control");
        this.erfassenBtn = page.getByRole("button", {
            name: /Erfassen und schliessen|Ajouter et fermer/i
        });
        this.zahlungsInfosAnpassenBtn = page.getByRole("link", {
            name: /Zahlungsmodalitäten|Modalités de paiement/i
        });
        this.chosseOptionEditBearbeiten = page.getByRole("menuitem", {
            name: /Zahlungsinformationen|Modifier les informations de paiement/i
        });
        this.fillGultigAbValue = page.getByTestId("validFrom").locator("input");
        this.zahlungsempfangerBox = page.getByTestId("zahlungsverbindungId").locator("mat-select");
        this.periodizitaetBox = page.getByTestId("periodizitaet").getByTestId("root-control");
        this.fillMitteilungValue = page.getByTestId("mitteilung").locator("textarea");
        this.btnZahlungsinformationenSichern = page.getByRole("button", {
            name: /Zahlungsinformationen sichern|Enregistrer les informations de paiement/i
        });
        this.kostengutspracheTab = page.getByRole("tab", {
            name: /Kostengutsprache|Garantie de prise en charge des coûts/i
        });
        this.btnKostengutspracheErfassen = page.getByRole("button", {
            name: /Kostengutsprache erfassen|Ajouter une garantie de prise en charge des coûts/i
        });
        this.titlederKostengutsprache = page.getByTestId("titel").getByTestId("root-control").first();
        this.beantragterBetrag = page.getByTestId("beantragterBetrag").getByTestId("root-control").first();
        this.leistungserbringerKostengutsprache = page.getByTestId("institutionId_Leistungserbringer").getByTestId("root-control").first();
        this.klientschaftKostengutsprache = page.getByTestId("personInDossierId_Betrifft").getByTestId("root-control").first();
        this.gultigAbKostengutsprache = page.getByTestId("gueltigAb").getByTestId("root-control").first();
        this.verfallDatumKostengutsprache = page.getByTestId("verfallsdatum").getByTestId("root-control").first();
        this.begrundungKostengutsprache = page.getByTestId("begruendung").getByTestId("root-control").first();
        this.btnKostengutspracheSichern = page
            .getByRole("button", {
                name: /Kostengutsprache sichern|Enregistrer la garantie de prise en charge des coûts/i
            })
            .first();
        this.iconDropDownKVG = page.locator("tr:has(mat-icon[data-mat-icon-name='rb-situationsbedingteleistungen'])").getByTestId("expand-rahmenbudget-grid");
        this.editItemBtn = page
            .getByRole("button", {
                name: /Position bearbeiten|Modifier la position/i
            })
            .first();
        this.txtGeplantVon = page.getByTestId("validFrom").getByTestId("root-control");
        this.txtGeplantBis = page.getByTestId("validThrough").getByTestId("root-control");
        this.btnKennzahlen = page.locator("app-content-header-base").getByRole("button");
        this.btnDropDownKennzahlen = page
            .locator("app-expansion-content-toggle")
            .filter({ has: this.page.locator("h2") })
            .locator("button")
            .first();
        this.btnDropDownGeplanteValutatermine = page.locator("app-naechste-faelligkeiten-sidesheet button");
        this.rahmenField = this.page.getByRole("button", {
            name: /Wirtschaftliche Sozialhilfe|Aide sociale économique/i
        });
        this.tableHeader = this.page.locator("thead td");
        this.menutriggerBtn = this.tableHeader.locator("button[class*='mat-mdc-menu-trigger']");
        this.captainRow = this.page.locator("tr[class='caption-row']");
        this.erwerbseinkommenEditMenuBtn = this.page
            .locator("app-card-header")
            .filter({ hasText: /Erwerbseinkommen|/i })
            .locator("button");
        this.btnGrundbedarfLebensunterhalt = page
            .getByRole("row", {
                name: /Grundbedarf Lebensunterhalt|Forfait pour l’entretien/i
            })
            .getByRole("button")
            .nth(1);
        this.btnEditGrundbedarfLebensunterhalt = page
            .getByRole("button", {
                name: /Position bearbeiten|Modifier la position/i
            })
            .first();
        this.textBoxBerGrundlage = page.getByTestId("berechnungsgrundlageId").getByTestId("root-control");
        this.textBoxGeplantVon = page.getByTestId("validFrom").getByTestId("root-control");
        this.textBoxGueltigBis = page.getByTestId("validThrough").getByTestId("root-control");
        this.textBoxIndividuelleAnpa = page.getByTestId("individuelleAnpassung").getByTestId("root-control");
        this.textBoxBegruendung = page.getByTestId("begruendungAnpassung").getByTestId("root-control");
        this.btnTimeLine = page.getByRole("button", {
            name: /Timeline anzeigen|Afficher la timeline/i
        });
        this.checkToolTip = page.locator(".cdk-overlay-pane.mat-mdc-tooltip-panel-right.mat-mdc-tooltip-panel");
        this.folgepositionBtn = page
            .getByRole("button", {
                name: /Freibetrag bearbeiten \(Folgeposition\)|Modifier la position/i
            })
            .first();
        this.freibetragEffektiv = page.getByTestId("einkommensfreibetragGeplant").getByTestId("root-control");
        this.begrundung = page.getByTestId("einkommensfreibetragBegruendung").getByTestId("root-control");
        this.unterstutzungsbetrag = page.locator("tbody[class*='rahmenbudget-footer'] td[class='currency-column']");
        this.betragMonatlich = page.getByTestId("betragMonatlich").getByTestId("root-control");
        this.fillReferenzNummer = page.getByTestId("referenznummer").getByTestId("root-control");
        this.ausgabenWohnkostenRow = page.locator("tbody").filter({
            has: page.locator("td").filter({
                has: page.locator("mat-icon[data-mat-icon-name*='rb-wohnkosten']")
            })
        });
        this.wohnkostenExpandBtn = this.ausgabenWohnkostenRow.getByTestId("expand-rahmenbudget-grid");
        this.ueberhoehteWohnkostenBtn = page.locator("div[class='ueberhoehte-wohnkosten'] button");
        this.ueberhoehteWohnkostenErfassenBtn = page.getByRole("button", {
            name: /Überhöhte Wohnkosten erfassen|Saisir les frais de logement excessifs/i
        });
        this.dropDownIconEinnahmen = page.getByTestId("expand-rahmenbudget-grid").last();
        this.btnVerlaufEffektiverBetrageOffnen = page.getByRole("menuitem", {
            name: /Verlauf effektiver Beträge öffnen|Ouvrir l'historique des montants effectifs/i
        });
        this.btnSichernVerlaufEffektiverBetrageOffnen = page.getByRole("button", {
            name: /Speichern und Schliessen|Enregistrer/i
        });
        this.ruckbehalteTab = page.getByRole("tab", {
            name: /Rückbehalt|Réserve/i
        });
        this.btnRuckbehaltErfassen = page.getByRole("button", {
            name: /Rückbehalt erfassen|Ajouter une réserve/i
        });
        this.ruckbehaltTitel = page.getByTestId("title").getByTestId("root-control");
        this.betraMonatlichtxtbox = page.getByTestId("betragMonatlich").getByTestId("root-control");
        this.startMonatTxtbox = page.getByTestId("validFrom").getByTestId("root-control");
        this.endMonatTxtbox = page.getByTestId("validThrough").getByTestId("root-control");
        this.beschreibungTxtbox = page.getByTestId("beschreibung").getByTestId("root-control");
        this.uploadFile = page.getByRole("button", { name: `Diverse Dokumente` }).last();
        //
        this.monatsbudgetTab = page.getByRole("tab", {
            name: /Monatsbudget|Budget mensuel/i
        });
        this.wohnkostenMenuVerticalBtn = page.locator("tr:has-text('Wohnkosten')").getByTestId("budget-zeile-context-menu").first();
        this.wohnsituationOffnenBtn = page.getByTestId("dossiers-wohnsituation");
        this.monatsbudgetTab = page.getByRole("tab", {
            name: /Monatsbudget|Budget mensuel/i
        });
        this.wohnsituationCard = page.locator("app-wohnsituation-card");
        this.wohnType = page.locator("app-wohnsituation-card h2");
        this.wohnAddress = page.locator("app-wohnsituation-card h2 + span");
        this.appCardHeader = page.locator("app-dossier-header");
        this.appPersoncard = page.locator("app-person-card");
        this.appCardWohnkosten = page.locator("//span[normalize-space(text())='Wohnkosten' or normalize-space(text())='Frais de logement']/following-sibling::span");
        this.appCardGultigab = page.locator("//span[normalize-space(text())='Gültig ab' or normalize-space(text())='Valable à partir du']/following-sibling::span");
        this.wohnSituationStatus = this.wohnsituationCard.locator("div[class='title-address'] + div");
        this.wohnsituationNavLink = page.getByTestId("WohnsituationRoute");
        //
        this.dossierRow = page.locator("tr").filter({
            has: page.locator('mat-icon[data-mat-icon-name="rb-medizinischegrundversorgung"]')
        });
        this.grundbedardIconImg = page.locator("mat-icon[data-mat-icon-name='rb-grundbedarf']");
        this.wohnkostenIconImg = page.locator("mat-icon[data-mat-icon-name='rb-wohnkosten']");
        this.medizinischegrundversorgung = page.locator("mat-icon[data-mat-icon-name='rb-medizinischegrundversorgung']");
        this.rahmenbudgetDialogBtn = page.getByTestId("rahmenbudget-dialog-button");
        this.rahmenbudgetExpandBtn = page.locator("thead button").filter({ has: page.getByTestId("expand-all-rahmenbudget-grid") });
        this.rahmenbudgetCollapseBtn = page.locator("thead button").filter({ has: page.getByTestId("collapse-all-rahmenbudget-grid") });
        this.rowHeader = page.locator("tbody > tr:first-child > td:nth-child(2)");
        this.totalCurrency = page.locator("tbody tr td[class='currency-column']");
        //
        this.rahmenKrankenDetailAppcard = page.locator("app-rahmenbudget-krankenversicherungen-detail").locator("app-card");
        this.kvgExpandBtn = this.dossierRow.getByTestId("expand-rahmenbudget-grid");
    }

    async verifyRahmenKrankenDetails(klient: string, gultigkeit: string, krankenkasse: string, versNummer: string, grundPraemie: number, IPV: number, praemieGAnspruch: number, kostenUeRichtlinie: number, franchise: number, periode: string, police: string, bemkerkung: string, zahlungsEmpf: string, zahlMethode: string, unfall: string) {
        const appCard = this.rahmenKrankenDetailAppcard.filter({ hasText: klient }).first();
        const appCardField = appCard.locator("app-readmode-field");
        const gultigkei = appCardField.filter({ hasText: /Gültigkeit|Validité/i });
        const krankenkass = appCardField.filter({
            hasText: /Krankenkasse|Caisse maladie/i
        });
        const versNumme = appCardField.filter({
            hasText: /Versicherten-Nummer|Numéro d’assuré/i
        });
        const grundPraemi = appCardField.filter({
            hasText: /Grundprämie|Prime de base/i
        });
        const iP = appCardField.filter({ hasText: /IPV|LCA/i });
        const praemieGAnspruc = appCardField.filter({
            hasText: /Prämie gemäss Anspruch|Prime selon droit/i
        });
        const kostenUeRichtlini = appCardField.filter({
            hasText: /Kosten über Richtlinie|Coûts au-delà des directives/i
        });
        const franchis = appCardField.filter({ hasText: /Franchise|Franchise/i });
        const period = appCardField.filter({
            hasText: /Periodizität der Zahlung|Périodicité du paiement/i
        });
        const polic = appCardField.filter({ hasText: /Police|Police/i });
        const bemkerkun = appCardField.filter({
            hasText: /Bemerkungen|Remarques/i
        });
        const zahlungsEmp = appCardField.filter({
            hasText: /Zahlungsempfänger\/in|Bénéficiaire de paiement/i
        });
        const zahlMethod = appCardField.filter({
            hasText: /Zahlungsmethode|Méthode de paiement/i
        });
        const unfal = appCardField.filter({
            hasText: /Unfallversicherung inkl.|Assurance accident incl./i
        });
        await this.kvgExpandBtn.click();
        await Promise.all([
            expectValue(gultigkei, gultigkeit, `Gültigkeit must be ${gultigkeit}`),
            expectValue(krankenkass, krankenkasse, `Krankenkasse must be ${krankenkasse}`),
            expectValue(versNumme, versNummer, `Versicherten-Nummer must be ${versNummer}`),
            expectValue(grundPraemi, this.common.formatNumber(grundPraemie), `Grundprämie must be ${grundPraemie}`),
            expectValue(iP, this.common.formatNumber(IPV), `IPV must be ${IPV}`),
            expectValue(praemieGAnspruc, this.common.formatNumber(praemieGAnspruch), `Prämie gemäss Anspruch must be ${praemieGAnspruch}`),
            expectValue(kostenUeRichtlini, this.common.formatNumber(kostenUeRichtlinie), `Kosten über Richtlinie must be ${kostenUeRichtlinie}`),
            expectValue(franchis, this.common.formatNumber(franchise), `Franchise must be ${franchise}`),
            expectValue(period, periode, `Periode must be ${periode}`),
            expectValue(polic, police, `Police must be ${police}`),
            expectValue(bemkerkun, bemkerkung, `Bemerkungen must be ${bemkerkung}`),
            expectValue(zahlungsEmp, zahlungsEmpf, `Zahlungsempfänger/in must be ${zahlungsEmpf}`),
            expectValue(zahlMethod, zahlMethode, `Zahlungsmethode must be ${zahlMethode}`),
            expectValue(unfal, unfall, `Unfallversicherung inkl. must be ${unfall}`)
        ]);
    }
    async waitRahmenbudgetQueryAPI() {
        await this.common.waitForApiHelper(this.page, "RahmenbudgetQuery", async () => {});
    }
    async verfifyRahmenbudgetDetails(checkTotalAusgaben: number, checkTotalEinnahmen: number, checkTotalUnterstutzungsbetrag: number) {
        // totalCurrency[0] = Total Ausgaben, [1] = Total Einnahmen, [2] = Total Unterstutzungsbetrag
        const totalAusgaben = this.totalCurrency.nth(0);
        const totalEinnahmen = this.totalCurrency.nth(1);
        const totalUnterstutzung = this.totalCurrency.nth(2);
        await expect.soft(totalAusgaben, `total Ausgaben must be ${checkTotalAusgaben}`).toContainText(this.common.formatNumber(checkTotalAusgaben));
        await expect.soft(totalEinnahmen, `total Einnahmen must be ${checkTotalEinnahmen}`).toContainText(this.common.formatNumber(checkTotalEinnahmen));
        await expect.soft(totalUnterstutzung, `total Unterstutzung must be ${checkTotalUnterstutzungsbetrag}`).toContainText(this.common.formatNumber(checkTotalUnterstutzungsbetrag));
    }
    async rahmenbudgetVisualComparison(checkColTitle: string, checkRowTitle: string) {
        const columnTitles = checkColTitle
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        const rowTitles = checkRowTitle
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

        await expect.soft(this.grundbedardIconImg, "Grundbedarf icon should be visible").toBeVisible();
        await expect.soft(this.wohnkostenIconImg, "Wohnkosten icon should be visible").toBeVisible();
        await expect.soft(this.medizinischegrundversorgung, "Medizinische Grundversorgung icon should be visible").toBeVisible();
        await expect.soft(this.rahmenbudgetDialogBtn, "Rahmenbudget Dialog button should be visible").toBeVisible();
        await expect.soft(this.rahmenbudgetExpandBtn, "Rahmenbudget Expand button should be visible").toBeVisible();
        await expect.soft(this.rahmenbudgetCollapseBtn, "Rahmenbudget Collapse button should be visible").toBeVisible();

        for (const colTitle of columnTitles) {
            const colHeader = this.page.locator("thead th").filter({ hasText: colTitle });
            await expect.soft(colHeader, `Column header "${colTitle}" should be visible`).toBeVisible();
        }
        for (const rowTitle of rowTitles) {
            const rowHeader = this.rowHeader.filter({ hasText: rowTitle });
            await expect.soft(rowHeader, `Row header "${rowTitle}" should be visible`).toBeVisible();
        }
    }
    async verifyDossierRahmenbudgetDetails(beschreibung: string, zahlungsEmpfaenger: string, bewilligung: string, betrag: number) {
        const dossierBetrag = this.dossierRow.locator("td").filter({ hasText: String(betrag) });
        const dossierBewilligung = this.dossierRow.locator("td").filter({ hasText: bewilligung });
        const dossierBeschreibung = this.dossierRow.locator("td").filter({ hasText: beschreibung });
        const dossierZahlungsempfanger = this.dossierRow.locator("td").filter({ hasText: zahlungsEmpfaenger });

        await expectVisible(dossierBetrag, betrag, `Expected betrag "${betrag}" to be visible.`);
        await expectVisible(dossierBewilligung, bewilligung, `Expected bewilligung "${bewilligung}" to be visible.`);
        await expectVisible(dossierBeschreibung, beschreibung, `Expected beschreibung "${beschreibung}" to be visible.`);
        await expectVisible(dossierZahlungsempfanger, zahlungsEmpfaenger, `Expected zahlungsEmpfaenger "${zahlungsEmpfaenger}" to be visible.`);
        await expectValue(this.dossierRow, beschreibung, `Expected beschreibung has value "${beschreibung}".`);
        await expectValue(this.dossierRow, zahlungsEmpfaenger, `Expected zahlungsEmpfaenger has value "${zahlungsEmpfaenger}".`);
        await expectValue(this.dossierRow, bewilligung, `Expected bewilligung has value "${bewilligung}".`);
        await expectValue(this.dossierRow, betrag, `Expected betrag has value "${betrag}".`);
    }
    async goToWohnsituation() {
        await this.navigation.openMenuNav();
        await this.wohnsituationNavLink.click();
    }

    async verifyWohnsituationInfo(dossier: string, checkWohntyp: string, checkAddress: string, checkGueltigAb: string, checkWohnKosten: string, checkBewohnerListe: string, checkWohnSituation: string) {
        await expect
            .soft(this.appCardHeader, {
                message: `Expected appCardHeader to contain dossier "${dossier}".`
            })
            .toContainText(dossier);
        await expect
            .soft(this.wohnsituationCard, {
                message: `Expected wohnsituationCard to contain checkWohntyp "${checkWohntyp}".`
            })
            .toContainText(checkWohntyp);
        await expect
            .soft(this.wohnAddress, {
                message: `Expected wohnAddress to contain checkAddress "${checkAddress}".`
            })
            .toContainText(checkAddress);
        if (checkBewohnerListe !== "" && checkBewohnerListe !== null && checkBewohnerListe !== undefined) {
            const expected = checkBewohnerListe
                .split(";")
                .map((s) => s.trim())
                .filter(Boolean);
            for (const exp of expected) {
                const cards = this.appPersoncard.filter({ hasText: exp });
                await expect
                    .soft(cards.first(), {
                        message: `Expected at least one app-person-card to contain "${exp}".`
                    })
                    .toBeVisible();
            }
        }
        await expect
            .soft(this.appCardWohnkosten, {
                message: `Expected appCardWohnkosten to contain checkWohnKosten "${checkWohnKosten}".`
            })
            .toContainText(checkWohnKosten);
        await expect
            .soft(this.appCardGultigab, {
                message: `Expected appCardGultigab to contain checkGueltigAb "${this.common.convertToDDMMYYYY(checkGueltigAb)}".`
            })
            .toContainText(this.common.convertToDDMMYYYY(checkGueltigAb));
        await expect
            .soft(this.wohnSituationStatus, {
                message: `Expected wohnSituationStatus to contain checkWohnSituation "${checkWohnSituation}".`
            })
            .toContainText(checkWohnSituation);
    }
    async goToMonatsbudgetTab() {
        await this.monatsbudgetTab.click();
        await this.navigation.waitForPageReady();
    }
    async checkMonatsbudget(checkAusgabenTotal: number, checkWeitereAbzuege: number, checkZusammenfassung: number) {
        const totalAusgaben = this.page.locator("tr:has-text('Total Ausgaben'),tr:has-text('Total des dépenses')");
        const totalEinnahmen = this.page.locator("tr:has-text('Total Einnahmen'),tr:has-text('Total des revenus')");
        const totalZusammenfassung = this.page.locator("tr:has-text('Total Zusammenfassung'),tr:has-text('Solde total')");
        await expect.soft(totalAusgaben).toContainText(this.common.formatNumber(checkAusgabenTotal));
        await expect.soft(totalEinnahmen).toContainText(this.common.formatNumber(checkWeitereAbzuege));
        await expect.soft(totalZusammenfassung).toContainText(this.common.formatNumber(checkZusammenfassung));
    }
    async expandSituationsbedingteLeistungen() {
        const situationRow = this.page.locator("tbody[data-cy='gruppe-SituationsbedingteLeistungen']");
        await situationRow.getByTestId("expand-rahmenbudget-grid").click();
        try {
            await expect(situationRow.getByTestId("expand-rahmenbudget-grid").locator("mat-icon")).toHaveAttribute("data-mat-icon-name", "collapse");
        } catch {
            await situationRow.getByTestId("expand-rahmenbudget-grid").click();
        }
    }
    async verifySituationsbedingteLeistungExists(category: string, element: string, leistungsErbringer: string, betragMonatlich: string | number, geplantVon: string, geplantBis: string) {
        await expect(this.page.locator("app-rahmenbudget-sil-detail"), {
            message: `Expected category "${category}" to be present in situationsbedingte list.`
        }).toContainText(category);

        const elementAppcard = this.page.locator("app-sil-detail-card-readonly").filter({ hasText: element });
        const leistungserbringer = elementAppcard
            .locator("app-readmode-field")
            .filter({ hasText: /Leistungserbringer|Prestataire de services/i })
            .first();
        const betragmonatlich = elementAppcard
            .locator("app-readmode-field")
            .filter({ hasText: /Betrag monatlich|Montant mensuel/i })
            .first();
        const geplantvon = elementAppcard
            .locator("app-readmode-field")
            .filter({ hasText: /Geplant von|Prévu à partir de/i })
            .first();
        const geplantbis = elementAppcard
            .locator("app-readmode-field")
            .filter({ hasText: /Geplant bis|Prévu jusqu’au/i })
            .first();

        if (leistungsErbringer !== "" && leistungsErbringer !== null && leistungsErbringer !== undefined) {
            await expect
                .soft(leistungserbringer, {
                    message: `For "${element} card ", expected Leistungserbringer to contain "${leistungsErbringer}".`
                })
                .toContainText(leistungsErbringer);
        }
        if (betragMonatlich !== "" && betragMonatlich !== null && betragMonatlich !== undefined) {
            await expect
                .soft(betragmonatlich, {
                    message: `For "${element} card ", expected Betrag monatlich to contain "${betragMonatlich}".`
                })
                .toContainText(String(betragMonatlich));
        }
        if (geplantVon !== "" && geplantVon !== null && geplantVon !== undefined) {
            await expect
                .soft(geplantvon, {
                    message: `For "${element} card ", expected Geplant von to contain "${geplantVon}".`
                })
                .toContainText(geplantVon);
        }
        if (geplantBis !== "" && geplantBis !== null && geplantBis !== undefined) {
            await expect
                .soft(geplantbis, {
                    message: `For "${element} card ", expected Geplant bis to contain "${geplantBis}".`
                })
                .toContainText(geplantBis);
        }
    }

    async checkWohnKostenFirstLevel(firstLevelBetrag: number) {
        await expect.soft(this.page.locator('tr:has-text("Wohnkosten")')).toContainText(this.common.formatNumber(firstLevelBetrag));
    }
    async expandWohnkostenRow() {
        await this.wohnkostenExpandBtn.click();
    }
    async checkWohnkosten(wohnKostenGemAnspruch: number, uebernommeneWohnkosten: number, totalWohnkosten: number) {
        await expect.soft(this.page.locator('tr:has-text("Total Wohnkosten"),tr:has-text("Total des frais de logement")').last()).toContainText(this.common.formatNumber(totalWohnkosten));
        await expect.soft(this.page.locator('tr:has-text("Wohnkosten gemäss Anspruch"),tr:has-text("Frais de logement selon le droit")').last()).toContainText(this.common.formatNumber(wohnKostenGemAnspruch));
        await expect.soft(this.page.locator('tr:has-text("Übernommene Wohnkosten"),tr:has-text("Frais de logement pris en charge")').last()).toContainText(this.common.formatNumber(uebernommeneWohnkosten));
    }

    //3
    async verifyWohnsituationHeader() {
        await expect.soft(this.page.locator("app-content-header-base")).toContainText("Wohnsituation - Haushalt");
    }
    //1
    async gotoRamenbudgetPage() {
        await this.navigation.openMenuNav();

        // First try the direct testid approach
        try {
            if (await this.rahmenbudgetNavLink.isVisible({ timeout: 3000 })) {
                await this.rahmenbudgetNavLink.click({ timeout: 3000 });
                await this.navigation.waitForPageReady();
                return;
            }
        } catch {
            console.log("⚠️ RahmenbudgetRoute testid not visible, trying fallback...");
        }

        // Check if WSH section needs to be expanded first
        const wshButton = this.page
            .locator("button")
            .filter({ hasText: /^Wirtschaftliche Sozialhilfe$/i })
            .first();
        if (await wshButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            console.log("🔄 Expanding WSH section...");
            await wshButton.click();
            await this.page.waitForTimeout(500);
        }

        // Try to find and click Rahmenbudget link by role
        const rahmenbudgetLink = this.page.getByRole("link", { name: /Rahmenbudget/i }).first();
        await rahmenbudgetLink.click({ timeout: 5000 });
        await this.navigation.waitForPageReady();
    }
    //2
    async openWohnsituationPage() {
        // First try to use the context menu on Wohnkosten row
        try {
            const wohnkostenRow = this.page.locator("tr:has-text('Wohnkosten')").first();
            await wohnkostenRow.hover();
            await this.page.waitForTimeout(300);

            if (await this.wohnkostenMenuVerticalBtn.isVisible({ timeout: 3000 })) {
                await this.wohnkostenMenuVerticalBtn.click();
                await this.wohnsituationOffnenBtn.click();
                await this.verifyWohnsituationHeader();
                return;
            }
        } catch {
            console.log("⚠️ Context menu approach failed, using navigation menu...");
        }

        // Fallback: Use navigation menu
        await this.navigation.openMenuNav();
        const wohnsituationLink = this.page.getByRole("link", { name: /Wohnsituation/i }).first();
        await wohnsituationLink.click();
        await this.navigation.waitForPageReady();
        await this.verifyWohnsituationHeader();
    }
    async checkUbernommene(checkUebernomWohnKosten: number) {
        await this.wohnkostenRow.click();
        await expect.soft(this.page.locator('tr:has-text("Übernommene Wohnkosten")').last()).toContainText(this.common.formatNumber(checkUebernomWohnKosten));
    }

    async gotoMonatsbudgetTab() {
        await this.rahmenField.click();
        await this.monatsbudgetTab.click();
    }
    async validateEinnahmen(effektiverBetrag: number) {
        expect.soft(this.page.locator("tr:has-text('Unselbständiges Erwerbseinkommen') td[class*='currency-column']").first()).toContainText(this.common.formatNumber(effektiverBetrag));
    }
    async uploadKostenFile(kostenVorDoc: string) {
        if (kostenVorDoc != "" && kostenVorDoc != null && kostenVorDoc != undefined) {
            await this.common.uploadMultipleFiles(this.page.getByRole("button", { name: `Kostenvoranschlag / Rechnung` }).last(), kostenVorDoc);
        }
    }

    async uploadBewilligteFile(bewilligtDoc: string) {
        if (bewilligtDoc != "" && bewilligtDoc != null && bewilligtDoc != undefined) {
            await this.common.uploadMultipleFiles(this.page.getByRole("button", { name: `Bewilligte Kostengutsprache` }).last(), bewilligtDoc);
        }
    }
    async goToRuckbehalteTab() {
        // First try clicking the Rahmenbudget nav link directly
        try {
            await expect(this.rahmenbudgetNavLink).toBeVisible({ timeout: 5000 });
            await this.rahmenbudgetNavLink.click();
        } catch {
            console.log("⚠️ RahmenbudgetNavLink not visible, trying to expand WSH section...");

            // Try to expand the WSH section first
            const wshButton = this.page.getByRole("button", { name: /Wirtschaftliche Sozialhilfe/i });
            try {
                await expect(wshButton).toBeVisible({ timeout: 5000 });
                console.log("🔄 Expanding WSH section...");
                await wshButton.click();
                await this.page.waitForTimeout(500);
            } catch {
                console.log("⚠️ WSH button not found, trying alternative testid...");
            }

            // Now try clicking the Rahmenbudget link again
            try {
                await expect(this.rahmenbudgetNavLink).toBeVisible({ timeout: 5000 });
                await this.rahmenbudgetNavLink.click();
            } catch {
                // Final fallback: use exact testid with scrollIntoView + force click
                const exactTestId = this.page.getByTestId("RahmenbudgetRoute");
                await exactTestId.scrollIntoViewIfNeeded();
                await exactTestId.click({ force: true });
            }
        }

        await this.navigation.waitForPageReady();
        await this.stability.stableClick(this.ruckbehalteTab, {
            waitBefore: 500,
            waitAfter: 300
        });
        await this.navigation.waitForPageReady();
    }
    async ruchbehalteErfassen(titel: string, betrag: number, startMonat: string, endMonat: string, beschreibung: string, documents: string) {
        await this.btnRuckbehaltErfassen.click();
        // const btnedit = await this.page.locator('mat-expansion-panel').last().locator('button').filter({has : this.page.locator("mat-icon[data-mat-icon-name='edit']")}).last().isEnabled()
        // console.log('********** BTN EDIT"""""""" : ',btnedit)
        // if(btnedit){
        //     await this.page.locator('mat-expansion-panel').last().locator('button').filter({has : this.page.locator("mat-icon[data-mat-icon-name='edit']")}).last().click()
        // }
        //replace with waitForSpinnerToDisappear
        // await this.navigation.waitForSpinnerToDisappear()
        await this.openUploadFile(documents);
        await this.startMonatTxtbox.fill(startMonat);
        await this.betraMonatlichtxtbox.fill(betrag.toString());
        await this.ruckbehaltTitel.pressSequentially(titel);
        await this.endMonatTxtbox.fill(endMonat);
        await this.beschreibungTxtbox.fill(beschreibung);
        await this.spichernBtn.click();
        await this.navigation.waitForPageReady();
    }
    async openUploadFile(documentPath: string) {
        if (documentPath !== "" && documentPath !== null && documentPath !== undefined) {
            await this.common.uploadMultipleFiles(this.uploadFile, documentPath);
        }
    }

    async kostengutspracheBewillingung(titel: string, betrag: number) {
        const panelTitle = await this.page.locator(`app-kostengutensprache-panel:has-text('${titel}'):has-text('${this.common.normalizeNumber(betrag)}')`);
        const bewillingungBtn = panelTitle.locator("app-approval-workflow-open-button a");
        await panelTitle.click();
        await bewillingungBtn.click();
        await this.anfragenBtn.click();
    }
    async validateKostengutspracheStatus() {
        await this.navigation.waitForSpinnerToDisappear();
        const decisionLabel = this.page
            .locator("mat-stepper")
            .first()
            .locator("app-readmode-field")
            .filter({ hasText: /Entscheid|Décision/i });
        await expect.soft(decisionLabel).toContainText(/Angefragt|Demandé/i, { timeout: 60000 });
    }

    // Wohnkosten_Anpassen
    async clickWohnkostenErfassen() {
        await this.stability.stableClick(this.wohnkostenExpandBtn, {
            waitBefore: 300,
            waitAfter: 500
        });
        await this.stability.stableClick(this.ueberhoehteWohnkostenBtn, {
            waitBefore: 300,
            waitAfter: 500
        });
        await this.stability.stableClick(this.ueberhoehteWohnkostenErfassenBtn, {
            timeout: 30000,
            waitBefore: 300,
            waitAfter: 500,
            retries: 3
        });
    }
    //check amount of einkommensfreibetrag
    async checkEinkommensfreibetrag(eFB: number, geplantVon: string, totalNeu: number) {
        await this.navigation.waitForSpinnerToDisappear();
        await this.btnTimeLine.click();

        // Try multiple strategies for timeline click (QA vs DEV structure)
        const anchorLocator = this.page.locator(`div[class*='date-caption']:has-text('${geplantVon}') + a`);
        const dateCaptionLocator = this.page.locator(`div[class*='date-caption']:has-text('${geplantVon}')`);
        const anchorExists = (await anchorLocator.count().catch(() => 0)) > 0;
        if (
            anchorExists &&
            (await anchorLocator
                .first()
                .isVisible()
                .catch(() => false))
        ) {
            console.log(`✅ [Timeline] Using anchor for date '${geplantVon}' (QA structure)`);
            await anchorLocator.click();
        } else {
            console.log(`✅ [Timeline] Using date-caption for date '${geplantVon}' (DEV structure)`);
            await dateCaptionLocator.click();
        }

        const einkommensfreibetrag = this.page.locator("tr:has-text('Einkommensfreibetrag')").locator("td[class*='currency-column']");
        await expect.soft(einkommensfreibetrag).toContainText(`-${this.common.normalizeNumber(eFB)}`);
        await expect.soft(this.unterstutzungsbetrag).toContainText(`${this.common.normalizeNumber(totalNeu)}`);
    }

    // select einnahmen base on klient
    async editErwerbseinkommen(klient: string, geplantVon: string, geplantBis: string, eFB: number, begruendung: string) {
        await this.page
            .locator(`tr:has-text('${klient}')`)
            .filter({ hasText: /Erwerbseinkommen|Revenu de l'activité lucrative/i })
            .getByTestId("expand-rahmenbudget-grid")
            .click();
        await this.erwerbseinkommenEditMenuBtn.click();
        await this.folgepositionBtn.click();
        await this.geplantVon.fill(geplantVon);
        await this.geplantBis.fill(geplantBis);
        await this.freibetragEffektiv.clear();
        await this.freibetragEffektiv.fill(eFB.toString());
        await this.begrundung.fill(begruendung);
        await this.spichernBtn.click();
        await this.navigation.waitForPageReady();
    }

    async clickCheckbox(spaltenName: string) {
        await this.stability.stableClick(this.menutriggerBtn, { waitAfter: 500 });
        const checkbox = this.page.locator(`mat-checkbox:has-text('${spaltenName}')`);
        await expect(checkbox).toBeVisible({ timeout: 5000 });

        const classAttr = await checkbox.getAttribute("class");
        const isChecked = classAttr?.includes("mat-mdc-checkbox-checked");
        if (!isChecked) {
            await checkbox.click();
            await this.navigation.waitForPageReady();
        }
        await this.page.keyboard.press("Escape");
        await this.navigation.waitForPageReady();
    }
    // check if column header is visible
    async checkColumnHeader(pruefenVisibleTitel: string) {
        await expect.soft(this.captainRow).toContainText(pruefenVisibleTitel);
    }
    //click kostengutsprache speichern button
    async clickKostengutspracheSpeichern() {
        await this.btnKostengutspracheSichern.click();
        await this.navigation.waitForPageReady();
    }
    //input kostengutsprache info
    async inputKostengutspracheInfo(titel: string, betrag: number, leistungserbringer: string, klientschaft: string, gultigAb: string, verfallDatum: string, begrundung: string) {
        if (leistungserbringer !== "") {
            await this.leistungserbringerKostengutsprache.click({ delay: 1000 });
            await this.page
                .locator(`mat-option:has-text("${this.common.getTextBeforeComma(leistungserbringer)}")`)
                .first()
                .click();
        }
        //24.06.2025 change order of filling fields
        await this.gultigAbKostengutsprache.fill(gultigAb);
        await this.begrundungKostengutsprache.pressSequentially(begrundung);
        await this.titlederKostengutsprache.pressSequentially(titel);
        await this.beantragterBetrag.fill(betrag.toString());
        if (await this.klientschaftKostengutsprache.isVisible()) {
            await this.klientschaftKostengutsprache.click();
            await this.page.locator(`mat-option:has-text("${klientschaft}")`).click();
        }

        await this.verfallDatumKostengutsprache.fill(verfallDatum);
    }
    //select kostengutsprache tab
    async clickKostengutspracheTab() {
        await this.kostengutspracheTab.click();
    }
    //click kostengutsprache erfassen button
    async clickKostengutspracheErfassen() {
        await this.btnKostengutspracheErfassen.click();
    }
    //select menu item
    async selectMenuItem(level1: string, level2: string, level3: string) {
        await this.page.getByRole("menuitem", { name: level1 }).click();
        await this.page.getByRole("menuitem", { name: level2 }).click();
        await this.page.getByRole("menuitem", { name: level3 }).click();
    }

    removeCharactersAfterComma(str: string) {
        const commaIndex = str.indexOf(",");
        if (commaIndex !== -1) {
            return str.substring(0, commaIndex);
        }
        return str;
    }
    async neuePositionErfassen(klient: string, kontonummer: number, bezeichnung: string, leistungserbringer: string, value: number, geplantVon: string, geplantBis: string) {
        await this.selectKilent(klient);
        await this.inputSearchInput(String(kontonummer));
        await this.page.locator(`mat-option:has-text('${bezeichnung}') mat-checkbox`).first().click();
        await this.clickVervollstandigenBtn();
        if (String(kontonummer).includes("3095.10")) {
            await this.page.getByTestId("prozent").getByTestId("root-control").fill(String(value));
            await this.inputInfo(geplantVon, geplantBis);
            await this.erfassenBtn.click();
        } else if (String(kontonummer).includes("3095.20") || String(kontonummer).includes("3095.30") || String(kontonummer).includes("3095.40")) {
            await this.inputInfo(geplantVon, geplantBis);
            await this.erfassenBtn.click();
        } else {
            await this.leistungserbringer.fill(this.removeCharactersAfterComma(leistungserbringer));
            await this.page.locator(`mat-option:has-text("${leistungserbringer}")`).click();
            await this.betragMonatlich.fill(String(value));
            await this.inputInfo(geplantVon, geplantBis);
            await this.erfassenBtn.click();
        }
        //replace with waitForSpinnerToDisappear
        await this.navigation.waitForSpinnerToDisappear();
        await this.page.locator("app-konto-parameter-search-dialog").waitFor({ state: "hidden" });
    }

    async inputInfo(geplantVon: string, geplantBis: string) {
        await this.geplantVon.fill(geplantVon);
        await this.geplantBis.fill(geplantBis);
    }

    async clickVervollstandigenBtn() {
        await this.vervollstandigenBtn.click();
    }
    async clickNeuePositionBtn() {
        const directNeuePositionBtn = this.page.getByRole("button", {
            name: /Neue Position|Nouvelle position/i
        });

        try {
            await directNeuePositionBtn.waitFor({ state: "visible", timeout: 5000 });
            await directNeuePositionBtn.click();
            const ausgabeMenuItem = this.page.getByRole("menuitem", {
                name: /Ausgabe|Dépense/i
            });
            try {
                await ausgabeMenuItem.waitFor({ state: "visible", timeout: 3000 });
                await ausgabeMenuItem.click();
            } catch {
                // Menu item not present, continue
            }
        } catch {
            // Fallback: use context menu on row (legacy behavior)
            await this.situationbedingteLeistungenBtn.click();
            await this.neuePositionBtn.click();
        }
    }
    async selectKilent(klient: string) {
        await this.page.locator(`app-card:has-text('${klient}') button`).last().click();
    }

    async inputSearchInput(kontonummer: string) {
        await this.searchInput.fill(kontonummer);
    }

    async inputDate(lEvonDate: string, lEbisDate: string) {
        await this.gultigAb.fill(lEvonDate);
        await this.gultigBis.fill(lEbisDate);
    }

    async selectVerwendungsperiode(verwendungPeriode: string, status: string) {
        await this.clickRahNav();
        await this.FreigabeVerwenTab.click();
        await this.FreigabeVerwenTab.click();
        await this.page
            .locator("tr")
            .filter({ hasText: `${verwendungPeriode}` })
            .locator("app-enum-selection mat-select")
            .click();
        await this.page.locator(`mat-option:has-text("${status}")`).click();
        await this.navigation.waitForPageReady();
        await this.stability.stableClick(this.freigabeVerwendungSpeichernBtn);
        await this.navigation.waitForPageReady();
    }
    async selectVerwendungsperiodeForC(verwendungPeriode: string, status: string, dokuments: string) {
        await this.clickRahNav();
        await this.FreigabeVerwenTab.click();
        await this.FreigabeVerwenTab.click();
        await this.page
            .locator("tr")
            .filter({ hasText: `${verwendungPeriode}` })
            .locator("app-enum-selection mat-select")
            .click();
        await this.page.locator(`mat-option:has-text('${status}')`).click();

        const upload = this.page
            .locator("tr")
            .filter({ hasText: `${verwendungPeriode}` })
            .locator("app-file-upload-card");
        await this.common.uploadMultipleFiles(upload, dokuments, "AventisFileQuery");
        await this.navigation.waitForPageReady();
        await this.stability.stableClick(this.freigabeVerwendungSpeichernBtn);
        await this.navigation.waitForPageReady();
    }
    async selectVerwendungsperiodeForB(verwendungPeriode: string, status: string) {
        await this.clickRahNav();
        await this.FreigabeVerwenTab.click();
        await this.navigation.waitForPageReady();

        const verwendungs = this.common.separateText(verwendungPeriode);
        let changesMade = false;

        for (const verwendung of verwendungs) {
            const row = this.page.locator("tr").filter({ hasText: `${verwendung}` });
            const selectElement = row.locator("app-enum-selection mat-select");

            // Check current status - get the displayed text in the mat-select
            const currentStatus = await selectElement.textContent().catch(() => "");
            const currentStatusTrimmed = currentStatus?.trim() || "";

            if (currentStatusTrimmed === status) {
                console.log(`[VerwendungsPeriode] ${verwendung} already has status "${status}", skipping...`);
                continue;
            }

            console.log(`[VerwendungsPeriode] ${verwendung}: changing from "${currentStatusTrimmed}" to "${status}"`);
            await selectElement.click();
            await this.page.waitForTimeout(200);
            await this.page.locator(`mat-option:has-text("${status}")`).click();
            await this.page.waitForTimeout(300);
            changesMade = true;
        }

        await this.navigation.waitForPageReady();

        // Only click save if changes were made AND the button is enabled
        if (changesMade) {
            // Wait a bit for Angular change detection to process
            await this.page.waitForTimeout(500);

            // Check if save button is enabled
            const isSaveEnabled = await this.freigabeVerwendungSpeichernBtn.isEnabled({ timeout: 3000 }).catch(() => false);

            if (isSaveEnabled) {
                console.log("[VerwendungsPeriode] Saving changes...");
                await this.stability.stableClick(this.freigabeVerwendungSpeichernBtn);
                await this.navigation.waitForPageReady();
            } else {
                // Changes might have been auto-saved or form state is pristine
                console.log("[VerwendungsPeriode] Save button not enabled, changes may have been auto-committed.");
            }
        } else {
            console.log("[VerwendungsPeriode] No changes needed, skipping save.");
        }
    }

    async createLeistungsentscheid(lEvonDate: string, lEbisDate: string, checkStatus: string) {
        await this.leistungsentscheid.click();
        await this.navigation.waitForPageReady();

        // Wait for and click the button to create new Leistungsentscheid
        await expect(this.neuenLeistungsentcheidBtn).toBeVisible({ timeout: 10000 });
        await this.neuenLeistungsentcheidBtn.click();

        // Wait for the form to appear (validFrom field)
        await this.txtGeplantVon.waitFor({ state: "visible", timeout: 15000 });
        await this.navigation.waitForPageReady();

        await this.txtGeplantVon.fill(lEvonDate);
        await this.txtGeplantBis.fill("");
        await this.txtGeplantBis.pressSequentially(lEbisDate);

        const speichernBtnVisible = await this.leistungsentcheidSpeichernBtn.isVisible();
        console.log("********** STATUS VISIBLE:", speichernBtnVisible);

        try {
            await expect(this.leistungsentcheidSpeichernBtn).toBeEnabled({
                timeout: 5000
            });
            await this.stability.stableClick(this.leistungsentcheidSpeichernBtn);
            await this.navigation.waitForPageReady();
        } catch {
            await this.page.reload();
            await this.stability.stableClick(this.leistungsentcheidSpeichernBtn);
            await this.navigation.waitForPageReady();
        }

        try {
            await expect(this.bewilligungOffnenBtn).toBeVisible({ timeout: 5000 });
            await this.bewilligungOffnenBtn.click();
        } catch {
            const dialogButton = this.page.getByRole("button", { name: /Abbrechen|Löschen/ }).first();
            await dialogButton.click();

            const dialogBackdrop = this.page.locator(".cdk-overlay-backdrop");
            await dialogBackdrop.waitFor({ state: "hidden", timeout: 10000 }).catch(() => {});
            await this.page
                .locator("mat-dialog-container")
                .waitFor({ state: "hidden", timeout: 10000 })
                .catch(() => {});

            await this.navigation.waitForPageReady();
            await this.stability.stableClick(this.bewilligungOffnenBtn, {
                timeout: 30000,
                waitBefore: 500,
                waitAfter: 500,
                retries: 3
            });
        }

        await this.navigation.waitForPageReady();

        await this.anfragenBtn.click();
        const POLLING_INTERVAL_MS = 6000;
        const MAX_ATTEMPTS = 5;
        for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
            const statusText = (await this.status.textContent())?.trim();
            if (statusText === checkStatus) {
                break;
            }
            if (attempt === MAX_ATTEMPTS - 1) {
                await expect.soft(this.status).toHaveText(checkStatus, { timeout: 1000 });
            } else {
                await this.page.waitForTimeout(POLLING_INTERVAL_MS);
            }
        }
    }

    async clickRahmenbudgetNavLink() {
        // Check if we're already on the MAIN Rahmenbudget page (URL ends with /budget/budget)
        // Sub-pages like Zahlungsmodalitäten also contain /budget/ but need navigation back
        const currentUrl = this.page.url();
        const isOnMainRahmenbudgetPage = currentUrl.includes("/budget/budget");

        if (isOnMainRahmenbudgetPage) {
            console.log("✅ Already on main Rahmenbudget page, skipping navigation");
            return;
        }

        // Check if we're on a Rahmenbudget sub-page (like Zahlungsmodalitäten) - use "Back to Rahmenbudget" link
        const backToRahmenbudgetLink = this.page.getByRole("link", { name: /Zurück zum Rahmenbudget|Retour au budget-cadre/i });
        if (await backToRahmenbudgetLink.isVisible({ timeout: 2000 }).catch(() => false)) {
            console.log("🔄 On Rahmenbudget sub-page, clicking 'Zurück zum Rahmenbudget' link...");
            await backToRahmenbudgetLink.click();
            await this.navigation.waitForPageReady();
            return;
        }

        //11/6 delete unnecessary click on rahmenField
        await this.navigation.openMenuNav();

        // First try the direct RahmenbudgetRoute testid
        try {
            await expect(this.rahmenbudgetNavLink).toBeVisible({ timeout: 5000 });
            await this.rahmenbudgetNavLink.click({ timeout: 3000 });
            await this.navigation.waitForPageReady();
            return;
        } catch {
            console.log("⚠️ RahmenbudgetRoute not visible, trying alternative navigation...");
        }

        // Check if WSH section needs to be expanded first
        const wshButton = this.page
            .locator("button")
            .filter({ hasText: /^Wirtschaftliche Sozialhilfe$/i })
            .first();
        if (await wshButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            console.log("🔄 Expanding WSH section...");
            await wshButton.click();
            await this.page.waitForTimeout(500);
        }

        // Now look for the Rahmenbudget link in the expanded sub-menu
        const rahmenbudgetLink = this.page
            .locator("a")
            .filter({ hasText: /^Rahmenbudget$/i })
            .first();
        if (await rahmenbudgetLink.isVisible({ timeout: 5000 }).catch(() => false)) {
            console.log("🔄 Clicking Rahmenbudget link in sub-menu...");
            await rahmenbudgetLink.click();
            await this.navigation.waitForPageReady();
            return;
        }

        // Also try looking for link that contains "Rahmenbudget" text
        const rahmenbudgetLinkAlt = this.page.getByRole("link", { name: /Rahmenbudget/i }).first();
        if (await rahmenbudgetLinkAlt.isVisible({ timeout: 3000 }).catch(() => false)) {
            console.log("🔄 Clicking Rahmenbudget link (by role)...");
            await rahmenbudgetLinkAlt.click();
            await this.navigation.waitForPageReady();
            return;
        }

        console.log("⚠️ Could not navigate to Rahmenbudget page");
    }
    async clickRahNav() {
        // Check if already on Rahmenbudget page
        const currentUrl = this.page.url();
        if (currentUrl.includes("/budget")) {
            console.log("✅ Already on Rahmenbudget, skipping clickRahNav");
            return;
        }

        // Try different locators for Rahmenbudget navigation
        try {
            await this.rahmenbudgetNavLink.click({ delay: 500, timeout: 5000 });
            return;
        } catch {
            // Try alternative: link by role
            const rahmenbudgetLink = this.page.getByRole("link", { name: /Rahmenbudget/i }).first();
            if (await rahmenbudgetLink.isVisible({ timeout: 3000 }).catch(() => false)) {
                await rahmenbudgetLink.click();
                await this.navigation.waitForPageReady();
            }
        }
    }

    async clickWohnkostenMenuBtn() {
        await this.wohnkostenMenuBtn.click();
    }
    async clickEntscheidungMennuItem() {
        await this.entscheidungMenuItem.click();
    }
    async clickJaRadioBtn() {
        await this.jaRadioBtn.waitFor({ state: "attached" });
        await this.jaRadioBtn.click();
        await this.jaRadioBtn.click();
        await this.vonTxtbox.waitFor({ state: "visible" });
    }
    async inputUbernahmenInfo(ubernahmeWohnkosten: number, von: string, bis: string, begrundung: string) {
        //replace with pressSequentially to avoid typing
        await this.begrundungTxtArea.fill(begrundung);
        // await this.ubernahmeWohnkostenInput.pressSequentially(ubernahmeWohnkosten);
        //18.06.25 reto
        await this.ubernahmeWohnkostenInput.fill(String(ubernahmeWohnkosten));
        await this.vonTxtbox.fill(von);
        await this.bisTxtbox.fill(bis);
        await expect(this.spichernBtn, {
            message: "Is button spichern enable ?"
        }).toBeEnabled();
        await this.spichernBtn.click();
        await this.navigation.waitForPageReady();
    }
    async verifyUbernahmeWohnkostenStatus() {
        await this.wohnkostenRow.click();
        await expect.soft(this.ubernahmeWohnkostenStatus).toContainText(new RegExp("Ja|Oui", "i"));
    }

    async verifyUnterstutzungsbetragIsGreaterThan0() {
        await this.page.locator("app-rahmenbudget-sub-page").waitFor({ state: "visible" });
        await this.page.getByRole("progressbar").waitFor({ state: "hidden" });
        await expect.soft(this.unterstutzungsbetrag).not.toHaveText("0.00");
    }

    async clickZahlungsInfosAnpassen() {
        await this.zahlungsInfosAnpassenBtn.click();
    }

    async openEditBearbeiten(zahlungsEmpfaengerCheck: string) {
        await expect.soft(this.page.getByRole("row", { name: `${zahlungsEmpfaengerCheck}` }).locator("div")).toHaveText(`${zahlungsEmpfaengerCheck}`);
        await this.page
            .getByRole("row", { name: `${zahlungsEmpfaengerCheck}` })
            .getByRole("button")
            .click();
        await this.chosseOptionEditBearbeiten.click();
    }

    async fillZahlungsinformationenBearbeitenValue(gueltigMonatJahr: string, zahlungsEmpfaenger: string, periodizitaet: string, referenzNummer: string, mitteilung: string) {
        await this.fillGultigAbValue.fill(`${gueltigMonatJahr}`);
        await this.zahlungsempfangerBox.click();
        await this.page.getByRole("option", { name: `${zahlungsEmpfaenger}` }).click();
        await this.periodizitaetBox.click();
        await this.page.getByRole("option", { name: `${periodizitaet}`, exact: true }).click();
        if (referenzNummer !== "") {
            await this.fillReferenzNummer.fill(referenzNummer);
        }
        await this.fillMitteilungValue.fill(`${mitteilung}`);
    }

    async clickBtnZahlungsinformationenSichern() {
        await this.btnZahlungsinformationenSichern.click();
        await this.navigation.waitForPageReady();
    }
    async openKennzahlen() {
        await this.btnKennzahlen.click();
    }

    async checkOutBudget(unterstBetrag: string, valutaTerminNext: string, valutaDatum: string) {
        function formatNumber(num: number): string {
            let numStr = num.toFixed(2);
            let parts = numStr.split(".");
            let integerPart = parts[0];
            let decimalPart = parts[1];
            let formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, "’");
            return `${formattedIntegerPart}.${decimalPart}`;
        }
        let num: number = Number(unterstBetrag);
        let formattedNumber = formatNumber(num);
        await this.btnDropDownKennzahlen.dblclick({ delay: 500 });
        await expect.soft(this.page.locator("div[class='kennzahlen-grid-row'] div[class='currency']")).toHaveText(`${formattedNumber}`);
        await this.btnDropDownGeplanteValutatermine.click();
        await this.btnDropDownGeplanteValutatermine.click();
        await expect
            .soft(
                this.page
                    .locator("app-naechste-faelligkeiten-sidesheet")
                    .filter({ hasText: `${valutaTerminNext} ${valutaDatum}` })
                    .first()
            )
            .toBeVisible();
    }

    async openEditSituationsbedingteLeistung(bezeichnung: string, betrifft: string, geplantVon: string) {
        await this.page.waitForSelector("tr:has(mat-icon[data-mat-icon-name='rb-situationsbedingteleistungen'])", { state: "visible" });
        const iconDropDownKVGHasExpand = (await this.iconDropDownKVG.locator("mat-icon").getAttribute("data-mat-icon-name")) === "expand";
        if (iconDropDownKVGHasExpand) {
            await this.iconDropDownKVG.click();
        }
        await this.page.locator(`app-card:has-text('${bezeichnung}'):has-text('${betrifft}'):has-text('${geplantVon}') button`).click();
        await this.editItemBtn.click();
    }

    async fillInfoEditSituationsbedingteLeistung(geplantVonNeu: string, betragNeu: number, geplantBis: string) {
        await this.betragMonatlich.clear();
        await this.betragMonatlich.fill(betragNeu.toString());
        await this.txtGeplantVon.fill(geplantVonNeu);
        await this.txtGeplantBis.fill(geplantBis);
        await this.spichernBtn.click();
        await this.navigation.waitForPageReady();
    }
    async openGrundbedarfLebensunterhaltEdit(klient: string) {
        await this.btnGrundbedarfLebensunterhalt.click();
        await this.page
            .locator("app-card")
            .filter({ hasText: `${klient}` })
            .getByRole("button")
            .click();
        await this.btnEditGrundbedarfLebensunterhalt.click();
        await this.navigation.waitForPageReady();
    }

    async fillValueNeuePosition(berGrundlage: string, geplantVon: string, gueltigBis: string, individuelleAnpa: string | number, begruendung: string) {
        await this.textBoxBerGrundlage.fill(berGrundlage);
        await this.page.getByRole("option", { name: `${berGrundlage}` }).click();
        await this.textBoxGeplantVon.fill(geplantVon);
        await this.textBoxGueltigBis.fill(gueltigBis);
        await this.textBoxIndividuelleAnpa.fill(String(individuelleAnpa));
        await this.textBoxBegruendung.fill(begruendung);
        await this.spichernBtn.click();
        await this.navigation.waitForPageReady();
    }

    async checkNewTotal(newTotal: string, geplantVon: string, individuelleAnpa: string, gueltigBis: string) {
        const geplantVonField = this.page.locator(".date-caption", { hasText: geplantVon }).locator("~ .ereignis").first().locator("a");
        await this.btnTimeLine.click();

        await geplantVonField.hover();
        await geplantVonField.click();

        const betrag = this.page.locator("tr", { hasText: "Unterstützungsbetrag" }).locator(".currency-column");

        await expect.soft(betrag).toHaveText(newTotal);
    }
    async openDropDownEinnahmen() {
        await this.dropDownIconEinnahmen.click();
    }

    async openEditErwerbseinkommen(klient: string, geplantVon: string, geplantBis: string) {
        const rowLocator = this.page.locator("app-einnahmen-readonly-card");
        const child1 = this.page.locator("app-readmode-field div span").filter({ hasText: `${klient}` });
        const child2 = this.page.locator("app-readmode-field div span").filter({ hasText: `${geplantVon}` });
        const child3 = this.page.locator("app-readmode-field div span").filter({ hasText: `${geplantBis}` });
        const parent = rowLocator.filter({ has: child1 }).filter({ has: child2 }).filter({ has: child3 });
        await parent.getByRole("button").click();
        await this.stability.stableClick(this.btnVerlaufEffektiverBetrageOffnen, { waitBefore: 500, waitAfter: 1500 });
    }

    async fillValueErfassungEffektiverBetrage(verwPeriode: string, betragEff: string, freiBetragEff: string) {
        const verwPeriodeArray = verwPeriode.split(",");
        const betragEffArray = betragEff.split(",");
        const freiBetragEffArray = freiBetragEff.split(",");
        for (let i = 0; i < verwPeriodeArray.length; i++) {
            const verwPeriodeValue = verwPeriodeArray.length > 1 ? verwPeriodeArray[i] : verwPeriodeArray[0];
            const betragEffValue = betragEffArray.length > 1 ? betragEffArray[i] : betragEffArray[0];
            await this.page
                .getByRole("row", { name: `${verwPeriodeValue}` })
                .getByTestId("betragEffektiv")
                .getByTestId("root-control")
                .first()
                .fill(`${betragEffValue}`);
            if (freiBetragEff !== "" && freiBetragEff !== null && freiBetragEff !== undefined) {
                const freiBetragEffValue = freiBetragEffArray.length > 1 ? freiBetragEffArray[i] : freiBetragEffArray[0];
                await this.page
                    .getByRole("row", { name: `${verwPeriodeValue}` })
                    .getByTestId("betragEfbEffektiv")
                    .getByTestId("root-control")
                    .first()
                    .fill(`${freiBetragEffValue}`);
            }
        }
        await this.btnSichernVerlaufEffektiverBetrageOffnen.click();
        await this.navigation.waitForPageReady();
    }
}
