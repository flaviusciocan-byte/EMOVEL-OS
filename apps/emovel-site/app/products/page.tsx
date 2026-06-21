import type { Metadata } from "next";
import { FadeIn } from "@/components/FadeIn";
import { ProductCard } from "@/components/ProductCard";
import { EmailCaptureForm } from "@/components/EmailCaptureForm";
import { PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Premium AI-powered launch systems, prompt frameworks, and growth tools for founders and operators.",
};

const CATEGORIES = ["All", "Systems", "Templates", "OS"] as const;

export default function ProductsPage() {
  const available = PRODUCTS.filter((p) => p.status === "available");
  const upcoming = PRODUCTS.filter((p) => p.status === "coming-soon");

  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <FadeIn className="mb-16 max-w-2xl">
          <span className="block font-mono text-xs tracking-[0.12em] uppercase text-[#2F6BFF] mb-4">
            EMOVEL Products
          </span>
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight text-[#101114] mb-5"
            style={{ fontFamily: "var(--font-inter-tight, 'Inter Tight', sans-serif)" }}
          >
            Systems that close the gap between idea and market.
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Every EMOVEL product is a structured, documented process — built for
            founders, consultants, and operators who want commercial output, not
            theoretical frameworks.
          </p>
        </FadeIn>

        {/* Available */}
        {available.length > 0 && (
          <div className="mb-16">
            <FadeIn className="mb-6">
              <h2 className="font-mono text-xs tracking-[0.12em] uppercase text-[#40D9A3]">
                Available Now
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {available.map((p, i) => (
                <FadeIn key={p.slug} delay={i * 80}>
                  <ProductCard product={p} />
                </FadeIn>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div>
            <FadeIn className="mb-6">
              <h2 className="font-mono text-xs tracking-[0.12em] uppercase text-gray-400">
                Coming Soon
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcoming.map((p, i) => (
                <FadeIn key={p.slug} delay={i * 60}>
                  <ProductCard product={p} />
                </FadeIn>
              ))}
            </div>
          </div>
        )}

        {/* Email capture placeholder */}
        <FadeIn className="mt-20 border-t border-[#D9DEE7] pt-16 max-w-xl">
          <span className="block font-mono text-xs tracking-[0.12em] uppercase text-[#2F6BFF] mb-3">
            Stay in the loop
          </span>
          <h3
            className="text-xl font-semibold text-[#101114] mb-4"
            style={{ fontFamily: "var(--font-inter-tight, 'Inter Tight', sans-serif)" }}
          >
            Get notified when new products drop.
          </h3>
          <EmailCaptureForm />
          <p className="text-xs text-gray-400 mt-3">No spam. Unsubscribe anytime.</p>
        </FadeIn>
      </div>
    </div>
  );
}
