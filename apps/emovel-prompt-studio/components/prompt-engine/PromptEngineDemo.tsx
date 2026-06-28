"use client";

import { useState } from "react";
import Link from "next/link";
import type { PromptPackage } from "../../lib/prompt-engine";
import { PageBuilderHtmlRenderer } from "../page-builder/PageBuilderHtmlRenderer";
import type { PageBuilderDocument } from "../../lib/page-builder/schema";
import {
  createProjectSchemaV1,
  emptyRefinedBrief,
  migrateProjectToSchemaV1,
  type ProjectSchemaV1,
} from "../../lib/project-schema";

type RefineResponse =
  | { ok: true; package: PromptPackage; markdown: string }
  | { ok: false; errors: string[] };

type SiteStatus = "idle" | "running" | "done" | "failed";

// Create a real workspace slug (UUID), matching the home-page project flow.
function createWorkspaceSlug(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `workspace-${Date.now().toString(36)}`;
}

// Persist a localStorage-only workspace project — same keys/shape as app/page.tsx
// (emovel-projects list + emovel-project:<id>). No server storage, no new store.
function persistLocalProject(project: ProjectSchemaV1) {
  const existing = localStorage.getItem("emovel-projects");
  const projects = existing
    ? (JSON.parse(existing) as unknown[])
        .map((item) => migrateProjectToSchemaV1(item))
        .filter((item): item is ProjectSchemaV1 => Boolean(item))
    : [];
  localStorage.setItem("emovel-projects", JSON.stringify([project, ...projects]));
  localStorage.setItem(`emovel-project:${project.id}`, JSON.stringify(project));
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/18 p-4">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/35">{title}</p>
      <ul className="mt-3 grid gap-2">
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-6 text-white/64">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E9D8A6]" />
              <span>{item}</span>
            </li>
          ))
        ) : (
          <li className="text-sm text-white/34">None</li>
        )}
      </ul>
    </div>
  );
}

function FieldBlock({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/18 p-4">
      <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#E9D8A6]/70">{title}</p>
      <p className="mt-2 text-sm leading-6 text-white/68">{value}</p>
    </div>
  );
}

