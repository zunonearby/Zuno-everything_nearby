"use server";

import { createServerSupabaseClient } from "../../lib/supabase-server";
import { verifyAdminAuthorization } from "../../lib/authGuard";
import { revalidatePath } from "next/cache";

export interface PlatformOrderRecord {
  id: string;
  displayId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  shopId: string;
  shopName: string;
  status: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  itemsSummary: string;
  createdAt: string;
}

export interface OrdersActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Server Action: Fetches all platform orders across all merchant shops.
 * Strictly checks ADMIN or SUPER_ADMIN authorization.
 */
export async function getAllPlatformOrdersAction(
  statusFilter?: string
): Promise<OrdersActionResponse<PlatformOrderRecord[]>> {
  const auth = await verifyAdminAuthorization();
  if (!auth.authorized || !auth.user) {
    return {
      success: false,
      error: auth.error || "Unauthorized: Administrator privileges required.",
      data: [],
    };
  }

  const supabase = createServerSupabaseClient();

  try {
    let query = supabase
      .from("orders")
      .select(`
        id,
        status,
        subtotal,
        delivery_fee,
        total,
        created_at,
        customer_id,
        shop_id,
        profiles:customer_id (
          full_name,
          phone
        ),
        shops:shop_id (
          name
        ),
        payments:payment_id (
          method,
          status
        ),
        order_items (
          product_name_snapshot,
          quantity
        )
      `)
      .order("created_at", { ascending: false });

    if (statusFilter && statusFilter !== "ALL") {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;

    if (error) {
      return {
        success: false,
        error: `Database query error: ${error.message}`,
        data: [],
      };
    }

    const orders: PlatformOrderRecord[] = (data || []).map((ord: any) => {
      const items = ord.order_items || [];
      const itemsSummary =
        items.length > 0
          ? `${items.length} item${items.length > 1 ? "s" : ""} (${items
              .slice(0, 2)
              .map((i: any) => `${i.product_name_snapshot} × ${i.quantity}`)
              .join(", ")}${items.length > 2 ? "..." : ""})`
          : "No items listed";

      return {
        id: ord.id,
        displayId: `#ZN-${ord.id.slice(0, 6).toUpperCase()}`,
        customerId: ord.customer_id,
        customerName: ord.profiles?.full_name || "Verified Customer",
        customerPhone: ord.profiles?.phone || "N/A",
        shopId: ord.shop_id,
        shopName: ord.shops?.name || "Merchant Shop",
        status: ord.status,
        subtotal: Number(ord.subtotal || 0),
        deliveryFee: Number(ord.delivery_fee || 0),
        total: Number(ord.total || 0),
        paymentMethod: ord.payments?.method || "COD",
        paymentStatus: ord.payments?.status || "PENDING",
        itemsSummary,
        createdAt: ord.created_at,
      };
    });

    return {
      success: true,
      data: orders,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to load orders.",
      data: [],
    };
  }
}

/**
 * Server Action: Allows administrator to cancel an order.
 * Lifecycle trigger trigger_enforce_order_integrity verifies allowed status.
 */
export async function adminCancelOrderAction(
  orderId: string,
  reason: string
): Promise<OrdersActionResponse> {
  const auth = await verifyAdminAuthorization();
  if (!auth.authorized || !auth.user) {
    return {
      success: false,
      error: auth.error || "Unauthorized: Administrator privileges required.",
    };
  }

  const supabase = createServerSupabaseClient();

  try {
    const { error } = await supabase
      .from("orders")
      .update({
        status: "CANCELLED",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (error) {
      return {
        success: false,
        error: `Could not cancel order: ${error.message}`,
      };
    }

    // Log administrative action
    try {
      await supabase.from("activity_logs").insert({
        actor_id: auth.user.userId,
        action: "ORDER_ADMIN_CANCELLED",
        entity_type: "orders",
        entity_id: orderId,
        metadata: {
          admin_id: auth.user.userId,
          reason: reason || "Administrative intervention",
        },
      });
    } catch {}

    revalidatePath("/orders");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Order #${orderId.slice(0, 6).toUpperCase()} has been cancelled.`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "An unexpected error occurred cancelling order.",
    };
  }
}
