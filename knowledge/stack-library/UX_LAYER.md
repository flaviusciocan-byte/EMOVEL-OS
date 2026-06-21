# EMOVEL-OS UX Layer — Design Tool Registry

**Last verified:** 2026-06-21 via direct ZIP inspection  
All paths below are real. No tool is marked integrated unless its ZIP was confirmed on disk.

---

## ui-ux-pro-max-skill-main

| Field | Value |
|---|---|
| **ZIP** | `C:\Users\flavi\Downloads\ui-ux-pro-max-skill-main.zip` |
| **Size** | 4.8 MB |
| **Status** | ZIP_NOT_EXTRACTED |
| **Type** | Claude Code plugin (`.claude-plugin` format) |
| **Version** | 2.5.0 |
| **Author** | nextlevelbuilder |
| **License** | MIT |
| **Extract target** | `C:\EMOVEL\04_AI_STACK\ui-ux-pro-max-skill-main` |

### What It Actually Contains

Confirmed by ZIP inspection — NOT a Python or npm app. It is a Claude Code plugin with:

```
.claude-plugin/
  plugin.json       ← defines skills, version, description
  marketplace.json  ← marketplace registration metadata
.claude/
  skills/
    banner-design/SKILL.md
    brand/SKILL.md            ← includes brand scripts: extract-colors, inject-brand-context, sync-brand-to-tokens, validate-asset
    design-system/SKILL.md    ← includes CSV data: slide-layouts, slide-color-logic, slide-copy, slide-charts
    design/SKILL.md
    slides/SKILL.md
    ui-styling/SKILL.md
    ui-ux-pro-max/SKILL.md    ← main skill: 67 styles, 161 palettes, 57 font pairings, 25 charts
```

### Skills Available

- `banner-design` — banner sizing and style guidance
- `brand` — brand guidelines, color extraction, asset validation, typography specs
- `design-system` — slide layouts, color logic, copy patterns, chart types
- `design` — general design intelligence
- `slides` — presentation design
- `ui-styling` — UI style application
- `ui-ux-pro-max` — full 67 styles, 161 palettes, 57 font pairings, 25 charts, 15 stacks

### Supported Stacks

React, Next.js, Vue, Svelte, Astro, Nuxt, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui, Jetpack Compose, Angular

### Install

No npm install. No pip. Pure file-copy activation:

```powershell
# Step 1: Extract
Expand-Archive -Path "C:\Users\flavi\Downloads\ui-ux-pro-max-skill-main.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\ui-ux-pro-max-skill-main"

# Step 2: Copy .claude/ into your project root (merges with existing .claude/ if present)
Copy-Item -Recurse "C:\EMOVEL\04_AI_STACK\ui-ux-pro-max-skill-main\.claude\skills" -Destination "<project>\.claude\skills" -Force
```

### EMOVEL Integration

Used as the design intelligence layer before page implementation. Skills activate in Claude Code automatically when `.claude/skills/` is present in the project root. Reference from `emovel.premium_ui_director` skill.

---

## 21st-sdk-main

| Field | Value |
|---|---|
| **ZIP** | `C:\Users\flavi\Downloads\21st-sdk-main.zip` |
| **Size** | 160 MB |
| **Status** | ZIP_NOT_EXTRACTED |
| **Type** | Node.js monorepo |
| **Package name** | `21st-sdk` |
| **Extract target** | `C:\EMOVEL\04_AI_STACK\21st-sdk-main` |

### What It Actually Contains

Confirmed by ZIP inspection:

```
21st-sdk-main/
  README.md
  Dockerfile
  apps/
    agents-web/       ← Next.js app (agents dashboard)
  packages/
    agent-runtime/
    agent/
    api-key-security/
    cli/
    docs/
    eslint-config/
    nextjs/           ← Next.js integration package
    node/             ← Node.js integration package
    python-sdk/       ← Python SDK
    react/            ← React integration package
    sandbox-provider/
    typescript-config/
    ui/               ← UI components package
```

### Install

```powershell
Expand-Archive -Path "C:\Users\flavi\Downloads\21st-sdk-main.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\21st-sdk-main"
cd C:\EMOVEL\04_AI_STACK\21st-sdk-main
npm install
```

### EMOVEL Integration

Use individual components from 21st.dev without extracting the full SDK:

```bash
npx shadcn@latest add "https://21st.dev/r/<component-name>"
```

Extract the full SDK only when developing custom 21st agents or modifying component packages. The `packages/react` and `packages/ui` packages are most relevant for landing page work.

---

## quant-ux-master

| Field | Value |
|---|---|
| **ZIP** | `C:\Users\flavi\Downloads\quant-ux-master.zip` |
| **Size** | 6.1 MB |
| **Status** | ZIP_NOT_EXTRACTED |
| **Type** | Vue.js web application |
| **Package** | `quant-ux` v4.1.23 |
| **Extract target** | `C:\EMOVEL\04_AI_STACK\quant-ux-master` |

### What It Actually Contains

```
quant-ux-master/
  package.json    ← quant-ux v4.1.23, scripts: serve, build, test:unit, lint
  Dockerfile
  docker-compose.yml
  Makefile
  docker/
  docs/
  src/
```

### Install

```powershell
Expand-Archive -Path "C:\Users\flavi\Downloads\quant-ux-master.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\quant-ux-master"
cd C:\EMOVEL\04_AI_STACK\quant-ux-master
npm install
npm run serve     # runs on localhost:8080
# OR:
docker-compose up
```

### EMOVEL Integration

UX research and prototype testing layer. Use to run usability sessions on EMOVEL landing page prototypes before live deployment. Self-hosted at `localhost:8080`.

---

## Summary Table

| Tool | ZIP Path | Status | Install Method |
|---|---|---|---|
| ui-ux-pro-max-skill-main | Downloads\ui-ux-pro-max-skill-main.zip | ZIP_NOT_EXTRACTED | Copy .claude/ to project root |
| 21st-sdk-main | Downloads\21st-sdk-main.zip | ZIP_NOT_EXTRACTED | npm install |
| quant-ux-master | Downloads\quant-ux-master.zip | ZIP_NOT_EXTRACTED | npm install or docker-compose |
