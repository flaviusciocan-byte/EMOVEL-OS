# Pricing Engine

## Purpose
Generate data-informed pricing strategies for EMOVEL products and services — including price point selection, tiering logic, anchoring frameworks, and psychological pricing mechanics — to maximize both conversion rate and revenue per customer.

## Inputs
- Product or service type (digital product, physical product, service, subscription, SaaS)
- Core transformation delivered
- Target audience income level and price sensitivity (or reference to `emovel.audience_builder`)
- Competitor price range
- Business model goal: volume (low price, high conversion) vs. premium (high price, high value signaling)
- Current revenue stage: pre-launch, early traction, scaling, established

## Outputs
- Recommended price point with rationale
- Pricing tier structure (Good / Better / Best or Starter / Pro / Enterprise)
- Anchor price and compare-at framing
- Psychological pricing notes (charm pricing, round pricing, prestige pricing)
- Price increase roadmap (when to raise prices and by how much)
- Bundle pricing options
- Subscription vs. one-time purchase recommendation (if applicable)
- Payment plan structure (installments)

## Rules
- Never set price below cost of delivery plus 40% margin minimum
- Price must signal quality — pricing too low destroys trust in premium markets
- Charm pricing ($97 not $100) applies to impulse-buy price points under $200
- Round pricing ($500, $1000, $5000) applies to high-ticket and prestige offers
- Every pricing tier must have a clear "reason to upgrade"
- Payment plans must total 20–30% more than the one-time price (not 1:1 split)
- Anchoring: show the highest price first, then the recommended option
- Do not create more than 3 tiers — decision paralysis kills conversions

## Workflow
1. Confirm product type, transformation, and business model goal
2. Research competitor price range
3. Identify where offer sits on value ladder (entry, mid, high, premium)
4. Select pricing model (one-time, subscription, tiered)
5. Calculate pricing tiers with differentiated features/access
6. Apply psychological pricing mechanic appropriate to price point
7. Design anchor and compare-at structure
8. Write payment plan option if applicable
9. Recommend price increase milestones
10. Deliver full pricing strategy document

## Examples
- SaaS tool: $29/mo Starter, $79/mo Pro, $199/mo Agency — with annual discount
- Digital course: $197 one-time or $79 x 3 payment plan; $397 VIP with coaching call
- Physical product: $34 single, $59 double (best value badge), $89 triple pack
- High-ticket coaching: $3,000/mo retainer, anchored against $15,000 "done for you" option

## Dependencies
- `emovel.audience_builder` — price sensitivity, income bracket, purchase behavior
- `emovel.offer_architect` — what is included at each tier

## Related Skills
- `emovel.offer_architect`
- `emovel.funnel_builder`
- `emovel.shopproductpack`
- `emovel.audience_builder`
