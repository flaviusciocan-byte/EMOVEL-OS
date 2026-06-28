// EMOVEL Page Builder Core — Composer (execution-order step 7).
//
// Orchestrates the one-way pipeline: Intent -> Page Schema -> Validation Gate ->
// render-ready document. Pure core:
//   - The AI is an INJECTED dependency (PageSchemaProducer); this module never
//     calls a model itself.
//   - AI produces Page Schema ONLY (JSON), never JSX. The producer's output is
//     always run through the Validation Gate (normalize + validate) before it can
//     become a render-ready document.
//   - The renderer (PageBuilderHtmlRenderer) consumes result.document — which
//     only exists when the gate passed.

import {
  buildLandingPageBuilderPrompt,
  type LandingPageBuilderInput,
  type LandingPageBuilderPromptOutput,
} from "./generator";
import { normalizePageBuilderDocument } from "./normalize";
import type { PageBuilderDocument } from "./schema";

export type ComposeStage = "prompt" | "schema" | "validation" | "rendered";

// AI transport. Receives the brand-aware prompt and returns the model's raw
// Page Schema output — a JSON string or an already-parsed object. It must NEVER
// return JSX or rendered markup; anything that is not a valid PageBuilderDocument
// is rejected by the gate.
export type PageSchemaProducer = (
  prompt: LandingPageBuilderPromptOutput,
) => Promise<string | unknown> | string | unknown;

export type ComposeResult =
  | {
      ok: true;
      stage: "rendered";
      document: PageBuilderDocument;
      prompt?: LandingPageBuilderPromptOutput;
    }
  | {
      ok: false;
      stage: Exclude<ComposeStage, "rendered">;
      errors: string[];
      prompt?: LandingPageBuilderPromptOutput;
    };

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

// Validation Gate only. Takes already-produced raw Page Schema (string or object)
// and runs it through normalize + validate. Synchronous and pure; on success the
// document is render-ready. Use this when the schema already exists (e.g. tests,
// re-validation, or a cached AI response).
export function composeFromRawSchema(
  raw: unknown,
  prompt?: LandingPageBuilderPromptOutput,
): ComposeResult {
  const validated = normalizePageBuilderDocument(raw);
  if (!validated.ok) {
    return { ok: false, stage: "validation", errors: validated.errors, prompt };
  }
  return { ok: true, stage: "rendered", document: validated.document, prompt };
}

// Full Composer. Intent -> Page Schema (via the injected producer) -> Validation
// Gate -> render-ready document. Never throws: every failure stage returns an
// explicit { ok: false, stage, errors }.
export async function composePageBuilderDocument(
  input: LandingPageBuilderInput,
  produceSchema: PageSchemaProducer,
): Promise<ComposeResult> {
  // 1) Intent -> brand-aware Page Schema prompt.
  let prompt: LandingPageBuilderPromptOutput;
  try {
    prompt = await buildLandingPageBuilderPrompt(input);
  } catch (error) {
    return { ok: false, stage: "prompt", errors: [errorMessage(error)] };
  }

  // 2) AI produces Page Schema (JSON only, never JSX).
  let raw: string | unknown;
  try {
    raw = await produceSchema(prompt);
  } catch (error) {
    return { ok: false, stage: "schema", errors: [errorMessage(error)], prompt };
  }

  // 3) Validation Gate + 4) render-ready document.
  const gated = composeFromRawSchema(raw, prompt);
  return gated;
}
