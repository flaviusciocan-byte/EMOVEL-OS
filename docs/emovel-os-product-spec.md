# EMOVEL OS — Product Specification

**Document type:** Product & Experience Specification
**Owner:** Lead Product Designer / AI UX Architect
**Status:** v1 — Design Direction
**Date:** 2026-06-22
**Scope:** `apps/emovel-prompt-studio` (the EMOVEL OS surface)

---

## 0. Premise

EMOVEL is an **AI Product Operating System**. It is not a dashboard, not a CMS, not an admin panel. The entire product collapses into one motion:

> The user writes one prompt. EMOVEL returns strategy, offer, copy, UX direction, design direction, build plan, and launch assets — as a living, navigable workspace.

The job of the interface is to disappear around that motion. Everything in this document optimizes for one thing: **the distance between intent and a credible, editable result.** The benchmark is the operational calm of Linear, the keyboard-first immediacy of Raycast and Cursor, the typographic restraint of Vercel, and the answer-first composure of Perplexity and Claude Desktop.

---

## 1. Audit — Current State

The audit below is grounded in the live code in `apps/emovel-prompt-studio` (home `app/page.tsx`, `components/NavBar.tsx`, `components/PromptStudio.tsx`, `app/globals.css`, `tailwind.config.ts`, and the route set under `app/`).

### 1.1 The defining problem: the product violates its own brand law

EMOVEL's identity is **black/charcoal base, ivory for clarity, gold as a controlled premium accent, soft gray for structure, electric blue only as a small technical micro-signal, and no purple.** The shipped Prompt Studio is the opposite of that brief:

| Element | Current value | Verdict |
|---|---|---|
| Background | `#05020A` (a near-black tuned violet) | Off-system |
| Primary accent | `#8B5CF6` → `#A855F7` (violet/purple) | **Forbidden color** |
| Glow system | `rgba(139,92,246,…)` everywhere | Off-system |
| Tailwind token `blue` | aliased to `#8B5CF6` (violet) | Misleading + off-system |
| Gold | **absent** | Missing the signature accent |
| Ivory / charcoal neutrals | **absent** | Missing the base palette |

The result reads as a generic "AI app" purple-glow landing page — exactly the category EMOVEL is meant to escape. **This is the single highest-leverage fix in this document.** Nothing else about the experience will feel premium until the palette is corrected, because color is doing 80% of the "generic SaaS" signalling. Section 7 specifies the corrected system in full.

### 1.2 Information architecture is fragmented

The navigation hides a "Command Center" behind a 3×3 grid icon, with five overlapping destinations: `New Project`, `Projects`, `Workspaces` (`builder-workspaces`), `Execution`, `Shop`, plus a separate `Settings` gear. The route set also contains `workspace/[slug]`, `output-preview`, and `projects/[slug]` — at least three different words ("project", "workspace", "output") for what the user experiences as *one generated thing*. The user has no single mental model for "where my work lives."

### 1.3 No keyboard-first spine

The product aspires to Linear / Raycast / Cursor but ships no command palette, no `⌘K`, no keyboard navigation between stages. For a tool whose entire value is *speed from intent to result*, the absence of a keyboard spine is the difference between a toy and an instrument.

### 1.4 The home is a landing page, not an OS

`app/page.tsx` centers a single hero headline + prompt, decorated with four **empty floating "preview cards"** (Strategy / Design / Build / Publish) that contain no real content. These are decorative placeholders — and they quietly violate the "no fake assets / no demo content" rule. There is no returning-user state: no recent projects, no continue-where-you-left-off, no sense that work persists. Every visit looks like a first visit.

### 1.5 Generation is theatrical, not truthful

Pressing Generate runs a fixed `setTimeout(2200ms)` of six animated "stages" (Strategy → Publish) and then routes to `/new-project`. The progress is a pre-scripted animation disconnected from real pipeline state. This is the most dangerous pattern in the product: it trains users to distrust the one moment that has to feel *true*. Progress must be bound to real pipeline events.

### 1.6 Settings is a static readout

