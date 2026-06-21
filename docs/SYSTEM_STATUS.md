# EMOVEL-OS System Status

**Generated:** 2026-06-21 (updated after local tool scan)

---

## Drive Scan Results

| Drive | Path | Status |
|---|---|---|
| C: | C:\EMOVEL | Exists — 04_AI_STACK, 10_EMOVEL_BUILDER, 20_PRODUCTS, 30_LABS and others |
| C: | C:\Users\flavi\Downloads | Exists — 6 tool ZIPs found |
| C: | C:\Users\flavi\Desktop | Exists — gpt-pilot-main, reflex-main extracted |
| D: | D:\EMOVEL | Drive not present |
| E: | E:\EMOVEL | Drive not present |
| F: | F:\ | Drive exists — no EMOVEL folder |

---

## Tool Registry

### Original Stack Tools

| Tool | Location | Status | Ready |
|---|---|---|---|
| claude-council-main | Not found as local repo | Prompt-based — no install needed | Yes (prompt) |
| claude-cowork | Not found as local repo | Session-based — no install needed | Yes (prompt) |
| gpt-pilot-main | C:\Users\flavi\Desktop\gpt-pilot-main | Extracted — missing pydantic | Partial |
| claude-code-main | Installed as CLI | CLI — no repo needed | Yes |
| n8n-master | Not extracted | Runnable via npx n8n | Yes (npx) |
| knowledge-work-plugins-main | Not found | Needs registration | No |
| reflex-main | C:\Users\flavi\Desktop\reflex-main | Extracted — reflex not in PATH | Partial |

### Premium UI & Visual Tools — Found in Downloads (ZIPs)

| Tool | ZIP Path | Size | Has package.json | Status |
|---|---|---|---|---|
| ui-ux-pro-max-skill-main | C:\Users\flavi\Downloads\ui-ux-pro-max-skill-main.zip | 4.8 MB | Yes (`uipro-cli` v2.5.0) | ZIP — not extracted |
| 21st-sdk-main | C:\Users\flavi\Downloads\21st-sdk-main.zip | 160 MB | Yes (monorepo template) | ZIP — not extracted |
| quant-ux-master | C:\Users\flavi\Downloads\quant-ux-master.zip | 6.2 MB | Yes (`quant-ux` v4.1.23) | ZIP — not extracted |
| nano-banana-2-ai-main | C:\Users\flavi\Downloads\nano-banana-2-ai-main.zip | 587 KB | Yes (`v0-nanobanana-template` v0.1.0) | ZIP — not extracted |
| nano-banana-pro-main | C:\Users\flavi\Downloads\Nano-Banana-Pro-main.zip | 4.8 KB | No (README only) | ZIP — not extracted |
| awesome-gpt-image-2-api-and-prompts-main | C:\Users\flavi\Downloads\awesome-gpt-image-2-API-and-Prompts-main.zip | 245 MB | No (prompt library) | ZIP — not extracted |

---

## Summary

- **Original stack tools found:** 2 of 7 extracted and on disk
- **New tools found as ZIPs:** 6 in C:\Users\flavi\Downloads
- **Total tools registered:** 13
- **Tools ready to use without extraction:** claude-council-main, claude-cowork, claude-code-main, n8n-master (via npx)
- **Tools needing extraction before use:** ui-ux-pro-max-skill-main, 21st-sdk-main, quant-ux-master, nano-banana-2-ai-main, nano-banana-pro-main, awesome-gpt-image-2-api-and-prompts-main

---

## Extraction Instructions

Recommended extraction target: `C:\EMOVEL\04_AI_STACK\`

To extract all newly found ZIPs:

```powershell
$downloads = "C:\Users\flavi\Downloads"
$target    = "C:\EMOVEL\04_AI_STACK"

$zips = @(
    "ui-ux-pro-max-skill-main.zip",
    "21st-sdk-main.zip",
    "quant-ux-master.zip",
    "nano-banana-2-ai-main.zip",
    "Nano-Banana-Pro-main.zip",
    "awesome-gpt-image-2-API-and-Prompts-main.zip"
)

foreach ($zip in $zips) {
    $name = [System.IO.Path]::GetFileNameWithoutExtension($zip)
    Expand-Archive -Path "$downloads\$zip" -DestinationPath "$target\$name" -Force
    Write-Host "Extracted: $name"
}
```

After extraction, run `npm install` in each Node.js project:

```powershell
foreach ($proj in @("ui-ux-pro-max-skill-main", "21st-sdk-main", "quant-ux-master", "nano-banana-2-ai-main")) {
    Push-Location "C:\EMOVEL\04_AI_STACK\$proj"
    npm install
    Pop-Location
}
```

---

## C:\EMOVEL Structure (Reference)

```
C:\EMOVEL\
├── 01_PROJECTS\
├── 02_INSTALLERS\
├── 03_DRIVERS\
├── 04_AI_STACK\          ← Recommended extraction target for new tools
├── 05_BACKUPS\
├── 06_KEYS_LOCAL_PRIVATE\
├── 07_LOGS\
├── 07_SCRIPTS\
├── 08_DOWNLOADS_STAGING\
├── 09_RESTORE_FROM_KINGSTON\
├── 10_EMOVEL_BUILDER\
├── 20_PRODUCTS\
├── 30_LABS\
├── 99_DISABLED_MODELS\
├── 99_TEMP_AUDIT\
└── AUTOPILOT_FACTORY_V1\
```

---

## Missing Tools

Run `register-tool.ps1` for each missing tool:

```powershell
.\scripts\register-tool.ps1 "tool-name"
# or specify path explicitly:
.\scripts\register-tool.ps1 "tool-name" "C:\path\to\tool"
```

See [docs/INSTALLATION.md](INSTALLATION.md) for expected paths.
