# code-review-graph Integration

**Sprint:** EMOVEL Code Review Graph Extraction Fix
**Date:** 2026-06-22
**Status:** INSTALLED, NOT CONNECTED

## Result Summary

| Check | Result |
|---|---|
| Source ZIP | `C:\Users\flavi\Downloads\code-review-graph-main.zip` exists |
| Extract target | `C:\EMOVEL\tools\code-review-graph-main` |
| Real tool path | `C:\EMOVEL\tools\code-review-graph-main\code-review-graph-main` |
| README.md | YES |
| pyproject.toml | YES |
| requirements.txt | NO |
| Dockerfile | NO |
| package.json | YES, in `code-review-graph-vscode\package.json` |
| MCP config | YES, `.mcp.json` |
| CLI entry points | YES, `code-review-graph`, `crg-daemon` |
| Install attempted | YES, README command `pip install code-review-graph` |
| Install completed | YES, `pip show code-review-graph` reports version `2.3.6` |

## Verified Availability

| Capability | Verified State |
|---|---|
| CLI | YES - `code-review-graph --help` lists build, update, status, serve, mcp, daemon, and other commands |
| MCP server | YES - `code-review-graph serve --help` exists and `.mcp.json` defines `uvx code-review-graph serve` |
| MCP connected in EMOVEL | NO - no MCP server was registered or launched |
| Claude Code integration | YES, supported by `code-review-graph install --platform claude-code` |
| Claude Code configured in EMOVEL | NO - platform installer was not run |
| VS Code extension | YES, source exists in `code-review-graph-vscode` |
| VS Code extension installed | NO - no `npm install`, package build, VSIX install, or VS Code launch was run |

## Install Notes

The README provides a clear safe install command:

```bash
pip install code-review-graph
```

That command was run. The first sandboxed attempt failed due blocked network access. The approved retry timed out at the command wrapper level, but installation is confirmed afterward by:

```bash
pip show code-review-graph
Get-Command code-review-graph
code-review-graph --help
```

Confirmed installed package: `code-review-graph 2.3.6`.

## Not Performed

- No `code-review-graph install` platform configuration command was run.
- No MCP server was started.
- No daemon or watch service was started.
- No VS Code extension dependencies were installed.
- No Prompt Studio feature was created or changed.

## Next Safe Setup Step

When platform wiring is explicitly desired, run a targeted dry run first:

```bash
code-review-graph install --platform codex --dry-run
code-review-graph install --platform claude-code --dry-run
```
