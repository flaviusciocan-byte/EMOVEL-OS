import { NextResponse } from "next/server";
import { classifyBoundaryRequest } from "../../../../lib/ai/boundary";
import { createAiRouteError, mapUnknownAiRouteError } from "../../../../lib/ai/error-map";
import { extractJsonObject, estimateTokens } from "../../../../lib/ai/json";
import { getAvailableModelSequence, estimateCostCents } from "../../../../lib/ai/model-registry";
import { buildStrategyPrompt } from "../../../../lib/ai/prompt";
import { streamAiText } from "../../../../lib/ai/providers";
import { validateStrategyAsset } from "../../../../lib/ai/schema";
import { emptyRefinedBrief, type RefinedBrief, type StrategyAsset } from "../../../../lib/project-schema";

type GenerateRequest = {
  prompt?: string;
  refinedBrief?: Partial<RefinedBrief>;
  assetType?: "strategy";
};

function normalizeBrief(value: GenerateRequest["refinedBrief"]): RefinedBrief {
  return {
    productType: value?.productType?.trim() || emptyRefinedBrief.productType,
    targetAudience: value?.targetAudience?.trim() || emptyRefinedBrief.targetAudience,
    platform: value?.platform?.trim() || emptyRefinedBrief.platform,
    tone: value?.tone?.trim() || emptyRefinedBrief.tone,
    launchGoal: value?.launchGoal?.trim() || emptyRefinedBrief.launchGoal,
    pricePoint: value?.pricePoint?.trim() || emptyRefinedBrief.pricePoint,
  };
}

function deterministicStrategy(prompt: string, refinedBrief: RefinedBrief): StrategyAsset {
  const product = refinedBrief.productType || prompt;
  const audience = refinedBrief.targetAudience || "builders preparing a product launch";
  const platform = refinedBrief.platform || "web workspace";
  const goal = refinedBrief.launchGoal || "turn the idea into publish-ready assets";
  const price = refinedBrief.pricePoint || "pilot price with premium upgrade";

  return {
    audience,
    problem: `${audience} need a clearer way to turn ${product} into a specific ${platform} without losing momentum across strategy, copy, build, and launch decisions.`,
    positioning: `${product} is positioned as a premium EMOVEL workspace for ${audience}, focused on ${goal}.`,
    opportunity: `Own the gap between raw prompting and launch execution by packaging the ${platform} around ${price} and a decisive path to market.`,
  };
}

async function collectText(text: AsyncGenerator<string>) {
  let output = "";
  for await (const chunk of text) {
    output += chunk;
  }
  return output;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateRequest;
    const prompt = body.prompt?.trim();
    const refinedBrief = normalizeBrief(body.refinedBrief);

    if (!prompt) {
      const error = createAiRouteError({
        category: "generation_failed",
        code: "MISSING_PROMPT",
        message: "Prompt is required.",
      });
      return NextResponse.json(error.payload, { status: error.status });
    }

    const boundary = classifyBoundaryRequest(prompt);
    if (!boundary.allowed) {
      const error = createAiRouteError({
        category: "boundary_blocked",
        code: "BOUNDARY_BLOCKED",
        message: boundary.reason,
        extra: { boundary },
      });
      return NextResponse.json(error.payload, { status: error.status });
    }

    const models = getAvailableModelSequence();
    if (models.length === 0) {
      return NextResponse.json(
        {
          mode: "fallback",
          fallback: true,
          assetType: "strategy",
          asset: deterministicStrategy(prompt, refinedBrief),
          reason: "No configured AI provider was available.",
        },
        { status: 503 }
      );
    }

    const messages = buildStrategyPrompt({ prompt, refinedBrief });
    const inputTokens = estimateTokens(messages.map((message) => message.content).join("\n\n"));
    const failures: string[] = [];

    for (const model of models) {
      try {
        const result = streamAiText(model, messages);
        const raw = await collectText(result.text);
        const asset = validateStrategyAsset(extractJsonObject(raw));

        return NextResponse.json({
          mode: "ai",
          fallback: false,
          assetType: "strategy",
          provider: model.provider,
          model: model.model,
          usage: result.usage,
          estimatedCostCents: estimateCostCents(
            model,
            result.usage.promptTokens || inputTokens,
            result.usage.completionTokens || estimateTokens(raw)
          ),
          asset,
        });
      } catch (error) {
        failures.push(error instanceof Error ? error.message : "Unknown provider failure.");
      }
    }

    return NextResponse.json(
      {
        mode: "fallback",
        fallback: true,
        assetType: "strategy",
        asset: deterministicStrategy(prompt, refinedBrief),
        reason: "AI providers failed validation or transport.",
        failures,
      },
      { status: 200 }
    );
  } catch (error) {
    const mapped = mapUnknownAiRouteError(error);
    return NextResponse.json(mapped.payload, { status: mapped.status });
  }
}
