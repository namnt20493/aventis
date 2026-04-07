# Coverage Matrix -- Keyword-zu-Test Zuordnung

> Automatisch generiert am 2026-03-12. Basiert auf Scan aller `staticTestcases/**/*.spec.ts` und `libs/keywords/*.ts`.

## Legende

| Status | Bedeutung |
|--------|-----------|
| Aktiv | Keyword wird in mindestens einem aktiven Test verwendet |
| WIP | Keyword wird nur in `@wip` / `test.skip` Tests verwendet |
| Auskommentiert | Keyword-Aufruf existiert nur in Kommentaren |
| Nicht getestet | Keyword existiert, wird aber in keinem Test verwendet |

---

## AN -- Anspruchspruefung

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| AN01_Soforthilfe_erfassen | anspruchsprufung-keyword.ts | [[AN01_AN02_Soforthilfe.spec.ts]] | @[182197], @bedarfspruefung, @keywordValidation, @all | Aktiv |
| AN02_Soforthilfe_in_RahmenbudgetPruefen | anspruchsprufung-keyword.ts | [[AN01_AN02_Soforthilfe.spec.ts]] | @[182197], @bedarfspruefung, @keywordValidation, @all | Aktiv |

## AW -- Kontoauszug

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| AW01_Kontoauszug | kontoauszug-keyword.ts | [[AW01_AW01b_Kontoauszug.spec.ts]] | @zahlungen, @keywordValidation, @all | Aktiv |
| AW01b_Kontoauszug_DossierSicht | kontoauszug-keyword.ts | [[AW01_AW01b_Kontoauszug.spec.ts]] | @zahlungen, @keywordValidation, @all | Aktiv |

## A0 -- Bedarfspruefung

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| A01_AnspruchPruefung_Bedarfspruefung | bedarfsprufung-keyword.ts | [[a02b091011_Bedarfspruefung.spec.ts]], [[DossierKomplett.spec.ts]], [[BC02_BC04_Buchungen.spec.ts]] | @bedarfspruefung, @keywordValidation, @coreBusiness, @all | Aktiv |
| A01_1_AnspruchPruefung_Bedarfspruefung | bedarfsprufung-keyword.ts | [[A01_1_AnspruchPruefung_Bedarfspruefung.spec.ts]] | @bedarfspruefung, @keywordValidation, @all | Aktiv |
| A01b_Zu_AnsprPruef_Bedarfspruef_ChecklistErgaenzen | bedarfsprufung-keyword.ts | [[A01bcd_Checklist.spec.ts]] | @bedarfspruefung, @keywordValidation, @all | Aktiv |
| A01c_Zu_AnsprPruef_Bedarfspruef_ChecklistNichtRelevant | bedarfsprufung-keyword.ts | [[A01bcd_Checklist.spec.ts]] | @bedarfspruefung, @keywordValidation, @all | Aktiv |
| A01d_Zu_AnsprPruef_Bedarfspruef_Checklist_als_WordExport | bedarfsprufung-keyword.ts | [[A01bcd_Checklist.spec.ts]] | @bedarfspruefung, @keywordValidation, @all | Aktiv |
| A02_AnspruchPruefung_Bedarfspruefung_FEV | bedarfsprufung-keyword.ts | -- | -- | Nicht getestet |

## BC -- Buchungen

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| BC02_Buchungen_importieren_Check | buchhaltung-keyword.ts | [[BC02_BC04_Buchungen.spec.ts]] | @buchhaltung, @keywordValidation, @all | Aktiv |
| BC04_BuchungsJournal_filtern | buchungsJournal-keyword.ts | [[BC02_BC04_Buchungen.spec.ts]] | @buchhaltung, @keywordValidation, @all | Aktiv |

## BU -- Buchhaltung / Zahlungsauftrag

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| BU01_ZahlungsAuftrag_Erstellen | buchhaltung-keyword.ts | [[BU01_BU02_Zahlungen.spec.ts]], [[DossierKomplett.spec.ts]], [[BC02_BC04_Buchungen.spec.ts]] | @zahlungen, @keywordValidation, @coreBusiness, @all | Aktiv |
| BU02_Klient_SozialhilfeSchuld_anzeigen | buchhaltung-keyword.ts | [[BU01_BU02_Zahlungen.spec.ts]] | @zahlungen, @keywordValidation, @all | Aktiv |

## BW -- Bewilligungen

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| BW0X_Bewilligungs_Workflow_Filter | bewilligungen-keywords.ts | -- | -- | Nicht getestet |
| BW01_Bewilligungs_Workflow_LeistungsEntscheid | bewilligungen-keywords.ts | [[a02b091011_Bedarfspruefung.spec.ts]], [[DossierKomplett.spec.ts]], [[BW03c_Verwendungsperiode_mitDokumenten.spec.ts]], [[BC02_BC04_Buchungen.spec.ts]] | @bedarfspruefung, @bewilligung, @coreBusiness, @all | Aktiv |
| BW02_Bewilligungs_Workflow_Step | bewilligungen-keywords.ts | [[DossierKomplett.spec.ts]], [[a08_BezugsPerson.spec.ts]], [[BW04_ZahlungsVerbindung.spec.ts]] | @kontakte, @bewilligung, @coreBusiness, @all | Aktiv |
| BW02b_Bewilligungs_Workflow_Step_V2 | bewilligungen-keywords.ts | [[a02b091011_Bedarfspruefung.spec.ts]], [[DossierKomplett.spec.ts]], [[BW03c_Verwendungsperiode_mitDokumenten.spec.ts]], [[BC02_BC04_Buchungen.spec.ts]] | @bedarfspruefung, @bewilligung, @coreBusiness, @all | Aktiv |
| BW03_Bewilligungs_WF_FreigabeVerwendungsPeriode | bewilligungen-keywords.ts | [[DossierKomplett.spec.ts]] | @coreBusiness, @all | Aktiv |
| BW03b_Bewilligungs_WF_FreigabeVerwendungsPeriode | bewilligungen-keywords.ts | [[a02b091011_Bedarfspruefung.spec.ts]], [[BC02_BC04_Buchungen.spec.ts]] | @bedarfspruefung, @buchhaltung, @all | Aktiv |
| BW03c_Bewilligungs_WF_FreigabeVerwendungsPeriode_mitDokumenten | rahmenbudget-keyword.ts | [[BW03c_Verwendungsperiode_mitDokumenten.spec.ts]] | @bewilligung, @keywordValidation, @all | Aktiv |
| BW04_ZahlungsVerbindung_Freigeben | klientshaft-keyword.ts | [[DossierKomplett.spec.ts]], [[BW04_ZahlungsVerbindung.spec.ts]] | @bewilligung, @coreBusiness, @all | Aktiv |
| BW04_ZahlungsVerbindung_Freigeben_OhneNavigation | klientshaft-keyword.ts | -- | -- | Nicht getestet |
| DO15_Glocke_Absprung | bewilligungen-keywords.ts | -- | -- | Nicht getestet |

