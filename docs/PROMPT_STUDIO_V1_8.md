# EMOVEL Prompt Studio v1.8

## Purpose

Prompt Studio v1.8 adds Publish Prep mode for builder workspaces that are marked `Ready to Publish`. It creates a local publish package from existing project files without connecting Gumroad, social platforms, email tools, APIs, or databases.

## What Changed

- Added `Prepare Publish Package` on `/builder-workspaces/[slug]`.
- Enables the action only when Build Status is `Ready to Publish`.
- Creates `projects/build-workspaces/{project-slug}/publish-package/`.
- Adds an inline viewer for publish package markdown files.
- Logs the publish package preparation in `RUN_LOG.md`.

## Generated Files

The publish package contains:

- `PUBLISH_CHECKLIST.md`
- `GUMROAD_LISTING.md`
- `SOCIAL_LAUNCH_POSTS.md`
- `EMAIL_LAUNCH_COPY.md`
- `PRODUCT_ASSET_LIST.md`
- `FINAL_QA.md`

## Source Files Used

Publish Prep reads:

- `offer.md`
- `copy.md`
- `visual-brief.md`
- `launch-plan.md`
- `build-handoff.md`

## Safety Boundary

Prompt Studio does not:

- connect to Gumroad
- create a Gumroad product
- post to social media
- send email
- call paid APIs
- use a database

All generated files are local markdown prep assets.

## Build Verification

Run from `apps/emovel-prompt-studio/`:

```bash
npm run build
```
