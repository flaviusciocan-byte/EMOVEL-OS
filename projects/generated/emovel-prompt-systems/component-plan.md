# component-plan

## Route Structure

- `/` - product sales page.
- `/checkout` - manual Gumroad checkout handoff.
- `/thank-you` - product delivery instructions.
- `/privacy` - basic policy if email capture is added.

## Component Hierarchy

- AppShell
- HeroSection
- ProblemSection
- SystemAnatomySection
- IncludedSystemsGrid
- UseCasesSection
- WorkflowSection
- PricingSection
- FAQSection
- FinalCTA

## Content Modules

`SystemAnatomySection` should explain:

- role
- input
- context
- process
- output format
- quality check

`IncludedSystemsGrid` should include:

- Copywriting
- Research
- Positioning
- Strategy
- Content Production
- Quality Control

## Data Model

Keep product content local in `lib/content.ts`. No CMS or API required for v1.
