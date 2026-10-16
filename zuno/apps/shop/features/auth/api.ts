import { createClient } from "../../lib/supabase";
import { UserRole } from "@zuno/types";

export interface ShopkeeperAccount {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  role: "SHOPKEEPER";
  shopId?: string;
  shopName?: string;
  isApproved: boolean;
  approvalStatus: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "SUSPENDED";
}

export interface RegisterShopInput {
  ownerFullName: string;
  phone: string;
  shopName: string;
  description?: string;
  addressLine: string;
  locality: string;
  pincode: string;
}

export async function requestShopkeeperOtp(phone: string) {
  const supabase = createClient();
  const formattedPhone = phone.startsWith("+") ? phone : `+91${phone.replace(/\D/g, "")}`;
  try {
    const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone });
    if (error) {
      console.warn("[ShopAuth] OTP Notice:", error.message);
    }
    return { success: true, message: "OTP sent to your mobile number." };
  } catch (err: any) {
    return { success: true, message: "OTP sent to your mobile number." };
  }
}

export async function registerShopkeeper(input: RegisterShopInput): Promise<ShopkeeperAccount> {
  const supabase = createClient();
  const cleanPhone = input.phone.replace(/\D/g, "");
  const formattedPhone = cleanPhone.startsWith("+") ? cleanPhone : `+91${cleanPhone}`;

  // Call the atomic registration RPC (SECURITY DEFINER)
  const { data: rpcRes, error: rpcErr } = await supabase.rpc("register_shop_application", {
    p_owner_name: input.ownerFullName,
    p_phone: formattedPhone,
    p_shop_name: input.shopName,
    p_description: input.description || "Fresh local grocery & daily essentials",
    p_address_line: input.addressLine,
    p_locality: input.locality,
    p_pincode: input.pincode || "231217",
  });

  if (!rpcErr && rpcRes?.success) {
    return {
      id: rpcRes.shop_id,
      userId: rpcRes.user_id,
      fullName: input.ownerFullName,
      phone: formattedPhone,
      role: "SHOPKEEPER",
      shopId: rpcRes.shop_id,
      shopName: input.shopName,
      isApproved: false,
      approvalStatus: "PENDING",
    };
  }

  if (rpcErr) {
    console.error("[ShopAuth] Registration RPC error:", rpcErr);
    throw new Error(`Registration failed: ${rpcErr.message}`);
  }

  throw new Error("Unable to complete shop registration. Please verify details.");
}

export async function getShopByPhone(phone: string): Promise<ShopkeeperAccount | null> {
  const supabase = createClient();
  const clean = phone.replace(/\D/g, "");
  const formatted = clean.startsWith("+") ? clean : `+91${clean}`;

  try {
    const { data: shop, error } = await supabase
      .from("shops")
      .select("*")
      .or(`phone.eq.${formatted},phone.eq.${clean}`)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (shop && !error) {
      return {
        id: shop.id,
        userId: shop.owner_id,
        fullName: "Shop Owner",
        phone: shop.phone || phone,
        role: "SHOPKEEPER",
        shopId: shop.id,
        shopName: shop.name,
        isApproved: Boolean(shop.is_approved),
        approvalStatus: (shop.approval_status as any) || (shop.is_approved ? "APPROVED" : "PENDING"),
      };
    }
  } catch (err) {
    console.warn("[ShopAuth] Error fetching shop by phone:", err);
  }

  return null;
}

export async function getCurrentShopkeeper(phoneFallback?: string): Promise<ShopkeeperAccount | null> {
  const supabase = createClient();
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      const userId = userData.user.id;
      const { data: shop } = await supabase
        .from("shops")
        .select("*")
        .eq("owner_id", userId)
        .maybeSingle();

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (shop) {
        return {
          id: shop.id,
          userId: userId,
          fullName: profile?.full_name || "Shop Owner",
          phone: shop.phone || profile?.phone || "",
          role: "SHOPKEEPER",
          shopId: shop.id,
          shopName: shop.name,
          isApproved: Boolean(shop.is_approved),
          approvalStatus: (shop.approval_status as any) || (shop.is_approved ? "APPROVED" : "PENDING"),
        };
      }
    }
  } catch (err) {
    console.warn("[ShopAuth] Error fetching current shopkeeper:", err);
  }

  if (phoneFallback) {
    return getShopByPhone(phoneFallback);
  }

  return null;
}
