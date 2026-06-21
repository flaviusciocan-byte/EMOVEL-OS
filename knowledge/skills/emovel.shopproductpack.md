# Shop Product Pack

## Purpose
Generate complete, launch-ready product packages for Shopify or any e-commerce store — including product titles, descriptions, bullet points, SEO metadata, pricing recommendations, variant structures, and imagery direction.

## Inputs
- Product name and category
- Product type: physical, digital, bundle, subscription
- Key features and materials (for physical) or contents (for digital)
- Target audience (or reference to `emovel.audience_builder`)
- Price range or positioning (budget, mid-market, premium)
- Store name and brand voice
- Competitor context (optional)

## Outputs
- SEO-optimized product title
- Short product description (for collection pages, 50–80 words)
- Long product description (for product page, 200–400 words)
- 5–7 bullet-point feature/benefit list
- SEO meta title and meta description
- Image alt text for primary and secondary images
- Variant naming structure (size, color, bundle options)
- Pricing recommendation with anchoring rationale
- Product tags list
- Upsell/cross-sell recommendations

## Rules
- Product titles must include primary keyword and core benefit
- Bullet points follow FAB: Feature → Advantage → Benefit
- Long descriptions must open with transformation/outcome, not specs
- All copy must pass a "so what?" test — every claim needs a customer-facing benefit
- Pricing must include an anchor (compare at, MSRP, or bundle savings)
- Tags must include: category, use case, audience, season/occasion (where applicable)
- Image alt text must be descriptive and include primary keyword naturally

## Workflow
1. Receive product brief (name, type, features, audience)
2. Research or confirm competitive positioning
3. Identify primary SEO keyword and 3–5 secondary keywords
4. Write product title with keyword
5. Draft bullet points (5–7, FAB format)
6. Write short and long descriptions
7. Generate SEO metadata
8. Suggest pricing structure with anchor
9. List recommended tags and variants
10. Deliver full pack as structured document

## Examples
- Physical product: handmade candle gift set, premium tier, gifting audience
- Digital product: Notion productivity template bundle
- Subscription: monthly wellness box
- Bundle: skincare starter kit (3-product bundle with savings anchor)

## Dependencies
- `emovel.copy_framework` — copywriting tone and persuasion rules
- `emovel.audience_builder` — buyer profile and purchase motivators
- `emovel.pricing_engine` — pricing tiers and anchoring logic

## Related Skills
- `emovel.copy_framework`
- `emovel.pricing_engine`
- `emovel.offer_architect`
- `emovel.audience_builder`
