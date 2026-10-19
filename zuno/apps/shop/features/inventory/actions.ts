"use server";

import { createServerSupabaseClient } from "../../lib/supabase-server";
import { requireApprovedShopkeeper } from "../../lib/authGuard";
import { revalidatePath } from "next/cache";

export interface InventoryItem {
  id: string;
  name: string;
  categoryName: string;
  unit: string;
  price: number;
  stock: number;
  isAvailable: boolean;
  status: "OUT_OF_STOCK" | "LOW_STOCK" | "HEALTHY";
}

export async function getShopInventoryAction(): Promise<{
  shop: {
    id: string;
    name: string;
    locality: string;
    pincode: string;
    isActive: boolean;
  };
  pendingCount: number;
  items: InventoryItem[];
  lowStockCount: number;
  outOfStockCount: number;
}> {
  const auth = await requireApprovedShopkeeper();
  const supabase = createServerSupabaseClient();
  const shopId = auth.shopId;

  // 1. Fetch shop info
  const { data: shopRow } = await supabase
    .from("shops")
    .select("id, name, locality, pincode, is_active")
    .eq("id", shopId)
    .single();

  const shop = {
    id: shopRow?.id || shopId,
    name: shopRow?.name || auth.shopName,
    locality: shopRow?.locality || "Renukoot",
    pincode: shopRow?.pincode || "231217",
    isActive: Boolean(shopRow?.is_active ?? true),
  };

  // 2. Pending orders count
  const { count: pendingCount } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("shop_id", shopId)
    .eq("status", "PLACED");

  // 3. Inventory items from shop_products
  const { data: spRows, error: spErr } = await supabase
    .from("shop_products")
    .select(`
      id,
      price,
      stock,
      available,
      products (
        id,
        name,
        unit,
        categories (
          name
        )
      )
    `)
    .eq("shop_id", shopId)
    .order("stock", { ascending: true });

  let items: InventoryItem[] = [];
  let lowStockCount = 0;
  let outOfStockCount = 0;

  if (!spErr && Array.isArray(spRows)) {
    items = spRows
      .filter((row: any) => row.products)
      .map((row: any) => {
        const stock = Number(row.stock || 0);
        let status: "OUT_OF_STOCK" | "LOW_STOCK" | "HEALTHY" = "HEALTHY";
        if (stock === 0) {
          status = "OUT_OF_STOCK";
          outOfStockCount++;
        } else if (stock < 10) {
          status = "LOW_STOCK";
          lowStockCount++;
        }

        return {
          id: row.id,
          name: row.products.name,
          categoryName: row.products.categories?.name || "General",
          unit: row.products.unit || "unit",
          price: Number(row.price || 0),
          stock,
          isAvailable: Boolean(row.available && stock > 0),
          status,
        };
      });
  }

  return {
    shop,
    pendingCount: pendingCount || 0,
    items,
    lowStockCount,
    outOfStockCount,
  };
}

export async function updateProductStockAction(
  shopProductId: string,
  newStock: number
): Promise<{ success: boolean; newStock: number }> {
  const auth = await requireApprovedShopkeeper();
  const supabase = createServerSupabaseClient();

  const stock = Math.max(0, Math.floor(newStock));

  const { error } = await supabase
    .from("shop_products")
    .update({ stock, available: stock > 0 })
    .eq("id", shopProductId)
    .eq("shop_id", auth.shopId);

  if (error) {
    throw new Error(`Failed to update stock: ${error.message}`);
  }

  revalidatePath("/dashboard");
  revalidatePath("/inventory");
  revalidatePath("/products");
  return { success: true, newStock: stock };
}
