# EMOVEL Prompt Studio v1.7

## Purpose

Prompt Studio v1.7 adds Build Status and Manual Run Log for builder workspaces. It gives each prepared workspace a local status trail without running GPT-Pilot, shell commands, APIs, or database actions.

## What Changed

- Added a `Build Status` section on `/builder-workspaces/[slug]`.
- Added manual status updates.
- Added manual run log entries.
- Creates `projects/build-workspaces/{project-slug}/BUILD_STATUS.md`.
- Creates `projects/build-workspaces/{project-slug}/RUN_LOG.md`.
- Shows status badges on `/projects`, `/projects/[slug]`, and `/builder-workspaces/[slug]` when a status exists.
- Adds `/builder-workspaces` as a local workspace dashboard with status badges.
- Adds `BUILD_STATUS.md` and `RUN_LOG.md` to the builder workspace viewer.

## Status Values

- Draft
- Ready for Builder
- Building
- Build Failed
- Build Passed
- Ready for Review
- Ready to Publish

## Local Files

`BUILD_STATUS.md` stores the latest manually selected status and update timestamp.

`RUN_LOG.md` stores manual notes entered by the operator. It is intended for recording actions performed outside Prompt Studio, such as manually running GPT-Pilot, fixing build errors, or reviewing generated output.

## Safety Boundary

Prompt Studio does not:

- execute shell commands from the UI
- run GPT-Pilot automatically
- call paid APIs
- create a database
- infer build status from external processes

All status and log updates are manual and file-backed.

## Build Verification

Run from `apps/emovel-prompt-studio/`:

```bash
npm run build
```
