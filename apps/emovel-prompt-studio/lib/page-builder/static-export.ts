// EMOVEL Page Builder Core — deterministic static HTML/CSS export.
//
// Turns a PageBuilderDocument into a self-contained static landing page:
//   - read-only, deterministic (same input -> same output).
//   - no React, no scripts, no inline JS, no external/CDN dependencies.
//   - HTML links a sibling landing-page.css; text content is HTML-escaped.
//   - never invents assets: missing visual assets are reported in the manifest.
//   - implementation_notes is NOT rendered in the page (it lives in markdown/export).

import type {
  FaqSection,
  FinalCtaSection,
  HeroSection,
  MechanismSection,
  OfferSection,
  FooterSection,
  NavigationBarSection,
  PageBuilderDocument,
  PageBuilderSection,
  PricingSection,
  ProblemSection,
  ProofSection,
  ProductShowcaseSection,
  StatsBarSection,
  TestimonialsSection,
  LogoStripSection,
  FeatureSplitSection,
} from "./schema";
import { MISSING_ASSET_LABEL } from "./empty-state";

export type AssetManifestRequired = { path: string; type: string; alt?: string; section: string };
export type AssetManifestMissing = { field: string; section: string; reason: string };
export type AssetManifestOptional = { path: string; type: string; section: string };

export type PageBuilderAssetManifest = {
  required: AssetManifestRequired[];
  missing: AssetManifestMissing[];
  optional: AssetManifestOptional[];
};

