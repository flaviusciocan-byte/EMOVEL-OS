# EMOVEL-OS Health Status

**Last scan:** 2026-06-21  
**Method:** Direct filesystem scan + ZIP content inspection

---

## Readiness Summary

| Category | Count | Status |
|---|---|---|
| Operational (no action needed) | 1 | claude-code-main |
| Runnable without extraction | 1 | n8n (via npx/Docker) |
| Extracted but broken | 2 | gpt-pilot-main, reflex-main |
| ZIP found, not extracted | 12 | See table below |
| Not found anywhere | 1 | claude-cowork |
| **Total registered** | **17** | |

---

## Tool Health Table

| Tool | Status | Blocker | Fix |
|---|---|---|---|
| claude-code-main | OPERATIONAL | — | — |
| n8n | RUNNABLE (npx) | Source not extracted | npx n8n or Docker |
| claude-council-main | ZIP_NOT_EXTRACTED | Not extracted | Extract → copy skills/ to project |
| ui-ux-pro-max-skill-main | ZIP_NOT_EXTRACTED | Not extracted | Extract → copy .claude/ to project |
| 21st-sdk-main | ZIP_NOT_EXTRACTED | Not extracted | Extract → npm install |
| quant-ux-master | ZIP_NOT_EXTRACTED | Not extracted | Extract → npm install → npm run serve |
| nano-banana-2-ai-main | ZIP_NOT_EXTRACTED | Not extracted + no GEMINI_API_KEY | Extract → npm install → add .env |
| Nano-Banana-Pro-main | README_ONLY | No runnable code | Extract for reference only |
| awesome-gpt-image-2 | ZIP_NOT_EXTRACTED | Not extracted | Extract for reference |
| open-webui-main | ZIP_NOT_EXTRACTED | Not extracted | Docker run OR extract + dual install |
| penpot-develop | ZIP_NOT_EXTRACTED | Not extracted + needs Clojure or Docker | Extract → docker-compose up |
| Cap-main | ZIP_NOT_EXTRACTED | Not extracted | Extract → npm install |
| screenity-master | ZIP_NOT_EXTRACTED | Not extracted | Extract → npm install → build → load in Chrome |
| opencut-main | ZIP_NOT_EXTRACTED | Not extracted | Extract → npm install → npm run dev:web |
| n8n-master (source) | ZIP_NOT_EXTRACTED | Not extracted | npx preferred — extract for reference |
| gpt-pilot-main | EXTRACTED_BROKEN | pydantic missing | pip install -r requirements.txt |
| reflex-main | EXTRACTED_BROKEN | reflex not in PATH | pip install reflex |
| claude-cowork | NOT_FOUND | Not in any scanned location | Locate or clone |

---

## Per-Tool Details

### claude-code-main — OPERATIONAL

- **Type:** CLI (global npm install)
- **Check:** `claude --version`
- **Action needed:** None

---

### ui-ux-pro-max-skill-main — ZIP_NOT_EXTRACTED

- **ZIP:** `C:\Users\flavi\Downloads\ui-ux-pro-max-skill-main.zip` (4.8 MB)
- **Type:** Claude Code plugin (`.claude-plugin` format)
- **Version:** 2.5.0 by nextlevelbuilder
- **Skills inside ZIP:** banner-design, brand, design-system, design, slides, ui-styling, ui-ux-pro-max
- **No npm install required**
- **Activate:**
  ```powershell
  Expand-Archive -Path "C:\Users\flavi\Downloads\ui-ux-pro-max-skill-main.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\ui-ux-pro-max-skill-main"
  # Then copy .claude/ into your project root:
  Copy-Item -Recurse "C:\EMOVEL\04_AI_STACK\ui-ux-pro-max-skill-main\.claude" -Destination "<your-project>\.claude" -Force
  ```

---

### 21st-sdk-main — ZIP_NOT_EXTRACTED

- **ZIP:** `C:\Users\flavi\Downloads\21st-sdk-main.zip` (160 MB)
- **Type:** Node.js monorepo
- **Package:** `21st-sdk` (root)
- **Packages inside:** agent-runtime, agent, api-key-security, cli, nextjs, node, python-sdk, react, sandbox-provider, ui
- **App:** apps/agents-web (Next.js)
- **Has Dockerfile:** Yes
- **Install:**
  ```powershell
  Expand-Archive -Path "C:\Users\flavi\Downloads\21st-sdk-main.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\21st-sdk-main"
  cd C:\EMOVEL\04_AI_STACK\21st-sdk-main
  npm install
  npm run dev
  ```
- **Single-component shortcut (no extraction needed):**
  ```bash
  npx shadcn@latest add "https://21st.dev/r/<component>"
  ```

---

### quant-ux-master — ZIP_NOT_EXTRACTED

