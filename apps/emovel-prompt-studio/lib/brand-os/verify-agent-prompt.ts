// Verification harness for the brand-aware prompt adapter.
// Run: npx tsx lib/brand-os/verify-agent-prompt.ts
// Pure (no I/O): builds AgentBrandContext via the real diagnostic pipeline.

import { mechanisms, runBrandMechanismAudit } from "../brand-mechanism";
import { buildAgentBrandContext, type AgentBrandContext } from "./agent-factory";
import { buildBrandAwarePrompt, buildBrandAwarePromptForSlug } from "./agent-prompt";

let failures = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    console.log(`  ok   ${name}`);
  } else {
    failures += 1;
    console.error(`  FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

function answersForTotals(totals: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const m of mechanisms) {
    let remaining = totals[m.id];
    const qs = m.questions;
    qs.forEach((q, i) => {
      const left = qs.length - i;
      out[q.id] = Math.max(1, Math.min(5, remaining - (left - 1) * 1));
      remaining -= out[q.id];
    });
  }
  return out;
}

function contextFor(totals: Record<string, number>): AgentBrandContext {
  const run = runBrandMechanismAudit(answersForTotals(totals));
  if (!run.ok) throw new Error("expected valid audit in harness");
  return buildAgentBrandContext(run.profile);
}

// Clear dominant (aspiratie), Moderată congruence.
const moderate = contextFor({ identificare: 13, aspiratie: 18, siguranta: 10, obicei: 7, diferentiere: 15 });
// Low congruence (gap 1): identificare dominant, aspiratie secondary.
const low = contextFor({ identificare: 18, aspiratie: 17, siguranta: 8, obicei: 6, diferentiere: 5 });

console.log("Brand context present:");
const headline = buildBrandAwarePrompt({ basePrompt: "Base.", brandContext: moderate, taskType: "headline", input: { topic: "X" } });
check("hasBrandContext = true", headline.hasBrandContext === true);
check("fallback = false", headline.fallback === false);
check("appliedMechanism = dominant", headline.appliedMechanism === moderate.dominant_mechanism, String(headline.appliedMechanism));
check("includes dominant mechanism", headline.systemPrompt.includes(moderate.dominant_mechanism));
check("includes secondary as support", /secondary mechanism[\s\S]*support/i.test(headline.systemPrompt));
check("includes primary trigger", headline.systemPrompt.includes(moderate.primary_trigger));
check("includes avoid as internal rule", headline.systemPrompt.includes(`Avoid (internal rule`) && headline.systemPrompt.includes(moderate.avoid));
check("strategic_warning injected as control rule", headline.systemPrompt.includes(moderate.strategic_warning));
check("userPrompt carries task type", headline.userPrompt.includes("headline"));
check("input record serialized into userPrompt", headline.userPrompt.includes("topic"));

console.log("Task -> structure mapping:");
const landing = buildBrandAwarePrompt({ basePrompt: "B", brandContext: moderate, taskType: "landing_page" });
check("landing_page uses page structure", moderate.recommended_page_structure.every((s) => landing.systemPrompt.includes(s)));
const ad = buildBrandAwarePrompt({ basePrompt: "B", brandContext: moderate, taskType: "ad" });
check("ad uses ad structure", ad.systemPrompt.includes(moderate.recommended_ad_structure));
const email = buildBrandAwarePrompt({ basePrompt: "B", brandContext: moderate, taskType: "email" });
check("email uses email structure", email.systemPrompt.includes(moderate.recommended_email_structure));
const content = buildBrandAwarePrompt({ basePrompt: "B", brandContext: moderate, taskType: "content_angle" });
check("content_angle uses content types", moderate.recommended_content_types.every((s) => content.systemPrompt.includes(s)));
const ig = buildBrandAwarePrompt({ basePrompt: "B", brandContext: moderate, taskType: "instagram_post" });
check("instagram_post uses content types", moderate.recommended_content_types.every((s) => ig.systemPrompt.includes(s)));

console.log("Low congruence:");
check("low congruence flagged Scăzută", low.congruence_level === "Scăzută", low.congruence_level);
const lowOut = buildBrandAwarePrompt({ basePrompt: "B", brandContext: low, taskType: "landing_page" });
check("low congruence asks clarity / avoid mixing", /ONE angle|avoid contradictory|fewer angles|simpler/i.test(lowOut.systemPrompt));

console.log("Fallback (no brand context):");
const fb = buildBrandAwarePrompt({ basePrompt: "B", taskType: "ad", input: "X" });
check("does not crash, returns 2 messages", fb.messages.length === 2);
check("hasBrandContext = false", fb.hasBrandContext === false);
check("fallback = true", fb.fallback === true);
check("appliedMechanism undefined", fb.appliedMechanism === undefined);
check("says no profile available", /No brand mechanism profile is available/i.test(fb.systemPrompt));
check("does not invent a mechanism", !/dominant mechanism: (identificare|aspiratie|siguranta|obicei|diferentiere)/i.test(fb.systemPrompt));

console.log("Task type strategy (present):");
const strat = buildBrandAwarePrompt({ basePrompt: "B", brandContext: moderate, taskType: "strategy", input: { product: "X" } });
check("strategy includes dominant mechanism", strat.systemPrompt.includes(moderate.dominant_mechanism));
check("strategy includes recommended tone", strat.systemPrompt.includes(moderate.recommended_tone));
check("strategy fallback = false", strat.fallback === false);
check("strategy hasBrandContext = true", strat.hasBrandContext === true);
check("strategy appliedMechanism = dominant", strat.appliedMechanism === moderate.dominant_mechanism, String(strat.appliedMechanism));
check("strategy directive present", /Frame the strategy/i.test(strat.systemPrompt));

console.log("Task type strategy (fallback):");
const stratFb = buildBrandAwarePrompt({ basePrompt: "B", taskType: "strategy", input: { product: "X" } });
check("strategy fallback = true", stratFb.fallback === true);
check("strategy hasBrandContext = false", stratFb.hasBrandContext === false);
check("strategy appliedMechanism undefined", stratFb.appliedMechanism === undefined);
check("strategy fallback does not invent a mechanism", !/dominant mechanism: (identificare|aspiratie|siguranta|obicei|diferentiere)/i.test(stratFb.systemPrompt));
check("strategy fallback says no profile available", /No brand mechanism profile is available/i.test(stratFb.systemPrompt));

console.log("fallbackReason (pure):");
check("context present => fallbackReason undefined", strat.fallbackReason === undefined);
check("no context => fallbackReason missing_profile", stratFb.fallbackReason === "missing_profile", String(stratFb.fallbackReason));
const explicitReason = buildBrandAwarePrompt({ basePrompt: "B", taskType: "strategy", fallbackReason: "context_error" });
check("explicit fallbackReason passes through", explicitReason.fallbackReason === "context_error", String(explicitReason.fallbackReason));

(async () => {
  console.log("fallbackReason (slug):");
  // Valid slug with no stored profile -> missing_profile.
  const noProfile = await buildBrandAwarePromptForSlug({ slug: "verify-no-profile-xyz", basePrompt: "B", taskType: "strategy" });
  check("missing profile => fallback true", noProfile.fallback === true && noProfile.hasBrandContext === false);
  check("missing profile => fallbackReason missing_profile", noProfile.fallbackReason === "missing_profile", String(noProfile.fallbackReason));
  check("missing profile => no invented mechanism", !/dominant mechanism: (identificare|aspiratie|siguranta|obicei|diferentiere)/i.test(noProfile.systemPrompt));
  // Malformed slug -> store throws "Invalid brand slug" -> invalid_slug.
  const badSlug = await buildBrandAwarePromptForSlug({ slug: "Bad Slug!!", basePrompt: "B", taskType: "strategy" });
  check("invalid slug => fallback true", badSlug.fallback === true);
  check("invalid slug => fallbackReason invalid_slug", badSlug.fallbackReason === "invalid_slug", String(badSlug.fallbackReason));
  check("invalid slug => messages still streamAiText-compatible", badSlug.messages.length === 2 && badSlug.messages[0].role === "system");

  if (failures > 0) {
    console.error(`\n${failures} check(s) FAILED`);
    process.exit(1);
  }
  console.log("\nAll checks passed.");
})();
