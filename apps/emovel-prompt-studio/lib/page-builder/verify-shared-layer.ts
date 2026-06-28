// Verification harness for the Shared Layer + SectionSurface (Registry v1.1).
// Run: npx tsx lib/page-builder/verify-shared-layer.ts
// No test framework; exits non-zero on any failed check.

import type { PageBuilderDocument } from "./schema";
import { normalizePageBuilderDocument } from "./normalize";
import { validatePageBuilderDocument } from "./validator";
import { requiredSectionTypes } from "./sections";
import {
  DEFAULT_SHARED_SECTION_PROPS,
  defaultAnchorIdFor,
  resolveSectionSurface,
  sectionSurfaceClassName,
  sectionSurfaceDataAttributes,
  slugifyAnchorId,
} from "./section-surface";

let failures = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    console.log(`  ok   ${name}`);
  } else {
    failures += 1;
    console.error(`  FAIL ${name}${detail ? ` - ${detail}` : ""}`);
  }
}

// Minimal valid landing document (all required sections, no shared layer set).
function buildValidDocument(): PageBuilderDocument {
  return {
    page_type: "landing_page",
    title: "Shared Layer Verify",
    status: "draft",
    sections: [
      { type: "hero", headline: "Headline", primary_cta: "Start" },
      {
        type: "problem",
        title: "Problem",
        symptoms: ["one", "two"],
        cost_of_inaction: "Cost.",
      },
      {
        type: "mechanism",
        title: "Mechanism",
        explanation: "Explanation.",
        why_it_works: "Because.",
        difference_from_alternatives: ["different"],
      },
      {
        type: "offer",
        title: "Offer",
        deliverables: ["a", "b"],
        format: "Async",
        timeline: "5 days",
      },
      {
        type: "proof",
        proof_points: ["proof"],
        credibility_signals: ["signal"],
        testimonial_placeholders: ["quote"],
      },
      {
        type: "pricing",
        pilot_price: "$1",
        premium_upgrade: "$2",
        pricing_rationale: "Reason.",
        risk_reversal: "Guarantee.",
      },
      {
        type: "faq",
        items: [
          { question: "Q1?", answer: "A1." },
          { question: "Q2?", answer: "A2." },
          { question: "Q3?", answer: "A3." },
        ],
      },
      { type: "final_cta", headline: "Final", cta: "Go" },
      {
        type: "implementation_notes",
        components: ["x"],
        required_sections: [...requiredSectionTypes],
        missing_visual_assets: [],
        acceptance_checks: ["ok"],
      },
    ],
  };
}

console.log("Shared Layer — resolver:");

const dflt = resolveSectionSurface(undefined);
check("undefined shared resolves to defaults", dflt.surface === "base" && dflt.motion === "subtle" && dflt.spacing === "default" && dflt.aiLock === false && dflt.anchorId === null && dflt.universe === null);
check("DEFAULT_SHARED_SECTION_PROPS matches resolver defaults", DEFAULT_SHARED_SECTION_PROPS.surface === dflt.surface && DEFAULT_SHARED_SECTION_PROPS.motion === dflt.motion && DEFAULT_SHARED_SECTION_PROPS.spacing === dflt.spacing);

const custom = resolveSectionSurface({ surface: "contrast", motion: "expressive", spacing: "spacious", universe: "noir", anchorId: "intro", aiLock: true });
check("valid shared values are preserved", custom.surface === "contrast" && custom.motion === "expressive" && custom.spacing === "spacious" && custom.universe === "noir" && custom.anchorId === "intro" && custom.aiLock === true);

const bad = resolveSectionSurface({ surface: "neon" as never, motion: "wild" as never, spacing: "huge" as never, universe: "   ", aiLock: "yes" as never });
check("invalid shared values fall back to defaults", bad.surface === "base" && bad.motion === "subtle" && bad.spacing === "default" && bad.universe === null && bad.aiLock === false);

console.log("\nShared Layer — anchorId helpers:");
check("slugify lowercases and hyphenates", slugifyAnchorId("Final CTA!") === "final-cta");
check("slugify strips accents", slugifyAnchorId("Café Offer") === "cafe-offer");
check("defaultAnchorIdFor base occurrence", defaultAnchorIdFor("product_showcase", 1) === "product-showcase");
check("defaultAnchorIdFor de-dups occurrence", defaultAnchorIdFor("product_showcase", 2) === "product-showcase-2");

