// EMOVEL Page Builder — Component Registry v1.1 manifest builder.
//
// The manifest is DERIVED from the TypeScript source of truth (registry.ts +
// sections.ts + schema.ts). `scripts/generate-registry-manifest.ts` writes
// registry.manifest.json from this builder; the JSON is never hand-edited.
// `verify-manifest.ts` fails if the committed JSON drifts from the TS.

import { PAGE_BUILDER_SCHEMA_VERSION } from "./schema";
import {
  PAGE_BUILDER_REGISTRY_ID,
  PAGE_BUILDER_REGISTRY_VERSION,
  listRegistryComponents,
} from "./registry";
import { canonicalSectionOrder, requiredSectionTypes } from "./sections";

// The six Shared Layer props every component inherits (see schema.ts BaseSection).
export const SHARED_LAYER_PROPS = [
  "universe",
  "surface",
  "motion",
  "spacing",
  "anchorId",
  "aiLock",
] as const;

export const MANIFEST_BANNER = {
  _comment:
    "GENERATED FILE — do not edit. Source: lib/page-builder/registry.ts. Run scripts/generate-registry-manifest.ts to regenerate.",
} as const;

export type PageBuilderRegistryManifest = ReturnType<typeof buildPageBuilderRegistryManifest>;

export function buildPageBuilderRegistryManifest() {
  const components = listRegistryComponents();
  return {
    registry_id: PAGE_BUILDER_REGISTRY_ID,
    registry_version: PAGE_BUILDER_REGISTRY_VERSION,
    schema_version: PAGE_BUILDER_SCHEMA_VERSION,
    generated: true,
    generated_from: "lib/page-builder/registry.ts",
    shared_layer: [...SHARED_LAYER_PROPS],
    canonical_order: [...canonicalSectionOrder],
    required_sections: [...requiredSectionTypes],
    component_count: components.length,
    components: components.map((e) => ({
      componentNumber: e.componentNumber,
      id: e.id,
      registryId: e.registryId,
      kind: e.kind,
      status: e.status,
      surfaceOwner: e.surfaceOwner,
      implementation: e.implementation,
      label: e.label,
      category: e.category,
      required: e.required,
      requiredFields: e.requiredFields,
      optionalFields: e.optionalFields,
      supportedLayouts: e.supportedLayouts ?? null,
    })),
  };
}

// Single source for the exact file contents — used by both the generator and the
// drift verifier so they can never disagree.
export function serializePageBuilderRegistryManifest(): string {
  return JSON.stringify({ ...MANIFEST_BANNER, ...buildPageBuilderRegistryManifest() }, null, 2) + "\n";
}
