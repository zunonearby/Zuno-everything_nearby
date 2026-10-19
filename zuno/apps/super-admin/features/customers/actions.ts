"use server";

import { createServerSupabaseClient } from "../../lib/supabase-server";
import { verifyAdminAuthorization } from "../../lib/authGuard";

export interface CustomerRecord {
  id: string;
  fullName: string;
  phone: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface CustomersActionResponse {
  success: boolean;
  data?: CustomerRecord[];
  error?: string;
}

/**
 * Server Action: Fetches real registered customer profiles from public.profiles.
 */
export async function getCustomersAction(): Promise<CustomersActionResponse> {
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
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, phone, avatar_url, created_at")
      .eq("role", "CUSTOMER")
      .order("created_at", { ascending: false });

    if (error) {
      return {
        success: false,
        error: `Database query failed: ${error.message}`,
        data: [],
      };
    }

    const customers: CustomerRecord[] = (data || []).map((p: any) => ({
      id: p.id,
      fullName: p.full_name || "ZUNO Customer",
      phone: p.phone || "Not Verified",
      avatarUrl: p.avatar_url,
      createdAt: p.created_at,
    }));

    return {
      success: true,
      data: customers,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to fetch customer profiles.",
      data: [],
    };
  }
}
