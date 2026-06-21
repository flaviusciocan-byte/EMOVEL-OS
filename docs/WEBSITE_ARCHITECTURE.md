# EMOVEL Website Architecture

## Overview

The official EMOVEL website lives at `apps/emovel-site/`. It is a Next.js 14 App Router application with Tailwind CSS, using the EMOVEL brand system defined in `products/emovel-launch-stack-v1/visual-brief.md`.

---

## Routes

| Route | File | Purpose |
|---|---|---|
| `/` | `app/page.tsx` | Home — hero, products preview, mission, CTA |
| `/products` | `app/products/page.tsx` | All products index, email capture |
| `/products/launch-stack` | `app/products/launch-stack/page.tsx` | Launch Stack v1 sales page |
| `/products/prompt-systems` | `app/products/prompt-systems/page.tsx` | Prompt Systems — coming soon |
| `/products/landing-template-pack` | `app/products/landing-template-pack/page.tsx` | Landing Template Pack — coming soon |
| `/products/instagram-growth-os` | `app/products/instagram-growth-os/page.tsx` | Instagram Growth OS — coming soon |
| `/resources` | `app/resources/page.tsx` | Guides, frameworks, reference docs |
| `/about` | `app/about/page.tsx` | Mission, principles |
| `/contact` | `app/contact/page.tsx` | Contact form |

To add a new product: add an entry to `lib/products.ts`, create `app/products/<slug>/page.tsx`. The products index and home page pick it up automatically.

---

## Component Hierarchy

```
app/layout.tsx          ← Root layout (fonts, Nav, Footer)
├── components/Nav.tsx          ← Sticky nav, mobile hamburger, active-link highlighting
├── components/Footer.tsx       ← Dark footer with links
├── components/FadeIn.tsx       ← IntersectionObserver scroll animation wrapper
├── components/CTAButton.tsx    ← Primary/outline/ghost button with Link or <a>
├── components/ProductCard.tsx  ← Card for /products grid
├── components/EmailCaptureForm.tsx  ← Client component: email input + submit
└── components/ContactForm.tsx       ← Client component: name/email/message form
```

### Brand primitives used across all pages

| Token | Value | Usage |
|---|---|---|
| Primary Ink | `#101114` | Body text, headings |
| Deep Graphite | `#20242B` | Dark section backgrounds |
| Signal Blue | `#2F6BFF` | CTAs, active nav, accents |
| Electric Mint | `#40D9A3` | Section labels, success states, accent lines |
| Soft Cloud | `#F5F7FA` | Alternate section backgrounds |
| Line Gray | `#D9DEE7` | Borders, dividers |
| White | `#FFFFFF` | Primary background |

Typography:
- Headings: Inter Tight (`var(--font-inter-tight)`)
- Body: Inter (`var(--font-inter)`)
- Accents/mono: IBM Plex Mono (`var(--font-mono)`)

Spacing base: 4px. Border radius max: 8px (rounded-lg). CTA min-height: 44px.

---

## Content Model

### Products (`lib/products.ts`)

```ts
interface Product {
  slug: string           // URL slug → /products/<slug>
  name: string           // Display name
  tagline: string        // One-line pitch
  description: string    // Card description (≤ 3 lines)
  price: string          // Display price (e.g. "$497")
  priceAlt?: string      // Alternate pricing line
  status: "available" | "coming-soon"
  href: string           // Internal URL
  category: "Systems" | "Templates" | "OS"
  badge: string          // Card badge label
  deliverables?: string[]
  gumroadUrl?: string    // Gumroad checkout URL
}
```

Adding a future product requires only:
1. Adding an entry to the `PRODUCTS` array in `lib/products.ts`
2. Creating `app/products/<slug>/page.tsx`

---

## Gumroad Integration Plan

All product purchases route through Gumroad. No backend payment processing in the Next.js app.

**Current state:** `gumroadUrl` field in each product object is `"#"` (placeholder).

**Integration steps when ready:**
1. Create the product in Gumroad, copy the product URL
2. Set `gumroadUrl: "https://emovel.gumroad.com/l/<product-id>"` in `lib/products.ts`
3. All CTAButtons on the product page pass `external={true}` and open Gumroad in a new tab
4. Optional: embed Gumroad overlay widget by loading `https://gumroad.com/js/gumroad.js` in layout and adding `data-gumroad-product-id` attribute to buy buttons

**No backend changes required** — Gumroad handles checkout, payment, and delivery.

---

## Email Capture Plan

Email capture appears on:
- `/products` — "Get notified when new products drop"
- Coming-soon product pages (prompt-systems, landing-template-pack, instagram-growth-os)

**Current state:** `EmailCaptureForm` component collects email and sets a `submitted: true` state locally. No data is persisted.

**Integration options (pick one):**

| Option | Complexity | Notes |
|---|---|---|
| Resend + Next.js Route Handler | Low | POST to `/api/subscribe`, Resend saves contact |
| ConvertKit (now Kit) | Low | POST to Kit API endpoint, native tagging |
| Formspree | Zero backend | Replace form action with Formspree endpoint |
| Beehiiv | Low | Embed Beehiiv subscribe form or use their API |

**Recommended path:** Resend API + Route Handler at `app/api/subscribe/route.ts`

```ts
// app/api/subscribe/route.ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();
  await resend.contacts.create({ email, audienceId: process.env.RESEND_AUDIENCE_ID });
  return Response.json({ ok: true });
}
```

Update `EmailCaptureForm.tsx` to POST to `/api/subscribe` instead of calling `setSubmitted(true)` directly.

---

## Future Shop Integration

When the product line expands beyond 4–5 products, a full shop index is needed.

**Planned approach:**
- `/products` becomes a filterable shop page (filter by category, status)
- Categories: Systems, Templates, OS, Bundles
- Each product card gains a "quick buy" button that triggers Gumroad overlay

**No Shopify or Stripe integration planned** — Gumroad handles all commerce.

---

## Deployment

Recommended: Vercel (zero-config Next.js, edge network, preview deploys).

```bash
cd apps/emovel-site
pnpm install
pnpm build
vercel deploy
```

Environment variables needed at deployment:
- `RESEND_API_KEY` — for email capture (when integrated)
- `RESEND_AUDIENCE_ID` — Resend audience to add subscribers to

Domain: `emovel.co` (to be pointed at Vercel deployment)
