# System & Plattform

> Automatisch generiert aus ADO Epics. Letzter Sync: 2026-03-12T15:35:06.013Z
> Nicht manuell bearbeiten -- wird beim naechsten Sync ueberschrieben.

---

## Lösungsarchitektur (früher Web-Client und Saas-Modell) (ADO [#87184](https://diartis.visualstudio.com/Aventis/_workitems/edit/87184))

**Status:** In Progress | **Area:** Aventis

**Beschreibung:**

(Auszug aus der Produktstrategie/22.4.25/jke) 
 

 

 

aventis basiert auf einer 3-Tier Layer Architektur mit einer
Modularisierung der fachlichen Komponenten. 

 

  

3-Tier Architektur 

Die 3-Tier Architektur trennt auf horizontaler Ebene die
drei Layer Präsentation (UI), Applikationslogik und Datenhaltung. Durch die
Entkopplung können spezifische Technologien und Tools pro Layer eingesetzt
werden, welche gemäss ihren Vorteilen ausgewählt und eingesetzt werden können.
Beispielsweise kann in der Datenhaltung eine relationale MS SQL DB für die
Datenstrukturen von aventis verwendet werden während zusätzlich ein S3 für
Blob/Clob Daten verwendet werden kann. Die Trennung des Präsentation Layers von
der Applikationslogik ermöglicht eine entkoppelte Weiterentwicklung des
Frontends Layers. Im Frontend Bereich sind öfters Versions, Technologie oder
Design Änderungen notwendig, welche durch die Trennung einfacher umgesetzt
werden können. 

  

Modularisierung 

aventis wird modularisiert entwickelt, so dass fachliche
Themen möglichst durch Module/Funktionen voneinander gekapselt sind. Dies
ermöglicht eine parallele Entwicklung mit möglichst wenigen Abhängigkeiten und
Quereinflüssen. Durch die Modularisierung kann der Einfluss auf andere Module
und Funktionen minimiert und damit die Qualität hochgehalten werden. Auf eine
Umsetzung von DDD, Microservices wurde bewusst verzichtet. Diese
Architekturkonzepte bieten eine höhere Kapselung inklusive eines definierten
Formalismus gegenüber der Modularisierung, bringen aber auch eine weitaus
höhere Komplexität mit sich. 

  

Schnittstellen / Services 

Schnittstellen und externe Lösungen werden über Services
angebunden. Dabei wird je nach Situation eine passende Technologie eingesetzt
(bevorzugt REST). Diese Fremdservices werden innerhalb aventis so eingebunden,
dass später auch Alternativlösungen schnell und einfach implementiert werden
können. Beispielsweise wird bei einer spezifischen Anbindung für einen Signatur
Service wie SwissSign die Integration unter Berücksichtigung von weiteren Service
Anbietern wie (DeepSign, Swisscom E-Sign, etc.) implementiert. 
 

 

Software as a Service 

aventis wird als Lösung so implementiert, dass die Diartis
AG die Lösung als SaaS vermarkten kann. Dies bedeutet, dass wir aventis in
unserer eigenen Cloud für einen oder mehrere Kunden betreiben. Wir behalten uns
vor den Betrieb mit Partnern mit entsprechendem Knowhow umzusetzen. Insbesondere
für die physische Hardware setzen wir auf etablierte Partner in der Schweiz.
Für die Kunden ergeben sich durch einen SaaS Betrieb folgende Vorteile: 

  

Sofort neue Funktionen bei den Benutzenden 

Einfacher
Zugriff: Benutzende  können von jedem
PC/Tablet mit Internetanbindung zugreifen 

Kontinuierliche
Updates: Funktionale Erweiterungen und Softwareverbesserungen erreichen die
User zeitnah und risikoarm 

Tiefere
Aufwände und kalkulierbare Kosten
 
 
 

 

Sorgenfreier Betrieb 

Fokus
auf das Kerngeschäft 
dank Entlastung von Software-Management und -Wartungsaufgaben 

Hohe
Performance und beste Verfügbarkeit 
dank Betrieb in der Cloud bei namhaftem Anbieter 

Datenschutz
first!
Datenhaltung in der Schweiz und Expertise von Hostingpartner 

Datensicherheit
gewährleistet
dank cyberresilienter Lösung 

Klare Ansprechpersonen - Diartis als SPOC –Single Point of contact 
 

 

 

(Historie früherer Inhalt) 

