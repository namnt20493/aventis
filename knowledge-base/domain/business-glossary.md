# Fachglossar Sozialhilfe

Zentrale Fachbegriffe der Aventis Sozialhilfe-Applikation mit Erklaerung und Bezug zum Testprojekt.

---

## Leistungen und Budgets

### WSH -- Wirtschaftliche Sozialhilfe
Die Hauptleistungsart in Aventis. Umfasst alle finanziellen Unterstuetzungsleistungen an Sozialhilfeempfaenger. Jedes Dossier mit aktiver Unterstuetzung hat eine WSH-Leistung, die ueber eine [[workflow-chains|Bedarfspruefung und Bewilligung]] aktiviert wird.

Im Code: `leistung: "WSH"` (z.B. bei RE01 zwingend erforderlich).

### GBL -- Grundbedarf Lebensunterhalt
Der monatliche Pauschalbetrag fuer den allgemeinen Lebensbedarf (Nahrung, Kleidung, etc.). Wird nach SKOS-Richtlinien berechnet und haengt von der Haushaltsgroesse ab. Siehe [[calculation-rules]] fuer die aktuellen Saetze.

Im Code: Keyword `R05_GBL_Rahmenbudget_anpassen_Folgeposition` passt den GBL an.

### Rahmenbudget
Das uebergeordnete Budget eines Dossiers, das alle bewilligten Positionen zusammenfasst: GBL, Wohnkosten, Krankenkasse, Einkommen, Freibetraege, situationsbedingte Leistungen. Wird pro Verwendungsperiode gefuehrt.

Im Code: `RahmenbudgetKeyword` (`libs/keywords/rahmenbudget-keyword.ts`), Keywords R01-R09.

### Monatsbudget
Die monatliche Abrechnung innerhalb einer Verwendungsperiode. Leitet sich vom Rahmenbudget ab und berechnet die effektive Auszahlung.

### Verwendungsperiode
Der Zeitraum, fuer den eine WSH-Leistung bewilligt ist. Wird ueber den Bewilligungsworkflow (BW03b) freigegeben. Jede Verwendungsperiode hat ein eigenes Rahmenbudget.

Im Code: Keyword `BW03b_Bewilligungs_WF_FreigabeVerwendungsPeriode`.

---

## Pruefungen und Workflows

### Bedarfspruefung (Anspruchspruefung)
Pruefung, ob eine Person Anspruch auf Sozialhilfe hat. Beruecksichtigt Einkommen, Vermoegen, Wohnsituation und Erwerbssituation. Ergebnis: WSH-Leistung wird erstellt oder abgelehnt.

Im Code: Keyword `A01_AnspruchPruefung_Bedarfspruefung` oder API `createBedarfspruefungViaApi()`.

### Bewilligungsworkflow
Mehrstufiger Genehmigungsprozess fuer WSH-Leistungen. Durchlaeuft mehrere [[user-roles|Benutzerrollen]]:
1. Sozialarbeiterin erstellt Leistungsentscheid (BW01)
2. Sachbearbeiterin prueft (BW02b "Pruefung OK")
3. Gemeinde-MA bewilligt (BW02b "Bewilligen")
4. Sachbearbeiterin gibt Verwendungsperiode frei (BW03b)

Siehe [[workflow-chains]] fuer die komplette Kette.

### Leistungsentscheid
Die formelle Verfuegung, dass eine WSH-Leistung gewaehrt wird. Wird von der Sozialarbeiterin erstellt (BW01) und danach im Bewilligungsworkflow genehmigt.

Im Code: Keyword `BW01_Bewilligungs_Workflow_LeistungsEntscheid`.

### Kostengutsprache
Bewilligung fuer einmalige oder wiederkehrende Sonderausgaben (z.B. Zahnarzt, Brille). Wird im Rahmenbudget unter einem eigenen Tab erfasst und durchlaeuft einen eigenen Bewilligungsworkflow.

Im Code: Keywords `KG01_Antrag_Kostengutsprache_Erfassen`, `KG02_Antrag_Kostengutsprache_Bewilligen_WF`.

### Situationsbedingte Leistung
Zusatzleistung fuer besondere Lebensumstaende (z.B. Diaetkosten, Umzugskosten). Wird im Rahmenbudget als eigene Position gefuehrt.

Im Code: Keywords `SL01_SituationsbedingteLeistung_erfassen`, `SL02_SituationsbedingteLeistung_anpassen`.

---

## Finanzen und Zahlungen

### Zahlungsverbindung
Bankverbindung (IBAN) eines Klienten. Muss erfasst und durch die Sachbearbeiterin bewilligt werden (BW04), bevor Zahlungen ausgefuehrt werden koennen.

Im Code: Workflow `addZahlungsVerbindung()`, Keyword `BW04_ZahlungsVerbindung_Freigeben`.

### Valuta (Valutadatum)
Das Wertstellungsdatum einer Zahlung -- der Tag, an dem der Betrag dem Empfaenger gutgeschrieben wird.

Im Code: Parameter `valutaDatum` in R03, RE03 und Zahlungs-Keywords.