`app/settings/page.tsx` is a hardcoded list of badges ("Pipeline v1", "EMOVEL Dark", "3 active") with no controls. It communicates state but affords nothing.

### 1.7 What is already right (keep these)

- The **one-prompt-to-workspace** thesis is correct and clearly held.
- The **six-domain decomposition** (Strategy, Copy, UX, Design, Build, Publish) is a strong, ownable spine — it just needs to become real, navigable artifacts instead of animation labels.
- Type scale instincts are good: tight tracking, heavy display weights, mono for technical labels.
- The composer's structure (textarea + context affordances + example chips + primary action) is the right skeleton.

### 1.8 Audit summary

The current build is a *well-executed version of the wrong product*: a beautiful purple AI landing page. The redesign keeps the thesis and the six-domain spine, and replaces the surface, the IA, the home, the generation truthfulness, and — first of all — the color system, to become a calm, keyboard-first, black-and-gold operating system.

---

## 2. Information Architecture

### 2.1 Mental model

Three nouns, no synonyms:

1. **Prompt** — the intent. Where everything begins.
2. **Project** — the single generated thing. One project contains all six domain artifacts (Strategy, Copy, UX, Design, Build, Launch) plus its run history. "Workspace" and "output" are retired as separate nouns; the *project view* is the workspace.
3. **Library** — everything you've ever made: projects, saved assets, published packages.

Everything else (Execution, Shop/Publish, Settings) is a *mode* or a *destination within* those three nouns, not a competing top-level concept.

### 2.2 Navigation structure

A **persistent left rail** (collapsed to 64px icons by default, expandable to 240px) replaces the hidden grid dropdown. The rail is the spatial anchor; the command palette is the speed layer.

```
┌──────────────────────────────────────────────────────────┐
│  LEFT RAIL (64 / 240px)        TOPBAR (contextual)        │
│  ──────────────────            ────────────────────────── │
│  ◆  EMOVEL            ⌘K        breadcrumb · project name  │
│                                 run status · share · ⋯    │
│  ⌂  Home                                                  │
│  ⊞  Library          ┌────────────────────────────────┐   │
│  ⚡ Runs             │                                │   │
│  ⊕  Publish          │         MAIN CANVAS            │   │
│                       │                                │   │
│  ── workspace ──      │                                │   │
│  ▢ Project A          │                                │   │
│  ▢ Project B          │                                │   │
│                       └────────────────────────────────┘   │
│  ⚙  Settings                                              │
│  ◐  Account                                               │
└──────────────────────────────────────────────────────────┘
```

Top-level rail items:

- **Home** — the composer + continuity surface (Section 3).
- **Library** — all projects (grid/list), saved assets, published packages. Replaces `projects` + `builder-workspaces` + `shop` browse views.
- **Runs** — the execution inbox: every generation/build as a truthful, inspectable run (replaces `execution`). This is the "what is the machine doing" surface.
- **Publish** — launch packaging and destinations (Gumroad, Instagram, Email). Per-project publishing still happens *inside* a project; this is the cross-project publishing home.
- **Settings / Account** — pinned to the bottom.

The active project's six domains appear as a **secondary in-canvas tab bar**, never in the global rail.

### 2.3 Command Center = the Command Palette (⌘K)

The "Command Center" stops being a visual dropdown and becomes a real **Raycast-class command palette**, invoked anywhere with `⌘K`. It is the primary navigation method for power users.

Palette capabilities:

- **Act:** "New project", "Generate", "Re-run Design", "Publish to Gumroad", "Open Settings".
- **Jump:** fuzzy-search any project, asset, or domain ("Strategy of Launch Stack").
- **Ask:** route a natural-language instruction straight into the composer.

Palette structure: a single input, results grouped by `Actions / Projects / Assets / Settings`, arrow-key navigable, `Enter` to execute, `⌘↵` to execute-and-stay. Recent and suggested commands show on open (empty query).

### 2.4 Global keyboard map