Die Lösung unterstützt mobile Arbeitsformen (User arbeiten im Office, zu Hause, unterwegs oder vor Ort bei Klienten. Als Arbeitsgerät wird primär ein Notebook oder Tablet genutzt. 

Die Lösung kann als SaaS betrieben werden. Dabei muss die Datenhaltung zwingend in der Schweiz bleiben (von Diartis empfohlener Betrieb) 

Bei einem Verbindungsunterbruch soll
weitergearbeitet werden können. Eingegebene Daten sollten nicht verloren gehen
und der Benutzer wird vorzeitig informiert bei einem Unterbruch mit möglichen
negativen Folgen 

Lösung soll auch bei geringer Bandbreite gut
funktionieren. 2/3 Mbit sollte möglich sein. 

Klientel kann sein Dossier partiell einsehen. Die Rolle "Klientel" definiert die Dateneinsicht (nur Leserechte). 

sicherer Datenaustausch (bidirektional) zwischen Sozialdienst und Klientel 
 
 

Aus Interview von Stakeholder (Coronazeiten): 
 

Digitales-Dossier ist matchentscheidend 

BB 1 Tag in der Woche Homeoffice gewöhnt. Prozesse waren klar. 

WSH Abläufe waren nicht klar. Prozesse klären sich nun. Optimierungspotential wurde sichtbar 

Frage der Arbeitsorganisation.  Sie arbeiten noch nicht mit Pendenzen. Wäre nun sehr hilfreich 

Klienten vor Ort heruntergefahren. Umgestellt auf telefonische Beratung.  

Anmeldung passiert noch physisch. Per Anmeldung per Telefon ist nun im Test. Für den Fall einer Ausgangssperre. Winterthur macht das jetzt schon so. 

Online: Kein Zukunfts-Modell für Beratungsgespräche. ev. für explizite Personengruppen wäre es denkbar. SA und Psychologen gehen davon aus, dass face to face eine bessere Qualität ergibt. Je nach Setting macht jedoch ein anderer Kanal Sinn. 

Whats-app schon nicht mehr inn bei den Jugendlichen. Neu Instagramm 

Bei eskalierenden Situationen macht online Sinn. Videokonferenz macht Sinn, wenn Plattform stabil sind. Voraussetzung technisches Verständnis vorhanden. 

Homeoffice könnte sich auch im SD mehr verbreiten. Effizienz-Gewinn. 
 
 

 

Datenhaltung strukturierte Daten - DB-Server beim Kunden oder in der Cloud 

Mobile Nutzung - JA

**Akzeptanzkriterien:**

Durch CTO bestätigt: Systemarchitektur und Systemanforderungen gemäss Vorgaben korrekt umgesetzt

Business Logik zu 80% des Codes mit
automatisierten Tests abgedeckt

Durch Verkauf bestätigt: Trial-Version mit Demodaten steht zu Verfügung und funktioniert.

User können problemlos mit geringer Brandbreite im Zug arbeiten

### Features

| # | Feature | ADO # | Status | Beschreibung |
|---|---------|-------|--------|--------------|
| 1 | Bug-Container 2026 | #181275 | In Progress | 4.12.25/rma: Pro Jahr wird ein Budget (Effort) festgelegt. Das Budget wird aufgrund der Roadmap Planung festgelegt. Dies erfolgt voraussichtlich im Januar 26. |
| 2 | Bug-Container bis 2025 | #112671 | Dev done | Platzhalter, damit Bugs einem Feature zugeordnet werden können. Gemäss Prozess https://diartis.visualstudio.com/Aventis/_wiki/wikis/Aventis.wiki/855/Bug Struktur: Getestete Schritte: x x Erwartetes... |
| 3 | Explore and Integrate SonarCloud | #141346 | Done | Gemäss Architekturboard: Insbesondere Security-Aspekte prüfen ✅ "Backend Integration" Pipeline ✅ "Frontend Integration" Pipeline ✅ Integration in Visual Studio ✅ Sonar-Warnungen werden als "Fehler"... |
| 4 | Frameworkarbeiten | #89989 | Done | Ausblick Wenn wir weitere Leistungen wie z.B. Asyl oder Beistandschaft realisieren, muss beim Dossiertree folgende Funktion realisiert werden: Wenn z.B. die Gültigkeit der WSH abgelaufen ist, muss ... |
| 5 | High Availability (HA) & Throughput  | #151049 | In Progress | Beschreibung Um den Throughput und die Ausfallsicherheit bzw. die Verfügbarkeit von aventis zu erhöhen kann aventis auf mehreren Application Server betrieben werden. Dadurch ist auch ein Loadbalanc... |
| 6 | Maintenance Wartung 2020-2025 | #104883 | Dev done | Komplette Abarbeitung aller SonarCloudMeldungen. Aktuell liegt der Fokus auf den Security- und offensichtlichen Themen mit einem kontinuierlichen Budget pro Sprint Pro Sprint 3h Neue Performance-Er... |
| 7 | Maintenance Wartung 2026 | #181274 | In Progress | 4.12.25/rma: Pro Jahr wird ein Budget (Effort) festgelegt. Das Budget wird aufgrund der Roadmap Planung festgelegt. Dies erfolgt voraussichtlich im Januar 26. |
| 8 | Monitoring | #154832 | In Progress | Ziel: Telemetriedaten schaffen die Datenbasis für Buganalyse Proaktives Agieren aufgrund Telemetrie statt aufgrund Kundenmeldungen Entscheidungen für die technische Weiterentwicklung Strategie: All... |
| 9 | Performance Optimierungen applikatorisch | #148466 | Dev done | Beschreibung: Query Change Optimierung und weitere noch nicht bekannte Optimierungen zur Verbesserung der Performance und wenn möglich auch Hardwarekosten Einschätzung und Planung: Möglichkeit 2025... |
| 10 | SaaS Betrieb | #140316 | New | Definition des Aventis SaaS Betriebs: Definition der notwendiger Infrastruktur, Tools und Dienste für Aventis Definition Betriebsmodell (Diartis, externe Partner etc.) Auswahl der Partner und Diens... |
| 11 | Trial-Version mit Demo-Daten | #93145 | Done | Grundsätze / Anforderungen Basis: Es gibt eine Trial-/Test-Version von Aventis für ausgewählte Personen (zuerst für Stakeholder, später auch für Diartis-Kunden und Aventis-Interessenten) Die Trial-... |

---

## User Experience (ADO [#87928](https://diartis.visualstudio.com/Aventis/_workitems/edit/87928))

**Status:** In Progress | **Area:** Aventis

**Beschreibung:**

(Auszug aus der Produktstrategie/22.4.25/jke) 
 

 

Benutzerzentrierung und Barrierefreiheit  
 

aventis stellt den Menschen in den Mittelpunkt. aventis ist einfach zu bedienen, barrierefrei gestaltet und darauf ausgelegt, allen Anwendenden – unabhängig von technischen Vorkenntnissen – eine effiziente und angenehme Arbeitsweise zu ermöglichen.  
 
 

 

Im Entwicklungsprozess sollen zukünftig vermehrt User
Centered Design (UCD) Prozesse und Methoden etabliert und angewendet werden um
eine gute User Experience (UX) sicherzustellen. Dadurch kann methodisch und
quantitativ sichergestellt werden, dass die umgesetzten Lösungen die wirklichen
Probleme der Anwendenden adressieren. Für die Umsetzung müssen drei Bereiche in
der Diartis AG gestärkt werden: 

 Knowhow-Aufbau der Mitarbeitenden im ganzen
Change Prozess bezüglich UX/UCD 

Einführung und Etablierung der Methoden im
Change Prozess 

Anwendung und Implementierung entsprechender
Tools und Techniken 
 

 

 

(Historie früherer Inhalt)  

Anwender-/innen beschreiben die Arbeit mit Aventis wie folgt: einfach, schön und schnell ... und es macht Spass &#128522; 

 

Aventis ist selbsterklärend und ohne aufwändige Schulung nutzbar. -> Mitarbeiterinnen können einfacher angestellt/rekrutiert werden ohne Schulungen, wenn sie bereits mit dem Produkt gearbeitet haben 

 

Mitarbeiterinnen können sich auf die Kernaufgaben konzentrieren und administrativer Aufwand soll verhindert werden wo möglich. Leerläufe und Doppelerfassungen sollen verhindert werden.
 

 

Performance: Benutzer will keine Wartezeiten im täglichen Arbeiten. Oder während längeren Wartezeiten bei grossen Verarbeitungen, kann ich weiterarbeiten
 

 

Moderne Oberfläche: Einfach, intelligent, barrierefrei
 

Barrierefreiheit dank WCAG 2.0 AA Konformität. Anpassbare Fenster- und Schriftgrösse.
 

 

Programm-Bugfixes werden automatisch eingespielt (Autoupdate-Funktion)

**Akzeptanzkriterien:**

V 1.0

Endkunden-Anwender-/innen mit den Profilen Sachbearbeitung, Buchhaltung und Sozialarbeit aus 2 unterschiedlichen Diensten bestätigen folgende Punkte:

Aventis ist selbsterklärend und ohne aufwändige Schulung nutzbar (einfach)

die Arbeit mit Aventis macht Spass, das look and feel überzeugt (schön)

Bezüglich der Performance attestieren uns die Anwender ein zügiges Arbeiten mit Aventis unter einer state oft the art Systemumgebung und unter Last (bis zu 150 gleichzeitig arbeitenden Usern) (schnell)

Durch Experten zu bestätigen:

Die Norm DIN EN ISO 9241 ist mit begründeten Ausnahmen umgesetzt.

Barrierefreiheit durch Experten bestätigt, mit WCAG 2.1 Level AA als Accessability (A11y) Standard umgesetzt

V 1.0 ff

Durch Systemverantwortlichen eines Kunden zu bestätigen:

Programmupdates können vom Kunden selbständig und automatisiert durchgeführt werden. Alle Änderungen sind transparent.

SaaS: Verfügbarkeit von 99% garantiert (mtl. Nutzerminuten - mtl. Ausfallzeiten)/mtl. Nutzerminuten * 100)