## D0 -- Dossier

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| D01_Dossier_Eroeffnen | dossier-keyword.ts | [[DossierKomplett.spec.ts]], [[P01_P05_P10_P30_PersonCreation.spec.ts]] | @klient, @coreBusiness, @keywordValidation, @all | Aktiv |
| D01b_Dossier_eroeffnen_absprung | dossier-keyword.ts | [[D01b_DossierEroeffnenAbsprung.spec.ts]] | @dossier, @keywordValidation, @all | Aktiv |
| D03_Dossier_Suche | dossier-keyword.ts | -- | -- | Nicht getestet |

## DB -- DataBrowser

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| DB01_DataBrowser_aufrufen | dataBrowser-keyword.ts | [[DB01_DataBrowser.spec.ts]] | @keywordValidation, @wip | WIP |

## DO -- Dossieroperationen

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| DO04_Aufgabe_erfassen | aufgaben-keyword.ts | [[a03_Aufgaben_Small.spec.ts]], [[DossierKomplett.spec.ts]] | @aufgaben, @coreBusiness, @keywordValidation, @all | Aktiv |
| DO04b_Aufgabe_editieren | aufgaben-keyword.ts | [[a03_Aufgaben_Small.spec.ts]] | @aufgaben, @keywordValidation, @all | Aktiv |
| DO04c_Aufgabe_GUI | aufgaben-keyword.ts | [[a03_Aufgaben_Small.spec.ts]] | @aufgaben, @keywordValidation, @all | Aktiv |
| DO04d_Aufgaben_filtern_selektieren | aufgaben-keyword.ts | [[a03_Aufgaben_Small.spec.ts]] (auskommentiert) | @aufgaben, @keywordValidation | Auskommentiert |
| DO04e_zuAufgabe_Dokument_hinzufuegen | aufgaben-keyword.ts | [[a03_Aufgaben_Small.spec.ts]] (auskommentiert) | @aufgaben, @keywordValidation | Auskommentiert |
| DO11_Dossier_Search_Lupe | common-keyword.ts | [[DO11_DossierSearchLupe.spec.ts]], [[DossierKomplett.spec.ts]] | @dossier, @coreBusiness, @keywordValidation, @all | Aktiv |
| DO12_Dossieruebersicht_Zustaendigkeit_aendern | dossierubersicht-keyword.ts | [[DO12_Zustaendigkeit.spec.ts]] | @dossier, @keywordValidation, @all | Aktiv |
| DO12b_DossierMenge_Zustaendigkeit_aendern | dossierubersicht-keyword.ts | [[DO12b_MassenZustaendigkeit.spec.ts]] | @dossier, @keywordValidation, @all | WIP (test.skip) |
| DO12b_DossierMenge_Zustaendigkeit_aendern_TEST | dossierubersicht-keyword.ts | -- | -- | Nicht getestet |
| DO13_Dossier_pruefen_starten | dossierprufung-keyword.ts | [[DO14_DossierPruefen_Beanstandung.spec.ts]] | @dossier, @keywordValidation, @all | Aktiv |
| DO14_Dossier_pruefen_durchfuehren_mitBeanstandung | dossierprufung-keyword.ts | [[DO14_DossierPruefen_Beanstandung.spec.ts]] | @dossier, @keywordValidation, @all | Aktiv |
| DO16_Suche_Filtern_Anzahl | dossier-keyword.ts | [[DO16_SucheFiltern.spec.ts]] | @dossier, @keywordValidation, @all | Aktiv |

## DW -- Dossier-Wohnsituation

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| DW01_Dossier_Haushalt_pruefen | wohnsituation-keyword.ts | [[DW01_DW02_Wohnsituation.spec.ts]] | @wohnsituation, @keywordValidation, @all | Aktiv |
| DW02_Rahmenbudget_Wohnkosten_pruefen | rahmenbudget-keyword.ts | [[DW01_DW02_Wohnsituation.spec.ts]] | @wohnsituation, @keywordValidation, @all | Aktiv |

## FE -- Freiwillige Erwerbsintegration

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| FE01_FEV_BudgetPosition_New | freiwillige-keyword.ts | [[FE01_FE02_FE03_FEV.spec.ts]] | @erwerbsintegration, @keywordValidation, @all | Aktiv |
| FE02_FEV_Budget_Anzeige | freiwillige-keyword.ts | [[FE01_FE02_FE03_FEV.spec.ts]] | @erwerbsintegration, @keywordValidation, @all | Aktiv |
| FE03_FEV_Zahlungen_freigeben | freiwillige-keyword.ts | [[FE01_FE02_FE03_FEV.spec.ts]] | @erwerbsintegration, @keywordValidation, @all | Aktiv |

