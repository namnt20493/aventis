# Keyword Lookup

Kompaktes Nachschlagewerk aller Keywords.
Detail-Constraints: [[../03-Keywords/rahmenbudget-R01-R10]], [[../03-Keywords/rechnungen-RE01-RE03]], [[../03-Keywords/bewilligung-BW01-BW04]], [[../03-Keywords/bedarfspruefung-A01]], [[../03-Keywords/dossier-DO04-DO16]], [[../03-Keywords/wohnsituation-WO-DW]], [[../03-Keywords/klient-KL-P]], [[../03-Keywords/zahlungen-Z01-WSH]], [[../03-Keywords/dokumente-H-MAE]], [[../03-Keywords/aufgaben-PH-DO04]], [[../03-Keywords/common-login-nav]], [[../03-Keywords/buchhaltung-BC-AW]], [[../03-Keywords/erwerbsintegration-FE]], [[../03-Keywords/rechtsverfolgung-RV]], [[../03-Keywords/kontakte-KO-UM-U]], [[../03-Keywords/sonstige-keywords]]

---

## Login / Navigation (common-keyword.ts)

### Stable_Login
Params: username (string), password (string)
Verwendung: `await commonKeyword.Stable_Login(TestUsers.X.username, TestUsers.X.password)`

### Stable_LogoutAndLoginDiffAccount
Params: username (string), password (string)
Verwendung: Rollenwechsel im Test

### L00_URLAventis
Params: url (any)
Verwendung: `await commonKeyword.L00_URLAventis({ url: "/" })`

### M01_LoginMSOnline
Params: username, password, fullname, team

### M01b_LoginWallis
Params: username, password, fullname, team

### M01c_LoginWallis2025
Params: username, password, fullname, team

### L03_LogoutAndLoginDiffAccount
Params: username, password
Delegiert an Stable_LogoutAndLoginDiffAccount

### L03b_LogoutAndLoginDiffAccountVS
Params: username, password

### L03c_LogoutAndLoginDiffAccountVS2025
Params: username, password

### L04_LogoutAndLoginDiffLanguage
Params: language, username, password

### L05_Check_VersionNumber
Params: version

### L06_Check_Support_Infos
Params: linkName, linkContent

### L07_Check_Fachhilfe_Documentation
Params: group, soubGroup, topic, topicLink, lang

### L10_Logout
Params: keine

### DO11_Dossier_Search_Lupe
Params: searchDossierOrKlient, resultType

### E01_Delay
Params: Pause (ms)

### SM0_SetSlowMotion
Params: sloMo

### A00_BrowserRefresh_F5
Params: keine

### X01_Delete_BrowserCache
Params: keine (deaktiviert)

### GoTo_Dossier_With_Url
Params: dossierGuid (string)

### expectUserLogin
Params: fullname (string)

### verifyAddress
Params: strasse, houseNumber, ort

### verifyNameOfNewDossier
Params: firstname, lastname

---

## Dossier (dossier-keyword.ts)

### D01_Dossier_Eroeffnen
Params: dossierBezeichnung, eroeffnetAm, dossierSprache
Return: `Promise<string>` (Dossier-GUID)

### D01b_Dossier_eroeffnen_absprung
Params: name, vorname, geburtsTag, aHV, dossierName

### D03_Dossier_Suche
Params: name, vorname, AHVNummer, geburtsdatum, geschlecht, strasse, hausNr, ort

### DO16_Suche_Filtern_Anzahl
Params: dossierSuche, leistungArt, team, zustaendigSARSB, gemeinde, leistungArtStatus, anzahlTrefferBigger
CONSTRAINT: API-erstellte Dossiers haben keinen User -> zustaendigSARSB leer lassen

### H01_Haushalt_Uebernehmen_Zustaendigkeit
Params: zust_Gemeinde, zust_SozTeam, zust_SozMitarbeiter, zust_SachbTeam, zust_SachbMitarbeiter

### P01_Person_Search
Params: name, vorname, ahvNumber, geburtsdatum

### P05_Person_Create_Manual_Complete
Params: name, vorname, ahvNumber, language, zivilstand, zivilstandSeit, geburtsdatum, national, gender, aufenthalt, aufenGultigVon, aufenGultigBis

### P10_Person_Communikation_Complete
Params: mobile, privateNumber, email

### P15_Person_Adress
Params: zusatz, strasse, houseNumber, ort, validDate

