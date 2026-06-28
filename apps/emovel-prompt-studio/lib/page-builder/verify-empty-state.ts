// Verification harness for the empty-state policy + explicit export gate
// (execution-order step 4). Run: npx tsx lib/page-builder/verify-empty-state.ts
// No test framework; exits non-zero on any failed check.

import type { PageBuilderDocument } from "./schema";
import { MISSING_ASSET_LABEL } from "./empty-state";
import { normalizePageBuilderDocument } from "./normalize";
import { validatePageBuilderDocument } from "./validator";
import { requiredSectionTypes, darkCinematicTheme } from "./sections";
import { assertPageBuilderExportable, pageBuilderDocumentToStaticHtml } from "./static-export";
import { pageBuilderDocumentToStrictExport } from "./export-fragment";

let failures = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    console.log(`  ok   ${name}`);
  } else {
    failures += 1;
    console.error(`  FAIL ${name}${detail ? ` - ${detail}` : ""}`);
  }
}

function requiredSections(): PageBuilderDocument["sections"] {
  return [
    { type: "hero", headline: "Headline", primary_cta: "Start" },
    { type: "problem", title: "P", symptoms: ["a", "b"], cost_of_inaction: "C." },
    { type: "mechanism", title: "M", explanation: "E.", why_it_works: "W.", difference_from_alternatives: ["d"] },
    { type: "offer", title: "O", deliverables: ["a", "b"], format: "Async", timeline: "5 days" },
    { type: "proof", proof_points: ["p"], credibility_signals: ["s"], testimonial_placeholders: ["q"] },
    { type: "pricing", pilot_price: "$1", premium_upgrade: "$2", pricing_rationale: "R.", risk_reversal: "G." },
    { type: "faq", items: [ { question: "Q1?", answer: "A1." }, { question: "Q2?", answer: "A2." }, { question: "Q3?", answer: "A3." } ] },
    { type: "final_cta", headline: "Final", cta: "Go" },
    { type: "implementation_notes", components: ["x"], required_sections: [...requiredSectionTypes], missing_visual_assets: [], acceptance_checks: ["ok"] },
  ];
}

function showcase(src: string): PageBuilderDocument["sections"][number] {
  return {
    type: "product_showcase",
    layout: "fullbleed",
    productName: "EMOVEL OS",
    headline: "The premium builder",
    productAsset: { src },
    productAlt: "Product render",
    ctas: [{ label: "Start", variant: "primary" }],
    features: [],
    theme: darkCinematicTheme,
  } as PageBuilderDocument["sections"][number];
}

function docWith(section?: PageBuilderDocument["sections"][number]): PageBuilderDocument {
  return {
    page_type: "landing_page",
    title: "Empty-state Verify",
    status: "draft",
    sections: section ? [...requiredSections(), section] : requiredSections(),
  };
}

console.log("Empty-state policy:");
check("MISSING_ASSET_LABEL is exactly 'MISSING ASSET'", MISSING_ASSET_LABEL === "MISSING ASSET");

const missingDoc = docWith(showcase(""));
check("doc with empty product asset still validates in draft", validatePageBuilderDocument(missingDoc).ok === true);

const gateMissing = assertPageBuilderExportable(missingDoc);
check("export gate fails when required asset is missing", gateMissing.ok === false);
check(
  "gate error names the missing product asset",
  gateMissing.ok === false && gateMissing.errors.some((e) => e.includes("productAsset.src")),
);

const htmlMissing = pageBuilderDocumentToStaticHtml(missingDoc);
check("static HTML shows MISSING ASSET for missing required asset", htmlMissing.includes(MISSING_ASSET_LABEL));
check("static HTML does NOT invent a fake <img> for the missing asset", !htmlMissing.includes('class="pb-showcase-asset"'));

console.log("\nExplicit export gate:");
const strictMissing = pageBuilderDocumentToStrictExport(missingDoc);
check("strict export FAILS explicitly on missing asset", strictMissing.ok === false);
check("strict export returns explicit errors", strictMissing.ok === false && strictMissing.errors.length > 0);

const okDoc = docWith(showcase("assets/product.png"));
const gateOk = assertPageBuilderExportable(okDoc);
check("export gate passes when asset present", gateOk.ok === true);
const strictOk = pageBuilderDocumentToStrictExport(okDoc);
check("strict export succeeds when asset present", strictOk.ok === true && strictOk.files.length > 0);
const htmlOk = pageBuilderDocumentToStaticHtml(okDoc);
check("static HTML renders real <img> when asset present", htmlOk.includes('class="pb-showcase-asset"') && !htmlOk.includes(MISSING_ASSET_LABEL));

console.log("\nNo required assets:");
const noAssetDoc = docWith();
check("doc without product_showcase is exportable", assertPageBuilderExportable(noAssetDoc).ok === true);
check("strict export succeeds without any required assets", pageBuilderDocumentToStrictExport(noAssetDoc).ok === true);
check("normalize still succeeds for asset-free doc", normalizePageBuilderDocument(noAssetDoc).ok === true);

if (failures > 0) {
  console.error(`\n${failures} check(s) FAILED`);
  process.exit(1);
}
console.log("\nAll empty-state checks passed.");
