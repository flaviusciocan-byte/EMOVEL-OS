// Verification harness for the deterministic static HTML/CSS export.
// Run: npx tsx lib/page-builder/verify-static-export.ts

import type { PageBuilderDocument } from "./schema";
import {
  pageBuilderDocumentToAssetManifest,
  pageBuilderDocumentToStaticCss,
  pageBuilderDocumentToStaticExport,
  pageBuilderDocumentToStaticHtml,
} from "./static-export";
import { pageBuilderDocumentToExportFragment } from "./export-fragment";

let failures = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    console.log(`  ok   ${name}`);
  } else {
    failures += 1;
    console.error(`  FAIL ${name}${detail ? ` - ${detail}` : ""}`);
  }
}

function baseSections(): PageBuilderDocument["sections"] {
  return [
    { type: "hero", headline: "Build the page your offer deserves", primary_cta: "Start the pilot", proof_line: "Built on EMOVEL OS." },
    { type: "problem", title: "Your offer is stronger than the page", symptoms: ["Scattered promise", "Early CTA"], cost_of_inaction: "Buyers leave without understanding value." },
    { type: "mechanism", title: "Mechanism-first structure", explanation: "Each section advances one job.", why_it_works: "Promise to proof to price.", difference_from_alternatives: ["Validates before UI"] },
    { type: "offer", title: "Landing Page Core Sprint", deliverables: ["Validated architecture", "Markdown export"], format: "Async sprint", timeline: "5 days" },
    { type: "proof", proof_points: ["Schema gate before publish"], credibility_signals: ["Strict core"], testimonial_placeholders: ["[PLACEHOLDER: quote]"] },
    { type: "pricing", pilot_price: "$1,500", premium_upgrade: "$4,500", pricing_rationale: "Core before UI.", risk_reversal: "No build until valid." },
    { type: "faq", items: [ { question: "UI?", answer: "Core-only." }, { question: "Puck?", answer: "No." }, { question: "Export?", answer: "Yes." } ] },
    { type: "final_cta", headline: "Turn strategy into a validated page", cta: "Validate my page", microcopy: "Core first." },
    { type: "implementation_notes", components: ["Exporter"], required_sections: [], missing_visual_assets: [], acceptance_checks: ["All sections validate"] },
  ];
}

const showcase: PageBuilderDocument["sections"][number] = {
  type: "product_showcase",
  layout: "split",
  productName: "EMOVEL Console",
  headline: "The control surface for premium launches",
  productAsset: { src: "assets/console.png", type: "render" },
  productAlt: "EMOVEL console render",
  ctas: [{ label: "Start the pilot", variant: "primary" }],
  features: [
    { label: "Latency", value: "8", unit: "ms", image: { src: "assets/latency.png", type: "screenshot" } },
    { label: "Uptime", value: "99.99", unit: "%" },
  ],
  theme: {
    background: "#050707",
    foreground: "#F4F4EF",
    muted: "#9BA6A6",
    accent: "#19D3C5",
    card: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.14)",
    overlayGradient: "linear-gradient(90deg, rgba(5,7,7,0.92), rgba(5,7,7,0))",
    typography: { headline: "Clash Display", body: "Satoshi" },
  },
};

const docWithShowcase: PageBuilderDocument = {
  page_type: "landing_page",
  title: "EMOVEL Landing Page",
  status: "validated",
  sections: [...baseSections(), showcase],
};

const docNoShowcase: PageBuilderDocument = {
  page_type: "landing_page",
  title: "EMOVEL Landing Page",
  status: "draft",
  sections: baseSections(),
};

console.log("Static HTML:");
const html = pageBuilderDocumentToStaticHtml(docWithShowcase);
check("html contains <!doctype html>", /<!doctype html>/i.test(html));
check("html links landing-page.css", html.includes('href="landing-page.css"'));
check("html includes Hero headline", html.includes("Build the page your offer deserves"));
check("html includes Offer", html.includes("Landing Page Core Sprint"));
check("html includes Pricing", html.includes("$1,500"));
check("html includes FAQ", html.includes("FAQ"));
check("html includes ProductShowcase", html.includes("The control surface for premium launches"));
check("implementation_notes is NOT rendered in HTML", !html.includes("Exporter") && !html.includes("acceptance"));
check("html has no <script> tags", !/<script/i.test(html));
check("html escapes nothing dangerous (no raw angle injection markers)", !html.includes("<svg onload"));

console.log("\nStatic CSS:");
const css = pageBuilderDocumentToStaticCss(docWithShowcase);
check("css has section rule", css.includes(".pb-section"));
check("css has card rule", css.includes(".pb-card"));
check("css has button rule", css.includes(".pb-button"));
check("css has a responsive media query", css.includes("@media"));

console.log("\nAsset manifest:");
const manifest = pageBuilderDocumentToAssetManifest(docWithShowcase);
check("manifest includes product_showcase asset in required", manifest.required.some((a) => a.path === "assets/console.png" && a.section === "product_showcase"));
check("manifest includes optional feature image", manifest.optional.some((a) => a.path === "assets/latency.png"));

const missingShowcase: PageBuilderDocument = {
  ...docWithShowcase,
  sections: docWithShowcase.sections.map((section) =>
    section.type === "product_showcase" ? { ...section, productAsset: { src: "" } } : section,
  ),
};
const missingManifest = pageBuilderDocumentToAssetManifest(missingShowcase);
check("manifest reports missing product asset when src is empty", missingManifest.missing.some((m) => m.field === "productAsset.src"));
check("document without product asset src still produces HTML (placeholder)", pageBuilderDocumentToStaticHtml(missingShowcase).includes("Product asset required"));

console.log("\nUnified export + fragment integration:");
const staticExport = pageBuilderDocumentToStaticExport(docWithShowcase);
check("unified export returns html/css/assetManifest", typeof staticExport.html === "string" && typeof staticExport.css === "string" && Array.isArray(staticExport.assetManifest.required));

const fragment = pageBuilderDocumentToExportFragment(docWithShowcase);
check("export fragment found", fragment.found === true);
for (const path of [
  "page-builder/static/landing-page.html",
  "page-builder/static/landing-page.css",
  "page-builder/static/asset-manifest.json",
]) {
  check(`export fragment includes ${path}`, fragment.found && fragment.files.some((file) => file.path === path));
}
for (const path of [
  "page-builder/page-builder-document.json",
  "page-builder/landing-page-markdown.md",
  "page-builder/landing-page-implementation-notes.md",
  "page-builder/page-builder-summary.md",
  "page-builder/page-builder-readiness.md",
]) {
  check(`export fragment still includes existing ${path}`, fragment.found && fragment.files.some((file) => file.path === path));
}

const noShowcaseExport = pageBuilderDocumentToStaticExport(docNoShowcase);
check("export without ProductShowcase does not crash and has empty required assets", Array.isArray(noShowcaseExport.assetManifest.required) && noShowcaseExport.assetManifest.required.length === 0);

if (failures > 0) {
  console.error(`\n${failures} check(s) FAILED`);
  process.exit(1);
}
console.log("\nAll checks passed.");
