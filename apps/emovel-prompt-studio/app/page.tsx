import Link from "next/link";

const sources = [
  "knowledge/skills/",
  "pipelines/production-pipeline-v1/",
  "project-templates/"
];

const quickLinks = [
  { href: "/new-project", label: "New Project", description: "Turn a prompt into assets", primary: true },
  { href: "/output-preview", label: "Output Preview", description: "Preview panel structure" },
  { href: "/projects", label: "Projects", description: "Browse generated outputs" }
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 md:py-24">
      {/* Hero */}
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-violet-400">
          EMOVEL-OS — Internal Tool
        </p>
        <h1 className="mt-5 text-5xl font-black tracking-[-0.05em] text-white md:text-7xl lg:text-8xl">
          Prompt Studio
          <span
            className="block bg-gradient-to-r from-violet-400 via-indigo-300 to-violet-300 bg-clip-text text-transparent"
          >
            for production assets.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/50 md:text-lg">
          Input a raw prompt, choose the product type, select outputs, and generate
          local markdown assets using EMOVEL skills and pipeline templates.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                link.primary
                  ? "rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(124,58,237,0.45)] transition duration-200 hover:-translate-y-0.5 hover:bg-violet-500 hover:shadow-[0_0_32px_rgba(124,58,237,0.55)]"
                  : "rounded-xl border border-white/[0.08] bg-white/[0.04] px-6 py-3 text-sm font-bold text-white/70 transition duration-200 hover:bg-white/[0.08] hover:text-white"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Source of truth panel */}
      <div className="mx-auto mt-20 max-w-3xl">
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between">
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-violet-400">
              Source of truth
            </p>
            <span className="rounded-lg border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-violet-400">
              Local v1
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {sources.map((source) => (
              <div
                key={source}
                className="rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 py-3 font-mono text-sm text-white/50 transition hover:border-violet-500/20 hover:bg-violet-500/[0.06] hover:text-white/70"
              >
                {source}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
