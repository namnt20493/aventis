# Playwright Debug Analysis Skill

## Zweck
Dieser Skill hilft bei der Analyse von flaky Playwright-Tests, die nur in Azure-Pipelines fehlschlagen. Er kann Screenshots, Trace-Files und Logs analysieren, um die Ursachen von instabilen Tests zu identifizieren.

## Capabilities

### 1. Trace-File Analyse
```bash
# Trace-Files aus Azure Pipeline artifacts laden und analysieren
npx playwright show-trace trace.zip
```

**Was analysiert werden kann:**
- Network requests und responses
- Console logs und errors
- DOM snapshots zu verschiedenen Zeitpunkten
- Timing-Probleme und race conditions
- Failed assertions mit Kontext

### 2. Screenshot Vergleich
```bash
# Screenshot diffs analysieren
npx playwright test --update-snapshots  # Für lokale Updates
```

**Analyse-Punkte:**
- Pixel-genaue Unterschiede zwischen erwartet vs. tatsächlich
- Timing-bedingte UI-Änderungen
- Browser-spezifische Rendering-Unterschiede
- Viewport-Probleme

### 3. Console Logs Analyse
**Typische Azure-spezifische Probleme:**
- Langsamere Netzwerk-Verbindungen
- Unterschiedliche Timing-Verhalten
- Authentifizierung-Issues
- Resource loading problems

### 4. Common Flaky Test Patterns

#### Race Conditions
```typescript
// PROBLEM: Waiting for element without proper state check
await page.click('.button');
await expect(page.locator('.result')).toBeVisible();

// SOLUTION: Wait for network idle or specific state
await page.click('.button');
await page.waitForLoadState('networkidle');
await expect(page.locator('.result')).toBeVisible();
```

#### Authentication Issues
```typescript
// PROBLEM: Session nicht persistent in Azure
await page.goto('/protected-route');

// SOLUTION: Explicit authentication state check
await page.goto('/');
await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
await page.goto('/protected-route');
```

#### Timing-abhängige Selektoren
```typescript
// PROBLEM: Selector ändert sich während loading
await page.click('.dynamic-button');

// SOLUTION: Stable selector warten
await page.waitForSelector('.stable-element[data-loaded="true"]');
await page.click('.dynamic-button');
```

## Debug-Workflow für Azure Flaky Tests

### Schritt 1: Artifacts sammeln
1. Azure Pipeline Run öffnen
2. Test Results herunterladen
3. Screenshots, Traces, und Logs extrahieren

### Schritt 2: Lokale Reproduktion
```bash
# Test mit Azure-ähnlichen Bedingungen
npx playwright test --workers=1 --retries=0 --timeout=30000
```

### Schritt 3: Trace Analyse
```bash
npx playwright show-trace path/to/failing-test-trace.zip
```

**Analyse-Checkliste:**
- [ ] Network timing: Slow requests in Azure?
- [ ] Console errors: Authentication/permission issues?
- [ ] DOM changes: Elements loading differently?
- [ ] Screenshots: Visual differences vs. local?

### Schritt 4: Häufige Azure-Fixes

#### 1. Increased Timeouts
```typescript
// In playwright.azure.config.ts
export default defineConfig({
  timeout: 60000, // Erhöht von 30s
  expect: {
    timeout: 10000 // Erhöht von 5s
  }
});
```

#### 2. Network Stability
```typescript
// Warten auf network idle vor assertions
await page.waitForLoadState('networkidle');
await expect(page.locator('.result')).toBeVisible();
```

#### 3. Retry-fähige Assertions
```typescript
// Retry unstable checks
await expect(async () => {
  const count = await page.locator('.items').count();
  expect(count).toBeGreaterThan(0);
}).toPass({ timeout: 15000 });
```

### Schritt 5: Test Stability Monitoring

#### Test mit retries
```typescript
test.describe.configure({ retries: 2 }); // Nur für flaky tests
```

#### Conditional Azure logic
```typescript
const isAzure = process.env.PLAYWRIGHT_SERVICE_URL || process.env.AZURE_PIPELINES;
if (isAzure) {
  // Azure-specific adjustments
  await page.waitForTimeout(2000); // Extra wait in Azure
}
```

## Tools für Debugging

### 1. Playwright Inspector
```bash
npx playwright test --debug --headed
```

### 2. Trace Viewer
```bash
npx playwright show-trace
```

### 3. Visual Comparison
```bash
npx playwright test --update-snapshots
```

### 4. Network Logs
```typescript
// In test setup
page.on('response', response => {
  console.log(`Response: ${response.url()} - ${response.status()}`);
});
```

## Azure-spezifische Configurations

### Playwright Service Config
```typescript
// playwright.azure.config.ts optimizations
export default defineConfig({
  workers: 1, // Reduced parallelism
  retries: 1, // Allow one retry
  timeout: 60000,
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  }
});
```

### Environment Variables Check
```typescript
// Check for Azure environment
const isAzurePipeline = !!process.env.AZURE_PIPELINES;
const isPlaywrightService = !!process.env.PLAYWRIGHT_SERVICE_URL;

if (isAzurePipeline) {
  // Azure pipeline specific logic
  test.setTimeout(60000);
}
```

## Troubleshooting Guide

### Problem: Test passes locally, fails in Azure
**Lösungsansatz:**
1. Trace-File aus Azure downloaden
2. Network timing prüfen
3. Screenshots vergleichen
4. Timeouts erhöhen

### Problem: Authentication failures in Azure
**Lösungsansatz:**
1. Cookies/Session state prüfen
2. Login-Flow stabilisieren
3. Persistent authentication context

### Problem: Element not found in Azure
**Lösungsansatz:**
1. Loading states prüfen
2. Selector-Stabilität verbessern
3. Explicit waits hinzufügen

### Problem: Screenshot differences
**Lösungsansatz:**
1. Viewport consistency prüfen
2. Font rendering differences
3. Animation states synchronisieren

## Best Practices für Azure-stabile Tests

1. **Explicit Waits**: Verwende `waitForSelector`, `waitForLoadState`
2. **Stable Selectors**: Nutze `data-testid` statt CSS-Klassen
3. **Network Waits**: Warte auf `networkidle` vor Assertions
4. **Retries**: Implementiere retry-Logic für unstable Operations
5. **Timeouts**: Erhöhe Timeouts für Azure-Environment
6. **State Checks**: Prüfe Authentifizierung und App-State explizit

Dieser Skill kann als Referenz für die systematische Analyse und Behebung von Azure-spezifischen Playwright Test-Problemen verwendet werden.