| Key | Action |
|---|---|
| `⌘K` | Command palette |
| `⌘↵` | Generate (from composer) / primary action |
| `⌘N` | New project |
| `[` / `]` | Previous / next domain tab |
| `⌘1`–`⌘6` | Jump to domain (Strategy…Launch) |
| `⌘\` | Toggle left rail collapse |
| `G then H / L / R` | Go Home / Library / Runs (Linear-style chords) |
| `Esc` | Dismiss overlay / palette |
| `?` | Keyboard shortcut sheet |

### 2.5 Settings architecture

Settings becomes a real two-pane preferences surface (nav list left, panel right), organized as:

1. **Workspace** — name, default output directory, pipeline version (active pipeline template), skills source.
2. **Generation** — default domains to generate, model/agent routing, autonomy level (draft vs. auto-build), regeneration defaults.
3. **Brand** — the project's *output* brand tokens (the brand EMOVEL designs *for* the user). Distinct from EMOVEL's own UI theme.
4. **Publishing** — connected destinations (Gumroad, Instagram, Email), default targets, credentials status.
5. **Appearance** — EMOVEL OS theme (Dark default), density, reduced motion.
6. **Account** — plan, usage, keys, danger zone.

Every row is an *affordance* (toggle, select, input), not a static badge.

---

## 3. Home Experience

> Goal: the moment EMOVEL opens, the user can either *start* or *continue* in under one second, with zero decoration that isn't real.

### 3.1 Two states, one surface

**First-run / empty intent (no active focus):**
A vertically centered composer (Section 4) under a single, quiet line of intent — not a marketing hero. One sentence, ivory on charcoal, no gradient theatrics:

> *Describe the product. EMOVEL builds the system.*

Below the composer: a thin row of **starter intents** (real, runnable example prompts) and nothing else. No floating placeholder cards.

**Returning user (the default after first project):**
The composer stays at top (smaller, docked), and the space below becomes a **continuity surface**:

- **Continue** — the 1–3 most recent projects as real cards: project name, last-touched domain, run status (Draft / Building / Ready / Published), thumbnail of the actual generated design (or `MISSING ASSET` per the empty-state policy — never a fake image).
- **Pick up where you left off** — a single primary card if there's an in-progress run.
- **Recent runs** — a compact list linking into the Runs surface.

The home answers two questions instantly: *"what can I make"* (composer) and *"what did I make"* (continuity). Nothing else.

### 3.2 Composition rules

- The composer is always the visual and interaction anchor — largest contrast, the only gold element above the fold.
- Continuity content is **soft gray structure** with ivory text; it recedes behind the composer.
- No hero gradient, no ambient purple bloom. A single, near-invisible vignette and one restrained gold light-source behind the composer only (Section 7.5).

---

## 4. Prompt Experience — The Composer

> The composer is the product. It should feel like the best text field ever made for turning intent into a system.

### 4.1 Anatomy

```
┌───────────────────────────────────────────────────────────┐
│                                                           │
│   Describe the product. EMOVEL builds the system.   ⟵ ghost│
│                                                           │
│   |                                                       │  ← input
│                                                           │
│                                                           │
│ ───────────────────────────────────────────────────────── │
│  ⊕ Context   ◇ Scope: Full system ▾   ⚙ Domains (6) ▾     │  ← control row
│                                          Generate  ⌘↵  →   │  ← primary
└───────────────────────────────────────────────────────────┘
```

### 4.2 Behavior

- **Input:** auto-growing textarea, generous line-height, ivory text, mono-tinted placeholder. `⌘↵` generates; `Enter` newlines. No character ceiling visible; soft guidance only.
- **⊕ Context:** attach real inputs — brand files, a URL to analyze, an existing product, reference copy. Each attachment renders as a chip with a type glyph. (Replaces the current dead "+" button.)
- **Scope:** a select that frames the output — *Full system* (all six domains), *Site only*, *Offer only*, *Content only*. This sets expectations *before* generation and maps directly to what the pipeline runs.
- **Domains:** a popover of the six domains with checkboxes; deselecting trims the run. Defaults to all six.
- **Starter intents:** clicking a starter populates the input (editable), never auto-submits.
- **Primary action:** one gold button, `Generate ⌘↵`. It is the only gold-filled element on screen. Disabled-until-intent; on submit it transitions *in place* into the run state — the composer does not teleport to another page.

### 4.3 Intelligence (composer as a thinking surface)

- **Inline intent preview:** as the user types, a quiet line under the control row reflects EMOVEL's parse — *"Product · pricing offer · landing site · launch content"* — so the user sees that they were understood *before* committing. This replaces blind submission with a Perplexity-style "I understood you" beat.
- **Suggested refinements:** if intent is thin ("make a site"), one subtle prompt-assist chip offers to enrich ("Add audience & offer?") — opt-in, never auto-rewriting the user's words.

### 4.4 The AI-never-writes-JSX boundary (surfaced honestly)

Per architecture, AI produces **Page Schema only**, validated before render. The composer reflects this truthfully: on generate, the user sees *Intent → Schema → Validate → Render* as the real run pipeline (Section 5), not a decorative animation. When validation fails, the user is told *why* and offered a one-click regenerate — the gate is a feature, not a hidden failure.

---

## 5. Project Experience — After Generate

> Goal: replace the scripted 2.2s animation with a truthful, inspectable, *fast* run that resolves into a navigable project.

### 5.1 The Run (generation in progress)

The composer transforms in place into a **run panel**. The six domains appear as a vertical or horizontal **pipeline of real steps**, each bound to actual pipeline state:

```
Intent ─▶ Schema ─▶ Validate ─▶ Render
   │
   ├─ Strategy   ✓ done        (2.1s)
   ├─ Offer      ✓ done        (1.4s)
   ├─ Copy       ◐ generating…
   ├─ UX         ○ queued
   ├─ Design     ○ queued
   └─ Launch     ○ queued
