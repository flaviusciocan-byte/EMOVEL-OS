// EMOVEL Brand Mechanism Audit — input validation.
// Hand-rolled validator (no zod, no new dependencies) in the spirit of the
// existing repo convention in `lib/ai/schema.ts`. Validates raw, untrusted
// answer input at the boundary before it reaches the scoring engine.

import { LIKERT_MAX, LIKERT_MIN, allQuestionIds, type Likert } from "./mechanisms";
import type { AuditAnswers } from "./scoring";

export type ValidationResult =
  | { ok: true; answers: AuditAnswers }
  | { ok: false; errors: string[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/**
 * Validate and normalize raw answer input.
 * Collects ALL problems (missing question, wrong type, out of range, unknown
 * key) into `errors` rather than throwing on the first. On success returns the
 * normalized `answers` containing exactly the 20 known questions.
 */
export function validateAuditAnswers(value: unknown): ValidationResult {
  if (!isRecord(value)) {
    return { ok: false, errors: ["Audit answers must be an object keyed by question id (q1..q20)."] };
  }

  const errors: string[] = [];
  const clean: AuditAnswers = {};

  for (const id of allQuestionIds) {
    if (!(id in value)) {
      errors.push(`Missing required question: ${id}.`);
      continue;
    }
    const raw = value[id];
    if (typeof raw !== "number" || !Number.isInteger(raw)) {
      errors.push(`Answer for ${id} must be an integer ${LIKERT_MIN}-${LIKERT_MAX}.`);
      continue;
    }
    if (raw < LIKERT_MIN || raw > LIKERT_MAX) {
      errors.push(`Answer for ${id} out of range (${LIKERT_MIN}-${LIKERT_MAX}): ${raw}.`);
      continue;
    }
    clean[id] = raw as Likert;
  }

  const known = new Set(allQuestionIds);
  const unknown = Object.keys(value).filter((k) => !known.has(k));
  if (unknown.length > 0) {
    errors.push(`Unknown question ids: ${unknown.join(", ")}.`);
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }
  return { ok: true, answers: clean };
}

/** Convenience: validate and throw a single combined error on failure. */
export function assertAuditAnswers(value: unknown): AuditAnswers {
  const res = validateAuditAnswers(value);
  if (!res.ok) {
    throw new Error(`Invalid audit answers: ${res.errors.join(" ")}`);
  }
  return res.answers;
}
