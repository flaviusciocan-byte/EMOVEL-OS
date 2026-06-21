# Nano Banana

| Field | Value |
|---|---|
| **Tier** | C |
| **Category** | Build |
| **Priority** | Low |
| **EMOVEL Score** | 5 / 10 |

## Purpose
Lightweight, minimal AI inference and pipeline tool designed for running small language and vision models with low resource overhead. Targets edge deployment and constrained environments where larger frameworks (Langflow, Dify) are too heavy. Built for developers who need fast, scrappy AI integration without orchestration overhead.

## Use Cases
- Run small AI models locally on low-spec hardware without Docker overhead
- Prototype rapid AI micro-pipelines before graduating to Langflow or Dify
- Embed lightweight inference into existing scripts and automations
- Test model outputs locally before committing to cloud API costs
- Edge use cases: tools that need to run offline or in low-bandwidth environments

## Installation Path
```bash
# Install via pip (Python package)
pip install nano-banana

# Or from source
git clone https://github.com/nano-banana/nano-banana
cd nano-banana
pip install -e .
```

## Dependencies
- Python 3.10+
- Optional: CUDA-capable GPU for faster inference
- Optional: Ollama for local model management
- Minimal RAM footprint — designed for sub-4GB environments

## Recommended Integrations
- **Ollama** — use as the model backend for local inference
- **n8n** — call Nano Banana inference endpoints as HTTP nodes
- **GPT-Pilot** — use for lightweight AI steps within generated apps
- **Langflow / Dify** — graduate from Nano Banana to these when pipelines scale
- **knowledge/skills/** — pair with skill prompts for repeatable inference tasks

## Notes
Tier C — under evaluation. Use when you need a fast, low-overhead AI integration and the full Langflow/Dify stack is overkill. Revisit for promotion to Tier B once the project stabilises and integration patterns are established. Verify the latest installation method against the official repo.
