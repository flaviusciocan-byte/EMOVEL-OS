# EMOVEL Tool Usage Validation

Validation date: 2026-06-22
Sprint: Tool Usage Validation Sprint

Scope: Validate that extracted production tools can be used by EMOVEL workflows.
Source: `docs/TOOL_AUDIT.md`, `config/tools.json`, direct tool inspection.

---

## 1. ui-ux-pro-max-skill-main

**Path:** `C:\EMOVEL\tools\ui-ux-pro-max-skill-main\ui-ux-pro-max-skill-main`
**Registry status:** INSTALL_READY
**Category:** UX_LAYER

### What EMOVEL can use it for

- Query color palettes, UI styles, typography pairings, and UX guidelines during the Premium UI Director skill phase
- Get stack-specific Tailwind/Next.js component patterns for EMOVEL product pages and emovel-site
- Generate a complete design system recommendation for any new EMOVEL product landing page using the `--domain product` search
- Use the banner-design and brand skill definitions to brief cover image creation for Gumroad products

### What is installed

- Tool is extracted at the registered path
- Python 3.12.10 is available on the system as `python`
- No external Python packages are required (confirmed in CLAUDE.md: "no external dependencies required")
- Skill definitions available at `.claude/skills/ui-ux-pro-max/SKILL.md` (symlinked from `src/`)

### What is NOT installed

- Global `uipro-cli` npm package not installed (optional; not needed for EMOVEL workflows)
- `cli/` subpackage (`node_modules`) not installed (optional; only needed if using CLI installer)

### Commands available now

Search the design intelligence database:
```
python "C:\EMOVEL\tools\ui-ux-pro-max-skill-main\ui-ux-pro-max-skill-main\src\ui-ux-pro-max\scripts\search.py" "<query>" --domain <domain> -n <max_results>
```

Domains: `style`, `color`, `typography`, `landing`, `product`, `chart`, `ux`

Stack-specific query:
```
python "C:\EMOVEL\tools\ui-ux-pro-max-skill-main\ui-ux-pro-max-skill-main\src\ui-ux-pro-max\scripts\search.py" "<query>" --stack nextjs
```

**Live test result (2026-06-22):** `python ... search.py "luxury landing page" --domain style -n 3` returned 3 validated results including Trust & Authority, Hero-Centric Design, and Minimal & Direct patterns — with CSS variables, AI prompt keywords, and implementation checklists. Script runs without errors.

### Can be used now

**YES** — Python CLI works without any install step. Invoke directly from the registered path.

---

## 2. 21st-sdk-main

**Path:** `C:\EMOVEL\tools\21st-sdk-main\21st-sdk-main`
**Registry status:** INSTALLED
**Category:** BUILDER_LAYER

### What EMOVEL can use it for

- Reference the `@21st-sdk/agent` TypeScript API to understand how Claude Code agents are defined with tools and system prompts
- Use the agent definition pattern (`agent({ model, tools, systemPrompt })` from `packages/agent/src/agent.ts`) as a template for the EMOVEL Skills Architecture
- Study the `@21st-sdk/react` embedding pattern to understand how to embed a chat agent UI inside emovel-site (future sprint only)
- Use `@21st-sdk/cli` to deploy a standalone EMOVEL agent once the relay/proxy services are configured

### What is installed

- `pnpm install` completed on 2026-06-22 (confirmed in `docs/TOOL_AUDIT.md`)
- Prisma client was generated during postinstall
- All `packages/*` dependencies resolved (pnpm workspace, pnpm@11.3.0 used)

### What is NOT installed

- `.env` files for all three service apps are not created
- `apps/relay` requires: `DATABASE_URL`, `REDIS_URL`, `AN_JWT_SECRET`, `CLAUDE_PROXY_PRIVATE_JWT`, `CLAUDE_PROXY_URL`, `RELAY_URL`, `E2B_API_KEY` or `OPENSANDBOX_*`
- `apps/agents-web` requires: `DATABASE_URL`, `DIRECT_DATABASE_URL`, auth provider env, `NEXT_PUBLIC_RELAY_URL`
- `apps/proxy` requires: `ANTHROPIC_API_KEY`, `JWT_PUBLIC_KEY`, `DATABASE_URL`
- No Redis instance running locally
- No E2B or OpenSandbox account configured
- No tunnel (ngrok or similar) for sandbox-to-relay communication

