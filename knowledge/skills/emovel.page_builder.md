# Page Builder

## Purpose
Generate complete, conversion-optimized landing pages and web pages for EMOVEL products, offers, and campaigns. Outputs structured HTML/CSS sections or copy blocks ready for deployment on any page builder (Webflow, Framer, Shopify, etc.).

## Inputs
- Product or offer name
- Target audience profile (or reference to `emovel.audience_builder`)
- Core promise / transformation
- Offer details (price, bonuses, guarantee)
- Visual style direction (or reference to `emovel.visual_brief`)
- Page type: landing page, sales page, opt-in page, thank-you page, product page

## Outputs
- Full page copy structure (hero, benefits, social proof, CTA, FAQ, footer)
- Section-by-section content blocks
- Headline variants (3–5 options)
- CTA copy variants
- SEO meta title and description
- Mobile-first layout notes

## Rules
- Every page must have a single primary CTA above the fold
- Headlines must lead with transformation, not features
- Social proof sections require at least one specificity anchor (number, result, timeframe)
- Pages must follow the AIDA structure: Attention → Interest → Desire → Action
- No jargon unless the audience uses it fluently
- Always include a risk-reversal element (guarantee, trial, free tier)

## Workflow
1. Receive inputs (product, audience, offer, page type)
2. Reference `emovel.copy_framework` for tone and messaging rules
3. Reference `emovel.offer_architect` for offer stack language
4. Draft hero section (headline, subheadline, hero CTA)
5. Build benefits section using transformation language
6. Add social proof block
7. Insert offer stack details (bonuses, price, guarantee)
8. Write FAQ section (5–8 objection-handling Q&As)
9. Close with urgency/scarcity CTA
10. Deliver full page as structured markdown or HTML blocks

## Examples
- Sales page for a $97 digital course on content creation
- Opt-in page for a free lead magnet PDF
- Product page for a Shopify physical product bundle
- Thank-you page with upsell offer

## Dependencies
- `emovel.copy_framework` — tone, voice, and messaging rules
- `emovel.offer_architect` — offer stack structure
- `emovel.visual_brief` — design direction and brand colors
- `emovel.audience_builder` — ICP profile and pain points

## Related Skills
- `emovel.copy_framework`
- `emovel.funnel_builder`
- `emovel.offer_architect`
- `emovel.visual_brief`
