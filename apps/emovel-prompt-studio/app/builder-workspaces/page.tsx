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
  if (status === "Build Failed") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (status === "Build Passed" || status === "Ready to Publish") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "Building") {
    return "border-blue/20 bg-blue/10 text-blue";
  }

  return "border-line bg-cloud text-slate-700";
}

export default async function BuilderWorkspacesPage() {
  const workspaces = await listBuilderWorkspaces();

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-blue">
            Builder Workspaces
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.04em]">
            Manual build packets and status.
          </h1>
        </div>
        <Link className="rounded-emovel border border-line bg-white px-5 py-3 font-black" href="/projects">
          Back to Projects
        </Link>
      </div>

      {workspaces.length > 0 ? (
        <section className="grid gap-3">
          {workspaces.map((workspace) => (
            <article
              className="grid gap-4 rounded-emovel border border-line bg-white p-5 md:grid-cols-[1fr_auto] md:items-center"
              key={workspace.slug}
            >
              <div>
                <h2 className="text-2xl font-black tracking-[-0.03em]">{workspace.name}</h2>
                <div className="mt-3 flex flex-wrap gap-2 font-mono text-xs font-bold text-slate-600">
                  <span
                    className={`rounded-full border px-3 py-1 ${statusBadgeClass(workspace.buildStatus)}`}
                  >
                    {workspace.buildStatus || "Draft"}
                  </span>
                  <span className="rounded-full bg-cloud px-3 py-1">{workspace.fileCount} markdown files</span>
                  <span className="rounded-full bg-cloud px-3 py-1">
                    Modified {formatDate(workspace.lastModified)}
                  </span>
                  <span className="rounded-full bg-cloud px-3 py-1">{workspace.slug}</span>
                </div>
              </div>
              <Link
                className="rounded-emovel bg-ink px-5 py-3 text-center font-black text-white transition hover:-translate-y-0.5"
                href={`/builder-workspaces/${workspace.slug}`}
              >
                Open workspace
              </Link>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-emovel border border-line bg-white p-8">
          <h2 className="text-2xl font-black">No builder workspaces yet.</h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Open a generated project and click Create Builder Workspace to prepare local builder files.
          </p>
          <Link className="mt-6 inline-flex rounded-emovel bg-blue px-5 py-3 font-black text-white" href="/projects">
            View projects
          </Link>
        </section>
      )}
    </main>
  );
}
