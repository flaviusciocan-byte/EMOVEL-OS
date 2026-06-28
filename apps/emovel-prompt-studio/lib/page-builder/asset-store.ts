// EMOVEL Page Builder Core — image asset store (server-side, file-based).
//
// Mirrors store.ts conventions: per-slug persistence under a sibling root inside
// `projects/`. Page Builder assets live in `projects/page-builder-assets/<slug>/`
// so they never pollute the document store or the generated-projects list.
//
// Purpose: make the "MISSING ASSET" policy resolvable with REAL files. The
// schema references assets by `src` (canonical form `assets/<file>`); this store
// ingests/serves those files and verifies their existence so the export gate can
// fail on a referenced-but-absent file, not only on an empty src.

import { mkdir, readFile, readdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { generatedRoot, safeSlug } from "../projects";
import type { PageBuilderDocument } from "./schema";
import { isExternalAssetSrc, pageBuilderAssetUrl } from "./asset-url";

// Allowed raster/vector image types (extension -> content type).
const IMAGE_CONTENT_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  avif: "image/avif",
};

export type SavedPageBuilderAsset = {
  src: string; // canonical, schema/export form: "assets/<file>"
  url: string; // live-preview fetch URL via the assets route
  filename: string;
  contentType: string;
  bytes: number;
};

export type MissingLocalAsset = { field: string; src: string };

function cleanSlugOrThrow(slug: string): string {
  const clean = safeSlug(slug);
  if (!clean || clean !== slug) {
    throw new Error(`Invalid page builder slug: ${slug}`);
  }
  return clean;
}

/** projects/page-builder-assets/<slug> — sibling of projects/page-builder. */
export function pageBuilderAssetsRoot(slug: string) {
  return path.join(generatedRoot(), "..", "page-builder-assets", cleanSlugOrThrow(slug));
}

export function assetExtension(filename: string): string {
  const dot = filename.lastIndexOf(".");
  return dot >= 0 ? filename.slice(dot + 1).toLowerCase() : "";
}

export function isSupportedImageFilename(filename: string): boolean {
  return assetExtension(filename) in IMAGE_CONTENT_TYPES;
}

export function contentTypeForFilename(filename: string): string {
  return IMAGE_CONTENT_TYPES[assetExtension(filename)] ?? "application/octet-stream";
}

// Sanitize a user/AI-supplied filename to a safe, flat asset name (no paths).
export function safeAssetFilename(filename: string): string {
  const base = filename.split(/[\\/]/).pop() ?? filename;
  const ext = assetExtension(base);
  const stem = (ext ? base.slice(0, base.length - ext.length - 1) : base)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "asset";
  return ext ? `${stem}.${ext}` : stem;
}

// Strip the canonical "assets/" (or "/assets/") prefix to the flat filename.
function srcToFilename(src: string): string {
  return src.replace(/^\/?assets\//, "").split(/[\\/]/).pop() ?? src;
}

// Re-exported from the pure asset-url module (single source of truth).
export { isExternalAssetSrc } from "./asset-url";

/** Save image bytes for a slug. Returns the canonical src + live URL. */
export async function savePageBuilderAsset(
  slug: string,
  filename: string,
  bytes: Buffer | Uint8Array,
): Promise<SavedPageBuilderAsset> {
  const clean = cleanSlugOrThrow(slug);
  if (!isSupportedImageFilename(filename)) {
    throw new Error(`Unsupported image type: ${filename}`);
  }
  const safe = safeAssetFilename(filename);
  await mkdir(pageBuilderAssetsRoot(clean), { recursive: true });
  await writeFile(path.join(pageBuilderAssetsRoot(clean), safe), bytes);
  return {
    src: `assets/${safe}`,
    url: pageBuilderAssetUrl(clean, `assets/${safe}`),
    filename: safe,
    contentType: contentTypeForFilename(safe),
    bytes: bytes.byteLength,
  };
}

export async function listPageBuilderAssets(slug: string): Promise<string[]> {
  try {
    const entries = await readdir(pageBuilderAssetsRoot(slug), { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && isSupportedImageFilename(entry.name))
      .map((entry) => `assets/${entry.name}`)
      .sort();
  } catch {
    return [];
  }
}

export async function hasPageBuilderAsset(slug: string, src: string): Promise<boolean> {
  const filename = srcToFilename(src);
  if (!filename) return false;
  try {
    await readFile(path.join(pageBuilderAssetsRoot(slug), filename));
    return true;
  } catch {
    return false;
  }
}

export async function readPageBuilderAsset(
  slug: string,
  src: string,
): Promise<{ bytes: Buffer; contentType: string } | null> {
  const filename = srcToFilename(src);
  if (!filename) return null;
  try {
    const bytes = await readFile(path.join(pageBuilderAssetsRoot(slug), filename));
    return { bytes, contentType: contentTypeForFilename(filename) };
  } catch {
    return null;
  }
}

export async function clearPageBuilderAsset(slug: string, src: string): Promise<boolean> {
  const filename = srcToFilename(src);
  if (!filename) return false;
  try {
    await unlink(path.join(pageBuilderAssetsRoot(slug), filename));
    return true;
  } catch {
    return false;
  }
}

// Collect every asset src a document references (with its field path).
export function collectAssetReferences(document: PageBuilderDocument): MissingLocalAsset[] {
  const refs: MissingLocalAsset[] = [];
  document.sections.forEach((section, index) => {
    if (section.type === "product_showcase") {
      if (section.productAsset?.src) refs.push({ field: `sections[${index}].productAsset.src`, src: section.productAsset.src });
      section.features.forEach((feature, fi) => {
        if (feature.image?.src) refs.push({ field: `sections[${index}].features[${fi}].image.src`, src: feature.image.src });
      });
      if (section.background?.asset?.src) {
        refs.push({ field: `sections[${index}].background.asset.src`, src: section.background.asset.src });
      }
    }
    if (section.type === "logo_strip") {
      section.logos.forEach((logo, li) => {
        if (logo.src) refs.push({ field: `sections[${index}].logos[${li}].src`, src: logo.src });
      });
    }
  });
  return refs;
}

// Local asset references whose file does not exist on disk. External (http/data)
// references are never reported as missing. This is the real-resolution check
// behind the export gate.
export async function collectMissingLocalAssets(
  slug: string,
  document: PageBuilderDocument,
): Promise<MissingLocalAsset[]> {
  const local = collectAssetReferences(document).filter((ref) => !isExternalAssetSrc(ref.src));
  const missing: MissingLocalAsset[] = [];
  for (const ref of local) {
    if (!(await hasPageBuilderAsset(slug, ref.src))) {
      missing.push(ref);
    }
  }
  return missing;
}
