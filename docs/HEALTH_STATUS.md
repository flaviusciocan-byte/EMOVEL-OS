# EMOVEL-OS Health Status

**Generated:** 2026-06-21 (updated after local tool scan)

---

## Readiness Score

| Metric | Value |
|---|---|
| Original stack tools found on disk | 2 / 7 |
| Original stack tools operational | 0 / 7 |
| New UI/Visual tools found (ZIPs) | 6 / 6 |
| New UI/Visual tools extracted | 0 / 6 |
| Total tools registered | 13 |
| **Overall readiness** | **Partial — 4 tools usable without action, 8 need extraction or install** |

---

## Original Stack — Tool Registry

| Tool | Location | Health | Ready |
|---|---|---|---|
| claude-council-main | Prompt-based | No local check needed | Yes |
| claude-cowork | Session-based | No local check needed | Yes |
| claude-code-main | Installed as CLI | Active and in use | Yes |
| n8n-master | via npx | Runnable without extraction | Yes |
| gpt-pilot-main | C:\Users\flavi\Desktop\gpt-pilot-main | Fail — pydantic missing | No |
| knowledge-work-plugins-main | NOT FOUND | Not registered | No |
| reflex-main | C:\Users\flavi\Desktop\reflex-main | Fail — reflex not in PATH | No |

---

## New UI & Visual Tools — Found in Downloads

All 6 tools are present as ZIP archives in `C:\Users\flavi\Downloads`. None are extracted. Status below reflects current state.

| Tool | ZIP Found | Extracted | npm install | Ready |
|---|---|---|---|---|
| ui-ux-pro-max-skill-main | Yes | No | No | No — needs extraction |
| 21st-sdk-main | Yes | No | No | No — needs extraction |
| quant-ux-master | Yes | No | No | No — needs extraction |
| nano-banana-2-ai-main | Yes | No | No | No — needs extraction |
| nano-banana-pro-main | Yes | No | N/A (README only) | Partial — extract for reference |
| awesome-gpt-image-2-api-and-prompts-main | Yes | No | N/A (prompt library) | Partial — extract for reference |

---

## Tool Details

### claude-council-main  [READY — PROMPT LAYER]

- **Description:** Decision validation layer
- **Type:** Prompt-based skill system
- **Location:** No local install required
- **Health:** Operational as prompt skill in EMOVEL-OS workflow

---

### claude-cowork  [READY — SESSION LAYER]

- **Description:** Project coordination layer
- **Type:** Session-based prompt templates
- **Location:** No local install required
- **Health:** Operational as session workflow

---

### claude-code-main  [READY]

- **Description:** Dev assistance and file editing
- **Type:** CLI — installed globally
- **Health:** Active and in use (this session)

---

### n8n-master  [READY VIA NPX]

- **Description:** Workflow automation
- **Type:** Node.js app
- **Run:** `npx n8n`
- **Health:** Runnable without local clone

---

### gpt-pilot-main  [NOT READY]

- **Description:** Autonomous app builder (Pythagora)
- **Location:** C:\Users\flavi\Desktop\gpt-pilot-main
- **Health:** Fail
- **Issue:** `pydantic` module missing from Python environment
- **Fix:** `cd C:\Users\flavi\Desktop\gpt-pilot-main && pip install -r requirements.txt`

---

### knowledge-work-plugins-main  [NOT FOUND]

- **Description:** Reusable skills and MCP connectors
- **Location:** Not found on any searched path
- **Fix:** Locate or clone repository, then run `.\scripts\register-tool.ps1 knowledge-work-plugins-main <path>`

---

### reflex-main  [NOT READY]

- **Description:** Python-native reactive UI builder
- **Location:** C:\Users\flavi\Desktop\reflex-main
- **Health:** Fail
- **Issue:** `reflex` not found in PATH
- **Fix:** `pip install reflex` in active Python environment

---

### ui-ux-pro-max-skill-main  [ZIP — NOT EXTRACTED]

- **Description:** Premium AI design intelligence CLI — 161 reasoning rules, 67 UI styles
- **Category:** Design / UI Direction
- **ZIP:** C:\Users\flavi\Downloads\ui-ux-pro-max-skill-main.zip (4.8 MB)
- **npm name:** `uipro-cli` v2.5.0
- **Runtime:** Python 3.x + Node.js
- **has README:** Yes | **has package.json:** Yes
- **Recommended Extract Path:** C:\EMOVEL\04_AI_STACK\ui-ux-pro-max-skill-main
- **Install after extraction:**
  ```powershell
  Expand-Archive -Path "C:\Users\flavi\Downloads\ui-ux-pro-max-skill-main.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\ui-ux-pro-max-skill-main"
  cd C:\EMOVEL\04_AI_STACK\ui-ux-pro-max-skill-main
  npm install
  ```
- **Integration:** Direction layer for premium page builds. Ref: `knowledge/stack-library/UX_LAYER.md`

---

### 21st-sdk-main  [ZIP — NOT EXTRACTED]

- **Description:** Open-source SDK + runtime for building, deploying, and embedding 21st Agents
- **Category:** Design / Component System
- **ZIP:** C:\Users\flavi\Downloads\21st-sdk-main.zip (160 MB)
- **npm name:** `blank-agent` template v0.0.1
- **Runtime:** Node.js / React / Next.js (monorepo)
- **has README:** Yes | **has package.json:** Yes
- **Recommended Extract Path:** C:\EMOVEL\04_AI_STACK\21st-sdk-main
- **Install after extraction:**
  ```powershell
  Expand-Archive -Path "C:\Users\flavi\Downloads\21st-sdk-main.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\21st-sdk-main"
  cd C:\EMOVEL\04_AI_STACK\21st-sdk-main
  npm install
  ```
