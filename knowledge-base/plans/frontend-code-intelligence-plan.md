# Plan: Frontend-Code als Wissensquelle fuer Playwright-Agenten

## Ziel

Den Aventis Frontend-Quellcode (`C:\Git\Aventis\src\Aventis.Frontend`) systematisch analysieren und das gewonnene Wissen in die Knowledge Base einbauen, damit unsere Playwright-Agenten:

1. **Testfehler schneller diagnostizieren** (Locator passt nicht? -> Wir wissen genau wie die Komponente heisst)
2. **Stabilere Locators schreiben** (data-testid, Komponentennamen, CSS-Klassen direkt aus dem Source)
3. **Navigation verstehen** (Routing-Modul -> welche URL gehoert zu welcher Seite)
4. **Formulare korrekt bedienen** (Welche Felder sind Pflicht? Welche Validierung greift?)
5. **API-Endpunkte kennen** (fuer API-first Setup und Response-Waits)

---

## Phase 0: Zugang herstellen

### Problem
Der Playwright-Vault (`C:\Aventis_Playwright`) hat keinen Zugriff auf den Frontend-Code (`C:\Git\Aventis`). Alle Tools sind auf das Vault beschraenkt.

### Loesung: Symlink oder Kopie

**Option A: Symlink (empfohlen)**
```bash
# Im Vault-Root ausfuehren (als Admin)
mklink /D "frontend-src" "C:\Git\Aventis\src\Aventis.Frontend\src"
```
- Vorteil: Immer aktuell, kein Sync noetig
- Nachteil: Nur auf demselben Rechner, braucht Admin-Rechte
- `.gitignore` ergaenzen: `frontend-src/`

**Option B: Git Submodule**
```bash
# Falls Frontend in separatem Repo
git submodule add <frontend-repo-url> frontend-src
```
- Vorteil: Versioniert, reproduzierbar
- Nachteil: Braucht pull fuer Updates

**Option C: Periodische Kopie der relevanten Dateien**
```bash
# Script: scripts/sync-frontend-knowledge.ps1
$src = "C:\Git\Aventis\src\Aventis.Frontend\src"
$dst = ".\frontend-src"
# Nur relevante Dateien kopieren (kein node_modules, kein dist)
robocopy "$src\app" "$dst\app" /S /XD node_modules dist .angular
robocopy "$src" "$dst" "angular.json" "tsconfig.json"
```
- Vorteil: Funktioniert ueberall, kontrollierbar
- Nachteil: Manueller Sync

### Empfehlung
**Option A (Symlink)** fuer lokale Entwicklung. Ergaenzt durch ein Extraktions-Script (Phase 1), das die relevanten Informationen in die KB schreibt.

---

## Phase 1: Automatische Wissensextraktion (Scripts)

### 1.1 Routing-Map extrahieren

**Was:** Angular Routing-Module (`*-routing.module.ts` oder `app.routes.ts`) parsen -> URL-zu-Komponentennamen-Mapping.

**Warum:** Der Agent weiss dann bei einem `page.goto("/dossier/123/budget")`, welche Angular-Komponente geladen wird und welche Selektoren dort existieren.

**Output:** `knowledge-base/frontend/routing-map.md`

```markdown
## Routing Map (auto-generated)

| URL-Pattern | Angular Component | Modul |
|-------------|-------------------|-------|
| `/dossier/:id/budget` | BudgetOverviewComponent | BudgetModule |
| `/dossier/:id/klient` | KlientschaftComponent | KlientModule |
| `/dossier/:id/anspruch` | AnspruchComponent | AnspruchModule |
| `/dossier/:id/zahlungen` | ZahlungenComponent | ZahlungenModule |
| ... | ... | ... |
```

**Script:** `scripts/extract-routing-map.ts`
```typescript
// Parst alle *routing* files, extrahiert path + component
// Output: knowledge-base/frontend/routing-map.md
```

### 1.2 Komponenten-Selektor-Map extrahieren

**Was:** Alle Angular-Komponenten mit ihren `selector`-Werten, `data-testid`-Attributen und wichtigen CSS-Klassen.

**Warum:** Wenn ein Locator wie `page.locator("app-budget-position")` fehlschlaegt, weiss der Agent ob der Selektor korrekt ist oder ob die Komponente umbenannt wurde.

**Output:** `knowledge-base/frontend/component-selectors.md`

```markdown
## Component Selectors (auto-generated)

| Component | Selector | data-testid Attribute | Module |
|-----------|----------|----------------------|--------|
| BudgetPositionComponent | `app-budget-position` | `budget-row-{id}` | BudgetModule |
| DossierHeaderComponent | `app-dossier-header` | `dossier-title`, `dossier-status` | CoreModule |
| ... | ... | ... | ... |
```

