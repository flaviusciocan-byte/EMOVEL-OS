import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { CopyMarkdownButton } from "@/components/CopyMarkdownButton";
import { createBuildHandoff, projectNameFromSlug, readGeneratedProject } from "@/lib/projects";

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

export default async function ProjectPage({ params }: ProjectPageProps) {
  const files = await readGeneratedProject(params.slug);

  if (!files) {
    notFound();
  }

  const hasBuildHandoff = files.some((file) => file.filename === "build-handoff.md" && file.exists);

  async function createBuildHandoffAction() {
    "use server";

    await createBuildHandoff(params.slug);
    revalidatePath(`/projects/${params.slug}`);
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
