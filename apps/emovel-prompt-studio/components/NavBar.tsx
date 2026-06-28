"use client";

import Link from "next/link";
import { useState } from "react";
import { CommandCenter } from "@/components/CommandCenter";

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.25" />
      <rect x="9" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.25" />
      <rect x="1.5" y="9" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.25" />
      <rect x="9" y="9" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="2.25" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M8 1.5V3M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.06 1.06M11.54 11.54l1.06 1.06M3.4 12.6l1.06-1.06M11.54 4.46l1.06-1.06"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function NavBar() {
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 px-8 py-5">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-black uppercase tracking-[0.2em] text-white transition-opacity duration-200 hover:opacity-70"
            aria-label="EMOVEL home"
          >
            EMOVEL
          </Link>

          <div className="flex items-center gap-1">
            <Link
              href="/prompt-engine"
              className="px-3.5 py-2 text-sm font-medium text-white/50 transition-colors duration-200 hover:text-white/90"
            >
              Prompt Engine
            </Link>
            <Link
              href="/projects"
              className="px-3.5 py-2 text-sm font-medium text-white/50 transition-colors duration-200 hover:text-white/90"
            >
              Projects
            </Link>

            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              aria-label="Command Center"
              aria-expanded={commandOpen}
              aria-haspopup="dialog"
              title="Command Center (Cmd/Ctrl+K)"
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${
                commandOpen
                  ? "bg-white/[0.08] text-white"
                  : "text-white/45 hover:bg-white/[0.06] hover:text-white/85"
              }`}
            >
              <GridIcon />
            </button>

            <Link
              href="/settings"
              aria-label="Settings"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white/45 transition-all duration-200 hover:bg-white/[0.06] hover:text-white/85"
            >
              <GearIcon />
            </Link>
          </div>
        </div>
      </header>

      <CommandCenter open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}
