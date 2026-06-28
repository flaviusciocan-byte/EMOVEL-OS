# EMOVEL OS — PRODUCT AUDIT 002

**Type:** Senior engineering + product audit of the *actual implementation*
**Date:** 2026-06-22
**Method:** Direct reading of source. No assumptions from the vision docs.
**Scope read:** `apps/emovel-prompt-studio` (app routes, `components/*`, `lib/projects.ts` [1892 lines], `lib/templates.ts`, `lib/project-schema.ts`, `execution/*`, `api/projects/route.ts`), plus repo-level `pipelines/`, `products/`, `automation/`, `knowledge/`, `council/`, `scripts/`, `projects/generated`, `projects/build-workspaces`, and all `package.json` files.

> Tone note per request: no praise, no vision restatement. This audits code that exists.

---

## 0. The one sentence that matters

**EMOVEL today is a deterministic Markdown-scaffolding generator with a premium-looking UI. There is no AI in it.** Not one Anthropic call, not one OpenAI call, not one model invocation, not one network request that produces content. Every "generated" asset is a pre-written template string with the user's prompt interpolated into it, selected by `String.includes()` keyword matching.

Everything below expands that sentence with evidence.

---

## 1. PRODUCT

### 1.1 What product is EMOVEL *positioned* as
An "AI Product Operating System": one prompt → strategy, offer, copy, UX, design, build plan, launch assets.

### 1.2 What the code *actually* implements
A local Next.js app that does three real things:

1. **Template interpolation.** `lib/templates.ts` holds eight hardcoded Markdown blocks (offer, copy, UX audit, component plan, motion plan, visual brief, build plan, launch plan). `sectionFor()` injects the prompt string and a `projectDefaults[projectType]` lookup into those blocks. `generateMarkdown()` concatenates them. The output for "Launch a SaaS waitlist" and "Build a founder content OS" is **structurally identical** — only the echoed prompt string and a 5-way project-type switch differ.
2. **Keyword routing dressed as intelligence.** `execution/command-router.ts` `detectIntent()` is a ladder of `includes(["shop","gumroad",...])` checks returning one of six enum intents. `routeCommand()` returns `selectedSkills` (filenames from a static array), `confidence: "low"|"medium"|"high"` (derived from whether keywords matched), and `selectedTools`. The home page's `inferBriefFromPrompt()` (`app/page.tsx`) is the same pattern: `lower.includes("dashboard") ? "SaaS dashboard" : ...`. This is presented to the user as "Intent Preview / Confidence / selected skills."
3. **Filesystem scaffolding.** `api/projects/route.ts` + `lib/projects.ts` write the templated Markdown to `projects/generated/<slug>/` and a "builder workspace" to `projects/build-workspaces/<slug>/`, then **set build status to `"Ready to Publish"` and shop status to `"Ready for Gumroad"` at creation time** (`updateBuildStatus(slug, "Ready to Publish")`). No build, no validation, no publish ever runs.

The system's own honesty is in the code: every generated `BUILD_STATUS.md` carries the line *"No shell commands, builders, APIs, or database actions were executed,"* and `generateExecutionPlan()` appends a **"Safety Boundary"** section stating Prompt Studio *"does not run builders, execute shell commands, connect paid APIs, publish to social platforms, send email, or create Gumroad products automatically."* The product accurately documents that it does nothing automated.

### 1.3 The gap between vision and implementation

| Vision claim | Code reality |
|---|---|
| AI generates strategy/copy/design | Static template strings + prompt echo |
| Intent understanding | `String.includes` keyword ladder |
| "Skills" power outputs | Skills are `.md` filenames in an array, never read or executed |
| Build plan → built product | `build-plan.md` is a fixed checklist; nothing is built |
| Publish/launch assets | Markdown files; "Safety Boundary" says it publishes nothing |
| Pipeline / orchestration | A list of `writeFile` calls in one POST handler |
| Component Registry v1.1 / Page Schema / Zod validation (per CLAUDE.md) | **Not present in the running app.** No registry, no schema validation gate, no Zod in the generation path |

