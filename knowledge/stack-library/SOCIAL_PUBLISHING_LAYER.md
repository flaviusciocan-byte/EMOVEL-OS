# Social Publishing Layer

## Purpose

The Social Publishing Layer connects EMOVEL-generated launch content to a real publishing platform while keeping publishing manual and reviewable.

Registered tool:

`C:\EMOVEL\tools\postiz-app-main\postiz-app-main`

## Stack Flow

```text
EMOVEL Prompt Studio
↓
Content Generation
↓
Publish Package
↓
Postiz
↓
Instagram
Facebook
LinkedIn
TikTok
X
Threads
```

## EMOVEL Source Files

Prompt Studio produces publish package files such as:

- `GUMROAD_LISTING.md`
- `SOCIAL_LAUNCH_POSTS.md`
- `EMAIL_LAUNCH_COPY.md`
- `PRODUCT_ASSET_LIST.md`
- `FINAL_QA.md`

Postiz consumes only manually reviewed social content. EMOVEL does not auto-post.

## Postiz Role

Postiz is used for:

- connecting social channels manually
- reviewing approved social posts
- scheduling channel-specific content
- publishing only after human approval
- keeping campaign execution separate from product generation

## Supported Priority Channels

- Instagram
- Facebook
- LinkedIn
- TikTok
- X
- Threads

## Current Integration Status

Status: `NEEDS_MANUAL_SETUP`

Reason:

- Postiz ZIP was extracted.
- Postiz exact path was registered.
- Postiz source install was not run because local Node is `v24.16.0`, while Postiz requires `>=22.12.0 <23.0.0`.
- Docker compose files exist, but containers were not launched.
- No accounts or APIs were connected.

## Safety Boundary

- Do not publish automatically.
- Do not connect real accounts without explicit approval.
- Do not store social API secrets in generated project markdown.
- Do not run Docker compose from Prompt Studio.
- Treat Postiz as a reviewed publishing handoff until a future approved integration sprint.
