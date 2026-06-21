# EMOVEL-OS Health Status

**Generated:** 2026-06-21 11:02:36

## Readiness Score

| Metric | Value |
|---|---|
| Tools operational | 0 / 7 |
| Tools found on disk | 2 / 7 |
| Overall readiness | 0% |

## Tool Registry

| Tool | Location | Git Status | Branch | Last Commit | Health Check | Ready |
|---|---|---|---|---|---|---|
| claude-council-main | NOT FOUND | -- | -- | -- | -- -- Tool not found | No |
| claude-cowork | NOT FOUND | -- | -- | -- | -- -- Tool not found | No |
| gpt-pilot-main | C:\Users\flavi\Desktop\gpt-pilot-main | -- | -- | -- | Fail -- Python environment for Pythagora is not set up: module `pydantic` is missing. Please creat... | No |
| claude-code-main | NOT FOUND | -- | -- | -- | -- -- Tool not found | No |
| n8n-master | NOT FOUND | -- | -- | -- | -- -- Tool not found | No |
| knowledge-work-plugins-main | NOT FOUND | -- | -- | -- | -- -- Tool not found | No |
| reflex-main | C:\Users\flavi\Desktop\reflex-main | -- | -- | -- | Fail -- Not found in PATH: reflex | No |

## Tool Details

### claude-council-main  [NOT READY]

- **Description:** Decision validation layer
- **Location:** NOT FOUND
- **Git repo:** --
- **Branch:** --
- **Last commit:** --
- **Health check:** --

### claude-cowork  [NOT READY]

- **Description:** Project coordination layer
- **Location:** NOT FOUND
- **Git repo:** --
- **Branch:** --
- **Last commit:** --
- **Health check:** --

### gpt-pilot-main  [NOT READY]

- **Description:** Autonomous app builder (Pythagora)
- **Location:** C:\Users\flavi\Desktop\gpt-pilot-main
- **Git repo:** --
- **Branch:** --
- **Last commit:** --
- **Health check:** Fail
- **Output:** `Python environment for Pythagora is not set up: module `pydantic` is missing. Please creat...`

### claude-code-main  [NOT READY]

- **Description:** Dev assistance and file editing
- **Location:** NOT FOUND
- **Git repo:** --
- **Branch:** --
- **Last commit:** --
- **Health check:** --

### n8n-master  [NOT READY]

- **Description:** Workflow automation
- **Location:** NOT FOUND
- **Git repo:** --
- **Branch:** --
- **Last commit:** --
- **Health check:** --

### knowledge-work-plugins-main  [NOT READY]

- **Description:** Reusable skills and MCP connectors
- **Location:** NOT FOUND
- **Git repo:** --
- **Branch:** --
- **Last commit:** --
- **Health check:** --

### reflex-main  [NOT READY]

- **Description:** Python-native reactive UI builder
- **Location:** C:\Users\flavi\Desktop\reflex-main
- **Git repo:** --
- **Branch:** --
- **Last commit:** --
- **Health check:** Fail
- **Output:** `Not found in PATH: reflex`

## Missing Tools

Register missing tools by running:

```powershell
.\scripts\register-tool.ps1 "claude-council-main"
.\scripts\register-tool.ps1 "claude-cowork"
.\scripts\register-tool.ps1 "claude-code-main"
.\scripts\register-tool.ps1 "n8n-master"
.\scripts\register-tool.ps1 "knowledge-work-plugins-main"
```

Or with an explicit path if auto-search fails:

```powershell
.\scripts\register-tool.ps1 "tool-name" "C:\path\to\tool"
```