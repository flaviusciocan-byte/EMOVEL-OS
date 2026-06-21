# Content Engine — Distribution

Documents the distribution setup: which platforms, which tools, which accounts.

---

## Platforms

| Platform | Tool | Account | Status |
|---|---|---|---|
| X (Twitter) | Postiz | — | Not connected |
| LinkedIn | Postiz | — | Not connected |
| Threads | Postiz | — | Not connected |
| Email / Waitlist | Novu | — | Not configured |
| Link tracking | Dub | — | Not configured |

---

## Setup Checklist

- [ ] Install and configure Postiz (see `automation/n8n/`)
- [ ] Connect X, LinkedIn, Threads accounts to Postiz
- [ ] Create Novu account and configure email provider
- [ ] Create Dub account and set up default domain
- [ ] Wire Postiz + Novu into n8n Workflow 1 (Build Update → Social Post → Waitlist)
