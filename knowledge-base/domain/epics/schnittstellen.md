# Schnittstellen & Externe Systeme

> Automatisch generiert aus ADO Epics. Letzter Sync: 2026-03-12T15:35:06.013Z
> Nicht manuell bearbeiten -- wird beim naechsten Sync ueberschrieben.

---

## Schnittstelle zum Bundesamt für Statistik (BfS) - Sektion Sozialhilfe (ADO [#86637](https://diartis.visualstudio.com/Aventis/_workitems/edit/86637))

**Status:** In Progress | **Area:** Aventis

**Beschreibung:**

(Auszug aus der Produktstrategie/22.4.25/jke) 
 

Schnittstelle Bundesamt für Statistik und allfällige weitere
geforderte gesetzliche Auswertungen 

Je nach Leistung definiert das Bundesamt für Statistik Daten,
die zur nationalen Vergleichbarkeit erhoben und abgeliefert werden. 
 

 

Modernisierung der Sozialhilfeempfängerstatistik | Bundesamt für Statistik (admin.ch) 

 

Auszug aus der BFS-Website:  

Die Sektion Sozialhilfe befasst sich hauptsächlich mit der Erarbeitung und Publikation einer gesamtschweizerischen Sozialhilfestatistik, welche Bund, Kantonen und anderen sozial- und wirtschaftpolitisch aktiven Gremien wichtige Grundlagen für sozialpolitische Entscheide liefert. Als Empfängerstatistik, welche seit 2009 in allen Kantonen auf Basis einer Vollerhebung erstellt und ausgewertet wird (was gesamtschweizerisch ca. 200'000 Dossiers entspricht), liefert die Sozialhilfestatistik Informationen zu:
 

Bestand und Struktur der Sozialhilfeempfänger/innen 

Problemlage der Sozialhilfeempfänger/innen 

Art und Umfang der Leistungen (inkl. „WBSL“ = Weitere, bedarfsabhängige Sozialleistungen) 

Dynamik des Leistungsbezuges (Anzahl Erstbezüger, Bezugsdauer, etc.) 

 

Die Sozialhilfestatistik ermöglicht auch aussagekräftige Vergleiche zwischen Kantonen, Bezirken und Gemeindegrössenklassen. 

Weitere wichtige Aufgaben sind die Integration der Sozialhilfeempfänger aus dem Flüchtlings- und Asylbereich in die Sozialhilfestatistik, die Erhebung, die Erhebung der Grundlagen zur Berechnung des Armutsindikators als Teil der Neugestaltung des Finanzausgleichs und der Aufgabenteilung zwischen Bund und Kantonen (NFA) sowie zielgruppenspezifische Auswertungen (z.B. für die Städteinitiative).  

 

aventis Produktstrategie 16.02.25: 

Schnittstellen und externe Lösungen werden über Services angebunden. Dabei wird je nach Situation eine passende Technologie eingesetzt (bevorzugt REST). Diese Fremdservices werden innerhalb aventis so eingebunden, dass später auch Alternativlösungen schnell und einfach implementiert werden können. Beispielsweise wird bei einer spezifischen Anbindung für einen Signatur Service wie SwissSign die Integration unter Berücksichtigung von weiteren Service Anbietern wie (DeepSign, Swisscom E-Sign, etc.) implementiert.

**Akzeptanzkriterien:**

Das BFS bestätigt die Funktionstüchtigkeit der Schnittstelle aus technischer wie auch inhaltlicher Sicht.  

Aventis liefert 2024 mit VS als Pilotkunden bereits nach der neuen Ablieferungsmethodik Daten ans BFS (Mail vom 26.10.21 von dg im Anhang).

### Features

| # | Feature | ADO # | Status | Beschreibung |
|---|---------|-------|--------|--------------|
| 1 | BFS Leistungsklasse Alimentenbevorschussung (ALBV) | #96822 | New |  |
| 2 | BFS Leistungsklasse Sozialhilfe an Asylsuchende (SH-AsylStat) | #96821 | New |  |
| 3 | BFS Leistungsklasse Sozialhilfe an Flüchtlinge (SH-Flüstat) | #96820 | New |  |
| 4 | BFS Leistungsklasse wirtschaftliche Sozialhilfe (WSH) - fehlende Felder/Stammdaten (Feature 1/5) | #168588 | Done | Relevante Felder für die BFS Ablieferung für WSH sind in aventis vorhanden Orientierung (Kontext / Warum) Damit die Ablieferung für BFS korrekt erfolgt, müssen fehlende Felder in aventis noch einge... |
| 5 | BFS Leistungsklasse wirtschaftliche Sozialhilfe (WSH) - Korrekturen nach PROD VS (Feature 5/5) | #174864 | In Progress | BFS Leistungsklasse wirtschaftliche Sozialhilfe (WSH): Erweiterungen nach Testphase (Feature 3/3) Orientierung (Kontext / Warum) Modernisierung der Sozialhilfestatistik (SHS) (admin.ch) Neu basiert... |
| 6 | BFS Leistungsklasse wirtschaftliche Sozialhilfe (WSH) - Korrekturen nach Testphase  (Feature 3/5) | #159964 | Done | BFS Leistungsklasse wirtschaftliche Sozialhilfe (WSH): Erweiterungen nach Testphase (Feature 3/3) Orientierung (Kontext / Warum) Modernisierung der Sozialhilfestatistik (SHS) (admin.ch) Neu basiert... |
| 7 | BFS Leistungsklasse wirtschaftliche Sozialhilfe (WSH) - Massentest DEV (4/5) | #174863 | Done | BFS Leistungsklasse wirtschaftliche Sozialhilfe (WSH): Erweiterungen nach Testphase (Feature 3/3) Orientierung (Kontext / Warum) Modernisierung der Sozialhilfestatistik (SHS) (admin.ch) Neu basiert... |
| 8 | BFS Leistungsklasse wirtschaftliche Sozialhilfe (WSH) - Weiterentwicklung nach 1.0 | #173992 | New |  |
| 9 | BFS Leistungsklasse wirtschaftliche Sozialhilfe (WSH) - Zusammenstellen und Abliefern der monatlichen Datenlieferung (Feature 2/5) | #93092 | Done | BFS Leistungsklasse wirtschaftliche Sozialhilfe (WSH) (Feature 2/3) Orientierung (Kontext / Warum) Modernisierung der Sozialhilfestatistik (SHS) (admin.ch) Neu basiert die modernisierte Statistik a... |
| 10 | BFS Leistungsklasse wirtschaftliche Sozialhilfe (WSH): Anfangszustand | #96819 | Removed | Grundsätze / Anforderungen Gemäss BFS: Der Anfangszustand gibt Auskunft über die Situation der Unterstützungseinheit zu Beginn des Sozialhilfebezugs. Er ist nur für Dossiers der wirtschaftlichen So... |

---

## Schnittstelle Einwohnerkontrolle (EWK) (ADO [#147533](https://diartis.visualstudio.com/Aventis/_workitems/edit/147533))

**Status:** In Progress | **Area:** Aventis

**Beschreibung:**

(Auszug aus der Produktstrategie/22.4.25/jke)  

Eine Schnittstelle zur Einwohnerkontrolle bietet Zeitersparnis bei der Neuerfassung von Dossiers und verhindert inkorrekte Daten. Ausserdem kann die Zuständigkeit sofort geprüft werden. 

 

aventis Produktstrategie 16.02.25: 

Schnittstellen und externe Lösungen werden über Services angebunden. Dabei wird je nach Situation eine passende Technologie eingesetzt (bevorzugt REST). Diese Fremdservices werden innerhalb aventis so eingebunden, dass später auch Alternativlösungen schnell und einfach implementiert werden können. Beispielsweise wird bei einer spezifischen Anbindung für einen Signatur Service wie SwissSign die Integration unter Berücksichtigung von weiteren Service Anbietern wie (DeepSign, Swisscom E-Sign, etc.) implementiert. 

 

7.11.25/rma: 

Grundprinzip bezüglich Umsetzung des Datenschutzes: Wir schränken die Personensuche in aventis ein  und öffnen die Suche ggf. pro Kanton, sofern die gesetzlichen Vorgaben dies erlauben.

### Features

| # | Feature | ADO # | Status | Beschreibung |
|---|---------|-------|--------|--------------|
| 1 | Personen-Schnittstelle:  Geres Kt. VS - Dossiereröffnung (Feature 1/3) | #145341 | Done | Gesplittet aus Original #89137 aso 2.3.24: User und Kennwort ergänzt unter "GERES Wallis Testzugang" im Passwordstate Falls die Schnittstelle und das Testsystem ready ist in 2024.2 könnte mit folge... |
| 2 | Personen-Schnittstelle:  Geres Kt. VS - Fertigstellung (Feature 3/3) | #145340 | Removed | Gesplittet aus Original #89137 Kandidaten, falls noch nicht erledigt: Umzug in der gleichen Sozialregion vor 1 Monat Besondere Wohnformen Klient/in stirbt in einer UE |
| 3 | Personen-Schnittstelle: Aventis-Wiki Personenregister (Feature 1/2)  | #141891 | Done | Gesplittet aus Original #89137 Grundsätze / Anforderungen Grundsatz: Alle notwendigen Klienten-Daten werden zukünftig automatisiert dem zuständigen Sozialdienst übermittelt werden können. Die nötig... |
| 4 | Personen-Schnittstelle: Aventis-Wiki Personenregister Fertigstellung (Feature 2/2) | #156738 | Removed | jke 8.8.24: Frage für Grobschätzung: Wenn ich es richtig im Kopf habe, geht es hier darum das Acces Token regelmässig zu erneuern. Eine andere Lösung wurde nicht gefunden. Macht es mehr Sinn, diese... |
| 5 | Personen-Schnittstelle: Geres Kt. VS - Teil 2 (Feature 4/6) | #89137 | Removed | Entscheid 4.3.24 POs Jke/Rma Dieses Feature wird in Feature 145342 integriert. Der Text wird in Feature übernommen und die Stories werden umgehängt. ​ RE-Exchange: Im Excel Ivo ist UC 013 erfasst >... |
| 6 | Schnittstelle EWK: Geres Kt. VS -  Synchronisation (Feature 2/3) | #145342 | In Progress | ​ Gesplittet aus Original #89137 Personenschnittstelle Geres VS - Synchronisation Orientierung (Kontext / Warum) Die Produktvision ist, dass bestehende digitale Daten kein weiteres Mal manuell eing... |

---

## Schnittstelle Kommunikation (Mail/Telefonie/App/Messenger) (ADO [#147534](https://diartis.visualstudio.com/Aventis/_workitems/edit/147534))

**Status:** New | **Area:** Aventis

**Beschreibung:**

(Auszug aus der Produktstrategie/22.4.25/jke) 
 
 

Durch Schnittstellen in und aus den gängigsten Kommunikationstools wird die Arbeit auf den Sozialdiensten zusätzlich vereinfacht.  

Mail als Dokument ablegen 

Anbindung Mail/Telefonie direkt aus Stammdaten 

etc.  
 

aventis Produktstrategie 16.02.25: 

Schnittstellen und externe Lösungen werden über Services angebunden. Dabei wird je nach Situation eine passende Technologie eingesetzt (bevorzugt REST). Diese Fremdservices werden innerhalb aventis so eingebunden, dass später auch Alternativlösungen schnell und einfach implementiert werden können. Beispielsweise wird bei einer spezifischen Anbindung für einen Signatur Service wie SwissSign die Integration unter Berücksichtigung von weiteren Service Anbietern wie (DeepSign, Swisscom E-Sign, etc.) implementiert.

### Features

| # | Feature | ADO # | Status | Beschreibung |
|---|---------|-------|--------|--------------|
| 1 | Anbindung Kommunikation (Telefon, Mail) | #136646 | New | Automatisches Öffnen des Dossiers, wenn einer der Kontakte im Ordner einen Anruf tätigt: Verknüpfung mit Cisco Jabber oder Outlook - Es muss möglich sein, von der Lösung aus zu telefonieren, SMS un... |
| 2 | Blended Counseling  | #97359 | New | Im Innovationsprojekt "Klienten-Online-Portal" wird der Einsatz von Threema geprüft. Forschungsprojekt Projekt FHNW zum Thema "Wenn es gelingt, jeweils die Vorteile verschiedener Medien und des per... |
| 3 | Diartis EasyCom oder ePost Communities | #136651 | New | https://oje67rbi.sibpages.com/ GE: Anschließend wird eine E-Mail/SMS mit Datum und Uhrzeit des Termins an den PCo gesendet. In ähnlicher Weise wird X Tage vor dem Termin (konfigurierbare Verzögerun... |
| 4 | Sicherer E-Mail Verkehr | #141804 | New | Aus Abgrenzung #86641 Anforderung seitens PM: Sicherer E-Mail-Verkehr Abgelegte Mails in der Dokumentenablage können beantwortet, weitergeleitet werden. Diese Mails werden aber nicht in der Aktenab... |

---

## Schnittstelle in Finanzbuchhaltung (ADO [#147536](https://diartis.visualstudio.com/Aventis/_workitems/edit/147536))

**Status:** New | **Area:** Aventis

**Beschreibung:**

(Auszug aus der Produktstrategie/22.4.25/jke)  

Eine Schnittstelle in die Finanzbuchhaltung überträgt benötigte Finanzzahlen in definierbaren Zeitperioden an die Hauptbuchhaltung. 

 

aventis Produktstrategie 16.02.25: 

Schnittstellen und externe Lösungen werden über Services angebunden. Dabei wird je nach Situation eine passende Technologie eingesetzt (bevorzugt REST). Diese Fremdservices werden innerhalb aventis so eingebunden, dass später auch Alternativlösungen schnell und einfach implementiert werden können. Beispielsweise wird bei einer spezifischen Anbindung für einen Signatur Service wie SwissSign die Integration unter Berücksichtigung von weiteren Service Anbietern wie (DeepSign, Swisscom E-Sign, etc.) implementiert.

### Features

| # | Feature | ADO # | Status | Beschreibung |
|---|---------|-------|--------|--------------|
| 1 | Schnittstelle Finanzbuchhaltung | #139553 | New | Alle Infos zur Schnittstelle in Abacus von KLIBnet sind im Item https://diartis.visualstudio.com/KLIBnet/_workitems/edit/122267 dokumentiert. Falls du Zugriff auf den KLIBnet-Bereich im Azure DevOp... |

---

## Schnittstelle Ebics/E-Banking (ADO [#147538](https://diartis.visualstudio.com/Aventis/_workitems/edit/147538))

**Status:** New | **Area:** Aventis

**Beschreibung:**

(Auszug aus der Produktstrategie/22.4.25/jke)
 

EBICS-Schnittstelle von Bank zu aventis und umgekehrt um automatisiert alle Zahlungsein- und -ausgänge elektronisch zur Verfügung zu stellen, ohne manuell Dateien hoch- und runterzuladen. Dies ist keine Eigenentwicklung, es werden bestehende Lösungen angebunden. 

 

aventis Produktstrategie 16.02.25: 

Schnittstellen und externe Lösungen werden über Services angebunden. Dabei wird je nach Situation eine passende Technologie eingesetzt (bevorzugt REST). Diese Fremdservices werden innerhalb aventis so eingebunden, dass später auch Alternativlösungen schnell und einfach implementiert werden können. Beispielsweise wird bei einer spezifischen Anbindung für einen Signatur Service wie SwissSign die Integration unter Berücksichtigung von weiteren Service Anbietern wie (DeepSign, Swisscom E-Sign, etc.) implementiert.

### Features

| # | Feature | ADO # | Status | Beschreibung |
|---|---------|-------|--------|--------------|
| 1 | Schnittstelle zu Bank/Post | #89835 | New | Grundsätze / Anforderungen 27.8.24/rma: Anforderung aus VS-Projekt: Sie möchten in aventis ein Konto haben, auf das sie Zahlungseingänge verbuchen können, welche keinem Dossier zugeordnet werden kö... |

---

## Schnittstelle Amt für Prämienverbilligung/Krankenkassensubventionen (ADO [#147539](https://diartis.visualstudio.com/Aventis/_workitems/edit/147539))

**Status:** In Progress | **Area:** Aventis

**Beschreibung:**

(Auszug aus der Produktstrategie/22.4.25/jke)  

Schnittstelle zum Amt für Prämienverbilligung um Personen ohne Medienbruch an- und abzumelden. 

 

aventis Produktstrategie 16.02.25: 

Schnittstellen und externe Lösungen werden über Services angebunden. Dabei wird je nach Situation eine passende Technologie eingesetzt (bevorzugt REST). Diese Fremdservices werden innerhalb aventis so eingebunden, dass später auch Alternativlösungen schnell und einfach implementiert werden können. Beispielsweise wird bei einer spezifischen Anbindung für einen Signatur Service wie SwissSign die Integration unter Berücksichtigung von weiteren Service Anbietern wie (DeepSign, Swisscom E-Sign, etc.) implementiert.

### Features

| # | Feature | ADO # | Status | Beschreibung |
|---|---------|-------|--------|--------------|
| 1 | Kt VS: Schnittstelle zu Ausgleichskassen - VS OPE 33 - Krankenkassen-Subvention: Abmeldung (Feature 6/6) | #175676 | New | Orientierung (Kontext / Warum) Wenn der Anspruch auf Sozialhilfe erlischt, erlischt auch der Anspruch auf IPV. Daher muss es ermöglicht werden, die Klientschaft bei der Ausgleichkasse abzumelden. A... |
| 2 | Kt VS: Schnittstelle zu Ausgleichskassen - VS OPE 33 - Krankenkassen-Subvention: Anbindung, Ablieferung, Anmeldung (Feature 4/6) | #148656 | Design | Gesplittet aus Feature #97412 Grundsätze / Anforderungen definitive Umsetzung gegen die effektive Schnittstelle Regelmässige Übermittlung der neuen Datensätze Verarbeitung der technischen Quittunge... |
| 3 | Kt VS: Schnittstelle zu Ausgleichskassen - VS OPE 33 - Krankenkassen-Subvention: Erfassung (Feature 3/6) | #176206 | Done | 22.5.25/rma: Das Feature wurde gesplittet, da der Schnittstellen-Partner noch nicht bereit ist. Feedback seitens VS: Login bzw. Authentifikationsinformationen für Test und Produktive Umgebung pas e... |
| 4 | Kt. VS: Schnittstelle zu Ausgleichskassen - VS OPE 33 - Krankenkassen-Subvention: An- und Abmeldung  (Feature 1/6) | #97412 | Done | Grundsätze / Anforderungen Ziele Beispiel von Problematiken Input seitens Stakeholder Sandro Stettler: Kinderzulagen Erwerbslose. Heutiges Antragformular ist 8-seitig! IK-Auszüge pro Klient/in verl... |
| 5 | Kt. VS: Schnittstelle zu Ausgleichskassen - VS OPE 33 - Krankenkassen-Subvention: ohne Schnittstelle (Feature 2/6) | #162310 | Done | Gesplittet aus #148656 bzw. #97412 jke: Entscheid aus Sitzung mit tab und awa vom 16.1.2024: VS Ausgleichskasse ist erst im 2. Halbjahr 2024 bereit die Schnittstelle umzusetzen Daher haben wir Mehr... |
| 6 | Kt. VS: Schnittstelle zu Ausgleichskassen - VS OPE 33 - Krankenkassen-Subvention: Rückmeldung (Feature 5/6) | #165353 | Design | Gesplittet aus Feature #148656 Orientierung (Kontext / Warum) Die Anmeldung der individuellen Prämienverbilligung (IPV) wird elektronisch übermittelt und technisch quittiert (#148656). Anschliessen... |

---

## Schnittstelle zu diversen Institutionen (ADO [#147540](https://diartis.visualstudio.com/Aventis/_workitems/edit/147540))

**Status:** In Progress | **Area:** Aventis

**Beschreibung:**

(Auszug aus der Produktstrategie/22.4.25/jke) 
 

z.B. Strassenverkehrsamt, Steuerverwaltung,
Betreibungsregisteramt TBD 

 

aventis Produktstrategie 16.02.25: 

Schnittstellen und externe Lösungen werden über Services angebunden. Dabei wird je nach Situation eine passende Technologie eingesetzt (bevorzugt REST). Diese Fremdservices werden innerhalb aventis so eingebunden, dass später auch Alternativlösungen schnell und einfach implementiert werden können. Beispielsweise wird bei einer spezifischen Anbindung für einen Signatur Service wie SwissSign die Integration unter Berücksichtigung von weiteren Service Anbietern wie (DeepSign, Swisscom E-Sign, etc.) implementiert.  

 

(Historie früherer Inhalt)  

Beschreibung aus Vorgänger Epic Vernetzung: 

Input aus Projekt Mika - Aventis (nicht abschliessend) 

 

Arten der Vernetzung 

Portale (z.B. Klienten oder private Mandatsträger) nutzen eine Plattform, ein Web-Frontent 

Schnittstellen (Daten zwischen Aventis und anderen Programmen austauschen) 
 

Potenzielle Vernetzungspartner (nicht definitiv oder abschliessend) 
 

Sozialdienste mit Kantonen 

Leistungserbringer (z.B.: Arbeitsintegrations-Dienstleister) 

Gutachter 

Klienten 

Private Mandatsträger 

Sozialdienste mit Berufsbeistandschaften 

KESBs mit Berufsbeistandschaften oder Sozialdiensten 

Banken 

Versicherungen (Online-Portal) 

EWK kommunal oder EWK kantonal 

IV 

SVA 

Strassenverkehrsamt 

Steueramt 

SD zu SD für Dossierübergabe 
 
 

Auslenkung 

Künftig besteht die Möglichkeit, dass die Kunden bei Überlast oder personellen Engpässen, einzelne Dossiers an unsere Schwesterfirma Tangente auslenken können.

**Akzeptanzkriterien:**

Die wichtigsten Schnittstellen sind funktionstüchtig und werden in der Praxis eingesetzt.  

Banken 

Versicherungen 

Einwohnerdaten 

Klient 

KESB 

SD Kanton 

Auslenkung zu Tangente

### Features

| # | Feature | ADO # | Status | Beschreibung |
|---|---------|-------|--------|--------------|
| 1 | ICEAS - Beschäftigungsinspektion - Weg 1 (Feature 1/2) | #115724 | Done | Grundsätze / Anforderungen Ziele Beispiel von Problematiken Attribute Regeln Anforderung Wallis: Weg 1 (Aventis -> ICEAS) SAS, CMS oder Gemeinde kann bei Verdacht auf unrechtmässig bezogene Leistun... |
| 2 | ICEAS - Beschäftigungsinspektion - Weg 1: Ermittlungen - Edit-Modus (2/2) | #152858 | Done | Gesplittet aus #115724 |
| 3 | Schnittstelle zu ? - ICEAS - Beschäftigungsinspektion | #141911 | Removed | Mit Rahel in Abgleich klären: Wenn Portal: wer macht das? Gesplittet aus Feature #115724 Weg 2 (ICEAS -> Aventis) Das ICEAS bemerkt bei einer Kontrolle einen unrechtmässigen Bezug und fragt Aventis... |
| 4 | Schnittstelle zu Amt für Arbeitslosenversicherung  | #97420 | New |  |
| 5 | Schnittstelle zu Amt für Integration und Soziales | #97421 | New | Grundsätze / Anforderungen Kanton Bern: Jeder Sozialdienst bereitet die gewünschten Zahlen für das AIS in seinem Fallführungssystem elektronisch auf. Die statistischen Angaben und die Sozialhilfeau... |
| 6 | Schnittstelle zu Amt für Sozialversicherung | #142141 | New | Kanton Bern: Die Sozialdienste des Kantons Bern melden dem ASV über die Webapplikation EVOKplus, welche Personen über welchen Zeitraum Sozialhilfe beziehen. |
| 7 | Schnittstelle zu Arbeitsintegration | #91425 | New | Arbeitsintegrator (Rolle) hat eine spezielle Sicht Zusammenarbeit SA mit Institutionen, die Angebote zur Verfügung stellen Arbeitspläne |
| 8 | Schnittstelle zu Betreibungs- und Konkursämter  | #97418 | New | Betreibungsregisterauszug beim Intake (UC 066 - PBI 121330) Analog KLIBnet? https://www.diartis.ch/loesungen/klibnet/e-sch-kg Infos PM 8.5.2025 Post: Tilbago für digitale Auslösung von Onlinebetrei... |
| 9 | Schnittstelle zu Grundbuchämter | #97419 | New |  |
| 10 | Schnittstelle zu Kantonale Erwachsenen- und Kindesschutzbehörde | #97416 | New | z.B. Abrechnungen |
| 11 | Schnittstelle zu Regierungsstatthalterämter | #97417 | New |  |
| 12 | Schnittstelle zu Steuerverwaltung  | #87938 | New | Steuererklärung Daten |
| 13 | Schnittstelle zu Strassenverkehrsamt | #91424 | New | zum Beispiel: Input von Stakeholder Sandro Stettler: Stassenverkehrsamt: bei jedem Klient/in wird geprüft, ob er/sie ein Auto besitzt. Mit direktem einloggen beim Strassenverkehrsamt, wo SAR auf al... |
| 14 | Schnittstelle(n) zu Kanton(en) - Lastenausgleich | #89839 | New | Stichwort Mandantenfähigkeit:In diesem Use Case wird Mandantenfähigkeit "nur" genutzt, nicht entscheidend weiterentwickelt:Nutzung: unabhängige Buchhaltungen (TBD: pro Sozialdienst oder pro Gemeind... |

---

## Schnittstelle Zentrales Migrationsinformationssystem (ZEMIS) (ADO [#183072](https://diartis.visualstudio.com/Aventis/_workitems/edit/183072))

**Status:** New | **Area:** Aventis

**Beschreibung:**

2.2.26/JKE 

Eine robuste, sichere und automatisierte Schnittstelle zum Zentralen Migrationsinformationssystem (ZEMIS) ermöglicht es, relevante Migrationsdaten effizient, medienbruchfrei und in Echtzeit in unsere Fachanwendungen zu integrieren. Dadurch werden manuelle Arbeitsschritte reduziert, Datenqualität und Aktualität verbessert und der Gesamtprozess der Fallbearbeitung sowie Entscheidungsfindung nachhaltig beschleunigt. 

Nutzen / Business Value: 

Erhöhter Automatisierungsgrad: Wegfall manueller Datenerfassungen durch direkte System‑zu‑System‑Kommunikation. 

Höhere Datenqualität: Minimierung von Übertragungsfehlern und Konsistenzproblemen. 

Verbesserte Prozesseffizienz: Schnellere Bearbeitung von Gesuchen, Mutationen oder Prüfungen dank aktueller Datenverfügbarkeit. 

Revisionssicherheit & Nachvollziehbarkeit: Klare Protokollierung aller Datenflüsse und Zugriffe. 

Regulatorische Konformität: Sichere und DSG-konforme Verarbeitung behördlicher Migrationsdaten. 
 

Outcome:

Fachpersonen können jederzeit auf vollständige, aktuelle und geprüfte Daten aus dem ZEMIS zugreifen, ohne den Prozess zu unterbrechen oder externe Quellen manuell konsultieren zu müssen. Dadurch wird der Service qualitativ verbessert, Reaktionszeiten verkürzt und die Gesamtperformance der Prozesse gesteigert.

*Keine Features zugeordnet.*
