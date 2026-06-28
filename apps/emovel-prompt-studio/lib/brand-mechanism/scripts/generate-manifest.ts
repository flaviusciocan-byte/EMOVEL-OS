// Generates manifest.generated.json from the TypeScript source of truth.
// Run: npx tsx lib/brand-mechanism/scripts/generate-manifest.ts
// Do NOT hand-edit the JSON output — change mechanisms.ts and regenerate.

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildModuleManifest } from "../manifest";

const here = dirname(fileURLToPath(import.meta.url));
const outPath = join(here, "..", "manifest.generated.json");

const manifest = buildModuleManifest();
const banner = {
  _comment: "GENERATED FILE — do not edit. Source: lib/brand-mechanism/mechanisms.ts. Run scripts/generate-manifest.ts to regenerate.",
};

writeFileSync(outPath, JSON.stringify({ ...banner, ...manifest }, null, 2) + "\n", "utf8");
console.log(`Wrote ${outPath}`);
