# EMOVEL-OS System Status

**Last scan:** 2026-06-21  
**Method:** Direct filesystem search + ZIP content inspection (no agents, no guesswork)

---

## Drive Scan

| Path | Found |
|---|---|
| C:\Users\flavi\Downloads | Yes — 13 ZIPs found |
| C:\Users\flavi\Desktop | Yes — gpt-pilot-main, reflex-main extracted |
| C:\EMOVEL | Yes — 04_AI_STACK empty, 30_LABS has EMOVEL_PAGE_BUILDER_V0_1 |
| D:\EMOVEL | Drive not present |
| E:\EMOVEL | Drive not present |
| F:\ | Drive exists — no EMOVEL folder |

---

## Tool Registry

### ZIPs Found in C:\Users\flavi\Downloads

| Tool | ZIP Path | Size | Type | package.json | requirements.txt | Dockerfile | docker-compose | Status |
|---|---|---|---|---|---|---|---|---|
| ui-ux-pro-max-skill-main | Downloads\ui-ux-pro-max-skill-main.zip | 4.8 MB | claude-plugin | No | No | No | No | ZIP_NOT_EXTRACTED |
| 21st-sdk-main | Downloads\21st-sdk-main.zip | 160 MB | node-monorepo | Yes | No | Yes | No | ZIP_NOT_EXTRACTED |
| quant-ux-master | Downloads\quant-ux-master.zip | 6.1 MB | vue-app | Yes (v4.1.23) | No | Yes | Yes | ZIP_NOT_EXTRACTED |
| nano-banana-2-ai-main | Downloads\nano-banana-2-ai-main.zip | 0.6 MB | nextjs-app | Yes (v0.1.0) | No | No | No | ZIP_NOT_EXTRACTED |
| Nano-Banana-Pro-main | Downloads\Nano-Banana-Pro-main.zip | 0.004 MB | documentation | No | No | No | No | README_ONLY |
| awesome-gpt-image-2-api | Downloads\awesome-gpt-image-2-API-and-Prompts-main.zip | 244.9 MB | prompt-library | No | No | No | No | ZIP_NOT_EXTRACTED |
| open-webui-main | Downloads\open-webui-main.zip | 53.4 MB | python-svelte | Yes (v0.9.6) | Yes | Yes | Yes | ZIP_NOT_EXTRACTED |
| penpot-develop | Downloads\penpot-develop.zip | 190.2 MB | clojure-app | No | No | Yes | Yes | ZIP_NOT_EXTRACTED |
| Cap-main | Downloads\Cap-main.zip | 93.3 MB | node-monorepo | Yes | No | Yes | No | ZIP_NOT_EXTRACTED |
| screenity-master | Downloads\screenity-master.zip | 10.9 MB | browser-ext | Yes (v4.5.3) | No | No | No | ZIP_NOT_EXTRACTED |
| OpenCut-main | Downloads\OpenCut-main.zip | 0.3 MB | node-monorepo | Yes | No | No | No | ZIP_NOT_EXTRACTED |
| n8n-master | Downloads\n8n-master.zip | 51.5 MB | node-monorepo | Yes (v2.27.0) | No | Yes | Yes | ZIP_NOT_EXTRACTED |
| claude-council-main | Downloads\claude-council-main.zip | 0.004 MB | claude-skill | Yes (v0.1.0) | No | No | No | ZIP_NOT_EXTRACTED |

### Extracted Tools on Desktop

| Tool | Path | Status |
|---|---|---|
| gpt-pilot-main | C:\Users\flavi\Desktop\gpt-pilot-main | EXTRACTED_BROKEN — pydantic missing |
| reflex-main | C:\Users\flavi\Desktop\reflex-main | EXTRACTED_BROKEN — reflex not in PATH |

### Tools Not Requiring Local Install

| Tool | Status |
|---|---|
| claude-code-main | OPERATIONAL — installed as global CLI |
| n8n | RUNNABLE via npx n8n or Docker without extracting source |
| claude-cowork | NOT_FOUND — not in any searched location |

---

## What Each Tool Actually Is

Based on ZIP inspection:

- **ui-ux-pro-max-skill-main** — Claude Code plugin with 7 skills (banner-design, brand, design-system, design, slides, ui-styling, ui-ux-pro-max). No npm/pip. Activate by copying `.claude/` folder into project root.

- **21st-sdk-main** — SDK monorepo for 21st Agents. Packages: agent-runtime, agent, cli, nextjs, node, python-sdk, react, ui. App: agents-web (Next.js).

- **quant-ux-master** — Vue.js UX research tool `quant-ux` v4.1.23. Has Dockerfile + docker-compose. Scripts: serve, build, test:unit, lint.

