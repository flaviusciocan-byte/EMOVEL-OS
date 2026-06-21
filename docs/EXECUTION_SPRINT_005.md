# EMOVEL Execution Sprint 005

## Purpose

Execution Sprint 005 adds a central Execution Inbox for all project tasks that have a local `ACTION_QUEUE.md`.

## What Changed

- Added `/execution`.
- Added navigation link: `Execution`.
- Added cross-project task aggregation from:

```text
projects/generated/{project-slug}/ACTION_QUEUE.md
```

- Added filters for:
  - status: Pending, In Progress, Blocked, Done
  - group: Strategy, Content, UX, Build, Publish, QA
- Added task cards showing:
  - project name
  - task name
  - owner/tool
  - status
  - input file
  - output file
  - manual or automated mode
- Added inline status updates.
- Added related executor prompt viewer and copy action when executor prompts exist.

## Local-Only Boundary

The Execution Inbox reads and writes local markdown files only. It does not execute shell commands, call APIs, run GPT-Pilot, publish products, or connect to external services.

## Workflow

```text
Project execution-plan.md
-> ACTION_QUEUE.md
-> executor-prompts/{task-slug}.md
-> /execution inbox
-> manual status updates
```

Use `/execution` as the operator view for deciding what task should move next across all active EMOVEL projects.
