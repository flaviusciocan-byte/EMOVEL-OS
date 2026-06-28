// Verification harness for the Page Builder Core.
// Run: npx tsx lib/page-builder/verify.ts
// No test framework; exits non-zero on any failed check.

import type { PageBuilderDocument, ProductShowcaseSection } from "./schema";
import { pageBuilderDocumentToMarkdown } from "./export";
import { normalizePageBuilderDocument } from "./normalize";
import { pageBuilderRegistry } from "./registry";
import {
  canonicalSectionOrder,
  darkCinematicTheme,
  isKnownSectionType,
  productShowcaseThemePresets,
  pureNoirTheme,
  requiredSectionTypes,
} from "./sections";
import type { PageBuilderSectionType } from "./schema";
import { validatePageBuilderDocument } from "./validator";
import { buildLandingPageBuilderPrompt } from "./generator";
import { allQuestionIds } from "../brand-mechanism";
import { clearBrandMechanismProfile, runAndPersistBrandMechanismAudit } from "../brand-os";

let failures = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    console.log(`  ok   ${name}`);
  } else {
    failures += 1;
    console.error(`  FAIL ${name}${detail ? ` - ${detail}` : ""}`);
  }
}

const validDocument: PageBuilderDocument = {
  page_type: "landing_page",
  title: "EMOVEL Landing Page",
  status: "draft",
  source: "verify",
  brand_context: {
    slug: "emovel",
    dominant_mechanism: "aspiration",
    applied_mechanism: "premium transformation",
    task_type: "landing_page",
  },
  sections: [
    {
      type: "hero",
      headline: "Build the page your offer deserves",
      subheadline: "A focused landing page structure for premium digital offers.",
      primary_cta: "Start the pilot",
      secondary_cta: "See the plan",
      proof_line: "Built on EMOVEL OS strategy primitives.",
    },
    {
      type: "problem",
      title: "Your offer is stronger than the page explaining it",
      symptoms: ["The promise is scattered", "The CTA arrives before trust is built"],
      cost_of_inaction: "Qualified buyers leave without understanding the value.",
    },
    {
      type: "mechanism",
      title: "A mechanism-first page structure",
      explanation: "Each section advances one commercial job.",
      why_it_works: "The page moves from promise to pain, proof, price, and action.",
      difference_from_alternatives: ["It validates structure before any UI is rendered"],
    },
    {
      type: "offer",
      title: "Landing Page Core Sprint",
      deliverables: ["Validated section architecture", "Markdown-ready export"],
      format: "Async sprint",
      timeline: "5 business days",
    },
    {
      type: "proof",
      proof_points: ["Clear schema gate before publishing"],
      credibility_signals: ["Brand OS aware", "Strict TypeScript core"],
      testimonial_placeholders: ["Founder result quote", "Operator workflow quote"],
    },
    {
      type: "pricing",
      pilot_price: "$1,500 pilot",
      premium_upgrade: "$4,500 implementation",
      pricing_rationale: "Start with the core before investing in UI.",
      risk_reversal: "No visual build begins until the document validates.",
    },
    {
      type: "faq",
      items: [
        { question: "Does this include UI?", answer: "No, this phase is core-only." },
        { question: "Does this use Puck?", answer: "No, Puck is outside phase 1." },
        { question: "Can it export?", answer: "Yes, it exports structured markdown." },
      ],
    },
    {
      type: "final_cta",
      headline: "Turn the strategy into a validated page",
      cta: "Validate my landing page",
      microcopy: "Core first, visuals later.",
    },
    {
      type: "implementation_notes",
      components: ["PageBuilderDocument", "Section registry", "Markdown exporter"],
      required_sections: [...requiredSectionTypes],
      missing_visual_assets: [],
      acceptance_checks: ["All required sections validate", "Markdown export includes implementation notes"],
    },
  ],
};

function withoutSection(type: string): PageBuilderDocument {
  return {
    ...validDocument,
    sections: validDocument.sections.filter((section) => section.type !== type),
  };
}

console.log("Page Builder Core:");

const valid = validatePageBuilderDocument(validDocument);
check("valid document passes", valid.ok === true);

const normalizedString = normalizePageBuilderDocument(JSON.stringify(validDocument));
check("valid JSON string passes through normalize", normalizedString.ok === true);

