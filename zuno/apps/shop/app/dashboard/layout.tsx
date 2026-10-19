import React from "react";
import { requireApprovedShopkeeper } from "../../lib/authGuard";

/**
 * Server-side Layout Guard for Shopkeeper Dashboard.
 * Enforces requirement that only APPROVED shops can access dashboard.
 * Unapproved, pending, or rejected shops are redirected to /status.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireApprovedShopkeeper();
  return <>{children}</>;
}

