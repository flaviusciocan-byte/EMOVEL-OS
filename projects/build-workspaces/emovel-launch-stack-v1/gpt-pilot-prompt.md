# GPT-Pilot / Pythagora Build Prompt: EMOVEL Launch Stack v1

Build a polished Next.js, TypeScript, Tailwind landing app for EMOVEL Launch Stack v1.

## Product Goal

Create a premium sales page that sells a $497 launch package for founders and operators who need to turn a raw product idea into a clear offer, pricing strategy, page copy, visual direction, funnel map, and 14-day launch plan.

## Target User

Founders, creators, consultants, and micro-agency operators with real product ideas but scattered positioning, unclear pricing, and no launch-ready sales package.

## Route Structure

- `/` primary landing page
- `/checkout` placeholder for future Gumroad/payment handoff
- `/thank-you` onboarding and delivery placeholder
- `/privacy` simple policy placeholder

## Component Hierarchy

- AppShell
- HeroSection
- ProblemSection
- SkillSystemStrip
- DeliverablesTable
- BenefitsGrid
- PricingSection
- GuaranteeBand
- FAQSection
- FinalCTA

## UX Requirements

- Make the promise obvious above the fold.
- Show this is not a prompt pack.
- Make deliverables and pricing concrete.
- Keep Core at $497 visually primary.
- Use one primary CTA: Get The Launch Stack.

## Styling Rules

Use the EMOVEL palette: ink `#101114`, graphite `#20242B`, blue `#2F6BFF`, mint `#40D9A3`, cloud `#F5F7FA`, white, and line gray. Keep radius at 8px or less. Avoid abstract AI visuals and purple gradients.

## Build Constraints

- No paid APIs.
- No database.
- No authentication.
- No Gumroad API.
- Static local content only.
- Must pass `npm run build`.
