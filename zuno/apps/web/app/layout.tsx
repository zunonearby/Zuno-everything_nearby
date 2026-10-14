import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { brand } from "@zuno/config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://zuno.nearby"),
  title: `${brand.name} — ${brand.tagline} | Hyperlocal Commerce`,
  description:
    "Discover fresh groceries, daily essentials, and local shops in your neighborhood. Fast hyperlocal delivery in Renukoot Central.",
  keywords: [
    "ZUNO",
    "Hyperlocal delivery",
    "Grocery delivery",
    "Renukoot",
    "Local shops",
    "Fresh vegetables",
    "Daily essentials",
  ],
  authors: [{ name: "ZUNO" }],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/brandlogo.png",
  },
  openGraph: {
    title: `${brand.name} — ${brand.tagline}`,
    description:
      "Everything nearby. Discover local neighborhood stores, browse fresh essentials, and order directly via the ZUNO Customer App.",
    url: "https://zuno.nearby",
    siteName: "ZUNO",
    images: [
      {
        url: "/logo-primary.png",
        width: 1200,
        height: 630,
        alt: "ZUNO Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0F5D3A",
};

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/ui/CustomCursor";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#F8FAF6] text-[#17231D] selection:bg-[#EAF4E5] selection:text-[#0F5D3A] min-h-screen flex flex-col justify-between">
        <CustomCursor />
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
