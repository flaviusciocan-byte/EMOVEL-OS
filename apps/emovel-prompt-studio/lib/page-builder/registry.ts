import type { PageBuilderSectionType } from "./schema";

// Registry identity (Component Registry v1.1). The generated manifest derives
// these; do not duplicate them elsewhere.
export const PAGE_BUILDER_REGISTRY_ID = "emovel.page-builder.registry";
export const PAGE_BUILDER_REGISTRY_VERSION = "1.1";

// Component Registry v1.1 metadata.
//   - componentNumber : the 01–10 catalog position (canonical order). The ten
//     existing sections ARE components 01–10; NavigationBar/FooterSection (step 3)
//     and components 13–16 (step 6) extend this catalog later.
//   - registryId      : stable id, `emovel.section.<slug>` / `emovel.meta.<slug>`.
//   - kind            : "section" (rendered band) or "meta" (non-rendered).
//   - status          : "implemented" (has a live implementation + validation)
//                       or "notImplemented" (declared, no implementation yet).
//   - surfaceOwner    : who owns the Shared Layer surface — "SectionSurface" for
//                       rendered sections, "none" for meta (not wrapped).
//   - implementation  : the existing render component bound to this entry, or
//                       null for meta/non-rendered entries.
export type RegistryComponentKind = "section" | "meta";
export type RegistryComponentStatus = "implemented" | "notImplemented";
export type RegistrySurfaceOwner = "SectionSurface" | "none";

export interface PageBuilderRegistryEntry {
  id: PageBuilderSectionType;
  componentNumber: number;
  registryId: string;
  kind: RegistryComponentKind;
  status: RegistryComponentStatus;
  surfaceOwner: RegistrySurfaceOwner;
  implementation: string | null;
  label: string;
  category: "content" | "conversion" | "trust" | "commercial" | "commerce" | "meta";
  required: boolean;
  brandRole: string;
  exportRole: string;
  requiredFields: string[];
  optionalFields: string[];
  validationRules: string[];
  supportedLayouts?: string[];
}