### P16_Person_AufenthaltsAdresseFrei
Params: zusatz, strasse, hausnummer, PLZ_Ort, gueltigVon, gueltigBis, personZuweisen

### P17_Person_AufenthaltsAdresseInstitution
Params: institution, gueltigVon, gueltigBis, personZuweisen

### P20_Person_ZahlungsVerbindung
Params: iban

### P30_Person_Uebernehmen
Params: keine

---

## Dossierpruefung (dossierprufung-keyword.ts)

### DO13_Dossier_pruefen_starten
Params: dossier

### DO14_Dossier_pruefen_durchfuehren_mitBeanstandung
Params: dossier, zustTeam, pruefer, status, aufgabeTitel, falligDatum, zugMitarbeiter, kontrollPunkte
CONSTRAINT: Muss zu KANTONS_MA Rolle wechseln. Kann NICHT eingeloggten User als Pruefer waehlen.

---

## Dossieruebersicht (dossierubersicht-keyword.ts)

### DO12_Dossieruebersicht_Zustaendigkeit_aendern
Params: zustBereich, menuSelect, teamSozial, persSozial, teamSach, persSach, gueltigAb, eintrUeberschrX, offeneAufgUebertrX

### DO12b_DossierMenge_Zustaendigkeit_aendern
Params: aktuelleZust, neuZust, gueltigAb, eintrUeberschrX, offeneAufgUebertrX

---

## Aufgaben (aufgaben-keyword.ts)

### DO04_Aufgabe_erfassen
Params: aufgabenStatus, aufgabenTitel, faelligkeitDatum, zugewiesenAn, check

### DO04b_Aufgabe_editieren
Params: oldFaelligkeitDatum, oldAufgabenTitel, oldzugewiesenAn, zugewiesenAn, aufgabenTitel, status, prio, startDatum, notizen, checkList, verKnuepfung

### DO04c_Aufgabe_GUI
Params: dossierBezeichnung, zugewiesenAn, aufgabenTitel, statusDragTo

### DO04d_Aufgaben_filtern_selektieren
Params: dossier, zugewMitarbeiter, erstelltDurch, status, aufGabeTitel, datum, notiz

### DO04e_zuAufgabe_Dokument_hinzufuegen
Params: dossier, zugewMitarbeiter, erstelltDurch, status, aufGabeTitel, datum, dokumentName

---

## Bewilligung (bewilligungen-keywords.ts)

### BW01_Bewilligungs_Workflow_LeistungsEntscheid
Params: lEvonDate (string), lEbisDate (string), checkStatus (string)

### BW02_Bewilligungs_Workflow_Step
Params: dossier (string), buttonName (string), checkStatus (string)

### BW02b_Bewilligungs_Workflow_Step_V2
Params: dossier (string), buttonName (string), checkEntscheid (string)

### BW03_Bewilligungs_WF_FreigabeVerwendungsPeriode
Params: dossierInstitution (string), verwendungPeriode (string), status (string)

### BW03b_Bewilligungs_WF_FreigabeVerwendungsPeriode
Params: verwendungPeriode (string), status (string)

### BW03c_Bewilligungs_WF_FreigabeVerwendungsPeriode_mitDokumenten
Params: dossierKlient (string), verwendungPeriode (string), status (string), documents (string)
Datei: rahmenbudget-keyword.ts

### BW04_ZahlungsVerbindung_Freigeben
Params: dossierInstitution (string), klientschaft (string), buttonBewilligung (string), checkStatus (string)
Datei: klientshaft-keyword.ts

### BW04_ZahlungsVerbindung_Freigeben_OhneNavigation
Params: klientschaft (string), buttonBewilligung (string), checkStatus (string)
Datei: klientshaft-keyword.ts

### BW0X_Bewilligungs_Workflow_Filter
Params: dossierBezeichnung, institution, bearbeitbarDurch, typ, zustTeam, angefragtVon, statusBearbeitung, userSARSB, gemeinde, minAnzahl, select

### logoutAndLoginDiffAcc
Params: username (string), password (string), familie (string)
Legacy-Methode fuer Rollenwechsel

### DO15_Glocke_Absprung
Params: entryTitel (string), entryDate (string), entryTime (string), textPart (string), buttonName (string), nurUngelesen (string)
CONSTRAINT: Benoetigt bestehende System-Benachrichtigungen, nicht mit frischen Dossiers testbar.

---

## Bedarfspruefung (bedarfsprufung-keyword.ts)

