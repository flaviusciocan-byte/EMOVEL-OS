"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createProjectSchemaV1,
  emptyRefinedBrief,
  migrateProjectToSchemaV1,
  type ProjectSchemaV1,
  type RefinedBrief,
  type StrategyAsset,
} from "../lib/project-schema";

const examples = [
  "Launch a premium AI agency site",
  "Create a Gumroad product system",
  "Design a SaaS waitlist launch",
  "Build a founder content OS",
];

const previewCards = [
  { label: "Strategy", className: "-left-12 top-8 rotate-[-7deg]" },
  { label: "Design", className: "-right-10 top-14 rotate-[6deg]" },
  { label: "Build", className: "-left-6 bottom-10 rotate-[5deg]" },
  { label: "Publish", className: "-right-8 bottom-7 rotate-[-6deg]" },
];

const refineFields: { key: keyof RefinedBrief; label: string; placeholder: string }[] = [
  { key: "productType", label: "What are you building?", placeholder: "AI content OS, agency site, SaaS dashboard..." },
  { key: "targetAudience", label: "Who is it for?", placeholder: "Solo founders, luxury agents, SaaS teams..." },
  { key: "platform", label: "What platform?", placeholder: "Web app, Gumroad, landing page, Instagram..." },
  { key: "tone", label: "What tone?", placeholder: "Premium, direct, cinematic, playful..." },
  { key: "launchGoal", label: "What should it achieve?", placeholder: "Sell preorders, capture leads, launch a paid product..." },
  { key: "pricePoint", label: "Price point / monetization", placeholder: "$49 prompt pack, $499 service audit, free waitlist..." },
];

function titleFromPrompt(value: string) {
  const clean = value.trim().replace(/\s+/g, " ");
  if (!clean) return "Untitled Workspace";
  const withoutCommand = clean.replace(/^(create|build|design|launch|generate)\s+/i, "");
  return withoutCommand.charAt(0).toUpperCase() + withoutCommand.slice(1, 72);
}

function inferBriefFromPrompt(prompt: string): RefinedBrief {
  const lower = prompt.toLowerCase();
  const productType =
    lower.includes("dashboard") ? "SaaS dashboard" :
    lower.includes("gumroad") || lower.includes("prompt pack") ? "Digital product" :
    lower.includes("agency") ? "Agency landing page" :
    lower.includes("content") || lower.includes("instagram") ? "Content operating system" :
    lower.includes("real estate") ? "Luxury real estate website" :
    lower.includes("site") || lower.includes("landing") ? "Conversion website" :
    "Launch workspace";
  const targetAudience =
    lower.includes("founder") ? "Solo founders and lean operators" :
    lower.includes("real estate") ? "Luxury real estate buyers and sellers" :
    lower.includes("saas") ? "SaaS teams and product operators" :
    lower.includes("agency") ? "High-trust service buyers" :
    "Builders preparing a product launch";
  const platform =
    lower.includes("instagram") ? "Instagram" :
    lower.includes("gumroad") ? "Gumroad" :
    lower.includes("dashboard") || lower.includes("saas") ? "Web app" :
    lower.includes("site") || lower.includes("landing") ? "Website" :
    "Web workspace";
  const tone =
    lower.includes("luxury") ? "Luxury and polished" :
    lower.includes("agency") ? "Premium and authoritative" :
    lower.includes("founder") ? "Clear and founder-friendly" :
    "Premium, clear, and decisive";
  const pricePoint =
    lower.includes("gumroad") || lower.includes("prompt pack") ? "$29-$99 digital product" :
    lower.includes("agency") ? "$2k-$10k service offer" :
    lower.includes("saas") ? "Free trial or paid SaaS plan" :
    "Pilot price with premium upgrade";
  const launchGoal =
    lower.includes("waitlist") ? "Capture qualified waitlist leads" :
    lower.includes("gumroad") || lower.includes("prompt pack") ? "Sell a self-serve digital product" :
    lower.includes("dashboard") ? "Guide users to activation" :
    "Turn the idea into publish-ready launch assets";

  return { productType, targetAudience, platform, tone, launchGoal, pricePoint };
}

function mergeBrief(prompt: string, brief: RefinedBrief) {
  const inferred = inferBriefFromPrompt(prompt);
  return {
    productType: brief.productType.trim() || inferred.productType,
    targetAudience: brief.targetAudience.trim() || inferred.targetAudience,
    platform: brief.platform.trim() || inferred.platform,
    tone: brief.tone.trim() || inferred.tone,
    launchGoal: brief.launchGoal.trim() || inferred.launchGoal,
    pricePoint: brief.pricePoint.trim() || inferred.pricePoint,
  };
}

function createProjectId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `workspace-${Date.now().toString(36)}`;
}

