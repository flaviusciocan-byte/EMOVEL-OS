import type { RefinedBrief } from "../project-schema";
import type { AiPromptMessage } from "./providers";

export function buildStrategyPrompt(input: {
  prompt: string;
  refinedBrief: RefinedBrief;
}): AiPromptMessage[] {
  const { prompt, refinedBrief } = input;
  const system = [
    "You are EMOVEL Prompt Studio's Strategy asset generator.",
    "Return only valid JSON. Do not include markdown, commentary, or code fences.",
    "The JSON object must have exactly these string fields: audience, problem, positioning, opportunity.",
    "Write specific commercial strategy for the user's product brief.",
  ].join(" ");

  const user = `Create one Strategy asset for this project.

Source prompt:
${prompt}

Refined brief:
- Product type: ${refinedBrief.productType || "inferred from prompt"}
- Target audience: ${refinedBrief.targetAudience || "inferred from prompt"}
- Platform: ${refinedBrief.platform || "inferred from prompt"}
- Tone: ${refinedBrief.tone || "premium and clear"}
- Launch goal: ${refinedBrief.launchGoal || "turn the idea into publish-ready assets"}
- Price point / monetization: ${refinedBrief.pricePoint || "pilot price with premium upgrade"}

Return JSON:
{
  "audience": "...",
  "problem": "...",
  "positioning": "...",
  "opportunity": "..."
}`;

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}
