param(
    [string]$TestDir = "E2E",
    [int]$Workers = 1
)

$ProjectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $ProjectRoot

$Timestamp = Get-Date -Format "ddMMyyyy_HH-mm"
$TestDirName = Split-Path $TestDir -Leaf
$ReportDir = Join-Path "C:\Playwright_Reports\E2E" "$Timestamp`_E2E_$TestDirName"
$HtmlReportDir = Join-Path $ReportDir "HtmlReport"
$VideosDir = Join-Path $ReportDir "videos"

New-Item -ItemType Directory -Force -Path $HtmlReportDir | Out-Null
New-Item -ItemType Directory -Force -Path $VideosDir | Out-Null

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Configuration:" -ForegroundColor Cyan
Write-Host "  Test Directory: $TestDir" -ForegroundColor Yellow
Write-Host "  Workers: $Workers" -ForegroundColor Yellow
Write-Host "  Report Directory: $ReportDir" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$env:CI = "true"
$env:PLAYWRIGHT_HTML_REPORT = $HtmlReportDir
$env:PLAYWRIGHT_CHROMIUM_SANDBOX = "0"
$env:DISPLAY_WIDTH = "1920"
$env:DISPLAY_HEIGHT = "1200"

# Stability settings (only set if not already defined in .env)
if (-not $env:SLOWMO) { $env:SLOWMO = "200" }
if (-not $env:STABILITY_DELAY) { $env:STABILITY_DELAY = "800" }
if (-not $env:ACTION_STABILITY_WAIT) { $env:ACTION_STABILITY_WAIT = "300" }

# Ignore test.setTimeout() in generated tests - use global config timeout instead
$env:IGNORE_GENERATED_TIMEOUT = "true"

Write-Host "Generate Testcases from excel..." -ForegroundColor Cyan
npx tsx libs/utils/generator-testcase.ts

Write-Host "Creating new Parameters..." -ForegroundColor Cyan
npx tsx libs/utils/parameters/createJSON.ts


# Phase 1: Run prerequisite tests (files starting with 0)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PHASE 1: Running prerequisite tests (0*.spec.ts)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Get all test files starting with 0 or 1 (00_, 01_)
$Phase1TestFiles = Get-ChildItem -Path "$TestDir" -Filter "*.spec.ts" -File | Where-Object { $_.Name -match '^0[0-9]' }

if ($Phase1TestFiles.Count -eq 0) {
    Write-Host "No prerequisite tests found (0*.spec.ts). Skipping to Phase 2." -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "Found $($Phase1TestFiles.Count) prerequisite test(s):" -ForegroundColor Yellow
    $Phase1TestFiles | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }
    Write-Host ""

    # Build file paths relative to project root (use forward slashes for Playwright)
    $Phase1TestPaths = $Phase1TestFiles | ForEach-Object {
        $relativePath = $_.FullName.Replace($ProjectRoot + '\', '').Replace('\', '/')
        Write-Host "  Path: $relativePath" -ForegroundColor DarkGray
        $relativePath
    }
    Write-Host ""

    $Phase1Output = npx playwright test `
        --config=playwright.e2e.config.ts `
        $Phase1TestPaths `
        --output="$VideosDir" `
        --workers=$Workers `
        2>&1 | Out-String

    $Phase1ExitCode = $LASTEXITCODE

    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Phase 1 Output:" -ForegroundColor Cyan
    Write-Host $Phase1Output
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""

    if ($Phase1ExitCode -ne 0) {
        Write-Host "Phase 1 FAILED! Aborting remaining tests." -ForegroundColor Red
        Write-Host "Report Locations:" -ForegroundColor Cyan
        Write-Host "  HTML Report: $HtmlReportDir\index.html" -ForegroundColor Green
        Write-Host "  Videos: $VideosDir" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Cyan
        exit 1
    }

    Write-Host "Phase 1 PASSED! Proceeding to Phase 2..." -ForegroundColor Green
    Write-Host ""
}

# Phase 2: Run all other tests (excluding files starting with 0)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PHASE 2: Running remaining tests (excluding 0*.spec.ts)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Get all test files except those starting with 0
$Phase2TestFiles = Get-ChildItem -Path "$TestDir" -Filter "*.spec.ts" -File | Where-Object { $_.Name -notmatch '^0[0-9]' }

if ($Phase2TestFiles.Count -eq 0) {
    Write-Host "No additional tests to run in Phase 2." -ForegroundColor Yellow
    Write-Host "`nAll tests PASSED!" -ForegroundColor Green
    exit 0
}

Write-Host "Found $($Phase2TestFiles.Count) test(s) for Phase 2:" -ForegroundColor Yellow
$Phase2TestFiles | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }
Write-Host ""

# Build file paths relative to project root (use forward slashes for Playwright)
$Phase2TestPaths = $Phase2TestFiles | ForEach-Object {
    $relativePath = $_.FullName.Replace($ProjectRoot + '\', '').Replace('\', '/')
    Write-Host "  Path: $relativePath" -ForegroundColor DarkGray
    $relativePath
}
Write-Host ""

$Phase2Output = npx playwright test `
    --config=playwright.e2e.config.ts `
    $Phase2TestPaths `
    --output="$VideosDir" `
    --workers=$Workers `
    2>&1 | Out-String

$Phase2ExitCode = $LASTEXITCODE

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Phase 2 Output:" -ForegroundColor Cyan
Write-Host $Phase2Output
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Report Locations:" -ForegroundColor Cyan
Write-Host "  HTML Report: $HtmlReportDir\index.html" -ForegroundColor Green
Write-Host "  Videos: $VideosDir" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

if ($Phase2ExitCode -ne 0) {
    Write-Host "`nPhase 2 FAILED (Exit Code $Phase2ExitCode)!" -ForegroundColor Red
    exit 1
}
else {
    Write-Host "`nAll tests PASSED!" -ForegroundColor Green
    exit 0
}
