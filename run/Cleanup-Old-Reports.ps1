param([int]$DaysToKeep = 10)

$ReportPaths = @(
    "C:\Playwright_Reports\E2E",
    "C:\Playwright_Reports\KV"
)

$CutoffDate = (Get-Date).AddDays(-$DaysToKeep)
$TotalRemoved = 0
$TotalSize = 0

Write-Host "Removing reports older than $($CutoffDate.ToString('dd.MM.yyyy HH:mm'))..." -ForegroundColor Cyan

foreach ($ReportPath in $ReportPaths) {
    if (-not (Test-Path $ReportPath)) { continue }

    Get-ChildItem -Path $ReportPath -Directory | ForEach-Object {
        if ($_.Name -match '^(\d{2})(\d{2})(\d{4})_(\d{2})-(\d{2})') {
            try {
                $FolderDate = Get-Date -Year $Matches[3] -Month $Matches[2] -Day $Matches[1] -Hour $Matches[4] -Minute $Matches[5]

                if ($FolderDate -lt $CutoffDate) {
                    $Size = (Get-ChildItem -Path $_.FullName -Recurse -File -ErrorAction SilentlyContinue |
                            Measure-Object -Property Length -Sum).Sum / 1MB

                    Write-Host "Removing: $($_.Name)" -ForegroundColor Yellow
                    Remove-Item -Path $_.FullName -Recurse -Force -ErrorAction Stop

                    $TotalRemoved++
                    $TotalSize += $Size
                }
            }
            catch {}
        }
    }
}

Write-Host "`nRemoved $TotalRemoved folders ($('{0:N2}' -f $TotalSize) MB freed)" -ForegroundColor Green