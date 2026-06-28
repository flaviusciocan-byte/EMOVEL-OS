// EMOVEL Brand OS — brand-aware prompt adapter (Agent Factory / Content Engine).
// Injects the brand's strategic profile (AgentBrandContext) into the existing
// EMOVEL prompt pattern (system + user messages, see lib/ai/prompt.ts).
// Pure and fallback-safe: pass a brandContext, or resolve one from a slug. When
// no profile exists, generation continues with a neutral EMOVEL context and a
// dominant mechanism is never invented.

import type { AiPromptMessage } from "../ai/providers";
import type { AgentBrandContext } from "./agent-factory";
import { getAgentBrandContext } from "./agent-factory";

export const brandAwareTaskTypes = [
  "headline",
  "landing_page",
  "ad",
  "email",
  "content_angle",
  "product_description",
  "pitch_section",
  "instagram_post",
  "carousel",
  "reel_script",
  "strategy",
] as const;

export type BrandAwareTaskType = (typeof brandAwareTaskTypes)[number];

// Maps an external/generator assetType label to a BrandAwareTaskType.
// Accepts hyphen/underscore/spacing variants. Unknown -> "strategy" so existing
// generators keep their current behavior (safe default).
const assetTypeToTaskType: Record<string, BrandAwareTaskType> = {
  strategy: "strategy",
  headline: "headline",
  "landing-page": "landing_page",
  landing_page: "landing_page",
  page: "landing_page",
  ad: "ad",
  ads: "ad",
  email: "email",
  "content-angle": "content_angle",
  content_angle: "content_angle",
  instagram: "instagram_post",
  "instagram-post": "instagram_post",
  instagram_post: "instagram_post",
  carousel: "carousel",
  reel: "reel_script",
  "reel-script": "reel_script",
  reel_script: "reel_script",
  "product-description": "product_description",
  product_description: "product_description",
  pitch: "pitch_section",
  "pitch-section": "pitch_section",
  pitch_section: "pitch_section",
};

export function toBrandAwareTaskType(assetType: string | undefined): BrandAwareTaskType {
  if (!assetType) return "strategy";
  return assetTypeToTaskType[assetType.trim().toLowerCase()] ?? "strategy";
}

export type BrandAwareFallbackReason =
  | "missing_profile"
  | "invalid_slug"
  | "context_error";

export type OptionalBrandContext = AgentBrandContext | null;
export type RequiredBrandContext = AgentBrandContext;

export type BrandAwarePromptInput = {
  basePrompt: string;
  brandContext?: OptionalBrandContext;
  taskType: BrandAwareTaskType;
  input?: Record<string, unknown> | string;
  fallbackReason?: BrandAwareFallbackReason;
};

export type BrandAwarePromptOutput = {
  systemPrompt: string;
  userPrompt: string;
  messages: AiPromptMessage[];
  taskType: BrandAwareTaskType;
  hasBrandContext: boolean;
  fallback: boolean;
  appliedMechanism?: string;
  fallbackReason?: BrandAwareFallbackReason;
};

const NEUTRAL_FRAMING =
  "You are an EMOVEL brand asset generator. Use a premium, clear, mature, business-oriented voice. No hype, no exaggerated claims, no generic filler.";

function congruenceRule(level: AgentBrandContext["congruence_level"]): string {
  switch (level) {
    case "Scăzută":
      return "Brand signals are mixed: increase clarity, use fewer angles, keep the promise simpler, commit to ONE angle, and avoid contradictory messages.";
    case "Moderată":
      return "Keep a single primary angle and refine for consistency across the piece.";
    case "Ridicată":
    default:
      return "The brand has a clear direction: stay fully consistent with the dominant mechanism throughout.";
  }
}

// Per task type, enforce the relevant recommended structure(s).
function taskStructureDirective(ctx: AgentBrandContext, taskType: BrandAwareTaskType): string {
  switch (taskType) {
    case "landing_page":
      return `Follow this page structure in order: ${ctx.recommended_page_structure.join(" -> ")}.`;
    case "ad":
      return `Follow this ad structure/angle: ${ctx.recommended_ad_structure}`;
    case "email":
      return `Follow this email structure/angle: ${ctx.recommended_email_structure}`;
    case "content_angle":
    case "instagram_post":
    case "carousel":
    case "reel_script":
      return `Prioritize these content types/formats: ${ctx.recommended_content_types.join(", ")}.`;
    case "product_description":
      return `Lead with the primary trigger "${ctx.primary_trigger}" in a ${ctx.recommended_tone} tone, and respect the internal control rule above.`;
    case "pitch_section":
      return `Use a ${ctx.recommended_tone} tone, structure the pitch around: ${ctx.recommended_page_structure.join(" -> ")}, and respect the internal control rule above.`;
    case "strategy":
      return `Frame the strategy (audience, problem, positioning, opportunity) around the dominant mechanism "${ctx.dominant_mechanism}", in a ${ctx.recommended_tone} tone, and respect the internal control rule above.`;
    case "headline":
    default:
      return `Lead with the primary trigger and a ${ctx.recommended_tone} tone; close on a "${ctx.best_cta_style}" style CTA.`;
  }
}

