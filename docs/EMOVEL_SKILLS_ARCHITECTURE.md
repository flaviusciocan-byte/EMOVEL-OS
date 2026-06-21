# EMOVEL Skills Architecture

> EMOVEL-OS Phase 2 — Skill-Driven Product Studio

---

## Overview

EMOVEL Skills are modular, composable production units. Each skill defines a repeatable capability with typed inputs, typed outputs, and explicit dependencies on other skills. Skills are organized into three layers: Core Production, Business Logic, and System Intelligence.

Skills never operate in isolation — they compose. A funnel build calls `page_builder`, which calls `copy_framework`, which calls `audience_builder`. The dependency chain is explicit and documented in each skill file.

---

## Layer 1 — Core Production Skills

These are the direct output-generating skills. They produce artifacts: pages, copy, PDFs, product listings, and visual systems. Layer 1 skills are the most frequently executed and serve as the final-mile production layer.

### `page_builder` — [emovel.page_builder.md](../knowledge/skills/emovel.page_builder.md)

Generates complete, conversion-optimized landing pages and web pages. Produces structured copy blocks (hero, benefits, proof, CTA, FAQ) ready for deployment on any page builder.

- **Primary output:** Full page copy structure + layout notes
- **Key dependencies:** `copy_framework`, `offer_architect`, `visual_brief`
- **Trigger:** Any time a web page or landing page needs to be produced

---

### `copy_framework` — [emovel.copy_framework.md](../knowledge/skills/emovel.copy_framework.md)

The unified copywriting system for all EMOVEL content — ads, emails, pages, scripts, and social posts. Enforces consistent voice, persuasion formulas, and conversion mechanics.

- **Primary output:** Headlines, body copy, CTAs, hook variants
- **Key dependencies:** `audience_builder`, `offer_architect`
- **Trigger:** Any time written persuasive content needs to be produced

---

### `pdf_framework` — [emovel.pdf_framework.md](../knowledge/skills/emovel.pdf_framework.md)

Designs and produces branded PDF documents — lead magnets, guides, workbooks, checklists, SOPs, and ebooks. Delivers complete outlines, written content, and layout specs.

- **Primary output:** Full document content + design layout spec
- **Key dependencies:** `copy_framework`, `visual_brief`, `audience_builder`
- **Trigger:** Any time a structured document asset needs to be produced

---

### `visual_brief` — [emovel.visual_brief.md](../knowledge/skills/emovel.visual_brief.md)

Produces complete visual direction briefs — color palette, typography, photography direction, layout principles, and moodboard descriptions — ensuring visual consistency across all productions.

- **Primary output:** Brand visual brief + DOs/DON'Ts + platform specs
- **Key dependencies:** `audience_builder`
- **Trigger:** Any new brand, campaign, or design production requiring visual direction

---

### `shopproductpack` — [emovel.shopproductpack.md](../knowledge/skills/emovel.shopproductpack.md)

Generates launch-ready product packages for Shopify or any e-commerce store: titles, descriptions, bullet points, SEO metadata, pricing recommendations, and variant structures.

- **Primary output:** Full product copy pack (title, descriptions, bullets, SEO, tags)
- **Key dependencies:** `copy_framework`, `pricing_engine`, `audience_builder`
- **Trigger:** Any Shopify or e-commerce product listing that needs to be created or optimized

---

## Layer 2 — Business Skills

Business skills operate above the production layer. They make strategic decisions about offers, pricing, audiences, and funnel architecture. Layer 2 skills consume Layer 1 skills and feed their outputs into production runs.

### `offer_architect` — [emovel.offer_architect.md](../knowledge/skills/emovel.offer_architect.md)

Designs irresistible offer stacks: core product, bonuses, guarantee, urgency mechanisms, and pricing narrative. Transforms a product into a complete, positioned offer.

