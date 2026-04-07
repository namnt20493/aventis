# Create Test Bundle
<!-- Agent: aventis-e2e-test-agent | Alles fuer neue Keyword-Driven Tests -->

## 1. Template (Copy-Paste)

```typescript
import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
// import { SpecificKeyword } from "@keywords/specific-keyword"; // <-- Fachbereichs-Keyword anpassen
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import * as DateHelper from "@utils/helpers/DateHelper";
import { TestUsers } from "@constants/credentials";

test(
    "KEYWORD1_KEYWORD2_Beschreibung",        // <-- Testname anpassen
    {
        tag: ["@[ADO_ID]", "@bereich", "@all"] // <-- Tags anpassen (@wip fuer instabile Tests)
    },
    async ({ page, seed, context, authenticatedRequest, testData }) => {
        // test.slow(); // <-- Einkommentieren bei Multi-User oder langen Workflows

        const commonKeyword = new CommonKeyword(page);
        // const specificKeyword = new SpecificKeyword(page); // <-- Fachbereichs-Keyword
        const uniqueDossiertId = sharedTestLogic.generateUniqueDossierId(seed);

        await test.step("L00_URLAventis", async () => {
            await commonKeyword.L00_URLAventis({ url: "/" });
        });

        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(
                TestUsers.SOZIALARBEITERIN_1A.username,
                TestUsers.SOZIALARBEITERIN_1A.password
            );
        });

        // API-Setup: Dossier erstellen (~100ms)
        await sharedTestLogic.createDossierViaApiOnly(
            authenticatedRequest, commonKeyword, page, seed, uniqueDossiertId
        );

        // Teststeps hier einfuegen
        await test.step("Schritt_Beschreibung", async () => {
            // await specificKeyword.KEYWORD({ param: value });
        });
    }
);
```

## 2. API-Setup Quick-Ref

| Methode | Wann | Signatur |
|---------|------|----------|
| `createDossierViaApiOnly()` | Dossier, Login bereits erfolgt | `(authenticatedRequest, commonKeyword, page, seed, uniqueId, includeSecondPerson?)` |
| `generateDossierViaApiWithPerson()` | Dossier + Login in einem Schritt | `(authenticatedRequest, commonKeyword, page, seed, uniqueId, context)` -- gibt `{ dossierId, personInDossierId }` |
| `createDossierViaApiOnlyWithPaymentConnection()` | Dossier + IBAN (fuer Zahlungen/Rechnungen) | `(authenticatedRequest, commonKeyword, page, seed, uniqueId, includeSecondPerson?)` |
| `createBedarfspruefungViaApi()` | WSH-Leistung / Rahmenbudget | `(authenticatedRequest, { dossierId, personInDossierId, bedarfspruefungId? }, page)` -- gibt `{ leistungWshId, bedarfspruefungId, leistungsentscheidId }` |
| `createErwerbssituationViaApi()` | Berufliche Laufbahn | `(authenticatedRequest, { personInDossierId }, page)` |
| `setBewilligungsworkflowStepViaApi()` | Bewilligungsschritt ueberspringen | `(authenticatedRequest, bewilligungsworkflowStepId, "Bewilligt"\|"PruefungOk"\|"Angefragt"\|"Abgelehnt", page)` |
| `generateDossierWithErwerbssituationAndWsh()` | Komplettes WSH-Setup (GUI-Workflow) | `(authenticatedRequest, commonKeyword, page, klientschaftKeyword, seed, uniqueId, context)` |

**Imports:**
```typescript
import * as sharedTestLogic from "@sharedTestsSteps/sharedTestLogicDossier";
import { createBedarfspruefungViaApi, createErwerbssituationViaApi, setBewilligungsworkflowStepViaApi } from "@utils/apiSetup";
```

## 3. Prerequisite-Chains (kompakt)

**Was will ich testen? -> Was brauche ich als Setup?**

| Ziel-Keyword | Voraussetzungskette |
|--------------|---------------------|
| Dossier-Keywords (DO11, DO12, DO16, DO04) | Dossier (minimal) |
| Dossierpruefung (DO13, DO14) | Dossier + Rollenwechsel zu KANTONS_MA |
| Bedarfspruefung (A01, A02) | Dossier + Klientschaft |
| Bewilligung (BW01, BW02b, BW03b) | Dossier + Bedarfspruefung + Rollen-Kette (siehe Sec 6) |
| Rahmenbudget (R01-R09) | Dossier + Erwerbssituation + Bedarfspruefung + Bewilligung + VP |
| Rechnungen (RE01-RE03) | Kompletter WSH-Setup + QR-Rechnung PDF, RE01 MUSS `leistung: "WSH"` |
| Zahlungen (Z01, BU01) | Kompletter WSH-Setup + Verwendungsperiode freigegeben |
| Kostengutsprache (KG01, KG02) | Kompletter WSH-Setup |
| FEV (FE01-FE03) | Dossier + Zahlungsverbindung + FEV-Bedarfspruefung (A02) |

