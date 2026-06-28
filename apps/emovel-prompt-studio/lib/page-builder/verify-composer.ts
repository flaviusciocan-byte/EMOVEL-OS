// Verification harness for the Composer (execution-order step 7).
// Run: npx tsx lib/page-builder/verify-composer.ts
// No test framework; exits non-zero on any failed check.

import type { PageBuilderDocument } from "./schema";
import {
  composeFromRawSchema,
  composePageBuilderDocument,
  type PageSchemaProducer,
} from "./composer";
import type { LandingPageBuilderInput } from "./generator";
import { requiredSectionTypes } from "./sections";

let failures = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    console.log(`  ok   ${name}`);
  } else {
    failures += 1;
    console.error(`  FAIL ${name}${detail ? ` - ${detail}` : ""}`);
  }
}

function validDoc(): PageBuilderDocument {
  return {
    page_type: "landing_page",
    title: "Composer Verify",
    status: "draft",
    sections: [
      { type: "hero", headline: "Headline", primary_cta: "Start" },
      { type: "problem", title: "P", symptoms: ["a", "b"], cost_of_inaction: "C." },
      { type: "mechanism", title: "M", explanation: "E.", why_it_works: "W.", difference_from_alternatives: ["d"] },
      { type: "offer", title: "O", deliverables: ["a", "b"], format: "Async", timeline: "5 days" },
      { type: "proof", proof_points: ["p"], credibility_signals: ["s"], testimonial_placeholders: ["q"] },
      { type: "pricing", pilot_price: "$1", premium_upgrade: "$2", pricing_rationale: "R.", risk_reversal: "G." },
      { type: "faq", items: [ { question: "Q1?", answer: "A1." }, { question: "Q2?", answer: "A2." }, { question: "Q3?", answer: "A3." } ] },
      { type: "final_cta", headline: "Final", cta: "Go" },
      { type: "implementation_notes", components: ["x"], required_sections: [...requiredSectionTypes], missing_visual_assets: [], acceptance_checks: ["ok"] },
    ],
  };
}

const input: LandingPageBuilderInput = {
  slug: "emovel",
  project: { title: "Composer Verify", prompt: "A premium landing page." },
};

async function main() {
  console.log("Composer — validation gate (composeFromRawSchema):");
  const gateOk = composeFromRawSchema(JSON.stringify(validDoc()));
  check("valid raw schema string passes the gate", gateOk.ok === true && gateOk.stage === "rendered");
  check("gate returns a render-ready document", gateOk.ok === true && gateOk.document.sections.length >= 9);
  check(
    "gate fills the Shared Layer (anchorId) before render",
    gateOk.ok === true && gateOk.document.sections.every((s) => typeof s.shared?.anchorId === "string"),
  );

  const gateObj = composeFromRawSchema(validDoc());
  check("valid raw schema object passes the gate", gateObj.ok === true && gateObj.stage === "rendered");

  const gateBad = composeFromRawSchema({ page_type: "landing_page", title: "x", status: "draft", sections: [] });
  check("incomplete schema is rejected at validation stage", gateBad.ok === false && gateBad.stage === "validation" && gateBad.errors.length > 0);

  const gateJsx = composeFromRawSchema("<div>not a schema</div>");
  check("JSX/markup is rejected by the gate (never rendered)", gateJsx.ok === false && gateJsx.stage === "validation");

  console.log("\nComposer — full pipeline (composePageBuilderDocument):");

  const goodProducer: PageSchemaProducer = () => JSON.stringify(validDoc());
  const composed = await composePageBuilderDocument(input, goodProducer);
  check("full compose with valid producer reaches rendered stage", composed.ok === true && composed.stage === "rendered");
  check("compose returns the brand-aware prompt used", composed.ok === true && composed.prompt !== undefined);
  check("compose document is render-ready (has hero + final_cta)", composed.ok === true && composed.document.sections.some((s) => s.type === "hero") && composed.document.sections.some((s) => s.type === "final_cta"));

  const objProducer: PageSchemaProducer = () => validDoc();
  const composedObj = await composePageBuilderDocument(input, objProducer);
  check("producer may return an object schema", composedObj.ok === true && composedObj.stage === "rendered");

  const throwingProducer: PageSchemaProducer = () => {
    throw new Error("model unavailable");
  };
  const composedThrow = await composePageBuilderDocument(input, throwingProducer);
  check("producer failure is reported at the schema stage", composedThrow.ok === false && composedThrow.stage === "schema");
  check("schema-stage failure carries the prompt + error", composedThrow.ok === false && composedThrow.prompt !== undefined && composedThrow.errors.some((e) => e.includes("model unavailable")));

  const invalidProducer: PageSchemaProducer = () => JSON.stringify({ page_type: "landing_page", title: "x", status: "draft", sections: [] });
  const composedInvalid = await composePageBuilderDocument(input, invalidProducer);
  check("invalid AI schema fails at validation stage (gate before render)", composedInvalid.ok === false && composedInvalid.stage === "validation");

  const jsxProducer: PageSchemaProducer = () => "export default () => <div/>;";
  const composedJsx = await composePageBuilderDocument(input, jsxProducer);
  check("AI returning JSX never renders (validation stage failure)", composedJsx.ok === false && composedJsx.stage === "validation");

  if (failures > 0) {
    console.error(`\n${failures} check(s) FAILED`);
    process.exit(1);
  }
  console.log("\nAll composer checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
