import { NextResponse } from "next/server";
import { getAvailableModelSequence } from "@/lib/ai/model-registry";
import { streamAiText } from "@/lib/ai/providers";
import { pageBuilderDocumentToMarkdown } from "@/lib/page-builder/export";
import { evaluatePageBuilderReadiness } from "@/lib/page-builder/readiness";
import { buildPageBuilderSectionPrompt, isSupportedSectionRegeneration } from "@/lib/page-builder/section-generator";
import { parsePageBuilderSection, replacePageBuilderSection } from "@/lib/page-builder/section-regeneration";
import type { PageBuilderSectionType } from "@/lib/page-builder/schema";
import { getPageBuilderDocument, savePageBuilderDocument } from "@/lib/page-builder/store";
import type { LandingPageBuilderProject } from "@/lib/page-builder/generator";
import type { ProjectAssets } from "@/lib/project-schema";

type RegenerateSectionRequest = {
  slug?: string;
  sectionType?: PageBuilderSectionType;
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
    const body = (await request.json()) as RegenerateSectionRequest;
    const slug = body.slug?.trim();
    const sectionType = body.sectionType;

    if (!slug) {
      return NextResponse.json({ ok: false, errors: ["slug is required."] }, { status: 400 });
    }
    if (!sectionType || !isSupportedSectionRegeneration(sectionType)) {
      return NextResponse.json({ ok: false, errors: ["sectionType is not supported for regeneration."] }, { status: 400 });
    }
    if (!body.project || !body.project.title?.trim()) {
      return NextResponse.json({ ok: false, errors: ["project.title is required."] }, { status: 400 });
    }

    let document;
    try {
      document = await getPageBuilderDocument(slug);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid slug.";
      return NextResponse.json({ ok: false, errors: [message] }, { status: 400 });
    }
    if (!document) {
      return NextResponse.json({ ok: false, errors: ["No Page Builder document found."] }, { status: 404 });
    }

    const prompt = await buildPageBuilderSectionPrompt({
      slug,
      document,
      sectionType,
      project: body.project,
      assets: body.assets,
    });

    const models = getAvailableModelSequence();
    if (models.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          mode: "fallback",
          errors: ["No configured AI provider was available. Configure a provider to regenerate a section."],
        },
        { status: 503 },
      );
    }

    const failures: string[] = [];
    for (const model of models) {
      try {
        console.info("[EMOVEL Page Builder] regenerate-section", {
          provider: model.provider,
          model: model.model,
          sectionType,
          mode: "AI",
        });

        const result = streamAiText(model, prompt.messages);
        const raw = await collectText(result.text);
        const parsed = parsePageBuilderSection(raw, sectionType);
        if (!parsed.ok) {
          return NextResponse.json(
            {
              ok: false,
              mode: "ai",
              provider: model.provider,
              model: model.model,
              regeneratedSectionType: sectionType,
              errors: parsed.errors,
              raw,
            },
            { status: 422 },
          );
        }

        const replaced = replacePageBuilderSection(document, parsed.section);
        if (!replaced.ok) {
          return NextResponse.json(
            {
              ok: false,
              mode: "ai",
              provider: model.provider,
              model: model.model,
              regeneratedSectionType: sectionType,
              errors: replaced.errors,
              raw,
            },
            { status: 422 },
          );
        }

        // Only save after both the section and full document pass validation.
        await savePageBuilderDocument(slug, replaced.document);

        return NextResponse.json({
          ok: true,
          mode: "ai",
          provider: model.provider,
          model: model.model,
          document: replaced.document,
          markdown: pageBuilderDocumentToMarkdown(replaced.document),
          readiness: evaluatePageBuilderReadiness(replaced.document),
          regeneratedSectionType: sectionType,
        });
      } catch (error) {
        failures.push(error instanceof Error ? error.message : "Unknown provider failure.");
      }
    }

    return NextResponse.json(
      {
        ok: false,
        mode: "fallback",
        regeneratedSectionType: sectionType,
        errors: ["AI providers failed during section regeneration."],
        failures,
      },
      { status: 502 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    return NextResponse.json({ ok: false, errors: [message] }, { status: 400 });
  }
}