### Features

| # | Feature | ADO # | Status | Beschreibung |
|---|---------|-------|--------|--------------|
| 1 | Benutzungsqualität (ISO 9241-110) | #87930 | In Progress | Grundsätze / Anforderungen Die Norm DIN EN ISO 9241 beschreibt als Standard die "Ergonomie der Mensch-System-Interaktion" bezogen auf die Grundsätze der Dialoggestaltung (bis 2006 "DIN EN ISO 9241-... |
| 2 | Bezeichnungen - Einheitlichheit - Mehrsprachigkeit | #89990 | Done | Bezeichnungen: es werden die Bezeichnungen gemäss Glossar, Wording und Personas angewendet. Einheitlichkeit: es werden die Bezeichnungen gemäss Glossar, Wording und Personas angewendet (keine unter... |
| 3 | Deployment und Releases 2026 (interne Umgebungen) | #181276 | In Progress | 4.12.25/rma: Pro Jahr wird ein Budget (Effort) festgelegt. Das Budget wird aufgrund der Roadmap Planung festgelegt. Dies erfolgt voraussichtlich im Januar 26. |
| 4 | Deployment und Releases bis 2025 - (Ziel: durch Kunden ausgelöst und automatisiert) | #148597 | Dev done | Gesplittet aus #148466 Details siehe Prozess Release - Overview Releasestrategie aventis vom 14.5.2025: Der Fokus der Auslieferung liegt auf dem Mehrwert und Nutzen für unsere Kunden. Wir liefern B... |
| 5 | Diktatfunktion - Spracherkennung | #87921 | New | zu klären/entscheiden; Bieten wir somit auch eine Diktat-Funktion für deutsch und französisch an? Siehe ELO- Aventis Maketing Verkaufsunterlagen: Intelligente Assistentin Clara, mit Spracherkennung |
| 6 | Fehlerhandling | #91608 | Dev done | Rahel todo für spätere Versionen: Vorgaben aus Qualitätsmerkmale Aventis in Stories einfliessen lassen (Kapitel Zuverlässigkeit, Exception Handling etc. ) Kapitel Änderbarkeit/Wartbarkeit Analysier... |
| 7 | Grafische Übersichten | #89996 | Removed |  |
| 8 | Hauptmenu (nach Version 1.0) | #169487 | Design | Grundsätze / Anforderungen Hauptmenu optimieren, welche Befehle sollen übers Menu gemacht werden und auch Befehle die Dossierübergreifend rasch gemacht werden sollen zB. Journaleintrag erstellen un... |
| 9 | Hauptmenu: Menufunktionen (Feature 1/3) | #95716 | Done | Grundsätze / Anforderungen Schnelle und einfach Suchmöglichkeit für Aventis-Anwender Grundsatz: 1 Suchbegriff, Listenergebnis mit Absprung zu einem Datensatz. Dies kann ein Dossier, eine Leistung o... |
| 10 | integriertes Übersetzungstool | #155540 | New |  |
| 11 | Rechtschreibeprüfung | #136648 | New | Eine Rechtschreibprüfung; |
| 12 | Sprachbefehle | #136647 | New | - In der Lage sein, die verschiedenen Teile eines Ordners per Sprachbefehl zu durchsuchen und darauf zuzugreifen". |
| 13 | Usability (ISO 9241-11) inkl. Accessability | #87929 | In Progress | Grundsätze / Anforderungen Die Usability (Gebrauchstauglichkeit) einer Software ist von ihrem Nutzungskontext (beinhalten den Benutzer, die Arbeitsaufgabe, die Arbeitsmittel wie z.B. Hardware oder ... |
| 14 | User Interface: technische Verbesserungen | #176647 | In Progress | ab Lot 3 - Version 1.2 nach Einführung von VS. |
| 15 | User Interface: technische Verbesserungen (nach Lot 3) | #178688 | Removed |  |
| 16 | User Interface: technische Verbesserungen vor MEP VS | #165896 | Done |  |
| 17 | UX: Fachliche Optimierungen (Umsetzung innerhalb des jeweiligen BUC-Release) | #165897 | In Progress | Orientierung (Kontext / Warum) Hier geht es um die Optimierung von aventis, damit ein besseres User-Erlebnis (UX) erreicht wird. Da wir aktuell noch keine User haben, die produktiv mit aventis arbe... |
| 18 | Zertifizierung nach WCAG 2.2 Stufe AA - Barrierefreiheit aventis | #176813 | New | Orientierung (Kontext / Warum) Zertifizierung nach WCAG 2.2 Stufe AA für barrierefreies Arbeiten mit aventis Siehe Antrag und Entscheid vom Service Portfolio Board vom 31.7.2025 Entscheid WCAG Zert... |

