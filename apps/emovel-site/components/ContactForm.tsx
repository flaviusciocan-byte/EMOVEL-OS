"use client";

import { useState } from "react";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire to Resend, Formspree, or similar
    if (form.email && form.message) setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-[#40D9A3]/30 bg-[#40D9A3]/5 p-6">
        <p className="font-mono text-sm text-[#40D9A3] mb-1">Message sent.</p>
        <p className="text-sm text-gray-500">We will respond within 1–2 business days.</p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-lg border border-[#D9DEE7] bg-white px-4 py-3 text-sm text-[#101114] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F6BFF] focus:border-transparent transition-all";

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-[#101114] mb-2">
          Name
        </label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Your name"
          className={inputCls}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#101114] mb-2">
          Email
        </label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="your@email.com"
          className={inputCls}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#101114] mb-2">
          Message
        </label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="What can we help with?"
          className={inputCls + " resize-none"}
        />
      </div>
      <button
        type="submit"
        className="w-full inline-flex items-center justify-center bg-[#2F6BFF] text-white font-semibold rounded-lg px-6 py-3.5 min-h-[44px] hover:bg-[#1A55E8] transition-colors text-sm"
      >
        Send Message
      </button>
      <p className="text-xs text-gray-400">
        We respond within 1–2 business days.
      </p>
    </form>
  );
}
