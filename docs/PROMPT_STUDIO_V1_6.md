# EMOVEL Prompt Studio v1.6

## Purpose

Prompt Studio v1.6 adds Builder Command Generator for prepared builder workspaces. It creates a local `BUILDER_COMMANDS.md` file that tells a human how to run GPT-Pilot manually from the registered external tool path.

## What Changed

- Added a `Builder Commands` section on `/builder-workspaces/[slug]`.
- Added `Generate Builder Commands` / `Refresh Builder Commands`.
- Generates `projects/build-workspaces/{project-slug}/BUILDER_COMMANDS.md`.
- Reads the GPT-Pilot path and registered run command from `config/tools.json`.
- Shows `BUILDER_COMMANDS.md` in the existing builder workspace viewer.

## Generated File

`BUILDER_COMMANDS.md` includes:

- GPT-Pilot path from `config/tools.json`
- recommended manual command
- manual execution steps
- expected output folder
- troubleshooting notes
- safety warning that commands must be run manually in a terminal

## Safety Boundary

Prompt Studio still does not:

- run GPT-Pilot automatically
- execute shell commands from the UI
- call paid APIs
- create databases
- store API keys

## Build Verification

Run from `apps/emovel-prompt-studio/`:

```bash
npm run build
```
