// SectionSurface — render-layer wrapper for the Shared Layer (Registry v1.1).
//
// Wraps each rendered section to apply the Shared Layer without touching the
// block's own internal layout: it sets the in-page anchor id, a background
// surface role, and data attributes (surface/motion/spacing/universe/aiLock).
// Surface classes are background-only (see sectionSurfaceClassName) so wrapping
// a section can never change its existing padding or visual rhythm.
//
// Read-only: no state, no events. Pure presentational wrapper.

import type { ReactNode } from "react";
import type { SharedSectionProps } from "../../lib/page-builder/schema";
import {
  resolveSectionSurface,
  sectionSurfaceClassName,
  sectionSurfaceDataAttributes,
} from "../../lib/page-builder/section-surface";

type SectionSurfaceProps = {
  shared?: SharedSectionProps;
  children: ReactNode;
};

export function SectionSurface({ shared, children }: SectionSurfaceProps) {
  const resolved = resolveSectionSurface(shared);
  return (
    <div
      id={resolved.anchorId ?? undefined}
      className={sectionSurfaceClassName(resolved)}
      {...sectionSurfaceDataAttributes(resolved)}
    >
      {children}
    </div>
  );
}

export default SectionSurface;
