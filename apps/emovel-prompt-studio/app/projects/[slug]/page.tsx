import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { CopyMarkdownButton } from "@/components/CopyMarkdownButton";
import {
  builderWorkspaceExists,
  createBuildHandoff,
  createBuilderWorkspace,
  createGptPilotBuildHandoff,
  projectNameFromSlug,
  readBuildStatus,
  readGeneratedProject,
  type BuildStatus
} from "@/lib/projects";

export const dynamic = "force-dynamic";

type ProjectPageProps = {
  params: {
    slug: string;
  };
};

function titleFromFilename(filename: string) {
  return filename
    .replace(/\.md$/, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
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

export default async function ProjectPage({ params }: ProjectPageProps) {
  const files = await readGeneratedProject(params.slug);
  const buildStatus = await readBuildStatus(params.slug);

  if (!files) {
    notFound();
  }

  const hasBuildHandoff = files.some((file) => file.filename === "build-handoff.md" && file.exists);
  const hasGptPilotHandoff = files.some((file) => file.filename === "gpt-pilot-prompt.md" && file.exists);
  const hasBuilderWorkspace = await builderWorkspaceExists(params.slug);

  async function createBuildHandoffAction() {
    "use server";

    await createBuildHandoff(params.slug);
    revalidatePath(`/projects/${params.slug}`);
  }

  async function createGptPilotBuildAction() {
    "use server";

    await createGptPilotBuildHandoff(params.slug);
    revalidatePath(`/projects/${params.slug}`);
  }

  async function createBuilderWorkspaceAction() {
    "use server";

    await createBuilderWorkspace(params.slug);
    revalidatePath(`/projects/${params.slug}`);
    revalidatePath(`/builder-workspaces/${params.slug}`);
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-blue">
            Project
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.04em]">
            {projectNameFromSlug(params.slug)}
          </h1>
          <p className="mt-3 font-mono text-xs font-bold text-slate-600">
            projects/generated/{params.slug}/
          </p>
          {buildStatus ? (
            <span
              className={`mt-4 inline-flex rounded-full border px-3 py-1 font-mono text-xs font-black ${statusBadgeClass(
                buildStatus
              )}`}
            >
              {buildStatus}
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <form action={createBuildHandoffAction}>
            <button
              className="rounded-emovel bg-blue px-5 py-3 font-black text-white transition hover:-translate-y-0.5"
              type="submit"
            >
              Create Build Handoff
            </button>
          </form>
          <form action={createGptPilotBuildAction}>
            <button
              className="rounded-emovel bg-ink px-5 py-3 font-black text-white transition hover:-translate-y-0.5"
              type="submit"
            >
              Prepare GPT-Pilot Build
            </button>
          </form>
          <form action={createBuilderWorkspaceAction}>
            <button
              className="rounded-emovel bg-mint px-5 py-3 font-black text-ink transition hover:-translate-y-0.5"
              type="submit"
            >
              Create Builder Workspace
            </button>
          </form>
          {hasBuilderWorkspace ? (
            <Link
              className="rounded-emovel border border-line bg-white px-5 py-3 font-black"
              href={`/builder-workspaces/${params.slug}`}
            >
              Open Builder Workspace
            </Link>
          ) : null}
          <Link className="rounded-emovel border border-line bg-white px-5 py-3 font-black" href="/projects">
            Back to Projects
          </Link>
        </div>
      </div>

      {hasBuildHandoff ? (
        <p className="mb-5 rounded-emovel border border-line bg-white p-4 font-mono text-xs font-bold text-slate-600">
          build-handoff.md is available below and can be copied into a builder workflow.
        </p>
      ) : null}
      {hasGptPilotHandoff ? (
        <p className="mb-5 rounded-emovel border border-line bg-white p-4 font-mono text-xs font-bold text-slate-600">
          gpt-pilot-prompt.md and README_BUILD.md are available below. GPT-Pilot has not been run.
        </p>
      ) : null}
      {hasBuilderWorkspace ? (
        <p className="mb-5 rounded-emovel border border-line bg-white p-4 font-mono text-xs font-bold text-slate-600">
          Builder workspace is ready at projects/build-workspaces/{params.slug}/. No builder commands have been run.
        </p>
      ) : null}

      <section className="grid gap-4">
        {files.map((file) => (
          <article className="overflow-hidden rounded-emovel border border-line bg-white" key={file.filename}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-cloud px-5 py-4">
              <div>
                <h2 className="text-xl font-black tracking-[-0.02em]">{titleFromFilename(file.filename)}</h2>
                <p className="mt-1 font-mono text-xs font-bold text-slate-600">{file.filename}</p>
              </div>
              <CopyMarkdownButton content={file.content} />
            </div>
            {file.exists ? (
              <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap p-5 font-mono text-sm leading-7 text-slate-800">
                {file.content}
              </pre>
            ) : (
              <div className="p-5 text-sm font-bold text-slate-500">
                This file has not been generated for this project yet.
              </div>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}
