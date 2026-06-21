import Link from "next/link";
import { notFound } from "next/navigation";
import {
  projectNameFromSlug,
  readActionQueue,
  readBuildStatus,
  readBuilderWorkspace,
  readExecutorPrompts,
  readGeneratedProject,
  readPublishPackage,
  readShopStatus
} from "@/lib/projects";

export const dynamic = "force-dynamic";

type WorkspaceSummaryPageProps = {
  params: {
    slug: string;
  };
};

function readinessBadge(ready: boolean) {
  return ready
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-line bg-cloud text-slate-700";
}

export default async function WorkspaceSummaryPage({ params }: WorkspaceSummaryPageProps) {
  const [projectFiles, tasks, executorPrompts, builderFiles, publishFiles, buildStatus, shopStatus] =
    await Promise.all([
      readGeneratedProject(params.slug),
      readActionQueue(params.slug),
      readExecutorPrompts(params.slug),
      readBuilderWorkspace(params.slug),
      readPublishPackage(params.slug),
      readBuildStatus(params.slug),
      readShopStatus(params.slug)
    ]);

  if (!projectFiles) {
    notFound();
  }

  const generatedFiles = [
    ...projectFiles.filter((file) => file.exists).map((file) => `projects/generated/${params.slug}/${file.filename}`),
    ...executorPrompts.map((file) => `projects/generated/${params.slug}/${file.filename}`),
    ...(builderFiles || [])
      .filter((file) => file.exists)
      .map((file) => `projects/build-workspaces/${params.slug}/${file.filename}`),
    ...(publishFiles || [])
      .filter((file) => file.exists)
      .map((file) => `projects/build-workspaces/${params.slug}/publish-package/${file.filename}`)
  ];

  const taskCount = tasks?.length || 0;
  const builderReady = Boolean(
    builderFiles?.some((file) => file.filename === "BUILDER_COMMANDS.md" && file.exists) &&
      builderFiles?.some((file) => file.filename === "BUILDER_CONTEXT.md" && file.exists)
  );
  const publishPackageReady = Boolean(publishFiles?.some((file) => file.exists));
  const publishReady = publishPackageReady || buildStatus === "Ready to Publish" || shopStatus === "Ready for Gumroad";

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-blue">
            Workspace Summary
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.04em]">
            {projectNameFromSlug(params.slug)}
          </h1>
          <p className="mt-3 font-mono text-xs font-bold text-slate-600">
            projects/generated/{params.slug}/
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="rounded-emovel bg-ink px-5 py-3 font-black text-white" href={`/projects/${params.slug}`}>
            Open Project
          </Link>
          <Link
            className="rounded-emovel border border-line bg-white px-5 py-3 font-black"
            href={`/builder-workspaces/${params.slug}`}
          >
            Builder Workspace
          </Link>
          <Link className="rounded-emovel border border-line bg-white px-5 py-3 font-black" href="/execution">
            Execution Inbox
          </Link>
        </div>
      </div>

      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <article className="rounded-emovel border border-line bg-white p-5">
          <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            Generated Files
          </p>
          <p className="mt-3 text-4xl font-black tracking-[-0.04em]">{generatedFiles.length}</p>
        </article>
        <article className="rounded-emovel border border-line bg-white p-5">
          <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            Task Count
          </p>
          <p className="mt-3 text-4xl font-black tracking-[-0.04em]">{taskCount}</p>
        </article>
        <article className="rounded-emovel border border-line bg-white p-5">
          <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            Builder Readiness
          </p>
          <span className={`mt-3 inline-flex rounded-full border px-3 py-1 font-mono text-xs font-black ${readinessBadge(builderReady)}`}>
            {builderReady ? "Ready" : "Needs setup"}
          </span>
        </article>
        <article className="rounded-emovel border border-line bg-white p-5">
          <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            Publish Readiness
          </p>
          <span className={`mt-3 inline-flex rounded-full border px-3 py-1 font-mono text-xs font-black ${readinessBadge(publishReady)}`}>
            {publishReady ? "Prepared" : "Not prepared"}
          </span>
        </article>
      </section>

      <section className="mb-6 rounded-emovel border border-line bg-white p-5">
        <h2 className="text-2xl font-black tracking-[-0.03em]">Project Info</h2>
        <dl className="mt-4 grid gap-3 text-sm font-bold text-slate-700 md:grid-cols-2">
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">Slug</dt>
            <dd>{params.slug}</dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">Build status</dt>
            <dd>{buildStatus || "Draft"}</dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">Shop status</dt>
            <dd>{shopStatus || "Not set"}</dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">Executor prompts</dt>
            <dd>{executorPrompts.length}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-emovel border border-line bg-white p-5">
        <h2 className="text-2xl font-black tracking-[-0.03em]">Generated Files</h2>
        {generatedFiles.length ? (
          <div className="mt-4 max-h-[520px] overflow-auto rounded-emovel border border-line bg-cloud p-4">
            <ul className="grid gap-2 font-mono text-xs font-bold text-slate-700">
              {generatedFiles.map((file) => (
                <li key={file}>{file}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-4 text-sm font-bold text-slate-600">No generated files found for this workspace yet.</p>
        )}
      </section>
    </main>
  );
}
