import { supabase } from "../../lib/supabase";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
  accent_color?: string | null;
  description?: string;
  image?: any;
  subcategories?: SubcategoryItem[];
}

export interface SubcategoryItem {
  id: string;
  name: string;
  slug: string;
}

export const LAUNCH_CATEGORIES: CategoryItem[] = [
  {
    id: "1",
    name: "Vegetables",
    slug: "vegetables",
    accent_color: "#0F5D3A",
    description: "Farm fresh, locally available",
    image: require("../../assets/vegetable_head.png"),
    subcategories: [
      { id: "all", name: "All", slug: "all" },
      { id: "leafy", name: "Leafy", slug: "leafy" },
      { id: "roots", name: "Roots", slug: "roots" },
      { id: "fruit-veggies", name: "Fruit Veggies", slug: "fruit-veggies" },
      { id: "exotics", name: "Exotics", slug: "exotics" },
    ],
  },
  {
    id: "2",
    name: "Fruits",
    slug: "fruits",
    accent_color: "#E67E22",
    description: "Juicy, organic & seasonal fruits",
    image: require("../../assets/Fruit_head.png"),
    subcategories: [
      { id: "all", name: "All", slug: "all" },
      { id: "fresh", name: "Fresh", slug: "fresh" },
      { id: "citrus", name: "Citrus", slug: "citrus" },
      { id: "berries", name: "Berries", slug: "berries" },
      { id: "imported", name: "Imported", slug: "imported" },
    ],
  },
  {
    id: "3",
    name: "Grocery",
    slug: "grocery",
    accent_color: "#2980B9",
    description: "Daily staples, rice, pulses & oils",
    image: require("../../assets/grocery_head.png"),
    subcategories: [
      { id: "all", name: "All", slug: "all" },
      { id: "rice", name: "Rice & Grains", slug: "rice" },
      { id: "dal", name: "Dals & Pulses", slug: "dal" },
      { id: "oil", name: "Edible Oils", slug: "oil" },
      { id: "spices", name: "Spices", slug: "spices" },
    ],
  },
  {
    id: "4",
    name: "Dairy",
    slug: "dairy",
    accent_color: "#8E44AD",
    description: "Fresh milk, paneer, curd & butter",
    image: require("../../assets/dairy_head.png"),
    subcategories: [
      { id: "all", name: "All", slug: "all" },
      { id: "milk", name: "Milk", slug: "milk" },
      { id: "curd", name: "Curd & Yogurt", slug: "curd" },
      { id: "paneer", name: "Paneer & Cheese", slug: "paneer" },
      { id: "butter", name: "Butter & Ghee", slug: "butter" },
    ],
  },
  {
    id: "6",
    name: "Snacks",
    slug: "snacks",
    accent_color: "#D35400",
    description: "Chips, namkeen, biscuits & beverages",
    image: require("../../assets/snacks_head.jpg"),
    subcategories: [
      { id: "all", name: "All", slug: "all" },
      { id: "chips", name: "Chips & Crisps", slug: "chips" },
      { id: "namkeen", name: "Namkeen", slug: "namkeen" },
      { id: "biscuits", name: "Biscuits", slug: "biscuits" },
      { id: "drinks", name: "Cold Drinks", slug: "drinks" },
    ],
  },
];

export async function fetchCategories(): Promise<CategoryItem[]> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, parent_id, accent_color")
      .eq("is_active", true);

    if (error || !data || data.length === 0) {
      return LAUNCH_CATEGORIES;
    }

    const parents = data.filter((c) => !c.parent_id);
    return parents.map((p) => {
      const fallback = LAUNCH_CATEGORIES.find(
        (l) => l.slug === p.slug || l.name.toLowerCase() === p.name.toLowerCase()
      );
      const childs = data.filter((c) => c.parent_id === p.id);
      const subcats: SubcategoryItem[] = [
        { id: "all", name: "All", slug: "all" },
        ...childs.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
      ];

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        accent_color: p.accent_color || fallback?.accent_color || "#0F5D3A",
        description: fallback?.description || "Fresh & quality items",
        image: fallback?.image,
        subcategories: subcats.length > 1 ? subcats : fallback?.subcategories || [{ id: "all", name: "All", slug: "all" }],
      };
    });
  } catch {
    return LAUNCH_CATEGORIES;
  }
}

export async function getCategoryByIdOrSlug(idOrSlug: string): Promise<CategoryItem | null> {
  const categoriesList = await fetchCategories();
  const normalized = idOrSlug.toLowerCase();
  const found = categoriesList.find(
    (c) => c.id === idOrSlug || c.slug === normalized || c.name.toLowerCase() === normalized
  );
  if (found) return found;

  // Fallback to first category if requested category unknown
  return LAUNCH_CATEGORIES[0];
}
