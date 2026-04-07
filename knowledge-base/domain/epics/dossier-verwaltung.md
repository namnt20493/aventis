# Dossier & Fallfuehrung

> Automatisch generiert aus ADO Epics. Letzter Sync: 2026-03-12T15:35:06.013Z
> Nicht manuell bearbeiten -- wird beim naechsten Sync ueberschrieben.

---

## Lebenszyklus, Aussonderung, Übergabe an Archiv (ADO [#87185](https://diartis.visualstudio.com/Aventis/_workitems/edit/87185))

**Status:** New | **Area:** Aventis
**Tags:** GE

**Beschreibung:**

(Auszug aus der Produktstrategie/22.4.25/jke) 
 

Das System unterstützt den Dienst, die Archivierungs- und
Aufbewahrungs-Vorgaben mit den entsprechenden Fristen für Dossiers und
Leistungen einzuhalten. Es muss möglich sein, eine beendete Leistung mit allen
dazugehörenden Daten aus einem aktiven Dossier zu archivieren und zu löschen.
Dabei werden die geltenden Gesetze eingehalten.

**Akzeptanzkriterien:**

Es besteht die Möglichkeit zur Auslagerung/Archivierung von Dossiers an ein Fremdsystem (Bsp. Schnittstelle zu Staatsarchiv). Nach der Auslagerung/Archivierung werden die Dossier-Daten vollständig gelöscht.

### Features

| # | Feature | ADO # | Status | Beschreibung |
|---|---------|-------|--------|--------------|
| 1 | Archivierung - Nicht-archivwürdige Dossiers vernichten (kassieren) (Feature 2/2) | #86643 | Design | Nicht-archivwürdige Dossiers vernichten (kassieren) Orientierung (Kontext / Warum) Alle Behörden und öffentlichen Verwaltung in der Schweiz sind durch ihre gesetzlichen Grundlagen zu einem tauglich... |
| 2 | Archivierung: Dossiers aufbewahren und bewirtschaften (Feature 1/2) | #156075 | Design | Dossiers aufbewahren und bewirtschaften Orientierung (Kontext / Warum) Alle Behörden und öffentlichen Verwaltung in der Schweiz sind durch ihre gesetzlichen Grundlagen zu einem tauglichen Records M... |

---

## Dossierverwaltung (ADO [#147525](https://diartis.visualstudio.com/Aventis/_workitems/edit/147525))

**Status:** In Progress | **Area:** Aventis

**Beschreibung:**

(Auszug aus der Produktstrategie/22.4.25/jke)  

 

Die Dossierverwaltung hat zum Ziel die Rahmenbedingungen
eines Dossiers zu verwalten und zu organisieren. Sie bietet Unterstützungen in
der Arbeitsorganisation 

 
Leistungskonstrukt,
     Leistungstyp 

 
Klientensystem 

 
Stammdaten 

 

  
Personenstamm 

  
Institutionenstamm 

  
Stammdatenkopplung 

 

 
Dossierlisten:
     hilfreiche Listen für die tägliche Arbeit und/oder ein Cockpit 

 
Suchfunktionen:
     Dossierübergreifend und Volltextsuche 

 
Aufgaben 

 
Benachrichtigungen
     und Informationsvermittlung 

 
Zugang
     zu Wissenseinträgen, e-Learnings, Ticket für Service Desk 
 

(Historie früherer Inhalt)  

Ausbauwünsche: 
 
 

Das System gibt vor oder unterstützt den Benutzer bei einer massgeblichen Veränderung eines Dossiers oder einer Leistung.  

Beispiele: 

- einer Scheidung/einer Trennung eines Ehepaars mit wirtschaftlicher Sozialhilfe 

- das Dossier/Leistung  darf verändert werden oder es muss eine Leistung neu eröffnet werden

**Akzeptanzkriterien:**

Die Aktenführung muss vollständig digital erfolgen (keine Medienbrüche). Es werden elektronische Dossiers angelegt. 

Die Suchfunktion wird von je 5 Sozialarbeiter/innen und Sachbearbeiter/innen als effizient und effektiv gelobt.

