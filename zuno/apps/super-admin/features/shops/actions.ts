"use server";

import { createServerSupabaseClient } from "../../lib/supabase-server";
import { verifyAdminAuthorization } from "../../lib/authGuard";
import { revalidatePath } from "next/cache";

export interface ShopApplicationRecord {
  id: string;
  ownerId: string;
  ownerName: string;
  shopName: string;
  description: string;
  phone: string;
  addressLine: string;
  locality: string;
  pincode: string;
  isApproved: boolean;
  approvalStatus: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "SUSPENDED";
  createdAt: string;
}

export interface ActionResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

/**
 * Server Action: Fetches registered shops with owner profile information.
 * Enforces server-side ADMIN or SUPER_ADMIN authorization.
 */
export async function getShopApplicationsAction(
  filter: "ALL" | "PENDING" | "APPROVED" | "REJECTED" = "ALL"
): Promise<ActionResponse<ShopApplicationRecord[]>> {
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
      .from("shops")
      .select(`
        id,
        owner_id,
        name,
        description,
        phone,
        address_line,
        locality,
        pincode,
        is_approved,
        approval_status,
        created_at,
        profiles:owner_id (
          full_name,
          phone
        )
      `)
      .order("created_at", { ascending: false });

    if (filter === "PENDING") {
      query = query.eq("approval_status", "PENDING").eq("is_approved", false);
    } else if (filter === "APPROVED") {
      query = query.eq("approval_status", "APPROVED").eq("is_approved", true);
    } else if (filter === "REJECTED") {
      query = query.eq("approval_status", "REJECTED");
    }

    let rawRows: any[] = [];
    const { data, error } = await query;

    if (!error && data) {
      rawRows = data;
    } else {
      // Fallback query without relation embedding
      let fallbackQuery = supabase
        .from("shops")
        .select("id, owner_id, name, description, phone, address_line, locality, pincode, is_approved, approval_status, created_at")
        .order("created_at", { ascending: false });

      if (filter === "PENDING") {
        fallbackQuery = fallbackQuery.eq("approval_status", "PENDING").eq("is_approved", false);
      } else if (filter === "APPROVED") {
        fallbackQuery = fallbackQuery.eq("approval_status", "APPROVED").eq("is_approved", true);
      } else if (filter === "REJECTED") {
        fallbackQuery = fallbackQuery.eq("approval_status", "REJECTED");
      }

      const fallbackRes = await fallbackQuery;
      if (!fallbackRes.error && fallbackRes.data) {
        rawRows = fallbackRes.data;
      } else {
        return {
          success: false,
          error: `Database error: ${error?.message || fallbackRes.error?.message}`,
          data: [],
        };
      }
    }

    const applications: ShopApplicationRecord[] = rawRows.map((s: any) => {
      const ownerProfile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
      return {
        id: s.id,
        ownerId: s.owner_id,
        ownerName: ownerProfile?.full_name || "Registered Shopkeeper",
        shopName: s.name,
        description: s.description || "",
        phone: s.phone || ownerProfile?.phone || "Not Provided",
        addressLine: s.address_line || "Main Market",
        locality: s.locality || "Renukoot",
        pincode: s.pincode || "231217",
        isApproved: Boolean(s.is_approved),
        approvalStatus: s.approval_status || (s.is_approved ? "APPROVED" : "PENDING"),
        createdAt: s.created_at,
      };
    });

    return {
      success: true,
      data: applications,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to load shop applications.",
      data: [],
    };
  }
}

/**
 * Server Action: Approves, rejects, or suspends a shop application.
 * Enforces:
 * 1. Caller must have ADMIN or SUPER_ADMIN role.
 * 2. Shop owner can NEVER self-approve their own shop.
 * 3. Database RLS and triggers enforce the final boundary.
 * 4. Audit trail logged to activity_logs.
 */
export async function updateShopApprovalAction(
  shopId: string,
  newStatus: "APPROVED" | "REJECTED" | "SUSPENDED"
): Promise<ActionResponse> {
  const auth = await verifyAdminAuthorization();
  if (!auth.authorized || !auth.user) {
    return {
      success: false,
      error: auth.error || "Unauthorized: Only platform administrators can change shop approval status.",
    };
  }

  const supabase = createServerSupabaseClient();

  try {
    // 1. Fetch current shop to verify existence and prevent self-approval
    const { data: currentShop, error: fetchError } = await supabase
      .from("shops")
      .select("id, owner_id, name, approval_status, is_approved")
      .eq("id", shopId)
      .maybeSingle();

    if (fetchError || !currentShop) {
      return {
        success: false,
        error: "Target shop record not found.",
      };
    }

    // Invariant: Never let a shop owner approve their own shop
    if (currentShop.owner_id === auth.user.userId) {
      return {
        success: false,
        error: "Security Violation: Administrators who own a shop cannot approve or alter their own shop status.",
      };
    }

    // 2. Perform the update via atomic SECURITY DEFINER RPC
    const isApproved = newStatus === "APPROVED";
    const { data: rpcRes, error: rpcErr } = await supabase.rpc("approve_or_reject_shop", {
      p_shop_id: shopId,
      p_status: newStatus,
    });

    if (rpcErr || (rpcRes && !rpcRes.success)) {
      // Fallback: If RPC is missing, attempt direct update and verify representation
      const { data: updatedRows, error: updateError } = await supabase
        .from("shops")
        .update({
          is_approved: isApproved,
          approval_status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", shopId)
        .select();

      if (updateError || !updatedRows || updatedRows.length === 0) {
        return {
          success: false,
          error:
            rpcErr?.message ||
            updateError?.message ||
            "Database rejected update: Please execute the approve_or_reject_shop SQL function in Supabase SQL editor.",
        };
      }
    }

    // 3. Log audit event
    try {
      await supabase.from("activity_logs").insert({
        actor_id: auth.user.userId,
        action: "SHOP_APPROVAL_MODIFICATION",
        entity_type: "shops",
        entity_id: shopId,
        metadata: {
          admin_id: auth.user.userId,
          admin_role: auth.user.role,
          shop_name: currentShop.name,
          previous_status: currentShop.approval_status,
          new_status: newStatus,
          is_approved: isApproved,
        },
      });
    } catch {
      // Non-critical audit logging
    }

    revalidatePath("/shops");
    revalidatePath("/dashboard");

    return {
      success: true,
      message:
        rpcRes?.message ||
        `Shop "${currentShop.name}" has been successfully ${newStatus.toLowerCase()}.`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "An unexpected error occurred during shop approval update.",
    };
  }
}
