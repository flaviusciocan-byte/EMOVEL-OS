// Verification harness for the image asset pipeline (asset-store.ts).
// Run: npx tsx lib/page-builder/verify-asset-store.ts
// Uses a throwaway slug + temp dir; cleans up after itself. Exits non-zero on fail.

import { rm } from "fs/promises";
import type { PageBuilderDocument } from "./schema";
import { darkCinematicTheme, requiredSectionTypes } from "./sections";
import {
  collectAssetReferences,
  collectMissingLocalAssets,
  hasPageBuilderAsset,
  isExternalAssetSrc,
  isSupportedImageFilename,
  listPageBuilderAssets,
  pageBuilderAssetsRoot,
  readPageBuilderAsset,
  safeAssetFilename,
  savePageBuilderAsset,
} from "./asset-store";

let failures = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    console.log(`  ok   ${name}`);
  } else {
    failures += 1;
    console.error(`  FAIL ${name}${detail ? ` - ${detail}` : ""}`);
  }
}

const SLUG = "verify-asset-store-temp";

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

function doc(src: string): PageBuilderDocument {
  return {
    page_type: "landing_page",
    title: "Asset Verify",
    status: "draft",
    sections: [
      { type: "hero", headline: "H", primary_cta: "Go" },
      { type: "problem", title: "P", symptoms: ["a", "b"], cost_of_inaction: "c" },
      { type: "mechanism", title: "M", explanation: "e", why_it_works: "w", difference_from_alternatives: ["d"] },
      { type: "offer", title: "O", deliverables: ["a", "b"], format: "f", timeline: "t" },
      { type: "proof", proof_points: ["p"], credibility_signals: ["s"], testimonial_placeholders: ["q"] },
      { type: "pricing", pilot_price: "$1", premium_upgrade: "$2", pricing_rationale: "r", risk_reversal: "g" },
      { type: "faq", items: [ { question: "q1", answer: "a1" }, { question: "q2", answer: "a2" }, { question: "q3", answer: "a3" } ] },
      { type: "final_cta", headline: "F", cta: "Go" },
      { type: "implementation_notes", components: ["x"], required_sections: [...requiredSectionTypes], missing_visual_assets: [], acceptance_checks: ["ok"] },
      showcase(src),
    ],
  };
}

async function main() {
  console.log("Asset store — helpers:");
  check("supported image extensions accepted", isSupportedImageFilename("render.png") && isSupportedImageFilename("a.WEBP"));
  check("non-image rejected", !isSupportedImageFilename("notes.txt") && !isSupportedImageFilename("doc.pdf"));
  check("filename sanitized + flattened", safeAssetFilename("../../Hero Render!.PNG") === "hero-render.png");
  check("external src detected", isExternalAssetSrc("https://x.com/a.png") && isExternalAssetSrc("data:image/png;base64,xx"));
  check("local src detected", !isExternalAssetSrc("assets/a.png"));

  console.log("\nAsset store — fs round-trip:");
  const saved = await savePageBuilderAsset(SLUG, "Hero Render.png", Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  check("save returns canonical assets/ src", saved.src.startsWith("assets/") && saved.src.endsWith(".png"));
  check("save returns a serve url", saved.url.includes("/api/page-builder/assets") && saved.url.includes(SLUG));
  check("saved asset is listed", (await listPageBuilderAssets(SLUG)).includes(saved.src));
  check("hasPageBuilderAsset true for saved src", await hasPageBuilderAsset(SLUG, saved.src));
  check("hasPageBuilderAsset false for unknown src", !(await hasPageBuilderAsset(SLUG, "assets/nope.png")));
  const read = await readPageBuilderAsset(SLUG, saved.src);
  check("read returns bytes + content type", read !== null && read.bytes.length === 4 && read.contentType === "image/png");

  console.log("\nAsset store — reference resolution:");
  const refs = collectAssetReferences(doc(saved.src));
  check("collectAssetReferences finds the productAsset", refs.some((r) => r.src === saved.src));
  const missingPresent = await collectMissingLocalAssets(SLUG, doc(saved.src));
  check("present local asset is NOT missing", missingPresent.length === 0);
  const missingAbsent = await collectMissingLocalAssets(SLUG, doc("assets/ghost.png"));
  check("absent local asset IS reported missing", missingAbsent.length === 1 && missingAbsent[0].src === "assets/ghost.png");
  const externalDoc = await collectMissingLocalAssets(SLUG, doc("https://cdn.example.com/p.png"));
  check("external src is never reported missing", externalDoc.length === 0);

  // cleanup
  await rm(pageBuilderAssetsRoot(SLUG), { recursive: true, force: true });
  check("temp asset dir cleaned up", (await listPageBuilderAssets(SLUG)).length === 0);

  if (failures > 0) {
    console.error(`\n${failures} check(s) FAILED`);
    process.exit(1);
  }
  console.log("\nAll asset-store checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
