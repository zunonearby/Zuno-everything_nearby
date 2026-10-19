"use server";

import { createServerSupabaseClient } from "../../lib/supabase-server";
import { requireApprovedShopkeeper } from "../../lib/authGuard";
import { revalidatePath } from "next/cache";

export interface ShopProfileData {
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
  createdAt: string;
}

export async function getShopProfileAction(): Promise<{
  shop: ShopProfileData;
  pendingCount: number;
}> {
  const auth = await requireApprovedShopkeeper();
  const supabase = createServerSupabaseClient();
  const shopId = auth.shopId;

  // 1. Fetch shop row
  const { data: shopRow, error: shopErr } = await supabase
    .from("shops")
    .select("id, name, description, phone, address_line, locality, pincode, is_active, approval_status, is_approved, created_at")
    .eq("id", shopId)
    .single();

  if (shopErr || !shopRow) {
    throw new Error("Failed to load shop profile data.");
  }

  // 2. Pending orders count
  const { count: pendingCount } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("shop_id", shopId)
    .eq("status", "PLACED");

  return {
    shop: {
      id: shopRow.id,
      name: shopRow.name,
      description: shopRow.description || "",
      phone: shopRow.phone || "",
      addressLine: shopRow.address_line || "",
      locality: shopRow.locality || "Renukoot",
      pincode: shopRow.pincode || "231217",
      isActive: Boolean(shopRow.is_active ?? true),
      approvalStatus: shopRow.approval_status || "APPROVED",
      isApproved: Boolean(shopRow.is_approved ?? true),
      createdAt: shopRow.created_at || new Date().toISOString(),
    },
    pendingCount: pendingCount || 0,
  };
}

export async function updateShopProfileAction(data: {
  name: string;
  description: string;
  phone: string;
  addressLine: string;
  locality: string;
}): Promise<{ success: boolean; message: string }> {
  const auth = await requireApprovedShopkeeper();
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("shops")
    .update({
      name: data.name.trim(),
      description: data.description.trim(),
      phone: data.phone.trim(),
      address_line: data.addressLine.trim(),
      locality: data.locality.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", auth.shopId);

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  revalidatePath("/dashboard");
  revalidatePath("/shop");
  return { success: true, message: "Shop profile updated successfully." };
}