console.log("\nShared Layer — validation:");
const base = buildValidDocument();
check("valid document with no shared layer passes", validatePageBuilderDocument(base).ok === true);

function withHeroShared(shared: unknown): PageBuilderDocument {
  const doc = buildValidDocument();
  doc.sections[0] = { ...doc.sections[0], shared } as PageBuilderDocument["sections"][number];
  return doc;
}

check("valid shared layer on a section passes", validatePageBuilderDocument(withHeroShared({ surface: "raised", motion: "none", spacing: "compact", anchorId: "hero", aiLock: false })).ok === true);

const badSurface = validatePageBuilderDocument(withHeroShared({ surface: "neon" }));
check("invalid surface is rejected", badSurface.ok === false && badSurface.errors.some((e) => e.includes("shared.surface")));

const badMotion = validatePageBuilderDocument(withHeroShared({ motion: "wild" }));
check("invalid motion is rejected", badMotion.ok === false && badMotion.errors.some((e) => e.includes("shared.motion")));

const badSpacing = validatePageBuilderDocument(withHeroShared({ spacing: "huge" }));
check("invalid spacing is rejected", badSpacing.ok === false && badSpacing.errors.some((e) => e.includes("shared.spacing")));

const badAnchor = validatePageBuilderDocument(withHeroShared({ anchorId: "Not A Slug" }));
check("invalid anchorId is rejected", badAnchor.ok === false && badAnchor.errors.some((e) => e.includes("shared.anchorId")));

const badAiLock = validatePageBuilderDocument(withHeroShared({ aiLock: "yes" }));
check("invalid aiLock is rejected", badAiLock.ok === false && badAiLock.errors.some((e) => e.includes("shared.aiLock")));

const badSharedType = validatePageBuilderDocument(withHeroShared("nope"));
check("non-object shared is rejected", badSharedType.ok === false && badSharedType.errors.some((e) => e.includes("shared must be an object")));

console.log("\nShared Layer — normalize fills defaults + anchorId:");
const normalized = normalizePageBuilderDocument(base);
check("normalize succeeds", normalized.ok === true);
if (normalized.ok) {
  const everySectionHasShared = normalized.document.sections.every((s) => s.shared !== undefined);
  check("every section carries a shared layer after normalize", everySectionHasShared);
  const hero = normalized.document.sections.find((s) => s.type === "hero");
  check("hero anchorId derived", hero?.shared?.anchorId === "hero");
  check("hero surface defaulted", hero?.shared?.surface === "base" && hero?.shared?.motion === "subtle" && hero?.shared?.spacing === "default");
  const finalCta = normalized.document.sections.find((s) => s.type === "final_cta");
  check("final_cta anchorId derived", finalCta?.shared?.anchorId === "final-cta");
}

const preserve = buildValidDocument();
preserve.sections[0] = { ...preserve.sections[0], shared: { surface: "contrast", anchorId: "top" } } as PageBuilderDocument["sections"][number];
const normalizedPreserve = normalizePageBuilderDocument(preserve);
check("normalize preserves author-set shared values", normalizedPreserve.ok === true && normalizedPreserve.document.sections.find((s) => s.type === "hero")?.shared?.surface === "contrast" && normalizedPreserve.document.sections.find((s) => s.type === "hero")?.shared?.anchorId === "top");

console.log("\nShared Layer — render bridge:");
const baseTokens = resolveSectionSurface({ surface: "base" });
check("base surface adds no background class", sectionSurfaceClassName(baseTokens) === "scroll-mt-24");
const raisedTokens = resolveSectionSurface({ surface: "raised" });
check("raised surface adds a background class", sectionSurfaceClassName(raisedTokens).includes("bg-white/[0.03]"));
const attrs = sectionSurfaceDataAttributes(resolveSectionSurface({ surface: "inset", motion: "expressive", universe: "noir", aiLock: true }));
check("data attributes reflect resolved shared layer", attrs["data-surface"] === "inset" && attrs["data-motion"] === "expressive" && attrs["data-universe"] === "noir" && attrs["data-ai-lock"] === "true");

if (failures > 0) {
  console.error(`\n${failures} check(s) FAILED`);
  process.exit(1);
}
console.log("\nAll shared-layer checks passed.");
