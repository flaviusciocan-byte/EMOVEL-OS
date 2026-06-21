# EMOVEL Execution Sprint 003

## Purpose

Execution Sprint 003 adds a local Action Queue to Prompt Studio so an existing `execution-plan.md` can become a trackable set of production tasks.

## What Changed

- Added `ACTION_QUEUE.md` as a generated project file.
- Added local action queue generation from `projects/generated/{project-slug}/execution-plan.md`.
- Added grouped tasks for Strategy, Content, UX, Build, Publish, and QA.
- Added manual task status updates with these statuses:
  - Pending
  - In Progress
  - Blocked
  - Done
- Added task prompt copying on `/projects/[slug]`.

## File Flow

```text
projects/generated/{project-slug}/execution-plan.md
-> projects/generated/{project-slug}/ACTION_QUEUE.md
```

Each task records:

- task name
- owner/tool
- status
- input file
- output file
- manual or automated mode
- copyable task prompt

## Local-Only Boundary

Prompt Studio does not execute shell commands, run builders, publish products, or call paid APIs from the Action Queue. The queue is an orchestration layer only. Status updates rewrite the local markdown file so the project remains inspectable and commit-ready.

## UI Entry Point

Open:

```text
apps/emovel-prompt-studio /projects/{project-slug}
```

When `execution-plan.md` exists, use **View Action Queue** to create or refresh `ACTION_QUEUE.md`, then update task statuses manually from the project page.
