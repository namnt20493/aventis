@echo off
echo Running test in DEBUG mode with reduced timeouts...
set DEBUG_MODE=1
npx playwright test "%1" --config playwright.kv.config.ts --reporter=line --timeout=180000