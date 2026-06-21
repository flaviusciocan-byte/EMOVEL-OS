# Claude Council

Claude Council is the **validation and decision review layer** of EMOVEL-OS.

Before committing to a major architectural choice, technology selection, or product direction, Council is consulted. Its job is not to build — it is to challenge, refine, and gate decisions before resources are spent.

---

## When to Use Council

- Before selecting the tech stack for a new product
- Before committing to a database schema
- When two architectural approaches are competing
- When a feature feels like scope creep and needs a second opinion
- Before a launch — is this actually ready?

---

## How to Use Council

1. Write a clear decision statement: *"We are considering X. The alternatives are Y and Z."*
2. Include the product brief as context
3. Ask Council to evaluate against: feasibility, risk, tech debt, monetization fit, and build time
4. Council responds with a recommendation and rationale
5. Log the decision and outcome here for future reference

---

## Decision Log

| Date | Decision | Recommendation | Outcome |
|---|---|---|---|
| — | — | — | — |

---

## Prompts

Prompts for common Council scenarios will be stored in this directory as `.md` files:

- `validate-stack.md` — Evaluate a proposed tech stack
- `validate-architecture.md` — Review an architecture decision
- `scope-check.md` — Is this feature necessary for MVP?
- `launch-readiness.md` — Is this product ready to ship?
