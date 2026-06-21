# Penpot

| Field | Value |
|---|---|
| **Tier** | A |
| **Category** | Design |
| **Priority** | High |
| **EMOVEL Score** | 9 / 10 |

## Purpose
Open-source, self-hostable design and prototyping tool. Full Figma alternative built on open standards (SVG-based). Supports vector design, components, prototyping, and team collaboration without a SaaS subscription.

## Use Cases
- Design product UI screens before handing off to GPT-Pilot or Reflex
- Create social media graphics and content assets for the Content Engine
- Build reusable component libraries shared across products
- Prototype user flows and get Council review before coding starts
- Export production-ready SVGs and assets directly into repos

## Installation Path
```bash
# Docker Compose (official)
git clone https://github.com/penpot/penpot.git
cd penpot
docker compose -f docker-compose.yaml up -d
```
Access at `http://localhost:9001`

Or use the hosted free tier at `penpot.app` for no-setup start.

## Dependencies
- Docker + Docker Compose
- 4GB RAM minimum for self-hosted
- PostgreSQL and Redis (included in Docker Compose)

## Recommended Integrations
- **GitHub** — export design assets directly into product repos
- **Postiz** — export social graphics for scheduling
- **Claude Code** — reference design specs when generating frontend code
- **Reflex** — use exported measurements and colors to match design in code
- **n8n** — automate design-to-asset export pipeline

## Notes
Prefer self-hosted for full data ownership and no per-seat pricing. Use `penpot.app` for quick collaboration without spinning up infrastructure. SVG-native means exports work everywhere without proprietary format lock-in.
