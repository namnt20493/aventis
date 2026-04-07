# Statistik, Auswertungen & QS

> Automatisch generiert aus ADO Epics. Letzter Sync: 2026-03-12T15:35:06.013Z
> Nicht manuell bearbeiten -- wird beim naechsten Sync ueberschrieben.

---

## Qualitätssicherung und Vollständigkeit (ADO [#94278](https://diartis.visualstudio.com/Aventis/_workitems/edit/94278))

**Status:** In Progress | **Area:** Aventis

**Beschreibung:**

Dies ist ein internes EPIC, damit die PO Meilensteine und Aufgabenstellungen im Zusammenhang 

Qualität aventis Produkt / Entwicklung 

Übergeordnete aventis Ziele/THemen über Q-Merkmale aventis  
 
 

(Auszug aus der Produktstrategie/22.4.25/jke) 
 

In Form von Qualitätsmerkmalen
sind weiterführend und detaillierte Software relevante Anforderungen im Rahmen
der ISO25010 Norm an aventis dokumentiert. Die Erreichung dieser definierten
Qualitätsziele wird mittels definierter Metriken periodisch gemessen und in
einem Report festgehalten. Die Beurteilung, Gewichtung und Einleitung von
notwendigen Massnahmen/Aktivitäten zur Zielerreichung erfolgt in Absprache
zwischen dem SPO, PO, Leiter Entwicklung und CTO.

**Akzeptanzkriterien:**

keine notwendig, da es ein internes EPIC ist und die SQAP-Beurteilung ausserhalb des Backlogs erfolgt

### Features

