import Link from "next/link";
import { listGeneratedProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export default async function ProjectsPage() {
  const projects = await listGeneratedProjects();

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-blue">
            Generated Projects
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.04em]">
            Local pipeline outputs ready to reuse.
          </h1>
        </div>
        <Link className="rounded-emovel bg-blue px-5 py-3 font-black text-white" href="/new-project">
          New Project
        </Link>
      </div>

      {projects.length > 0 ? (
        <section className="grid gap-3">
          {projects.map((project) => (
            <article
              className="grid gap-4 rounded-emovel border border-line bg-white p-5 md:grid-cols-[1fr_auto] md:items-center"
              key={project.slug}
            >
              <div>
                <h2 className="text-2xl font-black tracking-[-0.03em]">{project.name}</h2>
                <div className="mt-3 flex flex-wrap gap-2 font-mono text-xs font-bold text-slate-600">
                  <span className="rounded-full bg-cloud px-3 py-1">{project.fileCount} markdown files</span>
                  <span className="rounded-full bg-cloud px-3 py-1">
                    Modified {formatDate(project.lastModified)}
                  </span>
                  <span className="rounded-full bg-cloud px-3 py-1">{project.slug}</span>
                </div>
              </div>
              <Link
                className="rounded-emovel bg-ink px-5 py-3 text-center font-black text-white transition hover:-translate-y-0.5"
                href={`/projects/${project.slug}`}
              >
                Open project
              </Link>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-emovel border border-line bg-white p-8">
          <h2 className="text-2xl font-black">No generated projects yet.</h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Run Production Pipeline from Prompt Studio to create a local project folder under
            projects/generated/.
          </p>
          <Link className="mt-6 inline-flex rounded-emovel bg-blue px-5 py-3 font-black text-white" href="/new-project">
            Create first project
          </Link>
        </section>
      )}
    </main>
  );
}
