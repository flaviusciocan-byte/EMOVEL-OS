import { pageBuilderDocumentToMarkdown } from "./export";
import { normalizePageBuilderDocument } from "./normalize";
import { evaluatePageBuilderReadiness, readinessToMarkdown } from "./readiness";
import type { ImplementationNotesSection, PageBuilderDocument } from "./schema";
import { assertPageBuilderExportable, pageBuilderDocumentToStaticExport } from "./static-export";
import { getPageBuilderDocument } from "./store";

export type PageBuilderExportFile = {
  path: string;
  content: string;
};

export type PageBuilderExportFragment =
  | { ok: true; found: true; files: PageBuilderExportFile[] }
  | { ok: true; found: false; files: [] };

function implementationNotesMarkdown(document: PageBuilderDocument) {
  const notes = document.sections.find(
    (section): section is ImplementationNotesSection => section.type === "implementation_notes",
  );

  if (!notes) {
    return [
      `# ${document.title} Implementation Notes`,
      "",
      "No implementation_notes section is present in this PageBuilderDocument.",
    ].join("\n");
  }

  return [
    `# ${document.title} Implementation Notes`,
    "",
    "## Component hierarchy",
    notes.components.length > 0 ? notes.components.map((item) => `- ${item}`).join("\n") : "- None",
    "",
    "## Required sections",
    notes.required_sections.length > 0 ? notes.required_sections.map((item) => `- ${item}`).join("\n") : "- None",
    "",
    "## Missing visual assets",
    notes.missing_visual_assets.length > 0
      ? notes.missing_visual_assets.map((item) => `- ${item}`).join("\n")
      : "- None",
    "",
    "## Acceptance checks",
    notes.acceptance_checks.length > 0 ? notes.acceptance_checks.map((item) => `- [ ] ${item}`).join("\n") : "- None",
  ].join("\n");
}

function summaryMarkdown(document: PageBuilderDocument) {
  return [
    `# ${document.title} Page Builder Summary`,
    "",
    `Page type: ${document.page_type}`,
    `Status: ${document.status}`,
    `Sections: ${document.sections.map((section) => section.type).join(" -> ")}`,
    document.brand_context?.slug ? `Brand slug: ${document.brand_context.slug}` : "",
    document.brand_context?.applied_mechanism ? `Applied mechanism: ${document.brand_context.applied_mechanism}` : "",
  ].filter(Boolean).join("\n");
}

export function pageBuilderDocumentToExportFragment(document: PageBuilderDocument): PageBuilderExportFragment {
  const normalized = normalizePageBuilderDocument(document);
  if (!normalized.ok) {
    return { ok: true, found: false, files: [] };
  }

  const cleanDocument = normalized.document;
  const readiness = readinessToMarkdown(evaluatePageBuilderReadiness(cleanDocument));
  const staticExport = pageBuilderDocumentToStaticExport(cleanDocument);
  return {
    ok: true,
    found: true,
    files: [
      {
        path: "page-builder/page-builder-document.json",
        content: JSON.stringify(cleanDocument, null, 2),
      },
      {
        path: "page-builder/landing-page-markdown.md",
        content: pageBuilderDocumentToMarkdown(cleanDocument),
      },
      {
        path: "page-builder/landing-page-implementation-notes.md",
        content: implementationNotesMarkdown(cleanDocument),
      },
      {
        path: "page-builder/page-builder-summary.md",
        content: summaryMarkdown(cleanDocument),
      },
      {
        path: "page-builder/page-builder-readiness.md",
        content: readiness,
      },
      {
        path: "page-builder/static/landing-page.html",
        content: staticExport.html,
      },
      {
        path: "page-builder/static/landing-page.css",
        content: staticExport.css,
      },
      {
        path: "page-builder/static/asset-manifest.json",
        content: JSON.stringify(staticExport.assetManifest, null, 2),
      },
    ],
  };
}

// Optional Page Builder export: missing or invalid documents never block the
// workspace builder-pack ZIP.
export async function getPageBuilderExportFragment(slug: string): Promise<PageBuilderExportFragment> {
  try {
    const document = await getPageBuilderDocument(slug);
    if (!document) {
      return { ok: true, found: false, files: [] };
    }
    return pageBuilderDocumentToExportFragment(document);
  } catch {
    return { ok: true, found: false, files: [] };
  }
}

// Strict export (Component Registry v1.1 empty-state policy).
// Unlike getPageBuilderExportFragment (the soft builder-pack path, which never
// blocks the workspace ZIP), this path FAILS EXPLICITLY when the document is
// invalid or required assets are missing. Use it for a real page export.
export type PageBuilderStrictExport =
  | { ok: true; files: PageBuilderExportFile[] }
  | { ok: false; errors: string[] };

export function pageBuilderDocumentToStrictExport(document: PageBuilderDocument): PageBuilderStrictExport {
  const normalized = normalizePageBuilderDocument(document);
  if (!normalized.ok) {
    return { ok: false, errors: normalized.errors };
  }
  const exportable = assertPageBuilderExportable(normalized.document);
  if (!exportable.ok) {
    return { ok: false, errors: exportable.errors };
  }
  const fragment = pageBuilderDocumentToExportFragment(normalized.document);
  return { ok: true, files: fragment.found ? fragment.files : [] };
}
