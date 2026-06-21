# Agent Blueprint

## Purpose
Design, document, and specify AI agent systems for EMOVEL workflows — defining agent roles, tool access, orchestration logic, trigger conditions, and handoff protocols to automate production, marketing, and operations tasks.

## Inputs
- Business workflow or process to automate
- Available tools and integrations (APIs, MCP servers, databases, SaaS platforms)
- Human-in-the-loop requirements (what must a human approve)
- Output format required (document, API response, webhook, notification)
- Performance constraints: latency tolerance, cost per run, volume
- Error handling requirements
- Model preference: speed (Haiku), balanced (Sonnet), power (Opus)

## Outputs
- Agent system diagram (roles, tools, data flow)
- Per-agent specification:
  - Agent name and role description
  - Input schema
  - Output schema
  - Tools and APIs accessed
  - Decision logic
  - Error handling behavior
- Orchestration protocol (sequential, parallel, supervisor-worker)
- Handoff conditions between agents
- Human approval checkpoints
- Prompt templates per agent
- MCP server requirements
- Estimated token cost per run
- Deployment recommendation (Claude API, local, scheduled cron)

## Rules
- Every agent must have a single, clearly scoped responsibility
- No agent should make irreversible actions (publish, send, delete) without a human approval checkpoint
- Agent names must follow the format: `[domain].[action]` (e.g., `content.writer`, `seo.optimizer`)
- All agent inputs and outputs must be typed (string, JSON, file path, URL)
- Multi-agent systems must define a supervisor agent responsible for task routing
- Error handling must specify: retry logic, fallback behavior, and alert mechanism
- Prompt templates must include role, context, input format, and output format instructions
- Cost estimates must be calculated per-run, not just per-token

## Workflow
1. Define the workflow or process to automate
2. Break workflow into discrete agent-sized tasks
3. Design agent roles and assign tools
4. Select orchestration pattern (sequential pipeline, parallel fan-out, supervisor-worker)
5. Define data schemas (input → output) per agent
6. Map human approval checkpoints
7. Write prompt templates per agent
8. Identify MCP server dependencies
9. Estimate token cost per run
10. Choose deployment model (API call, scheduled, event-triggered)
11. Deliver complete agent blueprint document

## Examples
- Content production agent: brief → research → draft → edit → publish
- Lead generation agent: scrape → qualify → enrich → CRM entry → email trigger
- Product launch agent: brief → copy → page → email sequence → social posts
- Customer support agent: ticket classification → response draft → human review → send

## Dependencies
- Depends on the specific workflow being automated — pulls from all other EMOVEL skills as needed

## Related Skills
- `emovel.funnel_builder`
- `emovel.copy_framework`
- `emovel.page_builder`
- `emovel.offer_architect`
