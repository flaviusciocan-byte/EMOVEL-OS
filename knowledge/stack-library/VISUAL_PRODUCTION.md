# EMOVEL-OS Visual Production Tool Registry

**Last verified:** 2026-06-21 via direct ZIP inspection  
All paths are real. Tools are marked with their actual status — ZIP_NOT_EXTRACTED means the folder does not exist yet.

---

## nano-banana-2-ai-main

| Field | Value |
|---|---|
| **ZIP** | `C:\Users\flavi\Downloads\nano-banana-2-ai-main.zip` |
| **Size** | 0.6 MB |
| **Status** | ZIP_NOT_EXTRACTED |
| **Type** | Next.js app |
| **Package** | `v0-nanobanana-template` v0.1.0 |
| **Scripts** | build, dev, lint, start |
| **Extract target** | `C:\EMOVEL\04_AI_STACK\nano-banana-2-ai-main` |

### What It Actually Contains

```
nano-banana-2-ai-main/
  package.json    ← v0-nanobanana-template v0.1.0
  README.md
  README2.md
  components.json
  app/            ← Next.js app router
  components/
```

### Install

```powershell
Expand-Archive -Path "C:\Users\flavi\Downloads\nano-banana-2-ai-main.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\nano-banana-2-ai-main"
cd C:\EMOVEL\04_AI_STACK\nano-banana-2-ai-main
npm install
# Create .env.local:
# GEMINI_API_KEY=your_key_here
npm run dev     # localhost:3000
```

### EMOVEL Use

Fast AI image generation using Google Gemini 3.1 Flash Image model. Use for producing operator/workspace visuals for EMOVEL landing pages and social launch graphics when no photography is available. Pair with `awesome-gpt-image-2-prompts` for structured prompt input.

---

## Nano-Banana-Pro-main

| Field | Value |
|---|---|
| **ZIP** | `C:\Users\flavi\Downloads\Nano-Banana-Pro-main.zip` |
| **Size** | 4 KB |
| **Status** | README_ONLY |
| **Type** | Documentation |
| **Contains** | README.md only — no code |
| **Extract target** | `C:\EMOVEL\04_AI_STACK\nano-banana-pro-ref` |

Reference documentation for Gemini 2.5 Pro Image generation (2K/4K upscaling, 95% character consistency). No runnable code. Extract for reference; use `nano-banana-2-ai-main` for the executable version.

---

## awesome-gpt-image-2-api-and-prompts-main

| Field | Value |
|---|---|
| **ZIP** | `C:\Users\flavi\Downloads\awesome-gpt-image-2-API-and-Prompts-main.zip` |
| **Size** | 244.9 MB |
| **Status** | ZIP_NOT_EXTRACTED |
| **Type** | Prompt library |
| **License** | CC0 (public domain) |
| **Extract target** | `C:\EMOVEL\04_AI_STACK\awesome-gpt-image-2-prompts` |

### What It Actually Contains

```
awesome-gpt-image-2-API-and-Prompts-main/
  README.md         ← English
  README_de.md
  README_es.md
  README_fr.md
  README_ja.md
  README_ko.md
  README_pt.md
  README_ru.md
  README_tr.md
  README_zh.md
  cases/            ← prompt examples with image outputs (accounts for large ZIP size)
  .github/
  .gitignore
  LICENSE           ← CC0
```

### Install

```powershell
Expand-Archive -Path "C:\Users\flavi\Downloads\awesome-gpt-image-2-API-and-Prompts-main.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\awesome-gpt-image-2-prompts"
```

No further install needed — reference library.

### EMOVEL Use

Prompt reference for GPT Image 2 API (OpenAI DALL-E successor) calls. Use cases/ folder as a visual reference library for what prompt structures produce what outputs. Feed structured prompts into n8n workflows for automated content-engine image production. CC0 — no attribution required, commercially safe.

---

## penpot-develop

| Field | Value |
|---|---|
| **ZIP** | `C:\Users\flavi\Downloads\penpot-develop.zip` |
| **Size** | 190.2 MB |
| **Status** | ZIP_NOT_EXTRACTED |
| **Type** | Clojure + ClojureScript web app |
| **Runtime** | Docker (recommended) or full Clojure dev environment |
| **Extract target** | `C:\EMOVEL\04_AI_STACK\penpot-develop` |

### What It Actually Contains

```
penpot-develop/
  README.md
  .clj-kondo/          ← Clojure linting config
  .cljfmt.edn          ← Clojure formatting
  .devenv/             ← Dev environment configs (claude-code, vscode, codex, opencode)
  docker/
    devenv/
      docker-compose.infra.yml
      docker-compose.main.yml
    images/
      docker-compose.yaml    ← production-equivalent local stack
  frontend/
  backend/
  ...
```

