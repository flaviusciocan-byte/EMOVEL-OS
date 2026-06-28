// SectionSurface — Shared Layer resolver (Component Registry v1.1).
//
// Pure TypeScript: no React, no DOM, no Puck. Turns the optional SharedSectionProps
// carried by every section (see schema.ts BaseSection) into a fully-defaulted,
// render-ready surface descriptor. The render layer (components/page-builder/
// SectionSurface.tsx) consumes resolveSectionSurface() to apply the anchor id,
// surface background and data attributes WITHOUT changing each block's own
// internal padding/visuals.
//
// EMOVEL identity is respected: noir/charcoal base, soft-gray structure. No
// purple, no playful colour. Surface backgrounds are kept neutral so sections
// stack cleanly over the page's noir canvas.

import type {
  PageBuilderSectionType,
  SectionMotionLevel,
  SectionSpacingScale,
  SectionSurfaceRole,
  SharedSectionProps,
} from "./schema";

// All Shared Layer fields resolved to concrete values. `universe` stays optional
// because it is brand-scoped and inherited from the page/Brand OS when absent.
export interface ResolvedSectionSurface {
  universe: string | null;
  surface: SectionSurfaceRole;
  motion: SectionMotionLevel;
  spacing: SectionSpacingScale;
  anchorId: string | null;
  aiLock: boolean;
}

// Neutral, brand-safe defaults. A section with no shared props renders exactly
// as before: base surface (transparent over the noir canvas), subtle motion,
// default rhythm, not AI-locked.
export const DEFAULT_SHARED_SECTION_PROPS: Required<Omit<SharedSectionProps, "universe" | "anchorId">> & {
  universe: null;
  anchorId: null;
} = {
  universe: null,
  surface: "base",
  motion: "subtle",
  spacing: "default",
  anchorId: null,
  aiLock: false,
};

const SURFACE_ROLES = new Set<SectionSurfaceRole>(["base", "raised", "inset", "contrast"]);
const MOTION_LEVELS = new Set<SectionMotionLevel>(["none", "subtle", "expressive"]);
const SPACING_SCALES = new Set<SectionSpacingScale>(["compact", "default", "spacious"]);

function asSurface(value: unknown): SectionSurfaceRole {
  return typeof value === "string" && SURFACE_ROLES.has(value as SectionSurfaceRole)
    ? (value as SectionSurfaceRole)
    : DEFAULT_SHARED_SECTION_PROPS.surface;
}

function asMotion(value: unknown): SectionMotionLevel {
  return typeof value === "string" && MOTION_LEVELS.has(value as SectionMotionLevel)
    ? (value as SectionMotionLevel)
    : DEFAULT_SHARED_SECTION_PROPS.motion;
}

function asSpacing(value: unknown): SectionSpacingScale {
  return typeof value === "string" && SPACING_SCALES.has(value as SectionSpacingScale)
    ? (value as SectionSpacingScale)
    : DEFAULT_SHARED_SECTION_PROPS.spacing;
}

function trimmedOrNull(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

// Resolve any (possibly undefined / partial / malformed) SharedSectionProps to a
// complete descriptor. Never throws; unknown values fall back to defaults.
export function resolveSectionSurface(shared?: SharedSectionProps | null): ResolvedSectionSurface {
  const s = shared ?? {};
  return {
    universe: trimmedOrNull(s.universe),
    surface: asSurface(s.surface),
    motion: asMotion(s.motion),
    spacing: asSpacing(s.spacing),
    anchorId: trimmedOrNull(s.anchorId),
    aiLock: s.aiLock === true,
  };
}

// ---------------------------------------------------------------------------
// anchorId derivation — stable, slug-safe, deterministic per (type, index).
// ---------------------------------------------------------------------------

export function slugifyAnchorId(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Default anchor for a section: its type, de-duplicated by 1-based occurrence
// (hero, problem, ..., product-showcase, product-showcase-2). implementation_notes
// is meta and never rendered, so it still gets an id but is harmless.
export function defaultAnchorIdFor(type: PageBuilderSectionType, occurrence: number): string {
  const base = slugifyAnchorId(type.replace(/_/g, "-"));
  return occurrence <= 1 ? base : `${base}-${occurrence}`;
}

// ---------------------------------------------------------------------------
// Render-layer bridge — class names + data attributes.
// Kept here (pure) so both the React renderer and any future static/HTML export
// share one mapping. Surface classes are background-only; they never add padding
// (each section block owns its own padding), so applying a surface cannot alter
// existing layout/spacing.
// ---------------------------------------------------------------------------

const SURFACE_BACKGROUND_CLASS: Record<SectionSurfaceRole, string> = {
  base: "",
  raised: "bg-white/[0.03]",
  inset: "bg-black/40",
  contrast: "bg-[#0d0d0d]",
};

export function sectionSurfaceClassName(resolved: ResolvedSectionSurface): string {
  const parts = ["scroll-mt-24"];
  const bg = SURFACE_BACKGROUND_CLASS[resolved.surface];
  if (bg) parts.push(bg);
  return parts.join(" ");
}

export function sectionSurfaceDataAttributes(
  resolved: ResolvedSectionSurface,
): Record<string, string> {
  const attrs: Record<string, string> = {
    "data-surface": resolved.surface,
    "data-motion": resolved.motion,
    "data-spacing": resolved.spacing,
  };
  if (resolved.universe) attrs["data-universe"] = resolved.universe;
  if (resolved.aiLock) attrs["data-ai-lock"] = "true";
  return attrs;
}
