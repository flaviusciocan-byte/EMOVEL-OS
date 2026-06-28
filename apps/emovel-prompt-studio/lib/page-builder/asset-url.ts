// Pure asset-URL helpers (client-safe: no fs, no Node APIs).
// Shared by the server asset-store and the client renderer so the canonical
// "assets/<file>" src and its live serve URL never diverge.

// External when an absolute URL or a data: URI — these need no local file and
// are used verbatim. Everything else is a local "assets/<file>" reference.
export function isExternalAssetSrc(src: string): boolean {
  return /^(https?:)?\/\//i.test(src) || /^data:/i.test(src);
}

// Resolve a schema src to something a browser can load. Local "assets/<file>"
// references become the serve URL for the slug; external/empty srcs pass through
// unchanged. Pure + deterministic.
export function pageBuilderAssetUrl(slug: string, src: string): string {
  if (!src || isExternalAssetSrc(src)) return src;
  const normalized = src.replace(/^\//, "");
  return `/api/page-builder/assets?slug=${encodeURIComponent(slug)}&src=${encodeURIComponent(normalized)}`;
}
