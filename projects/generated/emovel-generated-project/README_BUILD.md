# README_BUILD: Emovel Generated Project

Generated locally by EMOVEL Prompt Studio v1.4 on 2026-06-22T10:38:28.938Z.

## Purpose

This folder contains local production planning files for Emovel Generated Project. Use `gpt-pilot-prompt.md` as the builder prompt for GPT-Pilot or Pythagora.

## How To Use With GPT-Pilot / Pythagora

1. Open GPT-Pilot or Pythagora in its own workspace.
2. Start a new app project.
3. Paste the full contents of `projects/generated/emovel-generated-project/gpt-pilot-prompt.md` as the project brief.
4. Ask the tool to generate a Next.js, TypeScript, Tailwind app.
5. Keep generated app files outside EMOVEL-OS unless you are intentionally creating a product app under `products/{product-slug}/landing-app/`.
6. Run `npm install`.
7. Run `npm run build`.
8. Fix build errors before adding integrations.

## Expected App Output

- A runnable Next.js landing app.
- Local content based on the generated EMOVEL markdown files.
- Route placeholders for checkout, thank-you, and privacy.
- Reusable components matching the generated component hierarchy.
- Styling that follows the visual brief.
- No paid APIs, no database, and no automation side effects.

## Manual Next Steps

- Review generated copy against `offer.md` and `copy.md`.
- Confirm layout quality against `ux-audit.md`.
- Compare components against `component-plan.md`.
- Apply or defer motion from `motion-plan.md`.
- Run local build verification.
- Create a launch report before publishing.
