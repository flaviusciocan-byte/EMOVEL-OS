// Generates registry.manifest.json from the TypeScript source of truth.
// Run: npx tsx lib/page-builder/scripts/generate-registry-manifest.ts
// Do NOT hand-edit the JSON output — change registry.ts and regenerate.

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { serializePageBuilderRegistryManifest } from "../manifest";

const here = dirname(fileURLToPath(import.meta.url));
const outPath = join(here, "..", "registry.manifest.json");

writeFileSync(outPath, serializePageBuilderRegistryManifest(), "utf8");
console.log(`Wrote ${outPath}`);
