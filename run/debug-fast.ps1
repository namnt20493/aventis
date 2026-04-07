# Fast debug script with reduced timeouts
param(
    [string]$TestFile
)

if (-not $TestFile) {
    Write-Host "Usage: .\debug-fast.ps1 'path/to/test.spec.ts'"
    Write-Host "Example: .\debug-fast.ps1 'staticTestcases/Keywordvalidation/a03_Aufgaben_Small.spec.ts'"
    exit 1
}

Write-Host "Running test in DEBUG mode with reduced timeouts..." -ForegroundColor Green
$env:DEBUG_MODE = "1"
npx playwright test "$TestFile" --config playwright.kv.config.ts --reporter=line --timeout=180000