### 1.4 What is fake / demo / local-only
- **Floating "preview cards"** on the home (`previewCards`) — empty decorative divs, no data.
- **The "generating" sequence** — `setTimeout` of 900ms (home) / 2200ms (legacy) playing a canned six-stage animation disconnected from any work.
- **Hardcoded statuses** — "Build Passed" / "Ready to Publish" / "Ready for Gumroad" set on write.
- **`automation/`** — two `README.md` files, zero workflows. **`council/`** — one file. **`pipelines/`** — five Markdown docs, no executable pipeline.
- **Everything is local.** No database, no auth, no backend, no deploy target wired. `products/emovel-launch-stack-v1` is a one-off static Next build committed into the repo.

### 1.5 What creates real value (the honest credit)
A founder can type an idea and in seconds get a **consistent, well-structured set of launch documents** (offer → copy → UX → build → launch) plus Markdown/ZIP export. As a *structured-template expander*, that is genuinely faster than a blank page. The value is real; the "AI" label is not.

### 1.6 Scores (actual product, not potential)

| Dimension | Score | Rationale |
|---|---|---|
| **Product Clarity** | **4 / 10** | The pitch is clear; the build contradicts it. A user expecting AI gets deterministic templates. Internal model is split across three composers and two data layers. |
| **PMF Potential** | **3 / 10 today, 7 / 10 latent** | As shipped, nothing differentiates it from a Notion template. The *workflow* (idea → structured launch kit) has a real market once real generation is wired. |
| **User Value** | **3 / 10** | Output is generic and prompt-insensitive beyond keyword switches. Same skeleton every time. |
| **Differentiation** | **2 / 10** | v0, Lovable, Cursor, Claude, Bolt actually generate. EMOVEL interpolates strings. No moat, no data, no model, no taste encoded beyond static copy. |

---

## 2. USER EXPERIENCE

Audited against the running routes. Recurring problem: **three different intake surfaces** (`app/page.tsx` glossy composer, `components/PromptStudio.tsx` dense form, `components/LocalWorkspaceShell.tsx` in-workspace) with **two different persistence models** behind them.

### Onboarding
- **Works:** none exists — you land straight on a composer. For a power tool that's defensible.
- **Generic:** the hero ("Create products, sites and launch systems from one prompt") is indistinguishable from every AI-wrapper landing page.
- **Friction:** no example of *output quality* before commitment; the user generates before they know what they'll get.
- **Remove:** the four empty floating preview cards.
- **Redesign:** first run should show one *real* generated example, not decorative cards.

### Home screen (`app/page.tsx`)
- **Works:** the composer is a clear anchor; `⌘↵` to generate; optional "Refine Brief" fields.
- **Generic:** purple radial-glow-on-near-black is the category cliché. Violates EMOVEL's own brand law (no purple).
- **Friction:** "Generate Workspace" writes to **localStorage** and routes to `/workspace/<uuid>`, while the *other* path (PromptStudio → "Create Workspace") writes to **the filesystem** and routes to `/workspace/<slug>`. Two homes, two stores, one route — split brain.
- **Remove:** the fake `setTimeout` generation theater.
- **Redesign:** bind progress to real work; add returning-user continuity (recent projects) instead of an always-first-run hero.

### Prompt intake (`components/PromptStudio.tsx`)
- **Works:** project type, output-module checkboxes, advanced execution/workspace modes, live (deterministic) execution-plan preview. This is the most *functional* surface.
- **Generic:** dense control panel that looks like a settings form, not a "production cockpit."
- **Friction:** it duplicates the home composer with a *different* mental model and a *different* backend (filesystem, not localStorage). A user who started on the home cannot find this flow's outputs in the home's library.
- **Remove:** the "Intent Preview / Confidence / skills" block — it presents keyword matching as machine reasoning and will erode trust the moment a user tests it.
- **Redesign:** collapse home + PromptStudio into one composer with one data model.

