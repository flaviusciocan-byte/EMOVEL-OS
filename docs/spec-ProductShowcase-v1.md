# ProductShowcase — Component Specification

**Document type:** Component & Section Contract Specification (spec-first)
**Owner:** AI UX Architect / Component Registry
**Status:** v1 — Design Direction (pre-implementation)
**Date:** 2026-06-24
**Registry:** Component Registry v1.1
**Scope:** Builder component `ProductShowcase` + the primitives it composes
**Execution-order note:** This is a *specification*, not implementation. Build is gated behind execution steps 1–2 (Shared Layer + SectionSurface integration; component mapping 01–10). It does **not** start the Composer path.

---

## 0. Premise — one layout, three products

The reference set (Ferrari / Realme / DJI product pages) is not three layouts. It is **one horizontal three-band grid** rendered under two variants:

- **`split`** — left identity panel (~25%), center hero (~50%), right stacked feature cards (~25%).
- **`fullbleed`** — center hero occupies the full width; the left identity text overlaps the hero via a corner gradient overlay (top-left).

Therefore EMOVEL ships **one** component, `ProductShowcase`, with a `layout` discriminant — not three components. The grid is the invariant; the variant only changes how the three logical regions (`identity`, `hero`, `features`) are placed.

The hero asset (a ComfyUI render/image) is a **slot**. The grid must lock and validate *before* that asset exists. The asset never blocks the grid.

---

## 1. Position in the Registry

`ProductShowcase` is a **section-level component** in Registry v1.1. It:

- **Adopts `SectionSurface`** as its outer wrapper (it does not paint its own background, padding rhythm, or section boundary — `SectionSurface` owns those via the Shared Layer). Reuse over re-creation, per architecture.
- **Composes existing primitives** where they already exist, and **introduces four registry primitives** that the reference set proves are reusable across many product pages: `HeroProductFrame`, `FeatureCard`, `SpecBlock`, `CTAPill`. `NavBar` already exists in the app shell and is referenced, not redefined here.
- **Produces no JSX from AI.** AI emits Page Schema; this component is a render target keyed by `type: "ProductShowcase"`. The schema is validated (Section 9) before render.

Registry id: `emovel.section.product-showcase`
Registry kind: `section`
Surface owner: `SectionSurface`

---

## 2. Shared Layer contract (inherited — never redeclared)

Per Registry v1.1, every component inherits the Shared Layer. `ProductShowcase` **consumes** these and **must not redeclare** them in its own props:

| Shared prop | Meaning for `ProductShowcase` |
|---|---|
| `universe` | Visual world token bundle; selects the active theme record (Section 7). All color/font/elevation resolve from here. |
| `surface` | Passed straight to `SectionSurface` (tone/elevation of the band container). |
| `motion` | Governs hero reveal, card stagger, parallax intensity (Section 6). `none` disables all implicit motion. |
| `spacing` | Drives band gutters and internal rhythm; multiplies the 4px baseline grid. |
| `anchorId` | Section anchor for in-page nav / deep links; surfaced in the right dock inspector. |
| `aiLock` | Edit-lock policy for AI regeneration (Section 8.3). |

> **Rule:** `ProductShowcaseProps` extends the Shared Layer base type; it declares **only** the own-props in Section 3. Any PR that re-adds `surface`, `motion`, etc. to `ProductShowcaseProps` is rejected at review.

---

## 3. Own props — `ProductShowcaseProps`

Only the props specific to this component. TypeScript is the source of truth (Section 9); this table is the human contract.