**Bewilligungsworkflow-Kette (4 Schritte):**
```
Sozialarbeiterin: BW01_LeistungsEntscheid ("Angefragt")
  -> Sachbearbeiterin: BW02b ("Pruefung OK")
    -> Gemeinde-MA: BW02b ("Bewilligen")
      -> Sachbearbeiterin: BW03b (VP freigeben)
```

## 4. Konstanten Quick-Ref

### testData (Fixture aus `@libs/test-fixtures`)

Destructure `testData` aus der Testfunktion -- Container für alle Test-Daten. Sub-Property `persons` enthält realistische Schweizer Namen.

| Slot | Zugriff | Beschreibung |
|------|---------|-------------|
| `testData.persons.FIRST_PERSON` | `.name`, `.vorname`, `.fullName` | Erster Klient (männlich) |
| `testData.persons.SECOND_PERSON` | `.name`, `.vorname`, `.fullName` | Zweite Klientin (weiblich, gleicher Nachname) |
| `testData.persons.THIRD_PERSON` | `.name`, `.vorname`, `.fullName` | Drittes Kind (weiblich) |
| `testData.persons.FOURTH_PERSON` | `.name`, `.vorname`, `.fullName` | Viertes Kind (männlich) |

Alle Personen teilen denselben Nachnamen (Haushalt). Namen sind deterministisch via faker (gleicher Seed = gleiche Namen).

### TestUsers (`@constants/credentials`)

| Konstante | Rolle | Typische Aufgabe |
|-----------|-------|-----------------|
| `SOZIALARBEITERIN_1A` | Sozialarbeiterin | Dossier, Bedarfspruefung, Antraege |
| `SACHBEARBEITERIN` | Sachbearbeiterin | Erste Bewilligungsstufe, VP-Freigabe |
| `GEMEINDE_MA` | Gemeinde-MA | Zweite Bewilligungsstufe |
| `BUCHHALTER` | Buchhalter | Zahlungsfreigabe |
| `AMTSLEITER` | Amtsleiter | Finale Bewilligung |
| `KANTONS_MA` | Kantons-MA | Audits, Dossierpruefung |
| `SUPERUSER` | Superuser | Administrative Aufgaben |

Zugriff: `TestUsers.SOZIALARBEITERIN_1A.username` / `.password`

### Birthdays (`@constants/testData`)

| Konstante | Wert |
|-----------|------|
| `Birthdays.ADULT_1` | `"01.01.1980"` |
| `Birthdays.ADULT_2` | `"01.01.1982"` |
| `Birthdays.KID_1` | `"01.01.2015"` |
| `Birthdays.KID_2` | `"01.01.2018"` |

### TestCompanies (`@constants/testData`)

| Konstante | Wert |
|-----------|------|
| `TestCompanies.BKW` | `"BKW Energie AG"` |
| `TestCompanies.INKASSODIENST` | `"Inkassodienst"` |
| `TestCompanies.GRABER_IMMOBILIEN` | `"Graber Immobilien"` |
| `TestCompanies.AGRISANO` | `"Agrisano Krankenkasse AG"` |

## 5. DateHelper Quick-Ref

`import * as DateHelper from "@utils/helpers/DateHelper";`

Alle Rueckgaben im Format `DD.MM.YYYY`.

| Funktion | Gibt zurueck | Typischer Einsatz |
|----------|-------------|-------------------|
| `getTodayDateString()` | Heute | entscheidVom, Standarddatum |
| `getFirstOfMonthString()` | 01. des Monats | unterstutzungab |
| `getFirstDayOfTheYearString()` | 01.01.JJJJ | Jahresanfang |
| `getLastDayOfYearString()` | 31.12.JJJJ | Jahresende |
| `getDaysFutureString(n)` | Heute + n Tage | R08 Rueckbehalt (Zukunftsdatum!) |
| `getTodayWithFutureYearString()` | Heute + ~360 Tage | uebernahmeWohnkostenBis |
| `getOneYearAgoString()` | Heute - 1 Jahr | Vergangenheitsdatum |
| `getOneMonthAgoString()` | Heute - 1 Monat | Vergangenheitsdatum |
| `getMonthYearAsString(offset)` | `"Maerz 2026"` | Monatsanzeige (0=aktuell, 1=naechster) |
| `getFirstMonthAndYearFromFutureYear()` | `"01.JJJJ+1"` (MM.YYYY) | gueltigMonatJahr |
| `getLastMonthAndYearFromFutureYear()` | `"12.JJJJ+1"` (MM.YYYY) | Jahresende Folgejahr |

## 6. Rollenwechsel Quick-Ref

**Erster Login:**
```typescript
await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN_1A.username, TestUsers.SOZIALARBEITERIN_1A.password);
```

