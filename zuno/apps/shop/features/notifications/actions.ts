"use server";

import { createServerSupabaseClient } from "../../lib/supabase-server";
import { requireApprovedShopkeeper } from "../../lib/authGuard";

export interface ShopNotification {
  id: string;
  type: "ORDER" | "STOCK" | "SYSTEM";
  title: string;
  message: string;
  timeAgo: string;
  linkHref?: string;
  isUnread: boolean;
}

function formatTimeAgo(isoString: string): string {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch {
    return "Recently";
  }
}

export async function getShopNotificationsAction(): Promise<{
  shop: {
    id: string;
    name: string;
    locality: string;
    pincode: string;
    isActive: boolean;
  };
  pendingCount: number;
  notifications: ShopNotification[];
}> {
  const auth = await requireApprovedShopkeeper();
  const supabase = createServerSupabaseClient();
  const shopId = auth.shopId;

  // 1. Fetch shop info
  const { data: shopRow } = await supabase
    .from("shops")
    .select("id, name, locality, pincode, is_active, created_at")
    .eq("id", shopId)
    .single();

  const shop = {
    id: shopRow?.id || shopId,
    name: shopRow?.name || auth.shopName,
    locality: shopRow?.locality || "Renukoot",
    pincode: shopRow?.pincode || "231217",
    isActive: Boolean(shopRow?.is_active ?? true),
  };

  const notifications: ShopNotification[] = [];

  // 2. Query recent orders for order notifications
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, status, total, created_at")
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false })
    .limit(10);

  let pendingCount = 0;
  if (recentOrders) {
    for (const o of recentOrders) {
      if (o.status === "PLACED") {
        pendingCount++;
        notifications.push({
          id: `order-placed-${o.id}`,
          type: "ORDER",
          title: "New Incoming Order!",
          message: `Order #ORD-${o.id.slice(0, 6).toUpperCase()} for ₹${o.total} requires acceptance and packing.`,
          timeAgo: formatTimeAgo(o.created_at),
          linkHref: "/orders",
          isUnread: true,
        });
      } else if (o.status === "READY_FOR_PICKUP") {
        notifications.push({
          id: `order-ready-${o.id}`,
          type: "ORDER",
          title: "Awaiting Rider Pickup",
          message: `Order #ORD-${o.id.slice(0, 6).toUpperCase()} is packed and waiting for delivery partner assignment.`,
          timeAgo: formatTimeAgo(o.created_at),
          linkHref: "/orders",
          isUnread: false,
        });
      }
    }
  }

  // 3. Query low stock items
  const { data: lowStock } = await supabase
    .from("shop_products")
    .select("id, stock, products(name)")
    .eq("shop_id", shopId)
    .lt("stock", 10)
    .limit(5);

  if (lowStock) {
    for (const item of lowStock as any[]) {
      notifications.push({
        id: `stock-${item.id}`,
        type: "STOCK",
        title: item.stock === 0 ? "Out of Stock Alert" : "Low Inventory Warning",
        message: `${item.products?.name || "Product"} has only ${item.stock} unit(s) remaining in stock.`,
        timeAgo: "Live alert",
        linkHref: "/inventory",
        isUnread: item.stock === 0,
      });
    }
  }

  // 4. System verification notice
  notifications.push({
    id: "system-approval",
    type: "SYSTEM",
    title: "Store Verified & Active",
    message: `${shop.name} is verified for hyperlocal delivery across Renukoot (PIN 231217).`,
    timeAgo: formatTimeAgo(shopRow?.created_at || new Date().toISOString()),
    linkHref: "/shop",
    isUnread: false,
  });

  return {
    shop,
    pendingCount,
    notifications,
  };
}