function brandDirective(ctx: AgentBrandContext, taskType: BrandAwareTaskType): string {
  return [
    "BRAND MECHANISM DIRECTIVE (internal control — never name these terms to the reader):",
    `- Dominant mechanism: ${ctx.dominant_mechanism}. Use this as the PRIMARY persuasion logic in every line.`,
    `- Secondary mechanism: ${ctx.secondary_mechanism}. Use it only as light support, never as the main message.`,
    `- Primary trigger: "${ctx.primary_trigger}". Drive the hook, headline, promise, CTA, and narrative structure from this.`,
    `- Voice / tone: ${ctx.recommended_tone}.`,
    `- Best CTA style: ${ctx.best_cta_style}.`,
    `- Avoid (internal rule, do not show the reader): ${ctx.avoid}. Never use angles that contradict the dominant mechanism.`,
    `- Congruence: ${ctx.congruence_level}. ${congruenceRule(ctx.congruence_level)}`,
    `- Control rule (do not surface to the reader): ${ctx.strategic_warning}`,
    `- ${taskStructureDirective(ctx, taskType)}`,
  ].join("\n");
}

function neutralDirective(): string {
  return [
    "BRAND MECHANISM DIRECTIVE:",
    "- No brand mechanism profile is available. Generate using neutral EMOVEL premium standards.",
    "- Use EMOVEL's default voice: premium, clear, mature, business-oriented. No hype, no generic filler.",
    "- Do NOT assume or invent a dominant psychological mechanism.",
    "- Keep the output clear and single-angle.",
  ].join("\n");
}

function renderInput(input: BrandAwarePromptInput["input"]): string {
  if (input == null) return "";
  if (typeof input === "string") return input;
  return JSON.stringify(input, null, 2);
}

/**
 * Build a brand-aware prompt. Pure: no I/O. When `brandContext` is null/omitted
 * the output uses a neutral EMOVEL directive and sets `fallback: true`.
 */
export function buildBrandAwarePrompt(args: BrandAwarePromptInput): BrandAwarePromptOutput {
  const { basePrompt, taskType } = args;
  const brandContext = args.brandContext ?? null;
  const hasBrandContext = brandContext !== null;

  const framing = hasBrandContext ? brandContext.system_prompt : NEUTRAL_FRAMING;
  const directive = hasBrandContext ? brandDirective(brandContext, taskType) : neutralDirective();

  const systemPrompt = [framing, basePrompt, directive].filter(Boolean).join("\n\n");
  const inputText = renderInput(args.input);
  const userPrompt = `Task type: ${taskType}${inputText ? `\n\n${inputText}` : ""}`;

  const messages: AiPromptMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  return {
    systemPrompt,
    userPrompt,
    messages,
    taskType,
    hasBrandContext,
    fallback: !hasBrandContext,
    appliedMechanism: hasBrandContext ? brandContext.dominant_mechanism : undefined,
    fallbackReason: hasBrandContext ? undefined : (args.fallbackReason ?? "missing_profile"),
  };
}

export type BrandAwarePromptForSlugInput = {
  slug: string;
  basePrompt: string;
  taskType: BrandAwareTaskType;
  input?: Record<string, unknown> | string;
};

/**
 * Resolve the brand context for `slug` (fallback-safe) and build the prompt.
 * If no profile is stored, or the slug is invalid, it builds with a neutral
 * EMOVEL context instead of throwing — generation is never blocked.
 */
export async function buildBrandAwarePromptForSlug(
  args: BrandAwarePromptForSlugInput,
): Promise<BrandAwarePromptOutput> {
  try {
    const brandContext = await getAgentBrandContext(args.slug);
    if (brandContext) {
      return buildBrandAwarePrompt({
        basePrompt: args.basePrompt,
        brandContext,
        taskType: args.taskType,
        input: args.input,
      });
    }
    // Valid slug, no stored profile yet.
    return buildBrandAwarePrompt({
      basePrompt: args.basePrompt,
      brandContext: null,
      taskType: args.taskType,
      input: args.input,
      fallbackReason: "missing_profile",
    });
  } catch (err) {
    // The store throws "Invalid brand slug: ..." for malformed slugs; map that
    // to invalid_slug, and any other read/parse failure to context_error.
    const reason: BrandAwareFallbackReason =
      err instanceof Error && /invalid brand slug/i.test(err.message)
        ? "invalid_slug"
        : "context_error";
    return buildBrandAwarePrompt({
      basePrompt: args.basePrompt,
      brandContext: null,
      taskType: args.taskType,
      input: args.input,
      fallbackReason: reason,
    });
  }
}
