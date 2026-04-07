param(
    [int]$Shard = 1,
    [int]$Total = 2
)

$ProjectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $ProjectRoot

$env:RUN_TIME_STEP = "1"

Write-Host "=== Running Single Shard ===" -ForegroundColor Cyan
Write-Host "Shard: $Shard/$Total" -ForegroundColor Yellow
Write-Host "RUN_TIME_STEP: $env:RUN_TIME_STEP" -ForegroundColor Yellow
Write-Host ""

npx playwright test --shard="$Shard/$Total" --config=playwright.kv.config.ts

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nShard $Shard/$Total PASSED" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`nShard $Shard/$Total FAILED" -ForegroundColor Red
    exit 1
}