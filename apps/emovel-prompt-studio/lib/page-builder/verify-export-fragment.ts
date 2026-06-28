// Verification harness for optional Page Builder builder-pack export fragments.
// Run: npx tsx lib/page-builder/verify-export-fragment.ts

import type { PageBuilderDocument } from "./schema";
import {
  clearPageBuilderDocument,
  getPageBuilderExportFragment,
  pageBuilderDocumentToExportFragment,
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

const SLUG = "verify-page-builder-export-fragment-tmp";

const validDocument: PageBuilderDocument = {
  page_type: "landing_page",
  title: "Export Fragment Landing Page",
  status: "validated",
  sections: [
    { type: "hero", headline: "A validated landing page", primary_cta: "Export it" },
    {
      type: "problem",
      title: "Builder packs miss landing context",
      symptoms: ["No page schema", "No landing markdown"],
      cost_of_inaction: "Builders reconstruct the page from scattered notes.",
    },
    {
      type: "mechanism",
      title: "Optional export fragment",
      explanation: "Saved PageBuilderDocument data is attached only when available.",
      why_it_works: "The builder pack stays useful without making Page Builder mandatory.",
      difference_from_alternatives: ["It does not import server-only store code into the client"],
    },
    {
      type: "offer",
      title: "Page Builder Export Integration",
      deliverables: ["PageBuilderDocument JSON", "Landing page markdown"],
      format: "Builder pack ZIP fragment",
      timeline: "Phase 6",
    },
    {
      type: "proof",
      proof_points: ["Fragment generation validates the document before export"],
      credibility_signals: ["No new dependencies"],
      testimonial_placeholders: ["Builder handoff quote"],
    },
    {
      type: "pricing",
      pilot_price: "$0 internal phase",
      premium_upgrade: "Future export renderer",
      pricing_rationale: "Core handoff before visual export.",
      risk_reversal: "Missing Page Builder documents do not block export.",
    },
    {
      type: "faq",
      items: [
        { question: "Does this block export?", answer: "No." },
        { question: "Does this create a PDF?", answer: "No." },
        { question: "Does this use Puck?", answer: "No." },
      ],
    },
    { type: "final_cta", headline: "Ship the builder pack with landing context", cta: "Export builder pack" },
    {
      type: "implementation_notes",
      components: ["PageBuilderPreview", "SectionRenderer", "ProductShowcaseCard"],
      required_sections: ["hero", "offer", "pricing", "faq"],
      missing_visual_assets: ["final product render"],
      acceptance_checks: ["JSON included", "Markdown included", "Implementation notes included"],
    },
  ],
};

async function main() {
  await clearPageBuilderDocument(SLUG);

  console.log("Missing document:");
  const missing = await getPageBuilderExportFragment(SLUG);
  check("export without PageBuilderDocument does not crash", missing.ok === true && missing.found === false);
  check("export without PageBuilderDocument includes no empty files", missing.files.length === 0);

  console.log("Direct fragment:");
  const direct = pageBuilderDocumentToExportFragment(validDocument);
  check("valid document creates export fragment", direct.found === true);
  check(
    "fragment includes JSON",
    direct.found && direct.files.some((file) => file.path === "page-builder/page-builder-document.json"),
  );
  check(
    "fragment includes markdown",
    direct.found && direct.files.some((file) => file.path === "page-builder/landing-page-markdown.md"),
  );
  check(
    "fragment includes implementation notes",
    direct.found && direct.files.some((file) => file.path === "page-builder/landing-page-implementation-notes.md"),
  );
  check(
    "fragment includes readiness review",
    direct.found && direct.files.some((file) => file.path === "page-builder/page-builder-readiness.md"),
  );

  console.log("Stored fragment:");
  await savePageBuilderDocument(SLUG, validDocument);
  const stored = await getPageBuilderExportFragment(SLUG);
  check("stored document creates export fragment", stored.found === true);
  check(
    "stored fragment includes JSON content",
    stored.found && stored.files.some((file) => file.content.includes("Export Fragment Landing Page")),
  );
  check(
    "stored fragment includes implementation notes content",
    stored.found && stored.files.some((file) => file.content.includes("Acceptance checks")),
  );
  check(
    "stored fragment includes readiness content",
    stored.found && stored.files.some((file) => file.content.includes("Overall score")),
  );

  console.log("Invalid document:");
  const invalid = pageBuilderDocumentToExportFragment({
    ...validDocument,
    sections: validDocument.sections.filter((section) => section.type !== "pricing"),
  });
  check("invalid document does not block export fragment", invalid.ok === true && invalid.found === false);

  console.log("Cleanup:");
  await clearPageBuilderDocument(SLUG);
  check("missing after cleanup stays non-blocking", (await getPageBuilderExportFragment(SLUG)).found === false);

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
