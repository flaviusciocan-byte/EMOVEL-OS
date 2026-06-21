import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { CTAButton } from "@/components/CTAButton";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "EMOVEL — Premium AI Launch Systems",
  description:
    "Build products. Launch faster. Grow without noise. Premium AI-powered systems for founders, consultants, and operators.",
};

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="bg-white pt-36 pb-28 md:pt-44 md:pb-36 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <FadeIn>
          <span className="inline-block font-mono text-xs tracking-[0.12em] uppercase text-[#2F6BFF] mb-6">
            Premium AI Systems
          </span>
        </FadeIn>

        <FadeIn delay={80}>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] text-[#101114] leading-[1.06] mb-6"
            style={{ fontFamily: "var(--font-inter-tight, 'Inter Tight', sans-serif)" }}
          >
            Build products.
            <br />
            Launch faster.
            <br />
            <span className="text-[#2F6BFF]">Grow without noise.</span>
          </h1>
        </FadeIn>

        <FadeIn delay={160}>
          <p className="text-xl md:text-2xl text-gray-500 leading-relaxed mb-10 max-w-xl mx-auto">
            EMOVEL is a premium AI launch and growth system for founders,
            consultants, and operators who want commercial output — not
            theoretical frameworks.
          </p>
        </FadeIn>

        <FadeIn delay={240}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CTAButton href="/products" size="lg">
              Browse Products
            </CTAButton>
            <CTAButton href="/products/launch-stack" variant="outline" size="lg">
              Launch Stack v1
            </CTAButton>
          </div>
        </FadeIn>
      </div>

      <div className="mt-24 border-t border-[#D9DEE7] max-w-6xl mx-auto" />
    </section>
  );
}

// ─── Products Preview ─────────────────────────────────────────────────────────

function ProductsPreview() {
  return (
    <section className="bg-[#F5F7FA] py-24 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span className="block font-mono text-xs tracking-[0.12em] uppercase text-[#40D9A3] mb-3">
              Products
            </span>
            <h2
              className="text-3xl md:text-4xl font-semibold tracking-tight text-[#101114]"
              style={{ fontFamily: "var(--font-inter-tight, 'Inter Tight', sans-serif)" }}
            >
              Systems built for real launches.
            </h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-[#2F6BFF] hover:underline underline-offset-4 transition-all whitespace-nowrap"
          >
            View all products →
          </Link>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PRODUCTS.map((p, i) => (
            <FadeIn key={p.slug} delay={i * 80}>
              <ProductCard product={p} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Mission ──────────────────────────────────────────────────────────────────

function Mission() {
  return (
    <section className="bg-white py-24 md:py-28 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <FadeIn>
          <div className="w-10 h-[2px] bg-[#40D9A3] mx-auto mb-8" />
          <h2
            className="text-3xl md:text-4xl font-semibold tracking-tight text-[#101114] mb-7"
            style={{ fontFamily: "var(--font-inter-tight, 'Inter Tight', sans-serif)" }}
          >
            Most founders are not stuck because they lack ideas.
            <br />
            They are stuck because they lack a structured system.
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
            EMOVEL exists to close that gap. Every product in the EMOVEL system is
            a structured, documented process — not a prompt pack, not a course, not
            a template. A production-grade system for getting the work done.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── CTA Band ─────────────────────────────────────────────────────────────────

function CTABand() {
  return (
    <section className="bg-[#20242B] py-24 md:py-28 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <FadeIn>
          <h2
            className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-5"
            style={{ fontFamily: "var(--font-inter-tight, 'Inter Tight', sans-serif)" }}
          >
            Start with the system that closes the gap.
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed mb-10">
            Launch Stack v1 turns one raw product idea into a complete
            market-ready package — offer, copy, pricing, design direction, and
            launch plan.
          </p>
          <CTAButton href="/products/launch-stack" size="lg">
            Get Launch Stack v1
          </CTAButton>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductsPreview />
      <Mission />
      <CTABand />
    </>
  );
}