```

Truthfulness rules:

- Each step shows **real status** (queued / running / done / failed) and, when available, real elapsed time and a one-line summary of what it produced.
- A step is clickable the instant it completes — the user can start reading Strategy while Design is still rendering (progressive disclosure, like a streaming answer).
- On failure, the step turns to the **soft-red error state**, names the cause, and offers *Retry this step* without restarting the whole run.
- The **validation gate** is a visible step. If Page Schema fails validation, render does not proceed and the user is shown the validation reason.
- Motion is **electric-blue micro-signal only** — a thin running indicator on the active step. No purple, no large ambient blooms.

### 5.2 Resolution

When the run completes, the panel **settles** (it does not navigate away with a hard cut) into the **Project View**: the run pipeline collapses into a status strip at the top, and the six domains become the project's tab bar. The first domain (Strategy) is shown by default, already scrolled to the top.

### 5.3 Project View structure

```
┌ Topbar: ◀ Library / Launch Stack · ● Ready · Share · Publish · ⋯ ┐
├ Tabs: Strategy · Offer · Copy · UX · Design · Build · Launch ─────┤
│                                                                   │
│  [ Domain content — the generated artifact, editable ]           │
│                                                                   │
│  Right dock (optional): ⌥ inspector / regenerate / version       │
└───────────────────────────────────────────────────────────────────┘
```

- **Tabs** map 1:1 to the six (+offer) domains. Each tab is a real artifact, not a label.
- **Per-domain actions:** Regenerate (this domain only), Edit, Version history, Copy/Export.
- **Right dock (collapsible):** context inspector — shows the Page Schema for design/build domains, validation status, and the asset manifest (Component Registry as source of truth). This is where the *aiLock*, *surface*, and *anchorId* shared-layer properties are surfaced for advanced users.

---

## 6. Workspace Experience — Working With Generated Assets

> The project view *is* the workspace. This section defines how the user reads, edits, regenerates, and ships each artifact.

### 6.1 Artifact patterns by domain

Each domain renders in the format that domain deserves — not a uniform text blob:

- **Strategy / Offer / Copy** — document surfaces: clean ivory-on-charcoal long-form with section anchors, inline edit on click, and a one-click *Copy as Markdown* (the existing `CopyMarkdownButton` pattern, retained and restyled).
- **UX** — a flow/structure view: page list + section outline derived from the Page Schema, not prose.
- **Design** — a **canvas preview** of the rendered design (Puck-driven). Missing real assets must render the literal `MISSING ASSET` marker in-canvas (per empty-state policy) — never a fake placeholder image.
- **Build** — the build plan + the validated component manifest, with build status (Draft / Building / Passed / Failed) surfaced honestly (the existing status badge vocabulary, recolored off purple).
- **Launch** — the publish package: Gumroad assets, content, email — each as a real, exportable artifact with a destination status.

### 6.2 Editing model

- **Direct manipulation where possible** (Design via Puck canvas), **structured editing elsewhere** (text inline-edit, schema-aware fields). AI never writes JSX; edits flow through schema and the Component Registry.
- **Regenerate is surgical:** regenerate one domain, one section, or one component — never silently nuke the whole project. Every regenerate creates a version.
- **Version history** per domain: a slim timeline; restore any prior version.

### 6.3 Export & handoff

- Per-artifact export (Markdown, schema JSON, design export).
- **Export fails loudly** if required assets are missing (per architecture rule) — the user sees exactly which asset blocks export, with a jump-to-fix.

### 6.4 Empty-state policy (applied everywhere)

Three honest states, never a fake one:

1. **Not generated yet** — quiet prompt to generate this domain.
2. **Missing asset** — explicit `MISSING ASSET` marker (canvas) or a labeled empty row (lists). Export is blocked.
3. **Failed** — soft-red state with cause + retry.

---

## 7. Visual System

The system the *current* build should have shipped. Every value here is brand-law-compliant: **black/charcoal base, ivory clarity, gold accent, soft-gray structure, electric-blue micro-signal, zero purple.**

### 7.1 Color

**Base (charcoal / black):**

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0A0A0B` | App background (true near-black, neutral — *not* violet-tuned) |
| `--surface-1` | `#101012` | Raised surface / rail |
| `--surface-2` | `#16161A` | Cards, composer body |
| `--surface-3` | `#1E1E23` | Popovers, hover raise |