## H0 -- Haushalt / Dokumente

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| H01_Haushalt_Uebernehmen_Zustaendigkeit | dossier-keyword.ts | [[DossierKomplett.spec.ts]], [[P01_P05_P10_P30_PersonCreation.spec.ts]] | @klient, @coreBusiness, @keywordValidation, @all | Aktiv |
| H03_Dokumente_Filtern_Oeffnen | document-keyword.ts | [[H01_H03_H04_H07_Dokumente.spec.ts]] | @dokumente, @keywordValidation, @all | Aktiv |
| H04_Dokumente_ausVorlage_erstellen | document-keyword.ts | [[H01_H03_H04_H07_Dokumente.spec.ts]] | @dokumente, @keywordValidation, @all | Aktiv |
| H04c_Dokumente_ausVorlage_erstellen_Brief_anKlient | document-keyword.ts | [[H04c_Dokumente_ausVorlage_Brief_anKlient.spec.ts]] | @dokumente, @keywordValidation, @all | Aktiv |
| H04_Dokumente_ausVorlage_erstellen_IIS_Form | document-keyword.ts | [[DossierKomplett.spec.ts]], [[a06_DokuAusVorlage.spec.ts]] | @dokumente, @coreBusiness, @keywordValidation, @all | Aktiv |
| H07_Dokumente_Hochladen_Versionen | document-keyword.ts | [[H01_H03_H04_H07_Dokumente.spec.ts]] | @dokumente, @keywordValidation, @all | Aktiv |

## KBR -- Konfiguration

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| KBR0_Konfig_Benutzer_RollenRechteSetzen | konfig-keyword.ts | -- | -- | Nicht getestet |

## KG -- Kostengutsprache

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| KG01_Antrag_Kostengutsprache_Erfassen | rahmenbudget-keyword.ts | [[KG01_KG01b_KG02_Kostengutsprache.spec.ts]] | @kostengutsprache, @keywordValidation, @all | Aktiv |
| KG01b_Antrag_Kostengutsprache_Erfassen_mitDocument | rahmenbudget-keyword.ts | [[KG01_KG01b_KG02_Kostengutsprache.spec.ts]] | @kostengutsprache, @keywordValidation, @all | Aktiv |
| KG02_Antrag_Kostengutsprache_Bewilligen_WF | rahmenbudget-keyword.ts | [[KG01_KG01b_KG02_Kostengutsprache.spec.ts]] | @kostengutsprache, @keywordValidation, @all | Aktiv |

