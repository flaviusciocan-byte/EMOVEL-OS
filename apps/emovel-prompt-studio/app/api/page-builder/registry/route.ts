import { NextResponse } from "next/server";
import { buildPageBuilderRegistryManifest } from "@/lib/page-builder/manifest";

// Serves the Component Registry v1.1 manifest (derived from the TypeScript source
// of truth) to the Builder UI: component palette, statuses, shared layer, and
// canonical order. Read-only, no slug.
export async function GET() {
  return NextResponse.json({ ok: true, manifest: buildPageBuilderRegistryManifest() });
}
