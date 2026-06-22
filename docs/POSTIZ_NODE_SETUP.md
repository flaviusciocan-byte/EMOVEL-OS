# Postiz Node Setup

## Current Issue

Postiz requires:

```text
node >=22.12.0 <23.0.0
```

Current local Node detected:

```text
v24.16.0
```

`nvm` / nvm-windows was not detected on PATH during this sprint. Global Node was not changed.

## Recommended Node Version

Use Node `22.12.0` or a newer Node 22.x release that remains below Node 23.

Recommended:

```text
22.12.0
```

## If nvm-windows Is Installed Later

Run these commands manually in a new terminal:

```powershell
nvm install 22.12.0
nvm use 22.12.0
node --version
```

Then install Postiz dependencies:

```powershell
cd C:\EMOVEL\tools\postiz-app-main\postiz-app-main
pnpm.cmd install
```

## If nvm-windows Is Not Installed

Safe manual installation path:

1. Download nvm-windows from the official `coreybutler/nvm-windows` GitHub releases page.
2. Close active terminals before installing.
3. Install nvm-windows using the official installer.
4. Open a new terminal.
5. Confirm nvm is available:

```powershell
nvm version
```

6. Install and use Node 22 for Postiz:

```powershell
nvm install 22.12.0
nvm use 22.12.0
node --version
```

Do not downgrade or replace global Node outside this explicit manual switch.

## Postiz Install Commands

After Node reports a compatible 22.x version:

```powershell
cd C:\EMOVEL\tools\postiz-app-main\postiz-app-main
pnpm.cmd install
```

Postiz package metadata declares:

```text
packageManager: pnpm@10.6.1
```

If pnpm version alignment is required:

```powershell
corepack enable
corepack prepare pnpm@10.6.1 --activate
pnpm.cmd --version
```

## Local Run Command

After dependency install and environment setup:

```powershell
cd C:\EMOVEL\tools\postiz-app-main\postiz-app-main
pnpm.cmd run dev
```

Build command:

```powershell
pnpm.cmd run build
```

## Environment Requirements

Postiz requires local runtime services and configuration, including:

- PostgreSQL
- Redis
- Temporal
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `FRONTEND_URL`
- `NEXT_PUBLIC_BACKEND_URL`
- `BACKEND_INTERNAL_URL`
- local or Cloudflare R2 storage settings
- social platform API/OAuth credentials for connected networks

Do not store real social credentials in EMOVEL generated markdown files.

## Docker Alternative

Postiz includes:

- `docker-compose.yaml`
- `docker-compose.dev.yaml`
- `Dockerfile.dev`

Docker path, documented only:

```powershell
cd C:\EMOVEL\tools\postiz-app-main\postiz-app-main
docker compose up
```

Do not run Docker containers until a future approved setup sprint. Review `.env.example` and compose files first.

## Risk Notes

- Do not change global Node automatically.
- Switching Node versions can affect other tools in the same terminal.
- Use a fresh terminal for Postiz work after `nvm use 22.12.0`.
- Return to the previous Node version manually when working on tools that require Node 24.
- Postiz can publish to real social channels only after accounts and platform credentials are connected manually.
- Do not connect social accounts during setup validation.
- Do not publish test posts during setup validation.