### Project creation
- **Works:** it reliably writes a predictable file set.
- **Generic / friction:** "creation" conflates four actions (Generate / Run Pipeline / Generate Execution Plan / Create Workspace) with overlapping outputs and no explanation of how they differ.
- **Remove:** at least two of the four buttons; keep one primary "Generate" + one "Open workspace."
- **Redesign:** one action, one result, one place it lands.

### Workspace navigation (`/workspace/[slug]`, `LocalWorkspaceShell.tsx`)
- **Works:** the localStorage shell (2018 lines) renders typed assets (strategy/offer/copy/ux/design) with section tabs and a client-side ZIP export — the most complete UI in the repo.
- **Generic:** labels its own output "Deterministic" in the UI — honest, but it advertises the absence of intelligence.
- **Friction:** the route does a **filesystem-first, localStorage-fallback** branch (`if (!projectFiles) return <LocalWorkspaceShell/>`). The two systems never share data, so the same URL renders fundamentally different apps depending on how the project was made.
- **Remove:** the dual code path.
- **Redesign:** one workspace renderer over one store.

### Exports
- **Works:** Markdown export (Blob download) and a hand-rolled ZIP (real CRC32 + local/central headers) both function with no dependencies.
- **Friction:** export never checks asset completeness; CLAUDE.md mandates "export must fail explicitly if required assets are missing" — that gate does not exist.
- **Redesign:** add the missing-asset export gate; it's specified and absent.

### Project library
- **Works:** `/projects` lists filesystem projects with status badges; `CommandCenter.tsx` lists localStorage projects.
- **Friction:** **there are two libraries** that don't see each other. A project is visible in exactly one, depending on its origin.
- **Remove:** one of the two libraries (after unifying the store).

### Command center (`NavBar` grid dropdown + `CommandCenter.tsx`)
- **Works:** the dropdown is a tidy route menu; CommandCenter does CRUD on localStorage projects.
- **Generic / friction:** it's a menu, not a command center. No `⌘K`, no fuzzy search, no actions — for a product benchmarked against Raycast/Linear/Cursor this is the biggest unmet expectation.
- **Redesign:** real `⌘K` palette (act / jump / search) over the unified store.

---

## 3. ARCHITECTURE

### 3.1 Data model — **split brain (critical)**
Two parallel, non-integrated persistence systems now coexist in the same app:

| | System A (server) | System B (client) |
|---|---|---|
| Store | Filesystem `projects/generated/`, `projects/build-workspaces/` | Browser `localStorage` |
| Schema | Markdown files; **status parsed by regex** (`/^- Status: (.+)$/m`) | `ProjectSchemaV1` typed object (`lib/project-schema.ts`) |
| Writer | `api/projects/route.ts` + `lib/projects.ts` (1892 lines) | `app/page.tsx` `persistLocalProject()` + `LocalWorkspaceShell` |
| Library | `/projects` (server) | `CommandCenter.tsx` |
| Created by | PromptStudio "Create Workspace" | Home "Generate Workspace" |
| Joined at | `/workspace/[slug]` fallback (`if (!projectFiles) → LocalWorkspaceShell`) | — |

This is the central technical-debt fact of the codebase. They share a URL and nothing else.

### 3.2 localStorage strategy
- Keys: `emovel-projects` (index array) + `emovel-project:<id>` (per project), duplicated writes in `page.tsx`, `CommandCenter`, and `LocalWorkspaceShell` (no single owner).
- A `migrateProjectToSchemaV1()` migration exists — good instinct — but runs ad hoc on read in multiple places.
- Risks: ~5MB quota ceiling, single-device, single-browser, no backup, lost on cache clear, no concurrency control. Fine for a prototype, unfit as the OS's source of truth.

### 3.3 Project schema
- System B has a real typed schema (`ProjectSchemaV1`, `StrategyAsset`, `OfferAsset`, … `PipelineStep`) — the best-designed artifact in the repo.
- System A has **no schema**; it persists prose Markdown and recovers state with regex. Two sources of truth, one of them stringly-typed.
- CLAUDE.md's mandated **Page Schema + Zod validation gate + Component Registry** is absent from both.

