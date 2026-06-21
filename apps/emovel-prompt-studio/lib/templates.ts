export const projectTypes = [
  "landing page",
  "shop product",
  "SaaS app",
  "digital product",
  "Instagram campaign"
] as const;

export const outputTypes = [
  "offer",
  "copy",
  "UX audit",
  "component plan",
  "motion plan",
  "visual brief",
  "build plan",
  "launch plan"
] as const;

export type ProjectType = (typeof projectTypes)[number];
export type OutputType = (typeof outputTypes)[number];

export type StudioInput = {
  prompt: string;
  projectType: ProjectType;
  outputs: OutputType[];
};

export const pipelineFileMap: Record<OutputType, string> = {
  offer: "offer.md",
  copy: "copy.md",
  "UX audit": "ux-audit.md",
  "component plan": "component-plan.md",
  "motion plan": "motion-plan.md",
  "visual brief": "visual-brief.md",
  "build plan": "build-plan.md",
  "launch plan": "launch-plan.md"
};

const sourceMap: Record<OutputType, string[]> = {
  offer: [
    "knowledge/skills/emovel.offer_architect.md",
    "knowledge/skills/emovel.pricing_engine.md",
    "project-templates/product-brief.md"
  ],
  copy: [
    "knowledge/skills/emovel.copy_framework.md",
    "knowledge/skills/emovel.page_builder.md"
  ],
  "UX audit": [
    "knowledge/skills/emovel.premium_ui_director.md",
    "knowledge/skills/emovel.visual_brief.md",
    "pipelines/production-pipeline-v1/output-checklist.md"
  ],
  "component plan": [
    "knowledge/skills/emovel.premium_ui_director.md",
    "pipelines/production-pipeline-v1/pipeline-spec.md",
    "config/tools.json"
  ],
  "motion plan": [
    "knowledge/skills/emovel.premium_ui_director.md",
    "pipelines/production-pipeline-v1/pipeline-spec.md",
    "docs/CLAUDE_SKILLS_INSTALLATION.md"
  ],
  "visual brief": [
    "knowledge/skills/emovel.visual_brief.md",
    "knowledge/skills/emovel.premium_ui_director.md"
  ],
  "build plan": [
    "project-templates/build-plan.md",
    "pipelines/production-pipeline-v1/runbook.md",
    "project-templates/production-pipeline-input.md"
  ],
  "launch plan": [
    "project-templates/launch-plan.md",
    "knowledge/skills/emovel.funnel_builder.md",
    "pipelines/production-pipeline-v1/pipeline-spec.md"
  ]
};

const projectDefaults: Record<ProjectType, { buyer: string; primaryAsset: string; successMetric: string }> = {
  "landing page": {
    buyer: "a founder or operator who needs a premium conversion page",
    primaryAsset: "single-page landing experience",
    successMetric: "qualified CTA clicks"
  },
  "shop product": {
    buyer: "a commerce buyer comparing value, trust, and product fit",
    primaryAsset: "product page and launch content pack",
    successMetric: "add-to-cart intent"
  },
  "SaaS app": {
    buyer: "a user deciding whether the workflow saves time or improves control",
    primaryAsset: "SaaS app brief, page, and build plan",
    successMetric: "demo or signup intent"
  },
  "digital product": {
    buyer: "a creator, consultant, or operator buying a structured outcome",
    primaryAsset: "offer, sales page, and launch plan",
    successMetric: "purchase intent"
  },
  "Instagram campaign": {
    buyer: "a social audience that needs fast clarity and visual proof",
    primaryAsset: "campaign message set and visual brief",
    successMetric: "saves, replies, and profile clicks"
  }
};

function compactPrompt(prompt: string) {
  return prompt.trim() || "Describe the product, audience, offer, and desired outcome here.";
}

