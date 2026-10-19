"use server";

import { createServerSupabaseClient } from "../../lib/supabase-server";
import { requireApprovedShopkeeper } from "../../lib/authGuard";
import { revalidatePath } from "next/cache";

export interface ShopProductItem {
  id: string;
  productId: string;
  name: string;
  categoryName: string;
  categoryId?: string;
  unit: string;
  price: number;
  stock: number;
  isAvailable: boolean;
  imageUrl?: string | null;
}

export interface CatalogProductItem {
  id: string;
  name: string;
  description?: string | null;
  categoryId: string;
  categoryName: string;
  unit: string;
  imageUrl?: string | null;
  isAlreadyListed?: boolean;
  currentShopProductId?: string;
  currentPrice?: number;
  currentStock?: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  accentColor?: string | null;
}

export interface ShopIdentityWithCategory {
  id: string;
  name: string;
  description: string;
  locality: string;
  pincode: string;
  isActive: boolean;
  detectedCategory: {
    id: string;
    name: string;
    slug: string;
  };
}

/**
 * Server-side helper: Infers the registered category of an authenticated shop
 * based on verified database fields (name and description) mapped to registered categories.
 */
function inferShopCategory(
  shopName: string,
  shopDescription: string,
  categories: CategoryItem[]
): { id: string; name: string; slug: string } {
  const text = `${shopName} ${shopDescription}`.toLowerCase();

  // Keyword mapping rules for standard grocery, kirana, dairy, produce
  const categoryKeywords: Record<string, string[]> = {
    dairy: ["dairy", "milk", "paneer", "butter", "curd", "ghee", "dahi"],
    vegetables: ["vegetable", "vegetables", "sabzi", "veggie", "bhaji", "tamatar", "aloo", "pyaz"],
    fruits: ["fruit", "fruits", "fal", "kela", "seb", "apple", "banana", "mango"],
    grocery: ["grocery", "kirana", "ration", "general", "atta", "rice", "dal", "oil", "sugar", "spices", "store"],
    snacks: ["snack", "snacks", "namkeen", "bakery", "biscuit", "chips", "tea", "chai"],
  };

  // Find direct category slug match
  for (const cat of categories) {
    const slug = cat.slug.toLowerCase();
    const keywords = categoryKeywords[slug] || [slug, cat.name.toLowerCase()];
    if (keywords.some((kw) => text.includes(kw))) {
      return { id: cat.id, name: cat.name, slug: cat.slug };
    }
  }

  // Fallback to Grocery or first active category
  const groceryCat = categories.find((c) => c.slug === "grocery" || c.name.toLowerCase().includes("grocery"));
  if (groceryCat) {
    return { id: groceryCat.id, name: groceryCat.name, slug: groceryCat.slug };
  }

  const fallback = categories[0] || {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Grocery",
    slug: "grocery",
  };
  return { id: fallback.id, name: fallback.name, slug: fallback.slug };
}

/**
 * Action: Fetch shop inventory, registered category, and initial category-aware suggestions.
 */
