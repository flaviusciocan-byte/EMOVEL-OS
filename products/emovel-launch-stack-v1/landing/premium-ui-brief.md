# Premium UI Brief — EMOVEL Launch Stack v1 Landing Page

Produced by: `emovel.premium_ui_director`
Source tools: UI UX Pro Max · 21st.dev · EMOVEL Visual Brief · Landing Page Copy

---

## UX Direction Statement

This page has one job: make the underlaunched operator feel that their product idea is about to become a real market asset. The visual language should feel like a premium command center — structured, decisive, and sharp — not like a course marketplace or AI template bundle.

The page earns trust through precision. Every visual decision should signal that EMOVEL is an organized, serious system rather than a casual tool. The buyer should feel that buying this gives them the clarity they have been stalling on, and that the price is obviously justified compared to the alternative (hiring a strategist, copywriter, and designer separately).

Calm and commercial. Cinematic in pacing, not in decoration. Conversion-first in structure, not in pressure tactics.

---

## Visual System (Active Assignments)

### Color Bands

| Section | Background | Text Color |
|---|---|---|
| Nav | `#FFFFFF` with subtle border `#D9DEE7` | `#101114` |
| Hero | `#FFFFFF` | `#101114` |
| Problem | `#F5F7FA` | `#101114` |
| Solution / Skills | `#FFFFFF` | `#101114` |
| Deliverables | `#20242B` (dark band) | `#FFFFFF` |
| Benefits | `#F5F7FA` | `#101114` |
| Proof / Trust | `#FFFFFF` | `#101114` |
| Pricing | `#101114` (darkest band) | `#FFFFFF` |
| Guarantee | `#F5F7FA` | `#101114` |
| FAQ | `#FFFFFF` | `#101114` |
| Closing CTA | `#20242B` (dark band) | `#FFFFFF` |
| Footer | `#101114` | `#F5F7FA` |

### Active Accent Colors

- **Primary CTA fill:** Signal Blue `#2F6BFF`
- **CTA hover:** `#1A55E8` (Signal Blue darkened 10%)
- **Success / checkmarks / metric highlights:** Electric Mint `#40D9A3`
- **Borders and dividers:** Line Gray `#D9DEE7`
- **Inactive / secondary text:** `#6B7280` (gray-500 equivalent)
- **Mono accent labels:** `#2F6BFF` on light, `#40D9A3` on dark

### Typography Scale

```
Hero headline:      font-family: 'Inter Tight', sans-serif
                    font-size: 3.5rem (56px) desktop / 2.25rem (36px) mobile
                    font-weight: 700
                    line-height: 1.1
                    letter-spacing: -0.03em

Section headline:   font-family: 'Inter Tight', sans-serif
                    font-size: 2.25rem (36px) desktop / 1.75rem (28px) mobile
                    font-weight: 600
                    line-height: 1.15
                    letter-spacing: -0.02em

Subheadline:        font-family: 'Inter', sans-serif
                    font-size: 1.25rem (20px) desktop / 1.125rem (18px) mobile
                    font-weight: 400
                    line-height: 1.5
                    color: #6B7280

Body:               font-family: 'Inter', sans-serif
                    font-size: 1rem (16px) desktop / 1rem mobile
                    font-weight: 400
                    line-height: 1.75
                    color: #101114

Accent label:       font-family: 'IBM Plex Mono', monospace
                    font-size: 0.75rem (12px)
                    font-weight: 500
                    letter-spacing: 0.1em
                    text-transform: uppercase

Pricing number:     font-family: 'Inter Tight', sans-serif
                    font-size: 4rem (64px)
                    font-weight: 700
                    letter-spacing: -0.04em
                    tabular-nums
```

### Spacing System

- Base unit: 4px
- Section vertical padding: 96px desktop / 64px mobile (`py-24 md:py-24`)
- Content max-width: 1200px (`max-w-5xl` for copy, `max-w-6xl` for full layouts)
- Component internal padding: 32px (`p-8`)
- Gap between cards: 24px (`gap-6`)
- Hero bottom padding before next section hint: allow 80px minimum of next section to be visible on desktop

### Border & Radius Rules

- Cards: `rounded-lg` (8px)
- Buttons: `rounded-lg` (8px)
- Input fields: `rounded-md` (6px)
- No `rounded-full` on content blocks — only acceptable on small badge pills
- Border color: `#D9DEE7` at `1px`
- Card border on light backgrounds: `border border-[#D9DEE7]`
- Card border on dark backgrounds: `border border-white/10`

