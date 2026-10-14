import { supabase } from "../../lib/supabase";
import { PRODUCT_IMAGE_MAP } from "../../assets/productImages";

export interface ProductVariant {
  id: string;
  label: string;
  price: number;
  mrp?: number;
}

export interface ProductNutrition {
  label: string;
  value: string;
}

export interface ProductShopInfo {
  id: string;
  name: string;
  isOpen: boolean;
  distance: string;
}

export interface CategoryProduct {
  id: string;
  name: string;
  unit: string;
  price: number;
  mrp?: number;
  discountPercentage?: number;
  categoryId: string;
  categorySlug: string;
  subcategoryId?: string;
  offerBadge?: string;
  inStock: boolean;
  image_url?: string | null;
  imageSource?: any;
  images?: any[];
  emoji?: string;
  color?: string;
  shopId?: string;
  shopName?: string;
  shop?: ProductShopInfo;
  description?: string;
  origin?: string;
  storage?: string;
  bestBefore?: string;
  highlights?: string[];
  variants?: ProductVariant[];
  nutrition?: ProductNutrition[];
  healthBenefits?: string[];
}

export type ProductData = CategoryProduct;

export const CATEGORY_PRODUCTS_CATALOG: CategoryProduct[] = [
  // Vegetables
  {
    id: "veg-1",
    name: "Tomato",
    unit: "1 kg",
    price: 22,
    mrp: 25,
    discountPercentage: 10,
    offerBadge: "10% OFF",
    categoryId: "1",
    categorySlug: "vegetables",
    subcategoryId: "fruit-veggies",
    inStock: true,
    imageSource: PRODUCT_IMAGE_MAP["veg-1"],
    emoji: "🍅",
    color: "#FCE9E5",
    description: "Fresh and juicy red tomatoes, sourced locally from trusted farms. Rich in lycopene, Vitamin C, and essential minerals.",
    origin: "Local farms",
    storage: "Keep in a cool, dry place",
    bestBefore: "5–7 days",
    highlights: [
      "Fresh from local farms",
      "Rich in vitamins and antioxidants",
      "Ideal for cooking, salads and everyday use",
    ],
    variants: [
      { id: "v1", label: "500 g", price: 12, mrp: 14 },
      { id: "v2", label: "1 kg", price: 22, mrp: 25 },
      { id: "v3", label: "2 kg", price: 42, mrp: 48 },
    ],
    nutrition: [
      { label: "Energy", value: "18 kcal" },
      { label: "Carbohydrates", value: "3.9 g" },
      { label: "Protein", value: "0.9 g" },
      { label: "Fat", value: "0.2 g" },
      { label: "Vitamin C", value: "13.7 mg" },
    ],
    healthBenefits: [
      "Rich in antioxidants",
      "Good source of vitamin C",
      "Supports heart health",
      "Great for immunity",
    ],
    shop: {
      id: "shop-1",
      name: "Eureka Fresh Mart",
      isOpen: true,
      distance: "2.5 km away",
    },
  },
  {
    id: "veg-2",
    name: "Onion",
    unit: "1 kg",
    price: 28,
    mrp: 32,
    discountPercentage: 12,
    offerBadge: "12% OFF",
    categoryId: "1",
    categorySlug: "vegetables",
    subcategoryId: "roots",
    inStock: true,
    imageSource: PRODUCT_IMAGE_MAP["veg-2"],
    emoji: "🧅",
    color: "#F6EAE1",
    description: "High quality dry onions, essential for Indian cooking.",
    origin: "Local farms",
    storage: "Store in a dry ventilated place",
    bestBefore: "10–14 days",
    highlights: [
      "Crisp and flavorful onions",
      "Essential base for curries and gravies",
    ],
    variants: [
      { id: "o1", label: "500 g", price: 15, mrp: 18 },
      { id: "o2", label: "1 kg", price: 28, mrp: 32 },
    ],
    nutrition: [
      { label: "Energy", value: "40 kcal" },
      { label: "Carbohydrates", value: "9.3 g" },
      { label: "Protein", value: "1.1 g" },
    ],
    healthBenefits: [
      "Contains anti-inflammatory compounds",
      "Supports digestive health",
    ],
    shop: {
      id: "shop-2",
      name: "Kumar Kirana Store",
      isOpen: true,
      distance: "1.8 km away",
    },
  },
  {
    id: "veg-3",
    name: "Potato",
    unit: "1 kg",
    price: 24,
    mrp: 28,
    categoryId: "1",
    categorySlug: "vegetables",
    subcategoryId: "roots",
    inStock: true,
    imageSource: PRODUCT_IMAGE_MAP["veg-3"],
    emoji: "🥔",
    color: "#FAF2E4",
    description: "Fresh farm potatoes, clean and firm.",
    origin: "Local farms",
    storage: "Cool dark place",
    bestBefore: "7–10 days",
    variants: [
      { id: "p1", label: "1 kg", price: 24, mrp: 28 },
      { id: "p2", label: "2 kg", price: 46, mrp: 54 },
    ],
    shop: {
      id: "shop-1",
      name: "Eureka Fresh Mart",
      isOpen: true,
      distance: "2.5 km away",
    },
  },
  {
    id: "veg-4",
    name: "Green Chilli",
    unit: "100 g",
    price: 16,
    mrp: 20,
    discountPercentage: 20,
    offerBadge: "20% OFF",
    categoryId: "1",
    categorySlug: "vegetables",
    subcategoryId: "fruit-veggies",
    inStock: true,
    imageSource: PRODUCT_IMAGE_MAP["veg-4"],
    emoji: "🌶️",
    color: "#E6F2E2",
    description: "Spicy and fresh green chillies.",
    origin: "Local farms",
    storage: "Refrigerate",
    bestBefore: "5 days",
    shop: {
      id: "shop-1",
      name: "Eureka Fresh Mart",
      isOpen: true,
      distance: "2.5 km away",
    },
  },
  {
    id: "veg-5",
    name: "Fresh Spinach (Palak)",
    unit: "1 bunch",
    price: 20,
    mrp: 25,
    categoryId: "1",
    categorySlug: "vegetables",
    subcategoryId: "leafy",
    inStock: true,
    imageSource: PRODUCT_IMAGE_MAP["veg-5"],
    emoji: "🥬",
    color: "#E2F4E0",
    description: "Nutritious green leafy spinach.",
    origin: "Local farms",
    storage: "Refrigerate",
    bestBefore: "2–3 days",
    shop: {
      id: "shop-1",
      name: "Eureka Fresh Mart",
      isOpen: true,
      distance: "2.5 km away",
    },
  },
  {
    id: "veg-6",
    name: "Cauliflower (Gobi)",
    unit: "1 pc",
    price: 35,
    mrp: 40,
    categoryId: "1",
    categorySlug: "vegetables",
    subcategoryId: "exotics",
    inStock: true,
    imageSource: PRODUCT_IMAGE_MAP["veg-6"],
    emoji: "🥦",
    color: "#EAF4E5",
    description: "Crisp white cauliflower heads.",
    origin: "Local farms",
    storage: "Refrigerate",
    bestBefore: "4–5 days",
    shop: {
      id: "shop-1",
      name: "Eureka Fresh Mart",
      isOpen: true,
      distance: "2.5 km away",
    },
  },

  // Fruits
  {
    id: "fruit-1",
    name: "Banana Robusta",
    unit: "6 pcs",
    price: 40,
    mrp: 50,
    discountPercentage: 20,
    offerBadge: "20% OFF",
    categoryId: "2",
    categorySlug: "fruits",
    subcategoryId: "fresh",
    inStock: true,
    imageSource: PRODUCT_IMAGE_MAP["fruit-1"],
    emoji: "🍌",
    color: "#FFF4D8",
    description: "Naturally ripened sweet bananas.",
    origin: "South Farms",
    storage: "Room temperature",
    bestBefore: "3–4 days",
    shop: {
      id: "shop-2",
      name: "Kumar Kirana Store",
      isOpen: true,
      distance: "1.8 km away",
    },
  },
  {
    id: "fruit-2",
    name: "Shimla Apples",
    unit: "500 g",
    price: 90,
    mrp: 110,
    categoryId: "2",
    categorySlug: "fruits",
    subcategoryId: "fresh",
    inStock: true,
    imageSource: PRODUCT_IMAGE_MAP["fruit-2"],
    emoji: "🍎",
    color: "#FBE8E8",
    description: "Crisp and juicy sweet red apples.",
    origin: "Shimla",
    storage: "Refrigerate",
    bestBefore: "7–10 days",
    shop: {
      id: "shop-2",
      name: "Kumar Kirana Store",
      isOpen: true,
      distance: "1.8 km away",
    },
  },

  // Grocery
  {
    id: "groc-1",
    name: "Basmati Rice Super",
    unit: "1 kg",
    price: 110,
    mrp: 130,
    categoryId: "3",
    categorySlug: "grocery",
    subcategoryId: "rice",
    inStock: true,
    imageSource: PRODUCT_IMAGE_MAP["groc-1"],
    emoji: "🍚",
    color: "#F5F5F5",
    description: "Long grain aromatic basmati rice.",
    origin: "Punjab",
    storage: "Cool dry place",
    bestBefore: "12 months",
    shop: {
      id: "shop-2",
      name: "Kumar Kirana Store",
      isOpen: true,
      distance: "1.8 km away",
    },
  },
  {
    id: "groc-2",
    name: "Toor Dal (Arhar)",
    unit: "1 kg",
    price: 145,
    mrp: 160,
    categoryId: "3",
    categorySlug: "grocery",
    subcategoryId: "dal",
    inStock: true,
    imageSource: PRODUCT_IMAGE_MAP["groc-2"],
    emoji: "🥣",
    color: "#FAF2E4",
    description: "Unpolished nutritious yellow toor dal.",
    origin: "Madhya Pradesh",
    storage: "Cool dry place",
    bestBefore: "6 months",
    shop: {
      id: "shop-2",
      name: "Kumar Kirana Store",
      isOpen: true,
      distance: "1.8 km away",
    },
  },

  // Dairy
  {
    id: "dairy-1",
    name: "Fresh Toned Milk",
    unit: "500 ml",
    price: 27,
    mrp: 27,
    categoryId: "4",
    categorySlug: "dairy",
    subcategoryId: "milk",
    inStock: true,
    imageSource: PRODUCT_IMAGE_MAP["dairy-1"],
    emoji: "🥛",
    color: "#EFF6FF",
    description: "Pasteurized toned fresh milk.",
    origin: "Local Dairy",
    storage: "Keep refrigerated below 4°C",
    bestBefore: "2 days",
    shop: {
      id: "shop-1",
      name: "Eureka Fresh Mart",
      isOpen: true,
      distance: "2.5 km away",
    },
  },
  {
    id: "dairy-2",
    name: "Fresh Paneer",
    unit: "200 g",
    price: 90,
    mrp: 100,
    categoryId: "4",
    categorySlug: "dairy",
    subcategoryId: "paneer",
    inStock: true,
    imageSource: PRODUCT_IMAGE_MAP["dairy-2"],
    emoji: "🧀",
    color: "#FFFBEB",
    description: "Soft and fresh cottage cheese.",
    origin: "Local Dairy",
    storage: "Keep refrigerated",
    bestBefore: "3–4 days",
    shop: {
      id: "shop-1",
      name: "Eureka Fresh Mart",
      isOpen: true,
      distance: "2.5 km away",
    },
  },

  // Snacks
  {
    id: "snack-1",
    name: "Crispy Potato Chips",
    unit: "50 g",
    price: 20,
    mrp: 20,
    categoryId: "6",
    categorySlug: "snacks",
    subcategoryId: "chips",
    inStock: true,
    imageSource: PRODUCT_IMAGE_MAP["snack-1"],
    emoji: "🍿",
    color: "#FEF3C7",
    description: "Crunchy salted potato chips.",
    origin: "India",
    storage: "Cool dry place",
    bestBefore: "4 months",
    shop: {
      id: "shop-2",
      name: "Kumar Kirana Store",
      isOpen: true,
      distance: "1.8 km away",
    },
  },
];

