// EMOVEL Page Builder — read-only visual landing page renderer.
//
// Turns a PageBuilderDocument into a visual landing page (vs. PageBuilderPreview,
// which is the structured card/document view). This is the "Page Preview".
//
//   - read-only: no state, no events, no AI, no store, no server imports.
//   - FAQ uses the native <details>/<summary> accordion, so NO client hooks.
//   - tolerant: unknown/future section types render a discreet fallback, never
//     crash. implementation_notes is intentionally NOT shown in the page render
//     (it belongs to the structured preview / export).
//   - dependency-free: imports only pure types from the schema.

import type { CSSProperties, ReactNode } from "react";
import type {
  FaqSection,
  FinalCtaSection,
  FeatureSplitSection,
  FooterSection,
  HeroSection,
  LogoStripSection,
  MechanismSection,
  NavigationBarSection,
  OfferSection,
  PageBuilderDocument,
  PageBuilderSection,
  PricingSection,
  ProblemSection,
  ProofSection,
  ProductShowcaseCTA,
  ProductShowcaseSection,
  StatsBarSection,
  TestimonialsSection,
} from "../../lib/page-builder/schema";
import { SectionSurface } from "./SectionSurface";
import { MISSING_ASSET_LABEL } from "../../lib/page-builder/empty-state";
import { pageBuilderAssetUrl } from "../../lib/page-builder/asset-url";

type PageBuilderHtmlRendererProps = {
  document: PageBuilderDocument;
  // When provided, local "assets/<file>" srcs resolve to the live serve URL so
  // uploaded images render in the preview. External/empty srcs pass through.
  slug?: string;
};

type ResolveSrc = (src: string) => string;
const identitySrc: ResolveSrc = (src) => src;

type LooseSection = { type: string } & Record<string, unknown>;

