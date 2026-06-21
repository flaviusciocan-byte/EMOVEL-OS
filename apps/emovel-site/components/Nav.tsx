"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Products", href: "/products" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function cn(...cls: (string | false | undefined)[]) {
  return cls.filter(Boolean).join(" ");
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 56);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || open
          ? "bg-white border-b border-[#D9DEE7] shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-mono text-sm font-bold tracking-[0.14em] text-[#101114] uppercase hover:text-[#2F6BFF] transition-colors no-underline"
        >
          EMOVEL
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm font-medium transition-colors no-underline",
                pathname === l.href || pathname.startsWith(l.href + "/")
                  ? "text-[#2F6BFF]"
                  : "text-[#101114] hover:text-[#2F6BFF]"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/products/launch-stack"
            className="inline-flex items-center justify-center bg-[#2F6BFF] text-white text-sm font-semibold rounded-lg px-5 py-2.5 min-h-[38px] hover:bg-[#1A55E8] hover:scale-[1.01] transition-all duration-150 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] focus-visible:ring-offset-2"
          >
            Get Launch Stack
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-[#101114] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6BFF] rounded"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {open ? (
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <>
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#D9DEE7] bg-white px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-base font-medium py-1 no-underline",
                pathname === l.href ? "text-[#2F6BFF]" : "text-[#101114]"
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/products/launch-stack"
            className="inline-flex items-center justify-center bg-[#2F6BFF] text-white text-sm font-semibold rounded-lg px-5 py-3 min-h-[44px] no-underline mt-2"
          >
            Get Launch Stack
          </Link>
        </div>
      )}
    </header>
  );
}