| Prop | Type | Req | Default | Notes |
|---|---|---|---|---|
| `layout` | `"split" \| "fullbleed"` | yes | `"split"` | Variant discriminant. Controls band placement (Section 5). |
| `identity` | `IdentityPanel` | yes | — | Left region: eyebrow, headline (promise), product name, optional `SpecBlock`, CTA group. |
| `hero` | `HeroSlot` | yes | — | Center region. Holds the `HeroProductFrame` asset reference. May be empty pending asset (Section 8). |
| `features` | `FeatureCard[]` | no | `[]` | Right region (split) — 0–3 stacked cards. Ignored placement-wise in `fullbleed` (see 5.3). |
| `overlay` | `OverlayConfig` | no | — | **Only honored when `layout="fullbleed"`.** Corner gradient + text placement over hero. |
| `ctaGroup` | `CTAGroup` | no | — | Primary + optional secondary `CTAPill`. If present inside `identity`, that wins; this is the section-level fallback. |

### 3.1 `IdentityPanel`

| Field | Type | Req | Notes |
|---|---|---|---|
| `eyebrow` | `string` | no | Small label above headline (often mono). |
| `headline` | `RichText` | yes | The **promise** line (typography role `display`, Section 6). |
| `productName` | `string` | yes | Typography role `name`. |
| `spec` | `SpecBlock` | no | Short technical paragraph under headline. |
| `cta` | `CTAGroup` | no | Up to two `CTAPill`s. |

### 3.2 `HeroSlot`

| Field | Type | Req | Notes |
|---|---|---|---|
| `assetRef` | `AssetRef \| null` | yes | Pointer into the asset manifest. `null` = empty slot → MISSING ASSET in canvas (Section 8). |
| `alt` | `string` | yes when `assetRef` set | Accessibility text. Required at export if asset present. |
| `motionHint` | `"scale" \| "parallax" \| "reveal" \| "none"` | no | Implicit motion for the frame; clamped by Shared `motion` (Section 6). |
| `frameRatio` | `"square" \| "portrait" \| "landscape" \| "free"` | no | Hint for `HeroProductFrame` aspect handling. |

### 3.3 `OverlayConfig` (fullbleed only)

| Field | Type | Req | Notes |
|---|---|---|---|
| `corner` | `"top-left" \| "top-right" \| "bottom-left" \| "bottom-right"` | yes | DJI pattern defaults `top-left`. |
| `gradientToken` | `ThemeToken` | yes | Resolved from theme — **no hardcoded gradient** (Section 7). |
| `textScrim` | `boolean` | no | Adds a readability scrim behind overlapping text. |

---

## 4. Composed primitives (registry contracts)

These are extracted as **registry primitives**, each with its own minimal contract. They inherit the Shared Layer too. Full per-primitive specs are follow-on documents; the contracts below are the binding surface `ProductShowcase` depends on.

### 4.1 `HeroProductFrame` — `emovel.primitive.hero-product-frame`
Container that holds the product asset and permits implicit motion (scale / parallax / reveal). Owns aspect handling and the MISSING ASSET render state. Does **not** own copy.
Key props: `assetRef`, `alt`, `motionHint`, `frameRatio`.

### 4.2 `FeatureCard` — `emovel.primitive.feature-card`
One idea per card: image + a single hero figure (e.g. `48MP`, `765G`, `30W`) + small label beneath. **The figure is always the largest type element in the card** (Section 6.3). Stacks 0–3 in the right band.
Key props: `assetRef` (optional), `figure: string`, `unit?: string`, `label: string`.

### 4.3 `SpecBlock` — `emovel.primitive.spec-block`
Small, low-emphasis technical paragraph (role `spec`), optionally bulleted with a `//` marker. Data, not promises.
Key props: `items: SpecItem[]`, `marker?: "//" | "•" | "none"`.

### 4.4 `CTAPill` — `emovel.primitive.cta-pill`
Rounded action with optional icon. Two styles: `solid` (primary) and `outline` (secondary). Colors resolve from theme.
Key props: `label: string`, `variant: "solid" | "outline"`, `icon?: IconToken`, `href?: string`, `action?: ActionRef`.

### 4.5 `NavBar` — *existing app-shell component (referenced, not redefined)*
Minimal: logo left, 3–4 links center, one `CTAPill` right; transparent over hero, small height. `ProductShowcase` does **not** embed `NavBar`; the page composes it above the section. Listed here only to record the dependency edge.

