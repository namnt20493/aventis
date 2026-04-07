# KeywordValidation Tests für Azure Playwright Workspace + Azure DevOps
#
# Dieses Script führt KV Tests aus mit:
# - Remote Execution auf Azure Playwright Workspace
# - Automatische Test Case Erstellung in Azure DevOps
# - Test Results Publishing zu Azure DevOps

param(
    [string]$TestFilter = "",
    [string]$Token = "",
    [switch]$DryRun = $false
)

Write-Host "🚀 Starting KeywordValidation Tests on Azure Playwright Workspace" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan

# Set environment variables
$env:CI = "true"
$env:AZURE_DEVOPS_ORG_URL = "https://diartis.visualstudio.com/"
$env:AZURE_DEVOPS_PROJECT = "Aventis"
$env:AZURE_DEVOPS_KV_PLAN_ID = "164156"
$env:AZURE_DEVOPS_KV_SUITE_ID = "164156"
$env:AZURE_DEVOPS_ENVIRONMENT = "Azure_Workspace"

# Set token if provided
if ($Token) {
    $env:AZURE_DEVOPS_TOKEN = $Token
    Write-Host "✅ Azure DevOps Token set from parameter" -ForegroundColor Green
}
elseif ($env:AZURE_DEVOPS_TOKEN) {
    Write-Host "✅ Using Azure DevOps Token from environment" -ForegroundColor Green
}
else {
    Write-Warning "⚠️  No Azure DevOps Token found. Test case creation will be disabled."
}

# Set test filter if provided
if ($TestFilter) {
    $env:TEST_FILTER = $TestFilter
    Write-Host "🔍 Test Filter: $TestFilter" -ForegroundColor Yellow
}

# Check required environment variables
$requiredVars = @(
    "PLAYWRIGHT_SERVICE_ACCESS_TOKEN",
    "PLAYWRIGHT_SERVICE_URL"
)

foreach ($var in $requiredVars) {
    if (-not (Get-ChildItem Env:$var -ErrorAction SilentlyContinue)) {
        Write-Error "❌ Required environment variable $var is not set!"
        exit 1
    }
}

Write-Host "✅ All required environment variables are set" -ForegroundColor Green

# Show configuration
Write-Host "`nConfiguration:" -ForegroundColor Cyan
Write-Host "  Azure Workspace: $env:PLAYWRIGHT_SERVICE_URL" -ForegroundColor White
Write-Host "  Azure DevOps Org: $env:AZURE_DEVOPS_ORG_URL" -ForegroundColor White
Write-Host "  Project: $env:AZURE_DEVOPS_PROJECT" -ForegroundColor White
Write-Host "  Plan ID: $env:AZURE_DEVOPS_KV_PLAN_ID" -ForegroundColor White
Write-Host "  Suite ID: $env:AZURE_DEVOPS_KV_SUITE_ID" -ForegroundColor White

if ($DryRun) {
    Write-Host "`n🏃‍♂️ DRY RUN - Would execute:" -ForegroundColor Yellow
    Write-Host "npx playwright test --config=playwright.kv-azure.config.ts" -ForegroundColor Gray
    exit 0
}

Write-Host "`n🎬 Starting test execution..." -ForegroundColor Green

# Execute the tests
try {
    npx playwright test --config=playwright.kv-azure.config.ts

    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ All tests completed successfully!" -ForegroundColor Green
        Write-Host "📊 Check Azure DevOps for test results and created test cases" -ForegroundColor Cyan
    }
    else {
        Write-Host "`n⚠️  Some tests failed (Exit code: $LASTEXITCODE)" -ForegroundColor Yellow
        Write-Host "📊 Check test results in playwright-report/index.html" -ForegroundColor Cyan
    }
}
catch {
    Write-Error "❌ Test execution failed: $_"
    exit 1
}

Write-Host "`n📁 Generated artifacts:" -ForegroundColor Cyan
Write-Host "  - HTML Report: playwright-report/index.html" -ForegroundColor White
Write-Host "  - JUnit Results: test-results/junit-results.xml" -ForegroundColor White
Write-Host "  - Blob Report: Available for Azure integration" -ForegroundColor White

Write-Host "`n🎉 KeywordValidation test execution completed!" -ForegroundColor Green

# Pipeline Integration Commands
Write-Host "`n🔧 Pipeline Integration Commands:" -ForegroundColor Cyan
Write-Host "  Manual Run:" -ForegroundColor White
Write-Host "    az pipelines run --name 'KV Tests Pipeline' --branch master --parameters useAzureWorkspace=true" -ForegroundColor Gray
Write-Host "`n  With Test Filter:" -ForegroundColor White
Write-Host "    az pipelines run --name 'KV Tests Pipeline' --parameters useAzureWorkspace=true,testFilter=A02_" -ForegroundColor Gray
Write-Host "`n  Fallback Mode:" -ForegroundColor White
Write-Host "    az pipelines run --name 'KV Tests Pipeline' --parameters useAzureWorkspace=false" -ForegroundColor Gray

Write-Host "`n📊 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Check Azure DevOps Test Plans for created test cases" -ForegroundColor White
Write-Host "  2. Review HTML report for detailed test results" -ForegroundColor White
Write-Host "  3. Monitor Azure Playwright Workspace usage" -ForegroundColor White
