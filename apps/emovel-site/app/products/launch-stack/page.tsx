import type { Metadata } from "next";
import { FadeIn } from "@/components/FadeIn";
import { CTAButton } from "@/components/CTAButton";
import { getProduct } from "@/lib/products";

export const metadata: Metadata = {
  title: "Launch Stack v1",
  description:
    "Turn your product idea into a launch-ready offer. Audience snapshot, offer stack, pricing map, landing page copy, visual brief, funnel map, and 14-day launch plan.",
};

const DELIVERABLES = [
  { name: "Audience Snapshot", desc: "Who they are, what they fear, what they want instead" },
  { name: "Offer Stack", desc: "Core offer, upsell, downsell — positioned for conversion" },
  { name: "Pricing Map", desc: "3-tier pricing with anchoring logic and framing copy" },
  { name: "Landing Page Copy", desc: "Full-page copy: hero, problem, solution, proof, pricing, FAQ" },
  { name: "Visual Brief", desc: "Design direction, color, type, section structure for the landing page" },
  { name: "Funnel Map", desc: "Traffic → opt-in → offer → follow-up sequence" },
  { name: "14-Day Launch Plan", desc: "Day-by-day action plan from zero to first sale" },
  { name: "Usage Guide", desc: "How to deploy every deliverable in the right order" },
];

const FAQS = [
  {
    q: "Who is Launch Stack v1 for?",
    a: "Founders, consultants, and operators with a real product idea who want to launch it without guessing. It works best if you have at least a rough sense of who you serve and what you offer.",
  },
  {
    q: "Do I need a team to use this?",
    a: "No. Launch Stack v1 is designed to be executed solo. Every deliverable is structured for a single operator working through a documented process.",
  },
  {
    q: "What format are the deliverables in?",
    a: "Markdown documents optimised for direct use with Claude, GPT-4, or any capable AI model. Also readable as standalone documents for any workflow.",
  },
  {
    q: "How long does it take to run the full stack?",
    a: "Experienced operators complete the full stack in 2–4 hours of focused AI collaboration. First-time users typically take 1–2 days working in sessions.",
  },
  {
    q: "Is there a refund policy?",
    a: "Yes. If you run the system and it does not produce the promised deliverables, contact within 14 days for a full refund.",
  },
];

export default function LaunchStackPage() {
  const product = getProduct("launch-stack")!;

  return (
    <>
      {/* Hero */}
      <section className="bg-white pt-36 pb-20 md:pt-44 md:pb-28 px-6 border-b border-[#D9DEE7]">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <span className="inline-block font-mono text-xs tracking-[0.12em] uppercase text-[#40D9A3] mb-5">
              EMOVEL Systems · Available Now
            </span>
          </FadeIn>
          <FadeIn delay={80}>
            <h1
              className="text-4xl md:text-6xl font-bold tracking-[-0.03em] text-[#101114] leading-[1.06] mb-6 max-w-2xl"
              style={{ fontFamily: "var(--font-inter-tight, 'Inter Tight', sans-serif)" }}
            >
              Turn your product idea into a launch-ready offer.
            </h1>
          </FadeIn>
          <FadeIn delay={160}>
            <p className="text-xl text-gray-500 leading-relaxed mb-10 max-w-xl">
              Launch Stack v1 is a structured AI-powered system that produces everything
              you need to go from raw idea to first sale — in a single focused session.
            </p>
          </FadeIn>
          <FadeIn delay={240}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <CTAButton href={product.gumroadUrl ?? "#"} size="lg" external>
                Get Launch Stack v1 — $497
              </CTAButton>
              <span className="text-sm text-gray-400 font-mono">or 3 × $197</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Deliverables */}
      <section className="bg-[#20242B] py-24 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="mb-14">
            <span className="block font-mono text-xs tracking-[0.12em] uppercase text-[#40D9A3] mb-4">
              What you get
            </span>
            <h2
              className="text-3xl md:text-4xl font-semibold tracking-tight text-white"
              style={{ fontFamily: "var(--font-inter-tight, 'Inter Tight', sans-serif)" }}
            >
              8 production-ready deliverables.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DELIVERABLES.map((d, i) => (
              <FadeIn key={d.name} delay={i * 50}>
                <div className="flex gap-4 p-5 rounded-lg border border-white/10 bg-white/5">
                  <span className="mt-1 text-[#40D9A3] flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8.5l3.5 3.5 6.5-7" stroke="#40D9A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-semibold text-white text-sm mb-1">{d.name}</p>
                    <p className="text-gray-400 text-sm leading-relaxed">{d.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="bg-[#F5F7FA] py-24 md:py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="w-10 h-[2px] bg-[#2F6BFF] mb-8" />
            <h2
              className="text-3xl md:text-4xl font-semibold tracking-tight text-[#101114] mb-6"
              style={{ fontFamily: "var(--font-inter-tight, 'Inter Tight', sans-serif)" }}
            >
              Most ideas die in the gap between idea and launch.
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed mb-6">
              Not because the idea is bad. Because the founder lacks a structured process
              to move from raw thinking to a market-ready offer with conviction.
            </p>
            <p className="text-lg text-gray-500 leading-relaxed">
              Launch Stack v1 is that process. A documented, AI-powered system that walks
              you through every step: who you are serving, what you are offering, how to
              price it, how to explain it, how to design it, and how to get to your first
              sale in 14 days.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-[#101114] py-24 md:py-28 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn>
            <span className="block font-mono text-xs tracking-[0.12em] uppercase text-[#40D9A3] mb-4">
              Pricing
            </span>
            <div
              className="text-6xl font-bold text-white tracking-tight mb-3"
              style={{ fontFamily: "var(--font-inter-tight, 'Inter Tight', sans-serif)" }}
            >
              $497
            </div>
            <p className="text-gray-400 mb-2">or 3 monthly payments of $197</p>
            <p className="text-sm text-gray-600 mb-10">One-time purchase. No subscription. Instant access.</p>
            <CTAButton href={product.gumroadUrl ?? "#"} size="lg" external>
              Get Instant Access
            </CTAButton>
            <p className="text-xs text-gray-600 mt-6">14-day results guarantee. See FAQ below.</p>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-24 md:py-28 px-6">
        <div className="max-w-2xl mx-auto">
          <FadeIn className="mb-12">
            <span className="block font-mono text-xs tracking-[0.12em] uppercase text-[#2F6BFF] mb-4">
              FAQ
            </span>
            <h2
              className="text-3xl font-semibold tracking-tight text-[#101114]"
              style={{ fontFamily: "var(--font-inter-tight, 'Inter Tight', sans-serif)" }}
            >
              Common questions.
            </h2>
          </FadeIn>

          <div className="space-y-8">
            {FAQS.map((f, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div className="border-b border-[#D9DEE7] pb-8">
                  <h3 className="font-semibold text-[#101114] mb-3">{f.q}</h3>
                  <p className="text-gray-500 leading-relaxed">{f.a}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="mt-16">
            <CTAButton href={product.gumroadUrl ?? "#"} size="lg" external fullWidth>
              Get Launch Stack v1
            </CTAButton>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