### Commands available now (packages only)

```
cd C:\EMOVEL\tools\21st-sdk-main\21st-sdk-main
pnpm build            # builds packages/* only (intentionally scoped)
pnpm ts:check         # TypeScript checks on packages/*
```

Full local stack requires setting up all `.env` files first:
```
cp apps/agents-web/.env.example apps/agents-web/.env
cp apps/relay/.env.example apps/relay/.env
cp apps/proxy/.env.example apps/proxy/.env
# then fill in all required env vars before running services
```

### Can be used now

**PARTIAL** — Package source and types are usable as reference today. The agent definition API at `packages/agent/src/agent.ts` can be read and used as a pattern for EMOVEL agent design. Full agent deployment requires env setup for all three services (relay, proxy, agents-web) plus Redis, database, and a sandbox provider (E2B or OpenSandbox). Not runnable as a service without those.

---

## 3. quant-ux-master

**Path:** `C:\EMOVEL\tools\quant-ux-master\quant-ux-master`
**Registry status:** REGISTERED
**Category:** UX_LAYER

### What EMOVEL can use it for

- Create interactive click-through prototypes of emovel-site user flows (products page → product detail → Gumroad checkout)
- Run usability tests on product pages before launch to identify friction in the buyer journey
- Export prototype data and test results as structured insights for copy and layout decisions
- Use as self-hosted alternative to Maze or UserTesting

### What is installed

- Tool is extracted at the registered path
- Nothing installed (`npm install` not yet run)

### What is NOT installed

- `node_modules` (requires `npm install`)
- Java backend (`qux-java` — separate repo, requires Java 1.8+ and MongoDB 4.4+)
- MongoDB instance
- SMTP server for user account emails

### Commands needed to install and run

Frontend only (no tests or prototypes without backend):
```
cd C:\EMOVEL\tools\quant-ux-master\quant-ux-master
npm install
npm run serve
```

Full stack (Docker recommended):
```
docker compose -f docker/docker-compose.yml up
```
Requires: filled `docker-compose.yml` with `QUX_JWT_PASSWORD`, `QUX_MAIL_USER`, `QUX_MAIL_PASSWORD`, `QUX_MAIL_HOST`, `QUX_HTTP_HOST`.

### Can be used now

**NO** — Not installed. `npm install` not yet run. Also requires separate Java backend and MongoDB to function beyond a blank UI. Docker is the recommended path but requires Docker Desktop to be working (config.json access was denied per `docs/HEALTH_STATUS.md`). Resolve Docker Desktop permissions first, then use the docker compose path.

---

## 4. nano-banana-2-ai-main

**Path:** `C:\EMOVEL\tools\nano-banana-2-ai-main\nano-banana-2-ai-main`
**Registry status:** REGISTERED
**Category:** VISUAL_PRODUCTION

### What EMOVEL can use it for

- Run a local Gemini-powered image generation interface to create product cover images and preview screenshots for Gumroad listings
- Generate social media post graphics for EMOVEL product launches (AI Instagram Content OS cover, Launch Stack v1 promo images)
- Use the `/api/generate-image` route pattern as a reference for adding image generation to emovel-site or emovel-prompt-studio

### What is installed

- Tool is extracted at the registered path
- Nothing installed (`npm install` not yet run)
- No `.env` created

### What is NOT installed

- `node_modules` (requires `npm install`)
- `GEMINI_API_KEY` (Google AI Studio key required for `@ai-sdk/google`)
- Supabase project for auth and generation history storage

### Commands needed to install and run

```
cd C:\EMOVEL\tools\nano-banana-2-ai-main\nano-banana-2-ai-main
npm install
# create .env with:
# GEMINI_API_KEY=<key>
# NEXT_PUBLIC_SUPABASE_URL=<url>
# NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>
npm run dev
# open http://localhost:3000
```

### Can be used now

**NO** — Not installed. Requires `npm install`, a Gemini API key from Google AI Studio, and a Supabase instance for auth. Install is straightforward once the API key is obtained. Supabase can be replaced by disabling auth routes if only image generation is needed (requires code modification).

---

## 5. awesome-gpt-image-2-API-and-Prompts-main

**Path:** `C:\EMOVEL\tools\awesome-gpt-image-2-API-and-Prompts-main\awesome-gpt-image-2-API-and-Prompts-main`
**Registry status:** REGISTERED
**Category:** VISUAL_PRODUCTION

