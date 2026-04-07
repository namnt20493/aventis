# Benutzerrollen

Alle Benutzerrollen im Aventis-Testsystem mit ihren Berechtigungen, Workflow-Zuordnungen und typischen Keyword-Verwendungen.

Quelle: `libs/constants/credentials.ts` (Konstante `TestUsers`)

---

## Sozialarbeiterin 1A

| Eigenschaft | Wert |
|-------------|------|
| Konstante | `TestUsers.SOZIALARBEITERIN_1A` |
| Username | `bern.sozialarbeiterin1a@diartis.ch` |
| Mitarbeiter-Name | `Bern Sozialarbeiterin 1A` (siehe `TestMitarbeiter`) |

### Berechtigungen
- Dossiers erstellen und verwalten
- Personen erfassen und Klientschaft verwalten
- Bedarfspruefungen durchfuehren (A01)
- Leistungsentscheide erstellen (BW01)
- Wohnsituation und Erwerbssituation erfassen
- Rahmenbudget einsehen und anpassen (R01-R09)
- Rechnungen erfassen (RE01) und freigeben (RE03)
- Kostengutsprachen erfassen (KG01)
- Aufgaben erstellen und bearbeiten (DO04)
- Situationsbedingte Leistungen erfassen (SL01, SL02)
- Rueckbehalte erfassen (R08)
- Rueckforderungen erfassen (WSH04)
- Zahlungsverbindungen anfragen (BW04 "Anfragen")

### Workflow-Beteiligung
- [[workflow-chains|Dossier-Erstellung]]: Hauptrolle
- [[workflow-chains|WSH-Setup]]: Schritte 1-6 (Dossier bis Bedarfspruefung)
- [[workflow-chains|Bewilligungsworkflow]]: BW01 (Leistungsentscheid erstellen)
- [[workflow-chains|Rechnungsworkflow]]: RE01 (Erfassen), RE03 (Freigeben)
- Standard-Login-Rolle fuer die meisten Tests

### Typische Keyword-Verwendung
```typescript
await commonKeyword.Stable_Login(
    TestUsers.SOZIALARBEITERIN_1A.username,
    TestUsers.SOZIALARBEITERIN_1A.password
);
```

---

## Sachbearbeiterin

| Eigenschaft | Wert |
|-------------|------|
| Konstante | `TestUsers.SACHBEARBEITERIN` |
| Username | `Bern.Sachbearbeiterin@diartis.ch` |
| Mitarbeiter-Name | `Bern Sachbearbeiterin` (siehe `TestMitarbeiter`) |

### Berechtigungen
- Leistungsentscheide pruefen (BW02b "Pruefung OK")
- Verwendungsperioden freigeben (BW03b)
- Zahlungsverbindungen bewilligen (BW04 "Bewilligen")
- Zahlungen freigeben (Z01)
- Kostengutsprachen bewilligen (KG02)

### Workflow-Beteiligung
- [[workflow-chains|Bewilligungsworkflow]]: BW02b Schritt 1 ("Pruefung OK"), BW03b (Verwendungsperiode freigeben)
- [[workflow-chains|Zahlungsverbindung]]: BW04 ("Bewilligen")
- [[workflow-chains|Rechnungsworkflow]]: Nicht direkt beteiligt (das macht Buchhalter)

### Typische Keyword-Verwendung
```typescript
await commonKeyword.Stable_LogoutAndLoginDiffAccount(
    TestUsers.SACHBEARBEITERIN.username,
    TestUsers.SACHBEARBEITERIN.password
);
await bewilligungenKeywords.BW02b_Bewilligungs_Workflow_Step_V2({
    dossier: uniqueDossiertId,
    buttonName: "Prüfung OK",
    checkEntscheid: "Prüfung OK"
});
```

---

## Gemeinde-MA (Gemeinde-Mitarbeiter)

| Eigenschaft | Wert |
|-------------|------|
| Konstante | `TestUsers.GEMEINDE_MA` |
| Username | `aventis-gemeinde-ma@diartis.ch` |

### Berechtigungen
- Leistungsentscheide bewilligen (BW02b "Bewilligen")
- Zweite Stufe im Bewilligungsworkflow

### Workflow-Beteiligung
- [[workflow-chains|Bewilligungsworkflow]]: BW02b Schritt 2 ("Bewilligen")

### Typische Keyword-Verwendung
```typescript
await commonKeyword.Stable_LogoutAndLoginDiffAccount(
    TestUsers.GEMEINDE_MA.username,
    TestUsers.GEMEINDE_MA.password
);
await bewilligungenKeywords.BW02b_Bewilligungs_Workflow_Step_V2({
    dossier: uniqueDossiertId,
    buttonName: "Bewilligen",
    checkEntscheid: "Bewilligt"
});
```

---

## Buchhalter

| Eigenschaft | Wert |
|-------------|------|
| Konstante | `TestUsers.BUCHHALTER` |
| Username | `Bern.Buchhalter@diartis.ch` |

