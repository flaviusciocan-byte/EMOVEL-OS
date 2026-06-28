// EMOVEL Brand Mechanism Audit — scoring engine.
// Pure, deterministic functions. No I/O, no dependencies. The single place that
// turns 20 Likert answers into a strategic brand profile.

import {
  CONGRUENCE_HIGH_MIN,
  CONGRUENCE_MODERATE_MIN,
  MAX_SCORE_PER_MECHANISM,
  STATUS_DOMINANT_MIN,
  STATUS_SECONDARY_MIN,
  type CongruenceLevel,
  type Likert,
  type Mechanism,
  type MechanismId,
  type MechanismStatus,
  getMechanism,
  mechanismIds,
  mechanisms,
} from "./mechanisms";

/** Answers keyed by question id (q1..q20), each a Likert value 1..5. */
export type AuditAnswers = Record<string, Likert>;

export type MechanismResult = {
  id: MechanismId;
  name: string;
  score: number; // 4..20
  percentage: number; // 0..100, rounded to 1 decimal
  status: MechanismStatus;
};

export type AuditResult = {
  results: MechanismResult[]; // ranked, highest score first
  scores: Record<MechanismId, number>;
  percentages: Record<MechanismId, number>;
  dominant: MechanismResult;
  secondary: MechanismResult;
  scoreGap: number;
  congruence: CongruenceLevel;
};

function classify(score: number): MechanismStatus {
  if (score >= STATUS_DOMINANT_MIN) return "dominant";
  if (score >= STATUS_SECONDARY_MIN) return "secondary";
  return "weak";
}

function congruenceFromGap(gap: number): CongruenceLevel {
  if (gap >= CONGRUENCE_HIGH_MIN) return "Ridicată";
  if (gap >= CONGRUENCE_MODERATE_MIN) return "Moderată";
  return "Scăzută";
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Sum the Likert answers for a single mechanism's questions. */
export function mechanismScore(mechanism: Mechanism, answers: AuditAnswers): number {
  return mechanism.questions.reduce((total, q) => total + answers[q.id], 0);
}

/**
 * Score a complete set of answers.
 * Tie-break is deterministic: when two mechanisms share a score, the one earlier
 * in the canonical `mechanismIds` order ranks higher.
 */
export function scoreAudit(answers: AuditAnswers): AuditResult {
  const canonicalIndex = (id: MechanismId) => mechanismIds.indexOf(id);

  const results: MechanismResult[] = mechanisms.map((m) => {
    const score = mechanismScore(m, answers);
    return {
      id: m.id,
      name: m.name,
      score,
      percentage: round1((score / MAX_SCORE_PER_MECHANISM) * 100),
      status: classify(score),
    };
  });

  const ranked = [...results].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return canonicalIndex(a.id) - canonicalIndex(b.id);
  });

  const scores = Object.fromEntries(
    results.map((r) => [r.id, r.score]),
  ) as Record<MechanismId, number>;

  const percentages = Object.fromEntries(
    results.map((r) => [r.id, r.percentage]),
  ) as Record<MechanismId, number>;

  const dominant = ranked[0];
  const secondary = ranked[1];
  const scoreGap = dominant.score - secondary.score;

  return {
    results: ranked,
    scores,
    percentages,
    dominant,
    secondary,
    scoreGap,
    congruence: congruenceFromGap(scoreGap),
  };
}

export { classify as classifyMechanismStatus, congruenceFromGap };

// Re-export the canonical helper so callers can resolve names without reaching
// into mechanisms.ts directly.
export { getMechanism };
