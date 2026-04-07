# Workflow-Ketten (Prerequisite Chains)

Dieses Dokument beschreibt die vollstaendigen Voraussetzungsketten fuer alle Workflows in Aventis. Jeder Schritt listet die benoetigte [[user-roles|Rolle]], das Keyword und ob ein API-Shortcut verfuegbar ist.

---

## Dossier-Erstellung

### Variante A: API (empfohlen, ~100ms)

```
Sozialarbeiterin eingeloggt (via Stable_Login)
  └─> createDossierViaApiOnly(request, commonKeyword, page, seed, uniqueId)
        ├─ Erstellt Person mit AHV-Nummer
        ├─ Erstellt Dossier mit Bezeichnung
        └─ Navigiert zum Dossier
```

| Schritt | Rolle | Code | API? |
|---------|-------|------|------|
| Login | Sozialarbeiterin | `Stable_Login(TestUsers.SOZIALARBEITERIN_1A)` | -- |
| Dossier erstellen | Sozialarbeiterin | `createDossierViaApiOnly()` | Ja |

### Variante B: GUI (legacy, ~5min)

```
L00_URLAventis
  └─> Stable_Login (Sozialarbeiterin)
        └─> P05_Person_Create_Manual_Complete
              └─> P10_Person_Communikation_Complete
                    └─> P15_Person_Adress
                          └─> P20_Person_ZahlungsVerbindung
                                └─> P30_Person_Uebernehmen
                                      └─> H01_Haushalt_Uebernehmen_Zustaendigkeit
                                            └─> D01_Dossier_Eroeffnen
```

Im Code: `generateDossier()` aus `libs/workflows/guiDossierWorkflow.ts`.

### Variante C: API mit Zahlungsverbindung

```
Sozialarbeiterin eingeloggt
  └─> createDossierViaApiOnlyWithPaymentConnection()
        ├─ Erstellt Dossier + Person + IBAN via API
        ├─ BW04 "Anfragen" (Sozialarbeiterin)
        ├─ Wechsel zu Sachbearbeiterin
        ├─ BW04 "Bewilligen" (Sachbearbeiterin)
        └─ Wechsel zurueck zu Sozialarbeiterin
```

---

## WSH-Setup (Komplettkette)

Die vollstaendige Kette fuer eine aktive WSH-Leistung mit Zahlungsfaehigkeit:

```
1. Dossier erstellen
   └─> 2. Zahlungsverbindung erfassen + bewilligen
         └─> 3. Wohnsituation erfassen
               └─> 4. Erwerbssituation erfassen
                     └─> 5. Bedarfspruefung durchfuehren
                           └─> 6. Bewilligungsworkflow (4 Schritte)
                                 └─> 7. Verwendungsperiode aktiv
                                       └─> 8. Zahlungen moeglich
```

### Detailliert:

| # | Schritt | Rolle | Keyword / API | API-Shortcut? |
|---|---------|-------|---------------|---------------|
| 1 | Dossier erstellen | Sozialarbeiterin | `createDossierViaApiOnly()` | Ja |
| 2a | ZV anfragen | Sozialarbeiterin | `BW04_ZahlungsVerbindung_Freigeben` ("Anfragen") | Nein |
| 2b | ZV bewilligen | Sachbearbeiterin | `BW04_ZahlungsVerbindung_Freigeben` ("Bewilligen") | Nein |
| 3 | Wohnsituation | Sozialarbeiterin | `WO32_Wohnsituation_Haushalt_Wohnung_anpassen` | Nein |
| 4 | Erwerbssituation | Sozialarbeiterin | `KL03_ErwerbsituationEinnahmen_Lohn_erfassen` | `createErwerbssituationViaApi()` |
| 5 | Bedarfspruefung | Sozialarbeiterin | `A01_AnspruchPruefung_Bedarfspruefung` | `createBedarfspruefungViaApi()` |
| 6a | Leistungsentscheid | Sozialarbeiterin | `BW01_Bewilligungs_Workflow_LeistungsEntscheid` | Nein |
| 6b | Pruefung OK | Sachbearbeiterin | `BW02b_Bewilligungs_Workflow_Step_V2` ("Pruefung OK") | `setBewilligungsworkflowStepViaApi()` |
| 6c | Bewilligen | Gemeinde-MA | `BW02b_Bewilligungs_Workflow_Step_V2` ("Bewilligen") | `setBewilligungsworkflowStepViaApi()` |
| 6d | VP freigeben | Sachbearbeiterin | `BW03b_Bewilligungs_WF_FreigabeVerwendungsPeriode` | Nein |
| 7 | Zahlungen freigeben | Sachbearbeiterin | `Z01_WSH_Zahlungen_Freigeben` | Nein |

### Abkuerzung: Combined Workflow

Fuer Tests, die ein funktionierendes Rahmenbudget brauchen, gibt es den kombinierten Workflow:
```typescript
generateDossierWithErwerbssituationAndWsh()
```
Dieser erstellt Dossier + Erwerbssituation + WSH-Leistung via API (Schritte 1, 4, 5 teilweise).

---

## Bewilligungsworkflow (Detail)

