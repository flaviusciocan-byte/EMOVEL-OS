# EMOVEL Prompt Studio v1

## Purpose

EMOVEL Prompt Studio v1 is the first internal EMOVEL-OS interface for turning a raw prompt into structured production assets.

It is intentionally local-first. It does not connect to paid APIs yet. Instead, it uses EMOVEL skill markdown, production pipeline docs, and project templates as the source of truth for generating structured markdown outputs.

## Location

App:

`apps/emovel-prompt-studio/`

Run locally:

```powershell
cd apps\emovel-prompt-studio
npm.cmd run dev
```

## Architecture

Stack:

- Next.js
- TypeScript
- Tailwind CSS
- Local browser-side template generation

Key files:

- `app/page.tsx` - home screen
- `app/new-project/page.tsx` - main prompt generation interface
- `app/output-preview/page.tsx` - output panel preview page
- `components/PromptStudio.tsx` - interactive studio UI
- `lib/templates.ts` - local generation templates and source mappings

Source-of-truth folders:

- `knowledge/skills/`
- `pipelines/production-pipeline-v1/`
- `project-templates/`

## Input Flow

1. User opens **New Project**.
2. User enters a raw prompt.
3. User selects a project type:
   - landing page
   - shop product
   - SaaS app
   - digital product
   - Instagram campaign
4. User selects output types:
   - offer
   - copy
   - UX audit
   - component plan
   - motion plan
   - visual brief
   - build plan
   - launch plan
5. User clicks **Generate assets**.

## Output Flow

The app generates structured markdown panels locally. Each output type maps to relevant EMOVEL source files.

Examples:

- Offer uses `emovel.offer_architect`, `emovel.pricing_engine`, and `product-brief.md`.
- Copy uses `emovel.copy_framework` and `emovel.page_builder`.
- UX audit uses `emovel.premium_ui_director`, `emovel.visual_brief`, and the production pipeline checklist.
- Build plan uses `project-templates/build-plan.md` and the production pipeline runbook.

The user can export the generated markdown with **Export markdown**.

## Future Integrations

### Claude

Claude can replace or augment local templates by reading the same source folders and generating higher-quality outputs while preserving the current input/output contract.

### GPT-Pilot

GPT-Pilot can consume the generated build plan and create app scaffolds or implementation plans for selected products.

### Reflex

Reflex can become a preview target for Python-native UI prototypes once the local Reflex setup issue is resolved.

### n8n

n8n can turn generated launch plans and build plans into automated workflows for intake, delivery, reporting, and follow-up.

### Gumroad

Gumroad can be added as a commerce/export target for digital products once pricing, offer, copy, and launch assets are generated.

## v1 Constraint

No paid API calls. No hidden external services. No fake integrations.

## Build Status

Verified on 2026-06-21:

```powershell
cd apps\emovel-prompt-studio
npm.cmd install
npm.cmd run build
```

Result: build passed for `/`, `/new-project`, and `/output-preview`.

Note: npm audit reports two vulnerabilities in the dependency tree. No forced audit fix was applied because it may introduce breaking changes.
