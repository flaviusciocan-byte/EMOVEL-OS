# GPT-Pilot / Pythagora Build Prompt: EMOVEL Landing Template Pack

Build a polished Next.js, TypeScript, Tailwind sales page and template package plan for EMOVEL Landing Template Pack.

## Product Goal

Sell a $97 pack of premium deploy-ready landing page templates for founders, creators, consultants, and builders.

## Target User

Builders who need polished landing pages fast and do not want to rebuild hero sections, pricing blocks, FAQs, CTAs, and mobile layouts from scratch.

## Route Structure

- `/` primary product sales page
- `/checkout` manual Gumroad handoff placeholder
- `/thank-you` delivery instructions
- `/privacy` optional policy route

## Component Hierarchy

- AppShell
- HeroSection
- TemplatePreviewGrid
- IncludedSectionsList
- TechStackSection
- DeploymentSteps
- PricingSection
- FAQSection
- FinalCTA

## Styling Rules

Use EMOVEL brand tokens and a premium UI kit feel. Show template previews, file panels, deployment steps, and reusable section lists. Avoid generic SaaS gradients and decorative blobs.

## Build Constraints

- No paid APIs.
- No database.
- No Gumroad API.
- Static local content only.
- Must pass `npm run build`.
