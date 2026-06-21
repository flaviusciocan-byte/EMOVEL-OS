# EMOVEL-OS Architecture

## System Flow

```
Prompt / Idea
    │
    ▼
Claude Cowork
  ├─ Decomposes the project into tasks
  ├─ Holds context across sessions
  └─ Routes to the right tool
    │
    ▼
Claude Council
  ├─ Validates architecture decisions
  ├─ Reviews stack choices
  └─ Gates go/no-go before building
    │
    ▼
Stack Library  (knowledge/stack-library/)
  ├─ Picks the right tools for the job
  └─ Loads reusable skills and MCP connectors
    │
    ▼
Builders
  ├─ GPT-Pilot / Pythagora  → Autonomous full-stack generation
  ├─ Claude Code             → File-level edits, debugging, completions
  └─ Reflex                  → Python-native reactive UI
    │
    ▼
n8n Automation  (automation/n8n/)
  ├─ API integrations
  ├─ Triggered workflows
  └─ Background jobs
    │
    ▼
Content Engine  (content-engine/)
  ├─ Build updates → Short-form posts
  ├─ Milestones → Threads / videos
  └─ Launches → Email sequences
    │
    ▼
Distribution
  ├─ Postiz → Multi-platform social scheduling
  ├─ Dub    → Short links + analytics
  └─ Novu   → Notification delivery
    │
    ▼
Waitlist / Buyers
```

---

## Layer Responsibilities

### 1. Claude Cowork
The active project manager. Receives the product brief, breaks it into milestones and tasks, maintains context, and routes work to the correct builder or automation tool.

### 2. Claude Council
The validation layer. Before any major architectural or product decision is executed, Council reviews it against criteria: feasibility, tech debt risk, monetization logic, scope creep.

### 3. Stack Library
A curated registry of tools, their strengths, and when to use them. Prevents re-evaluating the same decisions project after project.

### 4. Builders
- **GPT-Pilot / Pythagora** — Best for generating full-stack apps from a spec. Autonomous, produces complete codebases.
- **Claude Code** — Best for targeted changes, debugging, file edits, and coding alongside existing projects.
- **Reflex** — Best when the frontend needs to be Python-native, reactive, and tightly coupled to backend logic.

### 5. n8n Automation
Connects every tool via APIs and triggers. Handles background work that should not require human intervention: posting updates, syncing data, sending notifications, triggering builds.

### 6. Content Engine
Converts build activity into distribution fuel. Every shipped feature, every milestone, every learning becomes a post, thread, or update. Systematic, not ad-hoc.

### 7. Distribution Layer
Postiz schedules posts across platforms. Dub tracks link performance. Novu sends email/push notifications to waitlist and buyers.

---

## Design Principles

- **One layer, one job.** No tool does two layers' work.
- **Prompt-first.** Every build starts with a written brief, not a vague idea.
- **Context is the moat.** Cowork and Council accumulate knowledge so we don't start from zero each project.
- **Build in public by default.** Content Engine runs in parallel with building, not after.