- **Primary output:** Offer stack document (bonuses, value summary, guarantee, naming)
- **Key dependencies:** `audience_builder`, `pricing_engine`, `copy_framework`
- **Trigger:** Any time a new product or service needs to be packaged for market

---

### `pricing_engine` — [emovel.pricing_engine.md](../knowledge/skills/emovel.pricing_engine.md)

Generates data-informed pricing strategies including price point selection, tiering logic, anchoring frameworks, and psychological pricing mechanics.

- **Primary output:** Pricing strategy document (tiers, anchors, payment plans, roadmap)
- **Key dependencies:** `audience_builder`, `offer_architect`
- **Trigger:** Any pricing decision — new product, repricing, tier design, subscription model

---

### `funnel_builder` — [emovel.funnel_builder.md](../knowledge/skills/emovel.funnel_builder.md)

Designs complete customer acquisition and conversion funnels: page sequence, email automations, traffic strategy, upsell structure, tech stack, and conversion benchmarks.

- **Primary output:** Funnel map + page specs + email sequence outline + KPIs
- **Key dependencies:** `offer_architect`, `copy_framework`, `page_builder`, `audience_builder`, `pricing_engine`
- **Trigger:** Any new product launch, campaign, or customer acquisition system

---

### `audience_builder` — [emovel.audience_builder.md](../knowledge/skills/emovel.audience_builder.md)

Creates detailed Ideal Customer Profile (ICP) documents including demographics, psychographics, pain points, desires, objections, buying behavior, and language patterns.

- **Primary output:** Complete ICP document with avatar, pains, desires, anti-avatar
- **Key dependencies:** None — foundational input skill
- **Trigger:** Every new market entry, product line, or campaign before any other skill is run

---

## Layer 3 — System Skills

System skills build, configure, and orchestrate the EMOVEL production infrastructure itself. They design AI agents, select technology stacks, map workflows, and architect MCP server configurations. Layer 3 skills are meta — they produce the systems that run other skills at scale.

### `agent_blueprint` — [emovel.agent_blueprint.md](../knowledge/skills/emovel.agent_blueprint.md)

Designs and documents AI agent systems — agent roles, tool access, orchestration logic, trigger conditions, handoff protocols, and prompt templates.

- **Primary output:** Agent system blueprint (diagram, specs, prompts, cost estimate)
- **Key dependencies:** Workflow-specific — pulls from any other EMOVEL skill
- **Trigger:** Any automation of a multi-step EMOVEL production workflow

---

### `stack_selector` _(planned)_

Recommends the optimal technology stack for a given business context: page builders, email platforms, CRMs, payment processors, analytics, and AI tooling.

---

### `workflow_designer` _(planned)_

Maps and documents business workflows — identifying bottlenecks, automation opportunities, and skill composition sequences for repeatable production runs.

---

### `mcp_architect` _(planned)_

Designs and configures MCP server setups for EMOVEL agents — specifying which MCP servers to connect, what resources they expose, and how agents interact with them.

---

## Skill Dependency Graph

```
audience_builder (foundational)
    └── copy_framework
    └── offer_architect
            └── pricing_engine
    └── visual_brief
    └── page_builder
            └── copy_framework
            └── offer_architect
            └── visual_brief
    └── pdf_framework
            └── copy_framework
            └── visual_brief
    └── shopproductpack
            └── copy_framework
            └── pricing_engine
    └── funnel_builder
            └── offer_architect
            └── copy_framework
            └── page_builder
            └── pricing_engine
agent_blueprint (meta)
    └── [any skill combination]
```

---

## Adding New Skills

Use [project-templates/skill-template.md](../project-templates/skill-template.md) to create new skills. Every new skill must:

1. Define its Layer (Core Production / Business / System)
2. Specify all typed inputs and outputs
3. Declare all dependencies explicitly
4. Be added to this architecture document under the correct layer

---

*EMOVEL-OS Phase 2 — Skill-Driven Product Studio*
