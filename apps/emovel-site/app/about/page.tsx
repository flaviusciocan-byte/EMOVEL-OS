import type { Metadata } from "next";
import { FadeIn } from "@/components/FadeIn";
import { CTAButton } from "@/components/CTAButton";

export const metadata: Metadata = {
  title: "About",
  description:
    "EMOVEL is a premium AI launch and growth system for founders, consultants, and operators.",
};

const PRINCIPLES = [
  {
    title: "Systems over hacks",
    desc: "Every EMOVEL product is a documented, repeatable process — not a one-time prompt or shortcut.",
  },
  {
    title: "Output over frameworks",
    desc: "The measure of a system is the commercial output it produces. Not the elegance of its theory.",
  },
  {
    title: "Operator-grade quality",
    desc: "Every deliverable is built to the standard of a professional operator, not a course student.",
  },
  {
    title: "Precision over volume",
    desc: "EMOVEL ships fewer products and makes them excellent, rather than flooding the market with mediocre output.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white pt-36 pb-20 md:pt-44 md:pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <span className="block font-mono text-xs tracking-[0.12em] uppercase text-[#2F6BFF] mb-5">
              About EMOVEL
            </span>
          </FadeIn>
          <FadeIn delay={80}>
            <h1
              className="text-4xl md:text-5xl font-bold tracking-[-0.03em] text-[#101114] leading-[1.07] mb-6"
              style={{ fontFamily: "var(--font-inter-tight, 'Inter Tight', sans-serif)" }}
            >
              Built for founders who want to close the gap between idea and market.
            </h1>
          </FadeIn>
          <FadeIn delay={160}>
            <p className="text-xl text-gray-500 leading-relaxed">
              EMOVEL is a premium AI launch and growth system designed for founders,
              consultants, and operators who need structured commercial output — not
              theoretical frameworks or generic AI prompts.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-[#F5F7FA] py-20 md:py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="w-10 h-[2px] bg-[#40D9A3] mb-8" />
            <p className="text-2xl md:text-3xl font-medium text-[#101114] leading-relaxed tracking-tight">
              &ldquo;Most founders are not stuck because they lack ideas. They are stuck
              because they lack a structured system for turning those ideas into offers,
              and those offers into sales.&rdquo;
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-white py-20 md:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="mb-12">
            <span className="block font-mono text-xs tracking-[0.12em] uppercase text-[#40D9A3] mb-4">
              Principles
            </span>
            <h2
              className="text-3xl font-semibold tracking-tight text-[#101114]"
              style={{ fontFamily: "var(--font-inter-tight, 'Inter Tight', sans-serif)" }}
            >
              How EMOVEL thinks about building.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PRINCIPLES.map((p, i) => (
              <FadeIn key={p.title} delay={i * 70}>
                <div className="p-6 rounded-lg border border-[#D9DEE7]">
                  <h3
                    className="font-semibold text-[#101114] mb-3"
                    style={{ fontFamily: "var(--font-inter-tight, 'Inter Tight', sans-serif)" }}
                  >
                    {p.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#20242B] py-20 md:py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn>
            <h2
              className="text-3xl font-semibold tracking-tight text-white mb-5"
              style={{ fontFamily: "var(--font-inter-tight, 'Inter Tight', sans-serif)" }}
            >
              Ready to use the system?
            </h2>
            <p className="text-gray-400 leading-relaxed mb-8">
              Start with Launch Stack v1 — the fastest way to go from idea to a
              complete market-ready offer.
            </p>
            <CTAButton href="/products" size="lg">
              Browse Products
            </CTAButton>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