**Clarity (ivory / text):**

| Token | Value | Use |
|---|---|---|
| `--ivory` | `#F5F3EC` | Primary text, display headings |
| `--text-secondary` | `#A8A6A0` | Secondary text |
| `--text-muted` | `rgba(245,243,236,0.40)` | Hints, placeholders |

**Structure (soft gray):**

| Token | Value | Use |
|---|---|---|
| `--border` | `rgba(245,243,236,0.08)` | Hairline borders |
| `--border-strong` | `rgba(245,243,236,0.14)` | Active/focus borders |
| `--gray-structure` | `#2A2A30` | Dividers, inert chrome |

**Accent (gold — controlled, premium):**

| Token | Value | Use |
|---|---|---|
| `--gold` | `#C9A34E` | Primary accent: the Generate button, active states, key emphasis |
| `--gold-bright` | `#E0BE6A` | Hover / highlight |
| `--gold-dim` | `rgba(201,163,78,0.16)` | Gold tint backgrounds, soft glow |

**Technical micro-signal (electric blue — tiny, only):**

| Token | Value | Use |
|---|---|---|
| `--signal` | `#3B82F6` | *Only* for live technical signals: active run indicator, "generating" pulse, schema-valid tick. Never a surface, never a fill of any large element. |

**Status:**

| Token | Value | Use |
|---|---|---|
| `--ok` | `#5FB98E` (muted emerald) | Passed / Ready |
| `--warn` | `#D8A657` | Building / attention |
| `--error` | `#D06A5C` (soft red) | Failed / missing |

**Discipline rule:** Gold appears **once per view as a fill** (the primary action) and otherwise only as 1px lines, small ticks, or text emphasis. If two gold-filled elements are ever on screen, the hierarchy is broken. This restraint *is* the premium feel.

### 7.2 Typography

- **Display / UI:** `Inter` (retained). Tight tracking for headings (`-0.04em` to `-0.055em`), heavy weights (700–900) reserved for true display moments only.
- **Technical / labels:** `IBM Plex Mono` (retained) for run states, schema, keyboard hints, domain micro-labels — the "this is an instrument" voice.
- **Type scale (1.250 major-third-ish, tuned):**

