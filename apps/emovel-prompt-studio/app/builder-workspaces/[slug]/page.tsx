import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyMarkdownButton } from "@/components/CopyMarkdownButton";
import { projectNameFromSlug, readBuilderWorkspace } from "@/lib/projects";

export const dynamic = "force-dynamic";

type BuilderWorkspacePageProps = {
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

export default async function BuilderWorkspacePage({ params }: BuilderWorkspacePageProps) {
  const files = await readBuilderWorkspace(params.slug);

  if (!files) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-blue">
            Builder Workspace
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.04em]">
            {projectNameFromSlug(params.slug)}
          </h1>
          <p className="mt-3 font-mono text-xs font-bold text-slate-600">
            projects/build-workspaces/{params.slug}/
          </p>
        </div>
        <Link
          className="rounded-emovel border border-line bg-white px-5 py-3 font-black"
          href={`/projects/${params.slug}`}
        >
          Back to Project
        </Link>
      </div>

      <p className="mb-5 rounded-emovel border border-line bg-white p-4 font-mono text-xs font-bold text-slate-600">
        Prep only: Prompt Studio has not run GPT-Pilot, Pythagora, shell commands, paid APIs, or database actions.
      </p>

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
                This file has not been created in the builder workspace yet.
              </div>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}
