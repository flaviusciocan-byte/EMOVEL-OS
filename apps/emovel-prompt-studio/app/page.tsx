import Link from "next/link";

const sources = [
  "knowledge/skills/",
  "pipelines/production-pipeline-v1/",
  "project-templates/"
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <section className="rounded-emovel border border-line bg-white p-6 md:p-10">
        <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-blue">EMOVEL-OS internal app</p>
        <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1 className="text-4xl font-black tracking-[-0.05em] md:text-7xl">
              Prompt Studio for production assets.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Input a raw prompt, choose the product type, select outputs, and generate local markdown assets using EMOVEL skills and pipeline templates. No paid APIs are connected in v1.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="rounded-emovel bg-blue px-5 py-3 font-black text-white" href="/new-project">
                New Project
              </Link>
              <Link className="rounded-emovel border border-line px-5 py-3 font-black" href="/output-preview">
                Output Preview
              </Link>
              <Link className="rounded-emovel border border-line px-5 py-3 font-black" href="/projects">
                Projects
              </Link>
            </div>
          </div>
          <div className="rounded-emovel bg-graphite p-5 text-white">
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-mint">Source of truth</p>
            <div className="mt-5 grid gap-3">
              {sources.map((source) => (
                <div className="rounded-emovel border border-white/15 bg-white/[0.06] p-4 font-mono text-sm" key={source}>
                  {source}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
