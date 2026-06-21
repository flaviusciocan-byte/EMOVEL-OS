# EMOVEL Prompt Studio v1.1

## Purpose

Prompt Studio v1.1 connects the local prompt interface to the reusable EMOVEL Production Pipeline v1.

It remains local only:

- No paid APIs
- No database
- No remote generation service

## What Changed

### Project Save System

Prompt Studio can now save generated markdown to:

`projects/generated/{project-slug}/`

The **Save output** button writes:

- `output.md`

### Pipeline Mode

The **Run Production Pipeline** button creates a full production asset folder:

```text
projects/generated/{project-slug}/
├── offer.md
├── copy.md
├── ux-audit.md
├── component-plan.md
├── motion-plan.md
├── visual-brief.md
├── build-plan.md
└── launch-plan.md
```

## Architecture

Client UI:

- `apps/emovel-prompt-studio/components/PromptStudio.tsx`

Local template engine:

- `apps/emovel-prompt-studio/lib/templates.ts`

Local filesystem route:

- `apps/emovel-prompt-studio/app/api/projects/route.ts`

Generated project root:

- `projects/generated/`

## Input Flow

1. User enters a project name.
2. User enters a raw prompt.
3. User chooses a project type.
4. User chooses outputs.
5. User clicks either:
   - **Save output**
   - **Run Production Pipeline**

## Output Flow

`Save output` generates one markdown export using selected output panels.

`Run Production Pipeline` ignores the partial selector and generates the full production sequence:

```text
offer -> copy -> UX audit -> component plan -> motion plan -> visual brief -> build plan -> launch plan
```

## Source Of Truth

Generation still uses local templates mapped to:

- `knowledge/skills/`
- `pipelines/production-pipeline-v1/`
- `project-templates/`
- `docs/CLAUDE_SKILLS_INSTALLATION.md`
- `config/tools.json`

## Future Integration

The filesystem route is the bridge point for future local integrations:

- Claude can replace template sections with model-generated outputs.
- GPT-Pilot can consume `build-plan.md`.
- Reflex can preview generated app plans after its local setup is fixed.
- n8n can consume `launch-plan.md` as an automation source.
- Gumroad can consume offer/copy/pricing assets when commerce export is added.

## Build Status

Run from:

`apps/emovel-prompt-studio/`

```powershell
npm.cmd run build
```

