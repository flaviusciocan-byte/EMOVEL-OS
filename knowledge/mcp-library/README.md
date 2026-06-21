# MCP Library

Model Context Protocol (MCP) connectors extend Claude's capabilities by giving it direct access to external tools and data sources.

This directory documents all active and planned MCP connectors for EMOVEL-OS.

---

## Active Connectors

| Connector | What It Provides | Status |
|---|---|---|
| — | — | — |

---

## Planned Connectors

| Connector | What It Will Provide | Priority |
|---|---|---|
| Supabase MCP | Read/write database directly from Claude | High |
| n8n MCP | Trigger and inspect workflows from Claude | High |
| Postiz MCP | Schedule social posts from Claude | Medium |
| GitHub MCP | Read repos, create commits from Claude | Medium |
| Firecrawl MCP | Scrape web pages as Claude tool calls | Medium |

---

## How to Add an MCP Connector

1. Find or build the MCP server for the tool
2. Add it to Claude Code settings (`.claude/settings.json` → `mcpServers`)
3. Document it here with: connector name, what it provides, and how to configure it
4. Test with a simple tool call

---

## Resources

- MCP spec: https://modelcontextprotocol.io
- Claude Code MCP docs: https://docs.anthropic.com/claude-code/mcp
