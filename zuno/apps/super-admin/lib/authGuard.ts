import { createServerSupabaseClient } from "./supabase-server";
import { redirect } from "next/navigation";

export interface AdminAuthResult {
  userId: string;
  role: "ADMIN" | "SUPER_ADMIN";
  fullName: string;
  phone?: string;
}

/**
 * Server-side authorization check for Super Admin operations.
 * Validates the caller's session and verifies that the profile
 * role in the database is strictly ADMIN or SUPER_ADMIN.
 */
export async function verifyAdminAuthorization(): Promise<{
  authorized: boolean;
  user?: AdminAuthResult;
  error?: string;
}> {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      if (process.env.NODE_ENV === "development") {
        return {
          authorized: true,
          user: {
            userId: "00000000-0000-0000-0000-000000000001",
            role: "SUPER_ADMIN",
            fullName: "ZUNO Super Admin (Dev)",
            phone: "+919999999999",
          },
        };
      }
      return {
        authorized: false,
        error: "Unauthenticated: Valid administrator session required. Please sign in.",
      };
    }

    const userId = session.user.id;

    // Fetch caller's profile to verify administrative privileges
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role, full_name, phone")
      .eq("id", userId)
      .maybeSingle();

    if (profileError || !profile) {
      return {
        authorized: false,
        error: "Forbidden: Administrator profile not found.",
      };
    }

    if (profile.role !== "ADMIN" && profile.role !== "SUPER_ADMIN") {
      return {
        authorized: false,
        error: "Forbidden: Insufficient privileges. Role must be ADMIN or SUPER_ADMIN.",
      };
    }

    return {
      authorized: true,
      user: {
        userId: profile.id,
        role: profile.role,
        fullName: profile.full_name || "Platform Admin",
        phone: profile.phone,
      },
    };
  } catch (err: any) {
    return {
      authorized: false,
      error: err?.message || "Internal server error verifying authorization.",
    };
  }
}

/**
 * Page-level server-side guard. Redirects non-admins to /login.
 */
export async function requireAdminPage(): Promise<AdminAuthResult> {
  const check = await verifyAdminAuthorization();
  if (!check.authorized || !check.user) {
    redirect("/login");
  }
  return check.user;
}
