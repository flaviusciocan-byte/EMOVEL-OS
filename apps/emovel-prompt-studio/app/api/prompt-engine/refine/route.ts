import { NextResponse } from "next/server";
import { promptPackageToMarkdown, refineRawIdea } from "@/lib/prompt-engine";
import type { PromptEngineInput } from "@/lib/prompt-engine";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<PromptEngineInput>;
    const result = refineRawIdea({
      rawIdea: body.rawIdea ?? "",
      tone: body.tone,
      productType: body.productType,
      audience: body.audience,
    });

    if (!result.ok) {
      return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      package: result.package,
      markdown: promptPackageToMarkdown(result.package),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid Prompt Engine request.";
    return NextResponse.json({ ok: false, errors: [message] }, { status: 400 });
  }
}
