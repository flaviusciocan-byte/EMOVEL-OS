import type { Metadata } from "next";
import { FadeIn } from "@/components/FadeIn";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the EMOVEL team.",
};

export default function ContactPage() {
  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32 px-6">
      <div className="max-w-xl mx-auto">
        <FadeIn className="mb-12">
          <span className="block font-mono text-xs tracking-[0.12em] uppercase text-[#2F6BFF] mb-4">
            Contact
          </span>
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight text-[#101114] mb-5"
            style={{ fontFamily: "var(--font-inter-tight, 'Inter Tight', sans-serif)" }}
          >
            Get in touch.
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            For product questions, partnership inquiries, or anything else — send a message
            and we will respond within 1–2 business days.
          </p>
        </FadeIn>

        <FadeIn delay={100}>
          <ContactForm />
        </FadeIn>
      </div>
    </div>
  );
}
