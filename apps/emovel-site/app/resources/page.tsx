import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Guides, frameworks, and documentation from the EMOVEL system. Free resources for founders, consultants, and operators.",
};

const RESOURCES = [
  {
    category: "Getting Started",
    items: [
      {
        title: "How to Use Launch Stack v1",
        desc: "A walkthrough of the full Launch Stack system: what each deliverable is for and how to execute them in sequence.",
        href: "/products/launch-stack",
        type: "Guide",
      },
      {
        title: "The EMOVEL Brand System",
        desc: "Color palette, typography, spacing, and design rules used across all EMOVEL products.",
        href: "#",
        type: "Reference",
        disabled: true,
      },
    ],
  },
  {
    category: "Frameworks",
    items: [
      {
        title: "Offer Stack Framework",
        desc: "A structured method for building a core offer, upsell, and downsell that work together as a conversion system.",
        href: "#",
        type: "Framework",
        disabled: true,
      },
      {
        title: "Premium UI Director",
        desc: "The EMOVEL method for translating a brand brief into a high-converting landing page design direction.",
        href: "#",
        type: "Framework",
        disabled: true,
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32 px-6">
      <div className="max-w-4xl mx-auto">
        <FadeIn className="mb-16 max-w-2xl">
          <span className="block font-mono text-xs tracking-[0.12em] uppercase text-[#2F6BFF] mb-4">
            Resources
          </span>
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight text-[#101114] mb-5"
            style={{ fontFamily: "var(--font-inter-tight, 'Inter Tight', sans-serif)" }}
          >
            Guides, frameworks, and documentation.
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Reference material for founders and operators using the EMOVEL system. More
            resources are added with each product release.
          </p>
        </FadeIn>

        <div className="space-y-14">
          {RESOURCES.map((section, si) => (
            <div key={section.category}>
              <FadeIn>
                <h2 className="font-mono text-xs tracking-[0.12em] uppercase text-[#40D9A3] mb-6">
                  {section.category}
                </h2>
              </FadeIn>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.items.map((item, ii) => (
                  <FadeIn key={item.title} delay={ii * 70}>
                    <div
                      className={`rounded-lg border p-6 ${
                        item.disabled
                          ? "border-[#D9DEE7] bg-[#F5F7FA] opacity-60"
                          : "border-[#D9DEE7] bg-white hover:border-[#2F6BFF]/40 hover:shadow-md transition-all"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400">
                          {item.type}
                        </span>
                        {item.disabled && (
                          <span className="font-mono text-[10px] tracking-widest uppercase text-gray-300">
                            Soon
                          </span>
                        )}
                      </div>
                      <h3
                        className="font-semibold text-[#101114] mb-2"
                        style={{ fontFamily: "var(--font-inter-tight, 'Inter Tight', sans-serif)" }}
                      >
                        {item.disabled ? (
                          item.title
                        ) : (
                          <Link href={item.href} className="hover:text-[#2F6BFF] transition-colors no-underline">
                            {item.title}
                          </Link>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
