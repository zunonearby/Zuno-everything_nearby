import { createClient } from "../../lib/supabase";
import { normalizePhoneE164 } from "@zuno/validation";

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

export async function requestShopkeeperOtp(phone: string): Promise<{ success: boolean; message: string }> {
  const supabase = createClient();
  const clean10 = phone.replace(/\D/g, "").slice(-10);
  if (clean10.length < 10) {
    throw new Error("Please enter a valid 10-digit mobile number.");
  }
  const formattedPhone = normalizePhoneE164(clean10);

  try {
    const { error: phoneErr } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });

    if (phoneErr) {
      const errMsg = phoneErr.message || "";
      const errCode = (phoneErr as any).code || (phoneErr as any).error_code;
      if (
        errMsg.toLowerCase().includes("unsupported phone provider") ||
        errCode === "phone_provider_disabled" ||
        phoneErr.status === 400
      ) {
        throw new Error(
          "Supabase SMS phone provider is currently disabled. Please enable the Phone provider in your Supabase Dashboard (under Authentication > Providers > Phone) or configure a Test Phone Number (e.g. +918887602317 with code 123456)."
        );
      }
      throw new Error(errMsg || "Failed to send OTP.");
    }

    return { success: true, message: `OTP sent successfully to +91 ${clean10}.` };
  } catch (err: any) {
    throw new Error(err?.message || "Failed to send OTP.");
  }
}

export async function verifyShopkeeperOtp(
  phone: string,
  token: string
): Promise<{ success: boolean; user?: any; session?: any; error?: string }> {
  const supabase = createClient();
  const clean10 = phone.replace(/\D/g, "").slice(-10);
  const formattedPhone = normalizePhoneE164(clean10);
  const cleanToken = token.trim();

  if (!cleanToken || cleanToken.length < 6) {
    return {
      success: false,
      error: "Please enter the complete 6-digit OTP.",
    };
  }

  try {
    const res = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: cleanToken,
      type: "sms",
    });

    if (res.error || !res.data?.user) {
      const errMsg = res.error?.message || "";
      const errCode = (res.error as any)?.code || (res.error as any)?.error_code;
      if (
        errMsg.toLowerCase().includes("token has expired") ||
        errCode === "otp_expired" ||
        res.error?.status === 403
      ) {
        return {
          success: false,
          error: "Verification code has expired or is invalid. Please request a fresh OTP.",
        };
      }
      return {
        success: false,
        error: errMsg || "Invalid or expired OTP. Please try again.",
      };
    }

    return {
      success: true,
      user: res.data.user,
      session: res.data.session,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to verify OTP.",
    };
  }
}

export async function registerShopkeeper(input: RegisterShopInput): Promise<ShopkeeperAccount> {
  const supabase = createClient();
  const clean10 = input.phone.replace(/\D/g, "").slice(-10);
  const formattedPhone = normalizePhoneE164(clean10);

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
  const clean10 = phone.replace(/\D/g, "").slice(-10);
  const formattedPhone = normalizePhoneE164(clean10);

  try {
    const { data: shop, error } = await supabase
      .from("shops")
      .select("*")
      .or(`phone.eq.${formattedPhone},phone.eq.${clean10}`)
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
