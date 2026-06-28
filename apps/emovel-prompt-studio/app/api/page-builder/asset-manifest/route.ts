import { NextResponse } from "next/server";
import { assertPageBuilderExportable, pageBuilderDocumentToAssetManifest } from "@/lib/page-builder/static-export";
import { collectMissingLocalAssets } from "@/lib/page-builder/asset-store";
import { getPageBuilderDocument } from "@/lib/page-builder/store";

// Required / missing / optional asset inventory for a stored document, plus the
// explicit exportability verdict. Drives the "MISSING ASSET" empty-state in the
// Builder inspector without producing the full export pack.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug")?.trim();

  if (!slug) {
    return NextResponse.json({ ok: false, errors: ["slug query parameter is required."] }, { status: 400 });
  }

  let document;
  try {
    document = await getPageBuilderDocument(slug);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid slug.";
    return NextResponse.json({ ok: false, errors: [message] }, { status: 400 });
  }
  if (!document) {
    return NextResponse.json({ ok: false, errors: ["No Page Builder document found."] }, { status: 404 });
  }

  const assetManifest = pageBuilderDocumentToAssetManifest(document);
  const exportable = assertPageBuilderExportable(document);
  // Real-resolution: referenced local files that do not exist on disk.
  const unresolvedAssets = await collectMissingLocalAssets(slug, document);
  const resolved = exportable.ok && unresolvedAssets.length === 0;
  return NextResponse.json({ ok: true, slug, assetManifest, exportable, unresolvedAssets, resolved });
}
