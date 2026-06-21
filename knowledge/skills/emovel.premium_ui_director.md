# Premium UI Director

## Purpose

Direct the design and layout of ultra-premium landing pages and product pages for EMOVEL productions. This skill operates at the intersection of brand rules, conversion strategy, and UI execution — producing a rigorous, implementable page direction that developers can execute without creative guesswork.

This skill is the authoritative design direction layer before any HTML, TSX, or Webflow page is built. It is powered by UI UX Pro Max methodology and sources its component vocabulary from the 21st.dev component system.

## Inputs

- `product_name` — The name of the product or offer
- `audience` — Who the buyer is: role, pain state, sophistication level
- `offer` — Core transformation the product delivers (before → after)
- `page_type` — `landing-page` | `sales-page` | `product-page` | `waitlist-page`
- `brand_tone` — Visual and copy tone words (e.g., premium, editorial, calm, commanding, minimal)
- `visual_brief` — Reference to the EMOVEL visual brief for this product (hex codes, fonts, layout principles)
- `copy_source` — Reference to the landing page copy file (headlines, section copy, CTAs)
- `tier` — `standard` | `premium` | `cinematic` — controls visual complexity budget

## Outputs

1. **UX Direction Statement** — 3–5 sentences defining the page's experiential goal
2. **Section Hierarchy** — Ordered list of all page sections with purpose statement per section
3. **Component Recommendations** — Per section: named component type, 21st.dev reference if available, implementation note
4. **Visual System** — Active color assignments, font scale, spacing rhythm, border logic for this specific page
5. **Interaction Notes** — Scroll behavior, reveal animations, hover states, transition intent
6. **Implementation Brief** — Developer-ready specification for Next.js + Tailwind + shadcn/ui build
7. **Anti-Patterns List** — Specific things to avoid for this page based on audience and brand

## Rules

