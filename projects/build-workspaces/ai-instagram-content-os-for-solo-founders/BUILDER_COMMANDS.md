# Builder Commands: Ai Instagram Content Os For Solo Founders

Generated locally by EMOVEL Prompt Studio v1.6 on 2026-06-21T17:29:47.123Z.

## Safety Warning

These commands are documentation only. Prompt Studio does not execute builder commands from the UI. Run commands manually in a terminal only after reviewing the prompt, output folder, credentials, and tool status.

## GPT-Pilot Path From config/tools.json

- Tool: `gpt-pilot-main`
- Path: `C:\EMOVEL\tools\gpt-pilot-main\gpt-pilot-main`
- Status: `INSTALLED`
- Registered run command: `.venv\Scripts\python.exe main.py`

## Recommended Command

```bat
cd /d "C:\EMOVEL\tools\gpt-pilot-main\gpt-pilot-main"
.venv\Scripts\python.exe main.py
```

After GPT-Pilot starts, paste the contents of:

```text
projects/build-workspaces/ai-instagram-content-os-for-solo-founders/gpt-pilot-prompt.md
```

## Manual Execution Steps

1. Open a normal terminal outside Prompt Studio.
2. Review `projects/build-workspaces/ai-instagram-content-os-for-solo-founders/gpt-pilot-prompt.md`.
3. Review `projects/build-workspaces/ai-instagram-content-os-for-solo-founders/README_BUILD.md`.
4. Change directory to the registered GPT-Pilot path.
5. Run the registered GPT-Pilot command manually.
6. Paste the GPT-Pilot prompt when the tool asks for the project brief.
7. Set or confirm the output folder before files are generated.
8. Run `npm install` in the generated app folder.
9. Run `npm run build` in the generated app folder.
10. Fix build errors before adding integrations.

## Expected Output Folder

```text
products/ai-instagram-content-os-for-solo-founders/landing-app/
```

Keep generated app code out of EMOVEL-OS control-center folders unless you intentionally place it under a product app path.

## Troubleshooting Notes

- If GPT-Pilot cannot start, confirm the registered path exists.
- If Python dependencies are missing, inspect the GPT-Pilot README before installing anything.
- If the virtual environment is missing, reinstall GPT-Pilot dependencies in the external tool folder, not inside EMOVEL-OS.
- If an API key is requested, stop and decide which provider should be connected manually.
- If output is created in the wrong location, move or regenerate it before committing.
- If the generated app fails build, fix the app code before adding motion, APIs, database, payments, or automations.

## Do Not Automate Yet

- Do not run GPT-Pilot from Prompt Studio.
- Do not run shell commands from the browser UI.
- Do not store API keys in generated markdown files.
- Do not connect paid APIs until a human approves the integration.
