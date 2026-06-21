# component-plan

## Route Structure

- `/` - primary sales page.
- `/checkout` - future checkout handoff placeholder.
- `/thank-you` - future delivery/onboarding placeholder.
- `/privacy` - simple policy placeholder if email capture is added.

## Component Hierarchy

- `AppShell`
- `HeroSection`
- `ProblemSection`
- `SkillSystemStrip`
- `DeliverablesTable`
- `BenefitsGrid`
- `ValueStackSection`
- `PricingSection`
- `GuaranteeBand`
- `FAQSection`
- `FinalCTA`
- `Footer`

## Content Components

`SkillSystemStrip` should show:

- Audience Builder
- Offer Architect
- Pricing Engine
- Copy Framework
- Page Builder
- Visual Brief
- Funnel Builder

`DeliverablesTable` should show the eight launch outputs and what each does.

`PricingSection` should make Core at $497 the recommended product, with Starter and Premium as context.

## Data Model

Keep product content local in `lib/content.ts` so the first app version does not depend on APIs, CMS, or databases.
