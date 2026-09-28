/**
 * Category-driven product catalog. ZUNO is not grocery-only, so categories
 * and products stay generic — never hardcode a category as a type.
 */
export interface Category {
  id: string;
  name: string; // e.g. "Grocery", "Vegetables", "Fast Food", "Pharmacy"
  slug: string;
  parent_id: string | null;
  accent_color: string | null; // secondary, category-specific accent only
  is_active: boolean;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  unit: string; // e.g. "kg", "piece", "packet"
  image_url: string | null;
}

/**
 * The relationship between a shop and a product. Price/stock live here,
 * never on the canonical Product — the same tomato can be ₹30 at Shop A
 * and ₹35 at Shop B.
 */
export interface ShopProduct {
  id: string;
  shop_id: string;
  product_id: string;
  price: number;
  stock: number;
  available: boolean;
}

export interface InventoryItem {
  id: string;
  shop_product_id: string;
  quantity: number;
  updated_at: string;
}
