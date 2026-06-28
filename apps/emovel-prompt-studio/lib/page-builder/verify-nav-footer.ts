// Verification harness for NavigationBar + Footer (execution-order step 3).
// Run: npx tsx lib/page-builder/verify-nav-footer.ts
// No test framework; exits non-zero on any failed check.

import type { PageBuilderDocument } from "./schema";
import { normalizePageBuilderDocument } from "./normalize";
import { validatePageBuilderDocument } from "./validator";
import { canonicalSectionOrder, requiredSectionTypes } from "./sections";
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

function baseDoc(): PageBuilderDocument {
  return {
    page_type: "landing_page",
    title: "Nav + Footer Verify",
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

const validNav = { type: "navigation_bar", logo_label: "EMOVEL", links: [ { label: "Offer", anchor: "offer" }, { label: "Pricing", anchor: "pricing" } ], cta: { label: "Start" } };
const validFooter = { type: "footer", tagline: "Premium AI-native builder.", link_groups: [ { heading: "Product", links: [ { label: "Pricing" }, { label: "FAQ" } ] } ], legal: "© EMOVEL" };

console.log("Nav + Footer — registry:");
check("navigation_bar registered as component 11", pageBuilderRegistry.navigation_bar?.componentNumber === 11 && pageBuilderRegistry.navigation_bar?.implementation === "NavigationBarBlock");
check("footer registered as component 12", pageBuilderRegistry.footer?.componentNumber === 12 && pageBuilderRegistry.footer?.implementation === "FooterBlock");
check("both are optional (not required)", pageBuilderRegistry.navigation_bar?.required === false && pageBuilderRegistry.footer?.required === false);
check("canonicalSectionOrder leads with navigation_bar", canonicalSectionOrder[0] === "navigation_bar");
check("footer sits before implementation_notes", canonicalSectionOrder.indexOf("footer") < canonicalSectionOrder.indexOf("implementation_notes") && canonicalSectionOrder.indexOf("footer") > canonicalSectionOrder.indexOf("final_cta"));

console.log("\nNav + Footer — validation:");
const withChrome = baseDoc();
withChrome.sections = [validNav as PageBuilderDocument["sections"][number], ...withChrome.sections, validFooter as PageBuilderDocument["sections"][number]];
check("document with valid nav + footer passes", validatePageBuilderDocument(withChrome).ok === true);

function navDoc(nav: unknown): PageBuilderDocument {
  const d = baseDoc();
  d.sections = [nav as PageBuilderDocument["sections"][number], ...d.sections];
  return d;
}
const noLogo = validatePageBuilderDocument(navDoc({ type: "navigation_bar", links: [] }));
check("nav without logo_label is rejected", noLogo.ok === false && noLogo.errors.some((e) => e.includes("navigation_bar.logo_label")));
const badLink = validatePageBuilderDocument(navDoc({ type: "navigation_bar", logo_label: "X", links: [ { label: "Only" } ] }));
check("nav link without anchor is rejected", badLink.ok === false && badLink.errors.some((e) => e.includes("anchor")));
const badCta = validatePageBuilderDocument(navDoc({ type: "navigation_bar", logo_label: "X", links: [], cta: {} }));
check("nav cta without label is rejected", badCta.ok === false && badCta.errors.some((e) => e.includes("navigation_bar.cta.label")));

function footerDoc(footer: unknown): PageBuilderDocument {
  const d = baseDoc();
  d.sections = [...d.sections, footer as PageBuilderDocument["sections"][number]];
  return d;
}
const badGroups = validatePageBuilderDocument(footerDoc({ type: "footer", link_groups: "nope" }));
check("footer with non-array link_groups is rejected", badGroups.ok === false && badGroups.errors.some((e) => e.includes("footer.link_groups")));
const badHeading = validatePageBuilderDocument(footerDoc({ type: "footer", link_groups: [ { links: [ { label: "x" } ] } ] }));
check("footer group without heading is rejected", badHeading.ok === false && badHeading.errors.some((e) => e.includes("heading")));

console.log("\nNav + Footer — normalize ordering + shared layer:");
const reversed = baseDoc();
reversed.sections = [validFooter as PageBuilderDocument["sections"][number], ...[...reversed.sections].reverse(), validNav as PageBuilderDocument["sections"][number]];
const norm = normalizePageBuilderDocument(reversed);
check("normalize succeeds with nav + footer", norm.ok === true);
if (norm.ok) {
  const types = norm.document.sections.map((s) => s.type);
  check("nav sorts to first", types[0] === "navigation_bar");
  check("footer sorts after final_cta", types.indexOf("footer") > types.indexOf("final_cta"));
  const nav = norm.document.sections.find((s) => s.type === "navigation_bar");
  check("nav anchorId derived", nav?.shared?.anchorId === "navigation-bar");
  const footer = norm.document.sections.find((s) => s.type === "footer");
  check("footer anchorId derived", footer?.shared?.anchorId === "footer");
}

if (failures > 0) {
  console.error(`\n${failures} check(s) FAILED`);
  process.exit(1);
}
console.log("\nAll nav/footer checks passed.");
