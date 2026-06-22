import Link from "next/link";
import { LocalWorkspaceShell } from "@/components/LocalWorkspaceShell";
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
    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
    : "border-white/[0.07] bg-white/[0.03] text-white/40";
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
    return <LocalWorkspaceShell id={params.slug} />;
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
  const publishPackageCount = publishFiles?.filter((file) => file.exists).length || 0;
  const publishReady = publishPackageReady && buildStatus === "Ready to Publish";
  const shopReady = shopStatus === "Ready for Gumroad" || shopStatus === "Listed" || shopStatus === "Published";
  const gumroadReady = publishPackageReady && shopStatus === "Ready for Gumroad";

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-violet-400">
            Workspace Summary
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white md:text-4xl">
            {projectNameFromSlug(params.slug)}
          </h1>
          <p className="mt-2 font-mono text-[10px] text-white/30">
            projects/generated/{params.slug}/
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_18px_rgba(124,58,237,0.35)] transition duration-200 hover:-translate-y-0.5 hover:bg-violet-500"
            href={`/projects/${params.slug}`}
          >
            Open Project
          </Link>
          <Link
            className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-5 py-2.5 text-sm font-bold text-white/60 transition duration-200 hover:bg-white/[0.08] hover:text-white/90"
            href={`/builder-workspaces/${params.slug}`}
          >
            Builder Workspace
          </Link>
          <Link
            className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-5 py-2.5 text-sm font-bold text-white/60 transition duration-200 hover:bg-white/[0.08] hover:text-white/90"
            href="/execution"
          >
            Execution Inbox
          </Link>
        </div>
      </div>

      {/* Stat cards row 1 */}
      <section className="mb-4 grid gap-3 md:grid-cols-4">
        {[
          { label: "Generated Files", value: generatedFiles.length },
          { label: "Task Count", value: taskCount },
          null,
          null
        ].map((item, i) =>
          item ? (
            <article
              key={item.label}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-sm"
            >
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
                {item.label}
              </p>
              <p className="mt-3 text-4xl font-black tracking-[-0.04em] text-white">{item.value}</p>
            </article>
          ) : (
            <article
              key={i}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-sm"
            >
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
                {i === 2 ? "Builder Readiness" : "Publish Readiness"}
              </p>
              <span
                className={`mt-3 inline-flex rounded-full border px-3 py-1 font-mono text-xs font-bold ${readinessBadge(i === 2 ? builderReady : publishReady)}`}
              >
                {i === 2
                  ? builderReady ? "Ready" : "Needs setup"
                  : publishReady ? "Prepared" : "Not prepared"}
              </span>
            </article>
          )
        )}
      </section>

      {/* Stat cards row 2 */}
      <section className="mb-4 grid gap-3 md:grid-cols-3">
        <article className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-sm">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
            Publish Package
          </p>
          <span className={`mt-3 inline-flex rounded-full border px-3 py-1 font-mono text-xs font-bold ${readinessBadge(publishPackageReady)}`}>
            {publishPackageReady ? `${publishPackageCount} files ready` : "Missing"}
          </span>
        </article>
        <article className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-sm">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
            Shop Readiness
          </p>
          <span className={`mt-3 inline-flex rounded-full border px-3 py-1 font-mono text-xs font-bold ${readinessBadge(shopReady)}`}>
            {shopStatus || "Not set"}
          </span>
        </article>
        <article className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-sm">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
            Gumroad Readiness
          </p>
          <span className={`mt-3 inline-flex rounded-full border px-3 py-1 font-mono text-xs font-bold ${readinessBadge(gumroadReady)}`}>
            {gumroadReady ? "Ready for Gumroad" : "Needs review"}
          </span>
        </article>
      </section>

      {/* Project info */}
      <section className="mb-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 backdrop-blur-sm">
        <h2 className="mb-4 text-lg font-black tracking-[-0.03em] text-white">Project Info</h2>
        <dl className="grid gap-4 text-sm md:grid-cols-2">
          {[
            { label: "Slug", value: params.slug },
            { label: "Build status", value: buildStatus || "Draft" },
            { label: "Shop status", value: shopStatus || "Not set" },
            { label: "Executor prompts", value: String(executorPrompts.length) }
          ].map((row) => (
            <div key={row.label}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">
                {row.label}
              </dt>
              <dd className="mt-1 font-semibold text-white/75">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Generated files */}
      <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 backdrop-blur-sm">
        <h2 className="mb-4 text-lg font-black tracking-[-0.03em] text-white">Generated Files</h2>
        {generatedFiles.length ? (
          <div className="max-h-[520px] overflow-auto rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <ul className="grid gap-2 font-mono text-xs text-white/40">
              {generatedFiles.map((file) => (
                <li key={file}>{file}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-white/35">
            No generated files found for this workspace yet.
          </p>
        )}
      </section>
    </main>
  );
}
