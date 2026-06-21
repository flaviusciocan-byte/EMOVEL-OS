# Funnel Builder

## Purpose
Design complete customer acquisition and conversion funnels — from cold traffic to closed sale — including funnel architecture, page sequence, email automations, traffic source recommendations, and conversion benchmarks.

## Inputs
- Business type and primary offer
- Price point of main offer
- Target audience (or reference to `emovel.audience_builder`)
- Traffic source(s): organic, paid social, email, SEO, partnerships
- Existing assets: lead magnet, email list, ad creative, social following
- Funnel goal: lead generation, webinar registration, direct sale, application, tripwire
- Technology stack available (or use `emovel.agent_blueprint` to recommend)

## Outputs
- Funnel map (page sequence with arrows and conversion goals)
- Page-by-page description (purpose, key copy, CTA)
- Email sequence outline (subject lines, send timing, purpose per email)
- Traffic strategy recommendation per funnel stage
- Conversion rate benchmarks per funnel stage
- Upsell/downsell/cross-sell placement
- A/B testing priorities
- Tech stack recommendation (landing page, email, payment, CRM)

## Rules
- Every funnel must have a defined entry point and a defined end state
- Lead magnet funnels must deliver value before asking for money
- Email sequences must follow: Welcome → Value → Value → Pitch → Follow-up → Last chance
- Upsells must be presented immediately after the primary purchase (OTO — one-time offer)
- Downsells must exist for every upsell that is rejected
- Conversion benchmarks must be stated per funnel type (opt-in: 30–50%, sales page: 1–3%, webinar: 5–15%)
- Funnels with >$500 offers should include an application or call step
- Retargeting must be planned for every paid traffic funnel

## Workflow
1. Confirm business type, offer, and funnel goal
2. Select funnel archetype (lead magnet, webinar, video sales letter, application, tripwire)
3. Map page sequence (opt-in → thank you → sales → checkout → upsell → confirmation)
4. Write page descriptions and conversion goals per step
5. Design email automation sequence (triggers, timing, subject lines)
6. Define traffic strategy per stage (cold, warm, hot)
7. Place upsells and downsells
8. Set benchmark KPIs per stage
9. Recommend tech stack
10. Deliver funnel map + full written spec

## Examples
- Lead magnet funnel: free PDF → email sequence → $97 offer
- Webinar funnel: registration page → reminder sequence → live webinar → replay → close
- High-ticket funnel: VSL → application → sales call → onboarding
- Tripwire funnel: $7 impulse offer → OTO $47 → OTO $97 → core offer $297

## Dependencies
- `emovel.offer_architect` — what is being sold at each funnel stage
- `emovel.copy_framework` — page and email copy rules
- `emovel.page_builder` — landing page creation per funnel step
- `emovel.audience_builder` — traffic source and messaging alignment
- `emovel.pricing_engine` — price point logic for OTO and upsell structure

## Related Skills
- `emovel.page_builder`
- `emovel.copy_framework`
- `emovel.offer_architect`
- `emovel.agent_blueprint`
