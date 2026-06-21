# EMOVEL-OS System Check
# Auto-searches for all tools, reads registered paths from config/tools.json,
# and writes docs/SYSTEM_STATUS.md with full git status for each tool.
#
# Usage:
#   .\scripts\check-system.ps1            # full check + generate SYSTEM_STATUS.md
#   .\scripts\check-system.ps1 -NoFile    # console only, skip markdown output

param(
    [switch]$NoFile
)

$repoRoot   = Split-Path $PSScriptRoot -Parent
$configFile = Join-Path $repoRoot 'config\tools.json'
$statusFile = Join-Path $repoRoot 'docs\SYSTEM_STATUS.md'

# --- Defaults used when tools.json is missing ---
$fallbackSearchPaths = @(
    'C:\Users\flavi\Downloads',
    'C:\Users\flavi\Desktop',
    'C:\EMOVEL',
    'D:\EMOVEL',
    'E:\EMOVEL'
)

$fallbackToolNames = @(
    'claude-council-main',
    'claude-cowork',
    'gpt-pilot-main',
    'claude-code-main',
    'n8n-master',
    'knowledge-work-plugins-main',
    'reflex-main'
)

# --- Load config ---
if (Test-Path $configFile) {
    $config      = Get-Content $configFile -Raw | ConvertFrom-Json
    $searchPaths = $config.searchPaths
    $toolNames   = $config.tools.PSObject.Properties.Name
} else {
    Write-Host '[!] config/tools.json not found -- using built-in defaults.' -ForegroundColor Yellow
    $config      = $null
    $searchPaths = $fallbackSearchPaths
    $toolNames   = $fallbackToolNames
}

# --- Helper: locate a tool folder ---
function Find-ToolPath {
    param(
        [string]   $ToolName,
        [string[]] $SearchPaths,
        [string]   $RegisteredPath
    )

    # Use the registered path if it still exists on disk
    if ($RegisteredPath -and (Test-Path $RegisteredPath -PathType Container)) {
        return $RegisteredPath
    }

    foreach ($base in $SearchPaths) {
        if (-not (Test-Path $base -PathType Container)) { continue }

        # Direct child match (fast path)
        $direct = Join-Path $base $ToolName
        if (Test-Path $direct -PathType Container) {
            return $direct
        }

        # Recursive search, capped at depth 3 for speed
        $hit = Get-ChildItem -Path $base -Directory -Recurse -Depth 3 -ErrorAction SilentlyContinue |
               Where-Object { $_.Name -eq $ToolName } |
               Select-Object -First 1

        if ($hit) { return $hit.FullName }
    }

    return $null
}

# --- Helper: get git metadata for a folder ---
function Get-GitInfo {
    param([string]$Path)

    $result = [PSCustomObject]@{
        IsRepo     = $false
        Status     = '--'
        LastCommit = '--'
    }

    $gitDir = Join-Path $Path '.git'
    if (-not (Test-Path $gitDir -PathType Container)) { return $result }

    $result.IsRepo = $true

    # Clean vs modified
    $porcelain = & git -C $Path status --porcelain 2>$null
    $result.Status = if ($porcelain) { 'Modified' } else { 'Clean' }

    # Last commit: hash | subject | date
    $logLine = & git -C $Path log -1 '--format=%h|%s|%ci' 2>$null
    if ($logLine) {
        $parts = $logLine -split '\|', 3
        if ($parts.Count -ge 3) {
            $hash = $parts[0].Trim()
            $subj = $parts[1].Trim()
            $date = $parts[2].Trim()
            if ($date.Length -ge 10) { $date = $date.Substring(0, 10) }
            $result.LastCommit = "$hash  $subj  ($date)"
        }
    }

    return $result
}

# --- Main scan ---
$rows = @()

