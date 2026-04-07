# Zahlungen & Buchhaltung

> Automatisch generiert aus ADO Epics. Letzter Sync: 2026-03-12T15:35:06.013Z
> Nicht manuell bearbeiten -- wird beim naechsten Sync ueberschrieben.

---

## Zahlungen (ADO [#87186](https://diartis.visualstudio.com/Aventis/_workitems/edit/87186))

**Status:** In Progress | **Area:** Aventis

**Beschreibung:**

(Auszug aus der Produktstrategie/22.4.25/jke)  

aventis ist nur inklusive Buchhaltung konzipiert, die
Fallführung und die Buchhaltung sind technisch und funktional eng gekoppelt. 

 

Zahlungen setzen in der Regel ein Konto der Klientel bei
einer Bank oder der Post voraus. Es können in aventis auch Barauszahlungen
gemacht werden. 

Rechnungsverarbeitung 

Zahlungsverkehr 

Belegkorrekturen 

 
 

(Historie früherer Inhalt)  

Der Zahlungsverkehr in Aventis setzt ein Konto der Klientel bei einer Bank oder Post voraus. 

Barauszahlungen werden als pragmatischer Auszahlungsweg unterstützt (Entscheid CAB vom 23.03.22 https://diartis.visualstudio.com/Aventis/_workitems/edit/138544). Wallis macht regelmässig Barauszahlungen. Im Business Development werden Alternativen zur Barauszahlung weiterverfolgt (Twint, Socialcard). Bis aber eine umsetzbare Lösung vorhanden ist, muss die Möglichkeit gegeben sein, Barauszahlungen durch Aventis zu veranlassen. Pragmatische, möglichst einfache Umsetzung.  

 

Elektronische Verarbeitung von Zahlungs-Eingängen und Ausgängen 

Entscheide und Verbuchung von Rechnungen - voll elektronisch
 

Moderner, schneller und sicherer Kommunikationsweg für die Bankgeschäfte via EBICS-Schnittstelle (aktuell in Prüfung bei Dg) 

 

Qualitätskontrolle Datenerfassung 
 

Sachbearbeiter-1 erfasst, Sachbearbeiter-2 kontrolliert und fragt via Kompetenzen Freigabe an.  

Nachvollziehbarkeit: Erfasser, Qualitätskontrolle, Kompetenz/Bewilligen, Freigeben zur Auszahlung  

 

IBAN-Service in der Cloud 

 

Abbildung/Unterstützung der digitalen Prozesse: Zahlungsverkehr, Eingang, eBill, etc. -> kein Papier mehr

**Akzeptanzkriterien:**

Der Leistungsentscheid und die Freigabe von Auszahlungen sind voll elektronisch
 

 

Rechnungserfassung ist automatisiert (Rechnung wird eingescannt, Daten werden erkannt): mit max. 3 Klicks ist die Rechnung im System bereit für die Bezahlung (visiert, gebucht, bezahlt). 
 

 

Schnittstelle zu Bank/Post funktioniert ohne Medienbruch und in Echtzeit. Zahlung wird in Aventis freigegeben und im Hintergrund automatisch ausgelöst und an das Zahlungsinstitut übermittelt. 

 

Besprechung und Abmachung vom 29.03.2022 (bh, jke, awa, tab):  

 

Kommunikation mit EBICs ist schwierig, da mit verschiedenen Banken kommuniziert werden muss 

Task Evaluation EBICS Schnittstelle bh 
 

 

Camt053 muss manuell durch Kunde im E-Banking geholt werden 

Upload pain001 braucht 4Augen-Prinzip, daher geht das immer manuell über eBanking 

Man könnte automatisch hochladen und im eBanking noch freigeben lassen - momentan abgegrenzt 
 

Downloadverzeichnis, wo camt053 Dateien reinkommen, dies wird überwacht und wird automatisch in Aventis reingeladen 

Version 1.0 manueller Arbeitsschritt, später automatisieren 

SaaS – Datei muss in Cloud kommen 

Verzeichnis überwachen, technische Umsetzung schaut bh mit aso an 

Regelsystem von KiSS übernehmen, hat bei Testdaten geklappt, ist noch nicht im Betrieb erprobt - dennoch ist es vielversprechend. Bisher wird in FibuSync vor allem die Regelerfassung als arbeitsaufwändig wahrgenommen 
 

  

Anforderungen VS:  

 

Auslandzahlungen müssen möglich sein, Spesenfolge für Kunden, in CHF, keine Währungsumrechnungen 

Ausländische Bankenstamm muss manuell gepflegt werden, in Verantwortung der Kunden

### Features

| # | Feature | ADO # | Status | Beschreibung |
|---|---------|-------|--------|--------------|
| 1 | Auszahlung für Klienten ohne Bankkonto (für Kunden ohne Kasse) | #155703 | New | 19.4.23/jke Für Kunden die aus Sicherheits- oder anderen Gründen keine Kasse führen wollen, aber auch keine Bank oder Post in der Nähe haben die ihre Vollmachten akzeptieren, sollen die Möglichkeit... |
| 2 | Belegkorrekturen: Behandlung Rückläufer (Feature 1/5) | #90002 | Done | Grundsätze / Anforderungen Verbuchte Belege können nicht verändert oder gelöscht werden Buchungsrelevante Änderungen an Belegen (Betrag, Kontierung) müssen mittels Storno- und Neubuchung erfolgen (... |
| 3 | Belegkorrekturen: Buchungskorrektur, Storno Ausgangszahlung (Feature 4/5) | #161461 | Done | Gesplittet aus #90002 Grundsätze / Anforderungen Verbuchte Belege können nicht verändert oder gelöscht werden Buchungsrelevante Änderungen an Belegen (Betrag, Kontierung) müssen mittels Storno- und... |
| 4 | Belegkorrekturen: Korrekturen aus Rahmenbudget  - Abgelehnte Zahlungsaufträge (Feature 2/5) | #144844 | Done | Gesplittet aus Belegkorrekturen #90002 Grundsätze / Anforderungen Aufgrund Entscheid: Belegkorrektur-Maske wird nicht umgesetzt, sondern eine evtl. Korrektur muss wieder via Stammdaten > Rahmenbudg... |
| 5 | Belegkorrekturen: Korrekturen aus Rahmenbudget - Korrektur SIL (Feature 3/5) | #152864 | Done | Gesplittet aus #144844 bzw. #90002 Grundsätze / Anforderungen Ziele Beispiel von Problematiken Attribute Regeln Abgrenzung aus PBI #151339 : Empfänger ändern (Klientschaft -> Dritte, Dritte -> Klie... |
| 6 | Belegkorrekturen: Storno Ausgangszahlung, Änderung Auszahlungsmodus (Feature 5/5) | #164490 | Done | Gesplittet aus #161461 Der Zahlungsempfänger kann angepasst werden, solange die Ausgangszahlung noch nicht ausbezahlt wurde #163621 Eine Ausgangszahlung kann storniert werden, solange sie noch nich... |
| 7 | E-Rechnung | #139808 | New | Wir als Privat-Personen haben die Möglichkeit unsere Rechnungen via eBill in unser eBanking-System ausgeliefert zu bekommen und mit einem Klick (oder via Dauerfreigabe aufgrund bestimmter Kriterien... |
| 8 | Leistung Soforthilfe: "Vorbuchung und Auszahlung, Zuständigkeit, Umwandlung in Vorschuss WSH, Definition UE" (Feature 2/2) | #159303 | Removed | Dieses Feature ist ein Update des #89164, und beinhaltet gegenüber diesem Rückmeldungen des Kantons Wallis zur Soforthilfe. Das Update beinhaltet: Bearbeiten des Soforthilfe-Betrags nach Bewilligun... |
| 9 | Leistung Soforthilfe: Vorbuchung und Auszahlung, Zuständigkeit, Umwandlung in Vorschuss WSH, Definition UE (Feature 1/2) | #89164 | Done | ​Grundsätze Gemäss SKOS: Ein Notfall liegt grundsätzlich nur dann vor, wenn jemand sachlich und zeitlich dringender Hilfe bedarf. Notfallunterstützung kann gewährt werden. Die Sozialhilfeorgane sin... |
| 10 | Mandantenbuchhaltung (Platzhalter für Notizen) | #89841 | Removed | Spezialitäten der Mandantenbuchhaltung für die Beistandschaften sicherstellen wie z.B. die 2-jährige Rechnungsperiode --> besser Feature 115708 nutzen (ist auf Wallis-Liste) |
| 11 | Zahlungen: Auto-Freigabe (Feature 5/5) | #144720 | Removed | Gesplittet aus Feature 89169 #89169 Grundsätze / Anforderungen Der Bedarf und das Einkommen wurde im Rahmenbudget; gemäss #89165; #89166; #89167 #92931 und #92932 sind erfasst. Das Rahmenbudget ist... |
| 12 | Zahlungen: Fertigstellung/Feedback VS | #161434 | Done | Grundsätze / Anforderungen Sozialarbeiter/Sachbearbeiter erfasst die Rechnung inkl. Finanzierung (bewilligte Rahmenbudget-Position auf Rechnung, Kostengutsprache, Rückbehalt, neue Rückforderung ode... |
| 13 | Zahlungen: KES - Vermögensverwaltung | #182957 | New | Feature wird noch weiteraufgeteilt. Kandidaten: Rechnungen Barauszahlungen Dossierübergreifende Zahlungen pro Bank |
| 14 | Zahlungen: Spezialfälle (Feature 4/5) | #145324 | Done | Gesplittet aus #89169 Grundsätze / Anforderungen Das Rahmenbudget ist die Grundlage, um die Unterstützungsleistungen zu berechnen und mittels einer Verfügung zu gewähren. Diese Verfügung hat einen ... |
| 15 | Zahlungen: Teilzahlung (Feature 2/5) | #153049 | Done | Gesplittet aus Feature #89169, bzw. aus #145324 damit die Funktionalität "Teilauszahlung" vor dem Feature 145324 Spezialfälle umgesetzt werden kann. Grundsätze / Anforderungen Ziele Beispiel von Pr... |
| 16 | Zahlungen: Vorschuss/Rückbehalt (Feature 3/5) | #159607 | Done | Gesplittet aus #89169 Grundsätze / Anforderungen Rechnungen können bezahlt werden und dem Klienten bei der nächsten Zahlung in Abzug gebracht werden (Vorschuss). Mit dem Rückbehalt kann auf ein bes... |
| 17 | Zahlungen: Zahlungsempfänger/in, Zahlungsinformationen, Zahlung aufteilen (Feature 1/5) | #89169 | Done | Grundsätze / Anforderungen Der Bedarf und das Einkommen wurde im Rahmenbudget; gemäss #89165; #89166; #89167 #92931 und #92932 sind erfasst. Das Rahmenbudget ist die Grundlage, um die Unterstützung... |
| 18 | Zahlungseingänge verarbeiten: Clearingmaske (Feature 1/3) | #89999 | Done | Grundsätze / Anforderungen ✔Kontoauszüge/Gutschriftsanzeigen im standardisierten ISO-Format können importiert werden (UC:005/US:141788) ✔Die Verarbeitung von Zahlungseingängen kann mit Capturing ve... |
| 19 | Zahlungseingänge verarbeiten: Fertigstellung (Feature 2/3) | #149102 | Done | ToDo mit Rma (während Bereinigungs-Abgleich): bei jedem Bullet-Listenpunkt klären: machen wir das oder verschieben wir die Story auf nach V1.0? Gesplittet aus Feature #89999 Grundsätze / Anforderun... |
| 20 | Zahlungseingänge verarbeiten: Optimierung (Feature 3/3) | #144840 | New | Gesplittet aus Feature #89999 Grundsätze / Anforderungen Kontoauszüge/Gutschriftsanzeigen im standardisierten ISO-Format können importiert werden (UC:005/US:141788) Die Verarbeitung von Zahlungsein... |
| 21 | Zahlungseingänge: Zuordnung Erwartete Einnahme | #162647 | Design | Orientierung (Kontext / Warum) Übersicht über die Situation und das Problem Zahlungseingänge Besteht bei Eintreffen eines Zahlungseingangs noch keine erwartete Einnahme, kann eine solche in der Zah... |
| 22 | Zahlungsverkehr mit Banken; inkl. Auslandzahlung | #89160 | Done | Grundsätze / Anforderungen Kreditorbuchungen können als Zahlungsauftrag z.L. Bank-/Postkonto ausgeführt werden ✅ Die Zahlungsdatei kann in ein eBanking hochgeladen und dort freigegeben werden ✅ Der... |
| 23 | Zahlungsverkehr mit Banken: Weiterentwicklung | #182456 | New | Titel > Selbsterklärend, um was es bei diesem Item geht Orientierung (Kontext / Warum) Übersicht über die Situation und das Problem Absicht / Nutzen (Was) Gibt das gewünschte Ergebnis oder die gewü... |

---

## Buchhaltung (ADO [#167871](https://diartis.visualstudio.com/Aventis/_workitems/edit/167871))

**Status:** In Progress | **Area:** Aventis

**Beschreibung:**

(Auszug aus der Produktstrategie/22.4.25/jke)  

aventis ist nur inklusive Buchhaltung konzipiert, die Fallführung und die Buchhaltung sind technisch und funktional eng gekoppelt. 
 
 

 

Die Buchhaltung in aventis wird als Nebenbuch und
im System der doppelten Buchhaltung geführt. Es können Klientenbuchhaltungen für Wirtschaftliche Sozialhilfe und Freiwillige Einkommensverwaltungen sowie für Mandatsbuchhaltungen geführt werden.

### Features

| # | Feature | ADO # | Status | Beschreibung |
|---|---------|-------|--------|--------------|
| 1 | Barauszahlung:  Generierung Barbeleg, Barbeleg Abwicklung (Feature 1/2) | #142660 | Done | Grundsätze / Anforderungen Derzeit haben die meisten SMZ im Wallis eine Kasse, die recht regelmäßig genutzt wird (z.B. über 100 Quittungen für das SMZ Martigny im Jahr 2020) und möchten dies für Fä... |
| 2 | Barauszahlung: Kassenbeleg - Beleg an Buchung hängen (Feature 2/2) | #152861 | Done | Gesplittet aus Feature #142660 Grundsätze / Anforderungen Ziele Beispiel von Problematiken Attribute Regeln Prozess des Barbeleges wirtschaftliche Sozialhilfe: freigeben durch SAR (bestehende Maske... |
| 3 | Belegfluss (WSH) | #87949 | Done | Grundsätze / Anforderungen Vom Capturing-Modul vollständig ermittelte Daten werden vom Fachmodul (WSH) übernommen, um die Daten weiterzuverarbeiten WSH: z.B: Rechnung: Auszahlung veranlassen, Mietv... |
| 4 | Buchen | #167904 | Done | Als Buchhalter/in möchte ich über das Buchungsdatum der Buchungen bestimmen können, damit eine periodengerechte Verbuchung möglich ist. |
| 5 | Buchungen ohne Klienten- und Dossierbezug | #160871 | Done | Orientierung (Kontext / Warum) aventis ist eine Fallführungssoftware und kein Buchhaltungsprogramm. Diese strategische Stossrichtung wird beibehalten. Analysiert werden soll, welche Schritte nötig ... |
| 6 | Mandatsbuchhaltung: todo aufsplitten | #182958 | New | Feature wird noch aufgesplittet, z.B. in Mandatsbuchhaltung (Basis FEV): dieses Feature Bilanz)/Mehrer Konten führen: dieses Feature Spezifische Berichte (Vermögensbericht: neues Feature Budget KES... |
| 7 | Nachvollziehbarkeit - Revisionssicherheit | #171051 | In Progress | Orientierung (Kontext / Warum) Gemäss OR Art. 957a sind die Grundsätze einer ordnungsgemässen Buchhaltung: 1. die vollständige, wahrheitsgetreue und systematische Erfassung der Geschäftsvorfälle un... |
| 8 | QR - Rechnungen erkennen und verarbeiten (Feature 2/2) | #154866 | Done | Grundsätze / Anforderungen Rechnungen mit QR-Zahlteil (QR-Rechnungen) werden effizient verarbeitet, sprich: die im QR-Code enthaltenen Daten werden erkannt und automatisch interpretiert/verarbeitet... |
| 9 | Vorbuchungen aus WSH-Modul in Buchhaltung importieren : ohne Belege (Feature 1/2) | #90001 | Done | Grundsätze / Anforderungen Positionen aus dem Fachmodul werden im Fachmodul mittels Attribut als "Bereit zum Import" markiert Der Buchhalter initiiert den Übergang der Daten vom Fachmodul in die Bu... |
| 10 | Vorbuchungen aus WSH-Modul in Buchhaltung importieren: mit Belege (Feature 2/2) | #142577 | Dev done | Gesplittet aus #90001 Grundsätze / Anforderungen Positionen aus dem Fachmodul werden im Fachmodul mittels Status: "Freigegeben" als "Bereit zum Import" markiert Der Buchhalter initiiert den Übergan... |
| 11 | WSH-Rechnung Erfassung, Sammelrechnung - Feature 3/3 | #157389 | Done | Gesplittet aus #94487 Anforderungen Es muss möglich sein, eine Rechnung zu erfassen, deren Detailpositionen zu verschiedenen Dossiers gehören Beispiele: Sammelrechnung von Verkehrsverbund-Abos jede... |
| 12 | WSH-Rechnung Erfassung, Zuweisung zu KoGu (mit Freigabe) - Feature 2/2 | #148525 | Done | Gesplittet aus Feature #94487 Brainstorming (auch im Rahmen des UCs berücksichtigen/umsetzen) Bei Rechnungsfreigabe müssen mehr Informationen im DropDown der Anspruchsposition angezeigt werden Inst... |
| 13 | WSH-Rechnung Erfassung, Zuweisung zu KoGu (ohne Freigabe) - Feature 1/2 | #94487 | Done | Grundsätze / Anforderungen Extrahierte Daten aus eingescannten Belegen werden übernommen und können in der Maske effizient vervollständigt werden Erfasste Rechnungen werden einem Monatsbudget zugew... |
| 14 | WSH-Rechnung: Freigabe und Verwendungsperiode | #181913 | Design | Orientierung (Kontext / Warum) aus Vorgänger Feature: Rechnungen: Freigeben und zur nächsten RechnungTO TO Maske Rechnung freigebenMaske Rechnungen freigeben, VS Wunsch direkt im Edit-Modus zu blei... |
| 15 | Zwischen- und Jahresabschluss | #171709 | Dev done | Orientierung (Kontext / Warum) Der periodische Abschluss der Buchhaltung muss für jeden Dienst stattfinden. Damit werden nicht nur gesetzliche Vorschriften eingehalten, sondern auch Verbesserungspo... |
