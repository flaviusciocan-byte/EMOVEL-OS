"use client";

import { useEffect, useMemo, useState } from "react";
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

/* ── Icons ───────────────────────────────────────────────────────────────── */
function CheckIcon() {
  return (
    <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-3.5 w-3.5 text-white/30 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
    </svg>
  );
}

/* ── Toggle ──────────────────────────────────────────────────────────────── */
function Toggle({ checked, onChange, id }: { checked: boolean; onChange: () => void; id: string }) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7A45A]/60 ${
        checked ? "bg-[#A8863F]" : "bg-white/[0.12]"
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

/* ── Checkbox item ───────────────────────────────────────────────────────── */
function CheckItem({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex min-h-[40px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 text-sm font-medium transition duration-200 ${
        checked
          ? "border-[#C7A45A]/30 bg-[#A8863F]/15 text-[#E9D8A6]"
          : "border-white/[0.05] bg-white/[0.02] text-white/45 hover:border-white/[0.09] hover:text-white/75"
      }`}
    >
      <input checked={checked} className="sr-only" onChange={onChange} type="checkbox" />
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors duration-150 ${
          checked ? "border-[#C7A45A]/60 bg-[#A8863F]" : "border-white/[0.15] bg-transparent"
        }`}
      >
        {checked && <CheckIcon />}
      </span>
      {label}
    </label>
  );
}

/* ── PromptStudio ────────────────────────────────────────────────────────── */
export function PromptStudio() {
  /* ── State (unchanged from original) ── */
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

  /* ── UI-only state ── */
  const [showAdvanced, setShowAdvanced] = useState(false);

  /* ── Read prompt passed from home screen ── */
  useEffect(() => {
    const pending = sessionStorage.getItem("emovel-pending-prompt");
    if (pending) {
      setPrompt(pending);
      sessionStorage.removeItem("emovel-pending-prompt");
    }
  }, []);

  /* ── Derived (unchanged) ── */
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

  /* ── Handlers (unchanged) ── */
  function toggleOutput(output: OutputType) {
    setOutputs((current) =>
      current.includes(output) ? current.filter((item) => item !== output) : [...current, output]
    );
  }

  function slugify(value: string) {
    const slug = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
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

  async function saveProject(action: "save-output" | "run-pipeline" | "generate-execution-plan" | "create-workspace") {
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

  /* ── Render ── */
  return (
    <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
      {/* ══ Left: Input panel ══ */}
      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl">
        {/* Header */}
        <div className="mb-6">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-[#C7A45A]">
            Prompt Studio
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white md:text-3xl">
            Build from a single prompt.
          </h1>
        </div>

        {/* Prompt textarea — dominant element */}
        <div className="mb-5">
          <div
            className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] transition-all duration-300 focus-within:border-[#C7A45A]/40 focus-within:shadow-[0_0_0_1px_rgba(124,58,237,0.2),0_0_36px_rgba(124,58,237,0.13)]"
          >
            <textarea
              aria-label="Raw prompt"
              className="block min-h-[180px] w-full resize-none bg-transparent p-5 text-base leading-7 text-white/90 outline-none placeholder:text-white/20"
              placeholder="Describe what you're building..."
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
            />
            <div className="px-4 pb-3 text-right">
              <span className="select-none font-mono text-[10px] text-white/20">
                {prompt.length} chars
              </span>
            </div>
          </div>
        </div>

        {/* Project name */}
        <label className="mb-5 block">
          <span className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
            Project name
          </span>
          <input
            className="min-h-[42px] w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 text-sm text-white/90 outline-none transition duration-200 placeholder:text-white/20 focus:border-[#C7A45A]/40 focus:bg-white/[0.05] focus:shadow-[0_0_0_1px_rgba(124,58,237,0.2)]"
            onChange={(event) => setProjectName(event.target.value)}
            value={projectName}
          />
        </label>

        {/* Product type */}
        <div className="mb-5">
          <p className="mb-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
            Product type
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {projectTypes.map((type) => (
              <button
                className={`min-h-10 cursor-pointer rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition duration-200 ${
                  projectType === type
                    ? "border-[#C7A45A]/40 bg-[#A8863F]/20 text-[#E9D8A6] shadow-[0_0_10px_rgba(124,58,237,0.15)]"
                    : "border-white/[0.05] bg-white/[0.02] text-white/45 hover:border-[#C7A45A]/20 hover:text-white/80"
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

        {/* Output modules */}
        <div className="mb-5">
          <p className="mb-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
            Output modules
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {outputTypes.map((output) => (
              <CheckItem
                key={output}
                label={output}
                checked={outputs.includes(output)}
                onChange={() => toggleOutput(output)}
              />
            ))}
          </div>
        </div>

        {/* Advanced accordion */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition duration-200 hover:border-white/[0.09] hover:bg-white/[0.03]"
            aria-expanded={showAdvanced}
          >
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
              Advanced Settings
            </span>
            <ChevronDownIcon open={showAdvanced} />
          </button>

          {showAdvanced && (
            <div className="mt-3 space-y-5 rounded-xl border border-[#C7A45A]/15 bg-[#A8863F]/[0.04] p-4">
              {/* Mode toggles */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white/80">Execution Mode</p>
                    <p className="mt-0.5 text-xs leading-5 text-white/35">
                      Route prompt into skills, builder target, and execution plan.
                    </p>
                  </div>
                  <Toggle
                    id="toggle-execution"
                    checked={executionMode}
                    onChange={() => setExecutionMode((c) => !c)}
                  />
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-white/[0.05] pt-4">
                  <div>
                    <p className="text-sm font-semibold text-white/80">Workspace Mode</p>
                    <p className="mt-0.5 text-xs leading-5 text-white/35">
                      Create project files, action queue, executor prompts, and builder workspace.
                    </p>
                  </div>
                  <Toggle
                    id="toggle-workspace"
                    checked={workspaceMode}
                    onChange={() => {
                      setWorkspaceMode((c) => !c);
                      setExecutionMode(true);
                    }}
                  />
                </div>
              </div>

              {/* Builder target — visible when executionMode */}
              {executionMode && (
                <div className="border-t border-white/[0.05] pt-4">
                  <p className="mb-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                    Builder target
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {builderTargets.map((target) => (
                      <button
                        className={`min-h-10 cursor-pointer rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition duration-200 ${
                          builderTarget === target
                            ? "border-[#C7A45A]/40 bg-[#A8863F]/20 text-[#E9D8A6]"
                            : "border-white/[0.05] bg-white/[0.02] text-white/45 hover:border-[#C7A45A]/20"
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
              )}

              {/* Publishing targets — visible when executionMode */}
              {executionMode && (
                <div className="border-t border-white/[0.05] pt-4">
                  <p className="mb-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                    Publishing targets
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {publishingTargets.map((target) => (
                      <CheckItem
                        key={target}
                        label={target}
                        checked={selectedPublishingTargets.includes(target)}
                        onChange={() => togglePublishingTarget(target)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Intent preview — visible when executionMode */}
              {executionMode && (
                <div className="rounded-xl border border-[#C7A45A]/20 bg-[#A8863F]/[0.07] p-4">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#C7A45A]">
                    Intent Preview
                  </p>
                  <p className="mt-2 text-sm font-bold capitalize text-white/90">
                    {routedCommand.intent.replace("-", " ")}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] text-white/30">
                    Confidence: {routedCommand.confidence}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {routedCommand.selectedSkills.map((skill) => (
                      <span
                        className="rounded-full border border-[#C7A45A]/20 bg-[#C7A45A]/10 px-3 py-1 font-mono text-xs text-[#E9D8A6]"
                        key={skill}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Action buttons ── */}
        <div className="flex flex-wrap gap-2">
          {/* Primary */}
          <button
            className="min-h-11 flex-1 cursor-pointer rounded-xl bg-[#A8863F] px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#C7A45A] hover:shadow-[0_0_30px_rgba(124,58,237,0.55)] disabled:cursor-not-allowed disabled:opacity-50"
            onClick={generate}
            type="button"
          >
            Generate
          </button>

          {/* Run pipeline */}
          <button
            className="min-h-11 cursor-pointer rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 text-sm font-bold text-white/60 transition duration-200 hover:bg-white/[0.07] hover:text-white/90 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={isSaving}
            onClick={() => saveProject("run-pipeline")}
            type="button"
          >
            Run Pipeline
          </button>

          {/* Export */}
          <button
            className="min-h-11 cursor-pointer rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 text-sm font-bold text-white/40 transition duration-200 hover:bg-white/[0.05] hover:text-white/70"
            onClick={exportMarkdown}
            type="button"
          >
            Export
          </button>

          {/* Save output */}
          <button
            className="min-h-11 cursor-pointer rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm font-bold text-white/35 transition duration-200 hover:bg-white/[0.05] hover:text-white/60 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={isSaving}
            onClick={() => saveProject("save-output")}
            type="button"
          >
            Save
          </button>
        </div>

        {/* Conditional: Execution Plan + Workspace actions */}
        {(executionMode || workspaceMode) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {executionMode && (
              <button
                className="min-h-10 cursor-pointer rounded-xl border border-[#C7A45A]/25 bg-[#A8863F]/10 px-4 py-2 text-sm font-bold text-[#E9D8A6] transition duration-200 hover:bg-[#A8863F]/18 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={isSaving}
                onClick={() => saveProject("generate-execution-plan")}
                type="button"
              >
                Generate Execution Plan
              </button>
            )}
            {workspaceMode && (
              <button
                className="min-h-10 cursor-pointer rounded-xl border border-emerald-400/25 bg-emerald-600/10 px-4 py-2 text-sm font-bold text-emerald-300 transition duration-200 hover:bg-emerald-600/18 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={isSaving}
                onClick={() => saveProject("create-workspace")}
                type="button"
              >
                Create Workspace
              </button>
            )}
          </div>
        )}

        {/* Save status */}
        {saveStatus ? (
          <p className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 font-mono text-xs text-white/50">
            {saveStatus}
          </p>
        ) : null}
      </section>

      {/* ══ Right: Output panel ══ */}
      <section className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-5 backdrop-blur-xl md:p-6">
        {/* Output header */}
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#C7A45A]">
              Output Preview
            </p>
            <h2 className="mt-1.5 text-lg font-bold tracking-[-0.02em] text-white">
              Structured production assets
            </h2>
          </div>
          <span className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] text-white/30">
            {outputs.length || 3} panels
          </span>
        </div>

        {/* Execution plan preview */}
        {executionMode && (
          <article className="mb-4 rounded-xl border border-[#C7A45A]/20 bg-[#A8863F]/[0.06] p-4">
            <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#C7A45A]">
              Execution Plan Preview
            </p>
            <pre className="max-h-[300px] overflow-auto whitespace-pre-wrap font-mono text-xs leading-5 text-white/45">
              {executionPlan}
            </pre>
          </article>
        )}

        {/* Panels */}
        <div className="grid gap-3">
          {panels.map((panel, index) => {
            const [titleLine, ...body] = panel.split("\n");
            return (
              <article
                className="rounded-xl border border-white/[0.05] bg-white/[0.025] p-4 transition duration-200 hover:border-[#C7A45A]/15 hover:bg-white/[0.035]"
                key={`${titleLine}-${index}`}
              >
                <p className="mb-2 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-[#C7A45A]/55">
                  {index === 0 ? "Header" : `Output ${index}`}
                </p>
                <h3 className="text-sm font-bold text-white/90">
                  {titleLine.replace(/^#*\s*/, "")}
                </h3>
                <pre className="mt-3 whitespace-pre-wrap font-sans text-xs leading-6 text-white/38">
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