---

## Benutzerverwaltung (ADO [#87950](https://diartis.visualstudio.com/Aventis/_workitems/edit/87950))

**Status:** In Progress | **Area:** Aventis

**Beschreibung:**

(Auszug aus der Produktstrategie/22.4.25/jke) 
 

 

 

Die Benutzerverwaltung synchronisiert sich mit bestehenden Active
Directorys, so dass Doppelerfassungen, -mutationen etc. vermieden werden. Durch 

 
Rollen 

 
Auskunftssperren 

 
Stellvertretungen/Gastrechte 

 
Nachvollziehbarkeit
     Lesezugriffe 
 

wird garantiert, dass jede Person nur die Daten einsehen
kann, über die sie die notwendigen Rechte verfügt. Besonders schützenswerte und
heikle Daten können bis auf Maskenebene vor ungerechtfertigten Zugriffen
geschützt werden. 

 

 

(Historie früherer Inhalt) 
 

Privacy bi Design und Privacy by Default
 

 

Artikel 25 VERORDNUNG (EU) 2016/679 DES EUROPÄISCHEN PARLAMENTS UND DES RATES 

Datenschutz durch Technikgestaltung und durch datenschutzfreundliche Voreinstellungen 

(1)   Unter Berücksichtigung des Stands der Technik, der Implementierungskosten und der Art, des Umfangs, der Umstände und der Zwecke der Verarbeitung sowie der unterschiedlichen Eintrittswahrscheinlichkeit und Schwere der mit der Verarbeitung verbundenen Risiken für die Rechte und Freiheiten natürlicher Personen trifft der Verantwortliche sowohl zum Zeitpunkt der Festlegung der Mittel für die Verarbeitung als auch zum Zeitpunkt der eigentlichen Verarbeitung geeignete technische und organisatorische Maßnahmen — wie z. B. Pseudonymisierung — trifft, die dafür ausgelegt sind, die Datenschutzgrundsätze wie etwa Datenminimierung wirksam umzusetzen und die notwendigen Garantien in die Verarbeitung aufzunehmen, um den Anforderungen dieser Verordnung zu genügen und die Rechte der betroffenen Personen zu schützen. 

(2)   Der Verantwortliche trifft geeignete technische und organisatorische Maßnahmen, die sicherstellen, dass durch Voreinstellung grundsätzlich nur personenbezogene Daten, deren Verarbeitung für den jeweiligen bestimmten Verarbeitungszweck erforderlich ist, verarbeitet werden. Diese Verpflichtung gilt für die Menge der erhobenen personenbezogenen Daten, den Umfang ihrer Verarbeitung, ihre Speicherfrist und ihre Zugänglichkeit. Solche Maßnahmen müssen insbesondere sicherstellen, dass personenbezogene Daten durch Voreinstellungen nicht ohne Eingreifen der Person einer unbestimmten Zahl von natürlichen Personen zugänglich gemacht werden. 

(3)   Ein genehmigtes Zertifizierungsverfahren gemäß Artikel 42 kann als Faktor herangezogen werden, um die Erfüllung der in den Absätzen 1 und 2 des vorliegenden Artikels genannten Anforderungen nachzuweisen. 

 

