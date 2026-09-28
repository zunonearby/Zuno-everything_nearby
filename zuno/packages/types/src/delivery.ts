export const DeliveryStatus = {
  UNASSIGNED: "UNASSIGNED",
  ASSIGNED: "ASSIGNED",
  PICKED_UP: "PICKED_UP",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export type DeliveryStatus = (typeof DeliveryStatus)[keyof typeof DeliveryStatus];

export interface DeliveryPartner {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  is_available: boolean;
  created_at: string;
}

export interface Delivery {
  id: string;
  order_id: string;
  delivery_partner_id: string | null;
  status: DeliveryStatus;
  pickup_lat: number | null;
  pickup_lng: number | null;
  dropoff_lat: number | null;
  dropoff_lng: number | null;
  picked_up_at: string | null;
  delivered_at: string | null;
  created_at: string;
}
