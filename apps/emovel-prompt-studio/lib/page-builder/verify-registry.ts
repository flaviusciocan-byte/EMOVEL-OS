// Verification harness for Component Registry v1.1 mapping (execution-order step 2).
// Run: npx tsx lib/page-builder/verify-registry.ts
// No test framework; exits non-zero on any failed check.

import {
  getImplementationBindings,
  listRegistryComponents,
  pageBuilderRegistry,
} from "./registry";
import { isKnownSectionType } from "./sections";
import type { PageBuilderSectionType } from "./schema";

let failures = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    console.log(`  ok   ${name}`);
  } else {
    failures += 1;
    console.error(`  FAIL ${name}${detail ? ` - ${detail}` : ""}`);
  }
}

const entries = listRegistryComponents();

console.log("Registry v1.1 — catalog:");
check("registry has 16 components (01–16)", entries.length === 16);
check(
  "componentNumber is 1..16 contiguous",
  entries.map((e) => e.componentNumber).join(",") === "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16",
);
check("every entry id is a known section type", entries.every((e) => isKnownSectionType(e.id)));
check(
  "every registry key matches its entry id",
  (Object.keys(pageBuilderRegistry) as PageBuilderSectionType[]).every((k) => pageBuilderRegistry[k].id === k),
);

console.log("\nRegistry v1.1 — ids:");
const ids = entries.map((e) => e.registryId);
check("registryId values are unique", new Set(ids).size === ids.length);
check(
  "registryId follows emovel.<kind>.<slug> convention",
  entries.every((e) => /^emovel\.(section|meta)\.[a-z0-9-]+$/.test(e.registryId)),
);
check(
  "section kind uses emovel.section.*, meta kind uses emovel.meta.*",
  entries.every((e) => e.registryId.startsWith(e.kind === "meta" ? "emovel.meta." : "emovel.section.")),
);

console.log("\nRegistry v1.1 — status + implementation binding:");
check("every status is implemented or notImplemented", entries.every((e) => e.status === "implemented" || e.status === "notImplemented"));
check("all 10 components are implemented", entries.every((e) => e.status === "implemented"));
check(
  "rendered sections bind to a non-empty implementation",
  entries.filter((e) => e.kind === "section").every((e) => typeof e.implementation === "string" && e.implementation.length > 0),
);
check(
  "rendered sections own SectionSurface",
  entries.filter((e) => e.kind === "section").every((e) => e.surfaceOwner === "SectionSurface"),
);
check(
  "meta entries are not rendered (no implementation, surface none)",
  entries.filter((e) => e.kind === "meta").every((e) => e.implementation === null && e.surfaceOwner === "none"),
);

const bindings = getImplementationBindings();
check("implementation_notes is meta and excluded from render bindings", bindings.implementation_notes === undefined && pageBuilderRegistry.implementation_notes.kind === "meta");
check("15 rendered sections in implementation bindings", Object.keys(bindings).length === 15);
check("implementation names are unique", new Set(Object.values(bindings)).size === Object.values(bindings).length);
check(
  "implementation names follow <Name>Block convention",
  Object.values(bindings).every((name) => /^[A-Z][A-Za-z0-9]+Block$/.test(name)),
);
check("hero binds to HeroBlock", bindings.hero === "HeroBlock");
check("product_showcase binds to ProductShowcaseBlock", bindings.product_showcase === "ProductShowcaseBlock");

if (failures > 0) {
  console.error(`\n${failures} check(s) FAILED`);
  process.exit(1);
}
console.log("\nAll registry checks passed.");
