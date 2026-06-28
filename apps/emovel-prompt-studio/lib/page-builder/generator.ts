// EMOVEL Page Builder Core — Landing Page Generator prompt builder (Phase 3).
//
// Contract-only: this module builds the brand-aware prompt/messages that ask an
// AI to emit a strictly schema-compatible `PageBuilderDocument` as JSON. It does
// NOT call any model, parse any output, render any UI, or touch the workspace /
// `/api/ai/generate` / Brand OS. It reuses the existing Brand OS adapter
// (`buildBrandAwarePromptForSlug`) so the landing-page generation inherits the
// brand's dominant mechanism, tone, and control rules — fallback-safe when no
// brand profile exists.

import { buildBrandAwarePromptForSlug } from "@/lib/brand-os";
import type { BrandAwarePromptOutput } from "@/lib/brand-os";
import type {
  BuildAsset,
  CopyAsset,
  DesignAsset,
  OfferAsset,
  ProjectAssets,
  PublishAsset,
  RefinedBrief,
  StrategyAsset,
  UXAsset,
} from "../project-schema";
import { canonicalSectionOrder } from "./sections";

export type LandingPageBuilderProject = {
  title: string;
  prompt?: string;
  refinedBrief?: Partial<RefinedBrief>;
};

export type LandingPageBuilderInput = {
  slug: string;
  project: LandingPageBuilderProject;
  // Structured assets produced upstream by the workspace pipeline. All optional:
  // when an asset is missing, the prompt asks for a robust structure from the
  // data that IS available rather than inventing facts.
  assets?: Partial<ProjectAssets>;
};

export type LandingPageBuilderPromptOutput = BrandAwarePromptOutput;

const REQUIRED_SECTIONS = [
  "hero",
  "problem",
  "mechanism",
  "offer",
  "proof",
  "pricing",
  "faq",
  "final_cta",
  "implementation_notes",
] as const;

function trimText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

// --- compact asset summaries (keep the prompt lean, never dump raw blobs) ----

function summarizeStrategy(asset?: StrategyAsset) {
  if (!asset) return undefined;
  return {
    audience: trimText(asset.audience),
    problem: trimText(asset.problem),
    positioning: trimText(asset.positioning),
    opportunity: trimText(asset.opportunity),
  };
}

function summarizeOffer(asset?: OfferAsset) {
  if (!asset) return undefined;
  return {
    offerName: trimText(asset.offerName),
    pricing: trimText(asset.pricing),
    deliverables: Array.isArray(asset.deliverables) ? asset.deliverables : [],
    guarantee: trimText(asset.guarantee),
  };
}

function summarizeCopy(asset?: CopyAsset) {
  if (!asset) return undefined;
  return {
    headline: trimText(asset.headline),
    subheadline: trimText(asset.subheadline),
    cta: trimText(asset.cta),
    offerDescription: trimText(asset.offerDescription),
  };
}

function summarizeUx(asset?: UXAsset) {
  if (!asset) return undefined;
  return {
    pageStructure: Array.isArray(asset.pageStructure) ? asset.pageStructure : [],
    sections: Array.isArray(asset.sections) ? asset.sections : [],
    hierarchy: trimText(asset.hierarchy),
  };
}

function summarizeDesign(asset?: DesignAsset) {
  if (!asset) return undefined;
  return {
    colorPalette: Array.isArray(asset.colorPalette) ? asset.colorPalette : [],
    typography: trimText(asset.typography),
    visualDirection: trimText(asset.visualDirection),
  };
}

function summarizeBuild(asset?: BuildAsset) {
  if (!asset) return undefined;
  return {
    nextAppBrief: trimText(asset.nextAppBrief),
    pages: Array.isArray(asset.pages) ? asset.pages : [],
    components: Array.isArray(asset.components) ? asset.components : [],
    stack: Array.isArray(asset.stack) ? asset.stack : [],
  };
}

function summarizePublish(asset?: PublishAsset) {
  if (!asset) return undefined;
  return {
    gumroadListing: trimText(asset.gumroadListing),
    launchChecklist: Array.isArray(asset.launchChecklist) ? asset.launchChecklist : [],
    distributionChannels: Array.isArray(asset.distributionChannels) ? asset.distributionChannels : [],
  };
}

