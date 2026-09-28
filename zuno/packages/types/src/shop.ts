export interface Shop {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  is_approved: boolean;
  is_active: boolean;
  lat: number;
  lng: number;
  service_area_id: string | null;
  created_at: string;
}

export interface ShopMember {
  id: string;
  shop_id: string;
  user_id: string;
  role: "OWNER" | "STAFF";
}