| Role | Size / Line / Weight / Tracking |
|---|---|
| Display | `clamp(2.4rem, 5vw, 3.8rem)` / 1.0 / 800 / -0.05em |
| H1 | `1.9rem` / 1.1 / 700 / -0.04em |
| H2 | `1.375rem` / 1.2 / 600 / -0.03em |
| Body-L (composer) | `1.0625rem` / 1.6 / 400 |
| Body | `0.9375rem` / 1.55 / 400 |
| Label / mono | `0.6875rem` / 1.2 / 600 / `0.18em` uppercase |

Restraint: heavy black weights are used sparingly — once per surface — not on every heading as the current build does.

### 7.3 Spacing & grid

- **4px base unit.** Spacing scale: `4, 8, 12, 16, 24, 32, 48, 64, 96`.
- **Rail:** 64px collapsed / 240px expanded. **Topbar:** 56px. **Canvas max-width:** 1080px for documents, full-bleed for the design canvas.
- **Radii:** `--r-sm 8px`, `--r-md 12px`, `--r-lg 16px`, `--r-xl 20px` (composer). Pull back from the current 28px "bubbly" radius — premium tools sit around 12–16px.
- **Density:** comfortable default; a compact mode in Appearance settings for power users.

### 7.4 Cards & surfaces

- Cards are **flat charcoal (`--surface-2`) with a single hairline border**, not glassmorphic purple glows. Elevation is communicated by surface step (`surface-1 → 2 → 3`) and a *very* soft shadow, not by neon.
- Hover: border goes from `--border` to `--border-strong`, surface lifts one step. No colored glow on hover except the primary action.
- The composer is the one exception allowed a faint **gold** ambient — see 7.5.

### 7.5 Glow (the one place it's allowed)

The current build glows purple on everything. The corrected system glows **almost nowhere**, and only gold:

- **Composer (focus):** a single, soft gold light-source *behind* the composer — `0 0 120px rgba(201,163,78,0.10)` plus a 1px `--border-strong` ring. Subtle enough to feel warm, never neon.
- **Generate button:** a tight gold shadow `0 10px 40px rgba(201,163,78,0.28)`.
- **Active run step:** a 2px electric-blue running line — the *only* blue glow, and it's hairline.
- Everything else: **no glow.** Glow is a reward for focus, not ambient decoration.

### 7.6 Motion

Calm, fast, purposeful. Linear/Vercel-grade easing, short durations.

| Motion | Spec |
|---|---|
| Easing | `cubic-bezier(0.22, 1, 0.36, 1)` (standard out) |
| Enter (cards, panels) | 240–320ms fade + 8–16px rise |
| Composer → Run | in-place morph, 360ms — *no page teleport* |
| Run step state change | 200ms; electric-blue pulse on the active step only |
| Domain tab switch | 160ms cross-fade |
| Palette open | 120ms scale-from-98% + fade |
| Hover | 150ms |

Rules: respect `prefers-reduced-motion` (already present — keep it). No infinite ambient drift on the home. Motion confirms causality (something happened because you acted), it never performs for its own sake.

### 7.7 Iconography

- Single stroke weight (1.25–1.5px), line icons, ivory at rest, gold or ivory-bright on active. The existing hand-drawn SVG approach is good — unify stroke widths and corner radii across the set.

---

## 8. Figma Layout Specification

Three breakpoints. 4px baseline grid throughout. Components built with Auto Layout and the token set from Section 7.

### 8.1 Desktop — 1440px

