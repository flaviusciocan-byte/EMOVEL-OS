"use client";

import { useState } from "react";

export function EmailCaptureForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire to email provider (ConvertKit, Resend, etc.)
    if (email) setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="text-sm text-[#40D9A3] font-mono">
        ✓ You&apos;re on the list.
      </p>
    );
  }

  return (
    <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 rounded-lg border border-[#D9DEE7] bg-white px-4 py-3 text-sm text-[#101114] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F6BFF] focus:border-transparent"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center bg-[#2F6BFF] text-white font-semibold text-sm rounded-lg px-6 py-3 min-h-[44px] hover:bg-[#1A55E8] transition-colors whitespace-nowrap"
      >
        Notify Me
      </button>
    </form>
  );
}
