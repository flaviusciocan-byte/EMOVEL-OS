import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EMOVEL Launch Stack v1 - Turn Your Product Idea Into A Launch-Ready Offer",
  description:
    "A premium AI-powered launch system that turns a raw product idea into an offer, pricing strategy, landing page copy, visual direction, funnel map, and launch content plan."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
