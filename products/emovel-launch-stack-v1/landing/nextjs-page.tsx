"use client";

import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface IntersectionOptions {
  threshold?: number;
  rootMargin?: string;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useInView(options: IntersectionOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px", ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 64);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return scrolled;
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={cn("transition-all duration-700 ease-out", className)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function MonoLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "font-mono text-xs tracking-[0.12em] uppercase font-medium",
        className
      )}
    >
      {children}
    </span>
  );
}

function CTAButton({
  children,
  href = "#pricing",
  variant = "primary",
  className,
  fullWidth,
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "outline";
  className?: string;
  fullWidth?: boolean;
}) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center justify-center font-semibold text-base rounded-lg min-h-[44px] px-7 py-3",
        "transition-all duration-150 cursor-pointer no-underline",
        variant === "primary" && [
          "bg-[#2F6BFF] text-white",
          "hover:bg-[#1A55E8] hover:scale-[1.01]",
          "focus-visible:ring-2 focus-visible:ring-[#2F6BFF] focus-visible:ring-offset-2",
        ],
        variant === "outline" && [
          "border border-[#2F6BFF] text-[#2F6BFF] bg-transparent",
          "hover:bg-[#2F6BFF]/5",
          "focus-visible:ring-2 focus-visible:ring-[#2F6BFF] focus-visible:ring-offset-2",
        ],
        fullWidth && "w-full",
        className
      )}
    >
      {children}
    </a>
  );
}

function MintCheck() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="flex-shrink-0 mt-0.5"
    >
      <circle cx="8" cy="8" r="8" fill="#40D9A3" opacity="0.15" />
      <path
        d="M5 8l2 2 4-4"
        stroke="#40D9A3"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function StickyNav() {
  const scrolled = useScrolled();
  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white border-b border-[#D9DEE7] shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="font-mono text-sm font-semibold tracking-widest text-[#101114] uppercase">
          EMOVEL
        </span>
        <CTAButton href="#pricing" className="text-sm px-5 py-2 min-h-[36px]">
          Get The Launch Stack
        </CTAButton>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="bg-white pt-36 pb-24 md:pt-44 md:pb-32 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div
          className="inline-block mb-6 transition-all duration-500 ease-out"
          style={{ animationFillMode: "both" }}
        >
          <MonoLabel className="text-[#2F6BFF]">EMOVEL Launch Stack v1</MonoLabel>
        </div>

        <h1
          className="text-4xl md:text-6xl font-bold tracking-tight text-[#101114] leading-[1.08] mb-6"
          style={{ fontFamily: "'Inter Tight', 'Inter', sans-serif" }}
        >
          Turn Your Raw Product Idea Into A Launch-Ready Offer
        </h1>

        <p className="text-xl md:text-2xl text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto">
          A premium AI-powered launch system that turns your product idea into a
          clear audience profile, offer stack, pricing strategy, landing page
          copy, visual brief, funnel map, and 14-day launch plan.
        </p>

        <div className="flex flex-col items-center gap-3">
          <CTAButton href="#pricing" className="px-10 py-4 text-lg min-h-[52px]">
            Get The Launch Stack
          </CTAButton>
          <p className="text-sm text-gray-400">
            Built for one product idea. Delivered as a complete launch package.
          </p>
        </div>
      </div>

      <div className="mt-20 border-t border-[#D9DEE7] max-w-5xl mx-auto" />
    </section>
  );
}

// ─── Problem ──────────────────────────────────────────────────────────────────

function ProblemSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F7FA] py-24 md:py-28 px-6">
      <div ref={ref} className="max-w-2xl mx-auto text-center">
        <div
          className="transition-all duration-700 ease-out"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <div className="w-10 h-[2px] bg-[#40D9A3] mx-auto mb-8" />
          <h2
            className="text-3xl md:text-4xl font-semibold tracking-tight text-[#101114] leading-tight mb-8"
            style={{ fontFamily: "'Inter Tight', 'Inter', sans-serif" }}
          >
            Your product is not stuck because it is bad. It is stuck because it
            is unclear.
          </h2>
          <div className="text-lg text-gray-600 leading-relaxed space-y-5 text-left">
            <p>
              You know the idea has value. You can explain it in a call. You can
              picture the buyer. You may even have the product mostly built.
            </p>
            <p>
              But when it is time to write the offer, choose a price, structure
              the page, or announce the launch, everything slows down.
            </p>
            <p>
              The product turns into a folder of notes, half-written headlines,
              tool tabs, and second guesses.
            </p>
            <p className="font-medium text-[#101114]">
              That is the gap EMOVEL Launch Stack v1 closes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Solution ─────────────────────────────────────────────────────────────────

