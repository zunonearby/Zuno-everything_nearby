"use server";

import { createServerSupabaseClient } from "../../lib/supabase-server";
import { verifyAdminAuthorization } from "../../lib/authGuard";

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  accentColor?: string;
  isActive: boolean;
}

export interface CategoriesActionResponse {
  success: boolean;
  data?: CategoryRecord[];
  error?: string;
}

/**
 * Server Action: Fetches real categories from public.categories.
 */
export async function getPlatformCategoriesAction(): Promise<CategoriesActionResponse> {
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
      .from("categories")
      .select("id, name, slug, accent_color, is_active")
      .order("name", { ascending: true });

    if (error) {
      return {
        success: false,
        error: `Database query failed: ${error.message}`,
        data: [],
      };
    }

    const categories: CategoryRecord[] = (data || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      accentColor: c.accent_color,
      isActive: Boolean(c.is_active),
    }));

    return {
      success: true,
      data: categories,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to fetch categories.",
      data: [],
    };
  }
}
