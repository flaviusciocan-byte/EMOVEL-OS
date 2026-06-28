# Build Handoff: Emovel Generated Project

Generated locally by EMOVEL Prompt Studio v1.3 on 2026-06-22T10:38:32.164Z.

## Product Summary

**Working promise:** Turn this landing page idea into a paid, outcome-led offer.

**Raw prompt:** Create a premium landing page for a productized AI launch system that turns raw ideas into offers, copy, UX direction, build plans, and launch assets.

**Buyer:** a founder or operator who needs a premium conversion page.

**Offer structure:**
- Core transformation: before confusion, after a clear path to single-page landing experience.

## Route Structure

- `/` - premium landing page with hero, outcome proof, system walkthrough, offer, pricing, FAQ, and CTA sections.
- `/checkout` - future checkout or purchase handoff page when commerce is connected.
- `/thank-you` - post-purchase onboarding and delivery instructions.
- `/api/*` - reserved for future local or automation integrations only when required.

## Component Hierarchy

**Recommended components:**
- Prompt intake panel
- Project type segmented selector
- Output checklist grid
- Generate button with local-only status
- Output panel stack
- Markdown export control

## Design Direction

**Tone:** premium, structured, calm, commercially serious.

**Layout:** full-width workbench with a left input column and right output preview on desktop; stacked workflow on mobile.

**Palette:** EMOVEL ink, graphite, signal blue, mint, cloud, white, and line gray.

**Signature element:** output cards that show which EMOVEL source file powered each generated section.

## Motion Direction

**Motion intent:** Use motion only to clarify generation state and output arrival.

**Recommended motion:**
- Button hover lift under 2px.
- Output panels fade/slide in after generation.
- No looping decorative animation.
- Respect prefers-reduced-motion.

## Required Files

- projects/generated/emovel-generated-project/offer.md
- projects/generated/emovel-generated-project/copy.md
- projects/generated/emovel-generated-project/ux-audit.md
- projects/generated/emovel-generated-project/component-plan.md
- projects/generated/emovel-generated-project/motion-plan.md
- projects/generated/emovel-generated-project/visual-brief.md
- projects/generated/emovel-generated-project/build-plan.md
- projects/generated/emovel-generated-project/launch-plan.md
- products/{product-slug}/landing-app/package.json
- products/{product-slug}/landing-app/app/page.tsx
- products/{product-slug}/landing-app/app/layout.tsx
- products/{product-slug}/landing-app/app/globals.css
- products/{product-slug}/landing-app/components/
- products/{product-slug}/landing-app/lib/

## Build Instructions

1. Create a Next.js app with TypeScript and Tailwind in the product landing-app folder.
2. Convert the offer and copy markdown into page sections before styling.
3. Implement the component hierarchy as reusable components.
4. Apply the visual direction with local CSS tokens and responsive layout constraints.
5. Add motion only after the static layout passes build and mobile checks.
6. Run `npm install`.
7. Run `npm run build`.
8. Fix all TypeScript, lint, and rendering errors before launch review.

## Acceptance Checklist

- [ ] Landing page runs locally without paid APIs.
- [ ] All required route sections are present.
- [ ] Offer, copy, pricing, and CTA are visible in the first complete page pass.
- [ ] Component hierarchy matches the generated component plan.
- [ ] Visual direction is implemented with clear spacing, contrast, and responsive behavior.
- [ ] Motion is purposeful and includes reduced-motion behavior.
- [ ] Build passes with `npm run build`.
- [ ] Launch assets and next steps are documented.
