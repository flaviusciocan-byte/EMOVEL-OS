# EMOVEL-OS Health Monitor
# Scans for all registered tools, checks git state and branch, runs health
# check commands, and writes docs/HEALTH_STATUS.md with a readiness score.
#
# Usage:
#   .\scripts\check-system.ps1             # full scan + generate HEALTH_STATUS.md
#   .\scripts\check-system.ps1 -NoFile     # console output only
#   .\scripts\check-system.ps1 -Quick      # skip health check commands (path + git only)

param(
    [switch]$NoFile,
    [switch]$Quick
)

$repoRoot         = Split-Path $PSScriptRoot -Parent
$configFile       = Join-Path $repoRoot 'config\tools.json'
$healthConfigFile = Join-Path $repoRoot 'config\health-checks.json'
$healthStatusFile = Join-Path $repoRoot 'docs\HEALTH_STATUS.md'

# ── Fallback defaults ─────────────────────────────────────────────────────────

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

# ── Load configs ──────────────────────────────────────────────────────────────

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

if (Test-Path $healthConfigFile) {
    $healthConfig = Get-Content $healthConfigFile -Raw | ConvertFrom-Json
} else {
    Write-Host '[!] config/health-checks.json not found -- health checks disabled.' -ForegroundColor Yellow
    $healthConfig = $null
}

# ── Helper: locate a tool folder ─────────────────────────────────────────────

function Find-ToolPath {
    param(
        [string]   $ToolName,
        [string[]] $SearchPaths,
        [string]   $RegisteredPath
    )

    if ($RegisteredPath -and (Test-Path $RegisteredPath -PathType Container)) {
        return $RegisteredPath
    }

    foreach ($base in $SearchPaths) {
        if (-not (Test-Path $base -PathType Container)) { continue }

        $direct = Join-Path $base $ToolName
        if (Test-Path $direct -PathType Container) { return $direct }

        $hit = Get-ChildItem -Path $base -Directory -Recurse -Depth 3 -ErrorAction SilentlyContinue |
               Where-Object { $_.Name -eq $ToolName } |
               Select-Object -First 1
        if ($hit) { return $hit.FullName }
    }

    return $null
}

# ── Helper: git metadata (status, branch, last commit) ───────────────────────

function Get-GitInfo {
    param([string]$Path)

    $none = [PSCustomObject]@{
        IsRepo     = $false
        Status     = '--'
        Branch     = '--'
        LastCommit = '--'
    }

    $gitDir = Join-Path $Path '.git'
    if (-not (Test-Path $gitDir -PathType Container)) { return $none }

    $porcelain  = & git -C $Path status --porcelain 2>$null
    $status     = if ($porcelain) { 'Modified' } else { 'Clean' }

    $branch     = & git -C $Path rev-parse --abbrev-ref HEAD 2>$null
    if (-not $branch) { $branch = '--' }

    $logLine    = & git -C $Path log -1 '--format=%h|%s|%ci' 2>$null
    $lastCommit = '--'
    if ($logLine) {
        $parts = $logLine -split '\|', 3
        if ($parts.Count -ge 3) {
            $hash = $parts[0].Trim()
            $subj = $parts[1].Trim()
            $date = $parts[2].Trim()
            if ($date.Length -ge 10) { $date = $date.Substring(0, 10) }
            $lastCommit = "$hash  $subj  ($date)"
        }
    }

    return [PSCustomObject]@{
        IsRepo     = $true
        Status     = $status
        Branch     = $branch
        LastCommit = $lastCommit
    }
}

# ── Helper: run a health check command with timeout ───────────────────────────
# Uses System.Diagnostics.Process directly for reliable WD + timeout control.