### A01_AnspruchPruefung_Bedarfspruefung
Params: entscheidVom (string), begrundung (string), unterstutzungab (string)

### A01_1_AnspruchPruefung_Bedarfspruefung
Params: entscheidVom (string), begrundung (string), unterstutzungab (string)

### A01b_Zu_AnsprPruef_Bedarfspruef_ChecklistErgaenzen
Params: bedarfsPrDate (string), klient (string), thema (string), unterLagen (string), status (string), bemerkung (string)

### A01c_Zu_AnsprPruef_Bedarfspruef_ChecklistNichtRelevant
Params: bedarfsPrDate (string), klient (string), thema (string)

### A01d_Zu_AnsprPruef_Bedarfspruef_Checklist_als_WordExport
Params: bedarfsPrDate (string), klient (string), filterKategorie (string), filterStatus (string), filterBetrifft (string)

### A02_AnspruchPruefung_Bedarfspruefung_FEV
Params: dossier (string), entscheidVon (string), begruendung (string), unterstuetzungAb (string), kontoVerbindung (string)

---

## Rahmenbudget (rahmenbudget-keyword.ts)

### R01_Rahmenbudget_Wohnkosten_Anpassen
Params: ubernahmeWohnkostenCFH (number), uebernahmeWohnkostenVon (string), uebernahmeWohnkostenBis (string), uebernahemBegruendung (string)
Prereq: Kompletter WSH-Setup

### R01_Rahmenbudget_Wohnkosten_Anpassen_V2
Params: ubernahmeWohnkostenCFH (number), uebernahmeWohnkostenVon (string), uebernahmeWohnkostenBis (string), uebernahemBegruendung (string)

### R02_Rahmenbudget_ZahlungsInfosAnpassen
Params: zahlungsEmpfaengerCheck (string), gueltigMonatJahr (string), zahlungsEmpfaenger (string), periodizitaet (string), referenzNummer (string), mitteilung (string)

### R03_RahmenBudget_Kennzahlen_pruefen
Params: dossier (string), unterstBetrag (string), valutaTerminNext (string), valutaDatum (string)

### R05_GBL_Rahmenbudget_anpassen_Folgeposition
Params: dossier (string), klient (string), berGrundlage (string), geplantVon (string), gueltigBis (string), individuelleAnpa (string), begruendung (string), newTotal (string)

### R06_Rahmenbudget_SpaltenEinAusblenden
Params: dossier (string), spaltenName (string), pruefenVisibleTitel (string)

### R07_Einkommen_Freibetrag_anpassen
Params: dossier (string), klient (string), geplantVon (string), geplantBis (string), eFB (number), begruendung (string), totalNeu (number)
CONSTRAINT: Benoetigt sichtbare Erwerbseinkommen-Zeile im Rahmenbudget

### R08_RahmenBudget_Rueckbehalt_erfassen
Params: dossier (string), titel (string), monatBetrag (number), startMonat (string), endMonat (string), beschreibung (string), documents (string)
CONSTRAINT: Doc-Upload PFLICHT. startMonat MUSS Zukunft (DateHelper.getDaysFutureString(30))

### R09_RahmenBudget_Wohnsituation_AnzeigenPruefen
Params: dossier (string), checkUebernomWohnKosten (number)
CONSTRAINT: checkUebernomWohnKosten ist gedeckelter Richtlinienwert, NICHT der Mietbetrag

### R09b_RahmenBudget_Wohnsituation_AnzeigenPruefenKomplett
Params: dossier (string), checkWohntyp (string), checkAdresse (string), checkGueltigAb (string), checkWohnKosten (string), checkBewohnerListe (string), checkWohnSituation (string)

### R10_RahmenBudget_Monatsbudget_Pruefen
Params: dossier (string), checkAusgabenTotal (number), checkWeitereAbzuege (number), checkZusammenfassung (number)

### R11_RahmenBudget_KVGVVG_uebersicht_pruefen
Params: dossier (string), beschreibung (string), zahlungsEmpfaenger (string), bewilligung (string), betrag (number)

### R12_RahmenBudget_KVGVVG_detail_pruefen
Params: dossier, klient, gultigkeit, krankenkasse, versNummer, grundPraemie, IPV, praemieGAnspruch, kostenUeRichtlinie, franchise, periode, police, bemkerkung, zahlungsEmpf, zahlMethode, unfall

### R13_RahmenBudget_Darstellung_Pruefen
Params: dossier, checkColTitle, checkTotalAusgaben, checkTotalEinnahmen, checkTotalUnterstutzungsbetrag, checkRowTitle
DEPRECATED

