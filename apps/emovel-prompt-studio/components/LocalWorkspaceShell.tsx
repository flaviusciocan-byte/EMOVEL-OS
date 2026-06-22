"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type LocalProjectStatus = "Generating" | "Ready";

type StrategyAsset = {
  audience: string;
  problem: string;
  positioning: string;
  opportunity: string;
};

type OfferAsset = {
  offerName: string;
  pricing: string;
  deliverables: string[];
  guarantee: string;
};

type CopyAsset = {
  headline: string;
  subheadline: string;
  cta: string;
  offerDescription: string;
};

type UXAsset = {
  pageStructure: string[];
  sections: string[];
  hierarchy: string;
};

type DesignAsset = {
  colorPalette: string[];
  typography: string;
  visualDirection: string;
};

type BuildAsset = {
  stack: string[];
  pages: string[];
  components: string[];
};

type PublishAsset = {
  launchChecklist: string[];
  contentPlan: string[];
  distributionChannels: string[];
};

type GeneratedAssets = {
  strategy: StrategyAsset;
  offer: OfferAsset;
  copy: CopyAsset;
  ux: UXAsset;
  design: DesignAsset;
  build: BuildAsset;
  publish: PublishAsset;
};

type LocalProject = {
  id: string;
  title: string;
  prompt: string;
  createdAt: string;
  status: LocalProjectStatus;
  assets?: GeneratedAssets;
};

type WorkspaceSection = {
  id: "overview" | keyof GeneratedAssets;
  title: string;
  eyebrow: string;
  nextAction: string;
};

type LocalWorkspaceShellProps = {
  id: string;
};

const workspaceSections: WorkspaceSection[] = [
  { id: "overview", title: "Overview", eyebrow: "Workspace brief", nextAction: "Review Strategy and confirm the audience." },
  { id: "strategy", title: "Strategy", eyebrow: "Audience and positioning", nextAction: "Lock the target audience and opportunity." },
  { id: "offer", title: "Offer", eyebrow: "Commercial package", nextAction: "Review price and guarantee before writing copy." },
  { id: "copy", title: "Copy", eyebrow: "Conversion messaging", nextAction: "Use the headline and CTA as the landing page anchor." },
  { id: "ux", title: "UX", eyebrow: "Page flow", nextAction: "Turn the hierarchy into the first page wireframe." },
  { id: "design", title: "Design", eyebrow: "Visual system", nextAction: "Apply the palette and typography to the primary screen." },
  { id: "build", title: "Build", eyebrow: "Implementation map", nextAction: "Create the pages and component list in the build workspace." },
  { id: "publish", title: "Publish", eyebrow: "Launch plan", nextAction: "Work through the launch checklist before distribution." },
];

