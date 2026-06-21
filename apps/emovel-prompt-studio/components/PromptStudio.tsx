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

export function PromptStudio() {
  const [projectName, setProjectName] = useState("EMOVEL generated project");
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [projectType, setProjectType] = useState<ProjectType>("landing page");
  const [outputs, setOutputs] = useState<OutputType[]>(["offer", "copy", "UX audit", "component plan"]);
  const [generated, setGenerated] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [executionMode, setExecutionMode] = useState(false);
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

  async function saveProject(action: "save-output" | "run-pipeline" | "generate-execution-plan") {
    setIsSaving(true);
    setSaveStatus("");

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
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
        error?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Unable to save project output.");
      }

      const fileCount = result.files?.length || 0;
      setSaveStatus(`Saved ${fileCount} file${fileCount === 1 ? "" : "s"} to ${result.directory}`);
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
    <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-emovel border border-line bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-blue">New Project</p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-ink md:text-5xl">
              Turn a raw prompt into production assets.
            </h1>
          </div>
          <span className="rounded-emovel bg-cloud px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.14em]">
            Local v1
          </span>
        </div>

        <div className="mb-5 rounded-emovel border border-line bg-cloud p-4">
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span>
              <span className="block text-sm font-black">Execution Mode</span>
              <span className="mt-1 block text-xs font-semibold text-slate-600">
                Route the prompt into skills, builder target, publishing targets, and a local execution plan.
              </span>
            </span>
            <input
              checked={executionMode}
              className="h-5 w-5 accent-blue"
              onChange={() => setExecutionMode((current) => !current)}
              type="checkbox"
            />
          </label>
        </div>

        <label className="mb-5 block">
          <span className="mb-2 block text-sm font-bold">Project name</span>
          <input
            className="min-h-12 w-full rounded-emovel border border-line bg-cloud px-4 text-base outline-none transition focus:border-blue focus:bg-white"
            onChange={(event) => setProjectName(event.target.value)}
            value={projectName}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold">Raw prompt</span>
          <textarea
            className="min-h-[260px] w-full resize-y rounded-emovel border border-line bg-cloud p-4 text-base leading-7 outline-none transition focus:border-blue focus:bg-white"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
          />
        </label>

        <div className="mt-6">
          <p className="mb-3 text-sm font-bold">Project type</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {projectTypes.map((type) => (
              <button
                className={`min-h-11 rounded-emovel border px-4 py-3 text-left text-sm font-bold transition ${
                  projectType === type ? "border-blue bg-blue text-white" : "border-line bg-white hover:bg-cloud"
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

        <div className="mt-6">
          <p className="mb-3 text-sm font-bold">Outputs</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {outputTypes.map((output) => (
              <label
                className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-emovel border px-4 py-3 text-sm font-bold ${
                  outputs.includes(output) ? "border-mint bg-mint/15" : "border-line bg-white"
                }`}
                key={output}
              >
                <input
                  checked={outputs.includes(output)}
                  className="h-4 w-4 accent-blue"
                  onChange={() => toggleOutput(output)}
                  type="checkbox"
                />
                {output}
              </label>
            ))}
          </div>
        </div>

        {executionMode ? (
          <div className="mt-6 rounded-emovel border border-line bg-white p-4">
            <div className="grid gap-4">
              <div>
                <p className="font-mono text-xs font-black uppercase tracking-[0.16em] text-blue">
                  Intent Preview
                </p>
                <p className="mt-2 text-lg font-black capitalize">{routedCommand.intent.replace("-", " ")}</p>
                <p className="mt-1 font-mono text-xs font-bold text-slate-600">
                  Confidence: {routedCommand.confidence}
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm font-bold">Selected builder target</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {builderTargets.map((target) => (
                    <button
                      className={`min-h-11 rounded-emovel border px-4 py-3 text-left text-sm font-bold transition ${
                        builderTarget === target ? "border-blue bg-blue text-white" : "border-line bg-cloud hover:bg-white"
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
                <p className="mb-2 text-sm font-bold">Selected publishing targets</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {publishingTargets.map((target) => (
                    <label
                      className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-emovel border px-4 py-3 text-sm font-bold ${
                        selectedPublishingTargets.includes(target) ? "border-mint bg-mint/15" : "border-line bg-cloud"
                      }`}
                      key={target}
                    >
                      <input
                        checked={selectedPublishingTargets.includes(target)}
                        className="h-4 w-4 accent-blue"
                        onChange={() => togglePublishingTarget(target)}
                        type="checkbox"
                      />
                      {target}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-bold">Selected skills preview</p>
                <div className="flex flex-wrap gap-2">
                  {routedCommand.selectedSkills.map((skill) => (
                    <span className="rounded-full bg-cloud px-3 py-1 font-mono text-xs font-bold" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="min-h-12 rounded-emovel bg-blue px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#245AE0]"
            onClick={generate}
            type="button"
          >
            Generate assets
          </button>
          <button
            className="min-h-12 rounded-emovel border border-line bg-white px-5 py-3 text-sm font-black transition hover:bg-cloud"
            onClick={exportMarkdown}
            type="button"
          >
            Export markdown
          </button>
          <button
            className="min-h-12 rounded-emovel border border-line bg-white px-5 py-3 text-sm font-black transition hover:bg-cloud disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving}
            onClick={() => saveProject("save-output")}
            type="button"
          >
            Save output
          </button>
          <button
            className="min-h-12 rounded-emovel bg-ink px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving}
            onClick={() => saveProject("run-pipeline")}
            type="button"
          >
            Run Production Pipeline
          </button>
          {executionMode ? (
            <button
              className="min-h-12 rounded-emovel bg-mint px-5 py-3 text-sm font-black text-ink transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
              onClick={() => saveProject("generate-execution-plan")}
              type="button"
            >
              Generate Execution Plan
            </button>
          ) : null}
        </div>
        {saveStatus ? (
          <p className="mt-4 rounded-emovel border border-line bg-cloud p-3 font-mono text-xs font-bold text-ink">
            {saveStatus}
          </p>
        ) : null}
      </section>

      <section className="rounded-emovel border border-line bg-graphite p-5 text-white shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-mint">Output Preview</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">Structured production assets</h2>
          </div>
          <span className="rounded-emovel border border-white/15 px-3 py-2 font-mono text-xs uppercase text-white/70">
            {outputs.length || 3} panels
          </span>
        </div>

        {executionMode ? (
          <article className="mb-4 rounded-emovel border border-mint/40 bg-mint/10 p-4">
            <p className="mb-3 font-mono text-xs font-black uppercase tracking-[0.16em] text-mint">
              Execution Plan Preview
            </p>
            <pre className="max-h-[360px] overflow-auto whitespace-pre-wrap font-mono text-xs leading-5 text-white/80">
              {executionPlan}
            </pre>
          </article>
        ) : null}

        <div className="grid gap-3">
          {panels.map((panel, index) => {
            const [titleLine, ...body] = panel.split("\n");
            return (
              <article className="rounded-emovel border border-white/15 bg-white/[0.06] p-4" key={`${titleLine}-${index}`}>
                <p className="mb-3 font-mono text-xs font-black uppercase tracking-[0.16em] text-mint">
                  {index === 0 ? "Header" : `Output ${index}`}
                </p>
                <h3 className="text-xl font-black tracking-[-0.02em]">{titleLine.replace(/^#*\s*/, "")}</h3>
                <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-6 text-white/72">
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