```
Sozialarbeiterin
  └─> BW01_Bewilligungs_Workflow_LeistungsEntscheid
        ├─ lEvonDate: DateHelper.getFirstOfMonthString()
        ├─ lEbisDate: DateHelper.getEndOfMonthString(6)
        └─ checkStatus: "Angefragt"

Sachbearbeiterin (Rollenwechsel via Stable_LogoutAndLoginDiffAccount)
  └─> BW02b_Bewilligungs_Workflow_Step_V2
        ├─ dossier: uniqueDossiertId
        ├─ buttonName: "Prüfung OK"
        └─ checkEntscheid: "Prüfung OK"

Gemeinde-MA (Rollenwechsel)
  └─> BW02b_Bewilligungs_Workflow_Step_V2
        ├─ dossier: uniqueDossiertId
        ├─ buttonName: "Bewilligen"
        └─ checkEntscheid: "Bewilligt"

Sachbearbeiterin (Rollenwechsel)
  └─> BW03b_Bewilligungs_WF_FreigabeVerwendungsPeriode
        ├─ verwendungPeriode: <Periodenbezeichnung>
        └─ status: "Freigegeben"
```

**API-Alternative**: Schritte BW02b koennen via `setBewilligungsworkflowStepViaApi()` abgekuerzt werden mit den Werten `"PruefungOk"` und `"Bewilligt"`.

---

## Rechnungsworkflow

Voraussetzung: Kompletter [[#WSH-Setup (Komplettkette)|WSH-Setup]] muss abgeschlossen sein.

```
Sozialarbeiterin
  └─> RE01_Rechnung_DokEingang_Erfassen
        ├─ document: QR-Rechnung PDF aus testfiles/documents/
        ├─ leistung: "WSH"  ← ZWINGEND! Ohne das kein Invoice-Record
        ├─ klient: TestPersons.FIRST_PERSON.fullName
        └─ dossierBezeichnung: uniqueDossiertId

Buchhalter (Rollenwechsel)
  └─> RE02_Rechnung_DokEingang_Bearbeiten
        ├─ dossier: uniqueDossiertId
        ├─ zahlEmpfaenger: TestCompanies.INKASSODIENST
        ├─ rechNummer: <Rechnungsnummer>
        ├─ referenzNummer: <Referenznummer>
        └─ statusSet: "Erfasst"

Sozialarbeiterin (Rollenwechsel)
  └─> RE03_Rechnung_Freigeben
        ├─ dossier: uniqueDossiertId
        ├─ betrag: <Betrag>
        └─ statusNeu: "Freigeben"
```

**Kritischer Hinweis**: RE01 MUSS `leistung: "WSH"` uebergeben. Ohne diesen Parameter wird kein Rechnungs-Record erstellt und RE02 schlaegt fehl.

---

## Zahlungsverbindung bewilligen

```
Sozialarbeiterin (im Dossier)
  └─> BW04_ZahlungsVerbindung_Freigeben_OhneNavigation
        ├─ klientschaft: TestPersons.FIRST_PERSON.fullName
        ├─ buttonBewilligung: "Anfragen"
        └─ checkStatus: "In Bearbeitung"

Sachbearbeiterin (Rollenwechsel)
  └─> KL01_Klientschaft_select (Navigation zum Klient)
        └─> BW04_ZahlungsVerbindung_Freigeben
              ├─ buttonBewilligung: "Bewilligen"
              └─ checkStatus: "Bewilligt"
```

Im Code als fertige Funktion: `addZahlungsVerbindung()` aus `libs/workflows/paymentConnectionWorkflow.ts`.

---

## Dossierpruefung

```
Sozialarbeiterin (Dossier muss existieren)
  └─> Rollenwechsel zu Kantons-MA

Kantons-MA
  └─> DO13_Dossier_pruefen_starten
        └─ dossier: uniqueDossiertId

  └─> DO14_Dossier_pruefen_durchfuehren_mitBeanstandung (optional)
```

**Constraint**: Kantons-MA kann NICHT sich selbst als Pruefer waehlen.

---

## FEV-Workflow (Foerder- und Eingliederungsvereinbarung)

```
Sozialarbeiterin
  └─> A02_AnspruchPruefung_Bedarfspruefung_FEV
        └─> FE01_FEV_BudgetPosition_New
              └─> FE02_FEV_Budget_Anzeige (Validierung)
                    └─> FE03_FEV_Zahlungen_freigeben
```

---

## Kostengutsprache-Workflow

Voraussetzung: WSH-Setup mit aktiver Verwendungsperiode.

```
Sozialarbeiterin
  └─> KG01_Antrag_Kostengutsprache_Erfassen
        (oder KG01b_Antrag_Kostengutsprache_Erfassen_mitDocument)

Sachbearbeiterin (Rollenwechsel)
  └─> KG02_Antrag_Kostengutsprache_Bewilligen_WF
```

---

## Decision Tree: "Was brauche ich als Voraussetzung?"

### Will ich Rahmenbudget-Keywords testen (R01-R09)?
→ Brauche: Dossier + Zahlungsverbindung + Wohnsituation + Erwerbssituation + Bedarfspruefung + Bewilligung + Verwendungsperiode (= kompletter WSH-Setup)

### Will ich Rechnungen testen (RE01-RE03)?
→ Brauche: Kompletter WSH-Setup + QR-Rechnung PDF in `testfiles/documents/`

### Will ich Zahlungen testen (Z01)?
→ Brauche: Kompletter WSH-Setup mit mindestens einer Rechnung oder Monatsbudget

### Will ich Dossierpruefung testen (DO13, DO14)?
→ Brauche: Dossier (minimal) + Kantons-MA Rolle

### Will ich Kostengutsprache testen (KG01, KG02)?
→ Brauche: Kompletter WSH-Setup

### Will ich Aufgaben testen (DO04)?
→ Brauche: Dossier (minimal)

### Will ich FEV testen (FE01-FE03)?
→ Brauche: Dossier + Zahlungsverbindung + FEV-spezifische Bedarfspruefung (A02)

Siehe auch: [[user-roles]] fuer die Rollenzuordnung, [[business-glossary]] fuer Fachbegriffe, [[calculation-rules]] fuer Systemwerte.
