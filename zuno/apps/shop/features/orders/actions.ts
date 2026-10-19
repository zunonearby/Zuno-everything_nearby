"use server";

import { createServerSupabaseClient } from "../../lib/supabase-server";
import { requireApprovedShopkeeper } from "../../lib/authGuard";
import { revalidatePath } from "next/cache";

export interface OrderItemDetail {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit: string;
}

export interface ShopOrderDetail {
  id: string;
  displayId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItemDetail[];
  itemsSummary: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
  timeAgo: string;
  deliveryPartner?: {
    fullName: string;
    phone: string;
    vehicleType: string;
    vehicleNumber: string;
    deliveryStatus: string;
  } | null;
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

export async function getShopOrdersAction(): Promise<{
  shop: {
    id: string;
    name: string;
    locality: string;
    pincode: string;
    isActive: boolean;
  };
  orders: ShopOrderDetail[];
  pendingCount: number;
}> {
  const auth = await requireApprovedShopkeeper();
  const supabase = createServerSupabaseClient();
  const shopId = auth.shopId;

  // 1. Fetch Shop details
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

  // 2. Fetch Orders for this shop
  const { data: ordersRows, error: ordersErr } = await supabase
    .from("orders")
    .select(`
      id,
      customer_id,
      status,
      subtotal,
      delivery_fee,
      total,
      payment_method,
      payment_status,
      delivery_address,
      created_at,
      order_items (
        id,
        quantity,
        unit_price,
        total_price,
        products (
          id,
          name,
          unit
        )
      ),
      deliveries (
        id,
        status,
        delivery_partners (
          id,
          full_name,
          phone,
          vehicle_type,
          vehicle_number
        )
      )
    `)
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false });

  if (ordersErr || !ordersRows) {
    console.warn("[Orders] Error querying shop orders:", ordersErr);
    return { shop, orders: [], pendingCount: 0 };
  }

  // Fetch customer names from profiles
  const customerIds = Array.from(new Set(ordersRows.map((o: any) => o.customer_id).filter(Boolean)));
  const customerMap = new Map<string, { fullName: string; phone: string }>();

  if (customerIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, phone")
      .in("id", customerIds);

    if (profiles) {
      for (const p of profiles) {
        customerMap.set(p.id, {
          fullName: p.full_name || "Customer",
          phone: p.phone || "",
        });
      }
    }
  }

  let pendingCount = 0;
  const orders: ShopOrderDetail[] = ordersRows.map((row: any) => {
    if (row.status === "PLACED") {
      pendingCount++;
    }

    const items: OrderItemDetail[] = (row.order_items || []).map((oi: any) => ({
      id: oi.id,
      productName: oi.products?.name || "Grocery Item",
      quantity: Number(oi.quantity || 1),
      unitPrice: Number(oi.unit_price || 0),
      totalPrice: Number(oi.total_price || 0),
      unit: oi.products?.unit || "unit",
    }));

    const itemsSummary =
      items.length > 0
        ? items.map((i) => `${i.productName} × ${i.quantity}`).join(", ")
        : "Standard order items";

    const customer = customerMap.get(row.customer_id);

    let deliveryPartner = null;
    const delivery = Array.isArray(row.deliveries) ? row.deliveries[0] : row.deliveries;
    if (delivery?.delivery_partners) {
      const dp = delivery.delivery_partners;
      deliveryPartner = {
        fullName: dp.full_name || "Delivery Partner",
        phone: dp.phone || "",
        vehicleType: dp.vehicle_type || "Two Wheeler",
        vehicleNumber: dp.vehicle_number || "UP-64",
        deliveryStatus: delivery.status || "ASSIGNED",
      };
    }

    return {
      id: row.id,
      displayId: `#ORD-${row.id.slice(0, 6).toUpperCase()}`,
      customerName: customer?.fullName || "Local Customer",
      customerPhone: customer?.phone || "",
      deliveryAddress: typeof row.delivery_address === "string" ? row.delivery_address : JSON.stringify(row.delivery_address || ""),
      items,
      itemsSummary,
      subtotal: Number(row.subtotal || 0),
      deliveryFee: Number(row.delivery_fee || 0),
      total: Number(row.total || 0),
      paymentMethod: row.payment_method || "COD",
      paymentStatus: row.payment_status || "PENDING",
      status: row.status || "PLACED",
      createdAt: row.created_at,
      timeAgo: formatTimeAgo(row.created_at),
      deliveryPartner,
    };
  });

  return {
    shop,
    orders,
    pendingCount,
  };
}

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
