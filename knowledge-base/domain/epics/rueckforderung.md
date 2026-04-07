# Rueckforderung & Schulden

> Automatisch generiert aus ADO Epics. Letzter Sync: 2026-03-12T15:35:06.013Z
> Nicht manuell bearbeiten -- wird beim naechsten Sync ueberschrieben.

---

## Rückerstattungen / Rückforderungen / Ansprüche gegenüber Dritten (ADO [#89163](https://diartis.visualstudio.com/Aventis/_workitems/edit/89163))

**Status:** In Progress | **Area:** Aventis

**Beschreibung:**

(Auszug aus der Produktstrategie/22.4.25/jke)  

Es muss sichergestellt werden, dass rückforderbare
Leistungen der Klientschaft effizient behandelt/verwaltet werden können. 

Jeder Kanton hat eigene Gesetze betreffend Rückerstattungen
(z.B. Umfang, Aufteilung Kanton/Wohngemeinde/Bürgergemeinde, Zeitliche
Begrenzung, Verjährung) 

 
persönliche
     Rückerstattungen (rechtmässiger/untrechtmässiger Bezug) 

 
QR-Rechnung
     generieren 

 
Berechnung
     Sozialhilfeschuld 

 
Verrechnung
     mit Kanton und Gemeinde (Lastenausgleich) 

 
Verrechnung
     mit Dritten (z.B. SRK etc.) 

 
Verwandtenunterstützung/Elternbeiträge/Alimentenzahlungen
     verwalten 
 

 

Rückerstattung bei rechtmässigem Bezug (SKOS E.3.I) bei wesentlichen Veränderung.  

Rückerstattung bei unrechtmässigem Bezug (SKOS E.3.2) - Verletzung der Auskunfts- und Meldepflichten oder Zweckwidrige Verwendung von Sozialhilfeleistungen

**Akzeptanzkriterien:**

Version 1.0:

Rückerstattung erfolgen in elektronischer Form. Es muss kein Papier mehr hin und her geschickt werden.

Ausnahme: falls ein Dritter den elektronischen Austausch verhindert.

Metadaten können beim Scanning ausgelesen werden. Die Anreicherung der Metadaten verbessert sich laufend (keine Template-Lösung!)

Version 1.ff:

Posteingang erfolgt in elektronischer Form (Bsp. Leistungsabrechnungen der Krankenkassen)

### Features

