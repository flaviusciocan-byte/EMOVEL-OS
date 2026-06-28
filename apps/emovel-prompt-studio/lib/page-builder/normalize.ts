import { extractJsonObject } from "./json";
import {
  PAGE_BUILDER_SCHEMA_VERSION,
  type PageBuilderDocument,
  type PageBuilderSectionType,
  type SharedSectionProps,
} from "./schema";
import { defaultAnchorIdFor, resolveSectionSurface, slugifyAnchorId } from "./section-surface";
import { isKnownSectionType, sortSectionsByCanonicalOrder } from "./sections";
import { validatePageBuilderDocument, type ValidatePageBuilderDocumentResult } from "./validator";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Tolerant parse for AI output: strict JSON.parse first, then recover a JSON
// object from code fences / surrounding commentary via extractJsonObject.
function parseTolerant(raw: string): { ok: true; value: unknown } | { ok: false; errors: string[] } {
  try {
    return { ok: true, value: JSON.parse(raw) as unknown };
  } catch {
    const extracted = extractJsonObject(raw);
    if (!extracted.ok) {
      return { ok: false, errors: [`Invalid JSON string: could not locate a JSON object.`, ...extracted.errors] };
    }
    try {
      return { ok: true, value: JSON.parse(extracted.json) as unknown };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown JSON parse error";
      return { ok: false, errors: [`Invalid JSON string: ${message}`] };
    }
  }
}

function trimStrings(value: unknown): unknown {
  if (typeof value === "string") {
    return value.trim();
  }
  if (Array.isArray(value)) {
    return value.map(trimStrings);
  }
  if (isRecord(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, trimStrings(item)]));
  }
  return value;
}

// Fill the Shared Layer for every section: resolve enum defaults and derive a
// stable anchorId (de-duplicated per section type) when absent. Runs before
// validation so the normalized document always carries a valid, complete Shared
// Layer. Non-record / unknown-type sections are left untouched for the validator.
function deriveAnchorId(type: string, count: number, existing: string | null): string {
  if (existing) return existing;
  if (isKnownSectionType(type)) {
    return defaultAnchorIdFor(type as PageBuilderSectionType, count);
  }
  const base = slugifyAnchorId(type);
  return count > 1 ? `${base}-${count}` : base;
}

function normalizeSectionsShared(sections: unknown[]): unknown[] {
  const occurrences = new Map<string, number>();
  return sections.map((section) => {
    if (!isRecord(section) || typeof section.type !== "string") return section;
    const type = section.type;
    const count = (occurrences.get(type) ?? 0) + 1;
    occurrences.set(type, count);

    const existing = isRecord(section.shared) ? (section.shared as SharedSectionProps) : undefined;
    const resolved = resolveSectionSurface(existing);

    const shared: SharedSectionProps = {
      surface: resolved.surface,
      motion: resolved.motion,
      spacing: resolved.spacing,
      anchorId: deriveAnchorId(type, count, resolved.anchorId),
      aiLock: resolved.aiLock,
    };
    if (resolved.universe) shared.universe = resolved.universe;

    return { ...section, shared };
  });
}

export function normalizePageBuilderDocument(raw: unknown): ValidatePageBuilderDocumentResult {
  let parsed: unknown = raw;

  if (typeof raw === "string") {
    const result = parseTolerant(raw);
    if (!result.ok) {
      return { ok: false, errors: result.errors };
    }
    parsed = result.value;
  }

  // Root must be a JSON object — never an array or primitive.
  if (Array.isArray(parsed)) {
    return { ok: false, errors: ["Document root must be a JSON object, not an array."] };
  }

  let trimmed = trimStrings(parsed);

  // Default schema_version when absent so older/looser AI output still validates.
  if (isRecord(trimmed) && trimmed.schema_version === undefined) {
    trimmed = { ...trimmed, schema_version: PAGE_BUILDER_SCHEMA_VERSION };
  }

  // Fill the Shared Layer (defaults + derived anchorId) before validation.
  if (isRecord(trimmed) && Array.isArray(trimmed.sections)) {
    trimmed = { ...trimmed, sections: normalizeSectionsShared(trimmed.sections) };
  }

  const validated = validatePageBuilderDocument(trimmed);
  if (!validated.ok) {
    return validated;
  }

  const document: PageBuilderDocument = {
    ...validated.document,
    sections: sortSectionsByCanonicalOrder(validated.document.sections),
  };

  return { ok: true, document };
}
