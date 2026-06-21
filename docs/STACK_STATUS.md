# EMOVEL-OS Stack Status

**Last updated:** 2026-06-21

---

## Summary

| Metric | Value |
|---|---|
| Total tools catalogued | 30 |
| Tier A (Core) | 20 |
| Tier B (Useful) | 7 |
| Tier C (Experimental) | 3 |
| Fully documented (tool file) | 9 |
| Categories covered | 7 |

---

## Decision

Tools for planning, validating, and tracking work before and during builds.

| Tool | Tier | Score | Status | Notes |
|---|---|---|---|---|
| Excalidraw | A | 9/10 | Active | Default whiteboard for architecture diagrams |
| Mermaid | A | 8/10 | Active | Diagrams inside markdown — stays in git |
| Plane | A | 8/10 | Active | Issue tracking and sprint management |
| Baserow | A | 7/10 | Active | No-code database for non-technical collaborators |
| Puter | B | 7/10 | Evaluating | Browser OS — potential unified dashboard layer |

**Stack verdict:** Excalidraw + Mermaid for diagramming. Plane for task tracking. Baserow for data that non-devs touch.

---

## Build

Tools for generating, writing, and automating application code.

| Tool | Tier | Score | Status | Notes |
|---|---|---|---|---|
| n8n | A | 10/10 | Active | Primary automation layer — wire everything here |
| Dify | A | 9/10 | Active | LLM app builder for AI-first product features |
| Langflow | A | 8/10 | Active | Visual LangChain flow editor for prototyping |
| Flowise | A | 8/10 | Active | Low-code LLM builder, faster to prototype than Langflow |
| Zed | A | 8/10 | Active | Fast editor with native AI and collab features |
| Browser Use | B | 8/10 | Active | Automates web tasks that have no API |
| Firecrawl | B | 8/10 | Active | Feeds scraped web data into AI pipelines |
| Nano Banana | C | 5/10 | Evaluating | Lightweight inference for constrained environments |

**Stack verdict:** n8n as the automation backbone. Dify for AI features. Langflow/Flowise for pipeline prototyping. Zed as primary editor. Browser Use + Firecrawl for data sourcing.

---

## Design

Tools for creating UI designs, wireframes, and production-ready visual assets.

| Tool | Tier | Score | Status | Notes |
|---|---|---|---|---|
| Penpot | A | 9/10 | Active | Primary design tool — Figma alternative, fully OSS |
| Excalidraw | A | 9/10 | Active | Fast wireframes and architecture sketches |
| Mermaid | A | 8/10 | Active | Flow diagrams that live in repos |

**Stack verdict:** Penpot for all UI/visual design. Excalidraw for quick ideation. Mermaid for anything that needs to live in a `.md` file.

---

## Content

Tools for recording, editing, and producing build-in-public and launch content.

| Tool | Tier | Score | Status | Notes |
|---|---|---|---|---|
| Cap | A | 8/10 | Active | Primary async recording tool with shareable links |
| OpenCut | B | 7/10 | Evaluating | OSS video editor for post-production |
| Screenity | B | 6/10 | Active | Zero-friction annotated browser recordings |
| Higgsfield | C | 7/10 | Evaluating | AI cinematic video for launch and marketing |

**Content pipeline:**
```
Record (Cap / Screenity)
  → Edit (OpenCut)
    → AI Video (Higgsfield — for launch hooks)
      → Distribute (Postiz + Dub)
```

**Stack verdict:** Cap as the daily recording tool. Screenity for quick annotated clips. OpenCut for editing before publishing. Higgsfield only when production quality matters for a launch.

---

## Distribution

Tools for publishing, scheduling, and tracking content and links.

| Tool | Tier | Score | Status | Notes |
|---|---|---|---|---|
| Postiz | A | 9/10 | Active | Multi-platform social scheduling — X, LinkedIn, Threads |
| Dub | A | 8/10 | Active | Branded short links with click analytics |
| Novu | A | 8/10 | Active | Email, push, and in-app notification delivery |

**Distribution pipeline:**
```
Content Engine
  → Postiz (social posts)
  → Dub (trackable links)
  → Novu (waitlist / buyer emails)
```

**Stack verdict:** All three are active and complementary. Wire all distribution through n8n to avoid manual triggering.

---

## Knowledge

Tools for storing, sharing, and querying information across projects.

| Tool | Tier | Score | Status | Notes |
|---|---|---|---|---|
| Open WebUI | A | 10/10 | Active | Primary AI interface — replaces ChatGPT for most tasks |
| CryptPad | A | 8/10 | Active | Encrypted docs for sensitive briefs and strategy |
| LobeChat | B | 7/10 | Evaluating | Multi-model AI client with plugin support |

**Stack verdict:** Open WebUI + Ollama for daily AI work at zero API cost. CryptPad for anything that should never leave encrypted storage. LobeChat as an alternative if Open WebUI doesn't fit a workflow.

---

## Infrastructure

Tools for hosting, authentication, storage, and observability.

| Tool | Tier | Score | Status | Notes |
|---|---|---|---|---|
| Supabase | A | 10/10 | Active | Default database for all new products |
| Hanko | A | 8/10 | Active | Passkey-first auth — drop-in for any product |
| Logto | A | 8/10 | Active | Full identity management for multi-tenant products |
| OpenPanel | A | 8/10 | Active | Privacy-first analytics — no third-party data sharing |
| Puter | B | 7/10 | Evaluating | Cloud desktop OS — potential unified interface layer |

**Stack verdict:** Supabase as the default backend. Hanko for simple auth, Logto for complex (SSO, RBAC). OpenPanel for analytics on every product. Puter under evaluation as the EMOVEL command center.

---

## Tier C — Under Evaluation

These tools are tracked but not yet recommended for production use in EMOVEL-OS projects.

| Tool | Category | Score | Why Tier C | Review Condition |
|---|---|---|---|---|
| Nano Banana | Build | 5/10 | Early stage, limited documentation | Promote to B when stable + integration pattern proven |
| Higgsfield | Content | 7/10 | SaaS only, credit-based, cost risk | Promote to B when Content Engine ROI is measured |

---

## Roadmap Additions

Tools to evaluate for future addition:

| Tool | Category | Reason to Watch |
|---|---|---|
| Windmill | Build | Self-hostable script runner + workflow engine — n8n alternative |
| Activepieces | Build | Open-source automation, strong Zapier replacement |
| Docmost | Knowledge | Open-source Notion alternative — simpler than CryptPad |
| Plausible | Infrastructure | Lightweight analytics alternative to OpenPanel |
| Formbricks | Infrastructure | Open-source survey and feedback platform |
