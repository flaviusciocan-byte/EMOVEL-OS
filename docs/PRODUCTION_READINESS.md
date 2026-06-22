# Production Readiness

Updated: 2026-06-22

## Current Verdict

Status: `REGISTERED_WITH_PARTIAL_INSTALL`

EMOVEL-OS is acting as the control center for external production tools. The requested ZIPs are extracted outside the repo, registered by exact path, and audited. One Tier S dependency tool, `21st-sdk-main`, is installed. `ui-ux-pro-max-skill-main` is ready for skill/reference use but has no local dependency install in its extracted path. Postiz is now registered as the social publishing layer but needs manual setup before use.

## Ready Components

| Component | Status | Evidence |
|---|---|---|
| External tool root | READY | `C:\EMOVEL\tools` exists |
| Tool ZIP audit | COMPLETE | `docs/TOOL_AUDIT.md` |
| Tool registry | UPDATED | `config/tools.json` |
| UI UX Pro Max | INSTALL_READY | README detected; no dependency manifest detected |
| 21st SDK | INSTALLED | `pnpm.cmd install` completed |
| Quant UX | REGISTERED | Path and manifests detected; install deferred |
| Nano Banana 2 AI | REGISTERED | Path and package manifest detected; install deferred |
| GPT image prompt library | REGISTERED | Path and README detected |
| Nano Banana Pro | REGISTERED | Path and README detected |
| Postiz social publishing | NEEDS_MANUAL_SETUP | Extracted and registered; Node engine mismatch prevents source install; nvm-windows not detected |
| Prompt Studio build | PASS | `npm run build` passes |

## Deferred Setup

| Tool | Reason |
|---|---|
| Quant UX | Do not install Quant UX yet, per sprint instruction |
| nano-banana-2-ai-main | Visual repo install deferred; likely needs API key setup before runtime |
| awesome-gpt-image-2-API-and-Prompts-main | Reference/prompt library, no install needed |
| Nano-Banana-Pro-main | Reference repo, no install needed |
| UI UX Pro Max global CLI | Global install not explicitly approved |
| postiz-app-main | Requires Node `>=22.12.0 <23.0.0` or Docker setup; local Node is `v24.16.0`; nvm-windows not detected; no containers launched |

## Production Use Guidance

- Use `config/tools.json` as the source of truth for exact external tool paths.
- Keep full tool repositories outside EMOVEL-OS.
- Use `21st-sdk-main` from its external path when component/agent SDK work is needed.
- Use UI UX Pro Max as a design intelligence/reference layer unless a future sprint explicitly installs its optional CLI or skill integration.
- Use Postiz as the reviewed handoff for `SOCIAL_LAUNCH_POSTS.md` after manual setup and account connection.
- Use `docs/POSTIZ_NODE_SETUP.md` before attempting a source install of Postiz.
- Do not promote deferred tools to `PRODUCTION_READY` until they are installed, smoke-tested, and tied to a real EMOVEL workflow artifact.

## Not Performed

- No Docker compose command was run.
- No global Node version was changed.
- No social account was connected.
- No post was published.
- No Quant UX install was run.
- No visual repo install was run.
- No global package install was run.
- No paid API or MCP connection was claimed.

---

## Sprint Update: code-review-graph — 2026-06-22

### New Tool Added to Registry

| Field | Value |
|---|---|
| Tool | `code-review-graph-main` |
| Expected path | `C:\EMOVEL\tools\code-review-graph-main` |
| Status | `NOT_FOUND` |
| Category | `BUILDER_LAYER` (provisional) |
| Installed | NO |
| Integration type confirmed | NO |

### Impact on Overall Production Readiness

No impact on existing components. The tool was registered with `NOT_FOUND` to track it. All previously listed components retain their status unchanged.

### Unblock Requirement

The ZIP or repository source must be located and extracted to `C:\EMOVEL\tools\code-review-graph-main\` before any integration work is possible.

### What Was Not Claimed

- No MCP endpoint was registered.
- No CLI was wired into Prompt Studio.
- No install was run.
- No capabilities were assumed or invented.