## KL -- Klientschaft

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| KL00_ErwerbssituationEinnahmen_erfassen | klientshaft-keyword.ts | -- | -- | Nicht getestet |
| KL01_Klientschaft_select | klientshaft-keyword.ts | [[a02b091011_Bedarfspruefung.spec.ts]], [[BW04_ZahlungsVerbindung.spec.ts]], [[BW03c_Verwendungsperiode_mitDokumenten.spec.ts]] | @bedarfspruefung, @bewilligung, @all | Aktiv |
| KL03_ErwerbsituationEinnahmen_Lohn_erfassen | klientshaft-keyword.ts | [[a02b091011_Bedarfspruefung.spec.ts]], [[BW03c_Verwendungsperiode_mitDokumenten.spec.ts]], [[BC02_BC04_Buchungen.spec.ts]], [[DossierKomplett.spec.ts]] | @bedarfspruefung, @bewilligung, @buchhaltung, @coreBusiness, @all | Aktiv |
| KL03b_ErwerbsituationEinnahmen_Lohn_Update | klientshaft-keyword.ts | [[KL03b_Lohn_Update.spec.ts]] | @[182984], @klient, @keywordValidation, @all | Aktiv (Kommentar: @wip) |
| KL03c_ErwerbsituationEinnahmen_EffektiverLohn_erfassen | rahmenbudget-keyword.ts | [[R01_R02_R03_Rahmenbudget.spec.ts]] (auskommentiert) | -- | Auskommentiert |
| KL03d_ErwerbsituationEinnahmen_HypEinkommen_Erfassen | klientshaft-keyword.ts | [[KL03d_HypEinkommen.spec.ts]] | @klient, @keywordValidation, @all | Aktiv |
| KL04_ErwerbsituationEinnahmen_AusbildungsLohn_erfassen | klientshaft-keyword.ts | [[KL04_KL05_KL06_KL07_KL08_KL09_Einnahmen.spec.ts]] | @klient, @keywordValidation, @all | Aktiv |
| KL05_ErwerbssituationEinnahmen_AHVErwachsen_erfassen | klientshaft-keyword.ts | [[KL04_KL05_KL06_KL07_KL08_KL09_Einnahmen.spec.ts]] | @klient, @keywordValidation, @all | Aktiv |
| KL06_ErwerbssituationEinnahmen_ArbeitsLosEntsch_erfassen | klientshaft-keyword.ts | [[KL04_KL05_KL06_KL07_KL08_KL09_Einnahmen.spec.ts]] | @klient, @keywordValidation, @all | Aktiv |
| KL07_ErwerbssituationEinnahmen_Kinderunterhalt_erfassen | klientshaft-keyword.ts | [[KL04_KL05_KL06_KL07_KL08_KL09_Einnahmen.spec.ts]] | @klient, @keywordValidation, @all | Aktiv |
| KL08_ErwerbssituationEinnahmen_IVErwachsen_erfassen | klientshaft-keyword.ts | [[KL04_KL05_KL06_KL07_KL08_KL09_Einnahmen.spec.ts]] | @klient, @keywordValidation, @all | Aktiv |
| KL09_ErwerbssituationEinnahmen_Kinderzulage_erfassen | klientshaft-keyword.ts | [[KL04_KL05_KL06_KL07_KL08_KL09_Einnahmen.spec.ts]] | @klient, @keywordValidation, @all | Aktiv |
| KL0X_ErwerbsituationEinnahmen_erfassen | klientshaft-keyword.ts | [[KL0X_Erwerbssituation_Beihilfen.spec.ts]], [[KL0X_Erwerbssituation_Erwerbseinkommen.spec.ts]] | @klient, @keywordValidation, @all | Aktiv |
| KL10_Krankenversicherungen_VVG_erfassen | klientshaft-keyword.ts | [[a04_Versicherungen.spec.ts]] | @bedarfspruefung, @keywordValidation, @all | Aktiv |
| KL11_Krankenversicherungen_KVG_erfassen | klientshaft-keyword.ts | -- | -- | Nicht getestet |
| KL11b_Krankenversicherungen_KVG_erfassen | klientshaft-keyword.ts | [[a04_Versicherungen.spec.ts]], [[KL13b_KV_Abtretung_beenden.spec.ts]] | @bedarfspruefung, @klient, @keywordValidation, @all | Aktiv |
| KL12_Krankenversicherungen_IPV_erfassen | klientshaft-keyword.ts | -- | -- | Nicht getestet |
| KL13_Krankenversicherungen_Abtretung_starten | klientshaft-keyword.ts | [[KL13b_KV_Abtretung_beenden.spec.ts]] | @klient, @keywordValidation, @all | Aktiv |
| KL13b_Krankenversicherungen_Abtretung_beenden | klientshaft-keyword.ts | [[KL13b_KV_Abtretung_beenden.spec.ts]] | @klient, @keywordValidation, @all | Aktiv (Kommentar: @wip) |
| KL20_Sorgerecht_erfassen | klientshaft-keyword.ts | [[KL20_KL30_Sorgerecht_Beziehungen.spec.ts]] | @klient, @keywordValidation, @all | Aktiv |
| KL30_Beziehungen_erfassen | klientshaft-keyword.ts | [[KL20_KL30_Sorgerecht_Beziehungen.spec.ts]] | @klient, @keywordValidation, @all | Aktiv |
| KL40_Vermoegen_Konto_erfassen | klientshaft-keyword.ts | [[KL40_KL50_Vermoegen_Schulden.spec.ts]] | @klient, @keywordValidation, @all | Aktiv |
| KL41_Vermoegen_Eigenheim_erfassen | klientshaft-keyword.ts | [[KL40_KL50_Vermoegen_Schulden.spec.ts]] | @klient, @keywordValidation, @all | Aktiv |
| KL41b_Vermoegen_Eigenheim_erfassen_doc | klientshaft-keyword.ts | [[KL4X_KL41b_Vermoegen.spec.ts]] | @klient, @keywordValidation, @all | Aktiv |
| KL42_Vermoegen_Auto_erfassen | klientshaft-keyword.ts | [[KL40_KL50_Vermoegen_Schulden.spec.ts]] | @klient, @keywordValidation, @all | Aktiv |
| KL4X_Vermoegen_erfassen | klientshaft-keyword.ts | [[KL4X_KL41b_Vermoegen.spec.ts]] | @klient, @keywordValidation, @all | Aktiv |
| KL50_Schulden_erfassen | klientshaft-keyword.ts | [[KL40_KL50_Vermoegen_Schulden.spec.ts]] | @klient, @keywordValidation, @all | Aktiv |

## KO -- Kontakte / Institutionen / Vorlagen

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| KO01_Institution_erfassen | institutionenstamm-keyword.ts | [[KO01_KO02_KO03_Institution.spec.ts]] | @kontakte, @keywordValidation, @all | Aktiv |
| KO02_Fachperson_erfassen | institutionenstamm-keyword.ts | [[KO01_KO02_KO03_Institution.spec.ts]] | @kontakte, @keywordValidation, @all | Aktiv |
| KO02b_Fachperson_loeschen | institutionenstamm-keyword.ts | [[KO01_KO02_KO03_Institution.spec.ts]] | @kontakte, @keywordValidation, @all | Aktiv |
| KO03_Vorlage_erfassen | vorlagen-keyword.ts | [[KO03_KO03b_Vorlage.spec.ts]] | @[183100], @wip | WIP |
| KO03b_Vorlage_loeschen | vorlagen-keyword.ts | [[KO03_KO03b_Vorlage.spec.ts]] | @[183100], @wip | WIP |
| KO03b_Vorlage_loeschen_IfExists | vorlagen-keyword.ts | [[KO03_KO03b_Vorlage.spec.ts]] | @[183100], @wip | WIP |