| # | Feature | ADO # | Status | Beschreibung |
|---|---------|-------|--------|--------------|
| 1 | Architektur Review | #172993 | Done | Systematische und kontinuierliche Architektur- und Technologie Reviews wurden bisher nicht durchgeführt. Sinnvoll wäre ein jährliches Review Erster Review wurde durch Post am 16.12.2024 durchgeführ... |
| 2 | Bestehende technische Schuld im erweiterten Sinne (nach Version 1.1 - per 1.9.2025 | #175136 | In Progress | Bestehende technischen Schulden im erweiterten Sinne: Formales Architektur-Review (40h) siehe #172993 Dokumentation Backend % Frontend Architektur (80h) > in diesem Feature SonarCloud/Statische Cod... |
| 3 | Container für technische Schuld (Refactoring und &&& Themen) | #159357 | Done | Damit wir nach Fertigstellung von Features, durch uns erkannte Mängel/Optimierungen erfassen können, haben wir diesen Container erstellt. Eine Pauschale von 750h sind für diese Themen der technisch... |
| 4 | Qualitätsmerkmale aventis - Weiterentwicklung | #174015 | Design | Qualitätsmerkmale in Zuständigkeit des Scrum-Teams weiterverbessern. Dieses Feature wird genutzt, um den Aufwand für CoP QA, im Lead von Oli festzuhalten. Gemäss Bespechung vom 5.3.26 (Silvio, Simo... |
| 5 | SQAP | #94279 | Done | Dieses Dokument beschreibt den Software Quality Assurance Plan (SQAP) für Aventis. Software Quality Assurance (SQA) ist der formale Prozess für die Bewertung und Dokumentation der Qualität von Resu... |
| 6 | Technische Roadmap Rückstände (Überblick) | #177433 | New | Neue Erkenntnisse, neue Fakten ab 2026: Datensegmente (Verfeinerung des Leistungszugriffs) Zusammenfassung aus Dokument z.H. Post Technische Schulden aventis siehe Anlage Löschfunktionen bei Datenf... |
| 7 | Technische Weiterentwicklung 2026 | #181272 | In Progress | 4.12.25/rma: Pro Jahr wird ein Budget (Effort) festgelegt. Das Budget wird aufgrund der Roadmap Planung festgelegt. Dies erfolgt voraussichtlich im Januar 26. Todo: Prozess (z.B. regelmässiges Meet... |

---

## Statistik & Reporting (ADO [#102435](https://diartis.visualstudio.com/Aventis/_workitems/edit/102435))

**Status:** In Progress | **Area:** Aventis

**Beschreibung:**

(Auszug aus der Produktstrategie/22.4.25/jke)  

Wir unterscheiden verschiedene Auswertungen in aventis: 

Listen/Auswertungen 

für die Benutzenden, wird fast täglich gebraucht,
unterstützt die Arbeitsorganisation 

  

Reports 

Auswertungen vor allem im Rahmen der Buchhaltung, für eine
spezifische Berufsgruppe, hartcodierte Reports, die nicht durch die User
anpassbar sind 

  

Datenbrowser/Dashboard 

Funktionen analog den bekannten Funktionalitäten in den
K-Produkten, Controllinginstrument vor allem für Leitungspersonen, Buchhaltung,
Kanton, Auswertungen können durch Kunden selbst zusammengestellt werden. In
diesem Bereich sehen wir eine Schnittstelle vor, damit Daten aus aventis in
anderen Tools bearbeitet werden können. Entscheidungsgrundlage
Auswertungen in aventis.docx 

 

Schnittstellen / Services 

Schnittstellen und externe Lösungen werden über Services
angebunden. Dabei wird je nach Situation eine passende Technologie eingesetzt
(bevorzugt REST). Diese Fremdservices werden innerhalb aventis so eingebunden,
dass später auch Alternativlösungen schnell und einfach implementiert werden
können. Beispielsweise wird bei einer spezifischen Anbindung für einen Signatur
Service wie SwissSign die Integration unter Berücksichtigung von weiteren Service
Anbietern wie (DeepSign, Swisscom E-Sign, etc.) implementiert. 

Entscheidungsgrundlage Auswertungen in aventis.docx
 

 

(Historie früherer Inhalt)  

Das Management-Informationssystem (MIS) stellt der Organisation Informationen zur Verfügung, mit deren Hilfe die Organisation gelenkt bzw. das Controlling betrieben werden kann. 

Anspruchsgruppen sind: 

Executive Ebene 

Gemeinde (Gemeinderat, Stadtrat) 

Kanton (Regierungsrat) 

Bund (Bundesrat) 
 

Operative Ebene 

Leitung (Dienstleitung, Teamleitung) 
 
 

Basis für statistische Auswertungen liefert die Sozialhilfestatistik, an welcher wir uns primär orientieren. 

Die wichtigsten Indikatoren der Sozialhilfestatistik
Indikator 
 
Jahr 

Sozialhilfequote (wirtschaftliche Sozialhilfe) 
 
3,2% 
 
2018 
 
Anteil der Kurzzeitbeziehenden von wirtschaftlicher Sozialhilfe (bis ein Jahr, abgeschlossene Dossiers) 
 
49,5% 
 
2018 
 
Dauer des Bezugs von wirtschaftlicher Sozialhilfe (Durchschnitt, laufende Dossiers) 
 
42 Monate 
 
2018 
 
Nettoausgaben für Sozialhilfe im weiteren Sinn 
 
8 396 Mio Fr.  
 
2018 
 
Nettoausgaben für wirtschaftliche Sozialhilfe 
 
2 831 Mio Fr.  
 
2018 
 
Jährliche Nettosausgaben für wirtschaftliche Sozialhilfe pro Empfänger 
 
10 324 Fr.  
 
2018 
 
Quote der Sozialhilfe im weiteren Sinn 
 
9,5% 
 
2018 
 Weitere Indikatoren 

Nettoausgaben für Sozialhilfe im engeren Sinn pro Empfänger 

Neuanmeldungen im Monat/Jahr 

Die Ablösequote gibt den Anteil aller Sozialhilfedossiers mit Leistungsbezug in einem bestimmten Jahr wieder, die von der Sozialhilfe abgelöst werden konnten, und beschreibt damit die Ablösewahrscheinlichkeit von der Sozialhilfe.  

Ausländische Sozialhilfebeziehende nach Ländergruppen und Sozialhilfequote der wirtschaftlichen Sozialhilfe 

Quote der Haushalte mit Bezug der wirtschaftlichen Sozialhilfe 

Sozialhilfebeziehende der wirtschaftlichen Sozialhilfe und ständige Wohnbevölkerung von 15 bis 64 Jahren nach Erwerbssituation und Beschäftigungsgrad 

Sozialhilfebeziehende und Sozialhilfequote der wirtschaftlichen Sozialhilfe nach Altersklassen 

Sozialhilfebeziehende und Sozialhilfequote der wirtschaftlichen Sozialhilfe ab 18 Jahre nach Zivilstand 
 

Beispiele.

**Akzeptanzkriterien:**

Die Stellenleitung sieht die wichtigsten Kennzahlen in Echtzeit übersichtlich dargestellt. Mit Vergleich (letzte BFS-Erhebung) eigener Dienst, Kanton und CH.

Kritische Kennzahlen werden rot dargestellt.

Dienst kann aus Kennzahlen-Katalog seine Kennzahlen auswählen.

### Features

| # | Feature | ADO # | Status | Beschreibung |
|---|---------|-------|--------|--------------|
| 1 | Auswertungen ausserhalb aventis (REST API, ODATA oder ähnliches) | #173023 | New | Details siehe Strategieboard vom 20.1.25 Entscheidungsgrundlage Auswertungen in aventis.docx und Marktanalyse Ein Tool zur Erstellung von applikationsnahen Auswertungen (Listen, Tabellen) wurden au... |
| 2 | Beschwerden: Statistiken Beschwerden pro Jahr (Feature 2/4) | #141865 | Removed | Gesplittet aus Feature #115687 Es müssen Statistiken/Auswertungen erstellt werden können: (Liste der Beschwerden pro Jahr, Anzahl Beschwerden pro Jahr (gruppiert nach Status)) 21.11.22 Aktualisiert... |
| 3 | Kennzahlen - Statistik (inkl. Grafik)  MIS: Teil Städteinitiative | #141896 | New | Aus Feature #97342 gesplittet. Grundsätze / Anforderungen Anforderung: Kennzahlen für den Dienst erheben und diese für Berichte zu nutzen. Steuerungsrelevante Daten müssen einfach abgerufen und übe... |
| 4 | Kennzahlen - Statistik (inkl. Grafik) - MIS - Auswertungen/Gemeinde/Abteilung/Dossier/Leistung | #97342 | New | ​Grundsätze / Anforderungen Anforderung: Kennzahlen für den Dienst erheben und diese für Berichte zu nutzen. Steuerungsrelevante Daten müssen einfach abgerufen und übermittelt werden können. 13.12.... |
| 5 | Kt VS: BI-Tool - Zugang zu Dienststelle für Sozialwesen (DSW) Steuerberichten | #180507 | Design | DSW (SAS): Die Dienststelle für Sozialwesen (DSW) hat die Aufgabe, die folgenden kantonalen Vorkehren umzusetzen und ständig zu verbessern die Sozialhilfe, die Hilfe für Personen aus dem Asylbereic... |
| 6 | Schnittstelle zu Datawarehouse | #102439 | New |  |
| 7 | Statistik - VS-Auswertungen:  als externe Applikation (Feature 1/3) | #141897 | Done | Aus Feature #97342 gesplittet. Grundsätze / Anforderungen Früherer Entscheid: Datenbrowser im KLIBnet oder Dashboard in KiSS wird so nicht mehr für aventis verwendet. Es ist noch nicht geklärt, wie... |
| 8 | Statistik - VS-Databrowser Listen: Filter abspeichern (Feature 2/3) | #156538 | Removed | Gesplittet aus Feature #141897 User kann eigene Abfrage erstellen und diese abspeichernZeithorizont: nach Beginn UAT, vor Go-Live 14.8.24/jke Input von aso auf meine Frage was mit dem DataBrowser a... |
| 9 | Statistik - VS-Databrowser Listen: Finalisieren (Feature 3/3) | #156539 | In Progress | Gesplittet aus #141897 Login muss mit RedHat möglich sein Link in aventis auf DataBrowser via Menu Archiv/Ursprüngliche Intention für dieses Feature ev. in Aventis integrieren oder Look & Feel von ... |
| 10 | Statistik - VS-Databrowser Listen: Weiterentwicklung nach GoLive | #182816 | In Progress | An diesem Feature werden Stories angehängt, dort wo es KnowHow aus der PE benötigt. |

---

## Auswertungen (ADO [#147545](https://diartis.visualstudio.com/Aventis/_workitems/edit/147545))

**Status:** In Progress | **Area:** Aventis

**Beschreibung:**

Entscheid vom 13.1.2025 Entscheidungsgrundlage Auswertungen in aventis.docx 

 

(neu jke 30.12.2022) 

Wir unterscheiden verschiedene Auswertungen in aventis: 

Listen/Auswertungen:  

für den Benutzer, wird fast täglich gebraucht, unterstützt die Arbeitsorganisation 

Reports:  

Auswertungen vor allem im Rahmen der Buchhaltung, für eine spezifische Berufsgruppe, hartcodierte Reports, die nicht durch die User anpassbar sind 

"Datenbrowser/Dashboard":  

Funktionen analog den bekannten Funktionalitäten in den K-Produkten, Controllinginstrument vor allem für Leitungspersonen, Buchhaltung, Kanton, Auswertungen können durch Kunden selber zusammengestellt werden

### Features

| # | Feature | ADO # | Status | Beschreibung |
|---|---------|-------|--------|--------------|
| 1 | Auswertungen Buchhaltung: Bilanz, Erfolgsrechnung, Kreditoren-Saldoliste (nach Version  1.0) | #162644 | Dev done | Orientierung (Kontext / Warum) Übersicht über die Situation und das Problem Besprechung 2.5.24 mit Martial/Yasmin/Tom/Rahel/Fabienne betr. VS "Erfolgsrechnung/Bilanz" damit die Zahlungseingänge sei... |
| 2 | Auswertungen Buchhaltung: Buchungsperiode sperren, Jahresabschluss (Feature 4/5) | #144872 | Done | Gesplittet aus Feature 90003 Auswertungen Buchhaltung: weitere Auswertungen (Feature 3/4) Design Jahresabschluss #159606 (ergänzt/21.11.23 jke) Kontoauszug > die Ausgaben/Einnahmen werden aufgrund ... |
| 3 | Auswertungen Buchhaltung: Kontoauszug - alle Buchungen eines Dossiers (Feature 1/5) | #142129 | Done | Gesplittet aus Feature #90003 In diesem Feature ist der gelb-markierte Teil adressiert. ​Grundsätze / Anforderungen Es sollen Auswertungen / Statistiken über die Phasen zur Verfügung stehen. Alle A... |
| 4 | Auswertungen Buchhaltung: Kontoauszug - Excel-Export (Feature 2/5) | #156401 | Done |  |
| 5 | Auswertungen Buchhaltung: Kontoauszug - Leistungsübergreifend, Dossierübergreifend (Feature 5/5) | #164528 | In Progress | Gesplittet aus #144872 Orientierung (Kontext / Warum) Die Funktionalität "Kontoauszug" ist ein wichtiges Arbeitsinstrument für alle Rollen in einem Sozialdienst und dient unter anderen Als Informat... |
| 6 | Auswertungen Buchhaltung: weitere Auswertungen  (Feature 3/5) | #90003 | Done | ​Grundsätze / Anforderungen Es sollen Auswertungen / Statistiken über die Phasen zur Verfügung stehen. Alle Auswertungen sollen exportiert (z.B. Excel) werden können. In diesem Feature werden weite... |
| 7 | Auswertungen Buchhaltung: weitere... | #176209 | New | Orientierung (Kontext / Warum) Übersicht über die Situation und das Problem Absicht / Nutzen (Was) Gibt das gewünschte Ergebnis oder die gewünschte Wirkung an - vorzugsweise aus Sicht des Kunden An... |
