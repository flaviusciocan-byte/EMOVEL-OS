# EMOVEL-OS Local Setup Helper
# Prints setup instructions for tools that are missing.
# Does not install anything automatically.

Write-Host ""
Write-Host "EMOVEL-OS — Setup Guide" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Run check-system.ps1 first to see which tools are missing." -ForegroundColor Yellow
Write-Host ""
Write-Host "Manual setup steps:" -ForegroundColor White
Write-Host ""
Write-Host "1. Claude Code CLI" -ForegroundColor Cyan
Write-Host "   npm install -g @anthropic-ai/claude-code"
Write-Host ""
Write-Host "2. Node.js (required for n8n and Claude Code CLI)" -ForegroundColor Cyan
Write-Host "   https://nodejs.org — download LTS version"
Write-Host ""
Write-Host "3. Python 3.10+ (required for GPT-Pilot and Reflex)" -ForegroundColor Cyan
Write-Host "   https://python.org/downloads"
Write-Host ""
Write-Host "4. Git with SSH key for GitHub" -ForegroundColor Cyan
Write-Host "   ssh-keygen -t ed25519 -C 'your@email.com'"
Write-Host "   Then add the public key to: https://github.com/settings/keys"
Write-Host ""
Write-Host "5. n8n (local)" -ForegroundColor Cyan
Write-Host "   npx n8n"
Write-Host "   Or navigate to n8n-master/ and follow its README"
Write-Host ""
Write-Host "After setup, run check-system.ps1 again to confirm." -ForegroundColor Green
Write-Host ""
