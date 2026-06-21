export type ProductStatus = "available" | "coming-soon";
export type ProductCategory = "Systems" | "Templates" | "OS";

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: string;
  priceAlt?: string;
  status: ProductStatus;
  href: string;
  category: ProductCategory;
  badge: string;
  deliverables?: string[];
  gumroadUrl?: string;
}

export const PRODUCTS: Product[] = [
  {
    slug: "launch-stack",
    name: "Launch Stack v1",
    tagline: "Turn your product idea into a launch-ready offer.",
    description:
      "A premium AI-powered system that produces a complete market package from one raw idea: audience snapshot, offer stack, pricing map, landing page copy, visual brief, funnel map, and 14-day launch plan.",
    price: "$497",
    priceAlt: "or 3 × $197",
    status: "available",
    href: "/products/launch-stack",
    category: "Systems",
    badge: "Available",
    deliverables: [
      "Audience Snapshot",
      "Offer Stack",
      "Pricing Map",
      "Landing Page Copy",
      "Visual Brief",
      "Funnel Map",
      "14-Day Launch Plan",
      "Usage Guide",
    ],
    gumroadUrl: "#",
  },
  {
    slug: "prompt-systems",
    name: "Prompt Systems",
    tagline: "Structured prompt architecture for repeatable AI output.",
    description:
      "Production-grade prompt frameworks for copywriting, research, positioning, and strategy. Built on documented rules, not one-off experiments.",
    price: "$197",
    status: "coming-soon",
    href: "/products/prompt-systems",
    category: "Systems",
    badge: "Soon",
  },
  {
    slug: "landing-template-pack",
    name: "Landing Template Pack",
    tagline: "Premium Next.js landing pages, ready to deploy.",
    description:
      "Conversion-optimised landing page templates built on the EMOVEL UI system. Tailwind + shadcn/ui. Mobile-first. One-click deploy to Vercel.",
    price: "$97",
    status: "coming-soon",
    href: "/products/landing-template-pack",
    category: "Templates",
    badge: "Soon",
  },
  {
    slug: "instagram-growth-os",
    name: "Instagram Growth OS",
    tagline: "Systematic audience growth for operator brands.",
    description:
      "A structured content and growth system for building an Instagram audience as a founder or consultant — without the content hamster wheel.",
    price: "$297",
    status: "coming-soon",
    href: "/products/instagram-growth-os",
    category: "OS",
    badge: "Soon",
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getAvailableProducts(): Product[] {
  return PRODUCTS.filter((p) => p.status === "available");
}
