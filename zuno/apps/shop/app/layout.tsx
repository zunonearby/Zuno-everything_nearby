import type { ReactNode } from "react";

export const metadata = {
  title: "ZUNO Shop Dashboard",
  description: "Manage your shop on ZUNO.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
