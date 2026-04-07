$ProjectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $ProjectRoot

$env:RUN_TIME_STEP = "1"

Write-Host "=== Test 1: Ohne Shard ===" -ForegroundColor Cyan
npx playwright test --config=playwright.kv.config.ts --list
Write-Host ""

Write-Host "=== Test 2: Mit Shard 1/2 ===" -ForegroundColor Cyan
npx playwright test --config=playwright.kv.config.ts --shard=1/2 --list
Write-Host ""

Write-Host "=== Test 3: Mit Shard 2/2 ===" -ForegroundColor Cyan
npx playwright test --config=playwright.kv.config.ts --shard=2/2 --list
Write-Host ""