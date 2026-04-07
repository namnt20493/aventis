param(
    [string]$TestDir = "KV",
    [int]$Workers = 1
)

$ProjectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $ProjectRoot

$Timestamp = Get-Date -Format "ddMMyyyy_HH-mm"
$TestDirName = Split-Path $TestDir -Leaf
$ReportDir =  "C:\Playwright_Reports\KV\$Timestamp`_E2E_$TestDirName"
$HtmlReportDir = Join-Path $ReportDir "HtmlReport"
$VideosDir = Join-Path $ReportDir "videos"

New-Item -ItemType Directory -Force -Path $ReportDir | Out-Null
New-Item -ItemType Directory -Force -Path $HtmlReportDir | Out-Null
New-Item -ItemType Directory -Force -Path $VideosDir | Out-Null

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Configuration:" -ForegroundColor Cyan
Write-Host "  Test Directory: $TestDir" -ForegroundColor Yellow
Write-Host "  Workers: $Workers" -ForegroundColor Yellow
Write-Host "  Report Directory: $ReportDir" -ForegroundColor Yellow
Write-Host "  HTML Report: $HtmlReportDir" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$env:CI = "true"

Write-Host "Starting test run..." -ForegroundColor Cyan

$Output = npx playwright test `
    --config=playwright.kv.config.ts `
    "$TestDir" `
    --output="$VideosDir" `
    --reporter=html `
    --workers=$Workers `
    2>&1 | Out-String

$ExitCode = $LASTEXITCODE

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Execution Output:" -ForegroundColor Cyan
Write-Host $Output
Write-Host "========================================" -ForegroundColor Cyan

if (Test-Path "playwright-report") {
    Write-Host "Moving HTML report to: $HtmlReportDir" -ForegroundColor Cyan
    Move-Item -Path "playwright-report\*" -Destination $HtmlReportDir -Force
    Remove-Item "playwright-report" -Force -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Report Locations:" -ForegroundColor Cyan
Write-Host "  HTML Report: $HtmlReportDir\index.html" -ForegroundColor Green
Write-Host "  Videos: $VideosDir" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

if ($ExitCode -ne 0) {
    Write-Host "`nThe test run FAILED (Exit Code $ExitCode)!" -ForegroundColor Red
    exit 1
} else {
    Write-Host "`nThe test run PASSED!" -ForegroundColor Green
    exit 0
}