## L0 / M0 / SM0 -- Login / Logout / Common

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| L00_URLAventis | common-keyword.ts | (zahlreiche Tests) | -- | Aktiv |
| Stable_Login | common-keyword.ts | (zahlreiche Tests) | -- | Aktiv |
| Stable_LogoutAndLoginDiffAccount | common-keyword.ts | (zahlreiche Tests) | -- | Aktiv |
| GoTo_Dossier_With_Url | common-keyword.ts | (zahlreiche Tests) | -- | Aktiv |
| DO11_Dossier_Search_Lupe | common-keyword.ts | [[DO11_DossierSearchLupe.spec.ts]], [[DossierKomplett.spec.ts]] | @dossier, @coreBusiness, @all | Aktiv |
| M01_LoginMSOnline | common-keyword.ts | -- | -- | Nicht getestet (ersetzt durch Stable_Login) |
| M01b_LoginWallis | common-keyword.ts | -- | -- | Nicht getestet |
| M01c_LoginWallis2025 | common-keyword.ts | -- | -- | Nicht getestet |
| L03_LogoutAndLoginDiffAccount | common-keyword.ts | -- | -- | Nicht getestet (ersetzt durch Stable_LogoutAndLoginDiffAccount) |
| L03b_LogoutAndLoginDiffAccountVS | common-keyword.ts | -- | -- | Nicht getestet |
| L03c_LogoutAndLoginDiffAccountVS2025 | common-keyword.ts | -- | -- | Nicht getestet |
| L04_LogoutAndLoginDiffLanguage | common-keyword.ts | -- | -- | Nicht getestet |
| L10_Logout | common-keyword.ts | -- | -- | Nicht getestet |
| L05_Check_VersionNumber | common-keyword.ts | -- | -- | Nicht getestet |
| L06_Check_Support_Infos | common-keyword.ts | -- | -- | Nicht getestet |
| L07_Check_Fachhilfe_Documentation | common-keyword.ts | -- | -- | Nicht getestet |
| X01_Delete_BrowserCache | common-keyword.ts | -- | -- | Nicht getestet |
| A00_BrowserRefresh_F5 | common-keyword.ts | -- | -- | Nicht getestet |
| E01_Delay | common-keyword.ts | -- | -- | Nicht getestet |
| SM0_SetSlowMotion | common-keyword.ts | -- | -- | Nicht getestet |

## MAE -- Dokumenteneingang

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| MAE01_DokumenteingangUpload | document-keyword.ts | [[MAE01_MAE01b_Dokumenteingang_Upload.spec.ts]], [[MAE0X_MAE0Y_Dokumenteingang_Abfolge.spec.ts]], [[MAE02_Dokumenteingang_Freigabe.spec.ts]] | @dokumente, @keywordValidation, @all | Aktiv |
| MAE01b_DokumenteLoeschen | document-keyword.ts | [[MAE01_MAE01b_Dokumenteingang_Upload.spec.ts]], [[MAE0X_MAE0Y_Dokumenteingang_Abfolge.spec.ts]], [[MAE02_Dokumenteingang_Freigabe.spec.ts]] | @dokumente, @keywordValidation, @all | Aktiv |
| MAE02_Dokumenteingang_NachUpload_Zuweisen_Freigabe | document-keyword.ts | [[MAE02_Dokumenteingang_Freigabe.spec.ts]] | @dokumente, @keywordValidation, @all | Aktiv |
| MAE03_Dokumenteingang_NachUpload_Zuweisen_Lohnabrechnung | document-keyword.ts | -- | -- | Nicht getestet |
| MAE0X_Dokumenteingang_NachUpload_Zuweisen_AbfolgeStart | document-keyword.ts | [[MAE0X_MAE0Y_Dokumenteingang_Abfolge.spec.ts]] | @dokumente, @keywordValidation, @all | Aktiv |
| MAE0Y_Dokumenteingang_NachUpload_Zuweisen_AbfolgeNext | document-keyword.ts | [[MAE0X_MAE0Y_Dokumenteingang_Abfolge.spec.ts]] | @dokumente, @keywordValidation, @all | Aktiv |
| MAE10_Zahlungen_freigeben | zahlungen-keyword.ts | [[MAE10_Z01b_Zahlungen_GlobalView.spec.ts]] | @keywordValidation, @wip | WIP |
| MAE11_Rechnungen_freigeben | zahlungen-keyword.ts | -- | -- | Nicht getestet |

## MALI -- Zeiterfassung

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| MALI03_Zeit_erfassen | zieterfassung-keyword.ts | [[MALI03_Zeit.spec.ts]] | @aufgaben, @keywordValidation, @all | Aktiv |

## P0 / P1 / P2 / P3 -- Person

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| P01_Person_Search | dossier-keyword.ts | [[DossierKomplett.spec.ts]] | @coreBusiness, @all | Aktiv |
| P05_Person_Create_Manual_Complete | dossier-keyword.ts | [[DossierKomplett.spec.ts]], [[P01_P05_P10_P30_PersonCreation.spec.ts]] | @klient, @coreBusiness, @keywordValidation, @all | Aktiv |
| P10_Person_Communikation_Complete | dossier-keyword.ts | [[DossierKomplett.spec.ts]], [[P01_P05_P10_P30_PersonCreation.spec.ts]] | @klient, @coreBusiness, @keywordValidation, @all | Aktiv |
| P10b_Person_Communikation | klientshaft-keyword.ts | [[P10b_P19_Person.spec.ts]] | @klient, @keywordValidation, @all | Aktiv |
| P15_Person_Adress | dossier-keyword.ts | [[DossierKomplett.spec.ts]], [[P01_P05_P10_P30_PersonCreation.spec.ts]] | @klient, @coreBusiness, @keywordValidation, @all | Aktiv |
| P16_Person_AufenthaltsAdresseFrei | dossier-keyword.ts | [[P16_P17_Aufenthaltsadresse.spec.ts]] | @wohnsituation, @keywordValidation, @all | Aktiv |
| P17_Person_AufenthaltsAdresseInstitution | dossier-keyword.ts | [[P16_P17_Aufenthaltsadresse.spec.ts]] | @wohnsituation, @keywordValidation, @all | Aktiv |
| P19_Person_Personendaten_Update | klientshaft-keyword.ts | [[P10b_P19_Person.spec.ts]] | @klient, @keywordValidation, @all | Aktiv |
| P19b_Person_Bezugsperson_Stammdaten | umfeld-keyword.ts | -- | -- | Nicht getestet |
| P20_Person_ZahlungsVerbindung | dossier-keyword.ts | [[DossierKomplett.spec.ts]], [[P01_P05_P10_P30_PersonCreation.spec.ts]] | @klient, @coreBusiness, @keywordValidation, @all | Aktiv |
| P21_Person_ZahlungsVerbindung_Klienten | klientshaft-keyword.ts | [[P20_P21_P22_Zahlungsverbindung.spec.ts]] | @klient, @keywordValidation, @all | Aktiv |
| P22_Person_Ausbildung_Create | klientshaft-keyword.ts | [[P20_P21_P22_Zahlungsverbindung.spec.ts]] | @klient, @keywordValidation, @all | Aktiv |
| P30_Person_Uebernehmen | dossier-keyword.ts | [[DossierKomplett.spec.ts]], [[P01_P05_P10_P30_PersonCreation.spec.ts]] | @klient, @coreBusiness, @keywordValidation, @all | Aktiv |