- **nano-banana-2-ai-main** — Next.js `v0-nanobanana-template` v0.1.0. Has `app/`, `components/`, `components.json`. Gemini 3.1 Flash Image frontend.

- **Nano-Banana-Pro-main** — README.md only. Zero runnable code.

- **awesome-gpt-image-2-api** — Prompt library, `cases/` folder. README in 10 languages. CC0. 244.9 MB due to image examples in cases/.

- **open-webui-main** — `open-webui` v0.9.6. Python backend (pyproject.toml + requirements.txt) + SvelteKit frontend. Multiple docker-compose configs (GPU, API-only, OTEL, data).

- **penpot-develop** — Clojure project. No package.json. Docker: `docker/images/docker-compose.yaml`. Two devenv compose files.

- **Cap-main** — `cap` package (no version in root). 93.3 MB monorepo. Has `.claude/` folder — Claude Code integration inside Cap itself.

- **screenity-master** — `screenity` v4.5.3 browser extension. Build produces Chrome extension loadable as unpacked.

- **OpenCut-main** — `opencut` monorepo. 0.3 MB (no node_modules). Scripts: dev, dev:web, build, deploy.

- **n8n-master** — `n8n-monorepo` v2.27.0. Has `.agents/skills/` with Claude Code agent skills: community-pr-readiness-check, content-design, conventions, create-issue, create-pr.

- **claude-council-main** — `claude-council` v0.1.0 Claude Code skill. Skills in `skills/claude-council/SKILL.md`. Multi-advisor decision review system.

---

## Recommended Extract Target

All ZIPs should be extracted to:

```
C:\EMOVEL\04_AI_STACK\   (currently empty — confirmed by scan)
```

---

## Bulk Extraction Script

```powershell
$dl  = "C:\Users\flavi\Downloads"
$tgt = "C:\EMOVEL\04_AI_STACK"

$extractions = @(
    @{ zip="ui-ux-pro-max-skill-main.zip"; dir="ui-ux-pro-max-skill-main" },
    @{ zip="21st-sdk-main.zip";            dir="21st-sdk-main" },
    @{ zip="quant-ux-master.zip";          dir="quant-ux-master" },
    @{ zip="nano-banana-2-ai-main.zip";    dir="nano-banana-2-ai-main" },
    @{ zip="Nano-Banana-Pro-main.zip";     dir="nano-banana-pro-ref" },
    @{ zip="open-webui-main.zip";          dir="open-webui-main" },
    @{ zip="penpot-develop.zip";           dir="penpot-develop" },
    @{ zip="Cap-main.zip";                 dir="Cap-main" },
    @{ zip="screenity-master.zip";         dir="screenity-master" },
    @{ zip="OpenCut-main.zip";             dir="OpenCut-main" },
    @{ zip="n8n-master.zip";               dir="n8n-master" },
    @{ zip="claude-council-main.zip";      dir="claude-council-main" }
)

foreach ($e in $extractions) {
    $out = "$tgt\$($e.dir)"
    if (-not (Test-Path $out)) {
        Write-Host "Extracting $($e.zip) ..."
        Expand-Archive -Path "$dl\$($e.zip)" -DestinationPath $out
    } else {
        Write-Host "Already exists: $($e.dir)"
    }
}
```

After extraction, run npm install in Node.js projects:

```powershell
$npmProjects = @("21st-sdk-main","quant-ux-master","nano-banana-2-ai-main","Cap-main","screenity-master","OpenCut-main","n8n-master")
foreach ($p in $npmProjects) {
    Write-Host "npm install: $p"
    Push-Location "C:\EMOVEL\04_AI_STACK\$p"
    npm install
    Pop-Location
}
```

---

## C:\EMOVEL Structure (Verified)

```
C:\EMOVEL\
├── 01_PROJECTS\
├── 02_INSTALLERS\
├── 03_DRIVERS\
├── 04_AI_STACK\             ← EMPTY — target for all ZIPs
├── 05_BACKUPS\
├── 06_KEYS_LOCAL_PRIVATE\
├── 07_LOGS\
├── 07_SCRIPTS\
├── 08_DOWNLOADS_STAGING\
├── 09_RESTORE_FROM_KINGSTON\
├── 10_EMOVEL_BUILDER\
├── 20_PRODUCTS\
├── 30_LABS\
│   └── EMOVEL_PAGE_BUILDER_V0_1\    ← has node_modules (extracted project)
├── 99_DISABLED_MODELS\
├── 99_TEMP_AUDIT\
└── AUTOPILOT_FACTORY_V1\
    └── 07_AUTOMATION\
        └── n8n_later\               ← contains COMFYUI, emovel-ui-rebuilder, EMOVEL_PAGE_BUILDER dirs
```