---

## Section Hierarchy

### 1. Navigation

**Purpose:** Orient the user, establish brand credibility, remove distraction.

Layout: Sticky transparent nav that transitions to white with border on scroll. Logo left, single CTA button right.

Do not add: multiple nav links, mega menus, hamburger icon with expanded link list. This is a single-product page — one CTA is the only nav action.

Component: `StickyNav` — logo + single CTA button.

---

### 2. Hero

**Purpose:** Deliver the core promise in under 5 seconds. Force the reader to identify as the buyer.

Layout: Centered single-column. Full viewport height on desktop. Clear section continuation hint below.

Elements:
- Overline label (IBM Plex Mono): "EMOVEL Launch Stack v1"
- Hero headline (Inter Tight, 56px): "Turn Your Raw Product Idea Into A Launch-Ready Offer"
- Subheadline (Inter, gray): "A premium AI-powered launch system that turns your product idea into a clear audience profile, offer stack, pricing strategy, landing page copy, visual brief, funnel map, and 14-day launch plan."
- Primary CTA button (Signal Blue): "Get The Launch Stack"
- CTA microcopy below button (small, gray): "Built for one product idea. Delivered as a complete launch package."
- Social proof line (optional below CTA): "Trusted by founders, consultants, and micro-agency operators"

Visual: Restrained. No hero image required. Optional: faint monochromatic grid or section-rule below the copy for editorial depth. If image: dark workspace photograph (operator at desk, sharp lighting) floated right on desktop only.

Motion: Hero text fade-in on load — staggered 100ms per element. Button appears last with slight upward translate.

---

### 3. Problem

**Purpose:** Name the exact frustration the buyer is living right now. Create cognitive recognition before offering the solution.

Layout: Centered, single-column, light gray band. Editorial prose — no bullet lists here.

Elements:
- Section headline: "Your product is not stuck because it is bad. It is stuck because it is unclear."
- Body paragraphs (verbatim from landing-page-copy.md Problem section)
- No CTA in this section — let the problem breathe

Visual: Maximum typographic weight. No images, no icons. Optional: a thin horizontal rule above the section headline in Electric Mint.

Motion: Fade-in on scroll entry.

---

### 4. Solution — The Seven Skills

**Purpose:** Introduce the system structure. Establish that this is not a prompt pack or a template — it is a structured process.

Layout: White band. Headline centered, then horizontal process strip (7 steps) on desktop, vertical stack on mobile.

Elements:
- Section headline: "One structured system for the assets every launch needs."
- Body intro: 2-3 sentences (from copy file)
- Process strip: 7 numbered items — each with skill name (IBM Plex Mono) + 1-line description

Skills in order:
1. Audience Builder — defines the buyer, pain, desire, and language
2. Offer Architect — frames your product as a transformation with bonuses and guarantee
3. Pricing Engine — sets the right price, tiers, payment plan, and upgrade logic
4. Copy Framework — produces the hero, sections, CTA flow, and FAQ copy
5. Page Builder — gives you the complete landing page structure
6. Visual Brief — defines colors, typography, imagery, and creative direction
7. Funnel Builder — maps how traffic moves from interest to sale

Component: Horizontal numbered strip with connector lines on desktop. Each item: numbered badge (Signal Blue) + skill name + description.

21st.dev reference: "steps horizontal" or "numbered feature strip"

Motion: Steps reveal left-to-right on desktop (staggered 80ms per step). Stack fades in on mobile.

---

### 5. Deliverables

**Purpose:** Show exactly what the buyer receives. Justify the price before it appears.

Layout: Dark band (`#20242B`). Full-width section with centered headline and a two-column table.

Elements:
- Section headline (white): "Your complete launch foundation."
- Table: 2 columns — Deliverable name | What It Does (8 rows from copy file)
- Electric Mint checkmarks or row indicators
- No pricing in this section — just the value inventory

Component: `DarkDataTable` — table on dark background with white text, Electric Mint accents.

Visual: Table rows with subtle white/10 border separators. Alternating row background `white/5` for scannability.

Motion: Table rows reveal with staggered fade (50ms per row) on scroll entry.

---

### 6. Benefits