## PH -- Prozesshandlungen (Journal, Ziele, Gewalt)

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| PH01_JournalEintrag_erfassen | ph-keyword.ts | [[a05_Journal_Small.spec.ts]], [[DossierKomplett.spec.ts]], [[PH01c_PH01d_JournalEintrag_Edit.spec.ts]] | @aufgaben, @coreBusiness, @keywordValidation, @all | Aktiv |
| PH01c_Journaleintrag_UeberDatei_erfassen | ph-keyword.ts | [[PH01c_PH01d_JournalEintrag_Edit.spec.ts]] | @aufgaben, @keywordValidation, @all | Aktiv |
| PH01d_Journal_Eintrag_editieren | ph-keyword.ts | [[PH01c_PH01d_JournalEintrag_Edit.spec.ts]] | @aufgaben, @keywordValidation, @all | Aktiv |
| PH03_HaueslicheGewalt_Meldung_erfassen | ph-keyword.ts | [[PH03_HaeuslicheGewalt.spec.ts]] | @keywordValidation, @wip | WIP |
| PH04_Ziele_erfassen | ph-keyword.ts | [[a07_Ziele.spec.ts]], [[DossierKomplett.spec.ts]], [[PH05b_PH07_Zielvereinbarung_Erweitert.spec.ts]], [[PH05b_Zielvereinbarung_mit_IIZ.spec.ts]] | @aufgaben, @coreBusiness, @keywordValidation, @all | Aktiv |
| PH05_Zielvereinbarung_ohneWorkflow_erfassen | ph-keyword.ts | -- | -- | Nicht getestet |
| PH05b_Zielvereinbarung_ohneWorkflow_erfassen_mit_IIZ | ph-keyword.ts | [[PH05b_Zielvereinbarung_mit_IIZ.spec.ts]], [[PH05b_PH07_Zielvereinbarung_Erweitert.spec.ts]] | @aufgaben, @keywordValidation, @all | Aktiv |
| PH07_Zielvereinbarung_Beurteilung | ph-keyword.ts | [[PH05b_PH07_Zielvereinbarung_Erweitert.spec.ts]] | @aufgaben, @keywordValidation, @all | Aktiv |

## R0 -- Rahmenbudget

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| R01_Rahmenbudget_Wohnkosten_Anpassen | rahmenbudget-keyword.ts | -- | -- | Nicht getestet (V2 wird verwendet) |
| R01_Rahmenbudget_Wohnkosten_Anpassen_V2 | rahmenbudget-keyword.ts | [[R01_R02_R03_Rahmenbudget.spec.ts]], [[DossierKomplett.spec.ts]], [[BC02_BC04_Buchungen.spec.ts]] | @rahmenbudget, @coreBusiness, @buchhaltung, @keywordValidation, @all | Aktiv |
| R02_Rahmenbudget_ZahlungsInfosAnpassen | rahmenbudget-keyword.ts | [[R01_R02_R03_Rahmenbudget.spec.ts]] | @rahmenbudget, @keywordValidation, @all | Aktiv |
| R03_RahmenBudget_Kennzahlen_pruefen | rahmenbudget-keyword.ts | [[R01_R02_R03_Rahmenbudget.spec.ts]] | @rahmenbudget, @keywordValidation, @all | Aktiv |
| R05_GBL_Rahmenbudget_anpassen_Folgeposition | rahmenbudget-keyword.ts | [[R05_GBL.spec.ts]] | @[184093], @rahmenbudget, @keywordValidation, @all | Aktiv |
| R06_Rahmenbudget_SpaltenEinAusblenden | rahmenbudget-keyword.ts | [[R06_Spalten.spec.ts]], [[AT_Rahmenbudget_Spalten_Ein_Ausblenden.spec.ts]] | @rahmenbudget, @keywordValidation, @acceptance, @all | Aktiv |
| R07_Einkommen_Freibetrag_anpassen | rahmenbudget-keyword.ts | [[R07_Freibetrag.spec.ts]] | @rahmenbudget, @keywordValidation, @all | Aktiv |
| R08_RahmenBudget_Rueckbehalt_erfassen | rahmenbudget-keyword.ts | [[R08_Rueckbehalt.spec.ts]] | @rahmenbudget, @keywordValidation, @all | Aktiv |
| R09_RahmenBudget_Wohnsituation_AnzeigenPruefen | rahmenbudget-keyword.ts | [[R09_Wohnsituation.spec.ts]] | @rahmenbudget, @keywordValidation, @all | Aktiv |
| R09b_RahmenBudget_Wohnsituation_AnzeigenPruefenKomplett | rahmenbudget-keyword.ts | -- | -- | Nicht getestet |
| R10_RahmenBudget_Monatsbudget_Pruefen | rahmenbudget-keyword.ts | [[R10_Monatsbudget.spec.ts]] | @keywordValidation, @wip | WIP |
| R11_RahmenBudget_KVGVVG_uebersicht_pruefen | rahmenbudget-keyword.ts | -- | -- | Nicht getestet |
| R12_RahmenBudget_KVGVVG_detail_pruefen | rahmenbudget-keyword.ts | -- | -- | Nicht getestet |
| R13_RahmenBudget_Darstellung_Pruefen | rahmenbudget-keyword.ts | [[R01_R02_R03_Rahmenbudget.spec.ts]] (auskommentiert) | -- | Auskommentiert |