Übersetzt heißt Privacy by Design „Datenschutz durch Technikgestaltung“ und greift den Grundgedanken auf, dass sich der Datenschutz am besten einhalten lässt, wenn er bereits bei Erarbeitung eines Datenverarbeitungsvorgangs technisch integriert ist. In anderen Worten: der Schutz personenbezogener Daten im Sinne der DSGVO erfolgt durch das frühzeitige Ergreifen technischer und organisatorischer Maßnahmen im Entwicklungsstadium.
 

Privacy by Default heißt übersetzt „Datenschutz durch datenschutzfreundliche Voreinstellungen“ und bedeutet, dass die Werkeinstellungen datenschutzfreundlich auszugestalten sind. Nach dem Grundgedanken sollen insbesondere die Nutzer geschützt werden, die weniger technikaffin sind und z.B. dadurch nicht geneigt sind, die datenschutzrechtlichen Einstellungen ihren Wünschen entsprechend anzupassen. Dieser Gedanke steht hinter dem Begriff „Privacy Paradox“, wonach Nutzer grundsätzlich den Schutz ihrer Privatsphäre befürworten, aber nicht aktiv entsprechende Einstellungen vornehmen.
 

 

Berechtigungs-Änderungen, Lese- und Schreibzugriffe werden für Datenschutz-Audits protokolliert (Details siehe entsprechende Features.)

**Akzeptanzkriterien:**

Die Anforderungen im Bereich des Datenschutzes sind gewährleistet:

Möglichkeit der Datensperrung auf einzelnen Klienten (User haben keinen Zugriff auf einzelnes Dossier, Zugriff limitiert auf einzelne Benutzer)

Möglichkeit, Klienten auf User-Gruppen zu berechtigen

Richtlinien betreffend Privacy by Design und Privacy by Default werden angewendet; je 5 Beispiele umgesetzt. 
Beispiel: Hinweis betreffend  für User betreffend Datenschutz (Sensitive Daten Schweigepflicht, Homeoffice+Zug Bildschirmschutz etc.)

### Features

| # | Feature | ADO # | Status | Beschreibung |
|---|---------|-------|--------|--------------|
| 1 | Akteneinsichtsrecht der Klientel | #88183 | New | 5.12.23/jke Neues DSG berücksichtigen! Erweiterung der Betroffenenrechte: Auf Verlangen der betroffenen Personen müssen bestimmte Informationen über die Bearbeitung von Personendaten mitgeteilt ode... |
| 2 | Akteneinsichtsrecht für Dritte | #91617 | New | Akteneinsicht für Dritte muss unterstützt/festgehalten werden: z.B. KESB, Polizei, EWK stellt eine Anfrage |
| 3 | Auskunftssperre | #94296 | In Progress | Grundsätze / Anforderungen Auskunftssperren werden auf Personen erfasst ✅ Sobald eine Person mit einer Auskunftssperre in Aventis verwendet wird wie z.B. in einer UE oder im Haushalt einer Leistung... |
| 4 | Benutzerverwaltung:  Anbindung Redhat: Login mit unterschiedlichen Funktionen (Feature 3/4) | #164293 | Done | Grundsätze / Anforderungen siehe auch: Gesplittet aus Featre #146563 Ziele Als Mitarbeiter/in auf verschiedenen Diensten mit unterschiedlichen Funktionen kann ich beim Start und bei der Benutzung v... |
| 5 | Benutzerverwaltung: Anbindung RedHat (Feature 2/4) | #146563 | Done | Gesplittet aus Feature #91876 Je joins notre documentation interne pour s’y appairer et le lien chez RedHat SSO pour les éléments provenant du client à sécuriser : https://access.redhat.com/documen... |
| 6 | Benutzerverwaltung: Einschränkung je nach Rolle des Users bei der Auswahl der Rechte | #146518 | New | Grundsätze/Anforderungen: Benutzerverwaltung Benutzer/in: Aventis verwendet die Benutzer aus einem IAM-Tool wie Azure AD/AD für Logins. Die Benutzer der Azure AD (AAD) werden durch die IT-Verantwor... |
| 7 | Benutzerverwaltung: Fertigstellung inkl. Redhat  (Feature 4/4) | #91876 | In Progress | Orientierung (Kontext / Warum) Die Benutzerverwaltung von aventis wurde erstellt bevor wir einheitliche Design-Vorgaben für die Masken/Controls hatten. Aktuelle Problematiken: Ausgewählte Daten sin... |
| 8 | Benutzerverwaltung: Zuweisung von Benutzer/innen zu Rollen (Feature 1/4) | #150897 | Done | Gesplittet aus #91876 Möglichkeit, damit gewährleistet ist, dass neue Benutzer einer Rolle zugeordnet werden kann. Die Masken müssen nicht schön sein, aber müssen ohne Fehler funktionieren. Nur syn... |
| 9 | Berechtigungen auf Leistungen und/oder Dossier (Feature 2 von 2) - Gastrecht | #141986 | Dev done | Berechtigungen auf Leistungen und/oder Dossier mit Gastrecht (Mandantenübergreifend) Orientierung (Kontext / Warum) In der Praxis gibt es immer wieder Gründe, warum für nicht fallführende Personen ... |
| 10 | Berechtigungen Leistungen (Feature 1 von 2) - Framework, Zugriffsmatrix | #93532 | Done | Grundsätze / Anforderungen Die Vergabe der Zugriffe auf Leistungen für die Benutzer erfolgt via Teams gemäss vorgegebenen Regeln. Die Teams sind im Feature #91876 beschrieben. Mit der Vergabe der R... |
| 11 | Ein-/Zwei-Faktor-Authentifizierung | #86639 | New | Input von Beat: das Naming ist zu überprüfen. Anstelle von Authentifizierung sollte Authentisierung genutzt werden. https://www.datenschutzbeauftragter-info.de/authentisierung-authentifizierung-und... |
| 12 | Ein-/Zwei-Faktor-Authentifizierung | #146517 | Removed | Input von Beat: das Naming ist zu überprüfen. Anstelle von Authentifizierung sollte Authentisierung genutzt werden. https://www.datenschutzbeauftragter-info.de/authentisierung-authentifizierung-und... |
| 13 | Lesezugriffe (Feature 1 von 2) - protokollieren | #94423 | New | Grundsätze / Anforderungen Lesezugriffe können protokolliert werden Kunde kann Zugriffe auswerten > wird mit Feature #141884 umgesetzt. Ziele Für den Kunden ist es nachvollziehbar, wer Daten mutier... |
| 14 | Lesezugriffe (Feature 2 von 2) - Auswerten | #141884 | New | esplittet aus Feature #94423 Siehe Beilage: Anzeige Logging Zugriffe und Mutationen werden in aventis geloggt und in der DB persistiert. Es fehlt aktuell noch eine EndUser optimierte Darstellung di... |
| 15 | Stellvertretungen | #91621 | New | Wenn jemand in den Ferien, krank, etc. ist, sollten wir eine einfache Lösung bieten, wie Stellvertretungen für einen bestimmten Zeitraum wahrgenommen werden und das für die anderen Benutzerinnen au... |

