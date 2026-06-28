// EMOVEL Page Builder — read-only preview adapter.
//
// Renders a PageBuilderDocument using simple premium cards. This is a thin,
// tolerant ADAPTER LAYER, not a visual editor:
//   - read-only: never mutates the document, never calls AI, never persists.
//   - tolerant: any section without a dedicated renderer falls back to
//     GenericSectionCard; unknown/future section types never crash.
//   - dependency-free: imports only pure types + the section label map. It does
//     NOT import the server-only store or the page-builder index barrel.
//
// When a reusable visual component library (e.g. the external ui-ux-pro-max
// skill) is wired in later, swap the body of the relevant renderer — the
// contract (a PageBuilderDocument in, read-only React out) stays the same.

import type { CSSProperties, ReactNode } from "react";
import type {
  PageBuilderDocument,
  PageBuilderSection,
  ProductShowcaseSection,
} from "../../lib/page-builder/schema";
import { evaluatePageBuilderReadiness } from "../../lib/page-builder/readiness";
import { sectionLabels } from "../../lib/page-builder/sections";

type PageBuilderPreviewProps = {
  document: PageBuilderDocument;
  // Accepted for contract completeness; the raw markdown is surfaced separately
  // by the workspace (collapsible "View Markdown Export"), so it is not rendered
  // here.
  markdown?: string;
};

type LooseSection = { type: string } & Record<string, unknown>;

function labelFor(type: string): string {
  return (sectionLabels as Record<string, string>)[type] ?? type;
}

function humanizeKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^\w/, (c) => c.toUpperCase());
}

