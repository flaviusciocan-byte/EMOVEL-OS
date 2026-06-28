// EMOVEL Brand Mechanism Audit — manifest builder.
// The manifest is DERIVED from the TypeScript source of truth (mechanisms.ts).
// `scripts/generate-manifest.ts` writes the JSON; it is never hand-edited.

import {
  MAX_SCORE_PER_MECHANISM,
  MIN_SCORE_PER_MECHANISM,
  MODULE_ID,
  MODULE_NAME,
  MODULE_VERSION,
  likertScale,
  mechanisms,
  scoreThresholds,
} from "./mechanisms";

export type ModuleManifest = ReturnType<typeof buildModuleManifest>;

export function buildModuleManifest() {
  return {
    module_id: MODULE_ID,
    module_name: MODULE_NAME,
    version: MODULE_VERSION,
    type: "diagnostic_audit",
    input_method: "likert_scale",
    generated: true,
    generated_from: "lib/brand-mechanism/mechanisms.ts",
    scale: {
      min: likertScale.min,
      max: likertScale.max,
      labels: likertScale.labels,
    },
    mechanisms: mechanisms.map((m) => ({
      id: m.id,
      name: m.name,
      description: m.description,
      questions: m.questions.map((q) => ({ id: q.id, text: q.text })),
    })),
    scoring: {
      min_score_per_mechanism: MIN_SCORE_PER_MECHANISM,
      max_score_per_mechanism: MAX_SCORE_PER_MECHANISM,
      interpretation: {
        dominant: { range: [scoreThresholds.dominant.min, scoreThresholds.dominant.max], label: scoreThresholds.dominant.label },
        secondary: { range: [scoreThresholds.secondary.min, scoreThresholds.secondary.max], label: scoreThresholds.secondary.label },
        weak: { range: [scoreThresholds.weak.min, scoreThresholds.weak.max], label: scoreThresholds.weak.label },
      },
      output_metrics: [
        "dominant_mechanism",
        "secondary_mechanism",
        "mechanism_scores",
        "mechanism_percentages",
        "brand_congruence_level",
      ],
    },
  };
}
