// Verification harness for tolerant JSON extraction + schema_version handling.
// Run: npx tsx lib/page-builder/verify-json.ts
// No AI call, no I/O — pure parser + normalizer checks.

import { extractJsonObject } from "./json";
import { normalizePageBuilderDocument } from "./normalize";
import type { PageBuilderDocument } from "./schema";

let failures = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    console.log(`  ok   ${name}`);
  } else {
    failures += 1;
    console.error(`  FAIL ${name}${detail ? ` - ${detail}` : ""}`);
  }
}

// Minimal valid landing page document (no product_showcase needed here).
const validDocument: PageBuilderDocument = {
  page_type: "landing_page",
  title: "EMOVEL Landing Page",
  status: "draft",
  sections: [
    { type: "hero", headline: "Build the page your offer deserves", primary_cta: "Start the pilot" },
    { type: "problem", title: "Your offer is stronger than the page", symptoms: ["Scattered promise", "Early CTA"], cost_of_inaction: "Buyers leave without understanding value." },
    { type: "mechanism", title: "Mechanism-first structure", explanation: "Each section advances one job.", why_it_works: "Promise to proof to price to action.", difference_from_alternatives: ["Validates before UI"] },
    { type: "offer", title: "Core Sprint", deliverables: ["Validated architecture", "Markdown export"], format: "Async sprint", timeline: "5 days" },
    { type: "proof", proof_points: ["Schema gate before publish"], credibility_signals: ["Strict core"], testimonial_placeholders: ["[PLACEHOLDER: quote]"] },
    { type: "pricing", pilot_price: "$1,500", premium_upgrade: "$4,500", pricing_rationale: "Core before UI.", risk_reversal: "No build until valid." },
    { type: "faq", items: [ { question: "UI?", answer: "Core-only." }, { question: "Puck?", answer: "No." }, { question: "Export?", answer: "Yes." } ] },
    { type: "final_cta", headline: "Turn strategy into a validated page", cta: "Validate my page" },
    { type: "implementation_notes", components: ["Exporter"], required_sections: [], missing_visual_assets: [], acceptance_checks: ["All sections validate"] },
  ],
};

console.log("extractJsonObject:");
const clean = extractJsonObject('{"a":1,"b":"x"}');
check("clean JSON object extracts", clean.ok === true && clean.json === '{"a":1,"b":"x"}');

const fencedJson = extractJsonObject('```json\n{"a":1}\n```');
check("fenced ```json extracts", fencedJson.ok === true && fencedJson.json === '{"a":1}');

const fencedBare = extractJsonObject('```\n{"a":1}\n```');
check("fenced ``` extracts", fencedBare.ok === true && fencedBare.json === '{"a":1}');

const surrounded = extractJsonObject('Here is the result:\n{"a":{"b":2}}\nLet me know!');
check("text before/after extracts the object", surrounded.ok === true && surrounded.json === '{"a":{"b":2}}');

const braceInString = extractJsonObject('prefix {"note":"has } brace"} suffix');
check("braces inside strings do not break extraction", braceInString.ok === true && braceInString.json === '{"note":"has } brace"}');

const noObject = extractJsonObject("just some commentary, no json here");
check("no object is refused", noObject.ok === false);

const unbalanced = extractJsonObject('{"a": 1, "b": {');
check("unbalanced braces are refused", unbalanced.ok === false);

console.log("\nnormalize tolerant + schema_version:");
const fencedDoc = "```json\n" + JSON.stringify(validDocument) + "\n```";
const fencedResult = normalizePageBuilderDocument(fencedDoc);
check("normalize accepts fenced JSON", fencedResult.ok === true);

const surroundedDoc = "Sure, here is your page:\n" + JSON.stringify(validDocument) + "\nHope it helps.";
check("normalize accepts JSON with surrounding commentary", normalizePageBuilderDocument(surroundedDoc).ok === true);

const defaulted = normalizePageBuilderDocument(JSON.stringify(validDocument));
check(
  "normalize defaults schema_version to 1.0.0",
  defaulted.ok === true && defaulted.document.schema_version === "1.0.0",
  defaulted.ok ? String(defaulted.document.schema_version) : "invalid",
);

const explicitGood = normalizePageBuilderDocument(JSON.stringify({ ...validDocument, schema_version: "1.0.0" }));
check("normalize accepts explicit schema_version 1.0.0", explicitGood.ok === true);

const badVersion = normalizePageBuilderDocument(JSON.stringify({ ...validDocument, schema_version: "9.9.9" }));
check("validator rejects invalid schema_version", badVersion.ok === false && badVersion.errors.some((e) => e.includes("schema_version")));

const arrayRoot = normalizePageBuilderDocument("[1,2,3]");
check("array root is rejected", arrayRoot.ok === false && arrayRoot.errors.some((e) => /array/i.test(e)));

const garbage = normalizePageBuilderDocument("totally not json");
check("non-JSON text is rejected with a clear error", garbage.ok === false);

if (failures > 0) {
  console.error(`\n${failures} check(s) FAILED`);
  process.exit(1);
}
console.log("\nAll checks passed.");
