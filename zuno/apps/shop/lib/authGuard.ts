import { createServerSupabaseClient } from "./supabase-server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { isDevMockAuthEnabled, DEV_MOCK_AUTH_COOKIE } from "@zuno/config";

export interface ShopkeeperAuthResult {
  userId: string;
  shopId: string;
  isApproved: boolean;
  approvalStatus: string;
  shopName: string;
  isDevMock?: boolean;
}

/**
 * Server-side authorization guard for Shopkeeper Dashboard.
 *
 * Enforces:
 * 1. Caller MUST possess an active, valid Supabase Auth session, OR
 *    (in local development only with ENABLE_DEV_MOCK_AUTH=true) a validated dev mock session.
 *    If unauthenticated, redirects to /login?redirect=%2Fdashboard.
 * 2. Authenticated user MUST be the owner of a shop in public.shops.
 *    If no shop is found for user ID, redirects to /register.
 * 3. Shop MUST have both is_approved = true and approval_status = 'APPROVED'.
 *    If pending, rejected, or suspended, redirects to /status.
 * 4. Never trusts client query params or unauthenticated cookies as identity.
 */
export async function requireApprovedShopkeeper(): Promise<ShopkeeperAuthResult> {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  // 1. Real Supabase Session Flow
  if (!sessionError && session?.user) {
    const userId = session.user.id;

    // Verify shop ownership server-side for the authenticated user
    const { data: shop, error: shopError } = await supabase
      .from("shops")
      .select("id, name, is_approved, approval_status, owner_id")
      .eq("owner_id", userId)
      .maybeSingle();

    if (shopError || !shop) {
      redirect("/register");
    }

    // Strict approval check
    const isApproved = Boolean(shop.is_approved) && shop.approval_status === "APPROVED";
    if (!isApproved) {
      redirect("/status");
    }

    return {
      userId,
      shopId: shop.id,
      isApproved: true,
      approvalStatus: "APPROVED",
      shopName: shop.name,
      isDevMock: false,
    };
  }

  // 2. Local-Development-Only Mock Auth Flow
  // Requirement 2 & 9: Strict production rejection; requires explicit environment flag
  if (process.env.NODE_ENV !== "production" && isDevMockAuthEnabled()) {
    const cookieStore = cookies();
    const rawCookie = cookieStore.get(DEV_MOCK_AUTH_COOKIE)?.value;

    if (rawCookie) {
      try {
        const decoded = rawCookie.startsWith("%") ? decodeURIComponent(rawCookie) : rawCookie;
        const parsed = JSON.parse(decoded);
        if (parsed?.userId && parsed?.shopId) {
          // Query actual database to verify shop ownership and approval
          const { data: shop, error: shopError } = await supabase
            .from("shops")
            .select("id, name, is_approved, approval_status, owner_id")
            .eq("id", parsed.shopId)
            .maybeSingle();

          if (shopError || !shop || shop.owner_id !== parsed.userId) {
            redirect("/register");
          }

          // Requirement 7: Do not bypass approval status
          const isApproved = Boolean(shop.is_approved) && shop.approval_status === "APPROVED";
          if (!isApproved) {
            redirect(`/status?phone=${parsed.phone || ""}`);
          }

          return {
            userId: parsed.userId,
            shopId: shop.id,
            isApproved: true,
            approvalStatus: "APPROVED",
            shopName: shop.name,
            isDevMock: true,
          };
        }
      } catch {}
    }
  }

  redirect("/login?redirect=%2Fdashboard");
}