## RE -- Rechnungen

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| RE01_Rechnung_DokEingang_Erfassen | erfassung-keyword.ts | [[RE01_RE02_RE03_Rechnungen.spec.ts]] | @rechnungen, @keywordValidation, @all | Aktiv |
| RE02_Rechnung_DokEingang_Bearbeiten | erfassung-keyword.ts | [[RE01_RE02_RE03_Rechnungen.spec.ts]] | @rechnungen, @keywordValidation, @all | Aktiv |
| RE03_Rechnung_Freigeben | erfassung-keyword.ts | [[RE01_RE02_RE03_Rechnungen.spec.ts]] | @rechnungen, @keywordValidation, @all | Aktiv |

## RV -- Rechtsverfolgung

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| RV00_Ermittlung_erfassen | RV-keyword.ts | [[RV00_RV01_RV02_RV02b_Ermittlung.spec.ts]] | @rechtsverfolgung, @keywordValidation, @all | Aktiv |
| RV01_Beschwerde_erstellen | RV-keyword.ts | [[RV00_RV01_RV02_RV02b_Ermittlung.spec.ts]] | @rechtsverfolgung, @keywordValidation, @all | Aktiv |
| RV01b_Beschwerde_erweitern | RV-keyword.ts | [[RV00_RV01_RV02_RV02b_Ermittlung.spec.ts]] | @rechtsverfolgung, @keywordValidation, @all | Aktiv |
| RV02_Auflagen_erfassen | RV-keyword.ts | [[RV00_RV01_RV02_RV02b_Ermittlung.spec.ts]] | @rechtsverfolgung, @keywordValidation, @all | Aktiv |
| RV02b_Auflagen_Folgeschritt | RV-keyword.ts | [[RV00_RV01_RV02_RV02b_Ermittlung.spec.ts]] | @rechtsverfolgung, @keywordValidation, @all | Aktiv |

## SL -- Situationsbedingte Leistungen

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| SL01_SituationsbedingteLeistung_erfassen | rahmenbudget-keyword.ts | [[SL01_SL03_SituationsbedingteLeistung.spec.ts]], [[SL02_SituationsbedingteLeistung.spec.ts]] | @kostengutsprache, @rahmenbudget, @keywordValidation, @all | Aktiv |
| SL02_SituationsbedingteLeistung_anpassen | rahmenbudget-keyword.ts | [[SL02_SituationsbedingteLeistung.spec.ts]] | @[184222], @rahmenbudget, @keywordValidation, @all | Aktiv |
| SL03_SituationsbedingteLeistung_imRahmenbudget_Anzeigen | rahmenbudget-keyword.ts | [[SL01_SL03_SituationsbedingteLeistung.spec.ts]] | @kostengutsprache, @keywordValidation, @all | Aktiv |

## U0 -- Umfeld / Bezugspersonen

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| U01_Bezugsperson_erfassen | umfeld-keyword.ts | [[U01_Bezugsperson.spec.ts]], [[a08_BezugsPerson.spec.ts]], [[DossierKomplett.spec.ts]] | @kontakte, @coreBusiness, @keywordValidation, @all | Aktiv |
| U01b_Bezugsperson_ZahlVerbindung_erfassen | umfeld-keyword.ts | [[U01_Bezugsperson.spec.ts]], [[a08_BezugsPerson.spec.ts]], [[DossierKomplett.spec.ts]] | @kontakte, @coreBusiness, @keywordValidation, @all | Aktiv |
| U01c_Bezugsperson_ZahlVerbindung_freigeben | umfeld-keyword.ts | [[U01_Bezugsperson.spec.ts]], [[a08_BezugsPerson.spec.ts]], [[DossierKomplett.spec.ts]] | @kontakte, @coreBusiness, @keywordValidation, @all | Aktiv |

## UM -- Umfeld / Institutionen

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| UM02_InstitutionFachperson_erfassen | umfeld-keyword.ts | [[UM02_UM03_InstitutionFachperson.spec.ts]] | @kontakte, @keywordValidation, @all | Aktiv |
| UM03_Institution_erfassen_details | umfeld-keyword.ts | [[UM02_UM03_InstitutionFachperson.spec.ts]] | @kontakte, @keywordValidation, @all | Aktiv |
| UM03b_Fachperson_erfassen_details | umfeld-keyword.ts | [[UM03b_Fachperson_Details.spec.ts]] | @kontakte, @keywordValidation, @all | Aktiv |
| UM04_Institution_Bearbeiten_Kontaktperson_update | umfeld-keyword.ts | -- | -- | Nicht getestet |
| UM05_Institution_Bearbeiten_Kontaktperson_hinzufuegen | umfeld-keyword.ts | -- | -- | Nicht getestet |
| UM06_Institution_Bearbeiten_Zahlungsverbindung_hinzufuegen | umfeld-keyword.ts | -- | -- | Nicht getestet |
| UM07_Institution_Bearbeiten_Zahlungsverbindung_update | umfeld-keyword.ts | -- | -- | Nicht getestet |

