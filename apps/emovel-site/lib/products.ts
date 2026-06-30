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
    slug: "prompt-engine",
    name: "Prompt Engine",
    tagline: "Turn a raw idea into a controlled prompt package.",
    description:
      "Structures your raw direction into a clear product brief, page plan, copy angle, and builder-ready prompt system. Intent Map, Prompt Stack, and Builder Handoff — in one structured output.",
    price: "$197",
    status: "coming-soon",
    href: "/products/prompt-engine",
    category: "Systems",
    badge: "Soon",
  },
  {
    slug: "builder",
    name: "EMOVEL Builder",
    tagline: "Visual page builder built for AI-native output.",
    description:
      "A structured workspace for building landing pages and product sites from a prompt package. Strategy, copy, and layout — composed in one system.",
    price: "$297",
    status: "coming-soon",
    href: "/products/builder",
    category: "Systems",
    badge: "Soon",
  },
  {
    slug: "social-engine",
    name: "Social Engine",
    tagline: "Systematic content and growth for operator brands.",
    description:
      "A structured content OS for building an audience as a founder or operator. Content calendar, post frameworks, and growth system — without the hamster wheel.",
    price: "$97",
    status: "coming-soon",
    href: "/products/social-engine",
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
