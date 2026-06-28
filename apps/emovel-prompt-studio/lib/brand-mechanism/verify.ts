// Verification harness for the Brand Mechanism Audit module.
// Run: npx tsx lib/brand-mechanism/verify.ts
// Asserts the scoring engine against the worked example in the module spec and
// checks validation edge cases. Exits non-zero on any failure.

import { mechanisms } from "./mechanisms";
import { scoreAudit, type AuditAnswers } from "./scoring";
import { validateAuditAnswers } from "./validate";
import { runBrandMechanismAudit } from "./index";

let failures = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    console.log(`  ok   ${name}`);
  } else {
    failures += 1;
    console.error(`  FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

// Build answers whose 4 questions per mechanism sum to a target total (4..20).
function answersForTotals(totals: Record<string, number>): AuditAnswers {
  const out: AuditAnswers = {};
  for (const m of mechanisms) {
    let remaining = totals[m.id];
    const qs = m.questions;
    qs.forEach((q, i) => {
      const left = qs.length - i;
      const val = Math.max(1, Math.min(5, remaining - (left - 1) * 1));
      out[q.id] = val as AuditAnswers[string];
      remaining -= val;
    });
  }
  return out;
}

// --- Worked example from the spec --------------------------------------------
// aspiratie 18, diferentiere 15, identificare 13, siguranta 10, obicei 7
// => dominant aspiratie, secondary diferentiere, gap 3 => congruence "Moderată"
const example = answersForTotals({
  identificare: 13,
  aspiratie: 18,
  siguranta: 10,
  obicei: 7,
  diferentiere: 15,
});

const res = scoreAudit(example);
console.log("Worked example:");
check("dominant is aspiratie", res.dominant.id === "aspiratie", res.dominant.id);
check("secondary is diferentiere", res.secondary.id === "diferentiere", res.secondary.id);
check("aspiratie score = 18", res.scores.aspiratie === 18, String(res.scores.aspiratie));
check("diferentiere score = 15", res.scores.diferentiere === 15, String(res.scores.diferentiere));
check("identificare score = 13", res.scores.identificare === 13, String(res.scores.identificare));
check("siguranta score = 10", res.scores.siguranta === 10, String(res.scores.siguranta));
check("obicei score = 7", res.scores.obicei === 7, String(res.scores.obicei));
check("score gap = 3", res.scoreGap === 3, String(res.scoreGap));
check("congruence = Moderată", res.congruence === "Moderată", res.congruence);
check("aspiratie status dominant", res.results.find((r) => r.id === "aspiratie")?.status === "dominant");
check("diferentiere status secondary", res.results.find((r) => r.id === "diferentiere")?.status === "secondary");
check("obicei status weak", res.results.find((r) => r.id === "obicei")?.status === "weak");
check("aspiratie percentage = 90", res.percentages.aspiratie === 90, String(res.percentages.aspiratie));

// --- Congruence boundaries ---------------------------------------------------
console.log("Congruence boundaries:");
const highGap = scoreAudit(answersForTotals({ identificare: 20, aspiratie: 12, siguranta: 8, obicei: 6, diferentiere: 5 }));
check("gap 8 => Ridicată", highGap.congruence === "Ridicată", highGap.congruence);
const modGap = scoreAudit(answersForTotals({ identificare: 18, aspiratie: 15, siguranta: 8, obicei: 6, diferentiere: 5 }));
check("gap 3 => Moderată", modGap.congruence === "Moderată", modGap.congruence);
const lowGap = scoreAudit(answersForTotals({ identificare: 18, aspiratie: 17, siguranta: 8, obicei: 6, diferentiere: 5 }));
check("gap 1 => Scăzută", lowGap.congruence === "Scăzută", lowGap.congruence);

// --- Tie-break determinism ---------------------------------------------------
console.log("Tie-break:");
const tie = scoreAudit(answersForTotals({ identificare: 16, aspiratie: 16, siguranta: 16, obicei: 16, diferentiere: 16 }));
check("all-equal dominant = identificare (canonical order)", tie.dominant.id === "identificare", tie.dominant.id);
check("all-equal secondary = aspiratie", tie.secondary.id === "aspiratie", tie.secondary.id);

// --- Validation --------------------------------------------------------------
console.log("Validation:");
check("valid input passes", validateAuditAnswers(example).ok === true);
const missing = validateAuditAnswers({ q1: 3 });
check("missing questions rejected", missing.ok === false);
check("missing reports multiple errors", missing.ok === false && missing.errors.length > 1);
check("out-of-range rejected", validateAuditAnswers({ ...example, q1: 9 }).ok === false);
check("non-numeric rejected", validateAuditAnswers({ ...example, q1: "x" }).ok === false);
check("unknown key rejected", validateAuditAnswers({ ...example, q99: 3 }).ok === false);
check("null rejected", validateAuditAnswers(null).ok === false);

// --- End-to-end --------------------------------------------------------------
console.log("End-to-end:");
const run = runBrandMechanismAudit(example);
check("run ok = true", run.ok === true);
if (run.ok) {
  check("profile dominant = aspiratie", run.profile.dominant_mechanism === "aspiratie");
  check("profile tone is premium (aspiratie)", run.profile.recommended_tone.includes("premium"));
  check("profile has ad_structure", typeof run.profile.recommended_ad_structure === "string");
  check("profile has email_structure", typeof run.profile.recommended_email_structure === "string");
  check("profile has strategic_warning", run.profile.strategic_warning.length > 0);
  check("envelope wraps profile", run.envelope.brand_os.brand_mechanism_profile.dominant_mechanism === "aspiratie");
}
const badRun = runBrandMechanismAudit({ q1: 3 });
check("invalid run ok = false", badRun.ok === false);
check("invalid run returns errors", badRun.ok === false && badRun.errors.length > 0);

// --- Result ------------------------------------------------------------------
if (failures > 0) {
  console.error(`\n${failures} check(s) FAILED`);
  process.exit(1);
}
console.log("\nAll checks passed.");
