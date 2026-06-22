# code-review-graph Integration

**Sprint:** EMOVEL Tool Integration Sprint  
**Date:** 2026-06-22  
**Status:** BLOCKED — SOURCE DIRECTORY NOT FOUND

---

## Result Summary

| Check | Result |
|---|---|
| Expected path | `C:\EMOVEL\tools\code-review-graph-main` |
| Directory exists | NO |
| Alternative paths searched | See below |
| MCP server detected | CANNOT VERIFY |
| Claude Code integration detected | CANNOT VERIFY |
| CLI integration detected | CANNOT VERIFY |
| VS Code integration detected | CANNOT VERIFY |
| Install attempted | NO |
| Registered in tools.json | YES — status NOT_FOUND |

---

## Paths Searched

The following paths were checked on this machine and returned no results:

```
C:\EMOVEL\tools\code-review-graph-main          → does not exist
C:\EMOVEL\tools\                                 → directory listed; no code-review-graph entry
C:\Users\flavi\Desktop\                         → searched; not found
C:\Users\flavi\Downloads\                       → searched; not found
C:\Users\flavi\                                  → recursive search; not found
C:\ (maxdepth 5)                                → full drive search; not found
```

The `C:\EMOVEL\tools\` directory was confirmed present and contains 25 other extracted tools. `code-review-graph-main` is not among them.

---

## What Was Not Done

Nothing was invented, fabricated, or assumed to be present:

- No install was run.
- No MCP registration was performed.
- No Claude Code hook was written.
- No VS Code extension entry was created.
- No CLI wrapper was created.
- No integration code was written.

The tool cannot be integrated until the source directory is present on disk.

---

## What code-review-graph Likely Provides (Based on Name Only)

> **Caveat:** The following is based solely on the tool's name. No source files were read. Do not treat this as verified capability.

A tool named `code-review-graph` typically provides one or more of:

- **Dependency graph visualization** — maps which files or modules are touched across pull requests
- **Reviewer network graph** — shows review patterns between contributors
- **Code churn graph** — visualizes change frequency over time per file/module
- **AST-level code structure graph** — parses source code into a graph for static analysis
- **Review flow graph** — models the review pipeline as a directed graph for CI/CD integration

Without reading the actual README or source, the exact capability, runtime, and integration type are unknown.

---

## How EMOVEL Prompt Studio Could Use It (Hypothetical)

Once the tool is extracted and inspected, possible integration points are:

### If it provides a CLI
```bash
# Example — unverified
code-review-graph --path ./apps/emovel-prompt-studio --output graph.json
```
Prompt Studio's execution pipeline could call this as a pre-build step and include the graph output in `execution-plan.md` or `build-handoff.md`.

### If it provides an MCP server
Add it to `.claude/settings.json` under `mcpServers`:
```json
{
  "mcpServers": {
    "code-review-graph": {
      "command": "node",
      "args": ["path/to/code-review-graph/server.js"]
    }
  }
}
```

### If it provides a Claude Code skill
Copy or symlink its skill directory into `.claude/skills/` and invoke it with `/code-review-graph` during code review workflows.

### If it provides a VS Code extension
Install via `Extensions: Install from VSIX` in VS Code after building the `.vsix` package from source.

---

## Requirements to Unblock

1. **Locate the ZIP or source** — check `C:\Users\flavi\Downloads\`, external drives, GitHub, or the original download source
2. **Extract to** `C:\EMOVEL\tools\code-review-graph-main\`
3. **Re-run this sprint** — once the directory is present, return to Step 1 (Inspect the repository)

---

## Next Steps

| Priority | Action |
|---|---|
| P0 | Find or re-download the `code-review-graph-main` ZIP or repository |
| P0 | Extract to `C:\EMOVEL\tools\code-review-graph-main\` |
| P1 | Read README, package.json / pyproject.toml, and any MCP config files |
| P1 | Determine integration type (MCP / CLI / VS Code / Claude skill) |
| P2 | Run install if a dependency manifest is present |
| P2 | Update `config/tools.json` status from `NOT_FOUND` to actual status |
| P3 | Wire into Prompt Studio execution pipeline if CLI is confirmed |
