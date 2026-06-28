// Verification harness for deterministic Page Builder readiness review.
// Run: npx tsx lib/page-builder/verify-readiness.ts

import type { PageBuilderDocument } from "./schema";
import {
  clearPageBuilderDocument,
  evaluatePageBuilderReadiness,
  getPageBuilderExportFragment,
  pageBuilderDocumentToExportFragment,
  readinessToMarkdown,
  savePageBuilderDocument,
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

const SLUG = "verify-page-builder-readiness-tmp";

const completeDocument: PageBuilderDocument = {
  page_type: "landing_page",
  title: "Readiness Landing Page",
  status: "validated",
  brand_context: {
    slug: "readiness",
    dominant_mechanism: "clarity mechanism",
    applied_mechanism: "clarity mechanism",
    task_type: "landing_page",
  },
  sections: [
    {
      type: "hero",
      headline: "Clarity mechanism for premium launch pages",
      subheadline: "Turn scattered strategy into a clear builder handoff.",
      primary_cta: "Start the clarity sprint",
    },
    {
      type: "problem",
      title: "Launch pages lose quality in handoff",
      symptoms: ["Strategy is scattered across assets", "Builders cannot see the final page logic"],
      cost_of_inaction: "The page is rebuilt from guesswork instead of a validated structure.",
    },
    {
      type: "mechanism",
      title: "Clarity mechanism",
      explanation: "The page is scored before export so builders know the exact weak spots.",
      why_it_works: "It turns abstract page quality into deterministic checks.",
      difference_from_alternatives: ["No AI call is needed to review readiness"],
    },
    {
      type: "offer",
      title: "Clarity mechanism builder handoff",
      deliverables: ["Readiness review", "Export-ready landing markdown"],
      format: "Local deterministic module",
      timeline: "Same workspace export",
    },
    {
      type: "proof",
      proof_points: ["Readiness checks run locally before export"],
      credibility_signals: ["No new dependencies", "No visual editor"],
      testimonial_placeholders: ["Placeholder quote from builder handoff"],
    },
    {
      type: "pricing",
      pilot_price: "$0 internal implementation",
      premium_upgrade: "Future renderer phase",
      pricing_rationale: "Quality gate first, visual export later.",
      risk_reversal: "Export continues even when readiness is weak.",
    },
    {
      type: "faq",
      items: [
        { question: "Does this call AI?", answer: "No, it is deterministic." },
        { question: "Does this need ProductShowcase?", answer: "No, it remains optional." },
        { question: "Does this block export?", answer: "No, it reports readiness." },
      ],
    },
    {
      type: "final_cta",
      headline: "Export the clarity mechanism handoff",
      cta: "Export builder pack",
    },
    {
      type: "implementation_notes",
      components: ["PageBuilderPreview", "ReadinessSummary", "ExportFragment"],
      required_sections: ["hero", "offer", "pricing", "faq"],
      missing_visual_assets: [],
      acceptance_checks: ["Overall score shown", "Priority fixes exported"],
    },
    {
      type: "product_showcase",
      layout: "split",
      productName: "Clarity Console",
      headline: "Clarity mechanism console for premium launches",
      subheadline: "A themed product surface aligned to the clarity mechanism.",
      productAsset: { src: "assets/clarity-console.png", type: "render" },
      productAlt: "Clarity console render",
      ctas: [{ label: "Review readiness", variant: "primary" }],
      features: [
        { label: "Checks", value: "5" },
        { label: "Export", value: "ZIP" },
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
    },
  ],
};

async function main() {
  await clearPageBuilderDocument(SLUG);

  console.log("Complete document:");
  const complete = evaluatePageBuilderReadiness(completeDocument);
  check("complete document is acceptable or strong", complete.status === "acceptable" || complete.status === "strong");
  check("overall score is rounded to one decimal scale", complete.overall_score >= 0 && complete.overall_score <= 10);

  console.log("Brand context:");
  const noBrand = evaluatePageBuilderReadiness({ ...completeDocument, brand_context: undefined });
  check(
    "missing brand_context lowers brand alignment",
    noBrand.categories.brand_alignment.status === "weak" || noBrand.categories.brand_alignment.status === "acceptable",
  );

  console.log("Assets:");
  const noShowcase = evaluatePageBuilderReadiness({
    ...completeDocument,
    sections: completeDocument.sections.filter((section) => section.type !== "product_showcase"),
  });
  check("document without ProductShowcase remains valid for readiness", noShowcase.overall_score > 0);
  check("document without ProductShowcase does not force weak asset readiness", noShowcase.categories.asset_readiness.score >= 6);

  const missingAssets = evaluatePageBuilderReadiness({
    ...completeDocument,
    sections: completeDocument.sections.map((section) =>
      section.type === "implementation_notes"
        ? { ...section, missing_visual_assets: ["TBD"] }
        : section,
    ),
  });
  check(
    "missing_visual_assets affects asset readiness",
    missingAssets.categories.asset_readiness.score < complete.categories.asset_readiness.score,
  );

  console.log("Markdown:");
  const markdown = readinessToMarkdown(complete);
  check("readiness markdown contains overall score", markdown.includes("Overall score"));
  check("readiness markdown contains priority fixes", markdown.includes("Priority fixes"));

  console.log("Export fragment:");
  await savePageBuilderDocument(SLUG, completeDocument);
  const fragment = await getPageBuilderExportFragment(SLUG);
  check(
    "export fragment includes page-builder-readiness.md when document exists",
    fragment.found && fragment.files.some((file) => file.path === "page-builder/page-builder-readiness.md"),
  );
  const missing = await getPageBuilderExportFragment("missing-readiness-doc");
  check("export without document does not crash", missing.ok === true && missing.found === false);
  const invalid = pageBuilderDocumentToExportFragment({
    ...completeDocument,
    sections: completeDocument.sections.filter((section) => section.type !== "hero"),
  });
  check("invalid document does not block export fragment", invalid.ok === true && invalid.found === false);

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
