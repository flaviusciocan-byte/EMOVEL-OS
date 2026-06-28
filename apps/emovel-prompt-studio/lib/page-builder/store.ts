// EMOVEL Page Builder Core — persistence layer for generated landing pages.
// Mirrors the existing EMOVEL convention (see lib/brand-os/store.ts): file-based,
// server-side persistence under a sibling root inside `projects/`. Page Builder
// gets its own root `projects/page-builder/<slug>.json`, so it never pollutes
// the generated-projects list while reusing the same generatedRoot + safeSlug
// helpers. No new dependencies.

import { mkdir, readFile, readdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { generatedRoot, safeSlug } from "../projects";
import { pageBuilderDocumentToMarkdown } from "./export";
import { normalizePageBuilderDocument } from "./normalize";
import type { PageBuilderDocument } from "./schema";

export const PAGE_BUILDER_MODULE_ID = "page_builder" as const;
export const PAGE_BUILDER_MODULE_VERSION = "1.0.0" as const;

export type PageBuilderRecord = {
  slug: string;
  module_id: typeof PAGE_BUILDER_MODULE_ID;
  module_version: typeof PAGE_BUILDER_MODULE_VERSION;
  saved_at: string;
  updated_at: string;
  document: PageBuilderDocument;
};

export type SavePageBuilderFromRawResult =
  | { ok: false; errors: string[] }
  | { ok: true; record: PageBuilderRecord; document: PageBuilderDocument; markdown: string };

/** projects/page-builder — sibling of projects/generated and projects/brand-os. */
export function pageBuilderRoot() {
  return path.join(generatedRoot(), "..", "page-builder");
}

function cleanSlugOrThrow(slug: string): string {
  const clean = safeSlug(slug);
  if (!clean || clean !== slug) {
    throw new Error(`Invalid page builder slug: ${slug}`);
  }
  return clean;
}

export function pageBuilderPath(slug: string) {
  return path.join(pageBuilderRoot(), `${cleanSlugOrThrow(slug)}.json`);
}

/** Read the full stored record (with metadata), or null if none exists. */
export async function getPageBuilderRecord(slug: string): Promise<PageBuilderRecord | null> {
  const clean = cleanSlugOrThrow(slug);
  try {
    const raw = await readFile(pageBuilderPath(clean), "utf8");
    return JSON.parse(raw) as PageBuilderRecord;
  } catch {
    return null;
  }
}

/** Read just the stored PageBuilderDocument, or null. */
export async function getPageBuilderDocument(slug: string): Promise<PageBuilderDocument | null> {
  const record = await getPageBuilderRecord(slug);
  return record?.document ?? null;
}

export async function hasPageBuilderDocument(slug: string): Promise<boolean> {
  return (await getPageBuilderRecord(slug)) !== null;
}

/**
 * Save (create or overwrite) a PageBuilderDocument. Preserves original saved_at
 * on resave. Expects an already-valid document — use saveValidatedPageBuilderDocument
 * when persisting untrusted/AI output.
 */
export async function savePageBuilderDocument(
  slug: string,
  document: PageBuilderDocument,
): Promise<PageBuilderRecord> {
  const clean = cleanSlugOrThrow(slug);
  await mkdir(pageBuilderRoot(), { recursive: true });

  const now = new Date().toISOString();
  const existing = await getPageBuilderRecord(clean);

  const record: PageBuilderRecord = {
    slug: clean,
    module_id: PAGE_BUILDER_MODULE_ID,
    module_version: PAGE_BUILDER_MODULE_VERSION,
    saved_at: existing?.saved_at ?? now,
    updated_at: now,
    document,
  };

  await writeFile(pageBuilderPath(clean), `${JSON.stringify(record, null, 2)}\n`, "utf8");
  return record;
}

/**
 * Validate untrusted input (e.g. raw AI text or an object) and persist ONLY if
 * it is a valid PageBuilderDocument. Invalid input is never written — the
 * validator errors are returned instead. Also returns the markdown preview on
 * success. This is the safe entry point for AI output.
 */
export async function saveValidatedPageBuilderDocument(
  slug: string,
  raw: unknown,
): Promise<SavePageBuilderFromRawResult> {
  // Surface an invalid slug as a clear error rather than throwing.
  let clean: string;
  try {
    clean = cleanSlugOrThrow(slug);
  } catch (err) {
    return { ok: false, errors: [err instanceof Error ? err.message : `Invalid page builder slug: ${slug}`] };
  }

  const normalized = normalizePageBuilderDocument(raw);
  if (!normalized.ok) {
    return { ok: false, errors: normalized.errors };
  }

  const record = await savePageBuilderDocument(clean, normalized.document);
  return {
    ok: true,
    record,
    document: normalized.document,
    markdown: pageBuilderDocumentToMarkdown(normalized.document),
  };
}

/** Delete the stored document. Returns true if a file was removed. */
export async function clearPageBuilderDocument(slug: string): Promise<boolean> {
  const clean = cleanSlugOrThrow(slug);
  try {
    await unlink(pageBuilderPath(clean));
    return true;
  } catch {
    return false;
  }
}

/** List slugs that currently have a stored landing page document. */
export async function listPageBuilderDocuments(): Promise<string[]> {
  try {
    const entries = await readdir(pageBuilderRoot(), { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
      .map((entry) => entry.name.replace(/\.json$/, ""))
      .sort();
  } catch {
    return [];
  }
}
