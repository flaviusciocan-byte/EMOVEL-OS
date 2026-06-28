export type PageBuilderPageType = "landing_page";

// Current Page Builder document schema version. normalize() defaults this when
// absent; the validator accepts only this exact value when present.
export const PAGE_BUILDER_SCHEMA_VERSION = "1.0.0" as const;

export type PageBuilderSectionType =
  | "hero"
  | "problem"
  | "mechanism"
  | "offer"
  | "proof"
  | "pricing"
  | "faq"
  | "final_cta"
  | "navigation_bar"
  | "footer"
  | "testimonials"
  | "logo_strip"
  | "stats_bar"
  | "feature_split"
  | "implementation_notes"
  | "product_showcase";

export type PageBuilderDocumentStatus = "draft" | "validated" | "export_ready";

// ---------------------------------------------------------------------------
// Shared Layer (Component Registry v1.1)
// Every section inherits these props through BaseSection. No section interface
// redeclares them. All fields are optional in the schema; normalize() fills
// safe defaults and derives anchorId, and the validator only checks fields
// that are present. SectionSurface (section-surface.ts) resolves these into
// render tokens.
//   - universe : brand-scoped visual world token (derived from Brand OS).
//   - surface  : depth/elevation role of the section background.
//   - motion   : entrance/motion intensity.
//   - spacing  : vertical rhythm scale.
//   - anchorId : in-page anchor slug for navigation.
//   - aiLock   : when true, the Composer/AI must not overwrite this section.
// ---------------------------------------------------------------------------

export type SectionSurfaceRole = "base" | "raised" | "inset" | "contrast";
export type SectionMotionLevel = "none" | "subtle" | "expressive";
export type SectionSpacingScale = "compact" | "default" | "spacious";

export interface SharedSectionProps {
  universe?: string;
  surface?: SectionSurfaceRole;
  motion?: SectionMotionLevel;
  spacing?: SectionSpacingScale;
  anchorId?: string;
  aiLock?: boolean;
}

// Base every section interface extends. Carries only the Shared Layer; section
// interfaces add their own type discriminant and content props on top.
export interface BaseSection {
  shared?: SharedSectionProps;
}

export interface HeroSection extends BaseSection {
  type: "hero";
  headline: string;
  subheadline?: string;
  primary_cta: string;
  secondary_cta?: string;
  proof_line?: string;
}

export interface ProblemSection extends BaseSection {
  type: "problem";
  title: string;
  symptoms: string[];
  cost_of_inaction: string;
}

export interface MechanismSection extends BaseSection {
  type: "mechanism";
  title: string;
  explanation: string;
  why_it_works: string;
  difference_from_alternatives: string[];
}

export interface OfferSection extends BaseSection {
  type: "offer";
  title: string;
  deliverables: string[];
  format: string;
  timeline: string;
}

export interface ProofSection extends BaseSection {
  type: "proof";
  proof_points: string[];
  credibility_signals: string[];
  testimonial_placeholders: string[];
}

export interface PricingSection extends BaseSection {
  type: "pricing";
  pilot_price: string;
  premium_upgrade: string;
  pricing_rationale: string;
  risk_reversal: string;
}

export interface FaqSection extends BaseSection {
  type: "faq";
  items: Array<{
    question: string;
    answer: string;
  }>;
}

export interface FinalCtaSection extends BaseSection {
  type: "final_cta";
  headline: string;
  cta: string;
  microcopy?: string;
}

export interface ImplementationNotesSection extends BaseSection {
  type: "implementation_notes";
  components: string[];
  required_sections: PageBuilderSectionType[];
  missing_visual_assets: string[];
  acceptance_checks: string[];
}

// ---------------------------------------------------------------------------
// Structural chrome (Component Registry v1.1, components 11–12).
// NavigationBar leads the page; Footer closes it. Both inherit the Shared Layer
// (BaseSection) and are optional, rendered sections.
// ---------------------------------------------------------------------------

export interface NavigationBarLink {
  label: string;
  anchor: string;
}

export interface NavigationBarCta {
  label: string;
  href?: string;
}

export interface NavigationBarSection extends BaseSection {
  type: "navigation_bar";
  logo_label: string;
  links: NavigationBarLink[];
  cta?: NavigationBarCta;
  transparent?: boolean;
}

export interface FooterLink {
  label: string;
  href?: string;
}

export interface FooterLinkGroup {
  heading: string;
  links: FooterLink[];
}

export interface FooterSection extends BaseSection {
  type: "footer";
  tagline?: string;
  link_groups: FooterLinkGroup[];
  legal?: string;
}

