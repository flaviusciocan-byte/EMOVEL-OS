import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "EMOVEL Prompt Studio",
  description: "Local EMOVEL-OS interface for turning raw prompts into structured production assets."
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/new-project", label: "New Project" },
  { href: "/projects", label: "Projects" },
  { href: "/execution", label: "Execution" },
  { href: "/builder-workspaces", label: "Builder" },
  { href: "/shop", label: "Shop" }
];

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Fixed background glow layer */}
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
          <div className="absolute inset-0 bg-os-bg" />
          <div
            className="absolute bottom-0 left-1/2 h-[55vh] w-[90vw] -translate-x-1/2 rounded-full opacity-60"
            style={{
              background: "radial-gradient(ellipse at center, rgba(124,58,237,0.18) 0%, rgba(99,102,241,0.06) 50%, transparent 75%)"
            }}
          />
          <div
            className="absolute top-0 right-0 h-[30vh] w-[40vw] opacity-30"
            style={{
              background: "radial-gradient(ellipse at top right, rgba(124,58,237,0.12) 0%, transparent 70%)"
            }}
          />
        </div>

        {/* Floating navbar */}
        <header className="fixed left-0 right-0 top-3 z-50 flex justify-center px-4">
          <nav className="flex items-center gap-0.5 rounded-2xl border border-white/[0.08] bg-black/70 px-3 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(124,58,237,0.06)] backdrop-blur-xl">
            <Link
              className="mr-3 font-mono text-xs font-black uppercase tracking-[0.2em] text-violet-400 transition hover:text-violet-300"
              href="/"
            >
              EMOVEL
            </Link>
            <div className="h-4 w-px bg-white/10 mr-1" />
            {navLinks.map((link) => (
              <Link
                key={link.href}
                className="rounded-xl px-3 py-1.5 text-xs font-semibold text-white/50 transition duration-150 hover:bg-white/[0.06] hover:text-white/90"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </header>

        {/* Page content */}
        <div className="relative z-10 pt-16">
          {children}
        </div>
      </body>
    </html>
  );
}
