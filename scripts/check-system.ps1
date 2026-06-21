# EMOVEL-OS System Check
# Verifies that all required local tool folders exist.

$downloadsPath = "$env:USERPROFILE\Downloads"
$desktopPath   = "$env:USERPROFILE\Desktop"

$tools = @(
    @{ Name = "claude-council-main";         Base = $downloadsPath },
    @{ Name = "claude-cowork";               Base = $downloadsPath },
    @{ Name = "gpt-pilot-main";              Base = $desktopPath   },
    @{ Name = "claude-code-main";            Base = $downloadsPath },
    @{ Name = "n8n-master";                  Base = $downloadsPath },
    @{ Name = "knowledge-work-plugins-main"; Base = $downloadsPath },
    @{ Name = "reflex-main";                 Base = $downloadsPath }
)

Write-Host ""
Write-Host "EMOVEL-OS — Local Tool Check" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

$allFound = $true

foreach ($tool in $tools) {
    $fullPath = Join-Path $tool.Base $tool.Name
    if (Test-Path $fullPath) {
        Write-Host "  [OK]  $($tool.Name)" -ForegroundColor Green
        Write-Host "        $fullPath" -ForegroundColor DarkGray
    } else {
        Write-Host "  [!!]  $($tool.Name) -- NOT FOUND" -ForegroundColor Red
        Write-Host "        Expected: $fullPath" -ForegroundColor DarkGray
        $allFound = $false
    }
    Write-Host ""
}

Write-Host "=============================" -ForegroundColor Cyan

if ($allFound) {
    Write-Host "All tools found. EMOVEL-OS is ready." -ForegroundColor Green
} else {
    Write-Host "Some tools are missing. See INSTALLATION.md for setup instructions." -ForegroundColor Yellow
    Write-Host "docs\INSTALLATION.md" -ForegroundColor DarkGray
}

Write-Host ""