export function PromptEngineDemo() {
  const [rawIdea, setRawIdea] = useState(
    "Create a premium AI launch system for founders that turns one messy idea into a landing page, offer, copy, and builder handoff.",
  );
  const [loading, setLoading] = useState(false);
  const [pkg, setPkg] = useState<PromptPackage | null>(null);
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  // Generate Site (Page Builder) state.
  const [siteStatus, setSiteStatus] = useState<SiteStatus>("idle");
  const [siteDocument, setSiteDocument] = useState<PageBuilderDocument | null>(null);
  const [siteErrors, setSiteErrors] = useState<string[]>([]);
  const [siteSlug, setSiteSlug] = useState<string | null>(null);

  function resetSiteState() {
    setSiteStatus("idle");
    setSiteDocument(null);
    setSiteErrors([]);
    setSiteSlug(null);
  }

  async function submit() {
    if (loading) return;
    setLoading(true);
    setErrors([]);
    resetSiteState();

    try {
      const response = await fetch("/api/prompt-engine/refine", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ rawIdea }),
      });
      const payload = (await response.json()) as RefineResponse;
      if (payload.ok) {
        setPkg(payload.package);
        setMarkdown(payload.markdown);
      } else {
        setPkg(null);
        setMarkdown(null);
        setErrors(payload.errors);
      }
    } catch {
      setPkg(null);
      setMarkdown(null);
      setErrors(["Prompt Engine request failed. Try again with a clearer raw idea."]);
    } finally {
      setLoading(false);
    }
  }

  // Generate a landing page from the prompt package. Creates a REAL localStorage
  // workspace project (UUID slug) — mirroring app/page.tsx — then generates the
  // Page Builder document on that same slug via the existing endpoint. No server
  // project files, no new storage, no Page Builder Core change.
  async function generateSite() {
    if (!pkg || siteStatus === "running") return;
    setSiteStatus("running");
    setSiteErrors([]);

    const input = pkg.generation_input;

    // 1) Real workspace slug + localStorage project (kept even if generation fails,
    //    so the user can retry from the workspace).
    const slug = createWorkspaceSlug();
    const refinedBrief = {
      ...emptyRefinedBrief,
      targetAudience: input.audience,
      tone: input.tone,
      launchGoal: input.page_goal,
    };
    try {
      const project = createProjectSchemaV1({
        id: slug,
        title: input.project_title,
        prompt: input.source_prompt,
        refinedBrief,
        createdAt: new Date().toISOString(),
        status: "Ready",
      });
      persistLocalProject(project);
      setSiteSlug(slug);
    } catch {
      // localStorage unavailable — continue without a persisted workspace.
      setSiteSlug(null);
    }

    // 2) Generate + persist the Page Builder document on the same slug.
    try {
      const response = await fetch("/api/page-builder/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slug,
          project: {
            title: input.project_title,
            prompt: input.source_prompt,
            refinedBrief: {
              targetAudience: input.audience,
              tone: input.tone,
              launchGoal: input.page_goal,
            },
          },
          assets: {},
        }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        document?: PageBuilderDocument;
        errors?: string[];
      };

      if (payload.ok && payload.document) {
        setSiteDocument(payload.document);
        setSiteErrors([]);
        setSiteStatus("done");
      } else {
        setSiteDocument(null);
        setSiteErrors(payload.errors ?? ["Site generation failed. Try refining the idea again."]);
        setSiteStatus("failed");
      }
    } catch {
      setSiteDocument(null);
      setSiteErrors(["Site generation request failed. Try again."]);
      setSiteStatus("failed");
    }
  }

  return (
    <div id="idea-input" className="mt-9 max-w-2xl rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.46)] backdrop-blur-2xl">
      <label htmlFor="raw-idea-input" className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
        Raw idea input
      </label>
      <textarea
        id="raw-idea-input"
        value={rawIdea}
        onChange={(event) => setRawIdea(event.target.value)}
        rows={5}
        className="mt-3 min-h-32 w-full resize-none rounded-2xl border border-[#C7A45A]/20 bg-black/24 p-4 text-sm leading-7 text-white/72 outline-none transition placeholder:text-white/26 focus:border-[#E9D8A6]/40 focus:bg-black/30 focus-visible:ring-2 focus-visible:ring-[#E9D8A6]/35"
        placeholder="Write your raw product, offer, or launch idea..."
      />
      <p className="mt-3 text-sm leading-6 text-white/46">
        Write it messy. You do not need prompt engineering language; the engine extracts the product, audience, offer, and page direction.
      </p>

      {errors.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
          <p className="text-sm font-bold text-red-100">Refinement failed:</p>
          <ul className="mt-2 grid gap-1">
            {errors.map((error) => (
              <li key={error} className="text-sm leading-6 text-red-100/78">
                {error}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={loading}
          aria-busy={loading}
          className="rounded-2xl bg-[#C7A45A] px-5 py-3 text-sm font-black text-white shadow-[0_16px_45px_rgba(199,164,90,0.28)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#E9D8A6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E9D8A6]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070707] disabled:translate-y-0 disabled:cursor-wait disabled:opacity-55"
        >
          {loading ? "Generating..." : "Generate Prompt Package"}
        </button>
        <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-4 py-2 text-xs font-bold text-white/50">
          Deterministic preview
        </span>
      </div>

      {pkg ? (
        <section className="mt-6 rounded-[24px] border border-[#C7A45A]/20 bg-[#0B0614]/88 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#E9D8A6]">
                Prompt Package Preview
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] text-white">Structured output</h2>
            </div>
            <button
              type="button"
              onClick={generateSite}
              disabled={siteStatus === "running"}
              aria-busy={siteStatus === "running"}
              className="rounded-2xl border border-[#C7A45A]/35 bg-[#C7A45A]/15 px-4 py-2.5 text-xs font-black text-[#F2D99B] transition duration-300 hover:border-[#C7A45A]/55 hover:bg-[#C7A45A]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7A45A]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0614] disabled:cursor-wait disabled:opacity-60"
            >
              {siteStatus === "running" ? "Building your site…" : "Generate Site"}
            </button>
          </div>

          <div className="mt-5 grid gap-3">
            <FieldBlock title="Refined Prompt" value={pkg.refined_prompt} />
            <FieldBlock title="Product Brief" value={pkg.product_brief} />
            <div className="grid gap-3 md:grid-cols-2">
              <FieldBlock title="Target Audience" value={pkg.target_audience} />
              <FieldBlock title="Offer Angle" value={pkg.offer_angle} />
              <FieldBlock title="Transformation" value={pkg.transformation} />
              <FieldBlock title="Tone" value={pkg.tone} />
              <FieldBlock title="Page Goal" value={pkg.page_goal} />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <ListBlock title="Missing Inputs" items={pkg.missing_inputs} />
              <ListBlock title="Proof Needed" items={pkg.proof_needed} />
            </div>
            <ListBlock title="Recommended Sections" items={pkg.recommended_sections} />
          </div>

          {markdown ? (
            <details className="mt-4 rounded-2xl border border-white/[0.06] bg-black/18">
              <summary className="cursor-pointer px-4 py-3 text-sm font-bold text-white/62 transition hover:text-white">
                View Prompt Package Markdown
              </summary>
              <pre className="max-h-96 overflow-auto whitespace-pre-wrap border-t border-white/[0.06] p-4 text-xs leading-5 text-white/58">
                {markdown}
              </pre>
            </details>
          ) : null}

          {siteStatus === "running" ? (
            <p className="mt-4 text-sm text-white/60">Building your site…</p>
          ) : null}

          {siteErrors.length > 0 ? (
            <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
              <p className="text-sm font-bold text-red-100">Site generation failed — your prompt package is unchanged:</p>
              <ul className="mt-2 grid gap-1">
                {siteErrors.map((error) => (
                  <li key={error} className="text-sm leading-6 text-red-100/78">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {siteDocument ? (
            <div className="mt-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                  <p className="text-sm font-bold text-emerald-200">Site generated and saved to workspace.</p>
                </div>
                {siteSlug ? (
                  <Link
                    href={`/workspace/${siteSlug}`}
                    className="rounded-xl border border-[#C7A45A]/35 bg-[#C7A45A]/15 px-4 py-2 text-xs font-black text-white/85 transition duration-300 hover:border-[#E9D8A6]/55 hover:bg-[#C7A45A]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E9D8A6]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0614]"
                  >
                    Open workspace
                  </Link>
                ) : null}
              </div>
              <div className="mt-3">
                <PageBuilderHtmlRenderer document={siteDocument} />
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

export default PromptEngineDemo;