### SL01_SituationsbedingteLeistung_erfassen
Params: klient (string), kontonummer (number), bezeichnung (string), leistungserbringer (string), value (number), datumVon (string), datumBis (string)

### SL02_SituationsbedingteLeistung_anpassen
Params: bezeichnung (string), betrifft (string), geplantVon (string), geplantVonNeu (string), geplantBis (string), betragNeu (number)

### SL03_SituationsbedingteLeistung_imRahmenbudget_Anzeigen
Params: dossier (string), category (string), element (string), leistungsErbringer (string), betragMonatlich (string), geplantVon (string), geplantBis (string)

### KG01_Antrag_Kostengutsprache_Erfassen
Params: dossier (string), level1 (string), level2 (string), level3 (string), titel (string), leistungserbringer (string), betrag (number), klient (string), gultigAb (string), verFallDatum (string), begruendung (string)

### KG01b_Antrag_Kostengutsprache_Erfassen_mitDocument
Params: wie KG01 + kostenVorDoc (string), bewilligtDoc (string), diverseDoc (string)

### KG02_Antrag_Kostengutsprache_Bewilligen_WF
Params: dossier (string), titel (string), betrag (number)

### DW02_Rahmenbudget_Wohnkosten_pruefen
Params: dossier (string), firstLevelBetrag (number), wohnKostenGemAnspruch (number), uebernommeneWohnkosten (number), totalWohnkosten (number)

### KL03c_ErwerbsituationEinnahmen_EffektiverLohn_erfassen
Params: dossier (string), klient (string), geplantVon (string), geplantBis (string), verwPeriode (string), betragEff (string), freiBetragEff (string)

---

## Rechnungen (erfassung-keyword.ts)

### RE01_Rechnung_DokEingang_Erfassen
Params: sozialDienstRegion, document, dossierBezeichnung, leistung, klient, docTitle, button
CONSTRAINT: MUSS leistung: "WSH" uebergeben. Ohne "WSH" wird kein Rechnungsrecord erstellt -> RE02 schlaegt fehl.
Prereq: QR-Rechnung PDF in testfiles/documents/, Rolle Sachbearbeiterin

### RE02_Rechnung_DokEingang_Bearbeiten
Params: dossier, zahlEmpfaenger, betrag, selBelDatum, selValutaDatum, statusSet, setBelDatum, rechNummer, referenzNummer (optional), kommentar, faellDatum, finanzierung, konto, betrifftPerson, zahlBetrag
Prereq: Rolle Buchhalter

### RE03_Rechnung_Freigeben
Params: dossier, zahlEmpfaenger, belDatum, valutaDatum, betrag, kommentar, statusNeu
Prereq: Rolle Sachbearbeiterin

---

## Wohnsituation (wohnsituation-keyword.ts)

### DW01_Dossier_Haushalt_pruefen
Params: dossier, zimmerWohnungTitel, strasseAdresse, Wohnkosten, beWohnerContains, gueltigAb

### WO30_Wohnsituation_Haushalt_Person_Hinzufuegen
Params: name, vorname, geburtsdatum, ahvNumber, personInhausltVon, inHauslt, ereignis

### WO31_Wohnsituation_Haushalt_PersonEn_entfernen
Params: dossier, klient, inHaushaltBis, inUeBis, ereignis

### WO32_Wohnsituation_Haushalt_Wohnung_anpassen
Params: vermieter, wohnungsgrosse, mietkosten, nebenkosten

### WO32_01b_Wohnsituation_Haushalt_Wohnung_anpassen
Params: vermieter, wohnungsgrosse, mietkosten, nebenkosten

### WO32b_Wohnsituation_Wohnung_neuErfassenKopie
Params: gultigVon, gultigBis, ohnePerson, mitPerson

### WO33_Wohnsituation_Haushalt_DateienHochladen
Params: dossier, docType, document

---

## Klientschaft (klientshaft-keyword.ts)

### KL00_ErwerbssituationEinnahmen_erfassen
Params: erwerbssituationType (string), zahlbarDurch (string), pensumm (string), betrag (string), gueltigVon (string), gueltigBis (string), checkbox (string)

### KL01_Klientschaft_select
Params: dossier (string), klientschaft (string)

### KL03_ErwerbsituationEinnahmen_Lohn_erfassen
Params: zahlbarDurch, pensumm, betrag, gueltigVon, gueltigBis, checkbox, migration

