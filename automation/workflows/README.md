# EMOVEL-OS Automation Workflows

All reusable n8n workflows are documented here before being exported to `automation/n8n/`.

---

## Workflow 1: Build Update → Social Post → Waitlist

**Purpose:** Every time a build milestone is hit, automatically publish a social post and ping the waitlist.

**Trigger:** Manual trigger or GitHub commit to `main` with a tag like `[milestone]`

**Flow:**
```
[Trigger: Milestone hit / commit tagged]
        │
        ▼
[n8n: Fetch milestone description from build-plan.md or commit message]
        │
        ▼
[Claude API: Generate 3 social post variations from milestone text]
        │
        ▼
[Postiz API: Schedule best post across platforms (X, LinkedIn, Threads)]
        │
        ▼
[Dub API: Create short link for product page]
        │
        ▼
[Novu API: Send "we just shipped X" email to waitlist]
```

**Variables needed:**
- `POSTIZ_API_KEY`
- `DUB_API_KEY`
- `NOVU_API_KEY`
- `ANTHROPIC_API_KEY`
- `PRODUCT_URL`
- `WAITLIST_AUDIENCE_ID`

**Status:** Template only — not yet wired in n8n.

---

## Workflow 2: New Waitlist Signup → Welcome Sequence (Planned)

**Trigger:** New row in Supabase `waitlist` table

**Flow:**
```
[Supabase webhook: new signup]
        │
        ▼
[Novu: Send welcome email]
        │
        ▼
[n8n: Tag subscriber with product interest]
        │
        ▼
[Novu: Schedule Day 3 and Day 7 follow-up emails]
```

**Status:** Planned for Phase 3.

---

## Workflow 3: Launch Day Blast (Planned)

**Trigger:** Manual — triggered on launch day

**Flow:**
```
[Manual trigger with product name + URL]
        │
        ▼
[Postiz: Post launch announcement to all channels simultaneously]
        │
        ▼
[Novu: Send launch email to full waitlist]
        │
        ▼
[Dub: Generate launch day analytics report link]
```

**Status:** Planned for Phase 3.

---

## Adding New Workflows

1. Document the flow here first (trigger → steps → variables)
2. Build it in n8n
3. Export the JSON to `automation/n8n/<workflow-name>.json`
4. Update this README with status: `Active`
