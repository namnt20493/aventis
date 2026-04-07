# CI vs. Local Unterschiede

Tests koennen lokal bestehen, aber in der CI-Pipeline fehlschlagen (oder umgekehrt). Dieses Dokument beschreibt die Unterschiede und Loesungen.

## Config-Unterschiede

### Playwright-Konfigurationen

| Umgebung | Config-Datei | Zweck |
|----------|-------------|-------|
| Lokal (Standard) | `playwright.config.ts` | Allgemeine Entwicklung |
| Lokal (KV) | `playwright.kv.config.ts` | Keyword-Validierung lokal |
| CI (KV) | `playwright.kv-azure.config.ts` | Keyword-Validierung in Azure Pipeline |
| CI (E2E) | `playwright.azure.config.ts` | Azure Pipeline Ausfuehrung |
| CI (E2E) | `playwright.e2e.config.ts` | End-to-End Tests |
| Debug | `playwright.debug.config.ts` | Debug-Modus |

### Wesentliche Config-Unterschiede

| Einstellung | Lokal | CI/Azure |
|-------------|-------|----------|
| `headed` | `true` (sichtbar) | `false` (headless) |
| `workers` | `1` (Standard) | `1` (sequentiell) |
| `retries` | `0` | `0-2` (je nach Config) |
| `SLOWMO` | Einstellbar | Automatisch 0.3x Multiplikator |
| Browser | Edge (sichtbar) | Edge (headless) |

## Timing-Unterschiede

### CI ist langsamer -- aber StabilityHelper kompensiert

Die CI-Umgebung (Azure DevOps Agent) hat typischerweise:
- Langsamere CPU (Shared Resources)
- Langsamere Netzwerkverbindung zum QA-Server
- Kein GPU (Rendering langsamer)

**Aber:** Der `StabilityHelper` erkennt die CI-Umgebung und passt Timings an:
- Lokal: Volle Wartezeiten (1.0x Multiplikator)
- CI: Reduzierte Wartezeiten (0.3x Multiplikator)

Dies kann kontraintuitiv sein: Tests die lokal stabil laufen, koennen in CI zu schnell sein.

### Haeufige Timing-Probleme in CI

| Problem | Ursache | Loesung |
|---------|---------|---------|
| Element nicht gefunden | Langsameres Rendering in headless | `waitFor({ state: "visible" })` |
| Navigation-Timeout | Langsamere Server-Antwort | Navigation-Timeout erhoehen |
| API-Call Timeout | Netzwerk-Latenz | API-Timeout erhoehen |
| Formular nicht bereit | Angular-Rendering langsamer | `waitForAngularStable()` |

## Authentication

### API-basierter Login (Standard)

`AuthManager.swapUser()` verwendet API-basierte Azure AD Authentifizierung (`libs/utils/api-login.ts`) -- reine HTTP-Requests ohne Browser-GUI (~3s). Funktioniert identisch lokal und in CI. GUI-Login (`MicrosoftLoginPage`) dient nur als automatischer Fallback.

**Flow:** `Stable_Login` → `AuthManager.swapUser()` → API Login (oder Cookie-Cache) → Cookie-Injection in BrowserContext

### CI: Service Principal Auth

In der CI-Pipeline wird fuer Microsoft Graph API-Zugriffe ein Service Principal verwendet:
- Azure AD App Registration
- Client ID + Client Secret als Pipeline-Variablen
- Token-basierte Authentifizierung

**Hinweis:** `Stable_Login` und `Stable_LogoutAndLoginDiffAccount` funktionieren in beiden Umgebungen identisch, da sie `AuthManager.swapUser()` verwenden.

## Nightly Run Besonderheiten

### Zeitplan

- Nightly Run: **02:00 UTC** (03:00 CET / 04:00 CEST)
- Nur `@all`-getaggte Tests
- `@wip`-Tests sind ausgeschlossen

### Haeufige Nightly-Run-Probleme

| Problem | Ursache | Loesung |
|---------|---------|---------|
| Alle Tests fehlgeschlagen | QA-Umgebung war down / Deployment | Erneut ausfuehren nach Umgebungs-Check |
| Einzelne Tests fehlgeschlagen | Flaky Test | Siehe [[flaky-tests]] |
| Timeout bei Login | Azure AD Token abgelaufen | Automatische Erneuerung pruefen |
| Daten-Konflikte | Testdaten von vorherigem Run | Unique IDs via `generateUniqueDossierId(seed)` |

### Pipeline-Ausfuehrung

```bash
# Azure Pipeline fuehrt typischerweise aus:
npx playwright test --config=playwright.kv-azure.config.ts --grep @all
```

## Debugging von CI-Fehlern

### 1. HTML-Report herunterladen

Azure Pipeline speichert den Playwright HTML-Report als Artefakt. Dort sind Screenshots und Traces bei fehlgeschlagenen Tests.

### 2. Lokal mit CI-Config testen

```bash
# Lokal mit Azure-Config ausfuehren (headless)
npx playwright test --config=playwright.kv-azure.config.ts <spec-file>
```

### 3. Headed-Modus fuer Debugging

```bash
# Lokal headed mit Debug-Config
npx playwright test --config=playwright.debug.config.ts <spec-file>
```

### 4. Traces analysieren

```bash
# Trace-Datei oeffnen
npx playwright show-trace trace.zip
```

## Checkliste: Test laeuft lokal aber nicht in CI

1. Pruefen: Verwendet der Test hardcodierte Daten, die sich aendern? (Datumswerte, IDs)
2. Pruefen: Hat der Test explizite Waits auf Elemente statt `waitForTimeout()`?
3. Pruefen: Verwendet der Test `headed`-spezifische Features? (z.B. Viewport-Groesse)
4. Pruefen: Gibt es Race-Conditions bei paralleler Ausfuehrung?
5. Pruefen: Ist die QA-Umgebung erreichbar und aktuell?
6. HTML-Report und Traces aus der Pipeline herunterladen und analysieren

## Verwandte Seiten

- [[error-solutions]] -- Spezifische Fehlermeldungen
- [[flaky-tests]] -- Instabile Tests allgemein
- [[../05-Patterns/test-template]] -- Teststruktur mit korrekten Patterns