export type PageBuilderStaticExport = {
  html: string;
  css: string;
  assetManifest: PageBuilderAssetManifest;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeHtml(value: unknown): string {
  const str = typeof value === "string" ? value : String(value ?? "");
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function hasText(value: string | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function liList(items: string[]): string {
  if (items.length === 0) return "";
  return `<ul class="pb-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function ctaChip(label: string, primary: boolean, style?: string): string {
  const cls = primary ? "pb-button pb-button-primary" : "pb-button pb-button-secondary";
  const styleAttr = style ? ` style="${style}"` : "";
  return `<span class="${cls}" role="button" aria-disabled="true"${styleAttr}>${escapeHtml(label)}</span>`;
}

// ---------------------------------------------------------------------------
// Section -> HTML
// ---------------------------------------------------------------------------

function heroHtml(section: HeroSection): string {
  return [
    `<section class="pb-section pb-hero">`,
    `<h1 class="pb-hero-headline">${escapeHtml(section.headline)}</h1>`,
    section.subheadline ? `<p class="pb-hero-subheadline">${escapeHtml(section.subheadline)}</p>` : "",
    `<div class="pb-cta-row">`,
    ctaChip(section.primary_cta, true),
    section.secondary_cta ? ctaChip(section.secondary_cta, false) : "",
    `</div>`,
    section.proof_line ? `<p class="pb-proof-line">${escapeHtml(section.proof_line)}</p>` : "",
    `</section>`,
  ].join("");
}

function problemHtml(section: ProblemSection): string {
  return [
    `<section class="pb-section pb-problem">`,
    `<h2 class="pb-h2">${escapeHtml(section.title)}</h2>`,
    liList(section.symptoms),
    `<p class="pb-muted">${escapeHtml(section.cost_of_inaction)}</p>`,
    `</section>`,
  ].join("");
}

function mechanismHtml(section: MechanismSection): string {
  return [
    `<section class="pb-section pb-mechanism">`,
    `<h2 class="pb-h2">${escapeHtml(section.title)}</h2>`,
    `<p>${escapeHtml(section.explanation)}</p>`,
    `<p class="pb-muted">${escapeHtml(section.why_it_works)}</p>`,
    liList(section.difference_from_alternatives),
    `</section>`,
  ].join("");
}

function offerHtml(section: OfferSection): string {
  return [
    `<section class="pb-section pb-offer">`,
    `<div class="pb-card">`,
    `<h2 class="pb-h2">${escapeHtml(section.title)}</h2>`,
    liList(section.deliverables),
    `<p class="pb-meta">Format · ${escapeHtml(section.format)} &nbsp;·&nbsp; Timeline · ${escapeHtml(section.timeline)}</p>`,
    `</div>`,
    `</section>`,
  ].join("");
}

function proofHtml(section: ProofSection): string {
  return [
    `<section class="pb-section pb-proof">`,
    `<div class="pb-grid-3">`,
    `<div class="pb-card"><p class="pb-eyebrow">Proof</p>${liList(section.proof_points)}</div>`,
    `<div class="pb-card"><p class="pb-eyebrow">Credibility</p>${liList(section.credibility_signals)}</div>`,
    `<div class="pb-card"><p class="pb-eyebrow">Testimonials</p>${liList(section.testimonial_placeholders)}</div>`,
    `</div>`,
    `</section>`,
  ].join("");
}

function pricingHtml(section: PricingSection): string {
  return [
    `<section class="pb-section pb-pricing">`,
    `<div class="pb-card pb-grid-2">`,
    `<div><p class="pb-eyebrow">Pilot</p><p class="pb-price">${escapeHtml(section.pilot_price)}</p></div>`,
    `<div><p class="pb-eyebrow">Premium upgrade</p><p class="pb-price">${escapeHtml(section.premium_upgrade)}</p></div>`,
    `<p class="pb-muted pb-span-2">${escapeHtml(section.pricing_rationale)}</p>`,
    `<p class="pb-muted pb-span-2">Risk reversal: ${escapeHtml(section.risk_reversal)}</p>`,
    `</div>`,
    `</section>`,
  ].join("");
}

function faqHtml(section: FaqSection): string {
  const items = section.items
    .map(
      (item) =>
        `<details class="pb-faq-item"><summary>${escapeHtml(item.question)}</summary><p>${escapeHtml(item.answer)}</p></details>`,
    )
    .join("");
  return [`<section class="pb-section pb-faq">`, `<h2 class="pb-h2">FAQ</h2>`, items, `</section>`].join("");
}

function finalCtaHtml(section: FinalCtaSection): string {
  return [
    `<section class="pb-section pb-final-cta">`,
    `<h2 class="pb-h2">${escapeHtml(section.headline)}</h2>`,
    `<div class="pb-cta-row">${ctaChip(section.cta, true)}</div>`,
    section.microcopy ? `<p class="pb-microcopy">${escapeHtml(section.microcopy)}</p>` : "",
    `</section>`,
  ].join("");
}

function productShowcaseHtml(section: ProductShowcaseSection): string {
  const theme = section.theme;
  const sectionStyle = `background:${escapeHtml(theme.background)};color:${escapeHtml(theme.foreground)}`;
  const hasAsset = hasText(section.productAsset?.src);

  const media = hasAsset
    ? `<img class="pb-showcase-asset" src="${escapeHtml(section.productAsset.src)}" alt="${escapeHtml(section.productAlt)}" />`
    : `<div class="pb-showcase-placeholder" role="img" aria-label="${escapeHtml(MISSING_ASSET_LABEL)}: ${escapeHtml(section.productAlt)}" style="border-color:${escapeHtml(theme.border)};background:${escapeHtml(theme.card)};color:${escapeHtml(theme.muted)}">${escapeHtml(MISSING_ASSET_LABEL)}</div>`;

  const features =
    section.features.length > 0
      ? `<div class="pb-grid-2 pb-showcase-features">${section.features
          .map(
            (feature) =>
              `<div class="pb-card" style="border-color:${escapeHtml(theme.border)}"><p class="pb-eyebrow" style="color:${escapeHtml(theme.muted)}">${escapeHtml(feature.label)}</p><p class="pb-feature-value">${escapeHtml(feature.value)}${feature.unit ? ` <span style="color:${escapeHtml(theme.muted)}">${escapeHtml(feature.unit)}</span>` : ""}</p>${feature.description ? `<p class="pb-muted">${escapeHtml(feature.description)}</p>` : ""}</div>`,
          )
          .join("")}</div>`
      : "";

  const ctas =
    section.ctas.length > 0
      ? `<div class="pb-cta-row">${section.ctas
          .map((cta) =>
            ctaChip(
              cta.label,
              cta.variant === "primary",
              cta.variant === "primary"
                ? `background:${escapeHtml(theme.accent)};color:${escapeHtml(theme.background)}`
                : `border-color:${escapeHtml(theme.border)};color:${escapeHtml(theme.foreground)}`,
            ),
          )
          .join("")}</div>`
      : "";

  const copy = [
    section.eyebrow ? `<p class="pb-eyebrow" style="color:${escapeHtml(theme.accent)}">${escapeHtml(section.eyebrow)}</p>` : "",
    `<p class="pb-showcase-product" style="color:${escapeHtml(theme.muted)}">${escapeHtml(section.productName)}</p>`,
    `<h2 class="pb-h2">${escapeHtml(section.headline)}</h2>`,
    section.subheadline ? `<p style="color:${escapeHtml(theme.muted)}">${escapeHtml(section.subheadline)}</p>` : "",
    section.specText ? `<p class="pb-mono" style="color:${escapeHtml(theme.muted)}">${escapeHtml(section.specText)}</p>` : "",
    ctas,
  ].join("");

  const inner =
    section.layout === "fullbleed"
      ? `<div class="pb-showcase-fullbleed">${copy}<div class="pb-showcase-media">${media}${features}</div></div>`
      : `<div class="pb-showcase-split"><div>${copy}</div><div class="pb-showcase-media">${media}${features}</div></div>`;

  return `<section class="pb-section pb-showcase" style="${sectionStyle}">${inner}</section>`;
}

function testimonialsHtml(section: TestimonialsSection): string {
  const items = section.items
    .map(
      (item) =>
        `<figure class="pb-card pb-testimonial"><blockquote>${escapeHtml(item.quote)}</blockquote><figcaption>${escapeHtml(item.author)}${item.role ? ` · ${escapeHtml(item.role)}` : ""}</figcaption></figure>`,
    )
    .join("");
  return [
    `<section class="pb-section pb-testimonials">`,
    section.title ? `<h2 class="pb-h2">${escapeHtml(section.title)}</h2>` : "",
    `<div class="pb-grid-2">${items}</div>`,
    `</section>`,
  ].join("");
}

function logoStripHtml(section: LogoStripSection): string {
  const logos = section.logos.map((logo) => `<span class="pb-logo">${escapeHtml(logo.name)}</span>`).join("");
  return [
    `<section class="pb-section pb-logo-strip">`,
    section.title ? `<p class="pb-eyebrow pb-center">${escapeHtml(section.title)}</p>` : "",
    `<div class="pb-logo-row">${logos}</div>`,
    `</section>`,
  ].join("");
}

function statsBarHtml(section: StatsBarSection): string {
  const stats = section.stats
    .map(
      (stat) =>
        `<div class="pb-stat"><p class="pb-stat-value">${escapeHtml(stat.value)}</p><p class="pb-stat-label">${escapeHtml(stat.label)}</p></div>`,
    )
    .join("");
  return [
    `<section class="pb-section pb-stats-bar">`,
    section.title ? `<h2 class="pb-h2 pb-center">${escapeHtml(section.title)}</h2>` : "",
    `<div class="pb-stat-row">${stats}</div>`,
    `</section>`,
  ].join("");
}

function featureSplitHtml(section: FeatureSplitSection): string {
  const features = section.features
    .map(
      (feature) =>
        `<div class="pb-card"><p class="pb-feature-title">${escapeHtml(feature.title)}</p>${feature.description ? `<p class="pb-muted">${escapeHtml(feature.description)}</p>` : ""}</div>`,
    )
    .join("");
  return [
    `<section class="pb-section pb-feature-split">`,
    `<h2 class="pb-h2">${escapeHtml(section.title)}</h2>`,
    section.description ? `<p class="pb-muted">${escapeHtml(section.description)}</p>` : "",
    `<div class="pb-grid-2">${features}</div>`,
    `</section>`,
  ].join("");
}

function navigationBarHtml(section: NavigationBarSection): string {
  const links = section.links
    .map((link) => `<a class="pb-nav-link" href="#${escapeHtml(link.anchor)}">${escapeHtml(link.label)}</a>`)
    .join("");
  return [
    `<section class="pb-section pb-nav">`,
    `<div class="pb-nav-row">`,
    `<span class="pb-nav-logo">${escapeHtml(section.logo_label)}</span>`,
    links ? `<nav class="pb-nav-links">${links}</nav>` : "",
    section.cta ? ctaChip(section.cta.label, true) : "",
    `</div>`,
    `</section>`,
  ].join("");
}

function footerHtml(section: FooterSection): string {
  const groups = section.link_groups
    .map(
      (group) =>
        `<div class="pb-footer-group"><p class="pb-eyebrow">${escapeHtml(group.heading)}</p>${liList(group.links.map((link) => link.label))}</div>`,
    )
    .join("");
  return [
    `<section class="pb-section pb-footer">`,
    section.tagline ? `<p class="pb-muted">${escapeHtml(section.tagline)}</p>` : "",
    groups ? `<div class="pb-footer-groups">${groups}</div>` : "",
    section.legal ? `<p class="pb-footer-legal">${escapeHtml(section.legal)}</p>` : "",
    `</section>`,
  ].join("");
}

function sectionToHtml(section: PageBuilderSection): string {
  switch (section.type) {
    case "hero":
      return heroHtml(section);
    case "problem":
      return problemHtml(section);
    case "mechanism":
      return mechanismHtml(section);
    case "offer":
      return offerHtml(section);
    case "proof":
      return proofHtml(section);
    case "pricing":
      return pricingHtml(section);
    case "faq":
      return faqHtml(section);
    case "final_cta":
      return finalCtaHtml(section);
    case "navigation_bar":
      return navigationBarHtml(section);
    case "footer":
      return footerHtml(section);
    case "testimonials":
      return testimonialsHtml(section);
    case "logo_strip":
      return logoStripHtml(section);
    case "stats_bar":
      return statsBarHtml(section);
    case "feature_split":
      return featureSplitHtml(section);
    case "product_showcase":
      return productShowcaseHtml(section);
    case "implementation_notes":
      // Never rendered in the static landing page.
      return "";
    default:
      return "";
  }
}

// ---------------------------------------------------------------------------
// Public builders
// ---------------------------------------------------------------------------

export function pageBuilderDocumentToStaticHtml(document: PageBuilderDocument): string {
  const body = document.sections.map(sectionToHtml).filter((part) => part !== "").join("\n");
  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    `<title>${escapeHtml(document.title)}</title>`,
    '<link rel="stylesheet" href="landing-page.css" />',
    "</head>",
    "<body>",
    '<main class="pb-page">',
    body,
    "</main>",
    "</body>",
    "</html>",
    "",
  ].join("\n");
}

export function pageBuilderDocumentToStaticCss(_document: PageBuilderDocument): string {
  return `:root {
  --pb-bg: #070707;
  --pb-fg: #f4f4ef;
  --pb-muted: #9aa0a6;
  --pb-accent: #c7a45a;
  --pb-border: rgba(255, 255, 255, 0.1);
  --pb-card: rgba(255, 255, 255, 0.03);
  --pb-maxw: 960px;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--pb-bg);
  color: var(--pb-fg);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
}

.pb-page { margin: 0 auto; }

.pb-section {
  max-width: var(--pb-maxw);
  margin: 0 auto;
  padding: 56px 24px;
}

.pb-hero { text-align: center; }
.pb-hero-headline { font-size: clamp(2rem, 5vw, 3.5rem); letter-spacing: -0.03em; margin: 0; }
.pb-hero-subheadline { color: var(--pb-muted); font-size: 1.125rem; max-width: 640px; margin: 16px auto 0; }
.pb-proof-line { color: var(--pb-muted); font-size: 0.75rem; letter-spacing: 0.16em; text-transform: uppercase; margin-top: 24px; }

.pb-h2 { font-size: clamp(1.5rem, 3vw, 2.25rem); letter-spacing: -0.02em; margin: 0 0 12px; }
.pb-muted { color: var(--pb-muted); }
.pb-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.8rem; }
.pb-eyebrow { font-size: 0.65rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--pb-accent); margin: 0 0 8px; }
.pb-meta { color: var(--pb-muted); font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; margin-top: 16px; }
.pb-microcopy { color: var(--pb-muted); font-size: 0.75rem; margin-top: 12px; }

.pb-list { padding-left: 1.1rem; margin: 12px 0; }
.pb-list li { margin: 6px 0; color: var(--pb-fg); }

.pb-card {
  background: var(--pb-card);
  border: 1px solid var(--pb-border);
  border-radius: 16px;
  padding: 24px;
}

.pb-grid-2 { display: grid; gap: 16px; grid-template-columns: 1fr; }
.pb-grid-3 { display: grid; gap: 16px; grid-template-columns: 1fr; }
.pb-span-2 { grid-column: 1 / -1; }
.pb-price { font-size: 1.5rem; font-weight: 700; margin: 4px 0 0; }

.pb-cta-row { display: flex; flex-wrap: wrap; gap: 12px; justify-content: inherit; margin-top: 24px; }
.pb-hero .pb-cta-row, .pb-final-cta .pb-cta-row { justify-content: center; }

.pb-button {
  display: inline-flex;
  align-items: center;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
}
.pb-button-primary { background: var(--pb-accent); color: #000; }
.pb-button-secondary { border: 1px solid var(--pb-border); color: var(--pb-fg); }

.pb-faq-item { border: 1px solid var(--pb-border); border-radius: 12px; padding: 14px 16px; margin: 8px 0; }
.pb-faq-item summary { cursor: pointer; font-weight: 600; }
.pb-faq-item p { color: var(--pb-muted); margin: 8px 0 0; }

.pb-showcase { max-width: none; padding: 72px 24px; }
.pb-showcase-split { max-width: var(--pb-maxw); margin: 0 auto; display: grid; gap: 40px; grid-template-columns: 1fr; align-items: center; }
.pb-showcase-fullbleed { max-width: var(--pb-maxw); margin: 0 auto; }
.pb-showcase-media { margin-top: 16px; }
.pb-showcase-asset { width: 100%; border-radius: 16px; border: 1px solid var(--pb-border); aspect-ratio: 4 / 3; object-fit: cover; }
.pb-showcase-placeholder { display: flex; align-items: center; justify-content: center; border: 1px dashed var(--pb-border); border-radius: 16px; aspect-ratio: 4 / 3; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.75rem; letter-spacing: 0.18em; text-transform: uppercase; }
.pb-showcase-features { margin-top: 16px; }
.pb-showcase-product { font-size: 0.75rem; letter-spacing: 0.16em; text-transform: uppercase; margin: 0 0 8px; }
.pb-feature-value { font-size: 1.1rem; font-weight: 700; margin: 4px 0 0; }
.pb-center { text-align: center; }
.pb-testimonial blockquote { margin: 0; font-size: 1rem; line-height: 1.6; }
.pb-testimonial figcaption { margin-top: 12px; color: var(--pb-muted); font-size: 0.85rem; }
.pb-logo-row { display: flex; flex-wrap: wrap; gap: 16px 40px; justify-content: center; margin-top: 16px; }
.pb-logo { color: var(--pb-muted); font-weight: 600; }
.pb-stat-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-top: 16px; }
.pb-stat { text-align: center; }
.pb-stat-value { font-size: 1.75rem; font-weight: 700; color: var(--pb-accent); margin: 0; }
.pb-stat-label { font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--pb-muted); margin: 4px 0 0; }
.pb-feature-title { font-weight: 600; margin: 0; }
.pb-nav-row { display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.pb-nav-logo { font-weight: 600; }
.pb-nav-links { display: flex; flex-wrap: wrap; gap: 24px; }
.pb-nav-link { color: var(--pb-muted); text-decoration: none; font-size: 0.9rem; }
.pb-footer-groups { display: grid; grid-template-columns: 1fr; gap: 24px; margin-top: 16px; }
.pb-footer-legal { color: var(--pb-muted); font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; margin-top: 24px; }

@media (min-width: 768px) {
  .pb-grid-2 { grid-template-columns: 1fr 1fr; }
  .pb-grid-3 { grid-template-columns: 1fr 1fr 1fr; }
  .pb-showcase-split { grid-template-columns: 1fr 1fr; }
  .pb-stat-row { grid-template-columns: repeat(4, 1fr); }
  .pb-footer-groups { grid-template-columns: repeat(4, 1fr); }
}
`;
}

export function pageBuilderDocumentToAssetManifest(document: PageBuilderDocument): PageBuilderAssetManifest {
  const manifest: PageBuilderAssetManifest = { required: [], missing: [], optional: [] };

  for (const section of document.sections) {
    if (section.type !== "product_showcase") {
      continue;
    }

    // Primary product asset — required to render the showcase visually.
    if (hasText(section.productAsset?.src)) {
      manifest.required.push({
        path: section.productAsset.src,
        type: section.productAsset.type ?? "image",
        alt: section.productAlt,
        section: "product_showcase",
      });
    } else {
      manifest.missing.push({
        field: "productAsset.src",
        section: "product_showcase",
        reason: "Product asset source is empty; export references a placeholder.",
      });
    }

    // Optional feature images.
    section.features.forEach((feature, index) => {
      if (feature.image && hasText(feature.image.src)) {
        manifest.optional.push({
          path: feature.image.src,
          type: feature.image.type ?? "image",
          section: `product_showcase.features[${index}]`,
        });
      }
    });

    // Optional background image asset.
    if (section.background?.asset && hasText(section.background.asset.src)) {
      manifest.optional.push({
        path: section.background.asset.src,
        type: section.background.asset.type ?? "image",
        section: "product_showcase.background",
      });
    } else if (section.background?.type === "image" && !hasText(section.background?.asset?.src)) {
      manifest.missing.push({
        field: "background.asset.src",
        section: "product_showcase.background",
        reason: "Background type is image but no asset source was provided.",
      });
    }
  }

  return manifest;
}

// Explicit export gate (Component Registry v1.1 empty-state policy).
// Export must FAIL explicitly when required assets are missing — never ship a
// page that silently substitutes a placeholder for a required asset.
export type PageBuilderExportability =
  | { ok: true }
  | { ok: false; errors: string[]; missing: AssetManifestMissing[] };

export function assertPageBuilderExportable(document: PageBuilderDocument): PageBuilderExportability {
  const { missing } = pageBuilderDocumentToAssetManifest(document);
  if (missing.length === 0) {
    return { ok: true };
  }
  return {
    ok: false,
    missing,
    errors: missing.map((m) => `Missing required asset: ${m.section}.${m.field} — ${m.reason}`),
  };
}

export function pageBuilderDocumentToStaticExport(document: PageBuilderDocument): PageBuilderStaticExport {
  return {
    html: pageBuilderDocumentToStaticHtml(document),
    css: pageBuilderDocumentToStaticCss(document),
    assetManifest: pageBuilderDocumentToAssetManifest(document),
  };
}
