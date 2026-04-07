param([int]$Shards = 4)

$ProjectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $ProjectRoot

$Timestamp = Get-Date -Format "ddMMyyyy_HH-mm"
$ReportDir = Join-Path $ProjectRoot "test-results\$Timestamp`_KVTestrun"
$BlobDir = Join-Path $ReportDir "blob-reports"
$FinalReportDir = Join-Path $ReportDir "final-report"

New-Item -ItemType Directory -Force -Path $ReportDir | Out-Null
New-Item -ItemType Directory -Force -Path $BlobDir | Out-Null

Write-Host "Report Directory: $ReportDir" -ForegroundColor Cyan
Write-Host "Blob Reports: $BlobDir" -ForegroundColor Cyan
Write-Host "Starting $Shards parallel test shards..." -ForegroundColor Cyan
Write-Host ""

$env:CI = "true"

$PowerShellExe = if (Get-Command pwsh -ErrorAction SilentlyContinue) { "pwsh" } else { "powershell" }
Write-Host "Using PowerShell: $PowerShellExe" -ForegroundColor Gray

$Processes = @()
for ($i = 1; $i -le $Shards; $i++) {
    $ShardDir = Join-Path $ReportDir "shard$i"
    New-Item -ItemType Directory -Force -Path $ShardDir | Out-Null

    $StdOutLog = Join-Path $ShardDir "stdout.log"
    $StdErrLog = Join-Path $ShardDir "stderr.log"
    $ScriptFile = Join-Path $ShardDir "run-shard.ps1"

    $ScriptContent = @"
Set-Location '$ProjectRoot'
`$env:CI = 'true'
`$env:PLAYWRIGHT_BLOB_OUTPUT_DIR = '$BlobDir'

npx playwright test ``
    --shard=$i/$Shards ``
    --config=playwright.kv.config.ts ``
    --output='$ShardDir\videos' ``
    --reporter=blob

exit `$LASTEXITCODE
"@

    Set-Content -Path $ScriptFile -Value $ScriptContent -Encoding UTF8

    try {
        $ProcessInfo = Start-Process -FilePath $PowerShellExe -ArgumentList @(
            "-NoProfile",
            "-ExecutionPolicy", "Bypass",
            "-File", $ScriptFile
        ) -NoNewWindow -PassThru -RedirectStandardOutput $StdOutLog -RedirectStandardError $StdErrLog

        if ($null -eq $ProcessInfo) {
            throw "Failed to start process"
        }

        $Processes += @{
            Process = $ProcessInfo
            Shard = $i
            StdOutLog = $StdOutLog
            StdErrLog = $StdErrLog
            ShardDir = $ShardDir
        }

        Write-Host "Started Shard $i/$Shards (PID: $($ProcessInfo.Id)) -> $ShardDir" -ForegroundColor Green

    } catch {
        Write-Host "Failed to start Shard $i/$Shards : $_" -ForegroundColor Red
        Write-Host "Script file: $ScriptFile" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "Waiting for all shards to complete..." -ForegroundColor Yellow
Write-Host ""

$ValidProcesses = $Processes | Where-Object { $null -ne $_.Process }
if ($ValidProcesses.Count -eq 0) {
    Write-Host "No processes started successfully!" -ForegroundColor Red
    exit 1
}

$ValidProcesses.Process | Wait-Process

$Failed = 0
foreach ($Info in $Processes) {
    Write-Host "==================== Shard $($Info.Shard)/$Shards ====================" -ForegroundColor Cyan

    if (Test-Path $Info.StdOutLog) {
        $Output = Get-Content $Info.StdOutLog -Raw
        if ($Output) { Write-Host $Output }
    }

    if (Test-Path $Info.StdErrLog) {
        $ErrorOutput = Get-Content $Info.StdErrLog -Raw
        if ($ErrorOutput) { Write-Host $ErrorOutput -ForegroundColor Yellow }
    }

    if ($null -eq $Info.Process) {
        $Failed++
        Write-Host "Shard $($Info.Shard) FAILED TO START" -ForegroundColor Red
    } else {
        $ExitCode = $Info.Process.ExitCode
        if ($ExitCode -ne 0) {
            $Failed++
            Write-Host "Shard $($Info.Shard) FAILED (Exit Code: $ExitCode)" -ForegroundColor Red
        } else {
            Write-Host "Shard $($Info.Shard) PASSED" -ForegroundColor Green
        }
    }
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Merging reports from all shards..." -ForegroundColor Cyan

$MergeOutput = npx playwright merge-reports -c reportMerge.config.ts "$BlobDir" 2>&1
$MergeExitCode = $LASTEXITCODE

if ($MergeExitCode -eq 0) {
    Write-Host "Merged report generated successfully!" -ForegroundColor Green
    Write-Host "Report location: playwright-report\index.html" -ForegroundColor Cyan
} else {
    Write-Host "Report merging failed!" -ForegroundColor Red
    Write-Host $MergeOutput
    exit 1
}

Write-Host ""
Write-Host "All individual shard reports: $ReportDir" -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Cyan

if ($Failed -gt 0) {
    Write-Host "$Failed out of $Shards shard(s) failed!" -ForegroundColor Red
    exit 1
} else {
    Write-Host "All $Shards shards passed!" -ForegroundColor Green
    exit 0
}