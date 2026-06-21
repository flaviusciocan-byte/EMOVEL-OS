# EMOVEL Prompt Studio v1.5

## Purpose

Prompt Studio v1.5 adds Builder Execution Prep. It creates a local builder workspace for a generated project so GPT-Pilot, Pythagora, or a human builder can start from a clean packet of handoff files.

## What Changed

- Added `Create Builder Workspace` on `/projects/[slug]`.
- Creates `projects/build-workspaces/{project-slug}/`.
- Copies `gpt-pilot-prompt.md`, `build-handoff.md`, and `README_BUILD.md` into the workspace.
- Generates `BUILDER_CONTEXT.md`, `TASKS.md`, and `ACCEPTANCE_CHECKLIST.md`.
- Adds an `Open Builder Workspace` link when the workspace exists.
- Adds a local viewer at `/builder-workspaces/[slug]`.

## Workspace Files

The builder workspace contains:

- `gpt-pilot-prompt.md`
- `build-handoff.md`
- `README_BUILD.md`
- `BUILDER_CONTEXT.md`
- `TASKS.md`
- `ACCEPTANCE_CHECKLIST.md`

## Boundaries

- Prompt Studio does not run GPT-Pilot.
- Prompt Studio does not run Pythagora.
- Prompt Studio does not execute shell commands from the UI.
- Prompt Studio does not call paid APIs.
- Prompt Studio does not use a database.

## Local Flow

1. Generate a project from `/new-project`.
2. Open `/projects`.
3. Select the generated project.
4. Click `Prepare GPT-Pilot Build` if the GPT prompt is not already present.
5. Click `Create Builder Workspace`.
6. Click `Open Builder Workspace`.
7. Copy the builder prompt or tasks into GPT-Pilot, Pythagora, or a manual build workflow.

## Build Verification

Run from `apps/emovel-prompt-studio/`:

```bash
npm run build
```
