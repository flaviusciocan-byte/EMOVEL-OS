# EMOVEL-OS Stack Library

Curated registry of tools used across EMOVEL-OS projects. Before selecting a tool, check here first.

Each tool has a detailed file in [tools/](tools/) with full installation, dependencies, and integration notes.

---

## Tier System

| Tier | Meaning | Usage |
|---|---|---|
| **A** | Core stack — proven, integrated, default choice | Use by default for new projects |
| **B** | Useful additions — good fit but narrower scope | Add when the specific use case arises |
| **C** | Experimental — under evaluation, emerging tools | Pilot and assess before committing |

---

## EMOVEL Score

Rated 1–10 across: open source, self-hostable, actively maintained, integrates with EMOVEL stack, clear build/ship use case.

---

## Full Tool Registry

### Decision

| Tool | Tier | Score | Purpose | File |
|---|---|---|---|---|
| Plane | A | 8/10 | Open-source project management (Linear alt) | — |
| Baserow | A | 7/10 | No-code database / Airtable alternative | — |
| Excalidraw | A | 9/10 | Whiteboard diagramming, hand-drawn aesthetic | — |
| Mermaid | A | 8/10 | Diagram-as-code for markdown files | — |
| Puter | B | 7/10 | Internet OS — unified browser desktop | [puter.md](tools/puter.md) |

### Build

| Tool | Tier | Score | Purpose | File |
|---|---|---|---|---|
| n8n | A | 10/10 | Workflow automation — API glue and triggers | — |
| Dify | A | 9/10 | LLM app platform with visual editor | — |
| Langflow | A | 8/10 | LangChain visual flow builder | — |
| Flowise | A | 8/10 | Low-code LLM app builder | — |
| Zed | A | 8/10 | High-performance GPU-accelerated code editor | — |
| Browser Use | B | 8/10 | AI-controlled browser automation | — |
| Firecrawl | B | 8/10 | Web scraping API for LLM input | — |
| Nano Banana | C | 5/10 | Lightweight AI inference for edge/minimal setups | [nano-banana.md](tools/nano-banana.md) |

### Design

| Tool | Tier | Score | Purpose | File |
|---|---|---|---|---|
| Penpot | A | 9/10 | Open-source Figma alternative, SVG-native | [penpot.md](tools/penpot.md) |
| Excalidraw | A | 9/10 | Quick architecture and flow diagrams | — |
| Mermaid | A | 8/10 | Diagrams that live in version control | — |

### Content

| Tool | Tier | Score | Purpose | File |
|---|---|---|---|---|
| Cap | A | 8/10 | Screen recording with shareable links (Loom alt) | [cap.md](tools/cap.md) |
| Screenity | B | 6/10 | Browser extension for annotated screen capture | [screenity.md](tools/screenity.md) |
| OpenCut | B | 7/10 | Open-source video editor for short-form content | [opencut.md](tools/opencut.md) |
| Higgsfield | C | 7/10 | AI cinematic video generation | [higgsfield.md](tools/higgsfield.md) |

### Distribution

| Tool | Tier | Score | Purpose | File |
|---|---|---|---|---|
| Postiz | A | 9/10 | Multi-platform social media scheduling | — |
| Dub | A | 8/10 | Open-source link management + analytics | — |
| Novu | A | 8/10 | Notification infrastructure (email, push, SMS) | — |

### Knowledge

| Tool | Tier | Score | Purpose | File |
|---|---|---|---|---|
| Open WebUI | A | 10/10 | Self-hosted AI chat interface for any LLM | [open-webui.md](tools/open-webui.md) |
| CryptPad | A | 8/10 | E2E encrypted collaborative office suite | [cryptpad.md](tools/cryptpad.md) |
| LobeChat | B | 7/10 | Multi-model AI chat with plugin support | — |

### Infrastructure

| Tool | Tier | Score | Purpose | File |
|---|---|---|---|---|
| Supabase | A | 10/10 | Postgres + Auth + Storage + Realtime | — |
| Hanko | A | 8/10 | Passkey-first drop-in authentication | — |
| Logto | A | 8/10 | Full OIDC identity platform (SSO, RBAC) | — |
| OpenPanel | A | 8/10 | Privacy-first open-source analytics | — |
| Puter | B | 7/10 | Internet OS — cloud desktop + file system | [puter.md](tools/puter.md) |

---

## Adding a Tool

1. Create a file in `tools/<tool-name>.md` using the standard template
2. Add a row to the relevant table above
3. Commit: `knowledge: add <tool-name> to stack-library`
4. Run the stack status generator if available

## Tool File Template

```markdown
# Tool Name

| Field | Value |
|---|---|
| **Tier** | A / B / C |
| **Category** | Knowledge / Build / Design / Content / Distribution / Infrastructure / Decision |
| **Priority** | Critical / High / Medium / Low |
| **EMOVEL Score** | X / 10 |

## Purpose
## Use Cases
## Installation Path
## Dependencies
## Recommended Integrations
## Notes
```
