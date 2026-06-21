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
  searchParams?: {
    status?: string;
    group?: string;
  };
};

function statusBadgeClass(status: ActionQueueStatus) {
  if (status === "Done") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "Blocked") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (status === "In Progress") {
    return "border-blue/20 bg-blue/10 text-blue";
  }

  return "border-line bg-cloud text-slate-700";
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
          <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-blue">
            Execution Inbox
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.04em]">Central Execution</h1>
          <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-slate-600">
            A local inbox for every task found in generated project ACTION_QUEUE.md files. No APIs,
            shell commands, builders, or publishing actions run from this page.
          </p>
        </div>
        <Link className="rounded-emovel border border-line bg-white px-5 py-3 font-black" href="/projects">
          Projects
        </Link>
      </div>

      <form className="mb-6 grid gap-3 rounded-emovel border border-line bg-white p-5 md:grid-cols-[1fr_1fr_auto]" method="get">
        <label className="grid gap-2">
          <span className="font-mono text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            Status
          </span>
          <select
            className="rounded-emovel border border-line bg-white px-3 py-2 text-sm font-bold"
            defaultValue={selectedStatus}
            name="status"
          >
            <option value="All">All</option>
            {actionQueueStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className="font-mono text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            Group
          </span>
          <select
            className="rounded-emovel border border-line bg-white px-3 py-2 text-sm font-bold"
            defaultValue={selectedGroup}
            name="group"
          >
            <option value="All">All</option>
            {actionGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </label>
        <button className="self-end rounded-emovel bg-ink px-5 py-3 font-black text-white" type="submit">
          Apply Filters
        </button>
      </form>

      <div className="mb-5 flex flex-wrap gap-2 font-mono text-xs font-black text-slate-600">
        <span className="rounded-full border border-line bg-white px-3 py-1">
          Showing {tasks.length} of {allTasks.length} tasks
        </span>
        <span className="rounded-full border border-line bg-white px-3 py-1">
          Status: {selectedStatus}
        </span>
        <span className="rounded-full border border-line bg-white px-3 py-1">
          Group: {selectedGroup}
        </span>
      </div>

      {tasks.length ? (
        <section className="grid gap-4">
          {tasks.map((task) => (
            <article className="rounded-emovel border border-line bg-white p-5" key={`${task.projectSlug}-${task.id}`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] font-black uppercase tracking-[0.16em] text-blue">
                    {task.projectName} / {task.group}
                  </p>
                  <h2 className="mt-2 text-xl font-black tracking-[-0.02em]">{task.taskName}</h2>
                  <p className="mt-2 font-mono text-xs font-bold text-slate-600">{task.id}</p>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 font-mono text-xs font-black ${statusBadgeClass(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </div>

              <dl className="mt-5 grid gap-3 text-sm font-bold text-slate-700 md:grid-cols-2">
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">
                    Owner/tool
                  </dt>
                  <dd>{task.ownerTool}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">
                    Mode
                  </dt>
                  <dd>{task.mode}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">
                    Input file
                  </dt>
                  <dd className="font-mono text-xs">{task.inputFile}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">
                    Output file
                  </dt>
                  <dd className="font-mono text-xs">{task.outputFile}</dd>
                </div>
              </dl>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <form action={updateTaskStatusAction} className="flex flex-wrap gap-2">
                  <input name="projectSlug" type="hidden" value={task.projectSlug} />
                  <input name="taskId" type="hidden" value={task.id} />
                  <select
                    className="rounded-emovel border border-line bg-white px-3 py-2 text-sm font-bold"
                    defaultValue={task.status}
                    name="status"
                  >
                    {actionQueueStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button className="rounded-emovel bg-blue px-4 py-2 text-sm font-black text-white" type="submit">
                    Update status
                  </button>
                </form>
                <div className="flex flex-wrap gap-2">
                  <Link
                    className="rounded-emovel border border-line bg-white px-4 py-2 text-sm font-black"
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

              <details className="mt-5 rounded-emovel border border-line bg-cloud">
                <summary className="cursor-pointer px-4 py-3 font-black">Open related executor prompt</summary>
                {task.executorPromptContent ? (
                  <div>
                    <p className="border-y border-line bg-white px-4 py-3 font-mono text-xs font-bold text-slate-600">
                      {task.executorPromptFile}
                    </p>
                    <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap p-4 font-mono text-sm leading-7 text-slate-800">
                      {task.executorPromptContent}
                    </pre>
                  </div>
                ) : (
                  <p className="px-4 py-3 text-sm font-bold text-slate-600">
                    Executor prompt has not been generated yet. Open the project and use Generate Executor Prompts.
                  </p>
                )}
              </details>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-emovel border border-line bg-white p-8 text-center">
          <h2 className="text-2xl font-black tracking-[-0.03em]">No matching execution tasks</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-bold leading-6 text-slate-600">
            Create an execution plan, generate an Action Queue, then return here to manage tasks across projects.
          </p>
        </section>
      )}
    </main>
  );
}
