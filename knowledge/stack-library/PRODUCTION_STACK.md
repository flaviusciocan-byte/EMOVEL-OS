# Production Stack

This is the current real EMOVEL production path using detected local tools.

## Working Path

1. Strategy review: `C:\EMOVEL\tools\claude-council-main\claude-council-main`
2. UI direction: `C:\EMOVEL\tools\ui-ux-pro-max-skill-main\ui-ux-pro-max-skill-main`
3. Components/agent UI: `C:\EMOVEL\tools\21st-sdk-main\21st-sdk-main`
4. App build: `C:\EMOVEL\tools\gpt-pilot-main\gpt-pilot-main`
5. Automation design: `C:\EMOVEL\tools\n8n-master\n8n-master`
6. Launch visuals: `C:\EMOVEL\tools\awesome-gpt-image-2-API-and-Prompts-main\awesome-gpt-image-2-API-and-Prompts-main`

## Blocked Path

| Layer | Tool | Blocker |
|---|---|---|
| UX testing | Quant UX | npm install fails on Node 24 during `deasync` |
| Python preview | Reflex | editable install fails on dynamic version metadata |
| Source automation | n8n source | npm cannot install pnpm workspace protocol |

Only promote a layer to `PRODUCTION_READY` after a real project passes `tests/production-pipeline-test.md`.
