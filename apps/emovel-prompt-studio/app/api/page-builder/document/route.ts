import { NextResponse } from "next/server";
import { pageBuilderDocumentToMarkdown } from "@/lib/page-builder/export";
import { evaluatePageBuilderReadiness } from "@/lib/page-builder/readiness";
import { getPageBuilderDocument } from "@/lib/page-builder/store";

// Read-only loader for a previously generated + saved PageBuilderDocument.
// Used by the workspace to restore the landing page preview after a refresh.
// No generation, no AI, no mutation.

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
    // Invalid slug (store throws) — treat as a clean "not found" rather than 500.
    const message = error instanceof Error ? error.message : "Invalid slug.";
    return NextResponse.json({ ok: false, errors: [message] }, { status: 400 });
  }

  if (!document) {
    return NextResponse.json({ ok: false, errors: ["No Page Builder document found."] }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    slug,
    document,
    markdown: pageBuilderDocumentToMarkdown(document),
    readiness: evaluatePageBuilderReadiness(document),
  });
}
