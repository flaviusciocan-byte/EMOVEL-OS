import { PAGE_BUILDER_SCHEMA_VERSION } from "./schema";
import type { PageBuilderDocument, PageBuilderDocumentStatus, PageBuilderSection, PageBuilderSectionType } from "./schema";
import { getMissingRequiredSections, isKnownSectionType, requiredSectionTypes } from "./sections";

export type ValidatePageBuilderDocumentResult =
  | { ok: true; document: PageBuilderDocument }
  | { ok: false; errors: string[] };

type UnknownRecord = Record<string, unknown>;

const validStatuses = new Set<PageBuilderDocumentStatus>(["draft", "validated", "export_ready"]);

// Product Showcase "short" limits — feature cards must stay glanceable, never
// paragraph-heavy. Tunable in one place.
const FEATURE_LABEL_MAX = 40;
const FEATURE_VALUE_MAX = 24;
const FEATURE_DESCRIPTION_MAX = 160;

const productShowcaseLayouts = new Set(["split", "fullbleed"]);
const productShowcaseMediaPositions = new Set(["left", "center", "right"]);
const productShowcaseCtaVariants = new Set(["primary", "secondary"]);
const productShowcaseOverlayPositions = new Set(["left", "right", "bottom", "full"]);
const productShowcaseParallaxValues = new Set(["none", "subtle"]);
const productShowcaseRevealValues = new Set(["none", "stagger"]);

// Shared Layer (Component Registry v1.1) — accepted enum values. Validated only
// when a section actually carries `shared`; absent shared layer is always valid.
const sharedSurfaceRoles = new Set(["base", "raised", "inset", "contrast"]);
const sharedMotionLevels = new Set(["none", "subtle", "expressive"]);
const sharedSpacingScales = new Set(["compact", "default", "spacious"]);
const ANCHOR_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const productShowcaseThemeFields = [
  "background",
  "foreground",
  "muted",
  "accent",
  "card",
  "border",
  "overlayGradient",
] as const;

type SectionValidationOptions = { draft?: boolean };

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasText(record: UnknownRecord, field: string): boolean {
  return typeof record[field] === "string" && record[field].trim().length > 0;
}

function isShortText(value: unknown, max: number): boolean {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= max;
}

// Shared Layer validation. Skips entirely when `shared` is absent; otherwise
// checks only the fields that are present. `label` is the section type (or index)
// for readable error messages.
function validateSharedLayer(shared: unknown, errors: string[], label: string): void {
  if (shared === undefined) return;
  if (!isRecord(shared)) {
    errors.push(`${label}.shared must be an object when present`);
    return;
  }
  if (shared.universe !== undefined && !(typeof shared.universe === "string" && shared.universe.trim().length > 0)) {
    errors.push(`${label}.shared.universe must be a non-empty string when present`);
  }
  if (shared.surface !== undefined && !(typeof shared.surface === "string" && sharedSurfaceRoles.has(shared.surface))) {
    errors.push(`${label}.shared.surface must be base, raised, inset, or contrast`);
  }
  if (shared.motion !== undefined && !(typeof shared.motion === "string" && sharedMotionLevels.has(shared.motion))) {
    errors.push(`${label}.shared.motion must be none, subtle, or expressive`);
  }
  if (shared.spacing !== undefined && !(typeof shared.spacing === "string" && sharedSpacingScales.has(shared.spacing))) {
    errors.push(`${label}.shared.spacing must be compact, default, or spacious`);
  }
  if (
    shared.anchorId !== undefined &&
    !(typeof shared.anchorId === "string" && ANCHOR_ID_PATTERN.test(shared.anchorId))
  ) {
    errors.push(`${label}.shared.anchorId must be a slug (lowercase, digits, hyphens) when present`);
  }
  if (shared.aiLock !== undefined && typeof shared.aiLock !== "boolean") {
    errors.push(`${label}.shared.aiLock must be a boolean when present`);
  }
}

