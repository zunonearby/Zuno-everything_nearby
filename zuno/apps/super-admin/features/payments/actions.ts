"use server";

import { createServerSupabaseClient } from "../../lib/supabase-server";
import { verifyAdminAuthorization } from "../../lib/authGuard";

export interface PaymentRecord {
  id: string;
  orderId: string;
  displayOrderId: string;
  method: string;
  status: string;
  amount: number;
  providerReference?: string;
  createdAt: string;
}

export interface PaymentsSummary {
  totalCollected: number;
  totalPending: number;
  payments: PaymentRecord[];
}

export interface PaymentsActionResponse {
  success: boolean;
  data?: PaymentsSummary;
  error?: string;
}

/**
 * Server Action: Fetches real payment records from public.payments.
 */
export async function getPaymentsAction(): Promise<PaymentsActionResponse> {
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
      .from("payments")
      .select("id, order_id, method, status, amount, provider_reference, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return {
        success: false,
        error: `Database query failed: ${error.message}`,
      };
    }

    let totalCollected = 0;
    let totalPending = 0;

    const payments: PaymentRecord[] = (data || []).map((p: any) => {
      const amt = Number(p.amount || 0);
      if (p.status === "PAID") {
        totalCollected += amt;
      } else if (p.status === "PENDING") {
        totalPending += amt;
      }

      return {
        id: p.id,
        orderId: p.order_id,
        displayOrderId: `#ZN-${String(p.order_id).slice(0, 6).toUpperCase()}`,
        method: p.method || "COD",
        status: p.status || "PENDING",
        amount: amt,
        providerReference: p.provider_reference || "N/A",
        createdAt: p.created_at,
      };
    });

    return {
      success: true,
      data: {
        totalCollected,
        totalPending,
        payments,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to fetch payment records.",
    };
  }
}
