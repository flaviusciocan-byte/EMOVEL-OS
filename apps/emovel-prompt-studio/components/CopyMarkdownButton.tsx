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
      className="rounded-emovel border border-line bg-white px-4 py-2 text-xs font-black text-ink transition hover:bg-cloud disabled:cursor-not-allowed disabled:opacity-50"
      disabled={!content}
      onClick={copyMarkdown}
      type="button"
    >
      {label}
    </button>
  );
}
