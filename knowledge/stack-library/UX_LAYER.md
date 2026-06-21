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
| **Local ZIP** | `C:\Users\flavi\Downloads\ui-ux-pro-max-skill-main.zip` |
| **ZIP Size** | 4.8 MB |
| **Status** | ZIP found — not yet extracted |
| **npm name** | `uipro-cli` v2.5.0 |
| **Runtime** | Python 3.x + Node.js |
| **Extract to** | `C:\EMOVEL\04_AI_STACK\ui-ux-pro-max-skill-main` |

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
- **Extract command:**
  ```powershell
  Expand-Archive -Path "C:\Users\flavi\Downloads\ui-ux-pro-max-skill-main.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\ui-ux-pro-max-skill-main"
  cd C:\EMOVEL\04_AI_STACK\ui-ux-pro-max-skill-main
  npm install
  ```

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
| **Local ZIP** | `C:\Users\flavi\Downloads\21st-sdk-main.zip` |
| **ZIP Size** | 160 MB (monorepo) |
| **Status** | ZIP found — not yet extracted |
| **npm name** | `blank-agent` template (monorepo) |
| **Runtime** | Node.js / React / Next.js |
| **Extract to** | `C:\EMOVEL\04_AI_STACK\21st-sdk-main` |

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
- Installation: via 21st.dev registry or `npx shadcn` CLI — **or** extract local SDK from `C:\Users\flavi\Downloads\21st-sdk-main.zip`
- EMOVEL brand adaptation required: replace default colors with Signal Blue (#2F6BFF), Electric Mint (#40D9A3), Primary Ink (#101114)
- Font adaptation required: replace default fonts with Inter Tight / Satoshi (headings), Inter (body), IBM Plex Mono (accents)
- Works with: Next.js App Router, Tailwind v3/v4, shadcn/ui component system
- Does not require a login to browse — components are publicly viewable at 21st.dev
- **Single-component install (no full SDK extraction needed):**
  ```bash
  npx shadcn@latest add "https://21st.dev/r/<component-name>"
  ```
- **Full SDK extract command:**
  ```powershell
  Expand-Archive -Path "C:\Users\flavi\Downloads\21st-sdk-main.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\21st-sdk-main"
  cd C:\EMOVEL\04_AI_STACK\21st-sdk-main
  npm install
  ```

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

---

## Tool: Quant UX

| Field | Value |
|---|---|
| **Name** | Quant UX |
| **Identifier** | `quant-ux-master` |
| **Tier** | B |
| **Category** | Design / UX Research |
| **EMOVEL Score** | 7 / 10 |
| **Format** | Vue.js Web Application |
| **Local ZIP** | `C:\Users\flavi\Downloads\quant-ux-master.zip` |
| **ZIP Size** | 6.2 MB |
| **Status** | ZIP found — not yet extracted |
| **npm name** | `quant-ux` v4.1.23 |
| **Runtime** | Vue.js / Node.js |
| **Extract to** | `C:\EMOVEL\04_AI_STACK\quant-ux-master` |

### Role

A self-hosted UX research and prototyping tool for conducting usability tests, generating heatmaps, and capturing interaction analytics against a design prototype — before any live deployment.

### Use Cases

- Testing the EMOVEL landing page prototype with real users before shipping
- Generating heatmaps of where readers pause and what they ignore
- Usability testing the 7-skill process flow section
- Validating CTA placement and pricing section legibility
- Running pre-launch design validation without external tooling costs

### How EMOVEL Uses It

Quant UX sits in the **UX validation layer** — after UI direction and before live deployment. Once a page is prototyped (in Penpot or as an HTML file), Quant UX can run structured usability sessions to catch layout and hierarchy issues.

### When to Use

- Before launching a premium landing page for the first time
- When validating a new section layout or pricing structure
- When running user research for a product above the $500 price point

### When Not to Use

- Do not use for quick, low-stakes pages — the setup cost is not justified
- Do not use instead of real live-page analytics — Quant UX is for pre-launch prototype testing only

### Integration Notes

- **Extract command:**
  ```powershell
  Expand-Archive -Path "C:\Users\flavi\Downloads\quant-ux-master.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\quant-ux-master"
  cd C:\EMOVEL\04_AI_STACK\quant-ux-master
  npm install
  npm run serve
  ```
- Self-hosted at `localhost:8080` by default
- No cloud account required
- Outputs shareable test session links and JSON analytics exports

---

## Tool: Nano Banana 2 AI

| Field | Value |
|---|---|
| **Name** | Nano Banana 2 AI |
| **Identifier** | `nano-banana-2-ai-main` |
| **Tier** | B |
| **Category** | Content / Image Generation |
| **EMOVEL Score** | 7 / 10 |
| **Format** | Next.js Web Application |
| **Local ZIP** | `C:\Users\flavi\Downloads\nano-banana-2-ai-main.zip` |
| **ZIP Size** | 587 KB |
| **Status** | ZIP found — not yet extracted |
| **npm name** | `v0-nanobanana-template` v0.1.0 |
| **Runtime** | Next.js / Node.js |
| **Extract to** | `C:\EMOVEL\04_AI_STACK\nano-banana-2-ai-main` |

### Role

A Next.js frontend for Google Gemini 3.1 Flash Image Model — enables 4K text-to-image generation with 5-character consistency at Flash speeds. Community mirror of the bananaai.run service.

### Use Cases

- Generating hero and lifestyle images for EMOVEL landing pages without stock photos
- Producing consistent operator/founder workspace visuals for the brand
- Creating social launch graphics (LinkedIn, X/Twitter, Instagram)
- Rapid visual iteration during the launch asset production phase

### When to Use

- When the visual brief calls for operator-forward imagery and no photography session is available
- For rapid content-engine asset production (social posts, email headers)
- When Gemini 2.5 Pro Image is too slow and Flash quality is sufficient

### When Not to Use

- Do not use for final hero images if photographic quality is required — AI image artefacts are detectable at high zoom
- Do not use for legally sensitive contexts where image origin disclosure is required

### Integration Notes

- **Extract command:**
  ```powershell
  Expand-Archive -Path "C:\Users\flavi\Downloads\nano-banana-2-ai-main.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\nano-banana-2-ai-main"
  cd C:\EMOVEL\04_AI_STACK\nano-banana-2-ai-main
  npm install
  npm run dev
  ```
- Runs at `localhost:3000` by default
- Requires a Gemini API key in environment variables
- Pairs with `awesome-gpt-image-2-api-and-prompts-main` for structured prompt input
- Also see: `nano-banana-pro-main` (README reference for Gemini 2.5 Pro mode)

---

## Tool: Awesome GPT Image 2 — API & Prompts

| Field | Value |
|---|---|
| **Name** | Awesome GPT Image 2 |
| **Identifier** | `awesome-gpt-image-2-api-and-prompts-main` |
| **Tier** | B |
| **Category** | Content / Prompt Library |
| **EMOVEL Score** | 8 / 10 |
| **Format** | Prompt Library (Markdown / JSON) |
| **Local ZIP** | `C:\Users\flavi\Downloads\awesome-gpt-image-2-API-and-Prompts-main.zip` |
| **ZIP Size** | 245 MB |
| **Status** | ZIP found — not yet extracted |
| **Runtime** | No code — reference library only |
| **License** | CC0 — free for commercial use |
| **Extract to** | `C:\EMOVEL\04_AI_STACK\awesome-gpt-image-2-prompts` |

### Role

A curated collection of 911 structured prompts for the GPT Image 2 API (DALL-E 3 successor), including the Seedance 2.0 cinematic workflow and multi-language support across 10 languages. Functions as a **prompt reference library**, not a runnable application.

### Use Cases

- Sourcing structured image prompts for EMOVEL landing page hero and section visuals
- Generating consistent brand-aligned imagery using GPT Image 2 API
- Feeding structured prompts into n8n workflows for automated content-engine image production
- Using Seedance 2.0 cinematic workflow for high-quality product launch visuals

### When to Use

- When GPT Image 2 API (OpenAI) is the chosen image generation backend
- When building n8n automation workflows that need structured prompt templates
- When visual consistency across a launch series is required and templates save time

### When Not to Use

- Do not use prompts verbatim without adapting to EMOVEL brand direction — the library covers many styles, most of which will not match the EMOVEL visual system
- Do not expect runnable code — this is a reference library only

### Integration Notes

- **Extract command:**
  ```powershell
  Expand-Archive -Path "C:\Users\flavi\Downloads\awesome-gpt-image-2-API-and-Prompts-main.zip" -DestinationPath "C:\EMOVEL\04_AI_STACK\awesome-gpt-image-2-prompts"
  ```
- After extraction, reference prompts from `C:\EMOVEL\04_AI_STACK\awesome-gpt-image-2-prompts\`
- Pairs with: GPT Image 2 API (OpenAI), n8n workflows, content-engine automation
- CC0 license — no attribution required, commercially safe
- 10 languages included — prompts available in EN, ES, PT, JA, KO, DE, FR, TR, ZH, RU

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
    "identifier": "ui-ux-pro-max-skill-main",
    "localZip": "C:\\Users\\flavi\\Downloads\\ui-ux-pro-max-skill-main.zip",
    "status": "zip-not-extracted",
    "npmName": "uipro-cli",
    "version": "2.5.0",
    "recommendedExtractPath": "C:\\EMOVEL\\04_AI_STACK\\ui-ux-pro-max-skill-main"
  },
  "21st-dev": {
    "name": "21st.dev",
    "category": "Design",
    "tier": "A",
    "role": "Premium React component registry — production-ready components for editorial and conversion-focused pages",
    "format": "component-library",
    "url": "https://21st.dev",
    "localZip": "C:\\Users\\flavi\\Downloads\\21st-sdk-main.zip",
    "status": "zip-not-extracted",
    "sizeCompressed": "160MB",
    "recommendedExtractPath": "C:\\EMOVEL\\04_AI_STACK\\21st-sdk-main"
  },
  "quant-ux": {
    "name": "Quant UX",
    "category": "Design",
    "tier": "B",
    "role": "Self-hosted UX research and prototyping tool — usability testing and interaction analytics",
    "format": "vue-app",
    "localZip": "C:\\Users\\flavi\\Downloads\\quant-ux-master.zip",
    "status": "zip-not-extracted",
    "npmName": "quant-ux",
    "version": "4.1.23",
    "recommendedExtractPath": "C:\\EMOVEL\\04_AI_STACK\\quant-ux-master"
  },
  "nano-banana-2-ai": {
    "name": "Nano Banana 2 AI",
    "category": "Content",
    "tier": "B",
    "role": "Next.js frontend for Gemini 3.1 Flash Image — 4K text-to-image generation for launch asset production",
    "format": "nextjs-app",
    "localZip": "C:\\Users\\flavi\\Downloads\\nano-banana-2-ai-main.zip",
    "status": "zip-not-extracted",
    "npmName": "v0-nanobanana-template",
    "version": "0.1.0",
    "recommendedExtractPath": "C:\\EMOVEL\\04_AI_STACK\\nano-banana-2-ai-main"
  },
  "awesome-gpt-image-2-prompts": {
    "name": "Awesome GPT Image 2",
    "category": "Content",
    "tier": "B",
    "role": "911-prompt library for GPT Image 2 API — CC0 licensed, 10 languages, Seedance 2.0 cinematic workflow",
    "format": "prompt-library",
    "localZip": "C:\\Users\\flavi\\Downloads\\awesome-gpt-image-2-API-and-Prompts-main.zip",
    "status": "zip-not-extracted",
    "license": "CC0",
    "sizeCompressed": "245MB",
    "recommendedExtractPath": "C:\\EMOVEL\\04_AI_STACK\\awesome-gpt-image-2-prompts"
  }
}
```
