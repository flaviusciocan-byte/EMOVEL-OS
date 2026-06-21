# EMOVEL Tool Audit

Audit date: 2026-06-22

Source ZIP folder: `C:\Users\flavi\Downloads`

Target tools folder: `C:\EMOVEL\tools`

## Audit Table

| Tool | ZIP Found | Extracted Path | README | package.json | pyproject.toml | requirements.txt | Dockerfile | Install Command | Run Command | Status | Priority |
|---|---:|---|---:|---:|---:|---:|---:|---|---|---|---|
| ui-ux-pro-max-skill-main | Yes | `C:\EMOVEL\tools\ui-ux-pro-max-skill-main\ui-ux-pro-max-skill-main` | Yes | No | No | No | No | No local dependency install detected. Optional global `uipro-cli` from README was not installed. | Use as UI/UX skill reference; read `README.md` and skill guidance. | INSTALL_READY | S |
| 21st-sdk-main | Yes | `C:\EMOVEL\tools\21st-sdk-main\21st-sdk-main` | Yes | Yes | No | No | No | `pnpm.cmd install` | `pnpm.cmd run dev` | INSTALLED | S |
| quant-ux-master | Yes | `C:\EMOVEL\tools\quant-ux-master\quant-ux-master` | Yes | Yes | No | No | Yes | `npm.cmd install` | `npm.cmd run serve` or Docker compose from repo docs | REGISTERED | A |
| nano-banana-2-ai-main | Yes | `C:\EMOVEL\tools\nano-banana-2-ai-main\nano-banana-2-ai-main` | Yes | Yes | No | No | No | `npm.cmd install` | `npm.cmd run dev` | REGISTERED | B |
| awesome-gpt-image-2-API-and-Prompts-main | Yes | `C:\EMOVEL\tools\awesome-gpt-image-2-API-and-Prompts-main\awesome-gpt-image-2-API-and-Prompts-main` | Yes | No | No | No | No | No install; prompt/reference library. | Browse README and reference assets. | REGISTERED | B |
| Nano-Banana-Pro-main | Yes | `C:\EMOVEL\tools\Nano-Banana-Pro-main\Nano-Banana-Pro-main` | Yes | No | No | No | No | No install; README/reference library. | Read `README.md`. | REGISTERED | B |

## Install Actions Performed

- Created or confirmed `C:\EMOVEL\tools`.
- Confirmed all six ZIP files exist in `C:\Users\flavi\Downloads`.
- Confirmed all six tools are extracted under `C:\EMOVEL\tools`.
- Installed only Tier S dependency tool: `21st-sdk-main` with `pnpm.cmd install`.
- Did not install Quant UX.
- Did not install Nano Banana visual repos.
- Did not run Docker compose.
- Did not install global packages.

## Install Notes

`21st-sdk-main` declares `packageManager: pnpm@9.15.4`. Local `pnpm.cmd --version` returned `11.3.0`; `pnpm.cmd install` completed successfully and generated Prisma client during postinstall.

`ui-ux-pro-max-skill-main` does not contain `package.json`, `pyproject.toml`, `requirements.txt`, or `Dockerfile` in the extracted path. It is registered as a skill/reference repository and marked `INSTALL_READY`, not falsely installed.

## Not Installed This Sprint

- `quant-ux-master`: registered only.
- `nano-banana-2-ai-main`: registered only; likely requires API key configuration before runtime.
- `awesome-gpt-image-2-API-and-Prompts-main`: reference library only.
- `Nano-Banana-Pro-main`: reference library only.
