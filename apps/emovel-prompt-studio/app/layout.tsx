import type { Metadata } from "next";
import { NavBar } from "@/components/NavBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "EMOVEL",
  description: "Build anything from one prompt."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ background: "#070707" }}>
        {/* Transparent overlay nav; content flows below it */}
        <NavBar />
        {/* Content manages its own top spacing for the fixed nav. */}
        <div className="relative">{children}</div>
      </body>
    </html>
  );
}