### 3.4 Workspace structure
- `lib/projects.ts` hardcodes ~6 parallel filename lists (`pipelineFiles`, `builderWorkspaceFiles`, `publishPackageFiles`, `shopPackageFiles`, …) and many `path.join` helpers. Adding one artifact means editing several lists plus templates. Tight coupling, no manifest.

### 3.5 Pipeline design
- "Pipeline" = a sequential block of `writeFile` calls in one POST handler. No steps, no state machine, no retries, no idempotency, no events. The rich `ProjectPipeline`/`PipelineStep` types in System B are **defined but not driven by real execution** (the steps animate on a timer).

### 3.6 Export layer
- Two independent exporters (Markdown blob; hand-rolled ZIP in `LocalWorkspaceShell`). The ZIP implementation is competent but bespoke and untested. No shared export contract, no completeness gate.

### 3.7 Technical debt (ranked)
1. **Dual persistence (filesystem vs localStorage)** — split brain; everything else compounds on it.
2. **`lib/projects.ts` at 1892 lines** and **`LocalWorkspaceShell.tsx` at 2018 lines** — two monoliths; the shell mixes UI, state, schema, and a ZIP encoder.
3. **Regex-as-database** for status in System A.
4. **Three composers / two libraries** — duplicated, diverging UX.
5. **Determinism mislabeled as AI** — product debt that becomes trust debt on first real test.
6. **Brand law breach** (purple everywhere) — `tailwind.config.ts` shows mid-edit (`MM`) — a half-started fix.

### 3.8 Scalability risks / bottlenecks
- localStorage caps the product at one device and a few MB.
- Filesystem writes assume a local Node process with `process.cwd()/../..` repo-relative paths — **cannot run on serverless/Vercel** as written.
- No multi-user, no auth, no persistence layer → cannot become SaaS without an architecture, not a refactor.

### 3.9 Unnecessary complexity
- Builder targets (GPT-Pilot/Pythagora/Reflex/Next.js) and 5 publishing targets that **route to filenames and execute nothing** — elaborate machinery for a no-op.
- Six filename lists that could be one manifest.

---

## 4. AI READINESS

### 4.1 Currently deterministic (i.e., everything)
- Asset "generation" (`templates.ts`), intent routing (`command-router.ts`), brief inference (`page.tsx`), confidence scoring, skill selection, status. **No model anywhere. No `anthropic`/`openai` dependency in any `package.json`.**

### 4.2 What each layer should become

| Capability | Engine | Why |
|---|---|---|
| Strategy / offer / copy / UX / design generation | **Anthropic API (Claude)** with structured outputs → typed `*Asset` objects | This is the core promise; it's the highest-value, lowest-risk first integration. Schema already exists in `project-schema.ts`. |
| Page Schema authoring (AI → schema, never JSX) | **Anthropic API** emitting JSON validated by **Zod** against the Component Registry | Exactly what CLAUDE.md mandates and what's missing. |
| Actually building the app | **Claude Code / Codex** as a build agent operating on a generated repo | "Build plan → built product" requires an agent + sandbox, not a template. |
| Intent routing / brief enrichment | Small **Claude (Haiku-class)** call or a local model | Replace `String.includes`; cheap, fast, far better. |
| Local/offline mode | **Local models (Ollama)** for privacy-sensitive or offline drafting | Optional tier; keep deterministic templates as the $0 fallback. |
| Multi-step run (strategy→offer→copy→ux→design→build→publish) | **Workflow orchestration** (a real step runner with state, retries, streaming) bound to the existing `PipelineStep` type | The types are ready; the executor is missing. |

### 4.3 Future AI architecture (target)

