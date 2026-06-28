// Verification harness for the generated registry manifest (execution-order step 5).
// Run: npx tsx lib/page-builder/verify-manifest.ts
// Fails if registry.manifest.json drifts from the TypeScript source of truth —
// enforcing that the JSON is generated, never hand-edited.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildPageBuilderRegistryManifest,
  serializePageBuilderRegistryManifest,
} from "./manifest";
import { listRegistryComponents } from "./registry";

let failures = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    console.log(`  ok   ${name}`);
  } else {
    failures += 1;
    console.error(`  FAIL ${name}${detail ? ` - ${detail}` : ""}`);
  }
}

const here = dirname(fileURLToPath(import.meta.url));
const manifestPath = join(here, "registry.manifest.json");

console.log("Registry manifest:");

let onDisk = "";
let readOk = true;
try {
  onDisk = readFileSync(manifestPath, "utf8");
} catch {
  readOk = false;
}
check("registry.manifest.json exists", readOk);

const expected = serializePageBuilderRegistryManifest();
check(
  "committed manifest is in sync with TypeScript (no drift)",
  onDisk === expected,
  "run: npx tsx lib/page-builder/scripts/generate-registry-manifest.ts",
);

// The committed JSON must be valid and structurally faithful to the TS registry.
let parsed: ReturnType<typeof buildPageBuilderRegistryManifest> | null = null;
try {
  parsed = JSON.parse(onDisk) as ReturnType<typeof buildPageBuilderRegistryManifest>;
} catch {
  parsed = null;
}
check("manifest JSON parses", parsed !== null);

if (parsed) {
  check("manifest is flagged generated", parsed.generated === true);
  check("manifest declares its TS source", parsed.generated_from === "lib/page-builder/registry.ts");
  check("registry_version is 1.1", parsed.registry_version === "1.1");
  check("component_count matches TS registry", parsed.component_count === listRegistryComponents().length);
  check(
    "component ids/order match TS registry",
    parsed.components.map((c) => c.registryId).join(",") ===
      listRegistryComponents().map((e) => e.registryId).join(","),
  );
  check("shared_layer lists the six inherited props", parsed.shared_layer.length === 6 && parsed.shared_layer.includes("aiLock"));
}

if (failures > 0) {
  console.error(`\n${failures} check(s) FAILED`);
  process.exit(1);
}
console.log("\nAll manifest checks passed.");