### KL03b_ErwerbsituationEinnahmen_Lohn_Update
Params: zahlbarDurch, pensumm, betrag, gueltigVonActual, gueltigVonNew, gueltigBis, checkbox13, docType, docPathName

### KL03d_ErwerbsituationEinnahmen_HypEinkommen_Erfassen
Params: dossier, klient, betrag, geplantVon, geplantBis, abTretung

### KL04_ErwerbsituationEinnahmen_AusbildungsLohn_erfassen
Params: zahlbarDurch, pensumm, betrag, gueltigVon, gueltigBis, checkbox, migration

### KL05_ErwerbssituationEinnahmen_AHVErwachsen_erfassen
Params: zahlbarDurch, betrag, gueltigVon, gueltigBis

### KL06_ErwerbssituationEinnahmen_ArbeitsLosEntsch_erfassen
Params: zahlbarDurch, betrag, gueltigVon, gueltigBis

### KL07_ErwerbssituationEinnahmen_Kinderunterhalt_erfassen
Params: zahlbarDurch, betrag, gueltigVon, gueltigBis

### KL08_ErwerbssituationEinnahmen_IVErwachsen_erfassen
Params: zahlbarDurch, betrag, gueltigVon, gueltigBis

### KL09_ErwerbssituationEinnahmen_Kinderzulage_erfassen
Params: zahlbarDurch, betrag, gueltigVon, gueltigBis

### KL0X_ErwerbsituationEinnahmen_erfassen
Params: dossier, klientschaft, topMenu, subMenu, zahlbarDurch, pensumm, checkbox, betrag, gueltigVon, gueltigBis, schweregrad, diverseDok

### KL10_Krankenversicherungen_VVG_erfassen
Params: klientschaft, Gueltigkeit, KKasse, VersNummer, GrundPraemie, ZahnInklusive, Franchise, Bemerkung

### KL11_Krankenversicherungen_KVG_erfassen
Params: Klientschaft, Gueltigkeit, KKasse, VersNummer, GrundPraemie, Unfall, Franchise, Bemerkung

### KL11b_Krankenversicherungen_KVG_erfassen
Params: klientschaft, gueltigkeit, kKasse, versNummer, grundPraemie, unfall, franchise, bemerkung, IPV, police

### KL12_Krankenversicherungen_IPV_erfassen
Params: Klientschaft, Gueltigkeit

### KL13_Krankenversicherungen_Abtretung_starten
Params: klientschaft, KVG, VVG

### KL13b_Krankenversicherungen_Abtretung_beenden
Params: klientschaft, KVG, VVG

### KL20_Sorgerecht_erfassen
Params: Klientschaft, Sorgerecht, Betroffener, GueltigVon, GueltigBis, Besuchsrecht

### KL30_Beziehungen_erfassen
Params: beziehung, von, gueltigVon, gueltigBis

### KL40_Vermoegen_Konto_erfassen
Params: bezeichnung, stichtag, betrag

### KL41_Vermoegen_Eigenheim_erfassen
Params: bezeichnung, stichtag, betrag, glaeubiger, maximalGrund

### KL41b_Vermoegen_Eigenheim_erfassen_doc
Params: bezeichnung, stichtag, betrag, glaeubiger, maximalGrund, divDoc

### KL42_Vermoegen_Auto_erfassen
Params: bezeichnung, stichtag, betrag

### KL4X_Vermoegen_erfassen
Params: vermogenType, bezeichnung, stichtag, betrag, glaeubiger, maximalGrund

### KL50_Schulden_erfassen
Params: schuldenTyp, bezeichnung, stichtag, betrag, divDokumente

### P10b_Person_Communikation
Params: dossier (string), klient (string), kanal (string), typ (string), numberOrEmail (string), mainChannel (string)

### P19_Person_Personendaten_Update
Params: dossier, klient, national, geschlecht, zivilstand, korrSprache, todesDatum, dokumente

### P21_Person_ZahlungsVerbindung_Klienten
Params: klient (string), IBAN (string), gueltigVon (string), gueltigBis (string), strasse (string), nummer (string), postfach (string), ort (string)

### P22_Person_Ausbildung_Create
Params: dossier (string), klient (string), hoechstAusbild (string), anzJahre (string)

---

## Zahlungen (zahlungen-keyword.ts)

### Z01_WSH_Zahlungen_Freigeben
Params: dossierInstitution (string), freigegebeneZahlungen (string)