function persistLocalProject(project: ProjectSchemaV1) {
  const storageKey = "emovel-projects";
  const existing = localStorage.getItem(storageKey);
  const projects = existing
    ? (JSON.parse(existing) as unknown[])
        .map((item) => migrateProjectToSchemaV1(item))
        .filter((item): item is ProjectSchemaV1 => Boolean(item))
    : [];
  localStorage.setItem(storageKey, JSON.stringify([project, ...projects]));
  localStorage.setItem(`emovel-project:${project.id}`, JSON.stringify(project));
}

const progressStages = [
  { id: "strategy", label: "Strategy", status: "Analyzing intent", delay: "delay-0" },
  { id: "copy", label: "Copy", status: "Generating content", delay: "delay-100" },
  { id: "ux", label: "UX", status: "Mapping flows", delay: "delay-200" },
  { id: "design", label: "Design", status: "Creating direction", delay: "delay-300" },
  { id: "build", label: "Build", status: "Writing plan", delay: "delay-400" },
  { id: "publish", label: "Publish", status: "Preparing assets", delay: "delay-500" },
];

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M4 9h9.5M10 5.5 13.5 9 10 12.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <path
        d="M8.5 3.5v10M3.5 8.5h10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

type Stage = "idle" | "generating";
type AiMode = "idle" | "ai" | "fallback";

