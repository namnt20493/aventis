param([string]$TestPath)

$ProjectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $ProjectRoot

$env:RUN_TIME_STEP = "1"

$FullTestPath = "staticTestcases\$TestPath"

Write-Host "=== Troubleshooting: $FullTestPath ===" -ForegroundColor Cyan
Write-Host ""

if (Test-Path $FullTestPath) {
    Write-Host "Path exists: $FullTestPath" -ForegroundColor Green
    
    $TestFiles = Get-ChildItem $FullTestPath -Filter "*.spec.ts" -Recurse
    Write-Host "Found $($TestFiles.Count) test files:" -ForegroundColor Green
    Write-Host ""
    
    foreach ($File in $TestFiles) {
        Write-Host "  - $($File.Name)" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "Listing tests in this path:" -ForegroundColor Yellow
    npx playwright test $FullTestPath --list
    
} else {
    Write-Host "ERROR: Path does not exist: $FullTestPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Available directories in staticTestcases:" -ForegroundColor Yellow
    Get-ChildItem "staticTestcases" -Directory | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }
}