<#
.SYNOPSIS
    Xavier AI Global Conference Demo runner ($0 Cloudflare Free Tier + Copilot CLI & App Canvas).

.DESCRIPTION
    Validates the demo assets, prints the 5-run Cloudflare D1 Free-Tier rehearsal
    beats, and opens the interactive Conference Canvas.

.PARAMETER Manual
    Advance each beat with Enter instead of a timer.

.PARAMETER Live
    Launch GitHub Copilot CLI in this directory to run live Cloudflare MCP queries
    and open the project Canvas extension.

.PARAMETER Check
    Validate all demo files, SQL scripts, and 5-run free-quota math, then exit.

.PARAMETER NoBrowser
    Print the beats without opening browser windows.

.PARAMETER CanvasVersion
    Open the v3 story (default), v2 recorded dashboard, or v1 historical local replay.
#>

[CmdletBinding()]
param(
    [switch]$Manual,
    [switch]$Live,
    [switch]$Check,
    [switch]$NoBrowser,
    [ValidateSet(1, 2, 3)]
    [int]$CanvasVersion = 3
)

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot

$RequiredFiles = @(
    'README.md',
    'CLICK-THROUGH.md',
    'RUN-SHEET.md',
    'PROMPTS.md',
    'wrangler.jsonc',
    'src\worker.js',
    'sql\schema.sql',
    'sql\five-runs.sql',
    'canvas\index.html',
    '.github\extensions\xavier-ai-global-conference-canvas\extension.mjs',
    'results\live-5-runs-2026-11-10.md',
    'canvas\server.mjs',
    'canvas\v2\index.html',
    'canvas\v3\index.html',
    'canvas\README.md',
    'results\history\conference-d1-snapshot-2026-11-10.json',
    'results\history\conference-d1-before-rerun-2026-11-10.json',
    'results\history\README.md',
    'HISTORY.md',
    'tests\canvas.test.mjs'
)

if ($Check) {
    $missing = @()
    foreach ($rel in $RequiredFiles) {
        $full = Join-Path $root $rel
        if (-not (Test-Path $full)) {
            $missing += $rel
        }
    }
    if ($missing.Count -gt 0) {
        Write-Error ("Missing required demo files: " + ($missing -join ', '))
        exit 1
    }

    $html = Get-Content (Join-Path $root 'canvas\index.html') -Raw
    if ($html -notmatch 'b85fd8c0-b02b-4da6-86e2-012ae7ff743d') {
        Write-Error "canvas\index.html is missing verified D1 database ID."
        exit 1
    }

    $snapshot = Get-Content (Join-Path $root 'results\history\conference-d1-snapshot-2026-11-10.json') -Raw | ConvertFrom-Json
    if (($snapshot.demoRuns.run_number | Sort-Object) -join ',' -ne '1,2,3,4,5') {
        throw 'Snapshot must contain exactly Runs 1 through 5.'
    }
    $totalReads = ($snapshot.demoRuns | Measure-Object rows_read -Sum).Sum
    $totalWrites = ($snapshot.demoRuns | Measure-Object rows_written -Sum).Sum
    if ($totalReads -ge 5000000 -or $totalWrites -ge 100000) {
        Write-Error "5-run quota check exceeded Cloudflare D1 Free daily limits."
        exit 1
    }

    Write-Host "CHECK PASSED: All $($RequiredFiles.Count) files verified. Recorded workload: $totalReads/5,000,000 reads and $totalWrites/100,000 writes. Telemetry and verification are additional; see results\history\README.md." -ForegroundColor Green
    exit 0
}

function Pause-Beat([int]$Seconds, [string]$Label) {
    if ($Manual) {
        Read-Host "  [Press Enter for next beat: $Label]" | Out-Null
    } else {
        Start-Sleep -Seconds $Seconds
    }
}

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  Xavier AI Global Conference Demo — Copilot CLI / App + Cloudflare   " -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  Account : 07a1d926b6f5652ec24ee8979839e6c6 (xavierxie31@gmail.com)"
Write-Host "  D1 DB   : xavier-ai-global-conf-db (b85fd8c0-b02b-4da6-86e2-012ae7ff743d)"
Write-Host "  Region  : OC (Sydney edge colo SYD) — Workers Free + D1 Free (`$0)"
Write-Host ""

Write-Host "[Beat 1 / 0:00] Shared MCP Config across GitHub Copilot CLI & Copilot App" -ForegroundColor Yellow
Write-Host "  ~/.copilot/mcp-config.json connects https://mcp.cloudflare.com/mcp once for both CLI and App."
Pause-Beat -Seconds 2 -Label "Open Main Conference Canvas"

Write-Host "[Beat 2 / 0:45] Opening Xavier AI Global Conference Canvas..." -ForegroundColor Yellow
$canvasFile = Join-Path $root "canvas\v$CanvasVersion\index.html"
if ($CanvasVersion -eq 1) {
    $canvasFile = Join-Path $root 'canvas\index.html'
}
if (-not $NoBrowser -and $CanvasVersion -eq 1) {
    Start-Process $canvasFile
}
Write-Host "  Canvas v$CanvasVersion path: $canvasFile"
Write-Host "  Extension  : .github\extensions\xavier-ai-global-conference-canvas\extension.mjs"
Pause-Beat -Seconds 2 -Label "5 Free-Quota Rehearsal Runs"

Write-Host "[Beat 3 / 1:30] 5 Recorded Runs on Cloudflare D1 Free Tier (SYD):" -ForegroundColor Yellow
$snapshot = Get-Content (Join-Path $root 'results\history\conference-d1-snapshot-2026-11-10.json') -Raw | ConvertFrom-Json
foreach ($run in $snapshot.demoRuns) {
    $session = $snapshot.sessions | Where-Object id -eq $run.voted_session_id
    Write-Host "  Run #$($run.run_number) ($($run.surface)) -> $($run.voted_session_id) ($($session.upvotes) votes) | $($run.rows_read)R / $($run.rows_written)W | $($run.sql_duration_ms) ms"
}
Write-Host '  Workload: 15 reads / 20 writes; telemetry: +5 reads / 5 writes; full measured operation: 61 / 25.' -ForegroundColor Green
Write-Host '  Account-wide snapshot (10 Nov UTC): 187 / 5M reads, 68 / 100k writes. Not current usage.'
Write-Host '  Surface names are scenario labels; all five rerun workloads used one App MCP connection.'

if (-not $NoBrowser -and $CanvasVersion -ne 1) {
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        throw 'Node.js is required for v2/v3. Install Node.js 22+ or use -CanvasVersion 1 for the historical replay.'
    }
    Write-Host 'Starting read-only canvas server. Press Ctrl+C to stop; use -NoBrowser -Live to launch Copilot directly.'
    & node (Join-Path $root 'canvas\server.mjs') "--version=$CanvasVersion" --open
    if ($LASTEXITCODE -ne 0) { throw "Canvas server exited with $LASTEXITCODE." }
}

if ($Live) {
    Write-Host ""
    Write-Host "Launching GitHub Copilot CLI in repo directory..." -ForegroundColor Cyan
    Push-Location $root
    try {
        copilot
    } finally {
        Pop-Location
    }
}
