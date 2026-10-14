import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "ZUNO Super Admin Control Center",
  description: "Platform control center for ZUNO.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.ico",
    apple: "/brandlogo.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#F8FAF6] text-[#17231D]">{children}</body>
    </html>
  );
}