const SKILLS = [
  {
    n: "01",
    name: "Audience Builder",
    desc: "Defines the buyer, pain, desire, objections, and language patterns",
  },
  {
    n: "02",
    name: "Offer Architect",
    desc: "Frames your product as a transformation with bonuses and guarantee",
  },
  {
    n: "03",
    name: "Pricing Engine",
    desc: "Sets the right price, tiers, payment plan, and upgrade logic",
  },
  {
    n: "04",
    name: "Copy Framework",
    desc: "Produces the hero, sections, CTA flow, proof, and FAQ copy",
  },
  {
    n: "05",
    name: "Page Builder",
    desc: "Gives you the complete landing page structure and section logic",
  },
  {
    n: "06",
    name: "Visual Brief",
    desc: "Defines colors, typography, imagery, layout, and creative direction",
  },
  {
    n: "07",
    name: "Funnel Builder",
    desc: "Maps how traffic moves from interest to purchase",
  },
];

function SolutionSection() {
  return (
    <section className="bg-white py-24 md:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl font-semibold tracking-tight text-[#101114] mb-5"
            style={{ fontFamily: "'Inter Tight', 'Inter', sans-serif" }}
          >
            One structured system for the assets every launch needs.
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Instead of asking AI for random suggestions, the stack runs your
            idea through seven EMOVEL skills — in sequence, with documented
            rules.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-0 relative">
          {SKILLS.map((skill, i) => (
            <FadeIn key={skill.n} delay={i * 80} className="flex flex-col">
              <div className="relative flex flex-col items-start md:items-center gap-3 px-0 md:px-3 py-6 md:py-0 border-b md:border-b-0 border-[#D9DEE7] last:border-b-0">
                {i < SKILLS.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-[calc(50%+28px)] right-0 h-[1px] bg-[#D9DEE7]" />
                )}
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#2F6BFF]/10 flex items-center justify-center">
                  <MonoLabel className="text-[#2F6BFF] text-[10px]">
                    {skill.n}
                  </MonoLabel>
                </div>
                <div className="md:text-center">
                  <p
                    className="font-mono text-xs text-[#101114] font-semibold tracking-wide mb-1"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    {skill.name}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed hidden md:block">
                    {skill.desc}
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed md:hidden">
                    {skill.desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={600} className="mt-14 text-center">
          <p className="text-base text-gray-500 max-w-lg mx-auto">
            The result is not a generic prompt pack. It is a usable market
            package for one specific product — built through documented rules
            instead of one-off prompting.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Deliverables ─────────────────────────────────────────────────────────────

const DELIVERABLES = [
  {
    name: "Audience Snapshot",
    desc: "Defines the buyer, pain, desire, objections, and language",
  },
  {
    name: "Offer Stack",
    desc: "Frames the product as a transformation with bonuses and guarantee",
  },
  {
    name: "Pricing Map",
    desc: "Sets the price, tiers, payment plan, and upgrade logic",
  },
  {
    name: "Landing Page Copy",
    desc: "Gives you the hero, sections, CTA flow, proof, and FAQ copy",
  },
  {
    name: "Visual Brief",
    desc: "Defines colors, typography, imagery, layout, and creative direction",
  },
  {
    name: "Funnel Map",
    desc: "Shows how traffic moves from interest to sale",
  },
  {
    name: "Launch Plan",
    desc: "Gives you a 14-day content and outreach sequence",
  },
  {
    name: "Usage Guide",
    desc: "Shows how to turn the package into a live launch",
  },
];

function DeliverablesSection() {
  return (
    <section className="bg-[#20242B] py-24 md:py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <FadeIn className="text-center mb-14">
          <MonoLabel className="text-[#40D9A3] mb-4 block">
            What You Receive
          </MonoLabel>
          <h2
            className="text-3xl md:text-4xl font-semibold tracking-tight text-white"
            style={{ fontFamily: "'Inter Tight', 'Inter', sans-serif" }}
          >
            Your complete launch foundation.
          </h2>
        </FadeIn>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-4 pr-8 text-xs font-mono text-[#40D9A3] tracking-widest uppercase">
                  Deliverable
                </th>
                <th className="pb-4 text-xs font-mono text-[#40D9A3] tracking-widest uppercase">
                  What It Does
                </th>
              </tr>
            </thead>
            <tbody>
              {DELIVERABLES.map((item, i) => (
                <FadeIn key={item.name} delay={i * 60} className="contents">
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 pr-8 align-top">
                      <div className="flex items-start gap-3">
                        <MintCheck />
                        <span className="text-sm font-semibold text-white whitespace-nowrap">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-400 leading-relaxed">
                      {item.desc}
                    </td>
                  </tr>
                </FadeIn>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ─── Benefits ─────────────────────────────────────────────────────────────────

const BENEFITS = [
  {
    title: "Sell the outcome, not the features",
    body: "The offer stack translates your idea into a buyer-facing promise that makes the value obvious — before you write a single line of copy.",
  },
  {
    title: "Charge with confidence",
    body: "The pricing map gives you a clear price point, tier structure, anchor, and payment plan so you do not default to undercharging.",
  },
  {
    title: "Build the page faster",
    body: "The landing page copy gives your page builder, designer, or developer a complete conversion structure — no brief needed.",
  },
  {
    title: "Stay visually consistent",
    body: "The visual brief gives your brand and launch assets a premium direction before anyone opens Canva, Figma, Framer, or Webflow.",
  },
  {
    title: "Publish with a plan",
    body: "The launch plan tells you what to say before launch, on launch day, and after launch so you do not disappear when the page goes live.",
  },
];

function BenefitsSection() {
  return (
    <section className="bg-[#F5F7FA] py-24 md:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl font-semibold tracking-tight text-[#101114] max-w-2xl mx-auto"
            style={{ fontFamily: "'Inter Tight', 'Inter', sans-serif" }}
          >
            Launch with sharper thinking before you spend on design, ads, or
            development.
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {BENEFITS.map((b, i) => (
            <FadeIn key={b.title} delay={i * 80}>
              <div className="bg-white border border-[#D9DEE7] rounded-lg p-7 h-full hover:shadow-md transition-shadow duration-200">
                <h3
                  className="text-base font-semibold text-[#101114] mb-3 leading-snug"
                  style={{ fontFamily: "'Inter Tight', 'Inter', sans-serif" }}
                >
                  {b.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{b.body}</p>
              </div>
            </FadeIn>
          ))}

          <FadeIn delay={BENEFITS.length * 80}>
            <div className="bg-[#2F6BFF]/5 border border-[#2F6BFF]/20 rounded-lg p-7 h-full flex flex-col justify-between">
              <p className="text-sm text-[#101114] leading-relaxed font-medium">
                A founder would typically pay $1,500 to $5,000 for a
                strategist, copywriter, and designer to produce these launch
                assets separately.
              </p>
              <p className="text-2xl font-bold text-[#2F6BFF] mt-4">
                One system. One price.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─── Proof ────────────────────────────────────────────────────────────────────

function ProofSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-white py-24 md:py-28 px-6">
      <div className="max-w-3xl mx-auto">
        <FadeIn className="text-center mb-14">
          <MonoLabel className="text-[#2F6BFF] mb-4 block">
            Built from the EMOVEL skill system
          </MonoLabel>
          <h2
            className="text-3xl md:text-4xl font-semibold tracking-tight text-[#101114]"
            style={{ fontFamily: "'Inter Tight', 'Inter', sans-serif" }}
          >
            A documented system, not a one-off prompt.
          </h2>
        </FadeIn>

        <FadeIn delay={100}>
          <p className="text-lg text-gray-600 leading-relaxed text-center mb-12">
            EMOVEL Launch Stack v1 is built from the same modular skill
            architecture used inside EMOVEL-OS to produce offers, copy, pages,
            funnels, and launch plans. Each output is generated through
            documented rules instead of one-off prompting.
          </p>
        </FadeIn>

        <div
          ref={ref}
          className="transition-all duration-700 ease-out"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateX(0)" : "translateX(-24px)",
          }}
        >
          <blockquote className="border-l-4 border-[#40D9A3] pl-8 py-2">
            <p className="text-xl text-[#101114] leading-relaxed italic mb-4">
              "We used EMOVEL Launch Stack v1 to turn a rough product idea into
              a complete sales page, pricing model, and 14-day launch plan in
              under 48 hours."
            </p>
            <footer className="text-sm text-gray-400 font-mono not-italic">
              — First launch cohort outcome
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

const TIERS = [
  {
    name: "Starter",
    price: "$197",
    badge: null,
    desc: "Templates, prompts, and example output. For buyers who want to run the system themselves.",
    features: [
      "Intake template",
      "Launch stack outline",
      "Prompt sequence",
      "Example output",
    ],
    cta: "Get Starter",
    highlight: false,
    note: null,
  },
  {
    name: "Core",
    price: "$497",
    badge: "Most Popular",
    desc: "Full launch stack produced for one product idea. The best fit for getting one offer ready to sell.",
    features: [
      "Everything in Starter",
      "Complete audience snapshot",
      "Offer stack + pricing map",
      "Full landing page copy",
      "Visual direction brief",
      "Funnel map + launch plan",
      "Usage guide",
    ],
    cta: "Get The Launch Stack",
    highlight: true,
    note: "Or 3 payments of $197",
  },
  {
    name: "Premium",
    price: "$1,500",
    badge: null,
    desc: "Full launch stack plus implementation support. For teams that need expert review.",
    features: [
      "Everything in Core",
      "90-minute strategy session",
      "Landing page wireframe review",
      "Launch content review",
      "7-day async refinement window",
    ],
    cta: "Get Premium",
    highlight: false,
    note: null,
  },
];

function PricingSection() {
  return (
    <section id="pricing" className="bg-[#101114] py-24 md:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-6">
          <h2
            className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-5"
            style={{ fontFamily: "'Inter Tight', 'Inter', sans-serif" }}
          >
            Get the launch assets that usually require a strategist, copywriter,
            and designer.
          </h2>
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-5 py-3 mt-2">
            <span className="text-gray-400 line-through text-sm">$2,750 value</span>
            <span className="text-white font-bold text-lg">Launch price: $497</span>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
          {TIERS.map((tier, i) => (
            <FadeIn key={tier.name} delay={i * 100}>
              <div
                className={cn(
                  "rounded-lg p-7 flex flex-col h-full transition-shadow duration-200",
                  tier.highlight
                    ? "bg-white/5 border-2 border-[#2F6BFF] shadow-[0_0_40px_rgba(47,107,255,0.15)]"
                    : "bg-white/[0.03] border border-white/10 hover:border-white/20"
                )}
              >
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="font-mono text-xs text-gray-400 tracking-widest uppercase mb-1">
                      {tier.name}
                    </p>
                    <p
                      className="text-5xl font-bold text-white tracking-tight"
                      style={{
                        fontFamily: "'Inter Tight', 'Inter', sans-serif",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {tier.price}
                    </p>
                  </div>
                  {tier.badge && (
                    <span className="bg-[#2F6BFF] text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {tier.badge}
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {tier.desc}
                </p>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <MintCheck />
                      <span className="text-sm text-gray-300">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-3">
                  <CTAButton href="#" fullWidth>
                    {tier.cta}
                  </CTAButton>
                  {tier.note && (
                    <p className="text-xs text-gray-500 text-center">{tier.note}</p>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Guarantee ────────────────────────────────────────────────────────────────

function GuaranteeSection() {
  return (
    <section className="bg-[#F5F7FA] py-20 md:py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <FadeIn>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white border border-[#D9DEE7] mb-6">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M11 2L4 5v6c0 4.418 3.134 8.56 7 9.9C14.866 19.56 18 15.418 18 11V5L11 2z"
                stroke="#2F6BFF"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M8 11l2 2 4-4"
                stroke="#40D9A3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2
            className="text-2xl md:text-3xl font-semibold tracking-tight text-[#101114] mb-5"
            style={{ fontFamily: "'Inter Tight', 'Inter', sans-serif" }}
          >
            The Launch-Clarity Guarantee
          </h2>
          <p className="text-base text-gray-600 leading-relaxed mb-4">
            Complete the intake and receive a launch stack with a clear offer,
            price, page structure, visual direction, and launch plan. If the
            stack does not give you that clarity, EMOVEL will revise it once
            within 14 days at no additional cost.
          </p>
          <p className="text-sm text-gray-400 font-mono">
            Clarity and completeness guarantee — not a revenue guarantee.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: "Is this just a prompt pack?",
    a: "No. The prompt logic is part of the system, but the product is a structured launch package. The output is designed to be used for a real page, real offer, and real launch.",
  },
  {
    q: "Do I need a finished product?",
    a: "No. You need a concrete product idea, target buyer, and intended outcome. The stack is especially useful before you overbuild.",
  },
  {
    q: "Will this build my landing page for me?",
    a: "The Core version gives you the page copy and structure. The Premium tier includes review support, but live page implementation is not included in v1.",
  },
  {
    q: "What if I have more than one product idea?",
    a: "Each Launch Stack covers one product idea. Multiple ideas should be processed separately so the offer stays specific.",
  },
  {
    q: "Can agencies use this for clients?",
    a: "Yes. Agencies should use the Premium or Agency License tier depending on whether they need one client stack or repeatable client delivery rights.",
  },
  {
    q: "Is there a revenue guarantee?",
    a: "No. The guarantee covers clarity and completeness of the launch stack. Sales depend on product quality, audience fit, traffic, trust, and follow-through.",
  },
  {
    q: "How fast can I use it?",
    a: "Most buyers can turn the output into a page brief and launch content plan within 24 to 72 hours after completing the intake.",
  },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-white py-24 md:py-28 px-6">
      <div className="max-w-2xl mx-auto">
        <FadeIn className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-semibold tracking-tight text-[#101114]"
            style={{ fontFamily: "'Inter Tight', 'Inter', sans-serif" }}
          >
            Common questions
          </h2>
        </FadeIn>

        <div className="divide-y divide-[#D9DEE7]">
          {FAQ_ITEMS.map((item, i) => (
            <FadeIn key={item.q} delay={i * 40}>
              <div>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left group hover:bg-[#F5F7FA] -mx-4 px-4 rounded transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#2F6BFF] focus-visible:ring-offset-2 focus-visible:outline-none"
                  aria-expanded={open === i}
                >
                  <span className="text-base font-medium text-[#101114] pr-4">
                    {item.q}
                  </span>
                  <span
                    className={cn(
                      "flex-shrink-0 w-5 h-5 transition-transform duration-200",
                      open === i ? "rotate-45" : "rotate-0"
                    )}
                  >
                    <svg viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 4v12M4 10h12"
                        stroke="#2F6BFF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>
                {open === i && (
                  <div className="pb-5 -mt-1 px-4">
                    <p className="text-base text-gray-500 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Closing CTA ──────────────────────────────────────────────────────────────

function ClosingCTA() {
  return (
    <section className="bg-[#20242B] py-24 md:py-28 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <FadeIn>
          <h2
            className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-5"
            style={{ fontFamily: "'Inter Tight', 'Inter', sans-serif" }}
          >
            Get the product out of your head and into the market.
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed mb-10">
            If your idea has been waiting for the right offer, price, page, and
            plan, this is the fastest way to turn it into something buyers can
            understand.
          </p>
          <CTAButton
            href="#pricing"
            className="px-10 py-4 text-lg min-h-[52px] animate-[pulse_2s_ease-in-out_infinite]"
          >
            Get EMOVEL Launch Stack v1
          </CTAButton>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#101114] border-t border-white/10 py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-mono text-sm font-semibold tracking-widest text-gray-400 uppercase">
          EMOVEL
        </span>
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            Contact
          </a>
        </div>
        <p className="text-xs text-gray-600">
          © {new Date().getFullYear()} EMOVEL. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LaunchStackLandingPage() {
  return (
    <>
      <StickyNav />
      <main>
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <DeliverablesSection />
        <BenefitsSection />
        <ProofSection />
        <PricingSection />
        <GuaranteeSection />
        <FAQSection />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}
