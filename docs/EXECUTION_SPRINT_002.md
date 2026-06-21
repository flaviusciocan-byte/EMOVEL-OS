# EMOVEL Execution Sprint 002

## Goal

Expose the execution orchestrator inside Prompt Studio UI.

## What Changed

- Added `Execution Mode` toggle on `/new-project`.
- Added intent preview from the command router.
- Added selected skills preview.
- Added builder target selector:
  - GPT-Pilot
  - Pythagora
  - Reflex
  - Next.js
- Added publishing target selector:
  - Gumroad
  - Instagram
  - Facebook
  - TikTok
  - Email
- Added execution plan preview.
- Added `Generate Execution Plan` button.
- Added API support for saving `execution-plan.md`.
- Added `execution-plan.md` to generated project viewers.

## Save Flow

When `Generate Execution Plan` is clicked:

1. Prompt Studio sends the local project command to `/api/projects`.
2. The command router detects intent.
3. The execution plan generator selects skills, tools, builder target, publishing targets, and output targets.
4. Prompt Studio writes:

```text
projects/generated/{project-slug}/execution-plan.md
```

## Project Viewer

`/projects/[slug]` now shows `execution-plan.md` when it exists because it is included in the generated project file list.

## Safety Boundary

Execution Mode prepares orchestration only.

It does not:

- run GPT-Pilot
- run Pythagora
- run Reflex
- execute shell commands from the UI
- publish to Gumroad
- post to social media
- send email
- call paid APIs
- use a database

## Verification

Run from `apps/emovel-prompt-studio/`:

```bash
npm run build
```
