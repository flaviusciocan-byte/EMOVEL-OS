# Claude Cowork

Claude Cowork is the **project coordination layer** of EMOVEL-OS.

It holds context across sessions, decomposes product briefs into actionable tasks, tracks progress, and routes work to the right builder or tool. Think of it as the project manager that never forgets.

---

## What Cowork Does

- Reads a product brief and breaks it into milestones and tasks
- Maintains context between sessions so work resumes without re-explaining
- Decides whether a task goes to GPT-Pilot, Claude Code, or Reflex
- Flags blockers and suggests next actions
- Logs decisions so Council can review them

---

## Session Template

When starting a new Cowork session, provide:

1. **Product Brief** — paste or link `project-templates/product-brief.md`
2. **Current Status** — what has been built so far
3. **This Session Goal** — what you want to accomplish in this session
4. **Open Questions** — anything unresolved that needs a decision

---

## Workflow

```
Brief → Milestone Breakdown → Task List → Route to Builder → Review Output → Next Session
```

---

## Routing Logic

| Task Type | Route To |
|---|---|
| Full app generation from spec | GPT-Pilot / Pythagora |
| Specific file edits or bug fixes | Claude Code |
| Python-native reactive UI | Reflex |
| API integrations / triggers | n8n |
| Architecture validation | Claude Council |
| Stack selection | Stack Library → Claude Council |

---

## Files in This Directory

Session templates and context files for individual projects will be stored here.
Each project gets its own subfolder: `cowork/<project-name>/`.
