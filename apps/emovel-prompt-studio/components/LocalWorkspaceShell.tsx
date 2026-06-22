"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  completeProjectPipeline,
  migrateProjectToSchemaV1,
  type ProjectAssets,
  type ProjectExportRecord,
  type ProjectSchemaV1,
  type RefinedBrief,
  type ReviewAsset,
  type ReviewExplanation,
  type ReviewMetric,
  type ReviewMetricStatus,
} from "../lib/project-schema";

type GeneratedAssets = ProjectAssets;
type LocalProject = ProjectSchemaV1;
type ProjectBrief = RefinedBrief;
type ActionNoticeTone = "success" | "error" | "info";
type RegenerateStatus = "idle" | "running" | "done" | "failed";

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
  { id: "review", title: "Review", eyebrow: "Quality scoring", nextAction: "Improve any Acceptable or Weak asset before export." },
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
  metrics: "Quality metrics",
  productReadiness: "Product Readiness",
  buildReadiness: "Build Readiness",
  launchReadiness: "Launch Readiness",
  summary: "Summary",
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

function briefValue(value: string | undefined, fallback: string) {
  return value?.trim() || fallback;
}

function clampScore(value: number) {
  return Math.max(1, Math.min(10, value));
}

function scoreText(value: string, baseline: number) {
  return clampScore(baseline + Math.min(3, Math.floor(value.length / 160)));
}

function scoreList(values: string[], baseline: number) {
  return clampScore(baseline + Math.min(3, values.length - 2));
}

function metricStatus(score: number): ReviewMetricStatus {
  if (score >= 8) return "Strong";
  if (score >= 6) return "Acceptable";
  return "Weak";
}

function metric(
  label: string,
  score: number,
  completedElements: string[],
  missingElements: string[],
  whatImprovesIt: string
): ReviewMetric {
  const status = metricStatus(score);
  return {
    label,
    score,
    status,
    completedElements,
    missingElements,
    whyThisScore: `${label} is ${status.toLowerCase()} because ${completedElements.join(", ")} are present, while ${missingElements.join(", ")} still need more evidence.`,
    whatImprovesIt,
    improvementNote: whatImprovesIt,
  };
}

