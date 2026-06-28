# Brand Mechanism Audit — `lib/brand-mechanism`

Source-of-truth module for the EMOVEL Brand Mechanism Audit. Detects the dominant
psychological mechanism a brand converts through (Identificare, Aspirație,
Siguranță, Obicei, Diferențiere) and emits a strategic profile for Brand OS.

This is the **diagnostic core** only — questionnaire data, scoring, validation,
strategic content, Brand OS sync. The onboarding UI and the PDF report generator
are separate, later steps that build on this module.

## Public API

```ts
import { runBrandMechanismAudit } from "@/lib/brand-mechanism";

const run = runBrandMechanismAudit(rawAnswers);
if (!run.ok) {
  // run.errors: string[] — validation problems, clearly listed
} else {
  const { result, profile, envelope } = run;
  // result.dominant / result.secondary / result.congruence / result.percentages
  // profile  -> the brand_mechanism_profile (strategic DNA)
  // envelope -> { brand_os: { brand_mechanism_profile: profile } }
}
```

On the happy path the result is `{ ok: true, result, profile, envelope }`, so the
short form below still destructures correctly when you already trust the input:

```ts
const { result, profile } = runBrandMechanismAudit(rawAnswers) as Extract<
  ReturnType<typeof runBrandMechanismAudit>,
  { ok: true }
>;
```

Lower-level pieces are exported too: `validateAuditAnswers` (returns
`{ ok: true, answers } | { ok: false, errors }`), `scoreAudit`,
`buildBrandMechanismProfile`, `toBrandOsEnvelope`, plus the data
(`mechanisms`, `interpretations`, `recommendations`, `agentRules`,
`sevenDayPlan`, `agentSystemPrompt`).

## Files

| File | Role |
|---|---|
| `mechanisms.ts` | **Source of truth**: 5 mechanisms, 20 Likert questions, scale, thresholds, types. |
| `scoring.ts` | Pure scoring engine: per-mechanism score, %, dominant/secondary, status, congruence. |
| `validate.ts` | Hand-rolled boundary validation (matches `lib/ai/schema.ts` convention; no zod). |
| `content.ts` | Typed strategic content: interpretations, recommendations, agent rules, 7-day plan, agent system prompt. |
| `brand-os.ts` | Builds the `brand_mechanism_profile` strategic DNA record. |
| `manifest.ts` | Manifest builder, derived from `mechanisms.ts`. |
| `manifest.generated.json` | **Generated** — do not hand-edit. |
| `scripts/generate-manifest.ts` | Regenerates the manifest JSON from TS. |
| `verify.ts` | Verification harness (scoring + validation). |

## Commands

```bash
# Regenerate the manifest after changing mechanisms.ts
npx tsx lib/brand-mechanism/scripts/generate-manifest.ts

# Run the verification harness
npx tsx lib/brand-mechanism/verify.ts

# Typecheck (strict)
npx tsc --noEmit
```

## Scoring rules

- 4 questions/mechanism, Likert 1–5 → score 4–20; `percentage = score / 20 * 100`.
- Status: `≥16 dominant`, `12–15 secondary`, `≤11 weak`.
- Congruence from `dominant − secondary` gap: `≥5 Ridicată`, `≥3 Moderată`, else `Scăzută`.
- Ties break deterministically by canonical mechanism order (`mechanismIds`).

## Convention notes

- TypeScript is the source of truth; the JSON manifest is generated from it.
- Validation is hand-rolled to match the existing repo pattern, since `zod` is
  not a project dependency. If zod is adopted project-wide, `validate.ts` is the
  single place to swap.
