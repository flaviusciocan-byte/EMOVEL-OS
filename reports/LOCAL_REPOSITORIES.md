# Local Repositories Inventory

**Scan date:** 2026-06-21  
**Control center:** `C:\Users\flavi\Desktop\EMOVEL-OS`  
**Tool root:** `C:\EMOVEL\tools`

All ZIP archives found in `C:\Users\flavi\Downloads` were extracted into `C:\EMOVEL\tools`. EMOVEL-OS only registers paths and documentation; full repositories were not copied into EMOVEL-OS.

## Inventory

| Name | Exact Path | Category | README.md | package.json | pyproject.toml | requirements.txt | Dockerfile | Install Command | Run Command | Priority | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ui-ux-pro-max-skill-main | `C:\EMOVEL\tools\ui-ux-pro-max-skill-main\ui-ux-pro-max-skill-main` | UX Layer | Yes | No | No | Yes | No | No dependency install; use `.claude/` skills | Claude Code skill usage | S | READY |
| 21st-sdk-main | `C:\EMOVEL\tools\21st-sdk-main\21st-sdk-main` | Agent Runtime / UX Layer | Yes | Yes | Yes | No | Yes | `pnpm.cmd install` | `pnpm.cmd run dev` | S | READY |
| 21st-sdk-main-duplicate | `C:\EMOVEL\tools\21st-sdk-main-duplicate\21st-sdk-main` | Duplicate | Yes | Yes | Yes | No | Yes | Do not install; duplicate archive | N/A | C | DO NOT INSTALL |
| quant-ux-master | `C:\EMOVEL\tools\quant-ux-master\quant-ux-master` | UX Layer | Yes | Yes | No | No | Yes | `npm.cmd install` | `npm.cmd run serve` | S | NEEDS SETUP |
| c15t-canary | `C:\EMOVEL\tools\c15t-canary\c15t-canary` | UX / Consent Infrastructure | Yes | Yes | No | No | No | `bun install` | `bun run dev` | B | NEEDS SETUP |
| Nano-Banana-Pro-main | `C:\EMOVEL\tools\Nano-Banana-Pro-main\Nano-Banana-Pro-main` | Visual Production | Yes | No | No | No | No | No install; reference only | N/A | B | READY |
| nano-banana-2-ai-main | `C:\EMOVEL\tools\nano-banana-2-ai-main\nano-banana-2-ai-main` | Visual Production | Yes | Yes | No | No | No | `npm.cmd install` | `npm.cmd run dev` | A | NEEDS SETUP |
| awesome-gpt-image-2-API-and-Prompts-main | `C:\EMOVEL\tools\awesome-gpt-image-2-API-and-Prompts-main\awesome-gpt-image-2-API-and-Prompts-main` | Visual Production | Yes | No | No | No | No | No install; prompt library | N/A | A | READY |
| ladybird-master | `C:\EMOVEL\tools\ladybird-master\ladybird-master` | Browser Runtime Research | Yes | No | Yes | Yes | Yes | Manual native setup required | N/A | C | NEEDS SETUP |
| darktable-master | `C:\EMOVEL\tools\darktable-master\darktable-master` | Visual Production | Yes | No | No | No | Yes | Manual native setup required | N/A | C | NEEDS SETUP |
| cryptpad-main | `C:\EMOVEL\tools\cryptpad-main\cryptpad-main` | Collaboration / Knowledge | Yes | Yes | No | No | Yes | `npm.cmd install` | `npm.cmd run dev` | B | NEEDS SETUP |
| screenity-master | `C:\EMOVEL\tools\screenity-master\screenity-master` | Content Production | Yes | Yes | No | No | No | `npm.cmd install` | `npm.cmd run build:prod` | A | NEEDS SETUP |
| Cap-main | `C:\EMOVEL\tools\Cap-main\Cap-main` | Content Production | Yes | Yes | No | No | Yes | `pnpm.cmd install` | `pnpm.cmd run dev:web` | A | NEEDS SETUP |
| puter-main | `C:\EMOVEL\tools\puter-main\puter-main` | Runtime / Cloud OS | Yes | Yes | No | No | Yes | `npm.cmd install` | `npm.cmd start` | B | NEEDS SETUP |
| open-webui-main | `C:\EMOVEL\tools\open-webui-main\open-webui-main` | Agent Runtime / Knowledge | Yes | Yes | Yes | Yes | Yes | Docker recommended | `docker run -d -p 3000:8080 ghcr.io/open-webui/open-webui:main` | A | NEEDS SETUP |
| penpot-develop | `C:\EMOVEL\tools\penpot-develop\penpot-develop` | UX Layer | Yes | Yes | No | No | Yes | Docker/manual Penpot setup | `docker compose -f docker/images/docker-compose.yaml up` | A | NEEDS SETUP |
| OpenCut-main | `C:\EMOVEL\tools\OpenCut-main\OpenCut-main` | Content Production | Yes | Yes | No | No | No | `bun install` | `bun run dev:web` | A | NEEDS SETUP |
| higgsfield-main | `C:\EMOVEL\tools\higgsfield-main\higgsfield-main` | Visual Production | Yes | No | Yes | Yes | Yes | Manual Python setup after inspecting pyproject | N/A | B | NEEDS SETUP |
| skills-main | `C:\EMOVEL\tools\skills-main\skills-main` | Agent Skills | Yes | No | No | Yes | No | Reference library; install individual skills only | N/A | A | READY |
| claude-council-main | `C:\EMOVEL\tools\claude-council-main\claude-council-main` | Agent Runtime / Decision Review | Yes | Yes | No | No | No | No dependency install; use skill file | Claude Code skill usage | A | READY |
| reflex-main | `C:\EMOVEL\tools\reflex-main\reflex-main` | UX / App Builder | Yes | No | Yes | No | Yes | Create local Python venv and install per pyproject | `reflex run` | B | NEEDS SETUP |
| gpt-pilot-main | `C:\EMOVEL\tools\gpt-pilot-main\gpt-pilot-main` | Agent Runtime / App Builder | Yes | No | Yes | Yes | Yes | `.venv\Scripts\python -m pip install -r requirements.txt` | `.venv\Scripts\python main.py` | A | NEEDS SETUP |
| knowledge-work-plugins-main | `C:\EMOVEL\tools\knowledge-work-plugins-main\knowledge-work-plugins-main` | Agent Runtime / Knowledge Work | Yes | No | No | Yes | No | Reference plugin library | N/A | A | READY |
| claude-code-main | `C:\EMOVEL\tools\claude-code-main\claude-code-main` | Agent Runtime | Yes | No | No | No | Yes | Source/reference repo only | `claude --version` | A | READY |
| n8n-master | `C:\EMOVEL\tools\n8n-master\n8n-master` | Automation Layer | Yes | Yes | Yes | No | Yes | Prefer Docker or npx; source install not run | `npx n8n` or Docker | A | NEEDS SETUP |

## Tier S Install Results

| Tool | Result |
|---|---|
| ui-ux-pro-max-skill-main | READY. No dependency install required. |
| 21st-sdk-main | READY. `pnpm.cmd install` completed. Warnings: deprecated packages, peer dependency warnings, Supabase bin warning, Cypress downloaded. |
| quant-ux-master | NEEDS SETUP. `npm.cmd install` failed during `deasync` native postinstall on Node `v24.16.0` with `spawn EINVAL`. Recommended next step: use an older Node LTS or Docker path. |

