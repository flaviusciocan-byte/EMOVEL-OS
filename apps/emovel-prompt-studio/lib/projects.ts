import { mkdir, readdir, readFile, stat, writeFile } from "fs/promises";
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
  "build-handoff.md",
  "gpt-pilot-prompt.md",
  "README_BUILD.md"
];

const generatedHandoffFiles = ["build-handoff.md", "gpt-pilot-prompt.md", "README_BUILD.md"];
const sourcePipelineFiles = pipelineFiles.filter((filename) => !generatedHandoffFiles.includes(filename));
export const builderWorkspaceFiles = [
  "gpt-pilot-prompt.md",
  "build-handoff.md",
  "README_BUILD.md",
  "BUILDER_CONTEXT.md",
  "TASKS.md",
  "ACCEPTANCE_CHECKLIST.md"
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

export function builderWorkspaceRoot() {
  return path.join(repoRoot(), "projects", "build-workspaces");
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

function conciseSection(content: string, fallback: string) {
  const cleaned = sectionFromMarkdown(content, fallback);

  return cleaned.split("\n").slice(0, 5).join("\n").trim();
}

function bulletFileList(slug: string, files: GeneratedProjectFile[]) {
  return files
    .filter((file) => file.exists)
    .map((file) => `- projects/generated/${slug}/${file.filename}`)
    .join("\n");
}

async function readSourceProjectFiles(projectDir: string) {
  return Promise.all(
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
}

function projectFileMap(files: GeneratedProjectFile[]) {
  return Object.fromEntries(files.map((file) => [file.filename, file]));
}

async function projectDirectory(slug: string) {
  const cleanSlug = safeSlug(slug);

  if (!cleanSlug || cleanSlug !== slug) {
    throw new Error("Invalid project slug.");
  }

  const projectDir = path.join(generatedRoot(), cleanSlug);
  const stats = await stat(projectDir);

  if (!stats.isDirectory()) {
    throw new Error("Generated project folder does not exist.");
  }

  return {
    cleanSlug,
    projectDir
  };
}

export async function createBuildHandoff(slug: string) {
  const { cleanSlug, projectDir } = await projectDirectory(slug);
  const projectFiles = await readSourceProjectFiles(projectDir);
  const fileByName = projectFileMap(projectFiles);
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

export async function createGptPilotBuildHandoff(slug: string) {
  const { cleanSlug, projectDir } = await projectDirectory(slug);
  const projectFiles = await readSourceProjectFiles(projectDir);
  const fileByName = projectFileMap(projectFiles);
  const projectName = projectNameFromSlug(cleanSlug);
  const generatedAt = new Date().toISOString();

  const prompt = `# GPT-Pilot / Pythagora Build Prompt: ${projectName}

Generated locally by EMOVEL Prompt Studio v1.4 on ${generatedAt}.

Use this prompt with GPT-Pilot or Pythagora to create a runnable Next.js application. Do not call paid APIs unless a human explicitly adds keys and approves the integration.

## Project Summary

${conciseSection(
  fileByName["offer.md"]?.content || "",
  `${projectName} is a premium web product generated from the EMOVEL production pipeline.`
)}

## Product Goal

Build a polished, responsive, production-ready landing app that turns the generated offer, copy, UX plan, visual brief, and launch plan into a convincing customer-facing experience.

## Target User

${conciseSection(
  fileByName["copy.md"]?.content || "",
  "The target user is a product builder, creator, consultant, or founder who needs a premium launch page that clarifies the offer and drives action."
)}

## Route Structure

- \`/\` - primary landing page.
- \`/checkout\` - placeholder route for future payment handoff.
- \`/thank-you\` - placeholder route for post-purchase onboarding.
- \`/privacy\` - simple policy placeholder if forms are added.

## Component Hierarchy

${conciseSection(
  fileByName["component-plan.md"]?.content || "",
  "- AppShell\n- HeroSection\n- ProofStrip\n- OfferBreakdown\n- FeatureGrid\n- PricingSection\n- LaunchPlanSection\n- FAQSection\n- FinalCTA"
)}

## UX Requirements

${conciseSection(
  fileByName["ux-audit.md"]?.content || "",
  "- Make the offer understandable within the first viewport.\n- Keep CTAs visible and specific.\n- Use scannable sections with clear hierarchy.\n- Avoid generic marketing filler."
)}

## Motion Requirements

${conciseSection(
  fileByName["motion-plan.md"]?.content || "",
  "- Add restrained section reveals.\n- Add hover feedback for primary actions.\n- Respect prefers-reduced-motion.\n- Keep motion supportive, not decorative."
)}

## Styling Rules

${conciseSection(
  fileByName["visual-brief.md"]?.content || "",
  "- Use premium editorial typography.\n- Use high contrast and generous spacing.\n- Avoid purple gradient or generic SaaS styling.\n- Design for desktop and mobile from the start."
)}

## Files To Create

- \`package.json\`
- \`app/layout.tsx\`
- \`app/page.tsx\`
- \`app/checkout/page.tsx\`
- \`app/thank-you/page.tsx\`
- \`app/privacy/page.tsx\`
- \`app/globals.css\`
- \`components/AppShell.tsx\`
- \`components/HeroSection.tsx\`
- \`components/OfferBreakdown.tsx\`
- \`components/PricingSection.tsx\`
- \`components/LaunchPlanSection.tsx\`
- \`components/FAQSection.tsx\`
- \`components/FinalCTA.tsx\`
- \`lib/content.ts\`

## Build Constraints

- Use Next.js, TypeScript, and Tailwind CSS.
- Keep all content local in code or markdown-derived constants.
- Do not add paid APIs, external databases, auth, or payments.
- Do not require Docker for the first runnable version.
- Keep the app buildable with \`npm install\` and \`npm run build\`.
- Use semantic HTML and accessible controls.
- Include mobile responsive behavior.

## Source Material

${bulletFileList(cleanSlug, projectFiles)}

## Acceptance Checklist

- [ ] App installs with \`npm install\`.
- [ ] App builds with \`npm run build\`.
- [ ] Landing page includes the generated offer and copy.
- [ ] Route structure exists.
- [ ] Component hierarchy is implemented.
- [ ] UX requirements are visible in layout and CTA flow.
- [ ] Motion requirements are implemented or documented as intentionally deferred.
- [ ] Styling follows the visual brief.
- [ ] No paid API, database, or GPT-Pilot runtime dependency is required by the generated app.
`;

  const readme = `# README_BUILD: ${projectName}

Generated locally by EMOVEL Prompt Studio v1.4 on ${generatedAt}.

## Purpose

This folder contains local production planning files for ${projectName}. Use \`gpt-pilot-prompt.md\` as the builder prompt for GPT-Pilot or Pythagora.

## How To Use With GPT-Pilot / Pythagora

1. Open GPT-Pilot or Pythagora in its own workspace.
2. Start a new app project.
3. Paste the full contents of \`projects/generated/${cleanSlug}/gpt-pilot-prompt.md\` as the project brief.
4. Ask the tool to generate a Next.js, TypeScript, Tailwind app.
5. Keep generated app files outside EMOVEL-OS unless you are intentionally creating a product app under \`products/{product-slug}/landing-app/\`.
6. Run \`npm install\`.
7. Run \`npm run build\`.
8. Fix build errors before adding integrations.

## Expected App Output

- A runnable Next.js landing app.
- Local content based on the generated EMOVEL markdown files.
- Route placeholders for checkout, thank-you, and privacy.
- Reusable components matching the generated component hierarchy.
- Styling that follows the visual brief.
- No paid APIs, no database, and no automation side effects.

## Manual Next Steps

- Review generated copy against \`offer.md\` and \`copy.md\`.
- Confirm layout quality against \`ux-audit.md\`.
- Compare components against \`component-plan.md\`.
- Apply or defer motion from \`motion-plan.md\`.
- Run local build verification.
- Create a launch report before publishing.
`;

  const promptPath = path.join(projectDir, "gpt-pilot-prompt.md");
  const readmePath = path.join(projectDir, "README_BUILD.md");

  await Promise.all([
    writeFile(promptPath, prompt, "utf8"),
    writeFile(readmePath, readme, "utf8")
  ]);

  return [promptPath, readmePath];
}

export async function builderWorkspaceExists(slug: string) {
  const cleanSlug = safeSlug(slug);

  if (!cleanSlug || cleanSlug !== slug) {
    return false;
  }

  try {
    const stats = await stat(path.join(builderWorkspaceRoot(), cleanSlug));

    return stats.isDirectory();
  } catch {
    return false;
  }
}

export async function readBuilderWorkspace(slug: string): Promise<GeneratedProjectFile[] | null> {
  const cleanSlug = safeSlug(slug);

  if (!cleanSlug || cleanSlug !== slug) {
    return null;
  }

  const workspaceDir = path.join(builderWorkspaceRoot(), cleanSlug);

  try {
    const stats = await stat(workspaceDir);

    if (!stats.isDirectory()) {
      return null;
    }
  } catch {
    return null;
  }

  return Promise.all(
    builderWorkspaceFiles.map(async (filename) => {
      try {
        const content = await readFile(path.join(workspaceDir, filename), "utf8");

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

export async function createBuilderWorkspace(slug: string) {
  const { cleanSlug, projectDir } = await projectDirectory(slug);
  const workspaceDir = path.join(builderWorkspaceRoot(), cleanSlug);

  await mkdir(workspaceDir, { recursive: true });
  await createBuildHandoff(cleanSlug);
  await createGptPilotBuildHandoff(cleanSlug);

  const copiedFiles = await Promise.all(
    generatedHandoffFiles.map(async (filename) => {
      const content = await readFile(path.join(projectDir, filename), "utf8");
      const destination = path.join(workspaceDir, filename);
      await writeFile(destination, content, "utf8");

      return destination;
    })
  );

  const projectFiles = await readSourceProjectFiles(projectDir);
  const fileByName = projectFileMap(projectFiles);
  const projectName = projectNameFromSlug(cleanSlug);
  const generatedAt = new Date().toISOString();

  const builderContext = `# Builder Context: ${projectName}

Generated locally by EMOVEL Prompt Studio v1.5 on ${generatedAt}.

## Workspace Path

\`projects/build-workspaces/${cleanSlug}/\`

## Source Project

\`projects/generated/${cleanSlug}/\`

## Project Summary

${conciseSection(
  fileByName["offer.md"]?.content || "",
  `${projectName} is ready for a builder pass using the generated EMOVEL launch assets.`
)}

## Builder Objective

Use this workspace as the prep packet for GPT-Pilot, Pythagora, or a manual app build. The workspace contains the builder prompt, product handoff, build README, tasks, and acceptance checklist.

## Local-Only Boundaries

- Do not run GPT-Pilot from Prompt Studio.
- Do not execute shell commands from the UI.
- Do not add paid APIs or databases.
- Use this folder as preparation material only.
`;

  const tasks = `# Builder Tasks: ${projectName}

## Prep

- [ ] Read \`README_BUILD.md\`.
- [ ] Read \`gpt-pilot-prompt.md\`.
- [ ] Read \`build-handoff.md\`.
- [ ] Confirm the app output location before generation.

## App Build

- [ ] Create a Next.js app with TypeScript and Tailwind.
- [ ] Implement the route structure from \`gpt-pilot-prompt.md\`.
- [ ] Build the component hierarchy from the handoff.
- [ ] Move product copy into local content constants.
- [ ] Apply the visual direction and responsive layout rules.
- [ ] Add motion only after the static page is stable.

## Verification

- [ ] Run \`npm install\` in the generated app workspace.
- [ ] Run \`npm run build\`.
- [ ] Fix all build errors.
- [ ] Smoke test the landing page locally.
- [ ] Record launch notes before publishing.
`;

  const acceptanceChecklist = `# Acceptance Checklist: ${projectName}

- [ ] Builder workspace contains \`gpt-pilot-prompt.md\`.
- [ ] Builder workspace contains \`build-handoff.md\`.
- [ ] Builder workspace contains \`README_BUILD.md\`.
- [ ] App can be generated without paid APIs.
- [ ] App can be generated without a database.
- [ ] App has a primary landing page route.
- [ ] App includes generated offer, copy, UX, component, motion, and visual direction.
- [ ] App is responsive on mobile and desktop.
- [ ] App passes \`npm run build\`.
- [ ] GPT-Pilot or Pythagora output is reviewed manually before launch.
`;

  const generatedFiles = await Promise.all([
    writeFile(path.join(workspaceDir, "BUILDER_CONTEXT.md"), builderContext, "utf8").then(
      () => path.join(workspaceDir, "BUILDER_CONTEXT.md")
    ),
    writeFile(path.join(workspaceDir, "TASKS.md"), tasks, "utf8").then(() =>
      path.join(workspaceDir, "TASKS.md")
    ),
    writeFile(path.join(workspaceDir, "ACCEPTANCE_CHECKLIST.md"), acceptanceChecklist, "utf8").then(
      () => path.join(workspaceDir, "ACCEPTANCE_CHECKLIST.md")
    )
  ]);

  return [...copiedFiles, ...generatedFiles];
}
