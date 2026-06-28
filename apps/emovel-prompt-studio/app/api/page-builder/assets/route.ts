import { NextResponse } from "next/server";
import {
  isSupportedImageFilename,
  listPageBuilderAssets,
  readPageBuilderAsset,
  savePageBuilderAsset,
} from "@/lib/page-builder/asset-store";

// Image asset pipeline for the Page Builder.
//   POST (multipart): { slug, file } -> ingest image, returns canonical src + url.
//   GET ?slug=&src=  -> serve the image bytes.
//   GET ?slug=        -> list stored asset srcs.
export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, errors: ["Expected multipart/form-data with a file."] }, { status: 400 });
  }

  const slug = String(form.get("slug") ?? "").trim();
  const file = form.get("file");
  if (!slug) {
    return NextResponse.json({ ok: false, errors: ["slug is required."] }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, errors: ["file is required (multipart field 'file')."] }, { status: 400 });
  }
  const filename = (String(form.get("filename") ?? "") || file.name || "asset").trim();
  if (!isSupportedImageFilename(filename)) {
    return NextResponse.json(
      { ok: false, errors: ["Unsupported image type. Allowed: png, jpg, jpeg, webp, gif, svg, avif."] },
      { status: 415 },
    );
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const saved = await savePageBuilderAsset(slug, filename, bytes);
    return NextResponse.json({ ok: true, slug, asset: saved });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save asset.";
    return NextResponse.json({ ok: false, errors: [message] }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug")?.trim();
  const src = searchParams.get("src")?.trim();

  if (!slug) {
    return NextResponse.json({ ok: false, errors: ["slug query parameter is required."] }, { status: 400 });
  }

  if (!src) {
    try {
      const assets = await listPageBuilderAssets(slug);
      return NextResponse.json({ ok: true, slug, assets });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid slug.";
      return NextResponse.json({ ok: false, errors: [message] }, { status: 400 });
    }
  }

  let asset;
  try {
    asset = await readPageBuilderAsset(slug, src);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid slug.";
    return NextResponse.json({ ok: false, errors: [message] }, { status: 400 });
  }
  if (!asset) {
    return NextResponse.json({ ok: false, errors: ["Asset not found."] }, { status: 404 });
  }
  return new Response(new Uint8Array(asset.bytes), {
    status: 200,
    headers: { "Content-Type": asset.contentType, "Cache-Control": "no-store" },
  });
}