export interface FetchProductsFilterParams {
  categorySlugOrId: string;
  subcategoryId?: string;
  searchQuery?: string;
  sortBy?: "popularity" | "low_high" | "high_low" | "name_az";
  maxPrice?: number;
  inStockOnly?: boolean;
}

export async function fetchProductsByCategory(
  params: FetchProductsFilterParams
): Promise<CategoryProduct[]> {
  try {
    const { categorySlugOrId, subcategoryId, searchQuery, sortBy, maxPrice, inStockOnly } = params;

    let dbProducts: CategoryProduct[] = [];

    // Try fetching from Supabase products join shop_products table
    const { data: dbData, error } = await supabase
      .from("products")
      .select("id, category_id, name, unit, description, image_url, categories!inner(slug, name)");

    if (!error && dbData && dbData.length > 0) {
      dbProducts = dbData.map((p: any, idx: number) => ({
        id: p.id,
        name: p.name,
        unit: p.unit || "1 pack",
        price: 20 + (idx + 1) * 8,
        mrp: 25 + (idx + 1) * 10,
        categoryId: p.category_id,
        categorySlug: p.categories?.slug || "general",
        inStock: true,
        image_url: p.image_url,
        emoji: "📦",
        color: "#EAF4E5",
        description: p.description || "",
      }));
    }

    let result = dbProducts.length > 0 ? dbProducts : CATEGORY_PRODUCTS_CATALOG;

    // Filter by Category
    const normCategory = categorySlugOrId.toLowerCase();
    result = result.filter(
      (p) =>
        p.categorySlug.toLowerCase() === normCategory ||
        p.categoryId === categorySlugOrId ||
        normCategory === "all"
    );

    // Filter by Subcategory
    if (subcategoryId && subcategoryId !== "all") {
      const normSub = subcategoryId.toLowerCase();
      result = result.filter(
        (p) => p.subcategoryId && p.subcategoryId.toLowerCase().includes(normSub)
      );
    }

    // Filter by Search Query
    if (searchQuery && searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    // Filter by Price
    if (maxPrice !== undefined && maxPrice > 0) {
      result = result.filter((p) => p.price <= maxPrice);
    }

    // Filter by Stock
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // Apply Sorting
    if (sortBy === "low_high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "high_low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name_az") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  } catch {
    return CATEGORY_PRODUCTS_CATALOG;
  }
}

export async function getProductDetails(productId: string): Promise<CategoryProduct | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("id, category_id, name, unit, description, image_url, categories(slug, name)")
      .eq("id", productId)
      .single();

    if (!error && data) {
      return {
        id: data.id,
        name: data.name,
        unit: data.unit || "1 pack",
        price: 22,
        mrp: 25,
        categoryId: data.category_id,
        categorySlug: (data.categories as any)?.slug || "general",
        inStock: true,
        image_url: data.image_url,
        emoji: "📦",
        color: "#EAF4E5",
        description: data.description || "Fresh high-quality product.",
        origin: "Local farms",
        storage: "Keep in a cool, dry place",
        bestBefore: "5–7 days",
      };
    }
  } catch {
    // ignore
  }

  const catalogItem = CATEGORY_PRODUCTS_CATALOG.find((p) => p.id === productId);
  if (catalogItem) return catalogItem;

  // Fallback to first product
  return CATEGORY_PRODUCTS_CATALOG[0];
}

export async function getSimilarProducts(
  currentProductId: string,
  categorySlugOrId?: string
): Promise<CategoryProduct[]> {
  const current = CATEGORY_PRODUCTS_CATALOG.find((p) => p.id === currentProductId);
  const targetCat = categorySlugOrId || current?.categorySlug || "vegetables";

  const matches = CATEGORY_PRODUCTS_CATALOG.filter(
    (p) =>
      p.id !== currentProductId &&
      (p.categorySlug === targetCat || p.categoryId === targetCat)
  );

  if (matches.length > 0) return matches;

  // Fallback similar items
  return CATEGORY_PRODUCTS_CATALOG.filter((p) => p.id !== currentProductId).slice(0, 4);
}

export async function getPopularProducts(): Promise<CategoryProduct[]> {
  return CATEGORY_PRODUCTS_CATALOG.slice(0, 4);
}