function Section({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={`px-6 py-12 md:px-10 md:py-16 ${className ?? ""}`}>{children}</section>;
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 grid gap-2">
      {items.map((item, index) => (
        <li key={index} className="flex gap-2.5 text-base leading-7 text-white/70">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C7A45A]" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// Read-only CTA chip. Rendered as a non-interactive span to avoid navigation in
// the preview; styling communicates primary vs secondary.
function CtaChip({ label, primary, style }: { label: string; primary: boolean; style?: CSSProperties }) {
  return (
    <span
      role="button"
      aria-disabled="true"
      style={style}
      className={`inline-flex items-center rounded-xl px-5 py-3 text-sm font-semibold ${
        primary ? "bg-[#C7A45A] text-black" : "border border-white/20 text-white/80"
      }`}
    >
      {label}
    </span>
  );
}

function HeroBlock({ section }: { section: HeroSection }) {
  return (
    <Section className="text-center">
      <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-[#F4F4EF] md:text-6xl">
        {section.headline}
      </h1>
      {section.subheadline ? (
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/60">{section.subheadline}</p>
      ) : null}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <CtaChip label={section.primary_cta} primary />
        {section.secondary_cta ? <CtaChip label={section.secondary_cta} primary={false} /> : null}
      </div>
      {section.proof_line ? (
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-white/35">{section.proof_line}</p>
      ) : null}
    </Section>
  );
}

function ProblemBlock({ section }: { section: ProblemSection }) {
  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#F4F4EF] md:text-4xl">{section.title}</h2>
        <Bullets items={section.symptoms} />
        <p className="mt-6 text-base leading-7 text-white/55">{section.cost_of_inaction}</p>
      </div>
    </Section>
  );
}

function MechanismBlock({ section }: { section: MechanismSection }) {
  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#F4F4EF] md:text-4xl">{section.title}</h2>
        <p className="mt-4 text-base leading-7 text-white/70">{section.explanation}</p>
        <p className="mt-3 text-base leading-7 text-white/55">{section.why_it_works}</p>
        {section.difference_from_alternatives.length > 0 ? <Bullets items={section.difference_from_alternatives} /> : null}
      </div>
    </Section>
  );
}

function OfferBlock({ section }: { section: OfferSection }) {
  return (
    <Section>
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/[0.08] bg-white/[0.025] p-7">
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#F4F4EF]">{section.title}</h2>
        <Bullets items={section.deliverables} />
        <div className="mt-6 flex flex-wrap gap-6 font-mono text-xs uppercase tracking-[0.16em] text-white/40">
          <span>Format · {section.format}</span>
          <span>Timeline · {section.timeline}</span>
        </div>
      </div>
    </Section>
  );
}

function ProofBlock({ section }: { section: ProofSection }) {
  return (
    <Section>
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#C7A45A]">Proof</p>
          <Bullets items={section.proof_points} />
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#C7A45A]">Credibility</p>
          <Bullets items={section.credibility_signals} />
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#C7A45A]">Testimonials</p>
          <Bullets items={section.testimonial_placeholders} />
        </div>
      </div>
    </Section>
  );
}

function PricingBlock({ section }: { section: PricingSection }) {
  return (
    <Section>
      <div className="mx-auto grid max-w-3xl gap-4 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-7 md:grid-cols-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">Pilot</p>
          <p className="mt-1 text-2xl font-semibold text-[#F4F4EF]">{section.pilot_price}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">Premium upgrade</p>
          <p className="mt-1 text-2xl font-semibold text-[#F4F4EF]">{section.premium_upgrade}</p>
        </div>
        <p className="text-sm leading-6 text-white/55 md:col-span-2">{section.pricing_rationale}</p>
        <p className="text-sm leading-6 text-white/45 md:col-span-2">Risk reversal: {section.risk_reversal}</p>
      </div>
    </Section>
  );
}

function FaqBlock({ section }: { section: FaqSection }) {
  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#F4F4EF]">FAQ</h2>
        <div className="mt-5 grid gap-2">
          {section.items.map((item, index) => (
            <details key={index} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
              <summary className="cursor-pointer select-none text-base font-semibold text-[#F4F4EF]">
                {item.question}
              </summary>
              <p className="mt-2 text-sm leading-6 text-white/60">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}

function FinalCtaBlock({ section }: { section: FinalCtaSection }) {
  return (
    <Section className="text-center">
      <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-[-0.03em] text-[#F4F4EF] md:text-4xl">
        {section.headline}
      </h2>
      <div className="mt-6 flex justify-center">
        <CtaChip label={section.cta} primary />
      </div>
      {section.microcopy ? <p className="mt-4 text-xs text-white/40">{section.microcopy}</p> : null}
    </Section>
  );
}

function ProductShowcaseBlock({ section, resolveSrc }: { section: ProductShowcaseSection; resolveSrc: ResolveSrc }) {
  const theme = section.theme;
  const surface: CSSProperties = { background: theme.background, color: theme.foreground };
  const hasAsset = typeof section.productAsset?.src === "string" && section.productAsset.src.trim().length > 0;
  const fullbleed = section.layout === "fullbleed";

  const copy = (
    <div>
      {section.eyebrow ? (
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: theme.accent }}>
          {section.eyebrow}
        </p>
      ) : null}
      <p className="mt-1 text-xs uppercase tracking-[0.16em]" style={{ color: theme.muted }}>
        {section.productName}
      </p>
      <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] md:text-4xl">{section.headline}</h2>
      {section.subheadline ? (
        <p className="mt-3 text-base leading-7" style={{ color: theme.muted }}>
          {section.subheadline}
        </p>
      ) : null}
      {section.specText ? (
        <p className="mt-2 font-mono text-xs" style={{ color: theme.muted }}>
          {section.specText}
        </p>
      ) : null}
      {section.ctas.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {section.ctas.map((cta: ProductShowcaseCTA, index) => (
            <CtaChip
              key={index}
              label={cta.label}
              primary={cta.variant === "primary"}
              style={
                cta.variant === "primary"
                  ? { background: theme.accent, color: theme.background }
                  : { borderColor: theme.border, color: theme.foreground }
              }
            />
          ))}
        </div>
      ) : null}
    </div>
  );

  const media = (
    <div>
      {hasAsset ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolveSrc(section.productAsset.src)}
          alt={section.productAlt}
          className="w-full rounded-2xl border object-cover"
          style={{ borderColor: theme.border, aspectRatio: "4 / 3" }}
        />
      ) : (
        <div
          role="img"
          aria-label={`${MISSING_ASSET_LABEL}: ${section.productAlt}`}
          className="flex items-center justify-center rounded-2xl border border-dashed font-mono text-xs uppercase tracking-[0.18em]"
          style={{ background: theme.card, borderColor: theme.border, color: theme.muted, aspectRatio: "4 / 3" }}
        >
          {MISSING_ASSET_LABEL}
        </div>
      )}
      {section.features.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {section.features.map((feature, index) => (
            <div key={index} className="rounded-xl border p-4" style={{ borderColor: theme.border }}>
              <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: theme.muted }}>
                {feature.label}
              </p>
              <p className="mt-1 text-lg font-semibold">
                {feature.value}
                {feature.unit ? <span style={{ color: theme.muted }}> {feature.unit}</span> : null}
              </p>
              {feature.description ? (
                <p className="mt-1 text-xs leading-5" style={{ color: theme.muted }}>
                  {feature.description}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );

  return (
    <section style={surface} className="px-6 py-14 md:px-10 md:py-20">
      {fullbleed ? (
        <div className="mx-auto max-w-4xl">
          {copy}
          <div className="mt-8">{media}</div>
        </div>
      ) : (
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
          {copy}
          {media}
        </div>
      )}
    </section>
  );
}

function NavigationBarBlock({ section }: { section: NavigationBarSection }) {
  return (
    <Section>
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6">
        <span className="text-base font-semibold tracking-[-0.02em] text-[#F4F4EF]">{section.logo_label}</span>
        {section.links.length > 0 ? (
          <nav className="hidden items-center gap-7 md:flex">
            {section.links.map((link, index) => (
              <a
                key={index}
                href={`#${link.anchor}`}
                className="text-sm text-white/60 transition-colors hover:text-white/90"
              >
                {link.label}
              </a>
            ))}
          </nav>
        ) : null}
        {section.cta ? <CtaChip label={section.cta.label} primary /> : null}
      </div>
    </Section>
  );
}

function FooterBlock({ section }: { section: FooterSection }) {
  return (
    <Section>
      <div className="mx-auto max-w-5xl border-t border-white/[0.08] pt-10">
        {section.tagline ? (
          <p className="mb-8 max-w-md text-sm leading-6 text-white/50">{section.tagline}</p>
        ) : null}
        {section.link_groups.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            {section.link_groups.map((group, index) => (
              <div key={index}>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#C7A45A]">{group.heading}</p>
                <ul className="mt-3 grid gap-2">
                  {group.links.map((link, li) => (
                    <li key={li} className="text-sm text-white/55">
                      {link.label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}
        {section.legal ? (
          <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.14em] text-white/30">{section.legal}</p>
        ) : null}
      </div>
    </Section>
  );
}

function TestimonialsBlock({ section }: { section: TestimonialsSection }) {
  return (
    <Section>
      <div className="mx-auto max-w-4xl">
        {section.title ? (
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#F4F4EF]">{section.title}</h2>
        ) : null}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {section.items.map((item, index) => (
            <figure key={index} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
              <blockquote className="text-base leading-7 text-white/80">&ldquo;{item.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm text-white/50">
                <span className="font-semibold text-[#F4F4EF]">{item.author}</span>
                {item.role ? <span> · {item.role}</span> : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </Section>
  );
}

function LogoStripBlock({ section }: { section: LogoStripSection }) {
  return (
    <Section>
      <div className="mx-auto max-w-5xl text-center">
        {section.title ? (
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">{section.title}</p>
        ) : null}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {section.logos.map((logo, index) => (
            <span key={index} className="text-sm font-semibold tracking-[-0.01em] text-white/45">
              {logo.name}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}

function StatsBarBlock({ section }: { section: StatsBarSection }) {
  return (
    <Section>
      <div className="mx-auto max-w-4xl">
        {section.title ? (
          <h2 className="text-center text-2xl font-semibold tracking-[-0.03em] text-[#F4F4EF]">{section.title}</h2>
        ) : null}
        <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
          {section.stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl font-semibold text-[#C7A45A]">{stat.value}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/45">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function FeatureSplitBlock({ section }: { section: FeatureSplitSection }) {
  return (
    <Section>
      <div className="mx-auto max-w-4xl">
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#F4F4EF] md:text-4xl">{section.title}</h2>
        {section.description ? (
          <p className="mt-3 max-w-2xl text-base leading-7 text-white/60">{section.description}</p>
        ) : null}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {section.features.map((feature, index) => (
            <div key={index} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
              <p className="text-base font-semibold text-[#F4F4EF]">{feature.title}</p>
              {feature.description ? (
                <p className="mt-1 text-sm leading-6 text-white/55">{feature.description}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function UnknownBlock({ section }: { section: LooseSection }) {
  return (
    <Section>
      <div className="mx-auto max-w-3xl rounded-xl border border-dashed border-white/15 p-5 text-sm text-white/40">
        Section &ldquo;{section.type}&rdquo; has no visual renderer yet.
      </div>
    </Section>
  );
}

function renderSection(section: PageBuilderSection, index: number, resolveSrc: ResolveSrc): ReactNode {
  switch (section.type) {
    case "hero":
      return <HeroBlock key={index} section={section} />;
    case "problem":
      return <ProblemBlock key={index} section={section} />;
    case "mechanism":
      return <MechanismBlock key={index} section={section} />;
    case "offer":
      return <OfferBlock key={index} section={section} />;
    case "proof":
      return <ProofBlock key={index} section={section} />;
    case "pricing":
      return <PricingBlock key={index} section={section} />;
    case "faq":
      return <FaqBlock key={index} section={section} />;
    case "navigation_bar":
      return <NavigationBarBlock key={index} section={section} />;
    case "footer":
      return <FooterBlock key={index} section={section} />;
    case "final_cta":
      return <FinalCtaBlock key={index} section={section} />;
    case "testimonials":
      return <TestimonialsBlock key={index} section={section} />;
    case "logo_strip":
      return <LogoStripBlock key={index} section={section} />;
    case "stats_bar":
      return <StatsBarBlock key={index} section={section} />;
    case "feature_split":
      return <FeatureSplitBlock key={index} section={section} />;
    case "product_showcase":
      return <ProductShowcaseBlock key={index} section={section} resolveSrc={resolveSrc} />;
    case "implementation_notes":
      // Intentionally not rendered in the visual page (dev notes live in the
      // structured preview / export).
      return null;
    default:
      return <UnknownBlock key={index} section={section as unknown as LooseSection} />;
  }
}

export function PageBuilderHtmlRenderer({ document, slug }: PageBuilderHtmlRendererProps) {
  const sections = Array.isArray(document?.sections) ? document.sections : [];
  const resolveSrc: ResolveSrc = slug ? (src) => pageBuilderAssetUrl(slug, src) : identitySrc;

  return (
    <article
      aria-label={`${document.title} landing page preview`}
      className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#070707]"
    >
      {sections.map((section, index) => {
        const node = renderSection(section, index, resolveSrc);
        if (node === null) return null;
        // SectionSurface applies the Shared Layer (anchor id + surface + data
        // attributes) around each block without altering its internal layout.
        return (
          <SectionSurface key={index} shared={section.shared}>
            {node}
          </SectionSurface>
        );
      })}
    </article>
  );
}

export default PageBuilderHtmlRenderer;
