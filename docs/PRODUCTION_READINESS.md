# Production Readiness

Updated: 2026-06-22

## Current Verdict

Status: `REGISTERED_WITH_PARTIAL_INSTALL`

EMOVEL-OS is acting as the control center for external production tools. The requested ZIPs are extracted outside the repo, registered by exact path, and audited. One Tier S dependency tool, `21st-sdk-main`, is installed. `ui-ux-pro-max-skill-main` is ready for skill/reference use but has no local dependency install in its extracted path. Postiz is registered as the social publishing layer but needs manual setup before use. `code-review-graph-main` is now extracted, installed as a Python CLI package, and registered without launching services or writing platform MCP config.

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
| code-review-graph CLI | INSTALLED | `pip show code-review-graph` reports `2.3.6`; `code-review-graph --help` works |
| Prompt Studio build | PASS | `npm.cmd run build` passes |

## Deferred Setup

| Tool | Reason |
|---|---|
| Quant UX | Do not install Quant UX yet, per sprint instruction |
| nano-banana-2-ai-main | Visual repo install deferred; likely needs API key setup before runtime |
| awesome-gpt-image-2-API-and-Prompts-main | Reference/prompt library, no install needed |
| Nano-Banana-Pro-main | Reference repo, no install needed |
| UI UX Pro Max global CLI | Global install not explicitly approved |
| postiz-app-main | Requires Node `>=22.12.0 <23.0.0` or Docker setup; local Node is `v24.16.0`; nvm-windows not detected; no containers launched |
| code-review-graph MCP connection | Server command exists, but no server was started and no platform config was written |
| code-review-graph Claude Code setup | Supported by CLI, but `code-review-graph install --platform claude-code` was not run |
| code-review-graph VS Code extension | Source exists, but dependencies/build/VSIX install were not run |

## Production Use Guidance

- Use `config/tools.json` as the source of truth for exact external tool paths.
- Keep full tool repositories outside EMOVEL-OS.
- Use `21st-sdk-main` from its external path when component/agent SDK work is needed.
- Use UI UX Pro Max as a design intelligence/reference layer unless a future sprint explicitly installs its optional CLI or skill integration.
- Use Postiz as the reviewed handoff for `SOCIAL_LAUNCH_POSTS.md` after manual setup and account connection.
- Use `docs/POSTIZ_NODE_SETUP.md` before attempting a source install of Postiz.
- Use code-review-graph only as an installed CLI until a future targeted step connects MCP or platform configs.
- Do not promote deferred tools to `PRODUCTION_READY` until they are installed, smoke-tested, and tied to a real EMOVEL workflow artifact.

## Not Performed

- No Docker compose command was run.
- No global Node version was changed.
- No social account was connected.
- No post was published.
- No Quant UX install was run.
- No visual repo install was run.
- No paid API or MCP connection was claimed.
- No code-review-graph MCP server was started.
- No code-review-graph daemon or watch service was started.
- No code-review-graph platform installer was run.

---

## Sprint Update: code-review-graph - 2026-06-22

### Tool Added to Registry

| Field | Value |
|---|---|
| Tool | `code-review-graph-main` |
| Real path | `C:\EMOVEL\tools\code-review-graph-main\code-review-graph-main` |
| Status | `INSTALLED` |
| Category | `BUILDER_LAYER` |
| Installed | YES, Python package `code-review-graph 2.3.6` |
| MCP server | Available but not connected |
| CLI | Available |
| Claude Code integration | Supported but not configured |
| VS Code extension | Source present but not installed |

### Impact on Overall Production Readiness

No existing component behavior changed. The integration unblocks future code-review-graph setup by registering the real extracted path and verified CLI state.

### What Was Not Claimed

- No MCP endpoint was registered.
- No CLI was wired into Prompt Studio.
- No Claude Code config was written.
- No VS Code extension was installed.
- No capabilities were assumed or invented.