type AiGenerateResponse = {
  mode?: "ai" | "fallback";
  fallback?: boolean;
  asset?: StrategyAsset;
};

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [brief, setBrief] = useState<RefinedBrief>(emptyRefinedBrief);
  const [refineOpen, setRefineOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");
  const [aiMode, setAiMode] = useState<AiMode>("idle");
  const router = useRouter();

  const handleGenerate = useCallback(async () => {
    if (stage !== "idle") return;
    const text = prompt.trim() || "Create a premium launch workspace for a new EMOVEL product.";
    const refinedBrief = mergeBrief(text, brief);
    setStage("generating");
    setAiMode("idle");
    let strategyAsset: StrategyAsset | null = null;

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          assetType: "strategy",
          prompt: text,
          refinedBrief,
        }),
      });
      const payload = (await response.json()) as AiGenerateResponse;
      if (payload.asset) {
        strategyAsset = payload.asset;
      }
      setAiMode(payload.mode === "ai" && !payload.fallback ? "ai" : "fallback");
    } catch {
      setAiMode("fallback");
    }

    const project = createProjectSchemaV1({
      id: createProjectId(),
      title: titleFromPrompt(text),
      prompt: text,
      refinedBrief,
      createdAt: new Date().toISOString(),
      status: "Ready",
    });
    if (strategyAsset) {
      project.assets = { strategy: strategyAsset } as ProjectSchemaV1["assets"];
    }

    persistLocalProject(project);
    sessionStorage.setItem("emovel-pending-prompt", text);
    router.push(`/workspace/${project.id}`);
  }, [brief, prompt, router, stage]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    }
  }

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#05020A] px-4 pb-12 pt-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 18%, rgba(168,85,247,0.18), transparent 34%), radial-gradient(circle at 50% 70%, rgba(139,92,246,0.18), transparent 46%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-220px] left-1/2 h-[520px] w-[980px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(139,92,246,0.46), rgba(168,85,247,0.24) 38%, transparent 70%)",
        }}
      />

      {stage === "idle" && (
        <section className="relative z-10 flex w-full flex-col items-center">
          <div className="mx-auto mb-9 max-w-4xl text-center">
            <h1 className="animate-fade-up text-[clamp(2.55rem,6.4vw,5.45rem)] font-black leading-[0.98] tracking-[-0.055em] text-white">
              Create products, sites and launch systems from one prompt.
            </h1>
            <p className="animate-fade-up delay-150 mx-auto mt-6 max-w-2xl text-[1.05rem] leading-8 text-white/68 md:text-lg">
              Describe the outcome. EMOVEL turns it into strategy, copy, UX,
              build plans, and publish-ready assets.
            </p>
          </div>

          <div className="animate-fade-up delay-300 relative w-full max-w-[840px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-16 -bottom-20 h-56 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(139,92,246,0.58), rgba(168,85,247,0.24) 44%, transparent 72%)",
              }}
            />

            <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
              {previewCards.map((card) => (
                <div
                  key={card.label}
                  className={`absolute h-24 w-44 rounded-2xl border border-violet-300/15 bg-violet-300/[0.055] p-4 opacity-45 blur-[1.5px] backdrop-blur-xl ${card.className}`}
                >
                  <div className="mb-4 h-2 w-14 rounded-full bg-white/18" />
                  <p className="text-sm font-semibold tracking-wide text-white/55">{card.label}</p>
                  <div className="mt-4 h-1.5 w-full rounded-full bg-white/10" />
                  <div className="mt-2 h-1.5 w-2/3 rounded-full bg-[#8B5CF6]/25" />
                </div>
              ))}
            </div>

            <div className="prompt-glass prompt-composer relative z-10 overflow-hidden">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-8 top-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), rgba(168,85,247,0.75), transparent)",
                }}
              />
              <textarea
                autoFocus
                className="min-h-[176px] w-full resize-none bg-transparent px-6 pb-4 pt-6 text-lg leading-8 text-white outline-none placeholder:text-white/34 md:min-h-[194px] md:px-8 md:pt-8"
                placeholder="Tell EMOVEL what you want to create..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Product idea prompt"
              />

              <div className="relative flex min-h-20 flex-col gap-3 border-t border-white/[0.07] px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5">
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    aria-label="Add context"
                    onClick={() => setRefineOpen((value) => !value)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.055] text-white/78 transition hover:border-[#A855F7]/45 hover:bg-[#8B5CF6]/18 hover:text-white"
                  >
                    <PlusIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => setRefineOpen((value) => !value)}
                    className="rounded-full border border-white/[0.09] bg-white/[0.045] px-3.5 py-2 text-sm font-semibold text-white/68 transition hover:border-[#A855F7]/45 hover:bg-[#8B5CF6]/14 hover:text-white"
                  >
                    Refine Brief
                  </button>
                  <span className="rounded-full border border-[#8B5CF6]/35 bg-[#8B5CF6]/14 px-4 py-2 text-sm font-semibold text-violet-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    Workspace
                  </span>
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    {examples.map((example) => (
                      <button
                        key={example}
                        type="button"
                        onClick={() => setPrompt(example)}
                        className="rounded-full border border-white/[0.09] bg-white/[0.045] px-3.5 py-2 text-sm font-medium text-white/70 transition hover:border-[#A855F7]/45 hover:bg-[#8B5CF6]/14 hover:text-white"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerate}
                  className="generate-workspace-button group flex shrink-0 items-center justify-center gap-2.5 rounded-2xl bg-[#8B5CF6] px-6 py-4 text-base font-black text-white shadow-[0_18px_55px_rgba(139,92,246,0.38)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#A855F7] hover:shadow-[0_22px_70px_rgba(168,85,247,0.48)] md:px-7"
                >
                  Generate Workspace
                  <span className="transition group-hover:translate-x-0.5">
                    <ArrowIcon />
                  </span>
                </button>
              </div>

              {refineOpen ? (
                <div className="border-t border-white/[0.07] bg-black/10 px-4 py-4 md:px-5">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#A855F7]/80">
                        Refine Brief
                      </p>
                      <p className="mt-1 text-xs leading-5 text-white/42">
                        Optional context. Empty fields are inferred from your prompt.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBrief(emptyRefinedBrief)}
                      className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-xs font-bold text-white/48 transition hover:text-white"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    {refineFields.map((field) => (
                      <label key={field.key} className="grid gap-1.5">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/34">
                          {field.label}
                        </span>
                        <input
                          value={brief[field.key]}
                          onChange={(event) =>
                            setBrief((current) => ({
                              ...current,
                              [field.key]: event.target.value,
                            }))
                          }
                          placeholder={field.placeholder}
                          className="rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/24 focus:border-[#A855F7]/45 focus:bg-[#8B5CF6]/10"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      )}

      {stage === "generating" && (
        <section className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-8 px-4">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div
              className="animate-ambient h-[400px] w-[700px]"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(139,92,246,0.42), transparent 65%)",
                filter: "blur(60px)",
              }}
            />
          </div>

          <div className="animate-fade-in text-center">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#A855F7]">
              {aiMode === "ai" ? "AI Mode" : aiMode === "fallback" ? "Fallback Mode" : "Building your workspace"}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-white">
              {aiMode === "fallback" ? "Using deterministic local assets..." : "Generating production assets..."}
            </h2>
          </div>

          <div className="relative z-10 grid w-full gap-3 sm:grid-cols-2 md:grid-cols-3">
            {progressStages.map(({ id, label, status, delay }) => (
              <div
                key={id}
                className={`animate-card-in ${delay} rounded-2xl border border-[#8B5CF6]/20 bg-[#120A20]/75 p-5 backdrop-blur-2xl`}
              >
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-[#8B5CF6]/14 text-[#A855F7]">
                  <span className="h-2 w-2 rounded-full bg-current shadow-[0_0_22px_currentColor]" />
                </div>
                <p className="text-sm font-bold text-white/90">{label}</p>
                <p className="mt-1 text-xs text-white/45">{status}</p>
                <div className="mt-5 h-px w-full overflow-hidden rounded-full bg-[#8B5CF6]/15">
                  <div
                    className={`animate-progress-fill ${delay} h-full rounded-full`}
                    style={{ background: "linear-gradient(90deg, #8B5CF6, #A855F7)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