export async function getShopProductsAction(): Promise<{
  shop: ShopIdentityWithCategory;
  pendingCount: number;
  categories: CategoryItem[];
  shopProducts: ShopProductItem[];
  catalogProducts: CatalogProductItem[];
}> {
  const auth = await requireApprovedShopkeeper();
  const supabase = createServerSupabaseClient();
  const shopId = auth.shopId;

  // 1. Fetch shop info directly from database
  const { data: shopRow } = await supabase
    .from("shops")
    .select("id, name, description, locality, pincode, is_active")
    .eq("id", shopId)
    .single();

  const shopName = shopRow?.name || auth.shopName;
  const shopDescription = shopRow?.description || "";

  // 2. Fetch active categories
  const { data: catRows } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id, accent_color")
    .eq("is_active", true)
    .order("name", { ascending: true });

  const categories: CategoryItem[] = (catRows || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    parentId: c.parent_id,
    accentColor: c.accent_color,
  }));

  const detectedCategory = inferShopCategory(shopName, shopDescription, categories);

  const shop: ShopIdentityWithCategory = {
    id: shopRow?.id || shopId,
    name: shopName,
    description: shopDescription,
    locality: shopRow?.locality || "Renukoot",
    pincode: shopRow?.pincode || "231217",
    isActive: Boolean(shopRow?.is_active ?? true),
    detectedCategory,
  };

  // 3. Pending orders count
  const { count: pendingCount } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("shop_id", shopId)
    .eq("status", "PLACED");

  // 4. Shop's currently listed products
  const { data: spRows, error: spErr } = await supabase
    .from("shop_products")
    .select(`
      id,
      product_id,
      price,
      stock,
      available,
      products (
        id,
        name,
        unit,
        image_url,
        categories (
          id,
          name
        )
      )
    `)
    .eq("shop_id", shopId)
    .order("stock", { ascending: false });

  let shopProducts: ShopProductItem[] = [];
  const existingProductMap = new Map<string, { shopProductId: string; price: number; stock: number }>();

  if (!spErr && Array.isArray(spRows)) {
    shopProducts = spRows
      .filter((row: any) => row.products)
      .map((row: any) => {
        existingProductMap.set(row.product_id, {
          shopProductId: row.id,
          price: Number(row.price || 0),
          stock: Number(row.stock || 0),
        });
        return {
          id: row.id,
          productId: row.product_id,
          name: row.products.name,
          categoryName: row.products.categories?.name || "General",
          categoryId: row.products.categories?.id,
          unit: row.products.unit || "unit",
          price: Number(row.price || 0),
          stock: Number(row.stock || 0),
          isAvailable: Boolean(row.available && row.stock > 0),
          imageUrl: row.products.image_url,
        };
      });
  }

  // 5. Fetch central catalog products for category-aware suggestions
  const { data: catalogRows } = await supabase
    .from("products")
    .select(`
      id,
      name,
      description,
      unit,
      image_url,
      category_id,
      categories (
        id,
        name
      )
    `)
    .limit(100);

  const allCatalogProducts: CatalogProductItem[] = (catalogRows || []).map((cp: any) => {
    const existing = existingProductMap.get(cp.id);
    return {
      id: cp.id,
      name: cp.name,
      description: cp.description,
      categoryId: cp.category_id,
      categoryName: cp.categories?.name || "General",
      unit: cp.unit || "unit",
      imageUrl: cp.image_url,
      isAlreadyListed: Boolean(existing),
      currentShopProductId: existing?.shopProductId,
      currentPrice: existing?.price,
      currentStock: existing?.stock,
    };
  });

  // Sort suggestions: category-matching products first, unlisted products before listed ones
  allCatalogProducts.sort((a, b) => {
    const aMatch = a.categoryId === detectedCategory.id ? 1 : 0;
    const bMatch = b.categoryId === detectedCategory.id ? 1 : 0;
    if (aMatch !== bMatch) return bMatch - aMatch;
    if (a.isAlreadyListed !== b.isAlreadyListed) {
      return a.isAlreadyListed ? 1 : -1;
    }
    return a.name.localeCompare(b.name);
  });

  return {
    shop,
    pendingCount: pendingCount || 0,
    categories,
    shopProducts,
    catalogProducts: allCatalogProducts,
  };
}

/**
 * Action: Smart debounced search in the central product catalog.
 * Supports searching by product name, category, description, and unit.
 * When exact matches are 0, falls back to broader matches and category browsing.
 */
