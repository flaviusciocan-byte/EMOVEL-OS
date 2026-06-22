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
  nextAppBrief: string;
  routeStructure: string[];
  componentHierarchy: string[];
  tailwindDesignRules: string[];
  gptPilotPrompt: string;
  acceptanceChecklist: string[];
  stack: string[];
  pages: string[];
  components: string[];
};

type PublishAsset = {
  gumroadListing: string;
  socialPosts: string[];
  emailLaunchCopy: string;
  finalLaunchChecklist: string[];
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
  nextAppBrief: "Next.js app brief",
  routeStructure: "Route structure",
  componentHierarchy: "Component hierarchy",
  tailwindDesignRules: "Tailwind design rules",
  gptPilotPrompt: "GPT-Pilot prompt",
  acceptanceChecklist: "Acceptance checklist",
  stack: "Stack",
  pages: "Pages",
  components: "Components",
  gumroadListing: "Gumroad listing",
  socialPosts: "7 social posts",
  emailLaunchCopy: "Email launch copy",
  finalLaunchChecklist: "Final launch checklist",
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
  const gumroadListing = `# ${offerName}

Turn "${concept}" into a complete launch workspace.

This package gives ${audience} a ready-to-use product command center with strategy, offer, copy, UX, design, build, and publish assets generated locally from one prompt.

What's included:
- Strategy, positioning, and opportunity map
- Offer package with pricing and guarantee
- Landing copy, UX hierarchy, and visual direction
- Build plan and publish-ready launch assets

Best for: ${audience}.

CTA: Get the launch workspace`;
  const socialPosts = [
    `I built a launch workspace for ${concept}. One prompt now becomes strategy, copy, UX, design, build, and publish assets.`,
    `Most ideas stall between "interesting" and "shipped." ${offerName} turns the messy middle into a structured launch system.`,
    `New workflow: write the outcome, open the workspace, review Strategy to Publish, then export the pack. No API calls required.`,
    `The best product tools reduce decisions. This one gives ${audience} the next asset, the next action, and the launch checklist.`,
    `Behind the scenes: ${market} positioning, offer architecture, landing copy, UX structure, visual direction, build map, publish plan.`,
    `If you have a prompt but not a launch plan, this workspace turns it into something you can actually ship.`,
    `Launching soon: ${offerName}. Built for ${audience} who want polished product assets without a long production cycle.`,
  ];
  const emailLaunchCopy = `Subject: ${offerName} is ready

Hey,

I just finished a local-first launch workspace for ${concept}.

It turns one prompt into the assets you normally have to assemble across separate docs: strategy, offer, copy, UX, design direction, build plan, and publish prep.

The goal is simple: help ${audience} move from idea to launch-ready package faster, without waiting on manual planning cycles.

Inside you get:
- A strategic positioning brief
- A packaged offer with pricing and guarantee
- Landing page copy and UX hierarchy
- Design and build direction
- Gumroad, social, email, and checklist assets

Open the workspace, review each section, export the publish pack, and ship.

CTA: Get the launch workspace`;
  const finalLaunchChecklist = [
    "Confirm Gumroad title, price, and offer promise",
    "Paste the Gumroad listing into the product page",
    "Schedule or publish the 7 social posts",
    "Send the email launch copy to the warm list",
    "Verify checkout link, preview image, and support contact",
    "Export and archive the publish pack",
    "Do a final mobile and desktop QA pass before posting publicly",
  ];
  const nextAppBrief = `Build a premium Next.js application for ${concept}.

The app should feel like a dark luxury AI command interface for ${audience}. The primary user journey is: land on the homepage, write a prompt, generate a local workspace, review structured assets, then export builder and publish packs.

Do not add backend services or API calls. Keep all generated project data in browser localStorage.`;
  const routeStructure = [
    "/ - premium prompt composer and project creation entry point",
    "/projects - local project library with duplicate/delete/open actions",
    "/workspace/[id] - core workspace with Strategy, Offer, Copy, UX, Design, Build, Publish sections",
    "/shop - future publish package surface",
    "/settings - local configuration overview",
  ];
  const componentHierarchy = [
    "RootLayout -> NavBar -> CommandCenter",
    "HomePage -> PromptComposer -> local project creator",
    "WorkspacePage -> LocalWorkspaceShell -> Sidebar, AssetPanel, Inspector, ExportModal",
    "ProjectsPage -> ProjectCard list with localStorage actions",
    "LocalWorkspaceShell -> BuildPrepPanel and PublishPrepPanel",
  ];
  const tailwindDesignRules = [
    "Use #05020A as the page background and avoid white surfaces",
    "Use #8B5CF6 for primary actions and #A855F7 for glow accents",
    "Prefer rounded-2xl/rounded-3xl glass panels with thin white or violet borders",
    "Use compact uppercase mono labels for metadata",
    "Keep layouts sparse, command-like, and focused on one selected asset",
  ];
  const gptPilotPrompt = `You are building the EMOVEL Prompt Studio app.

Project goal:
${nextAppBrief}

Core routes:
${routeStructure.map((item) => `- ${item}`).join("\n")}

Component hierarchy:
${componentHierarchy.map((item) => `- ${item}`).join("\n")}

Design rules:
${tailwindDesignRules.map((item) => `- ${item}`).join("\n")}

Acceptance:
- No backend, shell execution, AI APIs, or external dependencies are required for this sprint.
- The workspace must generate deterministic local assets from the prompt.
- The Build section must expose builder instructions and export a builder pack.
- The UI must stay dark, premium, minimal, and violet-accented.`;
  const acceptanceChecklist = [
    "Home creates a local project object and routes to /workspace/[id]",
    "Workspace Build section displays app brief, route structure, component hierarchy, Tailwind rules, GPT-Pilot prompt, and checklist",
    "Copy GPT-Pilot prompt works from the Build tab",
    "Copy build brief works from the Build tab",
    "Export builder pack downloads a ZIP without backend calls",
    "No shell commands are executed from the UI",
    "npm.cmd run build passes",
  ];

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
      nextAppBrief,
      routeStructure,
      componentHierarchy,
      tailwindDesignRules,
      gptPilotPrompt,
      acceptanceChecklist,
      stack: ["Next.js App Router", "React client components", "Tailwind CSS", "localStorage persistence", "deterministic TypeScript asset generation"],
      pages: ["/", "/workspace/[id]", "/projects", "/new-project"],
      components: ["Home prompt composer", "LocalWorkspaceShell", "Section sidebar", "Asset preview card", "Project inspector", "Copy action"],
    },
    publish: {
      gumroadListing,
      socialPosts,
      emailLaunchCopy,
      finalLaunchChecklist,
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
  if (
    project.assets &&
    "nextAppBrief" in project.assets.build &&
    "routeStructure" in project.assets.build &&
    "componentHierarchy" in project.assets.build &&
    "tailwindDesignRules" in project.assets.build &&
    "gptPilotPrompt" in project.assets.build &&
    "acceptanceChecklist" in project.assets.build &&
    "gumroadListing" in project.assets.publish &&
    "socialPosts" in project.assets.publish &&
    "emailLaunchCopy" in project.assets.publish &&
    "finalLaunchChecklist" in project.assets.publish
  ) {
    return project;
  }

  if (project.assets) {
    const generated = generateAssets(project.prompt, project.title);
    return {
      ...project,
      assets: {
        ...project.assets,
        build: {
          ...generated.build,
          ...project.assets.build,
        },
        publish: {
          ...generated.publish,
          ...project.assets.publish,
        },
      },
    };
  }

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

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "emovel-project";
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

const exportSectionIds: (keyof GeneratedAssets)[] = [
  "strategy",
  "offer",
  "copy",
  "ux",
  "design",
  "build",
  "publish",
];

function sectionForExport(id: keyof GeneratedAssets) {
  return workspaceSections.find((section) => section.id === id) || workspaceSections[0];
}

function exportFiles(project: LocalProject) {
  const projectName = slugify(project.title);
  const root = `exports/${projectName}`;
  const markdownFiles = exportSectionIds.map((sectionId) => ({
    path: `${root}/${sectionId}.md`,
    content: sectionMarkdown(sectionForExport(sectionId), project),
  }));

  const jsonContent = JSON.stringify(
    {
      id: project.id,
      title: project.title,
      prompt: project.prompt,
      createdAt: project.createdAt,
      status: project.status,
      assets: project.assets,
    },
    null,
    2
  );

  return [
    ...markdownFiles,
    {
      path: `${root}/project.json`,
      content: jsonContent,
    },
  ];
}

function combinedMarkdown(project: LocalProject) {
  return exportSectionIds
    .map((sectionId) => sectionMarkdown(sectionForExport(sectionId), project))
    .join("\n---\n\n");
}

function publishPackFiles(project: LocalProject) {
  const root = `exports/${slugify(project.title)}/publish-pack`;
  const publish = project.assets?.publish;
  if (!publish) return [];

  return [
    {
      path: `${root}/gumroad-listing.md`,
      content: publish.gumroadListing,
    },
    {
      path: `${root}/social-posts.md`,
      content: publish.socialPosts.map((post, index) => `## Post ${index + 1}\n${post}`).join("\n\n"),
    },
    {
      path: `${root}/email-launch-copy.md`,
      content: publish.emailLaunchCopy,
    },
    {
      path: `${root}/final-launch-checklist.md`,
      content: publish.finalLaunchChecklist.map((item) => `- [ ] ${item}`).join("\n"),
    },
    {
      path: `${root}/publish-pack.json`,
      content: JSON.stringify(
        {
          project: {
            id: project.id,
            title: project.title,
            prompt: project.prompt,
            createdAt: project.createdAt,
            status: project.status,
          },
          publish,
        },
        null,
        2
      ),
    },
  ];
}

function builderPackFiles(project: LocalProject) {
  const root = `exports/${slugify(project.title)}/builder-pack`;
  const build = project.assets?.build;
  if (!build) return [];

  return [
    {
      path: `${root}/next-app-brief.md`,
      content: build.nextAppBrief,
    },
    {
      path: `${root}/route-structure.md`,
      content: build.routeStructure.map((item) => `- ${item}`).join("\n"),
    },
    {
      path: `${root}/component-hierarchy.md`,
      content: build.componentHierarchy.map((item) => `- ${item}`).join("\n"),
    },
    {
      path: `${root}/tailwind-design-rules.md`,
      content: build.tailwindDesignRules.map((item) => `- ${item}`).join("\n"),
    },
    {
      path: `${root}/gpt-pilot-prompt.md`,
      content: build.gptPilotPrompt,
    },
    {
      path: `${root}/acceptance-checklist.md`,
      content: build.acceptanceChecklist.map((item) => `- [ ] ${item}`).join("\n"),
    },
    {
      path: `${root}/builder-pack.json`,
      content: JSON.stringify(
        {
          project: {
            id: project.id,
            title: project.title,
            prompt: project.prompt,
            createdAt: project.createdAt,
            status: project.status,
          },
          build,
        },
        null,
        2
      ),
    },
  ];
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  return value >>> 0;
});

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;
  for (let index = 0; index < bytes.length; index += 1) {
    const byte = bytes[index];
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function uint16(value: number) {
  return [value & 0xff, (value >>> 8) & 0xff];
}

function uint32(value: number) {
  return [
    value & 0xff,
    (value >>> 8) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 24) & 0xff,
  ];
}

