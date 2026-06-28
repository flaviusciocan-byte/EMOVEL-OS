// EMOVEL Brand Mechanism Audit — Brand OS sync.
// Turns a scored audit result into the brand's strategic DNA record, the shape
// consumed downstream by the Builder, Agent Factory, and content engines.

import type { CongruenceLevel, MechanismId } from "./mechanisms";
import { recommendations } from "./content";
import type { AuditResult } from "./scoring";

export type BrandMechanismProfile = {
  dominant_mechanism: MechanismId;
  secondary_mechanism: MechanismId;
  scores: Record<MechanismId, number>;
  percentages: Record<MechanismId, number>;
  congruence_level: CongruenceLevel;
  recommended_tone: string;
  recommended_content_types: string[];
  recommended_page_structure: string[];
  recommended_ad_structure: string;
  recommended_email_structure: string;
  strategic_warning: string;
};

export type BrandOsEnvelope = {
  brand_os: { brand_mechanism_profile: BrandMechanismProfile };
};

const congruenceNote: Record<CongruenceLevel, string> = {
  Ridicată:
    "Brandul are o direcție psihologică clară; menține-o consecvent pe toate canalele.",
  Moderată:
    "Brandul are un mecanism principal, dar comunicarea poate fi rafinată pentru a-l susține mai consecvent.",
  Scăzută:
    "Brandul amestecă prea multe promisiuni și riscă să creeze confuzie. Aliniază homepage, reclame, email și produs în jurul mecanismului dominant.",
};

/** Build the Brand OS strategic profile from a scored audit. */
export function buildBrandMechanismProfile(result: AuditResult): BrandMechanismProfile {
  const dominant = result.dominant.id;
  const rec = recommendations[dominant];

  const strategicWarning = `${rec.strategicWarning} ${congruenceNote[result.congruence]}`.trim();

  return {
    dominant_mechanism: dominant,
    secondary_mechanism: result.secondary.id,
    scores: result.scores,
    percentages: result.percentages,
    congruence_level: result.congruence,
    recommended_tone: rec.tone,
    recommended_content_types: rec.contentTypes,
    recommended_page_structure: rec.landingPageStructure,
    recommended_ad_structure: rec.adAngle,
    recommended_email_structure: rec.emailAngle,
    strategic_warning: strategicWarning,
  };
}

/** Wrap the profile under the `brand_os` envelope used by the OS store. */
export function toBrandOsEnvelope(profile: BrandMechanismProfile): BrandOsEnvelope {
  return { brand_os: { brand_mechanism_profile: profile } };
}
