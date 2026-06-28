import Link from "next/link";
import { PromptEngineDemo } from "@/components/prompt-engine/PromptEngineDemo";

export const metadata = {
  title: "EMOVEL Prompt Engine",
  description: "Turn a raw idea into a premium prompt package.",
};

const cards = [
  ["Intent Map", "Clarifies the product, audience, problem, mechanism, and commercial angle."],
  ["Prompt Stack", "Separates context, constraints, instructions, and output format so the result is easier to control."],
  ["Builder Handoff", "Packages the page plan, copy direction, and execution brief for the next step."],
];

const steps = [
  ["01", "Drop the raw idea", "Start with a messy note, a product angle, or a launch thought."],
  ["02", "Refine the package", "The engine turns direction into a controlled prompt package."],
  ["03", "Generate the site brief", "Generate the site brief and builder-ready package."],
];

const outputRows = [
  "Refined product premise",
  "Audience and problem frame",
  "Mechanism-driven offer angle",
  "Page section plan",
  "Copy and CTA direction",
  "Builder-ready prompt package",
];

function PromptPackageVisual() {
  return (
    <div className="group relative mx-auto w-full max-w-[520px] [perspective:1400px]">
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[40px] bg-[#C7A45A]/[0.10] blur-[90px]" />
      <div className="absolute inset-x-12 bottom-0 h-24 rounded-[50%] bg-black/70 blur-2xl" />
      <div className="relative [transform-style:preserve-3d] [transform:rotateX(6deg)_rotateY(-9deg)] [will-change:transform] transition-transform duration-700 ease-out sm:[transform:rotateX(9deg)_rotateY(-14deg)_rotateZ(1deg)] sm:group-hover:[transform:rotateX(5deg)_rotateY(-7deg)]">
        <div className="absolute left-2 top-8 z-20 rounded-2xl border border-white/[0.1] bg-[#10091D]/90 px-4 py-3 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl [transform:translateZ(36px)] sm:-left-6 sm:top-10 sm:[transform:translateZ(70px)]">
          <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#E9D8A6]">Signal</p>
          <p className="mt-1 text-xs font-bold text-white/80">Input Signal</p>
        </div>

        <div className="absolute bottom-8 right-2 z-20 rounded-2xl border border-white/[0.1] bg-[#10091D]/90 px-4 py-3 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl [transform:translateZ(42px)] sm:-right-5 sm:bottom-12 sm:[transform:translateZ(90px)]">
          <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#C7A45A]">Output</p>
          <p className="mt-1 text-xs font-bold text-white/80">Builder Output</p>
        </div>

        <div className="overflow-hidden rounded-[30px] border border-white/[0.1] bg-[#0B0614] shadow-[0_50px_140px_rgba(0,0,0,0.72),0_0_80px_rgba(199,164,90,0.24)] ring-1 ring-inset ring-white/[0.05] [transform:translateZ(30px)]">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
                Controlled Package
              </p>
              <p className="mt-1 text-sm font-black text-white">EMOVEL Engine</p>
            </div>
            <span className="rounded-full border border-[#C7A45A]/30 bg-[#C7A45A]/12 px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#E9D8A6]">
              Ready for Handoff
            </span>
          </div>

          <div className="grid gap-3 p-5">
            {[
              ["Raw Idea", "Launch an AI productized service"],
              ["Mechanism", "Clarity before execution"],
              ["Audience", "Founders preparing a paid launch"],
              ["Offer", "Pilot package with premium upgrade"],
              ["Page Plan", "Hero, problem, mechanism, offer, proof, CTA"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-[#E9D8A6]/70">
                  {label}
                </p>
                <p className="mt-1 text-sm leading-5 text-white/75">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PromptEnginePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#070707] text-white">
      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-32 lg:grid-cols-[minmax(0,1fr)_560px] lg:px-8 lg:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(58%_46%_at_12%_-4%,rgba(199,164,90,0.20),transparent_62%)]" />
        <div className="pointer-events-none absolute -right-24 top-10 h-[420px] w-[420px] rounded-full bg-[#3B4BFF]/[0.08] blur-[150px]" />
        <div className="relative z-10">
          <p className="font-mono text-[11px] font-black uppercase tracking-[0.28em] text-[#E9D8A6]">
            EMOVEL Prompt Engine
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.96] tracking-[-0.055em] text-white md:text-7xl">
            Turn a rough idea into a launch-ready prompt package.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/62">
            EMOVEL structures your raw direction into a clear product brief, page plan, copy angle, and builder-ready prompt system.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#idea-input"
              className="rounded-2xl bg-[#C7A45A] px-6 py-3.5 text-sm font-black text-white shadow-[0_18px_55px_rgba(199,164,90,0.34)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#E9D8A6] hover:shadow-[0_22px_70px_rgba(199,164,90,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E9D8A6]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070707]"
            >
              Generate Prompt Package
            </Link>
            <Link
              href="#example"
              className="rounded-2xl border border-white/[0.1] bg-white/[0.04] px-6 py-3.5 text-sm font-black text-white/72 backdrop-blur-md transition duration-300 hover:border-[#E9D8A6]/35 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E9D8A6]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070707]"
            >
              View Output Example
            </Link>
          </div>

          <PromptEngineDemo />
        </div>

        <div id="example" className="relative z-10 overflow-hidden py-2">
          <PromptPackageVisual />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map(([title, body], index) => (
            <article key={title} className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_18px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[#C7A45A]/30 hover:shadow-[0_26px_90px_rgba(0,0,0,0.5),0_0_50px_rgba(199,164,90,0.14)]">
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C7A45A]/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#E9D8A6]/55">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-3 text-lg font-black tracking-[-0.025em] text-white">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/60">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div>
            <p className="font-mono text-[11px] font-black uppercase tracking-[0.26em] text-[#C7A45A]">How it works</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.045em] text-white">From loose thought to usable system.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map(([step, title, body]) => (
              <article key={step} className="rounded-2xl border border-white/[0.08] bg-[#0D0717] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[#C7A45A]/25">
                <p className="font-mono text-sm font-black text-[#E9D8A6]">{step}</p>
                <h3 className="mt-4 text-lg font-black tracking-[-0.02em] text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/60">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="rounded-[30px] border border-white/[0.08] bg-white/[0.035] p-7 shadow-[0_30px_110px_rgba(0,0,0,0.42)] backdrop-blur-2xl md:p-10">
          <p className="font-mono text-[11px] font-black uppercase tracking-[0.26em] text-[#E9D8A6]">What you receive</p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div>
              <h2 className="max-w-2xl text-4xl font-black tracking-[-0.045em] text-white">
                The result is a controlled package, not a fragile prompt.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/60">
                Every output is shaped for handoff: enough structure for a builder, enough strategy for a launch, and enough constraint to avoid generic, hard-to-control output.
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-2">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/35">Output spec</span>
                <span className="font-mono text-[10px] text-white/25">{outputRows.length} fields</span>
              </div>
              <div className="grid gap-2">
                {outputRows.map((row, index) => (
                  <div key={row} className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3">
                    <span className="font-mono text-[10px] font-black text-[#E9D8A6]/70">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-sm font-semibold text-white/72">{row}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-28 pt-16 text-center">
        <div className="rounded-[30px] border border-[#C7A45A]/25 bg-[#100719] p-8 shadow-[0_0_100px_rgba(199,164,90,0.18)] md:p-14">
          <p className="font-mono text-[11px] font-black uppercase tracking-[0.26em] text-[#C7A45A]">Get started</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black tracking-[-0.05em] text-white md:text-6xl">
            Bring the idea. Leave with the system.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/60">
            Start from plain language and get a structured prompt package ready for page generation, copy, and build handoff.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex rounded-2xl bg-[#C7A45A] px-6 py-3.5 text-sm font-black text-white shadow-[0_18px_55px_rgba(199,164,90,0.34)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#E9D8A6] hover:shadow-[0_22px_70px_rgba(199,164,90,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E9D8A6]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#100719]"
          >
            Open EMOVEL workspace
          </Link>
        </div>
      </section>
    </main>
  );
}
