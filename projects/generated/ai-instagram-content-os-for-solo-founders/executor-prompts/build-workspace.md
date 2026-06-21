# Executor Prompt: Prepare builder workspace

Generated locally by EMOVEL Prompt Studio v1.10 execution layer on 2026-06-21T16:54:33.972Z.

## Project Context

- Project: Ai Instagram Content Os For Solo Founders
- Slug: ai-instagram-content-os-for-solo-founders
- Source folder: projects/generated/ai-instagram-content-os-for-solo-founders/
- Action queue: projects/generated/ai-instagram-content-os-for-solo-founders/ACTION_QUEUE.md

Execution plan context:

## Command
Create a premium landing page and Gumroad-ready product package for: AI Instagram Content OS for solo founders
## Router Result
- Intent: prepare-shop
- Confidence: high
- Pipeline: pipelines/production-pipeline-v1
## Selected Skills
- emovel.audience_builder
- emovel.offer_architect
- emovel.pricing_engine

Queue context:

- Task name: Create builder handoff packet
- Owner/tool: Prompt Studio local builder handoff
- Status: Pending
- Input file: projects/generated/ai-instagram-content-os-for-solo-founders/component-plan.md
- Output file: projects/generated/ai-instagram-content-os-for-solo-founders/build-handoff.md
- Mode: automated
Prompt:
Create or refresh the build handoff from the generated offer, copy, UX audit, component plan, motion plan, visual brief, build plan, and launch plan.

## Task Objective

Prepare the external builder workspace with gpt-pilot-prompt.md, README_BUILD.md, BUILDER_CONTEXT.md, TASKS.md, and ACCEPTANCE_CHECKLIST.md. Do not run shell commands from the UI.

## Input Files

- projects/generated/ai-instagram-content-os-for-solo-founders/build-handoff.md
- projects/generated/ai-instagram-content-os-for-solo-founders/execution-plan.md
- projects/generated/ai-instagram-content-os-for-solo-founders/ACTION_QUEUE.md

## Expected Output Files

- projects/build-workspaces/ai-instagram-content-os-for-solo-founders/BUILDER_CONTEXT.md

## Selected Tool/Owner

GPT-Pilot / Pythagora / Next.js handoff

## Execution Mode

automated

## Constraints

- Keep the work local to EMOVEL-OS control-center files and registered external tools.
- Do not call paid APIs.
- Do not execute shell commands from Prompt Studio.
- Do not publish, post, or connect commerce automatically.
- Use existing generated project files as source material.
- Preserve the current project slug and output paths.
- If a tool is unavailable, document the fallback instead of pretending it ran.

## Acceptance Criteria

- The task output is specific to Ai Instagram Content Os For Solo Founders.
- The expected output file path is created or clearly updated.
- The output references the selected owner/tool and real input files.
- The result is production-oriented and avoids generic placeholder language.
- Manual work is clearly marked when automation is not available.
- The Action Queue task can be moved to Done only after the output has been reviewed.
