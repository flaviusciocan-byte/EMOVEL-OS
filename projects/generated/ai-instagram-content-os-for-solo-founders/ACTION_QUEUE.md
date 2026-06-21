# Action Queue: Ai Instagram Content Os For Solo Founders

Generated locally by EMOVEL Prompt Studio v1.9 execution layer on 2026-06-21T17:29:47.109Z.

Source execution plan: projects/generated/ai-instagram-content-os-for-solo-founders/execution-plan.md

## Execution Plan Snapshot

## Command
Create a premium landing page and Gumroad-ready product package for: AI Instagram Content OS for solo founders
## Router Result
- Intent: prepare-shop
- Confidence: high
- Pipeline: pipelines/production-pipeline-v1

## Strategy

### strategy-offer-priority
- Task name: Confirm offer and execution priority
- Owner/tool: EMOVEL command_router + emovel.offer_architect
- Status: Pending
- Input file: projects/generated/ai-instagram-content-os-for-solo-founders/execution-plan.md
- Output file: projects/generated/ai-instagram-content-os-for-solo-founders/offer.md
- Mode: manual

Prompt:
Review the execution plan and confirm the strongest offer angle, target user, builder target, publishing targets, and the first monetizable outcome.

## Content

### content-launch-copy
- Task name: Produce launch-ready copy set
- Owner/tool: emovel.copy_framework
- Status: Pending
- Input file: projects/generated/ai-instagram-content-os-for-solo-founders/execution-plan.md
- Output file: projects/generated/ai-instagram-content-os-for-solo-founders/copy.md
- Mode: manual

Prompt:
Use the execution plan and offer to refine headline, subhead, section copy, CTA language, objections, FAQ, and launch messaging without generic filler.

## UX

### ux-conversion-audit
- Task name: Audit page flow and conversion clarity
- Owner/tool: EMOVEL premium_ui_director + emovel.page_builder
- Status: Pending
- Input file: projects/generated/ai-instagram-content-os-for-solo-founders/copy.md
- Output file: projects/generated/ai-instagram-content-os-for-solo-founders/ux-audit.md
- Mode: manual

Prompt:
Evaluate the generated copy and execution plan as a production landing experience. Identify hierarchy, CTA, trust, mobile, and friction fixes before build.

### ux-component-plan
- Task name: Map interface components and motion moments
- Owner/tool: 21st.dev components + GSAP motion skills fallback
- Status: Pending
- Input file: projects/generated/ai-instagram-content-os-for-solo-founders/ux-audit.md
- Output file: projects/generated/ai-instagram-content-os-for-solo-founders/component-plan.md
- Mode: manual

Prompt:
Translate the UX audit into concrete sections, components, states, responsive behavior, and restrained motion moments that can be implemented in Next.js.

## Build

### build-handoff
- Task name: Create builder handoff packet
- Owner/tool: Prompt Studio local builder handoff
- Status: Pending
- Input file: projects/generated/ai-instagram-content-os-for-solo-founders/component-plan.md
- Output file: projects/generated/ai-instagram-content-os-for-solo-founders/build-handoff.md
- Mode: automated

Prompt:
Create or refresh the build handoff from the generated offer, copy, UX audit, component plan, motion plan, visual brief, build plan, and launch plan.

### build-workspace
- Task name: Prepare builder workspace
- Owner/tool: GPT-Pilot / Pythagora / Next.js handoff
- Status: Pending
- Input file: projects/generated/ai-instagram-content-os-for-solo-founders/build-handoff.md
- Output file: projects/build-workspaces/ai-instagram-content-os-for-solo-founders/BUILDER_CONTEXT.md
- Mode: automated

Prompt:
Prepare the external builder workspace with gpt-pilot-prompt.md, README_BUILD.md, BUILDER_CONTEXT.md, TASKS.md, and ACCEPTANCE_CHECKLIST.md. Do not run shell commands from the UI.

## Publish

### publish-package
- Task name: Prepare publish package
- Owner/tool: Prompt Studio publish prep
- Status: Pending
- Input file: projects/generated/ai-instagram-content-os-for-solo-founders/launch-plan.md
- Output file: projects/build-workspaces/ai-instagram-content-os-for-solo-founders/publish-package/PUBLISH_CHECKLIST.md
- Mode: automated

Prompt:
Generate Gumroad listing copy, social launch posts, email launch copy, asset list, publish checklist, and final QA from the project source files.

## QA

### qa-launch-readiness
- Task name: Complete launch readiness review
- Owner/tool: Human operator + EMOVEL QA checklist
- Status: Pending
- Input file: projects/build-workspaces/ai-instagram-content-os-for-solo-founders/publish-package/FINAL_QA.md
- Output file: projects/build-workspaces/ai-instagram-content-os-for-solo-founders/SHOP_STATUS.md
- Mode: manual

Prompt:
Review the publish package, build status, shop status, Gumroad draft readiness, asset checklist, and final QA before marking the product ready for Gumroad.