**Script:** `scripts/extract-component-selectors.ts`
```typescript
// Parst @Component({ selector: '...' }) aus allen *.component.ts
// Grep nach data-testid in zugehoerigen *.component.html
// Output: knowledge-base/frontend/component-selectors.md
```

### 1.3 Formular-Felder und Validierungen extrahieren

**Was:** Alle ReactiveForm-Definitionen mit ihren FormControls, Validators und Labels.

**Warum:** Der Agent weiss dann:
- Welche Felder Pflicht sind (`Validators.required`)
- Welche Feldnamen im FormGroup existieren (fuer `getByLabel` oder `formControlName`)
- Welche Validierungsregeln greifen (min/max, pattern)

**Output:** `knowledge-base/frontend/form-definitions.md`

```markdown
## Wohnsituation-Formular

| FormControl | Label (i18n-Key) | Validators | Typ |
|-------------|------------------|------------|-----|
| `wohnkosten` | "Wohnkosten" | required, min(0) | number |
| `nebenkosten` | "Nebenkosten" | min(0) | number |
| `wohnart` | "Wohnart" | required | dropdown |
| `mietvertragVon` | "Mietvertrag von" | required | date |
```

**Script:** `scripts/extract-form-definitions.ts`

### 1.4 API-Service-Endpunkte extrahieren

**Was:** Alle Angular HttpClient-Aufrufe mit URL-Patterns, HTTP-Methoden und Request/Response-Types.

**Warum:**
- Fuer `waitForResponse(url)` in Playwright -> exakte URL-Patterns
- Fuer API-first Testdaten-Setup -> wir wissen welche Endpoints existieren
- Fuer Diagnose: "Warum kommt kein Response?" -> Endpoint pruefen

**Output:** `knowledge-base/frontend/api-endpoints.md`

```markdown
## API Endpoints (auto-generated)

| Service | Method | URL Pattern | HTTP | Used By |
|---------|--------|-------------|------|---------|
| BudgetService | getBudget() | `/api/budget/{dossierId}` | GET | BudgetOverviewComponent |
| BudgetService | saveBudgetPosition() | `/api/budget/{dossierId}/position` | POST | BudgetPositionDialog |
| DossierService | getDossier() | `/api/dossier/{id}` | GET | DossierHeaderComponent |
| ... | ... | ... | ... | ... |
```

**Script:** `scripts/extract-api-endpoints.ts`

### 1.5 Navigation-Struktur (Menue/Sidebar) extrahieren

**Was:** Die Seitennavigation (Sidebar-Links, Tab-Struktur) aus den HTML-Templates.

**Warum:** Der Agent weiss genau welche NavLinks es gibt, wie sie heissen und wohin sie fuehren. Kritisch fuer `clickNavLink()`-Probleme.

**Output:** `knowledge-base/frontend/navigation-structure.md`

```markdown
## Dossier-Navigation (Sidebar)

| Nav-Label | Route | Icon | Berechtigungs-Guard |
|-----------|-------|------|---------------------|
| Uebersicht | `/dossier/:id` | dashboard | - |
| Klientschaft | `/dossier/:id/klient` | person | - |
| Anspruchspruefung | `/dossier/:id/anspruch` | check_circle | canAccessAnspruch |
| Rahmenbudget | `/dossier/:id/budget` | account_balance | canAccessBudget |
| Zahlungen | `/dossier/:id/zahlungen` | payment | canAccessZahlungen |
```

---

## Phase 2: Knowledge-Base-Integration

### 2.1 Neue KB-Verzeichnisstruktur

```
knowledge-base/
  frontend/                          # NEU: Frontend-Code-Intelligence
    routing-map.md                   # URL -> Component (auto-generated)
    component-selectors.md           # Selektoren und data-testid (auto-generated)
    form-definitions.md              # Formularfelder + Validierungen (auto-generated)
    api-endpoints.md                 # HTTP-Endpunkte (auto-generated)
    navigation-structure.md          # Menue/Sidebar/Tabs (auto-generated)
    ui-component-patterns.md         # Manuelle Ergaenzung: wie bedient man Dialog X
    _frontend-index.md               # Index fuer dieses Verzeichnis
```

### 2.2 Bundle-Erweiterung

Die bestehenden Agent-Bundles werden um Frontend-Referenzen erweitert:

**fix-test-bundle.md** -- Neuer Abschnitt:
```markdown
## 7. Frontend-Code-Intelligence (bei Locator-Problemen)

Wenn ein Locator fehlschlaegt:
1. Pruefe [[frontend/component-selectors]] -- Hat sich der Selektor geaendert?
2. Pruefe [[frontend/form-definitions]] -- Stimmt das FormControl-Label?
3. Pruefe [[frontend/routing-map]] -- Stimmt die URL fuer die Navigation?

Wenn ein waitForResponse fehlschlaegt:
1. Pruefe [[frontend/api-endpoints]] -- Stimmt das URL-Pattern?
2. Pruefe [[frontend/navigation-structure]] -- Triggert der NavLink ueberhaupt eine Navigation?
```

**create-test-bundle.md** -- Neuer Abschnitt:
```markdown
## Locator-Strategie (Frontend-gestuetzt)

Vor dem Schreiben neuer Locators:
1. [[frontend/component-selectors]] -- data-testid verfuegbar? -> Bevorzugen!
2. [[frontend/form-definitions]] -- FormControl-Name fuer getByLabel()
3. [[frontend/navigation-structure]] -- Korrekte Nav-Labels verwenden
```

### 2.3 Error-Solutions erweitern

`debugging/error-solutions.md` bekommt Frontend-gestuetzte Diagnose:

```markdown
## Locator hat sich geaendert (nach Frontend-Update)

**Symptom:** Test lief vorher, jetzt `TimeoutError` oder `strict mode violation`
**Diagnose:**
1. `grep "component-name" knowledge-base/frontend/component-selectors.md`
2. Vergleiche mit dem Locator im Page Object
3. Wenn Selektor geaendert -> Page Object anpassen

**Praevention:** Nach jedem Frontend-Release `npm run kb:sync-frontend` ausfuehren
```

---

## Phase 3: Locator-Mapping (Playwright <-> Frontend)

### 3.1 Bi-direktionales Mapping

Das wertvollste Artefakt: eine Zuordnung von **Playwright Page Object Locators** zu **Angular Component Selectors**.

**Output:** `knowledge-base/frontend/locator-mapping.md`

```markdown
## Locator Mapping: Playwright <-> Angular

### Rahmenbudget

| Playwright Page Object | Locator im Code | Angular Component | Template-Element |
|------------------------|-----------------|-------------------|-----------------|
| `rahmenbudget-page.ts` : `btnNeuePosition` | `getByRole("button", { name: "Neue Position" })` | `BudgetToolbarComponent` | `<button data-testid="new-position-btn">` |
| `rahmenbudget-page.ts` : `tblBudgetPositionen` | `locator("table.budget-table")` | `BudgetTableComponent` | `<table class="budget-table">` |
| ... | ... | ... | ... |
```

**Warum extrem wertvoll:**
- Bei einem **Frontend-Refactoring** weiss der Agent sofort welche Page Objects betroffen sind
- Bei einem **neuen Feature** kann der Agent den passenden Locator direkt aus der Komponente ableiten
- Bei **Flaky Tests** kann der Agent pruefen ob der Locator noch zum aktuellen Template passt

### 3.2 Automatischer Drift-Check

**Script:** `scripts/check-locator-drift.ts`
```
Vergleicht:
- Locators in libs/pages/*.ts
- Selektoren in frontend-src/app/**/*.component.html

Output: Liste von Locators die nicht mehr zu einem Element im Frontend passen
-> knowledge-base/frontend/locator-drift-report.md
```

Dieser Check kann in die CI-Pipeline integriert werden oder manuell nach Frontend-Releases ausgefuehrt werden.

---

## Phase 4: Domain-Wissen aus Code extrahieren

### 4.1 Enum-Werte und Status-Maschinen

**Was:** TypeScript Enums aus dem Frontend (z.B. `DossierStatus`, `BewilligungsStatus`, `WohnartTyp`).

**Warum:** Der Agent versteht dann:
- Welche Status-Uebergaenge moeglich sind (z.B. `Angefragt -> PruefungOk -> Bewilligt`)
- Welche Dropdown-Werte gueltig sind
- Welche String-Werte das System erwartet

**Output:** `knowledge-base/frontend/enums-and-status.md`

```markdown
## BewilligungsStatus
```typescript
enum BewilligungsStatus {
  Entwurf = "Entwurf",
  Angefragt = "Angefragt",
  PruefungOk = "Prüfung OK",
  Bewilligt = "Bewilligt",
  Abgelehnt = "Abgelehnt"
}
```

## WohnartTyp
```typescript
enum WohnartTyp {
  Mietwohnung = "Mietwohnung",
  Eigentum = "Eigentum",
  ...
}
```
```

### 4.2 i18n / Uebersetzungsdateien

**Was:** Die deutschen Label-Texte aus den i18n-Dateien (falls vorhanden) oder direkt aus den Templates.

