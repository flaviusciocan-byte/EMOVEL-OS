import { NextResponse } from "next/server";
import { pageBuilderDocumentToStrictExport } from "@/lib/page-builder/export-fragment";
import { collectMissingLocalAssets } from "@/lib/page-builder/asset-store";
import { getPageBuilderDocument } from "@/lib/page-builder/store";

// Strict export. Unlike /export-fragment (the soft builder-pack path that never
// blocks the workspace ZIP), this FAILS EXPLICITLY (422) when the document is
// invalid or required assets are missing — the empty-state policy at the API edge.
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

  const result = pageBuilderDocumentToStrictExport(document);
  if (!result.ok) {
    return NextResponse.json({ ok: false, slug, errors: result.errors }, { status: 422 });
  }
  // Real-resolution: a referenced local asset file that does not exist also
  // blocks export (no silent degradation to a missing file).
  const missingFiles = await collectMissingLocalAssets(slug, document);
  if (missingFiles.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        slug,
        errors: missingFiles.map((m) => `Referenced asset file is missing: ${m.field} -> ${m.src}`),
      },
      { status: 422 },
    );
  }
  return NextResponse.json({ ok: true, slug, files: result.files });
}
