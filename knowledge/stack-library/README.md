# Stack Library

A curated registry of tools used in EMOVEL-OS projects. Before selecting a tool, check here first. If it's not listed, evaluate it and add it.

---

## Automation & Workflow

### n8n
- **What:** Open-source workflow automation. Self-hostable.
- **Use when:** You need to connect APIs, trigger actions, or run background jobs without writing full backend code.
- **Hosted at:** `localhost:5678` (local) or Railway / Render (cloud)
- **Docs:** https://docs.n8n.io

### Dify
- **What:** LLM application development platform. Build AI apps with a visual editor.
- **Use when:** You need to build a custom AI workflow or RAG pipeline without coding the LLM layer from scratch.
- **Docs:** https://docs.dify.ai

### Langflow
- **What:** Visual editor for building LangChain-based AI flows.
- **Use when:** You need a drag-and-drop way to prototype multi-step AI pipelines.
- **Docs:** https://docs.langflow.org

### Flowise
- **What:** Low-code LLM app builder built on LangChain.
- **Use when:** Faster to prototype than Langflow; good for RAG chatbots and agent chains.
- **Docs:** https://docs.flowiseai.com

---

## AI Agents & Browsers

### Browser Use
- **What:** AI agent that can control a browser autonomously.
- **Use when:** You need to automate web interactions that have no API.
- **Docs:** https://github.com/browser-use/browser-use

### Firecrawl
- **What:** Web scraping and crawling API for feeding data to AI.
- **Use when:** You need to scrape websites at scale or convert pages to clean markdown for LLM input.
- **Docs:** https://docs.firecrawl.dev

---

## AI Interfaces

### Open WebUI
- **What:** Self-hosted ChatGPT-like UI for local and cloud LLMs.
- **Use when:** You want a clean UI for Ollama or OpenAI-compatible models without building one.
- **Docs:** https://docs.openwebui.com

### LobeChat
- **What:** Modern, extensible open-source AI chat client with plugin support.
- **Use when:** You need a polished multi-model chat interface with tool/plugin integration.
- **Docs:** https://lobehub.com/docs

---

## Database & Backend

### Supabase
- **What:** Open-source Firebase alternative. Postgres + Auth + Storage + Realtime + Edge Functions.
- **Use when:** Default choice for any project that needs a database, auth, and file storage.
- **Docs:** https://supabase.com/docs

---

## Auth

### Hanko
- **What:** Passkey-first authentication. Drop-in web components.
- **Use when:** You want passwordless auth with minimal setup.
- **Docs:** https://docs.hanko.io

### Logto
- **What:** Open-source OIDC auth platform. More full-featured than Hanko.
- **Use when:** You need full identity management: SSO, RBAC, multi-tenant, OIDC.
- **Docs:** https://docs.logto.io

---

## Analytics

### OpenPanel
- **What:** Open-source, privacy-friendly analytics. Mixpanel-like event tracking.
- **Use when:** You need user behavior analytics without sending data to third parties.
- **Docs:** https://openpanel.dev/docs

---

## Content Distribution

### Postiz
- **What:** Open-source social media scheduling across multiple platforms.
- **Use when:** You need to schedule and publish posts to X, LinkedIn, Threads, Instagram simultaneously.
- **Docs:** https://postiz.com/docs

### Dub
- **What:** Open-source link management with analytics.
- **Use when:** You need branded short links and click tracking for campaigns or launches.
- **Docs:** https://dub.co/docs

### Novu
- **What:** Open-source notification infrastructure. Email, push, SMS, in-app.
- **Use when:** You need to send transactional or marketing notifications across channels.
- **Docs:** https://docs.novu.co

---

## Project Management

### Baserow
- **What:** Open-source no-code database / Airtable alternative.
- **Use when:** You need a visual table interface for non-technical collaborators or lightweight data management.
- **Docs:** https://baserow.io/docs

### Plane
- **What:** Open-source project management. Jira/Linear alternative.
- **Use when:** You want to track issues, sprints, and cycles without paying for Linear or Jira.
- **Docs:** https://docs.plane.so

---

## Diagramming

### Excalidraw
- **What:** Open-source virtual whiteboard with a hand-drawn aesthetic.
- **Use when:** You need to sketch architecture diagrams, user flows, or wireframes quickly.
- **Docs:** https://excalidraw.com

### Mermaid
- **What:** Diagram-as-code. Renders charts from markdown-style text.
- **Use when:** You want diagrams that live in markdown files and stay in version control.
- **Docs:** https://mermaid.js.org/intro/

---

## Screen Recording

### Cap
- **What:** Open-source screen recording and sharing. Loom alternative.
- **Use when:** You need to record a demo or walkthrough and share a link.
- **Docs:** https://cap.so

---

## Code Editors

### Zed
- **What:** High-performance, GPU-accelerated code editor with collaborative editing.
- **Use when:** You want a fast editor with native AI features and real-time collaboration.
- **Docs:** https://zed.dev/docs

---

## Adding Tools

To add a new tool to this library:

1. Add it under the relevant category
2. Fill in: What, Use when, Docs
3. Commit with message: `knowledge: add <tool-name> to stack-library`