**Warum:** Playwright-Tests verwenden oft `getByText("Speichern")` oder `getByRole("button", { name: "Bewilligen" })`. Wenn sich das Label aendert, bricht der Test. Mit den i18n-Daten wissen wir exakt welche Labels existieren.

---

## Phase 5: Agent-Workflow-Integration

### 5.1 Erweiterter Diagnose-Workflow (test-healer-agent)

```
Test schlaegt fehl
  |
  v
Fehler klassifizieren (Error-Pattern Quick-Ref)
  |
  +-- Locator-Problem?
  |     |
  |     v
  |   Pruefe frontend/component-selectors.md
  |   Pruefe frontend/locator-mapping.md
  |   -> Hat sich der Selektor geaendert? -> Page Object updaten
  |
  +-- Navigation-Problem?
  |     |
  |     v
  |   Pruefe frontend/routing-map.md
  |   Pruefe frontend/navigation-structure.md
  |   -> Hat sich die Route geaendert? -> URL/NavLink updaten
  |
  +-- Formular-Problem?
  |     |
  |     v
  |   Pruefe frontend/form-definitions.md
  |   -> Neues Pflichtfeld? Validation geaendert? -> Test anpassen
  |
  +-- API-Timeout?
        |
        v
      Pruefe frontend/api-endpoints.md
      -> Endpoint umbenannt/verschoben? -> waitForResponse updaten
```

### 5.2 Neuer KB-Befehl

```bash
npm run kb:sync-frontend    # Fuehrt alle Extract-Scripts aus Phase 1 aus
```

Soll nach jedem groesseren Frontend-Release oder Sprint-Wechsel ausgefuehrt werden.

---

## Umsetzungsplan (Priorisiert)

| Prio | Phase | Aufwand | Impact | Beschreibung |
|------|-------|---------|--------|-------------|
| P0 | 0 | 30min | Blocker | Symlink einrichten + .gitignore |
| P1 | 1.1 | 2h | Hoch | Routing-Map extrahieren |
| P1 | 1.4 | 2h | Hoch | API-Endpunkte extrahieren (fuer waitForResponse) |
| P1 | 1.5 | 1h | Hoch | Navigation-Struktur extrahieren |
| P2 | 1.2 | 3h | Hoch | Component-Selektoren + data-testid |
| P2 | 1.3 | 3h | Mittel | Formular-Definitionen |
| P2 | 3.1 | 4h | Sehr hoch | Locator-Mapping Playwright <-> Angular |
| P3 | 4.1 | 2h | Mittel | Enums und Status-Maschinen |
| P3 | 4.2 | 1h | Mittel | i18n Labels |
| P3 | 3.2 | 3h | Hoch | Automatischer Drift-Check |
| P4 | 2 | 2h | Mittel | Bundle-Integration + Error-Solutions |
| P4 | 5 | 2h | Hoch | Agent-Workflow erweitern |

**Geschaetzter Gesamtaufwand:** ~25h (aufgeteilt ueber mehrere Sprints)

---

## Quick Wins (sofort umsetzbar)

1. **Symlink erstellen** -> Agent kann Frontend-Code lesen
2. **Routing-Map manuell erstellen** -> Auch ohne Script, einmal `app-routing` Dateien lesen und dokumentieren
3. **data-testid Audit** -> Pruefen welche Komponenten schon `data-testid` haben, diese bevorzugt nutzen
4. **API-URL-Pattern dokumentieren** -> Aus den Angular Services die URL-Patterns fuer `waitForResponse()` extrahieren

---

## Risiken und Mitigationen

| Risiko | Mitigation |
|--------|-----------|
| Frontend-Code aendert sich oft -> KB veraltet | Automatische Scripts (Phase 1) + CI-Integration |
| Zu viel Information -> Agent wird langsam | KB-Architecture-Prinzip beibehalten: kompakte Tabellen, keine Fliesstexte |
| Symlink funktioniert nicht in CI | In CI nur die generierten KB-Dateien verwenden, nicht den Symlink |
| Angular-spezifische Parsing-Logik ist fragil | Einfache Regex-basierte Extraktion, kein AST-Parsing noetig fuer erste Version |

---

## Erfolgsmessung

| Metrik | Vorher | Ziel |
|--------|--------|------|
| Zeit bis Test-Fix (Locator-Problem) | ~30min (Try&Error) | ~5min (Lookup + Fix) |
| Flaky Tests nach Frontend-Release | 5-10 pro Sprint | 1-2 (Drift-Check warnt vorher) |
| Neue Test-Erstellung (Locator-Recherche) | ~20min Experimenting | ~5min KB-Lookup |
| Agent-Halluzinationen bei Selektoren | Haeufig | Selten (verifiziert gegen Source) |
