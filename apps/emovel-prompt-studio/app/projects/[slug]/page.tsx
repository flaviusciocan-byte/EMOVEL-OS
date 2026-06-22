import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { CopyMarkdownButton } from "@/components/CopyMarkdownButton";
import {
  actionQueueStatuses,
  builderWorkspaceExists,
  createActionQueue,
  createBuildHandoff,
  createBuilderWorkspace,
  createExecutorPrompts,
  createGptPilotBuildHandoff,
  projectNameFromSlug,
  readActionQueue,
  readBuildStatus,
  readExecutorPrompts,
  readGeneratedProject,
  updateActionQueueTaskStatus,
  type ActionQueueStatus,
  type ActionQueueTask,
  type BuildStatus
} from "@/lib/projects";

export const dynamic = "force-dynamic";

type ProjectPageProps = {
  params: { slug: string };
};

function titleFromFilename(filename: string) {
  return filename
    .replace(/\.md$/, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function statusBadgeClass(status: BuildStatus | null) {
  if (status === "Build Failed") return "border-red-500/30 bg-red-500/10 text-red-400";
  if (status === "Build Passed" || status === "Ready to Publish") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  if (status === "Building") return "border-violet-500/30 bg-violet-500/10 text-violet-400";
  return "border-white/[0.07] bg-white/[0.03] text-white/40";
}

function actionStatusBadgeClass(status: ActionQueueStatus) {
  if (status === "Done") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  if (status === "Blocked") return "border-red-500/30 bg-red-500/10 text-red-400";
  if (status === "In Progress") return "border-violet-500/30 bg-violet-500/10 text-violet-400";
  return "border-white/[0.07] bg-white/[0.03] text-white/40";
}

function tasksForGroup(tasks: ActionQueueTask[], group: string) {
  return tasks.filter((task) => task.group === group);
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const files = await readGeneratedProject(params.slug);
  const buildStatus = await readBuildStatus(params.slug);
  const actionQueue = await readActionQueue(params.slug);
  const executorPrompts = await readExecutorPrompts(params.slug);

  if (!files) notFound();

  const hasBuildHandoff = files.some((file) => file.filename === "build-handoff.md" && file.exists);
  const hasGptPilotHandoff = files.some((file) => file.filename === "gpt-pilot-prompt.md" && file.exists);
  const hasExecutionPlan = files.some((file) => file.filename === "execution-plan.md" && file.exists);
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

  async function createActionQueueAction() {
    "use server";
    await createActionQueue(params.slug);
    revalidatePath(`/projects/${params.slug}`);
  }

  async function updateActionQueueStatusAction(formData: FormData) {
    "use server";
    const taskId = String(formData.get("taskId") || "");
    const status = String(formData.get("status") || "") as ActionQueueStatus;
    await updateActionQueueTaskStatus(params.slug, taskId, status);
    revalidatePath(`/projects/${params.slug}`);
  }

  async function createExecutorPromptsAction() {
    "use server";
    await createExecutorPrompts(params.slug);
    revalidatePath(`/projects/${params.slug}`);
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-violet-400">Project</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white md:text-4xl">
            {projectNameFromSlug(params.slug)}
          </h1>
          <p className="mt-2 font-mono text-xs text-white/30">
            projects/generated/{params.slug}/
          </p>
          {buildStatus ? (
            <span className={`mt-3 inline-flex rounded-full border px-3 py-1 font-mono text-xs font-bold ${statusBadgeClass(buildStatus)}`}>
              {buildStatus}
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <form action={createBuildHandoffAction}>
            <button className="cursor-pointer rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white shadow-[0_0_16px_rgba(124,58,237,0.35)] transition hover:-translate-y-0.5 hover:bg-violet-500" type="submit">
              Create Build Handoff
            </button>
          </form>
          <form action={createGptPilotBuildAction}>
            <button className="cursor-pointer rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-white/70 transition hover:bg-white/[0.08] hover:text-white" type="submit">
              Prepare GPT-Pilot Build
            </button>
          </form>
          <form action={createBuilderWorkspaceAction}>
            <button className="cursor-pointer rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-bold text-emerald-300 transition hover:-translate-y-0.5 hover:bg-emerald-500/15" type="submit">
              Create Builder Workspace
            </button>
          </form>
          {hasBuilderWorkspace ? (
            <Link className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-white/70 transition hover:bg-white/[0.08] hover:text-white" href={`/builder-workspaces/${params.slug}`}>
              Open Builder Workspace
            </Link>
          ) : null}
          <Link className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-white/50 transition hover:bg-white/[0.08] hover:text-white/80" href="/projects">
            ← Projects
          </Link>
        </div>
      </div>

      {/* Info banners */}
      {hasBuildHandoff ? (
        <p className="mb-4 rounded-xl border border-violet-500/20 bg-violet-500/[0.06] p-4 font-mono text-xs text-violet-300/70">
          build-handoff.md is available below and can be copied into a builder workflow.
        </p>
      ) : null}
      {hasGptPilotHandoff ? (
        <p className="mb-4 rounded-xl border border-violet-500/20 bg-violet-500/[0.06] p-4 font-mono text-xs text-violet-300/70">
          gpt-pilot-prompt.md and README_BUILD.md are available below. GPT-Pilot has not been run.
        </p>
      ) : null}
      {hasBuilderWorkspace ? (
        <p className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4 font-mono text-xs text-emerald-300/70">
          Builder workspace is ready at projects/build-workspaces/{params.slug}/. No builder commands have been run.
        </p>
      ) : null}

      {/* Action Queue */}
      <section className="mb-5 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 backdrop-blur-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-violet-400">Execution</p>
            <h2 className="mt-1.5 text-xl font-bold text-white">Action Queue</h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-white/40">
              Creates or refreshes ACTION_QUEUE.md from the local execution plan. Task status updates rewrite the markdown file.
            </p>
          </div>
          <form action={createActionQueueAction}>
            <button
              className="cursor-pointer rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-white/60 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!hasExecutionPlan}
              type="submit"
            >
              View Action Queue
            </button>
          </form>
        </div>

        {!hasExecutionPlan ? (
          <p className="mt-4 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 font-mono text-xs text-white/35">
            Generate execution-plan.md before creating the action queue.
          </p>
        ) : null}

        {actionQueue?.length ? (
          <div className="mt-5 grid gap-4">
            {["Strategy", "Content", "UX", "Build", "Publish", "QA"].map((group) => {
              const groupTasks = tasksForGroup(actionQueue, group);
              if (!groupTasks.length) return null;
              return (
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4" key={group}>
                  <h3 className="text-sm font-bold text-white/70">{group}</h3>
                  <div className="mt-3 grid gap-3">
                    {groupTasks.map((task) => (
                      <article className="rounded-xl border border-white/[0.05] bg-white/[0.03] p-4" key={task.id}>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-white/30">{task.id}</p>
                            <h4 className="mt-1 text-sm font-bold text-white/90">{task.taskName}</h4>
                          </div>
                          <span className={`rounded-full border px-3 py-1 font-mono text-xs font-bold ${actionStatusBadgeClass(task.status)}`}>
                            {task.status}
                          </span>
                        </div>
                        <dl className="mt-4 grid gap-2 text-xs text-white/50 md:grid-cols-2">
                          <div>
                            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/25">Owner/tool</dt>
                            <dd className="mt-0.5 font-medium text-white/60">{task.ownerTool}</dd>
                          </div>
                          <div>
                            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/25">Mode</dt>
                            <dd className="mt-0.5 font-medium text-white/60">{task.mode}</dd>
                          </div>
                          <div>
                            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/25">Input file</dt>
                            <dd className="mt-0.5 font-mono text-[10px] text-white/40">{task.inputFile}</dd>
                          </div>
                          <div>
                            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/25">Output file</dt>
                            <dd className="mt-0.5 font-mono text-[10px] text-white/40">{task.outputFile}</dd>
                          </div>
                        </dl>
                        <div className="mt-4 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/25">Task prompt</p>
                          <p className="mt-1.5 text-xs leading-5 text-white/50">{task.prompt}</p>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                          <form action={updateActionQueueStatusAction} className="flex flex-wrap gap-2">
                            <input name="taskId" type="hidden" value={task.id} />
                            <select
                              className="cursor-pointer rounded-xl border border-white/[0.07] bg-os-bg px-3 py-2 text-xs font-bold text-white/60 outline-none focus:border-violet-500/40"
                              defaultValue={task.status}
                              name="status"
                            >
                              {actionQueueStatuses.map((status) => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                            <button className="cursor-pointer rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-violet-500" type="submit">
                              Update status
                            </button>
                          </form>
                          <CopyMarkdownButton content={task.prompt} labelText="Copy task prompt" />
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : hasExecutionPlan ? (
          <p className="mt-4 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 font-mono text-xs text-white/35">
            ACTION_QUEUE.md has not been generated yet.
          </p>
        ) : null}
      </section>

      {/* Executor Prompts */}
      <section className="mb-5 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 backdrop-blur-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-violet-400">Execution</p>
            <h2 className="mt-1.5 text-xl font-bold text-white">Executor Prompts</h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-white/40">
              Creates one markdown brief per Action Queue task under projects/generated/{params.slug}/executor-prompts/.
            </p>
          </div>
          <form action={createExecutorPromptsAction}>
            <button
              className="cursor-pointer rounded-xl border border-emerald-500/25 bg-emerald-500/[0.08] px-4 py-2.5 text-sm font-bold text-emerald-300 transition hover:-translate-y-0.5 hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!actionQueue?.length}
              type="submit"
            >
              Generate Executor Prompts
            </button>
          </form>
        </div>

        {!actionQueue?.length ? (
          <p className="mt-4 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 font-mono text-xs text-white/35">
            Create ACTION_QUEUE.md before generating executor prompts.
          </p>
        ) : null}

        {executorPrompts.length ? (
          <div className="mt-5">
            <h3 className="text-sm font-bold text-white/60">View executor prompts</h3>
            <div className="mt-3 grid gap-4">
              {executorPrompts.map((prompt) => (
                <article className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]" key={prompt.filename}>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.05] px-5 py-4">
                    <div>
                      <h4 className="text-sm font-bold text-white/90">
                        {titleFromFilename(prompt.filename.split("/").pop() || prompt.filename)}
                      </h4>
                      <p className="mt-0.5 font-mono text-[10px] text-white/30">{prompt.filename}</p>
                    </div>
                    <CopyMarkdownButton content={prompt.content} labelText="Copy executor prompt" />
                  </div>
                  <pre className="max-h-[380px] overflow-auto whitespace-pre-wrap p-5 font-mono text-xs leading-6 text-white/40">
                    {prompt.content}
                  </pre>
                </article>
              ))}
            </div>
          </div>
        ) : actionQueue?.length ? (
          <p className="mt-4 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 font-mono text-xs text-white/35">
            No executor prompts have been generated yet.
          </p>
        ) : null}
      </section>

      {/* Project files */}
      <section className="grid gap-4">
        {files.map((file) => (
          <article className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]" key={file.filename}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.05] px-5 py-4">
              <div>
                <h2 className="text-base font-bold text-white/90">{titleFromFilename(file.filename)}</h2>
                <p className="mt-0.5 font-mono text-[10px] text-white/30">{file.filename}</p>
              </div>
              <CopyMarkdownButton content={file.content} />
            </div>
            {file.exists ? (
              <pre className="max-h-[480px] overflow-auto whitespace-pre-wrap p-5 font-mono text-xs leading-6 text-white/40">
                {file.content}
              </pre>
            ) : (
              <div className="p-5 text-xs text-white/30">
                This file has not been generated for this project yet.
              </div>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}
