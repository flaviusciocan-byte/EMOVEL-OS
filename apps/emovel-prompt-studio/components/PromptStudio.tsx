"use client";

import { useMemo, useState } from "react";
import {
  builderTargets,
  generateExecutionPlan,
  publishingTargets,
  routeCommand,
  type BuilderTarget,
  type PublishingTarget
} from "@/execution";
import { generateMarkdown, outputTypes, projectTypes, type OutputType, type ProjectType } from "@/lib/templates";

const defaultPrompt =
  "Create a premium landing page for a productized AI launch system that turns raw ideas into offers, copy, UX direction, build plans, and launch assets.";

function CheckIcon() {
  return (
    <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 ${
        checked ? "bg-violet-600" : "bg-white/[0.12]"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-[18px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

export function PromptStudio() {
  const [projectName, setProjectName] = useState("EMOVEL generated project");
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [projectType, setProjectType] = useState<ProjectType>("landing page");
  const [outputs, setOutputs] = useState<OutputType[]>(["offer", "copy", "UX audit", "component plan"]);
  const [generated, setGenerated] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [executionMode, setExecutionMode] = useState(false);
  const [workspaceMode, setWorkspaceMode] = useState(false);
  const [builderTarget, setBuilderTarget] = useState<BuilderTarget>("GPT-Pilot");
  const [selectedPublishingTargets, setSelectedPublishingTargets] = useState<PublishingTarget[]>([
    "Gumroad",
    "Instagram",
    "Email"
  ]);

  const routedCommand = useMemo(() => routeCommand(prompt), [prompt]);
  const executionPlan = useMemo(
    () =>
      generateExecutionPlan({
        command: prompt,
        projectName,
        projectSlug: slugify(projectName || prompt),
        builderTarget,
        publishingTargets: selectedPublishingTargets
      }),
    [builderTarget, projectName, prompt, selectedPublishingTargets]
  );

  const markdown = useMemo(
    () => generated || generateMarkdown({ prompt, projectType, outputs }),
    [generated, outputs, projectType, prompt]
  );

  function toggleOutput(output: OutputType) {
    setOutputs((current) =>
      current.includes(output) ? current.filter((item) => item !== output) : [...current, output]
    );
  }

  function slugify(value: string) {
    const slug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return slug || "untitled-project";
  }

  function togglePublishingTarget(target: PublishingTarget) {
    setSelectedPublishingTargets((current) =>
      current.includes(target) ? current.filter((item) => item !== target) : [...current, target]
    );
  }

  function generate() {
    setGenerated(generateMarkdown({ prompt, projectType, outputs }));
  }

  function exportMarkdown() {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "emovel-prompt-studio-output.md";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function saveProject(
    action: "save-output" | "run-pipeline" | "generate-execution-plan" | "create-workspace"
  ) {
    setIsSaving(true);
    setSaveStatus("");

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          projectName,
          prompt,
          projectType,
          outputs,
          builderTarget,
          publishingTargets: selectedPublishingTargets
        })
      });

      const result = (await response.json()) as {
        ok?: boolean;
        directory?: string;
        files?: string[];
        summaryUrl?: string;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Unable to save project output.");
      }

      const fileCount = result.files?.length || 0;
      setSaveStatus(`Saved ${fileCount} file${fileCount === 1 ? "" : "s"} to ${result.directory}`);

      if (action === "create-workspace" && result.summaryUrl) {
        window.location.href = result.summaryUrl;
      }
    } catch (error) {
      setSaveStatus(error instanceof Error ? error.message : "Unable to save project output.");
    } finally {
      setIsSaving(false);
    }
  }

  const panels = markdown
    .split("\n\n---\n\n")
    .map((panel) => panel.trim())
    .filter(Boolean);

  return (
    <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
      {/* ── Left: Input panel ── */}
      <section className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 backdrop-blur-xl md:p-6">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-violet-400">New Project</p>
            <h1 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white md:text-3xl">
              Turn a raw prompt into production assets.
            </h1>
          </div>
          <span className="shrink-0 rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-violet-300">
            Local v1
          </span>
        </div>

        {/* Mode toggles */}
        <div className="mb-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="grid gap-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white/80">Execution Mode</p>
                <p className="mt-0.5 text-xs text-white/35">
                  Route prompt into skills, builder target, publishing targets, and execution plan.
                </p>
              </div>
              <Toggle checked={executionMode} onChange={() => setExecutionMode((c) => !c)} />
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-white/[0.05] pt-4">
              <div>
                <p className="text-sm font-semibold text-white/80">Workspace Mode</p>
                <p className="mt-0.5 text-xs text-white/35">
                  Create project files, execution plan, action queue, executor prompts, and builder workspace.
                </p>
              </div>
              <Toggle
                checked={workspaceMode}
                onChange={() => {
                  setWorkspaceMode((c) => !c);
                  setExecutionMode(true);
                }}
              />
            </div>
          </div>
        </div>

        {/* Project name */}
        <label className="mb-4 block">
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Project name
          </span>
          <input
            className="min-h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 text-sm text-white/90 outline-none transition duration-200 placeholder:text-white/25 focus:border-violet-500/40 focus:bg-white/[0.06] focus:shadow-[0_0_0_1px_rgba(124,58,237,0.25),0_0_18px_rgba(124,58,237,0.12)]"
            onChange={(event) => setProjectName(event.target.value)}
            value={projectName}
          />
        </label>

        {/* Prompt textarea */}
        <label className="block">
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Raw prompt
          </span>
          <textarea
            className="min-h-[200px] w-full resize-y rounded-xl border border-white/[0.07] bg-white/[0.04] p-4 text-sm leading-7 text-white/90 outline-none transition duration-200 placeholder:text-white/25 focus:border-violet-500/40 focus:bg-white/[0.06] focus:shadow-[0_0_0_1px_rgba(124,58,237,0.25),0_0_24px_rgba(124,58,237,0.14)]"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
          />
        </label>

        {/* Project type */}
        <div className="mt-5">
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">Project type</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {projectTypes.map((type) => (
              <button
                className={`min-h-10 cursor-pointer rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition duration-200 ${
                  projectType === type
                    ? "border-violet-500/40 bg-violet-600/20 text-violet-200 shadow-[0_0_10px_rgba(124,58,237,0.15)]"
                    : "border-white/[0.05] bg-white/[0.02] text-white/50 hover:border-violet-500/20 hover:bg-white/[0.05] hover:text-white/80"
                }`}
                key={type}
                onClick={() => setProjectType(type)}
                type="button"
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Outputs */}
        <div className="mt-5">
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">Outputs</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {outputTypes.map((output) => (
              <label
                className={`flex min-h-10 cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 text-sm font-medium transition duration-200 ${
                  outputs.includes(output)
                    ? "border-violet-500/30 bg-violet-600/15 text-violet-200"
                    : "border-white/[0.05] bg-white/[0.02] text-white/50 hover:border-white/[0.08] hover:bg-white/[0.05]"
                }`}
                key={output}
              >
                <input
                  checked={outputs.includes(output)}
                  className="sr-only"
                  onChange={() => toggleOutput(output)}
                  type="checkbox"
                />
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors duration-150 ${
                    outputs.includes(output)
                      ? "border-violet-400/70 bg-violet-600"
                      : "border-white/[0.15] bg-transparent"
                  }`}
                >
                  {outputs.includes(output) && <CheckIcon />}
                </span>
                {output}
              </label>
            ))}
          </div>
        </div>

        {/* Execution mode details */}
        {executionMode ? (
          <div className="mt-5 rounded-xl border border-violet-500/20 bg-violet-600/[0.07] p-4">
            <div className="grid gap-5">
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-violet-400">
                  Intent Preview
                </p>
                <p className="mt-2 text-sm font-bold capitalize text-white/90">
                  {routedCommand.intent.replace("-", " ")}
                </p>
                <p className="mt-1 font-mono text-[10px] text-white/35">
                  Confidence: {routedCommand.confidence}
                </p>
              </div>

              <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                  Builder target
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {builderTargets.map((target) => (
                    <button
                      className={`min-h-10 cursor-pointer rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition duration-200 ${
                        builderTarget === target
                          ? "border-violet-500/40 bg-violet-600/20 text-violet-200"
                          : "border-white/[0.05] bg-white/[0.02] text-white/50 hover:border-violet-500/20 hover:bg-white/[0.05]"
                      }`}
                      key={target}
                      onClick={() => setBuilderTarget(target)}
                      type="button"
                    >
                      {target}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                  Publishing targets
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {publishingTargets.map((target) => (
                    <label
                      className={`flex min-h-10 cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 text-sm font-medium transition duration-200 ${
                        selectedPublishingTargets.includes(target)
                          ? "border-violet-500/30 bg-violet-600/15 text-violet-200"
                          : "border-white/[0.05] bg-white/[0.02] text-white/50 hover:border-white/[0.08]"
                      }`}
                      key={target}
                    >
                      <input
                        checked={selectedPublishingTargets.includes(target)}
                        className="sr-only"
                        onChange={() => togglePublishingTarget(target)}
                        type="checkbox"
                      />
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors duration-150 ${
                          selectedPublishingTargets.includes(target)
                            ? "border-violet-400/70 bg-violet-600"
                            : "border-white/[0.15] bg-transparent"
                        }`}
                      >
                        {selectedPublishingTargets.includes(target) && <CheckIcon />}
                      </span>
                      {target}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                  Skills preview
                </p>
                <div className="flex flex-wrap gap-2">
                  {routedCommand.selectedSkills.map((skill) => (
                    <span
                      className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 font-mono text-xs text-violet-300"
                      key={skill}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            className="min-h-11 cursor-pointer rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] transition duration-200 hover:-translate-y-0.5 hover:bg-violet-500 hover:shadow-[0_0_28px_rgba(124,58,237,0.5)]"
            onClick={generate}
            type="button"
          >
            Generate assets
          </button>
          <button
            className="min-h-11 cursor-pointer rounded-xl border border-white/[0.07] bg-white/[0.03] px-5 py-2.5 text-sm font-bold text-white/60 transition duration-200 hover:bg-white/[0.07] hover:text-white/90"
            onClick={exportMarkdown}
            type="button"
          >
            Export markdown
          </button>
          <button
            className="min-h-11 cursor-pointer rounded-xl border border-white/[0.07] bg-white/[0.03] px-5 py-2.5 text-sm font-bold text-white/60 transition duration-200 hover:bg-white/[0.07] hover:text-white/90 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={isSaving}
            onClick={() => saveProject("save-output")}
            type="button"
          >
            Save output
          </button>
          <button
            className="min-h-11 cursor-pointer rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={isSaving}
            onClick={() => saveProject("run-pipeline")}
            type="button"
          >
            Run Pipeline
          </button>
          {executionMode ? (
            <button
              className="min-h-11 cursor-pointer rounded-xl border border-violet-400/25 bg-violet-600/12 px-5 py-2.5 text-sm font-bold text-violet-300 transition duration-200 hover:-translate-y-0.5 hover:bg-violet-600/20 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={isSaving}
              onClick={() => saveProject("generate-execution-plan")}
              type="button"
            >
              Generate Execution Plan
            </button>
          ) : null}
          {workspaceMode ? (
            <button
              className="min-h-11 cursor-pointer rounded-xl border border-emerald-400/25 bg-emerald-600/12 px-5 py-2.5 text-sm font-bold text-emerald-300 transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-600/20 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={isSaving}
              onClick={() => saveProject("create-workspace")}
              type="button"
            >
              Create Workspace
            </button>
          ) : null}
        </div>

        {saveStatus ? (
          <p className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 font-mono text-xs text-white/50">
            {saveStatus}
          </p>
        ) : null}
      </section>

      {/* ── Right: Output panel ── */}
      <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 backdrop-blur-xl md:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-violet-400">Output Preview</p>
            <h2 className="mt-1.5 text-lg font-bold tracking-[-0.02em] text-white">
              Structured production assets
            </h2>
          </div>
          <span className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] text-white/35">
            {outputs.length || 3} panels
          </span>
        </div>

        {executionMode ? (
          <article className="mb-4 rounded-xl border border-violet-500/20 bg-violet-600/[0.07] p-4">
            <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-violet-400">
              Execution Plan Preview
            </p>
            <pre className="max-h-[300px] overflow-auto whitespace-pre-wrap font-mono text-xs leading-5 text-white/50">
              {executionPlan}
            </pre>
          </article>
        ) : null}

        <div className="grid gap-3">
          {panels.map((panel, index) => {
            const [titleLine, ...body] = panel.split("\n");
            return (
              <article
                className="rounded-xl border border-white/[0.05] bg-white/[0.03] p-4 transition duration-200 hover:border-violet-500/15 hover:bg-white/[0.04]"
                key={`${titleLine}-${index}`}
              >
                <p className="mb-2 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-violet-400/60">
                  {index === 0 ? "Header" : `Output ${index}`}
                </p>
                <h3 className="text-sm font-bold text-white/90">{titleLine.replace(/^#*\s*/, "")}</h3>
                <pre className="mt-3 whitespace-pre-wrap font-sans text-xs leading-6 text-white/40">
                  {body.join("\n").trim()}
                </pre>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
