# Skill Name

> **Layer:** Core Production | Business | System  
> **Status:** Draft | Active | Deprecated  
> **File:** `knowledge/skills/emovel.[skill_name].md`

---

## Purpose

One to three sentences. What does this skill produce and why does it exist? State the output and the business value it delivers. Be specific.

---

## Inputs

List every input this skill requires to operate. Mark required vs. optional.

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| input_name | string / object / file / reference | Yes / No | What it is and where it comes from |
| audience_profile | reference: `emovel.audience_builder` | No | If no profile provided, ask for audience details inline |

---

## Outputs

List every artifact this skill produces.

| Output | Format | Description |
|--------|--------|-------------|
| output_name | markdown / JSON / HTML / document | What it is, what it's used for |

---

## Rules

Numbered list of hard constraints this skill always enforces. These are non-negotiable.

1. Rule one — state the constraint clearly
2. Rule two — include the reason if not obvious
3. Rule three

---

## Workflow

Numbered sequence of steps this skill follows to produce its outputs. Be explicit enough that a new agent could execute it cold.

1. Step one
2. Step two
3. Step three
4. ...
10. Deliver final output

---

## Examples

List 3–5 concrete use cases that demonstrate the range of this skill.

- Example 1: [context] — [what this skill produces]
- Example 2: [context] — [what this skill produces]
- Example 3: [context] — [what this skill produces]

---

## Dependencies

Explicit list of other EMOVEL skills this skill requires or calls.

- `emovel.skill_name` — why it's needed
- `emovel.skill_name` — why it's needed

If this skill has no dependencies, write: **None — this is a foundational skill.**

---

## Related Skills

Skills that commonly compose with this one, are often run before or after it, or produce complementary outputs.

- `emovel.skill_name`
- `emovel.skill_name`

---

<!--
SKILL AUTHORING CHECKLIST
Before adding this skill to EMOVEL_SKILLS_ARCHITECTURE.md:

[ ] Layer assigned (Core Production / Business / System)
[ ] All inputs typed and marked required/optional
[ ] All outputs listed with format and usage
[ ] Rules list has at least 5 constraints
[ ] Workflow is step-by-step (not vague)
[ ] At least 3 examples provided
[ ] All dependencies declared
[ ] Related skills listed
[ ] Skill name follows format: emovel.[snake_case_name]
[ ] File saved as: knowledge/skills/emovel.[skill_name].md
[ ] Entry added to docs/EMOVEL_SKILLS_ARCHITECTURE.md under correct layer
-->
