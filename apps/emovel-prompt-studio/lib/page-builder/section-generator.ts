import { buildBrandAwarePromptForSlug } from "@/lib/brand-os";
import type { BrandAwarePromptOutput } from "@/lib/brand-os";
import type { ProjectAssets, RefinedBrief } from "../project-schema";
import type { LandingPageBuilderProject } from "./generator";
import type { PageBuilderDocument, PageBuilderSectionType } from "./schema";
import { regeneratableSectionTypes, type RegeneratablePageBuilderSectionType } from "./section-regeneration";

export type PageBuilderSectionPromptInput = {
  slug: string;
  document: PageBuilderDocument;
  sectionType: RegeneratablePageBuilderSectionType;
  project: LandingPageBuilderProject;
  assets?: Partial<ProjectAssets>;
};

export type PageBuilderSectionPromptOutput = BrandAwarePromptOutput;

function trimText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function compactProject(project: LandingPageBuilderProject): Record<string, unknown> {
  const brief: Partial<RefinedBrief> = project.refinedBrief ?? {};
  return {
    title: trimText(project.title),
    prompt: trimText(project.prompt),
    refinedBrief: {
      productType: trimText(brief.productType),
      targetAudience: trimText(brief.targetAudience),
      platform: trimText(brief.platform),
      tone: trimText(brief.tone),
      launchGoal: trimText(brief.launchGoal),
      pricePoint: trimText(brief.pricePoint),
    },
  };
}

function compactAssets(assets?: Partial<ProjectAssets>): Record<string, unknown> {
  return {
    strategy: assets?.strategy,
    offer: assets?.offer,
    copy: assets?.copy,
    ux: assets?.ux,
    design: assets?.design,
    build: assets?.build,
    publish: assets?.publish,
  };
}

function sectionContract(sectionType: PageBuilderSectionType): string {
  switch (sectionType) {
    case "hero":
      return 'Return { "type": "hero", "headline": string, "subheadline"?: string, "primary_cta": string, "secondary_cta"?: string, "proof_line"?: string }.';
    case "offer":
      return 'Return { "type": "offer", "title": string, "deliverables": string[], "format": string, "timeline": string }. deliverables must include at least 2 items.';
    case "pricing":
      return 'Return { "type": "pricing", "pilot_price": string, "premium_upgrade": string, "pricing_rationale": string, "risk_reversal": string }.';
    case "faq":
      return 'Return { "type": "faq", "items": [{ "question": string, "answer": string }] }. items must include at least 3 complete pairs.';
    case "final_cta":
      return 'Return { "type": "final_cta", "headline": string, "cta": string, "microcopy"?: string }.';
    case "product_showcase":
      return [
        'Return { "type": "product_showcase", "layout": "split" | "fullbleed", "productName": string, "headline": string, "productAsset": object, "productAlt": string, "ctas": array, "features": array, "theme": object, ...optional fields }.',
        "For split layout include 2-4 feature cards. Keep labels and values short.",
        "Respect existing layout/theme/features/assets when useful.",
        "If a real asset is missing, use a clearly draft-safe placeholder src and mention the missing asset in the copy/notes context; never invent a real URL.",
      ].join("\n");
    default:
      return "Unsupported section.";
  }
}

function buildBasePrompt(sectionType: RegeneratablePageBuilderSectionType): string {
  return [
    "You are the EMOVEL Page Builder section regenerator.",
    "",
    "OUTPUT FORMAT (strict):",
    "- Respond with JSON only.",
    "- Output exactly ONE section object and nothing else.",
    "- No markdown, no code fences, no commentary, no explanations outside JSON.",
    `- The section object's type MUST be exactly "${sectionType}".`,
    "- The section must satisfy the existing PageBuilderDocument schema.",
    "",
    "TASK:",
    `Regenerate only the ${sectionType} section.`,
    "- Preserve the page context and commercial logic from the existing document.",
    "- Do not change, summarize, or emit any other section.",
    "- Do not invent real proof, testimonials, logos, metrics, customers, or URLs.",
    "- If proof is needed but missing, use clearly marked placeholders.",
    "- If a visual asset is missing, mark it as missing/draft-safe; do not fabricate a real URL.",
    "",
    "SECTION CONTRACT:",
    sectionContract(sectionType),
  ].join("\n");
}

export function isSupportedSectionRegeneration(type: string): type is RegeneratablePageBuilderSectionType {
  return regeneratableSectionTypes.includes(type as RegeneratablePageBuilderSectionType);
}

export async function buildPageBuilderSectionPrompt(
  args: PageBuilderSectionPromptInput,
): Promise<PageBuilderSectionPromptOutput> {
  const currentSection = args.document.sections.find((section) => section.type === args.sectionType) ?? null;

  return buildBrandAwarePromptForSlug({
    slug: args.slug,
    taskType: "landing_page",
    basePrompt: buildBasePrompt(args.sectionType),
    input: {
      section_type: args.sectionType,
      project: compactProject(args.project),
      current_section: currentSection,
      page_context: {
        title: args.document.title,
        status: args.document.status,
        brand_context: args.document.brand_context,
        section_order: args.document.sections.map((section) => section.type),
        other_sections: args.document.sections
          .filter((section) => section.type !== args.sectionType)
          .map((section) => ({
            type: section.type,
            headline: "headline" in section ? section.headline : undefined,
            title: "title" in section ? section.title : undefined,
          })),
      },
      assets: compactAssets(args.assets),
      supported_section_types: regeneratableSectionTypes,
    },
  });
}
