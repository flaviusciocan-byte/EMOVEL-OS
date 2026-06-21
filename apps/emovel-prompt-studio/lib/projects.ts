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
  "ACCEPTANCE_CHECKLIST.md",
  "BUILDER_COMMANDS.md",
  "BUILD_STATUS.md",
  "RUN_LOG.md"
];

export const buildStatuses = [
  "Draft",
  "Ready for Builder",
  "Building",
  "Build Failed",
  "Build Passed",
  "Ready for Review",
  "Ready to Publish"
] as const;

export type BuildStatus = (typeof buildStatuses)[number];

export const publishPackageFiles = [
  "PUBLISH_CHECKLIST.md",
  "GUMROAD_LISTING.md",
  "SOCIAL_LAUNCH_POSTS.md",
  "EMAIL_LAUNCH_COPY.md",
  "PRODUCT_ASSET_LIST.md",
  "FINAL_QA.md"
];

export type GeneratedProject = {
  slug: string;
  name: string;
  fileCount: number;
  lastModified: string;
  buildStatus: BuildStatus | null;
};

export type BuilderWorkspace = GeneratedProject;

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

function toolsConfigPath() {
  return path.join(repoRoot(), "config", "tools.json");
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

function isBuildStatus(value: string): value is BuildStatus {
  return buildStatuses.includes(value as BuildStatus);
}

function workspaceDirectory(slug: string) {
  return path.join(builderWorkspaceRoot(), slug);
}

function statusPath(slug: string) {
  return path.join(workspaceDirectory(slug), "BUILD_STATUS.md");
}

function runLogPath(slug: string) {
  return path.join(workspaceDirectory(slug), "RUN_LOG.md");
}

function publishPackageDirectory(slug: string) {
  return path.join(workspaceDirectory(slug), "publish-package");
}

export async function readBuildStatus(slug: string): Promise<BuildStatus | null> {
  const cleanSlug = safeSlug(slug);

  if (!cleanSlug || cleanSlug !== slug) {
    return null;
  }

  try {
    const content = await readFile(statusPath(cleanSlug), "utf8");
    const match = content.match(/^- Status: (.+)$/m);
    const status = match?.[1]?.trim();

    return status && isBuildStatus(status) ? status : null;
  } catch {
    return null;
  }
}

export async function readRunLog(slug: string) {
  const cleanSlug = safeSlug(slug);

  if (!cleanSlug || cleanSlug !== slug) {
    return "";
  }

  try {
    return await readFile(runLogPath(cleanSlug), "utf8");
  } catch {
    return "";
  }
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
        const buildStatus = await readBuildStatus(entry.name);

        return {
          slug: entry.name,
          name: projectNameFromSlug(entry.name),
          fileCount: markdownFiles.length,
          lastModified: stats.mtime.toISOString(),
          buildStatus
        };
      })
  );

  return projects.sort(
    (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
  );
}

