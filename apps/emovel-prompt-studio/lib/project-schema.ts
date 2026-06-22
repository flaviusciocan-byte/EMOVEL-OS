export type ProjectStatus = "Generating" | "Ready";
export type PipelineStatus = "idle" | "queued" | "running" | "completed" | "failed";
export type PipelineStepStatus = "queued" | "running" | "completed" | "failed";
export type PipelineStepId =
  | "intent"
  | "schema"
  | "strategy"
  | "offer"
  | "copy"
  | "ux"
  | "design"
  | "build"
  | "publish"
  | "review";

export type PipelineStep = {
  id: PipelineStepId;
  status: PipelineStepStatus;
  startedAt?: string;
  completedAt?: string;
  message: string;
};

export type ProjectPipeline = {
  id: string;
  status: PipelineStatus;
  steps: PipelineStep[];
};

export type RefinedBrief = {
  productType: string;
  targetAudience: string;
  platform: string;
  tone: string;
  launchGoal: string;
  pricePoint: string;
};

export type StrategyAsset = {
  audience: string;
  problem: string;
  positioning: string;
  opportunity: string;
};

export type OfferAsset = {
  offerName: string;
  pricing: string;
  deliverables: string[];
  guarantee: string;
};

export type CopyAsset = {
  headline: string;
  subheadline: string;
  cta: string;
  offerDescription: string;
};

export type UXAsset = {
  pageStructure: string[];
  sections: string[];
  hierarchy: string;
};

export type DesignAsset = {
  colorPalette: string[];
  typography: string;
  visualDirection: string;
};

