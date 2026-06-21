# Cap

| Field | Value |
|---|---|
| **Tier** | A |
| **Category** | Content |
| **Priority** | High |
| **EMOVEL Score** | 8 / 10 |

## Purpose
Open-source screen recording and async sharing tool. Loom alternative — records screen and camera, generates a shareable link, tracks views. Built for async communication and demos.

## Use Cases
- Record product demos and feature walkthroughs for waitlists
- Create build-in-public update videos to feed the Content Engine
- Async product reviews without scheduling calls
- Record Claude Code sessions or GPT-Pilot builds as process content
- Share bug reproductions with collaborators without lengthy written descriptions

## Installation Path
```bash
# Desktop app (macOS and Windows)
# Download from: https://cap.so/download
```
Or use the hosted version at `cap.so` — free tier includes shareable links.

Self-hosted option available:
```bash
docker run -d -p 3000:3000 cap-app
```

## Dependencies
- Desktop: macOS 12+ or Windows 10+
- Self-hosted: Docker, S3-compatible storage (e.g., Supabase Storage or MinIO)
- Microphone + webcam (optional for face-cam overlay)

## Recommended Integrations
- **Postiz** — share Cap recording links as social content
- **n8n** — webhook trigger on new recording → auto-post to social
- **Content Engine** — every milestone recording feeds the distribution pipeline
- **Novu** — notify waitlist subscribers when a new demo is published
- **Dub** — wrap Cap links with Dub short links for tracking

## Notes
Prioritise Cap over Loom for cost and data ownership. The async video format works well for build-in-public content: record when you ship, share immediately, distribute via Content Engine.
