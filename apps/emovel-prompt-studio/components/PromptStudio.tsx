"use client";

import { useMemo, useState } from "react";
import { generateMarkdown, outputTypes, projectTypes, type OutputType, type ProjectType } from "@/lib/templates";

const defaultPrompt =
  "Create a premium landing page for a productized AI launch system that turns raw ideas into offers, copy, UX direction, build plans, and launch assets.";

export function PromptStudio() {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [projectType, setProjectType] = useState<ProjectType>("landing page");
  const [outputs, setOutputs] = useState<OutputType[]>(["offer", "copy", "UX audit", "component plan"]);
  const [generated, setGenerated] = useState("");

  const markdown = useMemo(
    () => generated || generateMarkdown({ prompt, projectType, outputs }),
    [generated, outputs, projectType, prompt]
  );

  function toggleOutput(output: OutputType) {
    setOutputs((current) =>
      current.includes(output) ? current.filter((item) => item !== output) : [...current, output]
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
        </div>
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
