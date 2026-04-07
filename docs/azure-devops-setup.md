# Azure DevOps Variable Groups Setup für KV Pipeline

Für die neue `playwright.kv-azure.config.ts` Konfiguration benötigst du die folgenden Variable Groups in Azure DevOps:

## 1. playwright-azure-reporter (Existing)

Diese Group sollte bereits existieren für Azure DevOps Test Integration:

```
AZURE_DEVOPS_ORG_URL = https://diartis.visualstudio.com/
AZURE_DEVOPS_PROJECT = Aventis
AZURE_DEVOPS_KV_PLAN_ID = 181204
AZURE_DEVOPS_KV_SUITE_ID = 181205
AZURE_DEVOPS_TOKEN = [Personal Access Token mit Test Management Permissions]
AZURE_DEVOPS_ENVIRONMENT = Azure_Pipeline
```

## 2. playwright-workspace-kv (Neu erstellen)

Für Azure Playwright Workspace Integration:

```
PLAYWRIGHT_SERVICE_ACCESS_TOKEN = [Token aus Azure Playwright Service]
PLAYWRIGHT_SERVICE_URL = [Workspace Endpoint URL]
PLAYWRIGHT_SERVICE_OS = Linux
```

## Azure Playwright Workspace Token Setup

### 1. Azure Playwright Service Setup:

1. Gehe zu Azure Portal
2. Suche "Playwright Testing"
3. Erstelle/wähle dein Playwright Testing Workspace
4. Kopiere Access Token und Service URL

### 2. Variable Group erstellen in Azure DevOps:

```bash
# Azure DevOps CLI (optional)
az pipelines variable-group create
  --organization https://diartis.visualstudio.com/
  --project Aventis
  --name playwright-workspace-kv
  --variables PLAYWRIGHT_SERVICE_ACCESS_TOKEN=[TOKEN] PLAYWRIGHT_SERVICE_URL=[URL] PLAYWRIGHT_SERVICE_OS=Linux
```

### 3. Manual Setup in Azure DevOps UI:

1. Gehe zu Azure DevOps → Project Settings → Pipelines → Library
2. Klicke "New variable group"
3. Name: `playwright-workspace-kv`
4. Füge die Variablen hinzu (siehe oben)
5. Markiere `PLAYWRIGHT_SERVICE_ACCESS_TOKEN` als "Secret"
6. Save

## Pipeline Parameter

Die Pipeline unterstützt jetzt folgende Parameter:

- **useAzureWorkspace** (Boolean, default: true): Verwendet Azure Playwright Workspace
- **testFilter** (String): Optionaler Filter für spezifische Tests (z.B. "A02\_")
- **runKeywordvalidation** (Boolean, default: true): Führt KV Tests aus

## Vorteile der neuen Konfiguration

### Mit `useAzureWorkspace: true` (Empfohlen):

- ✅ 10 parallele Worker in der Cloud
- ✅ Automatische Test Case Erstellung in Azure DevOps
- ✅ Keine lokale Browser-Installation nötig
- ✅ Bessere Performance und Skalierbarkeit
- ✅ Konsistente Testumgebung

### Mit `useAzureWorkspace: false` (Fallback):

- ⚠️ 3 Shards auf lokalen Azure Pipeline Agents
- ⚠️ Browser-Installation erforderlich
- ⚠️ Begrenzte Azure DevOps Integration
- ⚠️ Längere Ausführungszeit

## Troubleshooting

### Häufige Probleme:

1. **"Missing required environment variables"**: Variable Groups nicht richtig verlinkt
2. **"Azure DevOps token expired"**: Personal Access Token erneuern
3. **"Playwright service connection failed"**: Access Token oder Service URL prüfen

### Debug-Modus:

```yaml
# In der Pipeline die Logs erhöhen
- script: |
    export DEBUG=azure:pw:*
    npx playwright test --config=playwright.kv-azure.config.ts
```
