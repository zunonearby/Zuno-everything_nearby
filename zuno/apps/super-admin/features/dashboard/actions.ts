"use server";

import { createServerSupabaseClient } from "../../lib/supabase-server";
import { verifyAdminAuthorization } from "../../lib/authGuard";

export interface SuperAdminDashboardMetrics {
  totalCustomers: number;
  approvedShopsCount: number;
  pendingShopsCount: number;
  activeShopsCount: number;
  todayOrdersCount: number;
  todayGmv: number;
  activeDeliveriesCount: number;
}

export interface SuperAdminOrderSummary {
  id: string;
  displayId: string;
  customerName: string;
  customerPhone?: string;
  shopName: string;
  amount: number;
  status: string;
  createdAt: string;
  timeAgo: string;
}

export interface SuperAdminShopSummary {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  locality: string;
  pincode: string;
  approvalStatus: string;
  isActive: boolean;
  createdAt: string;
}

export interface SuperAdminActivityLogSummary {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  action: string;
  createdAt: string;
}

export interface SuperAdminDashboardData {
  metrics: SuperAdminDashboardMetrics;
  recentOrders: SuperAdminOrderSummary[];
  recentShops: SuperAdminShopSummary[];
  recentActivity: SuperAdminActivityLogSummary[];
  admin: {
    fullName: string;
    role: string;
  };
  error?: string;
}

function formatTimeAgo(isoString: string): string {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } catch {
    return "Recently";
  }
}

/**
 * Server Action: Fetches real platform operational data for Super Admin.
 * Strictly checks ADMIN or SUPER_ADMIN authorization server-side.
 */
export async function getSuperAdminDashboardDataAction(): Promise<SuperAdminDashboardData> {
  const auth = await verifyAdminAuthorization();
  if (!auth.authorized || !auth.user) {
    throw new Error(auth.error || "Unauthorized: Administrator privileges required.");
  }

  const supabase = createServerSupabaseClient();

  // Date boundaries for today (local midnight)
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  let totalCustomers = 0;
  let approvedShopsCount = 0;
  let pendingShopsCount = 0;
  let activeShopsCount = 0;
  let todayOrdersCount = 0;
  let todayGmv = 0;
  let activeDeliveriesCount = 0;

  // 1. Total Registered Customers
  try {
    const { count, error } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "CUSTOMER");
    if (!error && typeof count === "number") {
      totalCustomers = count;
    }
  } catch (err) {
    console.warn("[SuperAdmin] Error fetching customer count:", err);
  }

  // 2. Shops breakdown (Approved, Pending, Active/Online)
  try {
    const { data: shops, error } = await supabase
      .from("shops")
      .select("id, is_approved, approval_status, is_active");

    if (!error && Array.isArray(shops)) {
      shops.forEach((s) => {
        if (s.approval_status === "PENDING" && !s.is_approved) {
          pendingShopsCount++;
        }
        if (s.approval_status === "APPROVED" || s.is_approved) {
          approvedShopsCount++;
          if (s.is_active) {
            activeShopsCount++;
          }
        }
      });
    }
  } catch (err) {
    console.warn("[SuperAdmin] Error fetching shop metrics:", err);
  }

  // 3. Orders & GMV Today
  let recentOrders: SuperAdminOrderSummary[] = [];
  try {
    const { data: ordersData, error: ordersErr } = await supabase
      .from("orders")
      .select(`
        id,
        total,
        status,
        created_at,
        customer_id,
        shop_id,
        profiles:customer_id (
          full_name,
          phone
        ),
        shops:shop_id (
          name
        )
      `)
      .order("created_at", { ascending: false })
      .limit(20);

    if (!ordersErr && Array.isArray(ordersData)) {
      ordersData.forEach((ord: any) => {
        const isToday = ord.created_at >= startOfDay;
        const total = Number(ord.total || 0);

        if (isToday) {
          todayOrdersCount++;
          if (ord.status !== "CANCELLED" && ord.status !== "REJECTED") {
            todayGmv += total;
          }
        }

        const customerName =
          ord.profiles?.full_name ||
          (ord.profiles?.phone ? `Customer (${ord.profiles.phone.slice(-4)})` : "Verified Customer");

        const shopName = ord.shops?.name || "Merchant Shop";

        recentOrders.push({
          id: ord.id,
          displayId: `#ZN-${ord.id.slice(0, 6).toUpperCase()}`,
          customerName,
          customerPhone: ord.profiles?.phone,
          shopName,
          amount: total,
          status: ord.status,
          createdAt: ord.created_at,
          timeAgo: formatTimeAgo(ord.created_at),
        });
      });
    }
  } catch (err) {
    console.warn("[SuperAdmin] Error fetching platform orders:", err);
  }

  // 4. Active Deliveries
  try {
    const { count, error } = await supabase
      .from("deliveries")
      .select("id", { count: "exact", head: true })
      .in("status", ["ASSIGNED", "PICKED_UP", "OUT_FOR_DELIVERY"]);

    if (!error && typeof count === "number") {
      activeDeliveriesCount = count;
    }
  } catch (err) {
    console.warn("[SuperAdmin] Error fetching active deliveries:", err);
  }

  // 5. Recent Shops for Review
  let recentShops: SuperAdminShopSummary[] = [];
  try {
    const { data: shopsData, error: shopsErr } = await supabase
      .from("shops")
      .select(`
        id,
        name,
        phone,
        locality,
        pincode,
        approval_status,
        is_active,
        created_at,
        profiles:owner_id (
          full_name,
          phone
        )
      `)
      .order("created_at", { ascending: false })
      .limit(6);

    if (!shopsErr && Array.isArray(shopsData)) {
      recentShops = shopsData.map((s: any) => ({
        id: s.id,
        name: s.name,
        ownerName: s.profiles?.full_name || "Shopkeeper",
        phone: s.phone || s.profiles?.phone || "N/A",
        locality: s.locality || "Renukoot",
        pincode: s.pincode || "231217",
        approvalStatus: s.approval_status || "PENDING",
        isActive: Boolean(s.is_active),
        createdAt: s.created_at,
      }));
    }
  } catch (err) {
    console.warn("[SuperAdmin] Error fetching recent shops:", err);
  }

  // 6. Recent Activity Logs
  let recentActivity: SuperAdminActivityLogSummary[] = [];
  try {
    const { data: logsData, error: logsErr } = await supabase
      .from("activity_logs")
      .select(`
        id,
        action,
        entity_type,
        entity_id,
        metadata,
        created_at
      `)
      .order("created_at", { ascending: false })
      .limit(8);

    if (!logsErr && Array.isArray(logsData)) {
      recentActivity = logsData.map((log: any) => {
        let title = log.action.replace(/_/g, " ");
        let description = `${log.entity_type} ID: ${String(log.entity_id).slice(0, 8)}...`;
        if (log.metadata?.shop_name) {
          description = `Shop "${log.metadata.shop_name}" status changed to ${log.metadata.new_status}`;
        }
        return {
          id: log.id,
          title,
          description,
          action: log.action,
          timeAgo: formatTimeAgo(log.created_at),
          createdAt: log.created_at,
        };
      });
    }
  } catch (err) {
    console.warn("[SuperAdmin] Error fetching activity logs:", err);
  }

  return {
    metrics: {
      totalCustomers,
      approvedShopsCount,
      pendingShopsCount,
      activeShopsCount,
      todayOrdersCount,
      todayGmv,
      activeDeliveriesCount,
    },
    recentOrders,
    recentShops,
    recentActivity,
    admin: {
      fullName: auth.user.fullName,
      role: auth.user.role,
    },
  };
}