function buildInput(args: LandingPageBuilderInput): Record<string, unknown> {
  const { project, assets } = args;
  const brief = project.refinedBrief ?? {};

  const availableAssets: Record<string, unknown> = {};
  const strategy = summarizeStrategy(assets?.strategy);
  const offer = summarizeOffer(assets?.offer);
  const copy = summarizeCopy(assets?.copy);
  const ux = summarizeUx(assets?.ux);
  const design = summarizeDesign(assets?.design);
  const build = summarizeBuild(assets?.build);
  const publish = summarizePublish(assets?.publish);

  if (strategy) availableAssets.strategy = strategy;
  if (offer) availableAssets.offer = offer;
  if (copy) availableAssets.copy = copy;
  if (ux) availableAssets.ux = ux;
  if (design) availableAssets.design = design;
  if (build) availableAssets.build = build;
  if (publish) availableAssets.publish = publish;

  const presentAssetKeys = Object.keys(availableAssets);
  const missingAssetKeys = ["strategy", "offer", "copy", "ux", "design", "build", "publish"].filter(
    (key) => !presentAssetKeys.includes(key),
  );

  return {
    project_title: trimText(project.title) || "Untitled landing page",
    source_prompt: trimText(project.prompt),
    refined_brief: {
      productType: trimText(brief.productType),
      targetAudience: trimText(brief.targetAudience),
      platform: trimText(brief.platform),
      tone: trimText(brief.tone),
      launchGoal: trimText(brief.launchGoal),
      pricePoint: trimText(brief.pricePoint),
    },
    available_assets: availableAssets,
    present_asset_keys: presentAssetKeys,
    missing_asset_keys: missingAssetKeys,
  };
}

// The base instruction block. Brand OS wraps this with the brand framing +
// mechanism directive; the strict JSON contract lives here so it survives both
// the brand-aware and the neutral (fallback) path.
function buildBasePrompt(): string {
  const requiredList = REQUIRED_SECTIONS.join(", ");
  return [
    "You are the EMOVEL Landing Page Generator. Produce ONE landing page as a structured document.",
    "",
    "OUTPUT FORMAT (strict):",
    "- Respond with JSON only. Output a single JSON object and nothing else.",
    "- No markdown, no code fences, no commentary, and no explanations outside the JSON.",
    "- The JSON MUST be a valid PageBuilderDocument.",
    "",
    "PageBuilderDocument shape:",
    '- page_type: "landing_page"',
    '- status: "draft" or "validated"',
    "- title: string (the project title)",
    "- sections: array of section objects in the canonical EMOVEL order",
    `  (${canonicalSectionOrder.join(" -> ")}).`,
    "",
    `REQUIRED sections (all must be present): ${requiredList}.`,
    "OPTIONAL section: product_showcase (include only when a clear product visual story exists).",
    "",
    "Per-section rules:",
    "1. hero: must have headline and primary_cta.",
    "2. problem: must have title, at least 2 symptoms, and cost_of_inaction.",
    "3. mechanism: must have title, explanation, why_it_works, and at least 1 difference_from_alternatives.",
    "4. offer: must have title, at least 2 deliverables, format, and timeline.",
    "5. proof: proof_points, credibility_signals, testimonial_placeholders.",
    "6. pricing: pilot_price, premium_upgrade, pricing_rationale, risk_reversal.",
    "7. faq: at least 3 items, each with question and answer.",
    "8. final_cta: headline and cta.",
    "9. implementation_notes: components (>= 1), required_sections, missing_visual_assets, acceptance_checks (>= 1).",
    "",
    "OPTIONAL product_showcase contract (only if included):",
    '- type: "product_showcase"',
    '- layout: "split" or "fullbleed"',
    "- productName, headline, productAlt (required strings)",
    "- productAsset: object with a src (use a draft-safe placeholder src if no real asset exists)",
    "- ctas: at least 1 CTA, each with a label and variant (\"primary\" or \"secondary\")",
    "- theme: object with background, foreground, muted, accent, card, border, overlayGradient, typography",
    "- features: for split layout include 2-4 feature cards; for fullbleed 0-4. Keep feature label and value short (no paragraphs).",
    "",
    "TRUTH & PLACEHOLDER RULES:",
    "- Do NOT invent real proof, testimonials, metrics, logos, or customers. If no proof exists, use clearly-marked proof placeholders (e.g. \"[PLACEHOLDER: founder result quote]\").",
    "- Do NOT invent real visual assets. If no asset exists, use a clearly draft-safe asset placeholder AND list the gap in implementation_notes.missing_visual_assets.",
    "- Use only the supplied project data and assets. Where data is missing, build a robust, generic-but-credible structure from what is available — never fabricate specifics.",
    "",
    "TONE:",
    "- Premium, clear, applicable. No hype, no exaggerated claims, no false promises.",
    "",
    "Return the PageBuilderDocument JSON now.",
  ].join("\n");
}

/**
 * Build a brand-aware prompt for generating a `PageBuilderDocument`.
 *
 * Reuses the Brand OS adapter (`buildBrandAwarePromptForSlug`) with
 * taskType "landing_page": when a Brand Mechanism Profile exists for `slug`
 * the prompt is amplified with the brand's dominant mechanism, tone, and
 * control rules; otherwise it falls back safely to neutral EMOVEL standards
 * (hasBrandContext === false) and generation is never blocked.
 *
 * This function does NOT call the model — it only returns the prompt/messages.
 */
export async function buildLandingPageBuilderPrompt(
  args: LandingPageBuilderInput,
): Promise<LandingPageBuilderPromptOutput> {
  const basePrompt = buildBasePrompt();
  const input = buildInput(args);

  return buildBrandAwarePromptForSlug({
    slug: args.slug,
    basePrompt,
    taskType: "landing_page",
    input,
  });
}
