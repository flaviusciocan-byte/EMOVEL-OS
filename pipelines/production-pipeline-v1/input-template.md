# Production Pipeline Input Template

Copy this file into a product folder before running EMOVEL Production Pipeline v1.

## Product

**Product name:**  
**Product slug:**  
**Product folder:**  
**Landing app output path:**  

## Raw Idea

Describe the raw idea in one paragraph.

## Target Buyer

Who is the buyer, what do they want, and what are they stuck on?

## Core Transformation

Before:

After:

## Offer

**Primary offer:**  
**Price:**  
**Tiers:**  
**Guarantee:**  
**Real urgency / scarcity:**  

## Source Files

List every local file the pipeline must read.

- 
- 
- 

## Copy Requirements

Hero headline:

Primary CTA:

Sections required:

- Hero
- Problem
- Solution
- Deliverables
- Benefits
- Proof
- Pricing
- Guarantee
- FAQ
- Closing CTA

## Visual Direction

Tone words:

Palette:

Typography:

Image/artifact direction:

Anti-patterns:

## Tool Stack

Use real paths from `config/tools.json`.

| Layer | Tool | Path | Required? |
|---|---|---|---|
| UX | UI UX Pro Max |  | Yes |
| Components | 21st SDK |  | Yes |
| Motion | skills-main / GSAP |  | Yes |
| Builder | Next.js | product-local | Yes |
| Automation | n8n |  | Optional |

## Verification

Build command:

```powershell
npm.cmd run build
```

Smoke test port:

Expected text:

## Report

Report path:

`docs/PIPELINE_TEST_<number>_REPORT.md`