### What EMOVEL can use it for

- Mine the 911+ curated prompts across 7 categories for cover image and social graphic generation
- Use the e-commerce and poster prompt patterns to create Gumroad product cover images for AI Instagram Content OS and Launch Stack v1
- Reference the UI & Social Media Mockup category for generating product preview screenshots
- Copy the API integration pattern (`curl --data '{"model":"gpt-image-2","prompt":"..."}'`) to add image generation to any EMOVEL workflow

### What is installed

- Tool is extracted at the registered path
- No install required — pure markdown reference library with image cases

### What is NOT installed

- `EVOLINK_API_KEY` — required to use the EvoLink hosted API endpoint
- Alternative: any GPT-Image-2 compatible API (OpenAI Images API, gpt-image-2 model) works with the same prompt format

### Commands available now

No commands. Read the reference files:
```
# Browse categories:
C:\EMOVEL\tools\awesome-gpt-image-2-API-and-Prompts-main\awesome-gpt-image-2-API-and-Prompts-main\README.md

# API call pattern (requires EVOLINK_API_KEY or equivalent):
curl --request POST \
  --url https://api.evolink.ai/v1/images/generations \
  --header "Authorization: Bearer $EVOLINK_API_KEY" \
  --header "Content-Type: application/json" \
  --data '{"model": "gpt-image-2", "prompt": "<prompt from library>"}'
```

### Can be used now

**YES (as reference)** — Prompts and patterns can be read and applied immediately. API calls require `EVOLINK_API_KEY` (free signup at evolink.ai) or an OpenAI API key for the `gpt-image-2` model. No installation needed for prompt reference use.

---

## 6. Nano-Banana-Pro-main

**Path:** `C:\EMOVEL\tools\Nano-Banana-Pro-main\Nano-Banana-Pro-main`
**Registry status:** REGISTERED
**Category:** VISUAL_PRODUCTION

### What EMOVEL can use it for

- Use the prompt engineering patterns from the README to write better image generation prompts (character consistency, 4K upscaling, text accuracy)
- Reference the use-case categories (brand campaigns, social media series, product photography) to structure cover image briefs for EMOVEL products
- The 95% character consistency and 94% text accuracy notes are useful guidelines when writing prompts for any Gemini or GPT-Image-2 model

### What is installed

- Tool is extracted at the registered path
- No install required — pure markdown reference and promotional content

### What is NOT installed

- Nothing to install. The actual image generation service is at `nanobananaproai.net` (external SaaS, browser-only)

### Commands available now

No commands. The service is accessed via browser at `https://nanobananaproai.net`. The README is a reference for prompt patterns only.

### Can be used now

**YES (as reference only)** — Prompt patterns in the README can be read and applied to other image generation tools. The actual generation service requires a browser session at the external URL. No local capability — this is a reference asset, not a local tool.

---

## Summary Table

| Tool | Usable Now | Mode | Blocker to Full Use |
|---|---|---|---|
| ui-ux-pro-max-skill-main | YES | Python CLI, no install needed | None — runs today |
| 21st-sdk-main | PARTIAL | Package types/reference only | Env vars: DATABASE_URL, REDIS_URL, E2B_API_KEY + 3 service apps |
| quant-ux-master | NO | — | npm install + Java backend + MongoDB + Docker permissions |
| nano-banana-2-ai-main | NO | — | npm install + GEMINI_API_KEY + Supabase |
| awesome-gpt-image-2 | YES (reference) | Read-only prompt library | API key for generation calls |
| Nano-Banana-Pro-main | YES (reference) | Read-only README | External service only (browser at nanobananaproai.net) |

---

## Immediate Actions Enabled

1. **Cover image briefs** — use `awesome-gpt-image-2` prompt library + `Nano-Banana-Pro` patterns to write precise prompts for AI Instagram Content OS and Launch Stack v1 covers.
2. **UI decisions** — run `ui-ux-pro-max` Python CLI with `--domain style --stack nextjs` queries during any emovel-site build sprint.
3. **21st Magic MCP** — `magic` MCP server added to user config on 2026-06-22. Restart Claude Code to activate component generation from 21st.dev.
4. **Gumroad cover image** — to generate actual images today, obtain a free EvoLink or Google AI Studio API key, then use `awesome-gpt-image-2` prompts with the curl pattern above.
