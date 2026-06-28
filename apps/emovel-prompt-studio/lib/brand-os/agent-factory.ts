// EMOVEL Brand OS — Agent Factory adapter.
// Maps a stored brand mechanism profile into a stable, agent-ready context.
// No fragile transforms: every field the agent layer needs is read directly
// from the profile (or the canonical agentRules / agentSystemPrompt).

import {
  agentRules,
  agentSystemPrompt,
  type BrandMechanismProfile,
  type CongruenceLevel,
  type MechanismId,
} from "../brand-mechanism";
import { getBrandMechanismProfile } from "./store";

export type AgentBrandContext = {
  dominant_mechanism: MechanismId;
  secondary_mechanism: MechanismId;
  congruence_level: CongruenceLevel;
  primary_trigger: string;
  avoid: string;
  best_cta_style: string;
  recommended_tone: string;
  recommended_content_types: string[];
  recommended_page_structure: string[];
  recommended_ad_structure: string;
  recommended_email_structure: string;
  strategic_warning: string;
  system_prompt: string;
};

/**
 * Build the Agent Factory context from a profile. This is what an agent uses to
 * generate headlines, landing pages, ads, emails, content angles, product
 * descriptions, and pitch sections — all driven by the dominant mechanism.
 */
export function buildAgentBrandContext(profile: BrandMechanismProfile): AgentBrandContext {
  const rule = agentRules[profile.dominant_mechanism];
  return {
    dominant_mechanism: profile.dominant_mechanism,
    secondary_mechanism: profile.secondary_mechanism,
    congruence_level: profile.congruence_level,
    primary_trigger: rule.primaryTrigger,
    avoid: rule.avoid,
    best_cta_style: rule.bestCtaStyle,
    recommended_tone: profile.recommended_tone,
    recommended_content_types: profile.recommended_content_types,
    recommended_page_structure: profile.recommended_page_structure,
    recommended_ad_structure: profile.recommended_ad_structure,
    recommended_email_structure: profile.recommended_email_structure,
    strategic_warning: profile.strategic_warning,
    system_prompt: agentSystemPrompt,
  };
}

/** Read a brand's stored profile and return an agent-ready context, or null. */
export async function getAgentBrandContext(slug: string): Promise<AgentBrandContext | null> {
  const profile = await getBrandMechanismProfile(slug);
  return profile ? buildAgentBrandContext(profile) : null;
}
