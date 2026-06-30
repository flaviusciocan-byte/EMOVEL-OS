import type { Metadata } from "next";
import { FadeIn } from "@/components/FadeIn";
import { EmailCaptureForm } from "@/components/EmailCaptureForm";
import { CTAButton } from "@/components/CTAButton";

export const metadata: Metadata = {
  title: "Prompt Engine",
  description:
    "Turn a raw idea into a controlled prompt package. Intent Map, Prompt Stack, and Builder Handoff — in one structured output.",
};

export default function PromptEnginePage() {
  return (
    <section className="bg-white pt-36 pb-28 md:pt-44 md:pb-36 px-6">
      <div className="max-w-3xl mx-auto">
        <FadeIn>
          <span className="inline-block font-mono text-xs tracking-[0.12em] uppercase text-gray-400 mb-5">
            EMOVEL Systems · Coming Soon
          </span>
        </FadeIn>
        <FadeIn delay={80}>
          <h1
            className="text-4xl md:text-5xl font-bold tracking-[-0.03em] text-[#101114] leading-[1.07] mb-6"
            style={{ fontFamily: "var(--font-inter-tight, 'Inter Tight', sans-serif)" }}
          >
            Turn a raw idea into a controlled prompt package.
          </h1>
        </FadeIn>
        <FadeIn delay={160}>
          <p className="text-xl text-gray-500 leading-relaxed mb-10 max-w-xl">
            The Prompt Engine structures your raw direction into a clear product brief,
            page plan, copy angle, and builder-ready prompt system — in one structured output.
          </p>
        </FadeIn>
        <FadeIn delay={220} className="max-w-md">
          <p className="text-sm font-mono text-[#2F6BFF] mb-4">
            Get notified when this drops.
          </p>
          <EmailCaptureForm />
        </FadeIn>
        <FadeIn delay={300} className="mt-10">
          <CTAButton href="/products" variant="ghost">
            ← Back to Products
          </CTAButton>
        </FadeIn>
      </div>
    </section>
  );
}