### Periodizitaet
Die Haeufigkeit einer wiederkehrenden Zahlung: monatlich, quartalsweise, halbjaehrlich, jaehrlich.

Im Code: Parameter `periodizitaet` in R02, FE01.

### Rueckforderung
Formelle Forderung an den Klienten, bereits bezogene Sozialhilfe zurueckzuzahlen (z.B. bei Missbrauch oder nachtraeglich festgestelltem Einkommen/Vermoegen).

Im Code: Keywords `WSH04_Rueckforderung_erfassen_persoenlich`, `WSH04b_Rueckforderung_erfassen_persoenlich_missbrauch`.

### Rueckbehalt
Monatlicher Einbehalt aus der laufenden Unterstuetzung (z.B. fuer Krankenkassenpraemien oder Mietkaution). Wird im Rahmenbudget erfasst, benoetigt Dokumenten-Upload.

Im Code: Keyword `R08_RahmenBudget_Rueckbehalt_erfassen`. Startdatum muss in der Zukunft liegen.

---

## Personen und Organisation

### Dossier
Die zentrale Verwaltungseinheit in Aventis. Enthaelt einen oder mehrere Klienten, deren Haushaltssituation, Leistungen, Budgets und Zahlungen. Wird mit einer eindeutigen Bezeichnung identifiziert.

Im Code: `generateUniqueDossierId(seed)` fuer Testdaten, `createDossierViaApiOnly()` fuer API-Erstellung.

### Klient / Klientschaft
Die einzelne Person (Klient) bzw. die Gesamtheit aller Personen in einem Haushalt (Klientschaft). Jeder Klient hat AHV-Nummer, Adresse, Zahlungsverbindung.

Im Code: `TestPersons.FIRST_PERSON`, `TestPersons.SECOND_PERSON` etc. aus `@constants/testData`.

### Sozialarbeiterin
Hauptrolle in der Fallbearbeitung. Erstellt Dossiers, fuehrt Bedarfspruefungen durch, erstellt Leistungsentscheide. Siehe [[user-roles]] fuer Details.

### Sachbearbeiterin
Administrative Rolle. Prueft Leistungsentscheide, gibt Zahlungsverbindungen und Verwendungsperioden frei.

### Gemeinde-MA (Gemeinde-Mitarbeiter)
Bewilligende Instanz auf Gemeindeebene. Zweite Stufe im Bewilligungsworkflow.

### Buchhalter
Verantwortlich fuer Rechnungsbearbeitung (RE02) und Buchungsimporte (BC02).

### Amtsleiter
Uebergeordnete Genehmigungsinstanz. Finale Bewilligung bei hohen Betraegen oder Sonderfaellen.

### Kantons-MA (Kantons-Mitarbeiter)
Aufsichtsfunktion. Fuehrt Dossierpruefungen durch (DO13, DO14). Kann nicht eigene Dossiers pruefen.

---

## Dokumente und Rechnungen

### Dokumenteingang
Eingangskanal fuer externe Dokumente (Rechnungen, Belege, Formulare). Dokumente werden ueber die Sozialarbeiterin oder Sachbearbeiterin dem Dossier zugeordnet.

Im Code: Keyword `RE01_Rechnung_DokEingang_Erfassen`. Wichtig: Parameter `leistung: "WSH"` ist zwingend.

### FEV -- Foerder- und Eingliederungsvereinbarung
Vertrag zwischen Sozialdienst und Klient ueber Massnahmen zur beruflichen und sozialen Eingliederung. Hat eigenes Budget und eigene Zahlungen.

Im Code: Keywords `FE01_FEV_BudgetPosition_New`, `FE02_FEV_Budget_Anzeige`, `FE03_FEV_Zahlungen_freigeben`. Bedarfspruefung ueber `A02_AnspruchPruefung_Bedarfspruefung_FEV`.

---

## Weitere Begriffe

### Erwerbssituation
Erfassung der Einkommensverhaeltnisse eines Klienten (Lohn, Selbstaendigkeit, Rente). Voraussetzung fuer die Bedarfspruefung.

Im Code: Keyword `KL03_ErwerbsituationEinnahmen_Lohn_erfassen` oder API `createErwerbssituationViaApi()`.

### Wohnsituation
Erfassung der Wohnverhaeltnisse (Vermieter, Wohnungsgroesse, Mietkosten, Nebenkosten). System begrenzt uebernahmefahige Wohnkosten auf Richtlinienwerte.

Im Code: Keyword `WO32_Wohnsituation_Haushalt_Wohnung_anpassen`. Siehe [[calculation-rules]] fuer Caps.

### Haushalt
Die Gesamtheit aller Personen, die zusammen wohnen und wirtschaften. Die Haushaltsgroesse bestimmt GBL und Wohnkosten-Richtlinienwerte.

### Sozialdienst / Region
Die organisatorische Einheit, der ein Dossier zugeordnet ist (z.B. "Regionaler Sozialdienst Bern"). Im Code: `TestBuchhaltung.REGIONALER_SOZIALDIENST_BERN`.
