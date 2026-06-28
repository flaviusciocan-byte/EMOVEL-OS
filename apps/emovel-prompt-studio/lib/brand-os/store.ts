// EMOVEL Brand OS — persistence layer for the brand mechanism profile.
// Follows the existing EMOVEL OS convention (see lib/projects.ts): file-based,
// server-side persistence under a sibling root inside `projects/`. Brand OS gets
// its own root `projects/brand-os/<slug>.json`, so it never pollutes the
// generated-projects list while reusing the same repoRoot + safeSlug helpers.

import { mkdir, readFile, readdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { generatedRoot, safeSlug } from "../projects";
import {
  MODULE_ID,
  MODULE_VERSION,
  type BrandMechanismProfile,
  type BrandOsEnvelope,
} from "../brand-mechanism";

export type BrandOsRecord = {
  slug: string;
  module_id: typeof MODULE_ID;
  module_version: typeof MODULE_VERSION;
  saved_at: string;
  updated_at: string;
  brand_os: { brand_mechanism_profile: BrandMechanismProfile };
};

/** projects/brand-os — sibling of projects/generated and projects/build-workspaces. */
export function brandOsRoot() {
  return path.join(generatedRoot(), "..", "brand-os");
}

function cleanSlugOrThrow(slug: string): string {
  const clean = safeSlug(slug);
  if (!clean || clean !== slug) {
    throw new Error(`Invalid brand slug: ${slug}`);
  }
  return clean;
}

export function brandOsPath(slug: string) {
  return path.join(brandOsRoot(), `${cleanSlugOrThrow(slug)}.json`);
}

/** Read the full stored record (with metadata), or null if none exists. */
export async function getBrandOsRecord(slug: string): Promise<BrandOsRecord | null> {
  const clean = cleanSlugOrThrow(slug);
  try {
    const raw = await readFile(brandOsPath(clean), "utf8");
    return JSON.parse(raw) as BrandOsRecord;
  } catch {
    return null;
  }
}

/** Read just the strategic profile (the brand's DNA), or null. */
export async function getBrandMechanismProfile(
  slug: string,
): Promise<BrandMechanismProfile | null> {
  const record = await getBrandOsRecord(slug);
  return record?.brand_os.brand_mechanism_profile ?? null;
}

/** Read the profile wrapped in the canonical brand_os envelope, or null. */
export async function getBrandOsEnvelope(slug: string): Promise<BrandOsEnvelope | null> {
  const record = await getBrandOsRecord(slug);
  return record ? { brand_os: record.brand_os } : null;
}

export async function hasBrandMechanismProfile(slug: string): Promise<boolean> {
  return (await getBrandOsRecord(slug)) !== null;
}

/** Save (create or overwrite) the profile. Preserves original saved_at on resave. */
export async function saveBrandMechanismProfile(
  slug: string,
  profile: BrandMechanismProfile,
): Promise<BrandOsRecord> {
  const clean = cleanSlugOrThrow(slug);
  await mkdir(brandOsRoot(), { recursive: true });

  const now = new Date().toISOString();
  const existing = await getBrandOsRecord(clean);

  const record: BrandOsRecord = {
    slug: clean,
    module_id: MODULE_ID,
    module_version: MODULE_VERSION,
    saved_at: existing?.saved_at ?? now,
    updated_at: now,
    brand_os: { brand_mechanism_profile: profile },
  };

  await writeFile(brandOsPath(clean), `${JSON.stringify(record, null, 2)}\n`, "utf8");
  return record;
}

/** Patch an existing profile (shallow merge). Throws if none exists yet. */
export async function updateBrandMechanismProfile(
  slug: string,
  patch: Partial<BrandMechanismProfile>,
): Promise<BrandMechanismProfile> {
  const existing = await getBrandMechanismProfile(slug);
  if (!existing) {
    throw new Error(`No brand mechanism profile to update for slug: ${slug}`);
  }
  const merged: BrandMechanismProfile = { ...existing, ...patch };
  const record = await saveBrandMechanismProfile(slug, merged);
  return record.brand_os.brand_mechanism_profile;
}

/** Delete the stored profile. Returns true if a file was removed. */
export async function clearBrandMechanismProfile(slug: string): Promise<boolean> {
  const clean = cleanSlugOrThrow(slug);
  try {
    await unlink(brandOsPath(clean));
    return true;
  } catch {
    return false;
  }
}

/** List slugs that currently have a stored brand profile. */
export async function listBrandProfiles(): Promise<string[]> {
  try {
    const entries = await readdir(brandOsRoot(), { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && e.name.endsWith(".json"))
      .map((e) => e.name.replace(/\.json$/, ""))
      .sort();
  } catch {
    return [];
  }
}