const noHero = validatePageBuilderDocument(withoutSection("hero"));
check("document without hero is rejected", noHero.ok === false && noHero.errors.some((error) => error.includes("hero")));

const noPricing = validatePageBuilderDocument(withoutSection("pricing"));
check(
  "document without pricing is rejected",
  noPricing.ok === false && noPricing.errors.some((error) => error.includes("pricing")),
);

const unknownSection = validatePageBuilderDocument({
  ...validDocument,
  sections: [...validDocument.sections, { type: "mystery", title: "Unknown" }],
});
check(
  "document with unknown section is rejected",
  unknownSection.ok === false && unknownSection.errors.some((error) => error.includes("Unknown section type")),
);

const wrongOrder = normalizePageBuilderDocument({
  ...validDocument,
  sections: [...validDocument.sections].reverse(),
});
check(
  "document with wrong section order is normalized",
  wrongOrder.ok === true &&
    wrongOrder.document.sections.map((section) => section.type).join("|") ===
      canonicalSectionOrder.filter((t) => validDocument.sections.some((s) => s.type === t)).join("|"),
);

const shortFaq = validatePageBuilderDocument({
  ...validDocument,
  sections: validDocument.sections.map((section) =>
    section.type === "faq"
      ? { ...section, items: section.items.slice(0, 2) }
      : section,
  ),
});
check("FAQ with fewer than 3 items is rejected", shortFaq.ok === false);

const shortOffer = validatePageBuilderDocument({
  ...validDocument,
  sections: validDocument.sections.map((section) =>
    section.type === "offer"
      ? { ...section, deliverables: section.deliverables.slice(0, 1) }
      : section,
  ),
});
check("offer with fewer than 2 deliverables is rejected", shortOffer.ok === false);

const markdown = pageBuilderDocumentToMarkdown(validDocument);
for (const heading of ["Hero", "Offer", "Pricing", "FAQ", "Implementation Notes"]) {
  check(`markdown export contains ${heading}`, markdown.includes(heading));
}

check(
  "registry has all required sections",
  requiredSectionTypes.every((type) => pageBuilderRegistry[type]?.required === true),
);

// Registry / validator drift checks — catch obvious drift, not auto-generate.
console.log("\nRegistry / validator drift:");
const registryKeys = Object.keys(pageBuilderRegistry) as PageBuilderSectionType[];
check(
  "every registry entry id matches its key and is a known section type",
  registryKeys.every((key) => pageBuilderRegistry[key].id === key && isKnownSectionType(key)),
);
check(
  "every required section has a registry entry",
  requiredSectionTypes.every((type) => pageBuilderRegistry[type] !== undefined),
);
check("product_showcase has a registry entry", pageBuilderRegistry.product_showcase !== undefined);
const minRequiredFields: Partial<Record<PageBuilderSectionType, string[]>> = {
  hero: ["headline", "primary_cta"],
  problem: ["title", "symptoms", "cost_of_inaction"],
  offer: ["deliverables"],
  pricing: ["pilot_price"],
  faq: ["items"],
  final_cta: ["headline", "cta"],
  product_showcase: ["layout", "productName", "headline", "productAsset", "productAlt", "ctas", "theme"],
};
check(
  "registry requiredFields cover the minimum validated fields per main section",
  (Object.entries(minRequiredFields) as Array<[PageBuilderSectionType, string[]]>).every(([type, fields]) =>
    fields.every((field) => pageBuilderRegistry[type].requiredFields.includes(field)),
  ),
);

// ---------------------------------------------------------------------------
// Product Showcase (Phase 2)
// ---------------------------------------------------------------------------
console.log("\nProduct Showcase (Phase 2):");

const validSplitShowcase: ProductShowcaseSection = {
  type: "product_showcase",
  layout: "split",
  productName: "EMOVEL Console",
  eyebrow: "New",
  headline: "The control surface for premium launches",
  subheadline: "From strategy to publish in one premium workspace.",
  specText: "Built on EMOVEL OS primitives.",
  productAsset: { src: "/assets/console.png", type: "render", width: 1600, height: 1000 },
  productAlt: "EMOVEL console product render",
  ctas: [
    { label: "Start the pilot", variant: "primary" },
    { label: "See the plan", variant: "secondary", href: "/plan" },
  ],
  features: [
    { label: "Latency", value: "8", unit: "ms" },
    { label: "Uptime", value: "99.99", unit: "%", description: "Across all launch regions." },
  ],
  theme: darkCinematicTheme,
  motion: { enabled: true, productParallax: "subtle", featureReveal: "stagger" },
  mediaPosition: "right",
};

