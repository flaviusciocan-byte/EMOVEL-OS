import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { CopyMarkdownButton } from "@/components/CopyMarkdownButton";
import { createBuilderCommands, projectNameFromSlug, readBuilderWorkspace } from "@/lib/projects";

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

  const hasBuilderCommands = files.some((file) => file.filename === "BUILDER_COMMANDS.md" && file.exists);

  async function createBuilderCommandsAction() {
    "use server";

    await createBuilderCommands(params.slug);
    revalidatePath(`/builder-workspaces/${params.slug}`);
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
        <div className="flex flex-wrap gap-3">
          <Link
            className="rounded-emovel border border-line bg-white px-5 py-3 font-black"
            href={`/projects/${params.slug}`}
          >
            Back to Project
          </Link>
        </div>
      </div>

      <p className="mb-5 rounded-emovel border border-line bg-white p-4 font-mono text-xs font-bold text-slate-600">
        Prep only: Prompt Studio has not run GPT-Pilot, Pythagora, shell commands, paid APIs, or database actions.
      </p>
      <section className="mb-5 rounded-emovel border border-line bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-blue">
              Builder Commands
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">
              Manual GPT-Pilot command packet
            </h2>
          </div>
          <form action={createBuilderCommandsAction}>
            <button
              className="rounded-emovel bg-ink px-5 py-3 font-black text-white transition hover:-translate-y-0.5"
              type="submit"
            >
              {hasBuilderCommands ? "Refresh Builder Commands" : "Generate Builder Commands"}
            </button>
          </form>
        </div>
        <p className="mt-3 max-w-3xl leading-7 text-slate-600">
          Generates BUILDER_COMMANDS.md from config/tools.json with the registered GPT-Pilot path,
          recommended manual command, expected output folder, and safety notes.
        </p>
      </section>

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
