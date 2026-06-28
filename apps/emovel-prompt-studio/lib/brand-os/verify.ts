// Verification harness for the Brand OS persistence layer.
// Run: npx tsx lib/brand-os/verify.ts
// Uses a temporary slug under projects/brand-os/ and cleans up at the end.

import { allQuestionIds } from "../brand-mechanism";
import {
  clearBrandMechanismProfile,
  getBrandMechanismProfile,
  getBrandOsEnvelope,
  hasBrandMechanismProfile,
  saveBrandMechanismProfile,
  updateBrandMechanismProfile,
} from "./store";
import { getAgentBrandContext } from "./agent-factory";
import { runAndPersistBrandMechanismAudit } from "./index";

let failures = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    console.log(`  ok   ${name}`);
  } else {
    failures += 1;
    console.error(`  FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

const SLUG = "verify-brand-os-tmp";

// A complete, valid answer set (every question answered 4).
const validAnswers: Record<string, number> = Object.fromEntries(
  allQuestionIds.map((id) => [id, 4]),
);

async function main() {
  // Clean slate.
  await clearBrandMechanismProfile(SLUG);

  // --- invalid audit -> nothing persisted ------------------------------------
  console.log("Invalid audit:");
  const bad = await runAndPersistBrandMechanismAudit({ q1: 3 }, { slug: SLUG });
  check("invalid returns ok = false", bad.ok === false);
  check("invalid returns errors", bad.ok === false && bad.errors.length > 0);
  check("nothing was persisted", (await hasBrandMechanismProfile(SLUG)) === false);

  // --- valid audit -> persisted ----------------------------------------------
  console.log("Valid audit:");
  const good = await runAndPersistBrandMechanismAudit(validAnswers, { slug: SLUG });
  check("valid returns ok = true", good.ok === true);
  check("profile persisted", await hasBrandMechanismProfile(SLUG));
  if (good.ok) {
    check("persisted record has slug", good.persisted.slug === SLUG);
    check("envelope shape correct", good.persisted.brand_os.brand_mechanism_profile.dominant_mechanism === good.profile.dominant_mechanism);
  }

  // --- read after save -------------------------------------------------------
  console.log("Read back:");
  const read = await getBrandMechanismProfile(SLUG);
  check("profile readable after save", read !== null);
  const requiredFields = [
    "dominant_mechanism",
    "secondary_mechanism",
    "scores",
    "percentages",
    "congruence_level",
    "recommended_tone",
    "recommended_content_types",
    "recommended_page_structure",
    "recommended_ad_structure",
    "recommended_email_structure",
    "strategic_warning",
  ];
  check(
    "all required fields present",
    read !== null && requiredFields.every((f) => f in read),
    read ? requiredFields.filter((f) => !(f in read)).join(",") : "null",
  );
  const env = await getBrandOsEnvelope(SLUG);
  check("envelope getter wraps brand_os", env !== null && "brand_os" in env);

  // --- update overwrites correctly -------------------------------------------
  console.log("Update:");
  const before = await getBrandMechanismProfile(SLUG);
  const updated = await updateBrandMechanismProfile(SLUG, { recommended_tone: "TEST TONE" });
  check("update returns new tone", updated.recommended_tone === "TEST TONE");
  const afterRead = await getBrandMechanismProfile(SLUG);
  check("update persisted to disk", afterRead?.recommended_tone === "TEST TONE");
  check("update preserved other fields", afterRead?.dominant_mechanism === before?.dominant_mechanism);

  // --- agent factory ---------------------------------------------------------
  console.log("Agent Factory:");
  const ctx = await getAgentBrandContext(SLUG);
  check("agent context built", ctx !== null);
  if (ctx) {
    check("agent context has dominant", typeof ctx.dominant_mechanism === "string");
    check("agent context has primary_trigger", ctx.primary_trigger.length > 0);
    check("agent context has best_cta_style", ctx.best_cta_style.length > 0);
    check("agent context carries system_prompt", ctx.system_prompt.includes("EMOVEL Brand Mechanism Agent"));
    check("agent context has page structure", Array.isArray(ctx.recommended_page_structure));
  }

  // --- clear -----------------------------------------------------------------
  console.log("Clear:");
  const cleared = await clearBrandMechanismProfile(SLUG);
  check("clear returns true", cleared === true);
  check("profile gone after clear", (await getBrandMechanismProfile(SLUG)) === null);

  if (failures > 0) {
    console.error(`\n${failures} check(s) FAILED`);
    process.exit(1);
  }
  console.log("\nAll checks passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
