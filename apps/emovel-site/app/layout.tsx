import type { Metadata } from "next";
import { Inter, Inter_Tight, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EMOVEL — Premium AI Launch Systems",
    template: "%s | EMOVEL",
  },
  description:
    "Premium AI-powered launch systems, prompt frameworks, and growth tools for founders, consultants, and operators.",
  metadataBase: new URL("https://emovel.co"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://emovel.co",
    siteName: "EMOVEL",
    title: "EMOVEL — Premium AI Launch Systems",
    description:
      "Premium AI-powered launch systems, prompt frameworks, and growth tools for founders, consultants, and operators.",
  },
  twitter: {
    card: "summary_large_image",
    title: "EMOVEL — Premium AI Launch Systems",
    description:
      "Premium AI-powered launch systems for founders and operators.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} ${ibmPlexMono.variable}`}
    >
      <body className="font-body antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
