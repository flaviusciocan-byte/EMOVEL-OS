import Link from "next/link";
import { revalidatePath } from "next/cache";
import { CopyMarkdownButton } from "@/components/CopyMarkdownButton";
import {
  actionQueueStatuses,
  listExecutionInboxTasks,
  updateActionQueueTaskStatus,
  type ActionQueueStatus,
  type ExecutionInboxTask
} from "@/lib/projects";

export const dynamic = "force-dynamic";

const actionGroups = ["Strategy", "Content", "UX", "Build", "Publish", "QA"] as const;

type ExecutionPageProps = {
  searchParams?: { status?: string; group?: string };
};

function statusBadgeClass(status: ActionQueueStatus) {
  if (status === "Done") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  if (status === "Blocked") return "border-red-500/30 bg-red-500/10 text-red-400";
  if (status === "In Progress") return "border-[#C7A45A]/30 bg-[#C7A45A]/10 text-[#C7A45A]";
  return "border-white/[0.07] bg-white/[0.03] text-white/40";
}

function matchesStatus(value: string | undefined): value is ActionQueueStatus {
  return actionQueueStatuses.includes(value as ActionQueueStatus);
}

function matchesGroup(value: string | undefined) {
  return actionGroups.includes(value as (typeof actionGroups)[number]);
}

function filterTasks(tasks: ExecutionInboxTask[], status?: string, group?: string) {
  return tasks.filter((task) => {
    const statusMatches = matchesStatus(status) ? task.status === status : true;
    const groupMatches = matchesGroup(group) ? task.group === group : true;
    return statusMatches && groupMatches;
  });
}

export default async function ExecutionPage({ searchParams }: ExecutionPageProps) {
  const allTasks = await listExecutionInboxTasks();
  const selectedStatus = matchesStatus(searchParams?.status) ? searchParams?.status : "All";
  const selectedGroup = matchesGroup(searchParams?.group) ? searchParams?.group : "All";
  const tasks = filterTasks(
    allTasks,
    selectedStatus === "All" ? undefined : selectedStatus,
    selectedGroup === "All" ? undefined : selectedGroup
  );

  async function updateTaskStatusAction(formData: FormData) {
    "use server";
    const projectSlug = String(formData.get("projectSlug") || "");
    const taskId = String(formData.get("taskId") || "");
    const status = String(formData.get("status") || "") as ActionQueueStatus;
    await updateActionQueueTaskStatus(projectSlug, taskId, status);
    revalidatePath("/execution");
    revalidatePath(`/projects/${projectSlug}`);
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-[#C7A45A]">
            Execution Inbox
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white md:text-4xl">
            Central Execution
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
            A local inbox for every task found in generated project ACTION_QUEUE.md files. No APIs,
            shell commands, builders, or publishing actions run from this page.
          </p>
        </div>
        <Link
          className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-5 py-2.5 text-sm font-bold text-white/60 transition hover:bg-white/[0.08] hover:text-white/90"
          href="/projects"
        >
          Projects
        </Link>
      </div>

      {/* Filter form */}
      <form
        className="mb-6 grid gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 backdrop-blur-sm md:grid-cols-[1fr_1fr_auto]"
        method="get"
      >
        <label className="grid gap-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">Status</span>
          <select
            className="cursor-pointer rounded-xl border border-white/[0.07] bg-os-bg px-3 py-2.5 text-sm font-medium text-white/70 outline-none focus:border-[#C7A45A]/40 focus:text-white/90"
            defaultValue={selectedStatus}
            name="status"
          >
            <option value="All">All</option>
            {actionQueueStatuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">Group</span>
          <select
            className="cursor-pointer rounded-xl border border-white/[0.07] bg-os-bg px-3 py-2.5 text-sm font-medium text-white/70 outline-none focus:border-[#C7A45A]/40 focus:text-white/90"
            defaultValue={selectedGroup}
            name="group"
          >
            <option value="All">All</option>
            {actionGroups.map((group) => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </label>
        <button
          className="cursor-pointer self-end rounded-xl bg-[#A8863F] px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#C7A45A]"
          type="submit"
        >
          Apply Filters
        </button>
      </form>

      {/* Stats */}
      <div className="mb-5 flex flex-wrap gap-2">
        <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 font-mono text-[10px] text-white/40">
          {tasks.length} of {allTasks.length} tasks
        </span>
        <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 font-mono text-[10px] text-white/40">
          Status: {selectedStatus}
        </span>
        <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 font-mono text-[10px] text-white/40">
          Group: {selectedGroup}
        </span>
      </div>

      {tasks.length ? (
        <section className="grid gap-4">
          {tasks.map((task) => (
            <article
              className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 backdrop-blur-sm transition hover:border-[#C7A45A]/15"
              key={`${task.projectSlug}-${task.id}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-[#C7A45A]">
                    {task.projectName} / {task.group}
                  </p>
                  <h2 className="mt-2 text-lg font-bold tracking-[-0.02em] text-white/90">{task.taskName}</h2>
                  <p className="mt-1 font-mono text-[10px] text-white/30">{task.id}</p>
                </div>
                <span className={`rounded-full border px-3 py-1 font-mono text-xs font-bold ${statusBadgeClass(task.status)}`}>
                  {task.status}
                </span>
              </div>

              <dl className="mt-5 grid gap-3 text-xs md:grid-cols-2">
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

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <form action={updateTaskStatusAction} className="flex flex-wrap gap-2">
                  <input name="projectSlug" type="hidden" value={task.projectSlug} />
                  <input name="taskId" type="hidden" value={task.id} />
                  <select
                    className="cursor-pointer rounded-xl border border-white/[0.07] bg-os-bg px-3 py-2 text-xs font-bold text-white/60 outline-none focus:border-[#C7A45A]/40"
                    defaultValue={task.status}
                    name="status"
                  >
                    {actionQueueStatuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <button className="cursor-pointer rounded-xl bg-[#A8863F] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#C7A45A]" type="submit">
                    Update status
                  </button>
                </form>
                <div className="flex flex-wrap gap-2">
                  <Link
                    className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-2 text-xs font-bold text-white/50 transition hover:bg-white/[0.08] hover:text-white/80"
                    href={`/projects/${task.projectSlug}`}
                  >
                    Open Project
                  </Link>
                  <CopyMarkdownButton
                    content={task.executorPromptContent || task.prompt}
                    labelText={task.executorPromptContent ? "Copy executor prompt" : "Copy task prompt"}
                  />
                </div>
              </div>

              <details className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <summary className="cursor-pointer px-4 py-3 text-sm font-bold text-white/50 hover:text-white/80">
                  Open related executor prompt
                </summary>
                {task.executorPromptContent ? (
                  <div>
                    <p className="border-y border-white/[0.05] px-4 py-3 font-mono text-[10px] text-white/30">
                      {task.executorPromptFile}
                    </p>
                    <pre className="max-h-[380px] overflow-auto whitespace-pre-wrap p-4 font-mono text-xs leading-6 text-white/40">
                      {task.executorPromptContent}
                    </pre>
                  </div>
                ) : (
                  <p className="px-4 py-3 text-xs text-white/35">
                    Executor prompt has not been generated yet. Open the project and use Generate Executor Prompts.
                  </p>
                )}
              </details>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-10 text-center">
          <h2 className="text-xl font-bold tracking-[-0.02em] text-white/80">No matching execution tasks</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/35">
            Create an execution plan, generate an Action Queue, then return here to manage tasks across projects.
          </p>
        </section>
      )}
    </main>
  );
}