### Z01_WSH_Zahlungen_Freigeben_NoCheck
Params: dossierInstitution (string)

### Z01b_WSH_Zahlungen_Freigeben_meinAventis
Params: dossier (string), totalbetrag (number)

### WSH99_Zahlungen_AnzahlPruefen
Params: dossier (string), ausgefuehrteZahlungen (string)

### MAE10_Zahlungen_freigeben
Params: freigeben (string), dossier (string)

### MAE11_Rechnungen_freigeben
Params: dossier (string), kommentar (string), rechnungsText (string)

---

## WSH Uebersicht (wsh-keyword.ts)

### WSH04_Rueckforderung_erfassen_persoenlich
Params: titel, rueckModus, datum, verJahrung, betrag, schuldner, monatlicherBetrag, erstmalig, dateiPfad, begruendung

### WSH05_Haftung_Sozialhilfeschuld_Bearbeiten
Params: haftungsType, haftungDurch, haftungVon, haftungBis, haftungFuer, person1, person2

### WSH06_Kontoauszug_Sozialhilfeschuld_Berechnen
Params: stichDatum, dossier, person, solidarSchuld, einzelSchuld, sozialHilfeSchuld

### WSH08_Kontoauszug_Sozialhilfeschuld_Bescheinigen
Params: stichDatum, dossier, klient, bescheinigungsArt

### WSH08b_Kontoauszug_Sozialhilfeschuld_Buchhaltung
Params: stichDatum, klient, sozialHilfeSchuld

### WSH09_Unterstuetzung_ende_UE
Params: dossier, letzerMonat, grundBFS

### WSH10_Weiterverrechnung
Params: dossier, gultVon, gultBis, weiterVerRechnArt, betrPerson

---

## Wirtschaftliche Sozialhilfe (wirtschaftlicheSozialhilfe-keyword.ts)

### WSH04b_Rueckforderung_erfassen_persoenlich_missbrauch
Params: dossier, titel, rueckModus, datum, verJahrung, betrag, schuldner, monatlicherBetrag, erstmalig, dateiPfad, begruendung

### WSH20_Vermoegensverzehr_erfassen
Params: dossier, klient, titel, datum, betrag, monatBetrag, startDatum, begrundung, divDokumente

---

## Dokumente (document-keyword.ts)

### H03_Dokumente_Filtern_Oeffnen
Params: searchDossierOrKlient, filterThema, stichWort, docType, person, zeitRaum, checkDokument

### H04_Dokumente_ausVorlage_erstellen
Params: vorlage, sprache, titel, thema, betrifft, instOderBezug, instOBezNamen, kontPerson, absender

### H04_Dokumente_ausVorlage_erstellen_IIS_Form
Params: vorlage, sprache, titel, klient, adresse

### H04c_Dokumente_ausVorlage_erstellen_Brief_anKlient
Params: vorlage, sprache, titel, klient, adresse, thema

### H07_Dokumente_Hochladen_Versionen
Params: klient, dokumente, docPath

### MAE01_DokumenteingangUpload
Params: sozialDienst, document

### MAE01b_DokumenteLoeschen
Params: all

### MAE02_Dokumenteingang_NachUpload_Zuweisen_Freigabe
Params: hinzugefuegtDurch, docType, dateiName, datum, newDocType, dossier, leistung, klient, docTitle, thema, verwendungsPeriode, status

### MAE03_Dokumenteingang_NachUpload_Zuweisen_Lohnabrechnung
Params: hinzugefuegtDurch, docType, dateiName, datum, newDocType, dossier, leistungHas, klient, docTitle, zahlbarDurch, einnahmePosHas, verwendungsPeriode, effektiverBetrag

### MAE0X_Dokumenteingang_NachUpload_Zuweisen_AbfolgeStart
Params: hinzugefuegtDurch, docType, dateiName, datum, docAblageort, dossier, leistungHas, klient, docTitle, newDocType, thema, rechnBetrag, verwendungsPeriode, status

### MAE0Y_Dokumenteingang_NachUpload_Zuweisen_AbfolgeNext
Params: docAblageort, dossier, leistungHas, klient, docTitle, newDocType, thema, rechnBetrag, verwendungsPeriode, status

---

## Journal / Ziele (ph-keyword.ts)

### PH01_JournalEintrag_erfassen
Params: titel, erstelltAm, jurnalArt, thema, relevantSanktion, interneVerwendung, teilnehmende, betroffene, notiz, dateiPfad