export const pageBuilderRegistry: Record<PageBuilderSectionType, PageBuilderRegistryEntry> = {
  hero: {
    id: "hero",
    componentNumber: 1,
    registryId: "emovel.section.hero",
    kind: "section",
    status: "implemented",
    surfaceOwner: "SectionSurface",
    implementation: "HeroBlock",
    label: "Hero",
    category: "conversion",
    required: true,
    brandRole: "Lead with the primary promise and the clearest conversion action.",
    exportRole: "Opening section in markdown and future page output.",
    requiredFields: ["headline", "primary_cta"],
    optionalFields: ["subheadline", "secondary_cta", "proof_line"],
    validationRules: ["headline must be present", "primary_cta must be present"],
  },
  problem: {
    id: "problem",
    componentNumber: 2,
    registryId: "emovel.section.problem",
    kind: "section",
    status: "implemented",
    surfaceOwner: "SectionSurface",
    implementation: "ProblemBlock",
    label: "Problem",
    category: "content",
    required: true,
    brandRole: "Name the audience pain and the cost of delaying action.",
    exportRole: "Problem framing section.",
    requiredFields: ["title", "symptoms", "cost_of_inaction"],
    optionalFields: [],
    validationRules: ["symptoms must include at least 2 items"],
  },
  mechanism: {
    id: "mechanism",
    componentNumber: 3,
    registryId: "emovel.section.mechanism",
    kind: "section",
    status: "implemented",
    surfaceOwner: "SectionSurface",
    implementation: "MechanismBlock",
    label: "Mechanism",
    category: "content",
    required: true,
    brandRole: "Explain why the offer works through the applied mechanism.",
    exportRole: "Mechanism explanation section.",
    requiredFields: ["title", "explanation", "why_it_works", "difference_from_alternatives"],
    optionalFields: [],
    validationRules: ["difference_from_alternatives must include at least 1 item"],
  },
  offer: {
    id: "offer",
    componentNumber: 4,
    registryId: "emovel.section.offer",
    kind: "section",
    status: "implemented",
    surfaceOwner: "SectionSurface",
    implementation: "OfferBlock",
    label: "Offer",
    category: "commercial",
    required: true,
    brandRole: "Turn strategy into concrete deliverables and delivery expectations.",
    exportRole: "Offer detail section.",
    requiredFields: ["title", "deliverables", "format", "timeline"],
    optionalFields: [],
    validationRules: ["deliverables must include at least 2 items"],
  },
  proof: {
    id: "proof",
    componentNumber: 5,
    registryId: "emovel.section.proof",
    kind: "section",
    status: "implemented",
    surfaceOwner: "SectionSurface",
    implementation: "ProofBlock",
    label: "Proof",
    category: "trust",
    required: true,
    brandRole: "Support the claim with evidence, credibility, and testimonial slots.",
    exportRole: "Proof and credibility section.",
    requiredFields: ["proof_points", "credibility_signals", "testimonial_placeholders"],
    optionalFields: [],
    validationRules: ["proof_points must include at least 1 item"],
  },
  pricing: {
    id: "pricing",
    componentNumber: 6,
    registryId: "emovel.section.pricing",
    kind: "section",
    status: "implemented",
    surfaceOwner: "SectionSurface",
    implementation: "PricingBlock",
    label: "Pricing",
    category: "commercial",
    required: true,
    brandRole: "Frame price, upgrade path, rationale, and risk reversal.",
    exportRole: "Pricing section.",
    requiredFields: ["pilot_price", "premium_upgrade", "pricing_rationale", "risk_reversal"],
    optionalFields: [],
    validationRules: ["pilot_price must be present"],
  },
  faq: {
    id: "faq",
    componentNumber: 7,
    registryId: "emovel.section.faq",
    kind: "section",
    status: "implemented",
    surfaceOwner: "SectionSurface",
    implementation: "FaqBlock",
    label: "FAQ",
    category: "trust",
    required: true,
    brandRole: "Answer the main objections before the final conversion moment.",
    exportRole: "FAQ section.",
    requiredFields: ["items"],
    optionalFields: [],
    validationRules: ["items must include at least 3 question/answer pairs"],
  },
  final_cta: {
    id: "final_cta",
    componentNumber: 8,
    registryId: "emovel.section.final-cta",
    kind: "section",
    status: "implemented",
    surfaceOwner: "SectionSurface",
    implementation: "FinalCtaBlock",
    label: "Final CTA",
    category: "conversion",
    required: true,
    brandRole: "Close with a direct conversion action.",
    exportRole: "Final conversion section.",
    requiredFields: ["headline", "cta"],
    optionalFields: ["microcopy"],
    validationRules: ["headline must be present", "cta must be present"],
  },
  implementation_notes: {
    id: "implementation_notes",
    componentNumber: 9,
    registryId: "emovel.meta.implementation-notes",
    kind: "meta",
    status: "implemented",
    surfaceOwner: "none",
    implementation: null,
    label: "Implementation Notes",
    category: "meta",
    required: true,
    brandRole: "Capture non-rendered build notes and acceptance criteria.",
    exportRole: "Internal markdown implementation notes.",
    requiredFields: ["components", "required_sections", "missing_visual_assets", "acceptance_checks"],
    optionalFields: [],
    validationRules: ["components must include at least 1 item", "acceptance_checks must include at least 1 item"],
  },
  product_showcase: {
    id: "product_showcase",
    componentNumber: 10,
    registryId: "emovel.section.product-showcase",
    kind: "section",
    status: "implemented",
    surfaceOwner: "SectionSurface",
    implementation: "ProductShowcaseBlock",
    label: "Product Showcase",
    category: "commerce",
    required: false,
    brandRole: "aspiration/differentiation/product clarity",
    exportRole: "hero/product presentation",
    supportedLayouts: ["split", "fullbleed"],
    requiredFields: ["layout", "productName", "headline", "productAsset", "productAlt", "ctas", "theme"],
    optionalFields: [
      "eyebrow",
      "subheadline",
      "specText",
      "features",
      "nav",
      "motion",
      "mediaPosition",
      "background",
      "overlay",
    ],
    validationRules: [
      "headline_required",
      "product_name_required",
      "product_asset_required_unless_draft",
      "product_alt_required",
      "minimum_one_cta",
      "split_requires_features",
      "features_min_2_max_4",
      "feature_label_short",
      "feature_value_short",
      "no_paragraph_heavy_feature_cards",
    ],
  },
  navigation_bar: {
    id: "navigation_bar",
    componentNumber: 11,
    registryId: "emovel.section.navigation-bar",
    kind: "section",
    status: "implemented",
    surfaceOwner: "SectionSurface",
    implementation: "NavigationBarBlock",
    label: "Navigation Bar",
    category: "content",
    required: false,
    brandRole: "Orient the visitor and keep the primary action one click away.",
    exportRole: "Leading navigation chrome.",
    requiredFields: ["logo_label", "links"],
    optionalFields: ["cta", "transparent"],
    validationRules: ["logo_label must be present", "each link needs label + anchor"],
  },
  footer: {
    id: "footer",
    componentNumber: 12,
    registryId: "emovel.section.footer",
    kind: "section",
    status: "implemented",
    surfaceOwner: "SectionSurface",
    implementation: "FooterBlock",
    label: "Footer",
    category: "content",
    required: false,
    brandRole: "Close the page with structure, secondary links, and legal trust.",
    exportRole: "Closing navigation chrome.",
    requiredFields: ["link_groups"],
    optionalFields: ["tagline", "legal"],
    validationRules: ["each link group needs a heading and labelled links"],
  },
  testimonials: {
    id: "testimonials",
    componentNumber: 13,
    registryId: "emovel.section.testimonials",
    kind: "section",
    status: "implemented",
    surfaceOwner: "SectionSurface",
    implementation: "TestimonialsBlock",
    label: "Testimonials",
    category: "trust",
    required: false,
    brandRole: "Show real voices that validate the promise.",
    exportRole: "Social-proof testimonials section.",
    requiredFields: ["items"],
    optionalFields: ["title"],
    validationRules: ["items must include at least 1 quote + author"],
  },
  logo_strip: {
    id: "logo_strip",
    componentNumber: 14,
    registryId: "emovel.section.logo-strip",
    kind: "section",
    status: "implemented",
    surfaceOwner: "SectionSurface",
    implementation: "LogoStripBlock",
    label: "Logo Strip",
    category: "trust",
    required: false,
    brandRole: "Borrow credibility from recognizable names.",
    exportRole: "Trust logo strip section.",
    requiredFields: ["logos"],
    optionalFields: ["title"],
    validationRules: ["logos must include at least 1 named logo"],
  },
  stats_bar: {
    id: "stats_bar",
    componentNumber: 15,
    registryId: "emovel.section.stats-bar",
    kind: "section",
    status: "implemented",
    surfaceOwner: "SectionSurface",
    implementation: "StatsBarBlock",
    label: "Stats Bar",
    category: "trust",
    required: false,
    brandRole: "Quantify the outcome with hard numbers.",
    exportRole: "Metrics / stats bar section.",
    requiredFields: ["stats"],
    optionalFields: ["title"],
    validationRules: ["stats must include at least 1 value + label"],
  },
  feature_split: {
    id: "feature_split",
    componentNumber: 16,
    registryId: "emovel.section.feature-split",
    kind: "section",
    status: "implemented",
    surfaceOwner: "SectionSurface",
    implementation: "FeatureSplitBlock",
    label: "Feature Split",
    category: "content",
    required: false,
    brandRole: "Elaborate the mechanism through a focused feature set.",
    exportRole: "Feature split / capability section.",
    requiredFields: ["title", "features"],
    optionalFields: ["description", "mediaPosition"],
    validationRules: ["title required", "features must include at least 2 items with titles"],
  },
};

export function getPageBuilderRegistryEntry(type: PageBuilderSectionType): PageBuilderRegistryEntry {
  return pageBuilderRegistry[type];
}

// All entries ordered by their 01–10 catalog position. Source of truth for the
// generated registry manifest (execution-order step 5) and the render mapping.
export function listRegistryComponents(): PageBuilderRegistryEntry[] {
  return Object.values(pageBuilderRegistry).sort((a, b) => a.componentNumber - b.componentNumber);
}

// Map of section type -> bound implementation component name (rendered sections
// only). Meta/non-rendered entries are excluded.
export function getImplementationBindings(): Record<string, string> {
  const bindings: Record<string, string> = {};
  for (const entry of Object.values(pageBuilderRegistry)) {
    if (entry.implementation) bindings[entry.id] = entry.implementation;
  }
  return bindings;
}