// ---------------------------------------------------------------------------
// Trust / content sections (Component Registry v1.1, components 13–16).
// Fully implemented, optional, rendered sections; inherit the Shared Layer.
// ---------------------------------------------------------------------------

export interface TestimonialItem {
  quote: string;
  author: string;
  role?: string;
}

export interface TestimonialsSection extends BaseSection {
  type: "testimonials";
  title?: string;
  items: TestimonialItem[];
}

export interface LogoStripLogo {
  name: string;
  src?: string;
}

export interface LogoStripSection extends BaseSection {
  type: "logo_strip";
  title?: string;
  logos: LogoStripLogo[];
}

export interface StatItem {
  value: string;
  label: string;
}

export interface StatsBarSection extends BaseSection {
  type: "stats_bar";
  title?: string;
  stats: StatItem[];
}

export interface FeatureSplitItem {
  title: string;
  description?: string;
}

export interface FeatureSplitSection extends BaseSection {
  type: "feature_split";
  title: string;
  description?: string;
  features: FeatureSplitItem[];
  mediaPosition?: "left" | "right";
}

// ---------------------------------------------------------------------------
// Product Showcase (Phase 2) — the first premium presentation section.
// Theme-driven, brand-aware, split/fullbleed layout. Contract-only: no UI,
// no React, no Puck. Validated and exported like every other core section.
// ---------------------------------------------------------------------------

export type ProductShowcaseLayout = "split" | "fullbleed";
export type ProductShowcaseMediaPosition = "left" | "center" | "right";
export type ProductShowcaseCTAVariant = "primary" | "secondary";

export interface ProductShowcaseAsset {
  src: string;
  type?: "image" | "render" | "screenshot" | "video-poster";
  width?: number;
  height?: number;
}

export interface ProductShowcaseCTA {
  label: string;
  href?: string;
  variant: ProductShowcaseCTAVariant;
  icon?: string;
}

export interface ProductShowcaseFeature {
  label: string;
  value: string;
  unit?: string;
  description?: string;
  image?: ProductShowcaseAsset;
  icon?: string;
}

export interface ProductShowcaseNav {
  logoLabel?: string;
  links?: Array<{ label: string; href: string }>;
  cta?: ProductShowcaseCTA;
  transparent?: boolean;
}

export interface ProductShowcaseTypographyTokens {
  headline?: string;
  productName?: string;
  body?: string;
  technical?: string;
}

export interface ProductShowcaseTheme {
  background: string;
  foreground: string;
  muted: string;
  accent: string;
  card: string;
  border: string;
  overlayGradient: string;
  typography: ProductShowcaseTypographyTokens;
}

export interface ProductShowcaseMotion {
  enabled?: boolean;
  productParallax?: "none" | "subtle";
  productScale?: "none" | "subtle";
  featureReveal?: "none" | "stagger";
}

export interface ProductShowcaseBackground {
  type?: "solid" | "gradient" | "image";
  value?: string;
  asset?: ProductShowcaseAsset;
}

export interface ProductShowcaseOverlay {
  enabled?: boolean;
  position?: "left" | "right" | "bottom" | "full";
  gradient?: string;
  opacity?: number;
}

export interface ProductShowcaseSection extends BaseSection {
  type: "product_showcase";
  layout: ProductShowcaseLayout;
  productName: string;
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  specText?: string;
  productAsset: ProductShowcaseAsset;
  productAlt: string;
  ctas: ProductShowcaseCTA[];
  features: ProductShowcaseFeature[];
  nav?: ProductShowcaseNav;
  theme: ProductShowcaseTheme;
  motion?: ProductShowcaseMotion;
  mediaPosition?: ProductShowcaseMediaPosition;
  background?: ProductShowcaseBackground;
  overlay?: ProductShowcaseOverlay;
}

export type PageBuilderSection =
  | HeroSection
  | ProblemSection
  | MechanismSection
  | OfferSection
  | ProofSection
  | PricingSection
  | FaqSection
  | FinalCtaSection
  | NavigationBarSection
  | FooterSection
  | TestimonialsSection
  | LogoStripSection
  | StatsBarSection
  | FeatureSplitSection
  | ImplementationNotesSection
  | ProductShowcaseSection;

export interface PageBuilderDocument {
  page_type: "landing_page";
  // Optional for backward compatibility; normalize() defaults it to "1.0.0" and
  // the validator enforces that value when present.
  schema_version?: string;
  title: string;
  status: PageBuilderDocumentStatus;
  sections: PageBuilderSection[];
  source?: string;
  brand_context?: {
    slug?: string;
    dominant_mechanism?: string;
    applied_mechanism?: string;
    task_type?: string;
  };
}