## WO -- Wohnsituation

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| WO30_Wohnsituation_Haushalt_Person_Hinzufuegen | wohnsituation-keyword.ts | [[WO30_WO31_WO32_WO33_Wohnsituation.spec.ts]], [[DossierKomplett.spec.ts]], [[KL0X_Erwerbssituation_Beihilfen.spec.ts]] | @wohnsituation, @coreBusiness, @klient, @keywordValidation, @all | Aktiv |
| WO31_Wohnsituation_Haushalt_PersonEn_entfernen | wohnsituation-keyword.ts | [[WO30_WO31_WO32_WO33_Wohnsituation.spec.ts]] | @wohnsituation, @keywordValidation, @all | Aktiv |
| WO32_Wohnsituation_Haushalt_Wohnung_anpassen | wohnsituation-keyword.ts | [[WO30_WO31_WO32_WO33_Wohnsituation.spec.ts]] | @wohnsituation, @keywordValidation, @all | Aktiv |
| WO32_01b_Wohnsituation_Haushalt_Wohnung_anpassen | wohnsituation-keyword.ts | (zahlreiche Tests via Workflow) | @rahmenbudget, @wohnsituation, @all | Aktiv |
| WO32b_Wohnsituation_Wohnung_neuErfassenKopie | wohnsituation-keyword.ts | -- | -- | Nicht getestet |
| WO33_Wohnsituation_Haushalt_DateienHochladen | wohnsituation-keyword.ts | [[WO30_WO31_WO32_WO33_Wohnsituation.spec.ts]] | @wohnsituation, @keywordValidation, @all | Aktiv |

## WSH -- Wirtschaftliche Sozialhilfe

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| WSH04_Rueckforderung_erfassen_persoenlich | wsh-keyword.ts | [[WSH04_WSH06_Rueckforderung.spec.ts]], [[WSH_Consolidated.spec.ts]] | @zahlungen, @keywordValidation, @all | Aktiv |
| WSH04b_Rueckforderung_erfassen_persoenlich_missbrauch | wirtschaftlicheSozialhilfe-keyword.ts | [[WSH_Consolidated.spec.ts]] | @zahlungen, @keywordValidation, @all | Aktiv |
| WSH05_Haftung_Sozialhilfeschuld_Bearbeiten | wsh-keyword.ts | [[WSH05_Haftung.spec.ts]], [[DossierKomplett.spec.ts]] | @zahlungen, @coreBusiness, @keywordValidation, @all | Aktiv |
| WSH06_Kontoauszug_Sozialhilfeschuld_Berechnen | wsh-keyword.ts | [[WSH04_WSH06_Rueckforderung.spec.ts]], [[WSH_Consolidated.spec.ts]] | @zahlungen, @keywordValidation, @all | Aktiv |
| WSH08_Kontoauszug_Sozialhilfeschuld_Bescheinigen | wsh-keyword.ts | [[WSH08_Sozialhilfeschuld.spec.ts]], [[WSH_Consolidated.spec.ts]] | @zahlungen, @keywordValidation, @all | Aktiv |
| WSH08b_Kontoauszug_Sozialhilfeschuld_Buchhaltung | wsh-keyword.ts | [[WSH08_Sozialhilfeschuld.spec.ts]] | @zahlungen, @keywordValidation, @all | Aktiv |
| WSH09_Unterstuetzung_ende_UE | wsh-keyword.ts | [[WSH09_WSH10_Unterstuetzung_Weiterverrechnung.spec.ts]], [[WSH_Consolidated.spec.ts]] | @zahlungen, @keywordValidation, @all | Aktiv |
| WSH10_Weiterverrechnung | wsh-keyword.ts | [[WSH09_WSH10_Unterstuetzung_Weiterverrechnung.spec.ts]], [[WSH_Consolidated.spec.ts]] | @zahlungen, @keywordValidation, @all | Aktiv |
| WSH20_Vermoegensverzehr_erfassen | wirtschaftlicheSozialhilfe-keyword.ts | [[WSH_Consolidated.spec.ts]] | @zahlungen, @keywordValidation, @all | Aktiv |
| WSH99_Zahlungen_AnzahlPruefen | zahlungen-keyword.ts | [[WSH99_Zahlungen_AnzahlPruefen.spec.ts]] | @zahlungen, @keywordValidation, @all | Aktiv |

## Z0 -- Zahlungen

| Keyword | Keyword-Datei | Test-Datei(en) | Tags | Status |
|---------|--------------|----------------|------|--------|
| Z01_WSH_Zahlungen_Freigeben | zahlungen-keyword.ts | [[DossierKomplett.spec.ts]], [[WSH99_Zahlungen_AnzahlPruefen.spec.ts]], [[BC02_BC04_Buchungen.spec.ts]] | @zahlungen, @coreBusiness, @buchhaltung, @all | Aktiv |
| Z01_WSH_Zahlungen_Freigeben_NoCheck | zahlungen-keyword.ts | [[a02b091011_Bedarfspruefung.spec.ts]], [[BU01_BU02_Zahlungen.spec.ts]] | @bedarfspruefung, @zahlungen, @all | Aktiv |
| Z01b_WSH_Zahlungen_Freigeben_meinAventis | zahlungen-keyword.ts | [[MAE10_Z01b_Zahlungen_GlobalView.spec.ts]] | @keywordValidation, @wip | WIP |

---

## Zusammenfassung

| Kategorie | Anzahl |
|-----------|--------|
| Keywords total | ~191 |
| Aktiv getestet | ~140 |
| WIP / test.skip | ~10 |
| Auskommentiert | ~4 |
| Nicht getestet | ~37 |

Siehe auch: [[wip-tests]], [[missing-keywords]]
