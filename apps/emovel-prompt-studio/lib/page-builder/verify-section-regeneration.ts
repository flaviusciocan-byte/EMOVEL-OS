// Verification harness for Page Builder section-level regeneration helpers.
// Run: npx tsx lib/page-builder/verify-section-regeneration.ts
// No provider call: tests parse/validate/replace/save safety only.

import type { PageBuilderDocument, ProductShowcaseSection } from "./schema";
import {
  clearPageBuilderDocument,
  getPageBuilderDocument,
  replacePageBuilderSection,
  savePageBuilderDocument,
  validatePageBuilderSection,
} from "./index";

let failures = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    console.log(`  ok   ${name}`);
  } else {
    failures += 1;
    console.error(`  FAIL ${name}${detail ? ` - ${detail}` : ""}`);
  }
}

const SLUG = "verify-page-builder-section-regeneration-tmp";

const validDocument: PageBuilderDocument = {
  page_type: "landing_page",
  schema_version: "1.0.0",
  title: "Section Regeneration Landing Page",
  status: "draft",
  sections: [
    { type: "hero", headline: "Build the page your offer deserves", primary_cta: "Start the pilot" },
    {
      type: "problem",
      title: "Your page needs focus",
      symptoms: ["The promise is scattered", "The CTA is unclear"],
      cost_of_inaction: "Qualified visitors leave before understanding the offer.",
    },
    {
      type: "mechanism",
      title: "Validation-first mechanism",
      explanation: "Each regenerated section is checked before it can replace the saved document.",
      why_it_works: "It keeps the page coherent while improving one section at a time.",
      difference_from_alternatives: ["It never saves an invalid final document"],
    },
    {
      type: "offer",
      title: "Landing Page Sprint",
      deliverables: ["Regenerated section", "Validated document"],
      format: "Async sprint",
      timeline: "3 business days",
    },
    {
      type: "proof",
      proof_points: ["Validation runs before save"],
      credibility_signals: ["Local deterministic checks"],
      testimonial_placeholders: ["[PLACEHOLDER: result quote]"],
    },
    {
      type: "pricing",
      pilot_price: "$1,500 pilot",
      premium_upgrade: "$4,500 implementation",
      pricing_rationale: "Start narrow before expanding the page.",
      risk_reversal: "Invalid replacements are rejected.",
    },
    {
      type: "faq",
      items: [
        { question: "Can hero regenerate?", answer: "Yes." },
        { question: "Can FAQ regenerate?", answer: "Yes." },
        { question: "Can invalid output save?", answer: "No." },
      ],
    },
    { type: "final_cta", headline: "Regenerate one section safely", cta: "Regenerate section" },
    {
      type: "implementation_notes",
      components: ["Section generator", "Validator", "Store"],
      required_sections: ["hero", "offer", "pricing", "faq"],
      missing_visual_assets: [],
      acceptance_checks: ["Section validates", "Document validates", "Invalid output is not saved"],
    },
  ],
};

const validShowcase: ProductShowcaseSection = {
  type: "product_showcase",
  layout: "split",
  productName: "Regeneration Console",
  headline: "Regeneration console for validated sections",
  productAsset: { src: "assets/regeneration-console.png", type: "render" },
  productAlt: "Regeneration console render",
  ctas: [{ label: "Regenerate", variant: "primary" }],
  features: [
    { label: "Scope", value: "1 section" },
    { label: "Safety", value: "Validated" },
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

async function main() {
  await clearPageBuilderDocument(SLUG);

  console.log("Replace supported sections:");
  const hero = replacePageBuilderSection(validDocument, {
    type: "hero",
    headline: "A regenerated hero for a safer landing page",
    primary_cta: "Regenerate safely",
  });
  check("replace hero with valid hero passes", hero.ok === true);

  const offer = replacePageBuilderSection(validDocument, {
    type: "offer",
    title: "Regenerated Offer",
    deliverables: ["Validated hero", "Validated offer"],
    format: "Focused regeneration",
    timeline: "24 hours",
  });
  check("replace offer with valid offer passes", offer.ok === true);

  const faq = replacePageBuilderSection(validDocument, {
    type: "faq",
    items: [
      { question: "One?", answer: "One." },
      { question: "Two?", answer: "Two." },
      { question: "Three?", answer: "Three." },
    ],
  });
  check("replace faq with valid FAQ passes", faq.ok === true);

  console.log("Reject invalid sections:");
  const mismatch = validatePageBuilderSection(
    { type: "offer", title: "Wrong", deliverables: ["A", "B"], format: "x", timeline: "x" },
    "hero",
  );
  check("replace with section type different from expected is rejected", mismatch.ok === false);

  const invalidHero = replacePageBuilderSection(validDocument, { type: "hero", headline: "", primary_cta: "" });
  check("replace with invalid section is rejected", invalidHero.ok === false);

  console.log("Save safety:");
  await savePageBuilderDocument(SLUG, validDocument);
  const invalidFinal = replacePageBuilderSection(validDocument, {
    type: "pricing",
    pilot_price: "",
    premium_upgrade: "",
    pricing_rationale: "",
    risk_reversal: "",
  });
  if (invalidFinal.ok) {
    await savePageBuilderDocument(SLUG, invalidFinal.document);
  }
  const stored = await getPageBuilderDocument(SLUG);
  check("document final invalid is not saved", stored?.title === validDocument.title && invalidFinal.ok === false);

  console.log("ProductShowcase optional:");
  const added = replacePageBuilderSection(validDocument, validShowcase);
  check("product_showcase optional can be added", added.ok === true && added.document.sections.some((s) => s.type === "product_showcase"));
  const replacedShowcase = added.ok
    ? replacePageBuilderSection(added.document, { ...validShowcase, headline: "Updated product showcase for safe regeneration" })
    : added;
  check("product_showcase can be replaced", replacedShowcase.ok === true);

  const order = added.ok ? added.document.sections.map((section) => section.type).join(" -> ") : "";
  check(
    "section order remains canonical",
    order.startsWith("hero -> problem -> mechanism -> offer -> proof -> pricing -> faq -> final_cta -> implementation_notes"),
    order,
  );

  await clearPageBuilderDocument(SLUG);

  if (failures > 0) {
    console.error(`\n${failures} check(s) FAILED`);
    process.exit(1);
  }
  console.log("\nAll checks passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
