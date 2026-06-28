import { NextResponse } from "next/server";
import { pageBuilderDocumentToStaticExport } from "@/lib/page-builder/static-export";
import { getPageBuilderDocument } from "@/lib/page-builder/store";

// Deterministic static HTML/CSS export (+ asset manifest) for a stored document.
// Used for preview / direct download of the standalone landing page.
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

  const staticExport = pageBuilderDocumentToStaticExport(document);
  return NextResponse.json({ ok: true, slug, ...staticExport });
}