### Berechtigungen
- Rechnungen bearbeiten (RE02)
- Buchungen importieren und pruefen (BC02)
- Zahlungslaeufe verwalten

### Workflow-Beteiligung
- [[workflow-chains|Rechnungsworkflow]]: RE02 (Rechnung bearbeiten, Rechnungsnummer/Referenznummer setzen)
- Buchungs-Workflows: BC02, BC04

### Typische Keyword-Verwendung
```typescript
await commonKeyword.Stable_LogoutAndLoginDiffAccount(
    TestUsers.BUCHHALTER.username,
    TestUsers.BUCHHALTER.password
);
await erfassungKeyword.RE02_Rechnung_DokEingang_Bearbeiten({
    dossier: uniqueDossiertId,
    zahlEmpfaenger: TestCompanies.INKASSODIENST,
    betrag: "500.00",
    statusSet: "Erfasst",
    rechNummer: "RE-001",
    referenzNummer: "REF-001",
    finanzierung: "WSH",
    konto: "Arztkosten"
});
```

---

## Amtsleiter

| Eigenschaft | Wert |
|-------------|------|
| Konstante | `TestUsers.AMTSLEITER` |
| Username | `aventis-test-aml@diartis.ch` |

### Berechtigungen
- Uebergeordnete Bewilligungskompetenz
- Finale Genehmigung bei Sonderfaellen
- Erweiterte Einsichtsrechte

### Workflow-Beteiligung
- Wird in Standard-Workflows nicht regulaer eingesetzt
- Relevant bei eskaliertem Bewilligungsworkflow oder Spezialfaellen

### Typische Keyword-Verwendung
```typescript
await commonKeyword.Stable_LogoutAndLoginDiffAccount(
    TestUsers.AMTSLEITER.username,
    TestUsers.AMTSLEITER.password
);
```

---

## Kantons-MA (Kantons-Mitarbeiter)

| Eigenschaft | Wert |
|-------------|------|
| Konstante | `TestUsers.KANTONS_MA` |
| Username | `aventis-kantons-ma@diartis.ch` |

### Berechtigungen
- Dossierpruefungen starten und durchfuehren (DO13, DO14)
- Aufsicht und Kontrolle
- Kann NICHT eigene Dossiers pruefen (anderer Pruefer erforderlich)

### Workflow-Beteiligung
- [[workflow-chains|Dossierpruefung]]: DO13 (Pruefung starten), DO14 (Pruefung mit Beanstandung)
- Nicht im regulaeren Bewilligungsworkflow

### Typische Keyword-Verwendung
```typescript
await commonKeyword.Stable_LogoutAndLoginDiffAccount(
    TestUsers.KANTONS_MA.username,
    TestUsers.KANTONS_MA.password
);
await dossierprufungKeyword.DO13_Dossier_pruefen_starten({
    dossier: uniqueDossiertId
});
```

**Constraint**: Kann nicht den aktuell eingeloggten User als Pruefer auswaehlen. Erfordert Rollenwechsel.

---

## Superuser

| Eigenschaft | Wert |
|-------------|------|
| Konstante | `TestUsers.SUPERUSER` |
| Username | `aventis-e2e_superuser_1@diartis.ch` |

### Berechtigungen
- Erweiterte Systemrechte
- Zugriff auf alle Bereiche
- Fuer spezielle Testszenarien reserviert

### Workflow-Beteiligung
- Nicht im regulaeren Testbetrieb eingesetzt
- Fuer Debugging und spezielle Datenkonfiguration

---

## Rollenuebersicht: Wer macht was?

| Aktion | Rolle | Keyword |
|--------|-------|---------|
| Dossier erstellen | Sozialarbeiterin | `createDossierViaApiOnly` / GUI |
| Bedarfspruefung | Sozialarbeiterin | `A01` / `createBedarfspruefungViaApi` |
| Leistungsentscheid | Sozialarbeiterin | `BW01` |
| Pruefung OK | Sachbearbeiterin | `BW02b` |
| Bewilligen | Gemeinde-MA | `BW02b` |
| Verwendungsperiode freigeben | Sachbearbeiterin | `BW03b` |
| Zahlungsverbindung anfragen | Sozialarbeiterin | `BW04` ("Anfragen") |
| Zahlungsverbindung bewilligen | Sachbearbeiterin | `BW04` ("Bewilligen") |
| Rechnung erfassen | Sozialarbeiterin | `RE01` |
| Rechnung bearbeiten | Buchhalter | `RE02` |
| Rechnung freigeben | Sozialarbeiterin | `RE03` |
| Zahlungen freigeben | Sachbearbeiterin | `Z01` |
| Dossierpruefung | Kantons-MA | `DO13`, `DO14` |
| Buchungen pruefen | Buchhalter | `BC02` |

Siehe auch: [[business-glossary]] fuer Erklaerung der Fachbegriffe, [[workflow-chains]] fuer die Reihenfolge der Schritte.
