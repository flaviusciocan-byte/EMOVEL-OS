# EMOVEL-OS UX Layer — Premium UI Toolkit Registry

Premium UI resources registered for use across EMOVEL productions. These tools operate at the design-execution layer — between the visual brief and the live page implementation.

---

## Tier Context

Both tools below sit at **Tier A** for premium landing page and product UI work. They are not general-purpose tools — they are used specifically when the deliverable demands high-fidelity, conversion-optimised, visually premium output.

---

## Tool: UI UX Pro Max

| Field | Value |
|---|---|
| **Name** | UI UX Pro Max |
| **Identifier** | `ui-ux-pro-max-skill-main` |
| **Tier** | A |
| **Category** | Design / UI Direction |
| **EMOVEL Score** | 9 / 10 |
| **Format** | Skill / Prompt System |

### Role

Acts as an ultra-premium design direction engine — a structured methodology for generating precise UI/UX direction, component hierarchies, and visual system decisions at a quality level above standard AI-generated design prompts.

Applied as a **skill layer** that sits between the EMOVEL brand rules and the actual page implementation. It does not produce code directly — it produces a rigorously structured UI direction that developers and designers can execute without ambiguity.

### Use Cases

- Generating UX direction documents from brand rules and product briefs
- Defining component selection logic (what goes where, why, in what order)
- Producing section rhythm and layout hierarchy for landing pages
- Specifying interaction patterns, motion direction, and micro-copy placement
- Directing typographic scale and spacing systems for premium pages
- Creating implementation briefs for Next.js, Webflow, or Framer builds

### How EMOVEL Uses It

EMOVEL uses UI UX Pro Max as the **direction layer before implementation** — not as a visual design tool, but as a structured intelligence layer that translates the visual brief into an actionable, developer-ready specification.

In the EMOVEL flow:
1. Visual brief defines the brand system (colors, fonts, tone)
2. **UI UX Pro Max** translates that brief into a layout system (sections, components, hierarchy)
3. 21st.dev provides the actual UI components to implement that system
4. Next.js / Tailwind / shadcn receives the implementation brief

### When to Use

- Before building any premium landing page or product page
- When the visual brief exists but has not yet been translated into layout decisions
- When the page must feel cinematic, premium, and conversion-first
- When component choices need to be justified against conversion logic
- When the client or stakeholder needs a structured design brief before a developer starts

### When Not to Use

- Do not use for internal tool UIs, dashboards, or admin panels — those require functional clarity over premium aesthetic
- Do not use when the budget or timeline does not allow execution of premium components
- Do not use to replace an actual design system review when an existing design system already governs the project
- Do not apply when the product is still at ideation stage — the visual brief must exist first

### Integration Notes

- Input: EMOVEL visual brief + product copy + audience definition
- Output: UX direction document, section hierarchy, component map, interaction notes, implementation brief
- Consumed by: `emovel.premium_ui_director` skill
- Works with: 21st.dev component system, Tailwind CSS, shadcn/ui, Next.js App Router
- Register usage: reference `ui-ux-pro-max-skill-main` in any skill that produces premium page direction

---

## Tool: 21st.dev

| Field | Value |
|---|---|
| **Name** | 21st.dev |
| **Identifiers** | `21st-dev`, `21st-sdk`, `21st component system` |
| **Tier** | A |
| **Category** | Design / UI Components |
| **EMOVEL Score** | 9 / 10 |
| **Format** | Component Library / Registry |

### Role

A premium UI component marketplace and code registry that provides production-ready React components built on Tailwind CSS and shadcn/ui conventions. Components are designed for high-quality SaaS, product, and landing page interfaces — above the quality level of most open-source UI kits.

21st.dev operates as EMOVEL's **premium component source** for pages where the design brief demands visual precision, motion, and a non-generic aesthetic.

### Use Cases

- Sourcing hero sections with premium typography and layout
- Implementing feature grids, bento layouts, and section bands that feel editorial
- Adding interaction-rich elements (animated counters, reveal effects, scroll-triggered transitions)
- Finding pre-built pricing tables, comparison blocks, and CTA sections
- Sourcing navigation patterns, footers, and testimonial layouts
- Replacing generic shadcn/ui defaults with premium alternatives

### How EMOVEL Uses It

EMOVEL uses 21st.dev at the **implementation layer** — after the UI direction has been set by UI UX Pro Max and the premium_ui_director skill. The flow is:

1. `emovel.premium_ui_director` produces the section-by-section component map
2. Developer (or Claude Code) references 21st.dev registry to source matching components
3. Components are adapted to EMOVEL brand system (colors, fonts, spacing)
4. Components are composed in the Next.js page

The 21st.dev SDK (when available) allows in-context component installation:
```bash
npx shadcn@latest add "https://21st.dev/r/<component-name>"
```

### When to Use

- When the landing page spec calls for premium, editorial, or cinematic section layouts
- When shadcn/ui base components are too generic for the design direction
- When motion and interaction are part of the page specification
- When the brief requires components that go beyond a standard Tailwind layout
- When the implementation needs to match a design-directed visual system exactly

### When Not to Use

- Do not use 21st.dev components for utility pages, admin tools, or internal dashboards where complexity is a liability
- Do not use when the project has strict bundle size constraints (audit component weight before installing)
- Do not pull components without adapting them to the EMOVEL brand palette — using 21st.dev defaults verbatim will produce generic output
- Do not use for PDF, email, or non-web deliverables

### Integration Notes

- Language: React (TypeScript), Tailwind CSS, Framer Motion, shadcn/ui
- Installation: via 21st.dev registry or `npx shadcn` CLI
- EMOVEL brand adaptation required: replace default colors with Signal Blue (#2F6BFF), Electric Mint (#40D9A3), Primary Ink (#101114)
- Font adaptation required: replace default fonts with Inter Tight / Satoshi (headings), Inter (body), IBM Plex Mono (accents)
- Works with: Next.js App Router, Tailwind v3/v4, shadcn/ui component system
- Does not require a login to browse — components are publicly viewable at 21st.dev

---

## UX Layer Flow Summary

```
EMOVEL Brand Brief
    ↓
UI UX Pro Max (Direction Layer)
    → Section hierarchy
    → Component map
    → Visual system decisions
    → Interaction notes
    ↓
21st.dev (Component Source Layer)
    → Premium components matched to direction
    → Adapted to EMOVEL brand
    ↓
Next.js + Tailwind + shadcn (Implementation Layer)
    → Composed page
    → Mobile-first
    → Conversion-optimised
```

---

## Registry Entry (for tools.json)

```json
{
  "ui-ux-pro-max": {
    "name": "UI UX Pro Max",
    "category": "Design",
    "tier": "A",
    "role": "Premium UI direction engine — translates brand brief into implementation-ready UX specification",
    "format": "skill",
    "identifier": "ui-ux-pro-max-skill-main"
  },
  "21st-dev": {
    "name": "21st.dev",
    "category": "Design",
    "tier": "A",
    "role": "Premium React component registry — production-ready components for editorial and conversion-focused pages",
    "format": "component-library",
    "url": "https://21st.dev"
  }
}
```