---

## e-Services / Portallösungen (ADO [#89172](https://diartis.visualstudio.com/Aventis/_workitems/edit/89172))

**Status:** New | **Area:** Aventis
**Tags:** NichtTeilSchätzungMmi

**Beschreibung:**

(Auszug aus der Produktstrategie/22.4.25/jke) 
 
 

Mögliche Anbindungen an Portallösungen und e-Services, die
in der Verwaltung genutzt werden. 
 
 

 

aventis Produktstrategie 16.02.25: 

Schnittstellen und externe Lösungen werden über Services angebunden. Dabei wird je nach Situation eine passende Technologie eingesetzt (bevorzugt REST). Diese Fremdservices werden innerhalb aventis so eingebunden, dass später auch Alternativlösungen schnell und einfach implementiert werden können. Beispielsweise wird bei einer spezifischen Anbindung für einen Signatur Service wie SwissSign die Integration unter Berücksichtigung von weiteren Service Anbietern wie (DeepSign, Swisscom E-Sign, etc.) implementiert.  

 

Entscheid SPB vom ? 

Diartis wird keine Portallösungen und e-Services wie zB. Sozialhilfeantrag online einreichen, selber umsetzen, es werden ausschliesslich Schnittstellen an bestehende Lösungen angedacht. 

 

(Historie früherer Inhalt) 
 

Auszug aus Projektstatusbericht 2020-04-15: 

Die neue Projektausrichtung wurde mit den Leitern der
Sozialdienste Burgdorf (Peter Leuenberger) und Wohlen (Sandro Stettler) besprochen.
Beide sind sehr angetan vom neuen Vorgehen und der Aussicht, möglichst bald
punktuell neue Angebote in der Praxis nutzen und testen zu können. Sie haben
sich auch beide bereit erklärt, entsprechend interessierte Mitarbeiter für das
Kernteam zu delegieren. 

  

Als erste konkreten Use Cases stehen die folgenden Ideen im
Raum: 

Lohnabrechnung elektronisch einreichen (ist bei
einigen Klienten jeden Monat nötig) 

Terminvereinbarungen 

Erinnerungen verschicken (für Termine, fehlende
Dokumente) 
 
 
 

Der Fokus in diesem
Projekt hat sich verändert: Dieses Projekt soll nicht mehr primär das Portal
gemäss Konzept realisieren und einführen, sondern als «Spielwiese» für neue
Ansätze in der Online-Klienten-Kommunikation dienen. Das Ziel ist, möglichst
rasch und konkret Praxis-Erfahrungen zu sammeln und für die Zukunft zu lernen.
Eine finale Umsetzung aller Portal-Module scheint erst im Rahmen von Aventis
Sinn zu machen. 

  

Die Auswahl der Use
Cases für eine pragmatische und iterative Umsetzung orientiert sich an den
folgenden Fragen: Wo entsteht für die Sozialdienste rasch ein Nutzen? Welche
Angebote würden von den Klienten auch genutzt? Mit welchen Mitteln kann ein
Angebot rasch umgesetzt werden? 

  

Die Diartis ist
grundsätzlich in der Steuerung, wird aber aktiv durch ein Kernteam beraten,
welches sich auch verpflichtet, die realisierten Angebote aktiv in der Praxis
zu nutzen und zu testen. Für die mitarbeitenden Sozialdienste ist es wichtig,
dass diese Angebote nur von den interessierten Sozialberatern genutzt werden
können, nur den Datenaustausch zwischen Sozialdienst und Klient betreffen, und
keinen Eingriff in die bestehenden Prozesse bedeuten. 
 

 

_____________________________________________________________________________________________________________________________________ 

 

 

Notizen aus Workshop "Aventis-Feature"- vom 18.02.2020 (Teilnehmer: Jke, Tab, Id, Mmi, Rma) 

 

Vorprüfung durch Klient selber (habe ich Anspruch?) 

Zuständigskeitsprüfung (z.B. Wohnsitz) 

Antrag online (Anmeldeformular mehrsprachig D/F) 

Checkliste der notwendigen Dokumente (je nach Klientensituation) 

Möglichkeit Dokumente hochzuladen 

Übermittlung an Aventis 

Verknüpfung mit Website des Sozialdienstes 
 

Input von Stakeholder:  

Schnittstellen zum Klient: Klient sollte mir noch rasch ein Dokument übermitteln

### Features