**Purpose:** Translate each deliverable into a buyer-felt outcome. Move from "what you get" to "what changes for you."

Layout: Light gray band. 2×3 card grid on desktop (6 benefit cards, but only 5 copy blocks — use 5-card layout). 1-column stack on mobile.

Elements:
- Section headline: "Launch with sharper thinking before you spend on design, ads, or development."
- 5 benefit cards (from copy file): each with short bold headline + 2-sentence explanation
- Cards: white background, Line Gray border, 8px radius
- No icons on cards — use type hierarchy

Benefit blocks:
1. Sell the outcome, not the features
2. Charge with confidence
3. Build the page faster
4. Stay visually consistent
5. Publish with a plan

Component: `FeatureCardGrid` — 5 white cards on gray band.

21st.dev reference: "feature cards" or "benefit grid"

---

### 7. Proof / Trust

**Purpose:** Transfer credibility from the EMOVEL system to the buyer's confidence.

Layout: White band, centered. System proof statement (not fake testimonials).

Elements:
- Section headline: "Built from the EMOVEL skill system."
- Body: system proof paragraph (from copy file)
- Outcome anchor quote: italicized placeholder quote styled as a blockquote
- Optional: brief logo/badge strip if launch partners or integrations exist at launch time

Visual: Large centered blockquote with Electric Mint left border. Clean and editorial.

Motion: Quote block slides in from left on scroll.

---

### 8. Pricing

**Purpose:** Make the buy decision obvious. Show that $497 is an easy yes against $2,750 value and a $5,000 alternative.

Layout: Dark band (`#101114`). 3-tier pricing card row.

Elements:
- Section headline (white): "Get the launch assets that usually require a strategist, copywriter, and designer."
- Value stack summary: "Total value: $2,750 — Launch price: $497"
- 3 pricing cards:

| Tier | Price | Highlight |
|---|---|---|
| Starter | $197 | Templates and prompts only |
| Core | $497 | Full launch stack — **recommended** |
| Premium | $1,500 | + strategy session + review support |

- Core tier card: Signal Blue border + "Most Popular" badge
- CTA button per card: Signal Blue fill
- Payment plan note under Core: "Or 3 payments of $197"

Component: `PricingCards` — 3-tier dark background pricing block.

21st.dev reference: "pricing table dark" or "pricing cards"

Motion: Cards stagger-reveal (100ms gap) on section scroll entry.

---

### 9. Guarantee

**Purpose:** Remove the last resistance to buying. Reframe risk from buyer to seller.

Layout: Light gray band. Centered, compact. One visual block only.

Elements:
- Optional shield icon (line icon, 24px stroke)
- Headline: "The Launch-Clarity Guarantee"
- Body: Guarantee copy from copy file (2-3 sentences)
- Note: "This is a clarity and completeness guarantee, not a revenue guarantee."

Visual: Clean, quiet. This section should feel legally precise, not marketing-loud.

---

### 10. FAQ

**Purpose:** Handle purchase objections before they become drop-off reasons.

Layout: White band. Accordion format. Max 7 questions.

FAQ order (objections by likelihood):
1. Is this just a prompt pack?
2. Do I need a finished product?
3. Will this build my landing page for me?
4. What if I have more than one product idea?
5. Can agencies use this for clients?
6. Is there a revenue guarantee?
7. How fast can I use it?

Component: shadcn/ui `Accordion` — single expand, no multi-open.

---

### 11. Closing CTA

**Purpose:** Give the reader who scrolled to the bottom one final, clean reason to buy.

Layout: Dark band (`#20242B`). Centered. Simple and decisive.

Elements:
- Headline (white): "Get the product out of your head and into the market."
- Subheadline (gray): "If your idea has been waiting for the right offer, price, page, and plan, this is the fastest way to turn it into something buyers can understand."
- Primary CTA button (Signal Blue): "Get EMOVEL Launch Stack v1"
- No secondary links, no additional copy

Motion: CTA button pulses subtly (scale 1.0 → 1.02 → 1.0, 2s loop) to draw attention without disrupting.

---

### 12. Footer

**Purpose:** Navigation closure, legal compliance, brand anchor.

Layout: Dark band (`#101114`). Three-column desktop: brand left, links center, legal right.

