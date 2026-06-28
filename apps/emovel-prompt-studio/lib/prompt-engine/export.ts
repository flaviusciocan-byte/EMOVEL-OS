import type { PromptPackage } from "./schema";

function list(items: string[]): string {
  return items.length > 0 ? items.map((item) => `- ${item}`).join("\n") : "- None";
}

export function promptPackageToMarkdown(pkg: PromptPackage): string {
  return [
    "# Prompt Package",
    "",
    "## Raw Idea",
    pkg.raw_idea,
    "",
    "## Refined Prompt",
    pkg.refined_prompt,
    "",
    "## Product Brief",
    pkg.product_brief,
    "",
    "## Target Audience",
    pkg.target_audience,
    "",
    "## Offer Angle",
    pkg.offer_angle,
    "",
    "## Transformation",
    pkg.transformation,
    "",
    "## Tone",
    pkg.tone,
    "",
    "## Page Goal",
    pkg.page_goal,
    "",
    "## Recommended Sections",
    list(pkg.recommended_sections),
    "",
    "## Proof Needed",
    list(pkg.proof_needed),
    "",
    "## Missing Inputs",
    list(pkg.missing_inputs),
    "",
    "## Page Builder Generation Input",
    "```json",
    JSON.stringify(pkg.generation_input, null, 2),
    "```",
  ].join("\n");
}