| # | Feature | ADO # | Status | Beschreibung |
|---|---------|-------|--------|--------------|
| 1 | Klienten-Portal / Krankenkassen Abrechnung elektronisch? | #87190 | New | Im Innovationsprojekt "Klienten-Online-Portal" wird der Einsatz von Threema geprüft. todo: Krankenkassen: Klient/innen erhalten Versicherungspolicen, KK-Prämien-Rechnung, Selbstbehalt-Rechnungen el... |
| 2 | Kt. VS: Bescheinigung Sozialhilfeschuld - Portail Attestations (via Mendix) | #180630 | Design | Gemäss Change Request 14285165 Orientierung (Kontext / Warum) Übersicht über die Situation und das Problem Le VS va mettre en oeuvre un portail externe à aventis qui permettrait d'imprimer des atte... |

---

## Konfiguration und Parametrierung (ADO [#147348](https://diartis.visualstudio.com/Aventis/_workitems/edit/147348))

**Status:** In Progress | **Area:** Aventis

**Beschreibung:**

(Auszug aus der Produktstrategie/22.4.25/jke) 
 

Trotz der Standardentwicklung muss die Lösung an
verschiedene Umgebungen und Kundenbedürfnisse angepasst werden können. Es
werden folgen Möglichkeiten unterschieden: 
 
 
 

Konfiguration 
 
 

„Unter Konfiguration versteht man das Zusammenstellen einer Software aus
verschiedenen Modulen und dem „Verknüpfen“ dieser Module. Diese Module stammen
vom Hersteller des Softwaresystems oder von Dritten (z.B. Plugins) oder sie
wurden massgeschneidert entwickelt.“ 

Parametrierung 
 
 

„Parametrierung von Software: die Anpassung einer Software an den gewünschten
Funktionsumfang durch setzen von Parametern.“ 

  

Zusätzlich kann unterschieden werden, wer die entsprechende
Konfiguration oder Parametrierung vornimmt: 
 
 
 

Diartis 

Kunde (IT des Kunden) 
 
 

 Es gibt keine generelle architektonische Lösung für die
beiden Bereiche in der aventis Lösung. Spezifisch werden Features und UseCases
über die Parametrierung anpassbar gemacht. Aufgrund der wenig geplanten Kunden,
wird versucht die Lösung nur dort anpassbar zu machen, wo dies zwingend
notwendig ist, um den Entwicklungs- und Wartungsaufwand zu reduzieren. Eine
Übersicht über anpassbare Features ist hier dokumentiert: https://diartis.visualstudio.com/Aventis/_wiki/wikis/Aventis.wiki/1487/Konfigurations-Checkliste 

 

(Historie früherer Inhalt) 
 

6.1.2025 Ergebnisse der Analysen: 
 

Wiki Seite bietet Überblick Konfiguration - Overview 

Es wurde bewusst abgegrenzt, dass Parametrierungen durch Bereich Services oder Kunden bereits jetzt vorgenommen werden können, dies ist im Backlog bereits adressiert und eingeplant. 

Bei den Wertelisten, gibt es Bedarf an mehr Parametrierbarkeit als bisher vorgesehen.  

Auch bei Checklisten (zB. Subsidiaritätsliste, entscheidrelevante Dokumente) muss eine Konfigurierbarkeit möglich sein (auch Feedback VS und in Lot3 geplant).  

Einschätzung SPO:  

Wir sind auf Kurs und werden bewusst entscheiden, was zu welchem Zeitpunkt umgesetzt wird und parametrierbar sein soll (analog jetzigem Prozess). 

Das aventis Team hat aus Erfahrung die richtigen und wichtigen Funktionen parametrierbar gemacht. 

Wir werden Differenzen vom aventis Standard zu Anforderungen aus Ausschreibungen nur punktuell mit reiner Parametrierung beantworten können. -> das sollte am Strategie-Workshop vom 14.2.25 thematisiert werden. 

Allenfalls noch zu klären, was technisch machbar ist, nebst der Parameter-Bibliothek wo Konfigurationen wie Dokumentenvorlagen etc. für Kunden versionierbar und unabhängig von einem Clean-DB und neuen Versionen der Software integrierbar sind. 

Layer um Masken anzupassen oder Wordingthemen durch Kunden zu bewirtschaften. 

jke gibt Auftrag an rma für technische Machbarkeit 

Pflichtfelder pro Kunde konfigurierbar 

Felder umbenennen (im gleichen Kontext) 

zusätzliche Felder hinzufügen 

Mouseover "ursprüngliche" Bezeichnung anzeigen 
 
 
 

Haltung: 

aventis soll wo sinnvoll flexibel sein aber benutzerfreundlich bleiben, ohne unnötige Komplexität einzuführen.
 

Dies ist nebst ein paar Grundsatzentscheiden im Handling, eine situative Entscheidung, die im Rahmen des Entwicklungsprozesses mitgedacht werden muss oder bei Optimierungen umgesetzt werden kann. 

Wir orientieren uns an den SKOS Richtlinien als Richtwerte im Bewusstsein, dass diese für unsere Kunden nicht verpflichtend sind. 

Operation: Automatisierung und einfache Parametrierung in aventis. Team miteinbeziehen in Umsetzung wenn es um Masken geht. 
 
 
 
************************************* 

Haltung: Konfigurationen werden nur wo unbedingt nötig und sinnvoll durch unsere Kunden selber gemacht. Entweder bieten wir den Service an oder können dann irgendwann SuperUser oder IT-Fachpersonen unserer Kunden soweit schulen, dass sie aventis selber konfigurieren können.  

 

Kundenübergreifende Änderungen müssen rasch möglichst umgesetzt und ausgeliefert werden können.