---

## 5. Section contract — the band grid

`ProductShowcase` renders a single horizontal grid inside `SectionSurface`. Proportions and overflow are part of the contract, not styling preference.

### 5.1 `split` (Ferrari / Realme)

```
┌──────────── SectionSurface ────────────────────────────┐
│ identity (~25%) │   hero (~50%)   │  features (~25%)    │
│  eyebrow        │  HeroProductFrame│  FeatureCard ▢      │
│  headline       │  (asset / slot) │  FeatureCard ▢      │
│  productName    │                 │  FeatureCard ▢      │
│  SpecBlock      │                 │  (0–3 stacked)      │
│  CTA group      │                 │                     │
└─────────────────┴─────────────────┴─────────────────────┘
```

- Track ratio: `minmax(0, 1fr) minmax(0, 2fr) minmax(0, 1fr)` ≈ **25 / 50 / 25**.
- Gutter from Shared `spacing` (multiples of the 4px baseline grid).
- `features` renders 0–3 cards; with 0 cards the right track collapses and center may absorb the freed space (implementation detail, but the *contract* is: empty features must not leave a dangling empty column).

### 5.2 `fullbleed` (DJI)

- Hero occupies 100% width; `HeroProductFrame` is the bed.
- `identity` text is positioned over the hero via `OverlayConfig.corner` with a theme gradient + optional scrim.
- This is a **z-stack**, not three columns.

### 5.3 Variant rules
- `overlay` is honored **only** in `fullbleed`; ignored (and flagged in validation as a warning, not an error) in `split`.
- `features` in `fullbleed`: not placed in a right column. Either omitted or rendered as an overlay strip — **MVP omits them**; this is an explicit open question (Section 11).
- Switching `layout` must never drop required content; it only re-places it.

### 5.4 Responsive collapse (contract, breakpoint values from theme)
- Below the section's collapse breakpoint, the three bands stack vertically in reading order: `identity → hero → features`.
- `fullbleed` keeps hero as a full-width bed with identity moving to a stacked block above/below per `overlay.corner` vertical bias.
- No horizontal scroll at any breakpoint.

---

## 6. Typography & motion contract

### 6.1 Three strict roles
The reference set proves a fixed three-level hierarchy. `ProductShowcase` exposes exactly these semantic roles; it never sets a font family directly.

| Role | Use | Resolves to |
|---|---|---|
| `display` | Promise headline ("This is where your cinematic story is seen") | `theme.fonts.display` |
| `name` | Product name (e.g. *Realme X50*) | `theme.fonts.name` |
| `spec` | Technical text, figures, labels (mono/sans, gray) | `theme.fonts.spec` |

### 6.2 Binding, not hardcoding
Font families are **theme tokens**, not literals. The intended stack (e.g. a display face like Clash Display / Space Grotesk, a name face like Satoshi, a mono spec face like JetBrains Mono) is supplied by the active `universe`/theme record — see the uncertainty note in Section 11, because the current shipped app stack is **not** that set.

### 6.3 The two hierarchy laws (extracted rules)
1. **The figure is the hero of a `FeatureCard`.** The number/spec is always the largest type element in that card; the label is small beneath it.
2. **The benefit outranks the spec.** The promise `display` line is always larger/heavier than any `spec` text in the same region.

These are validation-checkable invariants, not soft guidance (Section 9.3).

### 6.4 Motion
Implicit motion (hero `scale` / `parallax` / `reveal`, card stagger) is owned by the frame/cards but **clamped by Shared `motion`**: `motion="none"` forces all hints to static. Motion is presentation, never required for comprehension.

---

## 7. Theme as data

`ProductShowcase` has **zero hardcoded colors, gradients, or fonts.** It receives the active theme (via `universe`/Shared Layer) and paints from it. Each reference page is just a different theme record over the same component:

- `dark-cinematic` (Ferrari-class: dark base, restrained accent)
- `light-cold-premium` (Realme-class: cold white + cool accent)
- `pure-noir` (DJI-class: editorial black)

These are **new theme records** to add to the theme collection; they are data, not component branches. Every color/gradient/elevation referenced anywhere in this spec (`gradientToken`, CTA fills, scrims) resolves through the theme. This is the same `theme.json`-style contract the render engine already targets.

> Brand law still governs the *default* EMOVEL universe (charcoal base, ivory clarity, gold accent, soft-gray structure, electric-blue micro-signal, **no purple**). Product-page themes above are content themes layered on the engine, not replacements for the EMOVEL OS surface palette.

---

## 8. Asset & empty-state policy

### 8.1 Hero slot may be empty
`hero.assetRef = null` is **valid** in the builder. The grid renders and locks without the ComfyUI asset. This is the whole point of treating hero as a slot.

### 8.2 Canvas vs export (per architecture)
- **In the Builder canvas:** a missing required asset renders the explicit **`MISSING ASSET`** state (via `HeroProductFrame`). It never silently degrades to a blank or a placeholder image — placeholders/fake assets are forbidden.
- **On export:** if a **required** asset is absent, export **fails explicitly** with a named reason (which slot, which component). It does not emit a broken page.

### 8.3 Required vs optional assets
| Asset | Required for export? |
|---|---|
| `hero.assetRef` | **Yes** — a ProductShowcase with no hero asset cannot export. |
| `FeatureCard.assetRef` | No — a card may be figure-only. |
| `identity.*` text | Yes (headline, productName). |
| `hero.alt` | Required **iff** `hero.assetRef` is set. |

`aiLock` governs whether AI regeneration may replace a locked asset/slot; a locked hero slot is preserved across regenerate.

---

## 9. Source of truth — TypeScript + Zod, generated manifest

### 9.1 TypeScript is canonical
The contract above is enforced by the TS types. `registry.manifest.json` is **generated from these types — never hand-written.**

```ts
// registry/sections/ProductShowcase.tsx  (illustrative contract, not final code)
import { z } from "zod";
import type { SharedLayer } from "@/registry/shared";

const HeroSlot = z.object({
  assetRef: AssetRef.nullable(),
  alt: z.string().optional(),
  motionHint: z.enum(["scale", "parallax", "reveal", "none"]).optional(),
  frameRatio: z.enum(["square", "portrait", "landscape", "free"]).optional(),
}).refine(v => v.assetRef == null || !!v.alt, {
  message: "hero.alt is required when hero.assetRef is set",
  path: ["alt"],
});

export const ProductShowcaseProps = z.object({
  layout: z.enum(["split", "fullbleed"]).default("split"),
  identity: IdentityPanel,                 // headline + productName required inside
  hero: HeroSlot,
  features: z.array(FeatureCard).max(3).default([]),
  overlay: OverlayConfig.optional(),
  ctaGroup: CTAGroup.optional(),
});

// Own-props ONLY. Shared Layer is mixed in by the registry base type:
export type ProductShowcaseInput =
  SharedLayer & z.infer<typeof ProductShowcaseProps>;
```

### 9.2 Validation gate
The Page Schema node `{ type: "emovel.section.product-showcase", props }` is validated by `ProductShowcaseProps` **before render**. Failure blocks render and surfaces the reason in the run pipeline (Intent → Schema → Validate → Render), consistent with the OS product spec.

### 9.3 Semantic validators (beyond shape)
- `overlay` present while `layout="split"` → **warning**.
- A `FeatureCard` whose `label` type size ≥ `figure` size → **error** (violates 6.3 law 1) — checked at the token level.
- Export-time: required-asset presence (Section 8.3) → **error** if missing.

