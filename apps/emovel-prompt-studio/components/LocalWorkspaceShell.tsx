"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type LocalProject = {
  id: string;
  title: string;
  prompt: string;
  createdAt: string;
  status: "Generating" | "Ready";
};

type WorkspaceSection = {
  id: string;
  title: string;
  eyebrow: string;
  summary: string;
  previewTitle: string;
  bullets: string[];
  nextAction: string;
};

type LocalWorkspaceShellProps = {
  id: string;
};

const workspaceSections: WorkspaceSection[] = [
  {
    id: "overview",
    title: "Overview",
    eyebrow: "Workspace brief",
    summary:
      "A local command center for turning the source prompt into a structured launch package. Review each section, then move from strategy to publish-ready assets.",
    previewTitle: "Product workspace",
    bullets: [
      "Clarify the intended outcome and buyer.",
      "Shape the offer, narrative, UX, and visual direction.",
      "Prepare a build plan and launch checklist.",
    ],
    nextAction: "Review Strategy and lock the target user.",
  },
  {
    id: "strategy",
    title: "Strategy",
    eyebrow: "Market direction",
    summary:
      "Position this as a premium outcome-driven product system. Lead with the transformation, define one ideal buyer, and make the first milestone obvious within the first screen.",
    previewTitle: "Strategic angle",
    bullets: [
      "Primary buyer: founder or operator who needs launch assets quickly.",
      "Promise: one prompt becomes a coordinated product workspace.",
      "Differentiator: strategy, UX, copy, build, and publish live together.",
    ],
    nextAction: "Confirm the buyer and the first measurable outcome.",
  },
  {
    id: "offer",
    title: "Offer",
    eyebrow: "Commercial shape",
    summary:
      "Package the outcome as a complete launch asset: landing page, product narrative, conversion copy, workspace plan, and publish checklist.",
    previewTitle: "Offer stack",
    bullets: [
      "Core asset: product workspace generated from the prompt.",
      "Bonus assets: launch copy, visual brief, and build checklist.",
      "Decision point: choose one CTA and make the value immediately visible.",
    ],
    nextAction: "Write the one-line promise customers should remember.",
  },
  {
    id: "copy",
    title: "Copy",
    eyebrow: "Messaging stack",
    summary:
      "Use a direct headline, one proof-led subheadline, three benefit blocks, and a single CTA. Avoid tool jargon. Sell the finished state, not the process.",
    previewTitle: "Copy direction",
    bullets: [
      "Headline: name the outcome in plain language.",
      "Subheadline: explain what EMOVEL creates and why it matters.",
      "CTA: Generate Workspace, consistently repeated.",
    ],
    nextAction: "Draft the first-page headline and CTA pair.",
  },
  {
    id: "ux",
    title: "UX",
    eyebrow: "User path",
    summary:
      "Open with the primary action, then progressively reveal details. The path should be prompt, generated workspace, review sections, then publish package.",
    previewTitle: "Experience flow",
    bullets: [
      "Left rail controls context without stealing focus.",
      "Center panel shows the selected asset only.",
      "Right panel keeps project metadata and next action visible.",
    ],
    nextAction: "Review whether the next click is always obvious.",
  },
  {
    id: "design",
    title: "Design",
    eyebrow: "Visual direction",
    summary:
      "Dark violet luxury AI OS. Use cinematic glow, glass panels, crisp typography, restrained motion, and high-contrast action states around the workspace CTA.",
    previewTitle: "Design system notes",
    bullets: [
      "Palette: #05020A base, #8B5CF6 and #A855F7 accents.",
      "Surfaces: translucent panels, thin borders, inner highlight.",
      "Mood: Linear precision, Vercel restraint, Raycast command clarity.",
    ],
    nextAction: "Keep visual weight on the selected asset and action buttons.",
  },
  {
    id: "build",
    title: "Build",
    eyebrow: "Implementation plan",
    summary:
      "Create a responsive Next.js shell, store project state locally, render generated sections from typed data, and preserve the route as the project command center.",
    previewTitle: "Build checklist",
    bullets: [
      "Persist local project data in browser storage.",
      "Render selected sections without server calls.",
      "Keep future regeneration disabled until AI wiring exists.",
    ],
    nextAction: "Turn the mock asset schema into persisted generated outputs.",
  },
  {
    id: "publish",
    title: "Publish",
    eyebrow: "Launch assets",
    summary:
      "Prepare a launch checklist, social announcement, product listing outline, QA pass, and a final handoff note. Treat this workspace as publish-ready draft material.",
    previewTitle: "Publish package",
    bullets: [
      "Create launch checklist and final QA pass.",
      "Prepare product listing copy and announcement copy.",
      "Bundle the handoff into a clean publish package.",
    ],
    nextAction: "Review the launch checklist before exporting assets.",
  },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function sectionMarkdown(section: WorkspaceSection, project: LocalProject) {
  return `# ${section.title}

Project: ${project.title}
Status: ${project.status}

${section.summary}

${section.bullets.map((bullet) => `- ${bullet}`).join("\n")}

Source prompt:
${project.prompt}
`;
}

export function LocalWorkspaceShell({ id }: LocalWorkspaceShellProps) {
  const [project, setProject] = useState<LocalProject | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState("overview");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(`emovel-project:${id}`);
    if (stored) {
      setProject(JSON.parse(stored) as LocalProject);
    }
    setLoaded(true);
  }, [id]);

  const selectedSection = useMemo(
    () => workspaceSections.find((section) => section.id === selectedId) || workspaceSections[0],
    [selectedId]
  );

  async function copySection() {
    if (!project) return;
    await navigator.clipboard.writeText(sectionMarkdown(selectedSection, project));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1300);
  }

  if (!loaded) {
    return (
      <main className="mx-auto max-w-6xl px-5 py-16">
        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 text-white/60">
          Loading workspace...
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-16">
        <section className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-10 text-center backdrop-blur-xl">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#A855F7]">
            Workspace not found
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white">
            This local project is not stored in this browser.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/50">
            Local projects live in browser storage. Create a new workspace from
            the Home composer to generate the shell.
          </p>
          <Link
            href="/"
            className="mt-7 inline-flex rounded-2xl bg-[#8B5CF6] px-6 py-3 text-sm font-black text-white shadow-[0_18px_55px_rgba(139,92,246,0.35)]"
          >
            Create Workspace
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-[calc(100dvh-64px)] overflow-hidden bg-[#05020A] px-4 py-5 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-160px] h-[520px] w-[880px] -translate-x-1/2 rounded-full bg-[#8B5CF6]/18 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-240px] right-[-160px] h-[520px] w-[620px] rounded-full bg-[#A855F7]/14 blur-3xl"
      />

      <section className="relative z-10 mx-auto grid max-w-[1440px] gap-4 lg:grid-cols-[240px_minmax(0,1fr)_320px]">
        <aside className="rounded-3xl border border-white/[0.075] bg-white/[0.035] p-3 backdrop-blur-2xl lg:sticky lg:top-24 lg:h-[calc(100dvh-120px)]">
          <div className="px-3 py-3">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#A855F7]">
              EMOVEL
            </p>
            <h1 className="mt-2 line-clamp-2 text-xl font-black tracking-[-0.04em] text-white">
              {project.title}
            </h1>
          </div>

          <nav className="mt-3 grid gap-1" aria-label="Workspace sections">
            {workspaceSections.map((section) => {
              const active = section.id === selectedId;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setSelectedId(section.id)}
                  className={`group flex items-center justify-between rounded-2xl px-3.5 py-3 text-left text-sm font-semibold transition ${
                    active
                      ? "bg-[#8B5CF6]/18 text-white shadow-[inset_0_0_0_1px_rgba(168,85,247,0.22)]"
                      : "text-white/50 hover:bg-white/[0.055] hover:text-white/82"
                  }`}
                >
                  <span>{section.title}</span>
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition ${
                      active ? "bg-[#A855F7] shadow-[0_0_16px_#A855F7]" : "bg-white/16 group-hover:bg-white/35"
                    }`}
                  />
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0 rounded-3xl border border-white/[0.08] bg-[#0B0614]/82 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.07] pb-6">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#A855F7]">
                {selectedSection.eyebrow}
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.055em] text-white md:text-5xl">
                {selectedSection.title}
              </h2>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={copySection}
                className="rounded-2xl border border-white/[0.09] bg-white/[0.045] px-4 py-2.5 text-sm font-bold text-white/72 transition hover:border-[#A855F7]/35 hover:bg-[#8B5CF6]/12 hover:text-white"
              >
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-2.5 text-sm font-bold text-white/28"
              >
                Regenerate
              </button>
            </div>
          </div>

          <article className="mt-6 rounded-3xl border border-white/[0.07] bg-white/[0.035] p-6">
            <p className="text-base leading-8 text-white/72">{selectedSection.summary}</p>
          </article>

          <article className="mt-4 overflow-hidden rounded-3xl border border-[#8B5CF6]/18 bg-[#120A20]/78">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/34">
                  Asset Preview
                </p>
                <h3 className="mt-1 text-lg font-black tracking-[-0.03em] text-white">
                  {selectedSection.previewTitle}
                </h3>
              </div>
              <span className="rounded-full border border-[#A855F7]/24 bg-[#8B5CF6]/12 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-violet-200">
                Draft
              </span>
            </div>

            <div className="grid gap-3 p-5">
              {selectedSection.bullets.map((bullet, index) => (
                <div
                  key={bullet}
                  className="flex gap-3 rounded-2xl border border-white/[0.055] bg-white/[0.025] p-4"
                >
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#8B5CF6]/16 font-mono text-[10px] font-black text-[#A855F7]">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-white/62">{bullet}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <aside className="rounded-3xl border border-white/[0.075] bg-white/[0.035] p-5 backdrop-blur-2xl lg:sticky lg:top-24 lg:h-[calc(100dvh-120px)]">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#A855F7]">
            Project
          </p>

          <div className="mt-5 grid gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/32">
                Status
              </p>
              <span className="mt-2 inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">
                {project.status}
              </span>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/32">
                Created
              </p>
              <p className="mt-2 text-sm font-semibold text-white/72">{formatDate(project.createdAt)}</p>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/32">
                Source prompt
              </p>
              <p className="mt-2 max-h-44 overflow-auto rounded-2xl border border-white/[0.06] bg-black/18 p-4 text-sm leading-6 text-white/54">
                {project.prompt}
              </p>
            </div>

            <div className="rounded-2xl border border-[#A855F7]/18 bg-[#8B5CF6]/10 p-4">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-violet-200/70">
                Next action
              </p>
              <p className="mt-3 text-sm leading-6 text-white/72">{selectedSection.nextAction}</p>
            </div>
          </div>

          <div className="mt-6 border-t border-white/[0.07] pt-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/28">
              Local ID
            </p>
            <p className="mt-2 break-all font-mono text-[11px] leading-5 text-white/34">{project.id}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
