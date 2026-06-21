# GPT-Pilot / Pythagora Build Prompt: Ai Instagram Content Os For Solo Founders

Generated locally by EMOVEL Prompt Studio v1.4 on 2026-06-21T16:54:33.979Z.

Use this prompt with GPT-Pilot or Pythagora to create a runnable Next.js application. Do not call paid APIs unless a human explicitly adds keys and approves the integration.

## Project Summary

**Working promise:** Turn this digital product idea into a paid, outcome-led offer.

**Raw prompt:** Create a premium landing page and Gumroad-ready product package for: AI Instagram Content OS for solo founders

**Buyer:** a creator, consultant, or operator buying a structured outcome.

## Product Goal

Build a polished, responsive, production-ready landing app that turns the generated offer, copy, UX plan, visual brief, and launch plan into a convincing customer-facing experience.

## Target User

**Hero direction:** Lead with the buyer's stuck state and the concrete outcome.

**Primary headline draft:** Turn the raw idea into a launch-ready digital product.

**CTA:** Generate production assets

## Route Structure

- `/` - primary landing page.
- `/checkout` - placeholder route for future payment handoff.
- `/thank-you` - placeholder route for post-purchase onboarding.
- `/privacy` - simple policy placeholder if forms are added.

## Component Hierarchy

**Recommended components:**
- Prompt intake panel
- Project type segmented selector
- Output checklist grid
- Generate button with local-only status

## UX Requirements

**Experience goal:** Make the interface feel like a premium production cockpit, not a generic prompt box.

**Checks:**
- One primary action per view.
- Large prompt input remains the visual anchor.

## Motion Requirements

**Motion intent:** Use motion only to clarify generation state and output arrival.

**Recommended motion:**
- Button hover lift under 2px.
- Output panels fade/slide in after generation.

## Styling Rules

**Tone:** premium, structured, calm, commercially serious.

**Layout:** full-width workbench with a left input column and right output preview on desktop; stacked workflow on mobile.

**Palette:** EMOVEL ink, graphite, signal blue, mint, cloud, white, and line gray.

## Files To Create

- `package.json`
- `app/layout.tsx`
- `app/page.tsx`
- `app/checkout/page.tsx`
- `app/thank-you/page.tsx`
- `app/privacy/page.tsx`
- `app/globals.css`
- `components/AppShell.tsx`
- `components/HeroSection.tsx`
- `components/OfferBreakdown.tsx`
- `components/PricingSection.tsx`
- `components/LaunchPlanSection.tsx`
- `components/FAQSection.tsx`
- `components/FinalCTA.tsx`
- `lib/content.ts`

## Build Constraints

- Use Next.js, TypeScript, and Tailwind CSS.
- Keep all content local in code or markdown-derived constants.
- Do not add paid APIs, external databases, auth, or payments.
- Do not require Docker for the first runnable version.
- Keep the app buildable with `npm install` and `npm run build`.
- Use semantic HTML and accessible controls.
- Include mobile responsive behavior.

## Source Material

- projects/generated/ai-instagram-content-os-for-solo-founders/offer.md
- projects/generated/ai-instagram-content-os-for-solo-founders/copy.md
- projects/generated/ai-instagram-content-os-for-solo-founders/ux-audit.md
- projects/generated/ai-instagram-content-os-for-solo-founders/component-plan.md
- projects/generated/ai-instagram-content-os-for-solo-founders/motion-plan.md
- projects/generated/ai-instagram-content-os-for-solo-founders/visual-brief.md
- projects/generated/ai-instagram-content-os-for-solo-founders/build-plan.md
- projects/generated/ai-instagram-content-os-for-solo-founders/launch-plan.md
- projects/generated/ai-instagram-content-os-for-solo-founders/execution-plan.md
- projects/generated/ai-instagram-content-os-for-solo-founders/ACTION_QUEUE.md

## Acceptance Checklist

- [ ] App installs with `npm install`.
- [ ] App builds with `npm run build`.
- [ ] Landing page includes the generated offer and copy.
- [ ] Route structure exists.
- [ ] Component hierarchy is implemented.
- [ ] UX requirements are visible in layout and CTA flow.
- [ ] Motion requirements are implemented or documented as intentionally deferred.
- [ ] Styling follows the visual brief.
- [ ] No paid API, database, or GPT-Pilot runtime dependency is required by the generated app.
