"use server";

import { createServerSupabaseClient } from "../../lib/supabase-server";
import { verifyAdminAuthorization } from "../../lib/authGuard";

export interface AnalyticsOperationalData {
  totalOrders: number;
  completedOrders: number;
  totalGmv: number;
  activeShopsCount: number;
  totalCustomers: number;
  posthogConfigured: boolean;
  posthogHost?: string;
}

export interface AnalyticsActionResponse {
  success: boolean;
  data?: AnalyticsOperationalData;
  error?: string;
}

/**
 * Server Action: Calculates operational analytics from live PostgreSQL database records.
 * Reports PostHog integration status without hardcoding fake behavioral funnels.
 */
export async function getPlatformAnalyticsAction(): Promise<AnalyticsActionResponse> {
  const auth = await verifyAdminAuthorization();
  if (!auth.authorized || !auth.user) {
    return {
      success: false,
      error: auth.error || "Unauthorized: Administrator privileges required.",
    };
  }

  const supabase = createServerSupabaseClient();

  try {
    let totalOrders = 0;
    let completedOrders = 0;
    let totalGmv = 0;
    let activeShopsCount = 0;
    let totalCustomers = 0;

    // 1. Orders & GMV
    const { data: orders } = await supabase
      .from("orders")
      .select("id, total, status");

    if (Array.isArray(orders)) {
      totalOrders = orders.length;
      orders.forEach((o) => {
        if (o.status === "DELIVERED") {
          completedOrders++;
        }
        if (o.status !== "CANCELLED" && o.status !== "REJECTED") {
          totalGmv += Number(o.total || 0);
        }
      });
    }

    // 2. Active Shops
    const { count: shopCount } = await supabase
      .from("shops")
      .select("id", { count: "exact", head: true })
      .eq("is_approved", true)
      .eq("is_active", true);

    if (typeof shopCount === "number") {
      activeShopsCount = shopCount;
    }

    // 3. Customers
    const { count: custCount } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "CUSTOMER");

    if (typeof custCount === "number") {
      totalCustomers = custCount;
    }

    const posthogConfigured = Boolean(
      process.env.POSTHOG_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY
    );

    return {
      success: true,
      data: {
        totalOrders,
        completedOrders,
        totalGmv,
        activeShopsCount,
        totalCustomers,
        posthogConfigured,
        posthogHost: process.env.POSTHOG_HOST || "https://app.posthog.com",
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to calculate operational analytics.",
    };
  }
}