Elements:
- EMOVEL wordmark / logo (left)
- Optional: 3-4 links (Product, Contact, Privacy Policy, Terms)
- Copyright line
- No newsletter signup in footer — single CTA strategy throughout the page

---

## Interaction Notes

### Scroll Behavior
- Nav: transparent on hero, transitions to `bg-white border-b border-[#D9DEE7]` on scroll past hero
- All sections: `IntersectionObserver`-triggered fade-in with `translateY(16px) → translateY(0)` and `opacity: 0 → 1`
- Default transition: `duration-500 ease-out`
- Stagger multiplier: 80ms per child element

### Hover States
- CTA buttons: background darkens 10%, slight scale `1.01`, `transition-all duration-150`
- Pricing cards: subtle `shadow-lg` lift on hover
- FAQ accordion: question row highlights to `#F5F7FA` background on hover
- Table rows: `bg-white/5` highlight on hover (dark background tables)

### Focus States
- All interactive elements: `focus-visible:ring-2 ring-[#2F6BFF] ring-offset-2`
- Never remove focus outlines

### No-Animation Contexts
- Respect `prefers-reduced-motion` — all scroll animations disable, only static styles apply

---

## Implementation Brief

### Stack

```
Framework:    Next.js 14+ (App Router)
Styling:      Tailwind CSS v3
Components:   shadcn/ui (base components)
UI Source:    21st.dev (premium component adaptations)
Fonts:        next/font/google — Inter, Inter Tight; next/font/local — IBM Plex Mono
Icons:        lucide-react (line icons, 1.5px stroke)
Animation:    CSS transitions + IntersectionObserver (no heavy libraries unless Framer Motion available)
```

### File Structure

```
app/
  page.tsx                    ← Main landing page
  layout.tsx                  ← Root layout with font setup
  globals.css                 ← Tailwind base + CSS custom properties

components/
  landing/
    StickyNav.tsx
    Hero.tsx
    ProblemSection.tsx
    SolutionSection.tsx
    DeliverablesSection.tsx
    BenefitsSection.tsx
    ProofSection.tsx
    PricingSection.tsx
    GuaranteeSection.tsx
    FAQSection.tsx
    ClosingCTA.tsx
    Footer.tsx
  ui/
    (shadcn/ui components — Accordion, Button, Badge, etc.)
```

### CSS Custom Properties

```css
:root {
  --color-ink:       #101114;
  --color-graphite:  #20242B;
  --color-blue:      #2F6BFF;
  --color-mint:      #40D9A3;
  --color-cloud:     #F5F7FA;
  --color-white:     #FFFFFF;
  --color-line:      #D9DEE7;
}
```

### Responsiveness Notes

- Mobile-first: all base styles at 390px width
- Primary breakpoint: `md` (768px) for layout shifts
- Secondary breakpoint: `lg` (1024px) for max-width centering
- Pricing cards: stack vertically on mobile, horizontal row on `md`
- Process strip: vertical stack on mobile, horizontal with connectors on `md`
- Tables: scroll horizontally on mobile (`overflow-x-auto`)

### CTA Placement Summary

| Location | CTA Text | Background |
|---|---|---|
| Nav (sticky) | Get The Launch Stack | Signal Blue button |
| Hero (primary) | Get The Launch Stack | Signal Blue button |
| Pricing (×3 cards) | Get Started / Get The Stack / Get Premium | Signal Blue |
| Closing CTA band | Get EMOVEL Launch Stack v1 | Signal Blue button |

---

## Anti-Patterns for This Page

1. **Generic hero gradient** — No purple, teal, or rainbow gradients. Hero is white with sharp typography.
2. **6-card feature grid with identical icons** — Deliverables use a table; benefits use differentiated cards.
3. **Rotating headline or typewriter effect** — The headline is decisive and static.
4. **Fake testimonial avatars** — Use system proof and honest framing only.
5. **Countdown timer without real scarcity** — No fake urgency.
6. **Decorative blob shapes** — No background blobs, aurora gradients, or glow effects.
7. **Multiple CTAs per section** — One primary CTA per section maximum.
8. **Tiny CTA on mobile** — All CTAs must be at least 44px height and full-width on mobile.
9. **Body copy in headings** — Section headlines are punchy, not explanatory. Explanation belongs in body.
10. **Cookie-cutter AI SaaS pattern** — Dark blue top, floating card grid, social proof logos row — do not replicate this pattern.