- **Note:** Individual components also installable via `npx shadcn@latest add "https://21st.dev/r/<component>"` without extracting the full SDK
- **Integration:** Component source for premium landing pages. Ref: `knowledge/stack-library/UX_LAYER.md`

---

### quant-ux-master  [ZIP — NOT EXTRACTED]

- **Description:** Open-source UX research and prototyping tool — usability testing, heatmaps, interaction analytics
- **Category:** Design / UX Research
- **ZIP:** C:\Users\flavi\Downloads\quant-ux-master.zip (6.2 MB)
- **npm name:** `quant-ux` v4.1.23
- **Runtime:** Vue.js / Node.js
- **has README:** Yes | **has package.json:** Yes
- **Recommended Extract Path:** C:\EMOVEL\04_AI_STACK\quant-ux-master
- **Install after extraction:**
  ```powershell
  Expand-Archive -Path "C:\Users\flavi\Downloads\quant-ux-master.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\quant-ux-master"
  cd C:\EMOVEL\04_AI_STACK\quant-ux-master
  npm install
  npm run serve
  ```
- **Integration:** Self-hosted UX validation layer — prototype and user-test EMOVEL page designs pre-launch

---

### nano-banana-2-ai-main  [ZIP — NOT EXTRACTED]

- **Description:** Next.js frontend for Google Gemini 3.1 Flash Image Model — 4K text-to-image, 5-character consistency
- **Category:** Content / Image Generation
- **ZIP:** C:\Users\flavi\Downloads\nano-banana-2-ai-main.zip (587 KB)
- **npm name:** `v0-nanobanana-template` v0.1.0
- **Runtime:** Next.js / Node.js
- **has README:** Yes | **has package.json:** Yes
- **Scripts:** `dev`, `build`, `start`, `lint`
- **Recommended Extract Path:** C:\EMOVEL\04_AI_STACK\nano-banana-2-ai-main
- **Install after extraction:**
  ```powershell
  Expand-Archive -Path "C:\Users\flavi\Downloads\nano-banana-2-ai-main.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\nano-banana-2-ai-main"
  cd C:\EMOVEL\04_AI_STACK\nano-banana-2-ai-main
  npm install
  npm run dev
  ```
- **Integration:** Use for fast AI image generation in content-engine and launch asset workflows. Pairs with awesome-gpt-image-2 prompt library.

---

### nano-banana-pro-main  [ZIP — NOT EXTRACTED — README ONLY]

- **Description:** AI image generator reference — Gemini 2.5 Pro Image Model, native 2K/4K upscaling, 95% character consistency
- **Category:** Content / Image Generation (Reference)
- **ZIP:** C:\Users\flavi\Downloads\Nano-Banana-Pro-main.zip (4.8 KB)
- **Runtime:** Documentation only — no runnable code
- **has README:** Yes | **has package.json:** No
- **Recommended Extract Path:** C:\EMOVEL\04_AI_STACK\nano-banana-pro-main
- **Note:** Extract as reference docs. Use `nano-banana-2-ai-main` for the executable frontend.

---

### awesome-gpt-image-2-api-and-prompts-main  [ZIP — NOT EXTRACTED]

- **Description:** 911 curated prompts for GPT Image 2 API — Seedance 2.0 cinematic workflow, 10-language support, CC0 licensed
- **Category:** Content / Prompt Library
- **ZIP:** C:\Users\flavi\Downloads\awesome-gpt-image-2-API-and-Prompts-main.zip (245 MB)
- **Runtime:** No code — Markdown/JSON prompt library
- **has README:** Yes | **has package.json:** No
- **License:** CC0 — free for commercial use
- **Recommended Extract Path:** C:\EMOVEL\04_AI_STACK\awesome-gpt-image-2-prompts
- **Install:**
  ```powershell
  Expand-Archive -Path "C:\Users\flavi\Downloads\awesome-gpt-image-2-API-and-Prompts-main.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\awesome-gpt-image-2-prompts"
  ```
- **Integration:** Reference library for n8n image generation workflows and content-engine prompt templates.

---

## Action List

To bring all tools to operational status, complete these steps in order:

```
Priority 1 — Fix broken tools
[ ] gpt-pilot-main:  pip install -r requirements.txt
[ ] reflex-main:     pip install reflex

Priority 2 — Extract UI tools (design layer)
[ ] ui-ux-pro-max-skill-main → C:\EMOVEL\04_AI_STACK\  → npm install
[ ] 21st-sdk-main            → C:\EMOVEL\04_AI_STACK\  → npm install
[ ] quant-ux-master          → C:\EMOVEL\04_AI_STACK\  → npm install

Priority 3 — Extract content tools (image generation)
[ ] nano-banana-2-ai-main              → C:\EMOVEL\04_AI_STACK\  → npm install
[ ] nano-banana-pro-main               → C:\EMOVEL\04_AI_STACK\  → reference only
[ ] awesome-gpt-image-2-prompts        → C:\EMOVEL\04_AI_STACK\  → reference only

Priority 4 — Locate or clone missing tools
[ ] knowledge-work-plugins-main        → register-tool.ps1 after locating
```
