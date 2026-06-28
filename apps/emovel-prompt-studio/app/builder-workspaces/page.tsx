import Link from "next/link";
import { listBuilderWorkspaces, type BuildStatus } from "@/lib/projects";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function statusBadgeClass(status: BuildStatus | null) {
  if (status === "Build Failed") return "border-red-500/30 bg-red-500/10 text-red-400";
  if (status === "Build Passed" || status === "Ready to Publish") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  if (status === "Building") return "border-[#C7A45A]/30 bg-[#C7A45A]/10 text-[#C7A45A]";
  return "border-white/[0.07] bg-white/[0.03] text-white/40";
}

export default async function BuilderWorkspacesPage() {
  const workspaces = await listBuilderWorkspaces();

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-[#C7A45A]">
            Builder Workspaces
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white md:text-4xl">
            Manual build packets and status.
          </h1>
        </div>
        <Link
          className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-5 py-2.5 text-sm font-bold text-white/60 transition hover:bg-white/[0.08] hover:text-white/90"
          href="/projects"
        >
          ← Projects
        </Link>
      </div>

      {workspaces.length > 0 ? (
        <section className="grid gap-3">
          {workspaces.map((workspace) => (
            <article
              className="grid gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 backdrop-blur-sm transition hover:border-[#C7A45A]/15 md:grid-cols-[1fr_auto] md:items-center"
              key={workspace.slug}
            >
              <div>
                <h2 className="text-xl font-bold text-white/90">{workspace.name}</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`rounded-full border px-3 py-1 font-mono text-xs font-bold ${statusBadgeClass(workspace.buildStatus)}`}>
                    {workspace.buildStatus || "Draft"}
                  </span>
                  <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 font-mono text-xs text-white/40">
                    {workspace.fileCount} markdown files
                  </span>
                  <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 font-mono text-xs text-white/40">
                    {formatDate(workspace.lastModified)}
                  </span>
                  <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 font-mono text-xs text-white/30">
                    {workspace.slug}
                  </span>
                </div>
              </div>
              <Link
                className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-5 py-3 text-center text-sm font-bold text-white/70 transition hover:border-[#C7A45A]/25 hover:bg-[#C7A45A]/[0.08] hover:text-[#E9D8A6]"
                href={`/builder-workspaces/${workspace.slug}`}
              >
                Open workspace
              </Link>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-10 text-center">
          <h2 className="text-xl font-bold text-white/80">No builder workspaces yet.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/40">
            Open a generated project and click Create Builder Workspace to prepare local builder files.
          </p>
          <Link
            className="mt-6 inline-flex rounded-xl bg-[#A8863F] px-5 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(124,58,237,0.35)] transition hover:-translate-y-0.5 hover:bg-[#C7A45A]"
            href="/projects"
          >
            View projects
          </Link>
        </section>
      )}
    </main>
  );
}
