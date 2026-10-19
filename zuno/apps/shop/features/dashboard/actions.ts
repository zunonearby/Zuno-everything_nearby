"use server";

import { createServerSupabaseClient } from "../../lib/supabase-server";
import { requireApprovedShopkeeper } from "../../lib/authGuard";
import { revalidatePath } from "next/cache";

export interface DashboardMetricSummary {
  todayRevenue: number;
  todayOrdersCount: number;
  fulfilledOrdersCount: number;
  pendingOrdersCount: number;
  ratingDisplay: string;
  reviewCount: number;
}

export interface DashboardOrderSummary {
  id: string;
  displayId: string;
  customerName: string;
  itemsSummary: string;
  amount: number;
  status: string;
  createdAt: string;
  timeAgo: string;
}

export interface DashboardDeliveryRiderSummary {
  fullName: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  orderDisplayId: string;
  status: string;
}

export interface DashboardProductSummary {
  id: string;
  name: string;
  categoryName: string;
  price: number;
  unit: string;
  stock: number;
  isAvailable: boolean;
  imageUrl?: string | null;
}

export interface DashboardData {
  shop: {
    id: string;
    name: string;
    description: string;
    phone: string;
    addressLine: string;
    locality: string;
    pincode: string;
    isActive: boolean;
    approvalStatus: string;
    isApproved: boolean;
  };
  metrics: DashboardMetricSummary;
  recentOrders: DashboardOrderSummary[];
  assignedRider: DashboardDeliveryRiderSummary | null;
  featuredProducts: DashboardProductSummary[];
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
 * Server Action: Fetches real, persisted data for the authenticated shopkeeper.
 * Strictly scoped to the authenticated user's shop in Supabase.
 */
export async function getShopDashboardDataAction(): Promise<DashboardData> {
  // Enforces session & approval verification server-side
  const auth = await requireApprovedShopkeeper();
  const supabase = createServerSupabaseClient();
  const shopId = auth.shopId;

  // 1. Fetch live Shop Profile
  const { data: shopRow, error: shopErr } = await supabase
    .from("shops")
    .select("id, name, description, phone, address_line, locality, pincode, is_active, approval_status, is_approved")
    .eq("id", shopId)
    .single();

  const shop = {
    id: shopRow?.id || shopId,
    name: shopRow?.name || auth.shopName,
    description: shopRow?.description || "",
    phone: shopRow?.phone || "",
    addressLine: shopRow?.address_line || "",
    locality: shopRow?.locality || "Renukoot",
    pincode: shopRow?.pincode || "231217",
    isActive: Boolean(shopRow?.is_active ?? true),
    approvalStatus: shopRow?.approval_status || "APPROVED",
    isApproved: Boolean(shopRow?.is_approved ?? true),
  };

  // 2. Fetch live Orders belonging to this shop
  let recentOrders: DashboardOrderSummary[] = [];
  let todayRevenue = 0;
  let todayOrdersCount = 0;
  let fulfilledOrdersCount = 0;
  let pendingOrdersCount = 0;

  // Local start of day (midnight) in Asia/Kolkata (or local system time)
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  try {
    const { data: ordersData, error: ordersErr } = await supabase
      .from("orders")
      .select(`
        id,
        status,
        subtotal,
        delivery_fee,
        total,
        created_at,
        customer_id,
        profiles:customer_id (
          full_name,
          phone
        ),
        order_items (
          id,
          product_name_snapshot,
          quantity,
          subtotal
        )
      `)
      .eq("shop_id", shopId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (!ordersErr && Array.isArray(ordersData)) {
      ordersData.forEach((order: any) => {
        const isToday = order.created_at >= startOfDay;
        const totalAmount = Number(order.total || 0);

        if (isToday) {
          todayOrdersCount++;
          // Do not count CANCELLED or REJECTED orders in revenue
          if (order.status !== "CANCELLED" && order.status !== "REJECTED") {
            todayRevenue += totalAmount;
          }
          if (order.status === "DELIVERED") {
            fulfilledOrdersCount++;
          }
        }

        if (order.status === "PLACED" || order.status === "ACCEPTED" || order.status === "PREPARING") {
          pendingOrdersCount++;
        }

        // Build item summary from historical snapshot
        const items = order.order_items || [];
        const itemsSummary =
          items.length > 0
            ? `${items.length} item${items.length > 1 ? "s" : ""} (${items
                .slice(0, 3)
                .map((i: any) => `${i.product_name_snapshot} × ${i.quantity}`)
                .join(", ")}${items.length > 3 ? "..." : ""})`
            : "No item details";

        const customerName =
          order.profiles?.full_name ||
          (order.profiles?.phone ? `Customer (${order.profiles.phone.slice(-4)})` : "Verified Customer");

        recentOrders.push({
          id: order.id,
          displayId: `#ZN-${order.id.slice(0, 6).toUpperCase()}`,
          customerName,
          itemsSummary,
          amount: totalAmount,
          status: order.status,
          createdAt: order.created_at,
          timeAgo: formatTimeAgo(order.created_at),
        });
      });
    }
  } catch (err) {
    console.warn("[Dashboard] Error querying orders from database:", err);
  }

  // 3. Fetch live Delivery Partner Assignment (if any out for delivery)
  let assignedRider: DashboardDeliveryRiderSummary | null = null;
  try {
    const { data: deliveryData } = await supabase
      .from("deliveries")
      .select(`
        id,
        status,
        order_id,
        delivery_partner_id,
        delivery_partners (
          id,
          full_name,
          phone,
          vehicle_type,
          vehicle_number
        ),
        orders!inner (
          id,
          shop_id,
          status
        )
      `)
      .eq("orders.shop_id", shopId)
      .in("status", ["ASSIGNED", "PICKED_UP", "OUT_FOR_DELIVERY"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (deliveryData?.delivery_partners) {
      const partner = deliveryData.delivery_partners as any;
      assignedRider = {
        fullName: partner.full_name || "Delivery Partner",
        phone: partner.phone || "",
        vehicleType: partner.vehicle_type || "Two Wheeler",
        vehicleNumber: partner.vehicle_number || "",
        orderDisplayId: `#ZN-${deliveryData.order_id.slice(0, 6).toUpperCase()}`,
        status: deliveryData.status,
      };
    }
  } catch (err) {
    console.warn("[Dashboard] Error querying deliveries:", err);
  }

  // 4. Fetch live Shop Products & Inventory
  let featuredProducts: DashboardProductSummary[] = [];
  try {
    const { data: spData, error: spErr } = await supabase
      .from("shop_products")
      .select(`
        id,
        price,
        stock,
        available,
        products (
          id,
          name,
          unit,
          image_url,
          categories (
            name
          )
        )
      `)
      .eq("shop_id", shopId)
      .order("stock", { ascending: false })
      .limit(8);

    if (!spErr && Array.isArray(spData)) {
      featuredProducts = spData
        .filter((sp: any) => sp.products)
        .map((sp: any) => ({
          id: sp.id,
          name: sp.products.name,
          categoryName: sp.products.categories?.name || "General",
          price: Number(sp.price || 0),
          unit: sp.products.unit || "unit",
          stock: Number(sp.stock || 0),
          isAvailable: Boolean(sp.available && sp.stock > 0),
          imageUrl: sp.products.image_url,
        }));
    }
  } catch (err) {
    console.warn("[Dashboard] Error querying shop products:", err);
  }

  return {
    shop,
    metrics: {
      todayRevenue,
      todayOrdersCount,
      fulfilledOrdersCount,
      pendingOrdersCount,
      // Honest representation of schema limitation: No reviews/ratings table exists
      ratingDisplay: "N/A",
      reviewCount: 0,
    },
    recentOrders,
    assignedRider,
    featuredProducts,
  };
}

/**
 * Server Action: Toggles live store active status in public.shops.
 */
export async function toggleShopOnlineStatusAction(isActive: boolean): Promise<{ success: boolean; isActive: boolean }> {
  const auth = await requireApprovedShopkeeper();
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("shops")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", auth.shopId);

  if (error) {
    throw new Error(`Failed to update store status: ${error.message}`);
  }

  revalidatePath("/dashboard");
  return { success: true, isActive };
}

/**
 * Server Action: Updates order status for an order belonging to the authenticated shop.
 * Enforces shop ownership and updates Supabase orders table.
 */
export async function updateShopOrderStatusAction(
  orderId: string,
  nextStatus: string
): Promise<{ success: boolean; message: string }> {
  const auth = await requireApprovedShopkeeper();
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("orders")
    .update({ status: nextStatus, updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .eq("shop_id", auth.shopId);

  if (error) {
    throw new Error(`Failed to update order status: ${error.message}`);
  }

  revalidatePath("/dashboard");
  revalidatePath("/orders");
  return { success: true, message: `Order status updated to ${nextStatus}.` };
}