- **Columns:** 12-col, 72px margins, 24px gutters → 1296px content well. Document canvas constrained to 1080px centered within the well.
- **Left rail:** 64px collapsed (icon-only) / 240px expanded. Fixed. Bottom-pinned Settings + Account.
- **Topbar:** 56px, full width minus rail; left breadcrumb, right run-status + Share + Publish + overflow.
- **Home (returning):** composer docked top at 760px width, centered in the well; continuity grid below at 3 columns (project cards 416px each, 24px gutter).
- **Home (first-run):** composer centered vertically, 720px width, intent line above, starter intents row below.
- **Run panel:** composer width (760px) holds; six-step pipeline as a left-aligned list inside it.
- **Project view:** tab bar full content-well width; document domains render in the 1080px column; design domain goes full-bleed within the well with a 1px frame.
- **Command palette:** centered overlay, 640px wide, max 480px tall, 12% scrim.

**Figma frames to produce:** `Home / First-run`, `Home / Returning`, `Composer / Idle`, `Composer / Intent-preview`, `Run / In-progress`, `Run / Step-failed`, `Project / Strategy`, `Project / Design-canvas`, `Project / Build`, `Command palette`, `Settings / Workspace`, `Library / Grid`, `Runs / Inbox`.

### 8.2 Tablet — 834px (portrait reference)

- **Rail collapses to 64px icon rail** by default (no expanded state inline; expansion overlays).
- **Margins:** 32px. Single content column, 770px well.
- **Home:** composer full-width (min 640px), continuity grid drops to **2 columns**.
- **Project view:** tab bar becomes horizontally scrollable if all seven domains don't fit; document column full well width; design canvas full-bleed.
- **Right dock (inspector):** becomes an overlay drawer, not a persistent column.
- **Command palette:** 88% width, max 600px.

### 8.3 Mobile — 390px

EMOVEL on mobile is **read, review, and trigger** — not heavy editing. Honest about its role.

- **Rail → bottom tab bar:** Home · Library · Runs · Publish (4 items), 56px tall, charcoal with hairline top border.
- **Margins:** 20px, single column.
- **Composer:** full-width, min-height 160px; control row wraps; `Generate` becomes a full-width gold button pinned under the input. Context/Scope/Domains collapse into a single `⊕ Options` sheet.
- **Run:** vertical step list, full width; each step a row.
- **Project view:** tab bar horizontally scrollable; each domain stacks full width. Design domain shows a fit-to-width preview with a "Open canvas" affordance (canvas editing is desktop-first).
- **Command palette:** full-screen sheet from bottom.
- **Touch targets:** ≥44px. Mono labels step down to `0.625rem`.

### 8.4 Shared component inventory (for the Figma library)

`Rail`, `Rail item`, `Topbar`, `Breadcrumb`, `Composer`, `Context chip`, `Scope select`, `Domain popover`, `Primary button (gold)`, `Secondary button`, `Starter chip`, `Run step`, `Run pipeline`, `Project tab bar`, `Domain document`, `Design canvas frame`, `Status badge` (Draft/Building/Ready/Failed/Missing), `Project card`, `Command palette`, `Palette result row`, `Settings row` (toggle/select/input), `Empty state` (not-generated / missing-asset / failed), `Version timeline`, `Keyboard hint`. Build each as a variant set with the Section 7 tokens as Figma variables.

---

## 9. React / Tailwind Implementation Plan

*Direction only — no code, per brief. Sequenced to respect the repo's execution order and the AI→Schema→Validate→Render architecture.*

### 9.1 Foundation — retire the purple system

1. **Replace the token layer first.** Rewrite `tailwind.config.ts` and `globals.css` `:root` to the Section 7 tokens. Remove every `os-violet*`, fix the misleading `blue: "#8B5CF6"` alias (blue must mean the electric-blue *signal*, used almost nowhere), introduce `gold`, `ivory`, `charcoal/surface`, `signal`, and the status colors. This single change reframes the entire product.
2. **Establish CSS variables as the source of truth** for color/spacing/radius so the Figma variables and Tailwind theme stay 1:1. Keep TypeScript as the source of truth (CLAUDE.md): tokens defined in TS, surfaced to Tailwind + CSS via generation, never hand-edited in two places.
3. **Kill the ambient purple keyframes** (`ambient-drift`, purple glow-pulse). Keep `fade-up`, `fade-in`, `card-in`, retune to Section 7.6. Add `palette-in` and the composer→run `morph`.

