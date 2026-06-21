# Output Checklist

Use this before marking a production pipeline run complete.

## Source Reading

- [ ] Product input file was read.
- [ ] Product offer/copy/visual files were read.
- [ ] Required EMOVEL skills were read.
- [ ] External tool paths were verified from `config/tools.json`.

## Strategy And Copy

- [ ] Offer is outcome-led.
- [ ] Pricing and tier logic are clear.
- [ ] Guarantee is included.
- [ ] Hero has one primary CTA above the fold.
- [ ] FAQ answers real objections.

## UX Audit

- [ ] `UX_AUDIT.md` exists.
- [ ] Section hierarchy is defined.
- [ ] Accessibility notes are included.
- [ ] Anti-patterns are listed.
- [ ] Visual system matches the source brief.

## Component Plan

- [ ] `COMPONENT_PLAN.md` exists.
- [ ] 21st.dev / MCP availability is documented.
- [ ] Fallback component plan is documented if needed.
- [ ] Page components map to app implementation.

## Motion Plan

- [ ] `MOTION_PLAN.md` exists.
- [ ] GSAP or motion-skill availability is documented.
- [ ] Reduced-motion fallback is included.
- [ ] Motion is purposeful, not decorative.

## Next.js App

- [ ] App exists in `<product>/landing-app/`.
- [ ] `package.json` exists.
- [ ] `package-lock.json` exists after install.
- [ ] `app/page.tsx` exists.
- [ ] `app/globals.css` exists.
- [ ] `.next/` is ignored.
- [ ] `node_modules/` is ignored.

## Verification

- [ ] `npm.cmd install` completed.
- [ ] `npm.cmd run build` passed.
- [ ] Local server started.
- [ ] Smoke test returned HTTP 200.
- [ ] Smoke test found expected page text.

## Report

- [ ] Launch report exists in `docs/`.
- [ ] Report includes source inputs.
- [ ] Report includes generated artifacts.
- [ ] Report includes build output summary.
- [ ] Report includes smoke test result.
- [ ] Report includes documented fallbacks.

## Git

- [ ] No `node_modules/` staged.
- [ ] No `.next/` staged.
- [ ] Only source, lockfiles, reports, and pipeline artifacts staged.
- [ ] Commit created.
- [ ] Commit pushed.

