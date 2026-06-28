// EMOVEL Brand Mechanism Audit — public surface.
// Import from "@/lib/brand-mechanism" rather than reaching into sub-modules.

export * from "./mechanisms";
export * from "./scoring";
export * from "./validate";
export * from "./content";
export * from "./brand-os";
export * from "./manifest";

import { validateAuditAnswers } from "./validate";
import { scoreAudit, type AuditResult } from "./scoring";
import {
  buildBrandMechanismProfile,
  toBrandOsEnvelope,
  type BrandMechanismProfile,
  type BrandOsEnvelope,
} from "./brand-os";

export type RunAuditOutput =
  | {
      ok: true;
      result: AuditResult;
      profile: BrandMechanismProfile;
      envelope: BrandOsEnvelope;
    }
  | { ok: false; errors: string[] };

/**
 * End-to-end entry point: validate raw answers, score them, build the Brand OS
 * profile and envelope.
 *
 * On success returns `{ ok: true, result, profile, envelope }` — so the README
 * ergonomics `const { result, profile } = runBrandMechanismAudit(answers)` keep
 * working on the happy path. On invalid input returns `{ ok: false, errors }`
 * instead of throwing.
 */
export function runBrandMechanismAudit(rawAnswers: unknown): RunAuditOutput {
  const validation = validateAuditAnswers(rawAnswers);
  if (!validation.ok) {
    return { ok: false, errors: validation.errors };
  }

  const result = scoreAudit(validation.answers);
  const profile = buildBrandMechanismProfile(result);
  const envelope = toBrandOsEnvelope(profile);
  return { ok: true, result, profile, envelope };
}
