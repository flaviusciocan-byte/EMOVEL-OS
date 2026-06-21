# build-plan

## App Target

Create or maintain a Next.js, TypeScript, Tailwind landing app for EMOVEL Launch Stack v1.

## Required Files

- `package.json`
- `app/layout.tsx`
- `app/page.tsx`
- `app/checkout/page.tsx`
- `app/thank-you/page.tsx`
- `app/privacy/page.tsx`
- `app/globals.css`
- `components/`
- `lib/content.ts`

## Build Steps

1. Move offer, copy, pricing, visual, and FAQ content into local constants.
2. Implement the component hierarchy from `component-plan.md`.
3. Apply the visual brief with reusable CSS tokens.
4. Keep the page static and local for v1.
5. Add motion only after the static layout builds.
6. Run `npm install`.
7. Run `npm run build`.
8. Fix all TypeScript and rendering errors.

## Constraints

- No paid APIs.
- No database.
- No authentication.
- No checkout integration until Gumroad or payment link is connected manually.
- App must remain locally runnable.