| # | Feature | ADO # | Status | Beschreibung |
|---|---------|-------|--------|--------------|
| 1 | Debitorenmodul mit Sollstellung: Mahnen (Feature 4/11) | #145330 | Done | Gesplittet aus Feature #91618 Mittels einer Dossierliste können überfällige Rückforderungen gefunden werden in #145331 verschoben Für eine Rückforderung kann ein Mahnungsdokument generiert werden W... |
| 2 | Debitorenmodul mit Sollstellung: Rückforderbare Leistungen - Mahnlauf (Feature 9/11) | #145331 | Design | ​Gelb = nach Antwort von Tom überarbeiten Gesplittet aus Feature #91618 todo rma: violaText mit BA's zu prüfen mit Tab klären: hat die Umsetzung dieses Feature einen technischen Zusammenhang mit de... |
| 3 | Debitorenmodul mit Sollstellung: Rückforderbare Leistungen - weitere Typen (Feature 8/11) | #162125 | Done | Finaler Stand: Elternbeiträge sind noch nicht umgesetzt. Nur Verwandtenbeiträge Von den Einträgen im folgenden Screenshot sind nur "Elternbeiträge" relevant. Die weiteren Einträge wie "Erbschaft", ... |
| 4 | Debitorenmodul mit Sollstellung: Rückforderbare Leistungen: Elternbeiträge (Feature 3/11) | #91618 | Done | Todo aus UC 017 bzw. Input aus Test-Case VS 09: Test-Case VS 09 Elternbeitrag integrieren + SIL Sozialpädagogische Familienbegleitung + Institution ergänzenOffene Frage: in Test VS 09 wird ein Budg... |
| 5 | Debitorenmodul mit Sollstellung: Rückforderbare Leistungen: Fertigstellung / Korrektur: Schuldner bei Rückerstattungen (Feature 6/11) | #154992 | Done | Gem. Abgleich mit Janine v. 15.12.2023: Nur Rückmeldungen vom Wallis berücksichtigen sowie US: 159556 Abgrenzung aus PBI 159556/Sprint 70: Entscheid am Refinement: Bezüglich Zusammensetzung der UE ... |
| 6 | Debitorenmodul mit Sollstellung: Rückforderbare Leistungen: Gesundheitskostenrückforderungen - Selbstbehalt (Feature 10/11) | #159608 | Design | Gesplittet aus #91618 und #145329 Orientierung (Kontext / Warum) Übersicht über die Situation und das Problem Thema Selbstbehalt: Im Zusammenhang mit Monatsbudget wurde des Thema Selbstbehalt disku... |
| 7 | Debitorenmodul mit Sollstellung: Rückforderbare Leistungen: Krankenkasse/Arztrechnung (Feature 5/11)  | #145329 | Done | Gesplittet aus #91618 23.1.23/rma: Im Zusammenhang mit Monatsbudget #151233 wurde des Thema Selbstbehalt diskutiert. zu berücksichtigen bei der Spezifikation. Anforderungen VS Auszug aus 91618 ✔ Ar... |
| 8 | Debitorenmodul mit Sollstellung: Rückforderung (Feature 1/11) | #91619 | Done | Grundsätze / Anforderungen Rückerstattung bei rechtmässigem Bezug (SKOS E.3.I) bei wesentlichen Veränderung. Ziele Beispiel von Problematiken Attribute Regeln Wallis-Anforderungen: 124h Effort Der ... |
| 9 | Debitorenmodul mit Sollstellung: Schulderlass (Feature 2/11) | #91620 | Done | Grundsätze / Anforderungen Rückerstattung bei unrechtmässigem Bezug (SKOS E.1) - Unrechtmässig bezogene Leistungen müssen rückerstattet werden. Ein unrechtmässiger Bezug liegt vor, wenn Unterstützu... |
| 10 | Debitorenmodul mit Sollstellung: Übertrag an CMS (Feature 7/11) | #153371 | Done | Gesplittet aus #145330 bzw. aus 91619+91620+91618 Bei Rückforderungen soll der Rückzahlungsmodus jederzeit angepasst werden (monatlicher Abzug -> Zahlungseingang, Zahlungseingang -> monatlicher Abz... |
| 11 | Debitorenmodul mit Sollstellung: UI-Optimierungen Rückerstattungen / Vermögensverzehr (Feature 11/11) | #148547 | Design | Orientierung (Kontext / Warum) Übersicht über die Situation und das Problem Absicht / Nutzen (Was) Die Erfassung und Bearbeitung von Rückerstattungen ist einfach und effizient. Die relevanten Infor... |
| 12 | Debitorenmodul: Planung Rückforderung, Variable Beträge, Gesamtübersicht | #177718 | New | Orientierung (Kontext / Warum) Übersicht über die Situation und das Problem Weil finanzielle Unterstützung immer subsidiär zu den anderen Hilfsquellen geleistet wird, macht die Sozialhilfe grundsät... |
| 13 | Finanzielle Ansprüche gegenüber Dritten (Rahmenbudget) | #92932 | Done | Grundsätze / Anforderungen Gemäss SKOS F.1 Weil finanzielle Unterstützung immer subsidiär zu den anderen Hilfsquellen geleistet wird (vgl. Kapitel A.4), macht die Sozialhilfe grundsätzlich alle zul... |
| 14 | QR - Rechnung generieren (Feature 1/2) | #99055 | Done | Grundsätze / Anforderungen Die QR-Rechnung ist von Grund auf ein digitales Produkt. Auf dem neuen Einzahlungsschein (offiziell «Zahlteil QR-Rechnung» genannt) steht nicht mehr der Text im Vordergru... |
| 15 | Rückforderungen: Gesundheitskosten EL-Fälle (KES) | #182960 | New |  |
| 16 | Sozialhilfeschuld: eine WSH-Leistung (Feature 1/3) | #89157 | Done | Grundsätze / Anforderungen Berechnung der Sozialhilfeschuld, zu verschiedenen Zeitpunkten. Bestätigungen für andere Dienstleister, Behörden Ablösung Ziele Beispiel von Problematiken Attribute Regel... |
| 17 | Sozialhilfeschuld: Fertigstellung  (Feature 3/3) | #151713 | Done | Strukturierung Feature: Gesplittet aus 144870 > es besteht noch ein Rest-Effort, der ggf. für Feedback genutzt werden kann. Die Story 146175 zu diesem Feature verschoben, je nach Testrückmeldung se... |
| 18 | Sozialhilfeschuld: Haftung | #162646 | In Progress | Optimierungen bezüglich Erfassung der Haftungsdatensätze Details siehe Diskussion 17.4.2024 und Analyse Judith vom 6.10.2022 im Feature #151713 Orientierung (Kontext / Warum) Übersicht über die Sit... |
| 19 | Sozialhilfeschuld: mehrere Dossiers (Feature 2/3) | #144870 | Done | Gesplittet aus Feature #89157 VS Anforderungen Auszug aus 89157: Pro Klient alle S-Leistungen/Finanzplan-Perioden auflisten, in denen die Person Teil der UE ist/war (UC-100) Perioden, in denen die ... |
| 20 | Weiterverrechnung: Erstellung Abrechnung (Feature 1/4) - Kanton Wallis | #89158 | Done | Grundsätze / Anforderungen Weiterverrechnungs-Definition: Eine Weiterverrechnungs-Definition enthält: Intervall der Auswertung (Semester/Quartal) TBD: weitere? Jahr oder Monat Welche Konto sind gem... |
| 21 | Weiterverrechnung: Fertigstellung - Mandantenfähigkeit (Feature 3/4) | #155436 | Done | Gesplittet aus Feature #89158 |
| 22 | Weiterverrechnung: Kanton prüft Kostenauswertung (Feature 2/4) - Kanton Wallis | #145326 | Done | Gesplittet aus Feature #89158 Grundsätze / Anforderungen Ziele Beispiel von Problematiken Attribute Regeln Abgrenzung aus PBI 145397: Der Datensatz wird nicht readonly-blockiert, wenn ein Weiterver... |
| 23 | Weiterverrechnung: Rechnungsstellung Dritte (z.B. Rotes Kreuz) (Feature 4/4) | #145693 | Done | Gesplittet aus Feature #89158 Ist ein Kandidat für einen Workshop mit VS Notizen aus Workshop v. 09.11.2023 (ergänzende Notizen in OneNote: Refacturation Croix Rouge (Webansicht) ): Dans ASP pas d’... |
