// EMOVEL Brand OS — public surface.
// Import from "@/lib/brand-os". This layer persists and serves the brand
// mechanism profile (the brand's strategic DNA) for Agent Factory, Content
// Engine, Landing Page Generator, and future UI/PDF modules.
//
// lib/brand-mechanism stays the pure diagnostic core; this layer adds the
// async, file-based persistence around it.

export * from "./store";
export * from "./agent-factory";
export * from "./agent-prompt";

// Brand OS is the public home of the strategic-DNA type. It is produced by the
// diagnostic core (lib/brand-mechanism) but consumed/persisted here, so it is
// re-exported through this surface for UI and downstream modules.
export type { BrandMechanismProfile, BrandOsEnvelope } from "../brand-mechanism";

// Brand-aware prompt adapter public types.
export type {
  BrandAwareFallbackReason,
  BrandAwareTaskType,
  BrandAwarePromptInput,
  BrandAwarePromptOutput,
  BrandAwarePromptForSlugInput,
  OptionalBrandContext,
  RequiredBrandContext,
} from "./agent-prompt";

import {
  runBrandMechanismAudit,
  type AuditResult,
  type BrandMechanismProfile,
  type BrandOsEnvelope,
} from "../brand-mechanism";
import { saveBrandMechanismProfile, type BrandOsRecord } from "./store";

export type PersistContext = { slug: string };

export type RunAndPersistOutput =
  | { ok: false; errors: string[] }
  | {
      ok: true;
      result: AuditResult;
      profile: BrandMechanismProfile;
      envelope: BrandOsEnvelope;
      persisted: BrandOsRecord;
    };

/**
 * End-to-end: run the diagnostic audit and, only if valid, persist the profile
 * as the brand's strategic DNA.
 * - invalid input  -> { ok: false, errors }  and nothing is written
 * - valid input    -> { ok: true, result, profile, envelope, persisted }
 */
export async function runAndPersistBrandMechanismAudit(
  rawAnswers: unknown,
  context: PersistContext,
): Promise<RunAndPersistOutput> {
  const run = runBrandMechanismAudit(rawAnswers);
  if (!run.ok) {
    return { ok: false, errors: run.errors };
  }

  const persisted = await saveBrandMechanismProfile(context.slug, run.profile);
  return {
    ok: true,
    result: run.result,
    profile: run.profile,
    envelope: run.envelope,
    persisted,
  };
}