function Invoke-HealthCheck {
    param(
        [string]$WorkingDir,
        [string]$Command,
        [int]   $TimeoutSec = 20
    )

    if (-not $Command) {
        return [PSCustomObject]@{ Pass = $null; Label = 'N/A'; Detail = 'No check configured' }
    }

    $tokens = $Command -split '\s+', 2
    $exe    = $tokens[0]
    $argStr = if ($tokens.Count -gt 1) { $tokens[1] } else { '' }

    try {
        $psi                        = New-Object System.Diagnostics.ProcessStartInfo
        $psi.FileName               = $exe
        $psi.Arguments              = $argStr
        $psi.WorkingDirectory       = $WorkingDir
        $psi.RedirectStandardOutput = $true
        $psi.RedirectStandardError  = $true
        $psi.UseShellExecute        = $false
        $psi.CreateNoWindow         = $true

        $proc     = [System.Diagnostics.Process]::Start($psi)
        $outAsync = $proc.StandardOutput.ReadToEndAsync()
        $errAsync = $proc.StandardError.ReadToEndAsync()
        $exited   = $proc.WaitForExit($TimeoutSec * 1000)

        if (-not $exited) {
            try { $proc.Kill() } catch {}
            return [PSCustomObject]@{ Pass = $false; Label = 'Timeout'; Detail = "No response in ${TimeoutSec}s" }
        }

        [void]$outAsync.Wait()
        [void]$errAsync.Wait()

        $stdout = $outAsync.Result.Trim() -replace '[\r\n]+', ' '
        $stderr = $errAsync.Result.Trim() -replace '[\r\n]+', ' '
        $output = if ($stdout) { $stdout } elseif ($stderr) { $stderr } else { '(no output)' }
        if ($output.Length -gt 90) { $output = $output.Substring(0, 90) + '...' }

        $pass  = ($proc.ExitCode -eq 0)
        $label = if ($pass) { 'Pass' } else { 'Fail' }
        return [PSCustomObject]@{ Pass = $pass; Label = $label; Detail = $output }

    } catch [System.ComponentModel.Win32Exception] {
        return [PSCustomObject]@{ Pass = $false; Label = 'Fail'; Detail = "Not found in PATH: $exe" }
    } catch {
        $msg = $_.Exception.Message
        if ($msg.Length -gt 90) { $msg = $msg.Substring(0, 90) }
        return [PSCustomObject]@{ Pass = $false; Label = 'Fail'; Detail = $msg }
    }
}

# ── Main scan ─────────────────────────────────────────────────────────────────

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
    $git      = if ($location) { Get-GitInfo -Path $location } else {
                    [PSCustomObject]@{ IsRepo = $false; Status = '--'; Branch = '--'; LastCommit = '--' }
                }

    # Health check
    $healthCmd = $null
    if ($healthConfig) {
        $hProp = $healthConfig.PSObject.Properties[$name]
        if ($hProp) { $healthCmd = $hProp.Value.command }
    }

    if ($location -and -not $Quick) {
        $health = Invoke-HealthCheck -WorkingDir $location -Command $healthCmd
    } elseif ($location -and $Quick) {
        $health = if ($healthCmd) {
                      [PSCustomObject]@{ Pass = $null; Label = 'Skipped'; Detail = 'Use without -Quick to run' }
                  } else {
                      [PSCustomObject]@{ Pass = $null; Label = 'N/A'; Detail = 'No check configured' }
                  }
    } else {
        $health = [PSCustomObject]@{ Pass = $null; Label = '--'; Detail = 'Tool not found' }
    }

    # Ready = path found AND (no check OR check passed)
    if (-not $location) {
        $ready = 'No'
    } elseif ($health.Pass -eq $false) {
        $ready = 'No'
    } else {
        $ready = 'Yes'
    }

    $displayLocation = if ($location) { $location } else { 'NOT FOUND' }

    $rows += [PSCustomObject]@{
        Tool        = $name
        Description = $description
        Location    = $displayLocation
        GitStatus   = $git.Status
        Branch      = $git.Branch
        LastCommit  = $git.LastCommit
        HealthLabel = $health.Label
        HealthDetail= $health.Detail
        Ready       = $ready
    }
}

# ── Console output ────────────────────────────────────────────────────────────

Write-Host ''
Write-Host 'EMOVEL-OS -- Health Monitor' -ForegroundColor Cyan
Write-Host '===========================' -ForegroundColor Cyan
Write-Host ''

foreach ($r in $rows) {
    if ($r.Ready -eq 'Yes') {
        Write-Host "  [OK]  $($r.Tool)" -ForegroundColor Green
    } else {
        $notFoundColor = if ($r.Location -eq 'NOT FOUND') { 'Red' } else { 'Yellow' }
        Write-Host "  [!!]  $($r.Tool)" -ForegroundColor $notFoundColor
    }

    Write-Host "        Path   : $($r.Location)" -ForegroundColor DarkGray
    Write-Host "        Git    : $($r.GitStatus)  |  Branch: $($r.Branch)" -ForegroundColor DarkGray
    Write-Host "        Commit : $($r.LastCommit)" -ForegroundColor DarkGray
    Write-Host "        Health : $($r.HealthLabel)  --  $($r.HealthDetail)" -ForegroundColor DarkGray
    Write-Host ''
}

# ── Readiness score ───────────────────────────────────────────────────────────

$readyCount      = ($rows | Where-Object { $_.Ready -eq 'Yes' }).Count
$foundCount      = ($rows | Where-Object { $_.Location -ne 'NOT FOUND' }).Count
$totalCount      = $rows.Count
$pct             = [Math]::Round(($readyCount / $totalCount) * 100)

