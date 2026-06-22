"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleGenerate = useCallback(() => {
    if (stage !== "idle") return;
    const text = prompt.trim();
    if (text) sessionStorage.setItem("emovel-pending-prompt", text);
    setStage("generating");
    timerRef.current = setTimeout(() => router.push("/new-project"), 2200);
  }, [prompt, router, stage]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

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
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.055] text-white/78 transition hover:border-[#A855F7]/45 hover:bg-[#8B5CF6]/18 hover:text-white"
                  >
                    <PlusIcon />
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
              Building your workspace
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-white">
              Generating production assets...
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
