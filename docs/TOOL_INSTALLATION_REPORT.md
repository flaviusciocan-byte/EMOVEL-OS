# Tool Installation Report

**Date:** 2026-06-21  
**Scope:** EMOVEL-OS Production Integration Sprint

## Tier S Results

| Tool | Command Run | Status | Result |
|---|---|---|---|
| ui-ux-pro-max-skill-main | No dependency install required | REGISTERED | Claude Code plugin commands detected in README |
| 21st-sdk-main | `pnpm.cmd install` previously completed; `npm.cmd install` attempted this sprint | INSTALLED | pnpm install exists; npm failed with lockfile/dependency graph error |
| quant-ux-master | `npm.cmd install` | FAILED | `deasync` postinstall failed with `spawn EINVAL` on Node v24.16.0 |
| skills-main | No dependency install required | REGISTERED | Claude Code plugin commands detected in README |
| n8n-master | `npm.cmd install` | FAILED | npm failed with `EUNSUPPORTEDPROTOCOL workspace:*`; source is pnpm monorepo |
| gpt-pilot-main | `python -m venv .venv`; `.venv\Scripts\python.exe -m pip install -r requirements.txt` | INSTALLED | Requirements installed into local venv |
| reflex-main | `python -m venv .venv`; `.venv\Scripts\python.exe -m pip install -e .` | FAILED | Editable install failed on non-PEP-440 dynamic version fallback |

## Exact Failures

### 21st SDK npm install

Path: `C:\EMOVEL\tools\21st-sdk-main\21st-sdk-main`

```text
npm error Cannot destructure property 'package' of 'node.target' as it is null.
```

The repository declares `pnpm@9.15.4`; pnpm is the valid install path. `node_modules` exists from the completed pnpm install.

### Quant UX

Path: `C:\EMOVEL\tools\quant-ux-master\quant-ux-master`

```text
npm error path ...\node_modules\deasync
npm error Error: spawn EINVAL
npm error Node.js v24.16.0
```

Recommended fix: use an older Node LTS compatible with Quant UX dependencies, or run the documented Docker setup.

### n8n Source

Path: `C:\EMOVEL\tools\n8n-master\n8n-master`

```text
npm error code EUNSUPPORTEDPROTOCOL
npm error Unsupported URL Type "workspace:": workspace:*
```

n8n source is a pnpm workspace. For production runtime, use `npx n8n` or Docker.

### Reflex

Path: `C:\EMOVEL\tools\reflex-main\reflex-main`

```text
ValueError: Error getting the version from source `uv-dynamic-versioning`: Version '0.0.0dev0' does not conform to the PEP 440 style
```

Recommended fix: inspect Reflex source installation docs or install the published package in a project venv instead of editable source install.

## Installed

- `C:\EMOVEL\tools\21st-sdk-main\21st-sdk-main` via pnpm
- `C:\EMOVEL\tools\gpt-pilot-main\gpt-pilot-main` via local Python venv

## Not Installed

All non-Tier-S tools remain registered only.