### Install

```powershell
# NEEDS_MANUAL_SETUP — Clojure environment required for source development
# Practical path: Docker

Expand-Archive -Path "C:\Users\flavi\Downloads\penpot-develop.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\penpot-develop"
cd C:\EMOVEL\04_AI_STACK\penpot-develop
docker-compose -f docker/images/docker-compose.yaml up
```

Default URL: `http://localhost:3449`

### EMOVEL Use

Open-source Figma alternative for EMOVEL design work. Use for UI mockups, component design, and visual brief production. Self-hostable with no Figma subscription required. The `.devenv/` folder shows it already has Claude Code integration configs.

---

## screenity-master

| Field | Value |
|---|---|
| **ZIP** | `C:\Users\flavi\Downloads\screenity-master.zip` |
| **Size** | 10.9 MB |
| **Status** | ZIP_NOT_EXTRACTED |
| **Type** | Chrome browser extension |
| **Package** | `screenity` v4.5.3 |
| **Scripts** | build, build:dev, build:prod, build:local, start, dev |
| **Extract target** | `C:\EMOVEL\04_AI_STACK\screenity-master` |

### Install

```powershell
Expand-Archive -Path "C:\Users\flavi\Downloads\screenity-master.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\screenity-master"
cd C:\EMOVEL\04_AI_STACK\screenity-master
npm install
npm run build:prod
# Load in Chrome: chrome://extensions → Developer mode → Load unpacked → select build output folder
```

### EMOVEL Use

Screen capture with annotation for recording demos, walkthroughs, and usage guides for EMOVEL products. Use in content-engine for producing instructional video thumbnails and short-form content recordings.

---

## opencut-main

| Field | Value |
|---|---|
| **ZIP** | `C:\Users\flavi\Downloads\OpenCut-main.zip` |
| **Size** | 0.3 MB |
| **Status** | ZIP_NOT_EXTRACTED |
| **Type** | Node.js monorepo |
| **Package** | `opencut` |
| **Scripts** | dev, dev:web, build, deploy |
| **Extract target** | `C:\EMOVEL\04_AI_STACK\OpenCut-main` |

### Install

```powershell
Expand-Archive -Path "C:\Users\flavi\Downloads\OpenCut-main.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\OpenCut-main"
cd C:\EMOVEL\04_AI_STACK\OpenCut-main
npm install
npm run dev:web
```

### EMOVEL Use

Open-source browser-based video editor for short-form content. Use in content-engine for editing launch video clips, clips for social distribution, and product demo cuts.

---

## cap-main

| Field | Value |
|---|---|
| **ZIP** | `C:\Users\flavi\Downloads\Cap-main.zip` |
| **Size** | 93.3 MB |
| **Status** | ZIP_NOT_EXTRACTED |
| **Type** | Node.js monorepo |
| **Package** | `cap` |
| **Scripts** | build, build:web, build:web:docker, cap-setup |
| **Extract target** | `C:\EMOVEL\04_AI_STACK\Cap-main` |
| **Note** | Has `.claude/` folder — Cap itself integrates Claude Code |

### Install

```powershell
Expand-Archive -Path "C:\Users\flavi\Downloads\Cap-main.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\Cap-main"
cd C:\EMOVEL\04_AI_STACK\Cap-main
npm install
npm run build:web
```

Status: NEEDS_MANUAL_SETUP — review apps/ structure after extraction.

### EMOVEL Use

Open-source Loom alternative for screen recording with shareable links. Use for delivering EMOVEL product walkthroughs, launch demos, and async client communication.

---

## Summary Table

| Tool | ZIP | Size | Status | Run Method |
|---|---|---|---|---|
| nano-banana-2-ai-main | Downloads\nano-banana-2-ai-main.zip | 0.6 MB | ZIP_NOT_EXTRACTED | npm run dev (needs GEMINI_API_KEY) |
| Nano-Banana-Pro-main | Downloads\Nano-Banana-Pro-main.zip | 4 KB | README_ONLY | Reference only |
| awesome-gpt-image-2 | Downloads\awesome-gpt-image-2-API-and-Prompts-main.zip | 244.9 MB | ZIP_NOT_EXTRACTED | Reference only |
| penpot-develop | Downloads\penpot-develop.zip | 190.2 MB | ZIP_NOT_EXTRACTED | docker-compose up |
| screenity-master | Downloads\screenity-master.zip | 10.9 MB | ZIP_NOT_EXTRACTED | Chrome extension (build first) |
| opencut-main | Downloads\OpenCut-main.zip | 0.3 MB | ZIP_NOT_EXTRACTED | npm run dev:web |
| cap-main | Downloads\Cap-main.zip | 93.3 MB | ZIP_NOT_EXTRACTED | npm run build:web |
