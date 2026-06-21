import { readdir, readFile, stat } from "fs/promises";
import path from "path";

export const pipelineFiles = [
  "offer.md",
  "copy.md",
  "ux-audit.md",
  "component-plan.md",
  "motion-plan.md",
  "visual-brief.md",
  "build-plan.md",
  "launch-plan.md"
];

export type GeneratedProject = {
  slug: string;
  name: string;
  fileCount: number;
  lastModified: string;
};

export type GeneratedProjectFile = {
  filename: string;
  content: string;
  exists: boolean;
};

function repoRoot() {
  return path.resolve(process.cwd(), "..", "..");
}

export function generatedRoot() {
  return path.join(repoRoot(), "projects", "generated");
}

function projectNameFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function safeSlug(slug: string) {
  return slug.replace(/[^a-z0-9-]/g, "");
}

export async function listGeneratedProjects(): Promise<GeneratedProject[]> {
  let entries;

  try {
    entries = await readdir(generatedRoot(), { withFileTypes: true });
  } catch {
    return [];
  }

  const projects = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const projectDir = path.join(generatedRoot(), entry.name);
        const files = await readdir(projectDir, { withFileTypes: true });
        const markdownFiles = files.filter((file) => file.isFile() && file.name.endsWith(".md"));
        const stats = await stat(projectDir);

        return {
          slug: entry.name,
          name: projectNameFromSlug(entry.name),
          fileCount: markdownFiles.length,
          lastModified: stats.mtime.toISOString()
        };
      })
  );

  return projects.sort(
    (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
  );
}

export async function readGeneratedProject(slug: string): Promise<GeneratedProjectFile[] | null> {
  const cleanSlug = safeSlug(slug);

  if (!cleanSlug || cleanSlug !== slug) {
    return null;
  }

  const projectDir = path.join(generatedRoot(), cleanSlug);

  try {
    const stats = await stat(projectDir);

    if (!stats.isDirectory()) {
      return null;
    }
  } catch {
    return null;
  }

  return Promise.all(
    pipelineFiles.map(async (filename) => {
      try {
        const content = await readFile(path.join(projectDir, filename), "utf8");

        return {
          filename,
          content,
          exists: true
        };
      } catch {
        return {
          filename,
          content: "",
          exists: false
        };
      }
    })
  );
}
