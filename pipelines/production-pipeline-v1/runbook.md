# Runbook

## 1. Create Input

Copy:

```powershell
Copy-Item project-templates\production-pipeline-input.md products\<product-slug>\production-pipeline-input.md
```

Fill every section before running the pipeline.

## 2. Read Inputs

Read:

- Product input file
- Product offer files
- Product copy files
- Product visual brief
- `knowledge/skills/emovel.premium_ui_director.md`
- `knowledge/skills/emovel.page_builder.md`
- `knowledge/skills/emovel.copy_framework.md`

Read external tool references only from their real paths.

## 3. Generate Planning Artifacts

Create in `<product>/landing-app/`:

- `UX_AUDIT.md`
- `COMPONENT_PLAN.md`
- `MOTION_PLAN.md`

Rules:

- If 21st.dev MCP is unavailable, state that and document fallback components.
- If no GSAP/motion skill exists, state that and use CSS motion with `prefers-reduced-motion`.
- Do not claim a tool was connected unless it was actually used.

## 4. Build App

Create a Next.js app in:

```text
products\<product-slug>\landing-app\
```

Minimum implementation:

- App Router
- Static landing page
- Product-specific copy
- Product-specific visual system
- Responsive CSS
- Accessible focus states
- Reduced-motion fallback

## 5. Install

Run inside the app folder:

```powershell
npm.cmd install
```

If npm reports a vulnerable framework version, check the current patched version and update before build.

## 6. Build

Run:

```powershell
npm.cmd run build
```

Fix errors until build passes.

## 7. Smoke Test

Run:

```powershell
npm.cmd run start -- -p <port>
```

Then in another command:

```powershell
Invoke-WebRequest http://localhost:<port> -UseBasicParsing
```

Confirm:

- HTTP 200
- Expected hero/product text exists

Stop the local server after the test.

## 8. Report

Create:

```text
docs\PIPELINE_TEST_<number>_REPORT.md
```

Include:

- Product
- App path
- Result
- Inputs read
- Artifacts generated
- UX audit summary
- Component plan summary
- Motion plan summary
- Build result
- Smoke test result
- Known fallbacks
- Local run command

## 9. Commit

Check staged files before commit:

```powershell
git status --short
git diff --cached --name-only
```

Commit:

```powershell
git add .
git commit -m "<message>"
git push origin main
```

