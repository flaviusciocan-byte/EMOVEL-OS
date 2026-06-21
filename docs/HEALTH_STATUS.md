# EMOVEL-OS Health Status

**Last updated:** 2026-06-21  

## Readiness Summary

| Status | Count | Tools |
|---|---:|---|
| READY | 8 | ui-ux-pro-max-skill-main, 21st-sdk-main, Nano-Banana-Pro-main, awesome-gpt-image-2-API-and-Prompts-main, skills-main, claude-council-main, knowledge-work-plugins-main, claude-code-main |
| NEEDS SETUP | 16 | quant-ux-master, c15t-canary, nano-banana-2-ai-main, ladybird-master, darktable-master, cryptpad-main, screenity-master, Cap-main, puter-main, open-webui-main, penpot-develop, OpenCut-main, higgsfield-main, reflex-main, gpt-pilot-main, n8n-master |
| DO NOT INSTALL | 1 | 21st-sdk-main-duplicate |

## Safe Health Checks

| Check | Command | Result |
|---|---|---|
| Node | `node --version` | `v24.16.0` |
| npm | `npm.cmd --version` | `11.13.0` |
| pnpm | `pnpm.cmd --version` | `11.3.0` |
| Python | `python --version` | `Python 3.12.10` |
| Docker | `docker --version` | Docker present; config warning due user Docker config permissions |

## Known Issues

### Quant UX

`npm.cmd install` failed in:

`C:\EMOVEL\tools\quant-ux-master\quant-ux-master`

Failure:

- Package: `deasync`
- Error: `spawn EINVAL`
- Runtime: Node `v24.16.0`

Recommended next step: use an older Node LTS for this project or run Quant UX via Docker. No workaround was forced.

### Docker

Docker version check succeeds, but Docker reports:

`Error loading config file: open C:\Users\flavi\.docker\config.json: Access is denied.`

Docker itself is installed; config file permissions should be corrected before relying on Docker-based tools.

## Not Run

No dev servers, builds, Docker Compose stacks, global installs, destructive commands, or long-running runtime commands were executed.

