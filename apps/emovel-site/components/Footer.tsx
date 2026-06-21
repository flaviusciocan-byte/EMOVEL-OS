import Link from "next/link";

const LINKS = [
  { label: "Products", href: "/products" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="bg-[#101114] border-t border-white/10 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Link
          href="/"
          className="font-mono text-sm font-bold tracking-[0.14em] text-[#F5F7FA] uppercase hover:text-[#2F6BFF] transition-colors no-underline"
        >
          EMOVEL
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors no-underline"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-gray-600 font-mono">
          © {new Date().getFullYear()} EMOVEL
        </p>
      </div>
    </footer>
  );
}
