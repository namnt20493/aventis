# Berechnungsregeln und Systemwerte

Dokumentation der Berechnungsregeln und Richtlinienwerte im Aventis-Sozialhilfesystem. Diese Werte sind relevant fuer die Validierung in Tests, insbesondere bei Rahmenbudget-Keywords (R01-R09).

---

## Grundbedarf Lebensunterhalt (GBL)

Der GBL ist ein pauschaler Monatsbetrag nach SKOS-Richtlinien, der von der Haushaltsgroesse abhaengt.

### GBL-Saetze (SKOS-Richtlinien)

| Haushaltsgroesse | GBL pro Monat (ca.) |
|------------------|---------------------|
| 1 Person | ~1'094 CHF |
| 2 Personen | ~1'676 CHF |
| 3 Personen | ~2'036 CHF |
| 4 Personen | ~2'340 CHF |
| 5 Personen | ~2'588 CHF |

**Hinweis**: Die exakten Werte koennen je nach Systemkonfiguration und Indexanpassung abweichen. Im Test-Environment (QA) sind die oben genannten Werte Naeherungswerte. Der Wert fuer 1 Person (~1'094 CHF) ist durch Tests bestaetigt.

### Relevante Keywords
- `R05_GBL_Rahmenbudget_anpassen_Folgeposition` -- Passt den GBL an (individuelle Anpassung)
  - Parameter `berGrundlage`: Berechnungsgrundlage
  - Parameter `individuelleAnpa`: Individuelle Anpassung (Betrag)
  - Parameter `newTotal`: Neuer Gesamtbetrag nach Anpassung

### Was berechnet das System?
Das System berechnet den GBL automatisch basierend auf der Haushaltsgroesse. Der Benutzer kann eine individuelle Anpassung (Zu-/Abschlag) erfassen, aber der Basiswert wird vom System bestimmt.

---

## Wohnkosten (Richtlinienwerte / Cap)

Das System begrenzt die uebernahmefaehigen Wohnkosten auf Richtlinienwerte. Selbst wenn die tatsaechliche Miete hoeher ist, uebernimmt die Sozialhilfe maximal den Richtlinienwert.

### Wohnkosten-Cap nach Haushaltsgroesse

| Haushaltsgroesse | Max. Wohnkosten (ca.) |
|------------------|----------------------|
| 1 Person | ~650 CHF |
| 2 Personen | ~850 CHF |
| 3 Personen | ~1'050 CHF |
| 4 Personen | ~1'200 CHF |

**Wichtig fuer Tests**: Der Cap von ~650 CHF fuer 1 Person ist durch Tests bestaetigt. Wenn im Test eine Miete von 1'300 CHF eingegeben wird, zeigt das System trotzdem nur ~650 CHF als uebernommene Wohnkosten an.

### Relevante Keywords
- `R01_Rahmenbudget_Wohnkosten_Anpassen` -- Passt die Wohnkosten-Annahmen an
  - Parameter `ubernahmeWohnkostenCFH`: Uebernahmebetrag in CHF
- `R09_RahmenBudget_Wohnsituation_AnzeigenPruefen` -- Prueft die Wohnkostenanzeige
  - Parameter `checkUebernomWohnKosten`: Erwarteter Wert (= Cap, NICHT eingabe Miete)
- `WO32_Wohnsituation_Haushalt_Wohnung_anpassen` -- Erfasst die Wohnsituation
  - Parameter `mietkosten`, `nebenkosten`: Die tatsaechlichen Kosten

### Haeufiger Testfehler
```
Eingabe: mietkosten = 1200
Erwartung falsch: checkUebernomWohnKosten = "1200"
Erwartung richtig: checkUebernomWohnKosten = "650"  (Cap fuer 1 Person)
```

---

## Einkommensfreibetrag (EFB)

Erwerbstaetige Sozialhilfeempfaenger erhalten einen Freibetrag auf ihr Einkommen, der nicht an die Sozialhilfe angerechnet wird. Der Freibetrag soll Arbeitsanreize schaffen.

### Relevante Keywords
- `R07_Einkommen_Freibetrag_anpassen` -- Passt den Freibetrag an
  - Parameter `eFB`: Einkommensfreibetrag (Betrag)
  - Parameter `totalNeu`: Neuer Gesamtbetrag

### Voraussetzung
- Erwerbseinkommen muss im Rahmenbudget sichtbar sein
- `createErwerbssituationViaApi()` allein reicht NICHT -- es braucht auch eine durchgefuehrte Bedarfspruefung, damit das Einkommen im Budget erscheint

### Constraint (bekanntes Problem, @wip)
R07 ist aktuell @wip, weil die Erwerbssituation via API zwar erstellt wird, aber im Rahmenbudget nicht automatisch erscheint. Wahrscheinlich ist eine vollstaendige Bedarfspruefung notwendig.

---

## Medizinische Grundversorgung

Krankenkassenpraemien und medizinische Grundleistungen werden als separate Position im Rahmenbudget gefuehrt. Der Betrag variiert je nach Kanton und individueller Situation.

Im Testumfeld wird dieser Wert vom System basierend auf den erfassten Klientendaten berechnet.

---

## Was berechnet das System vs. was wird eingegeben?

| Position | Quelle | Beschreibung |
|----------|--------|--------------|
| GBL | **System** | Automatisch nach Haushaltsgroesse (SKOS) |
| Wohnkosten (uebernommen) | **System** | Min(tatsaechliche Miete, Richtlinienwert) |
| Wohnkosten (tatsaechlich) | **Eingabe** | Via WO32 erfasst |
| Einkommen | **Eingabe** | Via KL03 oder API erfasst |
| Einkommensfreibetrag | **System + Eingabe** | Basiswert vom System, Anpassung via R07 |
| Situationsbedingte Leistung | **Eingabe** | Via SL01 erfasst |
| Rueckbehalt | **Eingabe** | Via R08 erfasst |
| Krankenkasse | **System** | Basierend auf Klientendaten |
| Unterstuetzungsbetrag (Total) | **System** | Berechnet: GBL + Wohnkosten + Zusatzleistungen - Einkommen + Freibetrag |

---

## Berechnungsbeispiel (1 Person, vereinfacht)

```
Grundbedarf Lebensunterhalt (GBL):     + 1'094.00 CHF
Uebernommene Wohnkosten:               +   650.00 CHF
Medizinische Grundversorgung:           +   xxx.xx CHF
                                        ─────────────────
Brutto-Bedarf:                            ~1'744.00+ CHF

Abzuege:
  Erwerbseinkommen:                     -   xxx.xx CHF
  + Einkommensfreibetrag:               +   xxx.xx CHF
                                        ─────────────────
Netto-Unterstuetzungsbetrag:              ~x'xxx.xx CHF
```

---

## Testspezifische Hinweise

### GBL-Anpassung (R05)
- `newTotal` haengt von Haushaltsgroesse und Basiswert ab
- Test ist @wip, da die exakten Systemwerte schwer vorhersagbar sind
- Tooltip-Text und Totalwerte muessen exakt uebereinstimmen

### Wohnkosten (R09)
- Immer den Cap-Wert als Erwartungswert verwenden, NICHT den Eingabewert
- Bei Mehrpersonenhaushalten den entsprechend hoeheren Cap beachten

### Rueckbehalt (R08)
- Startdatum MUSS in der Zukunft liegen: `DateHelper.getDaysFutureString(30)`
- Dokumenten-Upload ist ZWINGEND -- Speichern-Button bleibt ohne Dokument deaktiviert
- Testdokumente liegen in `testfiles/documents/`

Siehe auch: [[business-glossary]] fuer Erklaerung der Fachbegriffe, [[workflow-chains]] fuer die Voraussetzungsketten.
