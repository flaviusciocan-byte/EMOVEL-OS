# Postiz Integration

## Purpose

Postiz is the social publishing layer for EMOVEL. It can receive launch content from Prompt Studio publish packages and provide the manual/social scheduling interface before posts go to live networks.

Postiz remains isolated under:

`C:\EMOVEL\tools\postiz-app-main\postiz-app-main`

No social account was connected and nothing was published during this sprint.

## Repository Status

- ZIP: `C:\Users\flavi\Downloads\postiz-app-main.zip`
- Extracted path: `C:\EMOVEL\tools\postiz-app-main\postiz-app-main`
- README: detected
- `package.json`: detected
- `pnpm-workspace.yaml`: detected
- Docker compose files: detected
- `apps/`: detected
- `libraries/`: detected

## Supported Social Networks

Detected from README and provider source files:

- Instagram
- Facebook
- LinkedIn
- TikTok
- X
- Threads
- YouTube
- Reddit
- Pinterest
- Dribbble
- Discord
- Slack
- Mastodon
- Bluesky
- Telegram
- WordPress
- Medium
- Nostr
- Farcaster
- Hashnode
- Dev.to

EMOVEL’s first publishing flow focuses on Instagram, Facebook, LinkedIn, TikTok, X, and Threads.

## Install Method

Postiz is a pnpm monorepo.

Detected package metadata:

- package manager: `pnpm@10.6.1`
- engine: `node >=22.12.0 <23.0.0`
- local Node detected: `v24.16.0`
- local pnpm detected: `11.3.0`
- nvm-windows detected: no

Because local Node is outside the repository engine range, source dependencies were not installed. Current status: `NEEDS_MANUAL_SETUP`.

Safe Node setup commands are documented in:

`docs/POSTIZ_NODE_SETUP.md`

Recommended source install after switching to Node 22.x:

```powershell
cd C:\EMOVEL\tools\postiz-app-main\postiz-app-main
pnpm.cmd install
```

## Run Method

Source development command after compatible Node and environment setup:

```powershell
cd C:\EMOVEL\tools\postiz-app-main\postiz-app-main
pnpm.cmd run dev
```

Build command:

```powershell
pnpm.cmd run build
```

Docker method is documented by the repo through:

- `docker-compose.yaml`
- `docker-compose.dev.yaml`
- `Dockerfile.dev`

Docker containers were not launched in this sprint.

## Required Accounts

For practical EMOVEL publishing use, connect accounts manually inside Postiz only after setup:

- Instagram account
- Facebook page/account
- LinkedIn profile/page
- TikTok account
- X account
- Threads account

Postiz uses platform-approved OAuth style flows according to its README. Do not paste private social credentials into EMOVEL files.

## API Requirements

Core runtime/environment requirements detected in `.env.example` and Docker compose:

- PostgreSQL database
- Redis
- JWT secret
- frontend URL
- backend URL
- backend internal URL
- storage provider: local or Cloudflare R2
- Temporal stack for workflow execution

Social/API settings detected:

- `X_API_KEY`
- `X_API_SECRET`
- `LINKEDIN_CLIENT_ID`
- `LINKEDIN_CLIENT_SECRET`
- `THREADS_APP_ID`
- `THREADS_APP_SECRET`
- `FACEBOOK_APP_ID`
- `FACEBOOK_APP_SECRET`
- `YOUTUBE_CLIENT_ID`
- `YOUTUBE_CLIENT_SECRET`
- `TIKTOK_CLIENT_ID`
- `TIKTOK_CLIENT_SECRET`
- `PINTEREST_CLIENT_ID`
- `PINTEREST_CLIENT_SECRET`
- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `SLACK_ID`
- `SLACK_SECRET`
- `MASTODON_CLIENT_ID`
- `MASTODON_CLIENT_SECRET`

Optional/common integrations include Resend, Stripe, OpenAI, Cloudflare R2, Dub, Short.io, Kutt, and LinkDrip.

## EMOVEL Usage Flow

1. Create product or campaign in EMOVEL Prompt Studio.
2. Generate publish package.
3. Review `SOCIAL_LAUNCH_POSTS.md`.
4. Create or open Postiz manually.
5. Connect approved social accounts manually.
6. Copy final approved launch posts into Postiz.
7. Schedule posts per channel.
8. Review inside Postiz before publishing.

## Current Status

`NEEDS_MANUAL_SETUP`

Reason:

- Extracted and registered.
- Source install not run because local Node is `v24.16.0`, while Postiz requires `>=22.12.0 <23.0.0`.
- `nvm` / nvm-windows was not detected on PATH.
- Docker compose exists, but containers were not launched per sprint rule.
- No real accounts or APIs were connected.