const validFullbleedShowcase: ProductShowcaseSection = {
  type: "product_showcase",
  layout: "fullbleed",
  productName: "EMOVEL Console",
  headline: "One screen. Total clarity.",
  productAsset: { src: "/assets/console-full.png" },
  productAlt: "EMOVEL console full bleed render",
  ctas: [{ label: "Start the pilot", variant: "primary" }],
  features: [],
  theme: pureNoirTheme,
};

function showcaseDoc(showcase: unknown): unknown {
  return { ...validDocument, sections: [...validDocument.sections, showcase] };
}

// Deep clone to a mutable record so negative cases can omit/override freely.
function baseSplit(): Record<string, unknown> {
  return JSON.parse(JSON.stringify(validSplitShowcase)) as Record<string, unknown>;
}

check("valid split ProductShowcase passes", validatePageBuilderDocument(showcaseDoc(validSplitShowcase)).ok === true);
check("valid fullbleed ProductShowcase passes", validatePageBuilderDocument(showcaseDoc(validFullbleedShowcase)).ok === true);

const noHeadline = baseSplit();
delete noHeadline.headline;
check("ProductShowcase without headline is rejected", validatePageBuilderDocument(showcaseDoc(noHeadline)).ok === false);

const noProductName = baseSplit();
delete noProductName.productName;
check("ProductShowcase without productName is rejected", validatePageBuilderDocument(showcaseDoc(noProductName)).ok === false);

const splitNoFeatures = baseSplit();
splitNoFeatures.features = [];
check("split without features is rejected", validatePageBuilderDocument(showcaseDoc(splitNoFeatures)).ok === false);

const splitOneFeature = baseSplit();
splitOneFeature.features = [{ label: "Latency", value: "8", unit: "ms" }];
check("split with 1 feature is rejected", validatePageBuilderDocument(showcaseDoc(splitOneFeature)).ok === false);

const tooManyFeatures = baseSplit();
tooManyFeatures.features = [
  { label: "A", value: "1" },
  { label: "B", value: "2" },
  { label: "C", value: "3" },
  { label: "D", value: "4" },
  { label: "E", value: "5" },
];
check("more than 4 features is rejected", validatePageBuilderDocument(showcaseDoc(tooManyFeatures)).ok === false);

const ctaNoLabel = baseSplit();
ctaNoLabel.ctas = [{ variant: "primary" }];
check("CTA without label is rejected", validatePageBuilderDocument(showcaseDoc(ctaNoLabel)).ok === false);

const ctaBadVariant = baseSplit();
ctaBadVariant.ctas = [{ label: "Go", variant: "tertiary" }];
check("CTA with invalid variant is rejected", validatePageBuilderDocument(showcaseDoc(ctaBadVariant)).ok === false);

const themeMissingField = baseSplit();
const themeClone = { ...(themeMissingField.theme as Record<string, unknown>) };
delete themeClone.border;
themeMissingField.theme = themeClone;
check("theme missing field is rejected", validatePageBuilderDocument(showcaseDoc(themeMissingField)).ok === false);

check("registry entry for product_showcase exists", pageBuilderRegistry.product_showcase !== undefined);
check(
  "theme presets exist",
  productShowcaseThemePresets["dark-cinematic"] !== undefined &&
    productShowcaseThemePresets["light-cold-premium"] !== undefined &&
    productShowcaseThemePresets["pure-noir"] !== undefined,
);

const showcaseDocument: PageBuilderDocument = {
  ...validDocument,
  sections: [...validDocument.sections, validSplitShowcase],
};
const showcaseMarkdown = pageBuilderDocumentToMarkdown(showcaseDocument);
for (const token of ["Product name", "Headline", "CTA", "Feature cards", "Theme"]) {
  check(`product showcase markdown contains ${token}`, showcaseMarkdown.includes(token));
}