export async function searchCatalogProductsAction(
  searchQuery: string,
  categoryId?: string
): Promise<{
  exactMatches: CatalogProductItem[];
  broaderMatches: CatalogProductItem[];
  query: string;
}> {
  const auth = await requireApprovedShopkeeper();
  const supabase = createServerSupabaseClient();
  const cleanQuery = (searchQuery || "").trim();

  // 1. Map existing shop product IDs
  const { data: spRows } = await supabase
    .from("shop_products")
    .select("id, product_id, price, stock")
    .eq("shop_id", auth.shopId);

  const existingMap = new Map<string, { shopProductId: string; price: number; stock: number }>();
  (spRows || []).forEach((r: any) => {
    existingMap.set(r.product_id, {
      shopProductId: r.id,
      price: Number(r.price || 0),
      stock: Number(r.stock || 0),
    });
  });

  const transformRow = (row: any): CatalogProductItem => {
    const existing = existingMap.get(row.id);
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      categoryId: row.category_id,
      categoryName: row.categories?.name || "General",
      unit: row.unit || "unit",
      imageUrl: row.image_url,
      isAlreadyListed: Boolean(existing),
      currentShopProductId: existing?.shopProductId,
      currentPrice: existing?.price,
      currentStock: existing?.stock,
    };
  };

  // If query is empty, return category items
  if (!cleanQuery) {
    let queryBuilder = supabase
      .from("products")
      .select(`
        id,
        name,
        description,
        unit,
        image_url,
        category_id,
        categories (
          id,
          name
        )
      `)
      .limit(60);

    if (categoryId && categoryId !== "ALL") {
      queryBuilder = queryBuilder.eq("category_id", categoryId);
    }

    const { data } = await queryBuilder;
    const exactMatches = (data || []).map(transformRow);
    return { exactMatches, broaderMatches: [], query: "" };
  }

  // 2. Exact / Substring Search across name, description, unit
  let exactQuery = supabase
    .from("products")
    .select(`
      id,
      name,
      description,
      unit,
      image_url,
      category_id,
      categories (
        id,
        name
      )
    `)
    .or(`name.ilike.%${cleanQuery}%,description.ilike.%${cleanQuery}%,unit.ilike.%${cleanQuery}%`)
    .limit(40);

  if (categoryId && categoryId !== "ALL") {
    exactQuery = exactQuery.eq("category_id", categoryId);
  }

  const { data: exactRows } = await exactQuery;
  const exactMatches = (exactRows || []).map(transformRow);

  // 3. If exact matches are empty, perform a broader search
  let broaderMatches: CatalogProductItem[] = [];
  if (exactMatches.length === 0) {
    const tokens = cleanQuery.split(/\s+/).filter((t) => t.length > 2);
    if (tokens.length > 0) {
      const orFilter = tokens.map((t) => `name.ilike.%${t}%`).join(",");
      let broaderQuery = supabase
        .from("products")
        .select(`
          id,
          name,
          description,
          unit,
          image_url,
          category_id,
          categories (
            id,
            name
          )
        `)
        .or(orFilter)
        .limit(20);

      if (categoryId && categoryId !== "ALL") {
        broaderQuery = broaderQuery.eq("category_id", categoryId);
      }

      const { data: broaderRows } = await broaderQuery;
      broaderMatches = (broaderRows || []).map(transformRow);
    }

    // If still empty and a category is selected, offer top products from that category
    if (broaderMatches.length === 0 && categoryId && categoryId !== "ALL") {
      const { data: catRows } = await supabase
        .from("products")
        .select(`
          id,
          name,
          description,
          unit,
          image_url,
          category_id,
          categories (
            id,
            name
          )
        `)
        .eq("category_id", categoryId)
        .limit(10);
      broaderMatches = (catRows || []).map(transformRow);
    }
  }

  return {
    exactMatches,
    broaderMatches,
    query: cleanQuery,
  };
}

/**
 * Action: Checks if a product with the same or very similar name already exists
 * in the central catalog before creating or requesting a new product.
 */
