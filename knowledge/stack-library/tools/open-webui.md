# Open WebUI

| Field | Value |
|---|---|
| **Tier** | A |
| **Category** | Knowledge |
| **Priority** | Critical |
| **EMOVEL Score** | 10 / 10 |

## Purpose
Self-hosted, polished web interface for interacting with local and cloud LLMs. Drop-in replacement for ChatGPT UI — works with Ollama, OpenAI-compatible endpoints, and custom models.

## Use Cases
- Daily AI interface for Cowork and Council sessions without leaving the browser
- Run local models (Llama, Mistral, Phi) without API costs
- Create custom model presets per role (builder, reviewer, content writer)
- RAG document upload — feed project briefs directly into context
- Share AI access across the team without exposing API keys

## Installation Path
```bash
# Docker (recommended)
docker run -d -p 3000:8080 \
  -v open-webui:/app/backend/data \
  --name open-webui \
  ghcr.io/open-webui/open-webui:main
```
Access at `http://localhost:3000`

## Dependencies
- Docker
- Ollama (for local models) — `ollama serve` running on host
- Or any OpenAI-compatible API endpoint

## Recommended Integrations
- **Ollama** — local model backend (zero API cost)
- **n8n** — trigger AI tasks via Open WebUI API
- **Supabase** — store conversation history or RAG document index
- **Claude Code** — use alongside for file-level coding tasks
- **knowledge/skills/** — import EMOVEL skill prompts as system presets

## Notes
Best entry point for daily AI work. Set it up once, use it everywhere. Ollama + Open WebUI replaces ChatGPT for most non-API tasks at zero ongoing cost.
