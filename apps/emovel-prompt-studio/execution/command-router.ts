import { type BuilderTarget, type PublishingTarget } from "./targets";

export type ExecutionIntent =
  | "create-product"
  | "build-app"
  | "prepare-publish"
  | "prepare-shop"
  | "create-content"
  | "unknown";

export type RoutedCommand = {
  intent: ExecutionIntent;
  selectedSkills: string[];
  selectedTools: string[];
  selectedPipeline: string;
  builderTarget: BuilderTarget;
  publishingTargets: PublishingTarget[];
  outputTargets: string[];
  confidence: "low" | "medium" | "high";
};

const baseProductionSkills = [
  "emovel.audience_builder",
  "emovel.offer_architect",
  "emovel.pricing_engine",
  "emovel.copy_framework",
  "emovel.page_builder",
  "emovel.visual_brief",
  "emovel.funnel_builder"
];

function includesAny(input: string, keywords: string[]) {
  return keywords.some((keyword) => input.includes(keyword));
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

export function detectIntent(command: string): ExecutionIntent {
  const input = command.toLowerCase();

  if (includesAny(input, ["shop", "gumroad", "listed", "listing", "product page"])) {
    return "prepare-shop";
  }

  if (includesAny(input, ["publish", "launch", "social", "email", "instagram", "facebook", "tiktok"])) {
    return "prepare-publish";
  }

  if (includesAny(input, ["build", "app", "next.js", "nextjs", "gpt-pilot", "pythagora", "reflex"])) {
    return "build-app";
  }

  if (includesAny(input, ["content", "campaign", "posts", "newsletter"])) {
    return "create-content";
  }

  if (includesAny(input, ["product", "offer", "pricing", "landing page", "raw idea"])) {
    return "create-product";
  }

  return "unknown";
}

export function routeCommand(command: string): RoutedCommand {
  const input = command.toLowerCase();
  const intent = detectIntent(command);
  const builderTarget: BuilderTarget = includesAny(input, ["reflex"])
    ? "Reflex"
    : includesAny(input, ["pythagora"])
      ? "Pythagora"
      : includesAny(input, ["next.js", "nextjs"])
        ? "Next.js"
        : "GPT-Pilot";

  const publishingTargets: PublishingTarget[] = [];

  if (includesAny(input, ["gumroad", "shop", "listing", "checkout"])) {
    publishingTargets.push("Gumroad");
  }

  if (includesAny(input, ["instagram"])) {
    publishingTargets.push("Instagram");
  }

  if (includesAny(input, ["facebook"])) {
    publishingTargets.push("Facebook");
  }

  if (includesAny(input, ["tiktok", "tik tok"])) {
    publishingTargets.push("TikTok");
  }

  if (includesAny(input, ["email", "newsletter"])) {
    publishingTargets.push("Email");
  }

  const selectedSkills =
    intent === "build-app"
      ? unique([...baseProductionSkills, "emovel.premium_ui_director"])
      : intent === "prepare-shop"
        ? unique([...baseProductionSkills, "emovel.shopproductpack"])
        : intent === "prepare-publish" || intent === "create-content"
          ? unique(["emovel.copy_framework", "emovel.funnel_builder", "emovel.visual_brief"])
          : baseProductionSkills;

  const selectedTools = unique([
    "apps/emovel-prompt-studio",
    "pipelines/production-pipeline-v1",
    builderTarget === "GPT-Pilot" || builderTarget === "Pythagora" ? "gpt-pilot-main" : builderTarget,
    ...publishingTargets.map((target) => target.toLowerCase())
  ]);

  return {
    intent,
    selectedSkills,
    selectedTools,
    selectedPipeline: "pipelines/production-pipeline-v1",
    builderTarget,
    publishingTargets: publishingTargets.length > 0 ? publishingTargets : ["Gumroad"],
    outputTargets: [
      "projects/generated/{project-slug}/",
      "projects/build-workspaces/{project-slug}/",
      "projects/build-workspaces/{project-slug}/publish-package/",
      "docs/{execution-report}.md"
    ],
    confidence: intent === "unknown" ? "low" : publishingTargets.length > 0 || intent === "build-app" ? "high" : "medium"
  };
}
