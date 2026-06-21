# Puter

| Field | Value |
|---|---|
| **Tier** | B |
| **Category** | Infrastructure |
| **Priority** | Medium |
| **EMOVEL Score** | 7 / 10 |

## Purpose
Open-source internet operating system. A full cloud desktop environment accessible from any browser — includes file manager, app launcher, terminal, code editor, and an SDK for building cloud-native apps on top of it. Self-hostable alternative to cloud storage + office suites combined.

## Use Cases
- Unified dashboard for EMOVEL-OS: access tools and files from any device via browser
- Host lightweight internal apps built with the Puter SDK without separate infrastructure
- File sharing and cloud storage for teams without a Google Drive dependency
- Run web-based tools (OpenCut, Penpot, CryptPad) via Puter app slots
- Developer sandbox: spin up isolated environments for testing without local setup

## Installation Path
```bash
# Self-hosted
git clone https://github.com/HeyPuter/puter.git
cd puter
npm install
npm start
```
Access at `http://localhost:4100`

Or use the hosted version at `puter.com`

## Dependencies
- Node.js 16+
- npm
- 1GB RAM minimum
- Persistent volume for file storage

## Recommended Integrations
- **Supabase** — back Puter file metadata with Supabase for querying and search
- **n8n** — trigger workflows when files are uploaded to Puter storage
- **CryptPad** — Puter as the desktop OS; CryptPad embedded for encrypted docs
- **Open WebUI** — launch AI sessions from within the Puter desktop
- **knowledge/** — mount EMOVEL-OS knowledge base as a Puter drive

## Notes
Most valuable as a unification layer — a single URL that acts as the EMOVEL-OS command center in the browser. Still maturing; evaluate before using as primary infrastructure. Strong open-source momentum and active development as of mid-2025.