### 9.4 Generated manifest entry (illustrative)
```jsonc
// registry.manifest.json  — GENERATED, do not edit by hand
{
  "id": "emovel.section.product-showcase",
  "kind": "section",
  "surface": "SectionSurface",
  "sharedLayer": ["universe","surface","motion","spacing","anchorId","aiLock"],
  "variants": ["split", "fullbleed"],
  "composes": [
    "emovel.primitive.hero-product-frame",
    "emovel.primitive.feature-card",
    "emovel.primitive.spec-block",
    "emovel.primitive.cta-pill"
  ],
  "requiredAssets": ["hero.assetRef"]
}
```

---

## 10. Presentation layer is separate from the page

The tilted 3D mockup, the device frame, and the 15s scroll reel are **export/marketing artifacts**, not part of `ProductShowcase`. The component produces a clean, self-contained, autonomous HTML section — exactly what the builder already emits. The reel is generated *from* that HTML placed into a device frame, downstream. **Do not couple the two layers:** the page is the product; the reel is the wrapping. `ProductShowcase` has no props for mockups, device frames, or reels.

---

## 11. Implementation sequence & open questions

### 11.1 Sequence (locks the grid before the asset)
1. Build `ProductShowcase` `split` variant, **hardcoded to a single theme**, to lock the band grid.
2. Extract `FeatureCard` and `CTAPill` as registry primitives.
3. Wire the theme record (`universe`/theme.json) so the section repaints from data — remove the hardcoded theme.
4. Add the `fullbleed` variant (DJI) with `OverlayConfig`.
5. Hero stays an **empty slot** until the ComfyUI asset exists — never block the grid on the asset.

This sequence sits under execution-order steps 1–2 (Shared Layer + SectionSurface, then component mapping). It does **not** start the Composer.

### 11.2 Open questions (stated, not assumed)
- **Fonts:** the intended display/name/spec faces (Clash/Satoshi/JetBrains-class) are **not** in the current app stack (`Inter` + `IBM Plex Mono` today). Treating them as theme tokens defers the decision, but the EMOVEL product-page themes must define real font tokens before `split` can match the references. *Needs a font decision.*
- **Features in `fullbleed`:** MVP omits feature cards in `fullbleed`. If DJI-style overlay specs are wanted, that needs its own placement contract.
- **`NavBar` ownership:** confirmed as app-shell, composed above the section — not embedded. Flag if you want it pulled into the section instead.
- **Asset manifest shape:** `AssetRef` is referenced as the manifest pointer type; its exact schema is owned by the Component Registry asset layer and assumed, not defined here.

---

## 12. Change log
- **v1 (2026-06-24):** Initial spec. One component, two variants; four extracted primitives; band grid 25/50/25; theme-as-data; hero-as-slot with MISSING ASSET / export-fail policy; TS+Zod source of truth with generated manifest.

---

## Delivery record (per EMOVEL output format)

**Files created**
- `docs/spec-ProductShowcase-v1.md` (this document).

**Files edited**
- None.

**What changed**
- Added a spec-first contract for `ProductShowcase` (props, section/band contract, composed primitives, theme-as-data, asset policy, TS+Zod source of truth, generated-manifest entry, presentation-layer separation, implementation sequence).

**What was NOT changed**
- No code. No registry/TS types, no `registry.manifest.json`, no Tailwind/theme tokens, no app components. The planned Shared Layer / SectionSurface / Registry remain unbuilt (execution steps 1–2). The Composer path is untouched.

**Uncertainty**
- Shared Layer, `SectionSurface`, and Registry v1.1 do not yet exist as code — this spec is written against the documented architecture, not live types.
- Display/name/spec fonts are aspirational; the live stack is `Inter` + `IBM Plex Mono`. Typography is bound to theme tokens to defer this, but a font decision is required before visual parity.
- `fullbleed` feature-card placement and the `AssetRef` schema are explicitly deferred (Section 11.2).

**Verification command run + result**
- See assistant message: structural lint (required headings present, no `purple`/`#8B5CF6` literals, fonts bound to `theme.fonts.*` not hardcoded, Shared Layer not redeclared in own-props).
