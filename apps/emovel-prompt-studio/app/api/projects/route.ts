import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { generateExecutionPlan, type BuilderTarget, type PublishingTarget } from "@/execution";
import {
  generateMarkdown,
  generatePipelineFiles,
  outputTypes,
  projectTypes,
  type OutputType,
  type ProjectType
} from "@/lib/templates";

type SaveRequest = {
  action: "save-output" | "run-pipeline" | "generate-execution-plan";
  projectName?: string;
  prompt?: string;
  projectType?: ProjectType;
  outputs?: OutputType[];
  builderTarget?: BuilderTarget;
  publishingTargets?: PublishingTarget[];
};

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "untitled-project";
}

function repoRoot() {
  return path.resolve(process.cwd(), "..", "..");
}

function generatedRoot() {
  return path.join(repoRoot(), "projects", "generated");
}

function validProjectType(value: unknown): value is ProjectType {
  return typeof value === "string" && projectTypes.includes(value as ProjectType);
}

function validOutputs(value: unknown): OutputType[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is OutputType =>
    typeof item === "string" && outputTypes.includes(item as OutputType)
  );
}

export async function POST(request: Request) {
  const body = (await request.json()) as SaveRequest;
  const projectType = validProjectType(body.projectType) ? body.projectType : "landing page";
  const prompt = body.prompt?.trim() || "No raw prompt provided.";
  const projectName = body.projectName?.trim() || prompt.slice(0, 60) || "Untitled Project";
  const slug = slugify(projectName);
  const projectDir = path.join(generatedRoot(), slug);

  await mkdir(projectDir, { recursive: true });

  if (body.action === "generate-execution-plan") {
    const markdown = generateExecutionPlan({
      command: prompt,
      projectName,
      projectSlug: slug,
      builderTarget: body.builderTarget,
      publishingTargets: body.publishingTargets
    });
    const filePath = path.join(projectDir, "execution-plan.md");
    await writeFile(filePath, markdown, "utf8");

    return NextResponse.json({
      ok: true,
      action: body.action,
      slug,
      directory: path.relative(repoRoot(), projectDir),
      files: [path.relative(repoRoot(), filePath)]
    });
  }

  if (body.action === "run-pipeline") {
    const files = generatePipelineFiles({ prompt, projectType });
    const written = await Promise.all(
      Object.entries(files).map(async ([filename, content]) => {
        const filePath = path.join(projectDir, filename);
        await writeFile(filePath, content, "utf8");
        return path.relative(repoRoot(), filePath);
      })
    );

    return NextResponse.json({
      ok: true,
      action: body.action,
      slug,
      directory: path.relative(repoRoot(), projectDir),
      files: written
    });
  }

  if (body.action === "save-output") {
    const outputs = validOutputs(body.outputs);
    const markdown = generateMarkdown({ prompt, projectType, outputs });
    const filePath = path.join(projectDir, "output.md");
    await writeFile(filePath, markdown, "utf8");

    return NextResponse.json({
      ok: true,
      action: body.action,
      slug,
      directory: path.relative(repoRoot(), projectDir),
      files: [path.relative(repoRoot(), filePath)]
    });
  }

  return NextResponse.json({ ok: false, error: "Unknown project action." }, { status: 400 });
}
