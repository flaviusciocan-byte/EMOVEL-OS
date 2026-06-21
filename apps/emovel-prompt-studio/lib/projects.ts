import { readdir, readFile, stat, writeFile } from "fs/promises";
import path from "path";

export const pipelineFiles = [
  "offer.md",
  "copy.md",
  "ux-audit.md",
  "component-plan.md",
  "motion-plan.md",
  "visual-brief.md",
  "build-plan.md",
  "launch-plan.md",
  "build-handoff.md"
];

const sourcePipelineFiles = pipelineFiles.filter((filename) => filename !== "build-handoff.md");

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

export function projectNameFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function safeSlug(slug: string) {
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

function sectionFromMarkdown(content: string, fallback: string) {
  const cleaned = content
    .replace(/^# .+\n+/, "")
    .replace(/^## .+\n+/gm, "")
    .trim();

  if (!cleaned) {
    return fallback;
  }

  return cleaned.split("\n").slice(0, 8).join("\n").trim();
}

function bulletFileList(slug: string, files: GeneratedProjectFile[]) {
  return files
    .filter((file) => file.exists)
    .map((file) => `- projects/generated/${slug}/${file.filename}`)
    .join("\n");
}

export async function createBuildHandoff(slug: string) {
  const cleanSlug = safeSlug(slug);

  if (!cleanSlug || cleanSlug !== slug) {
    throw new Error("Invalid project slug.");
  }

  const projectDir = path.join(generatedRoot(), cleanSlug);
  const projectFiles = await Promise.all(
    sourcePipelineFiles.map(async (filename) => {
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

  const fileByName = Object.fromEntries(projectFiles.map((file) => [file.filename, file]));
  const projectName = projectNameFromSlug(cleanSlug);
  const generatedAt = new Date().toISOString();

  const content = `# Build Handoff: ${projectName}

Generated locally by EMOVEL Prompt Studio v1.3 on ${generatedAt}.

## Product Summary

${sectionFromMarkdown(
  fileByName["offer.md"]?.content || "",
  `${projectName} is ready for a production build pass using the generated offer, copy, UX, component, motion, visual, build, and launch plans.`
)}

## Route Structure

- \`/\` - premium landing page with hero, outcome proof, system walkthrough, offer, pricing, FAQ, and CTA sections.
- \`/checkout\` - future checkout or purchase handoff page when commerce is connected.
- \`/thank-you\` - post-purchase onboarding and delivery instructions.
- \`/api/*\` - reserved for future local or automation integrations only when required.

## Component Hierarchy

${sectionFromMarkdown(
  fileByName["component-plan.md"]?.content || "",
  "- AppShell\n- HeroSection\n- OutcomeStrip\n- OfferSystem\n- PricingPanel\n- VisualProof\n- LaunchTimeline\n- FAQ\n- FinalCTA"
)}

## Design Direction

${sectionFromMarkdown(
  fileByName["visual-brief.md"]?.content || "",
  "Use a premium operational interface: high contrast, strong typography, clean cards, precise spacing, and visual proof that makes the offer feel concrete."
)}

## Motion Direction

${sectionFromMarkdown(
  fileByName["motion-plan.md"]?.content || "",
  "Use restrained motion: section reveals, CTA hover elevation, subtle progress transitions, and reduced-motion fallbacks."
)}

## Required Files

${bulletFileList(cleanSlug, projectFiles)}
- products/{product-slug}/landing-app/package.json
- products/{product-slug}/landing-app/app/page.tsx
- products/{product-slug}/landing-app/app/layout.tsx
- products/{product-slug}/landing-app/app/globals.css
- products/{product-slug}/landing-app/components/
- products/{product-slug}/landing-app/lib/

## Build Instructions

1. Create a Next.js app with TypeScript and Tailwind in the product landing-app folder.
2. Convert the offer and copy markdown into page sections before styling.
3. Implement the component hierarchy as reusable components.
4. Apply the visual direction with local CSS tokens and responsive layout constraints.
5. Add motion only after the static layout passes build and mobile checks.
6. Run \`npm install\`.
7. Run \`npm run build\`.
8. Fix all TypeScript, lint, and rendering errors before launch review.

## Acceptance Checklist

- [ ] Landing page runs locally without paid APIs.
- [ ] All required route sections are present.
- [ ] Offer, copy, pricing, and CTA are visible in the first complete page pass.
- [ ] Component hierarchy matches the generated component plan.
- [ ] Visual direction is implemented with clear spacing, contrast, and responsive behavior.
- [ ] Motion is purposeful and includes reduced-motion behavior.
- [ ] Build passes with \`npm run build\`.
- [ ] Launch assets and next steps are documented.
`;

  const handoffPath = path.join(projectDir, "build-handoff.md");
  await writeFile(handoffPath, content, "utf8");

  return handoffPath;
}
