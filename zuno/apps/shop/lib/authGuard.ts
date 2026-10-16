import { createServerSupabaseClient } from "./supabase-server";
import { redirect } from "next/navigation";

export interface ShopkeeperAuthResult {
  userId: string;
  shopId: string;
  isApproved: boolean;
  approvalStatus: string;
  shopName: string;
}

/**
 * Server-side authorization guard for Shopkeeper Dashboard.
 * Ensures the session exists, belongs to a shopkeeper, and the shop is approved.
 * Redirects unauthenticated users to /login, unapproved users to /status,
 * and unregistered users to /register.
 */
export async function requireApprovedShopkeeper(): Promise<ShopkeeperAuthResult> {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Check shop ownership or membership
  const { data: shop } = await supabase
    .from("shops")
    .select("id, name, is_approved, approval_status, owner_id")
    .eq("owner_id", userId)
    .maybeSingle();

  if (!shop) {
    redirect("/register");
  }

  if (!shop.is_approved || shop.approval_status !== "APPROVED") {
    redirect("/status");
  }

  return {
    userId,
    shopId: shop.id,
    isApproved: Boolean(shop.is_approved),
    approvalStatus: shop.approval_status || "PENDING",
    shopName: shop.name,
  };
}