function validateProductShowcase(
  section: UnknownRecord,
  errors: string[],
  options: SectionValidationOptions,
): void {
  const draft = options.draft === true;

  // layout
  if (typeof section.layout !== "string" || !productShowcaseLayouts.has(section.layout)) {
    errors.push("product_showcase.layout must be split or fullbleed");
  }
  const layout = section.layout;

  // core text
  if (!hasText(section, "productName")) errors.push("product_showcase.productName is required");
  if (!hasText(section, "headline")) errors.push("product_showcase.headline is required");
  if (!hasText(section, "productAlt")) errors.push("product_showcase.productAlt is required");

  // product asset (src required unless draft)
  if (!isRecord(section.productAsset)) {
    errors.push("product_showcase.productAsset must be an object");
  } else if (!hasText(section.productAsset, "src") && !draft) {
    errors.push("product_showcase.productAsset.src is required (allowed empty only in draft)");
  }

  // CTAs
  if (!Array.isArray(section.ctas)) {
    errors.push("product_showcase.ctas must be an array");
  } else {
    if (section.ctas.length < 1) errors.push("product_showcase must include at least 1 CTA");
    section.ctas.forEach((cta, index) => {
      if (!isRecord(cta)) {
        errors.push(`product_showcase.ctas[${index}] must be an object`);
        return;
      }
      if (!hasText(cta, "label")) errors.push(`product_showcase.ctas[${index}].label is required`);
      if (typeof cta.variant !== "string" || !productShowcaseCtaVariants.has(cta.variant)) {
        errors.push(`product_showcase.ctas[${index}].variant must be primary or secondary`);
      }
    });
  }

  // features
  if (!Array.isArray(section.features)) {
    errors.push("product_showcase.features must be an array");
  } else {
    const count = section.features.length;
    if (layout === "split" && count < 2) {
      errors.push("product_showcase split layout requires at least 2 features");
    }
    if (count > 4) {
      errors.push("product_showcase.features must include at most 4 items");
    }
    section.features.forEach((feature, index) => {
      if (!isRecord(feature)) {
        errors.push(`product_showcase.features[${index}] must be an object`);
        return;
      }
      if (!isShortText(feature.label, FEATURE_LABEL_MAX)) {
        errors.push(`product_showcase.features[${index}].label is required and must be short`);
      }
      if (!isShortText(feature.value, FEATURE_VALUE_MAX)) {
        errors.push(`product_showcase.features[${index}].value is required and must be short`);
      }
      if (
        feature.description !== undefined &&
        !isShortText(feature.description, FEATURE_DESCRIPTION_MAX)
      ) {
        errors.push(
          `product_showcase.features[${index}].description must be short (no paragraph-heavy feature cards)`,
        );
      }
    });
  }

  // theme
  if (!isRecord(section.theme)) {
    errors.push("product_showcase.theme is required");
  } else {
    for (const field of productShowcaseThemeFields) {
      if (!hasText(section.theme, field)) {
        errors.push(`product_showcase.theme.${field} is required`);
      }
    }
  }

  // optional enums
  if (section.mediaPosition !== undefined) {
    if (typeof section.mediaPosition !== "string" || !productShowcaseMediaPositions.has(section.mediaPosition)) {
      errors.push("product_showcase.mediaPosition must be left, center, or right");
    }
  }

  if (section.overlay !== undefined) {
    if (!isRecord(section.overlay)) {
      errors.push("product_showcase.overlay must be an object when present");
    } else if (
      section.overlay.position !== undefined &&
      (typeof section.overlay.position !== "string" ||
        !productShowcaseOverlayPositions.has(section.overlay.position))
    ) {
      errors.push("product_showcase.overlay.position must be left, right, bottom, or full");
    }
  }

  if (section.motion !== undefined) {
    if (!isRecord(section.motion)) {
      errors.push("product_showcase.motion must be an object when present");
    } else {
      const motion = section.motion;
      if (motion.enabled !== undefined && typeof motion.enabled !== "boolean") {
        errors.push("product_showcase.motion.enabled must be a boolean when present");
      }
      if (
        motion.productParallax !== undefined &&
        (typeof motion.productParallax !== "string" || !productShowcaseParallaxValues.has(motion.productParallax))
      ) {
        errors.push("product_showcase.motion.productParallax must be none or subtle");
      }
      if (
        motion.productScale !== undefined &&
        (typeof motion.productScale !== "string" || !productShowcaseParallaxValues.has(motion.productScale))
      ) {
        errors.push("product_showcase.motion.productScale must be none or subtle");
      }
      if (
        motion.featureReveal !== undefined &&
        (typeof motion.featureReveal !== "string" || !productShowcaseRevealValues.has(motion.featureReveal))
      ) {
        errors.push("product_showcase.motion.featureReveal must be none or stagger");
      }
    }
  }
}