### Features

| # | Feature | ADO # | Status | Beschreibung |
|---|---------|-------|--------|--------------|
| 1 | add on für Institutionenstamm | #155541 | New | Betreffend Institutionenstamm kann ich dir folgenden Entscheid aus dem Business Development mitteilen; es ist momentan nicht vorgesehen, einen neuen Service für die Institutionenerfassung und -verw... |
| 2 | Aufgaben: Ausbau Funktionalität (Gruppen/Auto-Aufgaben/Konfigurierbarkeit) (Feature 4/5) | #145322 | In Progress | ​Gesplittet aus Feature #91418 Aufgaben Weitere Funktionalitäten (Gruppen/Auto-Aufgaben/Konfigurierbarkeit) Orientierung (Kontext / Warum) Für die Organisation von Aufgaben gibt es in aventis die F... |
| 3 | Aufgaben: erstellen, Personen zuweisen, Checklisten-Funktion (Feature 1/5) | #91418 | Done | Grundsätze / Anforderungen Mindset: Aufgaben entstehen aus einem Ereignis oder einem Auftrag. Das heisst, die Aufgabe ist nur das Mittel zum Zweck, um das Ereignis oder den Auftrag zu bearbeiten un... |
| 4 | Aufgaben: Fertigstellung - Änderungsprotokoll (Feature 2/5) | #152857 | Done | Gesplittet aus #91418, es konnten nicht alle Stories im Sprint 49/Release 2023.1 umgesetzt werden, deshalb war ein weiteres Feature notwendig. 12.1.23/rma Zu Klären: müssen die aktuell noch offenen... |
| 5 | Aufgaben: Fertigstellung - xx (Feature 3/5) | #156146 | Removed | Mit UseCase 020 umsetzen #97292 |
| 6 | Aufgaben: Verlinkung (Object-Linking) (Feature 5/5) | #145323 | New | Gesplittet aus Feature #91418 Object-Linking auch im UC 005 Zahlungseingänge abgegrenzt: Object-Linking zwischen Abtretung (Dokument in Subsidiaritätsprüfung) und abgetretener Einnahme Rahmenbeding... |
| 7 | Chat-Funktion: Diartis/Anwendervertreter  | #92637 | New | Anforderung seitens PM |
| 8 | Cockpit (Dashboard) | #141878 | Design | Orientierung (Kontext / Warum) Das Cockpit (auch Pilotenkanzel oder Flight Deck) ist ein Teil eines Flugzeugs und der Arbeitsplatz von Piloten. Vom Cockpit aus wird die Steuerung vorgenommen. Ferne... |
| 9 | Dossierlisten: Grundfunktionalität, Bsp. Dossiers mit Beschwerden für Juristen (Feature 1/5) | #89994 | Done | Grundsätze / Anforderungen Der Umfang des Ursprungsitem (Cockpit) wurde reduziert, um Zeit und Aufwand zu sparen. Innerhalb von Aventis gibt es mehrere Such- und Auswertungsmöglichkeiten. Globale S... |
| 10 | Dossierlisten: Listen nach Prod. Start (Feature 5/5) | #150913 | Design | Orientierung (Kontext / Warum) Absicht / Nutzen (Was) Anforderungen der Kunden sind noch unklar und müssen zuerst bekannt sein. Ansatz (How) Constraints (Einschränkungen, Abhängigkeiten, Vorentsche... |
| 11 | Dossierlisten: Listen vor Prod. Start - Teil 1 (Feature 3/5) | #148524 | Done | Gesplittet aus Feature #89994 Für die Listen innerhalb von aventis nutzen wir dieses Feature. Tom wird die Liste hinterlegen (gesplittet aus 141897) und danach kann die Prüfung der Schätzung durchg... |
| 12 | Dossierlisten: Listen vor Prod. Start - Teil 2 (Feature 4/5) | #155457 | Done | Gesplittet aus Feature #89994 Grundlage für Dateninkonsistenzliste. Grundsätze / Anforderungen Ziele Beispiel von Problematiken Attribute Regeln Abgrenzung aus Story 155813: Im absoluten Standard-F... |
| 13 | Dossierlisten: Navigation, Excel Generierung (Feature 2/5) | #146918 | Done | Gesplittet aus #89994 Aktuell ist bei diesem Feature nur die Story von Tom geplant: Die Buchungen einer Weiterverrechnungs-Abrechnung können in Excel exportiert werden https://diartis.visualstudio.... |
| 14 | Dossiersuche | #94314 | Removed | Grundsätze / Anforderungen Zielgruppe sind einerseits SAR, SB, Vorgesetzte, Leiter Sozialdienste, alle Aventis-Anwender. Die Dossiersuche ermöglicht eine schnelle Suche mit verschiedenen Suchkriter... |
| 15 | E-Learning: LMS OpenOlat API: Rollen | #176312 | New | Orientierung (Kontext / Warum) Damit sich neue Mitarbeitende eines Sozialdienstes rasch in aventis einarbeiten können, konsultieren sie die für ihre Rolle vorhandenen E-Learnings in OpenOlat. Ein L... |
| 16 | E-Learning: LMS OpenOlat API: User/in und Sprache | #173966 | Done | E-Learning: LMS OpenOlat API Orientierung (Kontext / Warum) Damit sich neue Mitarbeitende eines Sozialdienstes rasch in aventis einarbeiten können, konsultieren sie die für ihre Rolle vorhandenen E... |
| 17 | Hauptmenu: Globales Suchfeld - Schnellsuche (Feature 2/3) | #141818 | Done | Grundsätze / Anforderungen Schnelle und einfach Suchmöglichkeit für Aventis-Anwender Grundsatz: 1 Suchbegriff, Listenergebnis mit Absprung zu einem Datensatz. Dies kann ein Dossier, eine Leistung o... |
| 18 | Hauptmenu: Globales Suchfeld - Schnellsuche (inkl. Funktionen) (Feature 3/3) | #148494 | New | Input id 29.01.2024: Gehört für mich zum Thema "Suche über alles" ähnlich wie die Features: #149631 #86640 -> Kann aus meiner Sicht nach Produktionsstart gemacht ausgebaut werden (Ausblick) Suche v... |
| 19 | Informationsvermittlung (ehemals Benachrichtigung - nach Version 1.0) | #89128 | In Progress | Orientierung (Kontext / Warum) In aventis arbeiten verschiedene Benutzer/innen mit der gleichen Applikation. Je nach Situation ist es wichtig, dass die Benutzer/innen der Applikation erfahren, dass... |
| 20 | Klientensystem, Stammdaten (nach Version 1.0) | #162624 | In Progress | Orientierung (Kontext / Warum) In diesem Feature geht es darum weitere Anforderungen zum Klientensystem und den Stammdaten zu realisieren/zu planen. Hier eine Übersicht welche Masken/Bereiche inhal... |
| 21 | Klientensystem: Haushalt und Wohnsituation, Aufenthaltsadresse (Feature 1/3) | #94294 | Done | Grundsätze / Anforderungen Das System wird unterstützt (1-n Personen). Das System kann eine Einzelperson (alleinlebend oder nicht alleinlebend z.B. WG), Paare mit Kinder, Paare ohne Kinder, Alleine... |
| 22 | Klientensystem: Haushalt, Wohnsituation - Fertigstellung (Feature 2/3) | #148316 | Done | Gesplittet aus #94294 Grundsätze / Anforderungen Ziele Beispiel von Problematiken Attribute Regeln Abgrenzung aus PBI 170398/Sprint 84: Die nachträgliche Bearbeitung eines falsch eingegebenen Datum... |
| 23 | Klientensystem: Verwaltung Bezugspersonen (Feature 3/3) | #141914 | Done | Gesplittet aus Feature #94294 Bezugsperson löschen Grundsätze / Anforderungen Ziele Beispiel von Problematiken Attribute Regeln Abgrenzung Entscheide Ausblick für Weiterausbau Bezugsperson wohnt ne... |
| 24 | Klientenübergreifende Suche: mit Solr | #86640 | New | Grundsätze / Anforderungen Ziele Beispiel von Problematiken Attribute Regeln Wallis-Anforderungen: zusätzlich 300h Effort Klientenübergreifende Suche nach Themen (bezogen auf Journal-Inhalte, Wörte... |
| 25 | Klientenübergreifende Suche: mit Sql | #149631 | Removed | Frage für RE-Exchange von jke: Welche Argumente kann ich Martial bringen, dass wir dieses Feature komplett weglassen wollen. Welchen Mehrwert hätte das Feature gebracht gegenüber der momentanen Suc... |
| 26 | Leistungskonstrukt - Abschluss eines Dossiers (Feature 2/2) | #159974 | Dev done | Leistungskonstrukt - Dossier abschliessen Orientierung (Kontext / Warum) Das System unterstützt die Organisation durch Automatismen aktiv beim fachlichen Dossier-Abschluss sowie bei der Aufbereitun... |
| 27 | Leistungskonstrukt - Leistungstyp Katalog: Dossiereröffnung, -zuweisung, Mandantenfähigkeit (Feature 1/2) | #87813 | Done | Grundsätze / Anforderungen des Leistungskonstrukts Jeder Kunde kann seine Leistungen aus einem Katalog (Leistungstypen-Vorlagen) auswählen. ⭕ UC 031 Die Leistungs-Typen werden als Set fix vorgegebe... |
| 28 | Leistungskonstrukt: Leistung KES eröffnen und abschliessen | #176362 | In Progress | Orientierung (Kontext / Warum) Übersicht über die Situation und das Problem Absicht / Nutzen (Was) Gibt das gewünschte Ergebnis oder die gewünschte Wirkung an - vorzugsweise aus Sicht des Kunden An... |
| 29 | Mail: Benachrichtigungen per Mail erhalten (Feature 1/2) | #141803 | Done | Grundsätze / Anforderungen Der Benutzer entscheidet, ob ein Mail (mit Anhängen) direkt in ein Dossier gespeichert wird (z.B. mit Dropzone in Leistung) oder ein Mail zuerst zum Capturing übergeben w... |
| 30 | Online Hilfe - Dokumentation(en): Fachhilfe-Link (Feature 1/3) | #86642 | Done | ​ Grundsätze / Anforderungen aus Epic Mitarbeiterinnen können einfacher angestellt/rekrutiert werden ohne Schulungen, wenn sie bereits mit dem Produkt gearbeitet haben Ziele Aventis ist selbsterklä... |
| 31 | Online Hilfe - Dokumentation(en): Hilfestellungen Framework - (Feature 3/3) | #148548 | New | Gesplittet aus Feature #86642 |
| 32 | Online Hilfe - Dokumentation(en): Service-Management-Link (Feature 2/3) | #148550 | New | Gesplittet aus Feature #86642 aus PBI 137944: Error-Handling >> mit UC 019 97255 019 - Use Case "Benutzer/in konsultiert Fachhilfe und Weisungen der Organisation"Design Was machen wir, wenn 1 oder ... |
| 33 | Stammdaten-Kopplung: nach Version 1.0 | #175170 | New |  |
| 34 | Stammdaten-Kopplung: Nachführung Rahmenbudget und Vorbuchungen | #94291 | Done | Grundsätze / Anforderungen Die Stammdaten-Koppelung bedeutet, dass sich möglicherweise bei einer Stammdaten-Änderung, auch Massnahmen nötig werden oder sich Daten ändern, die auf diesen Stammdaten ... |
| 35 | Stammdaten-Kopplung: xx | #170799 | Removed |  |
| 36 | Stammdaten: Fertigstellung (Feature 5/5) | #148371 | Done | Gesplittet aus #89165 Besprechung um Feature zu klären mit idl, rma und jke vom 29.01.2024: Funktionen die bereits umgesetzt wurden, sind durchgestrichen Funktionen die noch umgesetzt werden müssen... |
| 37 | Stammdaten: Institutionenstamm - Institutionen/Fachpersonen auswählen (Feature 2/5) | #141946 | Done | Gesplittet aus Feature Stammdaten #87924 Grundsätze / Anforderungen Stammdaten werden zentral für alle Leistungen (WSH, Beratung, Erwachsenenschutz, Mandatsbuchhaltung etc.) zur Verfügung gestellt ... |
| 38 | Stammdaten: Institutionenstamm - Institutionen/Fachpersonen erfassen (Feature 3/5) | #144086 | Done | 0Gesplittet aus Feature Stammdaten #87924 Grundsätze / Anforderungen Stammdaten werden zentral für alle Leistungen (WSH, Beratung, Erwachsenenschutz, Mandatsbuchhaltung etc.) zur Verfügung gestellt... |
| 39 | Stammdaten: Personenstamm - manuelle Erfassung von Personen (Feature 4/5) | #145343 | Done | Gesplittet aus Feature #87924 Grundsätze / Anforderungen Ziele Beispiel von Problematiken Attribute Regeln Abgrenzung Eine erfasste Wegzugsadresse wird bei der Person - Adresse angezeigt (read only... |
| 40 | Stammdaten: Personenstamm (Feature 1/5) | #87924 | Done | Grundsätze / Anforderungen Stammdaten werden zentral für alle Leistungen (WSH, Beratung, Erwachsenenschutz, Mandatsbuchhaltung etc.) zur Verfügung gestellt Folgende Informationen definieren wir als... |
| 41 | Übersicht Sozialhilfehistorie pro Person | #172652 | Done | Orientierung (Kontext / Warum) TBD ob dies ausschliesslich die Rechtsgrundlage von VS ermöglicht und wie es in anderen Kantonen gesetzlich aussieht. Damit der Sozialdienst einen Klienten optimal un... |
| 42 | Volltextsuche (inkl. Inhalt Dokumente) | #141859 | New | Inklusive Suche in Dokumente (Inhalts-Suche/Volltextsuche) Anmerkung von aso zum Thema DMS: Anmerkung CTO Aso Zur Volltextsuche: Also die Schnittstelle muss entsprechend Funktionen bereitstellen, d... |