foreach ($name in $toolNames) {
    $registeredPath = $null
    $description    = '--'

    if ($config) {
        $prop = $config.tools.PSObject.Properties[$name]
        if ($prop) {
            $registeredPath = $prop.Value.registeredPath
            $description    = $prop.Value.description
        }
    }

    $location = Find-ToolPath -ToolName $name -SearchPaths $searchPaths -RegisteredPath $registeredPath

    if ($location) {
        $git   = Get-GitInfo -Path $location
        $ready = 'Yes'
    } else {
        $git   = [PSCustomObject]@{ IsRepo = $false; Status = '--'; LastCommit = '--' }
        $ready = 'No'
        $location = 'NOT FOUND'
    }

    $rows += [PSCustomObject]@{
        Tool        = $name
        Description = $description
        Location    = $location
        GitStatus   = $git.Status
        LastCommit  = $git.LastCommit
        Ready       = $ready
    }
}

# --- Console output ---
Write-Host ''
Write-Host 'EMOVEL-OS -- System Status' -ForegroundColor Cyan
Write-Host '==========================' -ForegroundColor Cyan
Write-Host ''

foreach ($r in $rows) {
    if ($r.Ready -eq 'Yes') {
        Write-Host "  [OK]  $($r.Tool)" -ForegroundColor Green
        Write-Host "        Path : $($r.Location)" -ForegroundColor DarkGray
        Write-Host "        Git  : $($r.GitStatus)  |  Last: $($r.LastCommit)" -ForegroundColor DarkGray
    } else {
        Write-Host "  [!!]  $($r.Tool)  --  NOT FOUND" -ForegroundColor Red
        Write-Host "        Run: .\scripts\register-tool.ps1 '$($r.Tool)'" -ForegroundColor DarkGray
    }
    Write-Host ''
}

$readyCount = ($rows | Where-Object { $_.Ready -eq 'Yes' }).Count
$totalCount = $rows.Count

Write-Host '==========================' -ForegroundColor Cyan

$summaryColor = 'Yellow'
if ($readyCount -eq $totalCount) { $summaryColor = 'Green' }
Write-Host "$readyCount / $totalCount tools ready." -ForegroundColor $summaryColor
Write-Host ''

# --- Generate SYSTEM_STATUS.md ---
if (-not $NoFile) {
    $now = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'

    $lines = [System.Collections.Generic.List[string]]::new()
    $lines.Add('# EMOVEL-OS System Status')
    $lines.Add('')
    $lines.Add("**Generated:** $now")
    $lines.Add('')
    $lines.Add('## Tool Registry')
    $lines.Add('')
    $lines.Add('| Tool | Location | Git Status | Last Commit | Ready |')
    $lines.Add('|---|---|---|---|---|')

    foreach ($r in $rows) {
        # Sanitize pipe chars that would break the table
        $loc    = $r.Location    -replace '\|', '-'
        $commit = $r.LastCommit  -replace '\|', '-'
        $lines.Add("| $($r.Tool) | $loc | $($r.GitStatus) | $commit | $($r.Ready) |")
    }

    $lines.Add('')
    $lines.Add('## Summary')
    $lines.Add('')
    $lines.Add("$readyCount of $totalCount tools found.")
    $lines.Add('')

    if ($readyCount -lt $totalCount) {
        $lines.Add('### Missing Tools')
        $lines.Add('')
        $lines.Add('Run `register-tool.ps1` for each missing tool:')
        $lines.Add('')
        $lines.Add('```powershell')
        $lines.Add('.\scripts\register-tool.ps1 "tool-name"')
        $lines.Add('# or specify path explicitly:')
        $lines.Add('.\scripts\register-tool.ps1 "tool-name" "C:\path\to\tool"')
        $lines.Add('```')
        $lines.Add('')
        $lines.Add('See [docs/INSTALLATION.md](INSTALLATION.md) for expected paths.')
    }

    $content = $lines -join [System.Environment]::NewLine
    [System.IO.File]::WriteAllText($statusFile, $content, [System.Text.Encoding]::UTF8)

    Write-Host "SYSTEM_STATUS.md written to: $statusFile" -ForegroundColor DarkGray
    Write-Host ''
}
