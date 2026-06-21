# EMOVEL-OS — Installation & Local Tool References

This document maps each local tool to its expected path on the developer machine.
**Do not copy these tools into EMOVEL-OS.** This repo is the orchestration layer only.

---

## Local Tool Paths

All tools are expected to live under `C:\Users\flavi\Desktop\` or `C:\Users\flavi\Downloads\`.

| Tool | Expected Path | Purpose |
|---|---|---|
| claude-council-main | `C:\Users\flavi\Downloads\claude-council-main` | Decision validation layer |
| claude-cowork | `C:\Users\flavi\Downloads\claude-cowork` | Project coordination layer |
| gpt-pilot-main (Pythagora) | `C:\Users\flavi\Desktop\gpt-pilot-main` | Autonomous app builder |
| claude-code-main | `C:\Users\flavi\Downloads\claude-code-main` | Dev assistance / file editing |
| n8n-master | `C:\Users\flavi\Downloads\n8n-master` | Workflow automation |
| knowledge-work-plugins-main | `C:\Users\flavi\Downloads\knowledge-work-plugins-main` | Reusable skills + MCP connectors |
| reflex-main | `C:\Users\flavi\Downloads\reflex-main` | Python-native reactive UI builder |

---

## Checking Your Setup

Run the system check script to verify all tools are present:

```powershell
.\scripts\check-system.ps1
```

---

## First-Time Setup Order

1. Verify all tool folders exist (run `check-system.ps1`)
2. Clone this repo: `git clone git@github.com:flaviusciocan-byte/EMOVEL-OS.git`
3. Start n8n: navigate to `n8n-master/` and follow its README
4. Load the Stack Library: browse `knowledge/stack-library/README.md`
5. Copy `project-templates/product-brief.md` into your first project folder
6. Open Claude Cowork and reference the brief

---

## Git Remote

```
git@github.com:flaviusciocan-byte/EMOVEL-OS.git
```

---

## Requirements

- Git with SSH key configured for GitHub
- PowerShell 5.1+ (pre-installed on Windows 11)
- Node.js (for n8n)
- Python 3.10+ (for Reflex and GPT-Pilot)
- Claude Code CLI installed (`npm install -g @anthropic-ai/claude-code`)