**Rollenwechsel:**
```typescript
await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
// Nach Rollenwechsel: Dossier erneut oeffnen!
await commonKeyword.DO11_Dossier_Search_Lupe({ searchDossierOrKlient: uniqueDossiertId });
```

**Bewilligungsworkflow-Rollen:**

| Schritt | Rolle | Keyword | Parameter |
|---------|-------|---------|-----------|
| 1. Leistungsentscheid | Sozialarbeiterin | `BW01_Bewilligungs_Workflow_LeistungsEntscheid` | checkStatus: "Angefragt" |
| 2. Pruefung OK | Sachbearbeiterin | `BW02b_Bewilligungs_Workflow_Step_V2` | buttonName: "Pruefung OK" |
| 3. Bewilligen | Gemeinde-MA | `BW02b_Bewilligungs_Workflow_Step_V2` | buttonName: "Bewilligen" |
| 4. VP freigeben | Sachbearbeiterin | `BW03b_Bewilligungs_WF_FreigabeVerwendungsPeriode` | status: "Freigegeben" |

**Regeln:**
- `test.slow()` bei Multi-User-Workflows (verdreifacht Timeout)
- Nach jedem Rollenwechsel Dossier neu oeffnen (DO11 oder GoTo_Dossier_With_Url)
- DO14: KANTONS_MA kann nicht sich selbst als Pruefer waehlen

## 7. Zielordner

| Keyword-Bereich | Ordner |
|-----------------|--------|
| Aufgaben (PH, MALI, a03, a05) | `staticTestcases/Keywordvalidation/Aufgaben/` |
| Bedarfspruefung (A01, A02, AN01) | `staticTestcases/Keywordvalidation/Bedarfspruefung/` |
| Bewilligung (BW01-BW04) | `staticTestcases/Keywordvalidation/Bewilligung/` |
| Buchhaltung (BC01-BC04) | `staticTestcases/Keywordvalidation/Buchhaltung/` |
| Dokumente (H01-H07, MAE01-MAE02) | `staticTestcases/Keywordvalidation/Dokumente/` |
| Dossier (D01, DO11-DO16) | `staticTestcases/Keywordvalidation/Dossier/` |
| Erwerbsintegration (FE01-FE03) | `staticTestcases/Keywordvalidation/Erwerbsintegration/` |
| Klient (KL03-KL50, P01-P30) | `staticTestcases/Keywordvalidation/Klient/` |
| Kontakte (KO01-KO03, U01, UM02-UM03) | `staticTestcases/Keywordvalidation/Kontakte/` |
| Kostengutsprache (KG01-KG02, SL01-SL03) | `staticTestcases/Keywordvalidation/Kostengutsprache/` |
| Rahmenbudget (R01-R09, SL02) | `staticTestcases/Keywordvalidation/Rahmenbudget/` |
| Rechnungen (RE01-RE03) | `staticTestcases/Keywordvalidation/Rechnungen/` |
| Rechtsverfolgung (RV00-RV02) | `staticTestcases/Keywordvalidation/Rechtsverfolgung/` |
| Wohnsituation (WO30-WO33, DW01-DW02, P16-P17) | `staticTestcases/Keywordvalidation/Wohnsituation/` |
| Zahlungen (Z01, BU01-BU02, WSH04-WSH10, AW01) | `staticTestcases/Keywordvalidation/Zahlungen/` |
| WIP (instabile Tests) | `staticTestcases/Keywordvalidation/WIP/` |

## 8. Checkliste

- [ ] Import von `test` aus `@libs/test-fixtures` (NICHT aus `@playwright/test`)
- [ ] Unique ID: `generateUniqueDossierId(seed)` verwendet
- [ ] Keine hardcodierten Dates -- nur `DateHelper.*`
- [ ] Keine hardcodierten Credentials -- nur `TestUsers.*`
- [ ] Keine hardcodierten Personennamen -- nur `testData.persons.*` (Fixture)
- [ ] API-Setup statt GUI-Setup fuer Testdaten
- [ ] Keyword-Parameter durch Source-Code-Lesen verifiziert (`grep` in `libs/keywords/`)
- [ ] `test.step()` um jeden Schritt
- [ ] `test.slow()` bei Multi-User / langen Workflows
- [ ] Datei in `staticTestcases/` (NICHT in `testcases/`)
- [ ] Tags gesetzt: `@[ADO_ID]`, `@bereich`, `@all` (oder `@wip`)

## 9. Tiefergehend (nur bei Bedarf)

- [[../keyword-reference/_keyword-lookup]] -- Keyword-Parameter nachschlagen
- [[../domain/workflow-chains]] -- Vollstaendige Workflow-Ketten
- [[../debugging/error-solutions]] -- Bei Testfehlern
- [[../domain/user-roles]] -- Rollen-Details
- [[../domain/calculation-rules]] -- Systemwerte (z.B. Wohnkosten-Cap)
