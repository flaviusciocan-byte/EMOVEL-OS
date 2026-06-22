export type ProjectStatus = "Generating" | "Ready";

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

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
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
    assets: isRecord(value.assets) ? (value.assets as ProjectAssets) : undefined,
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