Write-Host '===========================' -ForegroundColor Cyan
Write-Host ''
Write-Host '  EMOVEL-OS Readiness Score' -ForegroundColor White
Write-Host "  $readyCount / $totalCount tools operational" -ForegroundColor $(if ($readyCount -eq $totalCount) { 'Green' } elseif ($readyCount -eq 0) { 'Red' } else { 'Yellow' })
Write-Host "  $pct% readiness" -ForegroundColor $(if ($pct -ge 80) { 'Green' } elseif ($pct -ge 40) { 'Yellow' } else { 'Red' })
Write-Host ''

if ($Quick) {
    Write-Host '  [Quick mode] Health check commands were skipped.' -ForegroundColor DarkGray
    Write-Host '  Run without -Quick to execute health checks.' -ForegroundColor DarkGray
    Write-Host ''
}

# ── Generate HEALTH_STATUS.md ─────────────────────────────────────────────────

if (-not $NoFile) {
    $now = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'

    $lines = [System.Collections.Generic.List[string]]::new()
    $lines.Add('# EMOVEL-OS Health Status')
    $lines.Add('')
    $lines.Add("**Generated:** $now")
    if ($Quick) { $lines.Add('> Health check commands skipped (Quick mode).') }
    $lines.Add('')

    # Score block
    $lines.Add('## Readiness Score')
    $lines.Add('')
    $lines.Add("| Metric | Value |")
    $lines.Add("|---|---|")
    $lines.Add("| Tools operational | $readyCount / $totalCount |")
    $lines.Add("| Tools found on disk | $foundCount / $totalCount |")
    $lines.Add("| Overall readiness | $pct% |")
    $lines.Add('')

    # Tool table
    $lines.Add('## Tool Registry')
    $lines.Add('')
    $lines.Add('| Tool | Location | Git Status | Branch | Last Commit | Health Check | Ready |')
    $lines.Add('|---|---|---|---|---|---|---|')

    foreach ($r in $rows) {
        $loc    = $r.Location    -replace '\|', '-'
        $commit = $r.LastCommit  -replace '\|', '-'
        $detail = $r.HealthDetail -replace '\|', '-'
        $hcell  = "$($r.HealthLabel) -- $detail"
        $lines.Add("| $($r.Tool) | $loc | $($r.GitStatus) | $($r.Branch) | $commit | $hcell | $($r.Ready) |")
    }

    $lines.Add('')
    $lines.Add('## Tool Details')
    $lines.Add('')

    foreach ($r in $rows) {
        $statusIcon = if ($r.Ready -eq 'Yes') { 'OK' } else { 'NOT READY' }
        $lines.Add("### $($r.Tool)  [$statusIcon]")
        $lines.Add('')
        $lines.Add("- **Description:** $($r.Description)")
        $lines.Add("- **Location:** $($r.Location)")
        $lines.Add("- **Git repo:** $($r.GitStatus)")
        $lines.Add("- **Branch:** $($r.Branch)")
        $lines.Add("- **Last commit:** $($r.LastCommit)")
        $lines.Add("- **Health check:** $($r.HealthLabel)")
        if ($r.HealthDetail -and $r.HealthDetail -ne 'No check configured' -and $r.HealthDetail -ne 'Tool not found') {
            $lines.Add("- **Output:** ``$($r.HealthDetail)``")
        }
        $lines.Add('')
    }

    # Instructions for missing tools
    $missingRows = $rows | Where-Object { $_.Location -eq 'NOT FOUND' }
    if ($missingRows) {
        $lines.Add('## Missing Tools')
        $lines.Add('')
        $lines.Add('Register missing tools by running:')
        $lines.Add('')
        $lines.Add('```powershell')
        foreach ($m in $missingRows) {
            $lines.Add(".\scripts\register-tool.ps1 `"$($m.Tool)`"")
        }
        $lines.Add('```')
        $lines.Add('')
        $lines.Add('Or with an explicit path if auto-search fails:')
        $lines.Add('')
        $lines.Add('```powershell')
        $lines.Add('.\scripts\register-tool.ps1 "tool-name" "C:\path\to\tool"')
        $lines.Add('```')
    }

    $content = $lines -join [System.Environment]::NewLine
    [System.IO.File]::WriteAllText($healthStatusFile, $content, [System.Text.Encoding]::UTF8)

    Write-Host "  HEALTH_STATUS.md written: $healthStatusFile" -ForegroundColor DarkGray
    Write-Host ''
}
