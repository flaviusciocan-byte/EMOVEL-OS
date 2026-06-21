# motion-plan

## Motion Principle

Motion should make the product feel like a premium launch command system. Use restrained, functional motion only.

## Recommended Motion

- Hero content fades and rises subtly on load.
- Skill chips reveal in a staggered sequence.
- Deliverable rows highlight on hover.
- Pricing card has a small hover lift.
- CTA buttons have clear hover and focus feedback.
- Publish confidence metrics can count up only if implemented accessibly.

## Do Not Use

- No bouncy animations.
- No decorative particle systems.
- No loud AI-style effects.
- No motion that hides core copy.

## Reduced Motion

Respect `prefers-reduced-motion` by disabling transitions and transforms except essential focus states.

## GSAP Fallback

If GSAP is unavailable, use CSS transitions and intersection observer reveal classes. The static layout must remain complete and buildable before motion is added.
