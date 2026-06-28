// EMOVEL Brand Mechanism Audit — questionnaire & domain model.
// TypeScript is the source of truth for this module. The manifest JSON and any
// downstream config are GENERATED from the values below — never hand-written.

export const MODULE_ID = "brand_mechanism_audit" as const;
export const MODULE_NAME = "EMOVEL Brand Mechanism Audit" as const;
export const MODULE_VERSION = "1.0.0" as const;

// --- Likert scale -----------------------------------------------------------

export type Likert = 1 | 2 | 3 | 4 | 5;

export const LIKERT_MIN = 1 as const;
export const LIKERT_MAX = 5 as const;

export const likertLabels: Record<Likert, string> = {
  1: "Deloc adevărat",
  2: "Puțin adevărat",
  3: "Parțial adevărat",
  4: "Adevărat",
  5: "Foarte adevărat",
};

// Convenience bundle for UI/manifest consumers.
export const likertScale = {
  min: LIKERT_MIN,
  max: LIKERT_MAX,
  labels: likertLabels,
} as const;

// --- Mechanisms -------------------------------------------------------------

export const mechanismIds = [
  "identificare",
  "aspiratie",
  "siguranta",
  "obicei",
  "diferentiere",
] as const;

export type MechanismId = (typeof mechanismIds)[number];

export type Question = {
  id: string;
  text: string;
};

export type Mechanism = {
  id: MechanismId;
  name: string;
  description: string;
  questions: Question[];
};

// Canonical order is `mechanismIds`. It is also the deterministic tie-break
// order used by the scoring engine when two mechanisms share a score.
export const mechanisms: readonly Mechanism[] = [
  {
    id: "identificare",
    name: "Identificare",
    description:
      "Brandul atrage prin apartenență, valori comune, stil și sentimentul de potrivire personală.",
    questions: [
      { id: "q1", text: "Clienții spun des că se regăsesc în brandul tău." },
      { id: "q2", text: "Comunicarea ta pune accent pe valori, stil și personalitate." },
      { id: "q3", text: "Brandul tău atrage oameni cu interese și stiluri similare." },
      { id: "q4", text: "Clienții cumpără pentru că simt că produsul este pentru ei." },
    ],
  },
  {
    id: "aspiratie",
    name: "Aspirație",
    description:
      "Brandul atrage prin promisiunea unei versiuni mai bune, mai avansate sau mai elevate a clientului.",
    questions: [
      { id: "q5", text: "Brandul tău promite o versiune mai bună a clientului." },
      { id: "q6", text: "Comunicarea ta folosește un ton premium, idealizat sau orientat spre evoluție." },
      { id: "q7", text: "Clienții cumpără pentru că vor progres, status sau transformare." },
      { id: "q8", text: "Produsul tău este perceput ca un nivel superior față de alternative." },
    ],
  },
  {
    id: "siguranta",
    name: "Siguranță",
    description:
      "Brandul atrage prin încredere, claritate, risc redus, stabilitate și predictibilitate.",
    questions: [
      { id: "q9", text: "Clienții cumpără pentru că au încredere în tine." },
      { id: "q10", text: "Comunicarea ta pune accent pe dovezi, predictibilitate și stabilitate." },
      { id: "q11", text: "Brandul tău este perceput ca o alegere cu risc redus." },
      { id: "q12", text: "Clienții apreciază claritatea și simplitatea informațiilor tale." },
    ],
  },
  {
    id: "obicei",
    name: "Obicei",
    description:
      "Brandul atrage prin familiaritate, repetiție, acces ușor și comportament recurent.",
    questions: [
      { id: "q13", text: "Clienții revin constant fără să fie nevoie de persuasiune intensă." },
      { id: "q14", text: "Brandul tău este alegerea implicită în categoria lui." },
      { id: "q15", text: "Procesul de cumpărare este foarte simplu și rapid." },
      { id: "q16", text: "Clienții cumpără pentru că sunt deja obișnuiți cu brandul sau produsul." },
    ],
  },
  {
    id: "diferentiere",
    name: "Diferențiere",
    description:
      "Brandul atrage prin unicitate, contrast, poziționare clară și avantaj distinct.",
    questions: [
      { id: "q17", text: "Brandul tău este perceput ca fiind clar diferit de alternative." },
      { id: "q18", text: "Comunicarea ta evidențiază un avantaj distinct." },
      { id: "q19", text: "Clienții aleg brandul tău pentru un motiv specific și ușor de explicat." },
      { id: "q20", text: "Poziționarea ta este clară și memorabilă." },
    ],
  },
] as const;

// --- Derived lookups (computed from the data above, not duplicated) ---------

export const QUESTIONS_PER_MECHANISM = mechanisms[0].questions.length; // 4
export const MIN_SCORE_PER_MECHANISM = QUESTIONS_PER_MECHANISM * LIKERT_MIN; // 4
export const MAX_SCORE_PER_MECHANISM = QUESTIONS_PER_MECHANISM * LIKERT_MAX; // 20

/** Flat list of all question ids in presentation order (q1..q20). */
export const allQuestionIds: string[] = mechanisms.flatMap((m) =>
  m.questions.map((q) => q.id),
);

/** Map of question id -> owning mechanism id. */
export const questionToMechanism: Record<string, MechanismId> = Object.fromEntries(
  mechanisms.flatMap((m) => m.questions.map((q) => [q.id, m.id] as const)),
);

export function getMechanism(id: MechanismId): Mechanism {
  const found = mechanisms.find((m) => m.id === id);
  if (!found) throw new Error(`Unknown mechanism id: ${id}`);
  return found;
}

// Status thresholds (per mechanism score 4..20). Single source of truth for the
// score bands; STATUS_* mins are derived from it so there is no duplicated rule.
export const scoreThresholds = {
  dominant: { min: 16, max: MAX_SCORE_PER_MECHANISM, label: "Mecanism dominant" },
  secondary: { min: 12, max: 15, label: "Mecanism secundar" },
  weak: { min: MIN_SCORE_PER_MECHANISM, max: 11, label: "Mecanism slab sau nerelevant" },
} as const;

export const STATUS_DOMINANT_MIN = scoreThresholds.dominant.min;
export const STATUS_SECONDARY_MIN = scoreThresholds.secondary.min;

export type MechanismStatus = "dominant" | "secondary" | "weak";

export const statusLabels: Record<MechanismStatus, string> = {
  dominant: "Mecanism dominant",
  secondary: "Mecanism secundar",
  weak: "Mecanism slab sau nerelevant",
};

export type CongruenceLevel = "Ridicată" | "Moderată" | "Scăzută";

// Congruence thresholds (gap between dominant and secondary scores).
export const CONGRUENCE_HIGH_MIN = 5;
export const CONGRUENCE_MODERATE_MIN = 3;