### Brand Rules
- Always source color decisions from the EMOVEL visual brief — never invent new colors
- Typography must follow the established system: Inter Tight / Satoshi for headings, Inter for body, IBM Plex Mono for accents
- Spacing base unit is 4px (Tailwind default) — use multiples of 4 for all rhythm decisions
- Border radius: 8px maximum — no rounded-full on content blocks
- CTA buttons: minimum 44px height, Signal Blue (#2F6BFF) primary fill

### Layout Rules
- Mobile-first: design the 390px viewport first, scale up to 1440px
- Hero must fit within the first viewport with a visible hint of the next section
- Use section bands (full-width colored backgrounds) instead of nested card grids for primary sections
- No more than one primary CTA per section — secondary actions may appear but must not compete
- Tables are preferred over icon grids for deliverables and pricing logic
- Process flows use horizontal strips on desktop, vertical stacks on mobile

### Conversion Rules
- Lead with the transformation (outcome) before the mechanism (features)
- CTA copy must be action-first: "Get the Launch Stack" not "Learn More"
- Social proof placement: after the solution section, before pricing
- Guarantee must appear close to — but not inside — the pricing block
- FAQ must address objections in the order they typically arise: legitimacy → specificity → fit → risk
- Closing CTA repeats the hero transformation promise, does not introduce new information

### Quality Rules (UI UX Pro Max)
- No layout section should feel generic — every section must have a deliberate visual decision that makes it non-interchangeable
- Cinematic quality = purposeful restraint: fewer elements, more impact per element
- Premium pages do not explain themselves visually — they assume reader intelligence
- Every motion/animation must serve orientation or emphasis — no decorative animation
- Whitespace is structural, not decorative — use it to create visual weight

### Restrictions
- No generic SaaS layout patterns (feature grid of 6 identical cards, purple gradient hero, blob backgrounds)
- No fake testimonials — use proof types that can be verified or honestly framed
- No visual clutter — maximum 3 visual elements per section (headline, body, CTA or image)
- No backend invention — the page must be implementable as a static or SSG Next.js page
- No fake urgency mechanisms — only use scarcity copy when the scarcity is real

## Workflow

1. Receive all inputs
2. Write the UX Direction Statement — define the page's one job
3. Map the section hierarchy — name each section and state its conversion purpose
4. For each section, select the component type and note the 21st.dev equivalent if available
5. Define the active visual system for this page (not the full brand system — just the active assignments)
6. Write interaction notes per section (scroll, hover, reveal, transition)
7. Compose the implementation brief: stack, file structure, component list, data model, responsiveness notes
8. Write the anti-patterns list specific to this page and audience

## Visual System Template (per page)

```
Background bands:
  Page default: Soft Cloud (#F5F7FA)
  Hero: White (#FFFFFF) or Primary Ink (#101114) [dark hero option]
  Problem: Soft Cloud (#F5F7FA)
  Solution: White (#FFFFFF)
  Deliverables: Deep Graphite (#20242B) — dark band
  Benefits: Soft Cloud (#F5F7FA)
  Proof: White (#FFFFFF)
  Pricing: Primary Ink (#101114) — dark band
  Guarantee: Soft Cloud (#F5F7FA)
  FAQ: White (#FFFFFF)
  Closing CTA: Deep Graphite (#20242B) — dark band
  Footer: Primary Ink (#101114)

Accent colors:
  Primary CTA: Signal Blue (#2F6BFF)
  Success / checkmarks / metrics: Electric Mint (#40D9A3)
  Borders / dividers: Line Gray (#D9DEE7)

Font scale (Tailwind):
  Hero headline: text-5xl md:text-7xl font-bold tracking-tight
  Section headline: text-3xl md:text-4xl font-semibold tracking-tight
  Subheadline: text-xl md:text-2xl font-normal
  Body: text-base md:text-lg font-normal leading-relaxed
  Label / accent: text-sm font-mono uppercase tracking-widest
  Pricing number: text-6xl md:text-8xl font-bold tabular-nums
```

## Component Vocabulary

### Hero Section
- Layout: two-column (copy left, artifact/image right) or centered single-column
- Component type: `HeroSection` — large headline, subheadline, primary CTA, social proof line
- 21st.dev reference: search "hero" → prefer minimal dark/light hero with strong typographic hierarchy
- Never: full-bleed gradient background, animated particle systems, rotating headline carousels

### Problem Section
- Layout: centered single-column, dark-on-light
- Component type: `ProseSection` — editorial paragraph block with strong headline
- No icons required — copy does the work here
- Motion: fade-in on scroll, no other animation

### Solution / Skills Section
- Layout: numbered process strip (horizontal desktop, vertical mobile)
- Component type: `ProcessStrip` or `FeatureList`
- 21st.dev reference: search "steps" or "numbered list" → prefer horizontal with numbered badges
- IBM Plex Mono for skill names, Inter for descriptions

### Deliverables Section
- Layout: dark band with table
- Component type: `DataTable` on dark background
- Electric Mint (#40D9A3) for checkmarks and metric highlights
- Never: icon grid — use table for deliverables

### Benefits Section
- Layout: 2-column or 3-column card grid (light background)
- Component type: `FeatureCard` — headline + 2-3 sentence benefit statement
- No icons unless functional — use type hierarchy instead
- 21st.dev reference: search "feature cards" or "bento grid"

### Social Proof Section
- Layout: centered, light background, single quote block or logo strip
- Component type: `QuoteBlock` or `ProofStatement`
- Use only real proof or honestly framed system proof
- Never: fake avatar testimonials with stock photos

### Pricing Section
- Layout: dark band, 3-tier pricing cards
- Component type: `PricingTable` — tier name, price, feature list, CTA button
- Signal Blue for recommended tier highlight
- Electric Mint for checkmarks
- 21st.dev reference: search "pricing" → prefer dark background with card-based tiers

### Guarantee Section
- Layout: light band, centered, icon + headline + short paragraph
- Component type: `TrustBlock`
- Keep visually quiet — this should reassure, not oversell

### FAQ Section
- Layout: light background, accordion or two-column Q&A
- Component type: `Accordion` (shadcn/ui Accordion is sufficient here)
- IBM Plex Mono for question labels optional

### Closing CTA Section
- Layout: dark band, centered, headline + subheadline + primary CTA
- Component type: `CTABand`
- Repeat the transformation promise from the hero — do not introduce new copy
- 21st.dev reference: search "CTA section" or "call to action band"

## Examples

- Premium landing page for EMOVEL Launch Stack v1 (founder/operator product, $497, conversion-first)
- Product page for a digital strategy framework sold to agencies ($1,500+)
- Waitlist page for a SaaS tool targeting technical founders

## Dependencies

- `emovel.visual_brief` — provides the brand color palette, typography, and image direction
- `emovel.copy_framework` — provides headline, CTA, and proof copy
- `emovel.page_builder` — base page structure logic (this skill extends and overrides for premium output)

## Related Skills

- `emovel.visual_brief`
- `emovel.page_builder`
- `emovel.offer_architect`
- `emovel.copy_framework`

## Stack References

- UI UX Pro Max — `knowledge/stack-library/UX_LAYER.md`
- 21st.dev — `knowledge/stack-library/UX_LAYER.md`
- shadcn/ui — base component system
- Tailwind CSS — utility-first styling
- Next.js App Router — implementation target
