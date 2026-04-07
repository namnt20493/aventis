$ProjectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $ProjectRoot

Write-Host "=== Playwright Troubleshooting ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Project Root: $ProjectRoot" -ForegroundColor Yellow
Write-Host ""

Write-Host "1. Node.js Version:" -ForegroundColor Yellow
node --version
Write-Host ""

Write-Host "2. npm Version:" -ForegroundColor Yellow
npm --version
Write-Host ""

Write-Host "3. Playwright Version:" -ForegroundColor Yellow
npx playwright --version
Write-Host ""

Write-Host "4. Test Directory:" -ForegroundColor Yellow
if (Test-Path ".\staticTestcases") {
    $TestFiles = Get-ChildItem ".\staticTestcases" -Filter "*.spec.ts" -Recurse
    Write-Host "Found $($TestFiles.Count) test files in staticTestcases/" -ForegroundColor Green
    Write-Host ""
    Write-Host "First 5 test files:" -ForegroundColor Gray
    $TestFiles | Select-Object -First 5 | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }
} else {
    Write-Host "ERROR: staticTestcases directory not found!" -ForegroundColor Red
}
Write-Host ""

Write-Host "5. Listing all tests:" -ForegroundColor Yellow
npx playwright test --list
Write-Host ""

Write-Host "6. Testing shard command (dry-run):" -ForegroundColor Yellow
npx playwright test --shard=1/4 --dry-run
Write-Host ""

Write-Host "=== Troubleshooting Complete ===" -ForegroundColor Green