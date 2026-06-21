# EMOVEL Prompt Studio v1.9

## Purpose

Prompt Studio v1.9 adds a local Shop Foundation for products prepared for Gumroad. It lists projects that already have a publish package and lets the operator manage a local shop status without connecting Gumroad.

## What Changed

- Added `/shop`.
- Added `/shop/[slug]`.
- Discovers products from `projects/build-workspaces/{project-slug}/publish-package/`.
- Shows product name, build/shop status, Gumroad listing preview, and asset checklist progress.
- Shows key publish package files for each product.
- Adds `Mark as Listed`, which writes `SHOP_STATUS.md`.

## Shop Status Values

- Draft
- Ready for Gumroad
- Listed
- Published
- Needs Update

## Files Shown

`/shop/[slug]` shows:

- `GUMROAD_LISTING.md`
- `PRODUCT_ASSET_LIST.md`
- `PUBLISH_CHECKLIST.md`
- `FINAL_QA.md`

## Safety Boundary

Prompt Studio does not:

- connect to Gumroad
- create Gumroad listings
- publish products
- call paid APIs
- use a database

All shop state is local markdown.

## Build Verification

Run from `apps/emovel-prompt-studio/`:

```bash
npm run build
```
