# OpenCut

| Field | Value |
|---|---|
| **Tier** | B |
| **Category** | Content |
| **Priority** | Medium |
| **EMOVEL Score** | 7 / 10 |

## Purpose
Open-source video editing platform. Browser-based or self-hostable editor focused on short-form content — clip trimming, captions, transitions, and multi-track editing. Built as the open alternative to CapCut.

## Use Cases
- Edit Cap or Screenity recordings into polished short-form content for social
- Add captions and text overlays to build-in-public update videos
- Cut Higgsfield AI video outputs into platform-ready clips
- Create product demo reels from raw screen recordings
- Produce milestone announcement videos for waitlist distribution

## Installation Path
```bash
# Self-hosted via Docker
git clone https://github.com/OpenCut-app/OpenCut.git
cd OpenCut
docker compose up -d
```
Or use the hosted editor at `opencut.app`

Local development:
```bash
cd apps/web
npm install
npm run dev
```

## Dependencies
- Docker (self-hosted)
- Node.js 18+ (local dev)
- Browser with WebCodecs API support (Chrome 94+, Edge 94+)
- FFmpeg (bundled in Docker image)

## Recommended Integrations
- **Cap** — import Cap recordings as source material
- **Screenity** — import annotated clips for editing
- **Higgsfield** — edit AI-generated video clips into polished content
- **Postiz** — export edited videos and schedule directly
- **Content Engine** — sits between raw recording and distribution
- **n8n** — automate: new Cap recording → trigger OpenCut import → notify editor

## Notes
Early-stage project but rapidly improving. Self-host for full control over video assets and no watermark restrictions. Pairs naturally with Cap (capture) → OpenCut (edit) → Postiz (distribute) as the EMOVEL-OS content production pipeline.