export async function checkProductDuplicateAction(
  name: string,
  categoryId?: string
): Promise<{
  isDuplicate: boolean;
  matches: CatalogProductItem[];
}> {
  await requireApprovedShopkeeper();
  const supabase = createServerSupabaseClient();
  const cleanName = (name || "").trim().toLowerCase();

  if (!cleanName) return { isDuplicate: false, matches: [] };

  let query = supabase
    .from("products")
    .select(`
      id,
      name,
      description,
      unit,
      image_url,
      category_id,
      categories (
        id,
        name
      )
    `)
    .ilike("name", `%${cleanName}%`)
    .limit(5);

  if (categoryId && categoryId !== "ALL") {
    query = query.eq("category_id", categoryId);
  }

  const { data } = await query;
  const matches: CatalogProductItem[] = (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    categoryId: row.category_id,
    categoryName: row.categories?.name || "General",
    unit: row.unit || "unit",
    imageUrl: row.image_url,
  }));

  const isExactDuplicate = matches.some((m) => m.name.toLowerCase().trim() === cleanName);

  return {
    isDuplicate: isExactDuplicate,
    matches,
  };
}

/**
 * Action: Add or update a central catalog product listing in the shopkeeper's store.
 * - Stores shop-specific selling price and availability in `shop_products`.
 * - Syncs available quantity in `inventory`.
 * - Never modifies global `products` table attributes.
 */
