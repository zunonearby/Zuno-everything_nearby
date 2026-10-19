"use server";

import { createServerSupabaseClient } from "../../lib/supabase-server";
import { requireApprovedShopkeeper } from "../../lib/authGuard";
import { revalidatePath } from "next/cache";

export async function getShopSettingsAction(): Promise<{
  shop: {
    id: string;
    name: string;
    locality: string;
    pincode: string;
    phone: string;
    isActive: boolean;
    approvalStatus: string;
  };
  pendingCount: number;
}> {
  const auth = await requireApprovedShopkeeper();
  const supabase = createServerSupabaseClient();
  const shopId = auth.shopId;

  // 1. Fetch shop info
  const { data: shopRow } = await supabase
    .from("shops")
    .select("id, name, locality, pincode, phone, is_active, approval_status")
    .eq("id", shopId)
    .single();

  const shop = {
    id: shopRow?.id || shopId,
    name: shopRow?.name || auth.shopName,
    locality: shopRow?.locality || "Renukoot",
    pincode: shopRow?.pincode || "231217",
    phone: shopRow?.phone || "",
    isActive: Boolean(shopRow?.is_active ?? true),
    approvalStatus: shopRow?.approval_status || "APPROVED",
  };

  // 2. Pending orders count
  const { count: pendingCount } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("shop_id", shopId)
    .eq("status", "PLACED");

  return {
    shop,
    pendingCount: pendingCount || 0,
  };
}

export async function toggleStoreActiveSettingAction(isActive: boolean): Promise<{ success: boolean }> {
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
  revalidatePath("/settings");
  return { success: true };
}