### Features

| # | Feature | ADO # | Status | Beschreibung |
|---|---------|-------|--------|--------------|
| 1 | Aufbau, Konfiguration Testumgebung (nicht VS) | #153829 | Removed | Dieses Feature umfasst weitergehende Konfigurationsthemen welche für die UAT- und den GO-Live von VS nicht notwendig sind: Sammlung von Ideen und möglichen Optimierungen: Konfigurationslöschungen a... |
| 2 | Aufbau, Konfiguration Testumgebung (ursprünglich 3/3) | #153830 | Removed |  |
| 3 | Individuelle Konfiguration Konti (nach VS) | #175446 | New | Titel > Selbsterklärend, um was es bei diesem Item geht Orientierung (Kontext / Warum) Übersicht über die Situation und das Problem Absicht / Nutzen (Was) Gibt das gewünschte Ergebnis oder die gewü... |
| 4 | Individuelle Konfiguration Konti, WSH-Konto-Parameter Klientenbuchhaltung | #90000 | Dev done | Legende: Noch umzusetzen in Lot3 In Ausblick/Weiterausbau Grundsätze / Anforderungen Kontenplan: Der Kontenplan der Klientenbuchhaltung soll zu einem grossen Teil (insbesondere Erfolgskonti) von ei... |
| 5 | Mandantenfähigkeit | #87952 | Done | Kunden-Ziel: Administrativer Aufwand/Kosten verringern Als Applikationsverantwortlicher/IT-Verantwortlicher von mehreren Installationen von Aventis will ich möglichst Programmfehler und Wartungskos... |
| 6 | Online Hilfe - Fachhilfe-Link konfigurieren | #176793 | Dev done | aus Feature 90000 Individuelle Konfiguration Konti, WSH-Konto Klientenbuchhaltung rausgelöst. Orientierung (Kontext / Warum) Fachhhilfelinks: auf "jeder" Maske sollen Links auf eine bestimmte URL k... |
| 7 | Parameter-Bibliothek - Teil 2 | #173004 | Design | Konfigurations-Layer Die Konfiguration ist aktuell zugeschnitten auf das VS-Projekt und einige Einstellungen können nur durch das Entwicklungsteam vorgenommen werden. Ein Konfigurations-Layer, welc... |
| 8 | Parameter-Bibliothek (ersetzt den Begriff Konfigurations-Kiosk) - Teil 1 | #99034 | Done | (für die Synchronisierung von Konfigurationen über mehrere Mandanten Einfache Handhabung der Mandantenfähigkeit für #90000 Version 1.0: Gutes Hilfsmittel, um Datenbanken möglichst automatisch betri... |
| 9 | Pro Kunde individuelle Features / Module / Fachlösungen | #86619 | New | Diskussion wieder aufnehmen, sobald konkrete Beispiele vorhanden sind. Nicht möglich zum jetzigen Zeitpunkt 22.5.25/rma Abgleich mit Stefan > für die Konfiguration (welcher Kunde hat welches Modul/... |
| 10 | Wiederkehrende Anpassung SKOS-Richtlinien (z.B. Teuerung)  | #109240 | New | Eine schnelle Umsetzung (alle laufenden Fälle sind davon betroffen) ist wünschenswert (Zeitersparnis für SAR). 28.1.25/rma: Zu prüfen, Abgrenzung zu Feature "Pro Kunde individuelles Feature" #86619... |

---

## Sicherheit - Security (ADO [#176535](https://diartis.visualstudio.com/Aventis/_workitems/edit/176535))

**Status:** In Progress | **Area:** Aventis

**Beschreibung:**

Regelmäßige Sicherheitsaudits sind ein unverzichtbarer Bestandteil verantwortungsvoller Softwareentwicklung. Sie tragen dazu bei, Risiken zu minimieren, gesetzlichen Anforderungen gerecht zu werden und das Vertrauen von Kunden und Partnern zu erhalten. 

 

Neue Sicherheitslücken erkennen 

Sicherheitsbewusstsein im Team fördern 

Schutz vor Reputations- und finanziellen Schäden 

Frühzeitige Risikoerkennung spart Kosten

### Features

| # | Feature | ADO # | Status | Beschreibung |
|---|---------|-------|--------|--------------|
| 1 | Disaster Recovery | #178129 | In Progress | Orientierung (Kontext / Warum) Infrastruktur in der Regel ist die Verantwortlichkeit ausserhalb der Diartis. Im Beispiel unseres ersten Kunden Wallis ist Bedag verantwortlich. Umfasst die Wiederher... |
| 2 | Security Code Review 2024/2025 | #148465 | Done | Security Code Review Durchführung eines Security Code Reviews mit einem externen Partner. Abstimmung bezüglich Penetration Tests und Anpassung der bestehenden Runs Next Steps Angebot definieren und... |
| 3 | Security Code Review 2027 | #176536 | New | ext-Kopie aus 2024/2025: Security Code Review Durchführung eines Security Code Reviews mit einem externen Partner. Abstimmung bezüglich Penetration Tests und Anpassung der bestehenden Runs Gemäss Q... |
| 4 | Security Detectify 2024/2025 | #151048 | Done | Integration Detectify in den Build/Deployment Prozess von Aventis Review der Resultate als Part des internen Security Audits Die regelmässige Prüfung (PEN-Tool) ist in jedem Sprint eingeplant (als ... |
| 5 | Security Scan Befunde 2027 | #176539 | New | Pro Sprint werden die Task erstellt, um WH - Detectify laufen zu lassen und auszuwerten. Falls es Befunde gibt, die korrigiert werden müssen, dann sind sie über dieses Budget zu bearbeiten. |