---

## elektronische Dossierübergabe (ADO [#147535](https://diartis.visualstudio.com/Aventis/_workitems/edit/147535))

**Status:** In Progress | **Area:** Aventis

**Beschreibung:**

(Auszug aus der Produktstrategie/22.4.25/jke) 
 

Dossierübergabe von Dienst zu Dienst oder vom Kanton an einen Dienst (Triage) soll per Knopfdruck funktionieren unter Berücksichtigung des Datenschutzes und der
gesetzlichen Vorgaben.   

 

aventis Produktstrategie 16.02.25: 

Schnittstellen und externe Lösungen werden über Services angebunden. Dabei wird je nach Situation eine passende Technologie eingesetzt (bevorzugt REST). Diese Fremdservices werden innerhalb aventis so eingebunden, dass später auch Alternativlösungen schnell und einfach implementiert werden können. Beispielsweise wird bei einer spezifischen Anbindung für einen Signatur Service wie SwissSign die Integration unter Berücksichtigung von weiteren Service Anbietern wie (DeepSign, Swisscom E-Sign, etc.) implementiert.

### Features

| # | Feature | ADO # | Status | Beschreibung |
|---|---------|-------|--------|--------------|
| 1 | Übergabe Dossier/Leistung/Dokumentation an anderes CMS: Personen- und Stammdaten, ausgewählte Dokumente | #91874 | Done | ​Ziel Dieses Feature hat zum Ziel, dass ein Klienten-Dossier eines Sozialdienstes (CMS) einem anderen Sozialdienst übergeben werden kann. Dieses Feature beschränkt sich dabei auf verschiedene Sozia... |
| 2 | Übergabe Dossier/Leistung/Dokumente: todo | #171473 | New | Orientierung (Kontext / Warum) Übersicht über die Situation und das Problem Absicht / Nutzen (Was) Gibt das gewünschte Ergebnis oder die gewünschte Wirkung an - vorzugsweise aus Sicht des Kunden au... |
