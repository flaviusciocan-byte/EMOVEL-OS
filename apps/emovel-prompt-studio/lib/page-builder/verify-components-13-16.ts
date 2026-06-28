// Verification harness for components 13–16 (execution-order step 6).
// Run: npx tsx lib/page-builder/verify-components-13-16.ts
// No test framework; exits non-zero on any failed check.

import type { PageBuilderDocument } from "./schema";
import { normalizePageBuilderDocument } from "./normalize";
import { validatePageBuilderDocument } from "./validator";
import { requiredSectionTypes } from "./sections";
import { pageBuilderRegistry } from "./registry";

let failures = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    console.log(`  ok   ${name}`);
  } else {
    failures += 1;
    console.error(`  FAIL ${name}${detail ? ` - ${detail}` : ""}`);
  }
}

function baseDoc(extra: PageBuilderDocument["sections"]): PageBuilderDocument {
  return {
    page_type: "landing_page",
    title: "Components 13–16 Verify",
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
      ...extra,
    ],
  };
}

const testimonials = { type: "testimonials", title: "Voices", items: [ { quote: "It worked.", author: "Ana", role: "Founder" } ] };
const logoStrip = { type: "logo_strip", title: "Trusted by", logos: [ { name: "Acme" }, { name: "Globex" } ] };
const statsBar = { type: "stats_bar", stats: [ { value: "3x", label: "faster" }, { value: "99%", label: "uptime" } ] };
const featureSplit = { type: "feature_split", title: "Capabilities", features: [ { title: "Fast" }, { title: "Safe" } ] };

console.log("Components 13–16 — registry:");
check("testimonials = 13 -> TestimonialsBlock", pageBuilderRegistry.testimonials?.componentNumber === 13 && pageBuilderRegistry.testimonials?.implementation === "TestimonialsBlock");
check("logo_strip = 14 -> LogoStripBlock", pageBuilderRegistry.logo_strip?.componentNumber === 14 && pageBuilderRegistry.logo_strip?.implementation === "LogoStripBlock");
check("stats_bar = 15 -> StatsBarBlock", pageBuilderRegistry.stats_bar?.componentNumber === 15 && pageBuilderRegistry.stats_bar?.implementation === "StatsBarBlock");
check("feature_split = 16 -> FeatureSplitBlock", pageBuilderRegistry.feature_split?.componentNumber === 16 && pageBuilderRegistry.feature_split?.implementation === "FeatureSplitBlock");
check("all four are optional", [pageBuilderRegistry.testimonials, pageBuilderRegistry.logo_strip, pageBuilderRegistry.stats_bar, pageBuilderRegistry.feature_split].every((e) => e?.required === false));

console.log("\nComponents 13–16 — validation:");
check(
  "document with all four valid sections passes",
  validatePageBuilderDocument(baseDoc([
    testimonials as PageBuilderDocument["sections"][number],
    logoStrip as PageBuilderDocument["sections"][number],
    statsBar as PageBuilderDocument["sections"][number],
    featureSplit as PageBuilderDocument["sections"][number],
  ])).ok === true,
);

function only(section: unknown) {
  return validatePageBuilderDocument(baseDoc([section as PageBuilderDocument["sections"][number]]));
}
const tNoItems = only({ type: "testimonials", items: [] });
check("testimonials with no items is rejected", tNoItems.ok === false && tNoItems.errors.some((e) => e.includes("testimonials.items")));
const tBadItem = only({ type: "testimonials", items: [ { quote: "x" } ] });
check("testimonial without author is rejected", tBadItem.ok === false && tBadItem.errors.some((e) => e.includes("author")));
const lNoLogos = only({ type: "logo_strip", logos: [] });
check("logo_strip with no logos is rejected", lNoLogos.ok === false && lNoLogos.errors.some((e) => e.includes("logo_strip.logos")));
const sNoStats = only({ type: "stats_bar", stats: [ { value: "3x" } ] });
check("stat without label is rejected", sNoStats.ok === false && sNoStats.errors.some((e) => e.includes("label")));
const fOneFeature = only({ type: "feature_split", title: "T", features: [ { title: "only" } ] });
check("feature_split with <2 features is rejected", fOneFeature.ok === false && fOneFeature.errors.some((e) => e.includes("feature_split.features")));
const fNoTitle = only({ type: "feature_split", features: [ { title: "a" }, { title: "b" } ] });
check("feature_split without title is rejected", fNoTitle.ok === false && fNoTitle.errors.some((e) => e.includes("feature_split.title")));

console.log("\nComponents 13–16 — normalize ordering + anchorId:");
const norm = normalizePageBuilderDocument(baseDoc([
  featureSplit as PageBuilderDocument["sections"][number],
  statsBar as PageBuilderDocument["sections"][number],
  logoStrip as PageBuilderDocument["sections"][number],
  testimonials as PageBuilderDocument["sections"][number],
]));
check("normalize succeeds", norm.ok === true);
if (norm.ok) {
  const types = norm.document.sections.map((s) => s.type);
  check("logo_strip sorts right after hero", types.indexOf("logo_strip") === types.indexOf("hero") + 1);
  check("feature_split sorts between mechanism and offer", types.indexOf("feature_split") > types.indexOf("mechanism") && types.indexOf("feature_split") < types.indexOf("offer"));
  check("stats_bar + testimonials sort after proof, before pricing", types.indexOf("stats_bar") > types.indexOf("proof") && types.indexOf("testimonials") < types.indexOf("pricing"));
  const fs = norm.document.sections.find((s) => s.type === "feature_split");
  check("feature_split anchorId derived", fs?.shared?.anchorId === "feature-split");
}

if (failures > 0) {
  console.error(`\n${failures} check(s) FAILED`);
  process.exit(1);
}
console.log("\nAll components 13–16 checks passed.");