### 9.2 Shell — rail, topbar, palette

4. Build the **AppShell** (left rail + topbar + canvas slot) as the layout wrapper in `app/layout.tsx`. Rail collapse state in a small client store; persists per session.
5. Build the **Command Palette** (`⌘K`) as a global overlay component with grouped, fuzzy-searched results (Actions / Projects / Assets / Settings). This is the single biggest "feels like Linear/Raycast" unlock — prioritize it.
6. Wire the **global keyboard map** (Section 2.4) via a single keybinding layer.

### 9.3 Composer & home

7. Refactor `app/page.tsx` into **Home** with first-run vs. returning states; **delete the four empty preview cards** (placeholder/fake-asset violation).
8. Rebuild the **Composer** as a reusable component used on both Home and `new-project`: input + Context/Scope/Domains controls + gold primary. Make `⊕ Context` real (attachments) and `Scope`/`Domains` drive the actual run config.
9. Add the **intent-preview** line bound to a lightweight parse of the prompt.

### 9.4 Truthful generation — the critical replacement

10. **Remove the `setTimeout(2200)` fake generation.** Bind the run panel to **real pipeline state** (stream/poll the pipeline that produces Page Schema). Each domain step reflects actual status/timing.
11. Surface the **Intent → Schema → Validate → Render** stages, including the **validation gate** as a visible, explainable step. Failed validation blocks render and offers regenerate.
12. Implement the **composer→run in-place morph** (no hard navigation) and the settle-into-project transition.

### 9.5 Project & workspace

13. Consolidate `projects`, `builder-workspaces`, `workspace/[slug]`, `output-preview` into a **single Project View** (`projects/[slug]`) with the six-domain tab bar. Redirect the legacy routes.
14. Render each domain with its **domain-appropriate artifact component** (document / flow / Puck design canvas / build plan / launch package). Reuse existing `Hero`, `CardSection`, `SectionSurface` and the Component Registry v1.1 shared layer rather than new components.
15. Implement **per-domain regenerate + version history**, the **empty-state policy** (`MISSING ASSET` in canvas), and **export-fails-loudly** on missing required assets.

### 9.6 Library, Runs, Settings, Publish

16. **Library** view (grid/list of projects + assets + published packages) replacing the scattered browse pages.
17. **Runs** inbox (real execution history; replaces `execution`).
18. **Settings** rebuilt as a real two-pane preferences surface (Section 2.5) — every row an affordance.
19. **Publish** surface (cross-project) wrapping the existing Gumroad/Instagram/Email targets.

### 9.7 Sequencing (respecting CLAUDE.md execution order)

Do the **token/visual-system replacement (9.1) first** — it is non-negotiable foundation and unblocks everything visually. Then shell + palette (9.2). Composer + truthful generation (9.3–9.4) are the core experience and should land before Library/Runs/Settings polish. The Project View consolidation (9.5) depends on the Shared Layer + SectionSurface integration and Component Registry manifest already in the repo's execution order — align there, and do not start the Composer→Schema render path ahead of the validation gate being real.

### 9.8 Definition of done (per surface)

A surface is done when: it uses **zero purple and zero hardcoded hex** (tokens only); gold appears as a fill **exactly once**; all states (empty / loading / error / missing-asset) are real and honest; it is fully keyboard-navigable; motion respects `prefers-reduced-motion`; and nothing on screen is decorative placeholder content.

---

## 10. Success Criteria

EMOVEL OS has reached the bar when:

1. A first-time user goes from blank prompt to a credible, navigable six-domain project **without reading any instructions**.
2. A returning user can re-enter and act in **under one second** via Home continuity or `⌘K`.
3. The generation moment is **truthful** — every step reflects real pipeline state, and failures are legible and recoverable.
4. A neutral observer shown the UI **cannot place it in the "generic AI app" category** — it reads as a premium instrument (black, ivory, gold), in the company of Linear, Raycast, Vercel.
5. **Not one purple pixel remains**, and gold is used with enough restraint that its single appearance per view feels earned.

---

*End of specification.*