- **ZIP:** `C:\Users\flavi\Downloads\quant-ux-master.zip` (6.1 MB)
- **Type:** Vue.js web app
- **Package:** `quant-ux` v4.1.23
- **Has:** package.json, Dockerfile, docker-compose.yml, Makefile
- **Scripts:** serve, build, test:unit, lint
- **Install:**
  ```powershell
  Expand-Archive -Path "C:\Users\flavi\Downloads\quant-ux-master.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\quant-ux-master"
  cd C:\EMOVEL\04_AI_STACK\quant-ux-master
  npm install
  npm run serve     # localhost:8080
  # OR:
  docker-compose up
  ```

---

### nano-banana-2-ai-main — ZIP_NOT_EXTRACTED

- **ZIP:** `C:\Users\flavi\Downloads\nano-banana-2-ai-main.zip` (0.6 MB)
- **Type:** Next.js app
- **Package:** `v0-nanobanana-template` v0.1.0
- **Has:** package.json, README.md, README2.md; folders: app/, components/, components.json
- **Scripts:** build, dev, lint, start
- **Requires:** GEMINI_API_KEY in .env.local
- **Install:**
  ```powershell
  Expand-Archive -Path "C:\Users\flavi\Downloads\nano-banana-2-ai-main.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\nano-banana-2-ai-main"
  cd C:\EMOVEL\04_AI_STACK\nano-banana-2-ai-main
  npm install
  # Create .env.local with: GEMINI_API_KEY=your_key
  npm run dev   # localhost:3000
  ```

---

### Nano-Banana-Pro-main — README_ONLY

- **ZIP:** `C:\Users\flavi\Downloads\Nano-Banana-Pro-main.zip` (4 KB)
- **Contains:** README.md only — no code
- **Action:** Extract for reference documentation only
- **Use nano-banana-2-ai-main for the runnable version**

---

### awesome-gpt-image-2-api-and-prompts-main — ZIP_NOT_EXTRACTED

- **ZIP:** `C:\Users\flavi\Downloads\awesome-gpt-image-2-API-and-Prompts-main.zip` (244.9 MB)
- **Contains:** README.md (10 languages), `cases/` folder with prompt examples and images, LICENSE (CC0)
- **No code — prompt reference library**
- **Extract:**
  ```powershell
  Expand-Archive -Path "C:\Users\flavi\Downloads\awesome-gpt-image-2-API-and-Prompts-main.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\awesome-gpt-image-2-prompts"
  ```

---

### open-webui-main — ZIP_NOT_EXTRACTED

- **ZIP:** `C:\Users\flavi\Downloads\open-webui-main.zip` (53.4 MB)
- **Type:** Python + SvelteKit
- **Package:** `open-webui` v0.9.6
- **Has:** package.json, pyproject.toml, backend/requirements.txt, Dockerfile, docker-compose.yaml (+ 6 variants for GPU/API/OTEL/etc)
- **Recommended (Docker):**
  ```bash
  docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway \
    -v open-webui:/app/backend/data --name open-webui --restart always \
    ghcr.io/open-webui/open-webui:main
  ```
- **Manual extract:**
  ```powershell
  Expand-Archive -Path "C:\Users\flavi\Downloads\open-webui-main.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\open-webui-main"
  cd C:\EMOVEL\04_AI_STACK\open-webui-main
  npm install
  pip install -r backend/requirements.txt
  ```

---

### penpot-develop — ZIP_NOT_EXTRACTED

- **ZIP:** `C:\Users\flavi\Downloads\penpot-develop.zip` (190.2 MB)
- **Type:** Clojure app (open-source Figma alternative)
- **Has:** README.md, Dockerfile, docker/images/docker-compose.yaml, docker/devenv/docker-compose.infra.yml, docker/devenv/docker-compose.main.yml
- **No package.json** — Clojure/ClojureScript codebase
- **Status:** NEEDS_MANUAL_SETUP
- **Docker (recommended):**
  ```powershell
  Expand-Archive -Path "C:\Users\flavi\Downloads\penpot-develop.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\penpot-develop"
  cd C:\EMOVEL\04_AI_STACK\penpot-develop
  docker-compose -f docker/images/docker-compose.yaml up
  ```

---

### Cap-main — ZIP_NOT_EXTRACTED

- **ZIP:** `C:\Users\flavi\Downloads\Cap-main.zip` (93.3 MB)
- **Type:** Node.js monorepo (open-source Loom alternative)
- **Package:** `cap` (no version in root)
- **Has:** package.json, README.md, Dockerfile, `.claude/` folder
- **Scripts:** build, build:web, build:web:docker, cap-setup
- **Status:** NEEDS_MANUAL_SETUP (93 MB — review apps/ structure first)
- **Install:**
  ```powershell
  Expand-Archive -Path "C:\Users\flavi\Downloads\Cap-main.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\Cap-main"
  cd C:\EMOVEL\04_AI_STACK\Cap-main
  npm install
  npm run build:web
  ```

---

### screenity-master — ZIP_NOT_EXTRACTED

