# GPT-Pilot / Pythagora

**Role in EMOVEL-OS:** Autonomous full-stack app builder.

GPT-Pilot takes a product spec and generates a complete, runnable codebase. It is the primary builder for net-new products when the goal is to have a working scaffold as fast as possible.

---

## Local Path

```
C:\Users\flavi\Desktop\gpt-pilot-main
```

---

## When to Use GPT-Pilot

- Starting a new product from a product brief
- You need a full scaffold (frontend + backend + database) generated, not just individual files
- The spec is clear enough to hand to an autonomous agent

---

## When NOT to Use GPT-Pilot

- Making targeted changes to an existing codebase → use Claude Code instead
- The spec is still vague → fill the product brief first, run Council validation
- The UI is Python-native and reactive → consider Reflex

---

## Handoff Protocol

After GPT-Pilot generates a scaffold:
1. Review the output with Claude Code
2. Log decisions made during generation in `project-templates/build-plan.md`
3. Route any follow-up tasks to Claude Code or Reflex as needed
