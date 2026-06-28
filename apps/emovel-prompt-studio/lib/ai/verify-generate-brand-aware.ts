// Verifies the brand-aware wiring of the strategy generator (app/api/ai/generate).
// Mirrors exactly how the route composes prompts, without network/provider.
// Run: npx tsx lib/ai/verify-generate-brand-aware.ts

import { emptyRefinedBrief } from "../project-schema";
import { buildStrategyPrompt } from "./prompt";
import { mechanisms, runBrandMechanismAudit } from "../brand-mechanism";
import { buildAgentBrandContext, buildBrandAwarePrompt, buildBrandAwarePromptForSlug, toBrandAwareTaskType, type AgentBrandContext } from "../brand-os";

let failures = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) console.log(`  ok   ${name}`);
  else { failures += 1; console.error(`  FAIL ${name}${detail ? ` — ${detail}` : ""}`); }
}

function answersForTotals(totals: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const m of mechanisms) {
    let remaining = totals[m.id];
    m.questions.forEach((q, i) => {
      const left = m.questions.length - i;
      out[q.id] = Math.max(1, Math.min(5, remaining - (left - 1)));
      remaining -= out[q.id];
    });
  }
  return out;
}

function contextFor(totals: Record<string, number>): AgentBrandContext {
  const run = runBrandMechanismAudit(answersForTotals(totals));
  if (!run.ok) throw new Error("expected valid audit");
  return buildAgentBrandContext(run.profile);
}

// Mirror of the route's response metadata assembly from an adapter output.
function routeBrandMeta(out: ReturnType<typeof buildBrandAwarePrompt>) {
  return {
    hasBrandContext: out.hasBrandContext,
    fallback: out.fallback,
    fallbackReason: out.fallbackReason,
    appliedMechanism: out.appliedMechanism,
    taskType: out.taskType,
  };
}

// Base messages exactly as the route builds them.
const base = buildStrategyPrompt({ prompt: "Premium AI launch workspace for founders", refinedBrief: emptyRefinedBrief });
check("base produces system+user", base.length === 2 && base[0].role === "system" && base[1].role === "user");

const ctx = contextFor({ identificare: 13, aspiratie: 18, siguranta: 10, obicei: 7, diferentiere: 15 });

// Route's wrap (slug + profile present).
const aware = buildBrandAwarePrompt({
  basePrompt: base[0].content,
  brandContext: ctx,
  taskType: "strategy",
  input: base[1].content,
});

console.log("With profile:");
check("messages compatible with streamAiText (2 msgs, roles)",
  aware.messages.length === 2 && aware.messages[0].role === "system" && aware.messages[1].role === "user");
check("includes dominant mechanism", aware.systemPrompt.includes(ctx.dominant_mechanism));
check("includes recommended tone", aware.systemPrompt.includes(ctx.recommended_tone));
check("strategy directive present", /Frame the strategy/i.test(aware.systemPrompt));
check("JSON contract preserved (audience field)", aware.systemPrompt.includes("audience"));
check("JSON contract preserved (valid JSON instruction)", /Return only valid JSON/i.test(aware.systemPrompt));
check("original brief reaches user message", aware.userPrompt.includes("Refined brief"));
check("hasBrandContext true / fallback false", aware.hasBrandContext === true && aware.fallback === false);
check("appliedMechanism = dominant", aware.appliedMechanism === ctx.dominant_mechanism);

console.log("Response metadata (present):");
const metaPresent = routeBrandMeta(aware);
check("meta fallbackReason undefined with profile", metaPresent.fallbackReason === undefined);
check("meta keeps appliedMechanism with context", metaPresent.appliedMechanism === ctx.dominant_mechanism);
check("meta taskType is strategy", metaPresent.taskType === "strategy");

console.log("Without profile (fallback):");
const fb = buildBrandAwarePrompt({ basePrompt: base[0].content, brandContext: null, taskType: "strategy", input: base[1].content });
check("does not crash, 2 messages", fb.messages.length === 2);
check("fallback true / hasBrandContext false", fb.fallback === true && fb.hasBrandContext === false);
check("no invented mechanism", !/dominant mechanism: (identificare|aspiratie|siguranta|obicei|diferentiere)/i.test(fb.systemPrompt));
check("JSON contract still preserved in fallback", fb.systemPrompt.includes("audience") && /Return only valid JSON/i.test(fb.systemPrompt));

console.log("assetType -> taskType mapping:");
const mapCases: Array<[string | undefined, string]> = [
  ["strategy", "strategy"],
  ["landing-page", "landing_page"],
  ["landing_page", "landing_page"],
  ["page", "landing_page"],
  ["ad", "ad"],
  ["ads", "ad"],
  ["email", "email"],
  ["content-angle", "content_angle"],
  ["instagram", "instagram_post"],
  ["instagram-post", "instagram_post"],
  ["carousel", "carousel"],
  ["reel", "reel_script"],
  ["reel-script", "reel_script"],
  ["product-description", "product_description"],
  ["pitch", "pitch_section"],
  ["pitch-section", "pitch_section"],
  ["  Landing-Page  ", "landing_page"],
  [undefined, "strategy"],
  ["totally-unknown-xyz", "strategy"],
];
for (const [input, expected] of mapCases) {
  check(`map ${JSON.stringify(input)} -> ${expected}`, toBrandAwareTaskType(input) === expected, toBrandAwareTaskType(input));
}
// brandContext.taskType reflects the applied (mapped) task type.
const mappedAware = buildBrandAwarePrompt({ basePrompt: base[0].content, brandContext: ctx, taskType: toBrandAwareTaskType("ad"), input: base[1].content });
check("brandContext.taskType reflects mapped type (ad)", routeBrandMeta(mappedAware).taskType === "ad", routeBrandMeta(mappedAware).taskType);

console.log("Response metadata (fallback, pure):");
const metaFb = routeBrandMeta(fb);
check("fallback meta does not invent appliedMechanism", metaFb.appliedMechanism === undefined);
check("fallback meta fallback = true", metaFb.fallback === true);

(async () => {
  console.log("Response metadata (slug):");
  // Missing profile -> missing_profile, generation not blocked.
  const noProfile = await buildBrandAwarePromptForSlug({ slug: "verify-generate-no-profile", basePrompt: base[0].content, taskType: "strategy", input: base[1].content });
  const m1 = routeBrandMeta(noProfile);
  check("missing profile => fallbackReason missing_profile", m1.fallbackReason === "missing_profile", String(m1.fallbackReason));
  check("missing profile => no appliedMechanism", m1.appliedMechanism === undefined);
  check("missing profile => generation not blocked (2 messages)", noProfile.messages.length === 2);
  // Invalid slug -> invalid_slug, generation not blocked.
  const badSlug = await buildBrandAwarePromptForSlug({ slug: "Bad Slug!!", basePrompt: base[0].content, taskType: "strategy", input: base[1].content });
  const m2 = routeBrandMeta(badSlug);
  check("invalid slug => fallbackReason invalid_slug", m2.fallbackReason === "invalid_slug", String(m2.fallbackReason));
  check("invalid slug => generation not blocked (2 messages)", badSlug.messages.length === 2 && badSlug.messages[0].role === "system");

  if (failures > 0) { console.error(`\n${failures} check(s) FAILED`); process.exit(1); }
  console.log("\nAll checks passed.");
})();
