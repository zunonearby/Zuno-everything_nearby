import type { ReactNode } from "react";

export const metadata = {
  title: "ZUNO Super Admin",
  description: "Platform control center for ZUNO.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
