"use client";

// EMOVEL Page Builder — export & asset-health panel (inspector).
// Surfaces the strict empty-state policy and the static export at the UI edge:
//   - Check assets  -> GET /asset-manifest (required/missing/unresolved + verdict)
//   - Download HTML  -> GET /static-export (deterministic standalone page)
//   - Strict export  -> GET /export (fails explicitly on missing required assets)
// Self-contained: reads only the slug; never mutates the document.

import { useState } from "react";

type AssetCheck = {
  resolved: boolean;
  exportable: { ok: boolean };
  assetManifest: { required: unknown[]; missing: { field: string; reason: string }[]; optional: unknown[] };
  unresolvedAssets: { field: string; src: string }[];
};

type PageBuilderExportPanelProps = { slug: string };

function downloadText(filename: string, content: string, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function PageBuilderExportPanel({ slug }: PageBuilderExportPanelProps) {
  const [busy, setBusy] = useState<null | "check" | "static" | "strict">(null);
  const [error, setError] = useState<string | null>(null);
  const [check, setCheck] = useState<AssetCheck | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function runCheck() {
    setBusy("check");
    setError(null);
    setStatus(null);
    try {
      const res = await fetch(`/api/page-builder/asset-manifest?slug=${encodeURIComponent(slug)}`);
      const data = (await res.json()) as AssetCheck & { ok: boolean; errors?: string[] };
      if (!res.ok || !(data as { ok: boolean }).ok) throw new Error(data.errors?.join(" ") ?? `Failed (${res.status}).`);
      setCheck(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Asset check failed.");
    } finally {
      setBusy(null);
    }
  }

  async function downloadStatic() {
    setBusy("static");
    setError(null);
    setStatus(null);
    try {
      const res = await fetch(`/api/page-builder/static-export?slug=${encodeURIComponent(slug)}`);
      const data = (await res.json()) as { ok: boolean; html?: string; css?: string; errors?: string[] };
      if (!res.ok || !data.ok || !data.html) throw new Error(data.errors?.join(" ") ?? `Failed (${res.status}).`);
      downloadText(`${slug}-landing-page.html`, data.html, "text/html");
      if (data.css) downloadText("landing-page.css", data.css, "text/css");
      setStatus("Downloaded static page (HTML + CSS).");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Static export failed.");
    } finally {
      setBusy(null);
    }
  }

  async function runStrict() {
    setBusy("strict");
    setError(null);
    setStatus(null);
    try {
      const res = await fetch(`/api/page-builder/export?slug=${encodeURIComponent(slug)}`);
      const data = (await res.json()) as { ok: boolean; files?: { path: string }[]; errors?: string[] };
      if (!res.ok || !data.ok) {
        // 422 = explicit empty-state policy failure.
        throw new Error(data.errors?.join(" ") ?? `Export blocked (${res.status}).`);
      }
      setStatus(`Strict export OK — ${data.files?.length ?? 0} files ready.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Strict export failed.");
    } finally {
      setBusy(null);
    }
  }

  const btn =
    "rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/75 transition hover:border-white/35 hover:text-white/95 disabled:cursor-wait disabled:opacity-50";

  return (
    <div className="rounded-xl border border-white/[0.08] bg-black/20 p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">Export &amp; asset health</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={runCheck} disabled={busy !== null} className={btn}>
          {busy === "check" ? "Checking…" : "Check assets"}
        </button>
        <button type="button" onClick={downloadStatic} disabled={busy !== null} className={btn}>
          {busy === "static" ? "Preparing…" : "Download static page"}
        </button>
        <button
          type="button"
          onClick={runStrict}
          disabled={busy !== null}
          className="rounded-lg border border-[#C7A45A]/40 bg-[#C7A45A]/10 px-3 py-1.5 text-xs font-semibold text-[#E9D8A6] transition hover:border-[#C7A45A]/70 hover:bg-[#C7A45A]/20 disabled:cursor-wait disabled:opacity-50"
        >
          {busy === "strict" ? "Exporting…" : "Strict export"}
        </button>
      </div>

      {error ? <p className="mt-3 text-xs text-red-300">{error}</p> : null}
      {status ? <p className="mt-3 text-xs text-emerald-300">{status}</p> : null}

      {check ? (
        <div className="mt-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-xs">
          <p className={check.resolved ? "font-semibold text-emerald-300" : "font-semibold text-amber-300"}>
            {check.resolved ? "All required assets resolved — export-ready." : "Export blocked — unresolved assets."}
          </p>
          <p className="mt-1 text-white/55">
            Required: {check.assetManifest.required.length} · Optional: {check.assetManifest.optional.length} · Missing src:{" "}
            {check.assetManifest.missing.length} · Unresolved files: {check.unresolvedAssets.length}
          </p>
          {check.unresolvedAssets.length > 0 ? (
            <ul className="mt-2 grid gap-1">
              {check.unresolvedAssets.map((a) => (
                <li key={a.field} className="text-amber-200/80">
                  {a.field} → <code>{a.src}</code>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default PageBuilderExportPanel;