export async function listBuilderWorkspaces(): Promise<BuilderWorkspace[]> {
  let entries;

  try {
    entries = await readdir(builderWorkspaceRoot(), { withFileTypes: true });
  } catch {
    return [];
  }

  const workspaces = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const workspaceDir = workspaceDirectory(entry.name);
        const files = await readdir(workspaceDir, { withFileTypes: true });
        const markdownFiles = files.filter((file) => file.isFile() && file.name.endsWith(".md"));
        const stats = await stat(workspaceDir);
        const buildStatus = await readBuildStatus(entry.name);

        return {
          slug: entry.name,
          name: projectNameFromSlug(entry.name),
          fileCount: markdownFiles.length,
          lastModified: stats.mtime.toISOString(),
          buildStatus
        };
      })
  );

  return workspaces.sort(
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

async function readProjectFile(projectDir: string, filename: string) {
  try {
    return await readFile(path.join(projectDir, filename), "utf8");
  } catch {
    return "";
  }
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
    const stats = await stat(workspaceDirectory(cleanSlug));

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

  const workspaceDir = workspaceDirectory(cleanSlug);

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

export async function readPublishPackage(slug: string): Promise<GeneratedProjectFile[] | null> {
  const cleanSlug = safeSlug(slug);

  if (!cleanSlug || cleanSlug !== slug) {
    return null;
  }

  const packageDir = publishPackageDirectory(cleanSlug);

  try {
    const stats = await stat(packageDir);

    if (!stats.isDirectory()) {
      return null;
    }
  } catch {
    return null;
  }

  return Promise.all(
    publishPackageFiles.map(async (filename) => {
      try {
        const content = await readFile(path.join(packageDir, filename), "utf8");

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
  const workspaceDir = workspaceDirectory(cleanSlug);

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

  const currentStatus = await readBuildStatus(cleanSlug);
  const statusFiles = await Promise.all([
    currentStatus ? Promise.resolve(statusPath(cleanSlug)) : updateBuildStatus(cleanSlug, "Draft"),
    addRunLogEntry(cleanSlug, "Builder workspace prepared. No builder commands have been run.")
  ]);

  return [...copiedFiles, ...generatedFiles, ...statusFiles];
}

type RegisteredTool = {
  name?: string;
  exactPath?: string;
  alternatePath?: string;
  runCommand?: string | null;
  installCommand?: string | null;
  status?: string;
};

async function readGptPilotTool() {
  try {
    const raw = await readFile(toolsConfigPath(), "utf8");
    const parsed = JSON.parse(raw) as { tools?: RegisteredTool[] };

    return parsed.tools?.find((tool) => tool.name === "gpt-pilot-main") || null;
  } catch {
    return null;
  }
}

export async function createBuilderCommands(slug: string) {
  const cleanSlug = safeSlug(slug);

  if (!cleanSlug || cleanSlug !== slug) {
    throw new Error("Invalid project slug.");
  }

  const workspaceDir = workspaceDirectory(cleanSlug);
  const stats = await stat(workspaceDir);

  if (!stats.isDirectory()) {
    throw new Error("Builder workspace folder does not exist.");
  }

  const gptPilot = await readGptPilotTool();
  const projectName = projectNameFromSlug(cleanSlug);
  const generatedAt = new Date().toISOString();
  const gptPilotPath = gptPilot?.exactPath || gptPilot?.alternatePath || "NOT REGISTERED";
  const runCommand = gptPilot?.runCommand || "No registered run command in config/tools.json.";
  const expectedOutputFolder = `products/${cleanSlug}/landing-app/`;
  const recommendedCommand =
    gptPilotPath === "NOT REGISTERED"
      ? "Register gpt-pilot-main in config/tools.json before running GPT-Pilot manually."
      : `cd /d "${gptPilotPath}"\n${runCommand}`;

  const content = `# Builder Commands: ${projectName}

Generated locally by EMOVEL Prompt Studio v1.6 on ${generatedAt}.

## Safety Warning

These commands are documentation only. Prompt Studio does not execute builder commands from the UI. Run commands manually in a terminal only after reviewing the prompt, output folder, credentials, and tool status.

## GPT-Pilot Path From config/tools.json

- Tool: \`${gptPilot?.name || "gpt-pilot-main"}\`
- Path: \`${gptPilotPath}\`
- Status: \`${gptPilot?.status || "UNKNOWN"}\`
- Registered run command: \`${runCommand}\`

## Recommended Command

\`\`\`bat
${recommendedCommand}
\`\`\`

After GPT-Pilot starts, paste the contents of:

\`\`\`text
projects/build-workspaces/${cleanSlug}/gpt-pilot-prompt.md
\`\`\`

## Manual Execution Steps

1. Open a normal terminal outside Prompt Studio.
2. Review \`projects/build-workspaces/${cleanSlug}/gpt-pilot-prompt.md\`.
3. Review \`projects/build-workspaces/${cleanSlug}/README_BUILD.md\`.
4. Change directory to the registered GPT-Pilot path.
5. Run the registered GPT-Pilot command manually.
6. Paste the GPT-Pilot prompt when the tool asks for the project brief.
7. Set or confirm the output folder before files are generated.
8. Run \`npm install\` in the generated app folder.
9. Run \`npm run build\` in the generated app folder.
10. Fix build errors before adding integrations.

## Expected Output Folder

\`\`\`text
${expectedOutputFolder}
\`\`\`

Keep generated app code out of EMOVEL-OS control-center folders unless you intentionally place it under a product app path.

## Troubleshooting Notes

- If GPT-Pilot cannot start, confirm the registered path exists.
- If Python dependencies are missing, inspect the GPT-Pilot README before installing anything.
- If the virtual environment is missing, reinstall GPT-Pilot dependencies in the external tool folder, not inside EMOVEL-OS.
- If an API key is requested, stop and decide which provider should be connected manually.
- If output is created in the wrong location, move or regenerate it before committing.
- If the generated app fails build, fix the app code before adding motion, APIs, database, payments, or automations.

## Do Not Automate Yet

- Do not run GPT-Pilot from Prompt Studio.
- Do not run shell commands from the browser UI.
- Do not store API keys in generated markdown files.
- Do not connect paid APIs until a human approves the integration.
`;

  const commandsPath = path.join(workspaceDir, "BUILDER_COMMANDS.md");
  await writeFile(commandsPath, content, "utf8");

  return commandsPath;
}

export async function updateBuildStatus(slug: string, status: BuildStatus) {
  const cleanSlug = safeSlug(slug);

  if (!cleanSlug || cleanSlug !== slug) {
    throw new Error("Invalid project slug.");
  }

  if (!isBuildStatus(status)) {
    throw new Error("Invalid build status.");
  }

  const workspaceDir = workspaceDirectory(cleanSlug);
  await mkdir(workspaceDir, { recursive: true });

  const projectName = projectNameFromSlug(cleanSlug);
  const updatedAt = new Date().toISOString();
  const content = `# Build Status: ${projectName}

- Status: ${status}
- Updated: ${updatedAt}

## Notes

This status is updated manually in Prompt Studio. No shell commands, builders, APIs, or database actions are executed by the UI.
`;

  const filePath = statusPath(cleanSlug);
  await writeFile(filePath, content, "utf8");

  return filePath;
}

export async function addRunLogEntry(slug: string, entry: string) {
  const cleanSlug = safeSlug(slug);
  const cleanedEntry = entry.trim();

  if (!cleanSlug || cleanSlug !== slug) {
    throw new Error("Invalid project slug.");
  }

  if (!cleanedEntry) {
    throw new Error("Run log entry cannot be empty.");
  }

  const workspaceDir = workspaceDirectory(cleanSlug);
  await mkdir(workspaceDir, { recursive: true });

  const existing = await readRunLog(cleanSlug);
  const projectName = projectNameFromSlug(cleanSlug);
  const timestamp = new Date().toISOString();
  const header = `# Run Log: ${projectName}

Manual notes only. Prompt Studio does not execute shell commands from this interface.
`;
  const nextEntry = `\n## ${timestamp}\n\n${cleanedEntry}\n`;
  const content = existing.trim() ? `${existing.trim()}\n${nextEntry}` : `${header}${nextEntry}`;
  const filePath = runLogPath(cleanSlug);

  await writeFile(filePath, content, "utf8");

  return filePath;
}

export async function createPublishPackage(slug: string) {
  const { cleanSlug, projectDir } = await projectDirectory(slug);
  const workspaceDir = workspaceDirectory(cleanSlug);
  const packageDir = publishPackageDirectory(cleanSlug);

  try {
    const workspaceStats = await stat(workspaceDir);

    if (!workspaceStats.isDirectory()) {
      throw new Error("Builder workspace folder does not exist.");
    }
  } catch {
    throw new Error("Builder workspace folder does not exist.");
  }

  await mkdir(packageDir, { recursive: true });

  const projectName = projectNameFromSlug(cleanSlug);
  const generatedAt = new Date().toISOString();
  const offer = await readProjectFile(projectDir, "offer.md");
  const copy = await readProjectFile(projectDir, "copy.md");
  const visualBrief = await readProjectFile(projectDir, "visual-brief.md");
  const launchPlan = await readProjectFile(projectDir, "launch-plan.md");
  const buildHandoff =
    (await readProjectFile(projectDir, "build-handoff.md")) ||
    (await readProjectFile(workspaceDir, "build-handoff.md"));

  const publishChecklist = `# Publish Checklist: ${projectName}

Generated locally by EMOVEL Prompt Studio v1.8 on ${generatedAt}.

## Readiness Gate

- [ ] Build status is Ready to Publish.
- [ ] Final app build has passed manually.
- [ ] Landing page copy matches the offer.
- [ ] Visual direction is consistent with the product positioning.
- [ ] Pricing and product access details are confirmed.
- [ ] Refund/support expectations are clear.
- [ ] Product delivery files are organized.
- [ ] Gumroad listing is reviewed manually before publishing.
- [ ] Social and email copy are reviewed manually before posting.

## Source Notes

${conciseSection(offer, `${projectName} needs a final offer review before publishing.`)}
`;

  const gumroadListing = `# Gumroad Listing: ${projectName}

## Product Name

${projectName}

## Short Description

${conciseSection(copy, "A premium product built from the EMOVEL production pipeline.")}

## Long Description

${sectionFromMarkdown(
  offer,
  "Use this product to move from raw idea to a launch-ready asset stack with clear offer, copy, design direction, and publishing materials."
)}

## What Buyers Get

- Product access or download package
- Launch assets
- Usage instructions
- Support/contact instructions

## Pricing Notes

Confirm pricing manually before publishing. No Gumroad API connection has been made.

## Visual Direction

${conciseSection(visualBrief, "Use premium, concrete product visuals and clear screenshots where available.")}
`;

  const socialLaunchPosts = `# Social Launch Posts: ${projectName}

## Post 1 - Launch

${projectName} is ready.

${conciseSection(copy, "A focused product for builders who want a clearer path from idea to launch.")}

## Post 2 - Problem

Most launches stall because the offer, page, visuals, and content plan are scattered.

${projectName} packages the launch work into a concrete system.

## Post 3 - Behind The Scenes

Built with the EMOVEL production pipeline:

- offer
- copy
- UX plan
- visual direction
- build handoff
- launch prep

## Post 4 - Final CTA

If you want the product, review the Gumroad listing and launch page once they are connected manually.
`;

  const emailLaunchCopy = `# Email Launch Copy: ${projectName}

## Subject Options

- ${projectName} is ready
- A cleaner way to launch your next product
- The launch stack is live

## Email

Hey,

${conciseSection(copy, "I built a focused product to help turn a raw idea into a launch-ready system.")}

Here is what it helps you prepare:

- a clear offer
- landing page copy
- UX and visual direction
- build handoff material
- launch content

${conciseSection(launchPlan, "The next step is to review the product page and publish manually when ready.")}

Talk soon.
`;

  const productAssetList = `# Product Asset List: ${projectName}

## Required Publish Assets

- [ ] Final landing page URL
- [ ] Gumroad product draft
- [ ] Product cover image
- [ ] Product screenshots
- [ ] Pricing details
- [ ] Download or access instructions
- [ ] Support/contact information
- [ ] Refund policy language
- [ ] Social launch posts
- [ ] Email launch copy

## Source Files Used

- projects/generated/${cleanSlug}/offer.md
- projects/generated/${cleanSlug}/copy.md
- projects/generated/${cleanSlug}/visual-brief.md
- projects/generated/${cleanSlug}/launch-plan.md
- projects/generated/${cleanSlug}/build-handoff.md

## Build Handoff Notes

${conciseSection(buildHandoff, "Confirm final build details manually before publishing.")}
`;

  const finalQa = `# Final QA: ${projectName}

## Product QA

- [ ] Offer is specific and non-generic.
- [ ] Product promise matches the deliverable.
- [ ] Pricing is visible and accurate.
- [ ] Checkout destination is correct.
- [ ] Delivery instructions are clear.

## Page QA

- [ ] Hero communicates the product clearly.
- [ ] CTA works.
- [ ] Mobile layout is readable.
- [ ] Final build was checked manually.
- [ ] No placeholder copy remains.

## Launch QA

- [ ] Gumroad listing reviewed manually.
- [ ] Social posts reviewed manually.
- [ ] Email copy reviewed manually.
- [ ] Product assets are complete.
- [ ] No API, Gumroad, or social posting automation has been triggered by Prompt Studio.
`;

  const files = {
    "PUBLISH_CHECKLIST.md": publishChecklist,
    "GUMROAD_LISTING.md": gumroadListing,
    "SOCIAL_LAUNCH_POSTS.md": socialLaunchPosts,
    "EMAIL_LAUNCH_COPY.md": emailLaunchCopy,
    "PRODUCT_ASSET_LIST.md": productAssetList,
    "FINAL_QA.md": finalQa
  };

  const written = await Promise.all(
    Object.entries(files).map(async ([filename, content]) => {
      const filePath = path.join(packageDir, filename);
      await writeFile(filePath, content, "utf8");

      return filePath;
    })
  );

  await addRunLogEntry(cleanSlug, "Publish package prepared locally. No Gumroad or social API calls were made.");

  return written;
}
