"use server";

import { createServerSupabaseClient } from "../../lib/supabase-server";
import { verifyAdminAuthorization } from "../../lib/authGuard";
import { revalidatePath } from "next/cache";

export interface DeliveryPartnerRecord {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  approvalStatus: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "SUSPENDED";
  isAvailable: boolean;
  createdAt: string;
}

export interface DeliveryActionResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

/**
 * Server Action: Fetches real delivery partners from public.delivery_partners.
 * Respects RLS and requires verified ADMIN or SUPER_ADMIN authorization.
 * NEVER falls back to demo datasets.
 */
export async function getDeliveryPartnersAction(): Promise<DeliveryActionResponse<DeliveryPartnerRecord[]>> {
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
      .from("delivery_partners")
      .select("id, user_id, full_name, phone, vehicle_type, vehicle_number, approval_status, is_available, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return {
        success: false,
        error: `Database query failed: ${error.message}`,
        data: [],
      };
    }

    const records: DeliveryPartnerRecord[] = (data || []).map((d: any) => ({
      id: d.id,
      userId: d.user_id,
      fullName: d.full_name || "Delivery Partner",
      phone: d.phone,
      vehicleType: d.vehicle_type || "Two Wheeler",
      vehicleNumber: d.vehicle_number || "Not Registered",
      approvalStatus: d.approval_status || "PENDING",
      isAvailable: Boolean(d.is_available),
      createdAt: d.created_at,
    }));

    return {
      success: true,
      data: records,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to fetch delivery partners.",
      data: [],
    };
  }
}

/**
 * Server Action: Updates approval status for a delivery partner.
 * Requires verified ADMIN or SUPER_ADMIN privileges.
 */
export async function updateDeliveryPartnerStatusAction(
  partnerId: string,
  newStatus: "APPROVED" | "REJECTED" | "SUSPENDED"
): Promise<DeliveryActionResponse> {
  const auth = await verifyAdminAuthorization();
  if (!auth.authorized || !auth.user) {
    return {
      success: false,
      error: auth.error || "Unauthorized: Administrator privileges required.",
    };
  }

  const supabase = createServerSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("delivery_partners")
      .update({
        approval_status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", partnerId)
      .select();

    if (error) {
      return {
        success: false,
        error: `Failed to update delivery partner status: ${error.message}`,
      };
    }

    // Audit log
    try {
      await supabase.from("activity_logs").insert({
        actor_id: auth.user.userId,
        action: "DELIVERY_PARTNER_APPROVAL_MODIFICATION",
        entity_type: "delivery_partners",
        entity_id: partnerId,
        metadata: {
          admin_id: auth.user.userId,
          new_status: newStatus,
        },
      });
    } catch {}

    revalidatePath("/deliveries");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Delivery partner application status updated to ${newStatus}.`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "An unexpected error occurred updating partner status.",
    };
  }
}