function Card({ eyebrow, title, children }: { eyebrow: string; title?: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#C7A45A]">{eyebrow}</p>
      {title ? <h4 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[#F4F4EF]">{title}</h4> : null}
      <div className="mt-3 grid gap-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">{label}</p>
      <div className="mt-1 text-sm leading-6 text-white/70">{children}</div>
    </div>
  );
}

function renderValue(value: unknown): ReactNode {
  if (value == null) return <span className="text-white/30">—</span>;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return <span>{String(value)}</span>;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-white/30">None</span>;
    // Array of FAQ-like { question, answer } objects.
    if (value.every((item) => item && typeof item === "object" && "question" in item && "answer" in item)) {
      return (
        <ul className="grid gap-2">
          {value.map((item, index) => {
            const entry = item as { question: unknown; answer: unknown };
            return (
              <li key={index} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                <p className="text-sm font-semibold text-[#F4F4EF]">{String(entry.question)}</p>
                <p className="mt-1 text-sm leading-6 text-white/60">{String(entry.answer)}</p>
              </li>
            );
          })}
        </ul>
      );
    }
    // Array of plain strings.
    if (value.every((item) => typeof item === "string")) {
      return (
        <ul className="grid gap-1.5">
          {(value as string[]).map((item, index) => (
            <li key={index} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#C7A45A]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }
    // Array of other objects — compact JSON.
    return (
      <ul className="grid gap-1.5">
        {value.map((item, index) => (
          <li key={index} className="font-mono text-xs text-white/55">{JSON.stringify(item)}</li>
        ))}
      </ul>
    );
  }
  // Nested object — compact JSON, never crash.
  return <span className="font-mono text-xs text-white/55">{JSON.stringify(value)}</span>;
}

// Fallback for any section without a dedicated renderer (and for unknown types).
function GenericSectionCard({ section }: { section: LooseSection }) {
  const entries = Object.entries(section).filter(([key]) => key !== "type");
  return (
    <Card eyebrow={labelFor(section.type)}>
      {entries.length === 0 ? (
        <p className="text-sm text-white/40">No fields.</p>
      ) : (
        entries.map(([key, value]) => (
          <Field key={key} label={humanizeKey(key)}>
            {renderValue(value)}
          </Field>
        ))
      )}
    </Card>
  );
}

// Dedicated, theme-driven renderer for the premium ProductShowcase section.
// Uses the section's OWN theme tokens (contract data) — no fabricated styling.
function ProductShowcaseCard({ section }: { section: ProductShowcaseSection }) {
  const theme = section.theme;
  const style: CSSProperties = {
    background: theme.background,
    color: theme.foreground,
    borderColor: theme.border,
  };
  const hasAsset = typeof section.productAsset?.src === "string" && section.productAsset.src.trim().length > 0;

  return (
    <div className="overflow-hidden rounded-2xl border" style={style}>
      <div className="grid gap-5 p-6 md:grid-cols-2 md:items-center">
        <div>
          {section.eyebrow ? (
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: theme.accent }}>
              {section.eyebrow}
            </p>
          ) : null}
          <p className="mt-1 text-xs uppercase tracking-[0.16em]" style={{ color: theme.muted }}>
            {section.productName} · {section.layout}
          </p>
          <h4 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">{section.headline}</h4>
          {section.subheadline ? (
            <p className="mt-2 text-sm leading-6" style={{ color: theme.muted }}>
              {section.subheadline}
            </p>
          ) : null}
          {section.specText ? (
            <p className="mt-2 font-mono text-xs" style={{ color: theme.muted }}>
              {section.specText}
            </p>
          ) : null}

          {section.ctas.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {section.ctas.map((cta, index) => {
                const primary = cta.variant === "primary";
                const ctaStyle: CSSProperties = primary
                  ? { background: theme.accent, color: theme.background }
                  : { borderColor: theme.border, color: theme.foreground };
                return (
                  <span
                    key={index}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${primary ? "" : "border"}`}
                    style={ctaStyle}
                  >
                    {cta.label}
                  </span>
                );
              })}
            </div>
          ) : null}
        </div>

        <div>
          <div
            className="flex aspect-[4/3] items-center justify-center rounded-xl border text-xs"
            style={{ background: theme.card, borderColor: theme.border, color: theme.muted }}
          >
            {hasAsset ? `Product asset · ${section.productAlt}` : "MISSING ASSET (draft)"}
          </div>
          {section.features.length > 0 ? (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {section.features.map((feature, index) => (
                <div key={index} className="rounded-lg border p-3" style={{ borderColor: theme.border }}>
                  <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: theme.muted }}>
                    {feature.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {feature.value}
                    {feature.unit ? <span style={{ color: theme.muted }}> {feature.unit}</span> : null}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SectionRenderer({ section }: { section: PageBuilderSection }) {
  switch (section.type) {
    case "product_showcase":
      return <ProductShowcaseCard section={section} />;
    // hero / problem / mechanism / offer / proof / pricing / faq / final_cta /
    // implementation_notes all use the simple premium card for now.
    default:
      return <GenericSectionCard section={section as unknown as LooseSection} />;
  }
}

export function PageBuilderPreview({ document }: PageBuilderPreviewProps) {
  const sections = Array.isArray(document?.sections) ? document.sections : [];
  const readiness = evaluatePageBuilderReadiness(document);
  const statusTone =
    readiness.status === "strong"
      ? "text-emerald-300"
      : readiness.status === "acceptable"
        ? "text-amber-300"
        : "text-red-300";

  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#C7A45A]">Landing Page</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#F4F4EF]">{document.title}</h3>
        <p className="mt-1 font-mono text-[11px] text-white/40">
          {document.page_type} · {document.status} · {sections.length} sections
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#C7A45A]">
              Readiness
            </p>
            <p className="mt-2 text-sm leading-6 text-white/58">{readiness.summary}</p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-black/20 px-3 py-2 text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">Score</p>
            <p className={`mt-1 text-lg font-semibold ${statusTone}`}>
              {readiness.overall_score}/10 {readiness.status}
            </p>
          </div>
        </div>
        {readiness.priority_fixes.length > 0 ? (
          <ul className="mt-4 grid gap-1.5">
            {readiness.priority_fixes.slice(0, 3).map((fix, index) => (
              <li key={`${fix}-${index}`} className="flex gap-2 text-sm leading-6 text-white/62">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#C7A45A]" />
                <span>{fix}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {sections.map((section, index) => (
        <SectionRenderer key={`${section.type}-${index}`} section={section} />
      ))}
    </div>
  );
}

export default PageBuilderPreview;
