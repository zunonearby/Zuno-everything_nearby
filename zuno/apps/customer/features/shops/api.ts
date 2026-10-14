import { supabase } from "../../lib/supabase";

export interface ShopData {
  id: string;
  name: string;
  type: string;
  rating: string;
  distance: string;
  image?: any;
  color?: string;
  emoji?: string;
}

export const FALLBACK_SHOPS: ShopData[] = [
  {
    id: "1",
    name: "Fresh Vegetable Store",
    type: "Fruits & Vegetables",
    rating: "4.8",
    distance: "0.5 km",
    image: require("../../assets/vegetables.jpg"),
    color: "#E7F2DE",
  },
  {
    id: "2",
    name: "Daily Needs Grocery",
    type: "Grocery & Essentials",
    rating: "4.6",
    distance: "0.8 km",
    image: require("../../assets/grocery.jpg"),
    color: "#F9EFD9",
  },
  {
    id: "3",
    name: "Sharma General Store",
    type: "Grocery & Dairy",
    rating: "4.5",
    distance: "1.2 km",
    image: require("../../assets/dairy.png"),
    color: "#E6EFFB",
  },
];

export async function getNearbyShops(): Promise<ShopData[]> {
  try {
    const { data, error } = await supabase
      .from("shops")
      .select("id, name, description, is_active")
      .eq("is_active", true);

    if (error || !data || data.length === 0) {
      return FALLBACK_SHOPS;
    }

    return data.map((s, idx) => ({
      id: s.id,
      name: s.name,
      type: s.description || "General Store",
      rating: "4.5",
      distance: `${(0.5 + idx * 0.3).toFixed(1)} km`,
      color: "#EAF4E5",
    }));
  } catch {
    return FALLBACK_SHOPS;
  }
}
