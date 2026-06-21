# EMOVEL Prompt Studio v1.4

## Purpose

Prompt Studio v1.4 adds a GPT-Pilot / Pythagora handoff mode for generated projects. It prepares local builder instructions without running GPT-Pilot, calling APIs, creating a database, or installing external services.

## What Changed

- Added `Prepare GPT-Pilot Build` on `/projects/[slug]`.
- Generates `projects/generated/{project-slug}/gpt-pilot-prompt.md`.
- Generates `projects/generated/{project-slug}/README_BUILD.md`.
- Adds both files to the existing project markdown viewer.
- Keeps the flow local through Next.js Server Actions and filesystem writes.

## GPT-Pilot Prompt Contents

The generated prompt includes:

- project summary
- product goal
- target user
- route structure
- component hierarchy
- UX requirements
- motion requirements
- styling rules
- files to create
- build constraints
- acceptance checklist

## README_BUILD Contents

`README_BUILD.md` explains:

- how to use `gpt-pilot-prompt.md` with GPT-Pilot / Pythagora
- expected generated app output
- manual next steps after generation

## Local Flow

1. Generate a project from `/new-project`.
2. Open `/projects`.
3. Select a project.
4. Click `Prepare GPT-Pilot Build`.
5. Copy `gpt-pilot-prompt.md` into GPT-Pilot or Pythagora manually.
6. Keep generated app output outside EMOVEL-OS unless intentionally creating a product app folder.

## Boundaries

- GPT-Pilot is not run automatically.
- No paid APIs are called.
- No database is added.
- No generated app files are created by this mode.

## Build Verification

Run from `apps/emovel-prompt-studio/`:

```bash
npm run build
```
