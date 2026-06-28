"use client";

// EMOVEL Page Builder — image asset uploader (inspector control).
// Uploads an image to /api/page-builder/assets and surfaces the canonical
// `assets/<file>` src to reference in the document. No fake assets, no silent
// degradation: failures are shown explicitly.

import { useRef, useState } from "react";

type UploadedAsset = { src: string; url: string; filename: string; bytes: number; contentType: string };

type AssetUploaderProps = {
  slug: string;
};

export function AssetUploader({ slug }: AssetUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assets, setAssets] = useState<UploadedAsset[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("slug", slug);
        form.append("file", file);
        form.append("filename", file.name);
        const response = await fetch("/api/page-builder/assets", { method: "POST", body: form });
        const data = (await response.json()) as { ok: boolean; asset?: UploadedAsset; errors?: string[] };
        if (!response.ok || !data.ok || !data.asset) {
          throw new Error(data.errors?.join(" ") ?? `Upload failed (${response.status}).`);
        }
        setAssets((prev) => [data.asset as UploadedAsset, ...prev.filter((a) => a.src !== data.asset!.src)]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function copySrc(src: string) {
    try {
      await navigator.clipboard.writeText(src);
      setCopied(src);
      window.setTimeout(() => setCopied((c) => (c === src ? null : c)), 1500);
    } catch {
      setCopied(null);
    }
  }

  return (
    <div className="rounded-xl border border-white/[0.08] bg-black/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">Image assets</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="rounded-lg border border-[#C7A45A]/40 bg-[#C7A45A]/10 px-3 py-1.5 text-xs font-semibold text-[#E9D8A6] transition hover:border-[#C7A45A]/70 hover:bg-[#C7A45A]/20 disabled:cursor-wait disabled:opacity-50"
        >
          {busy ? "Uploading…" : "Upload image"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
          multiple
          hidden
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>

      {error ? <p className="mt-3 text-xs text-red-300">{error}</p> : null}

      {assets.length > 0 ? (
        <ul className="mt-3 grid gap-2">
          {assets.map((asset) => (
            <li
              key={asset.src}
              className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset.url} alt={asset.filename} className="h-10 w-10 rounded object-cover" />
              <code className="flex-1 truncate text-xs text-white/70">{asset.src}</code>
              <button
                type="button"
                onClick={() => copySrc(asset.src)}
                className="rounded-md border border-white/15 px-2 py-1 text-[11px] text-white/70 transition hover:border-white/35 hover:text-white/90"
              >
                {copied === asset.src ? "Copied" : "Copy src"}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-xs text-white/40">
          Upload product renders or logos, then reference the returned <code>assets/…</code> src in the document.
        </p>
      )}
    </div>
  );
}

export default AssetUploader;