// ---------------------------------------------------------------------------
// Landing Page Generator prompt builder (Phase 3) — async checks.
// No AI call: we only inspect the prompt/messages the builder produces.
// ---------------------------------------------------------------------------
async function runGeneratorChecks(): Promise<void> {
  console.log("\nLanding Page Generator (Phase 3):");

  const project = {
    title: "EMOVEL Launch Workspace",
    prompt: "Launch a premium AI launch workspace for solo founders.",
    refinedBrief: {
      productType: "Launch workspace",
      targetAudience: "Solo founders",
      platform: "Web app",
      tone: "Premium, clear",
      launchGoal: "Sell a pilot",
      pricePoint: "$1,500 pilot",
    },
  };
  const assets = {
    strategy: {
      audience: "Solo founders",
      problem: "Launches stall between strategy and execution.",
      positioning: "A premium workspace from strategy to publish.",
      opportunity: "Own the gap between prompting and launch.",
    },
    offer: {
      offerName: "Launch Pilot",
      pricing: "$1,500 pilot",
      deliverables: ["Validated page", "Launch checklist"],
      guarantee: "Revise at no extra cost if unclear.",
    },
  };

  // Fallback-safe: a slug with no stored Brand OS profile.
  const fallback = await buildLandingPageBuilderPrompt({
    slug: "verify-pb-no-profile-xyz",
    project,
    assets,
  });
  check("generator uses taskType landing_page", fallback.taskType === "landing_page");
  check("generator produces 2 messages (system/user)", fallback.messages.length === 2);
  check(
    "generator messages have system then user roles",
    fallback.messages[0]?.role === "system" && fallback.messages[1]?.role === "user",
  );
  check("generator fallback-safe without Brand OS profile", fallback.fallback === true && fallback.hasBrandContext === false);
  check("systemPrompt asks for JSON only", /JSON only/i.test(fallback.systemPrompt));
  check("systemPrompt mentions PageBuilderDocument", fallback.systemPrompt.includes("PageBuilderDocument"));
  check(
    "systemPrompt mentions required sections",
    ["hero", "problem", "mechanism", "offer", "proof", "pricing", "faq", "final_cta", "implementation_notes"].every(
      (section) => fallback.systemPrompt.includes(section),
    ),
  );
  check("systemPrompt mentions product_showcase as optional", /OPTIONAL[\s\S]*product_showcase|product_showcase[\s\S]*optional/i.test(fallback.systemPrompt));
  check(
    "user message includes project + assets",
    fallback.messages[1].content.includes("project_title") &&
      fallback.messages[1].content.includes("EMOVEL Launch Workspace") &&
      fallback.messages[1].content.includes("available_assets"),
  );

  // Positive path (best-effort): persist a profile, expect brand context.
  // The sandbox may block the filesystem unlink on cleanup — that is not a
  // regression and does not affect this assertion.
  const SLUG_WITH = "verify-pb-generator-tmp";
  let persisted = false;
  try {
    const answers: Record<string, number> = Object.fromEntries(allQuestionIds.map((id) => [id, 4]));
    const saved = await runAndPersistBrandMechanismAudit(answers, { slug: SLUG_WITH });
    persisted = saved.ok === true;
  } catch {
    persisted = false;
  }

  if (persisted) {
    const withCtx = await buildLandingPageBuilderPrompt({ slug: SLUG_WITH, project, assets });
    check("with Brand OS profile => hasBrandContext true", withCtx.hasBrandContext === true);
    check("with Brand OS profile => fallback false", withCtx.fallback === false);
    check("with Brand OS profile => still JSON-only PageBuilderDocument prompt", /JSON only/i.test(withCtx.systemPrompt) && withCtx.systemPrompt.includes("PageBuilderDocument"));
    try {
      await clearBrandMechanismProfile(SLUG_WITH);
    } catch {
      // sandbox unlink restriction — not a regression.
    }
  } else {
    console.log("  note  positive Brand OS profile path skipped (could not persist a profile in this environment)");
  }
}

runGeneratorChecks()
  .then(() => {
    if (failures > 0) {
      console.error(`\n${failures} check(s) FAILED`);
      process.exit(1);
    }
    console.log("\nAll checks passed.");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
