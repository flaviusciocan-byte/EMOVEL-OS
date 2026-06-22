import type { StrategyAsset } from "../project-schema";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readRequiredString(value: unknown, field: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`AI response missing required Strategy field: ${field}.`);
  }

  return value.trim();
}

export function validateStrategyAsset(value: unknown): StrategyAsset {
  if (!isRecord(value)) {
    throw new Error("AI response was not a Strategy JSON object.");
  }

  return {
    audience: readRequiredString(value.audience, "audience"),
    problem: readRequiredString(value.problem, "problem"),
    positioning: readRequiredString(value.positioning, "positioning"),
    opportunity: readRequiredString(value.opportunity, "opportunity"),
  };
}
