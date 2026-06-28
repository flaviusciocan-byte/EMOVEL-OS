// Verification harness for the Page Builder store + AI-output normalization.
// Run: npx tsx lib/page-builder/verify-store.ts
// Uses a temporary slug under projects/page-builder/ and cleans up at the end.
// No AI call: we feed representative raw JSON in place of model output.

import path from "path";
import { pageBuilderDocumentToMarkdown } from "./export";
import { buildLandingPageBuilderPrompt } from "./generator";
import { normalizePageBuilderDocument } from "./normalize";
import type { PageBuilderDocument } from "./schema";
import {
  clearPageBuilderDocument,
  getPageBuilderDocument,
  hasPageBuilderDocument,
  pageBuilderPath,
  saveValidatedPageBuilderDocument,
} from "./store";

let failures = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    console.log(`  ok   ${name}`);
  } else {
    failures += 1;
    console.error(`  FAIL ${name}${detail ? ` - ${detail}` : ""}`);
  }
}

const SLUG = "verify-page-builder-store-tmp";

// A complete, valid landing page document INCLUDING an optional product_showcase.
const validDocument: PageBuilderDocument = {
  page_type: "landing_page",
  title: "EMOVEL Landing Page",
  status: "draft",
  sections: [
    { type: "hero", headline: "Build the page your offer deserves", primary_cta: "Start the pilot" },
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
      credibility_signals: ["Brand OS aware"],
      testimonial_placeholders: ["[PLACEHOLDER: founder result quote]"],
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
        { question: "Does this use Puck?", answer: "No, Puck is outside this phase." },
        { question: "Can it export?", answer: "Yes, it exports structured markdown." },
      ],
    },
    { type: "final_cta", headline: "Turn the strategy into a validated page", cta: "Validate my landing page" },
    {
      type: "implementation_notes",
      components: ["PageBuilderDocument", "Markdown exporter"],
      required_sections: [],
      missing_visual_assets: ["product render"],
      acceptance_checks: ["All required sections validate"],
    },
    {
      type: "product_showcase",
      layout: "split",
      productName: "EMOVEL Console",
      headline: "The control surface for premium launches",
      productAsset: { src: "/placeholder/console.png", type: "render" },
      productAlt: "EMOVEL console product render",
      ctas: [{ label: "Start the pilot", variant: "primary" }],
      features: [
        { label: "Latency", value: "8", unit: "ms" },
        { label: "Uptime", value: "99.99", unit: "%" },
      ],
      theme: {
        background: "#050707",
        foreground: "#F4F4EF",
        muted: "#9BA6A6",
        accent: "#19D3C5",
        card: "rgba(255,255,255,0.06)",
        border: "rgba(255,255,255,0.14)",
        overlayGradient: "linear-gradient(90deg, rgba(5,7,7,0.92), rgba(5,7,7,0.48), rgba(5,7,7,0))",
        typography: { headline: "Clash Display", productName: "Satoshi", body: "Satoshi", technical: "JetBrains Mono" },
      },
    },
  ],
};

async function main() {
  await clearPageBuilderDocument(SLUG);

  console.log("Normalize / validate AI output:");
  // Simulates raw AI text (a JSON string).
  const validRaw = JSON.stringify(validDocument);
  const normalizedValid = normalizePageBuilderDocument(validRaw);
  check("valid generated JSON normalizes + validates", normalizedValid.ok === true);

  const invalidRaw = JSON.stringify({
    ...validDocument,
    sections: validDocument.sections.filter((section) => section.type !== "hero"),
  });
  const normalizedInvalid = normalizePageBuilderDocument(invalidRaw);
  check(
    "invalid JSON produces a clear error",
    normalizedInvalid.ok === false && normalizedInvalid.errors.some((e) => e.includes("hero")),
  );

  const notJson = normalizePageBuilderDocument("this is not json { ");
  check("non-JSON AI text produces a clear error", notJson.ok === false && notJson.errors.some((e) => /JSON/i.test(e)));

  console.log("Storage path:");
  const storedPath = pageBuilderPath(SLUG);
  check(
    "storage path is projects/page-builder/<slug>.json",
    storedPath.includes(`page-builder${path.sep}${SLUG}.json`),
    storedPath,
  );
  let slugRejected = false;
  try {
    pageBuilderPath("Bad Slug!!");
  } catch {
    slugRejected = true;
  }
  check("invalid slug is rejected", slugRejected === true);

  console.log("Save / read:");
  const saved = await saveValidatedPageBuilderDocument(SLUG, validRaw);
  check("valid document saves", saved.ok === true);
  check("save reports persisted", await hasPageBuilderDocument(SLUG));
  const readBack = await getPageBuilderDocument(SLUG);
  check("document readable after save", readBack !== null && readBack.title === "EMOVEL Landing Page");

  const invalidSave = await saveValidatedPageBuilderDocument(SLUG, invalidRaw);
  check("invalid document is NOT saved (returns errors)", invalidSave.ok === false);
  // The previous valid document must still be intact (invalid never overwrote it).
  const stillValid = await getPageBuilderDocument(SLUG);
  check("invalid save did not overwrite the valid document", stillValid !== null && stillValid.sections.some((s) => s.type === "hero"));

  console.log("Markdown export:");
  const markdown = saved.ok ? saved.markdown : pageBuilderDocumentToMarkdown(validDocument);
  for (const token of ["Hero", "Offer", "Pricing", "FAQ", "Product Showcase"]) {
    check(`markdown export contains ${token}`, markdown.includes(token));
  }

  console.log("Brand OS fallback does not block prompt builder:");
  const prompt = await buildLandingPageBuilderPrompt({
    slug: "verify-store-no-profile-xyz",
    project: { title: "Fallback Safe", prompt: "x" },
  });
  check("prompt builder returns 2 messages without a profile", prompt.messages.length === 2);
  check("prompt builder is fallback-safe", prompt.fallback === true && prompt.hasBrandContext === false);

  console.log("Cleanup:");
  const cleared = await clearPageBuilderDocument(SLUG);
  check("clear returns true", cleared === true);
  check("document gone after clear", (await getPageBuilderDocument(SLUG)) === null);

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