function average(values: number[]) {
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

function explanation(
  score: number,
  label: string,
  completedElements: string[],
  missingElements: string[],
  whatImprovesIt: string
): ReviewExplanation {
  const status = metricStatus(score);
  return {
    score,
    status,
    completedElements,
    missingElements,
    whyThisScore: `${label} is ${score}/10 because ${completedElements.join(", ")} are complete and ${missingElements.join(", ")} remain incomplete.`,
    whatImprovesIt,
  };
}

function generateReview(assets: Omit<GeneratedAssets, "review">): ReviewAsset {
  const metrics = [
    metric(
      "Strategy clarity",
      average([
        scoreText(assets.strategy.audience, 6),
        scoreText(assets.strategy.positioning, 6),
        scoreText(assets.strategy.opportunity, 6),
      ]),
      ["audience", "positioning", "opportunity"],
      ["measurable success signal", "specific market proof"],
      "Sharpen the target audience and make the opportunity measurable in one sentence."
    ),
    metric(
      "Offer strength",
      average([
        scoreText(assets.offer.offerName, 6),
        scoreList(assets.offer.deliverables, 6),
        scoreText(assets.offer.guarantee, 5),
      ]),
      ["offer name", "deliverables", "guarantee"],
      ["pricing proof", "clear transformation timeline"],
      "Add a more specific transformation, stronger pricing rationale, or risk reversal."
    ),
    metric(
      "Copy quality",
      average([
        scoreText(assets.copy.headline, 5),
        scoreText(assets.copy.subheadline, 6),
        scoreText(assets.copy.offerDescription, 6),
      ]),
      ["headline", "subheadline", "CTA", "offer description"],
      ["stronger objection handling", "more specific customer language"],
      "Make the headline more outcome-specific and ensure the CTA matches the buyer intent."
    ),
    metric(
      "UX completeness",
      average([
        scoreList(assets.ux.pageStructure, 6),
        scoreList(assets.ux.sections, 6),
        scoreText(assets.ux.hierarchy, 6),
      ]),
      ["page structure", "sections", "hierarchy"],
      ["edge states", "mobile behavior", "screen-level primary actions"],
      "Add edge states, mobile behavior, and the exact primary action for each screen."
    ),
    metric(
      "Design direction",
      average([
        scoreList(assets.design.colorPalette, 6),
        scoreText(assets.design.typography, 6),
        scoreText(assets.design.visualDirection, 6),
      ]),
      ["color palette", "typography", "visual direction"],
      ["spacing rules", "component states", "interaction details"],
      "Attach concrete spacing, component, and interaction rules to the visual direction."
    ),
    metric(
      "Build readiness",
      average([
        scoreText(assets.build.nextAppBrief, 6),
        scoreList(assets.build.routeStructure, 6),
        scoreList(assets.build.acceptanceChecklist, 6),
      ]),
      ["Next.js brief", "route structure", "acceptance checklist"],
      ["ordered implementation tasks", "data model", "expected files"],
      "Break the build plan into ordered implementation tasks and define expected files."
    ),
    metric(
      "Publish readiness",
      average([
        scoreText(assets.publish.gumroadListing, 6),
        scoreList(assets.publish.socialPosts, 6),
        scoreList(assets.publish.finalLaunchChecklist, 6),
      ]),
      ["Gumroad listing", "social posts", "final checklist"],
      ["launch timing", "screenshots", "channel-specific edits"],
      "Add launch timing, screenshots, and final channel-specific edits before publishing."
    ),
  ];
  const productReadiness = average([
    metrics[0].score,
    metrics[1].score,
    metrics[2].score,
    metrics[3].score,
    metrics[4].score,
  ]);
  const buildReadiness = metrics[5].score;
  const launchReadiness = metrics[6].score;

  return {
    metrics,
    productReadiness,
    buildReadiness,
    launchReadiness,
    productReadinessExplanation: explanation(
      productReadiness,
      "Product Readiness",
      ["strategy", "offer", "copy", "UX", "design direction"],
      ["validation proof", "edited final copy", "decision-ready product constraints"],
      "Improve the weakest product metric first, then edit the offer and copy until the promise, buyer, and flow are specific."
    ),
    buildReadinessExplanation: explanation(
      buildReadiness,
      "Build Readiness",
      ["app brief", "routes", "component hierarchy", "acceptance checklist"],
      ["data model", "implementation order", "integration assumptions"],
      "Add file-level tasks, state/data requirements, and acceptance checks that a builder can execute without interpretation."
    ),
    launchReadinessExplanation: explanation(
      launchReadiness,
      "Launch Readiness",
      ["listing draft", "social posts", "email copy", "launch checklist"],
      ["launch calendar", "proof assets", "channel-specific final pass"],
      "Add timing, screenshots, proof, and final platform-specific edits before treating this as publish-ready."
    ),
    summary: `Overall readiness is ${average([productReadiness, buildReadiness, launchReadiness])}/10. Prioritize the lowest-scoring category before exporting final deliverables.`,
  };
}

function generateAssets(prompt: string, title: string, brief?: ProjectBrief): GeneratedAssets {
  const concept = briefValue(brief?.productType, stripPromptCommand(prompt));
  const market = briefValue(brief?.productType, inferMarket(prompt));
  const audience = briefValue(brief?.targetAudience, inferAudience(prompt));
  const platform = briefValue(brief?.platform, "web workspace");
  const tone = briefValue(brief?.tone, "premium, clear, and decisive");
  const launchGoal = briefValue(brief?.launchGoal, "turn the idea into publish-ready launch assets");
  const pricePoint = briefValue(brief?.pricePoint, "pilot price with premium upgrade");
  const offerName = `${title.replace(/\.$/, "")} Launch System`;
  const gumroadListing = `# ${offerName}

Turn "${concept}" into a complete launch workspace.

This package gives ${audience} a ready-to-use ${platform} command center with strategy, offer, copy, UX, design, build, and publish assets generated locally from one prompt.

What's included:
- Strategy, positioning, and opportunity map
- Offer package with pricing and guarantee
- Landing copy, UX hierarchy, and visual direction
- Build plan and publish-ready launch assets

Best for: ${audience}.
Tone: ${tone}.
Launch goal: ${launchGoal}.
Monetization: ${pricePoint}.

CTA: Get the launch workspace`;
  const socialPosts = [
    `I built a launch workspace for ${concept}. One prompt now becomes strategy, copy, UX, design, build, and publish assets.`,
    `Most ideas stall between "interesting" and "shipped." ${offerName} turns the messy middle into a structured launch system.`,
    `New workflow: write the outcome, open the workspace, review Strategy to Publish, then export the pack. No API calls required.`,
    `The best product tools reduce decisions. This one gives ${audience} the next asset, the next action, and the launch checklist.`,
    `Behind the scenes: ${market} positioning, ${platform} UX, ${tone} copy, offer architecture, build map, publish plan.`,
    `If you have a prompt but not a launch plan, this workspace turns it into something you can actually ship.`,
    `Launching soon: ${offerName}. Built for ${audience} who want polished product assets without a long production cycle.`,
  ];
  const emailLaunchCopy = `Subject: ${offerName} is ready

Hey,

I just finished a local-first launch workspace for ${concept}.

It turns one prompt into the assets you normally have to assemble across separate docs: strategy, offer, copy, ${platform} UX, design direction, build plan, and publish prep.

The goal is simple: help ${audience} ${launchGoal} faster, without waiting on manual planning cycles.

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

The app should feel like a ${tone} ${platform} experience for ${audience}. The primary user journey is: land on the homepage, understand the offer, complete the primary action, then move toward ${launchGoal}.

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

  const assetsWithoutReview: Omit<GeneratedAssets, "review"> = {
    strategy: {
      audience,
      problem: `${sentenceCase(audience)} need a ${tone} way to turn ${concept} into a specific ${platform} experience without losing momentum across strategy, UX, copy, build direction, and launch material.`,
      positioning: `${concept} is positioned as a premium ${market} for ${audience}, built around ${platform} execution and the goal to ${launchGoal}.`,
      opportunity: `Own the gap between raw AI prompting and finished launch operations by making the ${platform} feel decisive, visual, and ready to monetize through ${pricePoint}.`,
    },
    offer: {
      offerName,
      pricing: pricePoint,
      deliverables: [
        `Strategy brief for ${audience} with problem, positioning, and opportunity`,
        `Offer architecture for ${pricePoint} with deliverables and guarantee`,
        `${platform} copy, UX structure, ${tone} design direction, build map, and publish plan`,
      ],
      guarantee: `If the workspace does not clarify how to ${launchGoal} in 30 minutes, revise the prompt or brief and regenerate the package at no extra cost.`,
    },
    copy: {
      headline: `${concept} for ${audience}.`,
      subheadline: `EMOVEL turns one prompt into a ${tone} ${platform} workspace with strategy, offer, copy, UX, design, build, and publish assets.`,
      cta: "Generate Workspace",
      offerDescription: `A local-first launch workspace for ${audience}, designed to ${launchGoal} with ${platform} assets, ${tone} messaging, and ${pricePoint} monetization logic.`,
    },
    ux: {
      pageStructure: [
        `Hero that explains ${concept} for ${audience}`,
        `${platform} flow that drives users toward ${launchGoal}`,
        "Generated workspace with left navigation, focused asset view, and project inspector",
        `Publish-ready section with checklist and ${pricePoint} monetization path`,
      ],
      sections: ["Hero", "Audience proof", "Offer", "Primary action", "Workspace shell", "Asset preview", "Publish plan"],
      hierarchy: `Lead with the ${launchGoal} outcome, make ${audience} feel seen, then use the ${platform} route as the core surface where each asset is reviewed one at a time.`,
    },
    design: {
      colorPalette: ["#05020A base", "#120A20 panels", "#8B5CF6 primary violet", "#A855F7 glow accent", "rgba(255,255,255,0.72) text"],
      typography: `Use ${tone} sans-serif hierarchy: confident headings, small uppercase metadata, and readable 14-16px body text for ${audience}.`,
      visualDirection: `Dark luxury AI OS adapted to ${platform}: Linear clarity, Vercel spacing discipline, Raycast command density, glass borders, and cinematic violet spotlighting.`,
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

  return {
    ...assetsWithoutReview,
    review: generateReview(assetsWithoutReview),
  };
}

function projectWithAssets(project: LocalProject): LocalProject {
  const completedAt = new Date().toISOString();
  const completedPipeline =
    project.pipeline.status === "completed"
      ? project.pipeline
      : completeProjectPipeline(project.id, project.createdAt, completedAt);

  if (
    project.assets &&
    "review" in project.assets &&
    project.assets.review &&
    "productReadinessExplanation" in project.assets.review &&
    "buildReadinessExplanation" in project.assets.review &&
    "launchReadinessExplanation" in project.assets.review &&
    project.assets.build &&
    "nextAppBrief" in project.assets.build &&
    "routeStructure" in project.assets.build &&
    "componentHierarchy" in project.assets.build &&
    "tailwindDesignRules" in project.assets.build &&
    "gptPilotPrompt" in project.assets.build &&
    "acceptanceChecklist" in project.assets.build &&
    project.assets.publish &&
    "gumroadListing" in project.assets.publish &&
    "socialPosts" in project.assets.publish &&
    "emailLaunchCopy" in project.assets.publish &&
    "finalLaunchChecklist" in project.assets.publish
  ) {
    return {
      ...project,
      pipeline: completedPipeline,
      lastUpdatedAt: project.pipeline.status === "completed" ? project.lastUpdatedAt : completedAt,
    };
  }

  if (project.assets) {
    const generated = generateAssets(project.prompt, project.title, project.refinedBrief);
    return {
      ...project,
      lastUpdatedAt: completedAt,
      pipeline: completeProjectPipeline(project.id, project.createdAt, completedAt),
      assets: {
        ...generated,
        ...project.assets,
        build: {
          ...generated.build,
          ...project.assets.build,
        },
        publish: {
          ...generated.publish,
          ...project.assets.publish,
        },
        review: generateReview({
          strategy: project.assets.strategy || generated.strategy,
          offer: project.assets.offer || generated.offer,
          copy: project.assets.copy || generated.copy,
          ux: project.assets.ux || generated.ux,
          design: project.assets.design || generated.design,
          build: {
            ...generated.build,
            ...project.assets.build,
          },
          publish: {
            ...generated.publish,
            ...project.assets.publish,
          },
        }),
      },
    };
  }

  return {
    ...project,
    lastUpdatedAt: completedAt,
    pipeline: completeProjectPipeline(project.id, project.createdAt, completedAt),
    assets: generateAssets(project.prompt, project.title, project.refinedBrief),
  };
}

function overviewAsset(project: LocalProject) {
  return {
    "Project title": project.title,
    Status: project.status,
    "Product type": project.refinedBrief.productType || "Inferred from prompt",
    "Target audience": project.refinedBrief.targetAudience || "Inferred from prompt",
    Platform: project.refinedBrief.platform || "Inferred from prompt",
    Tone: project.refinedBrief.tone || "Inferred from prompt",
    "Launch goal": project.refinedBrief.launchGoal || "Inferred from prompt",
    "Price point": project.refinedBrief.pricePoint || "Inferred from prompt",
    "Pipeline status": project.pipeline.status,
    "Pipeline steps": project.pipeline.steps.map(
      (step) => `${step.id}: ${step.status}${step.message ? ` - ${step.message}` : ""}`
    ),
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

function editableValueToDraft(value: string | string[]) {
  if (Array.isArray(value)) return value.join("\n");
  return value;
}

function draftToEditableValue(draft: string, previous: string | string[]) {
  if (!Array.isArray(previous)) return draft.trim();
  return draft
    .split("\n")
    .map((item) => item.trim().replace(/^[-*]\s+/, ""))
    .filter(Boolean);
}

function reviewFromAssets(assets: GeneratedAssets): ReviewAsset {
  return generateReview({
    strategy: assets.strategy,
    offer: assets.offer,
    copy: assets.copy,
    ux: assets.ux,
    design: assets.design,
    build: assets.build,
    publish: assets.publish,
  });
}

function EditableAssetField({
  label,
  value,
  onSave,
}: {
  label: string;
  value: string | string[];
  onSave: (value: string | string[]) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(editableValueToDraft(value));

  useEffect(() => {
    if (!editing) setDraft(editableValueToDraft(value));
  }, [editing, value]);

  function saveDraft() {
    onSave(draftToEditableValue(draft, value));
    setEditing(false);
  }

  function cancelEdit() {
    setDraft(editableValueToDraft(value));
    setEditing(false);
  }

  return (
    <div className="rounded-2xl border border-white/[0.055] bg-white/[0.025] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#A855F7]/75">
          {label}
        </p>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-xs font-bold text-white/54 transition hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveDraft}
                className="rounded-xl bg-[#8B5CF6] px-3 py-1.5 text-xs font-black text-white shadow-[0_10px_28px_rgba(139,92,246,0.25)] transition hover:bg-[#A855F7]"
              >
                Save
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-white/64 transition hover:border-[#A855F7]/35 hover:text-white"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {editing ? (
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={Array.isArray(value) ? Math.max(5, value.length + 1) : 5}
          className="mt-3 min-h-32 w-full resize-y rounded-2xl border border-[#A855F7]/24 bg-black/24 p-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/24 focus:border-[#A855F7]/60 focus:ring-2 focus:ring-[#8B5CF6]/20"
        />
      ) : Array.isArray(value) ? (
        <ul className="mt-3 grid gap-2">
          {value.map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-6 text-white/64">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8B5CF6]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/66">{value}</p>
      )}
    </div>
  );
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
      schemaVersion: project.schemaVersion,
      title: project.title,
      prompt: project.prompt,
      refinedBrief: project.refinedBrief,
      createdAt: project.createdAt,
      lastUpdatedAt: project.lastUpdatedAt,
      status: project.status,
      pipeline: project.pipeline,
      exports: project.exports,
      versions: project.versions,
      metadata: project.metadata,
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

function selectedSectionExportFiles(project: LocalProject, section: WorkspaceSection) {
  const projectName = slugify(project.title);
  const root = `exports/${projectName}`;
  const fileName = section.id === "overview" ? "overview" : section.id;
  const markdown =
    section.id === "review" ? reviewReportMarkdown(project) : sectionMarkdown(section, project);
  const jsonContent = JSON.stringify(
    {
      id: project.id,
      schemaVersion: project.schemaVersion,
      title: project.title,
      prompt: project.prompt,
      refinedBrief: project.refinedBrief,
      createdAt: project.createdAt,
      lastUpdatedAt: project.lastUpdatedAt,
      status: project.status,
      pipeline: project.pipeline,
      selectedSection: section.id,
      asset: selectedAsset(project, section.id),
    },
    null,
    2
  );

  return [
    {
      path: `${root}/${fileName}.md`,
      content: markdown,
    },
    {
      path: `${root}/${fileName}.json`,
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
            schemaVersion: project.schemaVersion,
            title: project.title,
            prompt: project.prompt,
            refinedBrief: project.refinedBrief,
            createdAt: project.createdAt,
            lastUpdatedAt: project.lastUpdatedAt,
            status: project.status,
            pipeline: project.pipeline,
            exports: project.exports,
            versions: project.versions,
            metadata: project.metadata,
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
            schemaVersion: project.schemaVersion,
            title: project.title,
            prompt: project.prompt,
            refinedBrief: project.refinedBrief,
            createdAt: project.createdAt,
            lastUpdatedAt: project.lastUpdatedAt,
            status: project.status,
            pipeline: project.pipeline,
            exports: project.exports,
            versions: project.versions,
            metadata: project.metadata,
          },
          build,
        },
        null,
        2
      ),
    },
  ];
}

function reviewReportMarkdown(project: LocalProject) {
  const review = project.assets?.review;
  if (!review) return "";

  return `# Quality Review Report

Project: ${project.title}
Status: ${project.status}

## Overall readiness
- Product Readiness: ${review.productReadiness}/10
- Build Readiness: ${review.buildReadiness}/10
- Launch Readiness: ${review.launchReadiness}/10

## Readiness explanations
### Product Readiness
- Status: ${review.productReadinessExplanation.status}
- Why this score: ${review.productReadinessExplanation.whyThisScore}
- What improves it: ${review.productReadinessExplanation.whatImprovesIt}
- Completed elements: ${review.productReadinessExplanation.completedElements.join(", ")}
- Missing elements: ${review.productReadinessExplanation.missingElements.join(", ")}

### Build Readiness
- Status: ${review.buildReadinessExplanation.status}
- Why this score: ${review.buildReadinessExplanation.whyThisScore}
- What improves it: ${review.buildReadinessExplanation.whatImprovesIt}
- Completed elements: ${review.buildReadinessExplanation.completedElements.join(", ")}
- Missing elements: ${review.buildReadinessExplanation.missingElements.join(", ")}

### Launch Readiness
- Status: ${review.launchReadinessExplanation.status}
- Why this score: ${review.launchReadinessExplanation.whyThisScore}
- What improves it: ${review.launchReadinessExplanation.whatImprovesIt}
- Completed elements: ${review.launchReadinessExplanation.completedElements.join(", ")}
- Missing elements: ${review.launchReadinessExplanation.missingElements.join(", ")}

## Summary
${review.summary}

## Metrics
${review.metrics
  .map(
    (item) => `### ${item.label}
- Score: ${item.score}/10
- Status: ${item.status}
- Why this score: ${item.whyThisScore}
- What improves it: ${item.whatImprovesIt}
- Completed elements: ${item.completedElements.join(", ")}
- Missing elements: ${item.missingElements.join(", ")}`
  )
  .join("\n\n")}
`;
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
  const [reviewCopied, setReviewCopied] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"markdown" | "json" | "zip">("zip");
  const [actionNotice, setActionNotice] = useState<{
    tone: ActionNoticeTone;
    message: string;
  } | null>(null);
  const [regenerateStatus, setRegenerateStatus] = useState<RegenerateStatus>("idle");

  useEffect(() => {
    const stored = localStorage.getItem(`emovel-project:${id}`);
    if (stored) {
      const migrated = migrateProjectToSchemaV1(JSON.parse(stored));
      if (!migrated) {
        setLoaded(true);
        return;
      }
      const hydrated = projectWithAssets(migrated);
      setProject(hydrated);
      localStorage.setItem(`emovel-project:${id}`, JSON.stringify(hydrated));

      const list = localStorage.getItem("emovel-projects");
      if (list) {
        const projects = (JSON.parse(list) as unknown[])
          .map((item) => migrateProjectToSchemaV1(item))
          .filter((item): item is LocalProject => Boolean(item))
          .map((item) => (item.id === hydrated.id ? hydrated : item));
        localStorage.setItem("emovel-projects", JSON.stringify(projects));
      }
    }
    setLoaded(true);
  }, [id]);

  const selectedSection = useMemo(
    () => workspaceSections.find((section) => section.id === selectedId) || workspaceSections[0],
    [selectedId]
  );

  useEffect(() => {
    setRegenerateStatus("idle");
    setActionNotice(null);
  }, [selectedId]);

  const currentAsset = useMemo(() => {
    if (!project) return {};
    return selectedAsset(project, selectedSection.id);
  }, [project, selectedSection.id]);

  const currentExportFiles = useMemo(() => {
    if (!project) return [];
    return selectedSectionExportFiles(project, selectedSection);
  }, [project, selectedSection]);

  const publish = project?.assets?.publish;
  const build = project?.assets?.build;
  const review = project?.assets?.review;

  function showActionNotice(message: string, tone: ActionNoticeTone = "success") {
    setActionNotice({ message, tone });
    window.setTimeout(() => setActionNotice(null), 2200);
  }

  async function writeClipboard(value: string) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();

    if (!copied) {
      throw new Error("Clipboard copy failed.");
    }
  }

  function persistProject(nextProject: LocalProject) {
    setProject(nextProject);
    localStorage.setItem(`emovel-project:${nextProject.id}`, JSON.stringify(nextProject));

    const list = localStorage.getItem("emovel-projects");
    if (list) {
      const projects = (JSON.parse(list) as unknown[])
        .map((item) => migrateProjectToSchemaV1(item))
        .filter((item): item is LocalProject => Boolean(item))
        .map((item) => (item.id === nextProject.id ? nextProject : item));
      localStorage.setItem("emovel-projects", JSON.stringify(projects));
    }
  }

  function saveAssetField(key: string, value: string | string[]) {
    if (!project?.assets) return;
    if (
      selectedSection.id === "overview" ||
      selectedSection.id === "review"
    ) {
      return;
    }

    const sectionId = selectedSection.id as keyof Omit<GeneratedAssets, "review">;
    const nextAssets = {
      ...project.assets,
      [sectionId]: {
        ...project.assets[sectionId],
        [key]: value,
      },
    } as GeneratedAssets;

    const nextProject: LocalProject = {
      ...project,
      lastUpdatedAt: new Date().toISOString(),
      assets: {
        ...nextAssets,
        review: reviewFromAssets(nextAssets),
      },
    };

    persistProject(nextProject);
  }

  function recordExport(format: ProjectExportRecord["format"], filename: string) {
    if (!project) return;
    const now = new Date().toISOString();
    persistProject({
      ...project,
      lastUpdatedAt: now,
      exports: [
        ...project.exports,
        {
          id: `${project.id}-export-${Date.now().toString(36)}`,
          format,
          filename,
          createdAt: now,
        },
      ],
    });
  }

  async function copySection() {
    if (!project) return;
    try {
      await writeClipboard(
        selectedSection.id === "review"
          ? reviewReportMarkdown(project)
          : sectionMarkdown(selectedSection, project)
      );
      setCopied(true);
      showActionNotice(`${selectedSection.title} copied to clipboard.`);
      window.setTimeout(() => setCopied(false), 1300);
    } catch {
      showActionNotice("Copy failed. Clipboard permission may be blocked.", "error");
    }
  }

  async function copyPublishAsset(label: string, value: string) {
    try {
      await writeClipboard(value);
      setPublishCopied(label);
      showActionNotice("Publish asset copied.");
      window.setTimeout(() => setPublishCopied(null), 1300);
    } catch {
      showActionNotice("Copy failed. Clipboard permission may be blocked.", "error");
    }
  }

  async function copyBuildAsset(label: string, value: string) {
    try {
      await writeClipboard(value);
      setBuildCopied(label);
      showActionNotice("Build asset copied.");
      window.setTimeout(() => setBuildCopied(null), 1300);
    } catch {
      showActionNotice("Copy failed. Clipboard permission may be blocked.", "error");
    }
  }

  async function regenerateSection() {
    if (!project?.assets) return;

    setRegenerateStatus("running");
    showActionNotice(`Regenerating ${selectedSection.title}...`, "info");

    try {
      const generated = generateAssets(project.prompt, project.title, project.refinedBrief);
      let nextAssets: GeneratedAssets = project.assets;
      let mode = "deterministic fallback";

      if (selectedSection.id === "overview") {
        nextAssets = generated;
      } else if (selectedSection.id === "review") {
        nextAssets = {
          ...project.assets,
          review: reviewFromAssets(project.assets),
        };
      } else if (selectedSection.id === "strategy") {
        let strategy = generated.strategy;

        try {
          const response = await fetch("/api/ai/generate", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              assetType: "strategy",
              prompt: project.prompt,
              refinedBrief: project.refinedBrief,
            }),
          });
          const payload = (await response.json()) as {
            mode?: "ai" | "fallback";
            fallback?: boolean;
            asset?: GeneratedAssets["strategy"];
          };

          if (payload.asset) {
            strategy = payload.asset;
            mode = payload.mode === "ai" && !payload.fallback ? "AI Mode" : "deterministic fallback";
          }
        } catch {
          mode = "deterministic fallback";
        }

        const assetsWithStrategy = {
          ...project.assets,
          strategy,
        };
        nextAssets = {
          ...assetsWithStrategy,
          review: reviewFromAssets(assetsWithStrategy),
        };
      } else {
        const sectionId = selectedSection.id as keyof Omit<GeneratedAssets, "review">;
        const assetsWithSection = {
          ...project.assets,
          [sectionId]: generated[sectionId],
        } as GeneratedAssets;
        nextAssets = {
          ...assetsWithSection,
          review: reviewFromAssets(assetsWithSection),
        };
      }

      persistProject({
        ...project,
        lastUpdatedAt: new Date().toISOString(),
        assets: nextAssets,
      });
      setRegenerateStatus("done");
      showActionNotice(`${selectedSection.title} regenerated with ${mode}.`);
      window.setTimeout(() => setRegenerateStatus("idle"), 1600);
    } catch {
      setRegenerateStatus("failed");
      showActionNotice(`Failed to regenerate ${selectedSection.title}.`, "error");
    }
  }

  function downloadExport() {
    if (!project) return;
    const projectName = slugify(project.title);
    const sectionSlug = slugify(selectedSection.title);

    if (exportFormat === "markdown") {
      const filename = `${projectName}-${sectionSlug}.md`;
      const markdownFile = currentExportFiles.find((file) => file.path.endsWith(".md"));
      recordExport("markdown", filename);
      downloadBlob(
        filename,
        new Blob([markdownFile?.content || sectionMarkdown(selectedSection, project)], { type: "text/markdown;charset=utf-8" })
      );
      showActionNotice(`${selectedSection.title} markdown exported.`);
      return;
    }

    if (exportFormat === "json") {
      const sectionJson = currentExportFiles.find((file) => file.path.endsWith(".json"));
      const filename = `${projectName}-${sectionSlug}.json`;
      recordExport("json", filename);
      downloadBlob(
        filename,
        new Blob([sectionJson?.content || "{}"], { type: "application/json;charset=utf-8" })
      );
      showActionNotice(`${selectedSection.title} JSON exported.`);
      return;
    }

    const zipBytes = createZip(currentExportFiles);
    const filename = `${projectName}-${sectionSlug}-export.zip`;
    recordExport("zip", filename);
    downloadBlob(
      filename,
      new Blob([zipBytes], { type: "application/zip" })
    );
    showActionNotice(`${selectedSection.title} package exported.`);
  }

  function downloadPublishPack() {
    if (!project) return;
    const zipBytes = createZip(publishPackFiles(project));
    const filename = `${slugify(project.title)}-publish-pack.zip`;
    recordExport("publish-pack", filename);
    downloadBlob(
      filename,
      new Blob([zipBytes], { type: "application/zip" })
    );
    showActionNotice("Publish pack exported.");
  }

  function downloadBuilderPack() {
    if (!project) return;
    const zipBytes = createZip(builderPackFiles(project));
    const filename = `${slugify(project.title)}-builder-pack.zip`;
    recordExport("builder-pack", filename);
    downloadBlob(
      filename,
      new Blob([zipBytes], { type: "application/zip" })
    );
    showActionNotice("Builder pack exported.");
  }

  async function copyReviewReport() {
    if (!project) return;
    try {
      await writeClipboard(reviewReportMarkdown(project));
      setReviewCopied(true);
      showActionNotice("Review report copied.");
      window.setTimeout(() => setReviewCopied(false), 1300);
    } catch {
      showActionNotice("Copy failed. Clipboard permission may be blocked.", "error");
    }
  }

  function downloadReviewReport() {
    if (!project) return;
    const filename = `${slugify(project.title)}-quality-review.md`;
    recordExport("review-markdown", filename);
    downloadBlob(
      filename,
      new Blob([reviewReportMarkdown(project)], { type: "text/markdown;charset=utf-8" })
    );
    showActionNotice("Review report exported.");
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
                onClick={regenerateSection}
                disabled={regenerateStatus === "running"}
                className="rounded-2xl border border-white/[0.09] bg-white/[0.045] px-4 py-2.5 text-sm font-bold text-white/72 transition hover:border-[#A855F7]/35 hover:bg-[#8B5CF6]/12 hover:text-white disabled:cursor-wait disabled:border-white/[0.06] disabled:bg-white/[0.025] disabled:text-white/32"
              >
                {regenerateStatus === "running"
                  ? "Regenerating"
                  : regenerateStatus === "done"
                    ? "Done"
                    : regenerateStatus === "failed"
                      ? "Failed"
                      : "Regenerate"}
              </button>
            </div>
          </div>

          {actionNotice ? (
            <div
              className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                actionNotice.tone === "error"
                  ? "border-red-400/20 bg-red-400/10 text-red-100"
                  : actionNotice.tone === "info"
                    ? "border-[#A855F7]/22 bg-[#8B5CF6]/10 text-violet-100"
                    : "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
              }`}
            >
              {actionNotice.message}
            </div>
          ) : null}

          {selectedId !== "review" ? (
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
              {Object.entries(currentAsset).map(([key, value]) => {
                const editable =
                  selectedSection.id !== "overview" &&
                  selectedSection.id !== "review" &&
                  (typeof value === "string" ||
                    (Array.isArray(value) && value.every((item) => typeof item === "string")));

                if (editable) {
                  return (
                    <EditableAssetField
                      key={key}
                      label={assetLabels[key] || key}
                      value={value as string | string[]}
                      onSave={(nextValue) => saveAssetField(key, nextValue)}
                    />
                  );
                }

                return (
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
                          <li key={String(item)} className="flex gap-2 text-sm leading-6 text-white/64">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8B5CF6]" />
                            <span>{String(item)}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/66">
                        {String(value)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </article>
          ) : null}

          {selectedId === "review" && review ? (
            <article className="mt-4 overflow-hidden rounded-3xl border border-[#A855F7]/22 bg-[#100719]/88">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
                <div>
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#A855F7]/75">
                    Quality review layer
                  </p>
                  <h3 className="mt-1 text-lg font-black tracking-[-0.03em] text-white">
                    Deterministic readiness report
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={copyReviewReport}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-white/64 transition hover:border-[#A855F7]/35 hover:text-white"
                  >
                    {reviewCopied ? "Copied" : "Copy review report"}
                  </button>
                  <button
                    type="button"
                    onClick={downloadReviewReport}
                    className="rounded-2xl bg-[#8B5CF6] px-4 py-2.5 text-sm font-black text-white shadow-[0_14px_40px_rgba(139,92,246,0.26)] transition hover:bg-[#A855F7]"
                  >
                    Export review report
                  </button>
                </div>
              </div>

              <div className="grid gap-3 p-5">
                <section className="grid gap-3 md:grid-cols-3">
                  {[
                    {
                      label: "Product Readiness",
                      value: review.productReadiness,
                      explanation: review.productReadinessExplanation,
                    },
                    {
                      label: "Build Readiness",
                      value: review.buildReadiness,
                      explanation: review.buildReadinessExplanation,
                    },
                    {
                      label: "Launch Readiness",
                      value: review.launchReadiness,
                      explanation: review.launchReadinessExplanation,
                    },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/[0.055] bg-white/[0.025] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/36">
                          {item.label}
                        </p>
                        <span
                          className={`rounded-full border px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] ${
                            item.explanation.status === "Strong"
                              ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
                              : item.explanation.status === "Acceptable"
                                ? "border-[#A855F7]/25 bg-[#8B5CF6]/10 text-violet-200"
                                : "border-red-400/25 bg-red-400/10 text-red-200"
                          }`}
                        >
                          {item.explanation.status}
                        </span>
                      </div>
                      <p className="mt-3 text-4xl font-black tracking-[-0.05em] text-white">
                        {item.value}
                        <span className="text-base text-white/32">/10</span>
                      </p>
                      <p className="mt-3 text-xs leading-5 text-white/50">
                        {item.explanation.whyThisScore}
                      </p>
                      <div className="mt-3 border-t border-white/[0.06] pt-3">
                        <p className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-[#A855F7]/70">
                          Improves with
                        </p>
                        <p className="mt-1 text-xs leading-5 text-white/48">
                          {item.explanation.whatImprovesIt}
                        </p>
                      </div>
                    </div>
                  ))}
                </section>

                <section className="rounded-2xl border border-white/[0.055] bg-white/[0.025] p-4">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#A855F7]/75">
                    Review summary
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/64">{review.summary}</p>
                </section>

                <section className="grid gap-3">
                  {review.metrics.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/[0.055] bg-black/16 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-black text-white">{item.label}</p>
                          <p className="mt-1 text-xs leading-5 text-white/44">{item.whyThisScore}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] ${
                              item.status === "Strong"
                                ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
                                : item.status === "Acceptable"
                                  ? "border-[#A855F7]/25 bg-[#8B5CF6]/10 text-violet-200"
                                  : "border-red-400/25 bg-red-400/10 text-red-200"
                            }`}
                          >
                            {item.status}
                          </span>
                          <span className="rounded-full border border-white/[0.07] bg-white/[0.035] px-3 py-1 font-mono text-xs font-bold text-white/60">
                            {item.score}/10
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-3 border-t border-white/[0.055] pt-4 md:grid-cols-3">
                        <div>
                          <p className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-emerald-300/70">
                            Completed
                          </p>
                          <ul className="mt-2 grid gap-1">
                            {item.completedElements.map((element) => (
                              <li key={element} className="text-xs leading-5 text-white/48">
                                {element}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-red-200/70">
                            Missing
                          </p>
                          <ul className="mt-2 grid gap-1">
                            {item.missingElements.map((element) => (
                              <li key={element} className="text-xs leading-5 text-white/48">
                                {element}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-[#A855F7]/70">
                            What improves it
                          </p>
                          <p className="mt-2 text-xs leading-5 text-white/48">{item.whatImprovesIt}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              </div>
            </article>
          ) : null}

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
                Last updated
              </p>
              <p className="mt-2 text-sm font-semibold text-white/72">
                {formatDate(project.lastUpdatedAt || project.createdAt)}
              </p>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/32">
                Source prompt
              </p>
              <p className="mt-2 max-h-44 overflow-auto rounded-2xl border border-white/[0.06] bg-black/18 p-4 text-sm leading-6 text-white/54">
                {project.prompt}
              </p>
            </div>

            {project.refinedBrief ? (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/32">
                  Refined brief
                </p>
                <div className="mt-2 grid gap-2 rounded-2xl border border-white/[0.06] bg-black/18 p-4">
                  {[
                    ["Product", project.refinedBrief.productType],
                    ["Audience", project.refinedBrief.targetAudience],
                    ["Platform", project.refinedBrief.platform],
                    ["Tone", project.refinedBrief.tone],
                    ["Goal", project.refinedBrief.launchGoal],
                    ["Price", project.refinedBrief.pricePoint],
                  ].map(([label, value]) => (
                    <div key={label} className="grid gap-0.5">
                      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#A855F7]/60">
                        {label}
                      </span>
                      <span className="text-xs leading-5 text-white/54">{value || "Inferred"}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

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
                Export selected section
              </p>
              <h3 className="mt-3 text-2xl font-black tracking-[-0.045em] text-white">
                Download {selectedSection.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/48">
                Preview the selected deliverable before exporting. ZIP keeps the file
                structure under exports/{slugify(project.title)}/.
              </p>

              <div className="mt-6 grid gap-2">
                {[
                  { id: "markdown", label: "Markdown", description: "Selected section .md file" },
                  { id: "json", label: "JSON", description: "Selected section data" },
                  { id: "zip", label: "ZIP package", description: "Selected section files" },
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