function sectionFor(type: OutputType, input: StudioInput) {
  const prompt = compactPrompt(input.prompt);
  const defaults = projectDefaults[input.projectType];
  const sources = sourceMap[type].map((source) => `- ${source}`).join("\n");

  const blocks: Record<OutputType, string> = {
    offer: `## Offer\n\n**Working promise:** Turn this ${input.projectType} idea into a paid, outcome-led offer.\n\n**Raw prompt:** ${prompt}\n\n**Buyer:** ${defaults.buyer}.\n\n**Offer structure:**\n- Core transformation: before confusion, after a clear path to ${defaults.primaryAsset}.\n- Primary deliverable: ${defaults.primaryAsset}.\n- Risk reversal: clarity revision before any revenue claim.\n- Pricing note: use value-based pricing; avoid underpricing if the output saves strategic or production time.\n\n**Source of truth:**\n${sources}`,
    copy: `## Copy\n\n**Hero direction:** Lead with the buyer's stuck state and the concrete outcome.\n\n**Primary headline draft:** Turn the raw idea into a launch-ready ${input.projectType}.\n\n**CTA:** Generate production assets\n\n**Body logic:**\n1. Name the painful ambiguity.\n2. Show the structured EMOVEL path.\n3. Present assets as usable outputs, not brainstorming.\n4. Close with a direct next action.\n\n**Source of truth:**\n${sources}`,
    "UX audit": `## UX Audit\n\n**Experience goal:** Make the interface feel like a premium production cockpit, not a generic prompt box.\n\n**Checks:**\n- One primary action per view.\n- Large prompt input remains the visual anchor.\n- Output panels are scannable, exportable, and clearly sourced.\n- Touch targets are at least 44px high.\n- Empty state explains what to do next without tutorial clutter.\n\n**Success metric:** ${defaults.successMetric}.\n\n**Source of truth:**\n${sources}`,
    "component plan": `## Component Plan\n\n**Recommended components:**\n- Prompt intake panel\n- Project type segmented selector\n- Output checklist grid\n- Generate button with local-only status\n- Output panel stack\n- Markdown export control\n\n**21st.dev note:** Use 21st SDK/component vocabulary when available. If MCP is unavailable, document fallback and implement local typed React components.\n\n**Source of truth:**\n${sources}`,
    "motion plan": `## Motion Plan\n\n**Motion intent:** Use motion only to clarify generation state and output arrival.\n\n**Recommended motion:**\n- Button hover lift under 2px.\n- Output panels fade/slide in after generation.\n- No looping decorative animation.\n- Respect prefers-reduced-motion.\n\n**GSAP note:** Add GSAP only when the product requires a timeline-level interaction. Otherwise use CSS transitions.\n\n**Source of truth:**\n${sources}`,
    "visual brief": `## Visual Brief\n\n**Tone:** premium, structured, calm, commercially serious.\n\n**Layout:** full-width workbench with a left input column and right output preview on desktop; stacked workflow on mobile.\n\n**Palette:** EMOVEL ink, graphite, signal blue, mint, cloud, white, and line gray.\n\n**Signature element:** output cards that show which EMOVEL source file powered each generated section.\n\n**Source of truth:**\n${sources}`,
    "build plan": `## Build Plan\n\n**App target:** Local Next.js + Tailwind + TypeScript app.\n\n**Implementation steps:**\n1. Create typed local templates.\n2. Build prompt input and selectors.\n3. Generate markdown client-side.\n4. Render output panels.\n5. Add export markdown button.\n6. Run install, build, and smoke test.\n\n**No paid API calls in v1.**\n\n**Source of truth:**\n${sources}`,
    "launch plan": `## Launch Plan\n\n**Launch asset:** ${defaults.primaryAsset} supported by markdown exports.\n\n**Pre-launch:** capture three raw prompt examples and generate asset packs.\n\n**Launch day:** demo the raw prompt -> structured output flow.\n\n**Follow-up:** turn generated outputs into a product case study and pipeline report.\n\n**Success metric:** ${defaults.successMetric}.\n\n**Source of truth:**\n${sources}`
  };

  return blocks[type];
}

export function generateMarkdown(input: StudioInput) {
  const selected = input.outputs.length ? input.outputs : outputTypes.slice(0, 3);
  const header = `# EMOVEL Prompt Studio Output\n\n**Project type:** ${input.projectType}\n\n**Generated locally:** yes\n\n**Paid APIs connected:** no\n\n`;
  return header + selected.map((type) => sectionFor(type, input)).join("\n\n---\n\n");
}

export function generatePipelineFiles(input: Omit<StudioInput, "outputs">) {
  const fullInput: StudioInput = {
    ...input,
    outputs: [...outputTypes]
  };

  return Object.fromEntries(
    outputTypes.map((type) => [
      pipelineFileMap[type],
      `# ${type}\n\n${sectionFor(type, fullInput).replace(/^## [^\n]+\n\n/, "")}\n`
    ])
  ) as Record<string, string>;
}