const assetLabels: Record<string, string> = {
  audience: "Audience",
  problem: "Problem",
  positioning: "Positioning",
  opportunity: "Opportunity",
  offerName: "Offer name",
  pricing: "Pricing",
  deliverables: "Deliverables",
  guarantee: "Guarantee",
  headline: "Headline",
  subheadline: "Subheadline",
  cta: "CTA",
  offerDescription: "Offer description",
  pageStructure: "Page structure",
  sections: "Sections",
  hierarchy: "Hierarchy",
  colorPalette: "Color palette",
  typography: "Typography",
  visualDirection: "Visual direction",
  stack: "Stack",
  pages: "Pages",
  components: "Components",
  launchChecklist: "Launch checklist",
  contentPlan: "Content plan",
  distributionChannels: "Distribution channels",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function sentenceCase(value: string) {
  const clean = value.trim().replace(/\s+/g, " ");
  if (!clean) return "Premium workspace";
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function stripPromptCommand(prompt: string) {
  return sentenceCase(
    prompt
      .replace(/^(create|build|design|launch|generate|make|turn)\s+/i, "")
      .replace(/\.$/, "")
  );
}

function inferMarket(prompt: string) {
  const lower = prompt.toLowerCase();
  if (lower.includes("agency")) return "premium AI agency";
  if (lower.includes("saas")) return "SaaS product";
  if (lower.includes("gumroad") || lower.includes("product")) return "digital product";
  if (lower.includes("content")) return "creator operating system";
  if (lower.includes("site") || lower.includes("landing")) return "conversion website";
  return "AI-powered launch system";
}

function inferAudience(prompt: string) {
  const lower = prompt.toLowerCase();
  if (lower.includes("founder")) return "solo founders and lean operators";
  if (lower.includes("agency")) return "service businesses selling high-trust AI transformation";
  if (lower.includes("saas")) return "B2B teams validating a new product workflow";
  if (lower.includes("creator") || lower.includes("content")) return "creators who need a repeatable publishing engine";
  return "builders who need polished product assets without a long production cycle";
}

function generateAssets(prompt: string, title: string): GeneratedAssets {
  const concept = stripPromptCommand(prompt);
  const market = inferMarket(prompt);
  const audience = inferAudience(prompt);
  const offerName = `${title.replace(/\.$/, "")} Launch System`;

  return {
    strategy: {
      audience,
      problem: `${sentenceCase(audience)} often have a clear idea but lose momentum turning it into strategy, UX, copy, build direction, and launch material.`,
      positioning: `${concept} is positioned as a premium ${market} command workspace that converts one prompt into coordinated execution assets.`,
      opportunity: `Own the gap between raw AI prompting and finished launch operations by making the workspace feel decisive, visual, and ready to act on.`,
    },
    offer: {
      offerName,
      pricing: "Pilot price: $149 for the generated launch workspace; premium package: $499 with implementation review.",
      deliverables: [
        "Strategy brief with audience, problem, positioning, and opportunity",
        "Offer architecture with pricing, deliverables, and guarantee",
        "Landing copy, UX structure, design direction, build map, and publish plan",
      ],
      guarantee: "If the workspace does not produce a clear launch direction in 30 minutes, revise the prompt and regenerate the package at no extra cost.",
    },
    copy: {
      headline: `${concept} from one prompt.`,
      subheadline: `EMOVEL turns your idea into a structured ${market} workspace with strategy, offer, copy, UX, design, build, and publish assets.`,
      cta: "Generate Workspace",
      offerDescription: `A local-first launch workspace for ${audience}, designed to move from idea to premium product entry point without waiting on AI APIs or manual planning docs.`,
    },
    ux: {
      pageStructure: [
        "Hero with outcome headline and single prompt composer",
        "Generated workspace with left navigation, focused asset view, and project inspector",
        "Publish-ready section with checklist and distribution plan",
      ],
      sections: ["Hero", "Prompt composer", "Workspace shell", "Asset preview", "Project inspector", "Publish plan"],
      hierarchy: "Lead with the primary prompt action, then use the workspace route as the core command surface where each asset is reviewed one at a time.",
    },
    design: {
      colorPalette: ["#05020A base", "#120A20 panels", "#8B5CF6 primary violet", "#A855F7 glow accent", "rgba(255,255,255,0.72) text"],
      typography: "Use dense, premium sans-serif hierarchy: oversized confident headings, small uppercase metadata, and readable 14-16px body text.",
      visualDirection: "Dark luxury AI OS with Linear clarity, Vercel spacing discipline, Raycast command density, glass borders, and cinematic violet spotlighting.",
    },
    build: {
      stack: ["Next.js App Router", "React client components", "Tailwind CSS", "localStorage persistence", "deterministic TypeScript asset generation"],
      pages: ["/", "/workspace/[id]", "/projects", "/new-project"],
      components: ["Home prompt composer", "LocalWorkspaceShell", "Section sidebar", "Asset preview card", "Project inspector", "Copy action"],
    },
    publish: {
      launchChecklist: [
        "Confirm headline, offer name, and CTA",
        "Review UX hierarchy on desktop and mobile",
        "Package screenshots and generated copy into a launch note",
        "Publish the landing page or product listing",
      ],
      contentPlan: [
        "Launch post: before/after from raw prompt to workspace",
        "Short demo: navigate Strategy to Publish sections",
        "Founder note: why local-first generated assets matter",
      ],
      distributionChannels: ["Product Hunt", "LinkedIn", "X/Twitter", "Founder communities", "Gumroad or Lemon Squeezy listing"],
    },
  };
}

function projectWithAssets(project: LocalProject): LocalProject {
  if (project.assets) return project;
  return {
    ...project,
    assets: generateAssets(project.prompt, project.title),
  };
}

function overviewAsset(project: LocalProject) {
  return {
    "Project title": project.title,
    Status: project.status,
    "Generated assets": "Strategy, Offer, Copy, UX, Design, Build, Publish",
    "Source prompt": project.prompt,
  };
}

function selectedAsset(project: LocalProject, selectedId: WorkspaceSection["id"]) {
  if (selectedId === "overview") return overviewAsset(project);
  return project.assets?.[selectedId] || {};
}

function valueToText(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => `- ${item}`).join("\n");
  return String(value);
}

function sectionMarkdown(section: WorkspaceSection, project: LocalProject) {
  const asset = selectedAsset(project, section.id);
  const fields = Object.entries(asset)
    .map(([key, value]) => `## ${assetLabels[key] || key}\n${valueToText(value)}`)
    .join("\n\n");

  return `# ${section.title}

Project: ${project.title}
Status: ${project.status}

${fields}
`;
}

export function LocalWorkspaceShell({ id }: LocalWorkspaceShellProps) {
  const [project, setProject] = useState<LocalProject | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState<WorkspaceSection["id"]>("overview");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(`emovel-project:${id}`);
    if (stored) {
      const parsed = JSON.parse(stored) as LocalProject;
      const hydrated = projectWithAssets(parsed);
      setProject(hydrated);
      localStorage.setItem(`emovel-project:${id}`, JSON.stringify(hydrated));

      const list = localStorage.getItem("emovel-projects");
      if (list) {
        const projects = (JSON.parse(list) as LocalProject[]).map((item) =>
          item.id === hydrated.id ? hydrated : item
        );
        localStorage.setItem("emovel-projects", JSON.stringify(projects));
      }
    }
    setLoaded(true);
  }, [id]);

  const selectedSection = useMemo(
    () => workspaceSections.find((section) => section.id === selectedId) || workspaceSections[0],
    [selectedId]
  );

  const currentAsset = useMemo(() => {
    if (!project) return {};
    return selectedAsset(project, selectedSection.id);
  }, [project, selectedSection.id]);

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

          <article className="mt-6 overflow-hidden rounded-3xl border border-[#8B5CF6]/18 bg-[#120A20]/78">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/34">
                  Structured Asset
                </p>
                <h3 className="mt-1 text-lg font-black tracking-[-0.03em] text-white">
                  {selectedSection.title} deliverable
                </h3>
              </div>
              <span className="rounded-full border border-[#A855F7]/24 bg-[#8B5CF6]/12 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-violet-200">
                Deterministic
              </span>
            </div>

            <div className="grid gap-3 p-5">
              {Object.entries(currentAsset).map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-2xl border border-white/[0.055] bg-white/[0.025] p-4"
                >
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#A855F7]/75">
                    {assetLabels[key] || key}
                  </p>
                  {Array.isArray(value) ? (
                    <ul className="mt-3 grid gap-2">
                      {value.map((item) => (
                        <li key={item} className="flex gap-2 text-sm leading-6 text-white/64">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8B5CF6]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm leading-7 text-white/66">{String(value)}</p>
                  )}
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