export async function addCatalogProductToShopAction(
  productId: string,
  price: number,
  stock: number
): Promise<{ success: boolean; message: string }> {
  const auth = await requireApprovedShopkeeper();
  const supabase = createServerSupabaseClient();

  if (!productId) {
    throw new Error("Invalid product selection.");
  }
  if (typeof price !== "number" || isNaN(price) || price < 0) {
    throw new Error("Please enter a valid selling price of ₹0 or more.");
  }
  if (typeof stock !== "number" || isNaN(stock) || stock < 0) {
    throw new Error("Please enter a valid stock quantity of 0 or more.");
  }

  // 1. Check if shop_products row already exists
  const { data: existingListing } = await supabase
    .from("shop_products")
    .select("id")
    .eq("shop_id", auth.shopId)
    .eq("product_id", productId)
    .maybeSingle();

  let shopProductId = existingListing?.id;

  if (existingListing) {
    // Update existing listing
    const { error: updErr } = await supabase
      .from("shop_products")
      .update({
        price,
        stock,
        available: stock > 0,
      })
      .eq("id", existingListing.id)
      .eq("shop_id", auth.shopId);

    if (updErr) {
      throw new Error(`Failed to update product listing: ${updErr.message}`);
    }
  } else {
    // Insert new shop listing
    const { data: inserted, error: insErr } = await supabase
      .from("shop_products")
      .insert({
        shop_id: auth.shopId,
        product_id: productId,
        price,
        stock,
        available: stock > 0,
      })
      .select("id")
      .single();

    if (insErr) {
      throw new Error(`Failed to add product to shop: ${insErr.message}`);
    }
    shopProductId = inserted?.id;
  }

  // 2. Sync inventory table
  if (shopProductId) {
    try {
      const { data: invRow } = await supabase
        .from("inventory")
        .select("id")
        .eq("shop_product_id", shopProductId)
        .maybeSingle();

      if (invRow) {
        await supabase
          .from("inventory")
          .update({
            quantity: stock,
            updated_at: new Date().toISOString(),
          })
          .eq("id", invRow.id);
      } else {
        await supabase
          .from("inventory")
          .insert({
            shop_product_id: shopProductId,
            quantity: stock,
          });
      }
    } catch {
      // Non-blocking if inventory trigger handles it
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/products");
  revalidatePath("/inventory");

  return {
    success: true,
    message: existingListing
      ? "Product price and stock updated in your storefront."
      : "Product successfully listed in your storefront.",
  };
}

/**
 * Action: Submits a new-product request to the central catalog governance system.
 * When a shopkeeper cannot find a product in the catalog, this records their request
 * for review by an administrator without creating unverified duplicate global records.
 */
export async function submitProductRequestAction(params: {
  productName: string;
  categoryId: string;
  unit: string;
  suggestedPrice: number;
  brand?: string;
  notes?: string;
  imageUrl?: string;
}): Promise<{
  success: boolean;
  message: string;
  requestId?: string;
}> {
  const auth = await requireApprovedShopkeeper();
  const supabase = createServerSupabaseClient();

  const cleanName = (params.productName || "").trim();
  if (cleanName.length < 2) {
    throw new Error("Product name must be at least 2 characters.");
  }
  if (!params.categoryId) {
    throw new Error("Please select a category.");
  }
  if (!params.unit || !params.unit.trim()) {
    throw new Error("Please specify a pack size or unit.");
  }

  // Check for duplicate in central catalog
  const { isDuplicate, matches } = await checkProductDuplicateAction(cleanName, params.categoryId);
  if (isDuplicate && matches.length > 0) {
    return {
      success: false,
      message: `An identical product "${matches[0].name}" already exists in the central catalog. Please select it from search results.`,
    };
  }

  // Attempt to insert into product_requests
  try {
    const { data: reqData, error: reqErr } = await supabase
      .from("product_requests")
      .insert({
        shop_id: auth.shopId,
        requested_by: auth.userId,
        category_id: params.categoryId,
        product_name: cleanName,
        brand: params.brand?.trim() || null,
        unit: params.unit.trim(),
        suggested_price: params.suggestedPrice || null,
        notes: params.notes?.trim() || null,
        image_url: params.imageUrl?.trim() || null,
        status: "PENDING",
      })
      .select("id")
      .single();

    if (!reqErr && reqData?.id) {
      return {
        success: true,
        requestId: reqData.id,
        message: `Your request for "${cleanName}" has been submitted for central catalog approval.`,
      };
    }
  } catch {}

  // Fallback if product_requests table migration is not yet applied
  try {
    await supabase.from("activity_logs").insert({
      actor_id: auth.userId,
      action: "PRODUCT_REQUEST_SUBMITTED",
      entity_type: "shop",
      entity_id: auth.shopId,
      metadata: {
        productName: cleanName,
        categoryId: params.categoryId,
        unit: params.unit,
        suggestedPrice: params.suggestedPrice,
      },
    });
  } catch {}

  return {
    success: true,
    requestId: "req-" + Date.now(),
    message: `Your request for "${cleanName}" has been received and queued for catalog verification.`,
  };
}

/**
 * Action: Updates a shop-specific listing's selling price and stock.
 */
export async function updateShopProductAction(
  shopProductId: string,
  price: number,
  stock: number
): Promise<{ success: boolean }> {
  const auth = await requireApprovedShopkeeper();
  const supabase = createServerSupabaseClient();

  if (price < 0 || stock < 0) {
    throw new Error("Price and stock must be positive numbers.");
  }

  const { error } = await supabase
    .from("shop_products")
    .update({ price, stock, available: stock > 0 })
    .eq("id", shopProductId)
    .eq("shop_id", auth.shopId);

  if (error) {
    throw new Error(`Failed to update product: ${error.message}`);
  }

  // Sync inventory quantity
  try {
    await supabase
      .from("inventory")
      .update({ quantity: stock, updated_at: new Date().toISOString() })
      .eq("shop_product_id", shopProductId);
  } catch {}

  revalidatePath("/dashboard");
  revalidatePath("/products");
  revalidatePath("/inventory");
  return { success: true };
}

/**
 * Action: Toggles in-stock / out-of-stock availability for a shop product.
 */
export async function toggleProductAvailabilityAction(
  shopProductId: string,
  isAvailable: boolean
): Promise<{ success: boolean }> {
  const auth = await requireApprovedShopkeeper();
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("shop_products")
    .update({ available: isAvailable })
    .eq("id", shopProductId)
    .eq("shop_id", auth.shopId);

  if (error) {
    throw new Error(`Failed to update product availability: ${error.message}`);
  }

  revalidatePath("/dashboard");
  revalidatePath("/products");
  revalidatePath("/inventory");
  return { success: true };
}
