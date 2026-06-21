# CryptPad

| Field | Value |
|---|---|
| **Tier** | A |
| **Category** | Knowledge |
| **Priority** | High |
| **EMOVEL Score** | 8 / 10 |

## Purpose
End-to-end encrypted, open-source collaborative office suite. Includes documents, spreadsheets, presentations, kanban boards, and code pads — all encrypted so even the server operator cannot read content. Zero-knowledge by design.

## Use Cases
- Store sensitive product briefs and business plans with zero-knowledge encryption
- Collaborative writing for launch copy, email sequences, and documentation
- Kanban boards for project tracking that don't expose business logic to third parties
- Code pad for sharing snippets with collaborators securely
- Spreadsheets for financial modelling and launch metrics — kept private by default

## Installation Path
```bash
# Docker (recommended for self-hosted)
git clone https://github.com/cryptpad/cryptpad.git
cd cryptpad
docker compose up -d
```
Access at `http://localhost:3000`

Or use the hosted instance at `cryptpad.fr` — no account required, E2E encrypted.

## Dependencies
- Docker + Docker Compose
- Node.js 16+ (if running without Docker)
- 2GB RAM minimum
- Object storage or local disk for encrypted blobs

## Recommended Integrations
- **council/** — store decision logs in encrypted CryptPad docs
- **project-templates/** — use CryptPad docs as live collaborative brief sessions
- **n8n** — export finalized docs to GitHub or Supabase via webhook
- **Supabase** — store only metadata/links in Supabase; content stays in CryptPad
- **Novu** — notify collaborators when a shared document is updated

## Notes
Default choice for any document containing business strategy, financials, or user data. E2E encryption means no breach of a third-party server exposes content. Use alongside Notion or Baserow for non-sensitive public-facing content.
