# Brand OS — `lib/brand-os`

Persistence + integration layer for the brand mechanism profile (the brand's
**strategic DNA**). It wraps the pure diagnostic core in `lib/brand-mechanism`
with the file-based persistence convention used across EMOVEL OS.

`lib/brand-mechanism` stays untouched as the diagnostic core. This layer only
adds saving, reading, updating, and an Agent Factory adapter.

## Storage

Follows the existing EMOVEL OS pattern (see `lib/projects.ts`): server-side,
file-based, under a sibling root inside `projects/`.

```
projects/
├── generated/<slug>/            # existing
├── build-workspaces/<slug>/     # existing
└── brand-os/<slug>.json         # this layer
```

Each `<slug>.json` stores the full record:

```jsonc
{
  "slug": "acme",
  "module_id": "brand_mechanism_audit",
  "module_version": "1.0.0",
  "saved_at": "…",
  "updated_at": "…",
  "brand_os": { "brand_mechanism_profile": { /* strategic DNA */ } }
}
```

## Public API

```ts
import {
  runAndPersistBrandMechanismAudit,
  getBrandMechanismProfile,
  getAgentBrandContext,
} from "@/lib/brand-os";

// End-to-end: validate -> score -> persist (only if valid)
const out = await runAndPersistBrandMechanismAudit(rawAnswers, { slug: "acme" });
if (!out.ok) {
  // out.errors: string[] — nothing was written
} else {
  // out.result / out.profile / out.envelope / out.persisted
}

// Read the brand's strategic DNA later
const profile = await getBrandMechanismProfile("acme");

// Agent-ready context for Agent Factory / Content Engine / generators
const ctx = await getAgentBrandContext("acme");
```

### Store functions
`saveBrandMechanismProfile`, `getBrandMechanismProfile`, `getBrandOsRecord`,
`getBrandOsEnvelope`, `hasBrandMechanismProfile`, `updateBrandMechanismProfile`,
`clearBrandMechanismProfile`, `listBrandProfiles`, `brandOsRoot`, `brandOsPath`.

### Agent Factory
`buildAgentBrandContext(profile)` / `getAgentBrandContext(slug)` return an
`AgentBrandContext` with `dominant_mechanism`, `secondary_mechanism`,
`congruence_level`, `primary_trigger`, `avoid`, `best_cta_style`,
`recommended_tone`, `recommended_content_types`, `recommended_page_structure`,
`recommended_ad_structure`, `recommended_email_structure`, `strategic_warning`,
and `system_prompt` — everything an agent needs to generate headlines, landing
pages, ads, emails, content angles, product descriptions, and pitch sections.

## Commands

```bash
npx tsx lib/brand-os/verify.ts     # persistence + agent-context harness
npx tsx lib/brand-mechanism/verify.ts
npx tsc --noEmit
```

## Convention notes

- TypeScript strict; no zod; no new dependencies (Node `fs/promises` only).
- Reuses `generatedRoot` + `safeSlug` from `lib/projects.ts` (no duplicated path
  logic, same slug validation).
- Brand profiles are keyed by `slug`. A slug can be a brand or a generated
  project; the audit can run during onboarding before any project files exist
  (the store creates `projects/brand-os/` on demand).

## Brand-aware prompts (`agent-prompt.ts`)

Injects the strategic profile into the EMOVEL prompt pattern (system + user
messages, like `lib/ai/prompt.ts`). Fallback-safe.

```ts
import { buildBrandAwarePromptForSlug } from "@/lib/brand-os";

const { messages, hasBrandContext, fallback, appliedMechanism } =
  await buildBrandAwarePromptForSlug({
    slug: "acme",
    basePrompt: "You are EMOVEL's landing page generator.",
    taskType: "landing_page",
    input: { product: "…", audience: "…" },
  });
// messages -> pass straight to streamAiText(model, messages)
```

- Pure variant: `buildBrandAwarePrompt({ basePrompt, brandContext, taskType, input })`.
- `taskType`: headline, landing_page, ad, email, content_angle, product_description,
  pitch_section, instagram_post, carousel, reel_script.
- Output: `{ systemPrompt, userPrompt, messages, taskType, hasBrandContext, fallback, appliedMechanism? }`.
- No stored profile → neutral EMOVEL directive, `fallback: true`, no invented mechanism.
- Verify: `npx tsx lib/brand-os/verify-agent-prompt.ts`.
