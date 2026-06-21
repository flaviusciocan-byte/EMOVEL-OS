# EMOVEL-OS

**EMOVEL-OS** is the central orchestration layer that connects every local tool, builder, and automation system into a single command center for building and shipping products fast.

---

## What This Is

EMOVEL-OS is not an app. It is the **operating system** for how we build apps — the place where strategy, execution, automation, and content distribution are coordinated.

---

## The Stack

| Layer | Tool | Role |
|---|---|---|
| Coordination | **Claude Cowork** | Project manager, task decomposer, context holder |
| Validation | **Claude Council** | Decision validator, architecture reviewer |
| App Building | **GPT-Pilot / Pythagora** | Autonomous full-stack app builder |
| Dev Assistance | **Claude Code** | Code completion, debugging, file editing |
| UI Building | **Reflex** | Python-native reactive frontend |
| Automation | **n8n** | Workflow automation, API glue, triggers |
| Knowledge | **Knowledge Work Plugins** | Reusable skills, prompts, and MCP connectors |
| Distribution | **Content Engine** | Turns build progress into social posts and waitlists |

---

## Directory Map

```
EMOVEL-OS/
├── docs/                    ← Architecture, installation, roadmap
├── council/                 ← Claude Council configs and prompts
├── cowork/                  ← Claude Cowork session templates
├── builders/                ← Pointers to GPT-Pilot, Claude Code, Reflex
├── automation/              ← n8n flows and reusable workflow configs
├── knowledge/               ← Stack library, MCP library, skills
├── content-engine/          ← Prompts, social posts, distribution logic
├── project-templates/       ← Reusable product brief, build plan, launch plan
└── scripts/                 ← Local system checks and setup helpers
```

---

## How to Start a New Project

1. Copy `project-templates/product-brief.md` into a new folder under `~/projects/<product-name>/`
2. Fill in the brief
3. Open Claude Cowork and load the brief as context
4. Run `council/` validation prompts before building
5. Use GPT-Pilot or Claude Code to generate the first scaffold
6. Wire automation via `automation/workflows/`
7. Activate `content-engine/` to convert build updates into social posts

---

## Local Tool Locations

See [docs/INSTALLATION.md](docs/INSTALLATION.md) for local paths to all tools.

---

## Status

`Active` — Architecture phase. Tools linked, templates ready.