export type BuildAsset = {
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

export type PublishAsset = {
  gumroadListing: string;
  socialPosts: string[];
  emailLaunchCopy: string;
  finalLaunchChecklist: string[];
  launchChecklist: string[];
  contentPlan: string[];
  distributionChannels: string[];
};

export type ReviewMetricStatus = "Weak" | "Acceptable" | "Strong";

export type ReviewMetric = {
  label: string;
  score: number;
  status: ReviewMetricStatus;
  whyThisScore: string;
  whatImprovesIt: string;
  missingElements: string[];
  completedElements: string[];
  improvementNote: string;
};

export type ReviewExplanation = {
  score: number;
  status: ReviewMetricStatus;
  whyThisScore: string;
  whatImprovesIt: string;
  missingElements: string[];
  completedElements: string[];
};

export type ReviewAsset = {
  metrics: ReviewMetric[];
  productReadiness: number;
  buildReadiness: number;
  launchReadiness: number;
  productReadinessExplanation: ReviewExplanation;
  buildReadinessExplanation: ReviewExplanation;
  launchReadinessExplanation: ReviewExplanation;
  summary: string;
};

export type ProjectAssets = {
  strategy: StrategyAsset;
  offer: OfferAsset;
  copy: CopyAsset;
  ux: UXAsset;
  design: DesignAsset;
  build: BuildAsset;
  publish: PublishAsset;
  review: ReviewAsset;
};

export type ProjectExportRecord = {
  id: string;
  format: "markdown" | "json" | "zip" | "builder-pack" | "publish-pack" | "review-markdown";
  createdAt: string;
  filename: string;
};

export type ProjectVersion = {
  id: string;
  label: string;
  createdAt: string;
  reason: string;
};

export type ProjectMetadata = {
  schemaVersion: "1";
  source: "local";
  generator: "deterministic-local";
  updatedBy: "emovel-prompt-studio";
};

export type ProjectSchemaV1 = {
  schemaVersion: "1";
  id: string;
  title: string;
  prompt: string;
  refinedBrief: RefinedBrief;
  status: ProjectStatus;
  createdAt: string;
  lastUpdatedAt: string;
  pipeline: ProjectPipeline;
  assets?: ProjectAssets;
  exports: ProjectExportRecord[];
  versions: ProjectVersion[];
  metadata: ProjectMetadata;
};

export const emptyRefinedBrief: RefinedBrief = {
  productType: "",
  targetAudience: "",
  platform: "",
  tone: "",
  launchGoal: "",
  pricePoint: "",
};

export const pipelineStepIds: PipelineStepId[] = [
  "intent",
  "schema",
  "strategy",
  "offer",
  "copy",
  "ux",
  "design",
  "build",
  "publish",
  "review",
];

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function readOptionalString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function normalizePipelineStepStatus(value: unknown, fallback: PipelineStepStatus): PipelineStepStatus {
  if (value === "queued" || value === "running" || value === "completed" || value === "failed") {
    return value;
  }
  return fallback;
}

function pipelineMessage(step: PipelineStepId, status: PipelineStepStatus) {
  if (status === "completed") {
    return {
      intent: "Prompt intent captured.",
      schema: "Project schema v1 normalized.",
      strategy: "Strategy asset generated.",
      offer: "Offer asset generated.",
      copy: "Copy asset generated.",
      ux: "UX asset generated.",
      design: "Design asset generated.",
      build: "Build asset generated.",
      publish: "Publish asset generated.",
      review: "Review asset generated.",
    }[step];
  }

  if (status === "failed") return "Step failed and is ready for recovery.";
  if (status === "running") return "Step is running locally.";
  return "Queued for local deterministic generation.";
}

export function createProjectPipeline(input: {
  projectId: string;
  createdAt: string;
  status?: PipelineStatus;
  stepStatus?: PipelineStepStatus;
}): ProjectPipeline {
  const stepStatus = input.stepStatus || "queued";
  return {
    id: `${input.projectId}-pipeline-v1`,
    status: input.status || "queued",
    steps: pipelineStepIds.map((id) => ({
      id,
      status: stepStatus,
      startedAt: stepStatus === "completed" ? input.createdAt : undefined,
      completedAt: stepStatus === "completed" ? input.createdAt : undefined,
      message: pipelineMessage(id, stepStatus),
    })),
  };
}

export function completeProjectPipeline(projectId: string, startedAt: string, completedAt: string): ProjectPipeline {
  return {
    id: `${projectId}-pipeline-v1`,
    status: "completed",
    steps: pipelineStepIds.map((id) => ({
      id,
      status: "completed",
      startedAt,
      completedAt,
      message: pipelineMessage(id, "completed"),
    })),
  };
}

function normalizePipeline(value: unknown, projectId: string, createdAt: string, hasAssets: boolean): ProjectPipeline {
  if (!isRecord(value)) {
    return hasAssets
      ? completeProjectPipeline(projectId, createdAt, createdAt)
      : createProjectPipeline({ projectId, createdAt });
  }

  const rawSteps = Array.isArray(value.steps) ? value.steps : [];
  const steps = pipelineStepIds.map((id) => {
    const stored = rawSteps.find((step) => isRecord(step) && step.id === id);
    const status = normalizePipelineStepStatus(
      isRecord(stored) ? stored.status : undefined,
      hasAssets ? "completed" : "queued"
    );

    return {
      id,
      status,
      startedAt: isRecord(stored) ? readOptionalString(stored.startedAt) : undefined,
      completedAt: isRecord(stored) ? readOptionalString(stored.completedAt) : undefined,
      message: isRecord(stored) ? readString(stored.message, pipelineMessage(id, status)) : pipelineMessage(id, status),
    };
  });
  const failed = steps.some((step) => step.status === "failed");
  const running = steps.some((step) => step.status === "running");
  const completed = steps.every((step) => step.status === "completed");
  const queued = steps.some((step) => step.status === "queued");

  return {
    id: readString(value.id, `${projectId}-pipeline-v1`),
    status: failed ? "failed" : running ? "running" : completed ? "completed" : queued ? "queued" : "idle",
    steps,
  };
}

export function normalizeRefinedBrief(value: unknown): RefinedBrief {
  const brief = isRecord(value) ? value : {};
  return {
    productType: readString(brief.productType),
    targetAudience: readString(brief.targetAudience),
    platform: readString(brief.platform),
    tone: readString(brief.tone),
    launchGoal: readString(brief.launchGoal),
    pricePoint: readString(brief.pricePoint),
  };
}

export function createProjectSchemaV1(input: {
  id: string;
  title: string;
  prompt: string;
  refinedBrief: RefinedBrief;
  createdAt: string;
  status?: ProjectStatus;
}): ProjectSchemaV1 {
  return {
    schemaVersion: "1",
    id: input.id,
    title: input.title,
    prompt: input.prompt,
    refinedBrief: input.refinedBrief,
    status: input.status || "Ready",
    createdAt: input.createdAt,
    lastUpdatedAt: input.createdAt,
    pipeline: createProjectPipeline({ projectId: input.id, createdAt: input.createdAt }),
    exports: [],
    versions: [
      {
        id: `${input.id}-initial`,
        label: "Initial project",
        createdAt: input.createdAt,
        reason: "Project created from prompt intake",
      },
    ],
    metadata: {
      schemaVersion: "1",
      source: "local",
      generator: "deterministic-local",
      updatedBy: "emovel-prompt-studio",
    },
  };
}

export function migrateProjectToSchemaV1(value: unknown): ProjectSchemaV1 | null {
  if (!isRecord(value)) return null;

  const id = readString(value.id);
  const title = readString(value.title, "Untitled Workspace");
  const prompt = readString(value.prompt, title);
  if (!id) return null;

  const createdAt = readString(value.createdAt, new Date().toISOString());
  const lastUpdatedAt = readString(value.lastUpdatedAt, createdAt);
  const refinedBrief = normalizeRefinedBrief(value.refinedBrief || value.brief);
  const status = value.status === "Generating" ? "Generating" : "Ready";
  const hasAssets = isRecord(value.assets);
  const migrated = createProjectSchemaV1({
    id,
    title,
    prompt,
    refinedBrief,
    createdAt,
    status,
  });

  return {
    ...migrated,
    lastUpdatedAt,
    pipeline: normalizePipeline(value.pipeline, id, createdAt, hasAssets),
    assets: hasAssets ? (value.assets as ProjectAssets) : undefined,
    exports: Array.isArray(value.exports) ? (value.exports as ProjectExportRecord[]) : [],
    versions: Array.isArray(value.versions) ? (value.versions as ProjectVersion[]) : migrated.versions,
    metadata: {
      ...migrated.metadata,
      ...(isRecord(value.metadata) ? value.metadata : {}),
      schemaVersion: "1",
      source: "local",
      generator: "deterministic-local",
      updatedBy: "emovel-prompt-studio",
    },
  };
}
