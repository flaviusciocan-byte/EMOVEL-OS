import { NextResponse } from "next/server";
import { getPageBuilderExportFragment } from "@/lib/page-builder/export-fragment";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug")?.trim();

  if (!slug) {
    return NextResponse.json({ ok: true, found: false, files: [] });
  }

  const fragment = await getPageBuilderExportFragment(slug);
  return NextResponse.json(fragment);
}