function stringArrayField(record: UnknownRecord, field: string): string[] | null {
  const value = record[field];
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    return null;
  }
  return value;
}

function validateFaqItems(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.length >= 3 &&
    value.every((item) => isRecord(item) && hasText(item, "question") && hasText(item, "answer"))
  );
}

function validateImplementationRequiredSections(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === "string" && isKnownSectionType(item))
  );
}

function validateSection(
  section: UnknownRecord,
  errors: string[],
  options: SectionValidationOptions = {},
): void {
  const rawType = section.type;
  if (typeof rawType !== "string" || !isKnownSectionType(rawType)) {
    errors.push(`Unknown section type: ${typeof rawType === "string" ? rawType : String(rawType)}`);
    return;
  }

  switch (rawType) {
    case "hero":
      if (!hasText(section, "headline")) errors.push("hero.headline is required");
      if (!hasText(section, "primary_cta")) errors.push("hero.primary_cta is required");
      break;
    case "problem": {
      if (!hasText(section, "title")) errors.push("problem.title is required");
      const symptoms = stringArrayField(section, "symptoms");
      if (!symptoms || symptoms.length < 2) errors.push("problem.symptoms must include at least 2 items");
      if (!hasText(section, "cost_of_inaction")) errors.push("problem.cost_of_inaction is required");
      break;
    }
    case "mechanism": {
      if (!hasText(section, "title")) errors.push("mechanism.title is required");
      if (!hasText(section, "explanation")) errors.push("mechanism.explanation is required");
      if (!hasText(section, "why_it_works")) errors.push("mechanism.why_it_works is required");
      const alternatives = stringArrayField(section, "difference_from_alternatives");
      if (!alternatives || alternatives.length < 1) {
        errors.push("mechanism.difference_from_alternatives must include at least 1 item");
      }
      break;
    }
    case "offer": {
      if (!hasText(section, "title")) errors.push("offer.title is required");
      const deliverables = stringArrayField(section, "deliverables");
      if (!deliverables || deliverables.length < 2) errors.push("offer.deliverables must include at least 2 items");
      if (!hasText(section, "format")) errors.push("offer.format is required");
      if (!hasText(section, "timeline")) errors.push("offer.timeline is required");
      break;
    }
    case "proof": {
      const proofPoints = stringArrayField(section, "proof_points");
      if (!proofPoints || proofPoints.length < 1) errors.push("proof.proof_points must include at least 1 item");
      if (!stringArrayField(section, "credibility_signals")) errors.push("proof.credibility_signals must be a string array");
      if (!stringArrayField(section, "testimonial_placeholders")) {
        errors.push("proof.testimonial_placeholders must be a string array");
      }
      break;
    }
    case "pricing":
      if (!hasText(section, "pilot_price")) errors.push("pricing.pilot_price is required");
      if (!hasText(section, "premium_upgrade")) errors.push("pricing.premium_upgrade is required");
      if (!hasText(section, "pricing_rationale")) errors.push("pricing.pricing_rationale is required");
      if (!hasText(section, "risk_reversal")) errors.push("pricing.risk_reversal is required");
      break;
    case "faq":
      if (!validateFaqItems(section.items)) errors.push("faq.items must include at least 3 complete items");
      break;
    case "final_cta":
      if (!hasText(section, "headline")) errors.push("final_cta.headline is required");
      if (!hasText(section, "cta")) errors.push("final_cta.cta is required");
      break;
    case "implementation_notes": {
      const components = stringArrayField(section, "components");
      if (!components || components.length < 1) errors.push("implementation_notes.components must include at least 1 item");
      if (!validateImplementationRequiredSections(section.required_sections)) {
        errors.push("implementation_notes.required_sections must contain known section types");
      }
      if (!stringArrayField(section, "missing_visual_assets")) {
        errors.push("implementation_notes.missing_visual_assets must be a string array");
      }
      const acceptanceChecks = stringArrayField(section, "acceptance_checks");
      if (!acceptanceChecks || acceptanceChecks.length < 1) {
        errors.push("implementation_notes.acceptance_checks must include at least 1 item");
      }
      break;
    }
    case "navigation_bar": {
      if (!hasText(section, "logo_label")) errors.push("navigation_bar.logo_label is required");
      if (!Array.isArray(section.links)) {
        errors.push("navigation_bar.links must be an array");
      } else {
        section.links.forEach((link, index) => {
          if (!isRecord(link)) {
            errors.push(`navigation_bar.links[${index}] must be an object`);
            return;
          }
          if (!hasText(link, "label")) errors.push(`navigation_bar.links[${index}].label is required`);
          if (!hasText(link, "anchor")) errors.push(`navigation_bar.links[${index}].anchor is required`);
        });
      }
      if (section.cta !== undefined) {
        if (!isRecord(section.cta)) {
          errors.push("navigation_bar.cta must be an object when present");
        } else if (!hasText(section.cta, "label")) {
          errors.push("navigation_bar.cta.label is required");
        }
      }
      break;
    }
    case "footer": {
      if (!Array.isArray(section.link_groups)) {
        errors.push("footer.link_groups must be an array");
      } else {
        section.link_groups.forEach((group, index) => {
          if (!isRecord(group)) {
            errors.push(`footer.link_groups[${index}] must be an object`);
            return;
          }
          if (!hasText(group, "heading")) errors.push(`footer.link_groups[${index}].heading is required`);
          if (!Array.isArray(group.links)) {
            errors.push(`footer.link_groups[${index}].links must be an array`);
            return;
          }
          group.links.forEach((link, li) => {
            if (!isRecord(link) || !hasText(link, "label")) {
              errors.push(`footer.link_groups[${index}].links[${li}].label is required`);
            }
          });
        });
      }
      break;
    }
    case "testimonials": {
      if (!Array.isArray(section.items)) {
        errors.push("testimonials.items must be an array");
      } else {
        if (section.items.length < 1) errors.push("testimonials.items must include at least 1 item");
        section.items.forEach((item, index) => {
          if (!isRecord(item)) {
            errors.push(`testimonials.items[${index}] must be an object`);
            return;
          }
          if (!hasText(item, "quote")) errors.push(`testimonials.items[${index}].quote is required`);
          if (!hasText(item, "author")) errors.push(`testimonials.items[${index}].author is required`);
        });
      }
      break;
    }
    case "logo_strip": {
      if (!Array.isArray(section.logos)) {
        errors.push("logo_strip.logos must be an array");
      } else {
        if (section.logos.length < 1) errors.push("logo_strip.logos must include at least 1 logo");
        section.logos.forEach((logo, index) => {
          if (!isRecord(logo) || !hasText(logo, "name")) {
            errors.push(`logo_strip.logos[${index}].name is required`);
          }
        });
      }
      break;
    }
    case "stats_bar": {
      if (!Array.isArray(section.stats)) {
        errors.push("stats_bar.stats must be an array");
      } else {
        if (section.stats.length < 1) errors.push("stats_bar.stats must include at least 1 stat");
        section.stats.forEach((stat, index) => {
          if (!isRecord(stat)) {
            errors.push(`stats_bar.stats[${index}] must be an object`);
            return;
          }
          if (!hasText(stat, "value")) errors.push(`stats_bar.stats[${index}].value is required`);
          if (!hasText(stat, "label")) errors.push(`stats_bar.stats[${index}].label is required`);
        });
      }
      break;
    }
    case "feature_split": {
      if (!hasText(section, "title")) errors.push("feature_split.title is required");
      if (!Array.isArray(section.features)) {
        errors.push("feature_split.features must be an array");
      } else {
        if (section.features.length < 2) errors.push("feature_split.features must include at least 2 items");
        section.features.forEach((feature, index) => {
          if (!isRecord(feature) || !hasText(feature, "title")) {
            errors.push(`feature_split.features[${index}].title is required`);
          }
        });
      }
      if (
        section.mediaPosition !== undefined &&
        section.mediaPosition !== "left" &&
        section.mediaPosition !== "right"
      ) {
        errors.push("feature_split.mediaPosition must be left or right");
      }
      break;
    }
    case "product_showcase":
      validateProductShowcase(section, errors, options);
      break;
  }
}