### PH01c_Journaleintrag_UeberDatei_erfassen
Params: documentPath, titel, teilNehmer, erstelltAm, jurnalArt, thema, relevantSanktion, interneVerwendung, teilnehmende, notiz, dateiPfad

### PH01d_Journal_Eintrag_editieren
Params: dossier, erstelltAm, titel, deleteBetroffene, adBetroffene, adDocument, atNameOrInstitution, noteTextAsFollows

### PH03_HaueslicheGewalt_Meldung_erfassen
Params: MeldungVom, Status, Beziehung, ArtDerGewalt, Opfer, Erlaeuterung, InfoOperH, OHVerlauf, OHKontaktAm

### PH04_Ziele_erfassen
Params: Titel, ZielVom, FristBis, Mitarbeiter, Klientschaft, Thema, Status, Beschreibung, ErwarteteHandlung, BeschaeftigungsMassnahme, Partner

### PH05_Zielvereinbarung_ohneWorkflow_erfassen
Params: dossier, bemerkung, zugeZielTitelSelect, unterzeichnZielvereinbarungPfad

### PH05b_Zielvereinbarung_ohneWorkflow_erfassen_mit_IIZ
Params: dossier, bemerkung, zugeZielTitelSelect, unterzeichnZielvereinbarungPfad, IIZTitel

### PH07_Zielvereinbarung_Beurteilung
Params: zielVereinbarungVon, fristVon, datei

---

## Buchhaltung (buchhaltung-keyword.ts, buchungsJournal-keyword.ts, kontoauszug-keyword.ts)

### BC02_Buchungen_importieren_Check
Params: bisDatum, dossier, zustGemeinde, buDate, buText, IBAN, sumBetrag

### BC04_BuchungsJournal_filtern
Params: buchaltung, zeitRaum, belegNummer, dossier, zeitRaumTyp, anzeigeDetail, konten, total

### BU01_ZahlungsAuftrag_Erstellen
Params: bisValutaDatum, dossier, checkZahlungTotal, buchhaltung, zustGemeinde

### BU02_Klient_SozialhilfeSchuld_anzeigen
Params: klient, dossier, stichDatum, zeilenTotal

### AW01_Kontoauszug
Params: leistungSuchen, suche, zeitRaumBis, zeitRaum, insOrKlient, zahlEmpfaenger, option, nurRueckerstBuchX, korrBuchInklOriginalX, totalAusgaben, totalEinahmen, kontoauszugHerunterladenX

### AW01b_Kontoauszug_DossierSicht
Params: dossier, zeitRaumVon, zeitRaumBis, zeitRaum, bezAnInstPerson, zahlEmpfaenger, option, totalAusgaben, totalEinahmen, kontoauszugHerunterladenX, downLoadName

---

## Erwerbsintegration / FEV (freiwillige-keyword.ts)

### FE01_FEV_BudgetPosition_New
Params: dossier, konto, beschreibung, betragMonatl, geplantAb, geplantBis, zahlMethode, zahlungsEmpfang, zahlungsVerbindung, periode, referenzScor, mitteilung

### FE02_FEV_Budget_Anzeige
Params: dossier, beschreibung, zahlEmpf, zahlMeth, konto, gueltigkeit, zahlVerbinudung, periode, betrag, total

### FE03_FEV_Zahlungen_freigeben
Params: dossier, ausgewaehltePosSum, saldoVorschau, clickAuswahlFreigeben

---

## Rechtsverfolgung (RV-keyword.ts)

### RV00_Ermittlung_erfassen
Params: dossier, betrifft, gueltigAb, Bemerkung, document

### RV01_Beschwerde_erstellen
Params: titel, zustaendig, beschFuehrer, vName, vVorname, vStrasseInklNr, vOrt, beschwerdeVon, grund, anfechtDatumEnscheid, zustellungDatumEnscheid, documente

### RV01b_Beschwerde_erweitern
Params: titel, instanz, status, beschwerdenummer, stellungNahme, datumVom, artDerEntsch, dokument1, zugestVom, entscheidOk, weiterzug, beschwerdeDoc, grund

### RV02_Auflagen_erfassen
Params: verfahren, status1, erstelltDurch, betroffenPersonen, titel, zugeteiltAn, erstelltAm, frist, status2, ausgangslage, auflagen, entscheid, sanktionen, weitereSanktionen, document

