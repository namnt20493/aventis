# Bewilligung & Fallsteuerung

> Automatisch generiert aus ADO Epics. Letzter Sync: 2026-03-12T15:35:06.013Z
> Nicht manuell bearbeiten -- wird beim naechsten Sync ueberschrieben.

---

## Fallsteuerung (ADO [#88168](https://diartis.visualstudio.com/Aventis/_workitems/edit/88168))

**Status:** In Progress | **Area:** Aventis
**Tags:** Ordnungsgemässe Geschäftsführung

**Beschreibung:**

(Auszug aus der Produktstrategie/22.4.25/jke) 
 

 

In der Fallsteuerung werden die Ressourcen und die Organisation des Dienstes berücksichtigt und gesteuert. Damit aventis die geltenden Steuerungsmechanismen berücksichtigen kann, werden hier  

Kompetenzen 

Bewilligungsworkflow 

Zeiterfassung 

Ressourcensteuerung  
 

konfiguriert und umgesetzt. 
 

 

(Historie früherer Inhalt)  

Beschreibung früherer Titel Nachvollziehbarkeit, Controlling von bh: 

Konsolidierung diverser Ansätze (Logisches Löschen, History-Band, History-Button Dokument)  

 

Es muss nachvollziehbar sein, wer wann den Datensatz erstellt, bearbeitet, ev. gelöscht hat. 

Es muss nachvollziehbar sein, wer wann das Dokument erstellt, bearbeitet, ev. gelöscht hat.  

 

Aventis-Modul WSH: 

Leistungsentscheide und Leistungsperioden abbilden
 

 

Qualitätskontrolle Datenerfassung:  

Sachbearbeiter-1 erfasst, Sachbearbeiter-2 kontrolliert und
fragt via Kompetenzen Freigabe an[AT1] [TA2] .  

Nachvollziehbarkeit: Erfasser, Qualitätskontrolle,
Kompetenz/Bewilligen, Freigeben zur Auszahlung  

 

Ordnungsgemässe Geschäftsführung bzw. offizielle Software-Zertifizierung:  

Entscheid 18.6.2020 Bh: Auf Vorrat machen wir keine Zertifizierung. Also vorerst zurückgestellt.

**Akzeptanzkriterien:**

Version 1.0: 

Berechtigungs-Änderungen, Lese- und Schreibzugriffe werden für Datenschutz-Audits protokolliert und sind für den Systemadministrator einsehbar.

Version 1.ff: 

Ressourcensteuerung wird durch das System aktiv unterstützt. Bestätigung durch 2 Leitungspersonen.

### Features

| # | Feature | ADO # | Status | Beschreibung |
|---|---------|-------|--------|--------------|
| 1 | Bewilligungsworkflow: mit Kompetenz-Beträgen (Feature 4/4) | #141805 | New | -> In diesem Zusammenhang sollte die Veränderbarkeit des Rahmenbudgets und die Veränderung der Rahmenverfügung gelöst werden. Aktuell ist es nicht gut, dass die Veränderung ins die Rahmenverfügung ... |
| 2 | Bewilligungsworkflow: ohne Kompetenz-Beträgen (Feature 1/4) | #86638 | Done | ​ Grundsätze / Anforderungen Gewisse Funktionalitäten erfordern eine Freigabe durch 1 oder mehrere Personen Je nach Art der Funktionalität ist erforderlich, dass eine Person mit ausreichender Kompe... |
| 3 | Bewilligungsworkflow: Rahmenbudget - Rahmenbewilligung/Leistungsentscheid (Feature 3/4) | #155313 | Done | Gesplittet aus Feature #155313 Grundsätze / Anforderungen Ziele Beispiel von Problematiken Attribute Regeln Abgrenzung PBI 155690/Sprint 75: Die Bewilligung einer oder mehrere Einzelpositionen gehö... |
| 4 | Bewilligungsworkflow: Trennung Rahmenbudget / Rahmenverfügung (Feature 2/4) | #148009 | Done | 0Gesplittet aus #86638 damit das Rahmenbudget und die Rahmenverfügung getrennt werden. Meeting > 11.8.22 (Fabienne, Rahel, Janine) > Ergebnisse werden hier integriert Todo aus 123209 > in Story 149... |
| 5 | Kompetenzen und WSH-Konfiguration  | #87939 | Done | Grundsätze / Anforderungen Je nach Fachmodul können unterschiedliche Kriterien erfasst werden, für welche Datenkonstellationen ein Benutzer berechtigt ist, eine Freigabe zu erteilen ✅WSH: Beträge i... |
| 6 | Kompetenzen und WSH-Konfiguration: Standard - nicht VS relevant | #148501 | New | Gesplittet aus #87939 > bessere Visualisierung für Releaseplanung |
| 7 | Qualitätskontrolle Zahlungsverbindung (Personen-Institutionen): Fertigstellung (Feature 2/2) | #156586 | Done | Gesplittet aus #91622 |
| 8 | Qualitätskontrolle Zahlungsverbindung (Personen-Institutionen): Zahlungsverbindung prüfen (Feature 1/2) | #91622 | Done | Grundsätze / Anforderungen Das System soll sicherstellen, dass der Erfasser nicht seine eigenen Buchungen freigeben (sprich: Vorbeleg erstellen) kann (UC 007: 100856) Nach Abschluss der Erfassung s... |
| 9 | Ressourcensteuerung | #91428 | New | interne (SA, SB) Personalressourcen eines SD, Lastenverteilung, Stellvertretung |
| 10 | Schnittstelle zu Geschäftsverwaltungssystem | #139899 | New | Im Zusammenhang mit dem Bewilligungsprozess ist das Thema "Geschäftsverwaltungssystem" aufgetaucht. Aktuell grenzen wir das in Aventis klar ab. Also wir bieten keine Möglichkeit an, Traktanden, Bes... |
| 11 | Zeiterfassung (Dienstleistungskategorien) | #89921 | Done | Grundsätze / Anforderungen Ziele Beispiel von Problematiken Attribute Regeln Wallis-Anforderungen: zusätzlich 150h Effort besprochen mit Beat/Tom: reine Zeiterfassung (ohne Gleitzeit/Feriensaldo). ... |
