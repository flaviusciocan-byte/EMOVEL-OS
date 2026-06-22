"use client";

import { useState } from "react";

type CopyMarkdownButtonProps = {
  content: string;
  labelText?: string;
  copiedText?: string;
};

export function CopyMarkdownButton({
  content,
  labelText = "Copy markdown",
  copiedText = "Copied"
}: CopyMarkdownButtonProps) {
  const [label, setLabel] = useState(labelText);

  async function copyMarkdown() {
    await navigator.clipboard.writeText(content);
    setLabel(copiedText);
    window.setTimeout(() => setLabel(labelText), 1600);
  }

  return (
    <button
      className="cursor-pointer rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2 text-xs font-bold text-white/50 transition duration-200 hover:border-violet-500/25 hover:bg-violet-500/[0.08] hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
      disabled={!content}
      onClick={copyMarkdown}
      type="button"
    >
      {label}
    </button>
  );
}
