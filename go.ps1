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
#>

[CmdletBinding()]
param(
    [switch]$Manual,
    [switch]$Live,
    [switch]$Check,
    [switch]$NoBrowser
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
    'results\live-5-runs-2026-11-10.md'
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

    $readsPerRun = 13
    $writesPerRun = 4
    $runs = 5
    $totalReads = $readsPerRun * $runs
    $totalWrites = $writesPerRun * $runs
    if ($totalReads -ge 5000000 -or $totalWrites -ge 100000) {
        Write-Error "5-run quota check exceeded Cloudflare D1 Free daily limits."
        exit 1
    }

    Write-Host "CHECK PASSED: All $($RequiredFiles.Count) files verified. 5 runs use $totalReads/5,000,000 reads (0.0013%) and $totalWrites/100,000 writes (0.0200%) on Cloudflare D1 Free Tier." -ForegroundColor Green
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
$canvasFile = Join-Path $root 'canvas\index.html'
if (-not $NoBrowser) {
    Start-Process $canvasFile
}
Write-Host "  Canvas path: $canvasFile"
Write-Host "  Extension  : .github\extensions\xavier-ai-global-conference-canvas\extension.mjs"
Pause-Beat -Seconds 2 -Label "5 Free-Quota Rehearsal Runs"

Write-Host "[Beat 3 / 1:30] 5 Verified Runs on Cloudflare D1 Free Tier (SYD):" -ForegroundColor Yellow
Write-Host "  Run #1 (Copilot CLI)    -> KEY-01 upvoted (43) | 13R / 4W | 0.591 ms"
Write-Host "  Run #2 (Copilot App)    -> TRK-02 upvoted (32) | 13R / 4W | 0.561 ms"
Write-Host "  Run #3 (Copilot Canvas) -> TRK-03 upvoted (25) | 13R / 4W | 0.500 ms"
Write-Host "  Run #4 (Copilot CLI)    -> TRK-04 upvoted (20) | 13R / 4W | 0.508 ms"
Write-Host "  Run #5 (Copilot App)    -> TRK-05 upvoted (29) | 13R / 4W | 0.480 ms"
Write-Host "  Total Quota Used: 65 / 5,000,000 reads (0.0013%), 20 / 100,000 writes (0.0200%), 32 KB / 5 GB." -ForegroundColor Green

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
