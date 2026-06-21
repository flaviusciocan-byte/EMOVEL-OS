# Pipeline Spec

## Purpose

Create a repeatable EMOVEL production workflow for professional sites, apps, shops, workflows, and premium visual launch assets.

## Required Inputs

- Product name
- Raw idea
- Target buyer
- Core transformation
- Offer and pricing
- Existing product files
- Visual direction
- Required output path
- Required tool stack

## Required Tools

| Layer | Preferred Tool | Registered Path |
|---|---|---|
| Offer / copy | EMOVEL skills | `knowledge/skills/` |
| UX direction | UI UX Pro Max | `C:\EMOVEL\tools\ui-ux-pro-max-skill-main\ui-ux-pro-max-skill-main` |
| Component planning | 21st SDK | `C:\EMOVEL\tools\21st-sdk-main\21st-sdk-main` |
| Motion planning | skills-main frontend-design | `C:\EMOVEL\tools\skills-main\skills-main\skills\frontend-design` |
| App build | Next.js app in product folder | Product-specific |
| Build verification | npm | Product-specific app folder |
| Smoke test | local HTTP request | Product-specific port |
| Launch report | Markdown report | `docs/` |

## Pipeline Stages

### 1. Intake

Read the product input file and all referenced product files.

Output:

- Confirmed source list
- Missing input notes

### 2. Offer

Use EMOVEL offer and pricing assets if available. If not, generate the offer using EMOVEL business skills before writing page copy.

Output:

- Offer summary
- Pricing / tier logic
- Guarantee
- Real urgency, if any

### 3. Copy

Use `emovel.copy_framework` and `emovel.page_builder`.

Output:

- Hero copy
- Problem / solution copy
- Deliverables
- Benefits
- Proof
- Pricing
- Guarantee
- FAQ
- Closing CTA

### 4. UX Audit

Use `emovel.premium_ui_director` and UI UX Pro Max guidance.

Output:

- UX direction statement
- Section hierarchy
- Accessibility notes
- Anti-patterns avoided

Required file:

`<product>/landing-app/UX_AUDIT.md`

### 5. Component Plan

Inspect 21st SDK or available component source.

Output:

- Component map
- 21st.dev/MCP availability status
- Fallback plan if MCP is unavailable

Required file:

`<product>/landing-app/COMPONENT_PLAN.md`

### 6. Motion Plan

Inspect available motion skills.

Output:

- Motion intent
- GSAP availability status
- Reduced-motion fallback

Required file:

`<product>/landing-app/MOTION_PLAN.md`

### 7. Next.js App

Create a runnable app in:

`<product>/landing-app/`

Minimum files:

- `package.json`
- `package-lock.json`
- `next.config.ts`
- `tsconfig.json`
- `next-env.d.ts`
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`

### 8. Build Test

Run:

```powershell
npm.cmd install
npm.cmd run build
```

Fix errors until build passes, or document the exact blocker.

### 9. Smoke Test

Run:

```powershell
npm.cmd run start -- -p <port>
Invoke-WebRequest http://localhost:<port>
```

Required evidence:

- HTTP 200
- Expected hero or product text found

### 10. Launch Report

Create:

`docs/PIPELINE_TEST_<number>_REPORT.md`

The report must include:

- Product
- App path
- Source inputs read
- Artifacts generated
- UX audit summary
- Component plan summary
- Motion plan summary
- Build result
- Smoke test result
- Known fallbacks
- Local run command

## Pass Criteria

The pipeline passes only when:

- App dependencies install.
- Production build passes.
- Local smoke test returns HTTP 200.
- Report documents all real fallbacks.
- No generated build output or `node_modules` is committed.

