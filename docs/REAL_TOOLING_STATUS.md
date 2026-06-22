# Real Tooling Status

Updated: 2026-06-22

## Scope

This status reflects the extraction, detection, registration, and Tier S install pass for these downloaded tools:

- `ui-ux-pro-max-skill-main`
- `21st-sdk-main`
- `quant-ux-master`
- `nano-banana-2-ai-main`
- `awesome-gpt-image-2-API-and-Prompts-main`
- `Nano-Banana-Pro-main`
- `postiz-app-main`

External tool root:

`C:\EMOVEL\tools`

## Status Counts For This Sprint

| Status | Tools |
|---|---|
| INSTALLED | `21st-sdk-main` |
| INSTALL_READY | `ui-ux-pro-max-skill-main` |
| REGISTERED | `quant-ux-master`, `nano-banana-2-ai-main`, `awesome-gpt-image-2-API-and-Prompts-main`, `Nano-Banana-Pro-main` |
| FAILED | None in this sprint |
| NEEDS_MANUAL_SETUP | `postiz-app-main` |

## Registered Paths

| Tool | Registered Path |
|---|---|
| UI UX Pro Max | `C:\EMOVEL\tools\ui-ux-pro-max-skill-main\ui-ux-pro-max-skill-main` |
| 21st SDK | `C:\EMOVEL\tools\21st-sdk-main\21st-sdk-main` |
| Quant UX | `C:\EMOVEL\tools\quant-ux-master\quant-ux-master` |
| Nano Banana 2 AI | `C:\EMOVEL\tools\nano-banana-2-ai-main\nano-banana-2-ai-main` |
| Awesome GPT Image 2 API and Prompts | `C:\EMOVEL\tools\awesome-gpt-image-2-API-and-Prompts-main\awesome-gpt-image-2-API-and-Prompts-main` |
| Nano Banana Pro | `C:\EMOVEL\tools\Nano-Banana-Pro-main\Nano-Banana-Pro-main` |
| Postiz | `C:\EMOVEL\tools\postiz-app-main\postiz-app-main` |

## Install Results

### 21st SDK

- Detected `package.json`.
- Detected package manager: `pnpm@9.15.4`.
- Ran `pnpm.cmd install` inside the extracted tool folder.
- Result: installed successfully.
- Note: Prisma client was generated during postinstall.

### UI UX Pro Max

- Detected README.
- No `package.json`, `pyproject.toml`, `requirements.txt`, or `Dockerfile` detected in the extracted path.
- No local dependency install was run.
- Optional global CLI mentioned in README was not installed because global installs were not explicitly required.

## Deferred Tools

- Quant UX was detected and registered but not installed.
- Nano Banana 2 AI was detected and registered but not installed.
- Awesome GPT Image 2 API and Prompts is a reference/prompt library and was not installed.
- Nano Banana Pro is a README/reference repo and was not installed.
- Postiz was extracted and registered, but not installed because local Node is `v24.16.0` and Postiz requires `>=22.12.0 <23.0.0`. Docker compose files exist but were not launched.

## Not Faked

- No MCP connection was claimed.
- No Docker compose command was run.
- No social account was connected.
- No post was published.
- No visual repo dependency install was run.
- No Quant UX install was run.
- No global package was installed.
