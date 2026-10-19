"use server";

import { createServerSupabaseClient } from "../../lib/supabase-server";
import { requireApprovedShopkeeper } from "../../lib/authGuard";

export interface TransactionSummary {
  id: string;
  displayId: string;
  createdAt: string;
  customerName: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
}

export async function getShopEarningsAction(): Promise<{
  shop: {
    id: string;
    name: string;
    locality: string;
    pincode: string;
    isActive: boolean;
  };
  pendingCount: number;
  metrics: {
    totalRevenue: number;
    todayRevenue: number;
    settledRevenue: number;
    pendingPayout: number;
    completedOrdersCount: number;
    averageOrderValue: number;
  };
  transactions: TransactionSummary[];
}> {
  const auth = await requireApprovedShopkeeper();
  const supabase = createServerSupabaseClient();
  const shopId = auth.shopId;

  // 1. Fetch shop info
  const { data: shopRow } = await supabase
    .from("shops")
    .select("id, name, locality, pincode, is_active")
    .eq("id", shopId)
    .single();

  const shop = {
    id: shopRow?.id || shopId,
    name: shopRow?.name || auth.shopName,
    locality: shopRow?.locality || "Renukoot",
    pincode: shopRow?.pincode || "231217",
    isActive: Boolean(shopRow?.is_active ?? true),
  };

  // 2. Query all orders for shop
  const { data: ordersRows, error: ordersErr } = await supabase
    .from("orders")
    .select(`
      id,
      customer_id,
      status,
      total,
      payment_method,
      payment_status,
      created_at
    `)
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false });

  if (ordersErr || !ordersRows) {
    return {
      shop,
      pendingCount: 0,
      metrics: {
        totalRevenue: 0,
        todayRevenue: 0,
        settledRevenue: 0,
        pendingPayout: 0,
        completedOrdersCount: 0,
        averageOrderValue: 0,
      },
      transactions: [],
    };
  }

  // Customer names
  const customerIds = Array.from(new Set(ordersRows.map((o: any) => o.customer_id).filter(Boolean)));
  const customerMap = new Map<string, string>();
  if (customerIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", customerIds);
    if (profiles) {
      for (const p of profiles) {
        customerMap.set(p.id, p.full_name || "Customer");
      }
    }
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  let totalRevenue = 0;
  let todayRevenue = 0;
  let settledRevenue = 0;
  let pendingPayout = 0;
  let completedOrdersCount = 0;
  let pendingCount = 0;

  const transactions: TransactionSummary[] = ordersRows.map((row: any) => {
    const amount = Number(row.total || 0);
    const orderTime = new Date(row.created_at).getTime();

    if (row.status === "PLACED") {
      pendingCount++;
    }

    if (row.status !== "CANCELLED" && row.status !== "REJECTED") {
      totalRevenue += amount;
      if (orderTime >= todayStart) {
        todayRevenue += amount;
      }
      if (row.status === "DELIVERED") {
        completedOrdersCount++;
        settledRevenue += amount;
      } else {
        pendingPayout += amount;
      }
    }

    return {
      id: row.id,
      displayId: `#ORD-${row.id.slice(0, 6).toUpperCase()}`,
      createdAt: row.created_at,
      customerName: customerMap.get(row.customer_id) || "Local Customer",
      amount,
      paymentMethod: row.payment_method || "COD",
      paymentStatus: row.payment_status || "PENDING",
      status: row.status || "PLACED",
    };
  });

  const averageOrderValue =
    completedOrdersCount > 0 ? Math.round(settledRevenue / completedOrdersCount) : 0;

  return {
    shop,
    pendingCount,
    metrics: {
      totalRevenue,
      todayRevenue,
      settledRevenue,
      pendingPayout,
      completedOrdersCount,
      averageOrderValue,
    },
    transactions,
  };
}