function isStructurallyValidSection(section: unknown): section is PageBuilderSection {
  if (!isRecord(section) || typeof section.type !== "string" || !isKnownSectionType(section.type)) {
    return false;
  }
  const errors: string[] = [];
  validateSection(section, errors);
  return errors.length === 0;
}

export function validatePageBuilderDocument(raw: unknown): ValidatePageBuilderDocumentResult {
  const errors: string[] = [];

  if (!isRecord(raw)) {
    return { ok: false, errors: ["Document must be an object"] };
  }

  if (raw.page_type !== "landing_page") {
    errors.push("page_type must be landing_page");
  }
  if (raw.schema_version !== undefined && raw.schema_version !== PAGE_BUILDER_SCHEMA_VERSION) {
    errors.push(`schema_version must be ${PAGE_BUILDER_SCHEMA_VERSION} when present`);
  }
  if (!hasText(raw, "title")) {
    errors.push("title is required");
  }
  if (typeof raw.status !== "string" || !validStatuses.has(raw.status as PageBuilderDocumentStatus)) {
    errors.push("status must be draft, validated, or export_ready");
  }
  if (!Array.isArray(raw.sections)) {
    errors.push("sections must be an array");
  }

  const sections = Array.isArray(raw.sections) ? raw.sections : [];
  const knownSections = sections.filter(isStructurallyValidSection);
  const isDraft = raw.status === "draft";

  for (const section of sections) {
    if (!isRecord(section)) {
      errors.push("Each section must be an object");
      continue;
    }
    validateSection(section, errors, { draft: isDraft });
    const label = typeof section.type === "string" ? section.type : "section";
    validateSharedLayer(section.shared, errors, label);
  }

  const sectionTypes = sections
    .filter(isRecord)
    .map((section) => section.type)
    .filter((type): type is PageBuilderSectionType => typeof type === "string" && isKnownSectionType(type));
  const duplicateTypes = sectionTypes.filter((type, index) => sectionTypes.indexOf(type) !== index);
  for (const type of Array.from(new Set(duplicateTypes))) {
    errors.push(`Section appears more than once: ${type}`);
  }

  const missing = getMissingRequiredSections(knownSections);
  for (const type of missing) {
    errors.push(`Missing required section: ${type}`);
  }

  if (isRecord(raw.brand_context)) {
    for (const key of ["slug", "dominant_mechanism", "applied_mechanism", "task_type"]) {
      if (raw.brand_context[key] !== undefined && typeof raw.brand_context[key] !== "string") {
        errors.push(`brand_context.${key} must be a string when present`);
      }
    }
  } else if (raw.brand_context !== undefined) {
    errors.push("brand_context must be an object when present");
  }

  if (raw.source !== undefined && typeof raw.source !== "string") {
    errors.push("source must be a string when present");
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, document: raw as unknown as PageBuilderDocument };
}
