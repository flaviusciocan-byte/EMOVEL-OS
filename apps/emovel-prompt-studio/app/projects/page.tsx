import Link from "next/link";
import { listGeneratedProjects, type BuildStatus } from "@/lib/projects";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function statusBadgeClass(status: BuildStatus | null) {
  if (status === "Build Failed") {
    return "border-red-500/30 bg-red-500/10 text-red-400";
  }
  if (status === "Build Passed" || status === "Ready to Publish") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  }
  if (status === "Building") {
    return "border-violet-500/30 bg-violet-500/10 text-violet-400";
  }
  return "border-white/[0.07] bg-white/[0.03] text-white/40";
}

export default async function ProjectsPage() {
  const projects = await listGeneratedProjects();

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-violet-400">
            Generated Projects
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white md:text-4xl">
            Local pipeline outputs.
          </h1>
        </div>
        <Link
          className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(124,58,237,0.35)] transition duration-200 hover:-translate-y-0.5 hover:bg-violet-500"
          href="/new-project"
        >
          New Project
        </Link>
      </div>

      {projects.length > 0 ? (
        <section className="grid gap-3">
          {projects.map((project) => (
            <article
              className="grid gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 backdrop-blur-sm transition duration-200 hover:border-violet-500/15 hover:bg-white/[0.04] md:grid-cols-[1fr_auto] md:items-center"
              key={project.slug}
            >
              <div>
                <h2 className="text-xl font-bold tracking-[-0.02em] text-white">{project.name}</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 font-mono text-xs text-white/40">
                    {project.fileCount} markdown files
                  </span>
                  {project.buildStatus ? (
                    <span className={`rounded-full border px-3 py-1 font-mono text-xs ${statusBadgeClass(project.buildStatus)}`}>
                      {project.buildStatus}
                    </span>
                  ) : null}
                  <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 font-mono text-xs text-white/40">
                    {formatDate(project.lastModified)}
                  </span>
                  <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 font-mono text-xs text-white/30">
                    {project.slug}
                  </span>
                </div>
              </div>
              <Link
                className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-5 py-3 text-center text-sm font-bold text-white/70 transition duration-200 hover:border-violet-500/25 hover:bg-violet-500/[0.08] hover:text-violet-300"
                href={`/projects/${project.slug}`}
              >
                Open project
              </Link>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-10 text-center backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white">No generated projects yet.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/40">
            Run Production Pipeline from Prompt Studio to create a local project folder under
            projects/generated/.
          </p>
          <Link
            className="mt-6 inline-flex rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(124,58,237,0.35)] transition hover:-translate-y-0.5 hover:bg-violet-500"
            href="/new-project"
          >
            Create first project
          </Link>
        </section>
      )}
    </main>
  );
}
