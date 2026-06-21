# EMOVEL Execution Architecture

## Purpose

The execution layer turns Prompt Studio from an asset generator into a local orchestration planner. It routes a user command, selects EMOVEL skills, chooses the production pipeline, prepares a builder target, and prepares publishing targets.

This layer is orchestration-only. It does not execute builders, run shell commands, publish to platforms, send email, connect Gumroad, call paid APIs, or use a database.

## Location

`apps/emovel-prompt-studio/execution/`

Files:

- `targets.ts`
- `command-router.ts`
- `execution-plan-generator.ts`
- `index.ts`
- `execution-plan.md`

## Router Flow

1. Receive a plain-language command.
2. Detect intent:
   - create product
   - build app
   - prepare publish
   - prepare shop
   - create content
   - unknown
3. Select EMOVEL skills.
4. Select production pipeline:
   - `pipelines/production-pipeline-v1`
5. Select builder target:
   - GPT-Pilot
   - Pythagora
   - Reflex
   - Next.js
6. Select publishing targets:
   - Gumroad
   - Instagram
   - Facebook
   - TikTok
   - Email
7. Generate an execution plan markdown packet.

## Skill Selection

Default production skills:

- `emovel.audience_builder`
- `emovel.offer_architect`
- `emovel.pricing_engine`
- `emovel.copy_framework`
- `emovel.page_builder`
- `emovel.visual_brief`
- `emovel.funnel_builder`

Additional skills are selected by intent:

- build app: `emovel.premium_ui_director`
- prepare shop: `emovel.shopproductpack`
- publishing/content: `emovel.copy_framework`, `emovel.funnel_builder`, `emovel.visual_brief`

## Builder Flow

1. Router chooses builder target.
2. Execution plan records builder target and tool path expectation.
3. Prompt Studio writes local handoff files only.
4. Human reviews the builder workspace.
5. Human runs GPT-Pilot, Pythagora, Reflex, or Next.js commands manually outside Prompt Studio.

Builder targets:

- GPT-Pilot
- Pythagora
- Reflex
- Next.js

## Publishing Flow

1. Router chooses publishing targets from the command.
2. Prompt Studio prepares local publish package files.
3. Publishing target assets are mapped:
   - Gumroad: `GUMROAD_LISTING.md`, `SHOP_STATUS.md`
   - Instagram: `SOCIAL_LAUNCH_POSTS.md`
   - Facebook: `SOCIAL_LAUNCH_POSTS.md`
   - TikTok: `SOCIAL_LAUNCH_POSTS.md`
   - Email: `EMAIL_LAUNCH_COPY.md`
4. Human reviews and publishes manually on each platform.

No platform APIs are connected in this sprint.

## Execution Plan Output

The execution plan includes:

- selected skills
- selected tools
- builder target
- publishing targets
- output targets
- execution sequence
- safety boundary

Default output targets:

- `projects/generated/{project-slug}/`
- `projects/build-workspaces/{project-slug}/`
- `projects/build-workspaces/{project-slug}/publish-package/`
- `projects/build-workspaces/{project-slug}/execution-plan.md`

## Current Safety Boundary

The execution layer prepares orchestration only. It must not:

- run GPT-Pilot
- run Pythagora
- run Reflex
- execute terminal commands from the UI
- connect Gumroad
- post to Instagram, Facebook, or TikTok
- send email
- call paid APIs
- use a database

All execution state remains local markdown until explicit future integration work is approved.
