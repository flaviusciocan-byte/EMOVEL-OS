import { extractJsonObject } from "./json";
import type {
  FaqSection,
  FinalCtaSection,
  HeroSection,
  ImplementationNotesSection,
  MechanismSection,
  OfferSection,
  PageBuilderDocument,
  PageBuilderSection,
  PageBuilderSectionType,
  PricingSection,
  ProblemSection,
  ProductShowcaseSection,
  ProofSection,
} from "./schema";
import { sortSectionsByCanonicalOrder } from "./sections";
import { validatePageBuilderDocument } from "./validator";

export const regeneratableSectionTypes = [
  "hero",
  "offer",
  "pricing",
  "faq",
  "final_cta",
  "product_showcase",
] as const satisfies readonly PageBuilderSectionType[];

export type RegeneratablePageBuilderSectionType = (typeof regeneratableSectionTypes)[number];

export type ValidatePageBuilderSectionResult =
  | { ok: true; section: PageBuilderSection }
  | { ok: false; errors: string[] };

export type ReplacePageBuilderSectionResult =
  | { ok: true; document: PageBuilderDocument }
  | { ok: false; errors: string[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isRegeneratableSectionType(type: string): type is RegeneratablePageBuilderSectionType {
  return regeneratableSectionTypes.includes(type as RegeneratablePageBuilderSectionType);
}

const baseSections = {
  hero: {
    type: "hero",
    headline: "Valid landing page hero",
    primary_cta: "Start now",
  } satisfies HeroSection,
  problem: {
    type: "problem",
    title: "Valid problem",
    symptoms: ["Symptom one", "Symptom two"],
    cost_of_inaction: "Delay keeps the conversion problem unresolved.",
  } satisfies ProblemSection,
  mechanism: {
    type: "mechanism",
    title: "Valid mechanism",
    explanation: "A clear page mechanism explains why the offer works.",
    why_it_works: "It connects promise, proof, and conversion.",
    difference_from_alternatives: ["It validates the document before render"],
  } satisfies MechanismSection,
  offer: {
    type: "offer",
    title: "Valid offer",
    deliverables: ["Deliverable one", "Deliverable two"],
    format: "Async sprint",
    timeline: "5 business days",
  } satisfies OfferSection,
  proof: {
    type: "proof",
    proof_points: ["Validated structure before save"],
    credibility_signals: ["Deterministic validation"],
    testimonial_placeholders: ["[PLACEHOLDER: customer quote]"],
  } satisfies ProofSection,
  pricing: {
    type: "pricing",
    pilot_price: "$1,500 pilot",
    premium_upgrade: "$4,500 implementation",
    pricing_rationale: "Start with a scoped pilot before implementation.",
    risk_reversal: "No invalid document is saved.",
  } satisfies PricingSection,
  faq: {
    type: "faq",
    items: [
      { question: "Question one?", answer: "Answer one." },
      { question: "Question two?", answer: "Answer two." },
      { question: "Question three?", answer: "Answer three." },
    ],
  } satisfies FaqSection,
  final_cta: {
    type: "final_cta",
    headline: "Start with a validated page",
    cta: "Validate page",
  } satisfies FinalCtaSection,
  implementation_notes: {
    type: "implementation_notes",
    components: ["PageBuilderDocument"],
    required_sections: ["hero", "offer", "pricing", "faq"],
    missing_visual_assets: [],
    acceptance_checks: ["Document validates before save"],
  } satisfies ImplementationNotesSection,
};

const validProductShowcase: ProductShowcaseSection = {
  type: "product_showcase",
  layout: "split",
  productName: "Valid product",
  headline: "A validated product showcase",
  productAsset: { src: "assets/product-showcase.png", type: "render" },
  productAlt: "Product showcase render",
  ctas: [{ label: "Start now", variant: "primary" }],
  features: [
    { label: "Speed", value: "Fast" },
    { label: "Quality", value: "High" },
  ],
  theme: {
    background: "#050707",
    foreground: "#F4F4EF",
    muted: "#9BA6A6",
    accent: "#19D3C5",
    card: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.14)",
    overlayGradient: "linear-gradient(90deg, rgba(5,7,7,0.92), rgba(5,7,7,0.48), rgba(5,7,7,0))",
    typography: { headline: "Clash Display", body: "Satoshi" },
  },
};

function sectionValidationDocument(section: PageBuilderSection): PageBuilderDocument {
  const sections: PageBuilderSection[] = [
    baseSections.hero,
    baseSections.problem,
    baseSections.mechanism,
    baseSections.offer,
    baseSections.proof,
    baseSections.pricing,
    baseSections.faq,
    baseSections.final_cta,
    baseSections.implementation_notes,
  ].map((base) => (base.type === section.type ? section : base));

  if (section.type === "product_showcase") {
    sections.push(section);
  }

  return {
    page_type: "landing_page",
    schema_version: "1.0.0",
    title: "Section validation fixture",
    status: "draft",
    sections,
  };
}

export function validatePageBuilderSection(
  section: unknown,
  expectedType?: PageBuilderSectionType,
): ValidatePageBuilderSectionResult {
  if (!isRecord(section)) {
    return { ok: false, errors: ["Section must be an object."] };
  }
  if (typeof section.type !== "string") {
    return { ok: false, errors: ["Section type is required."] };
  }
  if (!isRegeneratableSectionType(section.type)) {
    return { ok: false, errors: [`Section type is not regeneratable: ${section.type}`] };
  }
  if (expectedType && section.type !== expectedType) {
    return { ok: false, errors: [`Regenerated section type must be ${expectedType}, got ${section.type}.`] };
  }

  const candidate = section as unknown as PageBuilderSection;
  const validated = validatePageBuilderDocument(sectionValidationDocument(candidate));
  if (!validated.ok) {
    return { ok: false, errors: validated.errors };
  }

  const validatedSection = validated.document.sections.find((item) => item.type === candidate.type);
  if (!validatedSection) {
    return { ok: false, errors: [`Validated section not found: ${candidate.type}`] };
  }
  return { ok: true, section: validatedSection };
}

export function parsePageBuilderSection(
  raw: unknown,
  expectedType: PageBuilderSectionType,
): ValidatePageBuilderSectionResult {
  let parsed = raw;
  if (typeof raw === "string") {
    const extracted = extractJsonObject(raw);
    if (!extracted.ok) {
      return { ok: false, errors: extracted.errors };
    }
    try {
      parsed = JSON.parse(extracted.json) as unknown;
    } catch (error) {
      return { ok: false, errors: [error instanceof Error ? error.message : "Invalid section JSON."] };
    }
  }
  return validatePageBuilderSection(parsed, expectedType);
}

export function replacePageBuilderSection(
  document: PageBuilderDocument,
  section: PageBuilderSection,
): ReplacePageBuilderSectionResult {
  const validatedSection = validatePageBuilderSection(section, section.type);
  if (!validatedSection.ok) {
    return validatedSection;
  }

  const exists = document.sections.some((item) => item.type === section.type);
  if (!exists && section.type !== "product_showcase") {
    return { ok: false, errors: [`Cannot replace missing required section: ${section.type}`] };
  }

  const sections = exists
    ? document.sections.map((item) => (item.type === section.type ? validatedSection.section : item))
    : [...document.sections, validatedSection.section];

  const candidate: PageBuilderDocument = {
    ...document,
    sections: sortSectionsByCanonicalOrder(sections),
  };
  const validatedDocument = validatePageBuilderDocument(candidate);
  if (!validatedDocument.ok) {
    return { ok: false, errors: validatedDocument.errors };
  }

  return { ok: true, document: validatedDocument.document };
}