```
Composer (one surface, one store)
      │  prompt + refined brief
      ▼
Intent + Brief Enrichment      ── Claude Haiku (replaces String.includes)
      ▼
Orchestrator (real step runner, streams PipelineStep state)
      ├─ Strategy   ── Claude → StrategyAsset (Zod-validated)
      ├─ Offer      ── Claude → OfferAsset
      ├─ Copy       ── Claude → CopyAsset
      ├─ UX         ── Claude → UXAsset
      ├─ Design     ── Claude → DesignAsset + Page Schema
      ├─ Validate   ── Zod gate against Component Registry  ← hard gate
      ├─ Build      ── Claude Code / Codex agent (sandboxed)  ← later
      └─ Publish    ── real connectors (Gumroad/Email/social)  ← later
      ▼
Persistence: one store (Postgres/Supabase) — retire localStorage + FS-as-DB
```

**Sequence:** wire Claude into generation first (days), Zod/schema gate second, orchestration third, build/publish agents last. Build/publish are months out; generation is the unlock that makes the product real.

---

## 5. MONETIZATION

### 5.1 Which model fits
- **SaaS (product creation platform):** viable **only after** real generation + a real persistence/auth layer. Today it cannot bill — no accounts, no cloud state, no AI cost to mark up.
- **Internal operating system (for the owner's own agency):** **viable today.** The deterministic kit already accelerates the owner's own launches.
- **Agency operating system (sell the workflow as a service):** **viable near-term** — productize "idea → launch kit" as a done-for-you/done-with-you offer while AI is wired in behind the scenes.
- **Product creation platform (self-serve):** the destination, gated on Sections 3–4.

### 5.2 Recommendation
**Sequence the business model to the architecture:**
1. **Now → revenue this month:** sell the *workflow*, not the SaaS. Productized service / template-vault offer using the existing generator as the production tool. This needs **zero new architecture**.
2. **Next → thin SaaS:** once Claude generation + Supabase auth/persistence land, charge for hosted, account-based generation.
3. **Later → platform:** add build/publish agents and per-seat / usage pricing.

### 5.3 Pricing structure (when SaaS-ready)
- **Free:** deterministic templates only (the current engine becomes the free tier — it already says "Paid APIs connected: no").
- **Pro (~$29–49/mo):** real Claude generation, cloud projects, exports.
- **Studio (~$149–299/mo):** Page Schema → real build handoff, publishing connectors, multiple brands.
- Margin = (subscription − Claude API cost). Track per-project token cost from day one.

### 5.4 First paid offer (fastest route to revenue)
**"EMOVEL Launch Kit — done-with-you."** Fixed price (e.g. $499–$1,500). Client gives the idea; you run it through Prompt Studio + your own Claude editing pass; deliver the launch kit + (optionally) the built landing page. Revenue this week, no platform required, and it generates the real prompt→output→edit data you need to train the automated tiers.

---

## 6. DESIGN AUDIT (evaluate, do not redesign)

### Why it currently reads "generic AI app"
1. **Color.** Near-black violet base (`#05020A`) + `#8B5CF6`/`#A855F7` glow is *the* generic-AI palette. It also breaks EMOVEL's own rule (no purple; base black/charcoal, gold accent). This single choice does most of the "generic" signalling. `tailwind.config.ts` is mid-edit — a correction was started and not finished.
2. **Glow everywhere.** Every surface has a purple shadow/bloom. When everything glows, nothing is emphasized — the opposite of Linear/Vercel restraint.
3. **Decorative theater.** Empty floating cards + timed "generating" animation read as marketing, not instrument.

### Element-by-element
- **Visual hierarchy:** weak. Heavy black weights on most headings + uniform glow flatten emphasis. Linear/Vercel earn hierarchy with one accent and lots of neutral; EMOVEL spends its accent everywhere.
- **Spacing:** competent and consistent (the strongest design dimension). Radii (28px) are bubblier than the Linear/Cursor 8–14px register.
- **Typography:** good bones — Inter + IBM Plex Mono, tight tracking. Undermined by overusing 800–900 weights. Notion/Vercel use weight sparingly.
- **Navigation:** a hidden grid dropdown where the benchmarks (Raycast/Cursor) have a `⌘K` palette. Functional, not world-class.
- **Prompt composer:** structurally right (anchor input, controls, primary action) — closest to the benchmark. Let down by palette and by existing in three inconsistent variants.
- **Workspace layout:** the localStorage shell's tabbed asset view is the best-composed screen; readable, scannable. Same palette problem.

**Net:** spacing and type are near-benchmark; **color, glow, and decorative motion are why it looks like a template.** It's not a layout problem — it's a restraint problem.

---

## 7. PRIORITY MATRIX

### STOP
- Building more **deterministic templates / filename lists** as if they were features.
- Adding surfaces to the **localStorage path while the filesystem path still exists** (stop widening the split brain).
- Shipping **purple**. Finish the brand-token correction already half-started in `tailwind.config.ts`.
- Presenting **keyword matching as "intent / confidence / skills"** in the UI.
- Hardcoding **"Build Passed"/"Ready to Publish"** statuses.

### START
- **One Claude generation call** behind the existing `*Asset` schema (the single highest-leverage change).
- **One persistence store** (pick Supabase/Postgres) and one project schema.
- **Zod validation gate** (Page Schema) per CLAUDE.md.
- **Real run-state** driving the existing `PipelineStep` types instead of `setTimeout`.
- A **`⌘K` command palette**.

### CONTINUE
- The **typed `ProjectSchemaV1`** model — extend it as the single schema.
- **Markdown + ZIP export** — keep, add the completeness gate.
- The **six-domain decomposition** (strategy→launch) — it's the right product spine.
- **Spacing / type discipline** — keep; just cut weights and recolor.

### Top 10 highest-leverage improvements (ordered by ROI)

| # | Improvement | Effort | Impact | Why this rank |
|---|---|---|---|---|
| 1 | Wire **one real Claude call** into Strategy/Copy generation → typed asset | S–M | Massive | Converts the product from fake to real; schema already exists. |
| 2 | **Unify persistence** to one store + one schema; kill the FS/localStorage split | M | Massive | Removes the central architecture defect blocking everything. |
| 3 | **Finish the brand recolor** (purple → black/ivory/gold) | S | High | Kills the "generic" signal instantly; already started. |
| 4 | **Collapse three composers into one** over the unified store | M | High | Ends split-brain UX; one mental model. |
| 5 | **Real pipeline run-state** on existing `PipelineStep` types | M | High | Makes the core moment truthful; removes `setTimeout` theater. |
| 6 | **Zod Page-Schema validation gate** | M | High | Unlocks safe AI→schema→render per CLAUDE.md; prevents garbage builds. |
| 7 | **Ship the first paid done-with-you offer** | S | High | Revenue now, zero new architecture; generates training data. |
| 8 | **`⌘K` command palette** | S–M | Medium-High | Closes the biggest gap vs. Raycast/Linear/Cursor. |
| 9 | **Export completeness gate** (fail loudly on missing assets) | S | Medium | Specified, absent, cheap, builds trust. |
| 10 | **Split the two monoliths** (`projects.ts`, `LocalWorkspaceShell.tsx`) | M | Medium | Makes 1–6 maintainable; pure debt paydown. |

---

## 8. EXECUTION PLAN (Sprints 16–20)

Assumes ~1-week sprints, one builder. Complexity: **S** ≈ ≤1 day, **M** ≈ 2–3 days, **L** ≈ 4–5 days. Sequenced so each sprint ships something usable.

### Sprint 16 — Stop the bleeding: brand + one store
- **Objective:** Eliminate the two cheapest, highest-signal defects: purple, and the persistence split.
- **Files affected:** `tailwind.config.ts`, `app/globals.css`, `components/NavBar.tsx`, `app/page.tsx`, `lib/project-schema.ts`, new `lib/store.ts`; deprecate the FS write path in `api/projects/route.ts`.
- **Expected outcome:** No purple anywhere; one persistence interface (`lib/store.ts`) wrapping a single store; home + workspace read/write only through it. localStorage allowed temporarily *behind* the interface.
- **Complexity:** **M**

### Sprint 17 — Make it real: first Claude integration
- **Objective:** Replace deterministic Strategy + Copy generation with a real Claude call returning validated `StrategyAsset` / `CopyAsset`.
- **Files affected:** new `lib/ai/anthropic.ts`, new `app/api/generate/route.ts`, `lib/project-schema.ts` (Zod schemas), `components/LocalWorkspaceShell.tsx` (consume real assets), `package.json` (add `@anthropic-ai/sdk`, `zod`), `.env` handling.
- **Expected outcome:** A prompt produces genuinely different, prompt-specific Strategy and Copy, validated against schema; deterministic templates demoted to a `$0` fallback.
- **Complexity:** **L**

### Sprint 18 — Truthful pipeline + remaining domains
- **Objective:** Drive the real `PipelineStep` state machine; extend Claude generation to Offer, UX, Design; add the **validation gate** as a visible step.
- **Files affected:** new `lib/orchestrator.ts`, `app/api/generate/route.ts` (stream step events), `app/page.tsx` (remove `setTimeout`; bind to live state), `lib/project-schema.ts`, `components/LocalWorkspaceShell.tsx`.
- **Expected outcome:** The "generating" UI reflects real per-step status/timing; a failed validation blocks render and is explained; all five document domains are AI-generated.
- **Complexity:** **L**

### Sprint 19 — Consolidate UX: one composer, one library, ⌘K
- **Objective:** Merge the three composers into one; one project library; add the command palette.
- **Files affected:** `app/page.tsx` + `components/PromptStudio.tsx` → one `components/Composer.tsx`; `app/projects/page.tsx` + `components/CommandCenter.tsx` → one library over `lib/store.ts`; new `components/CommandPalette.tsx`; `NavBar.tsx`; delete legacy `app/new-project`, `app/output-preview`, `app/builder-workspaces` overlaps.
- **Expected outcome:** One intake, one library, one data model; `⌘K` for act/jump/search. Split brain fully retired.
- **Complexity:** **L**

### Sprint 20 — Productize + harden
- **Objective:** Make it sellable: export gate, cloud persistence + auth, and the first paid offer's delivery path.
- **Files affected:** `lib/store.ts` (Supabase/Postgres adapter + auth), export module (completeness gate), `lib/projects.ts` (split into modules), `components/LocalWorkspaceShell.tsx` (split UI/state/zip), pricing/landing copy in `apps/emovel-site`.
- **Expected outcome:** Accounts + cloud projects; export fails loudly on missing assets; the two monoliths are decomposed; a Pro tier can be billed against real Claude usage; done-with-you offer is deliverable end-to-end.
- **Complexity:** **L**

---

## Appendix — Evidence index
- Determinism: `lib/templates.ts` (`sectionFor`, `generateMarkdown`); header literal `"Paid APIs connected: no"`.
- Keyword "intelligence": `execution/command-router.ts` (`detectIntent`, `routeCommand`); `app/page.tsx` (`inferBriefFromPrompt`).
- No automation by design: `execution/execution-plan-generator.ts` "Safety Boundary"; generated `BUILD_STATUS.md` note.
- Hardcoded status: `api/projects/route.ts` (`updateBuildStatus(slug,"Ready to Publish")`, `updateShopStatus(slug,"Ready for Gumroad")`).
- Split persistence: `lib/projects.ts` (filesystem) vs `app/page.tsx` `persistLocalProject` + `components/CommandCenter.tsx` + `components/LocalWorkspaceShell.tsx` (localStorage); join at `app/workspace/[slug]/page.tsx` fallback.
- Regex-as-DB: `lib/projects.ts` `readBuildStatus` (`/^- Status: (.+)$/m`).
- No AI deps: no `anthropic`/`openai` in any `package.json`.
- Monoliths: `lib/projects.ts` (1892 lines), `components/LocalWorkspaceShell.tsx` (2018 lines).
- Brand breach + half-fix: `#05020A`/`#8B5CF6`/`#A855F7` across `app/page.tsx`, `globals.css`, `tailwind.config.ts` (`MM` in git status).

*End of audit.*