- **ZIP:** `C:\Users\flavi\Downloads\screenity-master.zip` (10.9 MB)
- **Type:** Chrome browser extension
- **Package:** `screenity` v4.5.3
- **Has:** package.json, README.md
- **Scripts:** build, build:dev, build:prod, build:local, start, dev
- **Install and load:**
  ```powershell
  Expand-Archive -Path "C:\Users\flavi\Downloads\screenity-master.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\screenity-master"
  cd C:\EMOVEL\04_AI_STACK\screenity-master
  npm install
  npm run build:prod
  # Then: Chrome → chrome://extensions → Load unpacked → select build output folder
  ```

---

### OpenCut-main — ZIP_NOT_EXTRACTED

- **ZIP:** `C:\Users\flavi\Downloads\OpenCut-main.zip` (0.3 MB)
- **Type:** Node.js monorepo (open-source video editor)
- **Package:** `opencut`
- **Has:** package.json, README.md; folder: apps/
- **Scripts:** dev, dev:web, build, deploy
- **Install:**
  ```powershell
  Expand-Archive -Path "C:\Users\flavi\Downloads\OpenCut-main.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\OpenCut-main"
  cd C:\EMOVEL\04_AI_STACK\OpenCut-main
  npm install
  npm run dev:web
  ```

---

### n8n-master — ZIP_NOT_EXTRACTED

- **ZIP:** `C:\Users\flavi\Downloads\n8n-master.zip` (51.5 MB)
- **Type:** Node.js monorepo
- **Package:** `n8n-monorepo` v2.27.0
- **Has:** package.json, README.md, Dockerfiles, docker-compose
- **Also has:** `.agents/skills/` with Claude Code agent skills: community-pr-readiness-check, content-design, conventions, create-community-node-lint-rule, create-issue, create-pr
- **Preferred runtime (Docker or npx — do NOT build from source):**
  ```bash
  # Docker:
  docker run -it --rm -p 5678:5678 n8nio/n8n:2.27.0
  # Or npx:
  npx n8n@2.27.0
  ```
- **Source extract (for reference/development only):**
  ```powershell
  Expand-Archive -Path "C:\Users\flavi\Downloads\n8n-master.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\n8n-master"
  ```

---

### claude-council-main — ZIP_NOT_EXTRACTED

- **ZIP:** `C:\Users\flavi\Downloads\claude-council-main.zip` (4 KB)
- **Type:** Claude Code skill
- **Package:** `claude-council` v0.1.0
- **Has:** package.json, README.md, `skills/claude-council/SKILL.md`
- **Description:** "Pressure-test high-stakes decisions with a structured LLM Council — 5 advisors, peer review, forced debate, dual-chairman synthesis with dissent preservation."
- **Install:**
  ```powershell
  Expand-Archive -Path "C:\Users\flavi\Downloads\claude-council-main.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\claude-council-main"
  # Copy skills into project:
  Copy-Item -Recurse "C:\EMOVEL\04_AI_STACK\claude-council-main\skills" -Destination "<your-project>\skills" -Force
  ```

---

### gpt-pilot-main — EXTRACTED_BROKEN

- **Path:** `C:\Users\flavi\Desktop\gpt-pilot-main`
- **Issue:** `pydantic` missing from Python environment
- **Fix:**
  ```bash
  cd C:\Users\flavi\Desktop\gpt-pilot-main
  pip install -r requirements.txt
  ```

---

### reflex-main — EXTRACTED_BROKEN

- **Path:** `C:\Users\flavi\Desktop\reflex-main`
- **Issue:** `reflex` not found in PATH
- **Fix:**
  ```bash
  pip install reflex
  ```

---

### claude-cowork — NOT_FOUND

- Not present in Downloads, Desktop, or C:\EMOVEL
- Cannot be registered until located or cloned

---

## Action Priority

```
PRIORITY 1 — Activate immediately (no extraction, just copy)
[ ] ui-ux-pro-max-skill-main  →  copy .claude/ to project root
[ ] claude-council-main       →  extract → copy skills/ to project root

PRIORITY 2 — Fix already-extracted broken tools
[ ] gpt-pilot-main            →  pip install -r requirements.txt
[ ] reflex-main               →  pip install reflex

PRIORITY 3 — Extract and run design tools
[ ] quant-ux-master           →  extract → npm install → npm run serve
[ ] nano-banana-2-ai-main     →  extract → npm install → add GEMINI_API_KEY → npm run dev
[ ] penpot-develop            →  extract → docker-compose up

PRIORITY 4 — Extract knowledge and content tools
[ ] open-webui-main           →  docker run ghcr.io/open-webui/open-webui:main
[ ] awesome-gpt-image-2       →  extract for reference
[ ] nano-banana-pro-main      →  extract for reference

PRIORITY 5 — Extract remaining tools
[ ] 21st-sdk-main             →  extract → npm install
[ ] Cap-main                  →  extract → npm install
[ ] screenity-master          →  extract → npm install → build → load in Chrome
[ ] OpenCut-main              →  extract → npm install → npm run dev:web
[ ] n8n-master                →  extract for reference (prefer npx/Docker to run)

NOT ACTIONABLE
[ ] claude-cowork             →  NOT FOUND — locate source before proceeding
```
