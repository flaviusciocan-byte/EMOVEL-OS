# EMOVEL Execution Sprint 004

## Purpose

Execution Sprint 004 adds Executor Prompts for every Action Queue task. Each prompt is a standalone markdown brief that can be copied into a human operator, local builder, external registered tool, or future automation layer.

## What Changed

- Added executor prompt generation from `ACTION_QUEUE.md`.
- Added one prompt file per task under:

```text
projects/generated/{project-slug}/executor-prompts/{task-slug}.md
```

- Added `/projects/[slug]` UI for:
  - Generate Executor Prompts
  - View executor prompts
  - Copy executor prompt

## Prompt Structure

Each executor prompt includes:

- project context
- task objective
- input files
- expected output files
- selected tool/owner
- execution mode
- constraints
- acceptance criteria

## Local-Only Boundary

Prompt Studio does not call APIs, execute shell commands, run builders, or publish from executor prompts. The generated files are local orchestration assets only.

## Usage Flow

```text
execution-plan.md
-> ACTION_QUEUE.md
-> executor-prompts/{task-slug}.md
-> manual execution or future approved automation
```

Open a generated project, create the Action Queue, then click **Generate Executor Prompts**. Copy an executor prompt when a task is ready to be performed.