function dosDateTime(date: Date) {
  const time =
    (date.getHours() << 11) |
    (date.getMinutes() << 5) |
    Math.floor(date.getSeconds() / 2);
  const day =
    ((date.getFullYear() - 1980) << 9) |
    ((date.getMonth() + 1) << 5) |
    date.getDate();
  return { time, day };
}

function concatBytes(chunks: Uint8Array[]) {
  const size = chunks.reduce((total, chunk) => total + chunk.length, 0);
  const output = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }
  return output;
}

function createZip(files: { path: string; content: string }[]) {
  const encoder = new TextEncoder();
  const now = dosDateTime(new Date());
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = encoder.encode(file.path);
    const data = encoder.encode(file.content);
    const checksum = crc32(data);
    const localHeader = new Uint8Array([
      ...uint32(0x04034b50),
      ...uint16(20),
      ...uint16(0),
      ...uint16(0),
      ...uint16(now.time),
      ...uint16(now.day),
      ...uint32(checksum),
      ...uint32(data.length),
      ...uint32(data.length),
      ...uint16(nameBytes.length),
      ...uint16(0),
    ]);
    localParts.push(localHeader, nameBytes, data);

    const centralHeader = new Uint8Array([
      ...uint32(0x02014b50),
      ...uint16(20),
      ...uint16(20),
      ...uint16(0),
      ...uint16(0),
      ...uint16(now.time),
      ...uint16(now.day),
      ...uint32(checksum),
      ...uint32(data.length),
      ...uint32(data.length),
      ...uint16(nameBytes.length),
      ...uint16(0),
      ...uint16(0),
      ...uint16(0),
      ...uint16(0),
      ...uint32(0),
      ...uint32(offset),
    ]);
    centralParts.push(centralHeader, nameBytes);
    offset += localHeader.length + nameBytes.length + data.length;
  }

  const centralDirectory = concatBytes(centralParts);
  const endRecord = new Uint8Array([
    ...uint32(0x06054b50),
    ...uint16(0),
    ...uint16(0),
    ...uint16(files.length),
    ...uint16(files.length),
    ...uint32(centralDirectory.length),
    ...uint32(offset),
    ...uint16(0),
  ]);

  return concatBytes([...localParts, centralDirectory, endRecord]);
}

