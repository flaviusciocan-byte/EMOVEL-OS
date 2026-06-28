import Link from "next/link";
import type { ReactNode } from "react";
import { mechanisms } from "@/lib/brand-mechanism";

export type BrandContextMetadata = {
  hasBrandContext: boolean;
  fallback: boolean;
  fallbackReason?: "missing_profile" | "invalid_slug" | "context_error";
  appliedMechanism?: string;
  taskType?: string;
} | null;

type BrandContextBadgeProps = {
  brandContext: BrandContextMetadata;
  slug?: string;
};

// Mechanism display names, derived from lib/brand-mechanism (no duplicated data).
const mechanismLabels = Object.fromEntries(
  mechanisms.map((m) => [m.id, m.name]),
) as Record<string, string>;

function Shell({
  dotClass,
  borderClass,
  title,
  children,
}: {
  dotClass: string;
  borderClass: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className={`mt-4 rounded-2xl border ${borderClass} px-4 py-3`}>
      <div className="flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} aria-hidden="true" />
        <span className="text-sm font-semibold text-white/85">{title}</span>
      </div>
      {children ? <div className="mt-1 pl-3.5 text-xs leading-5 text-white/45">{children}</div> : null}
    </div>
  );
}

export function BrandContextBadge({ brandContext, slug }: BrandContextBadgeProps) {
  // Backward-compatible: old responses without brand metadata.
  if (brandContext === null) {
    return (
      <p className="mt-3 pl-1 text-[11px] text-white/30">Generated with default EMOVEL standards.</p>
    );
  }

  // A) Brand OS applied.
  if (brandContext.hasBrandContext) {
    const mechanism = brandContext.appliedMechanism
      ? mechanismLabels[brandContext.appliedMechanism] ?? brandContext.appliedMechanism
      : null;
    return (
      <Shell dotClass="bg-emerald-400" borderClass="border-emerald-400/20 bg-emerald-400/[0.05]" title="Brand OS applied">
        This output used the saved Brand Mechanism Profile.
        {mechanism ? <span className="block text-white/55">Mechanism: {mechanism}</span> : null}
      </Shell>
    );
  }

  // B–D) Neutral EMOVEL mode (fallback). Normal fallbacks are calm/neutral;
  // only context_error uses a subtle amber accent.
  if (brandContext.fallback) {
    if (brandContext.fallbackReason === "missing_profile") {
      return (
        <Shell dotClass="bg-white/40" borderClass="border-white/[0.08] bg-white/[0.03]" title="Neutral EMOVEL mode">
          No Brand Mechanism Profile was found. Run the audit to make future outputs brand-aware.
          {slug ? (
            <Link href={`/brand-os/${slug}/audit`} className="mt-1 inline-block font-semibold text-white/70 underline-offset-2 hover:underline">
              Run Brand Audit
            </Link>
          ) : null}
        </Shell>
      );
    }
    if (brandContext.fallbackReason === "invalid_slug") {
      return (
        <Shell dotClass="bg-white/40" borderClass="border-white/[0.08] bg-white/[0.03]" title="Neutral EMOVEL mode">
          Brand context could not be loaded for this workspace.
        </Shell>
      );
    }
    if (brandContext.fallbackReason === "context_error") {
      return (
        <Shell dotClass="bg-amber-400" borderClass="border-amber-400/20 bg-amber-400/[0.05]" title="Neutral EMOVEL mode">
          Brand context was temporarily unavailable. Generation continued safely.
        </Shell>
      );
    }
    return (
      <Shell dotClass="bg-white/40" borderClass="border-white/[0.08] bg-white/[0.03]" title="Neutral EMOVEL mode">
        Generated with default EMOVEL standards.
      </Shell>
    );
  }

  return null;
}
