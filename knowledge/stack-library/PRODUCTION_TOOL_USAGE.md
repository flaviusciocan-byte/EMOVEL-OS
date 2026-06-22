# EMOVEL Production Tool Usage Reference

Last updated: 2026-06-22
Sprint: Tool Usage Validation Sprint
Full validation report: `docs/TOOL_USAGE_VALIDATION.md`

This file is the quick-reference entry point for EMOVEL workflows. Full details, install steps, and commands are in the validation report above.

---

## ui-ux-pro-max-skill-main

**Role in EMOVEL:** Design intelligence for UI decisions, color, typography, and component patterns.
**When to use:** At the start of any UI build sprint. Run before writing Tailwind classes or choosing fonts.
**Status: USABLE NOW**

```
python "C:\EMOVEL\tools\ui-ux-pro-max-skill-main\ui-ux-pro-max-skill-main\src\ui-ux-pro-max\scripts\search.py" "<query>" --domain <domain> --stack nextjs -n 5
```

Domains: `style` `color` `typography` `landing` `product` `chart` `ux`

Example queries for EMOVEL:
- `"luxury minimal digital product"` `--domain style`
- `"premium SaaS landing page"` `--domain landing --stack nextjs`
- `"dark mode signal blue mint"` `--domain color`
- `"conversion CTA button"` `--domain ux`

Data files: `src/ui-ux-pro-max/data/` — 31 CSV databases including styles.csv, colors.csv, typography.csv, ux-guidelines.csv, stacks/nextjs.csv

---

## 21st-sdk-main

**Role in EMOVEL:** Agent SDK reference for building tool-equipped Claude Code agents.
**When to use:** When designing EMOVEL skill agents, tool definitions, or embedding a chat UI in emovel-site.
**Status: PARTIAL — packages installed, services not running**

Agent definition pattern (from `packages/agent/src/agent.ts`):
```typescript
import { agent } from "@21st-sdk/agent"

const myAgent = agent({
  model: "claude-sonnet-4-6",
  systemPrompt: "...",
  tools: { /* tool definitions */ },
  maxTurns: 50,
  permissionMode: "bypassPermissions",
})
```

To run the full service stack: set `DATABASE_URL`, `REDIS_URL`, `E2B_API_KEY`, and fill `.env` files for all three apps (`agents-web`, `relay`, `proxy`). See `docs/TOOL_USAGE_VALIDATION.md` for the full env var list.

---

## quant-ux-master

**Role in EMOVEL:** UX prototyping and usability testing for product pages and buyer journey flows.
**When to use:** Before a major product page redesign or launch, to test the click-through flow.
**Status: NOT USABLE — not installed**

Blockers: `npm install` not run, Java backend not set up, Docker permissions issue on this machine.
Preferred path to activate: fix Docker Desktop permissions, then `docker compose -f docker/docker-compose.yml up`.

---

## nano-banana-2-ai-main

**Role in EMOVEL:** Local Gemini image generation interface for cover images and product graphics.
**When to use:** To generate 4K product cover images, social media graphics, and Gumroad preview screenshots.
**Status: NOT USABLE — not installed**

Blockers: `npm install` not run, `GEMINI_API_KEY` not configured, Supabase not set up.
Fastest path: `npm install` + Google AI Studio key → `npm run dev`.

---

## awesome-gpt-image-2-API-and-Prompts-main

**Role in EMOVEL:** Curated GPT-Image-2 prompt library for visual production.
**When to use:** When writing image generation prompts for covers, social graphics, or product screenshots.
**Status: USABLE NOW (as reference)**

911+ prompts across 7 categories:
- E-commerce → product shots, lifestyle, packaging
- Poster & Illustration → event posters, brand posters
- UI & Social Media Mockup → device mockups, app screenshots
- Ad Creative → banner ads, social ads
- Portrait & Photography → brand photography
- Character Design → mascots, illustrated personas
- Comparison → before/after, side-by-side

API pattern (requires `EVOLINK_API_KEY` or equivalent GPT-Image-2 key):
```bash
curl --request POST \
  --url https://api.evolink.ai/v1/images/generations \
  --header "Authorization: Bearer $EVOLINK_API_KEY" \
  --header "Content-Type: application/json" \
  --data '{"model": "gpt-image-2", "prompt": "<prompt>"}'
```

Reference path: `C:\EMOVEL\tools\awesome-gpt-image-2-API-and-Prompts-main\awesome-gpt-image-2-API-and-Prompts-main\README.md`

---

## Nano-Banana-Pro-main

**Role in EMOVEL:** Prompt engineering patterns for character consistency and high-accuracy text-in-image generation.
**When to use:** When briefing AI image generation tasks that need readable text (covers, posters) or consistent brand character.
**Status: USABLE NOW (reference only)**

Key patterns from the README:
- Character consistency: specify subject embedding explicitly; supports 5+ characters in one composition
- Text accuracy: include `readable text:` prefix in prompt for labels, posters, signage
- 4K upscale: use `--upscale 4096` or equivalent parameter for print-quality output

Not a local tool. Image generation via browser at `nanobananaproai.net`. README is the usable EMOVEL asset.

---

## Tool Readiness Overview

| Tool | EMOVEL Role | Usable Now | Next Step to Activate |
|---|---|---|---|
| ui-ux-pro-max-skill-main | UI design intelligence | YES | None |
| awesome-gpt-image-2 | Image prompt library | YES (reference) | Get API key for generation |
| Nano-Banana-Pro-main | Prompt patterns | YES (reference) | None |
| 21st-sdk-main | Agent SDK reference | PARTIAL | Fill .env files + Redis + E2B |
| quant-ux-master | UX prototyping | NO | Fix Docker, then compose up |
| nano-banana-2-ai-main | Image generation | NO | npm install + GEMINI_API_KEY |
