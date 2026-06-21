# Copy Framework

## Purpose
Provide a unified copywriting system for all EMOVEL content — ads, emails, pages, scripts, and social posts. Ensures consistent voice, persuasion logic, and conversion mechanics across every touchpoint.

## Inputs
- Content type (ad, email, landing page, social post, video script, product description)
- Target audience profile (or reference to `emovel.audience_builder`)
- Core offer or message
- Desired emotion to trigger (curiosity, urgency, trust, aspiration)
- Brand voice profile (if defined)
- Funnel stage: awareness, consideration, decision, retention

## Outputs
- Primary copy block (headline + body + CTA)
- 3 headline variants
- Hook options for video/social
- Email subject line options (if applicable)
- CTA micro-copy variants
- Tone calibration notes

## Rules
- Write at a 7th-grade reading level unless audience is explicitly technical
- Lead with the reader's problem or desire — never the product
- Every piece of copy must have one clear job (click, opt-in, buy, share)
- Use the PAS formula for problem-aware audiences: Problem → Agitate → Solution
- Use the FAB formula for warm audiences: Feature → Advantage → Benefit
- Power words list: proven, secret, finally, simple, fast, guaranteed, breakthrough
- Avoid: "world-class," "synergy," "innovative," "cutting-edge" unless used ironically
- Every email must have a PS line
- Social proof should always include a specific outcome, not a vague compliment

## Workflow
1. Identify funnel stage and content type
2. Pull audience pain points from `emovel.audience_builder`
3. Select persuasion formula (PAS, AIDA, FAB, Before/After/Bridge)
4. Draft hook or headline (3 variants minimum)
5. Write body copy following chosen formula
6. Add social proof anchor if applicable
7. Write CTA with action + benefit ("Get instant access" vs "Submit")
8. Review against rules checklist
9. Deliver final copy with variant options

## Examples
- Facebook ad copy for a $27 impulse-buy product
- Email sequence for a 5-day challenge launch
- Instagram caption for a testimonial post
- Video script hook for a YouTube ad (first 5 seconds)

## Dependencies
- `emovel.audience_builder` — reader profile and pain points
- `emovel.offer_architect` — what is being sold and how

## Related Skills
- `emovel.page_builder`
- `emovel.funnel_builder`
- `emovel.audience_builder`
- `emovel.offer_architect`
