# Skills Library

Reusable prompt patterns and Claude skill templates for recurring tasks across projects.

---

## What Goes Here

A "skill" is a reusable prompt structure that produces a predictable, high-quality output for a specific task. Skills avoid re-prompting from scratch every time the same type of work comes up.

---

## Skills

| Skill | File | What It Does |
|---|---|---|
| — | — | Not yet added |

---

## Planned Skills

- `product-brief-from-idea.md` — Turn a one-sentence idea into a filled product brief
- `stack-recommendation.md` — Given a product brief, recommend a tech stack
- `social-post-from-milestone.md` — Turn a build update into 3 social post variations
- `code-review-prompt.md` — Standard code review prompt for Claude Code
- `launch-copy.md` — Generate landing page headline and subhead from product brief

---

## Skill File Format

```markdown
# Skill: [Name]

## Purpose
[One sentence: what this skill produces]

## When to Use
[Conditions under which this skill is the right tool]

## Inputs
- [Input 1]: [description]
- [Input 2]: [description]

## Prompt Template

[The actual prompt — use {{variable}} for placeholders]

## Expected Output
[Describe what a good output looks like]
```
