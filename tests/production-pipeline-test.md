# Production Pipeline Test

## Purpose

Validate that EMOVEL-OS can turn a raw idea into a launchable site/app/shop/workflow asset using real external tools registered by path.

## Raw Idea

Create a premium landing page and launch workflow for a boutique AI automation studio that sells a $1,500 "Launch Automation Sprint" to solo founders.

## Pipeline

| Step | Tool | Path | Required Evidence |
|---|---|---|---|
| 1. Decision review | Claude Council | `C:\EMOVEL\tools\claude-council-main\claude-council-main` | Offer risks, positioning risks, and go/no-go decision |
| 2. UX direction | UI UX Pro Max | `C:\EMOVEL\tools\ui-ux-pro-max-skill-main\ui-ux-pro-max-skill-main` | Design system, layout pattern, anti-patterns, accessibility notes |
| 3. Component layer | 21st SDK | `C:\EMOVEL\tools\21st-sdk-main\21st-sdk-main` | Component strategy or agent UI plan using installed SDK |
| 4. Motion layer | GSAP / motion skills | `C:\EMOVEL\tools\skills-main\skills-main\skills\frontend-design` | Motion plan with reduced-motion fallback |
| 5. App builder | GPT-Pilot | `C:\EMOVEL\tools\gpt-pilot-main\gpt-pilot-main` | Generated app scaffold or implementation plan from installed venv |
| 6. Preview layer | Reflex | `C:\EMOVEL\tools\reflex-main\reflex-main` | Currently blocked; record install fix before preview |
| 7. Automation | n8n | `C:\EMOVEL\tools\n8n-master\n8n-master` | Workflow spec or npx/Docker runtime test |
| 8. Launch asset | Visual Production | `C:\EMOVEL\tools\awesome-gpt-image-2-API-and-Prompts-main\awesome-gpt-image-2-API-and-Prompts-main` | Hero visual prompt, social asset prompt, demo script |

## Acceptance Criteria

- Every tool used must be referenced by real detected path.
- No full repositories are copied into EMOVEL-OS.
- Output includes a page/app artifact, automation workflow spec, and launch asset prompt.
- Any blocked tool produces a specific failure note and fallback path.

## Current Result

Status: `NOT RUN`

Known blockers before first full run:

- Quant UX install failure on Node 24.
- Reflex editable install failure.
- n8n source npm install failure; use npx or Docker runtime instead.
