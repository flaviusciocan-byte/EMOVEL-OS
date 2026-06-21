import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "EMOVEL Prompt Studio v1",
  description: "Local EMOVEL-OS interface for turning raw prompts into structured production assets."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-line bg-white">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
            <Link className="font-mono text-sm font-black uppercase tracking-[0.18em]" href="/">
              EMOVEL Prompt Studio
            </Link>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Link className="rounded-emovel px-3 py-2 hover:bg-cloud" href="/">
                Home
              </Link>
              <Link className="rounded-emovel px-3 py-2 hover:bg-cloud" href="/new-project">
                New Project
              </Link>
              <Link className="rounded-emovel px-3 py-2 hover:bg-cloud" href="/projects">
                Projects
              </Link>
              <Link className="rounded-emovel px-3 py-2 hover:bg-cloud" href="/execution">
                Execution
              </Link>
              <Link className="rounded-emovel px-3 py-2 hover:bg-cloud" href="/builder-workspaces">
                Builder Workspaces
              </Link>
              <Link className="rounded-emovel px-3 py-2 hover:bg-cloud" href="/shop">
                Shop
              </Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
