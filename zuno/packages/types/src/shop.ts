export type ShopApprovalStatus = "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "SUSPENDED";

export interface Shop {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  phone?: string;
  address_line?: string;
  locality?: string;
  pincode?: string;
  is_approved: boolean;
  approval_status?: ShopApprovalStatus;
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
