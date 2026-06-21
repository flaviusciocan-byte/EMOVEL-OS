# EMOVEL-OS Tool Registration
# Finds a tool on disk and stores its path in config/tools.json.
# Future check-system.ps1 runs will use the registered path directly.
#
# Usage:
#   .\scripts\register-tool.ps1 "claude-council-main"
#   .\scripts\register-tool.ps1 "claude-council-main" "C:\MyFolder\claude-council-main"

param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$ToolName,

    [Parameter(Mandatory=$false, Position=1)]
    [string]$ExplicitPath
)

$repoRoot   = Split-Path $PSScriptRoot -Parent
$configFile = Join-Path $repoRoot 'config\tools.json'

if (-not (Test-Path $configFile)) {
    Write-Host "[Error] config/tools.json not found at: $configFile" -ForegroundColor Red
    Write-Host '        Run this script from the EMOVEL-OS directory, or clone the repo first.' -ForegroundColor DarkGray
    exit 1
}

$config      = Get-Content $configFile -Raw | ConvertFrom-Json
$searchPaths = $config.searchPaths

Write-Host ''
Write-Host "Registering: $ToolName" -ForegroundColor Cyan
Write-Host ''

# --- Resolve the final path ---
if ($ExplicitPath) {
    # User provided path directly -- validate it
    if (-not (Test-Path $ExplicitPath -PathType Container)) {
        Write-Host "[Error] Path not found: $ExplicitPath" -ForegroundColor Red
        exit 1
    }
    $resolvedPath = (Resolve-Path $ExplicitPath).Path
    Write-Host "  Using explicit path:" -ForegroundColor DarkGray
    Write-Host "  $resolvedPath" -ForegroundColor Green
}
else {
    # Auto-search across all configured search paths
    Write-Host '  Searching in:' -ForegroundColor DarkGray
    foreach ($p in $searchPaths) { Write-Host "    $p" -ForegroundColor DarkGray }
    Write-Host ''

    $allMatches = [System.Collections.Generic.List[string]]::new()

    foreach ($base in $searchPaths) {
        if (-not (Test-Path $base -PathType Container)) { continue }

        # Direct child (fast path)
        $direct = Join-Path $base $ToolName
        if (Test-Path $direct -PathType Container) {
            $allMatches.Add($direct)
            continue
        }

        # Recursive search, depth 5 (deeper than check-system to be thorough)
        $hits = Get-ChildItem -Path $base -Directory -Recurse -Depth 5 -ErrorAction SilentlyContinue |
                Where-Object { $_.Name -eq $ToolName }
        foreach ($h in $hits) { $allMatches.Add($h.FullName) }
    }

    if ($allMatches.Count -eq 0) {
        Write-Host "  [!!] '$ToolName' not found in any search path." -ForegroundColor Red
        Write-Host ''
        Write-Host '  Options:' -ForegroundColor Yellow
        Write-Host "    1. Specify the path directly:" -ForegroundColor Yellow
        Write-Host "       .\scripts\register-tool.ps1 `"$ToolName`" `"C:\path\to\$ToolName`"" -ForegroundColor White
        Write-Host "    2. Add a custom search path to config/tools.json under 'searchPaths'." -ForegroundColor Yellow
        Write-Host ''
        exit 1
    }

    if ($allMatches.Count -gt 1) {
        Write-Host "  Found $($allMatches.Count) matches -- using the first one:" -ForegroundColor Yellow
        foreach ($m in $allMatches) {
            Write-Host "    $m" -ForegroundColor DarkGray
        }
        Write-Host ''
    }

    $resolvedPath = $allMatches[0]
    Write-Host "  Found: $resolvedPath" -ForegroundColor Green
}

# --- Write to tools.json ---
$toolProp = $config.tools.PSObject.Properties[$ToolName]

if ($null -eq $toolProp) {
    # Tool not in config yet -- add it
    $newEntry = [PSCustomObject]@{
        registeredPath = $resolvedPath
        description    = 'Registered via register-tool.ps1'
    }
    Add-Member -InputObject $config.tools -MemberType NoteProperty -Name $ToolName -Value $newEntry
    Write-Host "  Added '$ToolName' to config." -ForegroundColor DarkGray
} else {
    # Update existing entry
    $toolProp.Value.registeredPath = $resolvedPath
    Write-Host "  Updated '$ToolName' in config." -ForegroundColor DarkGray
}

$json = $config | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText($configFile, $json, [System.Text.Encoding]::UTF8)

Write-Host ''
Write-Host "  Saved to: $configFile" -ForegroundColor Green
Write-Host ''
Write-Host '  Run .\scripts\check-system.ps1 to verify and regenerate SYSTEM_STATUS.md.' -ForegroundColor DarkGray
Write-Host ''
