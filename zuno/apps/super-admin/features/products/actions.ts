"use server";

import { createServerSupabaseClient } from "../../lib/supabase-server";
import { verifyAdminAuthorization } from "../../lib/authGuard";

export interface MasterProductRecord {
  id: string;
  name: string;
  description?: string;
  unit: string;
  categoryName: string;
  stockingShopsCount: number;
}

export interface ProductsActionResponse {
  success: boolean;
  data?: MasterProductRecord[];
  error?: string;
}

/**
 * Server Action: Fetches master product catalog and cross-shop inventory stats.
 */
export async function getMasterProductsAction(): Promise<ProductsActionResponse> {
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
      .from("products")
      .select(`
        id,
        name,
        description,
        unit,
        categories:category_id (
          name
        ),
        shop_products (
          id
        )
      `)
      .order("name", { ascending: true });

    if (error) {
      return {
        success: false,
        error: `Database query failed: ${error.message}`,
        data: [],
      };
    }

    const products: MasterProductRecord[] = (data || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      unit: p.unit,
      categoryName: p.categories?.name || "General",
      stockingShopsCount: Array.isArray(p.shop_products) ? p.shop_products.length : 0,
    }));

    return {
      success: true,
      data: products,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to fetch master products.",
      data: [],
    };
  }
}