### RV02b_Auflagen_Folgeschritt
Params: seit, titelForSelect, typeOfNextStep, titel, sanktionVon, erstelltAm, sanktionBis, status, zugeteiltAn, ausgangslage, auflagen, entscheid, sanktionen, weitereSanktionen, document

---

## Kontakte / Stammdaten (institutionenstamm-keyword.ts)

### KO01_Institution_erfassen
Params: instName, namenZusatz, zusatz, strasse, hausNum, telNummer, email, ort, postfach, website, typisierung, gueltigVon, gueltigBis

### KO02_Fachperson_erfassen
Params: vorname, fachPersName, namenZusatz, zusatz, strasse, geschlecht, hausNum, telNummer, email, ort, postfach, website, typisierung, gueltigVon, gueltigBis

### KO02b_Fachperson_loeschen
Params: suche, gueltigVon, gueltigBis

---

## Vorlagen (vorlagen-keyword.ts)

### KO03_Vorlage_erfassen
Params: datei, vorlageBez, verwKontext, vorlageSprache, gueltigVon, gueltigBis, erlaueterung, dossierRegion

### KO03b_Vorlage_loeschen
Params: vorlageBez, verwKontext, vorlageSprache

### KO03b_Vorlage_loeschen_IfExists
Params: vorlageBez, verwKontext, vorlageSprache
Return: `Promise<boolean>`

---

## Umfeld (umfeld-keyword.ts)

### UM02_InstitutionFachperson_erfassen
Params: institution, kontaktPerson, Rolle

### UM03_Institution_erfassen_details
Params: name, strasse, hausNr, gueltigVon, gueltigBis, typisierung, tel, eMail, ort, kPName, kPVorname, kPTel, kPMobile, kPEmail, kPAbteilung, kPIBAN, iBANName, iBANStrasse, iBANhausNr, iBANPostfach, iBANOrt, iBANGultigVon, iBANGueltigBis

### UM03b_Fachperson_erfassen_details
Params: name, strasse, vorname, hausNr, gueltigVon, gueltigBis, tel, eMail, ort, typisierung, geschlecht, iBanNummer, iBANName, iBANStrasse, iBANhausNr, iBANPostfach, iBANOrt, iBANGultigVon, iBANGueltigBis

### UM04_Institution_Bearbeiten_Kontaktperson_update
Params: institution, plzOrt, oldName, vorName, nachName, telGeschaft, telMobile, eMail, abteilung

### UM05_Institution_Bearbeiten_Kontaktperson_hinzufuegen
Params: institution, plzOrt, vorName, nachName, telGeschaft, telMobile, eMail, abteilung

### UM06_Institution_Bearbeiten_Zahlungsverbindung_hinzufuegen
Params: institution, plzOrt, IBAN, vonDatum, bisDatum

### UM07_Institution_Bearbeiten_Zahlungsverbindung_update
Params: institution, plzOrt, titleBank, IBAN, vonDatum, bisDatum, divDocument

### U01_Bezugsperson_erfassen
Params: name, vorname, rolle, zusatz, strasse, hausNummer, Ort

### U01b_Bezugsperson_ZahlVerbindung_erfassen
Params: dossier, bezPerson, IBAN, gueltigVon, gueltigBis, strasse, nummer, postfach, ort, datei

### U01c_Bezugsperson_ZahlVerbindung_freigeben
Params: dossier, bezPerson

### P19b_Person_Bezugsperson_Stammdaten
Params: dossier, bezugsPerson, zusatz, telefonGeschaeft, emailPrivat, emailGeschaeft, strasse, hNummer, ort, beziehungRolle, beziehungsTyp, vonKlient, gueltVon, gueltBis

---

## Sonstige Keywords

### KBR0_Konfig_Benutzer_RollenRechteSetzen (konfig-keyword.ts)
Params: userName, role

### MALI03_Zeit_erfassen (zieterfassung-keyword.ts)
Params: dossier, dienstLeistung, datum, dauerHHMM, beschreibung

### AN01_Soforthilfe_erfassen (anspruchsprufung-keyword.ts)
Params: dossier, expectedErrorContains, klientschaft, betrag, Zahlungsverbindung

### AN02_Soforthilfe_in_RahmenbudgetPruefen (anspruchsprufung-keyword.ts)
Params: dossier, zahlungsArt, buchungsDatum

### DB01_DataBrowser_aufrufen (dataBrowser-keyword.ts)
Params: thema, fitlerName, fitlerValue, checkItemsEqualOrMore
