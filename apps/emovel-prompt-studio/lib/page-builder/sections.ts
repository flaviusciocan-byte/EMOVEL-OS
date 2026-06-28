import type { PageBuilderSection, PageBuilderSectionType, ProductShowcaseTheme } from "./schema";

export const canonicalSectionOrder = [
  "navigation_bar",
  "hero",
  "logo_strip",
  "problem",
  "mechanism",
  "feature_split",
  "offer",
  "proof",
  "stats_bar",
  "testimonials",
  "pricing",
  "faq",
  "final_cta",
  "footer",
  "implementation_notes",
] as const satisfies readonly PageBuilderSectionType[];

export const sectionLabels: Record<PageBuilderSectionType, string> = {
  hero: "Hero",
  problem: "Problem",
  mechanism: "Mechanism",
  offer: "Offer",
  proof: "Proof",
  pricing: "Pricing",
  faq: "FAQ",
  final_cta: "Final CTA",
  navigation_bar: "Navigation Bar",
  footer: "Footer",
  testimonials: "Testimonials",
  logo_strip: "Logo Strip",
  stats_bar: "Stats Bar",
  feature_split: "Feature Split",
  implementation_notes: "Implementation Notes",
  product_showcase: "Product Showcase",
};

// Every recognized section type. This intentionally extends — but stays
// decoupled from — `canonicalSectionOrder`: product_showcase is a known,
// optional Phase 2 section that must validate, but it is NOT part of the
// Phase 1 required landing-page order. Keeping it out of canonicalSectionOrder
// preserves the Phase 1 ordering contract while still recognizing the type.
const knownSectionTypeSet = new Set<PageBuilderSectionType>([
  ...canonicalSectionOrder,
  "product_showcase",
]);

export const requiredSectionTypes = [
  "hero",
  "problem",
  "mechanism",
  "offer",
  "proof",
  "pricing",
  "faq",
  "final_cta",
  "implementation_notes",
] as const satisfies readonly PageBuilderSectionType[];

const sectionOrderIndex = new Map<PageBuilderSectionType, number>(
  canonicalSectionOrder.map((type, index) => [type, index]),
);

export function sortSectionsByCanonicalOrder(sections: PageBuilderSection[]): PageBuilderSection[] {
  return [...sections].sort((a, b) => {
    const left = sectionOrderIndex.get(a.type) ?? Number.MAX_SAFE_INTEGER;
    const right = sectionOrderIndex.get(b.type) ?? Number.MAX_SAFE_INTEGER;
    return left - right;
  });
}

export function getMissingRequiredSections(sections: PageBuilderSection[]): PageBuilderSectionType[] {
  const present = new Set(sections.map((section) => section.type));
  return requiredSectionTypes.filter((type) => !present.has(type));
}

export function isKnownSectionType(type: string): type is PageBuilderSectionType {
  return knownSectionTypeSet.has(type as PageBuilderSectionType);
}

// ---------------------------------------------------------------------------
// Product Showcase theme presets (Phase 2).
// Typography tokens are shared across presets; only the palette changes.
// ---------------------------------------------------------------------------

const productShowcaseTypography = {
  headline: "Clash Display",
  productName: "Satoshi",
  body: "Satoshi",
  technical: "JetBrains Mono",
} as const;

export const darkCinematicTheme: ProductShowcaseTheme = {
  background: "#050707",
  foreground: "#F4F4EF",
  muted: "#9BA6A6",
  accent: "#19D3C5",
  card: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.14)",
  overlayGradient: "linear-gradient(90deg, rgba(5,7,7,0.92), rgba(5,7,7,0.48), rgba(5,7,7,0))",
  typography: { ...productShowcaseTypography },
};

export const lightColdPremiumTheme: ProductShowcaseTheme = {
  background: "#F7F8FC",
  foreground: "#11131A",
  muted: "#6B7280",
  accent: "#7C5CFF",
  card: "rgba(255,255,255,0.82)",
  border: "rgba(17,19,26,0.10)",
  overlayGradient: "linear-gradient(90deg, rgba(247,248,252,0.96), rgba(247,248,252,0.64), rgba(247,248,252,0))",
  typography: { ...productShowcaseTypography },
};

export const pureNoirTheme: ProductShowcaseTheme = {
  background: "#000000",
  foreground: "#FFFFFF",
  muted: "#A1A1AA",
  accent: "#FFFFFF",
  card: "rgba(255,255,255,0.08)",
  border: "rgba(255,255,255,0.16)",
  overlayGradient: "linear-gradient(180deg, rgba(0,0,0,0.80), rgba(0,0,0,0.34), rgba(0,0,0,0.86))",
  typography: { ...productShowcaseTypography },
};

export const productShowcaseThemePresets: Record<string, ProductShowcaseTheme> = {
  "dark-cinematic": darkCinematicTheme,
  "light-cold-premium": lightColdPremiumTheme,
  "pure-noir": pureNoirTheme,
};
