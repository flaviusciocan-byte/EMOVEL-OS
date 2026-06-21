# Higgsfield

| Field | Value |
|---|---|
| **Tier** | C |
| **Category** | Content |
| **Priority** | Low |
| **EMOVEL Score** | 7 / 10 |

## Purpose
AI video generation platform focused on cinematic motion and character-consistent video synthesis. Generates short video clips from text prompts or image inputs with physics-aware movement and realistic camera work. Positioned as the creative AI video tool for marketing and content production.

## Use Cases
- Generate cinematic product trailers from a product brief without a film crew
- Create visual hooks for social media (attention-grabbing opening clips)
- Produce AI video backgrounds and B-roll for screen-recorded demos
- Animate product mockups into video for launch day announcements
- Generate persona or character footage for course and educational content

## Installation Path
```
SaaS platform — no self-hosting.
Sign up at: https://higgsfield.ai
Access via web app or API.
```

API integration:
```bash
curl -X POST https://api.higgsfield.ai/v1/generate \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "product reveal, cinematic, slow pan", "duration": 5}'
```

## Dependencies
- Higgsfield account (paid tiers for production use)
- API key for programmatic access
- Storage: download generated clips and store locally or in Supabase Storage

## Recommended Integrations
- **OpenCut** — import Higgsfield clips and edit into final content pieces
- **Postiz** — schedule AI-generated video content across platforms
- **n8n** — automate: product milestone → Higgsfield API → generate clip → queue in Postiz
- **Cap** — combine AI-generated visuals with real screen recordings
- **Content Engine** — Higgsfield feeds the video branch of the distribution pipeline

## Notes
Tier C — not self-hostable, SaaS dependency. Justified for high-quality launch video content where production value matters. Gate usage behind the Content Engine workflow: only generate when there is a clear distribution plan for the output. Monitor credit costs carefully — AI video generation burns credits fast.
