import type {
  ImplementationNotesSection,
  PageBuilderDocument,
  PageBuilderSection,
  ProductShowcaseSection,
} from "./schema";
import { canonicalSectionOrder, getMissingRequiredSections } from "./sections";

export type ReadinessStatus = "weak" | "acceptable" | "strong";

export type ReadinessCategory = {
  score: number;
  status: ReadinessStatus;
  completed: string[];
  missing: string[];
  recommendation: string;
};

export type PageBuilderReadinessReview = {
  overall_score: number;
  status: ReadinessStatus;
  categories: {
    landing_page_readiness: ReadinessCategory;
    conversion_clarity: ReadinessCategory;
    implementation_readiness: ReadinessCategory;
    asset_readiness: ReadinessCategory;
    brand_alignment: ReadinessCategory;
  };
  summary: string;
  priority_fixes: string[];
};

type Check = {
  ok: boolean;
  completed: string;
  missing: string;
};

function statusForScore(score: number): ReadinessStatus {
  if (score >= 8) return "strong";
  if (score >= 6) return "acceptable";
  return "weak";
}

function text(value: string | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function hasText(value: string | undefined, minLength = 1): boolean {
  return text(value).length >= minLength;
}

function categoryFromChecks(checks: Check[], recommendation: string): ReadinessCategory {
  const completed = checks.filter((check) => check.ok).map((check) => check.completed);
  const missing = checks.filter((check) => !check.ok).map((check) => check.missing);
  const score = checks.length === 0 ? 0 : Math.round((completed.length / checks.length) * 10);
  return {
    score,
    status: statusForScore(score),
    completed,
    missing,
    recommendation,
  };
}

function sectionOf<T extends PageBuilderSection["type"]>(
  document: PageBuilderDocument,
  type: T,
): Extract<PageBuilderSection, { type: T }> | undefined {
  return document.sections.find((section): section is Extract<PageBuilderSection, { type: T }> => section.type === type);
}

function implementationNotes(document: PageBuilderDocument): ImplementationNotesSection | undefined {
  return sectionOf(document, "implementation_notes");
}

function productShowcase(document: PageBuilderDocument): ProductShowcaseSection | undefined {
  return sectionOf(document, "product_showcase");
}

function isCanonicalOrder(document: PageBuilderDocument): boolean {
  const canonical = canonicalSectionOrder as readonly string[];
  const ordered = document.sections
    .map((section) => section.type)
    .filter((type) => canonical.includes(type));
  const indexes = ordered.map((type) => canonical.indexOf(type));
  return indexes.every((index, position) => position === 0 || indexes[position - 1] <= index);
}

function sectionHasMinimumContent(section: PageBuilderSection): boolean {
  switch (section.type) {
    case "hero":
      return hasText(section.headline, 8) && hasText(section.primary_cta, 2);
    case "problem":
      return hasText(section.title, 4) && section.symptoms.length >= 2 && hasText(section.cost_of_inaction, 8);
    case "mechanism":
      return (
        hasText(section.title, 4) &&
        hasText(section.explanation, 12) &&
        hasText(section.why_it_works, 8) &&
        section.difference_from_alternatives.length >= 1
      );
    case "offer":
      return hasText(section.title, 4) && section.deliverables.length >= 2 && hasText(section.format) && hasText(section.timeline);
    case "proof":
      return section.proof_points.length >= 1 || section.testimonial_placeholders.length >= 1;
    case "pricing":
      return hasText(section.pilot_price) && hasText(section.pricing_rationale) && hasText(section.risk_reversal);
    case "faq":
      return section.items.length >= 3;
    case "final_cta":
      return hasText(section.headline, 8) && hasText(section.cta, 2);
    case "implementation_notes":
      return section.components.length >= 1 && section.acceptance_checks.length >= 1;
    case "navigation_bar":
      return hasText(section.logo_label) && section.links.length >= 1;
    case "footer":
      return section.link_groups.length >= 1;
    case "testimonials":
      return section.items.length >= 1;
    case "logo_strip":
      return section.logos.length >= 1;
    case "stats_bar":
      return section.stats.length >= 1;
    case "feature_split":
      return hasText(section.title, 4) && section.features.length >= 2;
    case "product_showcase":
      return hasText(section.productName) && hasText(section.headline, 8) && section.ctas.length >= 1;
  }
}

function containsAny(value: string, candidates: string[]): boolean {
  const lower = value.toLowerCase();
  return candidates.some((candidate) => lower.includes(candidate.toLowerCase()));
}

function promiseTerms(document: PageBuilderDocument): string[] {
  const hero = sectionOf(document, "hero");
  const mechanism = sectionOf(document, "mechanism");
  const source = [hero?.headline, hero?.subheadline, mechanism?.title, mechanism?.explanation]
    .filter((item): item is string => Boolean(item))
    .join(" ");
  return source
    .split(/[^a-zA-Z0-9]+/)
    .map((word) => word.trim())
    .filter((word) => word.length >= 5)
    .slice(0, 8);
}

function evaluateLandingPageReadiness(document: PageBuilderDocument): ReadinessCategory {
  const missingRequired = getMissingRequiredSections(document.sections);
  const offer = sectionOf(document, "offer");
  const faq = sectionOf(document, "faq");
  const finalCta = sectionOf(document, "final_cta");
  const minimumContentOk = document.sections
    .filter((section) => section.type !== "product_showcase")
    .every(sectionHasMinimumContent);

  return categoryFromChecks(
    [
      {
        ok: missingRequired.length === 0,
        completed: "All required landing page sections are present.",
        missing: `Missing required sections: ${missingRequired.join(", ") || "unknown"}.`,
      },
      {
        ok: isCanonicalOrder(document),
        completed: "Required sections follow the canonical landing page order.",
        missing: "Required sections should follow hero -> problem -> mechanism -> offer -> proof -> pricing -> faq -> final_cta -> implementation_notes.",
      },
      {
        ok: minimumContentOk,
        completed: "Each required section has minimum usable content.",
        missing: "One or more required sections need more complete copy.",
      },
      {
        ok: Boolean(faq && faq.items.length >= 3),
        completed: "FAQ includes at least 3 items.",
        missing: "FAQ needs at least 3 question/answer items.",
      },
      {
        ok: Boolean(offer && offer.deliverables.length >= 2),
        completed: "Offer includes at least 2 deliverables.",
        missing: "Offer needs at least 2 concrete deliverables.",
      },
      {
        ok: Boolean(finalCta && hasText(finalCta.headline) && hasText(finalCta.cta)),
        completed: "Final CTA is present and actionable.",
        missing: "Final CTA needs a headline and CTA.",
      },
    ],
    "Fill missing required sections first, then normalize section order and strengthen thin copy.",
  );
}

function evaluateConversionClarity(document: PageBuilderDocument): ReadinessCategory {
  const hero = sectionOf(document, "hero");
  const problem = sectionOf(document, "problem");
  const offer = sectionOf(document, "offer");
  const pricing = sectionOf(document, "pricing");
  const proof = sectionOf(document, "proof");

  return categoryFromChecks(
    [
      {
        ok: Boolean(hero && hasText(hero.headline, 18) && hero.headline.split(/\s+/).length >= 4),
        completed: "Hero headline is specific enough to orient the page.",
        missing: "Hero headline should be more specific about the promise.",
      },
      {
        ok: Boolean(hero && hasText(hero.primary_cta, 3) && !containsAny(hero.primary_cta, ["click", "submit", "learn"])),
        completed: "Primary CTA is clear and action-oriented.",
        missing: "Primary CTA should be clearer than a generic click/submit/learn action.",
      },
      {
        ok: Boolean(problem && problem.symptoms.length >= 2 && problem.symptoms.every((item) => hasText(item, 6))),
        completed: "Problem symptoms are concrete.",
        missing: "Problem section needs concrete symptoms.",
      },
      {
        ok: Boolean(offer && hasText(offer.timeline)),
        completed: "Offer includes a delivery timeline.",
        missing: "Offer needs a timeline.",
      },
      {
        ok: Boolean(pricing && hasText(pricing.risk_reversal, 8)),
        completed: "Pricing includes risk reversal.",
        missing: "Pricing needs a meaningful risk reversal.",
      },
      {
        ok: Boolean(
          proof &&
            (proof.proof_points.some((item) => hasText(item, 6)) ||
              proof.testimonial_placeholders.some((item) => containsAny(item, ["placeholder", "quote", "testimonial"]))),
        ),
        completed: "Proof section includes proof points or explicit testimonial placeholders.",
        missing: "Proof section needs proof points or explicit testimonial placeholders.",
      },
    ],
    "Sharpen the hero promise, CTA, proof, and risk reversal before moving to visual build.",
  );
}

function evaluateImplementationReadiness(document: PageBuilderDocument): ReadinessCategory {
  const notes = implementationNotes(document);
  const showcase = productShowcase(document);
  const missingAssets = notes?.missing_visual_assets ?? [];
  const showcaseAsset = text(showcase?.productAsset?.src);

  return categoryFromChecks(
    [
      {
        ok: Boolean(notes && notes.components.length > 0),
        completed: "Implementation notes list expected components.",
        missing: "Implementation notes need a component list.",
      },
      {
        ok: Boolean(notes && notes.acceptance_checks.length > 0),
        completed: "Acceptance checks are listed.",
        missing: "Implementation notes need acceptance checks.",
      },
      {
        ok: Boolean(notes && notes.required_sections.length > 0),
        completed: "Required sections are recorded for implementation.",
        missing: "Implementation notes should list required sections.",
      },
      {
        ok: Boolean(notes && Array.isArray(notes.missing_visual_assets)),
        completed: "Missing visual assets are explicitly tracked.",
        missing: "Implementation notes should explicitly track missing visual assets, even when empty.",
      },
      {
        ok: !showcase || showcaseAsset.length > 0 || missingAssets.some((item) => containsAny(item, ["product", "showcase", "asset", "render", "screenshot"])),
        completed: "ProductShowcase asset state is explicit.",
        missing: "ProductShowcase needs an asset src or a matching missing_visual_assets note.",
      },
    ],
    "Add component hierarchy, acceptance checks, required section notes, and explicit asset gaps.",
  );
}

function evaluateAssetReadiness(document: PageBuilderDocument): ReadinessCategory {
  const notes = implementationNotes(document);
  const showcase = productShowcase(document);
  const missingAssets = notes?.missing_visual_assets ?? [];
  const missingText = missingAssets.join(" ");
  const showcaseAsset = text(showcase?.productAsset?.src);

  return categoryFromChecks(
    [
      {
        ok: !showcase || document.status === "draft" || showcaseAsset.length > 0,
        completed: "ProductShowcase has a product asset for non-draft export.",
        missing: "Non-draft ProductShowcase needs productAsset.src.",
      },
      {
        ok: missingAssets.length === 0 || missingAssets.every((item) => hasText(item, 6)),
        completed: "Missing visual assets are empty or clearly named.",
        missing: "Missing visual assets should be empty or described clearly.",
      },
      {
        ok: missingAssets.length === 0 || containsAny(missingText, ["proof", "screenshot", "testimonial", "logo", "render", "asset", "product"]),
        completed: "Proof/screenshots/assets are mentioned when visual assets are missing.",
        missing: "If assets are missing, note proof assets, screenshots, logos, renders, or product assets explicitly.",
      },
      {
        ok: !containsAny(missingText, ["tbd", "invent", "fake", "placeholder asset"]),
        completed: "Export does not depend on invented asset references.",
        missing: "Replace TBD/fake/invented asset notes with explicit real asset gaps.",
      },
    ],
    "Resolve missing assets or name them explicitly so export handoff does not imply fabricated visuals.",
  );
}

function evaluateBrandAlignment(document: PageBuilderDocument): ReadinessCategory {
  const context = document.brand_context;
  const terms = promiseTerms(document);
  const offer = sectionOf(document, "offer");
  const finalCta = sectionOf(document, "final_cta");
  const showcase = productShowcase(document);
  const copy = [offer?.title, offer?.deliverables.join(" "), finalCta?.headline, showcase?.headline].join(" ");
  const mechanism = [context?.dominant_mechanism, context?.applied_mechanism].filter(Boolean).join(" ");

  return categoryFromChecks(
    [
      {
        ok: Boolean(context),
        completed: "Brand context is present.",
        missing: "Brand context is missing.",
      },
      {
        ok: Boolean(context?.dominant_mechanism || context?.applied_mechanism),
        completed: "Dominant or applied mechanism is present.",
        missing: "Dominant/applied mechanism is missing.",
      },
      {
        ok: terms.length === 0 || containsAny(copy, terms),
        completed: "Offer and CTA reuse the same promise logic as the hero/mechanism.",
        missing: "Offer and CTA should echo the hero/mechanism promise more clearly.",
      },
      {
        ok: !showcase || Boolean(showcase.theme && hasText(showcase.headline) && (!mechanism || containsAny(showcase.headline, mechanism.split(/\s+/).filter((word) => word.length >= 5)) || hasText(showcase.subheadline, 12))),
        completed: "ProductShowcase theme and headline are compatible with the page mechanism.",
        missing: "ProductShowcase should include theme data and copy that supports the mechanism.",
      },
    ],
    "Attach Brand OS context and keep hero, mechanism, offer, CTA, and ProductShowcase copy aligned.",
  );
}

export function evaluatePageBuilderReadiness(document: PageBuilderDocument): PageBuilderReadinessReview {
  const categories = {
    landing_page_readiness: evaluateLandingPageReadiness(document),
    conversion_clarity: evaluateConversionClarity(document),
    implementation_readiness: evaluateImplementationReadiness(document),
    asset_readiness: evaluateAssetReadiness(document),
    brand_alignment: evaluateBrandAlignment(document),
  };
  const categoryValues = Object.values(categories);
  const overall_score = Math.round((categoryValues.reduce((total, category) => total + category.score, 0) / categoryValues.length) * 10) / 10;
  const status = statusForScore(overall_score);
  const priority_fixes = categoryValues
    .flatMap((category) => category.missing)
    .slice(0, 5);
  const summary =
    status === "strong"
      ? "Page Builder document is strong enough for builder handoff."
      : status === "acceptable"
        ? "Page Builder document is usable, with a few fixes recommended before final handoff."
        : "Page Builder document needs quality fixes before it is ready for handoff.";

  return {
    overall_score,
    status,
    categories,
    summary,
    priority_fixes,
  };
}

function categoryLabel(key: string): string {
  return key
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function readinessToMarkdown(review: PageBuilderReadinessReview): string {
  const categories = Object.entries(review.categories)
    .map(([key, category]) => {
      return [
        `## ${categoryLabel(key)}`,
        "",
        `Score: ${category.score}/10`,
        `Status: ${category.status}`,
        "",
        "Completed:",
        category.completed.length > 0 ? category.completed.map((item) => `- ${item}`).join("\n") : "- None",
        "",
        "Missing:",
        category.missing.length > 0 ? category.missing.map((item) => `- ${item}`).join("\n") : "- None",
        "",
        `Recommendation: ${category.recommendation}`,
      ].join("\n");
    })
    .join("\n\n");

  return [
    "# Page Builder Readiness",
    "",
    `Overall score: ${review.overall_score}/10`,
    `Status: ${review.status}`,
    "",
    "Summary:",
    review.summary,
    "",
    "Priority fixes:",
    review.priority_fixes.length > 0 ? review.priority_fixes.map((item) => `- ${item}`).join("\n") : "- None",
    "",
    categories,
  ].join("\n");
}
