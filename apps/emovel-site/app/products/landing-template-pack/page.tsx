import type { Metadata } from "next";
import { FadeIn } from "@/components/FadeIn";
import { CTAButton } from "@/components/CTAButton";
import { EmailCaptureForm } from "@/components/EmailCaptureForm";

export const metadata: Metadata = {
  title: "Landing Template Pack",
  description:
    "Premium Next.js landing page templates built on the EMOVEL UI system. Coming soon.",
};

export default function LandingTemplatePackPage() {
  return (
    <section className="bg-white pt-36 pb-28 md:pt-44 md:pb-36 px-6">
      <div className="max-w-3xl mx-auto">
        <FadeIn>
          <span className="inline-block font-mono text-xs tracking-[0.12em] uppercase text-gray-400 mb-5">
            EMOVEL Templates · Coming Soon
          </span>
        </FadeIn>
        <FadeIn delay={80}>
          <h1
            className="text-4xl md:text-5xl font-bold tracking-[-0.03em] text-[#101114] leading-[1.07] mb-6"
            style={{ fontFamily: "var(--font-inter-tight, 'Inter Tight', sans-serif)" }}
          >
            Premium Next.js landing pages, ready to deploy.
          </h1>
        </FadeIn>
        <FadeIn delay={160}>
          <p className="text-xl text-gray-500 leading-relaxed mb-10 max-w-xl">
            Conversion-optimised landing page templates built on the EMOVEL UI system.
            Tailwind + shadcn/ui. Mobile-first. One-click deploy to Vercel.
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