export function LocalWorkspaceShell({ id }: LocalWorkspaceShellProps) {
  const [project, setProject] = useState<LocalProject | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState<WorkspaceSection["id"]>("overview");
  const [copied, setCopied] = useState(false);
  const [publishCopied, setPublishCopied] = useState<string | null>(null);
  const [buildCopied, setBuildCopied] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"markdown" | "json" | "zip">("zip");

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

  const currentExportFiles = useMemo(() => {
    if (!project) return [];
    return exportFiles(project);
  }, [project]);

  const publish = project?.assets?.publish;
  const build = project?.assets?.build;

  async function copySection() {
    if (!project) return;
    await navigator.clipboard.writeText(sectionMarkdown(selectedSection, project));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1300);
  }

  async function copyPublishAsset(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setPublishCopied(label);
    window.setTimeout(() => setPublishCopied(null), 1300);
  }

  async function copyBuildAsset(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setBuildCopied(label);
    window.setTimeout(() => setBuildCopied(null), 1300);
  }

  function downloadExport() {
    if (!project) return;
    const projectName = slugify(project.title);

    if (exportFormat === "markdown") {
      downloadBlob(
        `${projectName}.md`,
        new Blob([combinedMarkdown(project)], { type: "text/markdown;charset=utf-8" })
      );
      return;
    }

    if (exportFormat === "json") {
      const projectJson = currentExportFiles.find((file) => file.path.endsWith("/project.json"));
      downloadBlob(
        `${projectName}.json`,
        new Blob([projectJson?.content || "{}"], { type: "application/json;charset=utf-8" })
      );
      return;
    }

    const zipBytes = createZip(currentExportFiles);
    downloadBlob(
      `${projectName}-export.zip`,
      new Blob([zipBytes], { type: "application/zip" })
    );
  }

  function downloadPublishPack() {
    if (!project) return;
    const zipBytes = createZip(publishPackFiles(project));
    downloadBlob(
      `${slugify(project.title)}-publish-pack.zip`,
      new Blob([zipBytes], { type: "application/zip" })
    );
  }

  function downloadBuilderPack() {
    if (!project) return;
    const zipBytes = createZip(builderPackFiles(project));
    downloadBlob(
      `${slugify(project.title)}-builder-pack.zip`,
      new Blob([zipBytes], { type: "application/zip" })
    );
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
                onClick={() => setExportOpen(true)}
                className="rounded-2xl bg-[#8B5CF6] px-4 py-2.5 text-sm font-black text-white shadow-[0_14px_40px_rgba(139,92,246,0.25)] transition hover:bg-[#A855F7]"
              >
                Export
              </button>
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

          {selectedId === "build" && build ? (
            <article className="mt-4 overflow-hidden rounded-3xl border border-[#A855F7]/22 bg-[#100719]/88">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
                <div>
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#A855F7]/75">
                    Builder prep layer
                  </p>
                  <h3 className="mt-1 text-lg font-black tracking-[-0.03em] text-white">
                    Actionable builder instructions
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={downloadBuilderPack}
                  className="rounded-2xl bg-[#8B5CF6] px-4 py-2.5 text-sm font-black text-white shadow-[0_14px_40px_rgba(139,92,246,0.26)] transition hover:bg-[#A855F7]"
                >
                  Export builder pack
                </button>
              </div>

              <div className="grid gap-3 p-5">
                <section className="rounded-2xl border border-white/[0.055] bg-white/[0.025] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#A855F7]/75">
                      Next.js app brief
                    </p>
                    <button
                      type="button"
                      onClick={() => copyBuildAsset("brief", build.nextAppBrief)}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-white/64 transition hover:border-[#A855F7]/35 hover:text-white"
                    >
                      {buildCopied === "brief" ? "Copied" : "Copy build brief"}
                    </button>
                  </div>
                  <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap rounded-xl bg-black/20 p-3 text-xs leading-5 text-white/54">
                    {build.nextAppBrief}
                  </pre>
                </section>

                <section className="rounded-2xl border border-white/[0.055] bg-white/[0.025] p-4">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#A855F7]/75">
                    Route structure
                  </p>
                  <ul className="mt-3 grid gap-2">
                    {build.routeStructure.map((route) => (
                      <li key={route} className="rounded-xl border border-white/[0.045] bg-black/16 p-3 text-xs leading-5 text-white/56">
                        {route}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-2xl border border-white/[0.055] bg-white/[0.025] p-4">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#A855F7]/75">
                    Component hierarchy
                  </p>
                  <ul className="mt-3 grid gap-2">
                    {build.componentHierarchy.map((component) => (
                      <li key={component} className="rounded-xl border border-white/[0.045] bg-black/16 p-3 text-xs leading-5 text-white/56">
                        {component}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-2xl border border-white/[0.055] bg-white/[0.025] p-4">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#A855F7]/75">
                    Tailwind design rules
                  </p>
                  <ul className="mt-3 grid gap-2">
                    {build.tailwindDesignRules.map((rule) => (
                      <li key={rule} className="flex gap-2 text-sm leading-6 text-white/62">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8B5CF6]" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-2xl border border-white/[0.055] bg-white/[0.025] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#A855F7]/75">
                      GPT-Pilot prompt
                    </p>
                    <button
                      type="button"
                      onClick={() => copyBuildAsset("gpt-pilot", build.gptPilotPrompt)}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-white/64 transition hover:border-[#A855F7]/35 hover:text-white"
                    >
                      {buildCopied === "gpt-pilot" ? "Copied" : "Copy GPT-Pilot prompt"}
                    </button>
                  </div>
                  <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-xl bg-black/20 p-3 text-xs leading-5 text-white/54">
                    {build.gptPilotPrompt}
                  </pre>
                </section>

                <section className="rounded-2xl border border-white/[0.055] bg-white/[0.025] p-4">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#A855F7]/75">
                    Acceptance checklist
                  </p>
                  <ul className="mt-3 grid gap-2">
                    {build.acceptanceChecklist.map((item) => (
                      <li key={item} className="flex gap-2 text-sm leading-6 text-white/62">
                        <span className="mt-1.5 h-4 w-4 shrink-0 rounded border border-[#8B5CF6]/35 bg-[#8B5CF6]/10" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </article>
          ) : null}

          {selectedId === "publish" && publish ? (
            <article className="mt-4 overflow-hidden rounded-3xl border border-[#A855F7]/22 bg-[#100719]/88">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
                <div>
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#A855F7]/75">
                    Publish prep layer
                  </p>
                  <h3 className="mt-1 text-lg font-black tracking-[-0.03em] text-white">
                    Actionable launch assets
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={downloadPublishPack}
                  className="rounded-2xl bg-[#8B5CF6] px-4 py-2.5 text-sm font-black text-white shadow-[0_14px_40px_rgba(139,92,246,0.26)] transition hover:bg-[#A855F7]"
                >
                  Export publish pack
                </button>
              </div>

              <div className="grid gap-3 p-5">
                <section className="rounded-2xl border border-white/[0.055] bg-white/[0.025] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#A855F7]/75">
                      Gumroad listing
                    </p>
                    <button
                      type="button"
                      onClick={() => copyPublishAsset("gumroad", publish.gumroadListing)}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-white/64 transition hover:border-[#A855F7]/35 hover:text-white"
                    >
                      {publishCopied === "gumroad" ? "Copied" : "Copy Gumroad listing"}
                    </button>
                  </div>
                  <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap rounded-xl bg-black/20 p-3 text-xs leading-5 text-white/54">
                    {publish.gumroadListing}
                  </pre>
                </section>

                <section className="rounded-2xl border border-white/[0.055] bg-white/[0.025] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#A855F7]/75">
                      7 social posts
                    </p>
                    <button
                      type="button"
                      onClick={() => copyPublishAsset("social", publish.socialPosts.join("\n\n"))}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-white/64 transition hover:border-[#A855F7]/35 hover:text-white"
                    >
                      {publishCopied === "social" ? "Copied" : "Copy social posts"}
                    </button>
                  </div>
                  <div className="mt-3 grid gap-2">
                    {publish.socialPosts.map((post, index) => (
                      <p
                        key={post}
                        className="rounded-xl border border-white/[0.045] bg-black/16 p-3 text-xs leading-5 text-white/56"
                      >
                        <span className="font-mono text-[#A855F7]">Post {index + 1}: </span>
                        {post}
                      </p>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border border-white/[0.055] bg-white/[0.025] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#A855F7]/75">
                      Email launch copy
                    </p>
                    <button
                      type="button"
                      onClick={() => copyPublishAsset("email", publish.emailLaunchCopy)}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-white/64 transition hover:border-[#A855F7]/35 hover:text-white"
                    >
                      {publishCopied === "email" ? "Copied" : "Copy email"}
                    </button>
                  </div>
                  <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap rounded-xl bg-black/20 p-3 text-xs leading-5 text-white/54">
                    {publish.emailLaunchCopy}
                  </pre>
                </section>

                <section className="rounded-2xl border border-white/[0.055] bg-white/[0.025] p-4">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#A855F7]/75">
                    Final launch checklist
                  </p>
                  <ul className="mt-3 grid gap-2">
                    {publish.finalLaunchChecklist.map((item) => (
                      <li key={item} className="flex gap-2 text-sm leading-6 text-white/62">
                        <span className="mt-1.5 h-4 w-4 shrink-0 rounded border border-[#8B5CF6]/35 bg-[#8B5CF6]/10" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </article>
          ) : null}
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

      {exportOpen ? (
        <div className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-20">
          <button
            type="button"
            aria-label="Close export preview"
            className="absolute inset-0 cursor-default bg-black/64 backdrop-blur-md"
            onClick={() => setExportOpen(false)}
          />

          <section className="relative z-10 grid max-h-[82dvh] w-full max-w-5xl overflow-hidden rounded-3xl border border-[#A855F7]/22 bg-[#090512]/95 shadow-[0_32px_120px_rgba(0,0,0,0.74),0_0_120px_rgba(139,92,246,0.22)] lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="border-b border-white/[0.07] p-5 lg:border-b-0 lg:border-r">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#A855F7]">
                Export current project
              </p>
              <h3 className="mt-3 text-2xl font-black tracking-[-0.045em] text-white">
                Download package
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/48">
                Preview the generated deliverables before exporting. ZIP keeps the full
                folder structure under exports/{slugify(project.title)}/.
              </p>

              <div className="mt-6 grid gap-2">
                {[
                  { id: "markdown", label: "Markdown", description: "Single combined .md file" },
                  { id: "json", label: "JSON", description: "Machine-readable project.json" },
                  { id: "zip", label: "ZIP package", description: "Full export folder with all files" },
                ].map((option) => {
                  const active = exportFormat === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setExportFormat(option.id as "markdown" | "json" | "zip")}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        active
                          ? "border-[#A855F7]/34 bg-[#8B5CF6]/16"
                          : "border-white/[0.07] bg-white/[0.025] hover:bg-white/[0.045]"
                      }`}
                    >
                      <span className="block text-sm font-black text-white">{option.label}</span>
                      <span className="mt-1 block text-xs text-white/40">{option.description}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={downloadExport}
                className="mt-6 w-full rounded-2xl bg-[#8B5CF6] px-5 py-3 text-sm font-black text-white shadow-[0_18px_55px_rgba(139,92,246,0.32)] transition hover:bg-[#A855F7]"
              >
                Download {exportFormat === "zip" ? "package" : exportFormat}
              </button>
            </aside>

            <div className="min-w-0 overflow-auto p-5">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                <div className="border-b border-white/[0.06] px-4 py-3">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/34">
                    Preview
                  </p>
                </div>
                <div className="grid gap-2 p-4">
                  {currentExportFiles.map((file) => (
                    <details
                      key={file.path}
                      className="rounded-2xl border border-white/[0.055] bg-black/16 p-3"
                    >
                      <summary className="cursor-pointer font-mono text-xs font-bold text-white/70">
                        {file.path}
                      </summary>
                      <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap rounded-xl bg-black/24 p-3 text-xs leading-5 text-white/48">
                        {file.content}
                      </pre>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
