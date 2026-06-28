import { NextResponse } from "next/server";
import { getAvailableModelSequence } from "@/lib/ai/model-registry";
import { streamAiText } from "@/lib/ai/providers";
import { composePageBuilderDocument, type PageSchemaProducer } from "@/lib/page-builder/composer";
import { pageBuilderDocumentToMarkdown } from "@/lib/page-builder/export";
import type { LandingPageBuilderProject } from "@/lib/page-builder/generator";
import { savePageBuilderDocument } from "@/lib/page-builder/store";
import type { ProjectAssets } from "@/lib/project-schema";

// Dedicated endpoint for STRUCTURED PageBuilderDocument generation. The existing
// /api/ai/generate validates output as a StrategyAsset, so it is not suitable
// for full-document JSON. This route drives the EMOVEL Composer
// (Intent -> Page Schema -> Validation Gate -> render-ready document): it injects
// an AI producer (model sequence + streamAiText), and the Composer owns the
// prompt + the validation gate. Valid output is persisted server-side via the
// file-based page-builder store. It does NOT touch the strategy route, Brand OS,
// or the audit.

type GenerateLandingPageRequest = {
  slug?: string;
  project?: LandingPageBuilderProject;
  assets?: Partial<ProjectAssets>;
};

async function collectText(text: AsyncGenerator<string>) {
  let output = "";
  for await (const chunk of text) {
    output += chunk;
  }
  return output;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateLandingPageRequest;
    const slug = body.slug?.trim();
    const project = body.project;

    if (!slug) {
      return NextResponse.json({ ok: false, errors: ["slug is required."] }, { status: 400 });
    }
    if (!project || !project.title?.trim()) {
      return NextResponse.json({ ok: false, errors: ["project.title is required."] }, { status: 400 });
    }

    const models = getAvailableModelSequence();
    if (models.length === 0) {
      console.info("[EMOVEL Page Builder] generate", {
        provider: null,
        model: null,
        mode: "FALLBACK",
        reason: "provider_not_configured",
      });
      return NextResponse.json(
        {
          ok: false,
          mode: "fallback",
          errors: ["No configured AI provider was available. Configure a provider to generate a landing page."],
        },
        { status: 503 },
      );
    }

    // AI producer: try the model sequence in order, return the first model's raw
    // Page Schema output. Captures diagnostics (used model, last raw, failures)
    // for the response. Throws only when every model fails — surfaced by the
    // Composer as a "schema" stage failure.
    const failures: string[] = [];
    let usedProvider: string | null = null;
    let usedModel: string | null = null;
    let lastRaw = "";

    const produceSchema: PageSchemaProducer = async (prompt) => {
      for (const model of models) {
        try {
          console.info("[EMOVEL Page Builder] generate", {
            provider: model.provider,
            model: model.model,
            mode: "AI",
          });
          const result = streamAiText(model, prompt.messages);
          const raw = await collectText(result.text);
          usedProvider = model.provider;
          usedModel = model.model;
          lastRaw = raw;
          return raw;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown provider failure.";
          console.info("[EMOVEL Page Builder] generate", {
            provider: model.provider,
            model: model.model,
            mode: "FALLBACK",
            reason: message,
          });
          failures.push(message);
        }
      }
      throw new Error("AI providers failed during landing page generation.");
    };

    const composed = await composePageBuilderDocument({ slug, project, assets: body.assets }, produceSchema);

    const brandContext = composed.prompt
      ? {
          hasBrandContext: composed.prompt.hasBrandContext,
          fallback: composed.prompt.fallback,
          fallbackReason: composed.prompt.fallbackReason,
          appliedMechanism: composed.prompt.appliedMechanism,
          taskType: composed.prompt.taskType,
        }
      : null;

    if (!composed.ok) {
      if (composed.stage === "schema") {
        // Every model failed to produce output.
        return NextResponse.json(
          { ok: false, mode: "fallback", brandContext, errors: ["AI providers failed during landing page generation."], failures },
          { status: 502 },
        );
      }
      if (composed.stage === "validation") {
        // The model responded, but the output failed the validation gate.
        return NextResponse.json(
          { ok: false, mode: "ai", provider: usedProvider, model: usedModel, brandContext, errors: composed.errors, raw: lastRaw },
          { status: 422 },
        );
      }
      // Prompt-stage failure (Brand OS / intent).
      return NextResponse.json({ ok: false, brandContext, errors: composed.errors }, { status: 400 });
    }

    // Render-ready document — persist it (already validated by the gate).
    const record = await savePageBuilderDocument(slug, composed.document);
    return NextResponse.json({
      ok: true,
      mode: "ai",
      provider: usedProvider,
      model: usedModel,
      brandContext,
      slug: record.slug,
      document: composed.document,
      markdown: pageBuilderDocumentToMarkdown(composed.document),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    return NextResponse.json({ ok: false, errors: [message] }, { status: 400 });
  }
}
