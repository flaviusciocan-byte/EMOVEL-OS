# EMOVEL Production Pipeline v1

EMOVEL Production Pipeline v1 turns a raw product idea into a verified launch asset.

It is based on Pipeline Test 001, which produced the first runnable premium landing page for EMOVEL Launch Stack v1.

## Pipeline Shape

```
Raw idea
  -> offer
  -> copy
  -> UX audit
  -> component plan
  -> motion plan
  -> Next.js app
  -> build test
  -> smoke test
  -> launch report
```

## Primary Output

A product folder containing:

- `landing-app/` runnable Next.js app
- `landing-app/UX_AUDIT.md`
- `landing-app/COMPONENT_PLAN.md`
- `landing-app/MOTION_PLAN.md`
- launch report in `docs/`

## Source Of Truth

Use this pipeline with a completed input file based on:

`project-templates/production-pipeline-input.md`

## Reference Run

Reference implementation:

`products/emovel-launch-stack-v1/landing-app/`

Reference report:

`docs/PIPELINE_TEST_001_REPORT.md`

## Rules

- Do not fake tool usage.
- Do not copy full external tool repositories into EMOVEL-OS.
- Use real detected paths from `config/tools.json`.
- If MCP, GSAP, Reflex, n8n source, or another integration is unavailable, document the fallback.
- The final app must install, build, and run locally before the pipeline is considered passed.

